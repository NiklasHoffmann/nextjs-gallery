'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const checkboxId = id || props.name;

    return (
      <div className="w-full">
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              id={checkboxId}
              ref={ref}
              className={cn(
                'h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600',
                'focus:ring-2 focus:ring-blue-500',
                'dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800',
                'dark:focus:ring-blue-600',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-red-500 focus:ring-red-500',
                className
              )}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error
                  ? `${checkboxId}-error`
                  : hint
                    ? `${checkboxId}-hint`
                    : undefined
              }
              {...props}
            />
          </div>
          {label && (
            <div className="ml-2 text-sm">
              <label
                htmlFor={checkboxId}
                className="font-medium text-gray-900 dark:text-white"
              >
                {label}
                {props.required && <span className="ml-1 text-red-500">*</span>}
              </label>
              {hint && !error && (
                <p
                  id={`${checkboxId}-hint`}
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  {hint}
                </p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${checkboxId}-error`}
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
