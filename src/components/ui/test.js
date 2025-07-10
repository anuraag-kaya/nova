// Fetch page objects
useEffect(() => {
  const fetchPageObjects = async () => {
    const hasStories = Array.isArray(selectedUserStories) && selectedUserStories.length > 0;
    
    if (!isRegenerateMode && hasStories) {
      setIsLoadingPageObjects(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/get-page-objects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.page_objects && Array.isArray(data.page_objects)) {
            const formattedPageObjects = data.page_objects.map((item, index) => ({
              id: index,
              filename: item.replace('.json', ''),
              fullName: item
            }));
            setPageObjects(formattedPageObjects);
          }
        } else {
          console.error("Failed to fetch page objects:", response.status);
        }
      } catch (error) {
        console.error("Error fetching page objects:", error);
      } finally {
        setIsLoadingPageObjects(false);
      }
    }
  };

  fetchPageObjects();
}, [isRegenerateMode, selectedUserStories]);






disabled={(!isRegenerateMode && (!selectedUserStories || selectedUserStories.length === 0)) || (isRegenerateMode && !hasSelectedTestCases) || isGenerating}
className={`w-full p-2 border rounded text-sm text-left flex justify-between items-center ${
  (!isRegenerateMode && (!selectedUserStories || selectedUserStories.length === 0)) || (isRegenerateMode && !hasSelectedTestCases) || isGenerating
    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300' 
    : 'border-gray-300 hover:border-gray-400'
}`}