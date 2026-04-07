import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, { description, duration: 3000 });
  },
  error: (message: string, description?: string) => {
    sonnerToast.error(message, { description, duration: 4000 });
  },
  info: (message: string, description?: string) => {
    sonnerToast.info(message, { description, duration: 3000 });
  },
  loading: (message: string, description?: string) => {
    return sonnerToast.loading(message, { description });
  },
  // Red variant for destructive/remove actions (not an error, but visually distinct)
  warning: (message: string, description?: string) => {
    sonnerToast.error(message, { description, duration: 3000 });
  },
};

// Ticker-specific helpers for consistency
export const tickerToast = {
  added: (symbol: string, listType: 'watchlist' | 'sentiment') => {
    const listName = listType === 'watchlist' ? 'Watchlist' : 'Sentiment Tracker';
    toast.success(`Added ${symbol}`, `${symbol} has been added to your ${listName}`);
  },
  removed: (symbol: string, listType: 'watchlist' | 'sentiment') => {
    const listName = listType === 'watchlist' ? 'Watchlist' : 'Sentiment Tracker';
    toast.warning(`Removed ${symbol}`, `${symbol} has been removed from your ${listName}`);
  },
  alreadyAdded: (symbol: string, listType: 'watchlist' | 'sentiment') => {
    const listName = listType === 'watchlist' ? 'watchlist' : 'sentiment tracker';
    toast.info(`Already in ${listName}`, `${symbol} is already in your ${listName}`);
  },
};
