'use client';

import { useEffect } from 'react';

/**
 * Skip Link Component für bessere Accessibility
 * Ermöglicht Keyboard-Usern, direkt zum Hauptinhalt zu springen
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
    >
      Zum Hauptinhalt springen
    </a>
  );
}

/**
 * Live Region für Screen Reader Announcements
 */
export function LiveRegion() {
  return (
    <>
      <div
        id="sr-live-polite"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
      <div
        id="sr-live-assertive"
        className="sr-only"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      />
    </>
  );
}

/**
 * Helper Hook für Screen Reader Announcements
 */
export function useAnnouncement() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const regionId = priority === 'polite' ? 'sr-live-polite' : 'sr-live-assertive';
    const region = document.getElementById(regionId);
    if (region) {
      region.textContent = message;
      // Clear nach 1 Sekunde damit gleiche Nachrichten erneut angekündigt werden können
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
  };

  return { announce };
}

/**
 * Focus Trap für Modals und Dialoge
 */
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus auf erstes Element beim Öffnen
    firstElement?.focus();

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, containerRef]);
}

/**
 * Restore Focus nach Modal-Schließen
 */
export function useRestoreFocus(isOpen: boolean) {
  useEffect(() => {
    const previousActiveElement = document.activeElement as HTMLElement;

    return () => {
      if (!isOpen && previousActiveElement) {
        // Verzögerung für saubere Transition
        setTimeout(() => {
          previousActiveElement.focus();
        }, 0);
      }
    };
  }, [isOpen]);
}
