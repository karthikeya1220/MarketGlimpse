import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getChangeColorClass } from '@/lib/utils';
import WatchlistButton from '@/components/WatchlistButton';
import Link from 'next/link';

interface WatchlistTableProps {
  watchlist: StockWithData[];
}

export default function WatchlistTable({ watchlist }: WatchlistTableProps) {
  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="rounded-md border border-gray-700 bg-gray-800/50 p-12 text-center">
        <p className="text-gray-400">No stocks in your watchlist yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-800 border-b border-gray-700">
            <TableHead className="text-left text-sm font-semibold text-gray-300">Company</TableHead>
            <TableHead className="text-left text-sm font-semibold text-gray-300">Symbol</TableHead>
            <TableHead className="text-left text-sm font-semibold text-gray-300">Price</TableHead>
            <TableHead className="text-left text-sm font-semibold text-gray-300">Change</TableHead>
            <TableHead className="text-left text-sm font-semibold text-gray-300">Market Cap</TableHead>
            <TableHead className="text-left text-sm font-semibold text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-gray-900 divide-y divide-gray-800">
          {watchlist.map((item) => (
            <TableRow key={item.symbol} className="hover:bg-gray-800/50 transition-colors">
              <TableCell className="px-6 py-4">
                <Link 
                  href={`/stocks/${item.symbol}`}
                  className="hover:text-yellow-500 transition-colors"
                >
                  <div className="font-medium text-gray-100">{item.company}</div>
                </Link>
              </TableCell>
              <TableCell className="px-6 py-4">
                <Link 
                  href={`/stocks/${item.symbol}`}
                  className="hover:text-yellow-500 transition-colors"
                >
                  <div className="text-gray-300 font-mono">{item.symbol}</div>
                </Link>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="text-gray-100 font-semibold">
                  {item.priceFormatted || 'N/A'}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className={`font-semibold ${getChangeColorClass(item.changePercent)}`}>
                  {item.changeFormatted || '--'}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="text-gray-300">{item.marketCap || 'N/A'}</div>
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
                    showTrashIcon={true}
                    type="button"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
