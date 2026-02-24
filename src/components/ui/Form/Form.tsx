'use client';

import { FormEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  children: ReactNode;
  isLoading?: boolean;
}

export default function Form({
  onSubmit,
  children,
  isLoading,
  className,
  ...props
}: FormProps) {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-4', className)}
      {...props}
    >
      <fieldset disabled={isLoading} className="space-y-4">
        {children}
      </fieldset>
    </form>
  );
}
