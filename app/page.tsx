'use client';

import { useRef } from 'react';
import RegionRibbon from '@/components/filters/RegionRibbon';
import MobileFilterRow from '@/components/filters/MobileFilterRow';
import ImpactFeed from '@/components/news/ImpactFeed';
import BreakingNews from '@/components/news/BreakingNews';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function DashboardPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ErrorBoundary>
        <MobileFilterRow />
      </ErrorBoundary>
      <ErrorBoundary>
        <RegionRibbon />
      </ErrorBoundary>
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-28 lg:pb-0">
        <ErrorBoundary>
          <BreakingNews />
        </ErrorBoundary>
        <ErrorBoundary>
          <ImpactFeed />
        </ErrorBoundary>
      </div>
      <ScrollToTopButton scrollContainerRef={scrollRef} />
    </>
  );
}
