{/* Code Builder Layout - Complete Revamped Version */}
<div className="flex flex-col h-full bg-gradient-to-b from-gray-50 via-white to-gray-50">
  {/* Enhanced Header Section */}
  <div className="bg-white shadow-md border-b border-gray-200">
    <div className="px-6 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg transform rotate-3">
              <div className="transform -rotate-3">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              COBOL Code Transformer
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">Transform legacy COBOL with modern AI technology</p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Ready</span>
        </div>
      </div>
    </div>
  </div>

  {/* Main Content Area with Two States */}
  <div className="flex-1 overflow-hidden flex flex-col">
    {/* Initial State - File Upload Interface */}
    <div className="flex-1 overflow-y-auto p-6" id="initial-state">
      <div className="w-full max-w-7xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold shadow-md">1</div>
                <span className="ml-3 text-sm font-medium text-gray-900">Upload Files</span>
              </div>
              <div className="w-20 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">2</div>
                <span className="ml-3 text-sm font-medium text-gray-500">Add Instructions</span>
              </div>
              <div className="w-20 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">3</div>
                <span className="ml-3 text-sm font-medium text-gray-500">Generate Code</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your COBOL Files</h3>
            <p className="text-gray-600">Transform your legacy COBOL copybooks into modern, maintainable code</p>
          </div>

          {/* File Upload Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Source Copybook Card */}
              <div className="group">
                <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg">
                  <input type="file" id="source-copybook" className="hidden" accept=".cpy" />
                  <label htmlFor="source-copybook" className="cursor-pointer">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Source Copybook</h4>
                      <p className="text-sm text-gray-600 mb-3">Upload your source .cpy file</p>
                      <div className="flex items-center justify-center space-x-2 text-xs">
                        <span className="px-2 py-1 bg-blue-200 text-blue-700 rounded-full font-medium">Required</span>
                        <span className="text-gray-500">.cpy only</span>
                      </div>
                    </div>
                  </label>
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  </div>
                </div>
                {/* File Preview (shown when file is uploaded) */}
                {/* <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">SourceFile.cpy</span>
                    <span className="text-xs text-gray-500">2.3 KB</span>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div> */}
              </div>

              {/* Target Copybook Card */}
              <div className="group">
                <div className="relative bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg">
                  <input type="file" id="target-copybook" className="hidden" accept=".cpy" />
                  <label htmlFor="target-copybook" className="cursor-pointer">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Target Copybook</h4>
                      <p className="text-sm text-gray-600 mb-3">Upload your target .cpy file</p>
                      <div className="flex items-center justify-center space-x-2 text-xs">
                        <span className="px-2 py-1 bg-green-200 text-green-700 rounded-full font-medium">Required</span>
                        <span className="text-gray-500">.cpy only</span>
                      </div>
                    </div>
                  </label>
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Mapping Rules Card */}
              <div className="group">
                <div className="relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg">
                  <input type="file" id="mapping-rules" className="hidden" accept=".json" />
                  <label htmlFor="mapping-rules" className="cursor-pointer">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Mapping Rules</h4>
                      <p className="text-sm text-gray-600 mb-3">Upload mapping configuration</p>
                      <div className="flex items-center justify-center space-x-2 text-xs">
                        <span className="px-2 py-1 bg-purple-200 text-purple-700 rounded-full font-medium">Required</span>
                        <span className="text-gray-500">.json only</span>
                      </div>
                    </div>
                  </label>
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How it works
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Upload Source</p>
                    <p className="text-xs text-gray-600 mt-0.5">Your existing COBOL copybook file</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Upload Target</p>
                    <p className="text-xs text-gray-600 mt-0.5">Desired output structure file</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Add Mapping</p>
                    <p className="text-xs text-gray-600 mt-0.5">JSON rules for transformation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Generate</p>
                    <p className="text-xs text-gray-600 mt-0.5">AI transforms your code</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt and Generate Section */}
            <div className="border-t border-gray-200 pt-6">
              <label htmlFor="prompt" className="block text-sm font-semibold text-gray-900 mb-3">
                Additional Instructions
                <span className="font-normal text-gray-500 ml-1">(Optional)</span>
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <textarea
                    id="prompt"
                    placeholder="Add any specific requirements or customization instructions for the code generation..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm placeholder-gray-400 h-[42px] min-h-[42px]"
                    rows="1"
                  />
                </div>
                
                <button 
                  disabled
                  className="px-8 py-3 bg-gradient-to-r from-gray-300 to-gray-400 text-white rounded-xl font-semibold cursor-not-allowed flex items-center space-x-3 shadow-lg transform transition-all duration-200"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate Code</span>
                </button>
              </div>
              
              {/* File Requirements Notice */}
              <div className="mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4 text-gray-500">
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Maximum 3 files
                  </span>
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    .cpy and .json files only
                  </span>
                </div>
                <span className="text-gray-400">Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Success State - Generated Code Display (Hidden by default) */}
    <div className="flex-1 overflow-y-auto p-6 hidden" id="success-state">
      <div className="w-full max-w-7xl mx-auto">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Code Generated Successfully!</h3>
                <p className="text-gray-600 mt-0.5">Your COBOL code has been transformed • Generated in 2.3s</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy All</span>
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Generated Code Container */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Code Editor Header */}
          <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-400 font-mono">generated-code.cbl</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">COBOL</span>
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>

          {/* Code Content with Syntax Highlighting */}
          <div className="p-6 overflow-x-auto">
            <pre className="text-sm font-mono">
              <code className="language-cobol">
<span className="text-gray-500">      * Generated by COBOL Code Transformer</span>
<span className="text-gray-500">      * Date: {new Date().toLocaleDateString()}</span>
<span className="text-gray-500">      * Time: {new Date().toLocaleTimeString()}</span>
<span className="text-gray-500">      *</span>
       <span className="text-purple-400">IDENTIFICATION DIVISION</span>.
       <span className="text-blue-400">PROGRAM-ID</span>. MOP-SOURCE-TO-TARGET.
       <span className="text-blue-400">AUTHOR</span>. Citi Gen AI Coding Assistant.

       <span className="text-purple-400">ENVIRONMENT DIVISION</span>.
       <span className="text-purple-400">INPUT-OUTPUT SECTION</span>.
       <span className="text-purple-400">FILE-CONTROL</span>.
           <span className="text-blue-400">SELECT</span> SOURCE-FILE <span className="text-blue-400">ASSIGN TO</span> <span className="text-green-400">"SOURCE.DAT"</span>
               <span className="text-blue-400">ORGANIZATION IS</span> LINE SEQUENTIAL
               <span className="text-blue-400">FILE STATUS IS</span> FS-SOURCE.
           <span className="text-blue-400">SELECT</span> TARGET-FILE <span className="text-blue-400">ASSIGN TO</span> <span className="text-green-400">"TARGET.DAT"</span>
               <span className="text-blue-400">ORGANIZATION IS</span> LINE SEQUENTIAL
               <span className="text-blue-400">FILE STATUS IS</span> FS-TARGET.

       <span className="text-purple-400">DATA DIVISION</span>.
       <span className="text-purple-400">FILE SECTION</span>.
       <span className="text-blue-400">FD</span>  SOURCE-FILE.
       <span className="text-yellow-400">01</span>  SOURCE-REC.
           <span className="text-blue-400">COPY</span> <span className="text-green-400">"SourceCopybookName.cpy"</span>.

       <span className="text-blue-400">FD</span>  TARGET-FILE.
       <span className="text-yellow-400">01</span>  TARGET-REC.
           <span className="text-blue-400">COPY</span> <span className="text-green-400">"TargetCopybookName.cpy"</span>.

       <span className="text-purple-400">WORKING-STORAGE SECTION</span>.
       <span className="text-yellow-400">01</span>  FS-STATUS-CODES.
           <span className="text-yellow-400">05</span>  FS-SOURCE                <span className="text-blue-400">PIC</span> X(02).
           <span className="text-yellow-400">05</span>  FS-TARGET                <span className="text-blue-400">PIC</span> X(02).

       <span className="text-gray-500">* Additional working storage definitions...</span>
              </code>
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            <span>Generate Another</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Share:</span>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>