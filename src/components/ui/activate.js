"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { exportToExcel, exportAllToCSV } from "./utils/exportUtils";

export default function Analytics() {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);
  
  // Left panel states
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [isExecutiveExpanded, setIsExecutiveExpanded] = useState(false);
  const [isOperationalExpanded, setIsOperationalExpanded] = useState(true);
  
  // Operational tool selection
  const [selectedTool, setSelectedTool] = useState(null);
  
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
  
  // View state
  const [viewMode, setViewMode] = useState('table');
  
  // Tab and pagination state
  const [activeTab, setActiveTab] = useState('emptyExpectedResults');
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
      message: "Select a tool from the Operational section to begin",
      date: new Date().toLocaleString(),
      read: false,
      type: "info"
    }
  ]);
  const [unreadNotifications, setUnreadNotifications] = useState(1);

  // Tab configuration
  const tabs = [
    { id: 'unmappedUserStories', label: 'Unmapped User Stories', icon: '📋', color: '#3B82F6' },
    { id: 'unmappedTestCases', label: 'Unmapped Test Cases', icon: '🧪', color: '#10B981' },
    { id: 'countNullValues', label: 'Count Null Values', icon: '🔍', color: '#F59E0B' },
    { id: 'noStepsExpectedResults', label: 'No Steps Expected Results', icon: '⚠️', color: '#EF4444' },
    { id: 'emptyTestSteps', label: 'Empty Test Steps', icon: '📝', color: '#8B5CF6' },
    { id: 'emptyExpectedResults', label: 'Empty Expected Results', icon: '❌', color: '#EC4899' }
  ];

  // Operational tools configuration
  const operationalTools = [
    {
      id: 'JIRA',
      name: 'JIRA Analytics',
      description: 'Analyze JIRA project data',
      icon: '🛠️',
      color: 'from-blue-500 to-blue-600',
      bgHover: 'hover:from-blue-50/50',
      apiBase: '/api/jira-data'
    },
    {
      id: 'ZEPHYR',
      name: 'ZEPHYR Reports',
      description: 'Generate Zephyr test reports',
      icon: '⚡',
      color: 'from-purple-500 to-purple-600',
      bgHover: 'hover:from-purple-50/50',
      apiBase: 'https://dev1-ls-svc-d-automation.apps.namgcbgtd23d.ecs.dyn.nsroot.net'
    },
    {
      id: 'GAP_ANALYSIS',
      name: 'GAP Analysis',
      description: 'Identify testing gaps',
      icon: '📊',
      color: 'from-amber-500 to-amber-600',
      bgHover: 'hover:from-amber-50/50',
      apiBase: '/api/gap-analysis'
    }
  ];

  // Get current API base path based on selected tool
  const getApiBasePath = () => {
    const tool = operationalTools.find(t => t.id === selectedTool);
    return tool?.apiBase || '';
  };

  // Button enable states
  const isProjectSelected = !!selectedProject;
  const isReleaseSelected = !!selectedRelease;
  const isGenerateReportEnabled = isProjectSelected && isReleaseSelected && !loadingGenerateReport && !loadingViewReport;
  const isViewReportEnabled = reportGenerated && !loadingGenerateReport && !loadingViewReport;
  const isExportEnabled = reportViewed && reportData && Object.values(reportData).some(data => Array.isArray(data) && data.length > 0);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update unread count
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadNotifications(count);
  }, [notifications]);

  // Reset states when tool changes
  useEffect(() => {
    if (selectedTool) {
      setProjects([]);
      setReleases([]);
      setSelectedProject(null);
      setSelectedRelease(null);
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
      setError(null);
      fetchProjects();
      
      const tool = operationalTools.find(t => t.id === selectedTool);
      if (tool) {
        const newNotification = {
          id: Date.now(),
          title: `${tool.name} Selected`,
          message: `Now using ${tool.name}. Select a project and release to generate reports.`,
          date: new Date().toLocaleString(),
          read: false,
          type: "info"
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }
  }, [selectedTool]);

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
    if (!selectedTool) return;
    
    setLoadingProjects(true);
    setError(null);
    
    try {
      const apiBase = getApiBasePath();
      let url = '';
      
      if (selectedTool === 'ZEPHYR') {
        url = `${apiBase}/zephyr-data/projects`;
      } else {
        url = `${apiBase}/projects`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setProjects(data || []);
    } catch (err) {
      setError(`Failed to load projects: ${err.message}`);
      console.error('Error fetching projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchReleases = async (projectId) => {
    if (!selectedTool) return;
    
    setLoadingReleases(true);
    setError(null);
    
    try {
      const apiBase = getApiBasePath();
      let url = '';
      
      if (selectedTool === 'ZEPHYR') {
        url = `${apiBase}/zephyr-data/releases/${projectId}`;
      } else {
        url = `${apiBase}/releases/${projectId}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch releases: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setReleases(data || []);
    } catch (err) {
      setError(`Failed to load releases: ${err.message}`);
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

  const handleToolSelect = (toolId) => {
    setSelectedTool(toolId);
  };

  const handleGenerateReport = async () => {
    if (!selectedProject || !selectedRelease || !selectedTool) return;
    
    setLoadingGenerateReport(true);
    setError(null);
    
    try {
      const apiBase = getApiBasePath();
      const projectId = selectedProject.id;
      const releaseId = selectedRelease.id;
      
      let latestReportUrl = '';
      
      if (selectedTool === 'ZEPHYR') {
        latestReportUrl = `${apiBase}/zephyr-data/latest-report/${projectId}/${releaseId}`;
      } else {
        latestReportUrl = `${apiBase}/latest-report/${projectId}/${releaseId}`;
      }
      
      const latestReportResponse = await fetch(latestReportUrl);
      const latestReport = latestReportResponse.ok ? await latestReportResponse.json() : null;

      setReportData(prev => ({
        ...prev,
        lastRefresh: latestReport?.created_at || new Date().toISOString()
      }));

      setReportGenerated(true);

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
      setError(`Failed to generate report: ${err.message}`);
      console.error('Error generating report:', err);
    } finally {
      setLoadingGenerateReport(false);
    }
  };

  const handleViewReport = async () => {
    if (!selectedProject || !selectedRelease || !reportGenerated || !selectedTool) return;
    
    setLoadingViewReport(true);
    setError(null);
    
    try {
      const apiBase = getApiBasePath();
      const projectId = selectedProject.id;
      const releaseId = selectedRelease.id;
      
      let apiPromises = [];
      
      if (selectedTool === 'ZEPHYR') {
        apiPromises = [
          fetch(`${apiBase}/zephyr-data/unmapped-user-stories/${projectId}/${releaseId}`),
          fetch(`${apiBase}/zephyr-data/unmapped-test-cases/${projectId}/${releaseId}`),
          fetch(`${apiBase}/zephyr-data/count-null-values/${projectId}/${releaseId}`),
          fetch(`${apiBase}/zephyr-data/no-steps-expected-results/${projectId}/${releaseId}`),
          fetch(`${apiBase}/zephyr-data/empty-test-steps/${projectId}/${releaseId}`),
          fetch(`${apiBase}/zephyr-data/empty-expected-results/${projectId}/${releaseId}`)
        ];
      } else {
        apiPromises = [
          fetch(`${apiBase}/unmapped-user-stories/${projectId}/${releaseId}`),
          fetch(`${apiBase}/unmapped-test-cases/${projectId}/${releaseId}`),
          fetch(`${apiBase}/count-null-values/${projectId}/${releaseId}`),
          fetch(`${apiBase}/no-steps-expected-results/${projectId}/${releaseId}`),
          fetch(`${apiBase}/empty-test-steps/${projectId}/${releaseId}`),
          fetch(`${apiBase}/empty-expected-results/${projectId}/${releaseId}`)
        ];
      }
      
      const [
        unmappedUserStoriesResponse,
        unmappedTestCasesResponse,
        countNullValuesResponse,
        noStepsExpectedResultsResponse,
        emptyTestStepsResponse,
        emptyExpectedResultsResponse
      ] = await Promise.all(apiPromises);

      const parseResponse = async (response, name) => {
        if (!response.ok) {
          console.warn(`Failed to fetch ${name}: ${response.status} ${response.statusText}`);
          return [];
        }
        try {
          return await response.json();
        } catch (err) {
          console.warn(`Failed to parse ${name} response:`, err);
          return [];
        }
      };

      const unmappedUserStories = await parseResponse(unmappedUserStoriesResponse, 'unmapped user stories');
      const unmappedTestCases = await parseResponse(unmappedTestCasesResponse, 'unmapped test cases');
      const countNullValues = await parseResponse(countNullValuesResponse, 'count null values');
      const noStepsExpectedResults = await parseResponse(noStepsExpectedResultsResponse, 'no steps expected results');
      const emptyTestSteps = await parseResponse(emptyTestStepsResponse, 'empty test steps');
      const emptyExpectedResults = await parseResponse(emptyExpectedResultsResponse, 'empty expected results');

      setReportData(prev => ({
        ...prev,
        unmappedUserStories: unmappedUserStories || [],
        unmappedTestCases: unmappedTestCases || [],
        countNullValues: countNullValues || [],
        noStepsExpectedResults: noStepsExpectedResults || [],
        emptyTestSteps: emptyTestSteps || [],
        emptyExpectedResults: emptyExpectedResults || []
      }));

      setReportViewed(true);

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
      setError(`Failed to load report data: ${err.message}`);
      console.error('Error loading report data:', err);
    } finally {
      setLoadingViewReport(false);
    }
  };

  const handleExportToExcel = () => {
    if (!isExportEnabled) return;
    
    const metadata = {
      projectName: selectedProject.name.replace(/[/\\?%*:|"<>]/g, '-'),
      releaseName: selectedRelease.name.replace(/[/\\?%*:|"<>]/g, '-'),
      tabs: tabs
    };
    
    exportToExcel(reportData, metadata);
    setShowExportMenu(false);
    
    const newNotification = {
      id: Date.now(),
      title: "Export Successful",
      message: `Excel file exported with all ${tabs.length} tabs`,
      date: new Date().toLocaleString(),
      read: false,
      type: "success"
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleExportToCSV = () => {
    if (!isExportEnabled) return;
    
    const metadata = {
      projectName: selectedProject.name.replace(/[/\\?%*:|"<>]/g, '-'),
      releaseName: selectedRelease.name.replace(/[/\\?%*:|"<>]/g, '-'),
      tabs: tabs
    };
    
    exportAllToCSV(reportData, metadata);
    setShowExportMenu(false);
    
    const newNotification = {
      id: Date.now(),
      title: "Export Successful",
      message: `${tabs.length} CSV files exported`,
      date: new Date().toLocaleString(),
      read: false,
      type: "success"
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

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
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={dropdownRef}>
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

  const ExportDropdown = () => (
    <div className="relative" ref={exportMenuRef}>
      <button
        onClick={() => setShowExportMenu(!showExportMenu)}
        disabled={!isExportEnabled}
        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center ${
          isExportEnabled
            ? 'bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
        <svg 
          className={`w-4 h-4 ml-1 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showExportMenu && isExportEnabled && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
          <button
            onClick={handleExportToExcel}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to Excel (.xlsx)
          </button>
          <button
            onClick={handleExportToCSV}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center border-t border-gray-100"
          >
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to CSV
          </button>
        </div>
      )}
    </div>
  );

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
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
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
                    {notification.type === "error" && (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-red-500 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0016 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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

  const BeautifulPanel = () => (
    <div 
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isPanelCollapsed ? 'w-14' : 'w-80'
      } flex flex-col shadow-sm relative`}
      style={{ 
        minWidth: isPanelCollapsed ? '56px' : '320px',
        maxWidth: isPanelCollapsed ? '56px' : '320px'
      }}
    >
      <div className={`flex items-center justify-between h-14 px-4 bg-white border-b border-gray-200 ${
        isPanelCollapsed ? 'px-2' : 'px-5'
      }`}>
        {!isPanelCollapsed && (
          <>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-700 tracking-wide">
                ANALYTICS SUITE
              </span>
            </div>
            <button
              onClick={() => setIsPanelCollapsed(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
              aria-label="Collapse panel"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" className="text-gray-500">
                <path fill="currentColor" d="M11 8L6 13V3z" />
              </svg>
            </button>
          </>
        )}
        {isPanelCollapsed && (
          <button
            onClick={() => setIsPanelCollapsed(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 mx-auto"
            aria-label="Expand panel"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" className="text-gray-500">
              <path fill="currentColor" d="M5 8L10 3v10z" />
            </svg>
          </button>
        )}
      </div>

      {!isPanelCollapsed && (
        <div className="flex-grow overflow-y-auto">
          <div className="border-b border-gray-100">
            <button
              onClick={() => setIsExecutiveExpanded(!isExecutiveExpanded)}
              className="w-full flex items-center px-5 py-4 hover:bg-gray-50 transition-all duration-200"
            >
              <div className={`mr-3 transition-transform duration-200 ${isExecutiveExpanded ? 'rotate-90' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                  <path fill="currentColor" d="M8 6l4 4-4 4z" />
                </svg>
              </div>
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-2xl">💼</span>
                <span className="text-sm font-medium text-gray-700">
                  EXECUTIVE
                </span>
              </div>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                isExecutiveExpanded ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-5 pl-14 py-3">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Executive dashboards coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-100">
            <button
              onClick={() => setIsOperationalExpanded(!isOperationalExpanded)}
              className="w-full flex items-center px-5 py-4 hover:bg-gray-50 transition-all duration-200"
            >
              <div className={`mr-3 transition-transform duration-200 ${isOperationalExpanded ? 'rotate-90' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                  <path fill="currentColor" d="M8 6l4 4-4 4z" />
                </svg>
              </div>
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-2xl">🗂</span>
                <span className="text-sm font-medium text-gray-700">
                  OPERATIONAL
                </span>
              </div>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                isOperationalExpanded ? 'max-h-[500px]' : 'max-h-0'
              }`}
            >
              <div className="px-5 pl-14 py-3 space-y-2">
                {operationalTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolSelect(tool.id)}
                    className={`w-full relative overflow-hidden rounded-xl border transition-all duration-200 ${
                      selectedTool === tool.id
                        ? 'bg-gradient-to-br from-white to-gray-50 border-gray-300 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selectedTool === tool.id && (
                      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600" />
                    )}
                    
                    <div className="relative z-10 p-4 flex items-center space-x-3">
                      <span className="text-3xl">{tool.icon}</span>
                      <div className="flex-1 text-left">
                        <h4 className={`text-sm font-semibold ${
                          selectedTool === tool.id ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {tool.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                      {selectedTool === tool.id && (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600">
                          <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L7 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isPanelCollapsed && (
        <div className="flex-grow flex flex-col items-center py-6 space-y-6">
          <button
            onClick={() => {
              setIsPanelCollapsed(false);
              setIsExecutiveExpanded(true);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Executive"
          >
            <span className="text-2xl">💼</span>
          </button>
          
          <button
            onClick={() => {
              setIsPanelCollapsed(false);
              setIsOperationalExpanded(true);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Operational"
          >
            <span className="text-2xl">🗂</span>
          </button>
          
          {selectedTool && (
            <div className="mt-auto mb-4">
              {operationalTools.map((tool) => (
                selectedTool === tool.id && (
                  <span
                    key={tool.id}
                    className="text-3xl"
                    title={tool.name}
                  >
                    {tool.icon}
                  </span>
                )
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const WelcomeScreen = () => (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-8">
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-6xl">📊</span>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
          Welcome to ASTRA Analytics Suite
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Get started by selecting an analytics tool from the <span className="font-semibold text-green-600">Operational</span> section 
          in the left panel. Choose between JIRA, Zephyr, or Gap Analysis to begin generating comprehensive reports.
        </p>
        
        <div className="grid grid-cols-3 gap-6 mt-12">
          {operationalTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => {
                handleToolSelect(tool.id);
                if (isPanelCollapsed) {
                  setIsPanelCollapsed(false);
                }
                setIsOperationalExpanded(true);
              }}
            >
              <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                <span className="text-5xl">{tool.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{tool.name}</h3>
              <p className="text-sm text-gray-600">{tool.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>📍 Click on any tool above or use the left panel to navigate</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <header className={`flex justify-between items-center px-4 py-2 h-20 shadow-md ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}>
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

        <div className="flex items-center space-x-3">
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

      <NotificationsDropdown />

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

      {showProfileMenu && (
        <div 
          className="fixed inset-0 bg-transparent z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <BeautifulPanel />

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedTool ? (
            <>
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {operationalTools.map((tool) => (
                      selectedTool === tool.id && (
                        <div key={tool.id} className="flex items-center space-x-3 animate-fadeIn">
                          <span className="text-3xl">{tool.icon}</span>
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900">{tool.name}</h2>
                            <p className="text-sm text-gray-500">{tool.description}</p>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTool(null);
                      setProjects([]);
                      setReleases([]);
                      setSelectedProject(null);
                      setSelectedRelease(null);
                      setReportGenerated(false);
                      setReportViewed(false);
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Change Tool →
                  </button>
                </div>

                <div className="flex items-end gap-6">
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

                  {reportGenerated && reportData.lastRefresh && (
                    <div className="flex flex-col justify-end">
                      <div className="text-xs text-gray-500 bg-green-50 border border-green-200 rounded px-3 py-2 whitespace-nowrap">
                        <span className="mr-1">🕒</span>
                        Generated: {formatDateTime(reportData.lastRefresh)}
                      </div>
                    </div>
                  )}

                  <div className="flex-1"></div>

                  <ExportDropdown />
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-700 font-medium">{error}</span>
                  </div>
                )}
              </div>

              {reportViewed && (
                <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
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

                  <div className="p-6">
                    <DataTable 
                      data={reportData[activeTab]} 
                      tabId={activeTab}
                    />
                  </div>
                </div>
              )}

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
            </>
          ) : (
            <WelcomeScreen />
          )}
        </div>
      </div>

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