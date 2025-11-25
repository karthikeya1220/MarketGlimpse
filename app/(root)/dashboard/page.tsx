import TradingViewWidget from '@/components/TradingViewWidget';
import DashboardStats from '@/components/DashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HEATMAP_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
} from '@/lib/constants';
import { BarChart3, TrendingUp, Newspaper, LineChart } from 'lucide-react';

const Dashboard = () => {
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-yellow-500" />
          Market Dashboard
        </h1>
        <p className="text-gray-400 text-base md:text-lg">
          Real-time market insights and comprehensive stock analysis
        </p>
      </div>

      {/* Stats Section */}
      <DashboardStats />

      {/* Market Overview & Heatmap Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 dashboard-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <LineChart className="h-5 w-5 text-yellow-500" />
              Market Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}market-overview.js`}
              config={MARKET_OVERVIEW_WIDGET_CONFIG}
              className="custom-chart"
              height={600}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 dashboard-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              Stock Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}stock-heatmap.js`}
              config={HEATMAP_WIDGET_CONFIG}
              className="heatmap-chart"
              height={650}
            />
          </CardContent>
        </Card>
      </section>

      {/* News & Market Data Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 dashboard-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Newspaper className="h-5 w-5 text-yellow-500" />
              Top Stories
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}timeline.js`}
              config={TOP_STORIES_WIDGET_CONFIG}
              height={600}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 dashboard-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-yellow-500" />
              Market Quotes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}market-quotes.js`}
              config={MARKET_DATA_WIDGET_CONFIG}
              height={600}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
