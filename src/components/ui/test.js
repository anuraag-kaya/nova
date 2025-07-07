<div className="relative">
<button
  className={`${
    (activeView === 'userStory' || activeView === 'testCase') && !isRefreshing
      ? 'bg-[#0057e7] text-white hover:bg-[#0046b8] cursor-pointer'
      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
  } px-3 py-1.5 rounded text-xs font-medium transition-colors`}
  disabled={!(activeView === 'userStory' || activeView === 'testCase') || isRefreshing}
  onClick={() => {
    if (onRefresh && (activeView === 'userStory' || activeView === 'testCase')) {
      onRefresh();
    }
  }}
>
  {isRefreshing ? (
    <>
      <span className="animate-spin inline-block">⟳</span> Refreshing...
    </>
  ) : (
    <>
      <span>🔄</span> Refresh
    </>
  )}
</button>

{/* Timestamp display */}
{lastRefreshTime && !isRefreshing && (
  <div className="absolute top-full left-0 mt-1 text-xs text-gray-500 whitespace-nowrap">
    Last refreshed: {lastRefreshTime}
  </div>
)}
</div>