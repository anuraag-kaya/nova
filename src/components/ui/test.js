import React, { useState, useEffect } from 'react';
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';

// Mock data for demonstration
const mockProjectsData = [
  {
    id: 1,
    name: "Customer Portal Redesign",
    key: "CPR",
    description: "Complete overhaul of customer-facing portal",
    dateOnboarded: "2024-12-15",
    lastSynced: "2025-01-15T10:30:00Z",
    jiraStatus: "integrated",
    releases: [
      {
        id: 101,
        name: "v2.1.0",
        releaseId: "CPR-2.1.0",
        environment: "UAT",
        description: "Major UI updates and performance improvements",
        dateOnboarded: "2024-12-20",
        lastSynced: "2025-01-15T09:45:00Z",
        jiraStatus: "integrated"
      },
      {
        id: 102,
        name: "v2.2.0",
        releaseId: "CPR-2.2.0", 
        environment: "SIT",
        description: "New feature rollout",
        dateOnboarded: "2025-01-10",
        lastSynced: "2025-01-15T11:15:00Z",
        jiraStatus: "warning"
      }
    ]
  },
  {
    id: 2,
    name: "Mobile Banking App",
    key: "MBA",
    description: "Next-generation mobile banking experience",
    dateOnboarded: "2024-11-20",
    lastSynced: "2025-01-14T16:20:00Z",
    jiraStatus: "error",
    releases: [
      {
        id: 201,
        name: "v3.0.0",
        releaseId: "MBA-3.0.0",
        environment: "Prod",
        description: "Production release with enhanced security",
        dateOnboarded: "2024-12-01",
        lastSynced: "2025-01-14T14:30:00Z",
        jiraStatus: "integrated"
      }
    ]
  },
  {
    id: 3,
    name: "API Gateway Modernization",
    key: "AGM",
    description: "Microservices architecture implementation",
    dateOnboarded: "2025-01-05",
    lastSynced: "2025-01-15T12:00:00Z",
    jiraStatus: "integrated",
    releases: [
      {
        id: 301,
        name: "v1.0.0-beta",
        releaseId: "AGM-1.0.0-beta",
        environment: "SIT",
        description: "Initial beta release for testing",
        dateOnboarded: "2025-01-08",
        lastSynced: "2025-01-15T11:45:00Z",
        jiraStatus: "integrated"
      },
      {
        id: 302,
        name: "v1.1.0-alpha",
        releaseId: "AGM-1.1.0-alpha",
        environment: "SIT",
        description: "Alpha release with new features",
        dateOnboarded: "2025-01-12",
        lastSynced: "2025-01-15T10:20:00Z",
        jiraStatus: "warning"
      }
    ]
  }
];

export default function AdminPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  
  // State management
  const [projectsData, setProjectsData] = useState(mockProjectsData);
  const [expandedProjects, setExpandedProjects] = useState(new Set([1])); // First project expanded by default
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    projectName: "",
    jiraProjectKey: "",
    releaseName: "",
    releaseId: "",
    environment: "SIT",
    description: ""
  });
  const [formErrors, setFormErrors] = useState({});

  const itemsPerPage = 10;

  // Check if user is admin (mock check - replace with real logic)
  const isAdmin = user?.email?.includes('admin') || user?.role === 'admin' || true; // Set to true for demo

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/unauthorized');
    }
  }, [user, isLoading, isAdmin, router]);

  // Helper functions
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getJiraStatusBadge = (status) => {
    const statusConfig = {
      integrated: { 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '✓',
        text: 'Integrated'
      },
      warning: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: '⚠',
        text: 'Needs Review'
      },
      error: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: '✗', 
        text: 'Not Found'
      }
    };
    
    const config = statusConfig[status] || statusConfig.error;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    
    // Validate form
    const errors = {};
    if (!formData.projectName.trim()) errors.projectName = "Project name is required";
    if (!formData.jiraProjectKey.trim()) errors.jiraProjectKey = "Jira project key is required";
    if (!formData.releaseName.trim()) errors.releaseName = "Release name is required";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new project/release to state
      const newProject = {
        id: Date.now(),
        name: formData.projectName,
        key: formData.jiraProjectKey,
        description: formData.description,
        dateOnboarded: new Date().toISOString().split('T')[0],
        lastSynced: new Date().toISOString(),
        jiraStatus: "integrated",
        releases: [{
          id: Date.now() + 1,
          name: formData.releaseName,
          releaseId: formData.releaseId || formData.releaseName,
          environment: formData.environment,
          description: formData.description,
          dateOnboarded: new Date().toISOString().split('T')[0],
          lastSynced: new Date().toISOString(),
          jiraStatus: "integrated"
        }]
      };
      
      setProjectsData(prev => [newProject, ...prev]);
      setShowOnboardModal(false);
      setFormData({
        projectName: "",
        jiraProjectKey: "",
        releaseName: "",
        releaseId: "",
        environment: "SIT",
        description: ""
      });
      setFormErrors({});
      
      // Show success notification
      const successNotification = {
        id: Date.now(),
        title: "Project Onboarded Successfully",
        message: `${formData.projectName} has been successfully onboarded with Jira integration verified.`,
        type: "success",
        timestamp: new Date().toISOString()
      };
      
      setNotifications(prev => [successNotification, ...prev]);
      setUnreadNotifications(prev => prev + 1);
      
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async (projectId, releaseId = null) => {
    // Simulate refresh API call
    console.log(`Refreshing ${releaseId ? 'release' : 'project'}:`, projectId, releaseId);
  };

  const handleDelete = async (projectId, releaseId = null) => {
    if (window.confirm(`Are you sure you want to delete this ${releaseId ? 'release' : 'project'}?`)) {
      if (releaseId) {
        // Delete release
        setProjectsData(prev => prev.map(project => 
          project.id === projectId 
            ? { ...project, releases: project.releases.filter(r => r.id !== releaseId) }
            : project
        ));
      } else {
        // Delete project
        setProjectsData(prev => prev.filter(p => p.id !== projectId));
      }
    }
  };

  // Filter and sort projects
  const filteredProjects = projectsData.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.releases.some(release => 
      release.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0057e7]"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
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
          <div className="relative">
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Image src="/notification-icon.png" alt="Notifications" width={24} height={24} />
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
              {user?.name ? 
                user.name.split(' ').map(name => name[0]).join('').substring(0, 2).toUpperCase() 
                : 'A'}
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
            <Link href="/admin">
              <div className={`px-5 py-2 text-[15px] font-medium ${pathname === "/admin" ? "text-[#0057e7] border-b-2 border-[#0057e7]" : "text-[#0f2d91] hover:text-[#0057e7] border-b-2 border-transparent"} transition-colors cursor-pointer`}>
                Admin
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

      {/* Profile Menu */}
      {showProfileMenu && (
        <div 
          className="fixed right-4 top-12 w-48 bg-white shadow-xl rounded-md z-50 border border-gray-200 overflow-hidden"
          style={{ position: 'absolute', top: '60px', right: '10px' }}
        >
          <div className="py-1">
            <button
              onClick={() => setShowProfileMenu(false)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <span>👤</span> <h1>{user?.name || "Guest"}</h1>
            </button>
            <Link href="/settings">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
              >
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
            <button
              onClick={() => setShowProfileMenu(false)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <span>❓</span> Help & Support
            </button>
            
            <div className="border-t border-gray-200 my-1"></div>
            
            <button
              onClick={() => setShowProfileMenu(false)}
              className="w-full text-left px-4 py-2 text-sm text-[#d62d20] hover:bg-[#d62d20]/10 flex items-center gap-2 transition-colors"
            >
              <span>🚪</span><a href="/api/auth/logout"> Sign out</a>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Project & Release Management</h1>
              <p className="text-lg text-gray-600 flex items-center">
                Admins can onboard new projects and releases, view all existing ones, and manage Jira integration status.
                <button className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </p>
            </div>
            <button
              onClick={() => setShowOnboardModal(true)}
              className="bg-gradient-to-r from-[#0057e7] to-[#0046b8] hover:from-[#0046b8] hover:to-[#003d9d] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Onboard Project/Release
            </button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search projects and releases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0057e7] focus:border-transparent transition-all duration-200"
                />
              </div>
              <select
                value={sortColumn}
                onChange={(e) => setSortColumn(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0057e7] focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="lastSynced">Sort by Last Synced</option>
                <option value="dateOnboarded">Sort by Date Onboarded</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                {projectsData.length} Projects
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {projectsData.reduce((acc, p) => acc + p.releases.length, 0)} Releases
              </span>
            </div>
          </div>

          {/* Projects Table */}
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Project Details</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Jira Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Last Activity</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <React.Fragment key={project.id}>
                    {/* Project Row */}
                    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleProjectExpansion(project.id)}
                            className="mr-3 p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <svg 
                              className={`w-4 h-4 transform transition-transform ${expandedProjects.has(project.id) ? 'rotate-90' : ''}`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <div>
                            <h3 className="font-semibold text-gray-900">{project.name}</h3>
                            <p className="text-sm text-gray-500">Key: {project.key}</p>
                            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getJiraStatusBadge(project.jiraStatus)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <p className="text-gray-900">Synced {formatRelativeTime(project.lastSynced)}</p>
                          <p className="text-gray-500">Onboarded {new Date(project.dateOnboarded).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRefresh(project.id)}
                            className="p-2 text-gray-600 hover:text-[#0057e7] hover:bg-blue-50 rounded-lg transition-colors"
                            title="Refresh Jira sync"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete project"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Releases Rows (when expanded) */}
                    {expandedProjects.has(project.id) && project.releases.map((release) => (
                      <tr key={release.id} className="bg-blue-50/30 hover:bg-blue-50/50 transition-colors border-b border-gray-100">
                        <td className="py-3 px-6 pl-16">
                          <div>
                            <h4 className="font-medium text-gray-800 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {release.name}
                            </h4>
                            <p className="text-sm text-gray-500">ID: {release.releaseId} • {release.environment}</p>
                            <p className="text-sm text-gray-600 mt-1">{release.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          {getJiraStatusBadge(release.jiraStatus)}
                        </td>
                        <td className="py-3 px-6">
                          <div className="text-sm">
                            <p className="text-gray-900">Synced {formatRelativeTime(release.lastSynced)}</p>
                            <p className="text-gray-500">Onboarded {new Date(release.dateOnboarded).toLocaleDateString()}</p>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRefresh(project.id, release.id)}
                              className="p-2 text-gray-600 hover:text-[#0057e7] hover:bg-blue-50 rounded-lg transition-colors"
                              title="Refresh release sync"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(project.id, release.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete release"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Onboard New Project & Release</h2>
                <button
                  onClick={() => setShowOnboardModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Project Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Project Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.projectName}
                      onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                      className={`w-full px-4 py-3 border ${formErrors.projectName ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#0057e7] focus:border-transparent transition-all`}
                      placeholder="e.g., Customer Portal Redesign"
                    />
                    {formErrors.projectName && <p className="text-red-500 text-sm mt-1">{formErrors.projectName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jira Project Key <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.jiraProjectKey}
                      onChange={(e) => setFormData({...formData, jiraProjectKey: e.target.value.toUpperCase()})}
                      className={`w-full px-4 py-3 border ${formErrors.jiraProjectKey ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#0057e7] focus:border-transparent transition-all`}
                      placeholder="e.g., CPR"
                    />
                    {formErrors.jiraProjectKey && <p className="text-red-500 text-sm mt-1">{formErrors.jiraProjectKey}</p>}
                  </div>
                </div>
              </div>

              {/* Release Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Release Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Release Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.releaseName}
                      onChange={(e) => setFormData({...formData, releaseName: e.target.value})}
                      className={`w-full px-4 py-3 border ${formErrors.releaseName ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#0057e7] focus:border-transparent transition-all`}
                      placeholder="e.g., v2.1.0"
                    />
                    {formErrors.releaseName && <p className="text-red-500 text-sm mt-1">{formErrors.releaseName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Release ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.releaseId}
                      onChange={(e) => setFormData({...formData, releaseId: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057e7] focus:border-transparent transition-all"
                      placeholder="e.g., CPR-2.1.0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Environment
                  </label>
                  <select
                    value={formData.environment}
                    onChange={(e) => setFormData({...formData, environment: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057e7] focus:border-transparent transition-all"
                  >
                    <option value="SIT">SIT (System Integration Testing)</option>
                    <option value="UAT">UAT (User Acceptance Testing)</option>
                    <option value="Prod">Production</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057e7] focus:border-transparent transition-all resize-none"
                    placeholder="Optional notes about the project and release..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-[#0057e7] to-[#0046b8] hover:from-[#0046b8] hover:to-[#003d9d] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Onboarding...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Onboard Project & Release
                    </>
                  )}
                </button>
              </div>
            </div>
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