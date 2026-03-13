'use client';

import { cn } from '@/lib/utils';
import { useTerminalStore } from '@/lib/store';
import { TrendingUp, TrendingDown, Minus, Bookmark } from 'lucide-react';

interface TickerChipProps {
  symbol: string;
  showBookmark?: boolean;
  trend?: 'up' | 'down' | 'flat';
  size?: 'sm' | 'md';
}

export default function TickerChip({ symbol, showBookmark = true, trend = 'flat', size = 'sm' }: TickerChipProps) {
  const { activeTicker, setTicker } = useTerminalStore();
  const active = activeTicker === symbol;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500';

  return (
    <button
      onClick={() => setTicker(symbol)}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-150 select-none',
        size === 'md' && 'px-3.5 py-2 text-base',
        active
          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.15)]'
          : 'bg-[#4C4C4C] text-white border border-[#4C4C4C] hover:bg-[#5a5a5a] hover:border-cyan-500/30'
      )}
    >
      <span className="text-slate-400 font-normal">$</span>
      <span className="tracking-wide">{symbol}</span>
      <TrendIcon size={14} className={trendColor} />
      {showBookmark && (
        <Bookmark size={12} className="text-slate-600 hover:text-slate-400 ml-0.5" />
      )}
    </button>
  );
}
