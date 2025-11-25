'use client';

import { useMemo, useState } from 'react';
import WatchlistStats from './WatchlistStats';
import WatchlistActions from './WatchlistActions';
import WatchlistStockCard from './WatchlistStockCard';
import WatchlistTable from './WatchlistTable';
import { WatchlistControls, sortWatchlist, filterWatchlist } from './WatchlistControls';

interface WatchlistContentProps {
  watchlistData: StockWithData[];
  onUpdate?: () => void;
}

const WatchlistContent = ({ watchlistData, onUpdate }: WatchlistContentProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'symbol-asc' | 'symbol-desc' | 'price-asc' | 'price-desc' | 'change-asc' | 'change-desc' | 'date-asc' | 'date-desc'>('date-desc');
  const [filterBy, setFilterBy] = useState<'all' | 'gainers' | 'losers' | 'has-notes' | 'has-tags'>('all');

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

  // Apply filtering and sorting
  const processedData = useMemo(() => {
    const filtered = filterWatchlist(watchlistData, filterBy);
    const sorted = sortWatchlist(filtered, sortBy);
    return sorted;
  }, [watchlistData, filterBy, sortBy]);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Stats */}
      <WatchlistStats {...stats} />

      {/* Controls - Sort and Filter */}
      <WatchlistControls 
        onSortChange={setSortBy}
        onFilterChange={setFilterBy}
      />

      {/* Actions */}
      <WatchlistActions
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Content */}
      {processedData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No stocks match your filter criteria</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {processedData.map((item, index) => (
            <WatchlistStockCard key={item.symbol} item={item} index={index} onUpdate={onUpdate} />
          ))}
        </div>
      ) : (
        <WatchlistTable watchlist={processedData} />
      )}
    </div>
  );
};

export default WatchlistContent;
