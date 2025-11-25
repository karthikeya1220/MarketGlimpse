'use client';

import { useState } from 'react';
import { ArrowUpDown, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SortOption = 'symbol-asc' | 'symbol-desc' | 'price-asc' | 'price-desc' | 'change-asc' | 'change-desc' | 'date-asc' | 'date-desc';
type FilterOption = 'all' | 'gainers' | 'losers' | 'has-notes' | 'has-tags';

interface WatchlistControlsProps {
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
}

export function WatchlistControls({ onSortChange, onFilterChange }: WatchlistControlsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const handleSortChange = (value: string) => {
    const newSort = value as SortOption;
    setSortBy(newSort);
    onSortChange(newSort);
  };

  const handleFilterChange = (value: string) => {
    const newFilter = value as FilterOption;
    setFilterBy(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-2 flex-1">
        <ArrowUpDown className="h-4 w-4 text-gray-400" />
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="symbol-asc">Symbol (A-Z)</SelectItem>
            <SelectItem value="symbol-desc">Symbol (Z-A)</SelectItem>
            <SelectItem value="price-desc">Price (High-Low)</SelectItem>
            <SelectItem value="price-asc">Price (Low-High)</SelectItem>
            <SelectItem value="change-desc">Top Gainers</SelectItem>
            <SelectItem value="change-asc">Top Losers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 flex-1">
        <Filter className="h-4 w-4 text-gray-400" />
        <Select value={filterBy} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stocks</SelectItem>
            <SelectItem value="gainers">Gainers Only</SelectItem>
            <SelectItem value="losers">Losers Only</SelectItem>
            <SelectItem value="has-notes">With Notes</SelectItem>
            <SelectItem value="has-tags">With Tags</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function sortWatchlist(items: StockWithData[], sortBy: SortOption): StockWithData[] {
  const sorted = [...items];

  switch (sortBy) {
    case 'symbol-asc':
      return sorted.sort((a, b) => a.symbol.localeCompare(b.symbol));
    case 'symbol-desc':
      return sorted.sort((a, b) => b.symbol.localeCompare(a.symbol));
    case 'price-asc':
      return sorted.sort((a, b) => (a.currentPrice ?? 0) - (b.currentPrice ?? 0));
    case 'price-desc':
      return sorted.sort((a, b) => (b.currentPrice ?? 0) - (a.currentPrice ?? 0));
    case 'change-asc':
      return sorted.sort((a, b) => (a.changePercent ?? 0) - (b.changePercent ?? 0));
    case 'change-desc':
      return sorted.sort((a, b) => (b.changePercent ?? 0) - (a.changePercent ?? 0));
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    default:
      return sorted;
  }
}

export function filterWatchlist(items: StockWithData[], filterBy: FilterOption): StockWithData[] {
  switch (filterBy) {
    case 'gainers':
      return items.filter((item) => (item.changePercent ?? 0) > 0);
    case 'losers':
      return items.filter((item) => (item.changePercent ?? 0) < 0);
    case 'has-notes':
      return items.filter((item) => item.notes && item.notes.trim().length > 0);
    case 'has-tags':
      return items.filter((item) => item.tags && item.tags.length > 0);
    case 'all':
    default:
      return items;
  }
}
