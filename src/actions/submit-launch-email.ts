'use server';

import { getDb } from '@/db/index';
import { launchNotifyEmail } from '@/db/schema';
import { actionClient } from '@/lib/safe-action';
import { getLocale } from 'next-intl/server';
import { z } from 'zod';

const schema = z.object({
  email: z.email({ error: 'Please enter a valid email address' }),
});

export const submitLaunchEmailAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const locale = await getLocale();
      const db = await getDb();

      await db
        .insert(launchNotifyEmail)
        .values({ email, locale })
        .onConflictDoNothing();

      return { success: true };
    } catch (error) {
      console.error('submit launch email error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  });
