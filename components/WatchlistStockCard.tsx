'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ArrowRight, ExternalLink } from 'lucide-react';
import WatchlistButton from '@/components/WatchlistButton';
import { StockNotes } from '@/components/StockNotes';
import { StockTags } from '@/components/StockTags';

interface WatchlistStockCardProps {
  item: StockWithData;
  index: number;
  onUpdate?: () => void;
}

const WatchlistStockCard = ({ item, index, onUpdate }: WatchlistStockCardProps) => {
  const isPositive = (item.changePercent ?? 0) >= 0;
  const changeClass = isPositive ? 'text-teal-400' : 'text-red-500';
  const bgClass = isPositive ? 'bg-teal-500/10' : 'bg-red-500/10';

  return (
    <Card 
      className="overflow-hidden group hover:border-yellow-500/50 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <Link 
                href={`/stocks/${item.symbol}`}
                className="group/link"
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-100 group-hover/link:text-yellow-500 transition-colors truncate">
                    {item.symbol}
                  </h3>
                  <ExternalLink className="h-4 w-4 text-gray-500 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                </div>
                <p className="text-sm text-gray-400 line-clamp-1">
                  {item.company}
                </p>
              </Link>
            </div>

            <WatchlistButton
              symbol={item.symbol}
              company={item.company}
              isInWatchlist={true}
              type="icon"
            />
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Notes Preview */}
          {item.notes && (
            <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
              <p className="text-xs text-gray-400 line-clamp-2">{item.notes}</p>
            </div>
          )}

          {/* Price Information */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-700">
            <div>
              <p className="text-xs text-gray-500 mb-1">Current Price</p>
              <p className="text-2xl font-bold text-gray-100">
                {item.priceFormatted || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Change</p>
              <div className="flex items-center gap-2">
                {isPositive ? (
                  <TrendingUp className="h-5 w-5 text-teal-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
                <p className={`text-2xl font-bold ${changeClass}`}>
                  {item.changeFormatted || '--'}
                </p>
              </div>
            </div>
          </div>

          {/* Market Cap */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Market Cap</p>
              <p className="text-sm font-semibold text-gray-300">
                {item.marketCap || 'N/A'}
              </p>
            </div>

            {/* Performance Badge */}
            <div className={`px-3 py-1.5 rounded-full ${bgClass} flex items-center gap-1.5`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-teal-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${changeClass}`}>
                {isPositive ? 'Gaining' : 'Losing'}
              </span>
            </div>
          </div>

          {/* View Details Link */}
          <div className="flex gap-2">
            <StockNotes 
              symbol={item.symbol} 
              initialNotes={item.notes} 
              onUpdate={onUpdate}
            />
            <StockTags 
              symbol={item.symbol} 
              initialTags={item.tags} 
              onUpdate={onUpdate}
            />
            <Link
              href={`/stocks/${item.symbol}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition-colors group/btn"
            >
              <span className="font-medium">View Details</span>
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchlistStockCard;
