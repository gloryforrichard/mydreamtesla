import { sendPaymentMessage as sendPaymentMessageToDiscord } from './discord';
import { sendPaymentMessage as sendPaymentMessageToFeishu } from './feishu';
import { sendCreditDistributionMessage as sendCreditDistributionMessageToDiscord } from './discord';
import { sendCreditDistributionMessage as sendCreditDistributionMessageToFeishu } from './feishu';

/**
 * Send a payment notification message when a user makes a purchase
 * @param sessionId The Stripe checkout session ID
 * @param customerId The Stripe customer ID
 * @param userName The username of the customer
 * @param amount The purchase amount in the currency's main unit (e.g., dollars, not cents)
 */
export async function sendPaymentNotification(
  sessionId: string,
  customerId: string,
  userName: string,
  amount: number
): Promise<void> {
  console.log('sendPaymentNotification', sessionId, customerId, userName, amount);

  // Send message to Discord channel
  await sendPaymentMessageToDiscord(sessionId, customerId, userName, amount);

  // Send message to Feishu group
  await sendPaymentMessageToFeishu(sessionId, customerId, userName, amount);
}

/**
 * Send a credit distribution notification message when credits are distributed to all users
 * @param usersCount The number of users that received credits
 * @param processedCount The number of users that were processed
 * @param errorCount The number of users that had errors
 */
export async function sendCreditDistributionNotification(
  usersCount: number,
  processedCount: number,
  errorCount: number
): Promise<void> {
  console.log('sendCreditDistributionNotification', usersCount, processedCount, errorCount);

  // Send message to Discord channel
  await sendCreditDistributionMessageToDiscord(usersCount, processedCount, errorCount);

  // Send message to Feishu group
  await sendCreditDistributionMessageToFeishu(usersCount, processedCount, errorCount);
}
