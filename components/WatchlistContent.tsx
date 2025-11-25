'use client';

import { useMemo, useState } from 'react';
import WatchlistStats from './WatchlistStats';
import WatchlistActions from './WatchlistActions';
import WatchlistStockCard from './WatchlistStockCard';
import WatchlistTable from './WatchlistTable';

interface WatchlistContentProps {
  watchlistData: StockWithData[];
}

const WatchlistContent = ({ watchlistData }: WatchlistContentProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState('symbol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Calculate stats
  const stats = useMemo(() => {
    const totalStocks = watchlistData.length;
    const validChanges = watchlistData.filter((item) => item.changePercent !== undefined);
    const averageChange = validChanges.length > 0
      ? validChanges.reduce((sum, item) => sum + (item.changePercent || 0), 0) / validChanges.length
      : 0;
    const gainers = watchlistData.filter((item) => (item.changePercent || 0) > 0).length;
    const losers = watchlistData.filter((item) => (item.changePercent || 0) < 0).length;

    return { totalStocks, averageChange, gainers, losers };
  }, [watchlistData]);

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...watchlistData].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (sortBy) {
        case 'symbol':
          aValue = a.symbol;
          bValue = b.symbol;
          break;
        case 'company':
          aValue = a.company;
          bValue = b.company;
          break;
        case 'price':
          aValue = a.currentPrice || 0;
          bValue = b.currentPrice || 0;
          break;
        case 'change':
          aValue = a.changePercent || 0;
          bValue = b.changePercent || 0;
          break;
        case 'marketCap':
          aValue = a.marketCap || '';
          bValue = b.marketCap || '';
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  }, [watchlistData, sortBy, sortOrder]);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Stats */}
      <WatchlistStats {...stats} />

      {/* Actions */}
      <WatchlistActions
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sortedData.map((item, index) => (
            <WatchlistStockCard key={item.symbol} item={item} index={index} />
          ))}
        </div>
      ) : (
        <WatchlistTable watchlist={sortedData} />
      )}
    </div>
  );
};

export default WatchlistContent;
