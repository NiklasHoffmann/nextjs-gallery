import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorDisplay({
  title,
  message,
  onRetry,
  retryLabel = 'Try again',
  className,
}: ErrorDisplayProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950',
        className
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            {title}
          </h3>
          {message && (
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{message}</p>
            </div>
          )}
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                {retryLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
