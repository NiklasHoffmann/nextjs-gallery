import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * User Preferences Store
 * Verwaltet Benutzereinstellungen
 */
interface PreferencesState {
  // Display
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;

  highContrast: boolean;
  setHighContrast: (value: boolean) => void;

  // Gallery
  autoRotate: boolean;
  setAutoRotate: (value: boolean) => void;

  showControls: boolean;
  setShowControls: (value: boolean) => void;

  movementSpeed: number;
  setMovementSpeed: (speed: number) => void;

  // Reset
  resetPreferences: () => void;
}

const defaultState = {
  reducedMotion: false,
  highContrast: false,
  autoRotate: false,
  showControls: true,
  movementSpeed: 5,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...defaultState,

      setReducedMotion: (value) => set({ reducedMotion: value }),
      setHighContrast: (value) => set({ highContrast: value }),
      setAutoRotate: (value) => set({ autoRotate: value }),
      setShowControls: (value) => set({ showControls: value }),
      setMovementSpeed: (speed) => set({ movementSpeed: speed }),

      resetPreferences: () => set(defaultState),
    }),
    {
      name: 'user-preferences',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
