// In studio/page.js, here's the updated handleRefresh function:

const handleRefresh = async () => {
  // Only proceed if we're on test case view
  if (activeView !== 'testCase' || !selectedUserStory || !accessToken) {
    console.log('Cannot refresh: not on test case view or missing data');
    return;
  }

  setIsRefreshing(true);

  try {
    // Extract project key and version from the current context
    let projectKey = '';
    let fixVersionName = '';

    // Get release information from selectedUserStory
    // The ID format is usually "us-releaseId-userStoryId"
    const userStoryIdParts = selectedUserStory.id.split('-');
    const releaseId = userStoryIdParts[1];

    // Find the release and project from projectsData
    let foundRelease = null;
    let foundProject = null;

    for (const project of projectsData) {
      if (project.releases) {
        const release = project.releases.find(r => 
          r.release_id.toString() === releaseId
        );
        if (release) {
          foundRelease = release;
          foundProject = project;
          break;
        }
      }
    }

    if (foundProject && foundRelease) {
      // Use the actual project name/key from your data structure
      // Adjust these based on your actual data structure
      projectKey = foundProject.project_key || foundProject.project_name || 'NAM-KM';
      fixVersionName = foundRelease.version || foundRelease.name || 'NAM 2025 R02 02/11-02/17';
    } else {
      console.warn('Could not find project/release info, using defaults');
      projectKey = 'NAM-KM';
      fixVersionName = 'NAM 2025 R02 02/11-02/17';
    }

    console.log('Sync API parameters:', { projectKey, fixVersionName });

    // Build the URL with query parameters
    const baseUrl = 'http://127.0.0.1:8000/sync/sync_jira_and_zephyr_release';
    const params = new URLSearchParams({
      fix_version_name: fixVersionName,
      project_key: projectKey
    });
    
    const fullUrl = `${baseUrl}?${params.toString()}`;
    console.log('Calling sync API:', fullUrl);

    // Call the sync API
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    // Check if response is ok before parsing
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Sync API response:', data);

    // Check for success status
    if (data.sync_up_status === 'success') {
      // Success! Now refresh the test cases table
      console.log('Sync successful, refreshing test cases...');
      
      // Call the existing refresh function
      triggerTestCasesRefresh();
      
      // Update timestamp
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
      setLastRefreshTime(timeString);
      
      // Save to localStorage for persistence
      localStorage.setItem('lastTestCaseRefreshTime', timeString);
      
      // Show success notification
      if (addNotification) {
        addNotification({
          title: "Sync Successful",
          message: `Jira and Zephyr data synced successfully for ${fixVersionName}. Test cases refreshed.`,
          type: "success"
        });
      }
    } else {
      throw new Error('Sync returned non-success status');
    }

  } catch (error) {
    console.error('Refresh error:', error);
    
    // Show error notification
    if (addNotification) {
      addNotification({
        title: "Sync Failed",
        message: error.message || "Failed to sync Jira and Zephyr data",
        type: "error"
      });
    }
  } finally {
    setIsRefreshing(false);
  }
};