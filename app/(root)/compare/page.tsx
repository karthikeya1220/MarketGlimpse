'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Plus, X, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStockComparisonData, type StockComparisonData } from '@/lib/actions/comparison.actions';

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [symbols, setSymbols] = useState<string[]>(
    searchParams.get('symbols')?.split(',').filter(Boolean) || []
  );
  const [inputValue, setInputValue] = useState('');
  const [comparisonData, setComparisonData] = useState<StockComparisonData[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch comparison data when symbols change
  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      if (symbols.length === 0) {
        setComparisonData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getStockComparisonData(symbols);
        if (!cancelled) {
          setComparisonData(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setComparisonData([]);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [symbols]);

  const addSymbol = () => {
    const trimmed = inputValue.trim().toUpperCase();
    if (trimmed && !symbols.includes(trimmed) && symbols.length < 4) {
      const newSymbols = [...symbols, trimmed];
      setSymbols(newSymbols);
      router.push(`/compare?symbols=${newSymbols.join(',')}`);
      setInputValue('');
    }
  };

  const removeSymbol = (symbol: string) => {
    const newSymbols = symbols.filter(s => s !== symbol);
    setSymbols(newSymbols);
    router.push(`/compare?symbols=${newSymbols.join(',')}`);
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === 0) return 'N/A';
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const formatMarketCap = (cap: number | undefined) => {
    if (!cap) return 'N/A';
    if (cap >= 1000) return `$${(cap / 1000).toFixed(2)}T`;
    return `$${cap.toFixed(2)}B`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-yellow-500" />
          Stock Comparison
        </h1>
        <p className="text-gray-400 text-base md:text-lg">
          Compare up to 4 stocks side by side
        </p>
      </div>

      {/* Add Stock Input */}
      <Card className="border-gray-600 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg">Select Stocks to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && addSymbol()}
              disabled={symbols.length >= 4}
            />
            <Button
              onClick={addSymbol}
              disabled={!inputValue.trim() || symbols.length >= 4}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          {/* Selected Symbols */}
          {symbols.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {symbols.map((symbol) => (
                <div
                  key={symbol}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/30 px-3 py-2"
                >
                  <span className="font-medium text-blue-400">{symbol}</span>
                  <button
                    onClick={() => removeSymbol(symbol)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500 mt-4">
            {symbols.length}/4 stocks selected
          </p>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 text-yellow-500 animate-spin mb-4" />
          <p className="text-gray-400">Loading comparison data...</p>
        </div>
      ) : symbols.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-gray-800/50 rounded-full p-6 mb-6">
            <Search className="h-12 w-12 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">No Stocks Selected</h2>
          <p className="text-gray-400 text-center max-w-md">
            Add stocks using the search above to compare their performance and metrics.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {comparisonData.map((stock) => (
            <Card key={stock.symbol} className="border-gray-600 bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-yellow-500">{stock.symbol}</CardTitle>
                <p className="text-sm text-gray-400 truncate">{stock.company}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Price */}
                <div>
                  <p className="text-2xl font-bold text-white">
                    ${formatNumber(stock.currentPrice)}
                  </p>
                  <div className={`flex items-center gap-1 text-sm ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.changePercent >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>
                      {stock.change >= 0 ? '+' : ''}{formatNumber(stock.change)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-2 pt-2 border-t border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Open:</span>
                    <span className="text-white">${formatNumber(stock.open)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">High:</span>
                    <span className="text-white">${formatNumber(stock.high)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Low:</span>
                    <span className="text-white">${formatNumber(stock.low)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Prev. Close:</span>
                    <span className="text-white">${formatNumber(stock.previousClose)}</span>
                  </div>
                  
                  {stock.marketCap && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Market Cap:</span>
                      <span className="text-white">{formatMarketCap(stock.marketCap)}</span>
                    </div>
                  )}
                  
                  {stock.peRatio && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">P/E Ratio:</span>
                      <span className="text-white">{formatNumber(stock.peRatio)}</span>
                    </div>
                  )}

                  {stock.week52High && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">52W High:</span>
                      <span className="text-white">${formatNumber(stock.week52High)}</span>
                    </div>
                  )}

                  {stock.week52Low && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">52W Low:</span>
                      <span className="text-white">${formatNumber(stock.week52Low)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
