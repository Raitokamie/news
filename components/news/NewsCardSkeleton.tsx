'use client';

export default function NewsCardSkeleton() {
  return (
    <div className="bg-[#111722] rounded-xl p-4 border border-[#222F44] animate-pulse">
      {/* Header: time + impact badge */}
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
  );
}
