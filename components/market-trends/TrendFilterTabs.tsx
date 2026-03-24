'use client';

import { useState, useRef, useEffect } from 'react';
import { TrendFilter, TrendSort } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface TrendFilterTabsProps {
  activeFilter: TrendFilter;
  onFilterChange: (filter: TrendFilter) => void;
  activeSort: TrendSort;
  onSortChange: (sort: TrendSort) => void;
}

const filters: { value: TrendFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'top_positive', label: 'Top Positive' },
  { value: 'top_negative', label: 'Top Negative' },
  { value: 'most_mention', label: 'Top Mention' },
];

const sortOptions: { value: TrendSort; label: string }[] = [
  { value: 'highest_score', label: 'Highest Score' },
  { value: 'lowest_score', label: 'Lowest Score' },
  { value: 'most_mention', label: 'Most Mentioned' },
];

export default function TrendFilterTabs({
  activeFilter,
  onFilterChange,
  activeSort,
  onSortChange,
}: TrendFilterTabsProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSortLabel = sortOptions.find((o) => o.value === activeSort)?.label ?? 'Highest Score';

  return (
    <div className="flex items-center gap-2">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors border',
                isActive
                  ? 'bg-[#1a1a1a] text-[#0D7FF2] border-[#0D7FF2]'
                  : 'bg-[#1a1a1a] text-white border-[#222F44] hover:border-[#0D7FF2]'
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Sort dropdown — right side */}
      <div className="relative ml-auto" ref={sortRef}>
        <button
          onClick={() => setSortOpen(!sortOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#222F44] rounded-md text-sm font-medium text-white hover:border-[#0D7FF2] transition-colors"
        >
          {currentSortLabel}
          <ChevronDown size={14} className={cn('transition-transform', sortOpen && 'rotate-180')} />
        </button>
        {sortOpen && (
          <div className="absolute top-full mt-1 right-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-lg shadow-xl overflow-hidden min-w-[160px]">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onSortChange(opt.value); setSortOpen(false); }}
                className={cn(
                  'block w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-white/8 transition-colors',
                  activeSort === opt.value ? 'text-[#0D7FF2] bg-white/5' : 'text-white'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
