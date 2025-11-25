'use client';

import { useState } from 'react';
import { Filter, Search, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { screenStocks, type ScreenerFilters, type ScreenerResult } from '@/lib/actions/screener.actions';
import Link from 'next/link';

interface UIFilters {
  priceMin: string;
  priceMax: string;
  marketCap: string;
  sector: string;
  changeMin: string;
  changeMax: string;
}

export default function ScreenerPage() {
  const [filters, setFilters] = useState<UIFilters>({
    priceMin: '',
    priceMax: '',
    marketCap: 'all',
    sector: 'all',
    changeMin: '',
    changeMax: '',
  });

  const [results, setResults] = useState<ScreenerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);

    // Convert UI filters to API filters
    const apiFilters: ScreenerFilters = {};

    if (filters.priceMin) {
      apiFilters.priceMin = parseFloat(filters.priceMin);
    }
    if (filters.priceMax) {
      apiFilters.priceMax = parseFloat(filters.priceMax);
    }
    if (filters.changeMin) {
      apiFilters.changeMin = parseFloat(filters.changeMin);
    }
    if (filters.changeMax) {
      apiFilters.changeMax = parseFloat(filters.changeMax);
    }

    // Market cap ranges (in billions)
    if (filters.marketCap !== 'all') {
      switch (filters.marketCap) {
        case 'mega':
          apiFilters.marketCapMin = 200;
          break;
        case 'large':
          apiFilters.marketCapMin = 10;
          apiFilters.marketCapMax = 200;
          break;
        case 'mid':
          apiFilters.marketCapMin = 2;
          apiFilters.marketCapMax = 10;
          break;
        case 'small':
          apiFilters.marketCapMax = 2;
          break;
      }
    }

    if (filters.sector !== 'all') {
      apiFilters.sector = filters.sector;
    }

    try {
      const data = await screenStocks(apiFilters);
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      marketCap: 'all',
      sector: 'all',
      changeMin: '',
      changeMax: '',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 flex items-center gap-3">
          <Filter className="h-8 w-8 text-yellow-500" />
          Stock Screener
        </h1>
        <p className="text-gray-400 text-base md:text-lg">
          Find stocks based on your criteria
        </p>
      </div>

      {/* Filters */}
      <Card className="border-gray-600 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg">Filter Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceMin">Min Price ($)</Label>
              <Input
                id="priceMin"
                type="number"
                placeholder="0"
                value={filters.priceMin}
                onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceMax">Max Price ($)</Label>
              <Input
                id="priceMax"
                type="number"
                placeholder="1000"
                value={filters.priceMax}
                onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
              />
            </div>
          </div>

          {/* Market Cap & Sector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marketCap">Market Cap</Label>
              <Select
                value={filters.marketCap}
                onValueChange={(value) => setFilters({ ...filters, marketCap: value })}
              >
                <SelectTrigger id="marketCap">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="mega">Mega Cap (&gt;$200B)</SelectItem>
                  <SelectItem value="large">Large Cap ($10B-$200B)</SelectItem>
                  <SelectItem value="mid">Mid Cap ($2B-$10B)</SelectItem>
                  <SelectItem value="small">Small Cap (&lt;$2B)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Select
                value={filters.sector}
                onValueChange={(value) => setFilters({ ...filters, sector: value })}
              >
                <SelectTrigger id="sector">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="consumer">Consumer Goods</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Change Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="changeMin">Min Change (%)</Label>
              <Input
                id="changeMin"
                type="number"
                placeholder="-10"
                value={filters.changeMin}
                onChange={(e) => setFilters({ ...filters, changeMin: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="changeMax">Max Change (%)</Label>
              <Input
                id="changeMax"
                type="number"
                placeholder="10"
                value={filters.changeMax}
                onChange={(e) => setFilters({ ...filters, changeMax: e.target.value })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSearch} className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="border-gray-600 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg">
            {loading ? 'Searching...' : `Results (${results.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-yellow-500 animate-spin mb-4" />
              <p className="text-gray-400">Screening stocks...</p>
            </div>
          ) : !hasSearched ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No results yet. Apply filters and click Search to find stocks.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No stocks match your criteria. Try adjusting the filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {results.map((stock) => (
                <Link
                  key={stock.symbol}
                  href={`/stocks/${stock.symbol}`}
                  className="block"
                >
                  <div className="border border-gray-700 rounded-lg p-4 hover:border-yellow-500 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg text-yellow-500">
                            {stock.symbol}
                          </span>
                          <span className="text-sm text-gray-400">
                            {stock.company}
                          </span>
                        </div>
                        {stock.sector && (
                          <span className="text-xs text-gray-500">
                            {stock.sector}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 md:gap-6">
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="font-semibold text-white">
                            ${stock.price.toFixed(2)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Change</p>
                          <div className={`flex items-center gap-1 ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stock.changePercent >= 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            <span className="font-semibold">
                              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Market Cap</p>
                          <p className="font-semibold text-white">
                            {stock.marketCap >= 1000
                              ? `$${(stock.marketCap / 1000).toFixed(2)}T`
                              : `$${stock.marketCap.toFixed(2)}B`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
