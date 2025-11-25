'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LayoutGrid, List } from 'lucide-react';

interface WatchlistActionsProps {
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

const WatchlistActions = ({
  viewMode,
  onViewModeChange,
}: WatchlistActionsProps) => {
  return (
    <Card className="border-gray-600 bg-gray-800/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-100">View Mode</span>

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
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchlistActions;
