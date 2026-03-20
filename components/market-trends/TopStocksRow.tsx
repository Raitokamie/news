'use client';

import { TickerAnalysis } from '@/lib/types';
import TopStockCard from './TopStockCard';
import { cn } from '@/lib/utils';

interface TopStocksRowProps {
  items: TickerAnalysis[];
}

export default function TopStocksRow({ items }: TopStocksRowProps) {
  return (
    <>
      {/* Mobile: Horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 sm:hidden snap-x snap-mandatory scrollbar-hide">
        {items.map((item, index) => (
          <div
            key={item.symbol}
            className={cn(
              'flex-shrink-0 w-[280px] snap-start',
              index === items.length - 1 && 'mr-0'
            )}
          >
            <TopStockCard item={item} />
          </div>
        ))}
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <TopStockCard key={item.symbol} item={item} />
        ))}
      </div>
    </>
  );
}
