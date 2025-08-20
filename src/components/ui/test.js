// app/documentation/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import DocumentationSidebar from './components/DocumentationSidebar';
import DocumentationContent from './components/DocumentationContent';
import DocumentationSearch from './components/DocumentationSearch';
import { documentationData } from './components/documentationData';

export default function Documentation() {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    gettingStarted: true,
    home: false,
    studio: false,
    analytics: false,
    admin: false,
    troubleshooting: false
  });
  const [selectedTopic, setSelectedTopic] = useState("introduction");
  const [searchResults, setSearchResults] = useState([]);

  // Search functionality
  useEffect(() => {
    if (searchQuery) {
      const results = [];
      Object.entries(documentationData).forEach(([sectionKey, section]) => {
        section.items.forEach(item => {
          const content = item.searchableContent?.toLowerCase() || '';
          const title = item.title.toLowerCase();
          if (title.includes(searchQuery.toLowerCase()) || 
              content.includes(searchQuery.toLowerCase())) {
            results.push({
              ...item,
              section: section.title,
              sectionKey: sectionKey
            });
          }
        });
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleTopicSelect = (topicId, sectionKey = null) => {
    setSelectedTopic(topicId);
    if (sectionKey) {
      setExpandedSections(prev => ({
        ...prev,
        [sectionKey]: true
      }));
    }
    setSearchQuery("");
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Header */}
      <header className={`flex justify-between items-center px-4 py-2 h-20 shadow-md ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}>
        {/* Logo */}
        <div className="flex items-center ml-5">
          <div className="flex items-center">
            <img 
              src={darkMode ? "/citi-logo-dark.png" : "/citi-logo.png"}
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
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div className="w-8 h-8 rounded-full bg-teal-400 flex items-center justify-center text-white font-medium">
              U
            </div>
          </button>
        </div>
      </header>

      {/* Menu Bar */}
      <div className="bg-[#f0f5f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.07)] relative z-10 border-b border-gray-200">
        <div className="pl-4">
          <nav className="flex h-10">
            <Link href="/">
              <div className="px-5 py-2 text-[15px] font-medium text-[#0f2d91] hover:text-[#0057e7] border-b-2 border-transparent transition-colors cursor-pointer">
                Home
              </div>
            </Link>
            <Link href="/studio">
              <div className="px-5 py-2 text-[15px] font-medium text-[#0f2d91] hover:text-[#0057e7] border-b-2 border-transparent transition-colors cursor-pointer">
                Studio
              </div>
            </Link>
            <Link href="/analytics">
              <div className="px-5 py-2 text-[15px] font-medium text-[#0f2d91] hover:text-[#0057e7] border-b-2 border-transparent transition-colors cursor-pointer">
                Analytics
              </div>
            </Link>
            <Link href="/admin">
              <div className="px-5 py-2 text-[15px] font-medium text-[#0f2d91] hover:text-[#0057e7] border-b-2 border-transparent transition-colors cursor-pointer">
                Admin
              </div>
            </Link>
            <Link href="/documentation">
              <div className={`px-5 py-2 text-[15px] font-medium ${
                pathname === "/documentation" 
                  ? "text-[#0057e7] border-b-2 border-[#0057e7]" 
                  : "text-[#0f2d91] hover:text-[#0057e7] border-b-2 border-transparent"
              } transition-colors cursor-pointer`}>
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
              onClick={() => {
                setDarkMode(!darkMode);
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <span>{darkMode ? "☀️" : "🌙"}</span> {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              className="w-full text-left px-4 py-2 text-sm text-[#d62d20] hover:bg-[#d62d20]/10 flex items-center gap-2 transition-colors"
            >
              <span>🚪</span> Sign out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <DocumentationSidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          selectedTopic={selectedTopic}
          handleTopicSelect={handleTopicSelect}
          documentationData={documentationData}
        />

        {/* Main Content */}
        <div className="flex-grow bg-white overflow-y-auto">
          {searchQuery && searchResults.length > 0 ? (
            <DocumentationSearch
              searchResults={searchResults}
              searchQuery={searchQuery}
              onSelectResult={handleTopicSelect}
            />
          ) : (
            <DocumentationContent selectedTopic={selectedTopic} />
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

// app/documentation/components/DocumentationSidebar.js
"use client";

export default function DocumentationSidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  searchQuery,
  setSearchQuery,
  expandedSections,
  toggleSection,
  selectedTopic,
  handleTopicSelect,
  documentationData
}) {
  
  const filterItems = (items, query) => {
    if (!query) return items;
    return items.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  const sectionHasMatches = (section, query) => {
    if (!query) return true;
    return section.items.some(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col`}>
      {/* Collapse Toggle */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        {!sidebarCollapsed && (
          <h2 className="text-lg font-semibold text-gray-800">Documentation</h2>
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
              placeholder="Search documentation..."
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
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-grow overflow-y-auto">
        {!sidebarCollapsed ? (
          <div className="px-4 pb-4">
            {Object.entries(documentationData).map(([key, section]) => {
              const hasMatches = sectionHasMatches(section, searchQuery);
              if (!hasMatches) return null;

              return (
                <div key={key} className="mb-2">
                  <button
                    onClick={() => toggleSection(key)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg transition-colors group"
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
                      {filterItems(section.items, searchQuery).map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleTopicSelect(item.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedTopic === item.id
                              ? 'bg-[#0057e7] text-white'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-4">
            {Object.entries(documentationData).map(([key, section]) => (
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
  );
}

// app/documentation/components/DocumentationContent.js
"use client";
import IntroductionContent from './content/IntroductionContent';
import QuickStartContent from './content/QuickStartContent';
import HomeContent from './content/HomeContent';
import StudioContent from './content/StudioContent';
import AnalyticsContent from './content/AnalyticsContent';
import AdminContent from './content/AdminContent';
import TroubleshootingContent from './content/TroubleshootingContent';

const contentComponents = {
  // Getting Started
  introduction: IntroductionContent,
  quickstart: QuickStartContent,
  systemrequirements: IntroductionContent,
  
  // Home
  homepage: HomeContent,
  recentitems: HomeContent,
  navigation: HomeContent,
  
  // Studio
  studiooverview: StudioContent,
  testtree: StudioContent,
  testcases: StudioContent,
  generating: StudioContent,
  cobolbuilder: StudioContent,
  
  // Analytics
  analyticsoverview: AnalyticsContent,
  executive: AnalyticsContent,
  operational: AnalyticsContent,
  customdashboards: AnalyticsContent,
  
  // Admin
  adminoverview: AdminContent,
  projectmanagement: AdminContent,
  usermanagement: AdminContent,
  rolepermissions: AdminContent,
  systemsettings: AdminContent,
  
  // Troubleshooting
  faq: TroubleshootingContent,
  commonissues: TroubleshootingContent,
  support: TroubleshootingContent
};

export default function DocumentationContent({ selectedTopic }) {
  const ContentComponent = contentComponents[selectedTopic];
  
  if (!ContentComponent) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to ASTRA Documentation</h2>
          <p className="text-gray-600">Select a topic from the left sidebar to begin exploring.</p>
        </div>
      </div>
    );
  }
  
  return <ContentComponent topic={selectedTopic} />;
}

// app/documentation/components/DocumentationSearch.js
"use client";

export default function DocumentationSearch({ searchResults, searchQuery, onSelectResult }) {
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Search Results for "{searchQuery}"
        </h2>
        <p className="text-gray-600">Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="space-y-4">
        {searchResults.map((result) => (
          <button
            key={result.id}
            onClick={() => onSelectResult(result.id, result.sectionKey)}
            className="w-full text-left bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <div className="text-sm text-gray-500 mb-1">{result.section}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{result.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {result.description || "Click to view this documentation section"}
                </p>
              </div>
              <svg 
                className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0 ml-4"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
      
      {searchResults.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
          <p className="text-gray-600">Try adjusting your search terms or browse the documentation sections</p>
        </div>
      )}
    </div>
  );
}

// app/documentation/components/documentationData.js
export const documentationData = {
  gettingStarted: {
    title: "Getting Started",
    icon: "🚀",
    items: [
      { 
        id: "introduction", 
        title: "Introduction to ASTRA",
        description: "Overview of ASTRA's AI-powered testing platform",
        searchableContent: "ASTRA AI testing quality assurance platform introduction overview"
      },
      { 
        id: "quickstart", 
        title: "Quick Start Guide",
        description: "Get up and running with ASTRA in minutes",
        searchableContent: "quick start guide setup installation first test case"
      },
      { 
        id: "systemrequirements", 
        title: "System Requirements",
        description: "Technical requirements and browser compatibility",
        searchableContent: "system requirements browser compatibility technical specifications"
      }
    ]
  },
  home: {
    title: "Home Page",
    icon: "🏠",
    items: [
      { 
        id: "homepage", 
        title: "Home Dashboard Overview",
        description: "Understanding your ASTRA dashboard",
        searchableContent: "home page dashboard overview landing page"
      },
      { 
        id: "recentitems", 
        title: "Recently Viewed Items",
        description: "Track and access your recent work",
        searchableContent: "recently viewed items history recent work tracking"
      },
      { 
        id: "navigation", 
        title: "Navigation Guide",
        description: "Navigate efficiently through ASTRA",
        searchableContent: "navigation menu bar tabs routing pages"
      }
    ]
  },
  studio: {
    title: "Studio",
    icon: "🎨",
    items: [
      { 
        id: "studiooverview", 
        title: "Studio Overview",
        description: "Complete guide to the Studio workspace",
        searchableContent: "studio overview workspace test management"
      },
      { 
        id: "testtree", 
        title: "Test Tree Navigation",
        description: "Navigate projects, releases, and user stories",
        searchableContent: "test tree navigation hierarchy projects releases user stories"
      },
      { 
        id: "testcases", 
        title: "Managing Test Cases",
        description: "Create, edit, and organize test cases",
        searchableContent: "test cases management create edit delete organize"
      },
      { 
        id: "generating", 
        title: "AI Test Generation",
        description: "Generate test cases using AI models",
        searchableContent: "generate test cases AI GPT Claude Gemini LLM models automation"
      },
      { 
        id: "cobolbuilder", 
        title: "COBOL Builder",
        description: "Generate COBOL code and test legacy systems",
        searchableContent: "COBOL builder legacy code generation copybook mapping rules"
      }
    ]
  },
  analytics: {
    title: "Analytics",
    icon: "📊",
    items: [
      { 
        id: "analyticsoverview", 
        title: "Analytics Overview",
        description: "Understanding ASTRA's analytics capabilities",
        searchableContent: "analytics overview dashboards metrics reporting"
      },
      { 
        id: "executive", 
        title: "Executive Dashboard",
        description: "High-level metrics and insights",
        searchableContent: "executive dashboard tableau high level metrics KPI"
      },
      { 
        id: "operational", 
        title: "Operational Dashboard",
        description: "Real-time operational metrics",
        searchableContent: "operational dashboard real time metrics database"
      },
      { 
        id: "customdashboards", 
        title: "Custom Dashboards",
        description: "Create and customize your dashboards",
        searchableContent: "custom dashboards personalization widgets"
      }
    ]
  },
  admin: {
    title: "Admin",
    icon: "⚙️",
    items: [
      { 
        id: "adminoverview", 
        title: "Admin Panel Overview",
        description: "Administrative features and capabilities",
        searchableContent: "admin panel overview management administration"
      },
      { 
        id: "projectmanagement", 
        title: "Projects & Releases",
        description: "Manage projects and releases",
        searchableContent: "project management releases onboarding refresh"
      },
      { 
        id: "usermanagement", 
        title: "User Management",
        description: "Manage users, roles, and permissions",
        searchableContent: "user management roles permissions admin manager tester"
      },
      { 
        id: "rolepermissions", 
        title: "Roles & Permissions",
        description: "Configure user roles and access controls",
        searchableContent: "roles permissions access control authorization"
      },
      { 
        id: "systemsettings", 
        title: "System Settings",
        description: "Configure system-wide settings",
        searchableContent: "system settings configuration preferences"
      }
    ]
  },
  troubleshooting: {
    title: "Help & Support",
    icon: "🛠️",
    items: [
      { 
        id: "faq", 
        title: "Frequently Asked Questions",
        description: "Common questions and answers",
        searchableContent: "FAQ frequently asked questions help"
      },
      { 
        id: "commonissues", 
        title: "Common Issues & Solutions",
        description: "Troubleshoot common problems",
        searchableContent: "common issues problems solutions troubleshooting fixes"
      },
      { 
        id: "support", 
        title: "Contact Support",
        description: "Get help from our support team",
        searchableContent: "contact support help assistance team"
      }
    ]
  }
};

// app/documentation/components/content/IntroductionContent.js
"use client";

export default function IntroductionContent({ topic }) {
  const content = {
    introduction: {
      title: "Introduction to ASTRA",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              ASTRA is a comprehensive AI-powered testing and quality assurance platform designed to revolutionize 
              software testing workflows. By leveraging advanced artificial intelligence models, ASTRA automates 
              test case generation, provides real-time analytics, and seamlessly integrates with your existing 
              development ecosystem.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-semibold mb-2 text-blue-900">🎯 Key Value Proposition</h3>
              <p className="text-blue-800">
                ASTRA reduces test case creation time by up to 80% while improving test coverage and quality 
                through AI-powered generation and intelligent test management.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Platform Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">🏠</div>
                <h4 className="font-semibold text-lg mb-2">Home Dashboard</h4>
                <p className="text-gray-600 text-sm">
                  Central hub for quick access to recent items and system overview.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">🎨</div>
                <h4 className="font-semibold text-lg mb-2">Studio</h4>
                <p className="text-gray-600 text-sm">
                  Complete test management workspace with AI generation capabilities.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">📊</div>
                <h4 className="font-semibold text-lg mb-2">Analytics</h4>
                <p className="text-gray-600 text-sm">
                  Executive and operational dashboards for data-driven insights.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">⚙️</div>
                <h4 className="font-semibold text-lg mb-2">Admin</h4>
                <p className="text-gray-600 text-sm">
                  Administrative controls for users, projects, and system settings.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Core Features</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <span className="text-2xl mr-3">🤖</span>
                  AI-Powered Test Generation
                </h3>
                <p className="text-gray-600 mb-3">
                  Generate comprehensive test cases automatically using state-of-the-art language models:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Support for multiple AI models (GPT-4, Claude, Gemini)</li>
                  <li>Customizable prompts for specific test scenarios</li>
                  <li>Bulk generation for multiple user stories</li>
                  <li>Template-based and freeform generation options</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <span className="text-2xl mr-3">🏗️</span>
                  Hierarchical Test Organization
                </h3>
                <p className="text-gray-600 mb-3">
                  Organize your testing workflow with a clear three-tier hierarchy:
                </p>
                <div className="bg-white p-4 rounded border border-gray-200 font-mono text-sm">
                  <div className="mb-2">📁 <strong>Projects</strong> - Top-level containers</div>
                  <div className="ml-6 mb-2">📄 <strong>Releases</strong> - Version management</div>
                  <div className="ml-12">📌 <strong>User Stories</strong> - Feature-level organization</div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <span className="text-2xl mr-3">💻</span>
                  COBOL Legacy Support
                </h3>
                <p className="text-gray-600">
                  Specialized tools for legacy system testing including COBOL code generation, 
                  copybook processing, and mapping rule configuration.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <span className="text-green-500 text-2xl mr-3">✓</span>
                <div>
                  <h4 className="font-semibold mb-1">Increased Efficiency</h4>
                  <p className="text-gray-600 text-sm">Reduce test case creation time by up to 80%</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 text-2xl mr-3">✓</span>
                <div>
                  <h4 className="font-semibold mb-1">Improved Coverage</h4>
                  <p className="text-gray-600 text-sm">AI identifies edge cases humans might miss</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 text-2xl mr-3">✓</span>
                <div>
                  <h4 className="font-semibold mb-1">Standardization</h4>
                  <p className="text-gray-600 text-sm">Consistent test case format and quality</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 text-2xl mr-3">✓</span>
                <div>
                  <h4 className="font-semibold mb-1">Data-Driven Decisions</h4>
                  <p className="text-gray-600 text-sm">Real-time analytics and insights</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )
    },
    systemrequirements: {
      title: "System Requirements",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Ensure your system meets these requirements for optimal ASTRA performance.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Browser Requirements</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Supported Browsers</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <span className="font-medium">Google Chrome</span>
                  <span className="text-green-600">Version 90 or higher (Recommended)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Microsoft Edge</span>
                  <span className="text-gray-600">Version 90 or higher</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Mozilla Firefox</span>
                  <span className="text-gray-600">Version 88 or higher</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Safari</span>
                  <span className="text-gray-600">Version 14 or higher</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Hardware Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-blue-600">Minimum Requirements</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span><strong>Processor:</strong> 2.0 GHz dual-core</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span><strong>RAM:</strong> 4 GB</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span><strong>Storage:</strong> 2 GB available space</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span><strong>Display:</strong> 1366x768 resolution</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-green-600">Recommended Requirements</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span><strong>Processor:</strong> 3.0 GHz quad-core or better</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span><strong>RAM:</strong> 8 GB or more</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span><strong>Storage:</strong> 5 GB available space</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span><strong>Display:</strong> 1920x1080 resolution or higher</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Network Requirements</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span><strong>Internet Connection:</strong> Stable broadband connection (minimum 10 Mbps)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span><strong>Firewall:</strong> Allow HTTPS traffic on port 443</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span><strong>JavaScript:</strong> Must be enabled in browser</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span><strong>Cookies:</strong> Must be enabled for authentication</span>
                </li>
              </ul>
            </div>
          </section>
        </>
      )
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {content[topic]?.title || "Getting Started"}
      </h1>
      {content[topic]?.content || <p>Content coming soon...</p>}
    </div>
  );
}

// app/documentation/components/content/QuickStartContent.js
"use client";

export default function QuickStartContent({ topic }) {
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Quick Start Guide</h1>
      
      <section className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Get started with ASTRA in just a few minutes. This guide will walk you through creating 
          your first AI-generated test cases.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3 text-blue-900">⏱️ Time Required</h2>
          <p className="text-blue-800">Approximately 5-10 minutes to generate your first test cases</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Step-by-Step Process</h2>
        
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white border-l-4 border-blue-500 shadow-md rounded-r-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold mb-2">Login to ASTRA</h3>
                <p className="text-gray-600 mb-3">
                  Access ASTRA using your organization credentials. Upon successful login, you'll be 
                  directed to the Home dashboard.
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <strong>Tip:</strong> Bookmark the ASTRA URL for quick access
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border-l-4 border-blue-500 shadow-md rounded-r-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold mb-2">Navigate to Studio</h3>
                <p className="text-gray-600 mb-3">
                  Click on the "Studio" tab in the main navigation menu at the top of the page.
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  Home → <span className="text-blue-400">Studio</span> → Analytics → Admin
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border-l-4 border-blue-500 shadow-md rounded-r-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold mb-2">Select Test Cases Mode</h3>
                <p className="text-gray-600 mb-3">
                  In the Studio, ensure "Test Cases" is selected (not "COBOL Builder"). This is usually 
                  the default selection.
                </p>
                <div className="flex gap-4 mt-3">
                  <div className="bg-blue-100 px-4 py-2 rounded-lg text-blue-700 font-medium">
                    ✓ Test Cases
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-500">
                    COBOL Builder
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white border-l-4 border-blue-500 shadow-md rounded-r-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold mb-2">Navigate the Test Tree</h3>
                <p className="text-gray-600 mb-3">
                  In the left panel, navigate through your project hierarchy:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-mono text-sm space-y-2">
                    <div>📁 Click on a <strong>Project</strong></div>
                    <div className="ml-4">📄 Click on a <strong>Release</strong></div>
                    <div className="ml-8">📌 Click on a <strong>User Story</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white border-l-4 border-blue-500 shadow-md rounded-r-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold mb-2">Generate Test Cases</h3>
                <p className="text-gray-600 mb-3">
                  Once a user story is selected, click the "Generate" button in the toolbar.
                </p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors">
                  ✨ Generate
                </button>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="bg-white border-l-4 border-blue-500 shadow-md rounded-r-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold mb-2">Configure Generation Settings</h3>
                <p className="text-gray-600 mb-3">
                  In the right panel that opens, configure your test generation:
                </p>
                <div className="space-y-3 mt-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Choose LLM Model:</strong> Select GPT-4, Claude, or Gemini
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Choose Format:</strong> Select Freeform or Freeform & Template
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Add Prompt (Optional):</strong> Provide specific instructions for customization
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 7 */}
          <div className="bg-white border-l-4 border-green-500 shadow-md rounded-r-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                7
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold mb-2">Generate and Review</h3>
                <p className="text-gray-600 mb-3">
                  Click "Generate Test Cases" and wait for the AI to create your test cases. 
                  They will appear in the middle panel for review.
                </p>
                <div className="bg-green-50 border border-green-200 p-3 rounded mt-3">
                  <strong className="text-green-800">✓ Success!</strong> Your test cases are now ready for review and execution.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Quick Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Use Search</h4>
            <p className="text-sm text-gray-700">
              Use the search bar in the left panel to quickly find projects, releases, or user stories
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🎯 Bulk Generation</h4>
            <p className="text-sm text-gray-700">
              Select multiple user stories using checkboxes to generate test cases in bulk
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📝 Custom Prompts</h4>
            <p className="text-sm text-gray-700">
              Use specific prompts like "Focus on edge cases" for targeted test generation
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🔄 Regenerate</h4>
            <p className="text-sm text-gray-700">
              You can regenerate test cases with different settings if needed
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
          <h3 className="text-lg font-semibold mb-2 text-amber-900">📚 Next Steps</h3>
          <p className="text-amber-800 mb-3">
            Now that you've generated your first test cases, explore these features:
          </p>
          <ul className="space-y-2 text-amber-800">
            <li>• Edit and customize the generated test cases</li>
            <li>• View Analytics to track your testing progress</li>
            <li>• Try the COBOL Builder for legacy system testing</li>
            <li>• Set up user roles in the Admin panel</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

// app/documentation/components/content/HomeContent.js
"use client";

export default function HomeContent({ topic }) {
  const content = {
    homepage: {
      title: "Home Dashboard Overview",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              The Home dashboard is your central hub in ASTRA, providing quick access to recent 
              activities and a comprehensive overview of your testing workflow.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-semibold mb-2 text-blue-900">🏠 Purpose</h3>
              <p className="text-blue-800">
                The Home page serves as your landing page after login, offering immediate visibility 
                into your recent work and quick navigation to frequently accessed items.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Page Layout</h2>
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">Welcome Section</h3>
                <p className="text-gray-600 mb-4">
                  Displays a personalized greeting with your username and the current date, 
                  providing context for your dashboard view.
                </p>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="font-medium text-gray-800">Welcome, [Your Name]</div>
                  <div className="text-sm text-gray-500">ASTRA Dashboard</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">Recently Viewed Items Table</h3>
                <p className="text-gray-600 mb-4">
                  A comprehensive table showing your recent activity across all ASTRA modules.
                </p>
                <div className="bg-gray-50 p-4 rounded">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Column</th>
                        <th className="text-left py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Type</td>
                        <td className="py-2">Test Case, User Story, Release, or Project</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Name</td>
                        <td className="py-2">The title or name of the item</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">ID</td>
                        <td className="py-2">Unique identifier for reference</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Viewed</td>
                        <td className="py-2">Timestamp of last access</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Features & Functionality</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="text-2xl mr-2">🔍</span>
                  Quick Navigation
                </h3>
                <p className="text-gray-700">
                  Click any item in the Recently Viewed table to navigate directly to it in 
                  the appropriate module (Studio, Analytics, etc.)
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="text-2xl mr-2">📊</span>
                  Activity Tracking
                </h3>
                <p className="text-gray-700">
                  Monitor your testing workflow with chronological activity logs that update 
                  in real-time as you work
                </p>
              </div>
            </div>
          </section>
        </>
      )
    },
    recentitems: {
      title: "Recently Viewed Items",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              The Recently Viewed Items feature tracks and displays your interaction history 
              across ASTRA, making it easy to resume work and access frequently used items.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">How It Works</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                ASTRA automatically tracks items you interact with across all modules:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Automatic Tracking:</strong> Items are added to your history when you 
                    view or interact with them
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Cross-Module:</strong> Tracks items from Studio, Analytics, and Admin modules
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Persistent History:</strong> Your history is saved across sessions
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Item Types Tracked</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-blue-600">📌 Test Cases</h4>
                <p className="text-sm text-gray-600">Individual test cases you've viewed or edited</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-green-600">📋 User Stories</h4>
                <p className="text-sm text-gray-600">User stories you've accessed for test generation</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-purple-600">📄 Releases</h4>
                <p className="text-sm text-gray-600">Release versions you've managed or reviewed</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-orange-600">📁 Projects</h4>
                <p className="text-sm text-gray-600">Projects you've navigated or modified</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Using Recently Viewed Items</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Quick Access</h4>
                <p className="text-gray-700">
                  Click on any item in the table to navigate directly to it. The system will 
                  automatically open the appropriate module and display the selected item.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Time References</h4>
                <p className="text-gray-700">
                  The "Viewed" column shows relative timestamps (e.g., "2 hours ago", "Yesterday") 
                  for easy reference to when you last accessed each item.
                </p>
              </div>
            </div>
          </section>
        </>
      )
    },
    navigation: {
      title: "Navigation Guide",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Learn how to efficiently navigate through ASTRA's interface and access different modules.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Main Navigation Menu</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                The main navigation menu is located at the top of the screen and provides access to all major modules:
              </p>
              <div className="bg-gray-900 text-white p-4 rounded-lg">
                <div className="flex space-x-6 text-sm">
                  <span className="hover:text-blue-400 cursor-pointer">Home</span>
                  <span className="hover:text-blue-400 cursor-pointer">Studio</span>
                  <span className="hover:text-blue-400 cursor-pointer">Analytics</span>
                  <span className="hover:text-blue-400 cursor-pointer">Admin</span>
                  <span className="hover:text-blue-400 cursor-pointer">Documentation</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Module Descriptions</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">🏠 Home</h3>
                <p className="text-gray-600">
                  Your dashboard and landing page. View recent items and get an overview of your activities.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">🎨 Studio</h3>
                <p className="text-gray-600">
                  Test management workspace. Create, organize, and generate test cases. Access COBOL Builder for legacy systems.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">📊 Analytics</h3>
                <p className="text-gray-600">
                  View executive and operational dashboards with testing metrics and insights.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">⚙️ Admin</h3>
                <p className="text-gray-600">
                  Administrative controls for managing users, projects, releases, and system settings.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Keyboard Shortcuts</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Shortcut</th>
                    <th className="text-left py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2"><kbd className="px-2 py-1 bg-gray-100 rounded">Alt + H</kbd></td>
                    <td className="py-2">Go to Home</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2"><kbd className="px-2 py-1 bg-gray-100 rounded">Alt + S</kbd></td>
                    <td className="py-2">Go to Studio</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2"><kbd className="px-2 py-1 bg-gray-100 rounded">Alt + A</kbd></td>
                    <td className="py-2">Go to Analytics</td>
                  </tr>
                  <tr>
                    <td className="py-2"><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl + /</kbd></td>
                    <td className="py-2">Search</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </>
      )
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {content[topic]?.title || "Home Page"}
      </h1>
      {content[topic]?.content || <p>Content coming soon...</p>}
    </div>
  );
}

// app/documentation/components/content/StudioContent.js
"use client";

export default function StudioContent({ topic }) {
  const content = {
    studiooverview: {
      title: "Studio Overview",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              The Studio is ASTRA's primary workspace for test management and execution. It provides 
              a comprehensive interface for organizing test cases, generating automated tests using AI, 
              and managing COBOL-related testing workflows.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-semibold mb-2 text-blue-900">🎨 Purpose</h3>
              <p className="text-blue-800">
                Studio centralizes all test management activities, from creating and organizing test 
                cases to leveraging AI for automated test generation.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Studio Modes</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <span className="text-2xl mr-3">✅</span>
                  Test Cases Mode
                </h3>
                <p className="text-gray-600 mb-3">
                  The default mode for comprehensive test management:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Navigate through projects, releases, and user stories</li>
                  <li>Generate AI-powered test cases</li>
                  <li>Manage and organize existing test cases</li>
                  <li>View and edit test steps</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <span className="text-2xl mr-3">💻</span>
                  COBOL Builder Mode
                </h3>
                <p className="text-gray-600 mb-3">
                  Specialized environment for legacy system testing:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Upload source and target copybook files</li>
                  <li>Define mapping rules</li>
                  <li>Generate COBOL code using AI</li>
                  <li>Download generated code</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Interface Layout</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">Left Panel</h4>
                <p className="text-gray-600 text-sm mb-3">Test Tree navigation with:</p>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Mode toggle (Test Cases/COBOL)</li>
                  <li>• Search functionality</li>
                  <li>• Hierarchical tree view</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">Middle Panel</h4>
                <p className="text-gray-600 text-sm mb-3">Main content area showing:</p>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Tables and lists</li>
                  <li>• Test case details</li>
                  <li>• Action toolbar</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">Right Panel</h4>
                <p className="text-gray-600 text-sm mb-3">Context-sensitive area for:</p>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• AI generation forms</li>
                  <li>• Configuration settings</li>
                  <li>• User prompts</li>
                </ul>
              </div>
            </div>
          </section>
        </>
      )
    },
    testtree: {
      title: "Test Tree Navigation",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              The Test Tree is your primary navigation tool in Studio, organizing all test assets 
              in a hierarchical structure that mirrors your development workflow.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Hierarchy Structure</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                ASTRA uses a three-level hierarchy to organize test assets:
              </p>
              <div className="bg-gray-900 text-white p-6 rounded-lg font-mono">
                <div className="mb-3">
                  <span className="text-yellow-400">📁</span> <strong>Project</strong>
                  <span className="text-gray-400 ml-3">// Top-level container</span>
                </div>
                <div className="ml-6 mb-3">
                  <span className="text-green-400">📄</span> <strong>Release</strong>
                  <span className="text-gray-400 ml-3">// Version-specific grouping</span>
                </div>
                <div className="ml-12">
                  <span className="text-blue-400">📌</span> <strong>User Story</strong>
                  <span className="text-gray-400 ml-3">// Feature-level organization</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Navigation Behavior</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">📁 When Selecting a Project</h3>
                <p className="text-gray-700 mb-2">The middle panel displays:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Table of all releases within the project</li>
                  <li>Release version numbers and dates</li>
                  <li>Number of user stories per release</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">📄 When Selecting a Release</h3>
                <p className="text-gray-700 mb-2">The middle panel displays:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Table of all user stories in the release</li>
                  <li>Story status and priority</li>
                  <li>Checkbox selection for bulk operations</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">📌 When Selecting a User Story</h3>
                <p className="text-gray-700 mb-2">The middle panel displays:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>List of test cases on the left side</li>
                  <li>Test steps details on the right side</li>
                  <li>Test case status and execution results</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Search Functionality</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                The search bar in the left panel allows you to quickly find items across the entire tree:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Real-time Search:</strong> Results update as you type
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Cross-level Search:</strong> Searches projects, releases, and user stories simultaneously
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Highlight Matches:</strong> Search terms are highlighted in results
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </>
      )
    },
    testcases: {
      title: "Managing Test Cases",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Learn how to create, organize, edit, and manage test cases within ASTRA's Studio environment.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Test Case Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3">Test Case Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>ID:</strong> Unique identifier</li>
                  <li>• <strong>Title:</strong> Descriptive name</li>
                  <li>• <strong>Type:</strong> Functional, Performance, etc.</li>
                  <li>• <strong>Priority:</strong> High, Medium, Low</li>
                  <li>• <strong>Status:</strong> Draft, Ready, Executed</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3">Test Steps</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Step Number:</strong> Sequential order</li>
                  <li>• <strong>Description:</strong> Action to perform</li>
                  <li>• <strong>Expected Result:</strong> Anticipated outcome</li>
                  <li>• <strong>Actual Result:</strong> Execution outcome</li>
                  <li>• <strong>Status:</strong> Pass/Fail/Blocked</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Test Case Operations</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Creating Test Cases</h3>
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  <li>Navigate to a user story</li>
                  <li>Click the "Generate" button or "Add New" for manual creation</li>
                  <li>Configure generation settings or fill in manual details</li>
                  <li>Save the test case</li>
                </ol>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Editing Test Cases</h3>
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  <li>Select the test case from the list</li>
                  <li>Click the edit icon or double-click the test case</li>
                  <li>Modify the required fields</li>
                  <li>Save your changes</li>
                </ol>
              </div>

              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Deleting Test Cases</h3>
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  <li>Select one or more test cases using checkboxes</li>
                  <li>Click the delete button in the toolbar</li>
                  <li>Confirm the deletion in the popup dialog</li>
                </ol>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Best Practices</h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <ul className="space-y-3 text-amber-800">
                <li>• Use descriptive titles that clearly indicate the test purpose</li>
                <li>• Include both positive and negative test scenarios</li>
                <li>• Keep test steps atomic and easy to follow</li>
                <li>• Regularly review and update test cases</li>
                <li>• Use consistent naming conventions</li>
              </ul>
            </div>
          </section>
        </>
      )
    },
    generating: {
      title: "AI Test Generation",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              ASTRA's AI-powered test generation leverages advanced language models to automatically 
              create comprehensive test cases based on your user stories and requirements.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-2 text-blue-900">🤖 AI Models Available</h3>
              <div className="flex gap-4 mt-3">
                <span className="bg-white px-3 py-1 rounded shadow-sm">GPT-4</span>
                <span className="bg-white px-3 py-1 rounded shadow-sm">Claude</span>
                <span className="bg-white px-3 py-1 rounded shadow-sm">Gemini</span>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Generation Process</h2>
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Select User Story",
                  description: "Navigate to a user story in the test tree or select from the release table"
                },
                {
                  step: 2,
                  title: "Click Generate",
                  description: "The Generate button activates when a user story is selected"
                },
                {
                  step: 3,
                  title: "Configure Settings",
                  description: "Right panel opens with generation options"
                },
                {
                  step: 4,
                  title: "Generate",
                  description: "Click 'Generate Test Cases' to create AI-powered tests"
                }
              ].map((item) => (
                <div key={item.step} className="bg-white border-l-4 border-blue-500 shadow-md rounded-r-lg p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Configuration Options</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">🤖 Choose LLM Model</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <h4 className="font-medium text-blue-600">GPT-4</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Advanced reasoning and comprehensive coverage
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <h4 className="font-medium text-green-600">Claude</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Detailed analysis and edge case detection
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <h4 className="font-medium text-purple-600">Gemini</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Fast generation with good accuracy
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">📝 Choose Format</h3>
                <div className="space-y-3 mt-4">
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <h4 className="font-medium">Freeform</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      AI generates test cases without structural constraints
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <h4 className="font-medium">Freeform & Template</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Combines AI creativity with your predefined templates
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">🎯 Custom Prompt</h3>
                <p className="text-gray-600 mb-3">
                  Provide specific instructions to guide the AI generation:
                </p>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 italic">
                    Example: "Focus on edge cases and error handling scenarios. Include both positive 
                    and negative test cases. Ensure coverage of boundary conditions."
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Bulk Generation</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">📦 Generate for Multiple Stories</h3>
              <ol className="list-decimal pl-6 space-y-2 text-blue-800">
                <li>Navigate to a release in the test tree</li>
                <li>Select multiple user stories using checkboxes</li>
                <li>Click the Generate button</li>
                <li>Configure settings once for all selected stories</li>
                <li>Generate test cases for all stories simultaneously</li>
              </ol>
            </div>
          </section>
        </>
      )
    },
    cobolbuilder: {
      title: "COBOL Builder",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              The COBOL Builder is a specialized tool within ASTRA Studio designed for legacy system 
              testing and COBOL code generation using AI-powered capabilities.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-semibold mb-2 text-blue-900">💻 Purpose</h3>
              <p className="text-blue-800">
                Generate COBOL code for data transformation and testing legacy systems with modern AI assistance.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Accessing COBOL Builder</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                <li>Navigate to the Studio tab</li>
                <li>In the left panel, locate the mode toggle buttons</li>
                <li>Select "COBOL Builder" radio button</li>
                <li>The interface switches to COBOL Builder mode</li>
              </ol>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Required Files</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="text-2xl mr-3">📄</span>
                  Source Copybook
                </h3>
                <p className="text-gray-600 mb-3">
                  Upload your source copybook files that define input data structures:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Maximum 3 files allowed</li>
                  <li>Supported formats: .cpy, .cbl, .txt</li>
                  <li>Define input data structures</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="text-2xl mr-3">📄</span>
                  Target Copybook
                </h3>
                <p className="text-gray-600 mb-3">
                  Upload the target copybook file for output structure:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Single file only</li>
                  <li>Defines output data structure</li>
                  <li>Must match expected format</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  Mapping Rules
                </h3>
                <p className="text-gray-600 mb-3">
                  Define transformation rules between source and target:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>CSV or Excel format recommended</li>
                  <li>Field-to-field mappings</li>
                  <li>Transformation logic</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Generation Process</h2>
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Upload Files",
                  description: "Upload source copybook, target copybook, and mapping rules"
                },
                {
                  step: 2,
                  title: "Select LLM Model",
                  description: "Choose from GPT-4, Claude, or Gemini based on your needs"
                },
                {
                  step: 3,
                  title: "Configure Instructions",
                  description: "Review and modify the pre-populated instructions if needed"
                },
                {
                  step: 4,
                  title: "Generate Code",
                  description: "Click Generate to create COBOL code"
                },
                {
                  step: 5,
                  title: "Review & Download",
                  description: "Review generated code and download using the download button"
                }
              ].map((item) => (
                <div key={item.step} className="bg-white border-l-4 border-green-500 shadow-md rounded-r-lg p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Instructions Field</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                The Instructions/Prompt field comes pre-populated with standard COBOL generation 
                guidelines. You can customize this to include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Specific naming conventions for your organization</li>
                <li>Performance optimization requirements</li>
                <li>Error handling specifications</li>
                <li>Comments and documentation standards</li>
                <li>Compliance requirements</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold mb-3 text-amber-900">⚠️ Important Considerations</h3>
              <ul className="space-y-2 text-amber-800">
                <li>• Always review generated code before production use</li>
                <li>• Ensure mapping rules are complete and accurate</li>
                <li>• Test generated code with sample data</li>
                <li>• Validate against your organization's COBOL standards</li>
                <li>• Keep backups of original code before replacement</li>
              </ul>
            </div>
          </section>
        </>
      )
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {content[topic]?.title || "Studio"}
      </h1>
      {content[topic]?.content || <p>Content coming soon...</p>}
    </div>
  );
}

// app/documentation/components/content/AnalyticsContent.js
"use client";

export default function AnalyticsContent({ topic }) {
  const content = {
    analyticsoverview: {
      title: "Analytics Overview",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              The Analytics section of ASTRA provides comprehensive insights into your testing activities 
              through two specialized dashboards: Executive and Operational. These dashboards help stakeholders 
              at all levels make data-driven decisions about testing quality and efficiency.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-semibold mb-2 text-blue-900">📊 Purpose</h3>
              <p className="text-blue-800">
                Transform testing data into actionable insights with real-time metrics, trends analysis, 
                and comprehensive reporting capabilities.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Dashboard Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-lg mb-2">Executive Dashboard</h3>
                <p className="text-gray-600 mb-3">
                  High-level metrics and visualizations for leadership:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
                  <li>Strategic KPIs and trends</li>
                  <li>Tableau-powered visualizations</li>
                  <li>Quality metrics overview</li>
                  <li>Resource utilization</li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">⚙️</div>
                <h3 className="font-semibold text-lg mb-2">Operational Dashboard</h3>
                <p className="text-gray-600 mb-3">
                  Real-time operational metrics for daily activities:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
                  <li>Live database metrics</li>
                  <li>Test execution status</li>
                  <li>AI generation statistics</li>
                  <li>Performance tracking</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Accessing Analytics</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                <li>Click on the "Analytics" tab in the main navigation menu</li>
                <li>Choose between "Executive" or "Operational" from the left sidebar</li>
                <li>The selected dashboard loads in the main content area</li>
                <li>Use filters and date ranges to customize your view</li>
              </ol>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Key Features</h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="text-2xl mr-3">📈</span>
                  Real-time Updates
                </h3>
                <p className="text-gray-700">
                  Dashboards refresh automatically to show the latest testing data, ensuring you always 
                  have current information for decision-making.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  Interactive Visualizations
                </h3>
                <p className="text-gray-700">
                  Click, filter, and drill down into specific metrics for detailed analysis. Export 
                  charts and data for presentations and reports.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="text-2xl mr-3">📅</span>
                  Time-based Analysis
                </h3>
                <p className="text-gray-700">
                  View trends over different time periods to track progress, identify patterns, and 
                  make informed predictions.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold mb-3 text-amber-900">💡 Pro Tips</h3>
              <ul className="space-y-2 text-amber-800">
                <li>• Use Executive Dashboard for quarterly reviews and strategic planning</li>
                <li>• Leverage Operational Dashboard for daily stand-ups and sprint retrospectives</li>
                <li>• Set up custom alerts for critical metrics</li>
                <li>• Export data regularly for historical analysis</li>
              </ul>
            </div>
          </section>
        </>
      )
    },
    executive: {
      title: "Executive Dashboard",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              The Executive Dashboard provides high-level insights and visualizations designed for 
              leadership and management teams to monitor testing performance, quality trends, and 
              resource utilization.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-semibold mb-2 text-blue-900">📊 Powered by Tableau</h3>
              <p className="text-blue-800">
                Leveraging Tableau's powerful visualization capabilities to present complex testing 
                data in an intuitive, actionable format.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Key Metrics Tracked</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-blue-600">📊 Test Coverage Metrics</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Overall test coverage percentage
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Coverage by project and release
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Untested features identification
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Risk assessment by coverage gaps
                  </li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-green-600">📈 Quality Trends</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Pass/fail rates over time
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Defect discovery trends
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Quality gates compliance
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Regression test effectiveness
                  </li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-purple-600">⚡ AI Utilization</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Test cases generated by AI
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Time saved through automation
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    AI model performance comparison
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Adoption rate across teams
                  </li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-orange-600">👥 Resource Analytics</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Team productivity metrics
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Workload distribution
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Testing velocity trends
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Resource allocation efficiency
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Dashboard Components</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">📈 Trend Charts</h3>
                <p className="text-gray-600">
                  Line and area charts showing testing metrics over time, allowing you to identify 
                  patterns and predict future trends.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">🥧 Distribution Visualizations</h3>
                <p className="text-gray-600">
                  Pie charts and donut charts displaying test case distribution by status, priority, 
                  and type across projects.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">📊 Comparative Analysis</h3>
                <p className="text-gray-600">
                  Bar charts comparing performance across different teams, projects, and releases 
                  for benchmarking.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">🗺️ Heat Maps</h3>
                <p className="text-gray-600">
                  Visual representations of test coverage and defect density across different 
                  application areas.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Key Performance Indicators (KPIs)</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">KPI</th>
                    <th className="text-left py-3">Description</th>
                    <th className="text-left py-3">Target</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 font-medium">Test Execution Rate</td>
                    <td className="py-3 text-gray-600">Tests executed per sprint</td>
                    <td className="py-3 text-green-600">≥ 95%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium">Defect Detection Rate</td>
                    <td className="py-3 text-gray-600">% of defects found before production</td>
                    <td className="py-3 text-green-600">≥ 90%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium">Automation ROI</td>
                    <td className="py-3 text-gray-600">Cost savings from AI generation</td>
                    <td className="py-3 text-green-600">≥ 60%</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Time to Market</td>
                    <td className="py-3 text-gray-600">Impact on release cycles</td>
                    <td className="py-3 text-green-600">-20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-900">✨ Dashboard Features</h3>
              <ul className="space-y-2 text-green-800">
                <li>• Export reports in PDF or Excel format</li>
                <li>• Schedule automated report distribution</li>
                <li>• Customize dashboard views based on role</li>
                <li>• Set up alerts for critical metrics</li>
                <li>• Share dashboards with stakeholders</li>
                <li>• Create custom metrics and calculations</li>
              </ul>
            </div>
          </section>
        </>
      )
    },
    operational: {
      title: "Operational Dashboard",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              The Operational Dashboard provides real-time, detailed metrics directly from the ASTRA 
              database, offering granular insights into day-to-day testing activities and performance.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-semibold mb-2 text-blue-900">⚙️ Live Database Connection</h3>
              <p className="text-blue-800">
                Direct connection to ASTRA's database ensures real-time data with automatic refresh 
                every 30 seconds for up-to-the-minute insights.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Real-time Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-blue-600">🔄 Test Execution Status</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Currently running tests</li>
                  <li>• Queue status and wait times</li>
                  <li>• Failed test details with logs</li>
                  <li>• Blocked or skipped tests</li>
                  <li>• Execution history timeline</li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-green-600">📝 Test Case Analytics</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Total test cases by status</li>
                  <li>• New vs. modified test cases</li>
                  <li>• Test case complexity metrics</li>
                  <li>• Coverage gaps identification</li>
                  <li>• Test case effectiveness</li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-purple-600">🤖 AI Generation Metrics</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Generation success rates by model</li>
                  <li>• Average generation time</li>
                  <li>• User acceptance rates</li>
                  <li>• Model usage distribution</li>
                  <li>• Prompt effectiveness analysis</li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-orange-600">⏱️ Performance Tracking</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Test execution duration trends</li>
                  <li>• System response times</li>
                  <li>• Resource utilization</li>
                  <li>• Bottleneck identification</li>
                  <li>• Performance optimization opportunities</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Operational Views</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">📊 Test Execution Monitor</h3>
                <p className="text-gray-600 mb-3">
                  Real-time view of all test executions with status, progress, and results:
                </p>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">247</div>
                      <div className="text-gray-500">Passed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">12</div>
                      <div className="text-gray-500">Failed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">15</div>
                      <div className="text-gray-500">Running</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">8</div>
                      <div className="text-gray-500">Queued</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">🚨 Health Monitor</h3>
                <p className="text-gray-600 mb-3">
                  System health indicators and alerts:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Flaky test identification</li>
                  <li>Long-running test alerts</li>
                  <li>Test maintenance requirements</li>
                  <li>Environment stability status</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">📈 Daily Activity Summary</h3>
                <p className="text-gray-600 mb-3">
                  Automated summary of testing activities:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Tests executed today</li>
                  <li>Pass/fail distribution</li>
                  <li>New defects discovered</li>
                  <li>Team member contributions</li>
                  <li>AI generations completed</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Database Features</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Live Updates:</strong> Data refreshes every 30 seconds automatically
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Drill-down Capability:</strong> Click any metric to see detailed records
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Custom Queries:</strong> Build your own reports using the query builder
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Data Export:</strong> Export raw data for external analysis in CSV/Excel
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold mb-3 text-amber-900">🔔 Alerts & Notifications</h3>
              <p className="text-amber-800 mb-3">
                Set up custom alerts for critical operational metrics:
              </p>
              <ul className="space-y-2 text-amber-800">
                <li>• Test failure rate exceeds threshold (e.g., >10%)</li>
                <li>• Test execution queue backlog (>20 tests waiting)</li>
                <li>• AI generation failures (>3 consecutive failures)</li>
                <li>• System performance degradation (response time >5s)</li>
                <li>• Database connection issues</li>
                <li>• Unusual activity patterns detected</li>
              </ul>
            </div>
          </section>
        </>
      )
    },
    customdashboards: {
      title: "Custom Dashboards",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Create and customize your own dashboards to track specific metrics and KPIs relevant 
              to your team or project needs.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Creating Custom Dashboards</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                <li>Navigate to Analytics section</li>
                <li>Click "Create New Dashboard" button</li>
                <li>Choose dashboard type (Executive or Operational)</li>
                <li>Select widgets and metrics to display</li>
                <li>Configure layout and visualization types</li>
                <li>Save and share with team members</li>
              </ol>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Available Widgets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">📈 Chart Widgets</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Line charts</li>
                  <li>• Bar charts</li>
                  <li>• Pie charts</li>
                  <li>• Area charts</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">📊 Data Widgets</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Data tables</li>
                  <li>• Metric cards</li>
                  <li>• Progress bars</li>
                  <li>• Gauges</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">🎨 Customization Options</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• Drag-and-drop layout editor</li>
                <li>• Custom color schemes</li>
                <li>• Flexible time ranges</li>
                <li>• Filter configurations</li>
                <li>• Export templates for reuse</li>
              </ul>
            </div>
          </section>
        </>
      )
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {content[topic]?.title || "Analytics"}
      </h1>
      {content[topic]?.content || <p>Content coming soon...</p>}
    </div>
  );
}

// app/documentation/components/content/AdminContent.js
"use client";

export default function AdminContent({ topic }) {
  const content = {
    adminoverview: {
      title: "Admin Panel Overview",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              The Admin panel provides comprehensive administrative controls for managing users, 
              projects, releases, and system-wide settings in ASTRA. Access is restricted to users 
              with administrative privileges.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-semibold mb-2 text-blue-900">⚙️ Purpose</h3>
              <p className="text-blue-800">
                Centralize administrative tasks and system management to ensure smooth operation 
                of the ASTRA platform across your organization.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Admin Sections</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  Management Tab
                </h3>
                <p className="text-gray-600 mb-3">
                  Core management functions for projects and users:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Projects & Releases:</strong> Manage project lifecycle and releases</li>
                  <li><strong>User Management:</strong> Control user access and permissions</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <span className="text-2xl mr-3">🔧</span>
                  System Settings
                </h3>
                <p className="text-gray-600 mb-3">
                  Configure system-wide settings and preferences:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>AI model configurations</li>
                  <li>Integration settings</li>
                  <li>Security policies</li>
                  <li>Backup and recovery</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Access Control</h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold mb-3 text-amber-900">🔐 Admin Privileges Required</h3>
              <p className="text-amber-800 mb-3">
                Only users with Administrator role can access the Admin panel. The system supports 
                three primary roles:
              </p>
              <ul className="space-y-2 text-amber-800">
                <li>• <strong>Administrator:</strong> Full system access and control</li>
                <li>• <strong>Manager:</strong> Project and team management capabilities</li>
                <li>• <strong>Tester:</strong> Test execution and creation access</li>
              </ul>
            </div>
          </section>
        </>
      )
    },
    projectmanagement: {
      title: "Projects & Releases",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              The Projects & Releases section allows administrators to manage the complete lifecycle 
              of projects and their associated releases within ASTRA.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Interface Overview</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                The Projects & Releases page displays a comprehensive table with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>List of all projects and their corresponding releases</li>
                <li>Project status and metadata</li>
                <li>Release versions and dates</li>
                <li>Actions column for management operations</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Key Features</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="text-xl mr-3">🔄</span>
                  Refresh Release
                </h3>
                <p className="text-gray-600 mb-3">
                  Use the refresh icon in the actions column to sync release data:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Updates release metadata</li>
                  <li>Syncs with external systems</li>
                  <li>Refreshes user story associations</li>
                  <li>Recalculates metrics</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="text-xl mr-3">➕</span>
                  Onboard Project/Release
                </h3>
                <p className="text-gray-600 mb-3">
                  Click the "Onboard Project/Release" button to add new items:
                </p>
                <div className="bg-gray-50 p-4 rounded mt-3">
                  <h4 className="font-medium mb-2">Onboarding Process:</h4>
                  <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-600">
                    <li>Click "Onboard Project/Release" button</li>
                    <li>Select type (Project or Release)</li>
                    <li>Fill in required information</li>
                    <li>Configure settings and permissions</li>
                    <li>Submit for creation</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Project Information</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Field</th>
                    <th className="text-left py-2">Description</th>
                    <th className="text-left py-2">Required</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Project Name</td>
                    <td className="py-2">Unique project identifier</td>
                    <td className="py-2 text-green-600">Yes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Description</td>
                    <td className="py-2">Project overview and objectives</td>
                    <td className="py-2 text-gray-400">No</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Start Date</td>
                    <td className="py-2">Project initiation date</td>
                    <td className="py-2 text-green-600">Yes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">End Date</td>
                    <td className="py-2">Expected completion date</td>
                    <td className="py-2 text-gray-400">No</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Team Members</td>
                    <td className="py-2">Assigned team members</td>
                    <td className="py-2 text-green-600">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Release Management</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Release Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Version number (e.g., v1.0.0, v2.1.3)</li>
                  <li>Release date and timeline</li>
                  <li>Associated user stories</li>
                  <li>Test coverage status</li>
                  <li>Release notes and documentation</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Release Actions</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Edit release details</li>
                  <li>Refresh release data</li>
                  <li>Archive completed releases</li>
                  <li>Clone release for new version</li>
                  <li>Generate release reports</li>
                </ul>
              </div>
            </div>
          </section>
        </>
      )
    },
    usermanagement: {
      title: "User Management",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              The User Management section provides comprehensive controls for managing user accounts, 
              roles, and permissions within ASTRA.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">User List Interface</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                The User Management page displays a table with all system users showing:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>User name and email</li>
                <li>Assigned role (Admin, Manager, Tester)</li>
                <li>Account status (Active/Inactive)</li>
                <li>Last login timestamp</li>
                <li>Actions for user management</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">User Roles</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-red-600">👤 Administrator</h3>
                <p className="text-gray-600 mb-3">Full system access with complete control:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Manage all users and roles</li>
                  <li>Create and delete projects</li>
                  <li>Access all system settings</li>
                  <li>View all analytics and reports</li>
                  <li>Configure integrations</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-blue-600">👥 Manager</h3>
                <p className="text-gray-600 mb-3">Project and team management capabilities:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Manage project team members</li>
                  <li>Create and manage releases</li>
                  <li>View project analytics</li>
                  <li>Approve test cases</li>
                  <li>Generate reports</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-green-600">✅ Tester</h3>
                <p className="text-gray-600 mb-3">Test execution and creation access:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Create and edit test cases</li>
                  <li>Execute test cases</li>
                  <li>Generate AI test cases</li>
                  <li>View assigned projects</li>
                  <li>Update test results</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">User Operations</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="text-xl mr-3">➕</span>
                  Add User
                </h3>
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  <li>Click the "+ Add User" button</li>
                  <li>Enter user details (name, email)</li>
                  <li>Select appropriate role</li>
                  <li>Configure permissions if needed</li>
                  <li>Send invitation email</li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="text-xl mr-3">✏️</span>
                  Edit User
                </h3>
                <p className="text-gray-700 mb-3">
                  Click the edit icon in the actions column to:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Change user role</li>
                  <li>Update user information</li>
                  <li>Modify permissions</li>
                  <li>Reset password</li>
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="text-xl mr-3">🗑️</span>
                  Delete User
                </h3>
                <p className="text-gray-700 mb-3">
                  Remove users from the system:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Click delete icon in actions column</li>
                  <li>Confirm deletion in popup</li>
                  <li>User data is archived</li>
                  <li>Access is immediately revoked</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold mb-3 text-amber-900">⚠️ Important Considerations</h3>
              <ul className="space-y-2 text-amber-800">
                <li>• Deleting a user does not delete their created test cases</li>
                <li>• Role changes take effect immediately</li>
                <li>• Users receive email notifications for role changes</li>
                <li>• Maintain at least one administrator account</li>
                <li>• Regular audit of user permissions is recommended</li>
              </ul>
            </div>
          </section>
        </>
      )
    },
    rolepermissions: {
      title: "Roles & Permissions",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Configure and manage user roles and their associated permissions to ensure proper 
              access control throughout ASTRA.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Permission Matrix</h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4">Feature/Action</th>
                    <th className="text-center py-3 px-4">Admin</th>
                    <th className="text-center py-3 px-4">Manager</th>
                    <th className="text-center py-3 px-4">Tester</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-3 px-4 font-medium">View Projects</td>
                    <td className="text-center py-3 px-4 text-green-600">✓</td>
                    <td className="text-center py-3 px-4 text-green-600">✓</td>
                    <td className="text-center py-3 px-4 text-green-600">✓</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="py-3 px-4 font-medium">Create Projects</td>
                    <td className="text-center py-3 px-4 text-green-600">✓</td>
                    <td className="text-center py-3 px-4 text-green-600">✓</td>
                    <td className="text-center py-3 px-4 text-red-600">✗</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-3 px-4 font-medium">Delete Projects</td>
                    <td className="text-center py-3 px-4 text-green-600">✓</td>
                    <td className="text-center py-3 px-4 text-red-600">✗</td>
                    <td className="text-center py-3 px-4 text-red-600">✗</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="py-3 px-4 font-medium">Manage Users</td>
                    <td className="text-center py-3 px-4 text-green-600">✓</td>
                    <td className="text-center py-3 px-4 text-red-600">✗</td>
                    <td className="text-center py-3 px-4 text-red-600">✗</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-3 px-4 font-medium">Generate Test Cases</td>
                    <td className="text-center py-3 px-4 text-green-600">✓</td>
                    <td className="text-center py-3 px-4 text-green-600">✓</td>
                    <td className="text-center py-3 px-4 text-green-600">✓</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="py-3 px-4 font-medium">View Analytics</td>
                    <td className="text-center py-3 px-4 text-green-600">✓</td>
                    <td className="text-center py-3 px-4 text-green-600">✓</td>
                    <td className="text-center py-3 px-4 text-yellow-600">Limited</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-3 px-4 font-medium">System Settings</td>
                    <td className="text-center py-3 px-4 text-green-600">✓</td>
                    <td className="text-center py-3 px-4 text-red-600">✗</td>
                    <td className="text-center py-3 px-4 text-red-600">✗</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Custom Permissions</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                Administrators can create custom permission sets for specific use cases:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Project-specific permissions</li>
                <li>Time-limited access grants</li>
                <li>Read-only observers</li>
                <li>External auditor access</li>
                <li>Contractor limitations</li>
              </ul>
            </div>
          </section>
        </>
      )
    },
    systemsettings: {
      title: "System Settings",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Configure system-wide settings, integrations, and preferences that affect the entire 
              ASTRA platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Configuration Categories</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3">🤖 AI Model Configuration</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Default AI model selection</li>
                  <li>API key management</li>
                  <li>Rate limiting settings</li>
                  <li>Model-specific parameters</li>
                  <li>Fallback model configuration</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3">🔐 Security Settings</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Password policies</li>
                  <li>Session timeout configuration</li>
                  <li>Two-factor authentication</li>
                  <li>IP whitelisting</li>
                  <li>Audit log retention</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3">🔗 Integrations</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>JIRA integration settings</li>
                  <li>Git repository connections</li>
                  <li>CI/CD pipeline configuration</li>
                  <li>Slack/Teams notifications</li>
                  <li>Email server settings</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3">💾 Backup & Recovery</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Automated backup schedule</li>
                  <li>Backup retention policy</li>
                  <li>Recovery procedures</li>
                  <li>Data export settings</li>
                  <li>Archive management</li>
                </ul>
              </div>
            </div>
          </section>
        </>
      )
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {content[topic]?.title || "Admin"}
      </h1>
      {content[topic]?.content || <p>Content coming soon...</p>}
    </div>
  );
}

// app/documentation/components/content/TroubleshootingContent.js
"use client";

export default function TroubleshootingContent({ topic }) {
  const content = {
    faq: {
      title: "Frequently Asked Questions",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Find answers to the most common questions about using ASTRA. This FAQ covers 
              everything from basic navigation to advanced features.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">General Questions</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-blue-600">
                  What is ASTRA and who should use it?
                </h3>
                <p className="text-gray-600">
                  ASTRA is an AI-powered testing and quality assurance platform designed for QA teams, 
                  test engineers, and development teams. It's ideal for organizations looking to automate 
                  test case generation, improve test coverage, and streamline their testing workflows.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-blue-600">
                  What browsers are supported?
                </h3>
                <p className="text-gray-600 mb-3">
                  ASTRA supports the following browsers:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Google Chrome (v90+) - Recommended</li>
                  <li>Microsoft Edge (v90+)</li>
                  <li>Mozilla Firefox (v88+)</li>
                  <li>Safari (v14+)</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-blue-600">
                  Is my data secure in ASTRA?
                </h3>
                <p className="text-gray-600">
                  Yes, ASTRA implements enterprise-grade security measures including encryption at rest 
                  and in transit, role-based access control, and regular security audits. All AI processing 
                  is done securely with no data retention by third-party AI providers.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Test Generation Questions</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-green-600">
                  How do I generate test cases for multiple user stories at once?
                </h3>
                <p className="text-gray-600 mb-3">
                  To generate test cases for multiple user stories:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                  <li>Navigate to a release in the Test Tree</li>
                  <li>Select multiple user stories using the checkboxes in the table</li>
                  <li>Click the "Generate" button in the toolbar</li>
                  <li>Configure settings once for all selected stories</li>
                  <li>Click "Generate Test Cases" to process all stories simultaneously</li>
                </ol>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-green-600">
                  Which AI model should I choose for test generation?
                </h3>
                <p className="text-gray-600 mb-3">
                  Choose based on your specific needs:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>GPT-4:</strong> Best for complex scenarios and comprehensive coverage</li>
                  <li><strong>Claude:</strong> Excellent for detailed analysis and edge case detection</li>
                  <li><strong>Gemini:</strong> Ideal for quick generation with good accuracy</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-green-600">
                  Can I edit the generated test cases?
                </h3>
                <p className="text-gray-600">
                  Yes! All generated test cases are fully editable. After generation, you can modify 
                  test steps, expected results, priorities, and any other details to match your specific 
                  requirements. Simply click on a test case to edit it.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-green-600">
                  What's the difference between Freeform and Template formats?
                </h3>
                <p className="text-gray-600 mb-3">
                  The format options provide different levels of structure:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Freeform:</strong> AI generates test cases without constraints, allowing for maximum creativity and coverage</li>
                  <li><strong>Freeform & Template:</strong> Combines AI generation with your predefined templates for consistency</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">COBOL Builder Questions</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-purple-600">
                  How many source copybook files can I upload?
                </h3>
                <p className="text-gray-600">
                  You can upload up to 3 source copybook files in the COBOL Builder. The system will 
                  process all uploaded files together when generating COBOL code. Supported formats 
                  include .cpy, .cbl, and .txt files.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-purple-600">
                  What should my mapping rules file contain?
                </h3>
                <p className="text-gray-600 mb-3">
                  Your mapping rules file should include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Source field names and their corresponding target field names</li>
                  <li>Data transformation logic (e.g., format conversions, calculations)</li>
                  <li>Conditional mappings if applicable</li>
                  <li>Default values for unmapped fields</li>
                </ul>
                <p className="text-gray-600 mt-3">
                  CSV or Excel format is recommended for better parsing.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-purple-600">
                  Can I modify the generated COBOL code?
                </h3>
                <p className="text-gray-600">
                  Yes, the generated COBOL code can be downloaded and modified as needed. We recommend 
                  reviewing and testing the code before production use. You can also adjust the 
                  Instructions/Prompt field before generation to influence the code style and structure.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Navigation & Interface Questions</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-orange-600">
                  How do I search for specific items in the Test Tree?
                </h3>
                <p className="text-gray-600">
                  Use the search bar at the top of the left panel in Studio. The search works across 
                  all levels (projects, releases, user stories) and provides real-time results as you 
                  type. Search terms are highlighted in the results for easy identification.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-orange-600">
                  What do the different panels in Studio show?
                </h3>
                <p className="text-gray-600 mb-3">
                  The Studio interface has three main panels:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Left Panel:</strong> Test Tree navigation and search</li>
                  <li><strong>Middle Panel:</strong> Main content area with tables and test details</li>
                  <li><strong>Right Panel:</strong> Context-sensitive forms for AI generation and settings</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-orange-600">
                  How do I access my recently viewed items?
                </h3>
                <p className="text-gray-600">
                  Navigate to the Home page to see your Recently Viewed Items table. This table 
                  automatically tracks all items you've accessed across ASTRA, including test cases, 
                  user stories, releases, and projects. Click on any item to navigate directly to it.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Analytics Questions</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-indigo-600">
                  What's the difference between Executive and Operational dashboards?
                </h3>
                <p className="text-gray-600 mb-3">
                  The two dashboards serve different purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Executive Dashboard:</strong> High-level metrics and trends for strategic decisions, updated hourly</li>
                  <li><strong>Operational Dashboard:</strong> Real-time detailed data for day-to-day operations, refreshes every 30 seconds</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-indigo-600">
                  How often do the analytics dashboards update?
                </h3>
                <p className="text-gray-600">
                  Executive Dashboard updates hourly with aggregated data, while the Operational 
                  Dashboard refreshes every 30 seconds with live data directly from the ASTRA database. 
                  You can also manually refresh dashboards using the refresh button.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-indigo-600">
                  Can I export analytics data?
                </h3>
                <p className="text-gray-600">
                  Yes, both dashboards support data export. You can export reports in PDF or Excel 
                  format from the Executive Dashboard, and export raw data from the Operational 
                  Dashboard for external analysis.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Admin Questions</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-red-600">
                  What are the different user roles in ASTRA?
                </h3>
                <p className="text-gray-600 mb-3">
                  ASTRA has three main user roles:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Admin:</strong> Full system access, user management, and configuration</li>
                  <li><strong>Manager:</strong> Project and release management, team oversight</li>
                  <li><strong>Tester:</strong> Test case creation, execution, and reporting</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-red-600">
                  How do I add a new user to the system?
                </h3>
                <p className="text-gray-600 mb-3">
                  To add a new user:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                  <li>Navigate to Admin → User Management</li>
                  <li>Click the "+ Add User" button</li>
                  <li>Fill in user details (name, email, role)</li>
                  <li>Set permissions and access levels</li>
                  <li>Click "Save" to create the user</li>
                </ol>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-red-600">
                  How do I onboard a new project or release?
                </h3>
                <p className="text-gray-600 mb-3">
                  To onboard a new project or release:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                  <li>Go to Admin → Projects & Releases</li>
                  <li>Click "Onboard Project/Release" button</li>
                  <li>Select whether adding a project or release</li>
                  <li>Fill in the required information</li>
                  <li>Submit to add to the system</li>
                </ol>
              </div>
            </div>
          </section>
        </>
      )
    },
    commonissues: {
      title: "Common Issues & Solutions",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Troubleshoot common problems you might encounter while using ASTRA. Each issue 
              includes detailed solutions and preventive measures.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Login & Authentication Issues</h2>
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-3 text-red-900">
                  🚫 Unable to Login
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-red-800 mb-2">Possible Causes:</p>
                    <ul className="list-disc pl-6 space-y-1 text-red-700">
                      <li>Incorrect credentials</li>
                      <li>Account locked or disabled</li>
                      <li>Browser cache issues</li>
                      <li>Network connectivity problems</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-green-800 mb-2">Solutions:</p>
                    <ol className="list-decimal pl-6 space-y-2 text-green-700">
                      <li>Verify your username and password are correct</li>
                      <li>Clear browser cache and cookies</li>
                      <li>Try using an incognito/private browser window</li>
                      <li>Check with your administrator if account is active</li>
                      <li>Ensure you have a stable internet connection</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-3 text-red-900">
                  🔒 Session Timeout
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-red-800 mb-2">Issue:</p>
                    <p className="text-red-700">Getting logged out frequently or session expires too quickly</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-800 mb-2">Solutions:</p>
                    <ol className="list-decimal pl-6 space-y-2 text-green-700">
                      <li>Check "Remember me" option during login</li>
                      <li>Ensure browser allows cookies from ASTRA</li>
                      <li>Avoid using multiple tabs with different accounts</li>
                      <li>Contact admin to extend session timeout settings</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Test Generation Issues</h2>
            <div className="space-y-6">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-3 text-amber-900">
                  ⚠️ Generate Button is Disabled
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-amber-800 mb-2">Possible Causes:</p>
                    <ul className="list-disc pl-6 space-y-1 text-amber-700">
                      <li>No user story selected</li>
                      <li>Test cases are selected instead of user stories</li>
                      <li>Insufficient permissions</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-green-800 mb-2">Solutions:</p>
                    <ol className="list-decimal pl-6 space-y-2 text-green-700">
                      <li>Select a user story from the test tree or table</li>
                      <li>Deselect any test cases if selected</li>
                      <li>Ensure you have permission to generate test cases</li>
                      <li>For bulk generation, select user stories at the release level</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-3 text-amber-900">
                  ⏳ Generation Takes Too Long
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-amber-800 mb-2">Possible Causes:</p>
                    <ul className="list-disc pl-6 space-y-1 text-amber-700">
                      <li>Large number of user stories selected</li>
                      <li>Complex user story requirements</li>
                      <li>High server load</li>
                      <li>Network latency</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-green-800 mb-2">Solutions:</p>
                    <ol className="list-decimal pl-6 space-y-2 text-green-700">
                      <li>Generate test cases in smaller batches</li>
                      <li>Use Gemini model for faster generation</li>
                      <li>Try during off-peak hours</li>
                      <li>Check your internet connection speed</li>
                      <li>Contact support if issue persists</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-3 text-amber-900">
                  ❌ Generation Failed
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-amber-800 mb-2">Error Messages & Solutions:</p>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded">
                        <p className="font-mono text-sm text-red-600 mb-2">"AI Model Unavailable"</p>
                        <p className="text-gray-700">Try selecting a different AI model or wait a few minutes</p>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <p className="font-mono text-sm text-red-600 mb-2">"Invalid User Story Format"</p>
                        <p className="text-gray-700">Ensure user story has proper title and description</p>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <p className="font-mono text-sm text-red-600 mb-2">"Request Timeout"</p>
                        <p className="text-gray-700">Check connection and try with fewer stories</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Display & Interface Issues</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-3 text-blue-900">
                  🖥️ Interface Elements Not Loading
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-blue-800 mb-2">Troubleshooting Steps:</p>
                    <ol className="list-decimal pl-6 space-y-2 text-blue-700">
                      <li>Refresh the page (Ctrl+F5 or Cmd+Shift+R)</li>
                      <li>Clear browser cache and cookies</li>
                      <li>Disable browser extensions temporarily</li>
                      <li>Check if JavaScript is enabled</li>
                      <li>Try a different browser</li>
                      <li>Ensure you're using a supported browser version</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-3 text-blue-900">
                  📱 Responsive Issues
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-blue-800 mb-2">If layout appears broken:</p>
                    <ol className="list-decimal pl-6 space-y-2 text-blue-700">
                      <li>Check browser zoom level (reset to 100%)</li>
                      <li>Ensure minimum screen resolution (1366x768)</li>
                      <li>Update browser to latest version</li>
                      <li>Disable custom browser themes</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Data & Saving Issues</h2>
            <div className="space-y-6">
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-3 text-purple-900">
                  💾 Changes Not Saving
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-purple-800 mb-2">Common Causes & Solutions:</p>
                    <ul className="list-disc pl-6 space-y-2 text-purple-700">
                      <li><strong>Network interruption:</strong> Check connection and retry</li>
                      <li><strong>Session expired:</strong> Login again and retry</li>
                      <li><strong>Validation errors:</strong> Check all required fields are filled</li>
                      <li><strong>Concurrent editing:</strong> Refresh and check for conflicts</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded mt-3">
                    <p className="text-sm text-gray-700">
                      <strong>Tip:</strong> Always wait for the save confirmation message before navigating away
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-3 text-purple-900">
                  🔄 Data Not Refreshing
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-purple-800 mb-2">Solutions:</p>
                    <ol className="list-decimal pl-6 space-y-2 text-purple-700">
                      <li>Use the refresh button in the toolbar</li>
                      <li>Navigate away and back to the page</li>
                      <li>Clear browser cache if data appears outdated</li>
                      <li>Check if auto-refresh is enabled in settings</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Performance Issues</h2>
            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-3 text-green-900">
                  🐌 Slow Performance
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-green-800 mb-2">Optimization Tips:</p>
                    <ol className="list-decimal pl-6 space-y-2 text-green-700">
                      <li>Close unnecessary browser tabs</li>
                      <li>Use filters to reduce data displayed</li>
                      <li>Limit the number of items in tables (use pagination)</li>
                      <li>Disable browser extensions that might interfere</li>
                      <li>Ensure your system meets minimum requirements</li>
                      <li>Use wired connection instead of WiFi when possible</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-gray-100 border-l-4 border-gray-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">🛟 Still Need Help?</h3>
              <p className="text-gray-700 mb-4">
                If you're still experiencing issues after trying these solutions:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Document the issue with screenshots</li>
                <li>Note the exact error message (if any)</li>
                <li>Record steps to reproduce the problem</li>
                <li>Contact your system administrator</li>
                <li>Submit a support ticket with all details</li>
              </ol>
              <div className="mt-4 p-3 bg-white rounded">
                <p className="text-sm text-gray-600">
                  <strong>Support Email:</strong> support@astra.com<br/>
                  <strong>Support Hours:</strong> Monday-Friday, 9 AM - 6 PM EST
                </p>
              </div>
            </div>
          </section>
        </>
      )
    },
    support: {
      title: "Contact Support",
      content: (
        <>
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Get help from our support team when you need assistance with ASTRA. We're here 
              to ensure your testing workflow runs smoothly.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Support Channels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">📧</div>
                <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                <p className="text-gray-600 mb-3">
                  For non-urgent issues and detailed inquiries
                </p>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm">
                    <strong>Email:</strong> support@astra.com<br/>
                    <strong>Response Time:</strong> Within 24 hours
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-3">
                  For immediate assistance during business hours
                </p>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm">
                    <strong>Available:</strong> Mon-Fri, 9 AM - 6 PM EST<br/>
                    <strong>Response Time:</strong> < 5 minutes
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">📞</div>
                <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-3">
                  For critical issues requiring immediate attention
                </p>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm">
                    <strong>Phone:</strong> 1-800-ASTRA-00<br/>
                    <strong>Hours:</strong> Mon-Fri, 9 AM - 6 PM EST
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">🎫</div>
                <h3 className="font-semibold text-lg mb-2">Support Tickets</h3>
                <p className="text-gray-600 mb-3">
                  Track and manage your support requests
                </p>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm">
                    <strong>Portal:</strong> support.astra.com<br/>
                    <strong>SLA:</strong> Based on priority level
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Priority Levels</h2>
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-2 text-red-900">🔴 Critical (P1)</h3>
                <p className="text-red-800 mb-2">
                  System is completely unusable or major functionality is broken
                </p>
                <p className="text-sm text-red-700">
                  <strong>Response Time:</strong> 1 hour | <strong>Resolution Target:</strong> 4 hours
                </p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-2 text-orange-900">🟠 High (P2)</h3>
                <p className="text-orange-800 mb-2">
                  Significant functionality impaired but workarounds available
                </p>
                <p className="text-sm text-orange-700">
                  <strong>Response Time:</strong> 4 hours | <strong>Resolution Target:</strong> 24 hours
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-2 text-yellow-900">🟡 Medium (P3)</h3>
                <p className="text-yellow-800 mb-2">
                  Minor functionality issues or general questions
                </p>
                <p className="text-sm text-yellow-700">
                  <strong>Response Time:</strong> 24 hours | <strong>Resolution Target:</strong> 3 days
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-2 text-green-900">🟢 Low (P4)</h3>
                <p className="text-green-800 mb-2">
                  Feature requests or minor cosmetic issues
                </p>
                <p className="text-sm text-green-700">
                  <strong>Response Time:</strong> 48 hours | <strong>Resolution Target:</strong> 7 days
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Before Contacting Support</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                To help us resolve your issue quickly, please gather the following information:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Issue Description:</strong> Clear, detailed description of the problem
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Steps to Reproduce:</strong> Exact steps that lead to the issue
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Screenshots/Videos:</strong> Visual documentation of the problem
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Error Messages:</strong> Exact text of any error messages
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>Browser & OS:</strong> Your browser version and operating system
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">✓</span>
                  <div>
                    <strong>User Details:</strong> Your username and role in ASTRA
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Self-Service Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-sm text-gray-700">
                  Comprehensive guides and tutorials
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-3xl mb-3">🎥</div>
                <h3 className="font-semibold mb-2">Video Tutorials</h3>
                <p className="text-sm text-gray-700">
                  Step-by-step video walkthroughs
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-3xl mb-3">👥</div>
                <h3 className="font-semibold mb-2">Community Forum</h3>
                <p className="text-sm text-gray-700">
                  Connect with other ASTRA users
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-semibold mb-4 text-blue-900">We're Here to Help!</h3>
              <p className="text-blue-800 mb-6">
                Our support team is committed to ensuring your success with ASTRA. 
                Don't hesitate to reach out whenever you need assistance.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Contact Support Now
              </button>
            </div>
          </section>
        </>
      )
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {content[topic]?.title || "Help & Support"}
      </h1>
      {content[topic]?.content || <p>Content coming soon...</p>}
    </div>
  );
}