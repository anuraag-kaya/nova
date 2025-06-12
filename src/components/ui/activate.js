"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';

export default function Analytics() {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Form state
  const [projects, setProjects] = useState([]);
  const [releases, setReleases] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingReleases, setLoadingReleases] = useState(false);
  const [error, setError] = useState(null);
  
  // Report state
  const [reportData, setReportData] = useState({
    lastRefresh: null,
    unmappedUserStories: [],
    unmappedTestCases: [],
    countNullValues: [],
    noStepsExpectedResults: [],
    emptyTestSteps: [],
    emptyExpectedResults: []
  });
  const [loadingGenerateReport, setLoadingGenerateReport] = useState(false);
  const [loadingViewReport, setLoadingViewReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportViewed, setReportViewed] = useState(false);
  
  // Tab and pagination state
  const [activeTab, setActiveTab] = useState('unmappedUserStories');
  const [currentPages, setCurrentPages] = useState({
    unmappedUserStories: 1,
    unmappedTestCases: 1,
    countNullValues: 1,
    noStepsExpectedResults: 1,
    emptyTestSteps: 1,
    emptyExpectedResults: 1
  });
  const recordsPerPage = 25;
  
  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Welcome to ASTRA Analytics",
      message: "Select a project and release to generate comprehensive reports",
      date: new Date().toLocaleString(),
      read: false,
      type: "info"
    }
  ]);
  const [unreadNotifications, setUnreadNotifications] = useState(1);

  // Tab configuration
  const tabs = [
    { id: 'unmappedUserStories', label: 'Unmapped User Stories', icon: '📋' },
    { id: 'unmappedTestCases', label: 'Unmapped Test Cases', icon: '🧪' },
    { id: 'countNullValues', label: 'Count Null Values', icon: '🔍' },
    { id: 'noStepsExpectedResults', label: 'No Steps Expected Results', icon: '⚠️' },
    { id: 'emptyTestSteps', label: 'Empty Test Steps', icon: '📝' },
    { id: 'emptyExpectedResults', label: 'Empty Expected Results', icon: '❌' }
  ];

  // Button enable states
  const isProjectSelected = !!selectedProject;
  const isReleaseSelected = !!selectedRelease;
  const isGenerateReportEnabled = isProjectSelected && isReleaseSelected && !loadingGenerateReport && !loadingViewReport;
  const isViewReportEnabled = reportGenerated && !loadingGenerateReport && !loadingViewReport;

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadNotifications(count);
  }, [notifications]);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Reset states when project changes
  useEffect(() => {
    if (selectedProject) {
      setSelectedRelease(null);
      setReleases([]);
      setReportGenerated(false);
      setReportViewed(false);
      setReportData({
        lastRefresh: null,
        unmappedUserStories: [],
        unmappedTestCases: [],
        countNullValues: [],
        noStepsExpectedResults: [],
        emptyTestSteps: [],
        emptyExpectedResults: []
      });
    }
  }, [selectedProject]);

  // Reset report states when release changes
  useEffect(() => {
    if (selectedRelease) {
      setReportGenerated(false);
      setReportViewed(false);
      setReportData({
        lastRefresh: null,
        unmappedUserStories: [],
        unmappedTestCases: [],
        countNullValues: [],
        noStepsExpectedResults: [],
        emptyTestSteps: [],
        emptyExpectedResults: []
      });
    }
  }, [selectedRelease]);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    setError(null);
    
    try {
      const response = await fetch('/api/zephyr-data/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data || []);
    } catch (err) {
      setError('Failed to load projects. Please try again.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchReleases = async (projectId) => {
    setLoadingReleases(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/zephyr-data/releases/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch releases');
      }
      const data = await response.json();
      setReleases(data || []);
    } catch (err) {
      setError('Failed to load releases. Please try again.');
      console.error('Error fetching releases:', err);
      setReleases([]);
    } finally {
      setLoadingReleases(false);
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    
    if (project) {
      fetchReleases(project.id);
    }
  };

  const handleReleaseSelect = (release) => {
    setSelectedRelease(release);
  };

  // Step 1: Generate Report (Only latest-report API)
  const handleGenerateReport = async () => {
    if (!selectedProject || !selectedRelease) return;
    
    setLoadingGenerateReport(true);
    setError(null);
    
    try {
      const projectId = selectedProject.id;
      const releaseId = selectedRelease.id;
      
      // Call only the latest-report API
      const latestReportResponse = await fetch(`/api/zephyr-data/latest-report/${projectId}/${releaseId}`);
      const latestReport = latestReportResponse.ok ? await latestReportResponse.json() : null;

      // Update only the lastRefresh timestamp
      setReportData(prev => ({
        ...prev,
        lastRefresh: latestReport?.created_at || new Date().toISOString()
      }));

      setReportGenerated(true);

      // Add notification for successful report generation
      const newNotification = {
        id: Date.now(),
        title: "Report Generated",
        message: `Report generated for ${selectedProject.name} - ${selectedRelease.name}. Click "View Report" to see details.`,
        date: new Date().toLocaleString(),
        read: false,
        type: "success"
      };
      setNotifications(prev => [newNotification, ...prev]);
      
    } catch (err) {
      setError('Failed to generate report. Please try again.');
      console.error('Error generating report:', err);
    } finally {
      setLoadingGenerateReport(false);
    }
  };

  // Step 2: View Report (All 6 data APIs)
  const handleViewReport = async () => {
    if (!selectedProject || !selectedRelease || !reportGenerated) return;
    
    setLoadingViewReport(true);
    setError(null);
    
    try {
      const projectId = selectedProject.id;
      const releaseId = selectedRelease.id;
      
      // Call all 6 data APIs simultaneously
      const [
        unmappedUserStoriesResponse,
        unmappedTestCasesResponse,
        countNullValuesResponse,
        noStepsExpectedResultsResponse,
        emptyTestStepsResponse,
        emptyExpectedResultsResponse
      ] = await Promise.all([
        fetch(`/api/zephyr-data/unmapped-user-stories/${projectId}/${releaseId}`),
        fetch(`/api/zephyr-data/unmapped-test-cases/${projectId}/${releaseId}`),
        fetch(`/api/zephyr-data/count-null-values/${projectId}/${releaseId}`),
        fetch(`/api/zephyr-data/no-steps-expected-results/${projectId}/${releaseId}`),
        fetch(`/api/zephyr-data/empty-test-steps/${projectId}/${releaseId}`),
        fetch(`/api/zephyr-data/empty-expected-results/${projectId}/${releaseId}`)
      ]);

      // Parse responses
      const unmappedUserStories = unmappedUserStoriesResponse.ok ? await unmappedUserStoriesResponse.json() : [];
      const unmappedTestCases = unmappedTestCasesResponse.ok ? await unmappedTestCasesResponse.json() : [];
      const countNullValues = countNullValuesResponse.ok ? await countNullValuesResponse.json() : [];
      const noStepsExpectedResults = noStepsExpectedResultsResponse.ok ? await noStepsExpectedResultsResponse.json() : [];
      const emptyTestSteps = emptyTestStepsResponse.ok ? await emptyTestStepsResponse.json() : [];
      const emptyExpectedResults = emptyExpectedResultsResponse.ok ? await emptyExpectedResultsResponse.json() : [];

      // Update state with all report data
      setReportData(prev => ({
        ...prev, // Keep the lastRefresh from generate step
        unmappedUserStories: unmappedUserStories || [],
        unmappedTestCases: unmappedTestCases || [],
        countNullValues: countNullValues || [],
        noStepsExpectedResults: noStepsExpectedResults || [],
        emptyTestSteps: emptyTestSteps || [],
        emptyExpectedResults: emptyExpectedResults || []
      }));

      setReportViewed(true);

      // Add notification for successful report viewing
      const newNotification = {
        id: Date.now(),
        title: "Report Data Loaded",
        message: `All analytics data loaded for ${selectedProject.name} - ${selectedRelease.name}`,
        date: new Date().toLocaleString(),
        read: false,
        type: "success"
      };
      setNotifications(prev => [newNotification, ...prev]);
      
    } catch (err) {
      setError('Failed to load report data. Please try again.');
      console.error('Error loading report data:', err);
    } finally {
      setLoadingViewReport(false);
    }
  };

  // Pagination functions
  const getCurrentPageData = (data, page) => {
    const startIndex = (page - 1) * recordsPerPage;
    return data.slice(startIndex, startIndex + recordsPerPage);
  };

  const getTotalPages = (data) => {
    return Math.ceil(data.length / recordsPerPage);
  };

  const handlePageChange = (tabId, newPage) => {
    setCurrentPages(prev => ({
      ...prev,
      [tabId]: newPage
    }));
  };

  // Format date function
  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (err) {
      return dateString;
    }
  };

  // Pagination Component
  const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50 border-t">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {((currentPage - 1) * recordsPerPage) + 1} to {Math.min(currentPage * recordsPerPage, totalPages * recordsPerPage)} of {totalPages * recordsPerPage} entries
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Previous
          </button>
          
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : typeof page === 'number'
                    ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    : 'text-gray-400 cursor-default'
              }`}
              disabled={typeof page !== 'number'}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // Enhanced Data Table Component with Pagination
  const DataTable = ({ data, tabId }) => {
    const currentPage = currentPages[tabId];
    const totalPages = getTotalPages(data);
    const currentData = getCurrentPageData(data, currentPage);

    if (!data || data.length === 0) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500">No records found for this report.</p>
          </div>
        </div>
      );
    }

    const columns = Object.keys(data[0] || {});

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {tabs.find(tab => tab.id === tabId)?.label || 'Report'}
            </h3>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {data.length} total records
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {row[column] !== null && row[column] !== undefined 
                        ? String(row[column]) 
                        : '-'
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => handlePageChange(tabId, newPage)}
        />
      </div>
    );
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };
  
  const closeNotifications = () => {
    setShowNotifications(false);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadNotifications(0);
  };

  // Custom Dropdown Component
  const CustomDropdown = ({ 
    label, 
    options, 
    selected, 
    onSelect, 
    disabled, 
    loading, 
    placeholder,
    icon 
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <button
            type="button"
            className={`w-full px-4 py-2 text-left bg-white border rounded-lg shadow-sm transition-all ${
              disabled 
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                : isOpen
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : 'border-gray-300 hover:border-blue-400'
            }`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled || loading}
          >
            <div className="flex items-center justify-between">
              <span className={`block truncate ${selected ? 'text-gray-900' : 'text-gray-500'}`}>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  selected?.name || placeholder
                )}
              </span>
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {isOpen && !disabled && !loading && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-center">
                  No options available
                </div>
              ) : (
                options.map((option, index) => (
                  <button
                    key={option.id || index}
                    type="button"
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                      selected?.id === option.id ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`}
                    onClick={() => {
                      onSelect(option);
                      setIsOpen(false);
                    }}
                  >
                    {option.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Notifications component
  const NotificationsDropdown = () => (
    showNotifications && (
      <div className="absolute right-12 top-20 w-96 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 max-h-80vh">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            Notifications
            {unreadNotifications > 0 && (
              <span className="ml-2 text-sm bg-blue-500 text-white rounded-full px-2 py-0.5">
                {unreadNotifications}
              </span>
            )}
          </h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={clearAllNotifications}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              Clear all
            </button>
            <button 
              onClick={closeNotifications}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.3 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-64">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer relative transition-colors ${
                  notification.read ? 'bg-gray-50' : ''
                }`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium pr-6 text-gray-900 flex items-center">
                    {notification.type === "success" && (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    {notification.type === "info" && (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-500 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    {notification.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-2 font-medium">{notification.date}</p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-gray-500">No new notifications</p>
            </div>
          )}
        </div>
      </div>
    )
  );

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Header */}
      <header className={`flex justify-between items-center px-4 py-2 h-20 shadow-md ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}>
        {/* Logo */}
        <div className="flex items-center ml-5">
          <div className="flex items-center">
            <img 
              src="/citi-logo.png" 
              alt="Citi" 
              className="h-8 w-auto" 
            />
            <span className="ml-5 text-[26px] font-medium text-black font-roboto flex items-center mt-[10px]">
              ASTRA
            </span>
          </div>
        </div>

        {/* Header Buttons */}
        <div className="flex items-center space-x-3">
          {/* Notification Icon with badge */}
          <div className="relative">
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              onClick={handleNotificationClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
              </svg>
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-[#d62d20] rounded-full text-white text-xs flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>

          {/* Profile Button */}
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div className="w-8 h-8 rounded-full bg-teal-400 flex items-center justify-center text-white font-medium">
              A
            </div>
          </button>
        </div>
      </header>

      {/* Menu Bar */}
      <div className="bg-[#f0f5f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.07)] relative z-10 border-b border-gray-200">
        <div className="pl-4">
          <nav className="flex h-10">
            <Link href="/">
              <div className={`px-5 py-2 text-[15px] font-medium ${pathname === "/" ? "text-[#0057e7] border-b-2 border-[#0057e7]" : "text-[#0f2d91] hover:text-[#0057e7] border-b-2 border-transparent"} transition-colors cursor-pointer`}>
                Home
              </div>
            </Link>
            <Link href="/studio">
              <div className={`px-5 py-2 text-[15px] font-medium ${pathname === "/studio" ? "text-[#0057e7] border-b-2 border-[#0057e7]" : "text-[#0f2d91] hover:text-[#0057e7] border-b-2 border-transparent"} transition-colors cursor-pointer`}>
                Studio
              </div>
            </Link>
            <Link href="/analytics">
              <div className={`px-5 py-2 text-[15px] font-medium ${pathname === "/analytics" ? "text-[#0057e7] border-b-2 border-[#0057e7]" : "text-[#0f2d91] hover:text-[#0057e7] border-b-2 border-transparent"} transition-colors cursor-pointer`}>
                Analytics
              </div>
            </Link>
            <Link href="#">
              <div className="px-5 py-2 text-[15px] font-medium text-gray-400 border-b-2 border-transparent cursor-not-allowed">
                Documentation
              </div>
            </Link>
          </nav>
        </div>
      </div>

      {/* Notifications Dropdown */}
      <NotificationsDropdown />

      {/* Profile Menu */}
      {showProfileMenu && (
        <div 
          className="fixed right-4 top-12 w-48 bg-white shadow-xl rounded-md z-50 border border-gray-200 overflow-hidden"
          style={{ position: 'absolute', top: '60px', right: '10px' }}
        >
          <div className="py-1">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors">
              <span>👤</span> Guest
            </button>
            <Link href="/settings">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors">
                <span>⚙️</span> Settings
              </button>
            </Link>
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <span>{darkMode ? "☀️" : "🌙"}</span> {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors">
              <span>❓</span> Help & Support
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button className="w-full text-left px-4 py-2 text-sm text-[#d62d20] hover:bg-[#d62d20]/10 flex items-center gap-2 transition-colors">
              <span>🚪</span> Sign out
            </button>
          </div>
        </div>
      )}

      {/* Overlay for profile menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 bg-transparent z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}

      {/* Control Bar - Progressive Enable Flow */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-end gap-6">
          {/* Project Dropdown - Always Enabled */}
          <div className="flex-1 max-w-xs">
            <CustomDropdown
              label="Select Project"
              options={projects}
              selected={selectedProject}
              onSelect={handleProjectSelect}
              disabled={false}
              loading={loadingProjects}
              placeholder="Choose a project..."
            />
          </div>

          {/* Release Dropdown - Enabled only after project selection */}
          <div className="flex-1 max-w-xs">
            <CustomDropdown
              label="Select Release"
              options={releases}
              selected={selectedRelease}
              onSelect={handleReleaseSelect}
              disabled={!isProjectSelected}
              loading={loadingReleases}
              placeholder={isProjectSelected ? "Choose a release..." : "Select a project first"}
            />
          </div>

          {/* Generate Report Button - Enabled after both selections */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2 opacity-0">
              Action
            </label>
            <button
              onClick={handleGenerateReport}
              disabled={!isGenerateReportEnabled}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isGenerateReportEnabled
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loadingGenerateReport ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Generating...
                </div>
              ) : (
                'Generate Report'
              )}
            </button>
          </div>

          {/* View Report Button - Enabled after generate report */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2 opacity-0">
              View
            </label>
            <button
              onClick={handleViewReport}
              disabled={!isViewReportEnabled}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isViewReportEnabled
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loadingViewReport ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Loading...
                </div>
              ) : (
                'View Report'
              )}
            </button>
          </div>

          {/* Last Refresh Info - Shows after generate */}
          {reportGenerated && reportData.lastRefresh && (
            <div className="flex flex-col justify-end">
              <div className="text-xs text-gray-500 bg-green-50 border border-green-200 rounded px-3 py-2 whitespace-nowrap">
                <span className="mr-1">🕒</span>
                Generated: {formatDateTime(reportData.lastRefresh)}
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Main Content - Reports with Tabs (Only show when report is viewed) */}
      {reportViewed && (
        <div className="flex-1 bg-gray-50">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-6">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2 text-lg">{tab.icon}</span>
                    {tab.label}
                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      {reportData[tab.id]?.length || 0}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <DataTable 
              data={reportData[activeTab]} 
              tabId={activeTab}
            />
          </div>
        </div>
      )}

      {/* Empty States */}
      {!reportGenerated && (
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-8xl mb-6">📊</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Generate Analytics</h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              {!isProjectSelected 
                ? "Select a project to begin generating your analytics report."
                : !isReleaseSelected
                  ? "Select a release to continue with report generation."
                  : "Click 'Generate Report' to create your analytics report."
              }
            </p>
          </div>
        </div>
      )}

      {reportGenerated && !reportViewed && (
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-green-500 text-8xl mb-6">✅</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Report Generated Successfully</h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto mb-6">
              Your analytics report has been generated for {selectedProject?.name} - {selectedRelease?.name}.
            </p>
            <p className="text-base text-gray-500">
              Click "View Report" to load and display the detailed analytics data.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-[#222222] text-white text-center p-2 flex justify-between items-center border-t border-gray-800">
        <div className="text-xs text-gray-400 ml-4">v0.9.0</div>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
          <span className="mr-2 text-sm font-medium text-gray-300">Powered by</span>
          <a href="https://kayatech.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src="/converted_image.png" alt="Kaya Logo" className="h-3" />
          </a>
        </div>
        <div className="text-xs text-gray-400 mr-4">© 2025 KAYA Global Inc.</div>
      </footer>
    </div>
  );
}