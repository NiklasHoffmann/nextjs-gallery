'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      className,
      variant = 'default',
      size = 'md',
      rounded = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors';

    const variants = {
      default:
        'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100',
      primary:
        'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300',
      success:
        'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300',
      warning:
        'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300',
      danger:
        'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300',
      info:
        'bg-info-100 text-info-700 dark:bg-info-900 dark:text-info-300',
      outline:
        'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
    };

    const sizes = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-2.5 py-1',
      lg: 'text-base px-3 py-1.5',
    };

    const roundedStyle = rounded ? 'rounded-full' : 'rounded-md';

    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          roundedStyle,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
