import TopBar from '@/components/layout/TopBar';
import TickerCloud from '@/components/tickers/TickerCloud';
import ImpactProCard from '@/components/widgets/ImpactProCard';
import { mockNews } from '@/lib/mock-data';
import NewsCard from '@/components/news/NewsCard';
import { Zap } from 'lucide-react';

export const metadata = {
  title: 'High Signal — Impact Terminal',
  description: 'Only the highest impact market-moving news',
};

export default function HighSignalPage() {
  const highItems = mockNews.filter((n) => n.impact === 'high');

  return (
    <div className="flex h-full">
      {/* Left — TopBar + Header + Feed */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        {/* Header banner */}
        <div className="px-4 py-4 border-b border-[#4D4D4D] bg-gradient-to-r from-red-500/5 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center">
              <Zap size={14} className="text-red-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">High Signal Feed</h1>
              <p className="text-sm text-slate-500">Only HIGH impact news that moves markets</p>
            </div>
            <span className="ml-auto bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-2.5 py-1 rounded-full">
              {highItems.length} SIGNALS
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {highItems.length === 0 ? (
            <div className="text-center py-20 text-slate-600">No high signal news right now</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {highItems.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}
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
