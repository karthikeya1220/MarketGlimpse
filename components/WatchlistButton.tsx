'use client';
import React, { useState, useTransition } from 'react';
import { addToWatchlist, removeFromWatchlist } from '@/lib/actions/watchlist.actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Star, Trash2, Loader2, Plus } from 'lucide-react';

interface WatchlistButtonProps {
  symbol: string;
  company?: string;
  isInWatchlist?: boolean;
  type?: 'icon' | 'button';
  onWatchlistChange?: (symbol: string, added: boolean) => void;
}

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  type = 'button',
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    const next = !added;
    
    startTransition(async () => {
      try {
        if (next) {
          // Adding to watchlist
          const result = await addToWatchlist(symbol, company || symbol);
          if (result.success) {
            setAdded(true);
            toast.success(result.message || `${symbol} added to watchlist`);
            onWatchlistChange?.(symbol, true);
            router.refresh();
          } else {
            toast.error(result.error || 'Failed to add to watchlist');
          }
        } else {
          // Removing from watchlist
          const result = await removeFromWatchlist(symbol);
          if (result.success) {
            setAdded(false);
            toast.success(result.message || `${symbol} removed from watchlist`);
            onWatchlistChange?.(symbol, false);
            router.refresh();
          } else {
            toast.error(result.error || 'Failed to remove from watchlist');
          }
        }
      } catch {
        toast.error('An error occurred');
      }
    });
  };

  if (type === 'icon') {
    return (
      <button
        title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={`group relative p-3 rounded-full transition-all duration-300 ${
          added 
            ? 'bg-yellow-500/10 hover:bg-yellow-500/20 border-2 border-yellow-500/50 hover:border-yellow-500' 
            : 'bg-gray-700/50 hover:bg-gray-600 border-2 border-gray-600 hover:border-yellow-500/50'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
        ) : (
          <Star 
            className={`h-5 w-5 transition-all duration-300 ${
              added 
                ? 'text-yellow-500 fill-yellow-500 scale-110' 
                : 'text-gray-400 group-hover:text-yellow-500 group-hover:scale-110'
            }`}
          />
        )}
      </button>
    );
  }

  return (
    <button
      className={`group relative flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
        added
          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-2 border-red-500/30 hover:border-red-500'
          : 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-2 border-yellow-500/30 hover:border-yellow-500'
      }`}
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : added ? (
        <>
          <div className="relative">
            <Star className="h-5 w-5 fill-red-400 text-red-400" />
            <Trash2 className="h-4 w-4 absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span>Remove from Watchlist</span>
        </>
      ) : (
        <>
          <div className="relative">
            <Star className="h-5 w-5 group-hover:fill-yellow-500/20 transition-all duration-300" />
            <Plus className="h-3 w-3 absolute -top-1 -right-1 bg-yellow-500 rounded-full text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span>Add to Watchlist</span>
        </>
      )}
    </button>
  );
};

export default WatchlistButton;
