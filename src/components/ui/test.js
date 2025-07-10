{/* Context Breadcrumb - Silicon Valley Style */}
<div className="mb-6">
  {!isRegenerateMode && selectedUserStories && selectedUserStories.length > 0 ? (
    (() => {
      const firstStory = selectedUserStories[0];
      if (!firstStory || !firstStory.id) return null;
      
      // Extract IDs
      const idParts = firstStory.id.split('-');
      const releaseId = idParts[1];
      
      // Find project and release
      let projectName = "Unknown Project";
      let releaseName = "Unknown Release";
      
      for (const project of projectsData) {
        if (project.releases && Array.isArray(project.releases)) {
          const release = project.releases.find(r => 
            r.release_id?.toString() === releaseId
          );
          
          if (release) {
            projectName = project.project_name || project.name;
            releaseName = release.version || release.name;
            break;
          }
        }
      }
      
      return (
        <div className="space-y-3">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-1 text-sm">
            <span className="text-gray-500">You're generating for</span>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-900">{projectName}</span>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-700">{releaseName}</span>
          </nav>
          
          {/* Visual Context Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 via-white to-blue-50 p-0.5">
            <div className="relative rounded-[11px] bg-white/90 backdrop-blur-xl p-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    {/* Project */}
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Project</p>
                        <p className="text-sm font-semibold text-gray-900 -mt-0.5">{projectName}</p>
                      </div>
                    </div>
                    
                    {/* Release */}
                    <div className="flex items-center space-x-3 pl-11">
                      <div className="flex items-center">
                        <div className="w-px h-8 bg-gradient-to-b from-gray-200 to-transparent absolute left-[19px] -top-8"></div>
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-md flex items-center justify-center shadow-lg shadow-green-500/25">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Release</p>
                        <p className="text-sm font-semibold text-gray-700 -mt-0.5">{releaseName}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selection Info */}
                  <div className="text-right">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-full">
                      <div className="flex -space-x-1">
                        {selectedUserStories.slice(0, 3).map((_, i) => (
                          <div key={i} className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h2a1 1 0 100-2H6V7h5a1 1 0 110 2H9a1 1 0 100 2h2a2 2 0 012-2V5a2 2 0 00-2-2H6a1 1 0 000-2 2 2 0 00-2 2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ))}
                        {selectedUserStories.length > 3 && (
                          <div className="w-5 h-5 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">+{selectedUserStories.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-blue-700">
                        {selectedUserStories.length} {selectedUserStories.length === 1 ? 'story' : 'stories'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })()
  ) : isRegenerateMode && selectedTestCases && selectedTestCases.length > 0 ? (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-0.5">
      <div className="rounded-[11px] bg-white/70 backdrop-blur p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Regenerate Mode</p>
            <p className="text-xs text-gray-500">Context information is not available when regenerating test cases</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-200 p-4">
      <div className="flex items-center justify-center space-x-3">
        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-sm text-gray-400">Select user stories to see context</p>
      </div>
    </div>
  )}
</div>