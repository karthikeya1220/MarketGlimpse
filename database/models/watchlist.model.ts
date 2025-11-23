import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface WatchlistItem extends Document {
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
}

const WatchlistSchema = new Schema<WatchlistItem>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// Prevent duplicate symbols per user
WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

// For sorting by date
WatchlistSchema.index({ addedAt: -1 });

// For symbol lookups
WatchlistSchema.index({ symbol: 1 });

export const Watchlist: Model<WatchlistItem> =
  (models?.Watchlist as Model<WatchlistItem>) || model<WatchlistItem>('Watchlist', WatchlistSchema);
