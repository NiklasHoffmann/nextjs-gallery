'use client';

import { useState } from 'react';
import { GalleryImage } from './types';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface GalleryNavigationProps {
  images: GalleryImage[];
}

export function GalleryNavigation({ images }: GalleryNavigationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleJumpTo = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 flex flex-col items-center gap-4 z-10">
      {/* Bildtitel */}
      <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800">
          {images[currentIndex]?.title}
        </h2>
        {images[currentIndex]?.description && (
          <p className="text-sm text-gray-600 mt-1">
            {images[currentIndex].description}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-full shadow-lg flex items-center gap-4">
        <button
          onClick={handlePrevious}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Vorheriges Bild"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Punkte für jedes Bild */}
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleJumpTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-gray-800 w-8'
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
              aria-label={`Zu Bild ${index + 1} springen`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Nächstes Bild"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Hinweis */}
      <div className="text-sm text-gray-600 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-lg">
        <span className="font-medium">Steuerung:</span> Maus ziehen zum Drehen | Scrollen zum Zoomen | {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

// Hook für Kamera-Animation (wird in Gallery3D verwendet)
export function useCameraAnimation(targetIndex: number, spacing: number = 5) {
  const { camera } = useThree();
  
  const animateToImage = (index: number) => {
    const targetX = (index - Math.floor(5 / 2)) * spacing; // Annahme: 5 Bilder
    const targetPosition = new THREE.Vector3(targetX, 1.6, 8);
    
    // Sanfte Animation zur neuen Position
    const startPosition = camera.position.clone();
    const duration = 1000; // 1 Sekunde
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-in-out)
      const eased = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
      
      camera.position.lerpVectors(startPosition, targetPosition, eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  };
  
  return animateToImage;
}
