import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface PriceAlert extends Document {
  userId: string;
  symbol: string;
  company: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  isTriggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
  notificationSent: boolean;
}

const PriceAlertSchema = new Schema<PriceAlert>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    targetPrice: { type: Number, required: true, min: 0.01 },
    condition: { type: String, enum: ['above', 'below'], required: true },
    isActive: { type: Boolean, default: true },
    isTriggered: { type: Boolean, default: false },
    triggeredAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    notificationSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for active alerts
PriceAlertSchema.index({ isActive: 1, isTriggered: 1 });

// Index for symbol lookups
PriceAlertSchema.index({ symbol: 1 });

// Index for user alerts
PriceAlertSchema.index({ userId: 1, createdAt: -1 });

export const PriceAlertModel: Model<PriceAlert> =
  (models?.PriceAlert as Model<PriceAlert>) || model<PriceAlert>('PriceAlert', PriceAlertSchema);
