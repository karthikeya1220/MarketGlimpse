'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ExportWatchlistButtonProps {
  watchlist: StockWithData[];
}

export function ExportWatchlistButton({ watchlist }: ExportWatchlistButtonProps) {
  const exportToCSV = () => {
    if (watchlist.length === 0) {
      toast.error('No stocks to export');
      return;
    }

    // Prepare CSV headers
    const headers = [
      'Symbol',
      'Company',
      'Current Price',
      'Change %',
      'Market Cap',
      'P/E Ratio',
      'Date Added',
      'Notes',
      'Tags',
    ];

    // Prepare CSV rows
    const rows = watchlist.map((stock) => [
      stock.symbol,
      stock.company,
      stock.currentPrice?.toString() || 'N/A',
      stock.changePercent?.toFixed(2) || 'N/A',
      stock.marketCap || 'N/A',
      stock.peRatio || 'N/A',
      new Date(stock.addedAt).toLocaleDateString(),
      stock.notes?.replace(/,/g, ';') || '',
      stock.tags?.join('; ') || '',
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `watchlist_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${watchlist.length} stocks to CSV`);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={exportToCSV}
      disabled={watchlist.length === 0}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
