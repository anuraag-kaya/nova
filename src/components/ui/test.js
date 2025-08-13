import React, { useState, useEffect } from 'react';
// import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';

export default function AdminPage() {
  // const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  
  // State management
  const [projectsData, setProjectsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [systemData, setSystemData] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedView, setSelectedView] = useState("projects");
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isLoading, setIsDataLoading] = useState(false);
  
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

  // Admin navigation structure
  const adminNavigation = {
    management: {
      title: "Management",
      icon: "⚙️",
      items: [
        { id: "projects", title: "Projects & Releases", icon: "📁", count: projectsData.length },
        { id: "users", title: "User Management", icon: "👥", count: usersData.length },
        { id: "permissions", title: "Permissions", icon: "🔐", count: 0 },
        { id: "system", title: "System Integration", icon: "🔗", count: systemData.length }
      ]
    },
    analytics: {
      title: "System Analytics",
      icon: "📊",
      items: [
        { id: "usage", title: "Usage Statistics", icon: "📈", count: 0 },
        { id: "performance", title: "Performance Metrics", icon: "⚡", count: 0 },
        { id: "audit", title: "Audit Logs", icon: "📝", count: 0 }
      ]
    },
    configuration: {
      title: "Configuration",
      icon: "🔧",
      items: [
        { id: "settings", title: "System Settings", icon: "⚙️", count: 0 },
        { id: "integrations", title: "External Integrations", icon: "🔌", count: 0 },
        { id: "backup", title: "Backup & Recovery", icon: "💾", count: 0 }
      ]
    }
  };

  const [expandedSections, setExpandedSections] = useState({
    management: true,
    analytics: false,
    configuration: false
  });

  // Check if user is admin
  const isAdmin = user?.email?.includes('admin') || user?.role === 'admin' || true;

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/unauthorized');
    }
  }, [user, isLoading, isAdmin, router]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsDataLoading(true);
      try {
        // TODO: Replace with actual API calls
        // const projectsResponse = await fetch('/api/admin/projects');
        // const projectsData = await projectsResponse.json();
        // setProjectsData(projectsData);
        
        // const usersResponse = await fetch('/api/admin/users');
        // const usersData = await usersResponse.json();
        // setUsersData(usersData);
        
        // const systemResponse = await fetch('/api/admin/system');
        // const systemData = await systemResponse.json();
        // setSystemData(systemData);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };

    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: { color: 'bg-green-100 text-green-800', icon: '✓' },
      Inactive: { color: 'bg-gray-100 text-gray-800', icon: '○' },
      Connected: { color: 'bg-green-100 text-green-800', icon: '🔗' },
      Healthy: { color: 'bg-blue-100 text-blue-800', icon: '💚' },
      Warning: { color: 'bg-yellow-100 text-yellow-800', icon: '⚠' },
      Error: { color: 'bg-red-100 text-red-800', icon: '✗' }
    };
    
    const config = statusConfig[status] || statusConfig.Active;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {status}
      </span>
    );
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
    
    const errors = {};
    if (!formData.projectName.trim()) errors.projectName = "Project name is required";
    if (!formData.jiraProjectKey.trim()) errors.jiraProjectKey = "Jira project key is required";
    if (!formData.releaseName.trim()) errors.releaseName = "Release name is required";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/projects/onboard', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to onboard project');
      // }
      
      // const newProject = await response.json();
      // setProjectsData(prev => [newProject, ...prev]);
      
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
      // TODO: Show error notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async (projectId, releaseId = null) => {
    console.log(`Refreshing ${releaseId ? 'release' : 'project'}:`, projectId, releaseId);
    // TODO: Implement refresh functionality
  };

  const handleDelete = async (itemId, type = 'project', parentId = null) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/admin/${type}s/${itemId}`, {
        //   method: 'DELETE',
        // });
        
        // if (!response.ok) {
        //   throw new Error(`Failed to delete ${type}`);
        // }
        
        if (type === 'release') {
          setProjectsData(prev => prev.map(project => 
            project.id === parentId 
              ? { ...project, releases: project.releases.filter(r => r.id !== itemId) }
              : project
          ));
        } else if (type === 'project') {
          setProjectsData(prev => prev.filter(p => p.id !== itemId));
        } else if (type === 'user') {
          setUsersData(prev => prev.filter(u => u.id !== itemId));
        }
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        // TODO: Show error notification
      }
    }
  };

  const renderProjectsView = () => (
    <>
      {/* Header with actions */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project & Release Management</h1>
          <p className="text-lg text-gray-600">
            Manage projects, releases, and Jira integration status.
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

      {/* Projects Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0057e7]"></div>
            <span className="ml-4 text-gray-600">Loading projects...</span>
          </div>
        ) : projectsData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Projects Found</h3>
            <p className="text-gray-600 mb-4">Get started by onboarding your first project.</p>
            <button
              onClick={() => setShowOnboardModal(true)}
              className="bg-[#0057e7] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0046b8] transition-colors"
            >
              Onboard Project
            </button>
          </div>
        ) : (
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
                {projectsData.map((project) => (
                  <React.Fragment key={project.id}>
                    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          {project.releases && project.releases.length > 0 && (
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
                          )}
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
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(project.id, 'project')}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedProjects.has(project.id) && project.releases && project.releases.map((release) => (
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
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(release.id, 'release', project.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        )}
      </div>
    </>
  );

  const renderUsersView = () => (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-lg text-gray-600">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <button className="bg-gradient-to-r from-[#0057e7] to-[#0046b8] hover:from-[#0046b8] hover:to-[#003d9d] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0057e7]"></div>
            <span className="ml-4 text-gray-600">Loading users...</span>
          </div>
        ) : usersData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Users Found</h3>
            <p className="text-gray-600">No users have been configured yet.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-700">User</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Department</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Last Login</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold mr-3">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{user.department}</td>
                  <td className="py-4 px-6">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="py-4 px-6 text-gray-600">{formatRelativeTime(user.lastLogin)}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-600 hover:text-[#0057e7] hover:bg-blue-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, 'user')}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );

  const renderSystemView = () => (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Integration</h1>
          <p className="text-lg text-gray-600">
            Monitor and manage external system integrations.
          </p>
        </div>
        <button className="bg-gradient-to-r from-[#0057e7] to-[#0046b8] hover:from-[#0046b8] hover:to-[#003d9d] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Integration
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0057e7]"></div>
            <span className="ml-4 text-gray-600">Loading system integrations...</span>
          </div>
        ) : systemData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Integrations Found</h3>
            <p className="text-gray-600">No external system integrations have been configured.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-700">System</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Endpoint</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Last Sync</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {systemData.map((system) => (
                <tr key={system.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                  <td className="py-4 px-6">
                    <div>
                      <h3 className="font-semibold text-gray-900">{system.name}</h3>
                      <p className="text-sm text-gray-500">Version {system.version}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(system.status)}
                  </td>
                  <td className="py-4 px-6">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{system.endpoint}</code>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{formatRelativeTime(system.lastSync)}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-600 hover:text-[#0057e7] hover:bg-blue-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-600 hover:text-[#0057e7] hover:bg-blue-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );

  const renderPlaceholderView = (title, description) => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 text-center max-w-md">{description}</p>
    </div>
  );

  const renderMainContent = () => {
    switch (selectedView) {
      case 'projects':
        return renderProjectsView();
      case 'users':
        return renderUsersView();
      case 'system':
        return renderSystemView();
      case 'permissions':
        return renderPlaceholderView('Permissions Management', 'Configure user roles and access permissions for different parts of the system.');
      case 'usage':
        return renderPlaceholderView('Usage Statistics', 'View detailed analytics about system usage, user activity, and feature adoption.');
      case 'performance':
        return renderPlaceholderView('Performance Metrics', 'Monitor system performance, response times, and resource utilization.');
      case 'audit':
        return renderPlaceholderView('Audit Logs', 'Review detailed logs of all system activities and user actions.');
      case 'settings':
        return renderPlaceholderView('System Settings', 'Configure global system settings, security policies, and default preferences.');
      case 'integrations':
        return renderPlaceholderView('External Integrations', 'Manage connections to third-party services and APIs.');
      case 'backup':
        return renderPlaceholderView('Backup & Recovery', 'Configure automated backups and manage data recovery procedures.');
      default:
        return renderProjectsView();
    }
  };

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
        <div className="flex items-center ml-5">
          <div className="flex items-center">
            <img src="/citi-logo.png" alt="Citi" className="h-8 w-auto" />
            <span className="ml-5 text-[26px] font-medium text-black font-roboto flex items-center mt-[10px]">
              ASTRA
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
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
            <Link href="/documentation">
              <div className={`px-5 py-2 text-[15px] font-medium ${pathname === "/documentation" ? "text-[#0057e7] border-b-2 border-[#0057e7]" : "text-[#0f2d91] hover:text-[#0057e7] border-b-2 border-transparent"} transition-colors cursor-pointer`}>
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

      {/* Main Content Area */}
      <div className="flex flex-grow">
        {/* Left Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-lg`}>
          {/* Collapse Toggle */}
          <div className="p-4 flex justify-between items-center border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            {!sidebarCollapsed && (
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="text-xl mr-2">⚙️</span>
                Admin Panel
              </h2>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-gray-600 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          {!sidebarCollapsed && (
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search admin functions..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0057e7] focus:border-transparent"
                />
                <svg 
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex-grow overflow-y-auto">
            {!sidebarCollapsed ? (
              <div className="px-4 pb-4">
                {Object.entries(adminNavigation).map(([key, section]) => (
                  <div key={key} className="mb-2">
                    <button
                      onClick={() => toggleSection(key)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-200 group"
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{section.icon}</span>
                        <span className="font-medium text-gray-700 group-hover:text-gray-900">
                          {section.title}
                        </span>
                      </div>
                      <svg 
                        className={`h-4 w-4 text-gray-500 transition-transform ${expandedSections[key] ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    {expandedSections[key] && (
                      <div className="ml-12 mt-1 space-y-1">
                        {section.items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedView(item.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 flex items-center justify-between ${
                              selectedView === item.id
                                ? 'bg-gradient-to-r from-[#0057e7] to-[#0046b8] text-white shadow-md'
                                : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="mr-2">{item.icon}</span>
                              {item.title}
                            </div>
                            {item.count > 0 && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                selectedView === item.id
                                  ? 'bg-white/20 text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {item.count}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4">
                {Object.entries(adminNavigation).map(([key, section]) => (
                  <button
                    key={key}
                    onClick={() => setSidebarCollapsed(false)}
                    className="w-full p-3 hover:bg-gray-100 transition-colors flex justify-center"
                    title={section.title}
                  >
                    <span className="text-xl">{section.icon}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow bg-gray-50 overflow-y-auto">
          <div className="p-8">
            {renderMainContent()}
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