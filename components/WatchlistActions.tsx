'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Filter, LayoutGrid, List, SortAsc, SortDesc } from 'lucide-react';

interface WatchlistActionsProps {
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

const WatchlistActions = ({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
}: WatchlistActionsProps) => {
  const sortOptions = [
    { value: 'symbol', label: 'Symbol' },
    { value: 'company', label: 'Company' },
    { value: 'price', label: 'Price' },
    { value: 'change', label: 'Change %' },
    { value: 'marketCap', label: 'Market Cap' },
  ];

  return (
    <Card className="border-gray-600 bg-gray-800/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left: Filter Info */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-100">View Options</span>
          </div>

          {/* Right: View Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-yellow-500 text-gray-900'
                    : 'text-gray-400 hover:text-gray-100'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'table'
                    ? 'bg-yellow-500 text-gray-900'
                    : 'text-gray-400 hover:text-gray-100'
                }`}
                title="Table View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="px-3 py-2 text-sm bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Sort Order */}
              <button
                onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-gray-700 border border-gray-600 rounded-lg hover:border-yellow-500 transition-colors"
                title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4 text-gray-300" />
                ) : (
                  <SortDesc className="h-4 w-4 text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchlistActions;
