const ChartView = ({ data, tabId }) => {
  const [dataAnalysis, setDataAnalysis] = useState(null);
  const [chartConfig, setChartConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detect scenario based on column names
  const detectScenario = (columnNames) => {
    const lowerColumns = columnNames.map(col => col.toLowerCase());
    
    if (lowerColumns.some(col => col.includes('created') && col.includes('by'))) {
      return 'unmapped_test_cases';
    }
    
    if (lowerColumns.some(col => col.includes('user') && col.includes('story')) &&
        (lowerColumns.some(col => col.includes('total') && col.includes('test')) ||
         lowerColumns.some(col => col.includes('astra')))) {
      return 'user_story_mapping';
    }
    
    if (lowerColumns.some(col => col.includes('priority')) &&
        lowerColumns.some(col => col.includes('status'))) {
      return 'unmapped_user_stories';
    }
    
    return 'unknown';
  };

  // Analyze data and recommend chart
  const analyzeData = (tableData) => {
    if (!tableData?.length) return null;
    
    const columnNames = Object.keys(tableData[0]);
    const scenario = detectScenario(columnNames);
    
    // Analyze columns
    const columns = columnNames.map(name => {
      const values = tableData.map(row => row[name]).filter(val => val != null && val !== '');
      const numericValues = values.filter(val => !isNaN(Number(val))).map(Number);
      const isNumeric = numericValues.length / values.length > 0.7;
      
      return {
        name,
        type: isNumeric ? 'numeric' : 'categorical',
        uniqueCount: [...new Set(values)].length,
        statistics: isNumeric ? { sum: numericValues.reduce((a, b) => a + b, 0) } : {}
      };
    });

    // Generate chart recommendation
    let chartRecommendation = null;
    
    switch (scenario) {
      case 'unmapped_test_cases':
        const createdByCol = columns.find(col => 
          col.name.toLowerCase().includes('created') && col.name.toLowerCase().includes('by')
        );
        if (createdByCol) {
          chartRecommendation = {
            type: 'grouped_bar',
            columns: { 
              groupBy: createdByCol.name,
              title: 'Test Cases Created by Team Member'
            }
          };
        }
        break;
        
      case 'user_story_mapping':
        const totalCol = columns.find(col => 
          col.name.toLowerCase().includes('total') && col.name.toLowerCase().includes('test')
        );
        const astraCol = columns.find(col => col.name.toLowerCase().includes('astra'));
        const keyCol = columns.find(col => 
          col.name.toLowerCase().includes('user') && col.name.toLowerCase().includes('story')
        );
        
        if (totalCol && astraCol && keyCol) {
          chartRecommendation = {
            type: 'line_comparison',
            columns: { 
              userStoryKey: keyCol.name,
              total: totalCol.name,
              astra: astraCol.name,
              title: 'Test Case Coverage Trend'
            }
          };
        }
        break;
        
      case 'unmapped_user_stories':
        const priorityCol = columns.find(col => col.name.toLowerCase().includes('priority'));
        const statusCol = columns.find(col => col.name.toLowerCase().includes('status'));
        
        if (priorityCol && statusCol) {
          chartRecommendation = {
            type: 'dual_pie',
            columns: { 
              priority: priorityCol.name,
              status: statusCol.name,
              title: 'User Stories Analysis'
            }
          };
        }
        break;
    }

    // Fallback to first categorical column
    if (!chartRecommendation) {
      const categoricalCol = columns.find(col => 
        col.type === 'categorical' && col.uniqueCount > 1 && col.uniqueCount <= 20
      );
      if (categoricalCol) {
        chartRecommendation = {
          type: 'grouped_bar',
          columns: { 
            groupBy: categoricalCol.name,
            title: `Distribution by ${categoricalCol.name}`
          }
        };
      }
    }

    return {
      totalRecords: tableData.length,
      scenario,
      columns,
      chartRecommendation
    };
  };

  // Generate chart configuration
  const generateChartConfig = (analysis, recommendation) => {
    if (!analysis || !recommendation) return null;
    
    const baseConfig = {
      backgroundColor: 'transparent',
      animation: { duration: 1200, easing: 'cubicOut' },
      textStyle: { fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#374151' },
      grid: { top: 100, bottom: 80, left: 80, right: 80, containLabel: true },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: [12, 16]
      }
    };

    const colors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

    switch (recommendation.type) {
      case 'grouped_bar': {
        const groupByCol = recommendation.columns.groupBy;
        const groupedData = {};
        
        data.forEach(row => {
          const key = row[groupByCol] || 'Unknown';
          groupedData[key] = (groupedData[key] || 0) + 1;
        });
        
        const sortedGroups = Object.entries(groupedData)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 15);
        
        return {
          ...baseConfig,
          title: {
            text: recommendation.columns.title,
            left: 'center',
            top: 20,
            textStyle: { fontSize: 20, fontWeight: 700, color: '#111827' }
          },
          xAxis: {
            type: 'category',
            data: sortedGroups.map(([key]) => key),
            axisLabel: { rotate: 45, fontSize: 11 }
          },
          yAxis: { type: 'value', name: 'Count' },
          series: [{
            type: 'bar',
            data: sortedGroups.map(([,count]) => count),
            itemStyle: { color: colors[0], borderRadius: [6, 6, 0, 0] },
            label: { show: true, position: 'top' }
          }]
        };
      }

      case 'line_comparison': {
        const { userStoryKey, total, astra } = recommendation.columns;
        
        const validData = data.filter(row => 
          !isNaN(Number(row[total])) && !isNaN(Number(row[astra]))
        ).sort((a, b) => Number(b[total]) - Number(a[total])).slice(0, 20);
        
        const categories = validData.map((row, i) => row[userStoryKey] || `Story ${i + 1}`);
        const totalValues = validData.map(row => Number(row[total]) || 0);
        const astraValues = validData.map(row => Number(row[astra]) || 0);
        const gapValues = totalValues.map((total, i) => Math.max(0, total - astraValues[i]));
        
        return {
          ...baseConfig,
          title: {
            text: recommendation.columns.title,
            left: 'center',
            top: 20,
            textStyle: { fontSize: 20, fontWeight: 700, color: '#111827' }
          },
          legend: {
            data: ['Total Test Cases', 'Created in ASTRA', 'Gap'],
            bottom: 20
          },
          xAxis: {
            type: 'category',
            data: categories,
            axisLabel: { rotate: 45, fontSize: 10 }
          },
          yAxis: { type: 'value', name: 'Number of Test Cases' },
          series: [
            {
              name: 'Total Test Cases',
              type: 'line',
              data: totalValues,
              lineStyle: { width: 4, color: colors[0] },
              symbol: 'circle',
              smooth: true
            },
            {
              name: 'Created in ASTRA',
              type: 'line',
              data: astraValues,
              lineStyle: { width: 4, color: colors[1] },
              symbol: 'circle',
              smooth: true
            },
            {
              name: 'Gap',
              type: 'line',
              data: gapValues,
              lineStyle: { width: 3, color: colors[2], type: 'dashed' },
              symbol: 'triangle',
              smooth: true
            }
          ],
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              const name = params[0].name;
              const total = params[0].value;
              const astra = params[1].value;
              const gap = params[2].value;
              const coverage = total > 0 ? ((astra / total) * 100).toFixed(1) : 0;
              
              return `
                <div style="font-weight: 600; margin-bottom: 8px;">${name}</div>
                <div>Total: <strong>${total}</strong></div>
                <div>ASTRA: <strong>${astra}</strong></div>
                <div>Gap: <strong>${gap}</strong></div>
                <div>Coverage: <strong>${coverage}%</strong></div>
              `;
            }
          }
        };
      }

      case 'dual_pie': {
        const { priority, status } = recommendation.columns;
        
        const priorityData = {};
        const statusData = {};
        
        data.forEach(row => {
          const p = row[priority] || 'Unknown';
          const s = row[status] || 'Unknown';
          priorityData[p] = (priorityData[p] || 0) + 1;
          statusData[s] = (statusData[s] || 0) + 1;
        });
        
        return {
          ...baseConfig,
          title: {
            text: recommendation.columns.title,
            left: 'center',
            top: 20,
            textStyle: { fontSize: 20, fontWeight: 700, color: '#111827' }
          },
          series: [
            {
              name: 'Priority',
              type: 'pie',
              radius: ['20%', '45%'],
              center: ['25%', '55%'],
              data: Object.entries(priorityData).map(([name, value]) => ({ name, value }))
            },
            {
              name: 'Status',
              type: 'pie',
              radius: ['20%', '45%'],
              center: ['75%', '55%'],
              data: Object.entries(statusData).map(([name, value]) => ({ name, value }))
            }
          ],
          color: colors
        };
      }

      default:
        return null;
    }
  };

  // Main effect
  useEffect(() => {
    if (!data?.length) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const analysis = analyzeData(data);
      const config = generateChartConfig(analysis, analysis?.chartRecommendation);
      
      setDataAnalysis(analysis);
      setChartConfig(config);
      setLoading(false);
    }, 300);
    
  }, [data, tabId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-blue-50 rounded-xl">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
          <h3 className="text-lg font-semibold text-blue-900">AI Analyzing Data</h3>
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-700">No Data Available</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[600px] bg-white rounded-xl border shadow-lg overflow-hidden">
      {/* Header */}
      {dataAnalysis && (
        <div className="p-4 bg-blue-50 border-b">
          <div className="flex gap-4 flex-wrap">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {dataAnalysis.totalRecords} Records
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              {dataAnalysis.scenario.replace(/_/g, ' ')}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {dataAnalysis.chartRecommendation?.type?.replace(/_/g, ' ') || 'Auto'}
            </span>
          </div>
        </div>
      )}
      
      {/* Chart */}
      <div className="h-full">
        {chartConfig ? (
          <ReactECharts
            option={chartConfig}
            style={{ height: 'calc(100% - 80px)', width: '100%', minHeight: '480px' }}
            opts={{ renderer: 'svg' }}
            notMerge={true}
            lazyUpdate={true}
          />
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-700">Unable to Generate Chart</h3>
              <p className="text-gray-500 text-sm">No suitable visualization found for this data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};