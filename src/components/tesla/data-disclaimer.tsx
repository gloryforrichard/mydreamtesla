import { InfoIcon } from 'lucide-react';

interface DataDisclaimerProps {
  lastUpdated?: Date | null;
}

export function DataDisclaimer({ lastUpdated }: DataDisclaimerProps) {
  const dateStr = lastUpdated
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(lastUpdated)
    : null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3">
      <div className="flex items-start gap-2 text-sm text-amber-800">
        <InfoIcon className="mt-0.5 size-4 shrink-0" />
        <div>
          <p>
            Data is for reference only. Specifications, pricing, and
            availability may vary. Please verify with{' '}
            <a
              href="https://www.tesla.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              Tesla.com
            </a>{' '}
            for the latest information.
          </p>
          {dateStr && (
            <p className="mt-1 text-xs text-amber-600">
              Last verified: {dateStr}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
