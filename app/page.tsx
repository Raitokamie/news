import TopBar from '@/components/layout/TopBar';
import RightSidebar from '@/components/layout/RightSidebar';
import RegionRibbon from '@/components/filters/RegionRibbon';
import ImpactFeed from '@/components/news/ImpactFeed';

export default function DashboardPage() {
  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <RegionRibbon />
        <div className="flex-1 overflow-y-auto">
          <ImpactFeed />
        </div>
      </div>
      <RightSidebar />
    </div>
  );
}
