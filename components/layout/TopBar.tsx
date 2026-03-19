'use client';

import { Search, Bell, Menu } from 'lucide-react';
import { useTerminalStore } from '@/lib/store';

export default function TopBar() {
  const { toggleSidebar, searchQuery, setSearchQuery } = useTerminalStore();

  return (
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

        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symbols, news, or reports"
            className="w-full bg-[#111722] rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder:text-[#B3B3B3] focus:outline-none transition-all"
          />
        </div>

        {/* Bell */}
        <button className="relative p-2 rounded-lg bg-[#111722] hover:bg-[#252525] transition-colors text-white">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
      </div>
    </div>
  );
}
