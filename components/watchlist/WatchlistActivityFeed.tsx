'use client';

import { Fragment, useMemo } from 'react';
import { mockNews } from '@/lib/api';
import NewsCard from '@/components/news/NewsCard';
import { TrendingDown, TrendingUp } from 'lucide-react';

const HOURS_24 = 24 * 60 * 60 * 1000;

interface WatchlistActivityFeedProps {
  trackedSymbols: string[];
}

export default function WatchlistActivityFeed({ trackedSymbols }: WatchlistActivityFeedProps) {
  const filtered = useMemo(() => {
    let items = mockNews;

    // Only last 24 hours
    const cutoff = new Date(Date.now() - HOURS_24);
    items = items.filter((n) => n.publishedAt >= cutoff);

    // Sort by latest
    items = [...items].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    return items;
  }, []);

  const badItems = filtered.filter((n) => n.sentiment === 'bad' || n.sentiment === 'neutral');
  const goodItems = filtered.filter((n) => n.sentiment === 'good');
  const maxRows = Math.max(badItems.length, goodItems.length);
  const totalInsights = filtered.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold tracking-widest uppercase text-slate-400">
          Recent Activity (Last 24 Hours)
        </h2>
        <span className="text-xs font-bold text-[#0D7FF2] bg-[#0D7FF2]/10 px-3 py-1.5 rounded-full">
          {totalInsights} New Insights
        </span>
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
