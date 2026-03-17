'use client';

import { Fragment, useMemo } from 'react';
import { mockNews } from '@/lib/api';
import { useTerminalStore } from '@/lib/store';
import NewsCard from './NewsCard';
import { TrendingDown, TrendingUp } from 'lucide-react';

const HOURS_24 = 24 * 60 * 60 * 1000;

export default function ImpactFeed() {
  const { activeRegion, activeCountry, activeTicker, activeImpact, sortOrder, searchQuery } = useTerminalStore();

  const filtered = useMemo(() => {
    let items = mockNews;

    // Dashboard: only last 24 hours
    const cutoff = new Date(Date.now() - HOURS_24);
    items = items.filter((n) => n.publishedAt >= cutoff);

    // Filter by region tab (uses regionTag directly from data)
    if (activeRegion !== 'global') {
      items = items.filter((n) => n.regionTag === activeRegion);
    }
    // Filter by country
    if (activeCountry !== 'all') {
      items = items.filter((n) => n.countryCode === activeCountry);
    }
    if (activeTicker) {
      items = items.filter((n) => n.tickers.some((t) => t.symbol === activeTicker));
    }
    if (activeImpact !== 'all') {
      items = items.filter((n) => n.impact === activeImpact);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter((n) =>
        n.headline.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.tickers.some((t) => t.symbol.toLowerCase().includes(q))
      );
    }

    if (sortOrder === 'latest') {
      items = [...items].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    } else if (sortOrder === 'oldest') {
      items = [...items].sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
    } else if (sortOrder === 'impact') {
      const order = { high: 0, medium: 1, low: 2 };
      items = [...items].sort((a, b) => order[a.impact] - order[b.impact]);
    }

    return items;
  }, [activeRegion, activeCountry, activeTicker, activeImpact, sortOrder, searchQuery]);

  const badItems = filtered.filter((n) => n.sentiment === 'bad' || n.sentiment === 'neutral');
  const goodItems = filtered.filter((n) => n.sentiment === 'good');
  const maxRows = Math.max(badItems.length, goodItems.length);

  return (
    <div className="px-4 py-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
        {/* Column Headers */}
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown size={18} className="text-red-400" />
          <h2 className="text-base font-bold tracking-widest uppercase text-red-400">Bad Sentiment</h2>
          <span className="ml-auto text-xs text-slate-600 bg-white/5 px-2 py-0.5 rounded-full">
            {badItems.length}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1 max-md:mt-6">
          <TrendingUp size={18} className="text-green-400" />
          <h2 className="text-base font-bold tracking-widest uppercase text-green-400">Good Sentiment</h2>
          <span className="ml-auto text-xs text-slate-600 bg-white/5 px-2 py-0.5 rounded-full">
            {goodItems.length}
          </span>
        </div>

        {/* Paired Cards — same grid row = same height */}
        {Array.from({ length: maxRows }).map((_, i) => (
          <Fragment key={i}>
            {badItems[i] ? <NewsCard item={badItems[i]} /> : <div />}
            {goodItems[i] ? <NewsCard item={goodItems[i]} /> : <div />}
          </Fragment>
        ))}

        {/* Empty state */}
        {maxRows === 0 && (
          <>
            <div className="text-center py-12 text-slate-600 text-sm">No news matching filters</div>
            <div className="text-center py-12 text-slate-600 text-sm">No news matching filters</div>
          </>
        )}
      </div>
    </div>
  );
}
