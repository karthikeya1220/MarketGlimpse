import { redirect } from 'next/navigation';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { getUserWatchlist } from '@/lib/actions/watchlist.actions';
import { fetchJSON } from '@/lib/actions/finnhub.actions';
import { formatPrice, formatChangePercent, getChangeColorClass, formatMarketCapValue } from '@/lib/utils';
import WatchlistButton from '@/components/WatchlistButton';
import Link from 'next/link';
import { env } from '@/lib/env';

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
      <div className="watchlist-empty-container">
        <div className="watchlist-empty">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="watchlist-star"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
            />
          </svg>
          <h2 className="empty-title">Your Watchlist is Empty</h2>
          <p className="empty-description">
            Start tracking your favorite stocks by adding them to your watchlist. Search for stocks and click the star icon to add them.
          </p>
          <Link
            href="/search"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Search Stocks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="watchlist-title">My Watchlist</h1>
        <p className="text-gray-400 mt-2">
          Track your favorite stocks and monitor their performance
        </p>
      </div>

      <div className="watchlist-table">
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr className="table-header-row">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Company</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Symbol</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Change</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Market Cap</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {watchlistWithData.map((item) => (
                <tr key={item.symbol} className="table-row">
                  <td className="px-6 py-4">
                    <Link 
                      href={`/stocks/${item.symbol}`}
                      className="hover:text-yellow-500 transition-colors"
                    >
                      <div className="font-medium text-gray-100">{item.company}</div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/stocks/${item.symbol}`}
                      className="hover:text-yellow-500 transition-colors"
                    >
                      <div className="text-gray-300 font-mono">{item.symbol}</div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-100 font-semibold">{item.priceFormatted}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`font-semibold ${getChangeColorClass(item.changePercent)}`}>
                      {item.changeFormatted}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-300">{item.marketCap}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/stocks/${item.symbol}`}
                        className="text-yellow-500 hover:text-yellow-400 text-sm font-medium transition-colors"
                      >
                        View Details
                      </Link>
                      <WatchlistButton
                        symbol={item.symbol}
                        company={item.company}
                        isInWatchlist={true}
                        showTrashIcon={true}
                        type="button"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">Pro Tips</h3>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2">•</span>
            Click on any stock to view detailed charts and analysis
          </li>
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2">•</span>
            Remove stocks from your watchlist by clicking the &quot;Remove from Watchlist&quot; button
          </li>
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2">•</span>
            Your watchlist is synced across all your devices
          </li>
        </ul>
      </div>
    </div>
  );
}
