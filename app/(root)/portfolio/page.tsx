import { getUserPortfolio, getPortfolioSummary } from '@/lib/actions/portfolio.actions';
import { PortfolioStats } from '@/components/PortfolioStats';
import { PortfolioHoldingCard } from '@/components/PortfolioHoldingCard';
import { AddPortfolioDialog } from '@/components/AddPortfolioDialog';
import { Briefcase, TrendingUp } from 'lucide-react';

export default async function PortfolioPage() {
  const holdings = await getUserPortfolio();
  
  // TODO: Fetch current prices from Finnhub and calculate P/L
  // For now, showing holdings without live prices
  
  const summary = await getPortfolioSummary(holdings);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-yellow-500" />
            My Portfolio
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Track your stock holdings and performance
          </p>
        </div>
        <AddPortfolioDialog />
      </div>

      {holdings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-gray-800/50 rounded-full p-6 mb-6">
            <TrendingUp className="h-12 w-12 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">No Holdings Yet</h2>
          <p className="text-gray-400 text-center mb-6 max-w-md">
            Start tracking your portfolio by adding your stock holdings. Monitor profit/loss and performance over time.
          </p>
          <AddPortfolioDialog />
        </div>
      ) : (
        <>
          {/* Portfolio Stats */}
          <PortfolioStats summary={summary} />

          {/* Holdings Grid */}
          <div>
            <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              Holdings ({holdings.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {holdings.map((holding, index) => (
                <PortfolioHoldingCard 
                  key={holding._id.toString()} 
                  holding={holding} 
                  index={index}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
