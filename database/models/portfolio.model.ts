import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface PortfolioHolding extends Document {
  userId: string;
  symbol: string;
  company: string;
  quantity: number;
  buyPrice: number;
  buyDate: Date;
  notes?: string;
  addedAt: Date;
}

const PortfolioSchema = new Schema<PortfolioHolding>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0.01 },
    buyPrice: { type: Number, required: true, min: 0.01 },
    buyDate: { type: Date, required: true },
    notes: { type: String, trim: true, maxlength: 1000 },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for user portfolio queries
PortfolioSchema.index({ userId: 1, addedAt: -1 });

// Index for symbol lookups
PortfolioSchema.index({ symbol: 1 });

// Index for date-based queries
PortfolioSchema.index({ buyDate: -1 });

export const Portfolio: Model<PortfolioHolding> =
  (models?.Portfolio as Model<PortfolioHolding>) || model<PortfolioHolding>('Portfolio', PortfolioSchema);
