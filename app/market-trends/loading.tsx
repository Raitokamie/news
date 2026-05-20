export default function MarketTrendsLoading() {
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
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-slate-700/50 rounded animate-pulse" />
                <div className="h-6 w-40 bg-slate-700/50 rounded animate-pulse" />
              </div>
              <div className="h-9 w-32 bg-slate-700/40 rounded animate-pulse" />
            </div>

            {/* Top Stocks Row Skeleton */}
            <div className="mb-6">
              <div className="h-5 w-28 bg-slate-700/50 rounded mb-3 animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#0a1017] border border-[#222F44] rounded-xl p-4 flex flex-col gap-3 h-full animate-pulse"
                  >
                    {/* Header: Symbol + Trend Icon */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="h-4 w-16 bg-slate-700/50 rounded mb-1" />
                        <div className="h-8 w-24 bg-slate-700/30 rounded" />
                      </div>
                      <div className="w-8 h-8 bg-slate-700/30 rounded-full shrink-0" />
                    </div>

                    {/* Sentiment Score Section */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-20 bg-slate-700/40 rounded" />
                        <div className="h-4 w-8 bg-slate-700/40 rounded" />
                      </div>
                      <div className="h-2 w-full bg-[#2A2A2A] rounded-full" />
                    </div>

                    {/* Sentiment Badge */}
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-700/40 rounded-full" />
                      <div className="h-3 w-16 bg-slate-700/30 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Tabs Skeleton */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 w-32 bg-slate-700/30 rounded-full animate-pulse shrink-0" />
              ))}
            </div>

            {/* Table Skeleton */}
            <div className="border border-[#222F44] rounded-xl overflow-hidden">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#222F44] bg-[#0a1017]">
                    {['Ticker', 'Impact', 'Sentiment', 'Mentions', 'Score'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left">
                        <div className="h-3 w-14 bg-slate-700/50 rounded animate-pulse" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-[#0a1017]">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#222F44]">
                      <td className="px-4 py-3">
                        <div className="h-4 w-14 bg-slate-700/40 rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 w-16 bg-slate-700/30 rounded-full animate-pulse" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 w-20 bg-slate-700/30 rounded-full animate-pulse" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-8 bg-slate-700/30 rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-6 w-10 bg-slate-700/30 rounded-full animate-pulse ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Skeleton */}
      <aside className="hidden lg:flex w-80 shrink-0 border-l border-[#222F44] overflow-y-auto p-4 flex-col gap-4 bg-[#0a1017]">
        <div className="bg-[#111722] rounded-xl p-4 border border-[#222F44] animate-pulse">
          <div className="h-5 w-32 bg-slate-700/50 rounded mb-4" />
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
