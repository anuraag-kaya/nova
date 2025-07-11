{/* Page Object Model Selection - Only show in Generate mode */}
{!isRegenerateMode && (
  <div className="mb-4">
    <label className="text-sm font-medium text-gray-700 block mb-1">Select Page Object Model:</label>
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
  </div>
)}

// ***********************

const [pageObjects, setPageObjects] = useState([]);
const [selectedPageObjects, setSelectedPageObjects] = useState([]);
const [showPageObjectDropdown, setShowPageObjectDropdown] = useState(false);
const [pageObjectSearchQuery, setPageObjectSearchQuery] = useState('');
const [isLoadingPageObjects, setIsLoadingPageObjects] = useState(false);
const [apiError, setApiError] = useState(null);

// Fetch page objects
useEffect(() => {
  const fetchPageObjects = async () => {
    const hasStories = Array.isArray(selectedUserStories) && selectedUserStories.length > 0;
    
    if (!isRegenerateMode && hasStories) {
      setIsLoadingPageObjects(true);
      setApiError(null);
      try {
        const response = await fetch("http://127.0.0.1:8000/get-page-objects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
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
          setApiError(`Server error: ${response.status}`);
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
}, [isRegenerateMode, selectedUserStories]);

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