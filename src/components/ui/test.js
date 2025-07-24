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
    
    // Scenario 2: User Story - Test Case Mapping (ENHANCED DETECTION)
    if (lowerColumns.some(col => col.includes('user') && col.includes('story')) &&
        (lowerColumns.some(col => col.includes('total') && col.includes('test')) ||
         lowerColumns.some(col => col.includes('astra')) ||
         lowerColumns.some(col => col.includes('created') && (col.includes('astra') || col.includes('automated'))))) {
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
          col.name.toLowerCase().includes('astra') || 
          (col.name.toLowerCase().includes('created') && 
           (col.name.toLowerCase().includes('astra') || col.name.toLowerCase().includes('automated')))
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
    
    console.log('Recommending chart for scenario:', scenario);
    console.log('Available columns:', columns.map(c => ({ name: c.name, type: c.type, uniqueCount: c.uniqueCount })));
    
    switch (scenario) {
      case 'unmapped_test_cases':
        const createdByCol = columns.find(col => 
          col.name.toLowerCase().includes('created') && col.name.toLowerCase().includes('by')
        );
        const idCol = columns.find(col => 
          col.name.toLowerCase().includes('id') && col.type === 'identifier'
        );
        
        console.log('Unmapped test cases - found columns:', { createdByCol: createdByCol?.name, idCol: idCol?.name });
        
        if (createdByCol) {
          return {
            type: 'grouped_bar',
            reason: `Group by ${createdByCol.name} to show test case creation productivity`,
            columns: { 
              groupBy: createdByCol.name, 
              countBy: idCol?.name || 'records',
              title: `Test Cases Created by Team Member`
            },
            confidence: 0.95
          };
        }
        
        // Fallback: Use first categorical column for grouping
        const categoricalCol = columns.find(col => 
          col.type === 'categorical' && col.uniqueCount > 1 && col.uniqueCount <= 20
        );
        
        if (categoricalCol) {
          console.log('Using fallback categorical column:', categoricalCol.name);
          return {
            type: 'grouped_bar',
            reason: `Group by ${categoricalCol.name} (fallback)`,
            columns: { 
              groupBy: categoricalCol.name, 
              countBy: 'records',
              title: `Distribution by ${categoricalCol.name}`
            },
            confidence: 0.7
          };
        }
        break;
        
      case 'user_story_mapping':
        // ENHANCED COLUMN DETECTION FOR USER STORY MAPPING
        const totalTestCol = columns.find(col => {
          const lower = col.name.toLowerCase();
          return (lower.includes('total') && lower.includes('test')) ||
                 (lower.includes('test') && lower.includes('case') && lower.includes('count')) ||
                 (col.type === 'integer' && lower.includes('test'));
        });
        
        const astraCol = columns.find(col => {
          const lower = col.name.toLowerCase();
          return lower.includes('astra') || 
                 (lower.includes('created') && (lower.includes('astra') || lower.includes('automated'))) ||
                 (lower.includes('ai') && lower.includes('generated')) ||
                 (lower.includes('automated') && col.type === 'integer');
        });
        
        const userStoryKeyCol = columns.find(col => {
          const lower = col.name.toLowerCase();
          return (lower.includes('user') && lower.includes('story') && lower.includes('key')) ||
                 (lower.includes('us') && lower.includes('key')) ||
                 (lower.includes('story') && lower.includes('id'));
        });
        
        const userStoryTitleCol = columns.find(col => {
          const lower = col.name.toLowerCase();
          return (lower.includes('user') && lower.includes('story') && (lower.includes('title') || lower.includes('summary'))) ||
                 (lower.includes('story') && lower.includes('title')) ||
                 (lower.includes('us') && lower.includes('title'));
        });
        
        console.log('User Story Mapping Detection:', {
          totalTestCol: totalTestCol?.name,
          astraCol: astraCol?.name,
          userStoryKeyCol: userStoryKeyCol?.name,
          userStoryTitleCol: userStoryTitleCol?.name
        });
        
        if (totalTestCol && astraCol && (userStoryKeyCol || userStoryTitleCol)) {
          return {
            type: 'coverage_comparison',
            reason: `Show ASTRA test case coverage vs total test cases for each user story`,
            columns: { 
              userStoryKey: userStoryKeyCol?.name,
              userStoryTitle: userStoryTitleCol?.name,
              total: totalTestCol.name,
              astra: astraCol.name,
              title: `Test Case Coverage by User Story`
            },
            confidence: 0.95
          };
        }
        
        // FALLBACK: If we can't find perfect columns, use first numeric columns
        const numericCols = columns.filter(col => col.type === 'integer' || col.type === 'numeric');
        if (numericCols.length >= 2) {
          return {
            type: 'coverage_comparison',
            reason: `Fallback: Show comparison between numeric columns`,
            columns: { 
              userStoryKey: userStoryKeyCol?.name || columns.find(col => col.type === 'categorical')?.name,
              userStoryTitle: userStoryTitleCol?.name,
              total: numericCols[0].name,
              astra: numericCols[1].name,
              title: `Data Comparison`
            },
            confidence: 0.7
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
    
    // Fallback to general logic - ENHANCED
    const categoricalCols = columns.filter(col => 
      col.type === 'categorical' && col.uniqueCount <= 20 && col.uniquenessRatio < 0.8 && col.uniqueCount > 1
    );
    
    console.log('Fallback - Found categorical columns:', categoricalCols.map(c => c.name));
    
    if (categoricalCols.length >= 1) {
      const categoryCol = categoricalCols[0];
      return {
        type: 'grouped_bar', // Changed from 'bar' to 'grouped_bar' for consistency
        reason: `Bar chart for ${categoryCol.name} distribution`,
        columns: { 
          groupBy: categoryCol.name,
          countBy: 'records',
          title: `Distribution by ${categoryCol.name}`
        },
        confidence: 0.7
      };
    }
    
    // FINAL FALLBACK: Create a simple count chart
    if (columns.length > 0) {
      console.log('Using final fallback - first column');
      const firstCol = columns[0];
      return {
        type: 'grouped_bar',
        reason: `Simple distribution chart using first available column`,
        columns: { 
          groupBy: firstCol.name,
          countBy: 'records',
          title: `Data Distribution`
        },
        confidence: 0.5
      };
    }
    
    console.log('No suitable chart type found');
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
        console.log('Generating grouped_bar chart for column:', groupByCol);
        
        if (!groupByCol) {
          console.error('No groupBy column specified for grouped_bar chart');
          return null;
        }
        
        const groupedData = {};
        
        data.forEach((row, index) => {
          const groupKey = row[groupByCol] || 'Unknown';
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = 0;
          }
          groupedData[groupKey]++;
        });
        
        console.log('Grouped data:', groupedData);
        
        if (Object.keys(groupedData).length === 0) {
          console.error('No valid groups found in data');
          return null;
        }
        
        const sortedGroups = Object.entries(groupedData)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 15);
        
        const categories = sortedGroups.map(([key]) => String(key));
        const values = sortedGroups.map(([,count]) => count);
        
        console.log('Chart data prepared:', { categories, values });
        
        if (categories.length === 0 || values.length === 0) {
          console.error('No valid chart data after processing');
          return null;
        }
        
        return {
          ...baseConfig,
          title: {
            text: recommendation.columns.title || 'Data Distribution',
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

      case 'coverage_comparison': {
        // FIXED USER STORY - TEST CASE MAPPING VISUALIZATION
        const userStoryKeyCol = recommendation.columns.userStoryKey;
        const userStoryTitleCol = recommendation.columns.userStoryTitle;
        const totalCol = recommendation.columns.total;
        const astraCol = recommendation.columns.astra;
        
        console.log('Coverage Chart Data:', {
          userStoryKeyCol,
          userStoryTitleCol,
          totalCol,
          astraCol,
          dataLength: data.length,
          sampleData: data.slice(0, 3)
        });
        
        // ENHANCED DATA FILTERING AND PROCESSING
        const validData = data.filter(row => {
          const totalValue = Number(row[totalCol]);
          const astraValue = Number(row[astraCol]);
          
          // Include rows with at least one test case
          return !isNaN(totalValue) && !isNaN(astraValue) && totalValue >= 0 && astraValue >= 0;
        });
        
        console.log('Valid data after filtering:', validData.length);
        
        if (validData.length === 0) {
          // FALLBACK: Show raw data if no valid numeric data found
          return {
            ...baseConfig,
            title: {
              text: 'No Valid Data Found',
              subtext: 'Cannot generate coverage chart with current data',
              left: 'center',
              top: 20,
              textStyle: { fontSize: 18, color: '#dc2626' }
            },
            series: []
          };
        }
        
        // Sort by total test cases (descending) and take top 15
        const sortedData = validData
          .sort((a, b) => (Number(b[totalCol]) || 0) - (Number(a[totalCol]) || 0))
          .slice(0, 15);
        
        // Create display names using both key and title
        const categories = sortedData.map((row, index) => {
          const key = row[userStoryKeyCol] || '';
          const title = row[userStoryTitleCol] || '';
          
          // Use key if available, otherwise use shortened title, otherwise use index
          if (key && key !== '' && key !== 'null' && key !== null) {
            return String(key);
          } else if (title && title !== '' && title !== 'null' && title !== null) {
            const titleStr = String(title);
            return titleStr.length > 20 ? titleStr.substring(0, 20) + '...' : titleStr;
          } else {
            return `Story ${index + 1}`;
          }
        });
        
        const totalValues = sortedData.map(row => Number(row[totalCol]) || 0);
        const astraValues = sortedData.map(row => Number(row[astraCol]) || 0);
        
        // Calculate coverage percentages for insights
        const coveragePercentages = totalValues.map((total, i) => 
          total > 0 ? Number(((astraValues[i] / total) * 100).toFixed(1)) : 0
        );
        
        console.log('Chart data prepared:', {
          categories: categories.length,
          totalValues: totalValues.length,
          astraValues: astraValues.length,
          coveragePercentages: coveragePercentages.length
        });
        
        return {
          ...baseConfig,
          title: {
            text: recommendation.columns.title,
            subtext: `ASTRA Coverage Analysis - Top ${categories.length} User Stories by Test Volume`,
            left: 'center',
            top: 20,
            textStyle: { fontSize: 20, fontWeight: 700, color: '#111827' },
            subtextStyle: { fontSize: 12, color: '#6b7280' }
          },
          legend: {
            data: ['Total Test Cases', 'Created in ASTRA', 'Coverage %'],
            bottom: 20,
            itemGap: 25,
            textStyle: { fontSize: 11, color: '#4b5563' }
          },
          xAxis: {
            type: 'category',
            data: categories,
            axisLabel: {
              rotate: 45,
              fontSize: 10,
              color: '#6b7280',
              interval: 0,
              formatter: (value) => {
                return value.length > 15 ? value.substring(0, 15) + '...' : value;
              }
            },
            axisTick: { alignWithLabel: true },
            axisLine: { lineStyle: { color: '#e5e7eb' } }
          },
          yAxis: [
            {
              type: 'value',
              name: 'Number of Test Cases',
              position: 'left',
              nameTextStyle: { fontSize: 12, color: '#6b7280', padding: [0, 0, 0, 20] },
              axisLabel: { fontSize: 11, color: '#6b7280' },
              splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
              axisLine: { show: false }
            },
            {
              type: 'value',
              name: 'Coverage %',
              position: 'right',
              nameTextStyle: { fontSize: 12, color: '#6b7280', padding: [0, 20, 0, 0] },
              axisLabel: { 
                fontSize: 11, 
                color: '#6b7280',
                formatter: '{value}%'
              },
              splitLine: { show: false },
              axisLine: { show: false },
              min: 0,
              max: 100
            }
          ],
          series: [
            {
              name: 'Total Test Cases',
              type: 'bar',
              yAxisIndex: 0,
              data: totalValues,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#e5e7eb' },
                    { offset: 1, color: '#9ca3af' }
                  ]
                },
                borderRadius: [4, 4, 0, 0],
                borderWidth: 1,
                borderColor: '#d1d5db'
              },
              emphasis: { itemStyle: { shadowBlur: 10 } },
              barMaxWidth: 30,
              z: 1
            },
            {
              name: 'Created in ASTRA',
              type: 'bar',
              yAxisIndex: 0,
              data: astraValues,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#10b981' },
                    { offset: 1, color: '#059669' }
                  ]
                },
                borderRadius: [4, 4, 0, 0],
                shadowColor: 'rgba(16, 185, 129, 0.3)',
                shadowBlur: 8,
                shadowOffsetY: 4
              },
              emphasis: { 
                itemStyle: { 
                  shadowBlur: 15,
                  shadowOffsetY: 8,
                  scale: 1.02
                } 
              },
              barMaxWidth: 30,
              z: 2,
              label: {
                show: true,
                position: 'top',
                fontSize: 10,
                fontWeight: 600,
                color: '#059669',
                formatter: '{c}'
              }
            },
            {
              name: 'Coverage %',
              type: 'line',
              yAxisIndex: 1,
              data: coveragePercentages,
              lineStyle: {
                width: 3,
                color: '#f59e0b',
                type: 'solid'
              },
              itemStyle: {
                color: '#f59e0b',
                borderColor: '#ffffff',
                borderWidth: 2
              },
              symbol: 'circle',
              symbolSize: 8,
              label: {
                show: true,
                position: 'top',
                fontSize: 10,
                fontWeight: 600,
                color: '#f59e0b',
                formatter: '{c}%'
              },
              emphasis: {
                itemStyle: {
                  borderWidth: 4,
                  shadowBlur: 15,
                  shadowColor: '#f59e0b60'
                }
              },
              z: 3
            }
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: { color: '#999' }
            },
            formatter: function(params) {
              const userStoryKey = params[0].name;
              const totalTests = params[0].value;
              const astraTests = params[1].value;
              const coverage = params[2].value;
              
              return `
                <div style="font-weight: 600; margin-bottom: 8px; color: #1f2937;">${userStoryKey}</div>
                <div style="margin-bottom: 4px;">
                  <span style="display: inline-block; width: 8px; height: 8px; background: #9ca3af; border-radius: 50%; margin-right: 8px;"></span>
                  Total Test Cases: <strong>${totalTests}</strong>
                </div>
                <div style="margin-bottom: 4px;">
                  <span style="display: inline-block; width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 8px;"></span>
                  Created in ASTRA: <strong>${astraTests}</strong>
                </div>
                <div style="margin-bottom: 4px;">
                  <span style="display: inline-block; width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; margin-right: 8px;"></span>
                  Coverage: <strong>${coverage}%</strong>
                </div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #6b7280;">
                  Gap: ${totalTests - astraTests} test cases
                </div>
              `;
            }
          }
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
      console.log('No data provided to ChartView');
      setLoading(false);
      return;
    }

    console.log('ChartView received data:', {
      dataLength: data.length,
      sampleData: data.slice(0, 2),
      columns: Object.keys(data[0] || {}),
      tabId
    });

    setLoading(true);
    
    setTimeout(() => {
      try {
        const analysis = analyzeTableData(data);
        console.log('Analysis result:', analysis);
        
        if (!analysis) {
          console.error('Analysis failed - no analysis object returned');
          setLoading(false);
          return;
        }

        const config = generateChartConfiguration(analysis, analysis?.chartRecommendation);
        console.log('Chart config generated:', {
          hasConfig: !!config,
          configKeys: config ? Object.keys(config) : null,
          scenario: analysis.scenario,
          recommendation: analysis.chartRecommendation
        });
        
        setDataAnalysis(analysis);
        setChartConfig(config);
        setLoading(false);
      } catch (error) {
        console.error('Error in chart analysis:', error);
        setLoading(false);
      }
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
        {chartConfig && chartConfig.series && chartConfig.series.length > 0 ? (
          <ReactECharts
            option={chartConfig}
            style={{ height: 'calc(100% - 140px)', width: '100%', minHeight: '480px' }}
            opts={{ renderer: 'svg', locale: 'en' }}
            notMerge={true}
            lazyUpdate={true}
            onChartReady={() => console.log('Chart rendered successfully')}
            onEvents={{
              'finished': () => console.log('Chart animation finished')
            }}
          />
        ) : chartConfig ? (
          <div className="flex items-center justify-center h-96 bg-yellow-50 border border-yellow-200 rounded-lg m-4">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-yellow-800">Chart Configuration Issue</h3>
              <p className="text-yellow-700 text-sm mt-2">Chart config exists but no valid series data found</p>
              <p className="text-yellow-600 text-xs mt-1">Check console for debugging information</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 bg-gray-50 border border-gray-200 rounded-lg m-4">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-700">No Chart Configuration</h3>
              <p className="text-gray-500 text-sm mt-2">
                {dataAnalysis ? 
                  `Unable to generate chart for scenario: ${dataAnalysis.scenario}` :
                  'Data analysis not completed'
                }
              </p>
              <p className="text-gray-400 text-xs mt-1">Check console for debugging information</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};