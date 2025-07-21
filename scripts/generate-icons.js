#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 * This script creates placeholder icons for the BIM Viewer PWA
 * 
 * Note: In a real project, you would replace these with actual designed icons
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon sizes needed for PWA
const iconSizes = [
  16, 32, 57, 60, 72, 76, 96, 114, 120, 128, 144, 150, 152, 180, 192, 384, 512
];

// Create icons directory
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate placeholder SVG content for each icon size
iconSizes.forEach(size => {
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6528d7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold">BIM</text>
</svg>`;

  const filePath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created: icon-${size}x${size}.svg`);
});

// Create a simple PNG placeholder (base64 encoded minimal PNG)
const pngPlaceholder = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

iconSizes.forEach(size => {
  const filePath = path.join(iconsDir, `icon-${size}x${size}.png`);
  fs.writeFileSync(filePath, pngPlaceholder);
  console.log(`Created: icon-${size}x${size}.png (placeholder)`);
});

console.log('\n✅ PWA icons generated successfully!');
console.log('📝 Note: These are placeholder icons. Replace with actual designed icons for production.');
console.log('🎨 Recommended: Use a tool like Figma, Sketch, or online icon generators to create proper icons.'); 