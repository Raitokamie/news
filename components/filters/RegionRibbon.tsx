'use client';

import { cn } from '@/lib/utils';
import { RegionTab, Region, SortOrder } from '@/lib/types';
import { useTerminalStore } from '@/lib/store';
import { ChevronDown, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const tabs: { id: RegionTab; label: string }[] = [
  { id: 'global', label: 'Global' },
  { id: 'us', label: 'US' },
  { id: 'eu', label: 'EU' },
  { id: 'asia', label: 'Asia' },
  { id: 'mena', label: 'MENA' },
];

const countryLabels: Record<Region, string> = {
  global: 'Global',
  us: 'United States',
  eu: 'European Union',
  jp: 'Japan',
  ch: 'China',
  th: 'Thailand',
  sa: 'Saudi Arabia',
  ae: 'UAE',
  il: 'Israel',
  tr: 'Turkey',
};

// Country dropdown options per tab (จะถูกแทนที่ด้วย API data ในอนาคต)
const tabCountries: Record<RegionTab, Region[]> = {
  global: [],
  us: ['us'],
  eu: ['eu'],
  asia: ['jp', 'ch', 'th'],
  mena: ['sa', 'ae', 'il', 'tr'],
};

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'impact', label: 'By Impact' },
];

export default function RegionRibbon() {
  const { activeRegion, setRegion, sortOrder, setSortOrder } = useTerminalStore();
  const [sortOpen, setSortOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [activeCountry, setActiveCountry] = useState<Region | 'all'>('all');
  const sortRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setCountryOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset country when tab changes
  useEffect(() => {
    setActiveCountry('all');
  }, [activeRegion]);

  const currentSort = sortOptions.find((o) => o.value === sortOrder);
  const countries = tabCountries[activeRegion];

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-[#4D4D4D] bg-[#141414]">
      {/* Region tabs */}
      <div className="flex items-center gap-1">
        {tabs.map((t) => {
          const active = activeRegion === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setRegion(t.id)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                active
                  ? 'bg-transparent text-white border border-blue-500'
                  : 'bg-white/5 text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/8'
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Country dropdown */}
      <div className="relative shrink-0" ref={countryRef}>
        <button
          onClick={() => setCountryOpen(!countryOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/8 border border-white/8 rounded-md text-xs font-medium text-slate-300 transition-all"
        >
          <Globe size={14} className="text-slate-400" />
          <span>{activeCountry === 'all' ? 'All' : countryLabels[activeCountry]}</span>
          <ChevronDown size={12} className={cn('text-slate-500 transition-transform', countryOpen && 'rotate-180')} />
        </button>
        {countryOpen && (
          <div className="absolute top-full mt-1 left-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-md shadow-xl overflow-hidden min-w-[150px]">
            <button
              onClick={() => { setActiveCountry('all'); setCountryOpen(false); }}
              className={cn(
                'block w-full text-left px-3 py-2 text-xs hover:bg-white/8 transition-colors',
                activeCountry === 'all' ? 'text-cyan-400' : 'text-slate-400'
              )}
            >
              All
            </button>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => { setActiveCountry(c); setCountryOpen(false); }}
                className={cn(
                  'block w-full text-left px-3 py-2 text-xs hover:bg-white/8 transition-colors',
                  activeCountry === c ? 'text-cyan-400' : 'text-slate-400'
                )}
              >
                {countryLabels[c]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sort dropdown */}
      <div className="relative ml-auto shrink-0" ref={sortRef}>
        <button
          onClick={() => setSortOpen(!sortOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/8 border border-white/8 rounded-md text-xs font-medium text-slate-300 transition-all"
        >
          <span className="text-slate-500 text-[10px] uppercase tracking-wider">Sort By:</span>
          <span>{currentSort?.label}</span>
          <ChevronDown size={12} className={cn('text-slate-500 transition-transform', sortOpen && 'rotate-180')} />
        </button>
        {sortOpen && (
          <div className="absolute top-full mt-1 right-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-md shadow-xl overflow-hidden min-w-[110px]">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setSortOrder(opt.value); setSortOpen(false); }}
                className={cn(
                  'block w-full text-left px-3 py-2 text-xs hover:bg-white/8 transition-colors',
                  sortOrder === opt.value ? 'text-cyan-400' : 'text-slate-400'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
