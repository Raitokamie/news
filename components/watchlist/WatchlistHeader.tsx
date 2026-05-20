'use client';

import { Star, Plus } from 'lucide-react';

interface WatchlistHeaderProps {
  onAddClick: () => void;
}

export default function WatchlistHeader({ onAddClick }: WatchlistHeaderProps) {
  return (
    <div className="px-6 py-5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Star size={20} className="text-white" />
        <h1 className="text-lg font-extrabold text-white uppercase tracking-wide">
          WATCHLIST
        </h1>
      </div>
      <button
        onClick={onAddClick}
        className="flex items-center gap-1.5 bg-[#0D7FF2] hover:bg-[#0B6FD4] text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
      >
        <Plus size={16} />
        ADD
      </button>
    </div>
  );
}
