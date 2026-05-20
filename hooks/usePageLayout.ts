'use client';

import { useEffect, ReactNode, useRef } from 'react';
import { useLayout } from '@/components/layout/LayoutProvider';

/**
 * Hook to configure the page layout (sidebar content)
 * Call this in page components to customize the right sidebar
 */
export function usePageLayout(options?: {
  rightSidebar?: ReactNode | null;
  useDefaultSidebar?: boolean;
  showTopBar?: boolean;
}) {
  const { setRightSidebarContent, setUseDefaultRightSidebar, setShowTopBar } = useLayout();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Set content on mount or when useDefaultSidebar changes
    if (options?.rightSidebar !== undefined) {
      setRightSidebarContent(options.rightSidebar);
    }
    if (options?.useDefaultSidebar !== undefined) {
      setUseDefaultRightSidebar(options.useDefaultSidebar);
    }
    if (options?.showTopBar !== undefined) {
      setShowTopBar(options.showTopBar);
    }

    isInitialMount.current = false;

    // Reset to defaults on unmount
    return () => {
      setRightSidebarContent(null);
      setUseDefaultRightSidebar(true);
      setShowTopBar(true);
    };
  }, [
    options?.rightSidebar,
    options?.useDefaultSidebar,
    options?.showTopBar,
    setRightSidebarContent,
    setUseDefaultRightSidebar,
    setShowTopBar,
  ]);

  // Update sidebar content when it changes (but not on every render)
  useEffect(() => {
    if (!isInitialMount.current && options?.rightSidebar !== undefined) {
      setRightSidebarContent(options.rightSidebar);
    }
  }, [options?.rightSidebar, setRightSidebarContent]);
}
