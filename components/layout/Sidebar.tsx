'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Rss, TrendingUp, Star, KeyRound, Settings, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import LiveUpdateWidget from './LiveUpdateWidget';
import { useTerminalStore } from '@/lib/store';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/high-signal', label: 'Stock Sentiment', icon: Rss },
  { href: '/market-trends', label: 'Market Trends', icon: TrendingUp },
  { href: '/watchlist', label: 'Watchlist', icon: Star, locked: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useTerminalStore();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col min-h-screen bg-[#141414] border-r border-[#4D4D4D] shrink-0 z-40 transition-all duration-300',
          // Desktop: always visible, fixed width
          'lg:relative lg:translate-x-0 lg:w-56',
          // Mobile: overlay, slide in/out
          'fixed top-0 left-0 h-full w-72',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-widest text-[#0D7FF2] uppercase ">
              Impact Terminal
            </span>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, locked }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-white/8 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                )}
              >
                <Icon size={16} className={active ? 'text-white' : 'text-slate-500'} />
                {label}
                {locked && <KeyRound size={14} className="ml-auto text-slate-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Live Update */}
        <div className="px-3 pb-3">
          <LiveUpdateWidget />
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-[#4D4D4D]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Send size={12} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Elon Musk</div>
                <div className="text-xs text-slate-500">Free Plan</div>
              </div>
            </div>
            <button className="text-slate-500 hover:text-slate-300 transition-colors">
              <Settings size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
