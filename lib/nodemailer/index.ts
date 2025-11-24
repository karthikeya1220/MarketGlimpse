import nodemailer from 'nodemailer';
import { WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE } from '@/lib/nodemailer/templates';
import { getFormattedTodayDate } from '@/lib/utils';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
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
  name,
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
