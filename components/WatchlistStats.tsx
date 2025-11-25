'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ListChecks } from 'lucide-react';

interface WatchlistStatsProps {
  totalStocks: number;
  averageChange?: number;
  gainers: number;
  losers: number;
}

const WatchlistStats = ({ totalStocks, averageChange = 0, gainers, losers }: WatchlistStatsProps) => {
  const isPositive = averageChange >= 0;
  
  const stats = [
    {
      title: 'Total Stocks',
      value: totalStocks.toString(),
      icon: <ListChecks className="h-6 w-6 text-blue-400" />,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
    },
    {
      title: 'Average Change',
      value: `${isPositive ? '+' : ''}${averageChange.toFixed(2)}%`,
      icon: isPositive ? (
        <TrendingUp className="h-6 w-6 text-teal-400" />
      ) : (
        <TrendingDown className="h-6 w-6 text-red-500" />
      ),
      bgColor: isPositive ? 'bg-teal-500/10' : 'bg-red-500/10',
      textColor: isPositive ? 'text-teal-400' : 'text-red-500',
    },
    {
      title: 'Gainers',
      value: gainers.toString(),
      icon: <TrendingUp className="h-6 w-6 text-teal-400" />,
      bgColor: 'bg-teal-500/10',
      textColor: 'text-teal-400',
    },
    {
      title: 'Losers',
      value: losers.toString(),
      icon: <TrendingDown className="h-6 w-6 text-red-500" />,
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="overflow-hidden group hover:scale-105 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                <h3 className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WatchlistStats;
