'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createPriceAlert, type CreateAlertData } from '@/lib/actions/alert.actions';
import { toast } from 'sonner';

interface CreateAlertDialogProps {
  symbol?: string;
  company?: string;
  currentPrice?: number;
  onSuccess?: () => void;
}

export function CreateAlertDialog({ symbol = '', company = '', currentPrice, onSuccess }: CreateAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAlertData>({
    symbol,
    company,
    targetPrice: currentPrice || 0,
    condition: 'above',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await createPriceAlert(formData);
    setIsLoading(false);

    if (result.success) {
      toast.success('Price alert created successfully');
      setOpen(false);
      onSuccess?.();
    } else {
      toast.error(result.error || 'Failed to create alert');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="h-4 w-4" />
          Set Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Price Alert</DialogTitle>
            <DialogDescription>
              Get notified when the stock price reaches your target
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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

            <div className="grid gap-2">
              <Label htmlFor="targetPrice">
                Target Price ($) *
                {currentPrice && (
                  <span className="text-xs text-muted-foreground ml-2">
                    Current: ${currentPrice.toFixed(2)}
                  </span>
                )}
              </Label>
              <Input
                id="targetPrice"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="150.00"
                value={formData.targetPrice || ''}
                onChange={(e) => setFormData({ ...formData, targetPrice: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="condition">Condition *</Label>
              <Select
                value={formData.condition}
                onValueChange={(value: 'above' | 'below') => setFormData({ ...formData, condition: value })}
              >
                <SelectTrigger id="condition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Price goes above target</SelectItem>
                  <SelectItem value="below">Price goes below target</SelectItem>
                </SelectContent>
              </Select>
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
              {isLoading ? 'Creating...' : 'Create Alert'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
