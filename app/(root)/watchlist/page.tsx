import { redirect } from 'next/navigation';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { getUserWatchlist } from '@/lib/actions/watchlist.actions';
import { fetchJSON } from '@/lib/actions/finnhub.actions';
import { formatPrice, formatChangePercent, formatMarketCapValue } from '@/lib/utils';
import Link from 'next/link';
import { env } from '@/lib/env';
import { Star, Search, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import WatchlistContent from '@/components/WatchlistContent';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const token = env.FINNHUB_API_KEY;

async function getStockData(symbol: string) {
  try {
    const [quote, profile] = await Promise.all([
      fetchJSON<{ c?: number; dp?: number }>(`${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${token}`, 300),
      fetchJSON<{ marketCapitalization?: number; name?: string }>(`${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${token}`, 3600),
    ]);

    return {
      currentPrice: quote.c,
      changePercent: quote.dp,
      marketCap: profile.marketCapitalization,
    };
  } catch {
    return null;
  }
}

export default async function WatchlistPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/sign-in');
  }

  const watchlistItems = await getUserWatchlist();

  // Fetch stock data for all watchlist items
  const watchlistWithData = await Promise.all(
    watchlistItems.map(async (item) => {
      const stockData = await getStockData(item.symbol);
      return {
        ...item,
        currentPrice: stockData?.currentPrice,
        changePercent: stockData?.changePercent,
        marketCap: stockData?.marketCap ? formatMarketCapValue(stockData.marketCap * 1000000) : 'N/A',
        priceFormatted: stockData?.currentPrice ? formatPrice(stockData.currentPrice) : 'N/A',
        changeFormatted: stockData?.changePercent ? formatChangePercent(stockData.changePercent) : '',
      };
    })
  );

  if (watchlistItems.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-3">
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-100">
                My Watchlist
              </h1>
              <p className="text-gray-400 text-base md:text-lg mt-1">
                Track and monitor your favorite stocks
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <Card className="border-gray-600 bg-gray-800/50">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-700/50 rounded-full p-8 mb-6">
              <Star className="h-16 w-16 text-gray-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              Your Watchlist is Empty
            </h2>
            <p className="text-gray-400 max-w-md mb-8 text-base">
              Start tracking your favorite stocks by adding them to your watchlist. 
              Search for stocks and click the star icon to add them.
            </p>
            <Link
              href="/search"
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Search className="h-5 w-5" />
              Search Stocks
            </Link>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="border-gray-600 bg-gradient-to-r from-gray-800/50 to-gray-800/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-500/10 rounded-lg p-2 flex-shrink-0">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Getting Started</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>Use the search page to find stocks by company name or symbol</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>Click the star icon on any stock to add it to your watchlist</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>Track real-time prices and performance metrics</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-3">
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100">
              My Watchlist
            </h1>
            <p className="text-gray-400 text-base md:text-lg mt-1">
              Track and monitor your favorite stocks in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Watchlist Content */}
      <WatchlistContent watchlistData={watchlistWithData} />

      {/* Tips Section */}
      <Card className="border-gray-600 bg-gradient-to-r from-gray-800/50 to-gray-800/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-500/10 rounded-lg p-2 flex-shrink-0">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Pro Tips</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Click on any stock to view detailed charts and comprehensive analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Toggle between grid and table view for your preferred layout</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Sort stocks by price, change, or market cap to analyze performance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Your watchlist syncs automatically across all your devices</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
