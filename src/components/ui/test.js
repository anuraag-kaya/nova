const ChartView = ({ data, tabId }) => {
  // Early return for no data
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
            <p className="text-gray-500 text-sm">Upload or select data to generate intelligent visualizations</p>
          </div>
        </div>
      </div>
    );
  }

  // Advanced data analysis function
  const analyzeData = (data) => {
    const columns = Object.keys(data[0] || {});
    const analysis = {
      totalRows: data.length,
      columns: [],
      insights: {},
      chartRecommendations: []
    };

    columns.forEach(column => {
      const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
      const nonEmptyValues = values.filter(val => val !== '' && val !== 0);
      
      // Determine column type and characteristics
      const isNumeric = values.every(val => !isNaN(val) && typeof val === 'number');
      const isBoolean = values.every(val => typeof val === 'boolean');
      const isDate = values.some(val => !isNaN(Date.parse(val)) && typeof val === 'string' && val.includes('-'));
      const uniqueValues = [...new Set(values)];
      const hasNulls = values.length !== data.length;
      
      // Statistical analysis for numeric columns
      let stats = {};
      if (isNumeric && nonEmptyValues.length > 0) {
        const numericValues = nonEmptyValues.map(Number);
        stats = {
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
          sum: numericValues.reduce((a, b) => a + b, 0),
          variance: numericValues.reduce((sum, val) => sum + Math.pow(val - stats.avg, 2), 0) / numericValues.length
        };
      }

      analysis.columns.push({
        name: column,
        type: isNumeric ? 'numeric' : isDate ? 'date' : isBoolean ? 'boolean' : 'categorical',
        uniqueCount: uniqueValues.length,
        nullCount: data.length - values.length,
        hasNulls,
        distinctRatio: uniqueValues.length / data.length,
        stats,
        sampleValues: uniqueValues.slice(0, 5)
      });
    });

    return analysis;
  };

  // Smart chart type selection
  const selectOptimalChart = (analysis) => {
    const { columns } = analysis;
    const numericColumns = columns.filter(col => col.type === 'numeric' && col.name.toLowerCase() !== 'id');
    const categoricalColumns = columns.filter(col => col.type === 'categorical' && col.distinctRatio < 0.8);
    const timeColumns = columns.filter(col => col.type === 'date');

    // Priority-based chart selection
    if (numericColumns.length === 1 && categoricalColumns.length >= 1) {
      const categoryCol = categoricalColumns[0];
      if (categoryCol.uniqueCount <= 8) {
        return categoryCol.uniqueCount <= 4 ? 'pie' : 'doughnut';
      }
      return 'bar';
    }

    if (numericColumns.length >= 2) {
      return timeColumns.length > 0 ? 'line' : 'scatter';
    }

    if (numericColumns.length === 1) {
      return 'histogram';
    }

    if (categoricalColumns.length >= 1) {
      return 'bar';
    }

    return 'table';
  };

  // Enhanced color palette generator
  const generateColorPalette = (count, type = 'default') => {
    const palettes = {
      default: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'],
      warm: ['#f97316', '#ef4444', '#eab308', '#84cc16', '#06b6d4', '#8b5cf6'],
      cool: ['#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#10b981', '#14b8a6'],
      professional: ['#1e40af', '#7c3aed', '#059669', '#dc2626', '#ca8a04', '#9333ea'],
      pastel: ['#a5b4fc', '#c4b5fd', '#7dd3fc', '#86efac', '#fde047', '#fca5a5']
    };

    const baseColors = palettes[type] || palettes.default;
    const colors = [];
    
    for (let i = 0; i < count; i++) {
      if (i < baseColors.length) {
        colors.push(baseColors[i]);
      } else {
        // Generate additional colors by modifying existing ones
        const baseColor = baseColors[i % baseColors.length];
        const hue = parseInt(baseColor.slice(1), 16);
        const variation = Math.floor(hue * (1 + (i / count) * 0.3)) % 16777215;
        colors.push(`#${variation.toString(16).padStart(6, '0')}`);
      }
    }
    
    return colors;
  };

  // Generate chart configuration
  const generateChartOptions = () => {
    const analysis = analyzeData(data);
    const chartType = selectOptimalChart(analysis);
    const columns = analysis.columns;
    
    // Find best columns for visualization
    const numericColumns = columns.filter(col => col.type === 'numeric' && col.name.toLowerCase() !== 'id');
    const categoricalColumns = columns.filter(col => col.type === 'categorical' && col.distinctRatio < 0.8);
    
    // Base configuration
    const baseConfig = {
      backgroundColor: 'transparent',
      animation: {
        duration: 1200,
        easing: 'cubicOut'
      },
      textStyle: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: 12,
        color: '#4b5563'
      },
      grid: {
        top: 80,
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
        textStyle: {
          color: '#374151',
          fontSize: 13
        },
        extraCssText: 'box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px);'
      }
    };

    // Chart-specific configurations
    switch (chartType) {
      case 'pie':
      case 'doughnut': {
        const categoryCol = categoricalColumns[0];
        const valueCol = numericColumns[0] || { name: 'count' };
        
        // Aggregate data for pie chart
        const aggregatedData = {};
        data.forEach(row => {
          const category = row[categoryCol.name] || 'Unknown';
          const value = valueCol.name === 'count' ? 1 : (Number(row[valueCol.name]) || 0);
          aggregatedData[category] = (aggregatedData[category] || 0) + value;
        });
        
        const pieData = Object.entries(aggregatedData).map(([name, value]) => ({ name, value }));
        const colors = generateColorPalette(pieData.length, 'professional');
        
        return {
          ...baseConfig,
          title: {
            text: `${categoryCol.name} Distribution`,
            left: 'center',
            top: 20,
            textStyle: {
              fontSize: 18,
              fontWeight: 600,
              color: '#1f2937'
            }
          },
          legend: {
            type: 'scroll',
            bottom: 20,
            itemGap: 20,
            textStyle: {
              fontSize: 12,
              color: '#6b7280'
            }
          },
          series: [{
            type: 'pie',
            radius: chartType === 'doughnut' ? ['45%', '75%'] : '65%',
            center: ['50%', '55%'],
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                borderWidth: 3,
                borderColor: '#fff'
              }
            },
            itemStyle: {
              borderRadius: chartType === 'doughnut' ? 8 : 5,
              borderWidth: 2,
              borderColor: '#fff'
            },
            label: {
              show: true,
              fontSize: 11,
              fontWeight: 500,
              formatter: '{b}\n{d}%'
            },
            labelLine: {
              smooth: true,
              length: 20,
              length2: 10
            },
            animationType: 'scale',
            animationEasing: 'elasticOut'
          }],
          color: colors
        };
      }

      case 'bar': {
        const categoryCol = categoricalColumns[0];
        const valueCol = numericColumns[0];
        
        if (!categoryCol || !valueCol) return baseConfig;
        
        // Sort data by value for better visualization
        const sortedData = [...data].sort((a, b) => (Number(b[valueCol.name]) || 0) - (Number(a[valueCol.name]) || 0));
        const topData = sortedData.slice(0, 15); // Show top 15 items
        
        const categories = topData.map(row => row[categoryCol.name] || 'Unknown');
        const values = topData.map(row => Number(row[valueCol.name]) || 0);
        const colors = generateColorPalette(1, 'professional');
        
        return {
          ...baseConfig,
          title: {
            text: `${valueCol.name} by ${categoryCol.name}`,
            left: 'center',
            top: 20,
            textStyle: {
              fontSize: 18,
              fontWeight: 600,
              color: '#1f2937'
            }
          },
          xAxis: {
            type: 'category',
            data: categories,
            axisLabel: {
              rotate: categories.some(cat => cat.length > 10) ? 45 : 0,
              fontSize: 11,
              color: '#6b7280',
              formatter: (value) => value.length > 15 ? value.substring(0, 15) + '...' : value
            },
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#e5e7eb'
              }
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
            axisLine: {
              show: false
            }
          },
          series: [{
            type: 'bar',
            data: values,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: colors[0] },
                  { offset: 1, color: colors[0] + '80' }
                ]
              },
              borderRadius: [4, 4, 0, 0],
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10,
              shadowOffsetY: 4
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowOffsetY: 8
              }
            },
            barMaxWidth: 60,
            animationDelay: (idx) => idx * 100
          }]
        };
      }

      case 'line': {
        const xCol = columns.find(col => col.type === 'date') || categoricalColumns[0];
        const yCol = numericColumns[0];
        
        if (!xCol || !yCol) return baseConfig;
        
        const sortedData = [...data].sort((a, b) => {
          if (xCol.type === 'date') {
            return new Date(a[xCol.name]) - new Date(b[xCol.name]);
          }
          return String(a[xCol.name]).localeCompare(String(b[xCol.name]));
        });
        
        const xData = sortedData.map(row => row[xCol.name]);
        const yData = sortedData.map(row => Number(row[yCol.name]) || 0);
        const colors = generateColorPalette(1, 'cool');
        
        return {
          ...baseConfig,
          title: {
            text: `${yCol.name} Trend`,
            left: 'center',
            top: 20,
            textStyle: {
              fontSize: 18,
              fontWeight: 600,
              color: '#1f2937'
            }
          },
          xAxis: {
            type: 'category',
            data: xData,
            axisLabel: {
              fontSize: 11,
              color: '#6b7280',
              rotate: 45
            },
            axisLine: {
              lineStyle: {
                color: '#e5e7eb'
              }
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
            data: yData,
            smooth: true,
            lineStyle: {
              width: 3,
              color: colors[0]
            },
            itemStyle: {
              color: colors[0],
              borderColor: '#fff',
              borderWidth: 2
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: colors[0] + '40' },
                  { offset: 1, color: colors[0] + '10' }
                ]
              }
            },
            emphasis: {
              itemStyle: {
                borderWidth: 4,
                shadowBlur: 20,
                shadowColor: colors[0] + '60'
              }
            },
            symbol: 'circle',
            symbolSize: 8,
            animationDelay: (idx) => idx * 50
          }]
        };
      }

      default:
        return baseConfig;
    }
  };

  const chartOptions = generateChartOptions();

  return (
    <div className="w-full h-full min-h-[500px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <ReactECharts
        option={chartOptions}
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
        opts={{ renderer: 'svg', locale: 'en' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
};