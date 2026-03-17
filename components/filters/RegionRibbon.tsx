'use client';

import { cn } from '@/lib/utils';
import { RegionTab, Region, SortOrder } from '@/lib/types';
import { useTerminalStore } from '@/lib/store';
import { mockNews } from '@/lib/api';
import { ChevronDown, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const tabs: { id: RegionTab; label: string }[] = [
  { id: 'global', label: 'Global' },
  { id: 'us', label: 'US' },
  { id: 'eu', label: 'EU' },
  { id: 'asia', label: 'Asia' },
  { id: 'mena', label: 'MENA' },
];

const countryShortCodes: Record<Region, string> = {
  global: 'Global',
  us: 'US',
  eu: 'EU',
  jp: 'JP',
  cn: 'CN',
  th: 'TH',
  sa: 'SA',
  ae: 'AE',
  il: 'IL',
  tr: 'TR',
  in: 'IN',
  kr: 'KR',
};

function CountryFlag({ code, size = 20 }: { code: Region | 'all'; size?: number }) {
  if (code === 'all' || code === 'global') {
    return <Globe size={size} className="text-white" />;
  }
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      alt={code}
      className="w-5 h-5 rounded-full object-cover"
    />
  );
}

// Build countries per region from actual news data
const countriesByRegion: Record<RegionTab, Region[]> = { global: [], us: [], eu: [], asia: [], mena: [] };
for (const n of mockNews) {
  const c = n.countryCode as Region;
  if (c === 'global') continue;
  if (!countriesByRegion[n.regionTag].includes(c)) countriesByRegion[n.regionTag].push(c);
  if (!countriesByRegion.global.includes(c)) countriesByRegion.global.push(c);
}

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'impact', label: 'High Impact' },
  { value: 'oldest', label: 'Oldest' },
];

export default function RegionRibbon() {
  const { activeRegion, setRegion, activeCountry, setCountry, sortOrder, setSortOrder } = useTerminalStore();
  const [sortOpen, setSortOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
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

  const currentSort = sortOptions.find((o) => o.value === sortOrder);
  const countries = countriesByRegion[activeRegion];

  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b border-[#4D4D4D] bg-[#141414]">
      {/* Region tabs */}
      <div className="flex items-center gap-1">
        {tabs.map((t) => {
          const active = activeRegion === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setRegion(t.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-bold transition-all',
                active
                  ? 'bg-transparent text-[#3B82F6] border border-[#3B82F6]'
                  : 'bg-[#1A1A1A] text-white border border-[#4D4D4D] hover:bg-[#2A2A2A]'
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-[#4D4D4D]" />

      {/* Country dropdown */}
      <div className="relative shrink-0" ref={countryRef}>
        <button
          onClick={() => setCountryOpen(!countryOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#4D4D4D] rounded-lg text-sm font-bold text-white transition-all"
        >
          <CountryFlag code={activeCountry === 'all' ? 'all' : activeCountry} size={16} />
          <span>{activeCountry === 'all' ? 'All' : countryShortCodes[activeCountry]}</span>
          <ChevronDown size={14} className={cn('text-white transition-transform', countryOpen && 'rotate-180')} />
        </button>
        {countryOpen && (
          <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-md shadow-xl overflow-hidden">
            <button
              onClick={() => { setCountry('all'); setCountryOpen(false); }}
              className={cn(
                'flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm font-bold transition-colors relative',
                activeCountry === 'all'
                  ? 'text-white bg-[#3B82F6]/20 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#3B82F6]'
                  : 'text-white hover:bg-white/8'
              )}
            >
              <CountryFlag code="all" size={18} />
              All
            </button>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => { setCountry(c); setCountryOpen(false); }}
                className={cn(
                  'flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm font-bold transition-colors relative',
                  activeCountry === c
                    ? 'text-white bg-[#3B82F6]/20 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#3B82F6]'
                    : 'text-white hover:bg-white/8'
                )}
              >
                <CountryFlag code={c} size={18} />
                {countryShortCodes[c]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sort dropdown */}
      <div className="relative ml-auto shrink-0" ref={sortRef}>
        <button
          onClick={() => setSortOpen(!sortOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#4D4D4D] rounded-lg text-sm font-bold text-white transition-all"
        >
          <span className="text-white text-sm font-bold">Sort By:</span>
          <span>{currentSort?.label}</span>
          <ChevronDown size={14} className={cn('text-white transition-transform', sortOpen && 'rotate-180')} />
        </button>
        {sortOpen && (
          <div className="absolute top-full mt-1 right-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-lg shadow-xl overflow-hidden min-w-[140px]">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setSortOrder(opt.value); setSortOpen(false); }}
                className={cn(
                  'block w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-white/8 transition-colors',
                  sortOrder === opt.value ? 'text-white bg-white/5' : 'text-white'
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
