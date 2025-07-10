// First, add a state for selected project (similar to selectedUserStories)
const [selectedProject, setSelectedProject] = useState(null);

// In your UserPromptForm component, add this to fetch the selected project
// This goes where you're already using selectedUserStories
<div className="mb-4">
  <label className="text-sm font-medium text-gray-700 block mb-2">
    Selected Project:
  </label>
  <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
    {selectedProject ? (
      <div className="p-3 bg-gray-50">
        <div className="flex items-start">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#0057e7]/10 text-[#0057e7] text-xs mr-2 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </span>
          <div>
            <h4 className="text-sm font-medium text-gray-800">{selectedProject.name}</h4>
            {selectedProject.description && (
              <p className="text-xs text-gray-500 mt-1">{selectedProject.description}</p>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className="p-4 text-sm text-red-500 border border-red-200 bg-red-50 rounded-md">
        Please select a project to continue.
      </div>
    )}
  </div>
</div>