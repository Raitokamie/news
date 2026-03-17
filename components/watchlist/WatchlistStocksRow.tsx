'use client';

import { useMemo } from 'react';
import { mockMarketTrends } from '@/lib/api';
import TopStockCard from '@/components/market-trends/TopStockCard';
import { Star } from 'lucide-react';

interface WatchlistStocksRowProps {
  trackedSymbols: string[];
}

export default function WatchlistStocksRow({ trackedSymbols }: WatchlistStocksRowProps) {
  const trackedStocks = useMemo(() => {
    return trackedSymbols
      .map((symbol) => mockMarketTrends.find((item) => item.symbol === symbol))
      .filter(Boolean);
  }, [trackedSymbols]);

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
      {trackedStocks.map((item) => (
        <TopStockCard key={item!.symbol} item={item!} />
      ))}
    </div>
  );
}
