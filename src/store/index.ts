/**
 * Zentrale Export-Datei für alle Zustand Stores
 */

export { useUIStore } from './uiStore';
export { useGalleryStore } from './galleryStore';
export { usePreferencesStore } from './preferencesStore';

/**
 * Store Hooks Kombination für häufige Use Cases
 */
import { useUIStore } from './uiStore';
import { useGalleryStore } from './galleryStore';
import { usePreferencesStore } from './preferencesStore';

/**
 * Combined Hook für Gallery-Komponenten
 */
export function useGallery() {
  const gallery = useGalleryStore();
  const preferences = usePreferencesStore();

  return {
    ...gallery,
    preferences: {
      movementSpeed: preferences.movementSpeed,
      autoRotate: preferences.autoRotate,
      showControls: preferences.showControls,
    },
  };
}

/**
 * Combined Hook für UI-Komponenten
 */
export function useUI() {
  const ui = useUIStore();
  const preferences = usePreferencesStore();

  return {
    ...ui,
    reducedMotion: preferences.reducedMotion,
    highContrast: preferences.highContrast,
  };
}
