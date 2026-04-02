export default function TickerDetailLoading() {
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
            {/* Back Button + Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 bg-slate-700/50 rounded animate-pulse" />
                <div className="h-6 w-48 bg-slate-700/50 rounded animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-slate-700/40 rounded animate-pulse" />
                <div className="h-9 w-32 bg-slate-700/40 rounded animate-pulse" />
              </div>
            </div>

            {/* Mobile Sentiment Toggle Skeleton */}
            <div className="lg:hidden mb-4">
              <div className="flex gap-2">
                <div className="h-10 flex-1 bg-slate-700/30 rounded-lg animate-pulse" />
                <div className="h-10 flex-1 bg-slate-700/30 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#111722] rounded-xl p-4 border border-[#222F44] animate-pulse"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-4 w-24 bg-slate-700/40 rounded" />
                    <div className="h-6 w-6 bg-slate-700/30 rounded-full" />
                  </div>
                  <div className="h-8 w-20 bg-slate-700/50 rounded mb-2" />
                  <div className="h-3 w-16 bg-slate-700/30 rounded" />
                </div>
              ))}
            </div>

            {/* News Feed Skeleton */}
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

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-16 bg-slate-700/40 rounded-full" />
                      <div className="h-3 w-24 bg-slate-700/30 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Skeleton - Desktop Only */}
      <aside className="hidden lg:flex w-80 shrink-0 border-l border-[#222F44] overflow-y-auto p-4 flex-col gap-4 bg-[#0a1017]">
        {/* Telegram Widget Skeleton */}
        <div className="bg-[#111722] rounded-xl p-4 border border-[#222F44] animate-pulse">
          <div className="h-5 w-40 bg-slate-700/50 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-full bg-slate-700/40 rounded" />
                <div className="h-3 w-3/4 bg-slate-700/30 rounded" />
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
