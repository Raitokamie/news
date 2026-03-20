'use client';

import { create } from 'zustand';
import { RegionTab, Region, ImpactLevel, SortOrder } from './types';

interface TerminalStore {
  activeRegion: RegionTab;
  activeCountry: Region | 'all';
  activeTicker: string | null;
  activeImpact: ImpactLevel | 'all';
  sortOrder: SortOrder;
  sidebarOpen: boolean;
  selectedSymbols: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchOverlayOpen: boolean;
  trackedTickers: string[];
  sentimentTickers: string[];
  telegramConnected: boolean;
  userPlan: 'free' | 'premium';
  mobileSentiment: 'bad' | 'good';
  setUserPlan: (plan: 'free' | 'premium') => void;
  setMobileSentiment: (sentiment: 'bad' | 'good') => void;
  setRegion: (region: RegionTab) => void;
  setCountry: (country: Region | 'all') => void;
  setTicker: (ticker: string | null) => void;
  setImpact: (impact: ImpactLevel | 'all') => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSidebar: () => void;
  addTicker: (symbol: string) => void;
  removeTicker: (symbol: string) => void;
  addSentimentTicker: (symbol: string) => void;
  removeSentimentTicker: (symbol: string) => void;
  toggleSymbol: (symbol: string) => void;
  removeSymbol: (symbol: string) => void;
  clearSymbols: () => void;
  openSearchOverlay: () => void;
  closeSearchOverlay: () => void;
  connectTelegram: () => void;
  disconnectTelegram: () => void;
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  activeRegion: 'global',
  activeCountry: 'all',
  activeTicker: null,
  activeImpact: 'all',
  sortOrder: 'latest',
  sidebarOpen: false,
  setRegion: (region) => set({ activeRegion: region, activeCountry: 'all', activeTicker: null }),
  setCountry: (country) => set({ activeCountry: country }),
  setTicker: (ticker) => set((state) => ({
    activeTicker: state.activeTicker === ticker ? null : ticker,
  })),
  setImpact: (impact) => set({ activeImpact: impact }),
  setSortOrder: (order) => set({ sortOrder: order }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  selectedSymbols: [],
  toggleSymbol: (symbol) => set((state) => ({
    selectedSymbols: state.selectedSymbols.includes(symbol)
      ? state.selectedSymbols.filter((s) => s !== symbol)
      : [...state.selectedSymbols, symbol],
  })),
  removeSymbol: (symbol) => set((state) => ({
    selectedSymbols: state.selectedSymbols.filter((s) => s !== symbol),
  })),
  clearSymbols: () => set({ selectedSymbols: [] }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchOverlayOpen: false,
  openSearchOverlay: () => set({ searchOverlayOpen: true }),
  closeSearchOverlay: () => set({ searchOverlayOpen: false }),
  telegramConnected: false,
  userPlan: 'free',
  setUserPlan: (plan) => set({ userPlan: plan }),
  mobileSentiment: 'bad',
  setMobileSentiment: (sentiment) => set({ mobileSentiment: sentiment }),
  connectTelegram: () => set({ telegramConnected: true }),
  disconnectTelegram: () => set({ telegramConnected: false }),
  trackedTickers: [],
  addTicker: (symbol) => set((state) => ({
    trackedTickers: state.trackedTickers.includes(symbol) ? state.trackedTickers : [...state.trackedTickers, symbol],
  })),
  removeTicker: (symbol) => set((state) => ({
    trackedTickers: state.trackedTickers.filter((t) => t !== symbol),
  })),
  sentimentTickers: [],
  addSentimentTicker: (symbol) => set((state) => ({
    sentimentTickers: state.sentimentTickers.includes(symbol) ? state.sentimentTickers : [...state.sentimentTickers, symbol],
  })),
  removeSentimentTicker: (symbol) => set((state) => ({
    sentimentTickers: state.sentimentTickers.filter((t) => t !== symbol),
  })),
}));
