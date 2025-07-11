const [pageObjects, setPageObjects] = useState([]);
const [selectedPageObjects, setSelectedPageObjects] = useState([]);
const [showPageObjectDropdown, setShowPageObjectDropdown] = useState(false);
const [pageObjectSearchQuery, setPageObjectSearchQuery] = useState('');
const [isLoadingPageObjects, setIsLoadingPageObjects] = useState(false);
const [apiError, setApiError] = useState(null);

// Upload modal states
const [showUploadModal, setShowUploadModal] = useState(false);
const [selectedFiles, setSelectedFiles] = useState([]);
const [isUploading, setIsUploading] = useState(false);
const [uploadError, setUploadError] = useState(null);


// ************************************************************************************************************

// Fetch page objects
useEffect(() => {
  const fetchPageObjects = async () => {
    const hasStories = Array.isArray(selectedUserStories) && selectedUserStories.length > 0;
    
    if (!isRegenerateMode && hasStories && projectsData && projectsData.length > 0) {
      setIsLoadingPageObjects(true);
      setApiError(null);
      
      // Extract project_id from projectsData
      const projectId = projectsData[0]?.project_id;
      
      if (!projectId) {
        setApiError("No project ID found");
        setIsLoadingPageObjects(false);
        return;
      }
      
      try {
        const response = await fetch(`http://127.0.0.1:8000/get-page-objects?project_id=${projectId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-user-soeid": "as03378" // Replace with actual user SOEID
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data);
          
          if (data.page_objects && Array.isArray(data.page_objects)) {
            setPageObjects(data.page_objects);
          } else {
            console.log("No page_objects array found in response");
            setPageObjects([]);
          }
        } else {
          const errorText = await response.text();
          console.error("API Error:", errorText);
          setApiError(`Server error: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error("Error fetching page objects:", error);
        setApiError(`Network error: ${error.message}`);
      } finally {
        setIsLoadingPageObjects(false);
      }
    }
  };

  fetchPageObjects();
}, [isRegenerateMode, selectedUserStories, projectsData]);

// ************************************************************************************************************


// Filter page objects based on search query (searching by page_object_name)
const filteredPageObjects = pageObjects.filter(pageObject =>
  pageObject.page_object_name && 
  pageObject.page_object_name.toLowerCase().includes(pageObjectSearchQuery.toLowerCase())
);

// Handle page object selection toggle
const handlePageObjectToggle = (pageObject) => {
  setSelectedPageObjects(prev => {
    const isSelected = prev.some(selected => selected.page_object_name === pageObject.page_object_name);
    if (isSelected) {
      return prev.filter(selected => selected.page_object_name !== pageObject.page_object_name);
    } else {
      return [...prev, pageObject];
    }
  });
};

// Handle file upload
const handleFileUpload = async () => {
  if (selectedFiles.length === 0) return;
  
  setIsUploading(true);
  setUploadError(null);
  
  // Get project_id from projectsData
  const projectId = projectsData[0]?.project_id;
  
  if (!projectId) {
    setUploadError("No project ID found");
    setIsUploading(false);
    return;
  }
  
  try {
    const formData = new FormData();
    
    // Add files to FormData
    selectedFiles.forEach((file) => {
      formData.append('page_object_files', file);
    });
    
    const response = await fetch(`http://127.0.0.1:8000/add-page-object?project_id=${projectId}`, {
      method: "POST",
      headers: {
        "x-user-soeid": "as03378" // Replace with actual user SOEID
      },
      body: formData
    });
    
    if (response.ok) {
      // Success - close modal and refresh dropdown
      setShowUploadModal(false);
      setSelectedFiles([]);
      setUploadError(null);
      
      // Refresh the page objects dropdown
      const hasStories = Array.isArray(selectedUserStories) && selectedUserStories.length > 0;
      if (!isRegenerateMode && hasStories && projectsData && projectsData.length > 0) {
        // Trigger a refresh by calling the fetch function again
        setTimeout(() => {
          // Force re-fetch by updating the dependency
          setPageObjects([]);
        }, 500);
      }
    } else {
      const errorText = await response.text();
      setUploadError(`Upload failed: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    setUploadError(`Upload error: ${error.message}`);
  } finally {
    setIsUploading(false);
  }
};

// ************************************************************************************************************


{/* Page Object Model Selection - Only show in Generate mode */}
{!isRegenerateMode && (
  <div className="mb-4">
    {/* Header with Add Button */}
    <div className="flex justify-between items-center mb-1">
      <label className="text-sm font-medium text-gray-700">Select Page Object Model:</label>
      <button
        type="button"
        onClick={() => setShowUploadModal(true)}
        disabled={(!isRegenerateMode && (!selectedUserStories || selectedUserStories.length === 0)) || (isRegenerateMode && !hasSelectedTestCases) || isGenerating}
        className={`px-3 py-1 text-xs font-medium rounded flex items-center gap-1 ${
          (!isRegenerateMode && (!selectedUserStories || selectedUserStories.length === 0)) || (isRegenerateMode && !hasSelectedTestCases) || isGenerating
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-[#0057e7] text-white hover:bg-[#0046b8]'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add
      </button>
    </div>

    {/* Dropdown */}
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPageObjectDropdown(!showPageObjectDropdown)}
        disabled={(!isRegenerateMode && (!selectedUserStories || selectedUserStories.length === 0)) || (isRegenerateMode && !hasSelectedTestCases) || isGenerating}
        className={`w-full p-2 border rounded text-sm text-left flex justify-between items-center ${
          (!isRegenerateMode && (!selectedUserStories || selectedUserStories.length === 0)) || (isRegenerateMode && !hasSelectedTestCases) || isGenerating
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <span>
          {selectedPageObjects.length === 0 
            ? "Select page objects..." 
            : `${selectedPageObjects.length} page object${selectedPageObjects.length === 1 ? '' : 's'} selected`
          }
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${showPageObjectDropdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {showPageObjectDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Search Bar */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search page objects..."
              value={pageObjectSearchQuery}
              onChange={(e) => setPageObjectSearchQuery(e.target.value)}
              className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0057e7] focus:border-[#0057e7]"
            />
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {isLoadingPageObjects ? (
              <div className="p-3 text-center text-sm text-gray-500">
                <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-2"></div>
                Loading page objects...
              </div>
            ) : apiError ? (
              <div className="p-3 text-center text-sm text-red-500">
                Error: {apiError}
              </div>
            ) : filteredPageObjects.length === 0 ? (
              <div className="p-3 text-center text-sm text-gray-500">
                {pageObjectSearchQuery ? `No page objects found for "${pageObjectSearchQuery}"` : 'No page objects available'}
              </div>
            ) : (
              filteredPageObjects.map((pageObject, index) => (
                <div
                  key={index}
                  onClick={() => handlePageObjectToggle(pageObject)}
                  className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center justify-center w-4 h-4 mr-2 border rounded text-xs">
                    {selectedPageObjects.some(selected => selected.page_object_name === pageObject.page_object_name) && (
                      <span className="text-[#0057e7] font-bold">✓</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{pageObject.page_object_name}</span>
                </div>
              ))
            )}
          </div>

          {/* Close button */}
          <div className="p-2 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={() => setShowPageObjectDropdown(false)}
              className="w-full px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Selected Page Objects Display */}
    {selectedPageObjects.length > 0 && (
      <div className="mt-2 flex flex-wrap gap-1">
        {selectedPageObjects.map((pageObject, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
          >
            {pageObject.page_object_name}
            <button
              type="button"
              onClick={() => handlePageObjectToggle(pageObject)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    )}

    {/* Upload Modal */}
    {showUploadModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Upload Page Object Files</h3>
            <button 
              onClick={() => {
                setShowUploadModal(false);
                setSelectedFiles([]);
                setUploadError(null);
              }}
              className="text-gray-500 hover:text-gray-700"
              disabled={isUploading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* File Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Files
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => {
                setSelectedFiles(Array.from(e.target.files));
                setUploadError(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              disabled={isUploading}
            />
          </div>
          
          {/* Selected Files Display */}
          {selectedFiles.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected Files ({selectedFiles.length}):
              </p>
              <div className="max-h-32 overflow-y-auto bg-gray-50 rounded p-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="text-xs text-gray-600 py-1">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {uploadError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{uploadError}</p>
            </div>
          )}
          
          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#0057e7]"></div>
                <span className="ml-2 text-sm text-gray-600">Uploading...</span>
              </div>
            </div>
          )}
          
          {/* Modal Actions */}
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => {
                setShowUploadModal(false);
                setSelectedFiles([]);
                setUploadError(null);
              }}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button 
              onClick={handleFileUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className={`px-4 py-2 text-sm rounded-md ${
                selectedFiles.length === 0 || isUploading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#0057e7] text-white hover:bg-[#0046b8]'
              }`}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}