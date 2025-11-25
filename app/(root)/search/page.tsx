'use client';

import { useState, useEffect, useMemo } from 'react';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import { useDebounce } from '@/hooks/useDebounce';
import { Loader2, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SearchFilters from '@/components/SearchFilters';
import StockCard from '@/components/StockCard';
import { Card, CardContent } from '@/components/ui/card';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Filter states
  const [selectedType, setSelectedType] = useState('All');
  const [selectedExchange, setSelectedExchange] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // Load popular stocks when search is empty
      setLoading(true);
      try {
        const results = await searchStocks('');
        setStocks(results);
      } catch {
        setStocks([]);
      } finally {
        setLoading(false);
        setHasSearched(true);
      }
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce(handleSearch, 500);

  useEffect(() => {
    debouncedSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Load popular stocks on mount
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and sort stocks
  const filteredAndSortedStocks = useMemo(() => {
    let result = [...stocks];

    // Apply type filter
    if (selectedType !== 'All') {
      result = result.filter((stock) => stock.type === selectedType);
    }

    // Apply exchange filter
    if (selectedExchange !== 'All') {
      result = result.filter((stock) => 
        stock.exchange.toUpperCase().includes(selectedExchange.toUpperCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'symbol-asc':
        result.sort((a, b) => a.symbol.localeCompare(b.symbol));
        break;
      case 'symbol-desc':
        result.sort((a, b) => b.symbol.localeCompare(a.symbol));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // relevance - keep original order
        break;
    }

    return result;
  }, [stocks, selectedType, selectedExchange, sortBy]);

  const handleClearFilters = () => {
    setSelectedType('All');
    setSelectedExchange('All');
    setSortBy('relevance');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-3">
            <Search className="h-8 w-8 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100">
              Search Stocks
            </h1>
            <p className="text-gray-400 text-base md:text-lg mt-1">
              Discover stocks, ETFs, and securities from global markets
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <Card className="border-gray-600 bg-gray-800/50 backdrop-blur-sm">
        <CardContent className="p-4 md:p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by company name or symbol (e.g., AAPL, Tesla, Microsoft)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-12 h-14 text-base bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500"
            />
            {loading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-500 animate-spin" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <SearchFilters
        selectedType={selectedType}
        selectedExchange={selectedExchange}
        sortBy={sortBy}
        onTypeChange={setSelectedType}
        onExchangeChange={setSelectedExchange}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
      />

      {/* Search Results Section */}
      <div className="space-y-4">
        {/* Results Header */}
        {hasSearched && !loading && (
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-100">
                {searchTerm.trim() ? 'Search Results' : 'Popular Stocks'}
              </h2>
              {filteredAndSortedStocks.length > 0 && (
                <span className="px-2.5 py-1 text-sm font-medium bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20">
                  {filteredAndSortedStocks.length}
                </span>
              )}
            </div>
            
            {filteredAndSortedStocks.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {selectedType !== 'All' || selectedExchange !== 'All' ? 'Filtered results' : 'All results'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && !hasSearched && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-yellow-500" />
            <p className="text-lg">Loading stocks...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && hasSearched && filteredAndSortedStocks.length === 0 && (
          <Card className="border-gray-600 bg-gray-800/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-700/50 rounded-full p-6 mb-4">
                <Search className="h-12 w-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                No results found
              </h3>
              <p className="text-gray-400 max-w-md mb-6">
                {searchTerm.trim()
                  ? `We couldn't find any stocks matching "${searchTerm}"`
                  : 'No stocks available at the moment'}
                {(selectedType !== 'All' || selectedExchange !== 'All') && 
                  ' with the selected filters'}.
              </p>
              {(selectedType !== 'All' || selectedExchange !== 'All') && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Grid */}
        {!loading && filteredAndSortedStocks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredAndSortedStocks.map((stock, index) => (
              <StockCard key={stock.symbol} stock={stock} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Keyboard Shortcut Hint */}
      <Card className="border-gray-600 bg-gradient-to-r from-gray-800/50 to-gray-800/30 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span>Pro tip: Press</span>
            <kbd className="px-2.5 py-1 bg-gray-700 border border-gray-600 rounded text-gray-300 font-mono text-xs shadow-sm">
              Cmd
            </kbd>
            <span>+</span>
            <kbd className="px-2.5 py-1 bg-gray-700 border border-gray-600 rounded text-gray-300 font-mono text-xs shadow-sm">
              K
            </kbd>
            <span className="hidden sm:inline">for quick search anywhere</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
