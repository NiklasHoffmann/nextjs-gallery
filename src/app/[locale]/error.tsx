'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ErrorDisplay
        title={t('generic')}
        message={error.message}
        onRetry={reset}
        retryLabel={t('tryAgain')}
      />
    </div>
  );
}
