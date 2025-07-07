// In studio/page.js, add this function after your other handler functions:

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
      projectKey = foundProject.project_name || 'NAM-KM'; // Use project name or default
      fixVersionName = foundRelease.version || 'NAM 2025 R02 02/11-02/17'; // Use version or default
    } else {
      console.warn('Could not find project/release info, using defaults');
      projectKey = 'NAM-KM';
      fixVersionName = 'NAM 2025 R02 02/11-02/17';
    }

    console.log('Calling sync API with:', { projectKey, fixVersionName });

    // Call the sync API
    const response = await fetch(
      `http://127.0.0.1:8000/sync/sync_jira_and_zephyr_release?fix_version_name=${encodeURIComponent(fixVersionName)}&project_key=${encodeURIComponent(projectKey)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to sync');
    }

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
      
      // Show success notification
      if (addNotification) {
        addNotification({
          title: "Sync Successful",
          message: "Jira and Zephyr data synced successfully. Test cases refreshed.",
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