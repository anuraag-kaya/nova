// Fetch page objects
useEffect(() => {
  const fetchPageObjects = async () => {
    const hasStories = Array.isArray(selectedUserStories) && selectedUserStories.length > 0;
    
    if (!isRegenerateMode && hasStories && projectsData && projectsData.length > 0) {
      setIsLoadingPageObjects(true);
      setApiError(null);
      
      // Extract project_id from projectsData
      // Get the first project's ID as default, or you can implement logic to get the specific project
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