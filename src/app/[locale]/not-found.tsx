import { useTranslations } from 'next-intl';
import { Link } from '@/routing';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900 dark:text-gray-100">
          404
        </h1>
        <h2 className="mt-4 text-3xl font-semibold text-gray-700 dark:text-gray-300">
          {t('notFound')}
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Die angeforderte Seite konnte nicht gefunden werden.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
        >
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
}
