'use client';

import { useState, useMemo, useEffect } from 'react';
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

function TopStocksSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-[#0a1017] border border-[#222F44] rounded-xl p-4 flex flex-col gap-3 h-full animate-pulse">
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
  );
}

function TableRowsSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="border border-[#222F44] rounded-xl overflow-hidden">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-[#222F44]">
            {['Ticker', 'Impact', 'Sentiment', 'Mentions', 'Score'].map((h) => (
              <th key={h} className="px-4 py-3">
                <div className="h-3 w-14 bg-slate-700/50 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-[#222F44]">
              <td className="px-4 py-3"><div className="h-4 w-14 bg-slate-700/40 rounded animate-pulse" /></td>
              <td className="px-4 py-3"><div className="h-5 w-16 bg-slate-700/30 rounded-full animate-pulse" /></td>
              <td className="px-4 py-3"><div className="h-5 w-20 bg-slate-700/30 rounded-full animate-pulse" /></td>
              <td className="px-4 py-3"><div className="h-4 w-8 bg-slate-700/30 rounded animate-pulse" /></td>
              <td className="px-4 py-3"><div className="h-6 w-10 bg-slate-700/30 rounded-full animate-pulse ml-auto" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

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
        <div className="flex-1 overflow-y-auto pb-28 lg:pb-0">
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
          <div className="pl-6 pr-8 pb-6 pt-0 flex flex-col gap-4">
            {isLoading ? (
              <>
                {/* Top Stock Cards Skeleton */}
                <TopStocksSkeleton />

                {/* Filter Tabs skeleton */}
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-8 w-24 bg-slate-700/30 rounded-full animate-pulse" />
                  ))}
                </div>

                {/* Table Skeleton */}
                <TableRowsSkeleton rows={10} />
              </>
            ) : (
              <>
                {/* Top Stock Cards */}
                <TopStocksRow items={sortedTopStocks} />
              </>
            )}
          </div>

          {/* Filter Tabs - outside content padding */}
          {!isLoading && (
            <div className="px-4 md:px-6 pb-4">
              <TrendFilterTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>
          )}

          {/* Data Table */}
          {!isLoading && (
            <div className="px-6 pb-6">
              <TrendDataTable key={activeFilter} items={filteredTrends} />
            </div>
          )}
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}
