'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LayoutContextValue {
  rightSidebarContent: ReactNode | null;
  setRightSidebarContent: (content: ReactNode | null) => void;
  useDefaultRightSidebar: boolean;
  setUseDefaultRightSidebar: (use: boolean) => void;
  showTopBar: boolean;
  setShowTopBar: (show: boolean) => void;
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [rightSidebarContent, setRightSidebarContentState] = useState<ReactNode | null>(null);
  const [useDefaultRightSidebar, setUseDefaultRightSidebarState] = useState(true);
  const [showTopBar, setShowTopBarState] = useState(true);

  const setRightSidebarContent = useCallback((content: ReactNode | null) => {
    setRightSidebarContentState(content);
  }, []);

  const setUseDefaultRightSidebar = useCallback((use: boolean) => {
    setUseDefaultRightSidebarState(use);
  }, []);

  const setShowTopBar = useCallback((show: boolean) => {
    setShowTopBarState(show);
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        rightSidebarContent,
        setRightSidebarContent,
        useDefaultRightSidebar,
        setUseDefaultRightSidebar,
        showTopBar,
        setShowTopBar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider');
  }
  return context;
}
