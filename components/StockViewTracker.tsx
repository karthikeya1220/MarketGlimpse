'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

interface StockViewTrackerProps {
  symbol: string;
  name: string;
}

export function StockViewTracker({ symbol, name }: StockViewTrackerProps) {
  const { addRecentStock } = useRecentlyViewed();

  useEffect(() => {
    addRecentStock(symbol, name);
  }, [symbol, name, addRecentStock]);

  return null;
}
