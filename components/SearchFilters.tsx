'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchFiltersProps {
  selectedType: string;
  selectedExchange: string;
  sortBy: string;
  onTypeChange: (type: string) => void;
  onExchangeChange: (exchange: string) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

const SearchFilters = ({
  selectedType,
  selectedExchange,
  sortBy,
  onTypeChange,
  onExchangeChange,
  onSortChange,
  onClearFilters,
}: SearchFiltersProps) => {
  const stockTypes = ['All', 'Common Stock', 'ETF', 'ADR', 'REIT'];
  const exchanges = ['All', 'NASDAQ', 'NYSE', 'AMEX', 'OTC'];
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'symbol-asc', label: 'Symbol (A-Z)' },
    { value: 'symbol-desc', label: 'Symbol (Z-A)' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
  ];

  const hasActiveFilters = selectedType !== 'All' || selectedExchange !== 'All' || sortBy !== 'relevance';

  return (
    <Card className="border-gray-600 bg-gray-800/50 backdrop-blur-sm">
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-100">Filters</h3>
            </div>
            {hasActiveFilters && (
              <Button
                onClick={onClearFilters}
                variant="ghost"
                size="sm"
                className="h-8 text-sm text-gray-400 hover:text-gray-100"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stock Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Type</label>
              <div className="flex flex-wrap gap-2">
                {stockTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => onTypeChange(type)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-all duration-200 ${
                      selectedType === type
                        ? 'bg-yellow-500 text-gray-900 border-yellow-500 font-medium'
                        : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Exchange Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Exchange</label>
              <div className="flex flex-wrap gap-2">
                {exchanges.map((exchange) => (
                  <button
                    key={exchange}
                    onClick={() => onExchangeChange(exchange)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-all duration-200 ${
                      selectedExchange === exchange
                        ? 'bg-yellow-500 text-gray-900 border-yellow-500 font-medium'
                        : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {exchange}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-700 text-gray-300 border border-gray-600 rounded-md focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
