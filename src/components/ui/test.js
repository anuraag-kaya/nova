// OPTION 1: With a refresh icon (clock icon)
{lastRefreshTime && (
  <div className="flex items-center text-xs text-gray-500">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-3.5 w-3.5 mr-1 text-gray-400" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
    <span className="text-gray-600">Last synced: </span>
    <span className="ml-1 font-medium text-gray-700">{lastRefreshTime}</span>
  </div>
)}

// OPTION 2: With a sync/refresh icon
{lastRefreshTime && (
  <div className="flex items-center text-xs text-gray-500">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-3.5 w-3.5 mr-1 text-gray-400" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15" 
      />
    </svg>
    <span>Synced {lastRefreshTime}</span>
  </div>
)}

// OPTION 3: Minimal with subtle background
{lastRefreshTime && (
  <div className="flex items-center text-xs bg-gray-50 px-2 py-1 rounded-md">
    <span className="text-gray-500">Synced</span>
    <span className="ml-1 text-gray-700 font-medium">{lastRefreshTime}</span>
  </div>
)}

// OPTION 4: With a badge style
{lastRefreshTime && (
  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
    <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    Synced {lastRefreshTime}
  </div>
)}

// OPTION 5: Super minimal
{lastRefreshTime && (
  <span className="text-xs text-gray-400">
    Updated {lastRefreshTime}
  </span>
)}