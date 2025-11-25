import { inngest } from '@/lib/inngest/client';
import { checkPriceAlerts } from '@/lib/actions/alert.actions';
import { logger } from '@/lib/logger';

/**
 * Background job that checks price alerts every 15 minutes
 * Triggers email notifications when alerts are met
 */
export const checkPriceAlertsJob = inngest.createFunction(
  {
    id: 'check-price-alerts',
    name: 'Check Price Alerts',
  },
  [
    { cron: '*/15 * * * *' }, // Every 15 minutes
    { event: 'app/check.price.alerts' }, // Manual trigger option
  ],
  async ({ step }) => {
    logger.info('Starting price alert check');

    // Step 1: Check all active price alerts
    const result = await step.run('check-alerts', async () => {
      return await checkPriceAlerts();
    });

    if (result) {
      logger.info(`Price alert check completed: ${result.triggered} triggered, ${result.checked} checked, ${result.errors} errors`);
    }

    return {
      success: true,
      checked: result?.checked || 0,
      triggered: result?.triggered || 0,
      errors: result?.errors || 0,
    };
  }
);
