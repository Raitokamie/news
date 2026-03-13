'use client';

import { mockTickers } from '@/lib/mock-data';
import { useTerminalStore } from '@/lib/store';
import { cn, formatChangePercent } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function TickerCloud() {
  const { activeTicker, setTicker } = useTerminalStore();

  return (
    <div className="bg-[#1A1A1A] border border-[#4D4D4D] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Trending Ticker
        </h3>
      </div>
      <div className="divide-y divide-white/5">
        {mockTickers.map((ticker) => {
          const active = activeTicker === ticker.symbol;
          const TrendIcon =
            ticker.trend === 'up' ? TrendingUp : ticker.trend === 'down' ? TrendingDown : Minus;
          const changeColor =
            ticker.change > 0
              ? 'text-green-400'
              : ticker.change < 0
              ? 'text-red-400'
              : 'text-slate-500';
          const bgColor =
            ticker.change > 0
              ? 'bg-green-500/10'
              : ticker.change < 0
              ? 'bg-red-500/10'
              : 'bg-slate-500/10';

          return (
            <button
              key={ticker.symbol}
              onClick={() => setTicker(ticker.symbol)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 hover:bg-white/5',
                active && 'bg-cyan-500/5 border-l-2 border-cyan-500'
              )}
            >
              {/* Symbol + name */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">{ticker.symbol}</div>
                <div className="text-xs text-slate-500 truncate">{ticker.name}</div>
              </div>

              {/* Change badge */}
              <div className={cn('flex items-center gap-1 px-2 py-1 rounded-md', bgColor)}>
                <TrendIcon size={10} className={changeColor} />
                <span className={cn('text-xs font-semibold', changeColor)}>
                  {formatChangePercent(ticker.changePercent)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
