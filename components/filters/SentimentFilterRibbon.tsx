'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TrendFilter, TrendSort } from '@/lib/types';
import { ChevronDown } from 'lucide-react';

const filterOptions: { id: TrendFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'top_positive', label: 'Top Positive' },
  { id: 'top_negative', label: 'Top Negative' },
  { id: 'most_mention', label: 'Top Mention' },
];

const sortOptions: { value: TrendSort; label: string }[] = [
  { value: 'highest_score', label: 'Highest Score' },
  { value: 'lowest_score', label: 'Lowest Score' },
  { value: 'most_mention', label: 'Most Mentioned' },
];

interface SentimentFilterRibbonProps {
  activeFilter: TrendFilter;
  onFilterChange: (filter: TrendFilter) => void;
  activeSort: TrendSort;
  onSortChange: (sort: TrendSort) => void;
}

export default function SentimentFilterRibbon({ activeFilter, onFilterChange, activeSort, onSortChange }: SentimentFilterRibbonProps) {
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
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const isActive = activeFilter === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onFilterChange(option.id)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors border',
                isActive
                  ? 'bg-[#1a1a1a] text-[#0D7FF2] border-[#0D7FF2]'
                  : 'bg-[#1a1a1a] text-white border-[#222F44] hover:border-[#0D7FF2]'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Sort dropdown */}
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
