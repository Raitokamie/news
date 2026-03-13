'use client';

import { create } from 'zustand';
import { RegionTab, ImpactLevel, SortOrder } from './types';

interface TerminalStore {
  activeRegion: RegionTab;
  activeTicker: string | null;
  activeImpact: ImpactLevel | 'all';
  sortOrder: SortOrder;
  sidebarOpen: boolean;
  setRegion: (region: RegionTab) => void;
  setTicker: (ticker: string | null) => void;
  setImpact: (impact: ImpactLevel | 'all') => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSidebar: () => void;
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  activeRegion: 'global',
  activeTicker: null,
  activeImpact: 'all',
  sortOrder: 'latest',
  sidebarOpen: true,
  setRegion: (region) => set({ activeRegion: region, activeTicker: null }),
  setTicker: (ticker) => set((state) => ({
    activeTicker: state.activeTicker === ticker ? null : ticker,
  })),
  setImpact: (impact) => set({ activeImpact: impact }),
  setSortOrder: (order) => set({ sortOrder: order }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
