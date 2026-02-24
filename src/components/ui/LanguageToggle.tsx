'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/routing';

export function LanguageToggle() {
  const locale = useLocale();
  const t = useTranslations('language');
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === 'de' ? 'en' : 'de';

  return (
    <button
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
      aria-label={t('toggle')}
    >
      {t(nextLocale)}
    </button>
  );
}
