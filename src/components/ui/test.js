{/* Context Information - Clean Stacked Design */}
<div className="mb-6 space-y-3">
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
        <>
          {/* Project Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-start space-x-3 p-3 border border-gray-200 rounded-lg bg-white group-hover:border-blue-200 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Project</p>
                <p className="text-sm font-medium text-gray-900 break-words">
                  {projectName}
                </p>
              </div>
              <div className="flex-shrink-0 self-start">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Connection Line */}
          <div className="flex items-center justify-center -my-1">
            <div className="w-0.5 h-4 bg-gradient-to-b from-gray-200 to-gray-100"></div>
          </div>

          {/* Release Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-start space-x-3 p-3 border border-gray-200 rounded-lg bg-white group-hover:border-green-200 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Release</p>
                <p className="text-sm font-medium text-gray-900 break-words">
                  {releaseName}
                </p>
              </div>
              <div className="flex-shrink-0 self-start">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedUserStories.length} {selectedUserStories.length === 1 ? 'story' : 'stories'}
                </span>
              </div>
            </div>
          </div>
        </>
      );
    })()
  ) : isRegenerateMode && selectedTestCases && selectedTestCases.length > 0 ? (
    <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">Context information is not available in regenerate mode</p>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <p className="mt-2 text-sm text-gray-500">No user stories selected</p>
      </div>
    </div>
  )}
</div>