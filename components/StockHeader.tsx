'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, TrendingDown, Share2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import WatchlistButton from '@/components/WatchlistButton';

interface StockHeaderProps {
  symbol: string;
  company?: string;
  price?: string;
  change?: number;
  changePercent?: number;
  isInWatchlist?: boolean;
}

const StockHeader = ({ 
  symbol, 
  company, 
  price, 
  change, 
  changePercent,
  isInWatchlist = false 
}: StockHeaderProps) => {
  const isPositive = (changePercent ?? 0) >= 0;
  const changeClass = isPositive ? 'text-teal-400' : 'text-red-500';
  const bgClass = isPositive ? 'bg-teal-500/10' : 'bg-red-500/10';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${symbol} - ${company || symbol}`,
          text: `Check out ${symbol} stock on MarketGlimpse`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Card className="border-gray-600 bg-gradient-to-r from-gray-800 to-gray-800/50 backdrop-blur-sm animate-fade-in">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Back Button and Actions */}
          <div className="flex items-center justify-between">
            <Link 
              href="/search"
              className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Search</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-gray-100 transition-colors"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <a
                href={`https://www.tradingview.com/symbols/${symbol}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-gray-100 transition-colors"
                title="View on TradingView"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Stock Info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-100">
                  {symbol}
                </h1>
                {changePercent !== undefined && (
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${bgClass}`}>
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 text-teal-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-semibold ${changeClass}`}>
                      {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
              {company && (
                <p className="text-lg text-gray-400">{company}</p>
              )}
            </div>

            {/* Price and Actions */}
            <div className="flex items-center gap-4">
              {price && (
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Current Price</p>
                  <p className="text-3xl font-bold text-gray-100">{price}</p>
                  {change !== undefined && (
                    <p className={`text-sm font-semibold ${changeClass}`}>
                      {isPositive ? '+' : ''}{change.toFixed(2)}
                    </p>
                  )}
                </div>
              )}

              <WatchlistButton
                symbol={symbol}
                company={company || symbol}
                isInWatchlist={isInWatchlist}
                type="button"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockHeader;
