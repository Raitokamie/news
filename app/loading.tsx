export default function HomeLoading() {
  return (
    <div className="flex h-full bg-[#0a1017]">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopBar Skeleton */}
        <div className="h-14 border-b border-[#222F44] flex items-center px-4 gap-3 bg-[#0a1017]">
          <div className="h-8 w-8 bg-slate-700/50 rounded animate-pulse" />
          <div className="h-4 w-32 bg-slate-700/40 rounded animate-pulse" />
        </div>

        {/* Mobile Filter Row Skeleton */}
        <div className="lg:hidden border-b border-[#222F44] p-3 bg-[#0a1017]">
          <div className="h-9 w-full bg-slate-700/30 rounded animate-pulse" />
        </div>

        {/* Region Ribbon Skeleton */}
        <div className="border-b border-[#222F44] bg-[#0a1017]">
          <div className="flex gap-2 px-4 py-3 overflow-x-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-slate-700/30 rounded-full animate-pulse shrink-0" />
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-28 lg:pb-0">
          {/* Breaking News Skeleton */}
          <div className="p-4 border-b border-[#222F44]">
            <div className="h-5 w-32 bg-slate-700/50 rounded mb-3 animate-pulse" />
            <div className="bg-[#111722] rounded-xl p-4 border border-[#222F44] animate-pulse">
              <div className="space-y-3">
                <div className="h-4 w-3/4 bg-slate-700/50 rounded" />
                <div className="h-3 w-full bg-slate-700/30 rounded" />
                <div className="h-3 w-5/6 bg-slate-700/30 rounded" />
              </div>
            </div>
          </div>

          {/* News Feed Skeleton */}
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-[#111722] rounded-xl p-4 border border-[#222F44] animate-pulse">
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
                  <div className="h-6 w-14 bg-slate-700/40 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar Skeleton */}
      <aside className="hidden lg:flex w-80 shrink-0 border-l border-[#222F44] overflow-y-auto p-4 flex-col gap-4 bg-[#0a1017]">
        {/* AI Outlook Skeleton */}
        <div className="bg-[#111722] rounded-xl p-4 border border-[#222F44] animate-pulse">
          <div className="h-5 w-32 bg-slate-700/50 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-full bg-slate-700/40 rounded" />
                <div className="h-3 w-4/5 bg-slate-700/30 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Top Stocks Skeleton */}
        <div className="bg-[#111722] rounded-xl p-4 border border-[#222F44] animate-pulse">
          <div className="h-5 w-28 bg-slate-700/50 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-16 bg-slate-700/40 rounded" />
                <div className="h-4 w-12 bg-slate-700/30 rounded" />
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
