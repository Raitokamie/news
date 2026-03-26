import React from 'react';
import { Globe } from 'lucide-react';
import { Category, Region, RegionTab, SortOrder } from './types';
import { mockNews } from './api';

// ─── Categories ──────────────────────────────────────────────────────────

// ─── Main tabs shown on desktop ribbon ───────────────────────────────
export const categoryTabs: { id: Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'markets', label: 'Markets' },
  { id: 'economy', label: 'Economy' },
  { id: 'geopolitics', label: 'Geopolitics' },
  { id: 'tech', label: 'Tech' },
  { id: 'ai', label: 'AI' },
];

// ─── "Other" dropdown on desktop ─────────────────────────────────────
export const otherOptions: { id: Category; label: string }[] = [
  { id: 'crypto', label: 'Crypto' },
  { id: 'energy', label: 'Energy' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'climate', label: 'Climate' },
  { id: 'defense', label: 'Defense' },
  { id: 'banking', label: 'Banking' },
  { id: 'automotive', label: 'Automotive' },
  { id: 'trade', label: 'Trade' },
];

// For Desktop: Categories that appear in the "Other" dropdown
export const otherCategoryIds: Category[] = otherOptions.map((o) => o.id);

// For Mobile: Combined list (main tabs first, then others, "All" at top)
export const categoryOptions: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'markets', label: 'Markets' },
  { id: 'economy', label: 'Economy' },
  { id: 'geopolitics', label: 'Geopolitics' },
  { id: 'tech', label: 'Tech' },
  { id: 'ai', label: 'AI' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'energy', label: 'Energy' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'climate', label: 'Climate' },
  { id: 'defense', label: 'Defense' },
  { id: 'banking', label: 'Banking' },
  { id: 'automotive', label: 'Automotive' },
  { id: 'trade', label: 'Trade' },
];

// ─── Sorting ─────────────────────────────────────────────────────────────

export const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'impact', label: 'High Impact' },
  { value: 'oldest', label: 'Oldest' },
];

// ─── Countries ───────────────────────────────────────────────────────────

// Build countries per region from actual news data, sorted A-Z
export const countriesByRegion: Record<RegionTab, Region[]> = { global: [], us: [], eu: [], asia: [], mena: [] };
for (const n of mockNews) {
  const c = n.countryCode as Region;
  if (c === 'global') continue;
  if (!countriesByRegion[n.regionTag].includes(c)) countriesByRegion[n.regionTag].push(c);
  if (!countriesByRegion.global.includes(c)) countriesByRegion.global.push(c);
}
for (const key of Object.keys(countriesByRegion) as RegionTab[]) {
  countriesByRegion[key].sort();
}

// Shared Country Flag Component
export function CountryFlag({ code, size = 20 }: { code: Region | 'all'; size?: number }) {
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
