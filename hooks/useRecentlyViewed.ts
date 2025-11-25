'use client';

import { useState } from 'react';

export interface RecentStock {
  symbol: string;
  name: string;
  viewedAt: number;
}

const MAX_RECENT_STOCKS = 10;
const STORAGE_KEY = 'market_glimpse_recent_stocks';

function loadRecentStocks(): RecentStock[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored) as RecentStock[];
  } catch (error) {
    console.error('Failed to parse recent stocks:', error);
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function useRecentlyViewed() {
  const [recentStocks, setRecentStocks] = useState<RecentStock[]>(loadRecentStocks);

  const addRecentStock = (symbol: string, name: string) => {
    if (typeof window === 'undefined') return;

    setRecentStocks((prev) => {
      // Remove if already exists
      const filtered = prev.filter((stock) => stock.symbol !== symbol);

      // Add to front
      const updated = [
        {
          symbol,
          name,
          viewedAt: Date.now(),
        },
        ...filtered,
      ].slice(0, MAX_RECENT_STOCKS);

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      return updated;
    });
  };

  const clearRecentStocks = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      setRecentStocks([]);
    }
  };

  return {
    recentStocks,
    addRecentStock,
    clearRecentStocks,
  };
}
