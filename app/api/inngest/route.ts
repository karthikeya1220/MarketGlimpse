import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest/client';
import { sendSignUpEmail, sendDailyNewsSummary, checkPriceAlertsJob } from '@/lib/inngest/functions';
import { env } from '@/lib/env';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendSignUpEmail, sendDailyNewsSummary, checkPriceAlertsJob],
  // Verify Inngest requests using signing key — prevents unauthorized event injection
  ...(env.INNGEST_SIGNING_KEY ? { signingKey: env.INNGEST_SIGNING_KEY } : {}),
});
