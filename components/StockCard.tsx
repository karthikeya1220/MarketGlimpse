'use client';

import Link from 'next/link';
import { TrendingUp, Building2, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StockCardProps {
  stock: StockWithWatchlistStatus;
  index: number;
}

const StockCard = ({ stock, index }: StockCardProps) => {
  const getTypeColor = (type: string) => {
    const typeMap: Record<string, string> = {
      'Common Stock': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'ETF': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'ADR': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      'REIT': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    };
    return typeMap[type] || 'bg-gray-700 text-gray-300 border-gray-600';
  };

  const getExchangeIcon = (exchange: string) => {
    if (exchange.includes('NASDAQ')) return '📊';
    if (exchange.includes('NYSE')) return '🏛️';
    if (exchange.includes('AMEX')) return '🏢';
    return '🌐';
  };

  return (
    <Link href={`/stocks/${stock.symbol}`} className="block group">
      <Card 
        className="h-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/10 hover:border-yellow-500/50 animate-fade-in-up"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-3 flex-shrink-0 group-hover:from-yellow-500/30 group-hover:to-yellow-600/30 transition-all">
                <TrendingUp className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-xl text-gray-100 group-hover:text-yellow-500 transition-colors truncate">
                  {stock.symbol}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span>{getExchangeIcon(stock.exchange)}</span>
                  <span className="truncate">{stock.exchange}</span>
                </div>
              </div>
            </div>

            {/* Watchlist Badge */}
            {stock.isInWatchlist && (
              <div className="flex-shrink-0 ml-2">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-full p-2 group-hover:scale-110 transition-transform">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </div>
              </div>
            )}
          </div>

          {/* Company Name */}
          <div className="min-h-[48px]">
            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
              {stock.name}
            </p>
          </div>

          {/* Footer with Type Badge */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            <span 
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-all ${getTypeColor(stock.type)}`}
            >
              <Building2 className="h-3 w-3" />
              {stock.type}
            </span>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 group-hover:text-yellow-500 transition-colors">
              <span>View Details</span>
              <svg 
                className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StockCard;
