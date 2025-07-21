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
    overview: true,
    home: false,
    studio: false,
    analytics: false,
    integrations: false,
    troubleshooting: false
  });
  const [selectedTopic, setSelectedTopic] = useState("introduction");
  const searchInputRef = useRef(null);

  // Documentation structure
  const documentationStructure = {
    overview: {
      title: "Overview",
      icon: "📖",
      items: [
        { id: "introduction", title: "Introduction to ASTRA", matches: 2 },
        { id: "quickstart", title: "Quick Start Guide", matches: 1 },
        { id: "navigation", title: "Navigation & UI", matches: 0 },
        { id: "keyconcepts", title: "Key Concepts", matches: 0 },
      ]
    },
    home: {
      title: "Home Page",
      icon: "🏠",
      items: [
        { id: "homepage", title: "Home Page Overview", matches: 1 },
        { id: "recentitems", title: "Recently Viewed Items", matches: 3 },
        { id: "dashboard", title: "Dashboard Features", matches: 0 },
      ]
    },
    studio: {
      title: "Studio",
      icon: "🎨",
      items: [
        { id: "studiooverview", title: "Studio Overview", matches: 1 },
        { id: "testcases", title: "Test Cases", matches: 3 },
        { id: "testtree", title: "Test Tree Navigation", matches: 2 },
        { id: "generating", title: "Generating Test Cases", matches: 4 },
        { id: "cobolbuilder", title: "COBOL Builder", matches: 2 },
      ]
    },
    analytics: {
      title: "Analytics",
      icon: "📊",
      items: [
        { id: "analyticsoverview", title: "Analytics Overview", matches: 1 },
        { id: "executive", title: "Executive Dashboard", matches: 2 },
        { id: "operational", title: "Operational Metrics", matches: 2 },
        { id: "customreports", title: "Custom Reports", matches: 0 },
      ]
    },
    integrations: {
      title: "Integrations & API",
      icon: "🔗",
      items: [
        { id: "apiref", title: "API Reference", matches: 0 },
        { id: "webhooks", title: "Webhooks", matches: 1 },
        { id: "thirdparty", title: "Third-party Tools", matches: 0 },
      ]
    },
    troubleshooting: {
      title: "Help & Support",
      icon: "🛠️",
      items: [
        { id: "faq", title: "Frequently Asked Questions", matches: 1 },
        { id: "commonissues", title: "Common Issues", matches: 0 },
        { id: "support", title: "Contact Support", matches: 0 },
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
            ASTRA is a comprehensive AI-powered testing and quality assurance platform designed to revolutionize 
            software testing workflows. By leveraging advanced artificial intelligence, ASTRA automates test case 
            generation, provides real-time analytics, and seamlessly integrates with your existing development ecosystem.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Platform Overview</h2>
          <p className="text-gray-600 mb-6">
            ASTRA consists of three main components that work together to streamline your testing process:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🏠</div>
              <h4 className="font-semibold text-lg mb-2">Home</h4>
              <p className="text-gray-600 text-sm">Central dashboard for quick access to recent items and overall system status.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🎨</div>
              <h4 className="font-semibold text-lg mb-2">Studio</h4>
              <p className="text-gray-600 text-sm">Test management interface for creating, organizing, and executing test cases.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-semibold text-lg mb-2">Analytics</h4>
              <p className="text-gray-600 text-sm">Comprehensive dashboards for executive and operational insights.</p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">🚀 Getting Started</h3>
            <p className="text-blue-800">
              New to ASTRA? Begin with the <strong>Quick Start Guide</strong> to set up your first project and generate test cases in minutes.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Key Benefits</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li><strong>AI-Powered Automation:</strong> Generate comprehensive test cases automatically using advanced language models</li>
            <li><strong>Hierarchical Organization:</strong> Manage projects, releases, and user stories in an intuitive tree structure</li>
            <li><strong>Real-time Analytics:</strong> Track testing progress and quality metrics with interactive dashboards</li>
            <li><strong>COBOL Support:</strong> Specialized tools for legacy system testing and code generation</li>
            <li><strong>Seamless Workflow:</strong> Integrated environment from test planning to execution and reporting</li>
          </ul>
        </div>
      )
    },
    quickstart: {
      title: "Quick Start Guide",
      content: (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Follow this step-by-step guide to create your first test case in ASTRA within minutes.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Step 1: Access ASTRA</h2>
          <p className="text-gray-600 mb-4">
            Log in to ASTRA using your organization credentials. You'll be directed to the Home page upon successful authentication.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Step 2: Navigate to Studio</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <ol className="list-decimal pl-6 space-y-2 text-gray-600">
              <li>Click on the <strong>"Studio"</strong> tab in the main navigation menu</li>
              <li>The Studio interface will load with the Test Tree on the left panel</li>
            </ol>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Step 3: Select Your Project Structure</h2>
          <p className="text-gray-600 mb-4">
            In the left panel, navigate through the hierarchical structure:
          </p>
          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono text-sm mb-6">
            <div className="mb-2">📁 Project</div>
            <div className="ml-4 mb-2">└── 📄 Release</div>
            <div className="ml-8">└── 📌 User Story</div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Step 4: Generate Test Cases</h2>
          <ol className="list-decimal pl-6 space-y-3 text-gray-600">
            <li>Select a user story from the tree</li>
            <li>Click the <strong>"Generate"</strong> button in the middle panel</li>
            <li>In the right panel that opens:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Select an LLM Model (GPT-4, Claude, or Gemini)</li>
                <li>Choose the format (Freeform or Template)</li>
                <li>Add any specific prompts for customization</li>
              </ul>
            </li>
            <li>Click <strong>"Generate Test Cases"</strong></li>
          </ol>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-semibold mb-2 text-green-900">✅ Success!</h3>
            <p className="text-green-800">
              Your AI-generated test cases will appear in the middle panel. You can now review, edit, and execute them.
            </p>
          </div>
        </div>
      )
    },
    homepage: {
      title: "Home Page Overview",
      content: (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            The Home page serves as your central dashboard in ASTRA, providing quick access to recent activities 
            and key information about your testing workflow.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Page Layout</h2>
          <p className="text-gray-600 mb-6">
            The Home page features a clean, intuitive layout designed for efficiency:
          </p>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Welcome Section</h3>
            <p className="text-gray-600 mb-4">
              Displays a personalized greeting with your username and current date, providing a quick 
              orientation to your ASTRA dashboard.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Recently Viewed Items</h3>
            <p className="text-gray-600 mb-4">
              A comprehensive table showing your recent activity across ASTRA, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Type:</strong> Item category (Test Case, User Story, Release, or Project)</li>
              <li><strong>Name:</strong> The specific item title</li>
              <li><strong>ID:</strong> Unique identifier for quick reference</li>
              <li><strong>Viewed:</strong> Timestamp showing when you last accessed the item</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🔍 Quick Navigation</h4>
              <p className="text-gray-700 text-sm">Click any item in the Recently Viewed table to navigate directly to it</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">📊 Activity Tracking</h4>
              <p className="text-gray-700 text-sm">Monitor your testing workflow with chronological activity logs</p>
            </div>
          </div>
        </div>
      )
    },
    studiooverview: {
      title: "Studio Overview",
      content: (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            The Studio is ASTRA's primary workspace for test management and execution. It provides a comprehensive 
            interface for organizing test cases, generating automated tests, and managing COBOL-related testing workflows.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Studio Components</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Interface Layout</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Left Panel</h4>
                <p className="text-gray-600 text-sm">Test Tree navigation with search functionality</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Middle Panel</h4>
                <p className="text-gray-600 text-sm">Main content area displaying tables and test details</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Right Panel</h4>
                <p className="text-gray-600 text-sm">Context-sensitive forms and AI generation tools</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Studio Modes</h2>
          <p className="text-gray-600 mb-4">
            Studio offers two primary modes accessible via toggle buttons:
          </p>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <span className="text-2xl mr-2">✅</span> Test Cases Mode
              </h3>
              <p className="text-gray-600">
                The default mode for managing test cases, user stories, releases, and projects. 
                Navigate through your test hierarchy and generate AI-powered test cases.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <span className="text-2xl mr-2">💻</span> COBOL Builder Mode
              </h3>
              <p className="text-gray-600">
                Specialized environment for COBOL testing workflows. Upload source files, define 
                mapping rules, and generate COBOL code using AI assistance.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-semibold mb-2 text-amber-900">💡 Pro Tip</h3>
            <p className="text-amber-800">
              Use the search bar in the left panel to quickly find any project, release, or user story 
              across your entire test hierarchy.
            </p>
          </div>
        </div>
      )
    },
    testcases: {
      title: "Test Cases",
      content: (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Test Cases in ASTRA are organized hierarchically, providing a structured approach to test management 
            that aligns with your development workflow.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Hierarchical Structure</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-gray-600 mb-4">ASTRA organizes test cases in a three-level hierarchy:</p>
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="font-mono text-sm">
                <div className="mb-2">📁 <strong>Projects</strong> - Top-level containers for your testing initiatives</div>
                <div className="ml-6 mb-2">📄 <strong>Releases</strong> - Version-specific test organization</div>
                <div className="ml-12">📌 <strong>User Stories</strong> - Feature-level test grouping</div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Navigation and Selection</h2>
          <div className="space-y-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Project Selection</h4>
              <p className="text-gray-600">
                When you select a project in the left panel, the middle panel displays a table of all releases 
                within that project, showing version numbers, dates, and associated metrics.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Release Selection</h4>
              <p className="text-gray-600">
                Selecting a release shows all user stories within that release, including their status, 
                priority, and completion percentage.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">User Story Selection</h4>
              <p className="text-gray-600">
                Choosing a user story displays a comprehensive view with test cases on the left and 
                detailed test steps on the right, providing full visibility into your test scenarios.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Test Case Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Test Case Details</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Test case ID and title</li>
                <li>• Test type (Functional, Performance, etc.)</li>
                <li>• Priority and status</li>
                <li>• Assigned tester</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Test Steps</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Step-by-step instructions</li>
                <li>• Expected results</li>
                <li>• Actual results (during execution)</li>
                <li>• Pass/Fail status</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    generating: {
      title: "Generating Test Cases",
      content: (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            ASTRA's AI-powered test case generation feature leverages advanced language models to automatically 
            create comprehensive test scenarios based on your user stories and requirements.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Generation Process</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-4">Step-by-Step Guide</h3>
            <ol className="list-decimal pl-6 space-y-3 text-gray-600">
              <li>
                <strong>Select a User Story:</strong> Navigate to the desired user story in the Test Tree 
                or select one from the user stories table when viewing a release.
              </li>
              <li>
                <strong>Click Generate:</strong> The Generate button becomes active when a user story is selected. 
                Click it to open the User Prompt Form in the right panel.
              </li>
              <li>
                <strong>Configure Generation Settings:</strong>
                <div className="mt-2 ml-4 space-y-2">
                  <p>• <strong>LLM Model:</strong> Choose from GPT-4, Claude, or Gemini</p>
                  <p>• <strong>Format:</strong> Select between Freeform or Freeform & Template</p>
                  <p>• <strong>Page Object Model:</strong> Select or add custom models using the + button</p>
                </div>
              </li>
              <li>
                <strong>Add Custom Prompt (Optional):</strong> Provide specific instructions to guide the AI 
                in generating test cases that match your requirements.
              </li>
              <li>
                <strong>Generate:</strong> Click "Generate Test Cases" to create AI-powered test scenarios.
              </li>
            </ol>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Generation Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📝 Format Options</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li><strong>Freeform:</strong> AI generates test cases without constraints</li>
                <li><strong>Freeform & Template:</strong> Combines AI creativity with structured templates</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">🤖 LLM Models</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li><strong>GPT-4:</strong> Advanced reasoning and comprehensive coverage</li>
                <li><strong>Claude:</strong> Detailed analysis and edge case detection</li>
                <li><strong>Gemini:</strong> Fast generation with good accuracy</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">💡 Best Practices</h3>
            <ul className="text-blue-800 space-y-2">
              <li>• Use specific prompts to focus on particular test scenarios (e.g., "Focus on error handling and edge cases")</li>
              <li>• Select the appropriate format based on your testing standards</li>
              <li>• Review and customize generated test cases before finalizing</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Bulk Generation</h2>
          <p className="text-gray-600 mb-4">
            When viewing a release, you can select multiple user stories from the table and generate test cases 
            for all of them simultaneously:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-600">
            <li>Navigate to a release in the Test Tree</li>
            <li>Select one or more user stories using the checkboxes in the table</li>
            <li>Click the Generate button to process all selected stories</li>
            <li>Configure settings once for all selected items</li>
          </ol>
        </div>
      )
    },
    cobolbuilder: {
      title: "COBOL Builder",
      content: (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            The COBOL Builder is a specialized tool within ASTRA Studio designed to assist with legacy system 
            testing and COBOL code generation using AI-powered capabilities.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Accessing COBOL Builder</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <ol className="list-decimal pl-6 space-y-2 text-gray-600">
              <li>Navigate to the Studio tab</li>
              <li>In the left panel, select the "COBOL Builder" radio button</li>
              <li>The interface will switch to the COBOL Builder mode</li>
            </ol>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Required Files</h2>
          <div className="space-y-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📄 Source Copybook</h4>
              <p className="text-gray-600 mb-2">Upload up to 3 source copybook files that define your input data structures.</p>
              <p className="text-sm text-gray-500">Supported formats: .cpy, .cbl, .txt</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📄 Target Copybook</h4>
              <p className="text-gray-600 mb-2">Upload the target copybook file that defines your output data structure.</p>
              <p className="text-sm text-gray-500">Single file only</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📋 Mapping Rules</h4>
              <p className="text-gray-600 mb-2">Define the transformation rules between source and target structures.</p>
              <p className="text-sm text-gray-500">CSV or Excel format recommended</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Configuration</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-3">LLM Model Selection</h3>
            <p className="text-gray-600 mb-4">
              Choose the appropriate AI model from the dropdown menu. Each model has different strengths:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>GPT-4:</strong> Best for complex transformations and business logic</li>
              <li><strong>Claude:</strong> Excellent for maintaining COBOL standards and conventions</li>
              <li><strong>Gemini:</strong> Fast generation for straightforward mappings</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Instructions/Prompt Field</h2>
          <p className="text-gray-600 mb-4">
            The Instructions field comes pre-populated with standard COBOL generation guidelines. You can customize 
            this to include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
            <li>Specific naming conventions for your organization</li>
            <li>Performance optimization requirements</li>
            <li>Error handling specifications</li>
            <li>Comments and documentation standards</li>
          </ul>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-semibold mb-2 text-green-900">✅ Generation Process</h3>
            <ol className="list-decimal pl-6 space-y-2 text-green-800">
              <li>Upload all required files</li>
              <li>Select your preferred LLM model</li>
              <li>Review and modify the instructions if needed</li>
              <li>Click the "Generate" button</li>
              <li>Review the generated COBOL code in the output panel</li>
              <li>Use the Download button to save the generated code</li>
            </ol>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-semibold mb-2 text-amber-900">⚠️ Important Notes</h3>
            <ul className="text-amber-800 space-y-2">
              <li>• Always review generated code before using in production</li>
              <li>• Ensure mapping rules are complete and accurate</li>
              <li>• Test generated code with sample data before full implementation</li>
            </ul>
          </div>
        </div>
      )
    },
    analyticsoverview: {
      title: "Analytics Overview",
      content: (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            The Analytics section of ASTRA provides comprehensive insights into your testing activities through 
            two specialized dashboards: Executive and Operational. These dashboards help stakeholders at all levels 
            make data-driven decisions about testing quality and efficiency.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Analytics Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-lg mb-2">Executive Dashboard</h3>
              <p className="text-gray-600 text-sm">
                High-level metrics and visualizations for leadership and management decisions.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">⚙️</div>
              <h3 className="font-semibold text-lg mb-2">Operational Dashboard</h3>
              <p className="text-gray-600 text-sm">
                Detailed metrics and real-time data for day-to-day testing operations.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Accessing Analytics</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <ol className="list-decimal pl-6 space-y-2 text-gray-600">
              <li>Click on the "Analytics" tab in the main navigation menu</li>
              <li>Select either "Executive" or "Operational" from the left sidebar</li>
              <li>The corresponding dashboard will load in the main content area</li>
            </ol>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Key Features</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">📈 Real-time Updates</h4>
              <p className="text-gray-700 text-sm">Dashboards refresh automatically to show the latest testing data</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🎯 Interactive Visualizations</h4>
              <p className="text-gray-700 text-sm">Click, filter, and drill down into specific metrics for detailed analysis</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">📅 Time-based Analysis</h4>
              <p className="text-gray-700 text-sm">View trends over different time periods to track progress</p>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-semibold mb-2 text-amber-900">💡 Pro Tip</h3>
            <p className="text-amber-800">
              Use the Executive Dashboard for quarterly reviews and strategic planning, while the Operational 
              Dashboard is ideal for daily stand-ups and sprint retrospectives.
            </p>
          </div>
        </div>
      )
    },
    executive: {
      title: "Executive Dashboard",
      content: (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            The Executive Dashboard provides high-level insights and visualizations designed for leadership 
            and management teams to monitor testing performance, quality trends, and resource utilization.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Dashboard Components</h2>
          <p className="text-gray-600 mb-4">
            The Executive Dashboard utilizes Tableau visualizations to present data in an intuitive, 
            actionable format. Key metrics include:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📊 Test Coverage Metrics</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Overall test coverage percentage</li>
                <li>• Coverage by project and release</li>
                <li>• Untested features identification</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📈 Quality Trends</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Pass/fail rates over time</li>
                <li>• Defect discovery trends</li>
                <li>• Quality gates compliance</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">⚡ AI Utilization</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Test cases generated by AI</li>
                <li>• Time saved through automation</li>
                <li>• AI model performance comparison</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">👥 Resource Analytics</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Team productivity metrics</li>
                <li>• Workload distribution</li>
                <li>• Testing velocity trends</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Key Performance Indicators</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-gray-600 mb-4">The dashboard tracks critical KPIs including:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Test Execution Rate:</strong> Number of tests executed per sprint/release</li>
              <li><strong>Defect Detection Rate:</strong> Percentage of defects found before production</li>
              <li><strong>Automation ROI:</strong> Cost savings from AI-generated test cases</li>
              <li><strong>Time to Market:</strong> Impact of testing on release cycles</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">📊 Dashboard Features</h3>
            <ul className="text-blue-800 space-y-2">
              <li>• Export reports in PDF or Excel format</li>
              <li>• Schedule automated report distribution</li>
              <li>• Customize dashboard views based on role</li>
              <li>• Set up alerts for critical metrics</li>
            </ul>
          </div>

          <p className="text-gray-600 italic">
            <em>Note: Additional dashboard components and metrics will be added based on organizational requirements 
            and feedback. Contact your administrator to request specific visualizations.</em>
          </p>
        </div>
      )
    },
    operational: {
      title: "Operational Metrics",
      content: (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            The Operational Dashboard provides real-time, detailed metrics directly from the ASTRA database, 
            offering granular insights into day-to-day testing activities and performance.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Real-time Metrics</h2>
          <p className="text-gray-600 mb-4">
            Unlike the Executive Dashboard's aggregated views, the Operational Dashboard shows live data 
            from ongoing testing activities:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">🔄 Test Execution Status</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Currently running tests</li>
                <li>• Queue status and wait times</li>
                <li>• Failed test details with logs</li>
                <li>• Blocked or skipped tests</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📝 Test Case Analytics</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Total test cases by status</li>
                <li>• New vs. modified test cases</li>
                <li>• Test case complexity metrics</li>
                <li>• Coverage gaps identification</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">🤖 AI Generation Metrics</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Generation success rates by model</li>
                <li>• Average generation time</li>
                <li>• User acceptance rates</li>
                <li>• Model usage distribution</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">⏱️ Performance Tracking</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Test execution duration trends</li>
                <li>• System response times</li>
                <li>• Resource utilization</li>
                <li>• Bottleneck identification</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Database-Direct Features</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-gray-600 mb-4">
              The Operational Dashboard connects directly to ASTRA's database, providing:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Live Updates:</strong> Data refreshes every 30 seconds</li>
              <li><strong>Drill-down Capability:</strong> Click any metric to see detailed records</li>
              <li><strong>Custom Queries:</strong> Build your own reports using the query builder</li>
              <li><strong>Data Export:</strong> Export raw data for external analysis</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Operational Insights</h2>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">✅ Test Health Monitor</h4>
              <p className="text-gray-700 text-sm">Real-time dashboard showing test suite health, including flaky tests, 
              long-running tests, and tests requiring maintenance</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">📊 Daily Activity Summary</h4>
              <p className="text-gray-700 text-sm">Automated summary of testing activities including tests run, 
              passed/failed, new defects found, and team member contributions</p>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-semibold mb-2 text-amber-900">🔔 Alerts and Notifications</h3>
            <p className="text-amber-800 mb-2">
              Set up custom alerts for critical operational metrics:
            </p>
            <ul className="text-amber-800 space-y-1 text-sm">
              <li>• Test failure rate exceeds threshold</li>
              <li>• Test execution queue backlog</li>
              <li>• AI generation failures</li>
              <li>• System performance degradation</li>
            </ul>
          </div>

          <p className="text-gray-600 italic">
            <em>Note: Additional operational metrics and custom reports can be configured based on your team's 
            specific needs. Contact your ASTRA administrator for customization options.</em>
          </p>
        </div>
      )
    },
    faq: {
      title: "Frequently Asked Questions",
      content: (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Find answers to common questions about using ASTRA effectively.
          </p>
          
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">How do I generate test cases for multiple user stories at once?</h3>
              <p className="text-gray-600">
                Navigate to a release in the Test Tree, select multiple user stories using the checkboxes in the table, 
                then click the Generate button. You can configure settings once for all selected stories.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Which AI model should I choose for test generation?</h3>
              <p className="text-gray-600">
                Choose based on your needs: GPT-4 for complex scenarios and comprehensive coverage, Claude for 
                detailed analysis and edge cases, or Gemini for quick generation with good accuracy.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Can I customize the generated test cases?</h3>
              <p className="text-gray-600">
                Yes! After generation, all test cases are fully editable. You can modify test steps, expected results, 
                and any other details to match your specific requirements.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">How many source copybook files can I upload in COBOL Builder?</h3>
              <p className="text-gray-600">
                You can upload up to 3 source copybook files. The system will process all uploaded files together 
                when generating COBOL code.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">What's the difference between Executive and Operational dashboards?</h3>
              <p className="text-gray-600">
                Executive Dashboard shows high-level metrics and trends for strategic decisions, while Operational 
                Dashboard provides real-time, detailed data for day-to-day testing activities.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">How often do the analytics dashboards update?</h3>
              <p className="text-gray-600">
                Executive Dashboard updates hourly with aggregated data. Operational Dashboard refreshes every 
                30 seconds with live data from the ASTRA database.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">💬 Need More Help?</h3>
            <p className="text-blue-800">
              If you can't find the answer to your question, please contact our support team or check the 
              detailed documentation sections for specific features.
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