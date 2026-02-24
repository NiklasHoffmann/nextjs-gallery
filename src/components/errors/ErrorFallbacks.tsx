'use client';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

interface ErrorFallbackProps {
  error: Error;
  onReset?: () => void;
}

/**
 * Standard Error Fallback UI
 */
export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <Alert
        variant="danger"
        title="Fehler beim Laden"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        }
      >
        <p className="mb-3">{error.message || 'Ein unbekannter Fehler ist aufgetreten.'}</p>
        {onReset && (
          <Button onClick={onReset} variant="primary" size="sm">
            Erneut versuchen
          </Button>
        )}
      </Alert>
    </div>
  );
}

/**
 * Simple Error Message
 */
export function SimpleError({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-danger-200 bg-danger-50 p-4 dark:border-danger-900 dark:bg-danger-900/20">
      <p className="text-sm text-danger-800 dark:text-danger-200">{message}</p>
    </div>
  );
}

/**
 * 404 Not Found Error
 */
export function NotFoundError() {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
          Seite nicht gefunden
        </p>
        <p className="mt-2 text-gray-500 dark:text-gray-500">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <div className="mt-6">
          <Button onClick={handleGoHome} variant="primary">
            Zur Startseite
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Network Error
 */
export function NetworkError({ onRetryAction }: { onRetryAction?: () => void }) {
  return (
    <Alert
      variant="warning"
      title="Verbindungsproblem"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 3a2 2 0 0 0-2 2" />
          <path d="M19 3a2 2 0 0 1 2 2" />
          <path d="M21 19a2 2 0 0 1-2 2" />
          <path d="M5 21a2 2 0 0 1-2-2" />
          <path d="M9 3h1" />
          <path d="M9 21h1" />
          <path d="M14 3h1" />
          <path d="M14 21h1" />
          <path d="M3 9v1" />
          <path d="M21 9v1" />
          <path d="M3 14v1" />
          <path d="M21 14v1" />
        </svg>
      }
    >
      <p className="mb-3">
        Die Verbindung zum Server konnte nicht hergestellt werden. Bitte überprüfen Sie Ihre
        Internetverbindung.
      </p>
      {onRetryAction && (
        <Button onClick={onRetryAction} variant="primary" size="sm">
          Erneut versuchen
        </Button>
      )}
    </Alert>
  );
}
