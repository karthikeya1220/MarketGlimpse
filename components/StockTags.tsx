'use client';

import { useState } from 'react';
import { Tag, X, Plus } from 'lucide-react';
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
import { updateWatchlistTags } from '@/lib/actions/watchlist.actions';
import { toast } from 'sonner';

interface StockTagsProps {
  symbol: string;
  initialTags?: string[];
  onUpdate?: () => void;
}

const PREDEFINED_TAGS = ['buy', 'sell', 'hold', 'watch', 'dividend', 'growth', 'value', 'tech'];

export function StockTags({ symbol, initialTags = [], onUpdate }: StockTagsProps) {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags([...tags, trimmed]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    setIsLoading(true);
    const result = await updateWatchlistTags(symbol, tags);
    setIsLoading(false);

    if (result.success) {
      toast.success('Tags updated successfully');
      setOpen(false);
      onUpdate?.();
    } else {
      toast.error(result.error || 'Failed to update tags');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 gap-1"
          title={initialTags.length > 0 ? 'View/Edit tags' : 'Add tags'}
        >
          <Tag className={`h-4 w-4 ${initialTags.length > 0 ? 'text-blue-500' : ''}`} />
          {initialTags.length > 0 && (
            <span className="text-xs">{initialTags.length}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Stock Tags - {symbol}</DialogTitle>
          <DialogDescription>
            Add tags to organize your stocks (max 10 tags)
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Current Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-500"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add New Tag */}
          <div className="grid gap-2">
            <Label htmlFor="newTag">Add Tag</Label>
            <div className="flex gap-2">
              <Input
                id="newTag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(newTag);
                  }
                }}
                placeholder="Enter tag name..."
                maxLength={20}
                disabled={tags.length >= 10}
              />
              <Button
                type="button"
                size="icon"
                onClick={() => addTag(newTag)}
                disabled={!newTag.trim() || tags.length >= 10}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length >= 10 && (
              <p className="text-xs text-yellow-500">Maximum 10 tags reached</p>
            )}
          </div>

          {/* Predefined Tags */}
          <div className="grid gap-2">
            <Label>Quick Add</Label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_TAGS.filter((tag) => !tags.includes(tag)).map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTag(tag)}
                  disabled={tags.length >= 10}
                  className="h-8"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>
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
            {isLoading ? 'Saving...' : 'Save Tags'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
