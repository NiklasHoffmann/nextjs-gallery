import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Gallery State Store
 * Verwaltet den Zustand der 3D Gallery
 */
interface GalleryState {
  // Navigation
  activeImageIndex: number | null;
  setActiveImageIndex: (index: number | null) => void;

  // Viewer Mode
  isViewerMode: boolean;
  setViewerMode: (mode: boolean) => void;

  // Camera Position
  cameraPosition: [number, number, number] | null;
  setCameraPosition: (position: [number, number, number] | null) => void;

  // Gallery Settings
  gridSize: number;
  setGridSize: (size: number) => void;

  hoverHeight: number;
  setHoverHeight: (height: number) => void;

  // Navigation Actions
  goNext: () => void;
  goPrev: () => void;
  goToImage: (index: number) => void;
  exitViewer: () => void;

  // Images Count (gesetzt von außerhalb)
  totalImages: number;
  setTotalImages: (count: number) => void;
}

export const useGalleryStore = create<GalleryState>()(
  devtools(
    (set, get) => ({
      // Navigation
      activeImageIndex: null,
      setActiveImageIndex: (index) => set({ activeImageIndex: index }),

      // Viewer Mode
      isViewerMode: false,
      setViewerMode: (mode) => set({ isViewerMode: mode }),

      // Camera Position
      cameraPosition: null,
      setCameraPosition: (position) => set({ cameraPosition: position }),

      // Gallery Settings
      gridSize: 5,
      setGridSize: (size) => set({ gridSize: size }),

      hoverHeight: 4.5,
      setHoverHeight: (height) => set({ hoverHeight: height }),

      // Total Images
      totalImages: 0,
      setTotalImages: (count) => set({ totalImages: count }),

      // Navigation Actions
      goNext: () => {
        const { activeImageIndex, totalImages } = get();
        if (totalImages === 0) return;
        const nextIndex =
          activeImageIndex === null ? 0 : (activeImageIndex + 1) % totalImages;
        set({ activeImageIndex: nextIndex });
      },

      goPrev: () => {
        const { activeImageIndex, totalImages } = get();
        if (totalImages === 0) return;
        const prevIndex =
          activeImageIndex === null
            ? 0
            : (activeImageIndex - 1 + totalImages) % totalImages;
        set({ activeImageIndex: prevIndex });
      },

      goToImage: (index) => {
        set({ activeImageIndex: index, isViewerMode: true });
      },

      exitViewer: () => {
        set({ isViewerMode: false, activeImageIndex: null });
      },
    }),
    { name: 'GalleryStore' }
  )
);
