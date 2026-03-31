'use client';

import { useMemo } from 'react';
import { mockMarketTrends } from '@/lib/api';
import { TickerAnalysis } from '@/lib/types';
import { Star } from 'lucide-react';
import StockCard from '@/components/market-trends/TopStockCard';

interface WatchlistStocksRowProps {
  trackedSymbols: string[];
  onRemove: (symbol: string) => void;
}

export default function WatchlistStocksRow({ trackedSymbols, onRemove }: WatchlistStocksRowProps) {
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


  return (
    <>
      {/* Mobile: Horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 sm:hidden snap-x snap-mandatory scrollbar-hide">
        {trackedStocks.map((item) => (
          <div key={item.symbol} className="flex-shrink-0 w-[280px] snap-start">
            <StockCard item={item} onRemove={onRemove} />
          </div>
        ))}
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trackedStocks.map((item) => (
          <StockCard key={item.symbol} item={item} onRemove={onRemove} />
        ))}
      </div>
    </>
  );
}
