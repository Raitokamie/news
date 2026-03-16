'use client';

import { mockNews, mockTickers } from '@/lib/api';
import { useMemo } from 'react';
import { useTerminalStore } from '@/lib/store';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const trendStyle = {
  up: { Icon: TrendingUp, bg: 'bg-green-500/20', text: 'text-green-400' },
  down: { Icon: TrendingDown, bg: 'bg-red-500/20', text: 'text-red-400' },
  flat: { Icon: Minus, bg: 'bg-slate-500/20', text: 'text-slate-400' },
} as const;

function buildRankedTickers() {
  const latest: Record<string, number> = {};
  const sorted = [...mockNews].sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
  for (const news of sorted) {
    for (const t of news.tickers) {
      latest[t.symbol] = t.sentimentScore;
    }
  }
  const nameMap = Object.fromEntries(mockTickers.map((t) => [t.symbol, t.name]));
  return Object.entries(latest)
    .map(([symbol, score]) => ({ symbol, name: nameMap[symbol] || symbol, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export default function TickerCloud() {
  const setTicker = useTerminalStore((s) => s.setTicker);
  const activeTicker = useTerminalStore((s) => s.activeTicker);
  const tickers = useMemo(() => buildRankedTickers(), []);

  return (
    <div className="bg-[#1A1A1A] border border-[#4D4D4D] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5">
        <h3 className="text-sm font-bold text-white">Trending Ticker</h3>
      </div>

      <div className="divide-y divide-dashed divide-white/8">
        {tickers.map(({ symbol, name, score }) => {
          const trend = score > 0 ? 'up' : score < 0 ? 'down' : 'flat';
          const { Icon, bg, text } = trendStyle[trend];
          const active = activeTicker === symbol;

          return (
            <button
              key={symbol}
              onClick={() => setTicker(symbol)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/5 ${active ? 'bg-white/8' : ''}`}
            >
              <div>
                <div className="text-sm font-bold text-white">{symbol}</div>
                <div className="text-xs text-slate-500">{name}</div>
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
