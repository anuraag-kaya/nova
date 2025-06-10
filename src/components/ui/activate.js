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

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadNotifications(count);
  }, [notifications]);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

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
    setSelectedRelease(null); // Reset release selection
    setReleases([]); // Clear previous releases
    
    if (project) {
      fetchReleases(project.id);
    }
  };

  const handleReleaseSelect = (release) => {
    setSelectedRelease(release);
  };

  const handleGenerateReport = () => {
    if (selectedProject && selectedRelease) {
      // Add notification for successful report generation
      const newNotification = {
        id: Date.now(),
        title: "Report Generation Started",
        message: `Generating report for ${selectedProject.name} - ${selectedRelease.name}`,
        date: new Date().toLocaleString(),
        read: false,
        type: "success"
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      console.log('Generating report for:', {
        project: selectedProject,
        release: selectedRelease
      });
    }
  };

  // Check if generate button should be enabled
  const isGenerateEnabled = selectedProject && selectedRelease;

  // Notification management
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
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <span className="mr-2 text-lg">{icon}</span>
          {label}
        </label>
        <div className="relative">
          <button
            type="button"
            className={`w-full px-4 py-3 text-left bg-white border-2 rounded-xl shadow-sm transition-all duration-300 ${
              disabled 
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                : isOpen
                  ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg'
                  : 'border-gray-300 hover:border-blue-400 hover:shadow-md'
            } focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled || loading}
          >
            <div className="flex items-center justify-between">
              <span className={`block truncate ${selected ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
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
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {isOpen && !disabled && !loading && (
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-center">
                  No options available
                </div>
              ) : (
                options.map((option, index) => (
                  <button
                    key={option.id || index}
                    type="button"
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-150 ${
                      selected?.id === option.id ? 'bg-blue-100 text-blue-900 font-medium' : 'text-gray-900'
                    } ${index === 0 ? 'rounded-t-xl' : ''} ${index === options.length - 1 ? 'rounded-b-xl' : ''}`}
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

      {/* Main Content */}
      <div className="flex-grow bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📊 Analytics & Reporting
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Generate comprehensive reports by selecting your project and release. 
              Our advanced analytics provide deep insights into your development workflow.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-100">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            )}

            {/* Selection Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Projects Dropdown */}
              <CustomDropdown
                label="Select Project"
                icon="🏢"
                options={projects}
                selected={selectedProject}
                onSelect={handleProjectSelect}
                disabled={false}
                loading={loadingProjects}
                placeholder="Choose a project to begin..."
              />

              {/* Releases Dropdown */}
              <CustomDropdown
                label="Select Release"
                icon="🚀"
                options={releases}
                selected={selectedRelease}
                onSelect={handleReleaseSelect}
                disabled={!selectedProject}
                loading={loadingReleases}
                placeholder={selectedProject ? "Choose a release..." : "Select a project first"}
              />
            </div>

            {/* Generate Report Button */}
            <div className="text-center">
              <button
                onClick={handleGenerateReport}
                disabled={!isGenerateEnabled}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                  isGenerateEnabled
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:shadow-lg cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                } shadow-md`}
              >
                <span className="mr-3">📈</span>
                Generate Analytics Report
              </button>
            </div>
          </div>

          {/* Selection Summary */}
          {(selectedProject || selectedRelease) && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📋</span>
                Current Selection
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🏢</span>
                    <div>
                      <p className="text-sm font-medium text-blue-600">Project</p>
                      <p className="text-lg font-bold text-blue-900">
                        {selectedProject ? selectedProject.name : 'Not selected'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🚀</span>
                    <div>
                      <p className="text-sm font-medium text-green-600">Release</p>
                      <p className="text-lg font-bold text-green-900">
                        {selectedRelease ? selectedRelease.name : 'Not selected'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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