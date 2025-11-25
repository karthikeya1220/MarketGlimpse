'use server';

import { logger } from '@/lib/logger';
import { env } from '@/lib/env';
import { POPULAR_STOCK_SYMBOLS } from '@/lib/constants';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = env.FINNHUB_API_KEY;

export interface ScreenerFilters {
  priceMin?: number;
  priceMax?: number;
  marketCapMin?: number;
  marketCapMax?: number;
  changeMin?: number;
  changeMax?: number;
  sector?: string;
}

export interface ScreenerResult {
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  sector?: string;
}

interface FinnhubQuote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
}

interface FinnhubProfile {
  name: string;
  marketCapitalization: number;
  finnhubIndustry?: string;
}

/**
 * Screen stocks based on criteria
 * Note: Finnhub doesn't have a native screener API, so we fetch data for popular stocks
 * and filter client-side. For production, consider using a dedicated screener API.
 */
export async function screenStocks(filters: ScreenerFilters): Promise<ScreenerResult[]> {
  try {
    // Use a curated list of popular stocks to screen from
    // In production, you might want to use a stock list API or database
    const symbolsToScreen = POPULAR_STOCK_SYMBOLS.slice(0, 50); // Limit to 50 for performance

    logger.info(`Screening ${symbolsToScreen.length} stocks with filters`);

    // Fetch data for all symbols in parallel
    const results = await Promise.all(
      symbolsToScreen.map(async (symbol): Promise<ScreenerResult | null> => {
        try {
          // Fetch quote
          const quoteUrl = `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`;
          const quoteResponse = await fetch(quoteUrl, {
            cache: 'no-store',
            next: { revalidate: 0 }
          });

          if (!quoteResponse.ok) {
            return null;
          }

          const quote: FinnhubQuote = await quoteResponse.json();

          // Skip if no valid price data
          if (!quote.c || quote.c <= 0) {
            return null;
          }

          // Fetch profile
          const profileUrl = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`;
          const profileResponse = await fetch(profileUrl, {
            cache: 'no-store',
            next: { revalidate: 0 }
          });

          let company = symbol;
          let marketCap = 0;
          let sector: string | undefined;

          if (profileResponse.ok) {
            const profile: FinnhubProfile = await profileResponse.json();
            company = profile.name || symbol;
            marketCap = profile.marketCapitalization || 0;
            sector = profile.finnhubIndustry;
          }

          return {
            symbol: symbol.toUpperCase(),
            company,
            price: quote.c,
            change: quote.d,
            changePercent: quote.dp,
            marketCap,
            sector,
          };
        } catch (error) {
          logger.error(`Failed to fetch data for ${symbol}`, error instanceof Error ? error : new Error(String(error)));
          return null;
        }
      })
    );

    // Filter out null results and apply filters
    let filteredResults = results.filter((r): r is ScreenerResult => r !== null);

    // Apply filters
    if (filters.priceMin !== undefined) {
      filteredResults = filteredResults.filter(r => r.price >= filters.priceMin!);
    }

    if (filters.priceMax !== undefined) {
      filteredResults = filteredResults.filter(r => r.price <= filters.priceMax!);
    }

    if (filters.marketCapMin !== undefined) {
      filteredResults = filteredResults.filter(r => r.marketCap >= filters.marketCapMin!);
    }

    if (filters.marketCapMax !== undefined) {
      filteredResults = filteredResults.filter(r => r.marketCap <= filters.marketCapMax!);
    }

    if (filters.changeMin !== undefined) {
      filteredResults = filteredResults.filter(r => r.changePercent >= filters.changeMin!);
    }

    if (filters.changeMax !== undefined) {
      filteredResults = filteredResults.filter(r => r.changePercent <= filters.changeMax!);
    }

    if (filters.sector && filters.sector !== 'all') {
      filteredResults = filteredResults.filter(r => 
        r.sector?.toLowerCase().includes(filters.sector!.toLowerCase())
      );
    }

    // Sort by market cap descending
    filteredResults.sort((a, b) => b.marketCap - a.marketCap);

    logger.info(`Screener found ${filteredResults.length} matching stocks`);

    return filteredResults;
  } catch (error) {
    logger.error('Failed to screen stocks', error instanceof Error ? error : new Error(String(error)));
    return [];
  }
}
