'use server';

import { logger } from '@/lib/logger';
import { env } from '@/lib/env';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = env.FINNHUB_API_KEY;

export interface StockComparisonData {
  symbol: string;
  company: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  marketCap?: number;
  peRatio?: number;
  week52High?: number;
  week52Low?: number;
}

interface FinnhubQuote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
  t: number;  // Timestamp
}

interface FinnhubProfile {
  name: string;
  marketCapitalization: number;
}

interface FinnhubMetrics {
  '52WeekHigh': number;
  '52WeekLow': number;
  'peNormalizedAnnual': number;
}

export async function getStockComparisonData(symbols: string[]): Promise<StockComparisonData[]> {
  if (!symbols || symbols.length === 0) {
    return [];
  }

  const data = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        // Fetch quote data
        const quoteUrl = `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`;
        const quoteResponse = await fetch(quoteUrl, {
          cache: 'no-store',
          next: { revalidate: 0 }
        });

        if (!quoteResponse.ok) {
          throw new Error(`Failed to fetch quote for ${symbol}`);
        }

        const quote: FinnhubQuote = await quoteResponse.json();

        // Fetch profile data for company name and market cap
        const profileUrl = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`;
        const profileResponse = await fetch(profileUrl, {
          cache: 'no-store',
          next: { revalidate: 0 }
        });

        let company = symbol;
        let marketCap: number | undefined;

        if (profileResponse.ok) {
          const profile: FinnhubProfile = await profileResponse.json();
          company = profile.name || symbol;
          marketCap = profile.marketCapitalization;
        }

        // Fetch basic financials for P/E ratio and 52-week high/low
        const metricsUrl = `${FINNHUB_BASE_URL}/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all&token=${FINNHUB_API_KEY}`;
        const metricsResponse = await fetch(metricsUrl, {
          cache: 'no-store',
          next: { revalidate: 0 }
        });

        let peRatio: number | undefined;
        let week52High: number | undefined;
        let week52Low: number | undefined;

        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          const metrics: FinnhubMetrics = metricsData.metric;
          
          if (metrics) {
            week52High = metrics['52WeekHigh'];
            week52Low = metrics['52WeekLow'];
            peRatio = metrics['peNormalizedAnnual'];
          }
        }

        return {
          symbol: symbol.toUpperCase(),
          company,
          currentPrice: quote.c,
          change: quote.d,
          changePercent: quote.dp,
          high: quote.h,
          low: quote.l,
          open: quote.o,
          previousClose: quote.pc,
          marketCap,
          peRatio,
          week52High,
          week52Low,
        };
      } catch (error) {
        logger.error(
          `Failed to fetch comparison data for ${symbol}`,
          error instanceof Error ? error : new Error(String(error))
        );
        // Return minimal data on error
        return {
          symbol: symbol.toUpperCase(),
          company: symbol,
          currentPrice: 0,
          change: 0,
          changePercent: 0,
          high: 0,
          low: 0,
          open: 0,
          previousClose: 0,
        };
      }
    })
  );

  return data;
}
