export default function StockSentimentDetailLoading() {
  return (
    <div className="flex h-full bg-[#0a1017]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopBar Skeleton */}
        <div className="h-14 border-b border-[#222F44] flex items-center px-4 gap-3 bg-[#0a1017]">
          <div className="h-8 w-8 bg-slate-700/50 rounded animate-pulse" />
          <div className="h-4 w-32 bg-slate-700/40 rounded animate-pulse" />
        </div>

        <div className="flex-1 overflow-y-auto pb-28 lg:pb-0">
          <div className="px-6 py-4">
            {/* Header with Range Dropdown */}
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 w-48 bg-slate-700/50 rounded animate-pulse" />
              <div className="h-9 w-32 bg-slate-700/40 rounded animate-pulse" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Donut Chart Skeleton */}
              <div className="bg-[#0a1017] border border-[#333333] rounded-xl p-5 flex flex-col animate-pulse">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="h-5 w-40 bg-slate-700/40 rounded" />
                  <div className="h-6 w-24 bg-slate-700/30 rounded-full" />
                </div>

                {/* Donut circle */}
                <div className="flex justify-center items-center mb-5 flex-1">
                  <div className="w-40 h-40 bg-slate-700/20 rounded-full" />
                </div>

                {/* Legend */}
                <div className="space-y-2.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-700/40 rounded-full" />
                        <div className="h-3 w-16 bg-slate-700/30 rounded" />
                      </div>
                      <div className="h-3 w-12 bg-slate-700/30 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Score Cards Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#0a1017] border border-[#333333] rounded-xl p-4 flex flex-col justify-between animate-pulse"
                  >
                    <div className="h-4 w-24 bg-slate-700/40 rounded mb-3" />
                    <div className="h-8 w-16 bg-slate-700/50 rounded mb-2" />
                    <div className="h-3 w-20 bg-slate-700/30 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* News Feed Section */}
            <div>
              <div className="h-5 w-40 bg-slate-700/50 rounded mb-4 animate-pulse" />
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#111722] rounded-xl p-4 border border-[#222F44] animate-pulse"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-3 w-16 bg-slate-700/50 rounded" />
                      <div className="h-5 w-14 bg-slate-700/50 rounded-full" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2 mb-3">
                      <div className="h-4 w-full bg-slate-700/50 rounded" />
                      <div className="h-4 w-3/4 bg-slate-700/50 rounded" />
                    </div>

                    {/* Summary */}
                    <div className="space-y-1.5 mb-4">
                      <div className="h-3 w-full bg-slate-700/30 rounded" />
                      <div className="h-3 w-5/6 bg-slate-700/30 rounded" />
                    </div>

                    {/* Ticker chips */}
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-slate-700/40 rounded-full" />
                      <div className="h-6 w-20 bg-slate-700/40 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Skeleton */}
      <aside className="hidden lg:flex w-80 shrink-0 border-l border-[#222F44] overflow-y-auto p-4 flex-col gap-4 bg-[#0a1017]">
        {/* AI Outlook Skeleton */}
        <div className="bg-[#111722] rounded-xl p-4 border border-[#222F44] animate-pulse">
          <div className="h-5 w-32 bg-slate-700/50 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-full bg-slate-700/40 rounded" />
                <div className="h-3 w-4/5 bg-slate-700/30 rounded" />
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
