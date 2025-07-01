<div className="flex h-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
 {/* Left Panel - Code Display */}
 <div className="w-1/2 flex flex-col h-full border-r border-gray-200">
   {/* Left Header */}
   <div className="bg-white border-b border-gray-200 px-6 py-4">
     <div className="flex items-center justify-between">
       <div className="flex items-center space-x-3">
         <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
           <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
           </svg>
         </div>
         <div>
           <h2 className="text-lg font-semibold text-gray-900">Generated Code</h2>
           <p className="text-xs text-gray-500">COBOL transformation output</p>
         </div>
       </div>
       {generatedCode && (
         <button
           onClick={handleDownloadCode}
           className="flex items-center space-x-2 px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-all duration-200 text-sm"
         >
           <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
           </svg>
           <span>Download</span>
         </button>
       )}
     </div>
   </div>

   {/* Code Display Area */}
   <div className="flex-1 overflow-hidden bg-gray-50 p-6">
     {!loading && !generatedCode && (
       /* Quick Start Guide */
       <div className="h-full flex items-center justify-center">
         <div className="max-w-md w-full">
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
             <div className="text-center mb-6">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
                 <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
               </div>
               <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Start Guide</h3>
               <p className="text-sm text-gray-600">Transform your COBOL code in 4 simple steps</p>
             </div>
             
             <div className="space-y-3">
               <div className="flex items-start space-x-3">
                 <div className="flex-shrink-0 w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                   <span className="text-xs font-semibold text-indigo-600">1</span>
                 </div>
                 <p className="text-sm text-gray-700">Upload source copybook files (.cpy, .txt, .json)</p>
               </div>
               <div className="flex items-start space-x-3">
                 <div className="flex-shrink-0 w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                   <span className="text-xs font-semibold text-indigo-600">2</span>
                 </div>
                 <p className="text-sm text-gray-700">Add target copybook and mapping rules</p>
               </div>
               <div className="flex items-start space-x-3">
                 <div className="flex-shrink-0 w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                   <span className="text-xs font-semibold text-indigo-600">3</span>
                 </div>
                 <p className="text-sm text-gray-700">Select your preferred LLM model</p>
               </div>
               <div className="flex items-start space-x-3">
                 <div className="flex-shrink-0 w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                   <span className="text-xs font-semibold text-indigo-600">4</span>
                 </div>
                 <p className="text-sm text-gray-700">Add instructions and generate</p>
               </div>
             </div>
           </div>
         </div>
       </div>
     )}

     {loading && (
       /* Loading State */
       <div className="h-full flex items-center justify-center">
         <div className="text-center">
           <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
             <div className="animate-spin rounded-full h-12 w-12 border-3 border-indigo-600 border-t-transparent"></div>
           </div>
           <p className="text-gray-600 font-medium">Generating COBOL code...</p>
           <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
         </div>
       </div>
     )}

     {generatedCode && (
       /* Generated Code Display */
       <div className="h-full flex flex-col">
         {submittedPrompt && (
           <div className="mb-4 bg-white rounded-lg border border-gray-200 p-4">
             <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Instructions Used</h4>
             <p className="text-sm text-gray-700">{submittedPrompt}</p>
           </div>
         )}
         
         <div className="flex-1 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
           <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
             <div className="flex items-center space-x-2">
               <div className="w-3 h-3 bg-red-500 rounded-full"></div>
               <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
               <div className="w-3 h-3 bg-green-500 rounded-full"></div>
             </div>
             <span className="text-xs text-gray-400 font-mono">output.cbl</span>
           </div>
           <pre className="p-4 overflow-auto h-full">
             <code className="text-sm text-gray-300 font-mono leading-relaxed">{generatedCode}</code>
           </pre>
         </div>
       </div>
     )}
   </div>
 </div>

 {/* Right Panel - Form */}
 <div className="w-1/2 flex flex-col h-full bg-white">
   {/* Right Header */}
   <div className="border-b border-gray-200 px-6 py-4">
     <h2 className="text-lg font-semibold text-gray-900">Configuration</h2>
     <p className="text-xs text-gray-500">Upload files and set parameters</p>
   </div>

   {/* Form Area */}
   <div className="flex-1 overflow-y-auto px-6 py-6">
     <form className="space-y-6">
       {/* Required Files Section */}
       <div>
         <h3 className="text-sm font-semibold text-gray-900 mb-3">Required Files</h3>
         
         {/* Source Copybook Files */}
         <div className="mb-4">
           <label className="block text-xs font-medium text-gray-700 mb-2">
             Source Copybook <span className="text-red-500">*</span>
             <span className="text-gray-500 font-normal ml-1">(1-3 files, .cpy .txt .json)</span>
           </label>
           
           <div className="space-y-2">
             {[0, 1, 2].map((index) => (
               <div key={index} className={index > 0 && !sourceFiles[index - 1] ? 'opacity-50 pointer-events-none' : ''}>
                 {!sourceFiles[index] ? (
                   <label className="relative block">
                     <input
                       type="file"
                       className="hidden"
                       accept=".cpy,.txt,.json"
                       onChange={(e) => handleSourceFileUpload(e, index)}
                       disabled={index > 0 && !sourceFiles[index - 1]}
                     />
                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-indigo-400 transition-colors duration-200">
                       <svg className="mx-auto h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                       </svg>
                       <p className="mt-1 text-xs text-gray-600">
                         {index === 0 ? 'Upload source file (required)' : `Upload additional source file ${index + 1} (optional)`}
                       </p>
                     </div>
                   </label>
                 ) : (
                   <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                     <div className="flex items-center space-x-3">
                       <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                       <div>
                         <p className="text-sm font-medium text-gray-900">{sourceFiles[index].name}</p>
                         <p className="text-xs text-gray-500">{formatFileSize(sourceFiles[index].size)}</p>
                       </div>
                     </div>
                     <button
                       type="button"
                       onClick={() => removeSourceFile(index)}
                       className="text-red-500 hover:text-red-700"
                     >
                       <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                       </svg>
                     </button>
                   </div>
                 )}
               </div>
             ))}
           </div>
         </div>

         {/* Target Copybook */}
         <div className="mb-4">
           <label className="block text-xs font-medium text-gray-700 mb-2">
             Target Copybook <span className="text-red-500">*</span>
             <span className="text-gray-500 font-normal ml-1">(.cpy .txt .json)</span>
           </label>
           {!targetFile ? (
             <label className="relative block">
               <input
                 type="file"
                 className="hidden"
                 accept=".cpy,.txt,.json"
                 onChange={(e) => setTargetFile(e.target.files[0])}
               />
               <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-indigo-400 transition-colors duration-200">
                 <svg className="mx-auto h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                 </svg>
                 <p className="mt-1 text-xs text-gray-600">Upload target copybook file</p>
               </div>
             </label>
           ) : (
             <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
               <div className="flex items-center space-x-3">
                 <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <div>
                   <p className="text-sm font-medium text-gray-900">{targetFile.name}</p>
                   <p className="text-xs text-gray-500">{formatFileSize(targetFile.size)}</p>
                 </div>
               </div>
               <button
                 type="button"
                 onClick={() => setTargetFile(null)}
                 className="text-red-500 hover:text-red-700"
               >
                 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
           )}
         </div>

         {/* Mapping Rules */}
         <div className="mb-4">
           <label className="block text-xs font-medium text-gray-700 mb-2">
             Mapping Rules <span className="text-red-500">*</span>
             <span className="text-gray-500 font-normal ml-1">(.json)</span>
           </label>
           {!mappingFile ? (
             <label className="relative block">
               <input
                 type="file"
                 className="hidden"
                 accept=".json"
                 onChange={(e) => setMappingFile(e.target.files[0])}
               />
               <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-indigo-400 transition-colors duration-200">
                 <svg className="mx-auto h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                 </svg>
                 <p className="mt-1 text-xs text-gray-600">Upload mapping rules file</p>
               </div>
             </label>
           ) : (
             <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
               <div className="flex items-center space-x-3">
                 <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <div>
                   <p className="text-sm font-medium text-gray-900">{mappingFile.name}</p>
                   <p className="text-xs text-gray-500">{formatFileSize(mappingFile.size)}</p>
                 </div>
               </div>
               <button
                 type="button"
                 onClick={() => setMappingFile(null)}
                 className="text-red-500 hover:text-red-700"
               >
                 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
           )}
         </div>
       </div>

       {/* LLM Selection */}
       <div>
         <label className="block text-xs font-medium text-gray-700 mb-2">
           Select LLM Model <span className="text-red-500">*</span>
         </label>
         <select
           value={selectedLLM}
           onChange={(e) => setSelectedLLM(e.target.value)}
           className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
         >
           <option value="">Choose a model...</option>
           {llmModels.map((model) => (
             <option key={model.id} value={model.id}>{model.name}</option>
           ))}
         </select>
       </div>

       {/* Instructions */}
       <div>
         <label className="block text-xs font-medium text-gray-700 mb-2">
           Instructions <span className="text-gray-500">(Optional)</span>
         </label>
         <textarea
           value={promptText}
           onChange={(e) => setPromptText(e.target.value)}
           placeholder="Add any specific requirements or transformation rules..."
           className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
           rows="4"
         />
       </div>

       {/* Generate Button */}
       <button
         type="button"
         onClick={handleGenerateCode}
         disabled={!sourceFiles[0] || !targetFile || !mappingFile || !selectedLLM || loading}
         className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 ${
           !sourceFiles[0] || !targetFile || !mappingFile || !selectedLLM || loading
             ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
             : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] shadow-lg'
         }`}
       >
         {loading ? (
           <>
             <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
             </svg>
             <span>Generating...</span>
           </>
         ) : (
           <>
             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
             <span>Generate Code</span>
           </>
         )}
       </button>
     </form>
   </div>
 </div>
</div>