'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import TopBar from '@/components/layout/TopBar';
import RightSidebar from '@/components/layout/RightSidebar';
import { TrendingUp, TrendingDown, Minus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrendFilter, TickerAnalysis } from '@/lib/types';
import { mockMarketTrends } from '@/lib/mock-data';
import {
  TopStocksRow,
  TrendFilterTabs,
  TrendDataTable,
} from '@/components/market-trends';

type TimeRange = '24H' | '7D' | '30D' | '3M';

const rangeOptions: { value: TimeRange; label: string }[] = [
  { value: '24H', label: 'Last 24H' },
  { value: '7D', label: 'Last 7D' },
  { value: '30D', label: 'Last 30D' },
  { value: '3M', label: 'Last 3M' },
];

function filterMarketTrends(
  items: TickerAnalysis[],
  filter: TrendFilter
): TickerAnalysis[] {
  switch (filter) {
    case 'top_positive':
      return items
        .filter((i) => i.sentiment === 'up')
        .sort((a, b) => b.score - a.score);
    case 'top_negative':
      return items
        .filter((i) => i.sentiment === 'down')
        .sort((a, b) => a.score - b.score);
    case 'most_mention':
      return [...items].sort((a, b) => b.mentionCount - a.mentionCount);
    default:
      return [...items].sort((a, b) => b.score - a.score);
  }
}

export default function MarketTrendsPage() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24H');
  const [rangeOpen, setRangeOpen] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<TrendFilter>('all');

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rangeRef.current && !rangeRef.current.contains(e.target as Node)) setRangeOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = rangeOptions.find((o) => o.value === selectedRange)?.label ?? 'Last 24H';

  const filteredTrends = useMemo(() => {
    return filterMarketTrends(mockMarketTrends, activeFilter);
  }, [activeFilter]);

  // Top 4 stocks derived from market trends, sorted by score
  const sortedTopStocks = useMemo(() => {
    return [...mockMarketTrends].sort((a, b) => Math.abs(b.score) - Math.abs(a.score)).slice(0, 4);
  }, []);

  return (
    <div className="flex h-full bg-[#0a1017]">
      {/* Left — TopBar + Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        {/* Center content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-white" />
              <h1 className="text-lg font-extrabold text-white uppercase tracking-wide">
                TRENDING
              </h1>
            </div>

            {/* Range selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Range:</span>
              <div className="relative" ref={rangeRef}>
                <button
                  onClick={() => setRangeOpen(!rangeOpen)}
                  className="px-3 py-1.5 bg-[#1A1A1A] border border-[#222F44] rounded-xl text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
                >
                  {currentLabel}
                  <ChevronDown size={12} className={cn('text-white transition-transform', rangeOpen && 'rotate-180')} />
                </button>
                {rangeOpen && (
                  <div className="absolute top-full mt-1 right-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-lg shadow-xl overflow-hidden min-w-[140px]">
                    {rangeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSelectedRange(opt.value); setRangeOpen(false); }}
                        className={cn(
                          'block w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-white/8 transition-colors',
                          selectedRange === opt.value ? 'text-[#0D7FF2] bg-white/5' : 'text-white'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 pt-0 flex flex-col gap-4">
            {/* Top Stock Cards */}
            <TopStocksRow items={sortedTopStocks} />

            {/* Filter Tabs */}
            <TrendFilterTabs
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Data Table */}
            <TrendDataTable items={filteredTrends} />
          </div>
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}
