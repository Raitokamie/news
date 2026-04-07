'use client';

import { Toaster as SonnerToaster } from 'sonner';

export default function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
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
