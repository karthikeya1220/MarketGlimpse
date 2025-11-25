'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, isPositive, icon }: StatCardProps) => {
  return (
    <Card className="overflow-hidden group hover:scale-105 transition-transform duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold text-gray-100">{value}</h3>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-teal-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? 'text-teal-400' : 'text-red-500'
                }`}
              >
                {change}
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${
            isPositive ? 'bg-teal-400/10' : 'bg-red-500/10'
          } group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  const stats = [
    {
      title: 'S&P 500',
      value: '5,917.11',
      change: '+0.56%',
      isPositive: true,
      icon: <TrendingUp className="h-6 w-6 text-teal-400" />,
    },
    {
      title: 'Dow Jones',
      value: '44,296.51',
      change: '+0.97%',
      isPositive: true,
      icon: <Activity className="h-6 w-6 text-teal-400" />,
    },
    {
      title: 'NASDAQ',
      value: '18,983.46',
      change: '+0.16%',
      isPositive: true,
      icon: <DollarSign className="h-6 w-6 text-teal-400" />,
    },
    {
      title: 'Russell 2000',
      value: '2,304.22',
      change: '-0.02%',
      isPositive: false,
      icon: <TrendingDown className="h-6 w-6 text-red-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
