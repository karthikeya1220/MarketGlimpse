import { Inngest } from 'inngest';
import { env } from '@/lib/env';

export const inngest = new Inngest({
  id: 'MarketGlimpse',
  ai: { gemini: { apiKey: env.GEMINI_API_KEY } },
});
