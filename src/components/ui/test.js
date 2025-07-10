// Page Object Model Dropdown Component
const [showPageObjectDropdown, setShowPageObjectDropdown] = useState(false);
const [pageObjectSearch, setPageObjectSearch] = useState("");
const [selectedPageObjects, setSelectedPageObjects] = useState([]);
const [pageObjects, setPageObjects] = useState([]);
const [isLoadingPageObjects, setIsLoadingPageObjects] = useState(false);
const pageObjectDropdownRef = useRef(null);

// Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (pageObjectDropdownRef.current && !pageObjectDropdownRef.current.contains(event.target)) {
      setShowPageObjectDropdown(false);
    }
  };
  
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

// Fetch page objects when dropdown opens
useEffect(() => {
  const fetchPageObjects = async () => {
    if (!showPageObjectDropdown || !accessToken || pageObjects.length > 0) return;
    
    setIsLoadingPageObjects(true);
    try {
      // Extract project ID from selected user stories or test cases
      let projectId = null;
      
      // Try to get project ID from selected items
      if (!isRegenerateMode && selectedUserStories.length > 0) {
        // Extract from user story ID format: "us-releaseId-userStoryId"
        // You might need to fetch the project ID from the release
        const userStoryId = selectedUserStories[0].id;
        // This is a placeholder - you'll need to determine how to get project ID
        // from your data structure
        projectId = 1; // Replace with actual logic
      } else if (isRegenerateMode && selectedTestCases.length > 0) {
        // Similar logic for test cases
        projectId = 1; // Replace with actual logic
      }
      
      if (!projectId) {
        console.warn("No project ID available for fetching page objects");
        return;
      }
      
      const response = await fetch(`http://127.0.0.1:8000/get-page-object?project_id=${projectId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-user-email": user?.email,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching page objects: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Assuming the API returns an array of page objects
      // Adjust based on actual API response structure
      setPageObjects(Array.isArray(data) ? data : data.page_objects || []);
    } catch (error) {
      console.error("Error fetching page objects:", error);
      // You might want to show an error message to the user
    } finally {
      setIsLoadingPageObjects(false);
    }
  };
  
  fetchPageObjects();
}, [showPageObjectDropdown, accessToken, user?.email, selectedUserStories, selectedTestCases, isRegenerateMode]);

// Toggle page object selection
const togglePageObjectSelection = (pageObject) => {
  setSelectedPageObjects(prev => {
    const isSelected = prev.some(po => po.id === pageObject.id);
    if (isSelected) {
      return prev.filter(po => po.id !== pageObject.id);
    } else {
      return [...prev, pageObject];
    }
  });
};

// Filter page objects based on search
const filteredPageObjects = pageObjects.filter(po => 
  po.name?.toLowerCase().includes(pageObjectSearch.toLowerCase()) ||
  po.description?.toLowerCase().includes(pageObjectSearch.toLowerCase())
);

// The dropdown UI
<div className="mb-4" ref={pageObjectDropdownRef}>
  <label className="text-sm font-medium text-gray-700 block mb-1">Select Page Object Model:</label>
  
  {/* Dropdown trigger button */}
  <div 
    onClick={() => setShowPageObjectDropdown(!showPageObjectDropdown)}
    className={`w-full px-3 py-2 border rounded-md text-sm cursor-pointer flex items-center justify-between ${
      (!isRegenerateMode && !hasSelectedStories) || (isRegenerateMode && !hasSelectedTestCases) || isGenerating
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
      xmlns="http://www.w3.org/2000/svg" 
      className={`h-4 w-4 transition-transform duration-200 ${showPageObjectDropdown ? 'rotate-180' : ''}`}
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
  
  {/* Dropdown menu */}
  {showPageObjectDropdown && (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
      {/* Search bar */}
      <div className="p-2 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search page objects..."
          value={pageObjectSearch}
          onChange={(e) => setPageObjectSearch(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0057e7] focus:border-[#0057e7]"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      {/* Options list */}
      <div className="max-h-48 overflow-y-auto">
        {isLoadingPageObjects ? (
          <div className="p-4 text-center">
            <div className="inline-flex items-center">
              <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-500">Loading page objects...</span>
            </div>
          </div>
        ) : filteredPageObjects.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            {pageObjectSearch ? "No page objects found" : "No page objects available"}
          </div>
        ) : (
          filteredPageObjects.map(pageObject => (
            <div
              key={pageObject.id}
              onClick={() => togglePageObjectSelection(pageObject)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
            >
              <input
                type="checkbox"
                checked={selectedPageObjects.some(po => po.id === pageObject.id)}
                onChange={() => {}}
                className="mr-2 h-4 w-4 text-[#0057e7] rounded border-gray-300 focus:ring-[#0057e7]"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{pageObject.name}</div>
                {pageObject.description && (
                  <div className="text-xs text-gray-500">{pageObject.description}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Selected count footer */}
      {selectedPageObjects.length > 0 && (
        <div className="p-2 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">
              {selectedPageObjects.length} selected
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPageObjects([]);
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  )}
  
  {/* Display selected page objects */}
  {selectedPageObjects.length > 0 && (
    <div className="mt-2 flex flex-wrap gap-1">
      {selectedPageObjects.map(po => (
        <span 
          key={po.id}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
        >
          {po.name}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePageObjectSelection(po);
            }}
            className="ml-1 hover:text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
    </div>
  )}
</div>