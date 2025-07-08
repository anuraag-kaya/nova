        {/* Timestamp display - ADD THIS SECTION */}
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
      </div>





      *******************************