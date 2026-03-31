'use client';

import { useRef } from 'react';
import TopBar from '@/components/layout/TopBar';
import RightSidebar from '@/components/layout/RightSidebar';
import RegionRibbon from '@/components/filters/RegionRibbon';
import MobileFilterRow from '@/components/filters/MobileFilterRow';
import ImpactFeed from '@/components/news/ImpactFeed';
import BreakingNews from '@/components/news/BreakingNews';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';

export default function DashboardPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-full bg-[#0a1017]">
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <MobileFilterRow />
        <RegionRibbon />
        <div ref={scrollRef} className="flex-1 overflow-y-auto pb-28 lg:pb-0">
          <BreakingNews />
          <ImpactFeed />
        </div>
      </div>
      <RightSidebar />
      <ScrollToTopButton scrollContainerRef={scrollRef} />
    </div>
  );
}
