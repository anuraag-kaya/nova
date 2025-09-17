"use client";
import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ProgressInsights = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
    // User Stories Trend Chart
    if (userStoriesChartRef.current) {
      const chart = echarts.init(userStoriesChartRef.current);
      const option = {
        title: {
          text: 'User Stories by Release',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            const data = params[0];
            return `
              <div style="padding: 10px;">
                <strong>${data.name}</strong><br/>
                Story Count: ${data.value}<br/>
                ${data.data.percent_diff !== null ? `Change: ${data.data.percent_diff > 0 ? '+' : ''}${data.data.percent_diff}%` : ''}
              </div>
            `;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: userStoriesData.map(item => item.release_name),
          axisLabel: {
            rotate: 45,
            fontSize: 11
          }
        },
        yAxis: {
          type: 'value',
          name: 'Story Count',
          nameLocation: 'middle',
          nameGap: 40
        },
        series: [{
          name: 'User Stories',
          type: 'line',
          smooth: true,
          data: userStoriesData.map(item => ({
            value: item.story_count,
            data: item
          })),
          lineStyle: {
            width: 3,
            color: '#0057e7'
          },
          itemStyle: {
            color: '#0057e7',
            borderWidth: 2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(0, 87, 231, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(0, 87, 231, 0.05)'
            }])
          }
        }]
      };
      chart.setOption(option);
    }

    // Test Cases Trend Chart
    if (testCasesChartRef.current) {
      const chart = echarts.init(testCasesChartRef.current);
      const option = {
        title: {
          text: 'Test Cases by Release',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            const data = params[0];
            return `
              <div style="padding: 10px;">
                <strong>${data.name}</strong><br/>
                Test Cases: ${data.value}<br/>
                ${data.data.percent_diff !== null ? `Change: ${data.data.percent_diff > 0 ? '+' : ''}${data.data.percent_diff}%` : ''}
              </div>
            `;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: testCasesData.map(item => item.release_name),
          axisLabel: {
            rotate: 45,
            fontSize: 11
          }
        },
        yAxis: {
          type: 'value',
          name: 'Test Case Count',
          nameLocation: 'middle',
          nameGap: 40
        },
        series: [{
          name: 'Test Cases',
          type: 'line',
          smooth: true,
          data: testCasesData.map(item => ({
            value: item.test_case_count,
            data: item
          })),
          lineStyle: {
            width: 3,
            color: '#34a853'
          },
          itemStyle: {
            color: '#34a853',
            borderWidth: 2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(52, 168, 83, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(52, 168, 83, 0.05)'
            }])
          }
        }]
      };
      chart.setOption(option);
    }

    // Growth Percentage Chart
    if (growthChartRef.current) {
      const chart = echarts.init(growthChartRef.current);
      const percentData = userStoriesData.filter(item => item.percent_diff !== null);
      
      const option = {
        title: {
          text: 'Growth Rate Analysis',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c}%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: percentData.map(item => item.release_name),
          axisLabel: {
            rotate: 45,
            fontSize: 11
          }
        },
        yAxis: {
          type: 'value',
          name: 'Growth %',
          nameLocation: 'middle',
          nameGap: 40,
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: [{
          name: 'Growth Rate',
          type: 'bar',
          data: percentData.map(item => ({
            value: item.percent_diff,
            itemStyle: {
              color: item.percent_diff > 0 ? '#34a853' : '#ea4335'
            }
          })),
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%'
          }
        }]
      };
      chart.setOption(option);
    }

    // Comparison Chart
    if (comparisonChartRef.current) {
      const chart = echarts.init(comparisonChartRef.current);
      const option = {
        title: {
          text: 'User Stories vs Test Cases',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['User Stories', 'Test Cases'],
          top: '10%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: userStoriesData.map(item => item.release_name),
          axisLabel: {
            rotate: 45,
            fontSize: 11
          }
        },
        yAxis: {
          type: 'value',
          name: 'Count',
          nameLocation: 'middle',
          nameGap: 40
        },
        series: [
          {
            name: 'User Stories',
            type: 'bar',
            data: userStoriesData.map(item => item.story_count),
            itemStyle: {
              color: '#0057e7'
            }
          },
          {
            name: 'Test Cases',
            type: 'bar',
            data: testCasesData.map(item => item.test_case_count),
            itemStyle: {
              color: '#34a853'
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
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Control Box */}
      <div className="bg-white rounded-lg shadow-md p-6 mx-6 mb-6">
        <div className="flex items-center gap-4">
          {/* Project Dropdown */}
          <div ref={dropdownRef} className="relative flex-1">
            <div className="flex items-center">
              <span className="text-gray-600 text-sm font-medium mr-3">Projects</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Select a project..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedProject(null);
                      setShowDropdown(true);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50" 
                   style={{ left: '0', marginLeft: '80px', width: 'calc(100% - 80px)' }}>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{project.name}</div>
                      {project.zephyr_project_name && (
                        <div className="text-sm text-gray-500">{project.zephyr_project_name}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">No projects found</div>
                )}
              </div>
            )}
          </div>

          {/* Insight Button */}
          <button
            onClick={handleInsightClick}
            disabled={!selectedProject || loading}
            className={`px-8 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all min-w-[120px] ${
              selectedProject && !loading
                ? 'bg-[#1E88E5] text-white hover:bg-[#1976D2] shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              'Insight'
            )}
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      {chartsData.userStories && chartsData.testCases && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6">
          {/* User Stories Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div ref={userStoriesChartRef} style={{ width: '100%', height: '400px' }} />
          </div>

          {/* Test Cases Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div ref={testCasesChartRef} style={{ width: '100%', height: '400px' }} />
          </div>

          {/* Growth Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div ref={growthChartRef} style={{ width: '100%', height: '400px' }} />
          </div>

          {/* Comparison Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div ref={comparisonChartRef} style={{ width: '100%', height: '400px' }} />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!chartsData.userStories && !chartsData.testCases && !loading && (
        <div className="bg-white rounded-lg shadow-md p-12 mx-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500">Select a project and click "Insight" to view analytics</p>
        </div>
      )}
    </div>
  );
};

export default ProgressInsights;