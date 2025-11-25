import nodemailer from 'nodemailer';
import { 
  WELCOME_EMAIL_TEMPLATE, 
  NEWS_SUMMARY_EMAIL_TEMPLATE,
  STOCK_ALERT_UPPER_EMAIL_TEMPLATE,
  STOCK_ALERT_LOWER_EMAIL_TEMPLATE
} from '@/lib/nodemailer/templates';
import { getFormattedTodayDate } from '@/lib/utils';
import { env } from '@/lib/env';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.NODEMAILER_EMAIL,
    pass: env.NODEMAILER_PASSWORD,
  },
});

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace('{{name}}', name).replace('{{intro}}', intro);

  const mailOptions = {
    from: `"MarketGlimpse" <MarketGlimpse@jsmastery.pro>`,
    to: email,
    subject: `Welcome to MarketGlimpse - your stock market toolkit is ready!`,
    text: 'Thanks for joining MarketGlimpse',
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export const sendNewsSummaryEmail = async ({
  email,
  // name,
  newsContent,
}: {
  email: string;
  name: string;
  newsContent: string;
}) => {
  const date = getFormattedTodayDate();
  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace('{{date}}', date).replace('{{newsContent}}', newsContent);

  const mailOptions = {
    from: `"MarketGlimpse" <MarketGlimpse@jsmastery.pro>`,
    to: email,
    subject: `Your Daily Market News Summary - ${date}`,
    text: 'Your daily market news summary from MarketGlimpse',
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export interface PriceAlertEmailData {
  email: string;
  symbol: string;
  company: string;
  currentPrice: number;
  targetPrice: number;
  condition: 'above' | 'below';
}

export const sendPriceAlertEmail = async (data: PriceAlertEmailData) => {
  const { email, symbol, company, currentPrice, targetPrice, condition } = data;
  
  const timestamp = new Date().toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const template = condition === 'above' 
    ? STOCK_ALERT_UPPER_EMAIL_TEMPLATE 
    : STOCK_ALERT_LOWER_EMAIL_TEMPLATE;

  const htmlTemplate = template
    .replace(/\{\{symbol\}\}/g, symbol)
    .replace(/\{\{company\}\}/g, company)
    .replace(/\{\{currentPrice\}\}/g, `$${currentPrice.toFixed(2)}`)
    .replace(/\{\{targetPrice\}\}/g, `$${targetPrice.toFixed(2)}`)
    .replace(/\{\{timestamp\}\}/g, timestamp);

  const subject = condition === 'above'
    ? `🚨 ${symbol} reached $${currentPrice.toFixed(2)} - Above your target!`
    : `🚨 ${symbol} dropped to $${currentPrice.toFixed(2)} - Below your target!`;

  const mailOptions = {
    from: `"MarketGlimpse Alerts" <MarketGlimpse@jsmastery.pro>`,
    to: email,
    subject,
    text: `${symbol} has ${condition === 'above' ? 'exceeded' : 'dropped below'} your target price of $${targetPrice.toFixed(2)}. Current price: $${currentPrice.toFixed(2)}`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
