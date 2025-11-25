'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

export function RecentlyViewedStocks() {
  const { recentStocks, clearRecentStocks } = useRecentlyViewed();

  if (recentStocks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recently Viewed
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearRecentStocks}
          className="h-8 text-muted-foreground hover:text-foreground"
        >
          Clear
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {recentStocks.map((stock) => (
            <Link
              key={stock.symbol}
              href={`/stocks/${stock.symbol}`}
              className="group flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span className="font-medium">{stock.symbol}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{stock.name}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
