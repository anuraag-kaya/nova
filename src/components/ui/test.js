"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronDownIcon, CalendarIcon, UsersIcon, TrendingUpIcon } from '@heroicons/react/24/outline';

const TeamTracker = () => {
  // Core state
  const [projects, setProjects] = useState([]);
  const [releases, setReleases] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' | 'daily'
  const [teamData, setTeamData] = useState(null);
  
  // Loading states
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingReleases, setLoadingReleases] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  
  // UI state
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [releaseDropdownOpen, setReleaseDropdownOpen] = useState(false);

  // Generate date columns based on view mode
  const dateColumns = useMemo(() => {
    const today = new Date();
    const columns = [];
    
    if (viewMode === 'daily') {
      // Last 16 days including today
      for (let i = 0; i < 16; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        columns.push({
          key: `day-${i}`,
          label: date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            day: '2-digit', 
            month: 'short' 
          }),
          fullDate: date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          dateKey: date.toISOString().split('T')[0]
        });
      }
    } else {
      // Last 13 weeks including current week
      for (let i = 0; i < 13; i++) {
        const weekStart = new Date(today);
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek - (i * 7);
        weekStart.setDate(diff);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        columns.push({
          key: `week-${i}`,
          label: `Week of ${weekStart.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}`,
          fullDate: `${weekStart.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric' 
          })} - ${weekEnd.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}`,
          dateKey: `${weekStart.toISOString().split('T')[0]}_${weekEnd.toISOString().split('T')[0]}`
        });
      }
    }
    
    return columns;
  }, [viewMode]);

  // Mock API calls - Replace with actual API endpoints
  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockProjects = Array.from({ length: 45 }, (_, i) => ({
        id: `proj-${i + 1}`,
        name: `Project ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
        description: `Enterprise project for team ${i + 1}`
      }));
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  const fetchReleases = useCallback(async (projectId) => {
    if (!projectId) return;
    
    setLoadingReleases(true);
    setSelectedRelease(null);
    setReleases([]);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockReleases = Array.from({ length: 8 }, (_, i) => ({
        id: `rel-${projectId}-${i + 1}`,
        name: `Release ${projectId.split('-')[1]}.${i + 1}`,
        version: `v${i + 1}.0.0`,
        status: i === 0 ? 'current' : 'completed'
      }));
      
      setReleases(mockReleases);
    } catch (error) {
      console.error('Failed to fetch releases:', error);
    } finally {
      setLoadingReleases(false);
    }
  }, []);

  const fetchTeamData = useCallback(async () => {
    if (!selectedProject || !selectedRelease) return;
    
    setLoadingData(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generate mock team data
      const mockUsers = [
        { id: 'u1', created_user: 'sarah.chen', full_name: 'Sarah Chen' },
        { id: 'u2', created_user: 'mike.rodriguez', full_name: 'Mike Rodriguez' },
        { id: 'u3', created_user: 'priya.patel', full_name: 'Priya Patel' },
        { id: 'u4', created_user: 'david.kim', full_name: 'David Kim' },
        { id: 'u5', created_user: 'anna.mueller', full_name: 'Anna Mueller' },
        { id: 'u6', created_user: 'james.wilson', full_name: 'James Wilson' },
        { id: 'u7', created_user: 'lisa.zhang', full_name: 'Lisa Zhang' },
        { id: 'u8', created_user: 'alex.thompson', full_name: 'Alex Thompson' }
      ];
      
      const teamDataWithCounts = mockUsers.map(user => {
        const userData = { ...user };
        dateColumns.forEach(col => {
          // Generate realistic test case counts (0-15, weighted toward lower numbers)
          const rand = Math.random();
          let count = 0;
          if (rand > 0.3) count = Math.floor(Math.random() * 6); // 0-5
          if (rand > 0.7) count = Math.floor(Math.random() * 10); // 0-9
          if (rand > 0.9) count = Math.floor(Math.random() * 15); // 0-14
          
          userData[col.dateKey] = count;
        });
        return userData;
      });
      
      setTeamData(teamDataWithCounts);
    } catch (error) {
      console.error('Failed to fetch team data:', error);
    } finally {
      setLoadingData(false);
    }
  }, [selectedProject, selectedRelease, dateColumns]);

  // Initialize projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Fetch releases when project changes
  useEffect(() => {
    if (selectedProject) {
      fetchReleases(selectedProject.id);
    }
  }, [selectedProject, fetchReleases]);

  // Calculate totals for summary
  const summaryStats = useMemo(() => {
    if (!teamData || teamData.length === 0) return null;
    
    const totalTests = teamData.reduce((sum, user) => {
      return sum + dateColumns.reduce((userSum, col) => {
        return userSum + (user[col.dateKey] || 0);
      }, 0);
    }, 0);
    
    const activeUsers = teamData.filter(user => {
      return dateColumns.some(col => (user[col.dateKey] || 0) > 0);
    }).length;
    
    const avgPerUser = activeUsers > 0 ? Math.round(totalTests / activeUsers) : 0;
    
    return {
      totalTests,
      activeUsers,
      avgPerUser,
      period: viewMode === 'daily' ? '16 days' : '13 weeks'
    };
  }, [teamData, dateColumns, viewMode]);

  const canFetchData = selectedProject && selectedRelease;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                <UsersIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Team Tracker</h1>
                <p className="text-sm text-gray-500">Test case creation activity by team members</p>
              </div>
            </div>
            
            {summaryStats && (
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{summaryStats.totalTests}</div>
                  <div className="text-gray-500">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{summaryStats.activeUsers}</div>
                  <div className="text-gray-500">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{summaryStats.avgPerUser}</div>
                  <div className="text-gray-500">Avg per User</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Project Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Project</label>
              <div className="relative">
                <button
                  onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                  disabled={loadingProjects}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    loadingProjects ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                >
                  <span className={selectedProject ? 'text-gray-900' : 'text-gray-500'}>
                    {loadingProjects ? 'Loading projects...' : selectedProject?.name || 'Choose a project'}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${projectDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {projectDropdownOpen && !loadingProjects && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setSelectedProject(project);
                          setProjectDropdownOpen(false);
                          setTeamData(null);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      >
                        <div className="font-medium text-gray-900">{project.name}</div>
                        <div className="text-xs text-gray-500">{project.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Release Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Release</label>
              <div className="relative">
                <button
                  onClick={() => setReleaseDropdownOpen(!releaseDropdownOpen)}
                  disabled={!selectedProject || loadingReleases}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    !selectedProject || loadingReleases ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                >
                  <span className={selectedRelease ? 'text-gray-900' : 'text-gray-500'}>
                    {loadingReleases ? 'Loading releases...' : selectedRelease?.name || 'Choose a release'}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${releaseDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {releaseDropdownOpen && !loadingReleases && releases.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {releases.map((release) => (
                      <button
                        key={release.id}
                        onClick={() => {
                          setSelectedRelease(release);
                          setReleaseDropdownOpen(false);
                          setTeamData(null);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      >
                        <div className="font-medium text-gray-900">{release.name}</div>
                        <div className="text-xs text-gray-500">{release.version} • {release.status}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">View Mode</label>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('weekly')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    viewMode === 'weekly' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setViewMode('daily')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    viewMode === 'daily' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Daily
                </button>
              </div>
            </div>

            {/* Fetch Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 opacity-0">Action</label>
              <button
                onClick={fetchTeamData}
                disabled={!canFetchData || loadingData}
                className={`w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  canFetchData && !loadingData
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loadingData ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Fetch Data'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {teamData && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Test Case Creation Activity
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {viewMode === 'daily' ? 'Last 16 days' : 'Last 13 weeks'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                      Team Member
                    </th>
                    {dateColumns.map((col) => (
                      <th 
                        key={col.key}
                        className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[80px]"
                        title={col.fullDate}
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamData.map((user, index) => {
                    const userTotal = dateColumns.reduce((sum, col) => sum + (user[col.dateKey] || 0), 0);
                    
                    return (
                      <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-inherit z-10">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                            <div className="text-xs text-gray-500">@{user.created_user}</div>
                          </div>
                        </td>
                        {dateColumns.map((col) => {
                          const count = user[col.dateKey] || 0;
                          return (
                            <td key={col.key} className="px-4 py-4 text-center">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                                count === 0 
                                  ? 'text-gray-400' 
                                  : count <= 3 
                                    ? 'bg-green-100 text-green-800'
                                    : count <= 7
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-purple-100 text-purple-800'
                              }`}>
                                {count}
                              </span>
                            </td>
                          );
                        })}
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-10 h-8 rounded-lg bg-gray-100 text-sm font-bold text-gray-900">
                            {userTotal}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!teamData && !loadingData && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <TrendingUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Track Team Activity</h3>
            <p className="text-gray-500 mb-6">
              Select a project and release, then click "Fetch Data" to view test case creation metrics.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>1-3 test cases</span>
              <div className="w-2 h-2 bg-blue-400 rounded-full ml-4"></div>
              <span>4-7 test cases</span>
              <div className="w-2 h-2 bg-purple-400 rounded-full ml-4"></div>
              <span>8+ test cases</span>
            </div>
          </div>
        )}
      </div>

      {/* Click outside handlers */}
      {(projectDropdownOpen || releaseDropdownOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setProjectDropdownOpen(false);
            setReleaseDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default TeamTracker;