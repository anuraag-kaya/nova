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
    testCases: null
  });
  
  const dropdownRef = useRef(null);
  const userStoriesChartRef = useRef(null);
  const testCasesChartRef = useRef(null);
  const growthChartRef = useRef(null);
  const comparisonChartRef = useRef(null);

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
          'x-user-soeid': 'x-user-soeid' // Replace with actual user ID
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
      // Fetch user stories data
      const userStoriesResponse = await fetch(`/api/us-by-release?project_id=${selectedProject.id}`, {
        headers: {
          'x-user-soeid': 'x-user-soeid'
        }
      });
      
      // Fetch test cases data
      const testCasesResponse = await fetch(`/api/tc-by-release?project_id=${selectedProject.id}`, {
        headers: {
          'x-user-soeid': 'x-user-soeid'
        }
      });
      
      if (userStoriesResponse.ok && testCasesResponse.ok) {
        const userStoriesData = await userStoriesResponse.json();
        const testCasesData = await testCasesResponse.json();
        
        setChartsData({
          userStories: userStoriesData.data,
          testCases: testCasesData.data
        });
        
        // Initialize charts after data is loaded
        setTimeout(() => {
          initializeCharts(userStoriesData.data, testCasesData.data);
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching insights data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeCharts = (userStoriesData, testCasesData) => {
    // Enhanced User Stories Trend Chart
    if (userStoriesChartRef.current) {
      const chart = echarts.init(userStoriesChartRef.current);
      const option = {
        backgroundColor: '#fafafa',
        title: {
          text: 'User Stories by Release',
          left: 20,
          top: 20,
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#2c3e50'
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 15,
          textStyle: {
            color: '#333'
          },
          formatter: function(params) {
            const data = params[0];
            return `
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${data.name}</div>
              <div style="color: #0057e7; font-size: 24px; font-weight: bold; margin-bottom: 5px;">${data.value}</div>
              <div style="color: #666; font-size: 12px;">User Stories</div>
              ${data.data.percent_diff !== null ? `
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                  <span style="color: ${data.data.percent_diff > 0 ? '#34a853' : '#ea4335'}; font-weight: bold;">
                    ${data.data.percent_diff > 0 ? '↑' : '↓'} ${Math.abs(data.data.percent_diff)}%
                  </span>
                  <span style="color: #999; font-size: 11px;"> vs previous</span>
                </div>
              ` : ''}
            `;
          }
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 60,
          top: 80,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: userStoriesData.map(item => item.release_name),
          axisLabel: {
            rotate: 45,
            fontSize: 12,
            color: '#666',
            formatter: function(value) {
              return value.length > 15 ? value.substring(0, 15) + '...' : value;
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: 'Story Count',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            color: '#666',
            fontSize: 14
          },
          axisLabel: {
            color: '#666',
            formatter: '{value}'
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          }
        },
        series: [{
          name: 'User Stories',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          sampling: 'average',
          itemStyle: {
            color: '#0057e7',
            borderWidth: 2,
            borderColor: '#fff'
          },
          lineStyle: {
            width: 3,
            color: '#0057e7'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 87, 231, 0.4)' },
              { offset: 0.6, color: 'rgba(0, 87, 231, 0.1)' },
              { offset: 1, color: 'rgba(0, 87, 231, 0)' }
            ])
          },
          data: userStoriesData.map(item => ({
            value: item.story_count,
            data: item
          })),
          emphasis: {
            focus: 'series',
            scale: true,
            scaleSize: 10
          }
        }]
      };
      chart.setOption(option);
    }

    // Enhanced Test Cases Trend Chart
    if (testCasesChartRef.current) {
      const chart = echarts.init(testCasesChartRef.current);
      const option = {
        backgroundColor: '#fafafa',
        title: {
          text: 'Test Cases by Release',
          left: 20,
          top: 20,
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#2c3e50'
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 15,
          textStyle: {
            color: '#333'
          },
          formatter: function(params) {
            const data = params[0];
            return `
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${data.name}</div>
              <div style="color: #34a853; font-size: 24px; font-weight: bold; margin-bottom: 5px;">${data.value}</div>
              <div style="color: #666; font-size: 12px;">Test Cases</div>
              ${data.data.percent_diff !== null ? `
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                  <span style="color: ${data.data.percent_diff > 0 ? '#34a853' : '#ea4335'}; font-weight: bold;">
                    ${data.data.percent_diff > 0 ? '↑' : '↓'} ${Math.abs(data.data.percent_diff)}%
                  </span>
                  <span style="color: #999; font-size: 11px;"> vs previous</span>
                </div>
              ` : ''}
            `;
          }
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 60,
          top: 80,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: testCasesData.map(item => item.release_name),
          axisLabel: {
            rotate: 45,
            fontSize: 12,
            color: '#666',
            formatter: function(value) {
              return value.length > 15 ? value.substring(0, 15) + '...' : value;
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: 'Test Case Count',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            color: '#666',
            fontSize: 14
          },
          axisLabel: {
            color: '#666',
            formatter: '{value}'
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          }
        },
        series: [{
          name: 'Test Cases',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          sampling: 'average',
          itemStyle: {
            color: '#34a853',
            borderWidth: 2,
            borderColor: '#fff'
          },
          lineStyle: {
            width: 3,
            color: '#34a853'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(52, 168, 83, 0.4)' },
              { offset: 0.6, color: 'rgba(52, 168, 83, 0.1)' },
              { offset: 1, color: 'rgba(52, 168, 83, 0)' }
            ])
          },
          data: testCasesData.map(item => ({
            value: item.test_case_count,
            data: item
          })),
          emphasis: {
            focus: 'series',
            scale: true,
            scaleSize: 10
          }
        }]
      };
      chart.setOption(option);
    }

    // Enhanced Growth Percentage Chart
    if (growthChartRef.current) {
      const chart = echarts.init(growthChartRef.current);
      const percentData = userStoriesData.filter(item => item.percent_diff !== null);
      
      const option = {
        backgroundColor: '#fafafa',
        title: {
          text: 'Growth Rate Analysis',
          left: 20,
          top: 20,
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#2c3e50'
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 15,
          formatter: function(params) {
            const data = params[0];
            return `
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${data.name}</div>
              <div style="font-size: 24px; font-weight: bold; color: ${data.value > 0 ? '#34a853' : '#ea4335'};">
                ${data.value > 0 ? '+' : ''}${data.value}%
              </div>
              <div style="color: #666; font-size: 12px; margin-top: 5px;">
                ${data.value > 0 ? 'Growth' : 'Decline'} from previous release
              </div>
            `;
          }
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 60,
          top: 80,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: percentData.map(item => item.release_name),
          axisLabel: {
            rotate: 45,
            fontSize: 12,
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: 'Growth %',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            color: '#666',
            fontSize: 14
          },
          axisLabel: {
            color: '#666',
            formatter: '{value}%'
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          }
        },
        series: [{
          name: 'Growth Rate',
          type: 'bar',
          barWidth: '60%',
          data: percentData.map(item => ({
            value: item.percent_diff,
            itemStyle: {
              color: item.percent_diff > 0 ? '#34a853' : '#ea4335',
              borderRadius: [4, 4, 0, 0]
            }
          })),
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            fontSize: 14,
            fontWeight: 'bold',
            color: '#333'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)'
            }
          }
        }]
      };
      chart.setOption(option);
    }

    // Enhanced Comparison Chart
    if (comparisonChartRef.current) {
      const chart = echarts.init(comparisonChartRef.current);
      const option = {
        backgroundColor: '#fafafa',
        title: {
          text: 'User Stories vs Test Cases',
          left: 20,
          top: 20,
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#2c3e50'
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 15,
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              opacity: 0.1
            }
          },
          formatter: function(params) {
            return `
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 10px;">${params[0].name}</div>
              ${params.map(p => `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                  <span style="display: flex; align-items: center;">
                    <span style="display: inline-block; width: 12px; height: 12px; background: ${p.color}; border-radius: 2px; margin-right: 8px;"></span>
                    <span style="color: #666; font-size: 13px;">${p.seriesName}:</span>
                  </span>
                  <span style="font-weight: bold; font-size: 16px; margin-left: 20px;">${p.value}</span>
                </div>
              `).join('')}
            `;
          }
        },
        legend: {
          data: ['User Stories', 'Test Cases'],
          top: 25,
          right: 20,
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            fontSize: 13,
            color: '#666'
          }
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 60,
          top: 80,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: userStoriesData.map(item => item.release_name),
          axisLabel: {
            rotate: 45,
            fontSize: 12,
            color: '#666',
            formatter: function(value) {
              return value.length > 15 ? value.substring(0, 15) + '...' : value;
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: 'Count',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            color: '#666',
            fontSize: 14
          },
          axisLabel: {
            color: '#666'
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: 'User Stories',
            type: 'bar',
            barGap: 0,
            data: userStoriesData.map(item => item.story_count),
            itemStyle: {
              color: '#0057e7',
              borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0, 87, 231, 0.3)'
              }
            }
          },
          {
            name: 'Test Cases',
            type: 'bar',
            data: testCasesData.map(item => item.test_case_count),
            itemStyle: {
              color: '#34a853',
              borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(52, 168, 83, 0.3)'
              }
            }
          }
        ]
      };
      chart.setOption(option);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
      userStoriesChartRef.current && echarts.getInstanceByDom(userStoriesChartRef.current)?.resize();
      testCasesChartRef.current && echarts.getInstanceByDom(testCasesChartRef.current)?.resize();
      growthChartRef.current && echarts.getInstanceByDom(growthChartRef.current)?.resize();
      comparisonChartRef.current && echarts.getInstanceByDom(comparisonChartRef.current)?.resize();
    });
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Release Progress Insights */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-6 py-4 mb-2">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <span className="mr-2">📈</span>
          Release Progress Insights
        </h2>
      </div>

      {/* Enhanced Control Box */}
      <div className="bg-white rounded-lg shadow-lg p-5 mx-6 mb-6 border border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-gray-700 text-sm font-medium">Projects</span>
          
          {/* Project Dropdown - Compact Width */}
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
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                style={{ minWidth: '280px' }}
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
            
            {/* Dropdown Menu with Search */}
            {showDropdown && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-hidden z-50">
                {/* Search within dropdown */}
                <div className="p-3 border-b border-gray-100 bg-gray-50">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={dropdownSearch}
                      onChange={(e) => setDropdownSearch(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      autoFocus
                    />
                  </div>
                </div>
                
                {/* Project List */}
                <div className="max-h-56 overflow-y-auto">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectSelect(project)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{project.name}</div>
                        {project.zephyr_project_name && (
                          <div className="text-xs text-gray-500 mt-1">{project.zephyr_project_name}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-gray-500 text-center text-sm">
                      No projects found matching "{dropdownSearch}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Insight Button */}
          <button
            onClick={handleInsightClick}
            disabled={!selectedProject || loading}
            className={`px-8 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all ${
              selectedProject && !loading
                ? 'bg-[#1976D2] text-white hover:bg-[#1565C0] shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading
              </div>
            ) : (
              'Insight'
            )}
          </button>

          {/* Space for future filters */}
          <div className="flex-1"></div>
        </div>
      </div>

      {/* Charts Grid */}
      {chartsData.userStories && chartsData.testCases && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6">
          {/* User Stories Chart */}
          <div className="bg-white rounded-lg shadow-lg p-2 hover:shadow-xl transition-shadow">
            <div ref={userStoriesChartRef} style={{ width: '100%', height: '400px' }} />
          </div>

          {/* Test Cases Chart */}
          <div className="bg-white rounded-lg shadow-lg p-2 hover:shadow-xl transition-shadow">
            <div ref={testCasesChartRef} style={{ width: '100%', height: '400px' }} />
          </div>

          {/* Growth Chart */}
          <div className="bg-white rounded-lg shadow-lg p-2 hover:shadow-xl transition-shadow">
            <div ref={growthChartRef} style={{ width: '100%', height: '400px' }} />
          </div>

          {/* Comparison Chart */}
          <div className="bg-white rounded-lg shadow-lg p-2 hover:shadow-xl transition-shadow">
            <div ref={comparisonChartRef} style={{ width: '100%', height: '400px' }} />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!chartsData.userStories && !chartsData.testCases && !loading && (
        <div className="bg-white rounded-lg shadow-md p-16 mx-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">Select a project and click "Insight" to view analytics</p>
        </div>
      )}
    </div>
  );
};

export default ProgressInsights;