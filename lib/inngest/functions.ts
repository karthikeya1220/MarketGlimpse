import { inngest } from '@/lib/inngest/client';
import { PERSONALIZED_WELCOME_EMAIL_PROMPT, NEWS_SUMMARY_EMAIL_PROMPT } from '@/lib/inngest/prompts';
import { sendWelcomeEmail, sendNewsSummaryEmail } from '@/lib/nodemailer';
import { getAllUsersForNewsEmail } from '@/lib/actions/user.actions';
import { getWatchlistSymbolsByEmail } from '@/lib/actions/watchlist.actions';
import { getNews } from '@/lib/actions/finnhub.actions';
import { logger } from '@/lib/logger';

export const sendSignUpEmail = inngest.createFunction(
  { id: 'sign-up-email' },
  { event: 'app/user.created' },
  async ({ event, step }) => {
    const userProfile = `
            - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}
        `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile);

    const response = await step.ai.infer('generate-welcome-intro', {
      model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
      body: {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run('send-welcome-email', async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const introText =
        (part && 'text' in part ? part.text : null) ||
        'Thanks for joining MarketGlimpse. You now have the tools to track markets and make smarter moves.';

      const {
        data: { email, name },
      } = event;

      return await sendWelcomeEmail({ email, name, intro: introText });
    });

    return {
      success: true,
      message: 'Welcome email sent successfully',
    };
  }
);

export const sendDailyNewsSummary = inngest.createFunction(
  {
    id: 'daily-news-summary',
    name: 'Send Daily News Summary',
  },
  [
    { cron: '0 12 * * *' }, // Daily at 12 PM UTC
    { event: 'app/send.daily.news' }, // Manual trigger option
  ],
  async ({ step }) => {
    // Step 1: Get all users
    const users = await step.run('get-all-users', async () => {
      return await getAllUsersForNewsEmail();
    });

    if (!users || users.length === 0) {
      logger.info('No users found for daily news summary');
      return { success: true, message: 'No users to send news to' };
    }

    logger.info(`Processing daily news for ${users.length} users`);

    // Step 2: Process each user
    await Promise.all(
      users.map(async (user) => {
        try {
          // Get user's watchlist symbols
          const symbols = await step.run(`get-watchlist-${user.id}`, async () => {
            return await getWatchlistSymbolsByEmail(user.email);
          });

          // Fetch news (either for their watchlist or general market news)
          const news = await step.run(`fetch-news-${user.id}`, async () => {
            if (symbols && symbols.length > 0) {
              logger.info(`Fetching news for ${symbols.length} symbols for user ${user.email}`);
              return await getNews(symbols);
            } else {
              logger.info(`Fetching general news for user ${user.email}`);
              return await getNews();
            }
          });

          if (!news || news.length === 0) {
            logger.info(`No news available for user ${user.email}`);
            return;
          }

          // Step 3: Summarize news via AI
          const newsData = JSON.stringify(news, null, 2);
          const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', newsData);

          const response = await step.ai.infer(`summarize-news-${user.id}`, {
            model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
            body: {
              contents: [
                {
                  role: 'user',
                  parts: [{ text: prompt }],
                },
              ],
            },
          });

          // Step 4: Send email with summarized news
          await step.run(`send-email-${user.id}`, async () => {
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const newsContent =
              (part && 'text' in part ? part.text : null) ||
              '<p class="mobile-text dark-text-secondary" style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#4b5563;">No market news available today. Please check back tomorrow.</p>';

            return await sendNewsSummaryEmail({
              email: user.email,
              name: user.name,
              newsContent,
            });
          });

          logger.info(`Successfully sent daily news to ${user.email}`);
        } catch (error) {
          logger.error(
            `Failed to process daily news for user ${user.email}`,
            error instanceof Error ? error : new Error(String(error))
          );
        }
      })
    );

    return { success: true, message: `Processed daily news for ${users.length} users` };
  }
);
