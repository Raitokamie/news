'use client';

import { cn } from '@/lib/utils';
import { TrendFilter } from '@/lib/types';

const filterOptions: { id: TrendFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'top_positive', label: 'Top Positive' },
  { id: 'top_negative', label: 'Top Negative' },
  { id: 'most_mention', label: 'Mention' },
];

interface SentimentFilterRibbonProps {
  activeFilter: TrendFilter;
  onFilterChange: (filter: TrendFilter) => void;
}

export default function SentimentFilterRibbon({ activeFilter, onFilterChange }: SentimentFilterRibbonProps) {
  return (
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
  );
}
