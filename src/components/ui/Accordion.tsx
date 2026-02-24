'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  forwardRef,
  HTMLAttributes,
  ButtonHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion component');
  }
  return context;
};

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  children: ReactNode;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = 'single', defaultValue, children, className, ...props }, ref) => {
    const [openItems, setOpenItems] = useState<string[]>(
      Array.isArray(defaultValue)
        ? defaultValue
        : defaultValue
        ? [defaultValue]
        : []
    );

    const toggleItem = (value: string) => {
      setOpenItems((prev) => {
        if (type === 'single') {
          return prev.includes(value) ? [] : [value];
        } else {
          return prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value];
        }
      });
    };

    return (
      <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
        <div ref={ref} className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = 'Accordion';

interface AccordionItemContextValue {
  isOpen: boolean;
  value: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | undefined>(
  undefined
);

const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      'AccordionItem components must be used within an AccordionItem component'
    );
  }
  return context;
};

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, children, className, ...props }, ref) => {
    const { openItems } = useAccordionContext();
    const isOpen = openItems.includes(value);

    return (
      <AccordionItemContext.Provider value={{ isOpen, value }}>
        <div
          ref={ref}
          className={cn('border-b border-gray-200 dark:border-gray-700', className)}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const { toggleItem } = useAccordionContext();
    const { isOpen, value } = useAccordionItemContext();

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        className={cn(
          'flex w-full items-center justify-between py-4 font-medium transition-all hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded',
          className
        )}
        onClick={() => toggleItem(value)}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            'shrink-0 transition-transform duration-200',
            isOpen ? 'rotate-180' : ''
          )}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    );
  }
);

AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...props }, ref) => {
    const { isOpen } = useAccordionItemContext();

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'animate-slide-in' : 'h-0'
        )}
        {...props}
      >
        <div className={cn('pb-4 pt-0', className)}>{children}</div>
      </div>
    );
  }
);

AccordionContent.displayName = 'AccordionContent';
