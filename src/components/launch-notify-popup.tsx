'use client';

import { submitLaunchEmailAction } from '@/actions/submit-launch-email';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

const DISMISSED_KEY = 'launch-popup-dismissed';
const SUBMITTED_KEY = 'launch-popup-email-submitted';
const DISMISS_DAYS = 7;
const DELAY_MS = 120_000; // 2 minutes

export function LaunchNotifyPopup() {
  const t = useTranslations('LaunchPopup');
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Already submitted email — never show again
    if (localStorage.getItem(SUBMITTED_KEY) === 'true') return;

    // Dismissed within DISMISS_DAYS — skip
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const diff = Date.now() - new Date(dismissedAt).getTime();
      if (diff < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
    }

    const timer = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function handleDismiss() {
    setOpen(false);
    localStorage.setItem(DISMISSED_KEY, new Date().toISOString());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitLaunchEmailAction({ email });
      if (result?.data?.success) {
        toast.success(t('form.success'));
        localStorage.setItem(SUBMITTED_KEY, 'true');
        setOpen(false);
      } else {
        toast.error(t('form.fail'));
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">{t('bookmarkHint')}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            required
            placeholder={t('form.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? t('form.submitting') : t('form.submit')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
