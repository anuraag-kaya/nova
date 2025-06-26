"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';

export default function Documentation() {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    gettingStarted: true,
    studio: false,
    analytics: false,
    api: false,
    integrations: false,
    bestPractices: false
  });
  const [selectedTopic, setSelectedTopic] = useState("introduction");
  const searchInputRef = useRef(null);

  // Documentation structure
  const documentationStructure = {
    gettingStarted: {
      title: "Getting Started",
      icon: "🚀",
      items: [
        { id: "introduction", title: "Introduction to ASTRA", matches: 2 },
        { id: "quickstart", title: "Quick Start Guide", matches: 1 },
        { id: "installation", title: "Installation & Setup", matches: 0 },
        { id: "firstproject", title: "Your First Project", matches: 0 },
      ]
    },
    studio: {
      title: "Studio",
      icon: "🎨",
      items: [
        { id: "studiooverview", title: "Studio Overview", matches: 1 },
        { id: "testcases", title: "Creating Test Cases", matches: 3 },
        { id: "userstories", title: "Managing User Stories", matches: 0 },
        { id: "releases", title: "Release Management", matches: 0 },
        { id: "aiassistant", title: "AI Test Generation", matches: 2 },
      ]
    },
    analytics: {
      title: "Analytics",
      icon: "📊",
      items: [
        { id: "dashboards", title: "Dashboards Overview", matches: 1 },
        { id: "metrics", title: "Key Metrics & KPIs", matches: 0 },
        { id: "reports", title: "Custom Reports", matches: 0 },
        { id: "insights", title: "AI-Powered Insights", matches: 1 },
      ]
    },
    api: {
      title: "API Reference",
      icon: "🔧",
      items: [
        { id: "apiintro", title: "API Introduction", matches: 0 },
        { id: "authentication", title: "Authentication", matches: 0 },
        { id: "endpoints", title: "API Endpoints", matches: 2 },
        { id: "examples", title: "Code Examples", matches: 1 },
        { id: "sdks", title: "SDKs & Libraries", matches: 0 },
      ]
    },
    integrations: {
      title: "Integrations",
      icon: "🔗",
      items: [
        { id: "jira", title: "Jira Integration", matches: 0 },
        { id: "github", title: "GitHub/GitLab", matches: 1 },
        { id: "slack", title: "Slack Notifications", matches: 0 },
        { id: "cicd", title: "CI/CD Pipelines", matches: 0 },
      ]
    },
    bestPractices: {
      title: "Best Practices",
      icon: "💡",
      items: [
        { id: "testdesign", title: "Test Design Patterns", matches: 1 },
        { id: "automation", title: "Automation Guidelines", matches: 0 },
        { id: "performance", title: "Performance Tips", matches: 0 },
        { id: "security", title: "Security Best Practices", matches: 0 },
      ]
    }
  };

  // Content for each topic
  const topicContent = {
    introduction: {
      title: "Introduction to ASTRA",
      content: (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Welcome to ASTRA, your comprehensive AI-powered testing and quality assurance platform. 
            ASTRA revolutionizes the way teams approach software testing by combining intelligent 
            automation with intuitive user interfaces.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">What is ASTRA?</h2>
          <p className="text-gray-600 mb-6">
            ASTRA is an advanced testing platform that leverages artificial intelligence to help teams:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
            <li>Generate comprehensive test cases automatically</li>
            <li>Track and manage testing progress in real-time</li>
            <li>Analyze test results with powerful analytics</li>
            <li>Integrate seamlessly with your existing development workflow</li>
            <li>Reduce testing time by up to 70% with AI assistance</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">🚀 Quick Tip</h3>
            <p className="text-blue-800">
              New to ASTRA? Start with our Quick Start Guide to get up and running in minutes.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg mb-2">✨ AI-Powered Test Generation</h4>
              <p className="text-gray-600">Automatically generate test cases from user stories using advanced AI models.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg mb-2">📊 Real-time Analytics</h4>
              <p className="text-gray-600">Track test execution, pass rates, and quality metrics with interactive dashboards.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg mb-2">🔗 Seamless Integrations</h4>
              <p className="text-gray-600">Connect with Jira, GitHub, Slack, and other tools in your workflow.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg mb-2">👥 Team Collaboration</h4>
              <p className="text-gray-600">Work together with shared dashboards, comments, and real-time updates.</p>
            </div>
          </div>
        </div>
      )
    },
    quickstart: {
      title: "Quick Start Guide",
      content: (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Get started with ASTRA in just a few minutes. This guide will walk you through the essential steps.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Prerequisites</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
            <li>A modern web browser (Chrome, Firefox, Safari, or Edge)</li>
            <li>Access credentials provided by your administrator</li>
            <li>Basic understanding of software testing concepts</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Step 1: Access ASTRA</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <code className="text-sm bg-gray-800 text-green-400 px-3 py-1 rounded">
              https://your-organization.astra.com
            </code>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Step 2: Navigate to Studio</h2>
          <p className="text-gray-600 mb-4">
            Click on the "Studio" tab in the navigation menu to access the test management interface.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Step 3: Create Your First Test Case</h2>
          <ol className="list-decimal pl-6 space-y-3 text-gray-600">
            <li>Select a project from the left sidebar</li>
            <li>Choose a release and user story</li>
            <li>Click the "Generate" button to create AI-powered test cases</li>
            <li>Review and customize the generated test cases</li>
            <li>Save your changes</li>
          </ol>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-semibold mb-2 text-green-900">✅ Success!</h3>
            <p className="text-green-800">
              You've created your first test case. Explore the Analytics tab to see real-time metrics.
            </p>
          </div>
        </div>
      )
    },
    testcases: {
      title: "Creating Test Cases",
      content: (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Learn how to create, manage, and execute test cases effectively in ASTRA Studio.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Test Case Types</h2>
          <div className="space-y-4 mb-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">🔧 Functional Tests</h4>
              <p className="text-gray-600">Verify that features work as expected according to requirements.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">⚡ Performance Tests</h4>
              <p className="text-gray-600">Ensure your application meets speed and scalability requirements.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">🔒 Security Tests</h4>
              <p className="text-gray-600">Identify vulnerabilities and ensure data protection.</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">AI-Powered Generation</h2>
          <p className="text-gray-600 mb-4">
            ASTRA uses advanced AI models to generate comprehensive test cases from your user stories:
          </p>
          
          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono text-sm mb-6">
            <div className="mb-2">
              <span className="text-green-400">// Select AI Model</span>
            </div>
            <div className="mb-2">
              <span className="text-blue-400">model</span>: "GPT-4" | "Claude" | "Gemini"
            </div>
            <div className="mb-2">
              <span className="text-green-400">// Add custom prompt</span>
            </div>
            <div>
              <span className="text-blue-400">prompt</span>: "Focus on edge cases and error handling"
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-semibold mb-2 text-amber-900">💡 Pro Tip</h3>
            <p className="text-amber-800">
              Use specific prompts to guide the AI in generating test cases that match your testing strategy.
            </p>
          </div>
        </div>
      )
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle topic selection
  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
  };

  // Filter items based on search
  const filterItems = (items, query) => {
    if (!query) return items;
    return items.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Check if any items match the search in a section
  const sectionHasMatches = (section, query) => {
    if (!query) return true;
    return section.items.some(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Header */}
      <header className={`flex justify-between items-center px-4 py-2 h-20 shadow-md ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}>
        {/* Logo */}
        <div className="flex items-center ml-5">
          {darkMode ? (
            <div className="flex items-center">
              <img 
                src="/citi-logo-dark.png" 
                alt="Citi" 
                className="h-8 w-auto" 
              />
              <span className="ml-5 text-[28px] font-medium text-white font-roboto flex items-center mt-[9px]">
                ASTRA
              </span>
            </div>
          ) : (
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
          )}
        </div>

        {/* Header Buttons */}
        <div className="flex items-center space-x-3">
          {/* Profile Button */}
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
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <span>👤</span> User Profile
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
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <span>❓</span> Help & Support
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

      {/* Overlay for profile menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 bg-transparent z-40"
          onClick={() => setShowProfileMenu(false)}
          style={{ cursor: 'default' }}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-grow">
        {/* Left Sidebar */}
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
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter"
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
                {Object.entries(documentationStructure).map(([key, section]) => {
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
                          {searchQuery && (
                            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                              {filterItems(section.items, searchQuery).length}
                            </span>
                          )}
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
                              {searchQuery && item.matches > 0 && (
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                                  selectedTopic === item.id
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {item.matches} match{item.matches > 1 ? 'es' : ''}
                                </span>
                              )}
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
                {Object.entries(documentationStructure).map(([key, section]) => (
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
        <div className="flex-grow bg-white overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-12">
            {topicContent[selectedTopic] ? (
              <>
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                  {topicContent[selectedTopic].title}
                </h1>
                {topicContent[selectedTopic].content}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📄</div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Content Coming Soon</h2>
                <p className="text-gray-600">This documentation section is being prepared.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#222222] text-white text-center p-2 flex justify-between items-center border-t border-gray-800">
        <div className="text-xs text-gray-400 ml-4">
          v0.9.0
        </div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
          <span className="mr-2 text-sm font-medium text-gray-300">Powered by</span>
          <a href="https://kayatech.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src="/converted_image.png" alt="Kaya Logo" className="h-3" />
          </a>
        </div>
        
        <div className="text-xs text-gray-400 mr-4">
          © 2025 KAYA Global Inc.
        </div>
      </footer>
    </div>
  );
}