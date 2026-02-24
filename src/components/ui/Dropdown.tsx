'use client';

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
  forwardRef,
  HTMLAttributes,
  ButtonHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

interface DropdownContextValue {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);

const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown component');
  }
  return context;
};

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ children, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isOpen]);

    return (
      <DropdownContext.Provider value={{ isOpen, setIsOpen, dropdownRef }}>
        <div
          ref={dropdownRef}
          className={cn('relative inline-block', className)}
          {...props}
        >
          {children}
        </div>
      </DropdownContext.Provider>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export interface DropdownTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const DropdownTrigger = forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const { isOpen, setIsOpen } = useDropdownContext();

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700',
          className
        )}
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
            'transition-transform duration-200',
            isOpen ? 'rotate-180' : ''
          )}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    );
  }
);

DropdownTrigger.displayName = 'DropdownTrigger';

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'right';
}

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, className, align = 'left', ...props }, ref) => {
    const { isOpen } = useDropdownContext();

    if (!isOpen) return null;

    const alignmentStyles = {
      left: 'left-0',
      right: 'right-0',
    };

    return (
      <div
        ref={ref}
        role="menu"
        className={cn(
          'absolute z-50 mt-2 min-w-[200px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg animate-fade-in dark:border-gray-700 dark:bg-gray-800',
          alignmentStyles[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenu.displayName = 'DropdownMenu';

export interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
}

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ children, className, danger = false, onClick, ...props }, ref) => {
    const { setIsOpen } = useDropdownContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      setIsOpen(false);
    };

    return (
      <button
        ref={ref}
        role="menuitem"
        className={cn(
          'w-full rounded-md px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
          danger
            ? 'text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/20'
            : 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownItem.displayName = 'DropdownItem';

export interface DropdownSeparatorProps extends HTMLAttributes<HTMLHRElement> {}

export const DropdownSeparator = forwardRef<HTMLHRElement, DropdownSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        role="separator"
        className={cn(
          'my-1 border-t border-gray-200 dark:border-gray-700',
          className
        )}
        {...props}
      />
    );
  }
);

DropdownSeparator.displayName = 'DropdownSeparator';
