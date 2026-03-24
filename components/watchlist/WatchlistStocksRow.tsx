'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { mockMarketTrends } from '@/lib/api';
import { TickerAnalysis } from '@/lib/types';
import { Star, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WatchlistStocksRowProps {
  trackedSymbols: string[];
  onRemove: (symbol: string) => void;
}

const trendConfig = {
  up: { icon: TrendingUp, iconColor: 'text-[#10B981]', bgColor: 'bg-[#17382D]' },
  down: { icon: TrendingDown, iconColor: 'text-[#EF4444]', bgColor: 'bg-[#592424]' },
  flat: { icon: Minus, iconColor: 'text-[#808080]', bgColor: 'bg-[#262626]' },
};

const sentimentMap: Record<'up' | 'down' | 'flat', { label: string; dotColor: string; barColor: string }> = {
  up: { label: 'Positive', dotColor: 'bg-[#10B981]', barColor: 'bg-[#10B981]' },
  down: { label: 'Negative', dotColor: 'bg-[#EF4444]', barColor: 'bg-[#EF4444]' },
  flat: { label: 'Neutral', dotColor: 'bg-[#7F7F7F]', barColor: 'bg-[#7F7F7F]' },
};

export default function WatchlistStocksRow({ trackedSymbols, onRemove }: WatchlistStocksRowProps) {
  const router = useRouter();
  const trackedStocks = useMemo(() => {
    return trackedSymbols
      .map((s) => mockMarketTrends.find((t) => t.symbol === s))
      .filter(Boolean) as TickerAnalysis[];
  }, [trackedSymbols]);

  if (trackedStocks.length === 0) {
    return (
      <div className="bg-[#1A1A1A] border border-[#222F44] border-dashed rounded-xl p-10 text-center">
        <Star size={28} className="text-slate-700 mx-auto mb-3" />
        <p className="text-sm text-slate-600 font-medium">Your watchlist is empty</p>
        <p className="text-xs text-slate-700 mt-1">
          Click + ADD to add tickers to your watchlist
        </p>
      </div>
    );
  }

  const renderCard = (item: TickerAnalysis) => {
    const trend = trendConfig[item.sentiment];
    const sentiment = sentimentMap[item.sentiment];
    const TrendIcon = trend.icon;
    const barWidth = Math.round((Math.abs(item.score) / 10) * 100);

    return (
      <div key={item.symbol} className="relative group">
        <div
          onClick={() => router.push(`/stock-sentiment/${item.symbol.toLowerCase()}`)}
          className="bg-[#0a1017] border border-[#222F44] rounded-xl p-4 flex flex-col gap-3 hover:border-[#666] transition-colors cursor-pointer h-full">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-bold text-base">{item.symbol}</h3>
              <p className="text-[#808080] text-xs">{item.name}</p>
            </div>
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', trend.bgColor)}>
              <TrendIcon size={16} className={trend.iconColor} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-medium">AVG Score</span>
              <span className="text-white font-semibold text-sm">{item.score}</span>
            </div>
            <div className="h-2 w-full bg-[#2A2A2A] rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full', sentiment.barColor)}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', sentiment.dotColor)} />
            <span className="text-white text-xs font-medium">{sentiment.label}</span>
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onRemove(item.symbol); }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#333333] border border-[#222F44] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:border-red-500/40 z-10"
        >
          <X size={12} className="text-slate-400 group-hover:text-red-400" />
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Mobile: Horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 sm:hidden snap-x snap-mandatory scrollbar-hide">
        {trackedStocks.map((item) => (
          <div key={item.symbol} className="flex-shrink-0 w-[280px] snap-start">
            {renderCard(item)}
          </div>
        ))}
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trackedStocks.map((item) => renderCard(item))}
      </div>
    </>
  );
}
