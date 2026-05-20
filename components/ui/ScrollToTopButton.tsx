'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToTopButtonProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  threshold?: number;
}

export default function ScrollToTopButton({
  scrollContainerRef,
  threshold = 300,
}: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setVisible(container.scrollTop > threshold);
    }
  }, [scrollContainerRef, threshold]);

  const scrollToTop = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollContainerRef, handleScroll]);

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        'fixed bottom-24 md:bottom-6 right-6 z-40 p-3 rounded-full bg-[#0D7FF2] text-white shadow-lg transition-all duration-300 hover:bg-[#0B6FD4] hover:scale-110',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <ArrowUp size={20} />
    </button>
  );
}
