const [sourceFiles, setSourceFiles] = useState([]); // Array to hold 1-3 source files
const [targetFile, setTargetFile] = useState(null);
const [mappingFile, setMappingFile] = useState(null);
const [selectedLLM, setSelectedLLM] = useState('');
const [llmModels, setLlmModels] = useState([]);

************

// Add this after your state definitions
useEffect(() => {
  // Fetch LLM models from your API
  const fetchLLMModels = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/llm-models');
      const data = await response.json();
      setLlmModels(data);
    } catch (error) {
      console.error('Error fetching LLM models:', error);
      // Fallback models for testing
      setLlmModels([
        { id: '1', name: 'GPT-4' },
        { id: '2', name: 'GPT-3.5 Turbo' },
        { id: '3', name: 'Claude 2' },
        { id: '4', name: 'PaLM 2' }
      ]);
    }
  };
  
  fetchLLMModels();
}, []);


***************

const handleGenerateCode = async () => {
  // Validate all required fields
  if (!sourceFiles[0] || !targetFile || !mappingFile || !selectedLLM) {
    alert('Please fill all required fields');
    return;
  }
  
  setLoading(true);
  
  try {
    // Create FormData to send files
    const formData = new FormData();
    
    // Add source files (can be 1-3 files)
    sourceFiles.forEach((file, index) => {
      if (file) {
        formData.append(`sourceFile${index}`, file);
      }
    });
    
    // Add other files
    formData.append('targetFile', targetFile);
    formData.append('mappingFile', mappingFile);
    formData.append('llmModel', selectedLLM);
    formData.append('instructions', promptText);
    
    // Make API call to generate code
    const response = await fetch('/api/generate-cobol', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    setGeneratedCode(data.code);
    
  } catch (error) {
    console.error('Error generating code:', error);
    alert('Error generating code. Please try again.');
  } finally {
    setLoading(false);
  }
};

***************