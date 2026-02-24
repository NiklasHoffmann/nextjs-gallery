#!/usr/bin/env node
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputDir = join(__dirname, '..', 'public', 'images', 'gallery');
const outputDir = join(__dirname, '..', 'public', 'images', 'gallery-optimized');
const metadataFile = join(outputDir, 'metadata.json');

async function optimizeImages() {
  console.log('🖼️  Starte Bildoptimierung...\n');

  // Erstelle Output-Verzeichnis
  try {
    await mkdir(outputDir, { recursive: true });
  } catch (err) {
    // Verzeichnis existiert bereits
  }

  // Lese alle Dateien
  const files = await readdir(inputDir);
  const imageFiles = files.filter((file) => {
    const ext = extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext);
  });

  console.log(`📁 Gefundene Bilder: ${imageFiles.length}\n`);

  // Sammle Bild-Metadaten für Sortierung
  const imageMetadata = [];
  for (const file of imageFiles) {
    const inputPath = join(inputDir, file);
    try {
      const metadata = await sharp(inputPath).metadata();
      
      // Berücksichtige EXIF-Orientierung (Rotation)
      // Bei Orientation 5,6,7,8 sind Breite und Höhe vertauscht
      let width = metadata.width;
      let height = metadata.height;
      
      if (metadata.orientation && metadata.orientation >= 5 && metadata.orientation <= 8) {
        // Breite und Höhe sind vertauscht
        [width, height] = [height, width];
      }
      
      const isPortrait = height > width;
      imageMetadata.push({ file, isPortrait, width, height, orientation: metadata.orientation });
      console.log(`📷 ${file}: ${width}x${height} ${isPortrait ? '(Portrait)' : '(Landscape)'} [EXIF: ${metadata.orientation || 'none'}]`);
    } catch (err) {
      console.error(`❌ Fehler beim Lesen von ${file}:`, err.message);
    }
  }

  // Sortiere: erst Landscape, dann Portrait (in Paaren)
  const portraitImages = imageMetadata.filter(img => img.isPortrait);
  const landscapeImages = imageMetadata.filter(img => !img.isPortrait);
  
  console.log(`\n📐 Landscape-Bilder verfügbar: ${landscapeImages.length}`);
  console.log(`📐 Portrait-Bilder verfügbar: ${portraitImages.length}`);
  
  // Ziel: 50 Landscape + 48 Portrait = 98 Bilder (49 Rahmen × 2 Seiten)
  const targetLandscape = 50;
  const targetPortrait = 48;
  
  const useLandscape = Math.min(targetLandscape, landscapeImages.length);
  const usePortrait = Math.min(targetPortrait, portraitImages.length);
  
  const balancedLandscape = landscapeImages.slice(0, useLandscape);
  const balancedPortrait = portraitImages.slice(0, usePortrait);
  
  console.log(`✅ Verwende: ${useLandscape} Landscape + ${usePortrait} Portrait = ${useLandscape + usePortrait} Bilder\n`);
  
  if (landscapeImages.length < targetLandscape) {
    console.log(`⚠️  Nur ${landscapeImages.length} Landscape-Bilder gefunden (Ziel: ${targetLandscape})`);
  }
  if (portraitImages.length < targetPortrait) {
    console.log(`⚠️  Nur ${portraitImages.length} Portrait-Bilder gefunden (Ziel: ${targetPortrait})\n`);
  }
  
  // Erstelle sortiertes Array: abwechselnd 2 Landscape, 2 Portrait
  const sortedFiles = [];
  let lIdx = 0, pIdx = 0;
  
  while (lIdx < balancedLandscape.length || pIdx < balancedPortrait.length) {
    // Füge 2 Landscape-Bilder hinzu (Paar für Vorder- und Rückseite)
    if (lIdx < balancedLandscape.length) {
      sortedFiles.push(balancedLandscape[lIdx].file);
      lIdx++;
    }
    if (lIdx < balancedLandscape.length) {
      sortedFiles.push(balancedLandscape[lIdx].file);
      lIdx++;
    }
    
    // Füge 2 Portrait-Bilder hinzu (Paar für Vorder- und Rückseite)
    if (pIdx < balancedPortrait.length) {
      sortedFiles.push(balancedPortrait[pIdx].file);
      pIdx++;
    }
    if (pIdx < balancedPortrait.length) {
      sortedFiles.push(balancedPortrait[pIdx].file);
      pIdx++;
    }
  }

  let processed = 0;
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  const imageMetadataOutput = [];

  for (const file of sortedFiles) {
    const inputPath = join(inputDir, file);
    const outputFilename = basename(file, extname(file)) + '.webp';
    const outputPath = join(outputDir, outputFilename);

    try {
      // Originalgröße
      const inputStats = await sharp(inputPath).metadata();
      const inputBuffer = await sharp(inputPath).toBuffer();
      totalOriginalSize += inputBuffer.length;

      // Berechne finale Dimensionen nach Rotation
      let width = inputStats.width;
      let height = inputStats.height;
      if (inputStats.orientation && inputStats.orientation >= 5 && inputStats.orientation <= 8) {
        [width, height] = [height, width];
      }
      const isPortrait = height > width;

      // Optimiere und konvertiere zu WebP mit EXIF-Orientierung
      const outputBuffer = await sharp(inputPath)
        .rotate() // Automatische Rotation basierend auf EXIF-Daten
        .resize(2048, 2048, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: 85,
          effort: 6,
        })
        .toBuffer();

      await sharp(outputBuffer).toFile(outputPath);
      totalOptimizedSize += outputBuffer.length;

      // Speichere Metadaten
      imageMetadataOutput.push({
        filename: outputFilename,
        isPortrait,
        width,
        height,
        originalFilename: file,
      });

      const savings = ((1 - outputBuffer.length / inputBuffer.length) * 100).toFixed(1);
      console.log(`✅ ${file} → ${outputFilename} (${savings}% kleiner) [${isPortrait ? 'Portrait' : 'Landscape'}]`);
      processed++;
    } catch (err) {
      console.error(`❌ Fehler bei ${file}:`, err.message);
    }
  }

  // Speichere Metadaten-JSON
  await writeFile(metadataFile, JSON.stringify(imageMetadataOutput, null, 2));
  console.log(`\n💾 Metadaten gespeichert: ${metadataFile}`);

  const totalSavings = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);
  const originalMB = (totalOriginalSize / 1024 / 1024).toFixed(2);
  const optimizedMB = (totalOptimizedSize / 1024 / 1024).toFixed(2);

  console.log(`\n✨ Fertig! ${processed} Bilder optimiert`);
  console.log(`📊 Original: ${originalMB} MB`);
  console.log(`📊 Optimiert: ${optimizedMB} MB`);
  console.log(`💾 Gespart: ${totalSavings}%`);
  
  // Ausgabe der sortierten Dateiliste für page.tsx
  console.log(`\n📋 Sortierte Dateiliste für page.tsx (in Reihenfolge):\n`);
  const webpFiles = sortedFiles.map(file => basename(file, extname(file)) + '.webp');
  console.log('const imageFiles = [');
  for (let i = 0; i < webpFiles.length; i += 5) {
    const chunk = webpFiles.slice(i, i + 5).map(f => `'${f}'`).join(', ');
    console.log(`  ${chunk},`);
  }
  console.log('];\n');
}

optimizeImages().catch(console.error);
