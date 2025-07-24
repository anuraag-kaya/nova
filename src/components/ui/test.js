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
      chartRecommendation: null,
      scenario: 'unknown'
    };
    
    // Get all column names
    const columnNames = Object.keys(tableData[0] || {});
    analysis.totalColumns = columnNames.length;
    
    // Detect scenario based on column names and tabId
    analysis.scenario = detectScenario(columnNames, tabId);
    
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
    
    // Generate insights and recommendations based on scenario
    analysis.insights = generateDataInsights(analysis);
    analysis.chartRecommendation = recommendOptimalChart(analysis);
    
    return analysis;
  };

  // Detect which scenario we're dealing with
  const detectScenario = (columnNames, tabId) => {
    const lowerColumns = columnNames.map(col => col.toLowerCase());
    
    // Scenario 1: Unmapped Test Cases (CREATED BY grouping)
    if (lowerColumns.some(col => col.includes('created') && col.includes('by')) ||
        tabId?.toLowerCase().includes('unmapped') && tabId?.toLowerCase().includes('test')) {
      return 'unmapped_test_cases';
    }
    
    // Scenario 2: User Story - Test Case Mapping
    if (lowerColumns.some(col => col.includes('user') && col.includes('story')) &&
        lowerColumns.some(col => col.includes('total') && col.includes('test')) &&
        lowerColumns.some(col => col.includes('astra'))) {
      return 'user_story_mapping';
    }
    
    // Scenario 3: Test Cases Without Steps
    if (lowerColumns.some(col => col.includes('test') && col.includes('case') && col.includes('title')) &&
        lowerColumns.some(col => col.includes('assigned')) &&
        lowerColumns.some(col => col.includes('modified'))) {
      return 'test_cases_without_steps';
    }
    
    // Scenario 4: Unmapped User Stories (Priority + Status)
    if (lowerColumns.some(col => col.includes('user') && col.includes('story')) &&
        lowerColumns.some(col => col.includes('priority')) &&
        lowerColumns.some(col => col.includes('status')) &&
        !lowerColumns.some(col => col.includes('total') && col.includes('test'))) {
      return 'unmapped_user_stories';
    }
    
    return 'unknown';
  };

  // Generate intelligent insights about the data
  const generateDataInsights = (analysis) => {
    const insights = [];
    
    switch (analysis.scenario) {
      case 'unmapped_test_cases':
        const createdByCol = analysis.columns.find(col => 
          col.name.toLowerCase().includes('created') && col.name.toLowerCase().includes('by')
        );
        if (createdByCol) {
          insights.push({
            type: 'productivity',
            message: `${createdByCol.uniqueCount} team members have created test cases`,
            icon: '👥',
            color: 'blue'
          });
        }
        break;
        
      case 'user_story_mapping':
        const totalTestCol = analysis.columns.find(col => 
          col.name.toLowerCase().includes('total') && col.name.toLowerCase().includes('test')
        );
        const astraCol = analysis.columns.find(col => 
          col.name.toLowerCase().includes('astra')
        );
        if (totalTestCol && astraCol) {
          const totalSum = totalTestCol.statistics.sum || 0;
          const astraSum = astraCol.statistics.sum || 0;
          const coverage = totalSum > 0 ? ((astraSum / totalSum) * 100).toFixed(1) : 0;
          insights.push({
            type: 'coverage',
            message: `${coverage}% of test cases are created in ASTRA`,
            icon: '📊',
            color: coverage > 50 ? 'green' : 'orange'
          });
        }
        break;
        
      case 'test_cases_without_steps':
        const assignedCol = analysis.columns.find(col => 
          col.name.toLowerCase().includes('assigned')
        );
        if (assignedCol) {
          insights.push({
            type: 'workload',
            message: `${assignedCol.uniqueCount} team members have incomplete test cases`,
            icon: '⚠️',
            color: 'red'
          });
        }
        break;
        
      case 'unmapped_user_stories':
        const priorityCol = analysis.columns.find(col => 
          col.name.toLowerCase().includes('priority')
        );
        const statusCol = analysis.columns.find(col => 
          col.name.toLowerCase().includes('status')
        );
        if (priorityCol && statusCol) {
          const highPriority = priorityCol.topValues.find(v => v.value.toLowerCase() === 'high');
          const openStatus = statusCol.topValues.find(v => v.value.toLowerCase() === 'open');
          insights.push({
            type: 'priority',
            message: `${highPriority?.count || 0} high-priority user stories need attention`,
            icon: '🔥',
            color: 'red'
          });
        }
        break;
    }
    
    // General insights
    if (analysis.totalRecords > 100) {
      insights.push({
        type: 'volume',
        message: `Large dataset with ${analysis.totalRecords.toLocaleString()} records`,
        icon: '📈',
        color: 'blue'
      });
    }
    
    return insights;
  };

  // Smart chart recommendation based on scenario
  const recommendOptimalChart = (analysis) => {
    const { columns, scenario } = analysis;
    
    switch (scenario) {
      case 'unmapped_test_cases':
        const createdByCol = columns.find(col => 
          col.name.toLowerCase().includes('created') && col.name.toLowerCase().includes('by')
        );
        const idCol = columns.find(col => 
          col.name.toLowerCase().includes('id') && col.type === 'identifier'
        );
        
        if (createdByCol && idCol) {
          return {
            type: 'grouped_bar',
            reason: `Group by ${createdByCol.name} to show test case creation productivity`,
            columns: { 
              groupBy: createdByCol.name, 
              countBy: idCol.name,
              title: `Test Cases Created by Team Member`
            },
            confidence: 0.95
          };
        }
        break;
        
      case 'user_story_mapping':
        const totalTestCol = columns.find(col => 
          col.name.toLowerCase().includes('total') && col.name.toLowerCase().includes('test')
        );
        const astraCol = columns.find(col => 
          col.name.toLowerCase().includes('astra')
        );
        const userStoryCol = columns.find(col => 
          col.name.toLowerCase().includes('user') && col.name.toLowerCase().includes('story') &&
          col.name.toLowerCase().includes('title')
        );
        
        if (totalTestCol && astraCol && userStoryCol) {
          return {
            type: 'stacked_bar',
            reason: `Compare total test cases vs ASTRA-created test cases by user story`,
            columns: { 
              category: userStoryCol.name,
              total: totalTestCol.name,
              astra: astraCol.name,
              title: `Test Case Coverage Analysis`
            },
            confidence: 0.9
          };
        }
        break;
        
      case 'test_cases_without_steps':
        const assignedCol = columns.find(col => 
          col.name.toLowerCase().includes('assigned')
        );
        const titleCol = columns.find(col => 
          col.name.toLowerCase().includes('test') && col.name.toLowerCase().includes('case')
        );
        
        if (assignedCol && titleCol) {
          return {
            type: 'grouped_bar',
            reason: `Show workload distribution - incomplete test cases by assignee`,
            columns: { 
              groupBy: assignedCol.name,
              countBy: titleCol.name,
              title: `Incomplete Test Cases by Assignee`
            },
            confidence: 0.85
          };
        }
        break;
        
      case 'unmapped_user_stories':
        const priorityCol = columns.find(col => 
          col.name.toLowerCase().includes('priority')
        );
        const statusCol = columns.find(col => 
          col.name.toLowerCase().includes('status')
        );
        
        if (priorityCol && statusCol) {
          return {
            type: 'dual_pie',
            reason: `Show priority and status distribution of unmapped user stories`,
            columns: { 
              priority: priorityCol.name,
              status: statusCol.name,
              title: `User Stories Analysis`
            },
            confidence: 0.9
          };
        }
        break;
    }
    
    // Fallback to general logic
    const categoricalCols = columns.filter(col => 
      col.type === 'categorical' && col.uniqueCount <= 20 && col.uniquenessRatio < 0.8
    );
    
    if (categoricalCols.length >= 1) {
      const categoryCol = categoricalCols[0];
      return {
        type: 'bar',
        reason: `Bar chart for ${categoryCol.name} distribution`,
        columns: { category: categoryCol.name },
        confidence: 0.7
      };
    }
    
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
    const generateColors = (count, type = 'default') => {
      const palettes = {
        default: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
        productivity: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'],
        priority: ['#ef4444', '#f59e0b', '#10b981', '#6b7280'],
        status: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
      };
      
      const colors = palettes[type] || palettes.default;
      return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
    };

    switch (recommendation.type) {
      case 'grouped_bar': {
        // For Unmapped Test Cases and Test Cases Without Steps
        const groupByCol = recommendation.columns.groupBy;
        const groupedData = {};
        
        data.forEach(row => {
          const groupKey = row[groupByCol] || 'Unknown';
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = 0;
          }
          groupedData[groupKey]++;
        });
        
        const sortedGroups = Object.entries(groupedData)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 15);
        
        const categories = sortedGroups.map(([key]) => key);
        const values = sortedGroups.map(([,count]) => count);
        
        return {
          ...baseConfig,
          title: {
            text: recommendation.columns.title,
            subtext: `${analysis.totalRecords} total records across ${Object.keys(groupedData).length} ${groupByCol.toLowerCase()}s`,
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
                return str.length > 12 ? str.substring(0, 12) + '...' : str;
              }
            },
            axisTick: { alignWithLabel: true, lineStyle: { color: '#e5e7eb' } },
            axisLine: { lineStyle: { color: '#e5e7eb' } }
          },
          yAxis: {
            type: 'value',
            name: 'Count',
            nameTextStyle: { fontSize: 12, color: '#6b7280', fontWeight: 500 },
            axisLabel: { fontSize: 11, color: '#6b7280' },
            splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
            axisLine: { show: false }
          },
          series: [{
            type: 'bar',
            name: 'Count',
            data: values.map((value, index) => ({
              value,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: generateColors(1, 'productivity')[0] },
                    { offset: 1, color: generateColors(1, 'productivity')[0] + 'aa' }
                  ]
                },
                borderRadius: [6, 6, 0, 0],
                shadowColor: 'rgba(16, 185, 129, 0.3)',
                shadowBlur: 8,
                shadowOffsetY: 4
              }
            })),
            emphasis: {
              itemStyle: { shadowBlur: 15, shadowOffsetY: 8, scale: 1.02 }
            },
            barMaxWidth: 50,
            animationDelay: (idx) => idx * 100,
            label: {
              show: true,
              position: 'top',
              fontSize: 11,
              fontWeight: 600,
              color: '#374151'
            }
          }]
        };
      }

      case 'stacked_bar': {
        // For User Story - Test Case Mapping
        const categoryCol = recommendation.columns.category;
        const totalCol = recommendation.columns.total;
        const astraCol = recommendation.columns.astra;
        
        // Take top 15 user stories by total test cases
        const sortedData = [...data]
          .sort((a, b) => (Number(b[totalCol]) || 0) - (Number(a[totalCol]) || 0))
          .slice(0, 15);
        
        const categories = sortedData.map(row => {
          const title = String(row[categoryCol] || 'Unknown');
          return title.length > 25 ? title.substring(0, 25) + '...' : title;
        });
        
        const totalValues = sortedData.map(row => Number(row[totalCol]) || 0);
        const astraValues = sortedData.map(row => Number(row[astraCol]) || 0);
        const remainingValues = totalValues.map((total, i) => Math.max(0, total - astraValues[i]));
        
        return {
          ...baseConfig,
          title: {
            text: recommendation.columns.title,
            subtext: `Top ${categories.length} user stories by test case volume`,
            left: 'center',
            top: 20,
            textStyle: { fontSize: 20, fontWeight: 700, color: '#111827' },
            subtextStyle: { fontSize: 12, color: '#6b7280' }
          },
          legend: {
            data: ['Created in ASTRA', 'Other Test Cases'],
            bottom: 20,
            itemGap: 20,
            textStyle: { fontSize: 11, color: '#4b5563' }
          },
          xAxis: {
            type: 'category',
            data: categories,
            axisLabel: {
              rotate: 45,
              fontSize: 10,
              color: '#6b7280',
              interval: 0
            },
            axisTick: { alignWithLabel: true },
            axisLine: { lineStyle: { color: '#e5e7eb' } }
          },
          yAxis: {
            type: 'value',
            name: 'Test Cases',
            nameTextStyle: { fontSize: 12, color: '#6b7280' },
            axisLabel: { fontSize: 11, color: '#6b7280' },
            splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } }
          },
          series: [
            {
              name: 'Created in ASTRA',
              type: 'bar',
              stack: 'total',
              data: astraValues,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#10b981' },
                    { offset: 1, color: '#10b981dd' }
                  ]
                },
                borderRadius: [0, 0, 0, 0]
              },
              emphasis: { itemStyle: { shadowBlur: 10 } }
            },
            {
              name: 'Other Test Cases',
              type: 'bar',
              stack: 'total',
              data: remainingValues,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#f59e0b' },
                    { offset: 1, color: '#f59e0bdd' }
                  ]
                },
                borderRadius: [4, 4, 0, 0]
              },
              emphasis: { itemStyle: { shadowBlur: 10 } }
            }
          ]
        };
      }

      case 'dual_pie': {
        // For Unmapped User Stories - Priority and Status
        const priorityCol = recommendation.columns.priority;
        const statusCol = recommendation.columns.status;
        
        // Priority data
        const priorityData = {};
        data.forEach(row => {
          const priority = row[priorityCol] || 'Unknown';
          priorityData[priority] = (priorityData[priority] || 0) + 1;
        });
        
        // Status data
        const statusData = {};
        data.forEach(row => {
          const status = row[statusCol] || 'Unknown';
          statusData[status] = (statusData[status] || 0) + 1;
        });
        
        const priorityPieData = Object.entries(priorityData).map(([name, value]) => ({ name, value }));
        const statusPieData = Object.entries(statusData).map(([name, value]) => ({ name, value }));
        
        return {
          ...baseConfig,
          title: {
            text: recommendation.columns.title,
            subtext: `${analysis.totalRecords} unmapped user stories`,
            left: 'center',
            top: 20,
            textStyle: { fontSize: 20, fontWeight: 700, color: '#111827' },
            subtextStyle: { fontSize: 12, color: '#6b7280' }
          },
          legend: [
            {
              data: priorityPieData.map(item => item.name),
              left: '20%',
              bottom: 20,
              textStyle: { fontSize: 11, color: '#4b5563' }
            },
            {
              data: statusPieData.map(item => item.name),
              right: '20%',
              bottom: 20,
              textStyle: { fontSize: 11, color: '#4b5563' }
            }
          ],
          series: [
            {
              name: 'Priority',
              type: 'pie',
              radius: ['20%', '45%'],
              center: ['25%', '55%'],
              data: priorityPieData,
              itemStyle: {
                borderRadius: 8,
                borderWidth: 3,
                borderColor: '#ffffff'
              },
              label: {
                fontSize: 11,
                fontWeight: 600,
                formatter: '{b}\n{d}%'
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 20,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.3)'
                }
              }
            },
            {
              name: 'Status',
              type: 'pie',
              radius: ['20%', '45%'],
              center: ['75%', '55%'],
              data: statusPieData,
              itemStyle: {
                borderRadius: 8,
                borderWidth: 3,
                borderColor: '#ffffff'
              },
              label: {
                fontSize: 11,
                fontWeight: 600,
                formatter: '{b}\n{d}%'
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 20,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.3)'
                }
              }
            }
          ],
          color: [...generateColors(priorityPieData.length, 'priority'), ...generateColors(statusPieData.length, 'status')]
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
            <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Analyzing Data</h3>
            <p className="text-blue-700 text-sm">Detecting scenario and generating optimal visualization...</p>
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Records:</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                {dataAnalysis.totalRecords.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Scenario:</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold capitalize">
                {dataAnalysis.scenario.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Chart:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold capitalize">
                {dataAnalysis.chartRecommendation?.type?.replace(/_/g, ' ') || 'Auto'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Confidence:</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                {Math.round((dataAnalysis.chartRecommendation?.confidence || 0.75) * 100)}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">AI:</span>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                🤖 Active
              </span>
            </div>
          </div>
          
          {/* AI Insights */}
          {dataAnalysis.insights && dataAnalysis.insights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {dataAnalysis.insights.slice(0, 3).map((insight, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium
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
            style={{ height: 'calc(100% - 140px)', width: '100%', minHeight: '480px' }}
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