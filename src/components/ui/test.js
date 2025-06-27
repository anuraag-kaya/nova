{/* Replace the existing div content with this */}
<div className="flex flex-col h-full bg-gray-50">
  {/* Header */}
  <div className="bg-white border-b border-gray-200 p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Code Builder Assistant</h2>
          <p className="text-sm text-gray-500">Upload files and describe what you want to build</p>
        </div>
      </div>
      
      {/* Model Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Model:</span>
        <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>GPT-4</option>
          <option>Claude 3</option>
          <option>Gemini Pro</option>
        </select>
      </div>
    </div>
  </div>

  {/* Messages Area */}
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {/* Empty State */}
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
        <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Code Builder</h3>
      <p className="text-gray-500 max-w-md">
        Upload your project files and describe what you want to create. Our AI will generate the code for you.
      </p>
      <div className="mt-6 flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Support for multiple file types</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Instant code generation</span>
        </div>
      </div>
    </div>

    {/* Sample Message Structure (Hidden by default, shown when messages exist) */}
    {/* User Message Example
    <div className="flex justify-end">
      <div className="max-w-3xl">
        <div className="rounded-lg p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-blue-100">You</span>
            <span className="text-xs text-blue-100">2:34 PM</span>
          </div>
          <p className="mb-3">Create a React component for a user dashboard with authentication</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 bg-white/10 rounded p-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm flex-1">auth.config.js</span>
              <span className="text-xs opacity-75">2.4 KB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    */}

    {/* AI Response Example
    <div className="flex justify-start">
      <div className="max-w-3xl">
        <div className="rounded-lg p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">AI Assistant</span>
            <span className="text-xs text-gray-500">2:35 PM</span>
          </div>
          <p className="mb-3 text-gray-800">I've analyzed your files and generated the following code based on your requirements:</p>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span className="font-medium text-gray-900">Dashboard.jsx</span>
                  <span className="text-xs text-gray-500">3.2 KB</span>
                </div>
                <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                  <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                <code>{`import React from 'react';
import { useAuth } from './hooks/useAuth';

export function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}</h1>
    </div>
  );
}`}</code>
              </pre>
            </div>
            <button className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download All Files</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    */}
  </div>

  {/* Input Area */}
  <div className="bg-white border-t border-gray-200 p-4">
    {/* Uploaded Files Preview (shown when files are selected) */}
    {/* 
    <div className="mb-3 flex flex-wrap gap-2">
      <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>config.json</span>
        <button className="ml-1 hover:text-blue-900">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    */}

    {/* Input Controls */}
    <div className="flex items-end space-x-3">
      <input type="file" id="file-upload" multiple className="hidden" accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.h,.css,.scss,.html,.json,.xml,.yaml,.yml" />
      
      <label htmlFor="file-upload" className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer group">
        <svg className="h-5 w-5 text-gray-600 group-hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </label>

      <div className="flex-1 relative">
        <textarea
          placeholder="Describe what you want to build..."
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          Press Enter to send
        </div>
      </div>

      <button className="p-3 bg-gray-100 text-gray-400 rounded-lg transition-colors">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>

    {/* Helper Text */}
    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
      <span>Supported: JS, TS, Python, Java, C++, CSS, HTML, JSON, YAML</span>
      <span>Max file size: 10MB</span>
    </div>
  </div>
</div>