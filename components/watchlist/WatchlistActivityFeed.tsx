'use client';

import { Fragment, useMemo, useState, useRef, useEffect } from 'react';
import { mockNews } from '@/lib/api';
import { Category } from '@/lib/types';
import { categoryOptions } from '@/lib/constants';
import NewsCard from '@/components/news/NewsCard';
import MobileSentimentToggle from '@/components/news/MobileSentimentToggle';
import { TrendingDown, TrendingUp, ChevronDown } from 'lucide-react';
import { useTerminalStore } from '@/lib/store';
import { cn } from '@/lib/utils';

type RangeOption = '24h' | '7d' | '30d' | 'all';

const RANGE_MS: Record<RangeOption, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
  'all': Infinity,
};

const RANGE_LABEL: Record<RangeOption, string> = {
  '24h': 'Last 24H',
  '7d': 'Last 7D',
  '30d': 'Last 30D',
  'all': 'All',
};

interface WatchlistActivityFeedProps {
  trackedSymbols: string[];
}

export default function WatchlistActivityFeed({ trackedSymbols }: WatchlistActivityFeedProps) {
  const [range, setRange] = useState<RangeOption>('24h');
  const [rangeOpen, setRangeOpen] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<Category>('all');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const mobileCategoryRef = useRef<HTMLDivElement>(null);
  const mobileRangeRef = useRef<HTMLDivElement>(null);
  const { mobileSentiment } = useTerminalStore();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inRange = rangeRef.current?.contains(target) || mobileRangeRef.current?.contains(target);
      if (!inRange) setRangeOpen(false);
      const inCategory = categoryRef.current?.contains(target) || mobileCategoryRef.current?.contains(target);
      if (!inCategory) setCategoryOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    const cutoff = new Date(Date.now() - RANGE_MS[range]);
    items = items.filter((n) => n.publishedAt >= cutoff);

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
            {totalInsights} New Insights
          </span>
          <div className="flex items-center gap-3 text-xs">
            {/* Category dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Category:</span>
              <div className="relative" ref={categoryRef}>
                <button
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="px-3 py-1.5 bg-[#1A1A1A] border border-[#222F44] rounded-xl text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
                >
                  {categoryOptions.find((c) => c.id === category)?.label ?? 'All'}
                  <ChevronDown size={12} className={cn('text-white transition-transform', categoryOpen && 'rotate-180')} />
                </button>
                {categoryOpen && (
                  <div className="absolute top-full mt-1 right-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-lg shadow-xl overflow-hidden min-w-[160px] max-h-[300px] overflow-y-auto">
                    {categoryOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => { setCategory(opt.id); setCategoryOpen(false); }}
                        className={cn(
                          'block w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-white/8 transition-colors',
                          category === opt.id ? 'text-[#0D7FF2] bg-white/5' : 'text-white'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Range dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Range:</span>
              <div className="relative" ref={rangeRef}>
                <button
                  onClick={() => setRangeOpen(!rangeOpen)}
                  className="px-3 py-1.5 bg-[#1A1A1A] border border-[#222F44] rounded-xl text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
                >
                  {RANGE_LABEL[range]}
                  <ChevronDown size={12} className={cn('text-white transition-transform', rangeOpen && 'rotate-180')} />
                </button>
                {rangeOpen && (
                  <div className="absolute top-full mt-1 right-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-lg shadow-xl overflow-hidden min-w-[140px]">
                    {(['24h', '7d', '30d', 'all'] as RangeOption[]).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setRange(opt); setRangeOpen(false); }}
                        className={cn(
                          'block w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-white/8 transition-colors',
                          range === opt ? 'text-[#0D7FF2] bg-white/5' : 'text-white'
                        )}
                      >
                        {RANGE_LABEL[opt]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header - Mobile with sentiment toggle */}
      <div className="md:hidden flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-sm font-extrabold tracking-widest uppercase text-white">
              RECENT ACTIVITY
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {/* Category dropdown - Mobile */}
            <div className="relative" ref={mobileCategoryRef}>
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="px-3 py-1.5 bg-[#1A1A1A] border border-[#222F44] rounded-xl text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
              >
                {categoryOptions.find((c) => c.id === category)?.label ?? 'All'}
                <ChevronDown size={12} className={cn('text-white transition-transform', categoryOpen && 'rotate-180')} />
              </button>
              {categoryOpen && (
                <div className="absolute top-full mt-1 right-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-lg shadow-xl overflow-hidden min-w-[160px] max-h-[300px] overflow-y-auto">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => { setCategory(opt.id); setCategoryOpen(false); }}
                      className={cn(
                        'block w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-white/8 transition-colors',
                        category === opt.id ? 'text-[#0D7FF2] bg-white/5' : 'text-white'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Range dropdown - Mobile */}
            <div className="relative" ref={mobileRangeRef}>
              <button
                onClick={() => setRangeOpen(!rangeOpen)}
                className="px-3 py-1.5 bg-[#1A1A1A] border border-[#222F44] rounded-xl text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
              >
                {RANGE_LABEL[range]}
                <ChevronDown size={12} className={cn('text-white transition-transform', rangeOpen && 'rotate-180')} />
              </button>
              {rangeOpen && (
                <div className="absolute top-full mt-1 right-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-lg shadow-xl overflow-hidden min-w-[140px]">
                  {(['24h', '7d', '30d', 'all'] as RangeOption[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setRange(opt); setRangeOpen(false); }}
                      className={cn(
                        'block w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-white/8 transition-colors',
                        range === opt ? 'text-[#0D7FF2] bg-white/5' : 'text-white'
                      )}
                    >
                      {RANGE_LABEL[opt]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
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
