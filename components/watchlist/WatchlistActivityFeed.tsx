'use client';

import { Fragment, useMemo, useState } from 'react';
import { mockNews } from '@/lib/api';
import { useTerminalStore } from '@/lib/store';
import NewsCard from '@/components/news/NewsCard';
import { TrendingDown, TrendingUp, ChevronDown } from 'lucide-react';

type RangeOption = '24h' | '7d';

const RANGE_MS: Record<RangeOption, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
};

const RANGE_LABEL: Record<RangeOption, string> = {
  '24h': 'Last 24H',
  '7d': 'Last 7D',
};

interface WatchlistActivityFeedProps {
  trackedSymbols: string[];
}

export default function WatchlistActivityFeed({ trackedSymbols }: WatchlistActivityFeedProps) {
  const [range, setRange] = useState<RangeOption>('24h');
  const searchQuery = useTerminalStore((s) => s.searchQuery);

  const filtered = useMemo(() => {
    if (trackedSymbols.length === 0) return [];

    let items = mockNews;

    // Only news that mention tracked tickers
    items = items.filter((n) =>
      n.tickers.some((t) => trackedSymbols.includes(t.symbol))
    );

    // Filter by selected range
    const cutoff = new Date(Date.now() - RANGE_MS[range]);
    items = items.filter((n) => n.publishedAt >= cutoff);

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter((n) =>
        n.headline.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.tickers.some((t) => t.symbol.toLowerCase().includes(q))
      );
    }

    // Sort by latest
    items = [...items].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    return items;
  }, [trackedSymbols, range, searchQuery]);

  const badItems = filtered.filter((n) => n.sentiment === 'bad' || n.sentiment === 'neutral');
  const goodItems = filtered.filter((n) => n.sentiment === 'good');
  const maxRows = Math.max(badItems.length, goodItems.length);
  const totalInsights = filtered.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold tracking-widest uppercase text-slate-400">
          Recent Activity
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0D7FF2] bg-[#0D7FF2]/10 px-3 py-1.5 rounded-full">
            {totalInsights} New Insights
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Range</span>
            <div className="relative">
              <select
                value={range}
                onChange={(e) => setRange(e.target.value as RangeOption)}
                className="appearance-none bg-[#1A1A1A] text-white text-xs font-semibold border border-[#4D4D4D] rounded-lg pl-3 pr-7 py-1.5 cursor-pointer hover:border-[#666] transition-colors focus:outline-none focus:border-[#0D7FF2]"
              >
                {(['24h', '7d'] as RangeOption[]).map((opt) => (
                  <option key={opt} value={opt}>{RANGE_LABEL[opt]}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
        {/* Column Headers */}
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown size={18} className="text-red-400" />
          <h3 className="text-base font-bold tracking-widest uppercase text-red-400">
            Bad Sentiment
          </h3>
        </div>
        <div className="flex items-center gap-2 mb-1 max-md:mt-6">
          <TrendingUp size={18} className="text-green-400" />
          <h3 className="text-base font-bold tracking-widest uppercase text-green-400">
            Good Sentiment
          </h3>
        </div>

        {/* Paired Cards */}
        {Array.from({ length: maxRows }).map((_, i) => (
          <Fragment key={i}>
            {badItems[i] ? <NewsCard item={badItems[i]} /> : <div />}
            {goodItems[i] ? <NewsCard item={goodItems[i]} /> : <div />}
          </Fragment>
        ))}

        {/* Empty state */}
        {maxRows === 0 && (
          <>
            <div className="text-center py-12 text-slate-600 text-sm bg-[#1A1A1A] rounded-xl border border-[#4D4D4D]">
              No bad sentiment news
            </div>
            <div className="text-center py-12 text-slate-600 text-sm bg-[#1A1A1A] rounded-xl border border-[#4D4D4D]">
              No good sentiment news
            </div>
          </>
        )}
      </div>
    </div>
  );
}
