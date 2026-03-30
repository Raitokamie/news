'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RangeOption<T extends string = string> {
  value: T;
  label: string;
}

interface RangeDropdownProps<T extends string = string> {
  options: RangeOption<T>[];
  value: T;
  onChange: (value: T) => void;
  showLabel?: boolean;
  fullWidth?: boolean;
}

export default function RangeDropdown<T extends string = string>({
  options,
  value,
  onChange,
  showLabel = true,
  fullWidth = false,
}: RangeDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = options.find((o) => o.value === value)?.label ?? options[0]?.label ?? '';

  return (
    <div className={cn("flex items-center gap-2", fullWidth ? "flex-1" : "shrink-0")}>
      {showLabel && <span className="text-sm font-medium text-white hidden sm:inline">Range:</span>}
      <div className={cn("relative", fullWidth && "flex-1")} ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "px-3 py-1.5 bg-[#1A1A1A] border border-[#222F44] rounded-xl text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2",
            fullWidth && "w-full justify-between"
          )}
        >
          {currentLabel}
          <ChevronDown
            size={12}
            className={cn('text-white transition-transform', open && 'rotate-180')}
          />
        </button>
        {open && (
          <div className="absolute top-full mt-1 right-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-lg shadow-xl overflow-hidden min-w-[140px]">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  'block w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-white/8 transition-colors',
                  value === opt.value ? 'text-[#0D7FF2] bg-white/5' : 'text-white'
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
