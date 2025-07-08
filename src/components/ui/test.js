// In studio/page.js, update your handleRefresh function:

const handleRefresh = async () => {
  // Check if we're on either test case or user story view
  if ((activeView !== 'testCase' && activeView !== 'userStory') || !accessToken) {
    console.log('Cannot refresh: not on appropriate view or missing data');
    return;
  }

  setIsRefreshing(true);

  try {
    let projectKey = '';
    let fixVersionName = '';

    // Handle based on active view
    if (activeView === 'testCase' && selectedUserStory) {
      // TEST CASE VIEW - Extract from user story
      const userStoryIdParts = selectedUserStory.id.split('-');
      const releaseId = userStoryIdParts[1];

      // Find the release and project from projectsData
      for (const project of projectsData) {
        if (project.releases) {
          const release = project.releases.find(r => 
            r.release_id.toString() === releaseId
          );
          if (release) {
            projectKey = project.project_key || project.project_name || 'NAM-KM';
            fixVersionName = release.version || release.name || 'NAM 2025 R02 02/11-02/17';
            break;
          }
        }
      }
    } else if (activeView === 'userStory' && selectedRelease) {
      // USER STORY VIEW - Extract from release
      const releaseId = selectedRelease.id.replace('rel-', '');
      
      // Find the project that contains this release
      for (const project of projectsData) {
        if (project.releases) {
          const release = project.releases.find(r => 
            r.release_id.toString() === releaseId
          );
          if (release) {
            projectKey = project.project_key || project.project_name || 'NAM-KM';
            fixVersionName = release.version || release.name || 'NAM 2025 R02 02/11-02/17';
            break;
          }
        }
      }
    }

    if (!projectKey || !fixVersionName) {
      console.warn('Could not find project/release info, using defaults');
      projectKey = 'NAM-KM';
      fixVersionName = 'NAM 2025 R02 02/11-02/17';
    }

    console.log('Sync API parameters:', { projectKey, fixVersionName, activeView });

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
      console.log('Sync successful!');
      
      // Refresh the appropriate table based on view
      if (activeView === 'testCase') {
        // Refresh test cases table
        triggerTestCasesRefresh();
      } else if (activeView === 'userStory') {
        // Refresh user stories table
        setUserStoriesRefreshTrigger(prev => prev + 1);
      }
      
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
          message: `Jira and Zephyr data synced successfully for ${fixVersionName}. ${
            activeView === 'testCase' ? 'Test cases' : 'User stories'
          } refreshed.`,
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