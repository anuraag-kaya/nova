<div className="flex h-full bg-gradient-to-br from-gray-50 to-gray-100">
 {/* Left Panel - Generated Code Display - 50% */}
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
       
       {/* Quick Start Guide - Moved here */}
       <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
         <h3 className="text-sm font-bold text-gray-900 mb-2">Quick Start Guide</h3>
         <ol className="text-xs text-gray-700 space-y-1.5">
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

   {/* Code Display Area */}
   <div className="flex-1 overflow-hidden flex flex-col bg-white">
     <div className="flex-1 overflow-y-auto p-6">
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

       {!loading && !generatedCode && (
         <div className="h-full flex items-center justify-center">
           <div className="text-center text-gray-500">
             <p className="text-lg">Your generated code will appear here</p>
             <p className="text-sm mt-2">Follow the quick start guide above to begin</p>
           </div>
         </div>
       )}
     </div>
   </div>
 </div>

 {/* Right Panel - Ultra-Compact Form - 50% */}
 <div className="w-1/2 bg-white flex flex-col h-full">
   {/* Scrollable container for the entire form */}
   <div className="flex-1 overflow-y-auto">
     <div className="p-5">
       {/* Compact Header */}
       <div className="flex items-center justify-between mb-4">
         <h3 className="text-sm font-bold text-gray-900 flex items-center">
           <svg className="w-4 h-4 mr-1.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
           </svg>
           Configuration
         </h3>
         <span className="text-xs text-gray-500">All fields required *</span>
       </div>
       
       {/* Ultra-Compact Upload Section */}
       <div className="space-y-2.5">
         {/* All Files in One Compact Grid */}
         <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
           {/* Source Files - Horizontal strip */}
           <div className="mb-2.5">
             <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">
               Source Copybooks (1-3 files)
             </label>
             <div className="flex gap-1.5">
               {[0, 1, 2].map((index) => (
                 <div key={index} className={`flex-1 ${index > 0 && !sourceFiles?.[index-1] ? 'opacity-30' : ''}`}>
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
                       border border-dashed rounded p-2 h-12 flex items-center justify-center
                       transition-all text-center
                       ${sourceFiles?.[index] 
                         ? 'border-green-500 bg-green-50' 
                         : index === 0 
                           ? 'border-red-300 hover:border-indigo-400 hover:bg-indigo-50 bg-white'
                           : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 bg-white'
                       }
                     `}>
                       {sourceFiles?.[index] ? (
                         <div className="flex items-center gap-1">
                           <svg className="w-3.5 h-3.5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                           </svg>
                           <span className="text-[9px] font-medium text-gray-700 truncate">
                             {sourceFiles[index].name.split('.')[0].substring(0, 8)}...
                           </span>
                         </div>
                       ) : (
                         <div className="flex items-center gap-1">
                           <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                           </svg>
                           <span className="text-[9px] text-gray-500">
                             File {index + 1} {index === 0 && '*'}
                           </span>
                         </div>
                       )}
                     </div>
                   </label>
                 </div>
               ))}
             </div>
           </div>

           {/* Target & Mapping - Horizontal strip */}
           <div className="flex gap-2">
             {/* Target File */}
             <div className="flex-1">
               <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">
                 Target Copybook *
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
                   border border-dashed rounded p-2 h-12 flex items-center justify-center
                   transition-all
                   ${targetFile 
                     ? 'border-green-500 bg-green-50' 
                     : 'border-red-300 hover:border-indigo-400 hover:bg-indigo-50 bg-white'
                   }
                 `}>
                   {targetFile ? (
                     <div className="flex items-center gap-1.5">
                       <svg className="w-3.5 h-3.5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                       </svg>
                       <span className="text-[9px] font-medium text-gray-700 truncate">
                         {targetFile.name}
                       </span>
                     </div>
                   ) : (
                     <div className="flex items-center gap-1.5">
                       <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                       </svg>
                       <span className="text-[9px] text-gray-500">Upload target file</span>
                     </div>
                   )}
                 </div>
               </label>
             </div>

             {/* Mapping File */}
             <div className="flex-1">
               <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">
                 Mapping Rules *
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
                   border border-dashed rounded p-2 h-12 flex items-center justify-center
                   transition-all
                   ${mappingFile 
                     ? 'border-green-500 bg-green-50' 
                     : 'border-red-300 hover:border-indigo-400 hover:bg-indigo-50 bg-white'
                   }
                 `}>
                   {mappingFile ? (
                     <div className="flex items-center gap-1.5">
                       <svg className="w-3.5 h-3.5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                       </svg>
                       <span className="text-[9px] font-medium text-gray-700 truncate">
                         {mappingFile.name}
                       </span>
                     </div>
                   ) : (
                     <div className="flex items-center gap-1.5">
                       <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                       </svg>
                       <span className="text-[9px] text-gray-500">Upload JSON</span>
                     </div>
                   )}
                 </div>
               </label>
             </div>
           </div>
         </div>

         {/* LLM Selection & Generate Button - Side by side */}
         <div className="flex gap-2">
           <div className="flex-1">
             <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1 block">
               LLM Model *
             </label>
             <select
               value={selectedLLM}
               onChange={(e) => setSelectedLLM(e.target.value)}
               className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
             >
               <option value="">Select Model...</option>
               <option value="1">Gemini 2.0 Flash</option>
               <option value="2">Gemini 2.0 Flash-lite</option>
               <option value="3">Gemini 1.5 Flash</option>
               <option value="4">Gemini 1.5 Pro</option>
             </select>
           </div>

           <button
             onClick={handleGenerateCode}
             disabled={!sourceFiles?.[0] || !targetFile || !mappingFile || !selectedLLM}
             className={`
               px-4 py-1.5 rounded font-medium flex items-center gap-1.5
               transition-all text-xs self-end
               ${!sourceFiles?.[0] || !targetFile || !mappingFile || !selectedLLM
                 ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                 : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow hover:shadow-md"
               }
             `}
           >
             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
             Generate
           </button>
         </div>

         {/* Instructions - Auto-expanding textarea with pre-populated prompt */}
         <div className="mt-4">
           <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
             Instructions / Prompt
             <span className="text-xs font-normal text-gray-500 ml-2 normal-case">
               Provide detailed requirements
             </span>
           </label>
           <textarea
             placeholder="Enter additional instructions..."
             className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm leading-relaxed"
             style={{ minHeight: '400px' }}
             value={promptText}
             onChange={(e) => {
               setPromptText(e.target.value);
               // Auto-resize the textarea
               e.target.style.height = 'auto';
               e.target.style.height = e.target.scrollHeight + 'px';
             }}
             onInput={(e) => {
               // Also handle onInput for better responsiveness
               e.target.style.height = 'auto';
               e.target.style.height = e.target.scrollHeight + 'px';
             }}
             defaultValue={`[YOUR PROMPT WILL GO HERE - REPLACE THIS TEXT WITH YOUR ACTUAL PROMPT]

Additional instructions can be added below:
`}
           />
           <div className="flex justify-between items-center mt-2">
             <p className="text-[10px] text-gray-500">
               💡 Be specific for better results
             </p>
             <span className="text-[10px] text-gray-400">
               {promptText.length} characters
             </span>
           </div>
         </div>
       </div>
     </div>
   </div>
 </div>
</div>

{/* Add this in your component's JavaScript section */}
{/* 
const handleGenerateCode = async () => {
 if (!sourceFiles?.[0] || !targetFile || !mappingFile || !selectedLLM) {
   return;
 }

 setLoading(true);
 
 try {
   const formData = new FormData();
   
   // Add source files (1-3 files)
   sourceFiles.forEach((file, index) => {
     if (file) {
       formData.append('source_copybooks', file);
     }
   });
   
   // Add other required files
   formData.append('target_copybook', targetFile);
   formData.append('mapping_rules', mappingFile);
   formData.append('prompt', promptText);
   formData.append('llm_model_id', selectedLLM);
   
   const response = await fetch('/generate-code', {
     method: 'POST',
     body: formData,
   });
   
   if (response.ok) {
     const data = await response.json();
     setGeneratedCode(data.generated_code);
   } else {
     console.error('Failed to generate code');
   }
 } catch (error) {
   console.error('Error generating code:', error);
 } finally {
   setLoading(false);
 }
};

// Initialize state with pre-populated prompt
const [promptText, setPromptText] = useState(`[YOUR PROMPT WILL GO HERE - REPLACE THIS TEXT WITH YOUR ACTUAL PROMPT]

Additional instructions can be added below:
`);

// useEffect to auto-resize textarea on mount
useEffect(() => {
 const textarea = document.querySelector('textarea');
 if (textarea && promptText) {
   textarea.style.height = 'auto';
   textarea.style.height = textarea.scrollHeight + 'px';
 }
}, [promptText]);
*/}