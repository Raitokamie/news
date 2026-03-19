'use client';

import { Fragment, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockNews } from '@/lib/api';
import { useTerminalStore } from '@/lib/store';
import TopBar from '@/components/layout/TopBar';
import NewsCard from '@/components/news/NewsCard';
import { TelegramStatusWidget } from '@/components/watchlist';
import { mockTelegramNotifications } from '@/lib/api';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import PremiumLock from '@/components/premium/PremiumLock';

type RangeOption = '24h' | '7d';

const RANGE_MS: Record<RangeOption, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
};

const RANGE_LABEL: Record<RangeOption, string> = {
  '24h': 'Last 24H',
  '7d': 'Last 7D',
};

const trendConfig = {
  up: { icon: TrendingUp, bg: 'bg-[#17382D]', color: 'text-[#10B981]' },
  down: { icon: TrendingDown, bg: 'bg-[#592424]', color: 'text-[#EF4444]' },
  flat: { icon: Minus, bg: 'bg-[#262626]', color: 'text-[#808080]' },
};

export default function TickerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = (params.symbol as string).toUpperCase();
  const [range, setRange] = useState<RangeOption>('24h');
  const selectedSymbols = useTerminalStore((s) => s.selectedSymbols);
  const userPlan = useTerminalStore((s) => s.userPlan);

  if (userPlan === 'free') {
    return (
      <div className="flex h-full bg-[#0a1017]">
        <div className="flex-1 flex flex-col overflow-hidden">
          <PremiumLock featureName="Ticker Detail" />
        </div>
      </div>
    );
  }

  // Find ticker name from news data
  const tickerName = useMemo(() => {
    for (const news of mockNews) {
      const t = news.tickers.find((t) => t.symbol === symbol);
      if (t) return t.name;
    }
    return symbol;
  }, [symbol]);

  // Compute avg score and trend
  const { avgScore, trend } = useMemo(() => {
    const scores: number[] = [];
    for (const news of mockNews) {
      for (const t of news.tickers) {
        if (t.symbol === symbol) scores.push(t.sentimentScore);
      }
    }
    if (scores.length === 0) return { avgScore: 0, trend: 'flat' as const };
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return {
      avgScore: Math.round(avg * 10) / 10,
      trend: (avg > 0 ? 'up' : avg < 0 ? 'down' : 'flat') as 'up' | 'down' | 'flat',
    };
  }, [symbol]);

  const filtered = useMemo(() => {
    let items = mockNews.filter((n) =>
      n.tickers.some((t) => t.symbol === symbol)
    );

    // Filter by range
    const cutoff = new Date(Date.now() - RANGE_MS[range]);
    items = items.filter((n) => n.publishedAt >= cutoff);

    // Filter by selected symbols
    if (selectedSymbols.length > 0) {
      items = items.filter((n) =>
        n.tickers.some((t) => selectedSymbols.includes(t.symbol))
      );
    }

    // Sort latest first
    items = [...items].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    return items;
  }, [symbol, range, selectedSymbols]);

  const badItems = filtered.filter((n) => n.sentiment === 'bad' || n.sentiment === 'neutral');
  const goodItems = filtered.filter((n) => n.sentiment === 'good');
  const maxRows = Math.max(badItems.length, goodItems.length);

  const TrendIcon = trendConfig[trend].icon;

  return (
    <div className="flex h-full bg-[#0a1017]">
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <div className="flex-1 overflow-y-auto">
          {/* Ticker Header */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#222F44] flex items-center justify-center hover:bg-[#2A2A2A] transition-colors"
                >
                  <ArrowLeft size={16} className="text-white" />
                </button>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-white">${symbol}</h1>
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', trendConfig[trend].bg)}>
                    <TrendIcon size={16} className={trendConfig[trend].color} />
                  </div>
                </div>
              </div>

              {/* Range */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">Range:</span>
                <select
                  value={range}
                  onChange={(e) => setRange(e.target.value as RangeOption)}
                  className="appearance-none bg-[#1A1A1A] text-white text-sm font-semibold border border-[#222F44] rounded-lg px-3 py-1.5 cursor-pointer hover:border-[#666] transition-colors focus:outline-none focus:border-[#0D7FF2]"
                >
                  {(['24h', '7d'] as RangeOption[]).map((opt) => (
                    <option key={opt} value={opt}>{RANGE_LABEL[opt]}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[#808080] text-sm mt-1 ml-12">{tickerName}</p>
          </div>

          {/* News Feed */}
          <div className="px-6 pb-6">
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

              {Array.from({ length: maxRows }).map((_, i) => (
                <Fragment key={i}>
                  {badItems[i] ? <NewsCard item={badItems[i]} /> : <div />}
                  {goodItems[i] ? <NewsCard item={goodItems[i]} /> : <div />}
                </Fragment>
              ))}

              {maxRows === 0 && (
                <>
                  <div className="text-center py-12 text-slate-600 text-sm">No bad sentiment news</div>
                  <div className="text-center py-12 text-slate-600 text-sm">No good sentiment news</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <aside className="hidden xl:flex w-80 shrink-0 border-l border-[#222F44] overflow-y-auto p-4 flex-col gap-4 bg-[#0a1017]">
        <TelegramStatusWidget
          trackedSymbols={[symbol]}
          notifications={mockTelegramNotifications}
        />
      </aside>
    </div>
  );
}
