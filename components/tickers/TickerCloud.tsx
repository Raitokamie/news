'use client';

import { useState, useEffect } from 'react';
import { useTerminalStore } from '@/lib/store';
import { mockNews } from '@/lib/api';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const trendStyle = {
  up: { Icon: TrendingUp, bg: 'bg-green-500/20', text: 'text-green-400' },
  down: { Icon: TrendingDown, bg: 'bg-red-500/20', text: 'text-red-400' },
  flat: { Icon: Minus, bg: 'bg-slate-500/20', text: 'text-slate-400' },
} as const;

type RankedTicker = { symbol: string; name: string; score: number };

function buildRankedTickers(): RankedTicker[] {
  const latestMap = new Map<string, { name: string; score: number; time: number }>();

  for (const news of mockNews) {
    const time = news.publishedAt.getTime();
    for (const ticker of news.tickers) {
      const existing = latestMap.get(ticker.symbol);
      if (!existing || time > existing.time) {
        latestMap.set(ticker.symbol, { name: ticker.name, score: ticker.sentimentScore, time });
      }
    }
  }

  return Array.from(latestMap.entries())
    .sort((a, b) => {
      const scoreDiff = Math.abs(b[1].score) - Math.abs(a[1].score);
      if (scoreDiff !== 0) return scoreDiff;
      // Secondary sort by symbol for deterministic order
      return a[0].localeCompare(b[0]);
    })
    .slice(0, 5)
    .map(([symbol, { name, score }]) => ({ symbol, name, score }));
}

export default function TickerCloud() {
  const setTicker = useTerminalStore((s) => s.setTicker);
  const activeTicker = useTerminalStore((s) => s.activeTicker);
  const [tickers, setTickers] = useState<RankedTicker[]>([]);

  useEffect(() => {
    setTickers(buildRankedTickers());
  }, []);

  return (
    <div className="bg-[#0F1924] border border-[#222F44] rounded-xl overflow-hidden">
      <div className="px-4 py-3">
        <h3 className="text-sm font-bold text-white">Trending Ticker</h3>
      </div>

      <div>
        {tickers.map(({ symbol, name, score }, index) => {
          const trend = score > 0 ? 'up' : score < 0 ? 'down' : 'flat';
          const { Icon, bg, text } = trendStyle[trend];
          const active = activeTicker === symbol;
          const isLast = index === tickers.length - 1;

          return (
            <button
              key={symbol}
              onClick={() => setTicker(symbol)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/5 ${active ? 'bg-white/8' : ''}`}
              style={!isLast ? { borderBottom: '1px dashed rgba(255, 255, 255, 0.08)', borderImage: 'repeating-linear-gradient(to right, rgba(255, 255, 255, 0.15) 0, rgba(255, 255, 255, 0.15) 6px, transparent 6px, transparent 12px) 1' } : undefined}
            >
              <div>
                <div className="text-sm font-bold text-white">{symbol}</div>
                <div className="text-xs text-[#808080]">{name}</div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bg}`}>
                <Icon size={16} className={text} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
