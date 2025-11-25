import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getChangeColorClass } from '@/lib/utils';
import WatchlistButton from '@/components/WatchlistButton';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface WatchlistTableProps {
  watchlist: StockWithData[];
}

export default function WatchlistTable({ watchlist }: WatchlistTableProps) {
  if (!watchlist || watchlist.length === 0) {
    return (
      <Card className="border-gray-600 bg-gray-800/50">
        <div className="rounded-md p-12 text-center">
          <p className="text-gray-400">No stocks in your watchlist yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-gray-600 bg-gray-800/50">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800 border-b border-gray-700 hover:bg-gray-800">
              <TableHead className="text-left text-sm font-semibold text-gray-300">Company</TableHead>
              <TableHead className="text-left text-sm font-semibold text-gray-300">Symbol</TableHead>
              <TableHead className="text-left text-sm font-semibold text-gray-300">Price</TableHead>
              <TableHead className="text-left text-sm font-semibold text-gray-300">Change</TableHead>
              <TableHead className="text-left text-sm font-semibold text-gray-300">Market Cap</TableHead>
              <TableHead className="text-left text-sm font-semibold text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-gray-900/50 divide-y divide-gray-800">
            {watchlist.map((item) => (
              <TableRow key={item.symbol} className="hover:bg-gray-800/50 transition-colors border-gray-800">
                <TableCell className="px-6 py-4">
                  <Link 
                    href={`/stocks/${item.symbol}`}
                    className="group/link flex items-center gap-2 hover:text-yellow-500 transition-colors"
                  >
                    <div className="font-medium text-gray-100 group-hover/link:text-yellow-500">{item.company}</div>
                    <ExternalLink className="h-3 w-3 text-gray-500 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </Link>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Link 
                    href={`/stocks/${item.symbol}`}
                    className="hover:text-yellow-500 transition-colors"
                  >
                    <div className="text-gray-300 font-mono font-semibold">{item.symbol}</div>
                  </Link>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="text-gray-100 font-bold text-lg">
                    {item.priceFormatted || 'N/A'}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className={`font-bold text-lg ${getChangeColorClass(item.changePercent)}`}>
                    {item.changeFormatted || '--'}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="text-gray-300 font-medium">{item.marketCap || 'N/A'}</div>
                </TableCell>
                <TableCell className="px-6 py-4">
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
                      type="button"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
