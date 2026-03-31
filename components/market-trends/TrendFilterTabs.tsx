'use client';

import { TrendFilter } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TrendFilterTabsProps {
  activeFilter: TrendFilter;
  onFilterChange: (filter: TrendFilter) => void;
}

const filters: { value: TrendFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'top_positive', label: 'Top Positive' },
  { value: 'top_negative', label: 'Top Negative' },
  { value: 'most_mention', label: 'Top Mention' },
];

export default function TrendFilterTabs({
  activeFilter,
  onFilterChange,
}: TrendFilterTabsProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 md:-mx-6">
      <div className="flex gap-2 min-w-max px-4 md:px-6 pb-1">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors border whitespace-nowrap flex-shrink-0',
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
    </div>
  );
}
