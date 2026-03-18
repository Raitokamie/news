'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import RightSidebar from '@/components/layout/RightSidebar';
import { SentimentDonutChart, SentimentScoreCard, StockDetailNewsFeed } from '@/components/stock-detail';
import { mockStockSentiment, mockAIOutlook } from '@/lib/api';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

type TimeRange = '24H' | '7D' | '30D' | '3M';

const rangeOptions: { value: TimeRange; label: string }[] = [
  { value: '24H', label: 'Last 24H' },
  { value: '7D', label: 'Last 7D' },
  { value: '30D', label: 'Last 30D' },
  { value: '3M', label: 'Last 3M' },
];

export default function StockDetailPage() {
  const params = useParams();
  const symbol = (params.symbol as string)?.toUpperCase() ?? '';

  const [selectedRange, setSelectedRange] = useState<TimeRange>('24H');
  const [rangeOpen, setRangeOpen] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);

  const currentLabel = rangeOptions.find((o) => o.value === selectedRange)?.label ?? 'Last 24H';

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rangeRef.current && !rangeRef.current.contains(e.target as Node)) setRangeOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Look up data for this symbol
  const row = mockStockSentiment.find((r) => r.symbol === symbol);
  const aiOutlook = mockAIOutlook[symbol] ?? 'No AI analysis available for this ticker.';

  if (!row) {
    return (
      <div className="flex h-full bg-[#0d0d0d]">
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-400 text-sm">No sentiment data found for <span className="text-[#0D7FF2] font-bold">${symbol}</span></p>
          </div>
        </div>
        <RightSidebar />
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#0d0d0d]">
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        {/* Center content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between">
            <h1 className="text-lg font-extrabold text-white uppercase tracking-wide">
              <span className="text-white">${symbol}</span>
            </h1>

            {/* Range selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Range:</span>
              <div className="relative" ref={rangeRef}>
                <button
                  onClick={() => setRangeOpen(!rangeOpen)}
                  className="px-3 py-1.5 bg-[#1A1A1A] border border-[#4D4D4D] rounded-lg text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
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
          <div className="px-6 pb-6 pt-0 flex flex-col gap-5">
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
          </div>
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}
