{/* Code Builder Layout - Replaces the existing div content */}
<div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
  {/* Header Section */}
  <div className="bg-white shadow-sm border-b border-gray-200">
    <div className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Code Transformation Engine</h2>
          <p className="text-sm text-gray-600">Transform your COBOL copybooks with AI-powered code generation</p>
        </div>
      </div>
    </div>
  </div>

  {/* Main Content Area */}
  <div className="flex-1 overflow-hidden flex flex-col">
    {/* Chat Messages Container */}
    <div className="flex-1 overflow-y-auto p-6">
      {/* Welcome Card - Empty State */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
              <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Transform Your Code</h3>
            <p className="text-gray-600 max-w-lg mx-auto">
              Upload your COBOL copybook files and mapping rules to generate modern code instantly
            </p>
          </div>

          {/* File Requirements Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">Source Copybook</h4>
                  <p className="text-xs text-blue-700 mt-1">.cpy file required</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-900">Target Copybook</h4>
                  <p className="text-xs text-green-700 mt-1">.cpy file required</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-purple-900">Mapping Rules</h4>
                  <p className="text-xs text-purple-700 mt-1">.json file required</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
              <svg className="h-4 w-4 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Start
            </h4>
            <ol className="text-sm text-gray-700 space-y-1">
              <li className="flex items-start">
                <span className="font-medium text-gray-900 mr-2">1.</span>
                Upload your source and target copybook files (.cpy)
              </li>
              <li className="flex items-start">
                <span className="font-medium text-gray-900 mr-2">2.</span>
                Add your mapping rules configuration (.json)
              </li>
              <li className="flex items-start">
                <span className="font-medium text-gray-900 mr-2">3.</span>
                Optionally add a prompt for custom instructions
              </li>
              <li className="flex items-start">
                <span className="font-medium text-gray-900 mr-2">4.</span>
                Click generate to transform your code
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Sample Success Response (Hidden by default) */}
      {/* 
      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Code Generated Successfully</h4>
              <p className="text-gray-600 mb-4">Your COBOL copybook has been transformed. Here's your generated code:</p>
              
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-mono">Generated Output</span>
                  <button className="text-xs text-gray-400 hover:text-white flex items-center space-x-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="text-green-400 text-sm font-mono overflow-x-auto">
                  <code>{`IDENTIFICATION DIVISION.
PROGRAM-ID. MOP-SOURCE-TO-TARGET.
AUTHOR. Citi Gen AI Coding Assistant.

ENVIRONMENT DIVISION.
INPUT-OUTPUT SECTION.
FILE-CONTROL.
    SELECT SOURCE-FILE ASSIGN TO "SOURCE.DAT"
        ORGANIZATION IS LINE SEQUENTIAL
        FILE STATUS IS FS-SOURCE.
    SELECT TARGET-FILE ASSIGN TO "TARGET.DAT"
        ORGANIZATION IS LINE SEQUENTIAL
        FILE STATUS IS FS-TARGET.`}</code>
                </pre>
              </div>
              
              <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg px-4 py-2.5 font-medium hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Generated Code</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      */}
    </div>

    {/* Input Section */}
    <div className="border-t border-gray-200 bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* File Upload Area */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900">Required Files</h4>
            <span className="text-xs text-gray-500">Maximum 3 files • .cpy and .json only</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Source Copybook Upload */}
            <div className="relative">
              <input type="file" id="source-copybook" className="hidden" accept=".cpy" />
              <label htmlFor="source-copybook" className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-1 text-xs font-medium text-gray-900">Source Copybook</p>
                    <p className="text-xs text-gray-500">.cpy file</p>
                  </div>
                </div>
              </label>
            </div>

            {/* Target Copybook Upload */}
            <div className="relative">
              <input type="file" id="target-copybook" className="hidden" accept=".cpy" />
              <label htmlFor="target-copybook" className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-1 text-xs font-medium text-gray-900">Target Copybook</p>
                    <p className="text-xs text-gray-500">.cpy file</p>
                  </div>
                </div>
              </label>
            </div>

            {/* Mapping Rules Upload */}
            <div className="relative">
              <input type="file" id="mapping-rules" className="hidden" accept=".json" />
              <label htmlFor="mapping-rules" className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-1 text-xs font-medium text-gray-900">Mapping Rules</p>
                    <p className="text-xs text-gray-500">.json file</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Uploaded Files Display (Hidden by default) */}
          {/*
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-blue-900">SourceCopybookName.cpy</span>
                <span className="text-xs text-blue-700">2.3 KB</span>
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          */}
        </div>

        {/* Prompt Input and Generate Button */}
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Instructions (Optional)
            </label>
            <textarea
              id="prompt"
              placeholder="Add any specific requirements or instructions for the code generation..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              rows="2"
            />
          </div>
          
          <button 
            disabled
            className="px-6 py-2.5 bg-gradient-to-r from-gray-300 to-gray-400 text-white rounded-lg font-medium cursor-not-allowed flex items-center space-x-2 min-w-[140px] justify-center"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Generate</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>