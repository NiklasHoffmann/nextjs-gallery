'use client';

import { useEffect, useCallback } from 'react';

export type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
  preventDefault?: boolean;
};

/**
 * Hook für Keyboard Shortcuts mit Accessibility Support
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      shortcuts.forEach((shortcut) => {
        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesCtrl = shortcut.ctrl === undefined || event.ctrlKey === shortcut.ctrl;
        const matchesAlt = shortcut.alt === undefined || event.altKey === shortcut.alt;
        const matchesShift = shortcut.shift === undefined || event.shiftKey === shortcut.shift;
        const matchesMeta = shortcut.meta === undefined || event.metaKey === shortcut.meta;

        if (matchesKey && matchesCtrl && matchesAlt && matchesShift && matchesMeta) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.action();
        }
      });
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Format Shortcut Helper Function
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const keys: string[] = [];
  if (shortcut.ctrl) keys.push('Ctrl');
  if (shortcut.alt) keys.push('Alt');
  if (shortcut.shift) keys.push('Shift');
  if (shortcut.meta) keys.push('⌘');
  keys.push(shortcut.key.toUpperCase());
  return keys.join(' + ');
}
