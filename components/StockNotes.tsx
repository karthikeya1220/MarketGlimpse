'use client';

import { useState } from 'react';
import { StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { updateWatchlistNotes } from '@/lib/actions/watchlist.actions';
import { toast } from 'sonner';

interface StockNotesProps {
  symbol: string;
  initialNotes?: string;
  onUpdate?: () => void;
}

export function StockNotes({ symbol, initialNotes, onUpdate }: StockNotesProps) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(initialNotes || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    const result = await updateWatchlistNotes(symbol, notes);
    setIsLoading(false);

    if (result.success) {
      toast.success('Notes updated successfully');
      setOpen(false);
      onUpdate?.();
    } else {
      toast.error(result.error || 'Failed to update notes');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title={initialNotes ? 'View/Edit notes' : 'Add notes'}
        >
          <StickyNote className={`h-4 w-4 ${initialNotes ? 'text-yellow-500 fill-yellow-500/20' : ''}`} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Stock Notes - {symbol}</DialogTitle>
          <DialogDescription>
            Add personal notes about this stock (max 2000 characters)
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter your notes about this stock..."
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {notes.length} / 2000 characters
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Notes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
