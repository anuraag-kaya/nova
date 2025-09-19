"use client";
import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ProgressInsights = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownSearch, setDropdownSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartsData, setChartsData] = useState({
    userStories: null,
    testCases: null,
    defects: null,
    incidents: null,
    users: null,
    testSteps: null
  });
  
  const dropdownRef = useRef(null);
  const userStoriesChartRef = useRef(null);
  const testCasesChartRef = useRef(null);
  const defectsChartRef = useRef(null);
  const incidentsChartRef = useRef(null);
  const usersChartRef = useRef(null);
  const testStepsChartRef = useRef(null);

  // Chart configurations with Google color palette
  const chartConfigs = [
    {
      key: 'userStories',
      endpoint: '/us-by-release',
      title: 'User Stories by Release',
      yAxisName: 'User Stories Count',
      seriesName: 'User Stories',
      color: '#0F71F2', // Google Blue
      valueKey: 'story_count',
      unit: 'stories',
      ref: userStoriesChartRef,
      icon: '📋'
    },
    {
      key: 'testCases',
      endpoint: '/tc-by-release',
      title: 'Test Cases by Release',
      yAxisName: 'Test Cases Count',
      seriesName: 'Test Cases',
      color: '#318C07', // Google Green
      valueKey: 'test_case_count',
      unit: 'test cases',
      ref: testCasesChartRef,
      icon: '✅'
    },
    {
      key: 'defects',
      endpoint: '/defect-by-release',
      title: 'Defects by Release',
      yAxisName: 'Defects Count',
      seriesName: 'Defects',
      color: '#D92929', // Google Red
      valueKey: 'defect_count',
      unit: 'defects',
      ref: defectsChartRef,
      icon: '🐛'
    },
    {
      key: 'incidents',
      endpoint: '/incidents-by-release',
      title: 'Incidents by Release',
      yAxisName: 'Incidents Count',
      seriesName: 'Incidents',
      color: '#F2A20C', // Google Yellow
      valueKey: 'inc_count',
      unit: 'incidents',
      ref: incidentsChartRef,
      icon: '⚠️'
    },
    {
      key: 'users',
      endpoint: '/users-by-release',
      title: 'Users by Release',
      yAxisName: 'Users Count',
      seriesName: 'Users',
      color: '#868686', // Google Gray
      valueKey: 'user_count',
      unit: 'users',
      ref: usersChartRef,
      icon: '👥'
    },
    {
      key: 'testSteps',
      endpoint: '/test-step-by-release',
      title: 'Test Steps by Release',
      yAxisName: 'Test Steps Count',
      seriesName: 'Test Steps',
      color: '#9334E6', // Google Purple (complementary to the palette)
      valueKey: 'test_step_count',
      unit: 'test steps',
      ref: testStepsChartRef,
      icon: '🔄'
    }
  ];

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/release-insights/project', {
        headers: {
          'x-user-soeid': 'x-user-soeid'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setShowDropdown(false);
    setSearchTerm(project.name);
    setDropdownSearch('');
  };

  const handleInsightClick = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      // Fetch data for all 6 endpoints
      const promises = chartConfigs.map(config =>
        fetch(`/api${config.endpoint}?project_id=${selectedProject.id}`, {
          headers: { 'x-user-soeid': 'x-user-soeid' }
        }).then(res => res.ok ? res.json() : null)
      );
      
      const results = await Promise.all(promises);
      
      // Map results to chart data
      const newChartsData = {};
      chartConfigs.forEach((config, index) => {
        if (results[index]) {
          newChartsData[config.key] = results[index].data;
        }
      });
      
      setChartsData(newChartsData);
      
      // Initialize charts after data is loaded
      setTimeout(() => {
        initializeCharts(newChartsData);
      }, 100);
    } catch (error) {
      console.error('Error fetching insights data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLineChart = (chartRef, data, config) => {
    if (chartRef.current && data) {
      const chart = echarts.init(chartRef.current);
      
      // Calculate percentage values
      const percentageData = data.map((item, index) => {
        if (index === 0) return null;
        const prevValue = data[index - 1][config.valueKey];
        const currentValue = item[config.valueKey];
        return prevValue > 0 ? ((currentValue - prevValue) / prevValue * 100).toFixed(1) : null;
      });

      const option = {
        backgroundColor: '#ffffff',
        title: {
          text: config.title,
          left: 32,
          top: 24,
          textStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: '#1F2937',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
          },
          subtext: `${config.icon} Release Progress Analytics`,
          subtextStyle: {
            fontSize: 13,
            color: '#6B7280',
            fontWeight: '500'
          }
        },
        grid: {
          left: 100,
          right: 100,
          bottom: 160,
          top: 120,
          containLabel: false
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          borderRadius: 12,
          padding: 20,
          extraCssText: 'box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);',
          textStyle: {
            color: '#1F2937',
            fontSize: 14,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          },
          formatter: function(params) {
            const dataPoint = params[0];
            const value = dataPoint.value;
            const percentChange = percentageData[dataPoint.dataIndex];
            
            // Format release name for tooltip
            const releaseName = dataPoint.name.replace('NAM-', '').replace(/(\d{4})/g, '$1 ');
            
            return `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="font-weight: 600; margin-bottom: 12px; color: #374151; font-size: 15px; display: flex; align-items: center;">
                  <span style="margin-right: 8px; font-size: 16px;">${config.icon}</span>
                  ${releaseName}
                </div>
                <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px;">
                  <span style="color: ${config.color}; font-weight: 800; font-size: 28px;">${value.toLocaleString()}</span>
                  <span style="color: #6B7280; font-size: 14px; font-weight: 500;">${config.unit}</span>
                </div>
                ${percentChange !== null ? `
                  <div style="margin-top: 12px; padding: 8px 12px; background: #F3F4F6; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="color: #6B7280; font-size: 13px; font-weight: 500;">Change from previous:</span>
                      <span style="color: ${parseFloat(percentChange) >= 0 ? '#059669' : '#DC2626'}; font-weight: 700; font-size: 14px; display: flex; align-items: center;">
                        ${parseFloat(percentChange) >= 0 ? '↗' : '↘'} ${Math.abs(percentChange)}%
                      </span>
                    </div>
                  </div>
                ` : ''}
              </div>
            `;
          }
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.release_name),
          axisLine: {
            lineStyle: {
              color: '#D1D5DB',
              width: 2
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#374151',
            fontSize: 13,
            fontWeight: '600',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            rotate: 45,
            margin: 25,
            interval: 0,
            formatter: function(value) {
              // Enhanced formatting for release names
              const formatted = value
                .replace('NAM-', '')
                .replace(/(\d{4})\s*R(\d{2})\s*/, '$1 R$2')
                .replace(/\s+/g, ' ')
                .trim();
              
              return formatted.length > 12 ? formatted.substring(0, 12) + '...' : formatted;
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: config.yAxisName,
            nameLocation: 'middle',
            nameGap: 75,
            nameTextStyle: {
              color: '#374151',
              fontSize: 14,
              fontWeight: '700',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#D1D5DB',
                width: 2
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#6B7280',
              fontSize: 13,
              fontWeight: '600',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              formatter: function(value) {
                if (value >= 1000) {
                  return (value / 1000).toFixed(1) + 'K';
                }
                return value.toLocaleString();
              }
            },
            splitLine: {
              lineStyle: {
                color: '#F3F4F6',
                type: 'dashed',
                width: 1
              }
            },
            min: 0,
            max: function(value) {
              return Math.ceil(value.max * 1.15);
            }
          }
        ],
        series: [
          {
            name: config.seriesName,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 10,
            itemStyle: {
              color: config.color,
              borderColor: '#ffffff',
              borderWidth: 3,
              shadowColor: 'rgba(0, 0, 0, 0.15)',
              shadowBlur: 8,
              shadowOffsetY: 4
            },
            lineStyle: {
              width: 4,
              color: config.color,
              shadowColor: `${config.color}30`,
              shadowBlur: 12,
              shadowOffsetY: 4
            },
            emphasis: {
              scale: 1.8,
              itemStyle: {
                borderWidth: 4,
                shadowColor: 'rgba(0, 0, 0, 0.25)',
                shadowBlur: 15
              }
            },
            data: data.map(item => item[config.valueKey]),
            label: {
              show: true,
              position: 'top',
              distance: 20,
              formatter: function(params) {
                const value = params.value;
                if (value >= 1000) {
                  return (value / 1000).toFixed(1) + 'K';
                }
                return value.toLocaleString();
              },
              color: config.color,
              fontWeight: '800',
              fontSize: 14,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 6,
              padding: [4, 8],
              borderColor: config.color,
              borderWidth: 1
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: `${config.color}20` },
                { offset: 0.7, color: `${config.color}08` },
                { offset: 1, color: 'rgba(255, 255, 255, 0)' }
              ])
            }
          },
          // Additional series for percentage labels
          {
            name: 'Percentage Change',
            type: 'line',
            symbol: 'none',
            lineStyle: {
              width: 0
            },
            data: data.map((item, index) => item[config.valueKey]),
            label: {
              show: true,
              position: 'bottom',
              distance: 25,
              formatter: function(params) {
                const percent = percentageData[params.dataIndex];
                if (percent === null || Math.abs(percent) < 0.1) return '';
                
                return `${parseFloat(percent) >= 0 ? '↗' : '↘'} ${Math.abs(percent)}%`;
              },
              color: function(params) {
                const percent = percentageData[params.dataIndex];
                return percent >= 0 ? '#059669' : '#DC2626';
              },
              fontWeight: '700',
              fontSize: 12,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              backgroundColor: function(params) {
                const percent = percentageData[params.dataIndex];
                return percent >= 0 ? '#ECFDF5' : '#FEF2F2';
              },
              borderRadius: 6,
              padding: [3, 8],
              borderColor: function(params) {
                const percent = percentageData[params.dataIndex];
                return percent >= 0 ? '#059669' : '#DC2626';
              },
              borderWidth: 1
            }
          }
        ]
      };

      chart.setOption(option);
      
      // Handle window resize
      const handleResize = () => {
        chart.resize();
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }
  };

  const initializeCharts = (allData) => {
    chartConfigs.forEach(config => {
      if (allData[config.key]) {
        createLineChart(config.ref, allData[config.key], config);
      }
    });
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  // Count available charts
  const availableChartsCount = Object.values(chartsData).filter(data => data !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-lg h-20 flex items-center justify-between px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📊</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Release Progress Insights</h1>
            <p className="text-sm text-gray-600 font-medium">Comprehensive analytics across all release metrics</p>
          </div>
        </div>
        
        {selectedProject && (
          <div className="hidden lg:flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-700 font-semibold text-sm">Analyzing: {selectedProject.name}</span>
          </div>
        )}
      </div>

      {/* Enhanced Control Box */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mx-6 mt-8 mb-8 border border-gray-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Project Selection Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">🏢</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Project Selection</h3>
                <p className="text-sm text-gray-600">Choose a project to analyze release metrics</p>
              </div>
            </div>
            
            {/* Project Dropdown */}
            <div ref={dropdownRef} className="relative" style={{ minWidth: '350px', maxWidth: '500px' }}>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => {
                    setShowDropdown(true);
                    setDropdownSearch('');
                  }}
                  placeholder="Select or search for a project (e.g., NAM-KM)"
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base font-medium shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedProject(null);
                      setShowDropdown(true);
                      setDropdownSearch('');
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Enhanced Dropdown Menu */}
              {showDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <input
                      type="text"
                      value={dropdownSearch}
                      onChange={(e) => setDropdownSearch(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                      autoFocus
                    />
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => handleProjectSelect(project)}
                          className="px-6 py-4 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                        >
                          <div className="font-semibold text-gray-900 text-base mb-1">{project.name}</div>
                          {project.zephyr_project_name && (
                            <div className="text-sm text-gray-500 font-medium">{project.zephyr_project_name}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-6 py-12 text-gray-500 text-center">
                        <div className="text-4xl mb-3">🔍</div>
                        <div className="font-medium">No projects found</div>
                        <div className="text-sm">Try adjusting your search terms</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Measures Legend */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <span className="text-gray-700 text-base font-semibold">Analytics Legend</span>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded"></div>
                <span className="text-sm font-semibold text-orange-700">Count Metrics</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
                <span className="text-sm font-semibold text-blue-700">% Change</span>
              </div>
            </div>
          </div>

          {/* Enhanced Insight Button */}
          <button
            onClick={handleInsightClick}
            disabled={!selectedProject || loading}
            className={`px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 transform ${
              selectedProject && !loading
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </div>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">🔍</span>
                Generate Insights
              </div>
            )}
          </button>
        </div>
        
        {/* Progress indicator */}
        {loading && (
          <div className="mt-6 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Charts Grid - Enhanced Layout */}
      {availableChartsCount > 0 && (
        <div className="px-6 pb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
            <p className="text-gray-600 font-medium">
              Displaying {availableChartsCount} of {chartConfigs.length} available metrics for {selectedProject?.name}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {chartConfigs.map((config) => (
              chartsData[config.key] && (
                <div key={config.key} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div ref={config.ref} style={{ width: '100%', height: '550px' }} />
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Empty State */}
      {!loading && availableChartsCount === 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-16 mx-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-6">
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Analyze</h3>
          <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
            Select a project and click "Generate Insights" to view comprehensive release analytics across all metrics
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {chartConfigs.map((config) => (
              <div key={config.key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-2xl mb-2">{config.icon}</div>
                <div className="text-sm font-semibold text-gray-700">{config.title.replace(' by Release', '')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressInsights;