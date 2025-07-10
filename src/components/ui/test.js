// Updated integration code for UserPromptForm.js

// 1. Import the PageObjectDropdown component
import PageObjectDropdown from "./PageObjectDropdown";

// 2. Add state for page objects and projects data
const [selectedPageObjects, setSelectedPageObjects] = useState([]);
const [showAddPageObjectModal, setShowAddPageObjectModal] = useState(false);
const [currentProjectId, setCurrentProjectId] = useState(null);
const [projectsData, setProjectsData] = useState([]);

// 3. Fetch projects data (similar to TestTree)
useEffect(() => {
  const fetchProjectsData = async () => {
    if (!accessToken || !user?.email) return;
    
    try {
      const response = await fetch("/api/projects-with-releases", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-user-email": user?.email,
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.projects) {
          setProjectsData(data.projects);
          console.log("Projects data loaded:", data.projects);
        }
      }
    } catch (error) {
      console.error("Error fetching projects data:", error);
    }
  };
  
  fetchProjectsData();
}, [accessToken, user?.email]);

// 4. Extract project ID when user stories are selected
useEffect(() => {
  if (!projectsData.length) return;
  
  // For generate mode with selected user stories
  if (!isRegenerateMode && selectedUserStories && selectedUserStories.length > 0) {
    const firstStory = selectedUserStories[0];
    console.log("Selected user story:", firstStory);
    
    // Parse the user story ID to get the release ID
    // Format: "us-releaseId-userStoryId"
    const idParts = firstStory.id.split('-');
    if (idParts.length >= 3) {
      const releaseId = idParts[1];
      
      // Find the project that contains this release
      for (const project of projectsData) {
        const hasRelease = project.releases?.some(
          release => release.release_id.toString() === releaseId
        );
        
        if (hasRelease) {
          console.log("Found project for user story:", project.project_id, project.project_name);
          setCurrentProjectId(project.project_id.toString());
          break;
        }
      }
    }
  }
  
  // For regenerate mode with selected test cases
  if (isRegenerateMode && selectedTestCases && selectedTestCases.length > 0) {
    // You might need to add logic here to get project ID from test cases
    // For now, let's try to get it from the test case data structure
    const firstTestCase = selectedTestCases[0];
    
    // If test case has a project ID directly
    if (firstTestCase.projectId) {
      setCurrentProjectId(firstTestCase.projectId.toString());
    } else {
      // Otherwise, you might need to trace back through user story
      console.log("Test case data:", firstTestCase);
      // Add logic here based on your test case data structure
    }
  }
}, [selectedUserStories, selectedTestCases, isRegenerateMode, projectsData]);

// 5. Add the dropdown in your form (after the prompt field)
<div className="mb-4">
  <PageObjectDropdown
    projectId={currentProjectId}
    selectedPageObjects={selectedPageObjects}
    onSelectionChange={setSelectedPageObjects}
    accessToken={accessToken}
    userEmail={user?.email}
    disabled={(!isRegenerateMode && !hasSelectedStories) || (isRegenerateMode && !hasSelectedTestCases) || isGenerating || llmModels.length === 0}
    onAddClick={() => setShowAddPageObjectModal(true)}
  />
  
  {/* Debug info - remove in production */}
  {!currentProjectId && hasSelectedStories && (
    <p className="text-xs text-orange-500 mt-1">
      Loading project information...
    </p>
  )}
</div>

// 6. Include page objects in your generate function
const handleGenerateTestCases = async () => {
  // ... existing validation code ...
  
  const itemIds = isRegenerateMode 
    ? selectedTestCases.map(testCase => testCase.id)
    : selectedUserStories.map(story => {
        const parts = story.id.split("-");
        return parts[parts.length - 1];
      });
  
  const llmModelId = selectedLlmModelId;
  
  // ... existing notification code ...
  
  try {
    loader.showLoader();
    let hasSuccessfulGeneration = false;
    let successCount = 0;
    let errorCount = 0;
    let successItems = [];
    let errorItems = [];
    
    if (isRegenerateMode) {
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
              pageObjects: selectedPageObjects.map(po => po.name) // Include selected page objects
            }),
          });
          
          // ... rest of your existing code ...
        } catch (error) {
          // ... error handling ...
        }
      }
    } else {
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
              pageObjects: selectedPageObjects.map(po => po.name) // Include selected page objects
            }),
          });
          
          // ... rest of your existing code ...
        } catch (error) {
          // ... error handling ...
        }
      }
    }
    
    // ... rest of your existing code ...
  } catch (err) {
    // ... error handling ...
  } finally {
    loader.hideLoader();
    setIsGenerating(false);
  }
};