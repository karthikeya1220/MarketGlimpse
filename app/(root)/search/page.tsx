'use client';

import { useState, useEffect } from 'react';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import { useDebounce } from '@/hooks/useDebounce';
import { Loader2, TrendingUp, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

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

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-100">Search Stocks</h1>
        <p className="text-gray-400">
          Search for stocks, ETFs, and other securities from global markets
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <Input
          type="text"
          placeholder="Search by company name or symbol (e.g., AAPL, Tesla)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 h-14 text-base form-input"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 animate-spin" />
        )}
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {/* Results Header */}
        {hasSearched && (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-100">
              {searchTerm.trim() ? 'Search Results' : 'Popular Stocks'}
            </h2>
            <span className="text-sm text-gray-500">
              {stocks.length} {stocks.length === 1 ? 'result' : 'results'}
            </span>
          </div>
        )}

        {/* Loading State */}
        {loading && !hasSearched && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading stocks...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && hasSearched && stocks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-gray-800 rounded-full p-4 mb-4">
              <Search className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">No results found</h3>
            <p className="text-gray-500 max-w-md">
              {searchTerm.trim()
                ? `We couldn't find any stocks matching "${searchTerm}". Try a different search term.`
                : 'No stocks available at the moment.'}
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && stocks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks.map((stock) => (
              <Link
                key={stock.symbol}
                href={`/stocks/${stock.symbol}`}
                className="block group"
              >
                <div className="bg-gray-800 rounded-lg border border-gray-600 p-5 hover:border-yellow-500 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/10">
                  {/* Stock Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-700 rounded-full p-2">
                        <TrendingUp className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-100 group-hover:text-yellow-500 transition-colors">
                          {stock.symbol}
                        </h3>
                        <p className="text-xs text-gray-500">{stock.exchange}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stock Name */}
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2 min-h-[40px]">
                    {stock.name}
                  </p>

                  {/* Stock Type */}
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded">
                      {stock.type}
                    </span>
                    {stock.isInWatchlist && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-500/10 text-yellow-500 rounded">
                        In Watchlist
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="flex items-center justify-center pt-8 text-sm text-gray-500">
        <p>
          💡 Tip: Press{' '}
          <kbd className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-gray-400">
            Cmd/Ctrl + K
          </kbd>{' '}
          for quick search anywhere
        </p>
      </div>
    </div>
  );
}
