'use client';

import { TickerAnalysis } from '@/lib/types';
import TopStockCard from './TopStockCard';

interface TopStocksRowProps {
  items: TickerAnalysis[];
}

export default function TopStocksRow({ items }: TopStocksRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <TopStockCard key={item.symbol} item={item} />
      ))}
    </div>
  );
}
