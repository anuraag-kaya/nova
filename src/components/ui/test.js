<div className="flex h-full bg-gradient-to-br from-gray-50 to-gray-100">
 {/* Left Panel - Generated Code Display */}
 <div className="w-1/2 flex flex-col h-full border-r border-gray-200">
   {/* Header */}
   <div className="bg-white shadow-sm border-b border-gray-200">
     <div className="px-6 py-4">
       <div className="flex items-center space-x-3">
         <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
           <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
           </svg>
         </div>
         <div>
           <h2 className="text-xl font-bold text-gray-900">Code Builder for COBOL</h2>
           <p className="text-sm text-gray-600">Generate COBOL with gen AI prompt and file uploads</p>
         </div>
       </div>
     </div>
   </div>

   {/* Code Display Area */}
   <div className="flex-1 overflow-hidden flex flex-col bg-white">
     <div className="flex-1 overflow-y-auto p-6">
       {!loading && !generatedCode && (
         /* Quick Start Guide */
         <div className="h-full flex items-center justify-center">
           <div className="text-center max-w-md">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
               <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Start Guide</h3>
             <div className="text-left bg-gray-50 rounded-xl p-4 border border-gray-100">
               <ol className="text-sm text-gray-700 space-y-2">
                 <li className="flex items-start">
                   <span className="font-semibold text-indigo-600 mr-2">1.</span>
                   Upload source copybook files (1-3 files)
                 </li>
                 <li className="flex items-start">
                   <span className="font-semibold text-indigo-600 mr-2">2.</span>
                   Add target copybook file
                 </li>
                 <li className="flex items-start">
                   <span className="font-semibold text-indigo-600 mr-2">3.</span>
                   Include mapping rules configuration
                 </li>
                 <li className="flex items-start">
                   <span className="font-semibold text-indigo-600 mr-2">4.</span>
                   Select LLM and add instructions
                 </li>
                 <li className="flex items-start">
                   <span className="font-semibold text-indigo-600 mr-2">5.</span>
                   Generate your COBOL code
                 </li>
               </ol>
             </div>
           </div>
         </div>
       )}

       {loading && (
         <div className="h-full flex items-center justify-center">
           <div className="text-center">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
               <CircularProgress size={32} className="text-indigo-600" />
             </div>
             <p className="text-lg font-medium text-gray-900">Generating COBOL code...</p>
             <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
           </div>
         </div>
       )}

       {generatedCode && (
         <div className="h-full flex flex-col">
           {/* Generated Code Header */}
           <div className="flex items-center justify-between mb-4">
             <div>
               <h3 className="text-lg font-bold text-gray-900">Generated Code</h3>
               {promptText && (
                 <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                   <p className="text-xs font-medium text-indigo-700 mb-1">Instructions used:</p>
                   <p className="text-sm text-indigo-900">{promptText}</p>
                 </div>
               )}
             </div>
             <button
               onClick={() => {
                 const blob = new Blob([generatedCode], { type: 'application/msword' });
                 const url = window.URL.createObjectURL(blob);
                 const a = document.createElement('a');
                 a.href = url;
                 a.download = 'generated-cobol.doc';
                 a.click();
               }}
               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
             >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               Download
             </button>
           </div>
           
           {/* Code Display */}
           <div className="flex-1 overflow-hidden rounded-lg border border-gray-200">
             <pre className="h-full overflow-auto bg-gray-900 text-gray-100 p-6">
               <code className="text-sm font-mono leading-relaxed">{generatedCode}</code>
             </pre>
           </div>
         </div>
       )}
     </div>
   </div>
 </div>

 {/* Right Panel - Form */}
 <div className="w-1/2 bg-white flex flex-col h-full">
   <div className="flex-1 overflow-y-auto p-4">
     <h3 className="text-lg font-bold text-gray-900 mb-4">Configuration</h3>
     
     {/* File Upload Section */}
     <div className="space-y-3">
       {/* Source Copybook Files */}
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">
           Source Copybook Files <span className="text-red-500">*</span>
           <span className="text-xs text-gray-500 ml-1">(1-3 files, .txt/.cpy/.json)</span>
         </label>
         <div className="space-y-1">
           {[0, 1, 2].map((index) => (
             <div key={index} className={index > 0 && !sourceFiles?.[index-1] ? 'opacity-50' : ''}>
               <input 
                 type="file" 
                 id={`source-${index}`}
                 className="hidden" 
                 accept=".cpy,.txt,.json"
                 onChange={(e) => {
                   const file = e.target.files[0];
                   if (file) {
                     const newFiles = [...(sourceFiles || [])];
                     newFiles[index] = file;
                     setSourceFiles(newFiles);
                   }
                 }}
                 disabled={index > 0 && !sourceFiles?.[index-1]}
               />
               <label htmlFor={`source-${index}`} className={`block cursor-pointer ${index > 0 && !sourceFiles?.[index-1] ? 'cursor-not-allowed' : ''}`}>
                 <div className={`border-2 border-dashed rounded-lg p-2 transition-all ${
                   sourceFiles?.[index] 
                     ? 'border-green-400 bg-green-50' 
                     : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                 }`}>
                   {sourceFiles?.[index] ? (
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                         <span className="text-xs font-medium text-gray-900">{sourceFiles[index].name}</span>
                       </div>
                       <span className="text-xs text-gray-500">{(sourceFiles[index].size / 1024).toFixed(1)} KB</span>
                     </div>
                   ) : (
                     <div className="flex items-center gap-2 text-gray-500">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                       </svg>
                       <span className="text-xs">{index === 0 ? 'Source file (required)' : `Source file ${index + 1} (optional)`}</span>
                     </div>
                   )}
                 </div>
               </label>
             </div>
           ))}
         </div>
       </div>

       {/* Target Copybook File */}
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">
           Target Copybook File <span className="text-red-500">*</span>
           <span className="text-xs text-gray-500 ml-1">(.txt/.cpy/.json)</span>
         </label>
         <input 
           type="file" 
           id="target-file"
           className="hidden" 
           accept=".cpy,.txt,.json"
           onChange={(e) => setTargetFile(e.target.files[0])}
         />
         <label htmlFor="target-file" className="block cursor-pointer">
           <div className={`border-2 border-dashed rounded-lg p-2 transition-all ${
             targetFile 
               ? 'border-green-400 bg-green-50' 
               : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
           }`}>
             {targetFile ? (
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   <span className="text-xs font-medium text-gray-900">{targetFile.name}</span>
                 </div>
                 <span className="text-xs text-gray-500">{(targetFile.size / 1024).toFixed(1)} KB</span>
               </div>
             ) : (
               <div className="flex items-center gap-2 text-gray-500">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                 </svg>
                 <span className="text-xs">Click to upload target file</span>
               </div>
             )}
           </div>
         </label>
       </div>

       {/* Mapping Rules File */}
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">
           Mapping Rules <span className="text-red-500">*</span>
           <span className="text-xs text-gray-500 ml-1">(.json)</span>
         </label>
         <input 
           type="file" 
           id="mapping-file"
           className="hidden" 
           accept=".json"
           onChange={(e) => setMappingFile(e.target.files[0])}
         />
         <label htmlFor="mapping-file" className="block cursor-pointer">
           <div className={`border-2 border-dashed rounded-lg p-2 transition-all ${
             mappingFile 
               ? 'border-green-400 bg-green-50' 
               : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
           }`}>
             {mappingFile ? (
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   <span className="text-xs font-medium text-gray-900">{mappingFile.name}</span>
                 </div>
                 <span className="text-xs text-gray-500">{(mappingFile.size / 1024).toFixed(1)} KB</span>
               </div>
             ) : (
               <div className="flex items-center gap-2 text-gray-500">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                 </svg>
                 <span className="text-xs">Click to upload mapping rules</span>
               </div>
             )}
           </div>
         </label>
       </div>

       {/* LLM Selection */}
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">
           Select LLM <span className="text-red-500">*</span>
         </label>
         <select
           value={selectedLLM}
           onChange={(e) => setSelectedLLM(e.target.value)}
           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
         >
           <option value="">Choose a model...</option>
           {llmModels.map(model => (
             <option key={model.id} value={model.id}>{model.name}</option>
           ))}
         </select>
       </div>

       {/* Instructions */}
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">
           Instructions
         </label>
         <textarea
           placeholder="Add any specific requirements or instructions for the code generation..."
           className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
           rows="3"
           value={promptText}
           onChange={(e) => setPromptText(e.target.value)}
         />
       </div>

       {/* Generate Button */}
       <button
         onClick={handleGenerateCode}
         disabled={!sourceFiles?.[0] || !targetFile || !mappingFile || !selectedLLM}
         className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all text-sm ${
           !sourceFiles?.[0] || !targetFile || !mappingFile || !selectedLLM
             ? "bg-gray-200 text-gray-400 cursor-not-allowed"
             : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
         }`}
       >
         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
         </svg>
         Generate Code
       </button>
     </div>
   </div>
 </div>
</div>