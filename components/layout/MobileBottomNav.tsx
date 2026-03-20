'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Rss, TrendingUp, Star, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTerminalStore } from '@/lib/store';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/stock-sentiment', label: 'Sentiment', icon: Rss },
  { href: '/market-trends', label: 'Trading', icon: TrendingUp },
  { href: '/watchlist', label: 'Watchlist', icon: Star },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { userPlan, setUserPlan } = useTerminalStore();
  const isPremium = userPlan === 'premium';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Plan Badge - floating above nav bar, top right */}
      <div className="flex justify-end px-3 pb-2">
        <button
          onClick={() => setUserPlan(isPremium ? 'free' : 'premium')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors',
            isPremium
              ? 'bg-[#1A1305] border-amber-500/40 text-amber-400'
              : 'bg-[#0a1017] border-[#222F44] text-[#808080]'
          )}
        >
          <Crown size={14} />
          {isPremium ? 'Premium' : 'Free'}
        </button>
      </div>
      {/* Nav bar */}
      <div className="flex items-center justify-around h-16 px-2 bg-[#0F1924] border-t border-[#222F44]">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-2',
                active ? 'text-white' : 'text-slate-400'
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
