'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useEffect, useState } from 'react';

// Dynamic Import mit Loading State für bessere Performance
const Gallery3D = dynamic(() => import('@/components/gallery/Gallery3D'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  ),
});

interface ImageMetadata {
  filename: string;
  isPortrait: boolean;
  width: number;
  height: number;
  originalFilename: string;
}

export default function HomePage() {
  const t = useTranslations('common');
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  useEffect(() => {
    // Lade Metadaten und erstelle sortierte Bildliste
    fetch('/images/gallery-optimized/metadata.json')
      .then(res => res.json())
      .then((metadata: ImageMetadata[]) => {
        // Sortiere: erst nach Orientierung gruppieren, dann in Paaren anordnen
        const portraitImages = metadata.filter(m => m.isPortrait);
        const landscapeImages = metadata.filter(m => !m.isPortrait);
        
        const sortedMetadata: ImageMetadata[] = [];
        let lIdx = 0, pIdx = 0;
        
        // Abwechselnd 2 Landscape, 2 Portrait
        while (lIdx < landscapeImages.length || pIdx < portraitImages.length) {
          // 2 Landscape-Bilder (Vorder-/Rückseite)
          if (lIdx < landscapeImages.length) sortedMetadata.push(landscapeImages[lIdx++]);
          if (lIdx < landscapeImages.length) sortedMetadata.push(landscapeImages[lIdx++]);
          
          // 2 Portrait-Bilder (Vorder-/Rückseite)
          if (pIdx < portraitImages.length) sortedMetadata.push(portraitImages[pIdx++]);
          if (pIdx < portraitImages.length) sortedMetadata.push(portraitImages[pIdx++]);
        }
        
        // Erstelle Galerie-Objekte
        const images = sortedMetadata.map((meta, i) => ({
          id: `${i + 1}`,
          src: `/images/gallery-optimized/${meta.filename}`,
          title: meta.filename.replace('.webp', '').replace('DSC_', 'Bild ').replace('DSCF', 'Bild '),
          description: `Fotografie ${i + 1} (${meta.isPortrait ? 'Portrait' : 'Landscape'})`,
        }));
        
        setGalleryImages(images);
      })
      .catch(err => {
        console.error('Fehler beim Laden der Metadaten:', err);
      });
  }, []);

  return (
    <main className="relative h-screen w-full overflow-hidden">
      {/* Controls Overlay */}
      <div className="absolute left-4 top-4 z-20 flex gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>

      {/* 3D Galerie mit Dynamic Import */}
      {galleryImages.length > 0 ? (
        <Gallery3D images={galleryImages} />
      ) : (
        <div className="flex h-screen items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </main>
  );
}
