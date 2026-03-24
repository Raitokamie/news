'use client';

import { cn } from '@/lib/utils';
import { Region, SortOrder, Category, RegionTab } from '@/lib/types';
import { useTerminalStore } from '@/lib/store';
import { ChevronDown, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { mockNews } from '@/lib/api';

const categoryTabs: { id: Category; label: string }[] = [
  { id: 'markets', label: 'Markets' },
  { id: 'economic', label: 'Economic' },
  { id: 'politics', label: 'Politics' },
  { id: 'tech', label: 'Tech' },
  { id: 'industry', label: 'Industry' },
];

const otherOptions: { id: Category; label: string }[] = [
  { id: 'commodities', label: 'Commodities' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'energy', label: 'Energy' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'real-estate', label: 'Real Estate' },
];

// Categories that appear in the "Other" dropdown
const otherCategoryIds: Category[] = ['commodities', 'crypto', 'energy', 'healthcare', 'real-estate'];

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

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'impact', label: 'High Impact' },
  { value: 'oldest', label: 'Oldest' },
];

export default function RegionRibbon() {
  const { activeRegion, activeCountry, setCountry, activeCategory, setCategory, sortOrder, setSortOrder } = useTerminalStore();
  const [sortOpen, setSortOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const otherRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
      if (otherRef.current && !otherRef.current.contains(e.target as Node)) setOtherOpen(false);
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setCountryOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSort = sortOptions.find((o) => o.value === sortOrder);
  const countries = countriesByRegion[activeRegion];

  return (
    <div className="hidden md:flex items-center gap-3 px-4 py-3 border-b border-[#222F44] bg-[#0a1017]">
      {/* Category tabs + Country + Sort */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex items-center gap-6">
          {categoryTabs.map((t) => {
            const active = activeCategory === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setCategory(t.id)}
                className={cn(
                  'relative px-1 py-2 text-sm font-semibold transition-all',
                  active
                    ? 'text-[#3B82F6]'
                    : 'text-white hover:text-[#3B82F6]'
                )}
              >
                {t.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B82F6]" />
                )}
              </button>
            );
          })}

          {/* Other dropdown */}
          <div className="relative" ref={otherRef}>
            {(() => {
              const isOtherActive = otherCategoryIds.includes(activeCategory);
              const selectedOther = otherOptions.find((o) => o.id === activeCategory);
              return (
                <>
                  <button
                    onClick={() => setOtherOpen(!otherOpen)}
                    className={cn(
                      'relative flex items-center gap-1 px-1 py-2 text-sm font-semibold transition-all',
                      isOtherActive
                        ? 'text-[#3B82F6]'
                        : 'text-white hover:text-[#3B82F6]'
                    )}
                  >
                    {selectedOther ? selectedOther.label : 'Other'}
                    <ChevronDown size={14} className={cn('transition-transform', otherOpen && 'rotate-180')} />
                    {isOtherActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B82F6]" />
                    )}
                  </button>
                  {otherOpen && (
                    <div className="absolute top-full mt-2 left-0 z-50 bg-[#1A1A1A] border border-[#222F44] rounded-lg shadow-xl overflow-hidden min-w-[150px]">
                      {otherOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setCategory(opt.id);
                            setOtherOpen(false);
                          }}
                          className={cn(
                            'block w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors',
                            activeCategory === opt.id
                              ? 'text-[#3B82F6] bg-[#3B82F6]/10'
                              : 'text-white hover:bg-white/8'
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {/* Country dropdown */}
        <div className="relative ml-auto shrink-0" ref={countryRef}>
          <button
            onClick={() => setCountryOpen(!countryOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#222F44] rounded-lg text-sm font-bold text-white transition-all"
          >
            <CountryFlag code={activeCountry === 'all' ? 'all' : activeCountry} size={16} />
            <span>{activeCountry === 'all' ? 'All' : activeCountry.toUpperCase()}</span>
            <ChevronDown size={14} className={cn('text-white transition-transform', countryOpen && 'rotate-180')} />
          </button>
          {countryOpen && (
            <div className="absolute top-full mt-1 right-0 z-50 bg-[#1A1A1A] border border-[#222F44] rounded-lg shadow-xl overflow-hidden min-w-[150px]">
              <button
                onClick={() => { setCountry('all'); setCountryOpen(false); }}
                className={cn(
                  'flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors',
                  activeCountry === 'all'
                    ? 'text-[#3B82F6] bg-[#3B82F6]/10'
                    : 'text-white hover:bg-white/8'
                )}
              >
                <Globe size={18} />
                All
              </button>
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCountry(c); setCountryOpen(false); }}
                  className={cn(
                    'flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors',
                    activeCountry === c
                      ? 'text-[#3B82F6] bg-[#3B82F6]/10'
                      : 'text-white hover:bg-white/8'
                  )}
                >
                  <CountryFlag code={c} size={18} />
                  {c.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative shrink-0" ref={sortRef}>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#222F44] rounded-lg text-sm font-bold text-white transition-all"
          >
            <span className="text-white text-sm font-bold">Sort By:</span>
            <span>{currentSort?.label}</span>
            <ChevronDown size={14} className={cn('text-white transition-transform', sortOpen && 'rotate-180')} />
          </button>
          {sortOpen && (
            <div className="absolute top-full mt-1 right-0 z-50 bg-[#1A1A1A] border border-[#222F44] rounded-lg shadow-xl overflow-hidden min-w-[140px]">
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
    </div>
  );
}
