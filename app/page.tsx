import TopBar from '@/components/layout/TopBar';
import RightSidebar from '@/components/layout/RightSidebar';
import RegionRibbon from '@/components/filters/RegionRibbon';
import MobileFilterRow from '@/components/filters/MobileFilterRow';
import ImpactFeed from '@/components/news/ImpactFeed';

export default function DashboardPage() {
  return (
    <div className="flex h-full bg-[#0a1017]">
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <MobileFilterRow />
        <RegionRibbon />
        <div className="flex-1 overflow-y-auto pb-28 md:pb-0">
          <ImpactFeed />
        </div>
      </div>
      <RightSidebar />
    </div>
  );
}
