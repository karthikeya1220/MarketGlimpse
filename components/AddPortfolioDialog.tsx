'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addToPortfolio, type AddPortfolioData } from '@/lib/actions/portfolio.actions';
import { toast } from 'sonner';

interface AddPortfolioDialogProps {
  onSuccess?: () => void;
}

export function AddPortfolioDialog({ onSuccess }: AddPortfolioDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AddPortfolioData>({
    symbol: '',
    company: '',
    quantity: 0,
    buyPrice: 0,
    buyDate: new Date().toISOString().split('T')[0] || '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await addToPortfolio(formData);
    setIsLoading(false);

    if (result.success) {
      toast.success('Added to portfolio successfully');
      setOpen(false);
      setFormData({
        symbol: '',
        company: '',
        quantity: 0,
        buyPrice: 0,
        buyDate: new Date().toISOString().split('T')[0] || '',
        notes: '',
      });
      onSuccess?.();
    } else {
      toast.error(result.error || 'Failed to add to portfolio');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Holding
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Portfolio Holding</DialogTitle>
            <DialogDescription>
              Add a stock to your portfolio to track profit/loss
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="symbol">Stock Symbol *</Label>
                <Input
                  id="symbol"
                  placeholder="AAPL"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  placeholder="Apple Inc."
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="10"
                  value={formData.quantity || ''}
                  onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="buyPrice">Buy Price ($) *</Label>
                <Input
                  id="buyPrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="150.00"
                  value={formData.buyPrice || ''}
                  onChange={(e) => setFormData({ ...formData, buyPrice: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="buyDate">Purchase Date *</Label>
              <Input
                id="buyDate"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={formData.buyDate}
                onChange={(e) => setFormData({ ...formData, buyDate: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <textarea
                id="notes"
                placeholder="Bought on dip..."
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                maxLength={1000}
              />
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add to Portfolio'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
