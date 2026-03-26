'use client';

import { useState, useMemo } from 'react';
import TopBar from '@/components/layout/TopBar';
import RightSidebar from '@/components/layout/RightSidebar';
import RangeDropdown, { RangeOption } from '@/components/filters/RangeDropdown';
import { TrendingUp } from 'lucide-react';
import { TrendFilter, TickerAnalysis } from '@/lib/types';
import { mockMarketTrends } from '@/lib/mock-data';
import {
  TopStocksRow,
  TrendFilterTabs,
  TrendDataTable,
} from '@/components/market-trends';

type TimeRange = '24H' | '7D';

const rangeOptions: RangeOption<TimeRange>[] = [
  { value: '24H', label: 'Last 24H' },
  { value: '7D', label: 'Last 7D' },
];

function filterTrends(
  items: TickerAnalysis[],
  filter: TrendFilter
): TickerAnalysis[] {
  let filtered: TickerAnalysis[];
  switch (filter) {
    case 'top_positive':
      filtered = items.filter((i) => i.sentiment === 'up');
      filtered.sort((a, b) => b.score - a.score);
      break;
    case 'top_negative':
      filtered = items.filter((i) => i.sentiment === 'down');
      filtered.sort((a, b) => a.score - b.score);
      break;
    case 'most_mention':
      filtered = [...items];
      filtered.sort((a, b) => b.mentionCount - a.mentionCount);
      break;
    default:
      filtered = [...items];
      filtered.sort((a, b) => b.score - a.score);
  }
  return filtered;
}

export default function MarketTrendsPage() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24H');
  const [activeFilter, setActiveFilter] = useState<TrendFilter>('all');

  const filteredTrends = useMemo(() => {
    return filterTrends(mockMarketTrends, activeFilter);
  }, [activeFilter]);

  // Top 4 cards: "All" shows most extreme scores (furthest from 0), others follow filter
  const sortedTopStocks = useMemo(() => {
    if (activeFilter === 'all') {
      return [...mockMarketTrends]
        .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
        .slice(0, 4);
    }
    return filteredTrends.slice(0, 4);
  }, [activeFilter, filteredTrends]);

  return (
    <div className="flex h-full bg-[#0a1017]">
      {/* Left — TopBar + Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        {/* Center content area */}
        <div className="flex-1 overflow-y-auto pb-28 md:pb-0">
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-white" />
              <h1 className="text-lg font-extrabold text-white uppercase tracking-wide">
                TRENDING
              </h1>
            </div>

            <RangeDropdown
              options={rangeOptions}
              value={selectedRange}
              onChange={setSelectedRange}
            />
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
