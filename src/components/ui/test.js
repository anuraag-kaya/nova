const ChartView = ({ data, tabId, apiEndpoint, filters = {} }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataAnalysis, setDataAnalysis] = useState(null);
  const [recordCount, setRecordCount] = useState(0);

  // Comprehensive data fetching with intelligent pagination
  const fetchCompleteDataset = async (endpoint, initialData = null) => {
    setLoading(true);
    setError(null);
    
    try {
      let allData = initialData ? [...initialData] : [];
      let hasMoreData = true;
      let page = 1;
      const pageSize = 1000; // Fetch in chunks
      
      // If we have initial data, check if we need more
      if (initialData && initialData.length > 0) {
        // Try to determine if there's more data by checking patterns
        const sampleSize = Math.min(100, initialData.length);
        const hasIncompletePattern = initialData.length % 10 === 0 || initialData.length < sampleSize;
        
        if (!hasIncompletePattern && initialData.length < 500) {
          // Likely complete dataset
          hasMoreData = false;
        }
      }
      
      // Fetch additional data if endpoint is provided
      if (endpoint && hasMoreData) {
        while (hasMoreData && allData.length < 10000) { // Safety limit
          try {
            const url = new URL(endpoint, window.location.origin);
            url.searchParams.set('page', page);
            url.searchParams.set('limit', pageSize);
            
            // Add filters to URL
            Object.entries(filters).forEach(([key, value]) => {
              if (value !== null && value !== undefined) {
                url.searchParams.set(key, value);
              }
            });
            
            const response = await fetch(url.toString(), {
              headers: {
                'Content-Type': 'application/json',
                // Add auth headers if available
                ...(localStorage.getItem('accessToken') && {
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                })
              }
            });
            
            if (!response.ok) {
              if (page === 1) throw new Error(`API Error: ${response.status}`);
              break; // Stop if pagination fails
            }
            
            const responseData = await response.json();
            let newData = [];
            
            // Handle different response structures
            if (Array.isArray(responseData)) {
              newData = responseData;
            } else if (responseData.data && Array.isArray(responseData.data)) {
              newData = responseData.data;
            } else if (responseData.results && Array.isArray(responseData.results)) {
              newData = responseData.results;
            } else if (responseData.items && Array.isArray(responseData.items)) {
              newData = responseData.items;
            }
            
            if (newData.length === 0) {
              hasMoreData = false;
            } else {
              allData = [...allData, ...newData];
              page++;
              
              // Check if we got less than requested (indicates last page)
              if (newData.length < pageSize) {
                hasMoreData = false;
              }
            }
            
            // Add small delay to prevent overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (fetchError) {
            console.warn(`Failed to fetch page ${page}:`, fetchError);
            hasMoreData = false;
          }
        }
      }
      
      setRecordCount(allData.length);
      return allData;
      
    } catch (error) {
      console.error('Data fetching error:', error);
      setError(error.message);
      return initialData || [];
    } finally {
      setLoading(false);
    }
  };

  // Deep data analysis with machine learning-like insights
  const performDeepAnalysis = (dataset) => {
    if (!dataset || dataset.length === 0) return null;
    
    const analysis = {
      totalRecords: dataset.length,
      columns: [],
      patterns: {},
      correlations: {},
      anomalies: [],
      trends: {},
      recommendations: []
    };
    
    const columns = Object.keys(dataset[0] || {});
    
    columns.forEach(columnName => {
      const values = dataset.map(row => row[columnName]);
      const nonNullValues = values.filter(val => val !== null && val !== undefined && val !== '');
      const numericValues = nonNullValues.filter(val => !isNaN(val) && val !== '').map(Number);
      
      // Advanced type detection
      const typeAnalysis = {
        isNumeric: numericValues.length / nonNullValues.length > 0.8,
        isInteger: numericValues.every(val => Number.isInteger(val)),
        isBoolean: nonNullValues.every(val => typeof val === 'boolean' || val === 'true' || val === 'false' || val === 0 || val === 1),
        isDate: nonNullValues.some(val => !isNaN(Date.parse(val)) && typeof val === 'string'),
        isEmail: nonNullValues.some(val => typeof val === 'string' && val.includes('@')),
        isUrl: nonNullValues.some(val => typeof val === 'string' && (val.startsWith('http') || val.startsWith('www'))),
        isId: columnName.toLowerCase().includes('id') || nonNullValues.every(val => typeof val === 'string' && val.length < 50)
      };
      
      // Statistical analysis
      let statistics = {};
      if (typeAnalysis.isNumeric && numericValues.length > 0) {
        const sorted = [...numericValues].sort((a, b) => a - b);
        const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
        const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length;
        
        statistics = {
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          mean: mean,
          median: sorted[Math.floor(sorted.length / 2)],
          mode: getMostFrequent(numericValues),
          variance: variance,
          stdDev: Math.sqrt(variance),
          q1: sorted[Math.floor(sorted.length * 0.25)],
          q3: sorted[Math.floor(sorted.length * 0.75)],
          sum: numericValues.reduce((a, b) => a + b, 0),
          range: Math.max(...numericValues) - Math.min(...numericValues)
        };
        
        // Detect outliers using IQR method
        const iqr = statistics.q3 - statistics.q1;
        const lowerBound = statistics.q1 - 1.5 * iqr;
        const upperBound = statistics.q3 + 1.5 * iqr;
        const outliers = numericValues.filter(val => val < lowerBound || val > upperBound);
        
        if (outliers.length > 0) {
          analysis.anomalies.push({
            column: columnName,
            type: 'outliers',
            count: outliers.length,
            values: outliers.slice(0, 5)
          });
        }
      }
      
      // Pattern detection
      const uniqueValues = [...new Set(nonNullValues)];
      const valueFrequency = {};
      nonNullValues.forEach(val => {
        valueFrequency[val] = (valueFrequency[val] || 0) + 1;
      });
      
      // Trend analysis for time-based data
      if (typeAnalysis.isDate) {
        const timeData = nonNullValues.map(val => new Date(val)).filter(date => !isNaN(date));
        if (timeData.length > 1) {
          timeData.sort((a, b) => a - b);
          const timeSpan = timeData[timeData.length - 1] - timeData[0];
          const avgInterval = timeSpan / (timeData.length - 1);
          
          analysis.trends[columnName] = {
            span: timeSpan,
            avgInterval: avgInterval,
            frequency: timeData.length / (timeSpan / (1000 * 60 * 60 * 24)) // records per day
          };
        }
      }
      
      analysis.columns.push({
        name: columnName,
        type: determineColumnType(typeAnalysis),
        dataQuality: {
          completeness: (nonNullValues.length / dataset.length) * 100,
          uniqueness: (uniqueValues.length / nonNullValues.length) * 100,
          nullCount: dataset.length - nonNullValues.length
        },
        distribution: {
          uniqueCount: uniqueValues.length,
          mostFrequent: getMostFrequent(nonNullValues),
          leastFrequent: getLeastFrequent(nonNullValues),
          topValues: Object.entries(valueFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([value, count]) => ({ value, count, percentage: (count / nonNullValues.length) * 100 }))
        },
        statistics,
        patterns: detectPatterns(nonNullValues, typeAnalysis),
        typeAnalysis
      });
    });
    
    // Cross-column correlation analysis
    const numericColumns = analysis.columns.filter(col => col.type === 'numeric');
    if (numericColumns.length >= 2) {
      numericColumns.forEach((col1, i) => {
        numericColumns.slice(i + 1).forEach(col2 => {
          const correlation = calculateCorrelation(
            dataset.map(row => Number(row[col1.name]) || 0),
            dataset.map(row => Number(row[col2.name]) || 0)
          );
          
          if (Math.abs(correlation) > 0.5) {
            analysis.correlations[`${col1.name}_${col2.name}`] = {
              correlation,
              strength: Math.abs(correlation) > 0.8 ? 'strong' : 'moderate',
              direction: correlation > 0 ? 'positive' : 'negative'
            };
          }
        });
      });
    }
    
    // Generate intelligent recommendations
    analysis.recommendations = generateRecommendations(analysis);
    
    return analysis;
  };

  // Helper functions
  const determineColumnType = (typeAnalysis) => {
    if (typeAnalysis.isNumeric) return typeAnalysis.isInteger ? 'integer' : 'numeric';
    if (typeAnalysis.isBoolean) return 'boolean';
    if (typeAnalysis.isDate) return 'date';
    if (typeAnalysis.isEmail) return 'email';
    if (typeAnalysis.isUrl) return 'url';
    if (typeAnalysis.isId) return 'identifier';
    return 'categorical';
  };

  const getMostFrequent = (arr) => {
    const frequency = {};
    arr.forEach(item => frequency[item] = (frequency[item] || 0) + 1);
    return Object.entries(frequency).reduce((a, b) => frequency[a[0]] > frequency[b[0]] ? a : b)[0];
  };

  const getLeastFrequent = (arr) => {
    const frequency = {};
    arr.forEach(item => frequency[item] = (frequency[item] || 0) + 1);
    return Object.entries(frequency).reduce((a, b) => frequency[a[0]] < frequency[b[0]] ? a : b)[0];
  };

  const detectPatterns = (values, typeAnalysis) => {
    const patterns = [];
    
    if (typeAnalysis.isNumeric) {
      const numericValues = values.map(Number);
      const differences = numericValues.slice(1).map((val, i) => val - numericValues[i]);
      const avgDifference = differences.reduce((a, b) => a + b, 0) / differences.length;
      
      if (Math.abs(avgDifference) > 0.1) {
        patterns.push({
          type: avgDifference > 0 ? 'increasing' : 'decreasing',
          strength: Math.abs(avgDifference),
          description: `Values ${avgDifference > 0 ? 'increase' : 'decrease'} by average of ${Math.abs(avgDifference).toFixed(2)}`
        });
      }
    }
    
    return patterns;
  };

  const calculateCorrelation = (x, y) => {
    const n = Math.min(x.length, y.length);
    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  };

  const generateRecommendations = (analysis) => {
    const recommendations = [];
    
    // Chart type recommendations
    const numericCols = analysis.columns.filter(col => col.type === 'numeric' || col.type === 'integer');
    const categoricalCols = analysis.columns.filter(col => col.type === 'categorical');
    const dateCols = analysis.columns.filter(col => col.type === 'date');
    
    if (numericCols.length === 1 && categoricalCols.length >= 1) {
      const categoryCol = categoricalCols[0];
      if (categoryCol.distribution.uniqueCount <= 10) {
        recommendations.push({
          type: 'chart',
          suggestion: categoryCol.distribution.uniqueCount <= 5 ? 'pie' : 'doughnut',
          reason: `Perfect for showing ${categoryCol.name} distribution with ${categoryCol.distribution.uniqueCount} categories`,
          confidence: 0.9
        });
      } else {
        recommendations.push({
          type: 'chart',
          suggestion: 'bar',
          reason: `Bar chart recommended for ${categoryCol.distribution.uniqueCount} categories`,
          confidence: 0.8
        });
      }
    }
    
    if (numericCols.length >= 2) {
      recommendations.push({
        type: 'chart',
        suggestion: dateCols.length > 0 ? 'line' : 'scatter',
        reason: dateCols.length > 0 ? 'Time series data detected' : 'Multiple numeric variables for correlation analysis',
        confidence: 0.85
      });
    }
    
    // Data quality recommendations
    analysis.columns.forEach(col => {
      if (col.dataQuality.completeness < 80) {
        recommendations.push({
          type: 'data_quality',
          suggestion: `Address missing data in ${col.name}`,
          reason: `Only ${col.dataQuality.completeness.toFixed(1)}% completeness`,
          confidence: 0.7
        });
      }
    });
    
    return recommendations;
  };

  // Advanced chart type selection with ML-like decision tree
  const selectOptimalChartWithAI = (analysis) => {
    if (!analysis || !analysis.columns.length) return 'table';
    
    const { columns, recommendations } = analysis;
    const numericCols = columns.filter(col => col.type === 'numeric' || col.type === 'integer');
    const categoricalCols = columns.filter(col => col.type === 'categorical' && col.distribution.uniqueCount < 50);
    const dateCols = columns.filter(col => col.type === 'date');
    
    // Use AI recommendations if available
    const chartRecommendation = recommendations.find(r => r.type === 'chart' && r.confidence > 0.8);
    if (chartRecommendation) {
      return chartRecommendation.suggestion;
    }
    
    // Advanced decision tree
    const score = {
      pie: 0, bar: 0, line: 0, scatter: 0, heatmap: 0, histogram: 0, area: 0
    };
    
    // Scoring algorithm
    if (numericCols.length === 1 && categoricalCols.length >= 1) {
      const categoryCol = categoricalCols[0];
      if (categoryCol.distribution.uniqueCount <= 5) {
        score.pie += 3;
      } else if (categoryCol.distribution.uniqueCount <= 10) {
        score.bar += 3;
        score.pie += 1;
      } else {
        score.bar += 2;
      }
    }
    
    if (numericCols.length >= 2) {
      score.scatter += 2;
      if (dateCols.length > 0) {
        score.line += 3;
        score.area += 2;
      }
    }
    
    if (dateCols.length > 0 && numericCols.length >= 1) {
      score.line += 2;
      score.area += 1;
    }
    
    if (numericCols.length === 1 && categoricalCols.length === 0) {
      score.histogram += 2;
    }
    
    // Return chart type with highest score
    return Object.entries(score).reduce((a, b) => score[a[0]] > score[b[0]] ? a : b)[0];
  };

  // Enhanced chart generation with AI insights
  const generateIntelligentChart = () => {
    if (!dataAnalysis || !chartData.length) return null;
    
    const chartType = selectOptimalChartWithAI(dataAnalysis);
    const { columns } = dataAnalysis;
    
    // Enhanced color palette with data-driven selection
    const generateSmartColors = (count, dataType = 'default') => {
      const palettes = {
        performance: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'],
        categorical: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
        sequential: ['#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9'],
        diverging: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6']
      };
      
      const baseColors = palettes[dataType] || palettes.categorical;
      return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
    };

    const baseConfig = {
      backgroundColor: 'transparent',
      animation: {
        duration: 1500,
        easing: 'cubicOut'
      },
      textStyle: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 12,
        color: '#374151'
      },
      grid: {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100,
        containLabel: true
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 16,
        textStyle: {
          color: '#1f2937',
          fontSize: 13,
          fontWeight: 500
        },
        extraCssText: `
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(16px);
          padding: 12px 16px;
        `
      }
    };

    // Generate chart based on AI recommendation
    switch (chartType) {
      case 'pie':
      case 'doughnut': {
        const categoryCol = columns.find(col => col.type === 'categorical');
        const valueCol = columns.find(col => col.type === 'numeric' || col.type === 'integer');
        
        if (!categoryCol) return baseConfig;
        
        const aggregatedData = {};
        chartData.forEach(row => {
          const category = String(row[categoryCol.name] || 'Unknown');
          const value = valueCol ? (Number(row[valueCol.name]) || 0) : 1;
          aggregatedData[category] = (aggregatedData[category] || 0) + value;
        });
        
        const pieData = Object.entries(aggregatedData)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 12) // Show top 12 categories
          .map(([name, value]) => ({ name, value }));
        
        const colors = generateSmartColors(pieData.length, 'categorical');
        
        return {
          ...baseConfig,
          title: {
            text: `${categoryCol.name} Distribution`,
            subtext: `${dataAnalysis.totalRecords} total records analyzed`,
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
          legend: {
            type: 'scroll',
            bottom: 20,
            itemGap: 15,
            itemWidth: 14,
            itemHeight: 14,
            textStyle: {
              fontSize: 11,
              color: '#4b5563'
            }
          },
          series: [{
            type: 'pie',
            radius: chartType === 'doughnut' ? ['40%', '70%'] : '60%',
            center: ['50%', '55%'],
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 30,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                borderWidth: 4,
                borderColor: '#ffffff',
                scaleSize: 5
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
              length: 25,
              length2: 15
            }
          }],
          color: colors
        };
      }
      
      // Add other chart types with similar intelligence...
      default:
        return baseConfig;
    }
  };

  // Main effect to handle data loading and analysis
  useEffect(() => {
    const initializeChart = async () => {
      try {
        // Fetch complete dataset
        const completeData = await fetchCompleteDataset(apiEndpoint, data);
        
        if (completeData && completeData.length > 0) {
          // Perform deep analysis
          const analysis = performDeepAnalysis(completeData);
          
          setChartData(completeData);
          setDataAnalysis(analysis);
        }
      } catch (error) {
        console.error('Chart initialization error:', error);
        setError(error.message);
      }
    };

    initializeChart();
  }, [data, tabId, apiEndpoint, JSON.stringify(filters)]);

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
            <p className="text-blue-700 text-sm">Fetching {recordCount > 0 ? `${recordCount}` : ''} records and generating insights...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-red-50 to-pink-100 rounded-xl border border-red-200">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Analysis Failed</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!chartData || chartData.length === 0) {
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
            <p className="text-gray-500 text-sm">No data found to analyze and visualize</p>
          </div>
        </div>
      </div>
    );
  }

  const chartOptions = generateIntelligentChart();

  return (
    <div className="w-full h-full min-h-[600px] bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Data insights header */}
      {dataAnalysis && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">Records:</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {dataAnalysis.totalRecords.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">Columns:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  {dataAnalysis.columns.length}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              AI-powered visualization
            </div>
          </div>
        </div>
      )}
      
      <ReactECharts
        option={chartOptions}
        style={{ height: 'calc(100% - 80px)', width: '100%', minHeight: '500px' }}
        opts={{ renderer: 'svg', locale: 'en' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
};