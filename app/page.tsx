import TopBar from '@/components/layout/TopBar';
import RegionRibbon from '@/components/filters/RegionRibbon';
import ImpactFeed from '@/components/news/ImpactFeed';
import TickerCloud from '@/components/tickers/TickerCloud';
import ImpactProCard from '@/components/widgets/ImpactProCard';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <TopBar />
      <RegionRibbon />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Feed — full width on mobile, constrained on xl */}
        <div className="flex-1 overflow-y-auto">
          <ImpactFeed />
        </div>

        {/* Right sidebar — hidden on mobile/tablet, visible on xl */}
        <aside className="hidden xl:flex w-64 shrink-0 border-l border-[#4D4D4D] overflow-y-auto p-4 flex-col gap-4">
          <ImpactProCard />
          <TickerCloud />
        </aside>
      </div>
    </div>
  );
}
