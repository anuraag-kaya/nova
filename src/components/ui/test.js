useEffect(() => {
  const loadPromptFile = async () => {
    try {
      const response = await fetch('/cobol_code_prompt.txt');
      if (response.ok) {
        const text = await response.text();
        setPromptText(text);
        setPromptLoaded(true);
        
        // Auto-resize textarea after content loads
        setTimeout(() => {
          const textarea = document.querySelector('textarea');
          if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
          }
        }, 100);
      } else {
        console.error('Failed to load prompt file');
        setPromptText('Failed to load default prompt. Please enter your instructions manually.');
      }
    } catch (error) {
      console.error('Error loading prompt file:', error);
      setPromptText('Error loading default prompt. Please enter your instructions manually.');
    }
  };

  loadPromptFile();
}, []);