{/* Selected Release Display */}
<div className="mb-4">
  <label className="text-sm font-medium text-gray-700 block mb-2">
    Selected Release:
  </label>
  {!isRegenerateMode && selectedUserStories && selectedUserStories.length > 0 ? (
    <div className="border rounded-md p-3 bg-gray-50">
      <div className="flex items-start">
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#0057e7]/10 text-[#0057e7] text-xs mr-2 flex-shrink-0">
          📄
        </span>
        <div>
          <h4 className="text-sm font-medium text-gray-800">
            {(() => {
              const firstStory = selectedUserStories[0];
              if (!firstStory || !firstStory.id) return "Unknown Release";
              
              // Extract release ID from user story ID (format: "us-releaseId-userStoryId")
              const idParts = firstStory.id.split('-');
              const releaseId = idParts[1]; // Get the release ID part
              
              // Find the release in projectsData
              let releaseName = "Unknown Release";
              
              for (const project of projectsData) {
                if (project.releases && Array.isArray(project.releases)) {
                  const release = project.releases.find(r => 
                    r.release_id?.toString() === releaseId
                  );
                  
                  if (release) {
                    releaseName = release.version || release.name || `Release ${release.release_id}`;
                    break;
                  }
                }
              }
              
              return releaseName;
            })()}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            All selected user stories belong to this release
          </p>
        </div>
      </div>
    </div>
  ) : isRegenerateMode && selectedTestCases && selectedTestCases.length > 0 ? (
    <div className="p-4 text-sm text-gray-500 border border-gray-200 bg-gray-50 rounded-md">
      Release information not available in regenerate mode
    </div>
  ) : (
    <div className="p-4 text-sm text-gray-500 border border-gray-200 bg-gray-50 rounded-md">
      No release selected
    </div>
  )}
</div>