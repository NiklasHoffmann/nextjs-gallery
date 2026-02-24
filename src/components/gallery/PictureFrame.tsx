'use client';

import { useRef, useMemo, memo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { GalleryImage } from './types';

interface PictureFrameProps {
  frontImage: GalleryImage;
  backImage?: GalleryImage;
  position: [number, number, number];
  rotation?: [number, number, number];
  onClickFront?: () => void;
  onClickBack?: () => void;
}

function PictureFrameComponent({ 
  frontImage, 
  backImage, 
  position, 
  rotation = [0, 0, 0], 
  onClickFront,
  onClickBack 
}: PictureFrameProps) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Vorderseiten-Bild laden mit Optimierungen
  const frontTexture = useLoader(TextureLoader, frontImage.src, (loader) => {
    loader.setCrossOrigin('anonymous');
  });
  
  // Textur-Optimierungen anwenden
  useMemo(() => {
    if (frontTexture) {
      frontTexture.colorSpace = THREE.SRGBColorSpace; // Korrekter Farbraum
      frontTexture.generateMipmaps = true;
      frontTexture.minFilter = THREE.LinearMipmapLinearFilter;
      frontTexture.magFilter = THREE.LinearFilter;
      frontTexture.anisotropy = 16; // Bessere Qualität bei schrägem Blickwinkel
    }
    return frontTexture;
  }, [frontTexture]);
  
  // Rückseiten-Bild laden (optional) mit Optimierungen
  const backTexture = backImage ? useLoader(TextureLoader, backImage.src, (loader) => {
    loader.setCrossOrigin('anonymous');
  }) : null;
  
  // Textur-Optimierungen für Rückseite
  useMemo(() => {
    if (backTexture) {
      backTexture.colorSpace = THREE.SRGBColorSpace; // Korrekter Farbraum
      backTexture.generateMipmaps = true;
      backTexture.minFilter = THREE.LinearMipmapLinearFilter;
      backTexture.magFilter = THREE.LinearFilter;
      backTexture.anisotropy = 16;
    }
    return backTexture;
  }, [backTexture]);
  
  // Bildverhältnisse für beide Seiten berechnen
  const frontAspectRatio = frontTexture.image.width / frontTexture.image.height;
  const backAspectRatio = backTexture ? backTexture.image.width / backTexture.image.height : frontAspectRatio;
  
  // Maximale Größe für konsistente Darstellung
  const maxSize = 2.5;
  
  // Vorderseiten-Dimensionen (Aspect Ratio beibehalten)
  const frontImageWidth = frontAspectRatio > 1 ? maxSize : maxSize * frontAspectRatio;
  const frontImageHeight = frontAspectRatio > 1 ? maxSize / frontAspectRatio : maxSize;
  
  // Rückseiten-Dimensionen (Aspect Ratio beibehalten)
  const backImageWidth = backAspectRatio > 1 ? maxSize : maxSize * backAspectRatio;
  const backImageHeight = backAspectRatio > 1 ? maxSize / backAspectRatio : maxSize;
  
  // Rahmengrößen
  const matBorder = 0.15; // Weißer Rand (Passepartout)
  const frameBorder = 0.08; // Schwarzer Rahmen
  const frameDepth = 0.05;
  
  const adjustedPosition: [number, number, number] = [
    position[0],
    position[1],
    position[2]
  ];

  return (
    <group ref={meshRef} position={adjustedPosition} rotation={rotation}>
      {/* Vorderseite - Schwarzer Rahmen mit Schatten */}
      <mesh position={[0, 0, frameDepth / 4]} castShadow receiveShadow>
        <boxGeometry 
          args={[
            frontImageWidth + matBorder * 2 + frameBorder * 2,
            frontImageHeight + matBorder * 2 + frameBorder * 2,
            frameDepth / 2
          ]} 
        />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Schlagschatten-Effekt unter dem Passepartout (Vorderseite) */}
      <mesh position={[0, 0, frameDepth / 2 + 0.005]}>
        <boxGeometry 
          args={[
            frontImageWidth + matBorder * 2 - 0.02,
            frontImageHeight + matBorder * 2 - 0.02,
            0.01
          ]} 
        />
        <meshStandardMaterial color="#cccccc" transparent opacity={0.3} />
      </mesh>
      
      {/* Weißes Passepartout (Vorderseite) */}
      <mesh position={[0, 0, frameDepth / 2 + 0.01]} castShadow receiveShadow>
        <boxGeometry 
          args={[
            frontImageWidth + matBorder * 2,
            frontImageHeight + matBorder * 2,
            0.02
          ]} 
        />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={0.4}
          roughness={0.7}
        />
      </mesh>
      
      {/* Rückseite - Schwarzer Rahmen mit Schatten */}
      {backTexture && (
        <mesh position={[0, 0, -frameDepth / 4]} castShadow receiveShadow>
          <boxGeometry 
            args={[
              backImageWidth + matBorder * 2 + frameBorder * 2,
              backImageHeight + matBorder * 2 + frameBorder * 2,
              frameDepth / 2
            ]} 
          />
          <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      )}
      
      {/* Schlagschatten-Effekt unter dem Passepartout (Rückseite) */}
      {backTexture && (
        <mesh position={[0, 0, -(frameDepth / 2 + 0.005)]}>
          <boxGeometry 
            args={[
              backImageWidth + matBorder * 2 - 0.02,
              backImageHeight + matBorder * 2 - 0.02,
              0.01
            ]} 
          />
          <meshStandardMaterial color="#cccccc" transparent opacity={0.3} />
        </mesh>
      )}
      
      {/* Rückseiten Passepartout (falls Rückbild vorhanden) */}
      {backTexture && (
        <mesh position={[0, 0, -(frameDepth / 2 + 0.01)]} castShadow receiveShadow>
          <boxGeometry 
            args={[
              backImageWidth + matBorder * 2,
              backImageHeight + matBorder * 2,
              0.02
            ]} 
          />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={0.4}
            roughness={0.7}
          />
        </mesh>
      )}
      
      {/* Bild (Vorderseite) */}
      <mesh 
        position={[0, 0, frameDepth / 2 + 0.03]}
        receiveShadow
        onClick={(event) => {
          event.stopPropagation();
          onClickFront?.();
        }}
      >
        <planeGeometry args={[frontImageWidth, frontImageHeight]} />
        <meshStandardMaterial map={frontTexture} />
      </mesh>
      
      {/* Bild (Rückseite) */}
      {backTexture && (
        <mesh 
          position={[0, 0, -(frameDepth / 2 + 0.03)]}
          rotation={[0, Math.PI, 0]}
          receiveShadow
          onClick={(event) => {
            event.stopPropagation();
            onClickBack?.();
          }}
        >
          <planeGeometry args={[backImageWidth, backImageHeight]} />
          <meshStandardMaterial map={backTexture} side={THREE.FrontSide} />
        </mesh>
      )}
      
      {/* Beschriftung (optional) */}
      {frontImage.title && (
        <mesh position={[0, -(frontImageHeight / 2 + matBorder + 0.2), frameDepth / 2]}>
          <planeGeometry args={[frontImageWidth + matBorder * 2, 0.15]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} />
        </mesh>
      )}
    </group>
  );
}

// Memo mit Custom Comparator für optimale Performance
const PictureFrame = memo(PictureFrameComponent, (prevProps, nextProps) => {
  return (
    prevProps.frontImage.id === nextProps.frontImage.id &&
    prevProps.backImage?.id === nextProps.backImage?.id &&
    prevProps.position[0] === nextProps.position[0] &&
    prevProps.position[1] === nextProps.position[1] &&
    prevProps.position[2] === nextProps.position[2] &&
    prevProps.rotation?.[0] === nextProps.rotation?.[0] &&
    prevProps.rotation?.[1] === nextProps.rotation?.[1] &&
    prevProps.rotation?.[2] === nextProps.rotation?.[2]
  );
});

PictureFrame.displayName = 'PictureFrame';

export default PictureFrame;
