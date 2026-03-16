'use client';

import { Search, Bell, Menu } from 'lucide-react';
import { useTerminalStore } from '@/lib/store';

export default function TopBar() {
  const { toggleSidebar } = useTerminalStore();

  return (
    <div className="sticky top-0 z-20 bg-[#141414]/90 backdrop-blur-md border-b border-[#4D4D4D] px-4 py-3">
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search symbols, news, or reports"
            className="w-full bg-white/5 border border-[#4D4D4D] rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"
          />
        </div>

        {/* Bell */}
        <button className="relative p-2 rounded-lg hover:bg-white/8 transition-colors text-slate-400 hover:text-slate-200">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
        </button>
      </div>
    </div>
  );
}
