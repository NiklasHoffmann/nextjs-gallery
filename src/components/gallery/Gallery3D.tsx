'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, PointerLockControls } from '@react-three/drei';
import {
  Suspense,
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import PictureFrame from './PictureFrame';
import EmptyFrame from './EmptyFrame';
import { GalleryNavigation } from './GalleryNavigation';
import { GalleryImage } from './types';
import * as THREE from 'three';

interface Gallery3DProps {
  images: GalleryImage[];
}

export default function Gallery3D({ images }: Gallery3DProps) {
  const gridSize = 5;
  const gridRange = 3; // -3 bis 3 = 7x7 = 49 Punkte (98 Bilder bei 2 pro Rahmen)
  const [targetImagePos, setTargetImagePos] = useState<{
    position: [number, number, number];
    rotation: number;
    endPos?: [number, number, number];
    lookAt?: [number, number, number];
    setFocus?: boolean;
    gridDistance?: number; // Grid-Distanz für stayLow-Berechnung
    isBack?: boolean; // Ob Rückseite angezeigt wird
  } | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [sliderActive, setSliderActive] = useState(false);
  const focusRef = useRef({ active: false, y: 1.6 });
  const hoverHeight = 4.5;
  const animatingRef = useRef(false);
  const animationTokenRef = useRef(0);

  // Berechnungen memoizen damit sie stabil bleiben
  const { gridPoints, totalGridPoints, usedPoints, freePointsCount } =
    useMemo(() => {
      // Alle Grid-Punkte generieren
      const allPoints: Array<{
        x: number;
        z: number;
        gx: number;
        gz: number;
        id: string;
        hasImages: boolean;
        frontImageIndex?: number;
        backImageIndex?: number;
        rot: number;
      }> = [];

      for (let gz = -gridRange; gz <= gridRange; gz++) {
        for (let gx = -gridRange; gx <= gridRange; gx++) {
          const x = gx * gridSize;
          const z = gz * gridSize;
          const id = `${gx}_${gz}`;

          // Zufällige Rotation in 90-Grad-Schritten
          const seed = (gx + gridRange) * 100 + (gz + gridRange);
          const rotationStep = Math.floor((Math.sin(seed) * 10000) % 4);
          const rot = Math.abs(rotationStep) % 4;

          allPoints.push({
            x,
            z,
            gx,
            gz,
            id,
            hasImages: false,
            rot,
          });
        }
      }

      // Verteile Bilder: 2 pro Rahmen (Vorder- und Rückseite)
      // Die Bilder sind bereits nach Ausrichtung sortiert (Landscape-Paare, Portrait-Paare)
      
      // Mische die allPoints für zufällige Verteilung
      const shuffled = [...allPoints].sort((a, b) => {
        const hashA = Math.sin(a.gx * 12.9898 + a.gz * 78.233) * 43758.5453;
        const hashB = Math.sin(b.gx * 12.9898 + b.gz * 78.233) * 43758.5453;
        return (hashA % 1) - (hashB % 1);
      });

      let imageIndex = 0;
      
      // Weise jedem Rahmen 2 aufeinanderfolgende Bilder zu (vorne + hinten)
      // Aufeinanderfolgende Bilder haben die gleiche Ausrichtung
      for (let i = 0; i < shuffled.length && imageIndex < images.length; i++) {
        const originalIndex = allPoints.findIndex(
          (p) => p.id === shuffled[i].id
        );

        if (originalIndex !== -1) {
          // Vorderseite
          if (imageIndex < images.length) {
            allPoints[originalIndex].frontImageIndex = imageIndex;
            allPoints[originalIndex].hasImages = true;
            imageIndex++;
          }
          
          // Rückseite - nächstes Bild (gleiche Ausrichtung)
          if (imageIndex < images.length) {
            allPoints[originalIndex].backImageIndex = imageIndex;
            imageIndex++;
          }
        }
      }

      const used = allPoints.filter((p) => p.hasImages).length;
      const free = allPoints.length - used;

      return {
        gridPoints: allPoints,
        totalGridPoints: allPoints.length,
        usedPoints: used,
        freePointsCount: free,
      };
    }, [images.length]);

  const imagePoints = useMemo(() => {
    const points: Array<
      { x: number; z: number; rot: number; gx: number; gz: number } | undefined
    > = new Array(images.length);
    gridPoints.forEach((point) => {
      // Vorderseite
      if (point.hasImages && point.frontImageIndex !== undefined) {
        points[point.frontImageIndex] = {
          x: point.x,
          z: point.z,
          rot: point.rot,
          gx: point.gx,
          gz: point.gz,
        };
      }
      // Rückseite
      if (point.hasImages && point.backImageIndex !== undefined) {
        points[point.backImageIndex] = {
          x: point.x,
          z: point.z,
          rot: point.rot,
          gx: point.gx,
          gz: point.gz,
        };
      }
    });
    return points;
  }, [gridPoints, images.length]);

  const goToImage = useCallback(
    (index: number, fromIndex?: number | null, isBack?: boolean) => {
      const point = imagePoints[index];
      if (!point) return;
      const y = 1.6;
      // Wenn Rückseite, addiere 180° zur Rotation
      const rotationY = point.rot * (Math.PI / 2) + (isBack ? Math.PI : 0);
      
      // Berechne Grid-Distanz wenn fromIndex gegeben ist
      let gridDistance = 0;
      if (fromIndex !== null && fromIndex !== undefined) {
        const fromPoint = imagePoints[fromIndex];
        if (fromPoint) {
          gridDistance = Math.abs(fromPoint.gx - point.gx) + Math.abs(fromPoint.gz - point.gz);
        }
      }
      
      setTargetImagePos({
        position: [point.x, y, point.z],
        rotation: rotationY,
        gridDistance, // Übergebe Grid-Distanz an Animation
        isBack, // Übergebe Rückseiten-Flag
      });
    },
    [imagePoints]
  );

  const goNext = useCallback(() => {
    if (images.length === 0) return;
    const nextIndex =
      activeImageIndex === null ? 0 : (activeImageIndex + 1) % images.length;
    
    // Prüfe ob das neue Bild auf der Rückseite eines Rahmens ist
    const framePoint = gridPoints.find(p => p.backImageIndex === nextIndex);
    const isBack = framePoint !== undefined;
    
    setSliderActive(true);
    setActiveImageIndex(nextIndex);
    goToImage(nextIndex, activeImageIndex, isBack);
  }, [activeImageIndex, images.length, goToImage, gridPoints]);

  const goPrev = useCallback(() => {
    if (images.length === 0) return;
    const prevIndex =
      activeImageIndex === null
        ? 0
        : (activeImageIndex - 1 + images.length) % images.length;
    
    // Prüfe ob das neue Bild auf der Rückseite eines Rahmens ist
    const framePoint = gridPoints.find(p => p.backImageIndex === prevIndex);
    const isBack = framePoint !== undefined;
    
    setSliderActive(true);
    setActiveImageIndex(prevIndex);
    goToImage(prevIndex, activeImageIndex, isBack);
  }, [activeImageIndex, images.length, goToImage, gridPoints]);

  const exitToOverview = useCallback(() => {
    if (activeImageIndex === null) return;
    const point = imagePoints[activeImageIndex];
    if (!point) return;
    const y = 1.6;
    const rotationY = point.rot * (Math.PI / 2);
    const offset = 6;
    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      rotationY
    );
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      rotationY
    );
    const diagonal = forward.add(right).normalize().multiplyScalar(offset);
    const endPos: [number, number, number] = [
      point.x + diagonal.x,
      hoverHeight,
      point.z + diagonal.z,
    ];

    setTargetImagePos({
      position: [point.x, y, point.z],
      rotation: rotationY,
      endPos,
      lookAt: [point.x, y, point.z],
      setFocus: false,
    });
  }, [activeImageIndex, hoverHeight, imagePoints]);

  // Kamera-Animation Komponente
  function CameraController() {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);
    const movementRef = useRef({
      forward: false,
      backward: false,
      left: false,
      right: false,
      speed: 5,
    });

    // Kamera-Begrenzungen
    const maxDistanceFromEdge = gridSize / 2; // 2.5 - halb so viel wie der Abstand zwischen Bildern
    const minX = -gridRange * gridSize - maxDistanceFromEdge;
    const maxX = gridRange * gridSize + maxDistanceFromEdge;
    const minZ = -gridRange * gridSize - maxDistanceFromEdge;
    const maxZ = gridRange * gridSize + maxDistanceFromEdge;
    const minPolarAngle = Math.PI / 2 + (15 * Math.PI) / 180; // 15° nach unten von horizontal (75° von oben)
    const maxPolarAngle = Math.PI - (15 * Math.PI) / 180; // bis 15° vor vertikal nach unten (165° von oben)

    // Kollisionsradius für jedes Bild (Kugel um das Bild)
    const collisionRadius = 2.25; // Abstand den die Kamera zum Bild halten muss

    // Hilfsfunktion: Prüft ob eine Position mit einem Bild kollidiert
    const checkCollision = (position: THREE.Vector3): boolean => {
      // Bei Animation oder Slider-Modus keine Kollision
      if (animatingRef.current || sliderActive) return false;

      for (const point of gridPoints) {
        if (!point.hasImages) continue;

        const imagePos = new THREE.Vector3(point.x, 1.6, point.z);
        const distance = position.distanceTo(imagePos);

        if (distance < collisionRadius) {
          return true; // Kollision erkannt
        }
      }
      return false;
    };

    useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
          case 'KeyW':
            movementRef.current.forward = true;
            break;
          case 'KeyS':
            movementRef.current.backward = true;
            break;
          case 'KeyA':
            movementRef.current.left = true;
            break;
          case 'KeyD':
            movementRef.current.right = true;
            break;
        }
      };

      const onKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
          case 'KeyW':
            movementRef.current.forward = false;
            break;
          case 'KeyS':
            movementRef.current.backward = false;
            break;
          case 'KeyA':
            movementRef.current.left = false;
            break;
          case 'KeyD':
            movementRef.current.right = false;
            break;
        }
      };

      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      return () => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
      };
    }, []);

    useEffect(() => {
      if (controlsRef.current) {
        controlsRef.current.enabled = !sliderActive && !animatingRef.current;
        // Setze Winkel-Begrenzungen direkt auf die Controls
        controlsRef.current.minPolarAngle = minPolarAngle;
        controlsRef.current.maxPolarAngle = maxPolarAngle;
      }
    }, [sliderActive, minPolarAngle, maxPolarAngle]);

    useFrame((_, delta) => {
      if (!sliderActive) {
        focusRef.current.active = false;
      }

      // Höhe: Standard oberhalb der Bilder, nur bei Fokus auf Bildhöhe
      if (!animatingRef.current) {
        if (focusRef.current.active || sliderActive) {
          camera.position.y = focusRef.current.y;
        } else {
          camera.position.y = hoverHeight;
        }
      }

      if (sliderActive || animatingRef.current) return;
      if (!controlsRef.current || controlsRef.current.enabled === false) return;

      const { forward, backward, left, right, speed } = movementRef.current;
      if (!forward && !backward && !left && !right) return;

      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();

      const rightVec = new THREE.Vector3()
        .crossVectors(direction, new THREE.Vector3(0, 1, 0))
        .normalize();

      const move = new THREE.Vector3();
      if (forward) move.add(direction);
      if (backward) move.sub(direction);
      if (right) move.add(rightVec);
      if (left) move.sub(rightVec);

      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(speed * delta);
        const newPos = camera.position.clone().add(move);

        // Begrenze Position auf maximale Entfernung vom Rand
        newPos.x = Math.max(minX, Math.min(maxX, newPos.x));
        newPos.z = Math.max(minZ, Math.min(maxZ, newPos.z));

        // Prüfe Kollision mit Bildern
        if (!checkCollision(newPos)) {
          // Keine Kollision - Bewegung erlaubt
          camera.position.copy(newPos);
        } else {
          // Kollision erkannt - versuche Bewegung entlang der Tangente (gleiten)
          // Teste nur X-Bewegung
          const newPosX = camera.position.clone();
          newPosX.x = newPos.x;
          if (!checkCollision(newPosX)) {
            camera.position.copy(newPosX);
          }

          // Teste nur Z-Bewegung
          const newPosZ = camera.position.clone();
          newPosZ.z = newPos.z;
          if (!checkCollision(newPosZ)) {
            camera.position.copy(newPosZ);
          }
        }
      }
    });

    useEffect(() => {
      if (!targetImagePos) return;

      const {
        position: imagePosition,
        rotation: imageRotation,
        endPos: customEndPos,
        lookAt: customLookAt,
        setFocus,
      } = targetImagePos;

      // Das Bild schaut in Richtung seiner Y-Rotation
      // rotation=0 → Bild schaut nach -Z (nach "vorne" im 3D-Raum)
      // rotation=π/2 → Bild schaut nach +X (nach "rechts")
      // rotation=π → Bild schaut nach +Z (nach "hinten")
      // rotation=3π/2 → Bild schaut nach -X (nach "links")

      // Kamera muss VOR dem Bild stehen (in Richtung der Bild-Normale)
      const distance = 3;

      // Bild-Front in lokale +Z Richtung, rotiert um Y
      const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        imageRotation
      );

      const endPos = customEndPos
        ? new THREE.Vector3(customEndPos[0], customEndPos[1], customEndPos[2])
        : new THREE.Vector3(
            imagePosition[0],
            imagePosition[1],
            imagePosition[2]
          ).add(forward.multiplyScalar(distance));

      // Zielhöhe ist Bildhöhe (ohne Sprung, wird interpoliert) falls nicht überschrieben
      if (!customEndPos) {
        endPos.y = imagePosition[1];
        focusRef.current.y = imagePosition[1];
      }

      console.log(
        '🖼️ Bild:',
        imagePosition,
        '| Rotation:',
        ((imageRotation * 180) / Math.PI).toFixed(0) + '°',
        '| Forward:',
        forward.x.toFixed(2),
        forward.z.toFixed(2),
        '| Kamera:',
        endPos.x.toFixed(2),
        endPos.z.toFixed(2)
      );

      // Während der Animation Eingaben sperren (POV bleibt stabil)
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }

      // Berechne Pfad um Hindernisse herum (Bogen über die Bilder)
      const startPos = camera.position.clone();
      
      // Verwende Grid-Distanz die in goToImage berechnet wurde
      const gridDistance = targetImagePos.gridDistance ?? 0;
      
      // Wenn auf Bildhöhe UND Distanz <= 3 Grid-Positionen: bleibe auf Bildhöhe
      const stayLow = sliderActive && gridDistance > 0 && gridDistance <= 3;
      
      let safeHeight = stayLow ? 1.6 : hoverHeight; // Bleibe niedrig oder fliege hoch
      
      // Nur wenn wir hoch fliegen, prüfe Kollisionen im Pfad
      if (!stayLow) {
        const pathDirection = new THREE.Vector3().subVectors(endPos, startPos);
        const pathLength = pathDirection.length();
        
        // Prüfe alle Bildpositionen ob sie im Pfad liegen
        for (const point of gridPoints) {
          if (!point.hasImages) continue;
          
          const imagePos = new THREE.Vector3(point.x, 1.6, point.z);
          const toImage = new THREE.Vector3().subVectors(imagePos, startPos);
        
        // Projiziere Bildposition auf den Pfad
        const projection = toImage.dot(pathDirection.normalize());
        
        // Wenn das Bild zwischen Start und Ziel liegt (0 < projection < pathLength)
        if (projection > 0 && projection < pathLength) {
          const projectedPoint = startPos.clone().add(pathDirection.clone().normalize().multiplyScalar(projection));
          const distanceToPic = imagePos.distanceTo(projectedPoint);
          
          // Wenn das Bild nah am Pfad liegt, erhöhe die sichere Höhe
          if (distanceToPic < collisionRadius) {
            safeHeight = Math.max(safeHeight, hoverHeight + 2); // Extra Höhe für Sicherheit
          }
        }
        }
      }
      
      const midPoint = new THREE.Vector3(
        (startPos.x + endPos.x) / 2,
        safeHeight, // Verwende berechnete sichere Höhe
        (startPos.z + endPos.z) / 2
      );

      // Animiere Kamera Position + Rotation
      const startQuaternion = camera.quaternion.clone();
      const tempCamera = camera.clone();
      tempCamera.position.copy(endPos);
      const lookAtTarget = customLookAt ?? imagePosition;
      tempCamera.lookAt(lookAtTarget[0], lookAtTarget[1], lookAtTarget[2]);
      const endQuaternion = tempCamera.quaternion.clone();

      const duration = 1500;
      const startTime = Date.now();

      const currentToken = ++animationTokenRef.current;

      const animate = () => {
        if (currentToken !== animationTokenRef.current) return;
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Weiches Easing (easeInOutCubic)
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        // Quadratische Bézierkurve für sanften Bogen
        // P(t) = (1-t)²·P0 + 2(1-t)t·P1 + t²·P2
        const t = eased;
        const oneMinusT = 1 - t;
        const bezierPos = new THREE.Vector3(
          oneMinusT * oneMinusT * startPos.x +
            2 * oneMinusT * t * midPoint.x +
            t * t * endPos.x,
          oneMinusT * oneMinusT * startPos.y +
            2 * oneMinusT * t * midPoint.y +
            t * t * endPos.y,
          oneMinusT * oneMinusT * startPos.z +
            2 * oneMinusT * t * midPoint.z +
            t * t * endPos.z
        );

        camera.position.copy(bezierPos);

        // Interpoliere Rotation (sanfte Drehung)
        camera.quaternion.slerpQuaternions(
          startQuaternion,
          endQuaternion,
          eased
        );

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          if (currentToken !== animationTokenRef.current) return;
          // Eingaben wieder aktivieren
          if (controlsRef.current) {
            controlsRef.current.enabled = !sliderActive;
          }
          if (setFocus ?? true) {
            focusRef.current.active = true;
          } else {
            focusRef.current.active = false;
          }
          animatingRef.current = false;
          // Erst JETZT den State zurücksetzen
          setTargetImagePos(null);
        }
      };
      animatingRef.current = true;
      animate(); // Animation starten!
    }, [targetImagePos, camera]);

    return sliderActive ? null : <PointerLockControls ref={controlsRef} />;
  }

  return (
    <div className="h-screen w-full bg-white">
      <Canvas
        shadows
        gl={{
          toneMapping: THREE.NoToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <Suspense fallback={null}>
          {/* Beleuchtung - neutral für originalgetreue Darstellung */}
          <ambientLight intensity={1.8} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={0.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <directionalLight position={[-5, 10, -5]} intensity={0.6} />
          <pointLight position={[0, 5, 0]} intensity={0.3} castShadow />

          {/* Kamera */}
          <PerspectiveCamera makeDefault position={[0, 1.6, 8]} fov={50} />

          {/* Netz-Achsen visualisieren */}
          {/* X-Achse (rot) */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 40, 8]} />
            <meshBasicMaterial color="#ff0000" opacity={0.3} transparent />
          </mesh>
          {/* Z-Achse (blau) */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 40, 8]} />
            <meshBasicMaterial color="#0000ff" opacity={0.3} transparent />
          </mesh>

          {/* Alle Rahmen rendern - mit oder ohne Bild */}
          {gridPoints.map((point) => {
            const y = 1.6; // Augenhöhe
            const rotationY = point.rot * (Math.PI / 2);

            if (point.hasImages && (point.frontImageIndex !== undefined || point.backImageIndex !== undefined)) {
              // Rahmen mit Bildern (Vorder- und/oder Rückseite)
              const frontImage = point.frontImageIndex !== undefined ? images[point.frontImageIndex] : undefined;
              const backImage = point.backImageIndex !== undefined ? images[point.backImageIndex] : undefined;
              
              // Mindestens ein Bild muss vorhanden sein
              if (!frontImage && !backImage) return null;
              
              return (
                <PictureFrame
                  key={`frame-${point.id}`}
                  frontImage={frontImage || backImage!}
                  backImage={backImage}
                  position={[point.x, y, point.z]}
                  rotation={[0, rotationY, 0]}
                  onClickFront={() => {
                    if (point.frontImageIndex !== undefined) {
                      setSliderActive(true);
                      setActiveImageIndex(point.frontImageIndex);
                      goToImage(point.frontImageIndex, null, false);
                    }
                  }}
                  onClickBack={() => {
                    if (point.backImageIndex !== undefined) {
                      setSliderActive(true);
                      setActiveImageIndex(point.backImageIndex);
                      goToImage(point.backImageIndex, null, true);
                    }
                  }}
                />
              );
            } else {
              // Leerer Rahmen
              return (
                <EmptyFrame
                  key={`frame-${point.id}`}
                  position={[point.x, y, point.z]}
                  rotation={[0, rotationY, 0]}
                />
              );
            }
          })}

          {/* Steuerung */}
          <CameraController />
        </Suspense>
      </Canvas>

      {/* Navigation UI - Clean Minimalist Design */}
      {sliderActive && (
        <>
          {/* Bildinfo oben */}
          <div className="fixed top-8 left-1/2 z-30 -translate-x-1/2">
            <div className="rounded-full bg-black/60 px-6 py-2 backdrop-blur-md">
              <div className="text-sm font-medium text-white">
                {activeImageIndex !== null && images[activeImageIndex] && (
                  <span>{images[activeImageIndex].title}</span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Controls unten */}
          <div className="fixed bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4">
            {/* Zurück Button */}
            <button
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-md transition-all hover:bg-black/80"
              onClick={goPrev}
              aria-label="Vorheriges Bild"
            >
              <svg
                className="h-6 w-6 text-white transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Bildzähler */}
            <div className="flex items-center gap-2 rounded-full bg-black/60 px-5 py-2 backdrop-blur-md">
              <span className="text-lg font-medium text-white">
                {activeImageIndex !== null ? activeImageIndex + 1 : 0}
              </span>
              <span className="text-sm text-white/60">/</span>
              <span className="text-sm text-white/80">{images.length}</span>
            </div>

            {/* Weiter Button */}
            <button
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-md transition-all hover:bg-black/80"
              onClick={goNext}
              aria-label="Nächstes Bild"
            >
              <svg
                className="h-6 w-6 text-white transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Beenden Button oben rechts */}
          <button
            className="fixed top-8 right-8 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md transition-all hover:bg-black/80"
            onClick={() => {
              exitToOverview();
              setSliderActive(false);
              setActiveImageIndex(null);
            }}
            aria-label="Galerie-Ansicht beenden"
          >
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </>
      )}

      {/* Netz-Info Overlay - Minimalistisch */}
      {!sliderActive && (
        <div className="fixed bottom-8 right-8 z-20 rounded-2xl bg-black/40 px-4 py-3 text-sm backdrop-blur-md">
          <div className="space-y-1 text-white/90">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white/60"></div>
              <span>{usedPoints} Bilder</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white/30"></div>
              <span>{freePointsCount} Rahmen frei</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
