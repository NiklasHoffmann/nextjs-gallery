'use client';

import { useRef, memo } from 'react';
import * as THREE from 'three';

interface EmptyFrameProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

function EmptyFrameComponent({ position, rotation = [0, 0, 0] }: EmptyFrameProps) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Standard Bildgröße für leere Rahmen
  const imageWidth = 2;
  const imageHeight = 2;
  
  // Rahmengrößen
  const matBorder = 0.15; // Weißer Rand (Passepartout)
  const frameBorder = 0.08; // Schwarzer Rahmen
  const frameDepth = 0.05;

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Schwarzer Rahmen */}
      <mesh position={[0, 0, -frameDepth / 2]}>
        <boxGeometry 
          args={[
            imageWidth + matBorder * 2 + frameBorder * 2,
            imageHeight + matBorder * 2 + frameBorder * 2,
            frameDepth
          ]} 
        />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Weißes Passepartout (Vorderseite) */}
      <mesh position={[0, 0, frameDepth / 2]}>
        <boxGeometry 
          args={[
            imageWidth + matBorder * 2,
            imageHeight + matBorder * 2,
            0.02
          ]} 
        />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
      </mesh>
      
      {/* Weißes Passepartout (Rückseite) */}
      <mesh position={[0, 0, -(frameDepth / 2 + 0.02)]} rotation={[0, Math.PI, 0]}>
        <boxGeometry 
          args={[
            imageWidth + matBorder * 2,
            imageHeight + matBorder * 2,
            0.02
          ]} 
        />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

// Memo für bessere Performance
const EmptyFrame = memo(EmptyFrameComponent, (prevProps, nextProps) => {
  return (
    prevProps.position[0] === nextProps.position[0] &&
    prevProps.position[1] === nextProps.position[1] &&
    prevProps.position[2] === nextProps.position[2] &&
    prevProps.rotation?.[0] === nextProps.rotation?.[0] &&
    prevProps.rotation?.[1] === nextProps.rotation?.[1] &&
    prevProps.rotation?.[2] === nextProps.rotation?.[2]
  );
});

EmptyFrame.displayName = 'EmptyFrame';

export default EmptyFrame;
