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
  const heatmapChartRef = useRef(null);
  const velocityChartRef = useRef(null);

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
    // Enhanced User Stories Trend Chart with Advanced Analytics
    if (userStoriesChartRef.current) {
      const chart = echarts.init(userStoriesChartRef.current);
      
      // Calculate moving average
      const movingAverage = [];
      const windowSize = 3;
      for (let i = 0; i < userStoriesData.length; i++) {
        if (i < windowSize - 1) {
          movingAverage.push(null);
        } else {
          let sum = 0;
          for (let j = 0; j < windowSize; j++) {
            sum += userStoriesData[i - j].story_count;
          }
          movingAverage.push((sum / windowSize).toFixed(1));
        }
      }

      const option = {
        backgroundColor: '#fafafa',
        title: {
          text: 'User Stories Trend Analysis',
          subtext: 'Release-wise Distribution with Moving Average',
          left: 30,
          top: 20,
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#2c3e50'
          },
          subtextStyle: {
            fontSize: 14,
            color: '#7f8c8d'
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
              title: {
                zoom: 'Zoom',
                back: 'Reset'
              }
            },
            restore: { title: 'Restore' },
            saveAsImage: { title: 'Save' }
          },
          right: 30,
          top: 20
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 20,
          textStyle: {
            color: '#333'
          },
          formatter: function(params) {
            const data = params[0];
            const avgData = params[1];
            return `
              <div style="font-weight: bold; font-size: 16px; margin-bottom: 12px; color: #2c3e50;">${data.name}</div>
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; background: #0057e7; border-radius: 50%; margin-right: 8px;"></div>
                <span style="color: #666; margin-right: 15px;">User Stories:</span>
                <span style="color: #0057e7; font-size: 24px; font-weight: bold;">${data.value}</span>
              </div>
              ${avgData && avgData.value ? `
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <div style="width: 12px; height: 12px; background: #ff9800; border-radius: 50%; margin-right: 8px;"></div>
                  <span style="color: #666; margin-right: 15px;">Moving Avg:</span>
                  <span style="color: #ff9800; font-size: 20px; font-weight: bold;">${avgData.value}</span>
                </div>
              ` : ''}
              ${data.data.percent_diff !== null ? `
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;">
                  <span style="color: #666;">Growth Rate: </span>
                  <span style="color: ${data.data.percent_diff > 0 ? '#34a853' : '#ea4335'}; font-weight: bold; font-size: 18px;">
                    ${data.data.percent_diff > 0 ? '↑' : '↓'} ${Math.abs(data.data.percent_diff)}%
                  </span>
                </div>
              ` : ''}
            `;
          }
        },
        legend: {
          data: ['User Stories', 'Moving Average'],
          bottom: 20,
          textStyle: {
            fontSize: 14,
            color: '#666'
          }
        },
        grid: {
          left: 80,
          right: 40,
          bottom: 80,
          top: 120,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: userStoriesData.map(item => item.release_name),
          axisLabel: {
            rotate: 45,
            fontSize: 13,
            color: '#666',
            fontWeight: 500,
            formatter: function(value) {
              return value.length > 15 ? value.substring(0, 15) + '...' : value;
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0',
              width: 2
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: 'Number of User Stories',
          nameLocation: 'middle',
          nameGap: 60,
          nameTextStyle: {
            color: '#666',
            fontSize: 16,
            fontWeight: 600
          },
          axisLabel: {
            color: '#666',
            fontSize: 12,
            formatter: '{value}'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#e0e0e0',
              width: 2
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          }
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }],
        series: [
          {
            name: 'User Stories',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 10,
            sampling: 'average',
            itemStyle: {
              color: '#0057e7',
              borderWidth: 3,
              borderColor: '#fff',
              shadowColor: 'rgba(0, 87, 231, 0.3)',
              shadowBlur: 10
            },
            lineStyle: {
              width: 4,
              color: '#0057e7',
              shadowColor: 'rgba(0, 87, 231, 0.3)',
              shadowBlur: 10
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 87, 231, 0.5)' },
                { offset: 0.7, color: 'rgba(0, 87, 231, 0.1)' },
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
              scaleSize: 12,
              itemStyle: {
                borderWidth: 4
              }
            }
          },
          {
            name: 'Moving Average',
            type: 'line',
            symbol: 'none',
            lineStyle: {
              width: 2,
              type: 'dashed',
              color: '#ff9800'
            },
            data: movingAverage
          }
        ]
      };
      chart.setOption(option);
    }

    // Enhanced Test Cases Trend Chart with Annotations
    if (testCasesChartRef.current) {
      const chart = echarts.init(testCasesChartRef.current);
      
      // Find peak and low points
      const maxValue = Math.max(...testCasesData.map(item => item.test_case_count));
      const minValue = Math.min(...testCasesData.map(item => item.test_case_count));
      const maxIndex = testCasesData.findIndex(item => item.test_case_count === maxValue);
      const minIndex = testCasesData.findIndex(item => item.test_case_count === minValue);

      const option = {
        backgroundColor: '#fafafa',
        title: {
          text: 'Test Cases Coverage Analysis',
          subtext: 'Quality Assurance Metrics by Release',
          left: 30,
          top: 20,
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#2c3e50'
          },
          subtextStyle: {
            fontSize: 14,
            color: '#7f8c8d'
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
              title: {
                zoom: 'Zoom',
                back: 'Reset'
              }
            },
            restore: { title: 'Restore' },
            saveAsImage: { title: 'Save' }
          },
          right: 30,
          top: 20
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 20,
          textStyle: {
            color: '#333'
          },
          formatter: function(params) {
            const data = params[0];
            const ratio = data.data.test_case_count > 0 ? 
              (data.data.test_case_count / userStoriesData[data.dataIndex].story_count).toFixed(2) : 0;
            return `
              <div style="font-weight: bold; font-size: 16px; margin-bottom: 12px; color: #2c3e50;">${data.name}</div>
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; background: #34a853; border-radius: 50%; margin-right: 8px;"></div>
                <span style="color: #666; margin-right: 15px;">Test Cases:</span>
                <span style="color: #34a853; font-size: 24px; font-weight: bold;">${data.value}</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; background: #9c27b0; border-radius: 50%; margin-right: 8px;"></div>
                <span style="color: #666; margin-right: 15px;">Coverage Ratio:</span>
                <span style="color: #9c27b0; font-size: 20px; font-weight: bold;">${ratio}:1</span>
              </div>
              ${data.data.percent_diff !== null ? `
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;">
                  <span style="color: #666;">Change Rate: </span>
                  <span style="color: ${data.data.percent_diff > 0 ? '#34a853' : '#ea4335'}; font-weight: bold; font-size: 18px;">
                    ${data.data.percent_diff > 0 ? '↑' : '↓'} ${Math.abs(data.data.percent_diff)}%
                  </span>
                </div>
              ` : ''}
            `;
          }
        },
        grid: {
          left: 80,
          right: 40,
          bottom: 80,
          top: 120,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: testCasesData.map(item => item.release_name),
          axisLabel: {
            rotate: 45,
            fontSize: 13,
            color: '#666',
            fontWeight: 500,
            formatter: function(value) {
              return value.length > 15 ? value.substring(0, 15) + '...' : value;
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0',
              width: 2
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: 'Number of Test Cases',
          nameLocation: 'middle',
          nameGap: 60,
          nameTextStyle: {
            color: '#666',
            fontSize: 16,
            fontWeight: 600
          },
          axisLabel: {
            color: '#666',
            fontSize: 12,
            formatter: '{value}'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#e0e0e0',
              width: 2
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          }
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }],
        series: [{
          name: 'Test Cases',
          type: 'line',
          smooth: true,
          symbol: 'diamond',
          symbolSize: 10,
          sampling: 'average',
          itemStyle: {
            color: '#34a853',
            borderWidth: 3,
            borderColor: '#fff',
            shadowColor: 'rgba(52, 168, 83, 0.3)',
            shadowBlur: 10
          },
          lineStyle: {
            width: 4,
            color: '#34a853',
            shadowColor: 'rgba(52, 168, 83, 0.3)',
            shadowBlur: 10
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(52, 168, 83, 0.5)' },
              { offset: 0.7, color: 'rgba(52, 168, 83, 0.1)' },
              { offset: 1, color: 'rgba(52, 168, 83, 0)' }
            ])
          },
          data: testCasesData.map(item => ({
            value: item.test_case_count,
            data: item
          })),
          markPoint: {
            data: [
              {
                type: 'max',
                name: 'Peak',
                label: {
                  formatter: 'Peak: {c}',
                  color: '#fff',
                  backgroundColor: '#34a853',
                  borderRadius: 4,
                  padding: [4, 8]
                }
              },
              {
                type: 'min',
                name: 'Low',
                label: {
                  formatter: 'Low: {c}',
                  color: '#fff',
                  backgroundColor: '#ea4335',
                  borderRadius: 4,
                  padding: [4, 8]
                }
              }
            ]
          },
          emphasis: {
            focus: 'series',
            scale: true,
            scaleSize: 12,
            itemStyle: {
              borderWidth: 4
            }
          }
        }]
      };
      chart.setOption(option);
    }

    // Enhanced Growth Rate Waterfall Chart
    if (growthChartRef.current) {
      const chart = echarts.init(growthChartRef.current);
      const percentData = userStoriesData.filter(item => item.percent_diff !== null);
      
      // Calculate cumulative growth
      let cumulative = 100;
      const waterfallData = percentData.map((item, index) => {
        const value = item.percent_diff;
        const start = cumulative;
        cumulative += value;
        return {
          name: item.release_name,
          value: [index, start, cumulative, value],
          itemStyle: {
            color: value > 0 ? '#34a853' : '#ea4335'
          }
        };
      });

      const option = {
        backgroundColor: '#fafafa',
        title: {
          text: 'Cumulative Growth Analysis',
          subtext: 'Release-over-Release Performance',
          left: 30,
          top: 20,
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#2c3e50'
          },
          subtextStyle: {
            fontSize: 14,
            color: '#7f8c8d'
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 20,
          formatter: function(params) {
            const data = params[0];
            const change = data.value[3];
            return `
              <div style="font-weight: bold; font-size: 16px; margin-bottom: 12px; color: #2c3e50;">${data.name}</div>
              <div style="margin-bottom: 8px;">
                <span style="color: #666;">Previous Level: </span>
                <span style="font-size: 18px; font-weight: bold;">${data.value[1].toFixed(1)}%</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span style="color: #666;">Change: </span>
                <span style="font-size: 20px; font-weight: bold; color: ${change > 0 ? '#34a853' : '#ea4335'};">
                  ${change > 0 ? '+' : ''}${change}%
                </span>
              </div>
              <div>
                <span style="color: #666;">New Level: </span>
                <span style="font-size: 18px; font-weight: bold;">${data.value[2].toFixed(1)}%</span>
              </div>
            `;
          }
        },
        legend: {
          data: ['Increase', 'Decrease'],
          bottom: 20,
          textStyle: {
            fontSize: 14,
            color: '#666'
          }
        },
        grid: {
          left: 80,
          right: 40,
          bottom: 80,
          top: 120,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: percentData.map((item, index) => item.release_name),
          axisLabel: {
            rotate: 45,
            fontSize: 13,
            color: '#666',
            fontWeight: 500
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0',
              width: 2
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: 'Cumulative Growth (%)',
          nameLocation: 'middle',
          nameGap: 60,
          nameTextStyle: {
            color: '#666',
            fontSize: 16,
            fontWeight: 600
          },
          axisLabel: {
            color: '#666',
            fontSize: 12,
            formatter: '{value}%'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#e0e0e0',
              width: 2
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          }
        },
        series: [{
          type: 'custom',
          renderItem: function(params, api) {
            const categoryIndex = api.value(0);
            const start = api.value(1);
            const end = api.value(2);
            const height = api.value(3);
            
            const categoryWidth = api.size([1, 0])[0] * 0.6;
            const x = api.coord([categoryIndex, 0])[0] - categoryWidth / 2;
            const startY = api.coord([0, start])[1];
            const endY = api.coord([0, end])[1];
            
            const rectShape = echarts.graphic.clipRectByRect({
              x: x,
              y: endY,
              width: categoryWidth,
              height: startY - endY
            }, {
              x: params.coordSys.x,
              y: params.coordSys.y,
              width: params.coordSys.width,
              height: params.coordSys.height
            });
            
            return rectShape && {
              type: 'rect',
              shape: rectShape,
              style: api.style({
                fill: height > 0 ? '#34a853' : '#ea4335'
              })
            };
          },
          data: waterfallData,
          z: 1
        }]
      };
      chart.setOption(option);
    }

    // Advanced Stacked Area Comparison Chart
    if (comparisonChartRef.current) {
      const chart = echarts.init(comparisonChartRef.current);
      
      // Calculate coverage percentage
      const coverageData = userStoriesData.map((story, index) => {
        const testCount = testCasesData[index].test_case_count;
        const storyCount = story.story_count;
        return storyCount > 0 ? ((testCount / storyCount) * 100).toFixed(1) : 0;
      });

      const option = {
        backgroundColor: '#fafafa',
        title: {
          text: 'Comprehensive Release Metrics',
          subtext: 'User Stories, Test Cases & Coverage Analysis',
          left: 30,
          top: 20,
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#2c3e50'
          },
          subtextStyle: {
            fontSize: 14,
            color: '#7f8c8d'
          }
        },
        toolbox: {
          feature: {
            magicType: {
              type: ['line', 'bar', 'stack'],
              title: {
                line: 'Line',
                bar: 'Bar',
                stack: 'Stack'
              }
            },
            restore: { title: 'Restore' },
            saveAsImage: { title: 'Save' }
          },
          right: 30,
          top: 20
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 20,
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          formatter: function(params) {
            const release = params[0].name;
            const stories = params.find(p => p.seriesName === 'User Stories');
            const tests = params.find(p => p.seriesName === 'Test Cases');
            const coverage = params.find(p => p.seriesName === 'Coverage %');
            
            return `
              <div style="font-weight: bold; font-size: 16px; margin-bottom: 12px; color: #2c3e50;">${release}</div>
              <div style="margin-bottom: 8px;">
                <span style="display: inline-block; width: 12px; height: 12px; background: #0057e7; border-radius: 50%; margin-right: 8px;"></span>
                <span style="color: #666;">User Stories: </span>
                <span style="font-weight: bold; font-size: 18px;">${stories ? stories.value : 0}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span style="display: inline-block; width: 12px; height: 12px; background: #34a853; border-radius: 50%; margin-right: 8px;"></span>
                <span style="color: #666;">Test Cases: </span>
                <span style="font-weight: bold; font-size: 18px;">${tests ? tests.value : 0}</span>
              </div>
              <div>
                <span style="display: inline-block; width: 12px; height: 12px; background: #fbbc04; border-radius: 50%; margin-right: 8px;"></span>
                <span style="color: #666;">Coverage: </span>
                <span style="font-weight: bold; font-size: 18px;">${coverage ? coverage.value : 0}%</span>
              </div>
            `;
          }
        },
        legend: {
          data: ['User Stories', 'Test Cases', 'Coverage %'],
          bottom: 20,
          textStyle: {
            fontSize: 14,
            color: '#666'
          }
        },
        grid: {
          left: 80,
          right: 80,
          bottom: 80,
          top: 120,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: userStoriesData.map(item => item.release_name),
          axisLabel: {
            rotate: 45,
            fontSize: 13,
            color: '#666',
            fontWeight: 500
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0',
              width: 2
            }
          },
          axisTick: {
            alignWithLabel: true
          },
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: [
          {
            type: 'value',
            name: 'Count',
            position: 'left',
            nameLocation: 'middle',
            nameGap: 60,
            nameTextStyle: {
              color: '#666',
              fontSize: 16,
              fontWeight: 600
            },
            axisLabel: {
              color: '#666',
              fontSize: 12
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#e0e0e0',
                width: 2
              }
            },
            splitLine: {
              lineStyle: {
                color: '#f0f0f0',
                type: 'dashed'
              }
            }
          },
          {
            type: 'value',
            name: 'Coverage (%)',
            position: 'right',
            nameLocation: 'middle',
            nameGap: 60,
            nameTextStyle: {
              color: '#666',
              fontSize: 16,
              fontWeight: 600
            },
            axisLabel: {
              color: '#666',
              fontSize: 12,
              formatter: '{value}%'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#e0e0e0',
                width: 2
              }
            },
            min: 0,
            max: function(value) {
              return Math.ceil(value.max / 100) * 100;
            }
          }
        ],
        series: [
          {
            name: 'User Stories',
            type: 'bar',
            data: userStoriesData.map(item => item.story_count),
            itemStyle: {
              color: '#0057e7',
              borderRadius: [4, 4, 0, 0],
              shadowColor: 'rgba(0, 87, 231, 0.2)',
              shadowBlur: 10
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowOffsetY: -5
              }
            }
          },
          {
            name: 'Test Cases',
            type: 'bar',
            data: testCasesData.map(item => item.test_case_count),
            itemStyle: {
              color: '#34a853',
              borderRadius: [4, 4, 0, 0],
              shadowColor: 'rgba(52, 168, 83, 0.2)',
              shadowBlur: 10
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowOffsetY: -5
              }
            }
          },
          {
            name: 'Coverage %',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            data: coverageData,
            itemStyle: {
              color: '#fbbc04',
              borderWidth: 2,
              borderColor: '#fff'
            },
            lineStyle: {
              width: 3,
              color: '#fbbc04',
              shadowColor: 'rgba(251, 188, 4, 0.3)',
              shadowBlur: 10
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(251, 188, 4, 0.3)' },
                { offset: 1, color: 'rgba(251, 188, 4, 0)' }
              ])
            }
          }
        ]
      };
      chart.setOption(option);
    }

    // New Release Health Heatmap
    if (heatmapChartRef.current) {
      const chart = echarts.init(heatmapChartRef.current);
      
      // Create heatmap data
      const metrics = ['User Stories', 'Test Cases', 'Coverage', 'Growth Rate', 'Quality Score'];
      const heatmapData = [];
      
      userStoriesData.forEach((story, releaseIndex) => {
        const testCase = testCasesData[releaseIndex];
        const coverage = story.story_count > 0 ? (testCase.test_case_count / story.story_count) : 0;
        const growthRate = story.percent_diff ? Math.abs(story.percent_diff) / 100 : 0;
        const qualityScore = (coverage + (story.percent_diff > 0 ? 1 : 0.5)) / 2;
        
        const values = [
          story.story_count / Math.max(...userStoriesData.map(s => s.story_count)),
          testCase.test_case_count / Math.max(...testCasesData.map(t => t.test_case_count)),
          coverage,
          growthRate,
          qualityScore
        ];
        
        values.forEach((value, metricIndex) => {
          heatmapData.push([releaseIndex, metricIndex, (value * 100).toFixed(0)]);
        });
      });

      const option = {
        backgroundColor: '#fafafa',
        title: {
          text: 'Release Health Matrix',
          subtext: 'Multi-dimensional Performance Indicators',
          left: 30,
          top: 20,
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#2c3e50'
          },
          subtextStyle: {
            fontSize: 14,
            color: '#7f8c8d'
          }
        },
        tooltip: {
          position: 'top',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 15,
          formatter: function(params) {
            const release = userStoriesData[params.data[0]].release_name;
            const metric = metrics[params.data[1]];
            const value = params.data[2];
            
            return `
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${release}</div>
              <div style="color: #666;">${metric}</div>
              <div style="font-size: 24px; font-weight: bold; color: ${value > 70 ? '#34a853' : value > 40 ? '#fbbc04' : '#ea4335'};">
                ${value}%
              </div>
            `;
          }
        },
        grid: {
          left: 150,
          right: 40,
          bottom: 80,
          top: 120,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: userStoriesData.map(item => item.release_name),
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(250,250,250,0.3)', 'rgba(240,240,240,0.3)']
            }
          },
          axisLabel: {
            rotate: 45,
            fontSize: 13,
            color: '#666',
            fontWeight: 500
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0',
              width: 2
            }
          }
        },
        yAxis: {
          type: 'category',
          data: metrics,
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(250,250,250,0.3)', 'rgba(240,240,240,0.3)']
            }
          },
          axisLabel: {
            fontSize: 13,
            color: '#666',
            fontWeight: 500
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0',
              width: 2
            }
          }
        },
        visualMap: {
          min: 0,
          max: 100,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: 20,
          inRange: {
            color: ['#ea4335', '#fbbc04', '#34a853']
          },
          text: ['High', 'Low'],
          textStyle: {
            color: '#666',
            fontSize: 12
          }
        },
        series: [{
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            formatter: '{c}%'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.2)'
            }
          }
        }]
      };
      chart.setOption(option);
    }

    // New Velocity Trend Chart
    if (velocityChartRef.current) {
      const chart = echarts.init(velocityChartRef.current);
      
      // Calculate velocity metrics
      const velocityData = userStoriesData.map((story, index) => {
        const testCases = testCasesData[index].test_case_count;
        const stories = story.story_count;
        const velocity = stories > 0 ? (testCases / stories).toFixed(2) : 0;
        
        return {
          release: story.release_name,
          velocity: parseFloat(velocity),
          stories: stories,
          testCases: testCases
        };
      });

      const option = {
        backgroundColor: '#fafafa',
        title: {
          text: 'Testing Velocity & Efficiency',
          subtext: 'Test Cases per User Story Ratio',
          left: 30,
          top: 20,
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#2c3e50'
          },
          subtextStyle: {
            fontSize: 14,
            color: '#7f8c8d'
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 20,
          formatter: function(params) {
            const data = params[0];
            const velocityInfo = velocityData[data.dataIndex];
            
            return `
              <div style="font-weight: bold; font-size: 16px; margin-bottom: 12px; color: #2c3e50;">${data.name}</div>
              <div style="margin-bottom: 8px;">
                <span style="color: #666;">Velocity Ratio: </span>
                <span style="font-size: 24px; font-weight: bold; color: #9c27b0;">${data.value}:1</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span style="color: #666;">User Stories: </span>
                <span style="font-weight: bold;">${velocityInfo.stories}</span>
              </div>
              <div>
                <span style="color: #666;">Test Cases: </span>
                <span style="font-weight: bold;">${velocityInfo.testCases}</span>
              </div>
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;">
                <span style="color: #666; font-size: 12px;">
                  ${data.value > 3 ? 'Excellent Coverage' : data.value > 2 ? 'Good Coverage' : 'Needs Improvement'}
                </span>
              </div>
            `;
          }
        },
        grid: {
          left: 80,
          right: 40,
          bottom: 80,
          top: 120,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: velocityData.map(v => v.release),
          axisLabel: {
            rotate: 45,
            fontSize: 13,
            color: '#666',
            fontWeight: 500
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0',
              width: 2
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: 'Test Cases per Story',
          nameLocation: 'middle',
          nameGap: 60,
          nameTextStyle: {
            color: '#666',
            fontSize: 16,
            fontWeight: 600
          },
          axisLabel: {
            color: '#666',
            fontSize: 12,
            formatter: '{value}:1'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#e0e0e0',
              width: 2
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          }
        },
        series: [{
          type: 'bar',
          data: velocityData.map(v => ({
            value: v.velocity,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#9c27b0' },
                { offset: 1, color: '#e91e63' }
              ]),
              borderRadius: [4, 4, 0, 0],
              shadowColor: 'rgba(156, 39, 176, 0.3)',
              shadowBlur: 10
            }
          })),
          barWidth: '60%',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}:1',
            fontSize: 12,
            fontWeight: 'bold',
            color: '#666'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetY: -5
            }
          }
        }]
      };
      chart.setOption(option);
    }

    // Handle window resize for all charts
    const handleResize = () => {
      [userStoriesChartRef, testCasesChartRef, growthChartRef, comparisonChartRef, heatmapChartRef, velocityChartRef].forEach(ref => {
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

      {/* Enhanced Control Box */}
      <div className="bg-white rounded-lg shadow-lg p-5 mx-6 mt-6 mb-6 border border-gray-100">
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

      {/* Charts Grid with Enhanced Layout */}
      {chartsData.userStories && chartsData.testCases && (
        <div className="px-6 pb-6">
          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* User Stories Chart */}
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div ref={userStoriesChartRef} style={{ width: '100%', height: '450px' }} />
            </div>

            {/* Test Cases Chart */}
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div ref={testCasesChartRef} style={{ width: '100%', height: '450px' }} />
            </div>
          </div>

          {/* Analysis Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Growth Chart */}
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div ref={growthChartRef} style={{ width: '100%', height: '450px' }} />
            </div>

            {/* Comparison Chart */}
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div ref={comparisonChartRef} style={{ width: '100%', height: '450px' }} />
            </div>
          </div>

          {/* Advanced Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Release Health Heatmap */}
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div ref={heatmapChartRef} style={{ width: '100%', height: '450px' }} />
            </div>

            {/* Velocity Chart */}
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div ref={velocityChartRef} style={{ width: '100%', height: '450px' }} />
            </div>
          </div>
        </div>
      )}

      {/* Empty State - Enhanced Design */}
      {!chartsData.userStories && !chartsData.testCases && !loading && (
        <div className="bg-white rounded-lg shadow-lg p-20 mx-6 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full mb-6">
            <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Data to Display</h3>
          <p className="text-gray-600 text-lg">Select a project and click "Insight" to view comprehensive analytics</p>
        </div>
      )}
    </div>
  );
};

export default ProgressInsights;