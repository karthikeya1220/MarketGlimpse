'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Award } from 'lucide-react';
import type { PortfolioSummary } from '@/lib/actions/portfolio.actions';

interface PortfolioStatsProps {
  summary: PortfolioSummary;
}

export function PortfolioStats({ summary }: PortfolioStatsProps) {
  const isProfitable = summary.totalProfitLoss >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Total Value */}
      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-100">{formatCurrency(summary.totalValue)}</div>
          <p className="text-xs text-gray-500 mt-1">Current portfolio value</p>
        </CardContent>
      </Card>

      {/* Total Cost */}
      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Total Cost</CardTitle>
          <PieChart className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-100">{formatCurrency(summary.totalCost)}</div>
          <p className="text-xs text-gray-500 mt-1">Amount invested</p>
        </CardContent>
      </Card>

      {/* Profit/Loss */}
      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Profit/Loss</CardTitle>
          {isProfitable ? (
            <TrendingUp className="h-4 w-4 text-teal-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isProfitable ? 'text-teal-400' : 'text-red-500'}`}>
            {formatCurrency(summary.totalProfitLoss)}
          </div>
          <p className={`text-xs mt-1 ${isProfitable ? 'text-teal-400' : 'text-red-500'}`}>
            {formatPercent(summary.totalProfitLossPercent)}
          </p>
        </CardContent>
      </Card>

      {/* Holdings */}
      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Holdings</CardTitle>
          <Award className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-100">{summary.holdings}</div>
          <p className="text-xs text-gray-500 mt-1">
            {summary.topGainer ? `Top: ${summary.topGainer.symbol} ${formatPercent(summary.topGainer.percent)}` : 'No data'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
