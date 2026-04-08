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
}) {
  const { setRightSidebarContent, setUseDefaultRightSidebar } = useLayout();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Set content on mount or when useDefaultSidebar changes
    if (options?.rightSidebar !== undefined) {
      setRightSidebarContent(options.rightSidebar);
    }
    if (options?.useDefaultSidebar !== undefined) {
      setUseDefaultRightSidebar(options.useDefaultSidebar);
    }

    isInitialMount.current = false;

    // Reset to defaults on unmount
    return () => {
      setRightSidebarContent(null);
      setUseDefaultRightSidebar(true);
    };
  }, [
    // Only depend on boolean flag, not the ReactNode content itself
    options?.useDefaultSidebar,
    setRightSidebarContent,
    setUseDefaultRightSidebar,
  ]);

  // Update sidebar content when it changes (but not on every render)
  useEffect(() => {
    if (!isInitialMount.current && options?.rightSidebar !== undefined) {
      setRightSidebarContent(options.rightSidebar);
    }
  }, [options?.rightSidebar, setRightSidebarContent]);
}
