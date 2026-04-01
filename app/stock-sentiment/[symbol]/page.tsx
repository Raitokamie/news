'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import RightSidebar from '@/components/layout/RightSidebar';
import RangeDropdown, { RangeOption } from '@/components/filters/RangeDropdown';
import { SentimentDonutChart, SentimentScoreCard, StockDetailNewsFeed } from '@/components/stock-detail';
import { mockStockSentiment, mockAIOutlook } from '@/lib/api';
import { TooltipProvider } from '@/components/ui/Tooltip';

type TimeRange = '24H' | '7D' | '30D' | 'All';

const rangeOptions: RangeOption<TimeRange>[] = [
  { value: '24H', label: 'Last 24H' },
  { value: '7D', label: 'Last 7D' },
  { value: '30D', label: 'Last 30D' },
  { value: 'All', label: 'All' },
];

function DonutSkeleton() {
  return (
    <div className="bg-[#0a1017] border border-[#333333] rounded-xl p-5 flex flex-col h-full animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="h-5 w-40 bg-slate-700/40 rounded" />
        <div className="h-6 w-24 bg-slate-700/30 rounded-full" />
      </div>

      {/* Donut circle */}
      <div className="flex justify-center items-center mb-5 flex-1">
        <div className="w-40 h-40 bg-slate-700/20 rounded-full" />
      </div>

      {/* Legend */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-700/40 rounded-full" />
            <div className="h-3 w-16 bg-slate-700/30 rounded" />
          </div>
          <div className="h-3 w-12 bg-slate-700/30 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-700/40 rounded-full" />
            <div className="h-3 w-16 bg-slate-700/30 rounded" />
          </div>
          <div className="h-3 w-12 bg-slate-700/30 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-700/40 rounded-full" />
            <div className="h-3 w-16 bg-slate-700/30 rounded" />
          </div>
          <div className="h-3 w-12 bg-slate-700/30 rounded" />
        </div>
      </div>
    </div>
  );
}

function ScoreCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 h-full animate-pulse">
      {/* Top card: Sentiment + Score */}
      <div className="bg-[#0a1017] border border-[#333333] rounded-xl p-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Sentiment skeleton */}
          <div className="flex flex-col items-center">
            <div className="h-4 w-20 bg-slate-700/40 rounded mb-3" />
            <div className="w-full h-12 bg-slate-700/30 rounded-lg" />
          </div>

          {/* Score skeleton */}
          <div className="flex flex-col items-center">
            <div className="h-4 w-24 bg-slate-700/40 rounded mb-3" />
            <div className="w-full h-12 bg-slate-700/30 rounded-lg" />
          </div>
        </div>
      </div>

      {/* AI Outlook card */}
      <div className="bg-[#0a1017] border border-[#333333] rounded-xl p-5 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-slate-700/40 rounded" />
          <div className="h-5 w-48 bg-slate-700/40 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-700/30 rounded" />
          <div className="h-3 w-full bg-slate-700/30 rounded" />
          <div className="h-3 w-4/5 bg-slate-700/30 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function StockDetailPage() {
  const params = useParams();
  const symbol = (params.symbol as string)?.toUpperCase() ?? '';
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24H');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Look up data for this symbol
  const row = mockStockSentiment.find((r) => r.symbol === symbol);
  const aiOutlook = mockAIOutlook[symbol] ?? 'No AI analysis available for this ticker.';

  if (!row) {
    return (
      <div className="flex h-full bg-[#0a1017]">
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar showBack />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-400 text-sm">No sentiment data found for <span className="text-[#0D7FF2] font-bold">${symbol}</span></p>
          </div>
        </div>
        <RightSidebar />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex h-full bg-[#0a1017]">
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar showBack />

          {/* Center content area */}
          <div className="flex-1 overflow-y-auto pb-27 lg:pb-0">
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between">
              <h1 className="text-lg font-extrabold text-white uppercase tracking-wide">
                <span className="text-white">${symbol}</span>
              </h1>

              <RangeDropdown
                options={rangeOptions}
                value={selectedRange}
                onChange={setSelectedRange}
              />
            </div>

            {/* Content */}
            <div className="pl-6 pr-8 pb-6 pt-0 flex flex-col gap-5">
              {isLoading ? (
                <>
                  {/* Top row skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                    <DonutSkeleton />
                    <ScoreCardSkeleton />
                  </div>

                  {/* News Feed skeleton */}
                  <StockDetailNewsFeed symbol={symbol} isLoading />
                </>
              ) : (
                <>
                  {/* Top row: Donut + Score/AI */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                    <SentimentDonutChart
                      historical={row.sentimentHistorical}
                      mentionCount={row.mentionCount}
                    />
                    <SentimentScoreCard
                      sentiment={row.sentiment}
                      score={row.score}
                      aiOutlook={aiOutlook}
                    />
                  </div>

                  {/* News Feed */}
                  <StockDetailNewsFeed symbol={symbol} />
                </>
              )}
            </div>
          </div>
        </div>

        <RightSidebar />
      </div>
    </TooltipProvider>
  );
}
