{/* Context Information */}
<div className="mb-4">
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
        <div className="bg-gray-50 rounded-md p-3 space-y-2">
          {/* Project */}
          <div className="flex items-center text-sm">
            <span className="text-gray-500 mr-2">📁</span>
            <span className="font-medium text-gray-700 mr-2">Project:</span>
            <span className="text-gray-900">{projectName}</span>
          </div>
          
          {/* Release */}
          <div className="flex items-center text-sm">
            <span className="text-gray-500 mr-2">📄</span>
            <span className="font-medium text-gray-700 mr-2">Release:</span>
            <span className="text-gray-900">{releaseName}</span>
          </div>
          
          {/* Count */}
          <div className="pt-1 border-t border-gray-200">
            <span className="text-xs text-gray-600">
              {selectedUserStories.length} user {selectedUserStories.length === 1 ? 'story' : 'stories'} selected
            </span>
          </div>
        </div>
      );
    })()
  ) : isRegenerateMode && selectedTestCases && selectedTestCases.length > 0 ? (
    <div className="bg-gray-50 rounded-md p-3">
      <span className="text-sm text-gray-600">Context information not available in regenerate mode</span>
    </div>
  ) : (
    <div className="bg-gray-50 rounded-md p-3">
      <span className="text-sm text-gray-500">No context selected</span>
    </div>
  )}
</div>