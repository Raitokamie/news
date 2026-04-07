'use client';

import { useEffect, useState } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

export default function Toaster() {
  const [position, setPosition] = useState<'bottom-right' | 'top-right'>('bottom-right');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    if (mediaQuery.matches) {
      setPosition('top-right');
    }

    const handler = (e: MediaQueryListEvent) => {
      setPosition(e.matches ? 'top-right' : 'bottom-right');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <SonnerToaster
      position={position}
      toastOptions={{
        style: {
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
        },
        className: 'font-sans',
        unstyled: false,
      }}
      theme="dark"
      richColors
      closeButton
      duration={3000}
      visibleToasts={3}
      expand={false}
    />
  );
}
