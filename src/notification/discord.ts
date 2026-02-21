import { websiteConfig } from '@/config/website';
import { defaultMessages } from '@/i18n/messages';
import { getBaseUrl } from '@/lib/urls/urls';

/**
 * Send a message to Discord via webhook. Generic method that accepts any valid Discord webhook payload.
 * @param body Message body (Discord webhook payload, e.g. { content }, or { embeds }, etc.)
 */
export async function sendMessage(body: Record<string, unknown>): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      'DISCORD_WEBHOOK_URL is not set, skipping Discord notification'
    );
    return;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error('<< Failed to send Discord message:', response);
  }
}

/**
 * Send a payment notification message to Discord when a user makes a purchase
 * @param sessionId The Stripe checkout session ID
 * @param customerId The Stripe customer ID
 * @param userName The username of the customer
 * @param amount The purchase amount in the currency's main unit (e.g., dollars, not cents)
 */
export async function sendPaymentMessage(
  sessionId: string,
  customerId: string,
  userName: string,
  amount: number
): Promise<void> {
  try {
    const message = {
      username: `${defaultMessages.Metadata.name} Bot`,
      avatar_url: `${getBaseUrl()}${websiteConfig.metadata?.images?.logoLight}`,
      embeds: [
        {
          title: '🎉 New Purchase',
          color: 0x4caf50, // Green color
          fields: [
            { name: 'Username', value: userName, inline: true },
            { name: 'Amount', value: `$${amount.toFixed(2)}`, inline: true },
            {
              name: 'Customer ID',
              value: `\`${customerId}\``,
              inline: false,
            },
            {
              name: 'Session ID',
              value: `\`${sessionId}\``,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    await sendMessage(message);

    console.log(
      `<< Successfully sent Discord notification for user ${userName}`
    );
  } catch (error) {
    console.error('<< Failed to send Discord notification:', error);
  }
}

/**
 * Send a credit distribution notification message to Discord when credits are distributed to all users
 * @param usersCount The number of users that received credits
 * @param processedCount The number of users that were processed
 * @param errorCount The number of users that had errors
 */
export async function sendCreditDistributionMessage(
  usersCount: number,
  processedCount: number,
  errorCount: number
): Promise<void> {
    try {
      const message = {
        username: `${defaultMessages.Metadata.name} Bot`,
        avatar_url: `${getBaseUrl()}${websiteConfig.metadata?.images?.logoLight}`,
        embeds: [
          {
            title: '🎉 Credit Distribution',
            color: 0x4caf50, // Green color
            fields: [
              { name: 'Users', value: usersCount.toString(), inline: true },
              { name: 'Processed', value: processedCount.toString(), inline: true },
              { name: 'Errors', value: errorCount.toString(), inline: true },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };
      await sendMessage(message);
      console.log(
        `<< Successfully sent Discord notification for credit distribution`
      );
    } catch (error) {
      console.error('<< Failed to send Discord notification:', error);
    }
}
