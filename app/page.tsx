import TopBar from '@/components/layout/TopBar';
import RegionRibbon from '@/components/filters/RegionRibbon';
import ImpactFeed from '@/components/news/ImpactFeed';
import TickerCloud from '@/components/tickers/TickerCloud';
import ImpactProCard from '@/components/widgets/ImpactProCard';

export default function DashboardPage() {
  return (
    <div className="flex h-full">
      {/* Left — TopBar + RegionRibbon + Feed */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <RegionRibbon />
        <div className="flex-1 overflow-y-auto">
          <ImpactFeed />
        </div>
      </div>

      {/* Right sidebar — สูงเต็มตั้งแต่ TopBar ถึงล่างสุด */}
      <aside className="hidden xl:flex w-80 shrink-0 border-l border-[#4D4D4D] overflow-y-auto p-4 flex-col gap-4">
        <ImpactProCard />
        <TickerCloud />
      </aside>
    </div>
  );
}
