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
    testSteps: null,
    users: null,
    defects: null,
    incidents: null
  });
  
  const dropdownRef = useRef(null);
  const userStoriesChartRef = useRef(null);
  const testCasesChartRef = useRef(null);
  const testStepsChartRef = useRef(null);
  const usersChartRef = useRef(null);
  const defectsChartRef = useRef(null);
  const incidentsChartRef = useRef(null);

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
      // Fetch all data in parallel
      const [userStoriesRes, testCasesRes] = await Promise.all([
        fetch(`/api/us-by-release?project_id=${selectedProject.id}`, {
          headers: { 'x-user-soeid': 'x-user-soeid' }
        }),
        fetch(`/api/tc-by-release?project_id=${selectedProject.id}`, {
          headers: { 'x-user-soeid': 'x-user-soeid' }
        })
      ]);
      
      if (userStoriesRes.ok && testCasesRes.ok) {
        const userStoriesData = await userStoriesRes.json();
        const testCasesData = await testCasesRes.json();
        
        // Generate mock data for other charts based on the pattern
        const mockTestStepsData = generateMockData(userStoriesData.data, 'testSteps');
        const mockUsersData = generateMockData(userStoriesData.data, 'users');
        const mockDefectsData = generateMockData(userStoriesData.data, 'defects');
        const mockIncidentsData = generateMockData(userStoriesData.data, 'incidents');
        
        setChartsData({
          userStories: userStoriesData.data,
          testCases: testCasesData.data,
          testSteps: mockTestStepsData,
          users: mockUsersData,
          defects: mockDefectsData,
          incidents: mockIncidentsData
        });
        
        // Initialize charts after data is loaded
        setTimeout(() => {
          initializeCharts({
            userStories: userStoriesData.data,
            testCases: testCasesData.data,
            testSteps: mockTestStepsData,
            users: mockUsersData,
            defects: mockDefectsData,
            incidents: mockIncidentsData
          });
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching insights data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock data for demonstration
  const generateMockData = (baseData, type) => {
    const multipliers = {
      testSteps: { min: 5, max: 15 },
      users: { min: 2, max: 8 },
      defects: { min: 20, max: 200 },
      incidents: { min: 5, max: 15 }
    };
    
    return baseData.map((item, index) => {
      const mult = multipliers[type];
      const baseValue = Math.floor(Math.random() * (mult.max - mult.min) + mult.min);
      const value = type === 'defects' || type === 'incidents' 
        ? Math.max(mult.min, baseValue - index * 2)
        : baseValue + index;
      
      return {
        ...item,
        value: value,
        percent_diff: index > 0 ? ((value - baseData[index-1].story_count) / baseData[index-1].story_count * 100).toFixed(2) : null
      };
    });
  };

  const createLineChart = (chartRef, data, config) => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      
      // Calculate percentage values for secondary y-axis
      const percentageData = data.map((item, index) => {
        if (index === 0) return 0;
        const prevValue = data[index - 1][config.valueKey] || data[index - 1].value;
        const currentValue = item[config.valueKey] || item.value;
        return ((currentValue - prevValue) / prevValue * 100).toFixed(1);
      });

      const option = {
        backgroundColor: '#ffffff',
        title: {
          text: config.title,
          left: 24,
          top: 20,
          textStyle: {
            fontSize: 16,
            fontWeight: '600',
            color: '#1a202c',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }
        },
        grid: {
          left: 70,
          right: 70,
          bottom: 100,
          top: 65,
          containLabel: false
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          borderRadius: 8,
          padding: 16,
          extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);',
          textStyle: {
            color: '#1a202c',
            fontSize: 13,
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
                <div style="font-weight: 600; margin-bottom: 8px; color: #4a5568; font-size: 13px;">${releaseName}</div>
                <div style="display: flex; align-items: baseline; gap: 8px;">
                  <span style="color: ${config.color}; font-weight: 700; font-size: 24px;">${value.toLocaleString()}</span>
                  <span style="color: #718096; font-size: 13px;">${config.unit || 'items'}</span>
                </div>
                ${percentChange !== 0 ? `
                  <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
                    <span style="color: #718096; font-size: 12px;">Change: </span>
                    <span style="color: ${percentChange > 0 ? '#48bb78' : '#f56565'}; font-weight: 600; font-size: 13px;">
                      ${percentChange > 0 ? '+' : ''}${percentChange}%
                    </span>
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
              color: '#e2e8f0',
              width: 1.5
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#4a5568',
            fontSize: 12,
            fontWeight: '500',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            rotate: 35,
            margin: 15,
            formatter: function(value) {
              // Enhanced formatting for release names
              const formatted = value
                .replace('NAM-', '')
                .replace(/(\d{4})\s*R(\d{2})\s*(\d{2})\/(\d{2})\/(\d{2})/, '$1 R$2 $3/$4')
                .replace(/\s+/g, ' ')
                .trim();
              
              return formatted.length > 25 ? formatted.substring(0, 22) + '...' : formatted;
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: config.yAxisName,
            nameLocation: 'middle',
            nameGap: 50,
            nameTextStyle: {
              color: '#4a5568',
              fontSize: 13,
              fontWeight: '600',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#e2e8f0',
                width: 1.5
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#718096',
              fontSize: 12,
              fontWeight: '500',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              formatter: function(value) {
                return value.toLocaleString();
              }
            },
            splitLine: {
              lineStyle: {
                color: '#f7fafc',
                type: 'dashed',
                width: 1
              }
            },
            min: 0,
            max: function(value) {
              return Math.ceil(value.max * 1.15);
            }
          },
          {
            type: 'value',
            name: '% Change',
            show: false,
            nameLocation: 'middle',
            nameGap: 40,
            nameTextStyle: {
              color: '#718096',
              fontSize: 12,
              fontWeight: '500',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            },
            position: 'right',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
              formatter: '{value}%'
            },
            splitLine: {
              show: false
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
              color: '#ffffff',
              borderColor: config.color,
              borderWidth: 3,
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 4,
              shadowOffsetY: 2
            },
            lineStyle: {
              width: 3.5,
              color: config.color,
              shadowColor: `${config.color}33`,
              shadowBlur: 10,
              shadowOffsetY: 4
            },
            emphasis: {
              scale: 1.3,
              itemStyle: {
                borderWidth: 4,
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 10
              }
            },
            data: data.map(item => item[config.valueKey] || item.value),
            markPoint: {
              symbol: 'roundRect',
              symbolSize: [55, 28],
              symbolOffset: [0, -20],
              label: {
                show: true,
                formatter: function(params) {
                  return params.value.toLocaleString();
                },
                color: config.color,
                fontWeight: '700',
                fontSize: 13,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              },
              itemStyle: {
                color: `${config.color}15`,
                borderColor: config.color,
                borderWidth: 1.5,
                borderRadius: 4
              },
              data: data.map((item, index) => ({
                coord: [index, item[config.valueKey] || item.value],
                value: item[config.valueKey] || item.value
              }))
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: `${config.color}20` },
                { offset: 0.8, color: `${config.color}05` },
                { offset: 1, color: 'rgba(255, 255, 255, 0)' }
              ])
            }
          }
        ]
      };

      chart.setOption(option);
    }
  };

  const initializeCharts = (allData) => {
    // 1. User Stories By Release
    createLineChart(userStoriesChartRef, allData.userStories, {
      title: 'User Stories By Release',
      yAxisName: 'User Stories',
      seriesName: 'User Stories',
      color: '#f59e0b',
      valueKey: 'story_count',
      unit: 'stories'
    });

    // 2. Test Cases By Release
    createLineChart(testCasesChartRef, allData.testCases, {
      title: 'Test Cases By Release',
      yAxisName: 'Test Cases',
      seriesName: 'Test Cases',
      color: '#f59e0b',
      valueKey: 'test_case_count',
      unit: 'test cases'
    });

    // 3. Test Steps By Release
    createLineChart(testStepsChartRef, allData.testSteps, {
      title: 'Test Steps By Release',
      yAxisName: 'Test Steps',
      seriesName: 'Test Steps',
      color: '#f59e0b',
      valueKey: 'value',
      unit: 'steps'
    });

    // 4. Users By Release
    createLineChart(usersChartRef, allData.users, {
      title: 'Users By Release',
      yAxisName: 'Users',
      seriesName: 'Users',
      color: '#f59e0b',
      valueKey: 'value',
      unit: 'users'
    });

    // 5. Defects By Release
    createLineChart(defectsChartRef, allData.defects, {
      title: 'Defects By Release',
      yAxisName: 'Defects',
      seriesName: 'Defects',
      color: '#f59e0b',
      valueKey: 'value',
      unit: 'defects'
    });

    // 6. Incidents By Release
    createLineChart(incidentsChartRef, allData.incidents, {
      title: 'Incidents By Release',
      yAxisName: 'Incidents',
      seriesName: 'Incidents',
      color: '#f59e0b',
      valueKey: 'value',
      unit: 'incidents'
    });

    // Handle window resize
    const handleResize = () => {
      const charts = [
        userStoriesChartRef,
        testCasesChartRef,
        testStepsChartRef,
        usersChartRef,
        defectsChartRef,
        incidentsChartRef
      ];
      
      charts.forEach(ref => {
        if (ref.current) {
          const chart = echarts.getInstanceByDom(ref.current);
          if (chart) {
            chart.resize();
          }
        }
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Matching Team Tracker Design */}
      <div className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">📈</span>
          <h1 className="text-xl font-semibold text-gray-900">Release Progress Insights</h1>
        </div>
      </div>

      {/* Control Box */}
      <div className="bg-white rounded-lg shadow-sm p-4 mx-6 mt-6 mb-6 border border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-gray-700 text-sm font-medium">Projects</span>
          
          {/* Project Dropdown */}
          <div ref={dropdownRef} className="relative" style={{ minWidth: '300px', maxWidth: '400px' }}>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  setShowDropdown(true);
                  setDropdownSearch('');
                }}
                placeholder="NAM-KM"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedProject(null);
                    setShowDropdown(true);
                    setDropdownSearch('');
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-hidden z-50">
                <div className="p-2 border-b border-gray-100">
                  <input
                    type="text"
                    value={dropdownSearch}
                    onChange={(e) => setDropdownSearch(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    autoFocus
                  />
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectSelect(project)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <div className="font-medium text-gray-900 text-sm">{project.name}</div>
                        {project.zephyr_project_name && (
                          <div className="text-xs text-gray-500">{project.zephyr_project_name}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-gray-500 text-center text-sm">
                      No projects found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Measures Legend */}
          <div className="flex items-center gap-4 ml-auto mr-8">
            <span className="text-gray-600 text-sm">Measures</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
              <span className="text-sm text-gray-600">Count Distinct</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <span className="text-sm text-gray-600">% diff by release</span>
            </div>
          </div>

          {/* Insight Button */}
          <button
            onClick={handleInsightClick}
            disabled={!selectedProject || loading}
            className={`px-6 py-2 rounded font-medium text-sm transition-all ${
              selectedProject && !loading
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </div>
            ) : (
              'Insight'
            )}
          </button>
        </div>
      </div>

      {/* Charts Grid - 2x3 Layout */}
      {Object.values(chartsData).some(data => data !== null) && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Row 1 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div ref={userStoriesChartRef} style={{ width: '100%', height: '380px' }} />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div ref={testCasesChartRef} style={{ width: '100%', height: '380px' }} />
            </div>

            {/* Row 2 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div ref={testStepsChartRef} style={{ width: '100%', height: '380px' }} />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div ref={usersChartRef} style={{ width: '100%', height: '380px' }} />
            </div>

            {/* Row 3 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div ref={defectsChartRef} style={{ width: '100%', height: '380px' }} />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div ref={incidentsChartRef} style={{ width: '100%', height: '380px' }} />
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!Object.values(chartsData).some(data => data !== null) && !loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-20 mx-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-600">Select a project and click "Insight" to view release analytics</p>
        </div>
      )}
    </div>
  );
};

export default ProgressInsights;