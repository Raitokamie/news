import TopBar from '@/components/layout/TopBar';
import TickerCloud from '@/components/tickers/TickerCloud';
import ImpactProCard from '@/components/widgets/ImpactProCard';
import { mockTickers } from '@/lib/mock-data';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Market Trends — Impact Terminal',
};

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

function formatPct(pct: number) {
  return `${pct > 0 ? '+' : ''}${pct.toFixed(2)}%`;
}

export default function MarketTrendsPage() {
  return (
    <div className="flex h-full">
      {/* Left — TopBar + Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <div className="px-4 py-4 border-b border-[#4D4D4D]">
          <h1 className="text-lg font-bold text-white">Market Trends</h1>
          <p className="text-sm text-slate-500">Top mentioned tickers and their current movement</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="overflow-x-auto rounded-xl border border-[#4D4D4D]">
            <table className="w-full text-sm min-w-[540px]">
              <thead>
                <tr className="border-b border-[#4D4D4D] bg-[#1A1A1A]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Symbol</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Change</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trend</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mentions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4D4D4D] bg-[#1A1A1A]">
                {mockTickers.map((ticker) => {
                  const TrendIcon = ticker.trend === 'up' ? TrendingUp : ticker.trend === 'down' ? TrendingDown : Minus;
                  const changeColor = ticker.change > 0 ? 'text-green-400' : ticker.change < 0 ? 'text-red-400' : 'text-slate-500';
                  return (
                    <tr key={ticker.symbol} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-cyan-400">${ticker.symbol}</td>
                      <td className="px-4 py-3.5 text-slate-400 text-xs">{ticker.name}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-white">{formatPrice(ticker.price)}</td>
                      <td className={cn('px-4 py-3.5 text-right font-mono font-semibold', changeColor)}>
                        {formatPct(ticker.changePercent)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end">
                          <div className={cn(
                            'flex items-center gap-1 px-2 py-1 rounded-md text-xs',
                            ticker.change > 0 ? 'bg-green-500/10 text-green-400' : ticker.change < 0 ? 'bg-red-500/10 text-red-400' : 'bg-slate-500/10 text-slate-400'
                          )}>
                            <TrendIcon size={11} />
                            <span className="capitalize">{ticker.trend}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                          {ticker.mentionCount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTickers.slice(0, 2).map((ticker) => (
              <div key={ticker.symbol} className="bg-[#1A1A1A] border border-[#4D4D4D] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-bold text-white">${ticker.symbol}</div>
                    <div className="text-sm text-slate-500">{ticker.name}</div>
                  </div>
                  <div className={cn('text-sm font-bold', ticker.change > 0 ? 'text-green-400' : 'text-red-400')}>
                    {formatPct(ticker.changePercent)}
                  </div>
                </div>
                <div className="h-16 flex items-end gap-0.5">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const h = 20 + ((i * 17 + 31) % 60);
                    const isUp = ticker.trend === 'up';
                    return (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className={cn('flex-1 rounded-t-sm opacity-60', isUp ? 'bg-green-500' : 'bg-red-500')}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar — สูงเต็มตั้งแต่ TopBar ถึงล่างสุด */}
      <aside className="hidden xl:flex w-64 shrink-0 border-l border-[#4D4D4D] overflow-y-auto p-4 flex-col gap-4">
        <ImpactProCard />
        <TickerCloud />
      </aside>
    </div>
  );
}
