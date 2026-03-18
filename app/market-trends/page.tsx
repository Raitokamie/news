'use client';

import { useState, useMemo } from 'react';
import TopBar from '@/components/layout/TopBar';
import RightSidebar from '@/components/layout/RightSidebar';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrendFilter, MarketTrendItem } from '@/lib/types';
import { mockMarketTrends, topTrendingStocks } from '@/lib/mock-data';
import {
  TopStocksRow,
  TrendFilterTabs,
  TrendDataTable,
} from '@/components/market-trends';

function filterMarketTrends(
  items: MarketTrendItem[],
  filter: TrendFilter
): MarketTrendItem[] {
  switch (filter) {
    case 'top_positive':
      return items
        .filter((i) => i.sentiment === 'good')
        .sort((a, b) => b.score - a.score);
    case 'top_negative':
      return items
        .filter((i) => i.sentiment === 'bad')
        .sort((a, b) => a.score - b.score);
    case 'most_mention':
      return [...items].sort((a, b) => b.mentionCount - a.mentionCount);
    default:
      return [...items].sort((a, b) => b.score - a.score);
  }
}

export default function MarketTrendsPage() {
  const selectedRange = 'Last 24H';
  const [activeFilter, setActiveFilter] = useState<TrendFilter>('all');

  const filteredTrends = useMemo(() => {
    return filterMarketTrends(mockMarketTrends, activeFilter);
  }, [activeFilter]);

  return (
    <div className="flex h-full bg-[#0d0d0d]">
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

            {/* Range selector (static) */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Range:</span>
              <button className="px-3 py-1.5 bg-[#1A1A1A] border border-[#222F44] rounded-lg text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2">
                {selectedRange}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 pt-0 flex flex-col gap-4">
            {/* Top Stock Cards */}
            <TopStocksRow items={topTrendingStocks} />

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
