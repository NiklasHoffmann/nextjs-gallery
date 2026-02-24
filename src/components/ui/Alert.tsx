'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  icon?: ReactNode;
  title?: string;
  closable?: boolean;
  onClose?: () => void;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      children,
      className,
      variant = 'default',
      icon,
      title,
      closable = false,
      onClose,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative w-full rounded-lg border p-4 transition-all duration-200';

    const variants = {
      default:
        'bg-gray-50 border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100',
      success:
        'bg-success-50 border-success-200 text-success-900 dark:bg-success-900/20 dark:border-success-900 dark:text-success-300',
      warning:
        'bg-warning-50 border-warning-200 text-warning-900 dark:bg-warning-900/20 dark:border-warning-900 dark:text-warning-300',
      danger:
        'bg-danger-50 border-danger-200 text-danger-900 dark:bg-danger-900/20 dark:border-danger-900 dark:text-danger-300',
      info:
        'bg-info-50 border-info-200 text-info-900 dark:bg-info-900/20 dark:border-info-900 dark:text-info-300',
    };

    const iconColors = {
      default: 'text-gray-600 dark:text-gray-400',
      success: 'text-success-600 dark:text-success-400',
      warning: 'text-warning-600 dark:text-warning-400',
      danger: 'text-danger-600 dark:text-danger-400',
      info: 'text-info-600 dark:text-info-400',
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        <div className="flex items-start gap-3">
          {icon && (
            <div className={cn('flex-shrink-0 mt-0.5', iconColors[variant])}>
              {icon}
            </div>
          )}
          <div className="flex-1">
            {title && (
              <h5 className="mb-1 font-semibold leading-none tracking-tight">
                {title}
              </h5>
            )}
            <div className="text-sm leading-relaxed">{children}</div>
          </div>
          {closable && (
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-auto opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
              aria-label="Schließen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
