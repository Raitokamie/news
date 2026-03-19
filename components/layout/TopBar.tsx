'use client';

import { Search, Bell, Menu } from 'lucide-react';
import { useTerminalStore } from '@/lib/store';
import dynamic from 'next/dynamic';

const SearchOverlay = dynamic(() => import('@/components/search/SearchOverlay'), { ssr: false });

export default function TopBar() {
  const { toggleSidebar, searchOverlayOpen, openSearchOverlay } = useTerminalStore();

  return (
    <>
      <div className="sticky top-0 z-20 bg-[#0a1017] backdrop-blur-md border-b border-[#222F44] px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Hamburger — visible on mobile only */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-white/8 transition-colors text-slate-400 hover:text-slate-200"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          {/* Search trigger — opens overlay on click/focus */}
          <button
            id="topbar-search-trigger"
            onClick={openSearchOverlay}
            className="relative flex-1 flex items-center gap-2 bg-[#111722] hover:bg-[#171f2e] rounded-lg px-3 py-2 text-sm text-slate-500 transition-all cursor-text text-left group"
            aria-label="Open search"
          >
            <Search size={15} className="text-slate-400 shrink-0 group-hover:text-slate-300 transition-colors" />
            <span className="flex-1 text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
              Search symbols, news, or reports…
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 bg-white/6 rounded border border-white/10">
              /
            </kbd>
          </button>

          {/* Bell */}
          <button className="relative p-2 rounded-lg bg-[#111722] hover:bg-[#252525] transition-colors text-white">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* Search Overlay — portal-style, rendered at top level */}
      {searchOverlayOpen && <SearchOverlay />}
    </>
  );
}
