'use client';

import { formatShortcut, KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';

/**
 * Keyboard Shortcuts Help Dialog Component
 */
export function KeyboardShortcutsHelp({ shortcuts }: { shortcuts: KeyboardShortcut[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Tastaturkürzel
      </h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="text-gray-600 dark:text-gray-400">
              {shortcut.description}
            </span>
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
              {formatShortcut(shortcut)}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
}
