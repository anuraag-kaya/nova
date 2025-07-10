{/* Project & Release Information - Unified Design */}
<div className="mb-4">
  <label className="text-sm font-medium text-gray-700 block mb-2">
    Context Information:
  </label>
  {!isRegenerateMode && selectedUserStories && selectedUserStories.length > 0 ? (
    <div className="border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-white overflow-hidden">
      {(() => {
        const firstStory = selectedUserStories[0];
        if (!firstStory || !firstStory.id) return (
          <div className="p-4 text-sm text-gray-500">
            Unable to determine project context
          </div>
        );
        
        // Extract IDs
        const idParts = firstStory.id.split('-');
        const releaseId = idParts[1];
        
        // Find project and release
        let projectName = "Unknown Project";
        let releaseName = "Unknown Release";
        let projectId = null;
        
        for (const project of projectsData) {
          if (project.releases && Array.isArray(project.releases)) {
            const release = project.releases.find(r => 
              r.release_id?.toString() === releaseId
            );
            
            if (release) {
              projectName = project.project_name || project.name || `Project ${project.project_id}`;
              projectId = project.project_id;
              releaseName = release.version || release.name || `Release ${release.release_id}`;
              break;
            }
          }
        }
        
        return (
          <div className="flex items-stretch">
            {/* Project Section */}
            <div className="flex-1 p-4 flex items-center border-r border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-[#0057e7]/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-lg">📁</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Project</p>
                  <h4 className="text-sm font-semibold text-gray-900 leading-tight">{projectName}</h4>
                </div>
              </div>
            </div>
            
            {/* Visual Separator - Arrow */}
            <div className="flex items-center justify-center px-2 bg-gradient-to-r from-gray-50 to-white">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            {/* Release Section */}
            <div className="flex-1 p-4 flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-[#34A853]/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-lg">📄</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Release</p>
                  <h4 className="text-sm font-semibold text-gray-900 leading-tight">{releaseName}</h4>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      
      {/* Bottom Info Bar */}
      <div className="bg-blue-50 px-4 py-2 border-t border-blue-100">
        <p className="text-xs text-blue-700 flex items-center">
          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          All {selectedUserStories.length} selected user {selectedUserStories.length === 1 ? 'story belongs' : 'stories belong'} to this context
        </p>
      </div>
    </div>
  ) : isRegenerateMode && selectedTestCases && selectedTestCases.length > 0 ? (
    <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-gray-600">Context information not available in regenerate mode</p>
      </div>
    </div>
  ) : (
    <div className="border border-dashed border-gray-300 rounded-lg bg-gray-50 p-4">
      <div className="flex items-center justify-center">
        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <p className="text-sm text-gray-500">No context selected</p>
      </div>
    </div>
  )}
</div>