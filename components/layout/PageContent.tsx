'use client';

import { ReactNode } from 'react';
import TopBar from './TopBar';
import RightSidebar from './RightSidebar';
import { useLayout } from './LayoutProvider';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface PageContentProps {
  children: ReactNode;
}

export default function PageContent({ children }: PageContentProps) {
  const { rightSidebarContent, useDefaultRightSidebar } = useLayout();

  return (
    <div className="flex h-full bg-[#0a1017]">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ErrorBoundary>
          <TopBar />
        </ErrorBoundary>
        {children}
      </div>

      {/* Right sidebar - either default or custom */}
      {useDefaultRightSidebar ? (
        <ErrorBoundary>
          <RightSidebar />
        </ErrorBoundary>
      ) : rightSidebarContent ? (
        <ErrorBoundary>
          {rightSidebarContent}
        </ErrorBoundary>
      ) : null}
    </div>
  );
}
