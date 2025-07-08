// 1. Import statements you'll need
import { useState, useEffect, useMemo } from "react";

// 2. Inside your component, add these state variables
const [searchQuery, setSearchQuery] = useState("");
const [testData, setTestData] = useState([]); // Your tree data
const [expandedItems, setExpandedItems] = useState(new Set());

// 3. The complete search bar JSX component
const SearchBar = () => (
  <div className="p-2 flex-shrink-0">
    <input
      type="text"
      placeholder="Search test cases..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full p-2 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-[#0057e7] bg-gray-100 text-gray-900 border-gray-300"
    />
  </div>
);

// 4. The complete filtering function
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

// 5. Memoize filtered data
const filteredData = useMemo(() => 
  filterTestData(testData, searchQuery), 
  [testData, searchQuery]
);

// 6. Helper function to get all IDs for expansion
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

// 7. Auto-expand all items when searching
useEffect(() => {
  if (searchQuery) {
    // Always expand all items when searching
    const allItemIds = getAllItemIds(filteredData);
    setExpandedItems(new Set(allItemIds));
  }
}, [searchQuery, filteredData]);

// 8. Function to highlight search text in results
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

// 9. Example usage in your render method
return (
  <div className="h-full w-full overflow-hidden bg-white">
    <div className="h-full overflow-hidden flex flex-col">
      {/* Search Bar */}
      <SearchBar />
      
      {/* Results */}
      <div className="overflow-y-auto overflow-x-hidden flex-grow">
        {searchQuery && filteredData.length === 0 ? (
          <div className="px-2 py-1 text-[13px] text-gray-500">
            No results found for "{searchQuery}"
          </div>
        ) : filteredData.length === 0 ? (
          <div className="px-2 py-1 text-[13px] text-gray-500">
            No test cases available
          </div>
        ) : (
          <div className="py-1">
            {filteredData.map(node => (
              <div key={node.id} className="p-2">
                {/* Use highlightText when rendering node names */}
                <span>{highlightText(node.name, searchQuery)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

// 10. Example tree data structure for testing
const exampleTestData = [
  {
    id: 'proj-1',
    name: 'Project Alpha',
    children: [
      {
        id: 'rel-1',
        name: 'Release 1.0',
        children: [
          {
            id: 'us-1',
            name: 'User Story Login',
            children: []
          },
          {
            id: 'us-2',
            name: 'User Story Dashboard',
            children: []
          }
        ]
      }
    ]
  },
  {
    id: 'proj-2',
    name: 'Project Beta',
    children: [
      {
        id: 'rel-2',
        name: 'Release 2.0',
        children: [
          {
            id: 'us-3',
            name: 'User Story Reports',
            children: []
          }
        ]
      }
    ]
  }
];