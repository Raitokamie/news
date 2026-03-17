'use client';

import { cn } from '@/lib/utils';
import { useTerminalStore } from '@/lib/store';
import { TrendingUp, TrendingDown, Minus, Star } from 'lucide-react';

interface TickerChipProps {
  symbol: string;
  showBookmark?: boolean;
  trend?: 'up' | 'down' | 'flat';
  size?: 'sm' | 'md';
}

export default function TickerChip({ symbol, showBookmark = true, trend = 'flat', size = 'sm' }: TickerChipProps) {
  const { activeTicker, setTicker, trackedTickers, addTicker, removeTicker } = useTerminalStore();
  const active = activeTicker === symbol;
  const isTracked = trackedTickers.includes(symbol);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500';

  function handleStarClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isTracked) {
      removeTicker(symbol);
    } else {
      addTicker(symbol);
    }
  }

  return (
    <button
      onClick={() => setTicker(symbol)}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 select-none',
        size === 'md' && 'px-3.5 py-2 text-base',
        active
          ? 'bg-[#0D7FF2]/20 text-[#0D7FF2] border border-[#0D7FF2]/40 shadow-[0_0_8px_rgba(13,127,242,0.15)]'
          : 'bg-[#2A2A2A] text-white border border-[#4D4D4D] hover:bg-[#3a3a3a] hover:border-[#0D7FF2]/30'
      )}
    >
      <span className="text-slate-400 font-normal">$</span>
      <span className="tracking-wide">{symbol}</span>
      <TrendIcon size={14} className={trendColor} />
      {showBookmark && (
        <Star
          size={12}
          onClick={handleStarClick}
          className={cn(
            'ml-0.5 transition-colors',
            isTracked ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500 hover:text-yellow-400'
          )}
        />
      )}
    </button>
  );
}
