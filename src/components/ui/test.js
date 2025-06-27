"use client";
import { useState, useEffect, useMemo } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
 
export default function TestTree({ 
  onSelectUserStory, 
  onSelectRelease, 
  onSelectProject, 
  onProjectsDataLoad, 
  searchQuery = "",
  selectedNode = null
}) {
  const [testData, setTestData] = useState([]);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [accessToken, setAccessToken] = useState(null);
  const { user } = useUser();
  
  // ADD THESE NEW STATE VARIABLES
  const [viewMode, setViewMode] = useState('testCases'); // 'testCases' or 'codeBuilder'
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Function to fetch access token
    const fetchAccessToken = async () => {
      try {
        const res = await fetch("/api/auth/token");
        const data = await res.json();

        if (res.ok) {
          setAccessToken(data.accessToken);
        } else {
          console.error("Error fetching token:", data.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    // Fetch project data with the access token
    if (!accessToken) return;
    
    fetch(`/api/projects-with-releases`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "x-user-email": user?.email,
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.projects) {
          // Ensure valid data structure and unique IDs
          const formattedData = data.projects.map((project) => ({
            id: `proj-${project.project_id}`,
            name: project.project_name,
            children: project.releases ? project.releases.map((release) => ({
              id: `rel-${release.release_id}`,
              name: `${release.version}`,
              children: release.user_stories ? release.user_stories.map((story) => ({
                id: `us-${release.release_id}-${story.user_story_id}`, // Unique ID
                name: story.user_story_title,
              })) : [],
            })) : [],
          }));

          setTestData(formattedData);
  
          // Pass the original data to the parent component for context panel
          if (onProjectsDataLoad) {
            onProjectsDataLoad(data.projects);
          }

          // Expand all projects by default
          setExpandedItems(new Set(getAllItemIds(formattedData)));
        }
      })
      .catch((error) => console.error("Error loading project data:", error));
  }, [accessToken]);

  // Add this useEffect to auto-expand parents of selected node
  useEffect(() => {
    if (selectedNode && selectedNode.id && testData.length > 0) {
      const nodePath = findNodePath(testData, selectedNode.id);
      
      if (nodePath) {
        // Expand all nodes in the path to the selected node
        setExpandedItems(prev => {
          const newSet = new Set(prev);
          nodePath.forEach(id => newSet.add(id));
          return newSet;
        });
      }
    }
  }, [selectedNode, testData]);

  // ADD THIS useEffect to handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper function to find a node and its path in the tree
  const findNodePath = (nodes, targetId, currentPath = []) => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const newPath = [...currentPath, node.id];
      
      if (node.id === targetId) {
        return newPath;
      }
      
      if (node.children && node.children.length > 0) {
        const foundPath = findNodePath(node.children, targetId, newPath);
        if (foundPath) {
          return foundPath;
        }
      }
    }
    
    return null;
  };

  // Advanced search function with hierarchical tree preservation
  const filterTestData = (data, query) => {
    if (!query) return data; // Return full data if query is empty

    const lowerCaseQuery = query.toLowerCase().trim();
    
    // First identify all matches by their IDs
    const matchingIds = new Set();
    const parentMap = new Map(); // Map to store child->parent relationships
    
    // Function to check if a node matches and collect its ID and parent relationships
    const collectMatches = (node, parentId = null) => {
      // Store parent relationship
      if (parentId) {
        parentMap.set(node.id, parentId);
      }
      
      // Check if current node matches
      const nodeMatches = node.name.toLowerCase().includes(lowerCaseQuery);
      if (nodeMatches) {
        matchingIds.add(node.id);
      }
      
      // Process children
      if (node.children) {
        node.children.forEach(child => {
          collectMatches(child, node.id);
        });
      }
      
      return nodeMatches;
    };
    
    // First pass: collect all matching nodes and build parent relationships
    data.forEach(node => collectMatches(node));
    
    // Add all ancestors of matching nodes to the matching set
    const addAncestors = (id) => {
      const parentId = parentMap.get(id);
      if (parentId) {
        matchingIds.add(parentId);
        addAncestors(parentId);
      }
    };
    
    // Add ancestors for all matching nodes
    Array.from(matchingIds).forEach(id => {
      addAncestors(id);
    });
    
    // Function to create a filtered tree structure
    const filterTreeByIds = (node) => {
      // If this node isn't in our matching set, filter it out
      if (!matchingIds.has(node.id)) {
        return null;
      }
      
      // Include this node, but filter its children
      const filteredNode = { ...node };
      
      if (node.children) {
        const filteredChildren = node.children
          .map(filterTreeByIds)
          .filter(Boolean); // Remove null entries
        
        filteredNode.children = filteredChildren;
      }
      
      return filteredNode;
    };
    
    // Final filtered tree
    const filteredData = data
      .map(filterTreeByIds)
      .filter(Boolean); // Remove null entries
    
    return filteredData;
  };

  // Memoize filtered data to avoid recalculating on every render
  const filteredData = useMemo(() => 
    filterTestData(testData, searchQuery), 
    [testData, searchQuery]
  );

  // Update expandedItems dynamically based on search query
  useEffect(() => {
    if (searchQuery) {
      // Always expand all items when searching
      const allItemIds = getAllItemIds(filteredData);
      setExpandedItems(new Set(allItemIds));
    }
  }, [searchQuery, filteredData]);
 
  // Helper function to get all IDs for expansion
  function getAllItemIds(nodes) {
    let ids = [];
    const collectIds = (items) => {
      if (!Array.isArray(items)) return; // Ensure items is an array
      items.forEach(item => {
        ids.push(item.id);
        if (item.children && item.children.length > 0) {
          collectIds(item.children);
        }
      });
    };
    collectIds(nodes);
    return ids;
  }

  // Function to handle expand/collapse caret clicks
  const handleCaretClick = (e, itemId) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the node
    
    setExpandedItems((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId); // Collapse if already expanded
      } else {
        newExpanded.add(itemId); // Expand if collapsed
      }
      return newExpanded;
    });
  };

  // Highlight text with search term
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    try {
      const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      
      return (
        <>
          {parts.map((part, index) => 
            part.toLowerCase() === searchTerm.toLowerCase() 
              ? <span key={index} className="bg-yellow-200 text-gray-900 font-semibold">{part}</span> 
              : <span key={index}>{part}</span>
          )}
        </>
      );
    } catch (e) {
      return text;
    }
  };

  // VSCode-style TreeItem component (Light Theme)
  const VSCodeTreeItem = ({ node, level }) => {
    const isProject = node.id.startsWith('proj-');
    const isRelease = node.id.startsWith('rel-');
    const isUserStory = node.id.startsWith('us-');
    
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedItems.has(node.id);
    
    // Add a check to see if this node is the selected one
    const isSelected = selectedNode && node.id === selectedNode.id;
    
    // Determine icon based on node type
    let icon = '📁'; // Default for projects
    if (isRelease) icon = '📄';
    if (isUserStory) icon = '📌';
    
    // Determine node type for title
    let itemType = 'Project';
    if (isRelease) itemType = 'Release';
    if (isUserStory) itemType = 'User Story';
    
    // Handle node selection (not expanding)
    const handleNodeClick = () => {
      window.scrollTo(0, 0);
      if (isProject && onSelectProject) {
        onSelectProject(node);
      } else if (isRelease && onSelectRelease) {
        onSelectRelease(node);
      } else if (isUserStory && onSelectUserStory) {
        onSelectUserStory(node);
      }
    };
    
    // Calculate text content to display
    const displayText = `${node.name}`;
    
    // Determine correct indentation - VSCode style uses 8px per level + 8px for arrow
    const indentation = (level * 8) + 8;

    return (
      <>
        <div 
          className={`flex items-center h-[22px] ${
            isSelected 
              ? 'bg-[#e8f0fe] text-[#0057e7]' // Highlight color when selected
              : 'hover:bg-gray-100'
          } relative group transition-colors duration-200`}
          style={{ paddingLeft: `${indentation}px` }}
        >
          {/* VSCode-style chevron */}
          <div 
            className={`flex items-center justify-center w-[16px] h-[22px] flex-shrink-0 cursor-pointer ${!hasChildren ? 'opacity-0' : ''}`}
            onClick={(e) => hasChildren && handleCaretClick(e, node.id)}
          >
            <svg 
              className={`h-[16px] w-[16px] transform transition-transform duration-100 ease-in-out ${
                isSelected ? 'text-[#0057e7]' : 'text-gray-600'} 
                ${isExpanded ? 'rotate-90' : ''}`}
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M10.072 8.024L5.715 3.667l.618-.62L11 8.026l-4.678 4.678-.618-.62 4.368-4.357z" />
            </svg>
          </div>
          
          {/* Icon + Text, taking all remaining width */}
          <div 
            className="flex items-center flex-grow truncate cursor-pointer pl-[6px] h-full"
            onClick={handleNodeClick}
            title={`${itemType}: ${node.name}`}
          >
            <span className={`text-[14px] ${
              isSelected 
                ? "font-medium text-[#0057e7]" // Change text color when selected
                : isProject 
                  ? "font-medium text-gray-900" 
                  : "text-gray-800"
            }`}>
              <span className="mr-[6px]">{icon}</span>
              <span className="truncate">{highlightText(displayText, searchQuery)}</span>
            </span>
          </div>
        </div>
        
        {/* Render children if expanded */}
        {isExpanded && node.children && node.children.length > 0 && (
          <>
            {node.children.map(childNode => (
              <VSCodeTreeItem 
                key={childNode.id} 
                node={childNode} 
                level={level + 1} 
              />
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <div className="h-full w-full overflow-hidden bg-white">
      <div className="h-full overflow-hidden flex flex-col">
        {/* UPDATED HEADER WITH DROPDOWN */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between text-[14px] uppercase font-semibold text-gray-700 tracking-wide p-2 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center">
              {viewMode === 'testCases' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Test Cases
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Code Builder
                </>
              )}
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-md shadow-lg z-20">
              <button
                onClick={() => {
                  setViewMode('testCases');
                  setShowDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center ${
                  viewMode === 'testCases' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Test Cases
              </button>
              <button
                onClick={() => {
                  setViewMode('codeBuilder');
                  setShowDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center ${
                  viewMode === 'codeBuilder' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Code Builder
              </button>
            </div>
          )}
        </div>
        
        {/* UPDATED CONTENT AREA */}
        <div className="overflow-y-auto overflow-x-hidden flex-grow">
          {viewMode === 'testCases' ? (
            // Test Cases View (existing tree)
            searchQuery && filteredData.length === 0 ? (
              <div className="px-2 py-1 text-[13px] text-gray-500">No results found for "{searchQuery}"</div>
            ) : filteredData.length === 0 ? (
              <div className="px-2 py-1 text-[13px] text-gray-500">No test cases available</div>
            ) : (
              <div className="py-1">
                {filteredData.map(node => (
                  <VSCodeTreeItem 
                    key={node.id} 
                    node={node} 
                    level={0} 
                  />
                ))}
              </div>
            )
          ) : (
            // Code Builder View (placeholder for recent chats)
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-4">Recent Chats</div>
              <div className="space-y-2">
                {/* Placeholder items - replace with actual recent chats later */}
                <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                  <div className="font-medium text-sm">Chat Session 1</div>
                  <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                  <div className="font-medium text-sm">Chat Session 2</div>
                  <div className="text-xs text-gray-500 mt-1">Yesterday</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                  <div className="font-medium text-sm">Chat Session 3</div>
                  <div className="text-xs text-gray-500 mt-1">2 days ago</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View All Chats
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}