const ChartView = ({ data, tabId }) => {
  const [dataAnalysis, setDataAnalysis] = useState(null);
  const [chartConfig, setChartConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comprehensive data analysis function
  const analyzeTableData = (tableData) => {
    if (!tableData || tableData.length === 0) return null;
    
    const analysis = {
      totalRecords: tableData.length,
      totalColumns: 0,
      columns: [],
      dataTypes: {},
      patterns: {},
      insights: [],
      chartRecommendation: null
    };
    
    // Get all column names
    const columnNames = Object.keys(tableData[0] || {});
    analysis.totalColumns = columnNames.length;
    
    // Analyze each column in detail
    columnNames.forEach(columnName => {
      const values = tableData.map(row => row[columnName]);
      const nonNullValues = values.filter(val => val !== null && val !== undefined && val !== '' && val !== 0);
      const allValues = values.filter(val => val !== null && val !== undefined && val !== '');
      
      // Advanced type detection
      const numericValues = allValues.filter(val => !isNaN(Number(val)) && val !== '').map(Number);
      const isNumeric = numericValues.length / allValues.length > 0.7;
      const isInteger = isNumeric && numericValues.every(val => Number.isInteger(val));
      const isBoolean = allValues.every(val => 
        val === true || val === false || val === 'true' || val === 'false' || 
        val === 1 || val === 0 || val === 'yes' || val === 'no'
      );
      const isDate = allValues.some(val => !isNaN(Date.parse(val)) && typeof val === 'string' && val.includes('-'));
      const isId = columnName.toLowerCase().includes('id') || columnName.toLowerCase().includes('key');
      
      // Calculate statistics for numeric columns
      let statistics = {};
      if (isNumeric && numericValues.length > 0) {
        const sorted = [...numericValues].sort((a, b) => a - b);
        const sum = numericValues.reduce((a, b) => a + b, 0);
        const mean = sum / numericValues.length;
        
        statistics = {
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          sum: sum,
          mean: mean,
          median: sorted[Math.floor(sorted.length / 2)],
          range: Math.max(...numericValues) - Math.min(...numericValues),
          nonZeroCount: numericValues.filter(v => v !== 0).length,
          maxValue: Math.max(...numericValues),
          minValue: Math.min(...numericValues)
        };
      }
      
      // Analyze value distribution
      const uniqueValues = [...new Set(allValues)];
      const valueFrequency = {};
      allValues.forEach(val => {
        const key = String(val);
        valueFrequency[key] = (valueFrequency[key] || 0) + 1;
      });
      
      // Sort by frequency
      const sortedFrequency = Object.entries(valueFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
      
      const columnAnalysis = {
        name: columnName,
        type: isId ? 'identifier' : isNumeric ? (isInteger ? 'integer' : 'numeric') : 
              isBoolean ? 'boolean' : isDate ? 'date' : 'categorical',
        totalValues: values.length,
        nonNullValues: allValues.length,
        nullCount: values.length - allValues.length,
        uniqueCount: uniqueValues.length,
        uniquenessRatio: uniqueValues.length / allValues.length,
        completenessRatio: allValues.length / values.length,
        topValues: sortedFrequency.map(([value, count]) => ({
          value,
          count,
          percentage: ((count / allValues.length) * 100).toFixed(1)
        })),
        statistics,
        sampleValues: uniqueValues.slice(0, 5)
      };
      
      analysis.columns.push(columnAnalysis);
      analysis.dataTypes[columnAnalysis.type] = (analysis.dataTypes[columnAnalysis.type] || 0) + 1;
    });
    
    // Generate insights based on analysis
    analysis.insights = generateDataInsights(analysis);
    analysis.chartRecommendation = recommendOptimalChart(analysis);
    
    return analysis;
  };

  // Generate intelligent insights about the data
  const generateDataInsights = (analysis) => {
    const insights = [];
    
    // Data volume insights
    if (analysis.totalRecords > 10000) {
      insights.push({
        type: 'volume',
        message: `Large dataset with ${analysis.totalRecords.toLocaleString()} records`,
        icon: '📊',
        color: 'blue'
      });
    } else if (analysis.totalRecords < 10) {
      insights.push({
        type: 'volume',
        message: `Small dataset - consider collecting more data`,
        icon: '⚠️',
        color: 'yellow'
      });
    }
    
    // Data quality insights
    const columnsWithMissingData = analysis.columns.filter(col => col.completenessRatio < 0.9);
    if (columnsWithMissingData.length > 0) {
      insights.push({
        type: 'quality',
        message: `${columnsWithMissingData.length} columns have missing data`,
        icon: '🚨',
        color: 'red'
      });
    }
    
    // Unique value insights
    const highCardinalityColumns = analysis.columns.filter(col => 
      col.type === 'categorical' && col.uniquenessRatio > 0.8 && col.uniqueCount > 20
    );
    if (highCardinalityColumns.length > 0) {
      insights.push({
        type: 'cardinality',
        message: `${highCardinalityColumns.length} columns have too many unique values for effective visualization`,
        icon: '🔍',
        color: 'orange'
      });
    }
    
    // Numeric data insights
    const numericColumns = analysis.columns.filter(col => col.type === 'numeric' || col.type === 'integer');
    if (numericColumns.length >= 2) {
      insights.push({
        type: 'analysis',
        message: `${numericColumns.length} numeric columns available for correlation analysis`,
        icon: '📈',
        color: 'green'
      });
    }
    
    return insights;
  };

  // Smart chart recommendation based on data characteristics
  const recommendOptimalChart = (analysis) => {
    const { columns, totalRecords } = analysis;
    const numericCols = columns.filter(col => col.type === 'numeric' || col.type === 'integer');
    const categoricalCols = columns.filter(col => 
      col.type === 'categorical' && col.uniqueCount <= 50 && col.uniquenessRatio < 0.9
    );
    const dateCols = columns.filter(col => col.type === 'date');
    
    // Special case: Look for "CREATED BY" or similar columns for grouping
    const createdByCol = columns.find(col => 
      col.name.toLowerCase().includes('created') && col.name.toLowerCase().includes('by') ||
      col.name.toLowerCase().includes('author') ||
      col.name.toLowerCase().includes('owner') ||
      col.name.toLowerCase().includes('assignee')
    );
    
    const idCol = columns.find(col => 
      col.name.toLowerCase().includes('id') && 
      col.type === 'identifier' && 
      col.uniquenessRatio > 0.9
    );
    
    // Priority 1: If we have CREATED BY column and ID column, create grouped bar chart
    if (createdByCol && idCol) {
      return {
        type: 'grouped_bar',
        reason: `Group by ${createdByCol.name} to show distribution of ${idCol.name} per creator`,
        columns: { 
          groupBy: createdByCol.name, 
          countBy: idCol.name,
          title: `${idCol.name} Count by ${createdByCol.name}`
        },
        confidence: 0.95
      };
    }
    
    // Priority 2: Regular categorical analysis
    if (categoricalCols.length >= 1) {
      const categoryCol = categoricalCols[0];
      
      if (categoryCol.uniqueCount <= 6) {
        return {
          type: 'pie',
          reason: `Perfect for showing ${categoryCol.name} distribution with ${categoryCol.uniqueCount} categories`,
          columns: { category: categoryCol.name },
          confidence: 0.9
        };
      } else if (categoryCol.uniqueCount <= 25) {
        return {
          type: 'bar',
          reason: `Bar chart ideal for ${categoryCol.uniqueCount} categories of ${categoryCol.name}`,
          columns: { category: categoryCol.name },
          confidence: 0.85
        };
      }
    }
    
    if (numericCols.length >= 2) {
      if (dateCols.length > 0) {
        return {
          type: 'line',
          reason: `Time series analysis with ${numericCols.length} metrics`,
          columns: { x: dateCols[0].name, y: numericCols[0].name },
          confidence: 0.9
        };
      } else {
        return {
          type: 'scatter',
          reason: `Correlation analysis between ${numericCols[0].name} and ${numericCols[1].name}`,
          columns: { x: numericCols[0].name, y: numericCols[1].name },
          confidence: 0.8
        };
      }
    }
    
    if (numericCols.length === 1) {
      return {
        type: 'histogram',
        reason: `Distribution analysis of ${numericCols[0].name}`,
        columns: { value: numericCols[0].name },
        confidence: 0.7
      };
    }
    
    // Default fallback
    return {
      type: 'table',
      reason: 'Data structure best suited for tabular display',
      columns: {},
      confidence: 0.5
    };
  };

  // Generate beautiful, responsive chart configuration
  const generateChartConfiguration = (analysis, recommendation) => {
    if (!analysis || !recommendation) return null;
    
    const baseConfig = {
      backgroundColor: 'transparent',
      animation: {
        duration: 1200,
        easing: 'cubicOut',
        animationDelayUpdate: 300
      },
      textStyle: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        fontSize: 12,
        color: '#374151'
      },
      grid: {
        top: 100,
        bottom: 80,
        left: 80,
        right: 80,
        containLabel: true
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 12,
        padding: [12, 16],
        textStyle: {
          color: '#1f2937',
          fontSize: 13,
          fontWeight: 500
        },
        extraCssText: `
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(16px);
        `
      }
    };

    // Generate premium color palette
    const generateColors = (count) => {
      const colors = [
        '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', 
        '#ef4444', '#ec4899', '#84cc16', '#f97316', '#3b82f6'
      ];
      return colors.slice(0, count);
    };

    switch (recommendation.type) {
      case 'grouped_bar': {
        // Special handling for CREATED BY grouping
        const groupByCol = recommendation.columns.groupBy;
        const countByCol = recommendation.columns.countBy;
        
        // Group data by the specified column (e.g., CREATED BY)
        const groupedData = {};
        data.forEach(row => {
          const groupKey = row[groupByCol] || 'Unknown';
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = 0;
          }
          groupedData[groupKey]++;
        });
        
        // Sort by count (descending) and take top 15
        const sortedGroups = Object.entries(groupedData)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 15);
        
        const categories = sortedGroups.map(([key]) => key);
        const values = sortedGroups.map(([,count]) => count);
        
        return {
          ...baseConfig,
          title: {
            text: recommendation.columns.title || `Test Cases by Creator`,
            subtext: `${analysis.totalRecords} total test cases across ${Object.keys(groupedData).length} creators`,
            left: 'center',
            top: 20,
            textStyle: {
              fontSize: 20,
              fontWeight: 700,
              color: '#111827'
            },
            subtextStyle: {
              fontSize: 12,
              color: '#6b7280'
            }
          },
          xAxis: {
            type: 'category',
            data: categories,
            axisLabel: {
              rotate: 45,
              fontSize: 11,
              color: '#6b7280',
              interval: 0,
              formatter: (value) => {
                const str = String(value);
                return str.length > 10 ? str.substring(0, 10) + '...' : str;
              }
            },
            axisTick: {
              alignWithLabel: true,
              lineStyle: { color: '#e5e7eb' }
            },
            axisLine: {
              lineStyle: { color: '#e5e7eb' }
            }
          },
          yAxis: {
            type: 'value',
            name: 'Number of Test Cases',
            nameTextStyle: {
              fontSize: 12,
              color: '#6b7280',
              fontWeight: 500
            },
            axisLabel: {
              fontSize: 11,
              color: '#6b7280',
              formatter: (value) => {
                if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
                return value;
              }
            },
            splitLine: {
              lineStyle: {
                color: '#f3f4f6',
                type: 'dashed'
              }
            },
            axisLine: { show: false }
          },
          series: [{
            type: 'bar',
            name: 'Test Cases Created',
            data: values.map((value, index) => ({
              value,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#8b5cf6' : '#6366f1' },
                    { offset: 1, color: (index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#8b5cf6' : '#6366f1') + 'aa' }
                  ]
                },
                borderRadius: [6, 6, 0, 0],
                shadowColor: 'rgba(99, 102, 241, 0.3)',
                shadowBlur: 8,
                shadowOffsetY: 4
              }
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 15,
                shadowOffsetY: 8,
                scale: 1.02
              }
            },
            barMaxWidth: 50,
            animationDelay: (idx) => idx * 100,
            label: {
              show: true,
              position: 'top',
              fontSize: 11,
              fontWeight: 600,
              color: '#374151',
              formatter: '{c}'
            }
          }],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                color: 'rgba(99, 102, 241, 0.1)'
              }
            },
            formatter: function(params) {
              const param = params[0];
              return `
                <div style="font-weight: 600; margin-bottom: 4px;">${param.name}</div>
                <div style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 8px; height: 8px; background: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
                  <span>${param.seriesName}: <strong>${param.value}</strong> test cases</span>
                </div>
              `;
            }
          }
        };
      }

      case 'pie': {
        const categoryCol = analysis.columns.find(col => col.name === recommendation.columns.category);
        const valueCol = analysis.columns.find(col => col.name === recommendation.columns.value);
        
        // Aggregate data for pie chart
        const pieData = categoryCol.topValues.map(item => ({
          name: item.value,
          value: parseInt(item.count)
        }));
        
        return {
          ...baseConfig,
          title: {
            text: `${categoryCol.name} Distribution`,
            subtext: `${analysis.totalRecords} records analyzed`,
            left: 'center',
            top: 20,
            textStyle: {
              fontSize: 20,
              fontWeight: 700,
              color: '#111827',
              lineHeight: 28
            },
            subtextStyle: {
              fontSize: 12,
              color: '#6b7280',
              lineHeight: 20
            }
          },
          legend: {
            type: 'scroll',
            bottom: 15,
            itemGap: 20,
            itemWidth: 14,
            itemHeight: 14,
            textStyle: {
              fontSize: 11,
              color: '#4b5563'
            }
          },
          series: [{
            type: 'pie',
            radius: ['0%', '65%'],
            center: ['50%', '55%'],
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 30,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.25)',
                borderWidth: 4,
                borderColor: '#ffffff',
                scale: 1.05
              }
            },
            itemStyle: {
              borderRadius: 8,
              borderWidth: 3,
              borderColor: '#ffffff'
            },
            label: {
              show: true,
              fontSize: 11,
              fontWeight: 600,
              formatter: '{b}\n{d}%',
              color: '#374151'
            },
            labelLine: {
              smooth: true,
              length: 20,
              length2: 10
            },
            animationType: 'scale',
            animationEasing: 'elasticOut'
          }],
          color: generateColors(pieData.length)
        };
      }

      case 'bar': {
        const categoryCol = analysis.columns.find(col => col.name === recommendation.columns.category);
        const valueCol = analysis.columns.find(col => col.name === recommendation.columns.value);
        
        const categories = categoryCol.topValues.map(item => item.value);
        const values = categoryCol.topValues.map(item => parseInt(item.count));
        
        return {
          ...baseConfig,
          title: {
            text: `${categoryCol.name} Analysis`,
            subtext: `Top ${categories.length} categories from ${analysis.totalRecords} records`,
            left: 'center',
            top: 20,
            textStyle: {
              fontSize: 20,
              fontWeight: 700,
              color: '#111827'
            },
            subtextStyle: {
              fontSize: 12,
              color: '#6b7280'
            }
          },
          xAxis: {
            type: 'category',
            data: categories,
            axisLabel: {
              rotate: categories.some(cat => String(cat).length > 8) ? 45 : 0,
              fontSize: 11,
              color: '#6b7280',
              interval: 0,
              formatter: (value) => {
                const str = String(value);
                return str.length > 12 ? str.substring(0, 12) + '...' : str;
              }
            },
            axisTick: {
              alignWithLabel: true,
              lineStyle: { color: '#e5e7eb' }
            },
            axisLine: {
              lineStyle: { color: '#e5e7eb' }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              fontSize: 11,
              color: '#6b7280',
              formatter: (value) => {
                if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
                return value;
              }
            },
            splitLine: {
              lineStyle: {
                color: '#f3f4f6',
                type: 'dashed'
              }
            },
            axisLine: { show: false }
          },
          series: [{
            type: 'bar',
            data: values,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#6366f1' },
                  { offset: 1, color: '#6366f1aa' }
                ]
              },
              borderRadius: [6, 6, 0, 0],
              shadowColor: 'rgba(99, 102, 241, 0.3)',
              shadowBlur: 10,
              shadowOffsetY: 4
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowOffsetY: 8,
                scale: 1.02
              }
            },
            barMaxWidth: 60,
            animationDelay: (idx) => idx * 100
          }]
        };
      }

      case 'line': {
        // For line charts, we'll use the first numeric column as Y axis
        const numericCol = analysis.columns.find(col => col.type === 'numeric' || col.type === 'integer');
        const values = data.map((row, index) => [index, Number(row[numericCol.name]) || 0]);
        
        return {
          ...baseConfig,
          title: {
            text: `${numericCol.name} Trend`,
            subtext: `${analysis.totalRecords} data points`,
            left: 'center',
            top: 20,
            textStyle: {
              fontSize: 20,
              fontWeight: 700,
              color: '#111827'
            },
            subtextStyle: {
              fontSize: 12,
              color: '#6b7280'
            }
          },
          xAxis: {
            type: 'value',
            axisLabel: {
              fontSize: 11,
              color: '#6b7280'
            },
            axisLine: {
              lineStyle: { color: '#e5e7eb' }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              fontSize: 11,
              color: '#6b7280'
            },
            splitLine: {
              lineStyle: {
                color: '#f3f4f6',
                type: 'dashed'
              }
            }
          },
          series: [{
            type: 'line',
            data: values,
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#06b6d4'
            },
            itemStyle: {
              color: '#06b6d4',
              borderColor: '#ffffff',
              borderWidth: 2
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#06b6d440' },
                  { offset: 1, color: '#06b6d410' }
                ]
              }
            },
            symbol: 'circle',
            symbolSize: 6,
            animationDelay: (idx) => idx * 20
          }]
        };
      }

      default:
        return baseConfig;
    }
  };

  // Main analysis effect
  useEffect(() => {
    if (!data || data.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const analysis = analyzeTableData(data);
      const config = generateChartConfiguration(analysis, analysis?.chartRecommendation);
      
      setDataAnalysis(analysis);
      setChartConfig(config);
      setLoading(false);
    }, 500);
    
  }, [data, tabId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Analyzing Data</h3>
            <p className="text-blue-700 text-sm">Reading table structure and generating insights...</p>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h4a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Available</h3>
            <p className="text-gray-500 text-sm">Pass table data to generate intelligent visualizations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[600px] bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Smart Analytics Header */}
      {dataAnalysis && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Records:</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                {dataAnalysis.totalRecords.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Columns:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                {dataAnalysis.totalColumns}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Chart:</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold capitalize">
                {dataAnalysis.chartRecommendation?.type || 'Auto'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Quality:</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                {Math.round(dataAnalysis.chartRecommendation?.confidence * 100 || 75)}%
              </span>
            </div>
          </div>
          
          {/* Insights */}
          {dataAnalysis.insights && dataAnalysis.insights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {dataAnalysis.insights.slice(0, 3).map((insight, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                    ${insight.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                      insight.color === 'green' ? 'bg-green-100 text-green-700' :
                      insight.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                      insight.color === 'red' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'}`}
                >
                  <span>{insight.icon}</span>
                  <span>{insight.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Chart Display */}
      <div className="h-full">
        {chartConfig ? (
          <ReactECharts
            option={chartConfig}
            style={{ height: 'calc(100% - 120px)', width: '100%', minHeight: '480px' }}
            opts={{ renderer: 'svg', locale: 'en' }}
            notMerge={true}
            lazyUpdate={true}
          />
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold text-gray-700">AI Analysis Complete</h3>
              <p className="text-gray-500 text-sm">Ready to visualize your data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};