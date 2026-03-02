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
import { motion } from 'motion/react';
import { BellRingIcon, HardHatIcon, MailIcon, WrenchIcon } from 'lucide-react';
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
    if (localStorage.getItem(SUBMITTED_KEY) === 'true') return;

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
      <DialogContent className="sm:max-w-md overflow-hidden p-0">
        {/* Illustration header */}
        <div className="relative flex items-center justify-center bg-[#F5F2ED] dark:bg-[#1A1A1A] px-6 pt-8 pb-6">
          {/* Decorative dots */}
          <div className="absolute top-3 left-4 flex gap-1.5">
            <div className="size-2 rounded-full bg-[#D6D3CD] dark:bg-[#333]" />
            <div className="size-2 rounded-full bg-[#E5E2DC] dark:bg-[#444]" />
            <div className="size-2 rounded-full bg-[#D6D3CD] dark:bg-[#333]" />
          </div>

          <div className="flex items-center gap-5">
            {/* Animated wrench */}
            <motion.div
              animate={{ rotate: [0, -15, 15, -10, 0] }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            >
              <WrenchIcon className="size-8 text-[#999999] dark:text-[#777]" />
            </motion.div>

            {/* Central hard hat */}
            <motion.div
              initial={{ y: -8 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[#1A1A1A] dark:bg-[#F5F2ED] shadow-lg shadow-black/10 dark:shadow-white/5">
                <HardHatIcon className="size-9 text-[#F5F2ED] dark:text-[#1A1A1A]" />
              </div>
            </motion.div>

            {/* Animated bell */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 8, -8, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4 }}
            >
              <BellRingIcon className="size-8 text-[#999999] dark:text-[#777]" />
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-center text-xl">
              {t('title')}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t('description')}
            </DialogDescription>
          </DialogHeader>

          <p className="text-muted-foreground text-center text-sm">
            {t('bookmarkHint')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <MailIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                type="email"
                required
                placeholder={t('form.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#1A1A1A] hover:bg-[#333] dark:bg-[#F5F2ED] dark:hover:bg-[#E5E2DC] dark:text-[#1A1A1A] text-white"
            >
              <BellRingIcon className="mr-2 size-4" />
              {isPending ? t('form.submitting') : t('form.submit')}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
