const ChartView = ({ data, tabId }) => {
  // Early return for empty data
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-50 rounded-full">
            📊
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-500">No chart data to display for this report.</p>
        </div>
      </div>
    );
  }

  // Enhanced data analysis and processing
  const analyzeData = () => {
    const columns = Object.keys(data[0] || {});
    const chartData = columns.map((column) => ({
      name: column,
      values: data.map((row) => row[column])
    }));

    // Smart type detection with better heuristics
    const isNumeric = (value) => {
      if (value === null || value === undefined || value === '') return false;
      const num = Number(value);
      return !isNaN(num) && isFinite(num);
    };

    const isDate = (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date) && value.toString().match(/\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/);
    };

    const numericColumns = chartData.filter((col) => 
      col.values.filter(v => v !== null && v !== undefined && v !== '').length > 0 &&
      col.values.filter(v => v !== null && v !== undefined && v !== '').every(isNumeric)
    );

    const categoricalColumns = chartData.filter((col) => 
      !numericColumns.includes(col) &&
      col.values.filter(v => v !== null && v !== undefined && v !== '').length > 0
    );

    const dateColumns = chartData.filter((col) =>
      col.values.some(isDate)
    );

    return { numericColumns, categoricalColumns, dateColumns, totalRows: data.length };
  };

  const { numericColumns, categoricalColumns, dateColumns, totalRows } = analyzeData();

  // Intelligent chart type selection with better logic
  const determineOptimalChartType = () => {
    const hasCategories = categoricalColumns.length > 0;
    const hasNumbers = numericColumns.length > 0;
    const hasDates = dateColumns.length > 0;
    const isSmallDataset = totalRows <= 20;
    const isLargeDataset = totalRows > 100;

    // Time series detection
    if (hasDates && numericColumns.length >= 1) {
      return 'line';
    }

    // Single categorical with numeric - perfect for pie
    if (categoricalColumns.length === 1 && numericColumns.length === 1 && totalRows <= 10) {
      return 'pie';
    }

    // Multiple numeric columns - line chart for trends
    if (numericColumns.length > 2 && hasCategories) {
      return 'line';
    }

    // Single category, multiple numerics - bar chart
    if (categoricalColumns.length === 1 && numericColumns.length >= 1) {
      return 'bar';
    }

    // Large datasets with categories - bar chart
    if (hasCategories && hasNumbers && isLargeDataset) {
      return 'bar';
    }

    // Small datasets with single numeric - pie chart
    if (hasCategories && numericColumns.length === 1 && isSmallDataset) {
      return 'pie';
    }

    // Default to bar for mixed data
    return hasNumbers ? 'bar' : 'pie';
  };

  const chartType = determineOptimalChartType();

  // Enhanced chart configuration with modern design
  const generateChartConfig = () => {
    // Color palette - modern, accessible colors
    const colorPalette = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];

    // Smart axis selection
    const xAxisColumn = categoricalColumns[0] || dateColumns[0] || numericColumns[0];
    const xAxisData = xAxisColumn?.values || [];

    // For pie charts, use first categorical and first numeric
    if (chartType === 'pie') {
      const categoryCol = categoricalColumns[0];
      const valueCol = numericColumns[0];
      
      if (!categoryCol || !valueCol) {
        return { series: [], xAxis: {} };
      }

      const pieData = data.map((row, index) => ({
        name: row[categoryCol.name] || `Item ${index + 1}`,
        value: Number(row[valueCol.name]) || 0
      })).filter(item => item.value > 0);

      return {
        title: {
          text: `${categoryCol.name} Distribution`,
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#111827'
          },
          top: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          textStyle: { color: '#374151', fontSize: 12 }
        },
        legend: {
          type: 'scroll',
          orient: 'horizontal',
          bottom: 20,
          textStyle: { fontSize: 11, color: '#6B7280' }
        },
        series: [{
          name: valueCol.name,
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '55%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            fontSize: 11,
            color: '#374151',
            formatter: '{b}\n{d}%'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            label: { fontSize: 12 }
          },
          data: pieData.map((item, index) => ({
            ...item,
            itemStyle: { color: colorPalette[index % colorPalette.length] }
          }))
        }]
      };
    }

    // For line and bar charts
    const seriesData = numericColumns.map((col, index) => ({
      name: col.name,
      type: chartType,
      smooth: chartType === 'line',
      data: col.values.map(value => isNumeric(value) ? Number(value) : 0),
      itemStyle: { 
        color: colorPalette[index % colorPalette.length],
        borderRadius: chartType === 'bar' ? [4, 4, 0, 0] : 0
      },
      lineStyle: chartType === 'line' ? {
        width: 3,
        cap: 'round'
      } : undefined,
      symbol: chartType === 'line' ? 'circle' : undefined,
      symbolSize: chartType === 'line' ? 6 : undefined,
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 8,
          shadowColor: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }));

    return {
      title: {
        text: `Analysis Report`,
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#111827'
        },
        top: 20
      },
      tooltip: {
        trigger: chartType === 'line' ? 'axis' : 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: 12 },
        axisPointer: {
          type: 'shadow',
          shadowStyle: { color: 'rgba(0, 0, 0, 0.05)' }
        }
      },
      legend: {
        data: numericColumns.map(col => col.name),
        bottom: 10,
        textStyle: { fontSize: 11, color: '#6B7280' }
      },
      grid: {
        top: 80,
        left: 60,
        right: 40,
        bottom: 60,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          fontSize: 11,
          color: '#6B7280',
          rotate: xAxisData.length > 10 ? 45 : 0,
          interval: xAxisData.length > 20 ? 'auto' : 0
        },
        axisLine: {
          lineStyle: { color: '#E5E7EB' }
        },
        axisTick: {
          lineStyle: { color: '#E5E7EB' }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 11,
          color: '#6B7280',
          formatter: (value) => {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
            return value.toString();
          }
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: '#F3F4F6', type: 'dashed' }
        }
      },
      series: seriesData
    };
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Chart Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Data Visualization</h3>
            <p className="text-sm text-gray-500 mt-1">
              {data.length} records • {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Auto-Generated
            </span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="p-6">
        <ReactECharts
          option={generateChartConfig()}
          style={{ height: '500px', width: '100%' }}
          opts={{ renderer: 'canvas', locale: 'EN' }}
          theme="light"
        />
      </div>

      {/* Chart Footer with Insights */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>📊 {numericColumns.length} numeric columns</span>
            <span>🏷️ {categoricalColumns.length} categories</span>
            {dateColumns.length > 0 && <span>📅 {dateColumns.length} date columns</span>}
          </div>
          <span className="font-medium">Optimized for {chartType} visualization</span>
        </div>
      </div>
    </div>
  );
};