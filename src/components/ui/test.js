// app/api/get-page-object/route.js
const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(request) {
  const headers = request.headers;
  const authHeader = headers.get("authorization");
  
  // Get project_id from query parameters
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("project_id");

  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      { status: 400 }
    );
  }

  if (!projectId) {
    return new Response(
      JSON.stringify({ error: "Missing project_id parameter" }),
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/get-page-object?project_id=${projectId}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Bad response from FastAPI" }),
        { status: response.status }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching page objects:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch page objects." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ***************************************************************************************************************************************

// app/api/add-page-object/route.js
const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request) {
  const headers = request.headers;
  const authHeader = headers.get("authorization");

  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      { status: 400 }
    );
  }

  try {
    // Parse the request body
    const body = await request.json();
    const { project_id, project_key, page_object_files } = body;

    // Validate required fields
    if (!project_id || !project_key || !page_object_files || !Array.isArray(page_object_files)) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: project_id, project_key, or page_object_files" 
        }),
        { status: 400 }
      );
    }

    // Make the API call to add page objects
    const response = await fetch(
      `${API_BASE_URL}/add-page-object`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id,
          project_key,
          page_object_files
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: "Failed to add page objects", details: errorText }),
        { status: response.status }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error adding page objects:", error);
    return new Response(
      JSON.stringify({ error: "Failed to add page objects.", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ***************************************************************************************************************************************

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
    if (!projectId || !accessToken) return;

    setIsLoading(true);
    setError(null);

    try {
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
            {isLoading ? (
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
    </div>
  );
}

// ***************************************************************************************************************************************


// Add these to your UserPromptForm.js

// 1. Import the PageObjectDropdown component
import PageObjectDropdown from "./PageObjectDropdown";

// 2. Add state for selected page objects
const [selectedPageObjects, setSelectedPageObjects] = useState([]);
const [showAddPageObjectModal, setShowAddPageObjectModal] = useState(false);

// 3. Get project ID from context (adjust based on your app structure)
const getProjectId = () => {
  // If in regenerate mode, get from test cases
  if (isRegenerateMode && selectedTestCases.length > 0) {
    // Extract project ID from test case context
    // This depends on your data structure
    return selectedTestCases[0].projectId || null;
  }
  
  // If in generate mode, get from user stories
  if (!isRegenerateMode && selectedUserStories.length > 0) {
    // Extract project ID from user story
    const storyId = selectedUserStories[0].id;
    // Assuming ID format is "us-releaseId-storyId"
    // You might need to fetch the project ID from the release
    return selectedUserStories[0].projectId || null;
  }
  
  return null;
};

const projectId = getProjectId();

// 4. Add the dropdown in your form (after the prompt field)
<div className="mb-4">
  <PageObjectDropdown
    projectId={projectId}
    selectedPageObjects={selectedPageObjects}
    onSelectionChange={setSelectedPageObjects}
    accessToken={accessToken}
    userEmail={user?.email}
    disabled={(!isRegenerateMode && !hasSelectedStories) || (isRegenerateMode && !hasSelectedTestCases) || isGenerating}
    onAddClick={() => setShowAddPageObjectModal(true)}
  />
</div>

// 5. Include selected page objects in your API call
const handleGenerateTestCases = async () => {
  // ... existing code ...
  
  // Add page objects to the request body
  const requestBody = {
    userPrompt: promptText.trim() || "",
    pageObjects: selectedPageObjects.map(po => po.name) // Send page object names
  };
  
  // ... rest of your API call with the updated body
};