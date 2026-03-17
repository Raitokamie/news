'use client';

import { useMemo } from 'react';
import { mockNews } from '@/lib/api';
import { NewsItem } from '@/lib/types';
import { Star, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WatchlistStocksRowProps {
  trackedSymbols: string[];
  onRemove: (symbol: string) => void;
}

export interface TickerSummary {
  symbol: string;
  mentionCount: number;
  avgScore: number;
  sentiment: 'good' | 'bad' | 'neutral';
  trend: 'up' | 'down' | 'flat';
}

export function deriveTickerSummaries(news: NewsItem[]): TickerSummary[] {
  const map = new Map<string, { scores: number[]; count: number }>();
  for (const item of news) {
    for (const t of item.tickers) {
      const entry = map.get(t.symbol) || { scores: [], count: 0 };
      entry.scores.push(t.sentimentScore);
      entry.count++;
      map.set(t.symbol, entry);
    }
  }
  return Array.from(map.entries()).map(([symbol, { scores, count }]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return {
      symbol,
      mentionCount: count,
      avgScore: Math.round(avg * 10) / 10,
      sentiment: avg > 2 ? 'good' : avg < -2 ? 'bad' : 'neutral',
      trend: avg > 0 ? 'up' : avg < 0 ? 'down' : 'flat',
    };
  });
}

const trendConfig = {
  up: { icon: TrendingUp, iconColor: 'text-[#10B981]', bgColor: 'bg-[#17382D]' },
  down: { icon: TrendingDown, iconColor: 'text-[#EF4444]', bgColor: 'bg-[#592424]' },
  flat: { icon: Minus, iconColor: 'text-[#808080]', bgColor: 'bg-[#262626]' },
};

const sentimentConfig = {
  good: { label: 'Positive', dotColor: 'bg-[#10B981]', barColor: 'bg-[#10B981]' },
  bad: { label: 'Negative', dotColor: 'bg-[#EF4444]', barColor: 'bg-[#EF4444]' },
  neutral: { label: 'Neutral', dotColor: 'bg-[#7F7F7F]', barColor: 'bg-[#7F7F7F]' },
};

export default function WatchlistStocksRow({ trackedSymbols, onRemove }: WatchlistStocksRowProps) {
  const allSummaries = useMemo(() => deriveTickerSummaries(mockNews), []);
  const trackedStocks = useMemo(() => {
    return trackedSymbols
      .map((s) => allSummaries.find((t) => t.symbol === s))
      .filter(Boolean) as TickerSummary[];
  }, [trackedSymbols, allSummaries]);

  if (trackedStocks.length === 0) {
    return (
      <div className="bg-[#1A1A1A] border border-[#4D4D4D] border-dashed rounded-xl p-10 text-center">
        <Star size={28} className="text-slate-700 mx-auto mb-3" />
        <p className="text-sm text-slate-600 font-medium">Your watchlist is empty</p>
        <p className="text-xs text-slate-700 mt-1">
          Click + ADD to add tickers to your watchlist
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {trackedStocks.map((item) => {
        const trend = trendConfig[item.trend];
        const sentiment = sentimentConfig[item.sentiment];
        const TrendIcon = trend.icon;
        const scoreNormalized = Math.min(Math.abs(item.avgScore) / 10, 1) * 100;

        return (
          <div key={item.symbol} className="relative group">
            <div className="bg-[#0d0d0d] border border-[#333333] rounded-xl p-4 flex flex-col gap-3 hover:border-[#666] transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-bold text-base">${item.symbol}</h3>
                  <p className="text-[#808080] text-xs">{item.mentionCount} mentions</p>
                </div>
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', trend.bgColor)}>
                  <TrendIcon size={16} className={trend.iconColor} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-medium">Avg Score</span>
                  <span className="text-white font-semibold text-sm">{item.avgScore}</span>
                </div>
                <div className="h-2 w-full bg-[#2A2A2A] rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', sentiment.barColor)}
                    style={{ width: `${scoreNormalized}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full', sentiment.dotColor)} />
                <span className="text-white text-xs font-medium">{sentiment.label}</span>
              </div>
            </div>

            <button
              onClick={() => onRemove(item.symbol)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#333333] border border-[#4D4D4D] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:border-red-500/40"
            >
              <X size={12} className="text-slate-400 group-hover:text-red-400" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
