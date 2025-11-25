'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { removeFromPortfolio, type PortfolioHoldingWithMetrics } from '@/lib/actions/portfolio.actions';
import { toast } from 'sonner';
import Link from 'next/link';

interface PortfolioHoldingCardProps {
  holding: PortfolioHoldingWithMetrics;
  index: number;
  onUpdate?: () => void;
}

export function PortfolioHoldingCard({ holding, index, onUpdate }: PortfolioHoldingCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const isProfitable = (holding.profitLoss || 0) >= 0;
  const changeClass = isProfitable ? 'text-teal-400' : 'text-red-500';
  const bgClass = isProfitable ? 'bg-teal-500/10' : 'bg-red-500/10';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (!confirm(`Remove ${holding.symbol} from portfolio?`)) return;

    setIsDeleting(true);
    const result = await removeFromPortfolio(holding._id.toString());
    setIsDeleting(false);

    if (result.success) {
      toast.success('Removed from portfolio');
      onUpdate?.();
    } else {
      toast.error(result.error || 'Failed to remove');
    }
  };

  return (
    <Card 
      className="overflow-hidden group hover:border-yellow-500/50 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <Link href={`/stocks/${holding.symbol}`} className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-100 group-hover:text-yellow-500 transition-colors truncate">
                {holding.symbol}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-1">{holding.company}</p>
            </Link>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled
                title="Edit (Coming Soon)"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-red-500"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Shares & Price Info */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-800/30 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Shares</p>
              <p className="text-lg font-semibold text-gray-100">{holding.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Buy Price</p>
              <p className="text-lg font-semibold text-gray-100">{formatCurrency(holding.buyPrice)}</p>
            </div>
          </div>

          {/* Current Value & P/L */}
          {holding.currentPrice && (
            <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-700">
              <div>
                <p className="text-xs text-gray-500 mb-1">Current Value</p>
                <p className="text-xl font-bold text-gray-100">
                  {formatCurrency(holding.currentValue || 0)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  @ {formatCurrency(holding.currentPrice)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Profit/Loss</p>
                <div className="flex items-center gap-2">
                  {isProfitable ? (
                    <TrendingUp className="h-5 w-5 text-teal-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className={`text-xl font-bold ${changeClass}`}>
                      {formatCurrency(holding.profitLoss || 0)}
                    </p>
                    <p className={`text-xs ${changeClass}`}>
                      {holding.profitLossPercent?.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>Purchased: {formatDate(holding.buyDate)}</span>
            </div>
            <div className={`px-3 py-1.5 rounded-full ${bgClass} flex items-center gap-1.5`}>
              <DollarSign className="h-4 w-4" />
              <span className={`text-sm font-medium ${changeClass}`}>
                {formatCurrency(holding.totalCost || 0)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {holding.notes && (
            <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-gray-400">{holding.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
