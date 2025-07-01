<div className="flex h-full bg-gradient-to-br from-gray-50 to-gray-100">
 {/* Left Panel - Generated Code Display - Back to 50% */}
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

 {/* Right Panel - Form - Back to 50% with better content arrangement */}
 <div className="w-1/2 bg-white flex flex-col h-full shadow-lg">
   <div className="flex-1 overflow-y-auto p-6">
     <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center">
       <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
       </svg>
       Configuration
     </h3>
     
     {/* Compact File Upload Section with better spacing */}
     <div className="space-y-3">
       {/* Source Copybook Files - Horizontal Layout */}
       <div>
         <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
           Source Copybook Files <span className="text-red-500">*</span>
         </label>
         <div className="flex gap-2">
           {[0, 1, 2].map((index) => (
             <div key={index} className={`flex-1 ${index > 0 && !sourceFiles?.[index-1] ? 'opacity-40' : ''}`}>
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
               <label 
                 htmlFor={`source-${index}`} 
                 className={`block cursor-pointer ${index > 0 && !sourceFiles?.[index-1] ? 'cursor-not-allowed' : ''}`}
               >
                 <div className={`
                   border-2 border-dashed rounded-lg p-3 h-20 flex flex-col items-center justify-center
                   transition-all text-center
                   ${sourceFiles?.[index] 
                     ? 'border-green-400 bg-green-50' 
                     : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                   }
                 `}>
                   {sourceFiles?.[index] ? (
                     <>
                       <svg className="w-5 h-5 text-green-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                       <span className="text-[10px] font-medium text-gray-900 truncate max-w-full px-1">
                         {sourceFiles[index].name.length > 15 
                           ? sourceFiles[index].name.substring(0, 15) + '...' 
                           : sourceFiles[index].name}
                       </span>
                       <span className="text-[9px] text-gray-500">
                         {(sourceFiles[index].size / 1024).toFixed(1)} KB
                       </span>
                     </>
                   ) : (
                     <>
                       <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                       </svg>
                       <span className="text-[10px] text-gray-500">
                         {index === 0 ? 'Required' : `Optional ${index}`}
                       </span>
                     </>
                   )}
                 </div>
               </label>
             </div>
           ))}
         </div>
       </div>

       {/* Target & Mapping Files - Side by Side */}
       <div className="flex gap-3">
         {/* Target Copybook File */}
         <div className="flex-1">
           <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
             Target File <span className="text-red-500">*</span>
           </label>
           <input 
             type="file" 
             id="target-file"
             className="hidden" 
             accept=".cpy,.txt,.json"
             onChange={(e) => setTargetFile(e.target.files[0])}
           />
           <label htmlFor="target-file" className="block cursor-pointer">
             <div className={`
               border-2 border-dashed rounded-lg p-3 h-24 flex flex-col items-center justify-center
               transition-all text-center
               ${targetFile 
                 ? 'border-green-400 bg-green-50' 
                 : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
               }
             `}>
               {targetFile ? (
                 <>
                   <svg className="w-5 h-5 text-green-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   <span className="text-[10px] font-medium text-gray-900 truncate max-w-full px-1">
                     {targetFile.name}
                   </span>
                   <span className="text-[9px] text-gray-500">
                     {(targetFile.size / 1024).toFixed(1)} KB
                   </span>
                 </>
               ) : (
                 <>
                   <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                   <span className="text-[10px] text-gray-500">Target Copybook</span>
                 </>
               )}
             </div>
           </label>
         </div>

         {/* Mapping Rules File */}
         <div className="flex-1">
           <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
             Mapping Rules <span className="text-red-500">*</span>
           </label>
           <input 
             type="file" 
             id="mapping-file"
             className="hidden" 
             accept=".json"
             onChange={(e) => setMappingFile(e.target.files[0])}
           />
           <label htmlFor="mapping-file" className="block cursor-pointer">
             <div className={`
               border-2 border-dashed rounded-lg p-3 h-24 flex flex-col items-center justify-center
               transition-all text-center
               ${mappingFile 
                 ? 'border-green-400 bg-green-50' 
                 : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
               }
             `}>
               {mappingFile ? (
                 <>
                   <svg className="w-5 h-5 text-green-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   <span className="text-[10px] font-medium text-gray-900 truncate max-w-full px-1">
                     {mappingFile.name}
                   </span>
                   <span className="text-[9px] text-gray-500">
                     {(mappingFile.size / 1024).toFixed(1)} KB
                   </span>
                 </>
               ) : (
                 <>
                   <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                   </svg>
                   <span className="text-[10px] text-gray-500">Mapping JSON</span>
                 </>
               )}
             </div>
           </label>
         </div>
       </div>

       {/* LLM Selection - Compact */}
       <div>
         <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
           LLM Model <span className="text-red-500">*</span>
         </label>
         <select
           value={selectedLLM}
           onChange={(e) => setSelectedLLM(e.target.value)}
           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
         >
           <option value="">Select model...</option>
           {llmModels.map(model => (
             <option key={model.id} value={model.id}>{model.name}</option>
           ))}
         </select>
       </div>

       {/* Instructions - LARGER for lengthy prompts */}
       <div className="flex-1 flex flex-col">
         <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
           Instructions <span className="text-xs font-normal text-gray-500">(Optional)</span>
         </label>
         <textarea
           placeholder="Add detailed instructions for code generation. You can include specific requirements, patterns to follow, naming conventions, error handling preferences, and any other guidelines for the AI to follow..."
           className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm leading-relaxed"
           style={{ minHeight: '200px' }}
           value={promptText}
           onChange={(e) => setPromptText(e.target.value)}
         />
         <p className="text-xs text-gray-500 mt-1">
           Tip: Be specific about your requirements for better code generation
         </p>
       </div>

       {/* Generate Button */}
       <button
         onClick={handleGenerateCode}
         disabled={!sourceFiles?.[0] || !targetFile || !mappingFile || !selectedLLM}
         className={`
           w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 
           transition-all text-sm uppercase tracking-wider
           ${!sourceFiles?.[0] || !targetFile || !mappingFile || !selectedLLM
             ? "bg-gray-200 text-gray-400 cursor-not-allowed"
             : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
           }
         `}
       >
         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
         </svg>
         Generate Code
       </button>
     </div>
   </div>
 </div>
</div>