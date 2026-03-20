'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTerminalStore } from '@/lib/store';
import { RegionTab, Region, SortOrder } from '@/lib/types';
import { mockNews } from '@/lib/api';

const regionOptions: { id: RegionTab; label: string }[] = [
  { id: 'global', label: 'Global' },
  { id: 'us', label: 'US' },
  { id: 'eu', label: 'EU' },
  { id: 'asia', label: 'Asia' },
  { id: 'mena', label: 'MENA' },
];

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'impact', label: 'High Impact' },
  { value: 'oldest', label: 'Oldest' },
];

// Build countries per region from actual news data
const countriesByRegion: Record<RegionTab, Region[]> = { global: [], us: [], eu: [], asia: [], mena: [] };
for (const n of mockNews) {
  const c = n.countryCode as Region;
  if (c === 'global') continue;
  if (!countriesByRegion[n.regionTag].includes(c)) countriesByRegion[n.regionTag].push(c);
  if (!countriesByRegion.global.includes(c)) countriesByRegion.global.push(c);
}

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

export default function MobileFilterRow() {
  const { activeRegion, setRegion, activeCountry, setCountry, sortOrder, setSortOrder } = useTerminalStore();
  const [regionOpen, setRegionOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setRegionOpen(false);
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setCountryOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRegion = regionOptions.find((r) => r.id === activeRegion);
  const currentSort = sortOptions.find((o) => o.value === sortOrder);
  const countries = countriesByRegion[activeRegion];

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-[#222F44] bg-[#0a1017] md:hidden">
      {/* Region Dropdown */}
      <div className="relative" ref={regionRef}>
        <button
          onClick={() => setRegionOpen(!regionOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#222F44] rounded-lg text-sm font-bold text-white"
        >
          <span>{currentRegion?.label}</span>
          <ChevronDown size={14} className={cn('transition-transform', regionOpen && 'rotate-180')} />
        </button>
        {regionOpen && (
          <div className="absolute top-full mt-1 left-0 z-50 bg-[#1A1A1A] border border-[#222F44] rounded-lg shadow-xl min-w-[120px]">
            {regionOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setRegion(opt.id);
                  setRegionOpen(false);
                }}
                className={cn(
                  'block w-full text-left px-3 py-2 text-sm font-bold',
                  activeRegion === opt.id ? 'text-[#3B82F6] bg-[#3B82F6]/10' : 'text-white hover:bg-white/5'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Country Dropdown */}
      <div className="relative" ref={countryRef}>
        <button
          onClick={() => setCountryOpen(!countryOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#222F44] rounded-lg text-sm font-bold text-white"
        >
          <CountryFlag code={activeCountry === 'all' ? 'all' : activeCountry} size={16} />
          <span>{activeCountry === 'all' ? 'All' : activeCountry.toUpperCase()}</span>
          <ChevronDown size={14} className={cn('transition-transform', countryOpen && 'rotate-180')} />
        </button>
        {countryOpen && (
          <div className="absolute top-full mt-1 left-0 z-50 bg-[#1A1A1A] border border-[#222F44] rounded-lg shadow-xl min-w-[120px]">
            <button
              onClick={() => {
                setCountry('all');
                setCountryOpen(false);
              }}
              className={cn(
                'flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-bold',
                activeCountry === 'all' ? 'text-[#3B82F6] bg-[#3B82F6]/10' : 'text-white hover:bg-white/5'
              )}
            >
              <Globe size={16} />
              All
            </button>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCountry(c);
                  setCountryOpen(false);
                }}
                className={cn(
                  'flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-bold',
                  activeCountry === c ? 'text-[#3B82F6] bg-[#3B82F6]/10' : 'text-white hover:bg-white/5'
                )}
              >
                <CountryFlag code={c} size={16} />
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sort Dropdown */}
      <div className="relative ml-auto" ref={sortRef}>
        <button
          onClick={() => setSortOpen(!sortOpen)}
          className="flex items-center gap-2 p-2 bg-[#1A1A1A] border border-[#222F44] rounded-lg text-white"
        >
          <SlidersHorizontal size={18} />
          <ChevronDown size={14} className={cn('transition-transform', sortOpen && 'rotate-180')} />
        </button>
        {sortOpen && (
          <div className="absolute top-full mt-1 right-0 z-50 bg-[#1A1A1A] border border-[#222F44] rounded-lg shadow-xl min-w-[140px]">
            <div className="px-3 py-2 text-xs text-slate-400 border-b border-[#222F44]">Sort By</div>
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setSortOrder(opt.value);
                  setSortOpen(false);
                }}
                className={cn(
                  'block w-full text-left px-3 py-2 text-sm font-bold',
                  sortOrder === opt.value ? 'text-[#3B82F6] bg-[#3B82F6]/10' : 'text-white hover:bg-white/5'
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
