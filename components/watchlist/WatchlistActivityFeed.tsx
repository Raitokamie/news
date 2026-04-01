'use client';

import { Fragment, useMemo, useState } from 'react';
import { mockNews } from '@/lib/api';
import { Category } from '@/lib/types';
import { categoryOptions } from '@/lib/constants';
import NewsCard from '@/components/news/NewsCard';
import MobileSentimentToggle from '@/components/news/MobileSentimentToggle';
import RangeDropdown, { RangeOption } from '@/components/filters/RangeDropdown';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useTerminalStore } from '@/lib/store';

type TimeRangeValue = '24h' | '7d' | '30d' | 'all';

const RANGE_MS: Record<TimeRangeValue, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
  'all': Infinity,
};

const rangeOptions: RangeOption<TimeRangeValue>[] = [
  { value: '24h', label: 'Last 24H' },
  { value: '7d', label: 'Last 7D' },
  { value: '30d', label: 'Last 30D' },
  { value: 'all', label: 'All' },
];

const categoryDropdownOptions: RangeOption<Category>[] = categoryOptions.map((opt) => ({
  value: opt.id,
  label: opt.label,
}));

interface WatchlistActivityFeedProps {
  trackedSymbols: string[];
}

export default function WatchlistActivityFeed({ trackedSymbols }: WatchlistActivityFeedProps) {
  const [range, setRange] = useState<TimeRangeValue>('24h');
  const [category, setCategory] = useState<Category>('all');
  const { mobileSentiment } = useTerminalStore();

  const filtered = useMemo(() => {
    if (trackedSymbols.length === 0) return [];

    let items = mockNews;

    // Only news that mention tracked tickers
    items = items.filter((n) =>
      n.tickers.some((t) => trackedSymbols.includes(t.symbol))
    );

    // Filter by category
    if (category !== 'all') {
      items = items.filter((n) => n.category === category);
    }

    // Filter by selected range
    if (range !== 'all') {
      const cutoff = new Date(Date.now() - RANGE_MS[range]);
      items = items.filter((n) => n.publishedAt >= cutoff);
    }

    // Sort by latest
    items = [...items].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    return items;
  }, [trackedSymbols, range, category]);

  const badItems = filtered.filter((n) => n.sentiment === 'bad' || n.sentiment === 'neutral');
  const goodItems = filtered.filter((n) => n.sentiment === 'good');
  const maxRows = Math.max(badItems.length, goodItems.length);
  const totalInsights = filtered.length;

  const mobileItems = mobileSentiment === 'bad' ? badItems : goodItems;

  return (
    <div className="flex flex-col gap-4">
      {/* Section Header - Desktop */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-sm font-extrabold tracking-widest uppercase text-white">
            RECENT ACTIVITY
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0D7FF2] bg-[#0D7FF2]/10 px-3 py-1.5 rounded-full">
            {totalInsights} News
          </span>
          <div className="flex items-center gap-3 text-xs">
            {/* Category dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Category:</span>
              <RangeDropdown
                options={categoryDropdownOptions}
                value={category}
                onChange={setCategory}
                showLabel={false}
              />
            </div>
            {/* Range dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Range:</span>
              <RangeDropdown
                options={rangeOptions}
                value={range}
                onChange={setRange}
                showLabel={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Header - Mobile with sentiment toggle */}
      <div className="md:hidden flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-sm font-extrabold tracking-widest uppercase text-white">
            RECENT ACTIVITY
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {/* Category dropdown - Mobile */}
          <RangeDropdown
            options={categoryDropdownOptions}
            value={category}
            onChange={setCategory}
            showLabel={false}
            fullWidth
          />
          {/* Range dropdown - Mobile */}
          <RangeDropdown
            options={rangeOptions}
            value={range}
            onChange={setRange}
            showLabel={false}
            fullWidth
          />
        </div>
        <MobileSentimentToggle />
      </div>

      {/* Mobile: Single column based on toggle */}
      <div className="md:hidden flex flex-col gap-3">
        {mobileItems.length === 0 ? (
          <div className="text-center py-12 text-slate-600 text-sm bg-[#1A1A1A] rounded-xl border border-[#222F44]">
            No {mobileSentiment} sentiment news
          </div>
        ) : (
          mobileItems.map((item) => <NewsCard key={item.id} item={item} />)
        )}
      </div>

      {/* Desktop: Two-column grid */}
      <div className="hidden md:grid md:grid-cols-2 gap-x-5 gap-y-3">
        {/* Column Headers */}
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown size={18} className="text-red-400" />
          <h3 className="text-base font-bold tracking-widest uppercase text-red-400">
            Bad Sentiment
          </h3>
        </div>
        <div className="flex items-center gap-2 mb-1">
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
            <div className="text-center py-12 text-slate-600 text-sm bg-[#1A1A1A] rounded-xl border border-[#222F44]">
              No bad sentiment news
            </div>
            <div className="text-center py-12 text-slate-600 text-sm bg-[#1A1A1A] rounded-xl border border-[#222F44]">
              No good sentiment news
            </div>
          </>
        )}
      </div>
    </div>
  );
}
