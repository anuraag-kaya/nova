<div className="relative">
  <button
    onClick={() => setShowProjectDropdown(!showProjectDropdown)}
    className="w-full px-6 py-4 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0057e7] focus:ring-offset-2"
  >
    <span className="text-gray-900 font-medium">
      {selectedProjectKey ? `Project: ${selectedProjectKey}` : 'Select Project Key'}
    </span>
    <svg
      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showProjectDropdown ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {showProjectDropdown && (
    <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={projectSearchTerm}
            onChange={(e) => setProjectSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0057e7] focus:bg-white transition-all duration-200"
            autoFocus
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="max-h-64 overflow-y-auto">
        {isLoadingProjects ? (
          <div className="px-4 py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0057e7] mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading projects...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <button
              key={project.project_key}
              onClick={() => handleSelectProject(project.project_key)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#0057e7]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#0057e7] text-sm font-semibold">
                    {project.project_key.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{project.project_key}</p>
                  {project.project_name && (
                    <p className="text-xs text-gray-500">{project.project_name}</p>
                  )}
                </div>
              </div>
              {selectedProjectKey === project.project_key && (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#0057e7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-gray-500">
            {projectSearchTerm ? 'No projects found' : 'No projects available'}
          </div>
        )}
      </div>

      {/* Add New Project */}
      <div className="border-t border-gray-100 p-2">
        <button
          onClick={handleAddNewProject}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 flex items-center gap-3 group"
        >
          <div className="w-8 h-8 bg-[#0057e7] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-gray-900 font-medium">Add new project</span>
        </button>
      </div>
    </div>
  )}
</div>

// Add these state variables
const [showProjectDropdown, setShowProjectDropdown] = useState(false);
const [projectSearchTerm, setProjectSearchTerm] = useState('');
const [selectedProjectKey, setSelectedProjectKey] = useState('');
const [isLoadingProjects, setIsLoadingProjects] = useState(false);
const [projects, setProjects] = useState([]);

// Add ref for click outside handling
const projectDropdownRef = useRef(null);

// Filter projects based on search
const filteredProjects = projects.filter(project =>
  project.project_key.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
  (project.project_name && project.project_name.toLowerCase().includes(projectSearchTerm.toLowerCase()))
);

// Handle project selection
const handleSelectProject = (projectKey) => {
  setSelectedProjectKey(projectKey);
  setShowProjectDropdown(false);
  setProjectSearchTerm('');
  // You can add additional logic here to handle the selection
};

// Handle add new project
const handleAddNewProject = () => {
  setShowProjectDropdown(false);
  // Implement your add project logic here
  // You might want to open a modal or navigate to a form
};

// Add click outside handler
useEffect(() => {
  const handleClickOutside = (event) => {
    if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target)) {
      setShowProjectDropdown(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

// Fetch projects when dropdown opens
useEffect(() => {
  if (showProjectDropdown && projects.length === 0) {
    fetchProjects();
  }
}, [showProjectDropdown]);

// Fetch projects function (using your API)
const fetchProjects = async () => {
  setIsLoadingProjects(true);
  try {
    // Replace with your actual API call
    const response = await fetch('/api/get-page-objects', {
      method: 'GET',
      headers: {
        'x-user-soeid': 'your-user-id', // Add appropriate headers
      },
    });
    const data = await response.json();
    // Assuming the API returns projects in the format you need
    setProjects(data.page_objects || []);
  } catch (error) {
    console.error('Error fetching projects:', error);
  } finally {
    setIsLoadingProjects(false);
  }
};



<div ref={projectDropdownRef} className="relative">
  {/* The dropdown code goes here */}
</div>