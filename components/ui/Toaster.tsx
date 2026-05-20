'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function Toaster() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const position = isMobile ? 'top-right' : 'bottom-right';

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
