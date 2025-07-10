// components/PageObjectDropdown.js
"use client";
import { useState, useEffect, useRef } from "react";

export default function PageObjectDropdown({ 
  projectId, 
  selectedPageObjects = [], 
  onSelectionChange, 
  accessToken,
  userEmail,
  disabled = false,
  onAddClick
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageObjects, setPageObjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log("PageObjectDropdown - projectId:", projectId);
    console.log("PageObjectDropdown - accessToken exists:", !!accessToken);
    console.log("PageObjectDropdown - disabled:", disabled);
  }, [projectId, accessToken, disabled]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch page objects when component mounts or projectId changes
  useEffect(() => {
    if (projectId && accessToken) {
      fetchPageObjects();
    }
  }, [projectId, accessToken]);

  const fetchPageObjects = async () => {
    if (!projectId || !accessToken) {
      console.log("Cannot fetch: missing projectId or accessToken");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching page objects for project:", projectId);
      
      const response = await fetch(
        `/api/get-page-object?project_id=${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-user-email": userEmail,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch page objects: ${response.status}`);
      }

      const data = await response.json();
      console.log("Page objects response:", data);
      
      // Extract page objects from the response structure
      // The API returns { "page_objects": { "project_key": [...] } }
      let allPageObjects = [];
      if (data.page_objects) {
        Object.entries(data.page_objects).forEach(([projectKey, objects]) => {
          if (Array.isArray(objects)) {
            allPageObjects = allPageObjects.concat(
              objects.map(obj => ({
                id: obj.page_object_id || obj.id || obj,
                name: obj.page_object_name || obj.name || obj,
                projectKey: projectKey
              }))
            );
          }
        });
      }

      console.log("Processed page objects:", allPageObjects);
      setPageObjects(allPageObjects);
    } catch (err) {
      console.error("Error fetching page objects:", err);
      setError("Failed to load page objects");
      setPageObjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove .json extension from display name
  const formatDisplayName = (name) => {
    if (!name) return "";
    return name.replace(/\.json$/i, "");
  };

  // Filter page objects based on search term
  const filteredPageObjects = pageObjects.filter(obj => 
    formatDisplayName(obj.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle selection of a page object
  const toggleSelection = (pageObject) => {
    const isSelected = selectedPageObjects.some(selected => 
      selected.id === pageObject.id || selected.name === pageObject.name
    );

    let newSelection;
    if (isSelected) {
      newSelection = selectedPageObjects.filter(selected => 
        selected.id !== pageObject.id && selected.name !== pageObject.name
      );
    } else {
      newSelection = [...selectedPageObjects, pageObject];
    }

    onSelectionChange(newSelection);
  };

  // Check if a page object is selected
  const isSelected = (pageObject) => {
    return selectedPageObjects.some(selected => 
      selected.id === pageObject.id || selected.name === pageObject.name
    );
  };

  // Refresh page objects (to be called from parent after adding new ones)
  const refreshPageObjects = () => {
    fetchPageObjects();
  };

  // Expose refresh method to parent
  useEffect(() => {
    if (window.pageObjectDropdownRef) {
      window.pageObjectDropdownRef.refresh = refreshPageObjects;
    }
  }, []);

  return (
    <div className="w-full">
      {/* Label and Add Button */}
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-700">
          Select Page Object Name:
        </label>
        <button
          type="button"
          onClick={onAddClick}
          className="p-1 text-[#0057e7] hover:bg-[#0057e7]/10 rounded transition-colors"
          title="Add new page object"
          disabled={disabled || !projectId}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || !projectId || isLoading}
          className={`w-full px-3 py-2 text-left text-sm border rounded-md flex items-center justify-between ${
            disabled || !projectId || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
              : "bg-white border-gray-300 hover:border-gray-400"
          }`}
        >
          <span className="truncate">
            {!projectId ? (
              "No project selected"
            ) : isLoading ? (
              "Loading page objects..."
            ) : selectedPageObjects.length > 0 ? (
              `${selectedPageObjects.length} page object${selectedPageObjects.length > 1 ? 's' : ''} selected`
            ) : (
              "Select page objects"
            )}
          </span>
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && !disabled && projectId && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search page objects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0057e7] focus:border-[#0057e7]"
                  onClick={(e) => e.stopPropagation()}
                />
                <svg
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Page Objects List */}
            <div className="overflow-y-auto max-h-48">
              {error ? (
                <div className="p-3 text-sm text-red-500">{error}</div>
              ) : filteredPageObjects.length > 0 ? (
                filteredPageObjects.map((pageObject) => (
                  <button
                    key={pageObject.id || pageObject.name}
                    type="button"
                    onClick={() => toggleSelection(pageObject)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected(pageObject)}
                      onChange={() => {}}
                      className="mr-2 h-4 w-4 text-[#0057e7] border-gray-300 rounded focus:ring-[#0057e7]"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="truncate">{formatDisplayName(pageObject.name)}</span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-sm text-gray-500">
                  {searchTerm ? "No page objects found" : "No page objects available"}
                </div>
              )}
            </div>

            {/* Selected Items Summary */}
            {selectedPageObjects.length > 0 && (
              <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
                Selected: {selectedPageObjects.map(obj => formatDisplayName(obj.name)).join(", ")}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Debug info - remove in production */}
      {!projectId && (
        <p className="text-xs text-red-500 mt-1">No project ID available</p>
      )}
    </div>
  );
}

// ******************************************************************************************************************************

// Integration code for UserPromptForm.js

// 1. Import the PageObjectDropdown component
import PageObjectDropdown from "./PageObjectDropdown";

// 2. Add state for selected page objects and project data
const [selectedPageObjects, setSelectedPageObjects] = useState([]);
const [showAddPageObjectModal, setShowAddPageObjectModal] = useState(false);
const [currentProjectId, setCurrentProjectId] = useState(null);

// 3. Fetch project ID based on selected user stories
useEffect(() => {
  const fetchProjectId = async () => {
    // For regenerate mode - extract from test cases if needed
    if (isRegenerateMode && selectedTestCases.length > 0) {
      // You might need to adjust this based on your data structure
      // For now, we'll focus on the generate mode
      return;
    }
    
    // For generate mode - extract from user stories
    if (!isRegenerateMode && selectedUserStories.length > 0) {
      try {
        // Extract the release ID from the first user story
        const firstStory = selectedUserStories[0];
        
        // Parse the user story ID to get the release ID
        // Assuming format: "us-releaseId-storyId"
        const idParts = firstStory.id.split('-');
        if (idParts.length >= 2) {
          const releaseId = idParts[1];
          
          // Fetch the project data to get the project ID
          const response = await fetch('/api/projects-with-releases', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'x-user-email': user?.email,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            
            // Find the project that contains this release
            for (const project of data.projects || []) {
              const hasRelease = project.releases?.some(
                release => release.release_id.toString() === releaseId
              );
              
              if (hasRelease) {
                console.log("Found project ID:", project.project_id);
                setCurrentProjectId(project.project_id.toString());
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching project ID:", error);
      }
    }
  };
  
  if (accessToken && user?.email) {
    fetchProjectId();
  }
}, [selectedUserStories, selectedTestCases, isRegenerateMode, accessToken, user?.email]);

// 4. Add the dropdown in your form (after the prompt field)
<div className="mb-4">
  <PageObjectDropdown
    projectId={currentProjectId}
    selectedPageObjects={selectedPageObjects}
    onSelectionChange={setSelectedPageObjects}
    accessToken={accessToken}
    userEmail={user?.email}
    disabled={(!isRegenerateMode && !hasSelectedStories) || (isRegenerateMode && !hasSelectedTestCases) || isGenerating || !currentProjectId}
    onAddClick={() => setShowAddPageObjectModal(true)}
  />
</div>

// 5. Update your generate test cases function to include page objects
const handleGenerateTestCases = async () => {
  // ... existing validation code ...
  
  try {
    loader.showLoader();
    let hasSuccessfulGeneration = false;
    let successCount = 0;
    let errorCount = 0;
    
    if (isRegenerateMode) {
      // Regenerate mode logic
      for (const testCaseId of itemIds) {
        try {
          const response = await fetch(`/api/regenerate-test-case/${testCaseId}/${llmModelId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-email": user?.email,
              "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              userPrompt: promptText.trim() || "",
              pageObjects: selectedPageObjects.map(po => po.name) // Include page objects
            }),
          });
          
          // ... rest of regenerate logic
        } catch (error) {
          // ... error handling
        }
      }
    } else {
      // Generate mode logic
      for (const userStoryId of itemIds) {
        try {
          const response = await fetch(`/api/generate-test-cases/${userStoryId}/${llmModelId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-email": user?.email,
              "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              userPrompt: promptText.trim() || "",
              pageObjects: selectedPageObjects.map(po => po.name) // Include page objects
            }),
          });
          
          // ... rest of generate logic
        } catch (error) {
          // ... error handling
        }
      }
    }
    
    // ... rest of the function
  } catch (err) {
    // ... error handling
  } finally {
    loader.hideLoader();
    setIsGenerating(false);
  }
};