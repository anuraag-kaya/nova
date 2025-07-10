{/* Context Information - Minimalist Design */}
<div className="mb-4">
  {!isRegenerateMode && selectedUserStories && selectedUserStories.length > 0 ? (
    <div className="group">
      {(() => {
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
          <div className="relative">
            {/* Main Content */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50/50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200">
              {/* Project */}
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0057e7]"></div>
                <span className="text-sm font-medium text-gray-900">{projectName}</span>
              </div>
              
              {/* Separator */}
              <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
              
              {/* Release */}
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34A853]"></div>
                <span className="text-sm font-medium text-gray-700">{releaseName}</span>
              </div>
              
              {/* Count Badge */}
              <div className="ml-auto">
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium text-gray-600 bg-white rounded-full border border-gray-200">
                  {selectedUserStories.length}
                </span>
              </div>
            </div>
            
            {/* Subtle hover tooltip */}
            <div className="absolute -bottom-5 left-0 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {selectedUserStories.length} user {selectedUserStories.length === 1 ? 'story' : 'stories'} selected
            </div>
          </div>
        );
      })()}
    </div>
  ) : isRegenerateMode && selectedTestCases && selectedTestCases.length > 0 ? (
    <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50/50 rounded-lg border border-gray-100">
      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
      <span className="text-sm text-gray-500">Context unavailable in regenerate mode</span>
    </div>
  ) : (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-gray-200">
      <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
      <span className="text-sm text-gray-400">No context selected</span>
    </div>
  )}
</div>