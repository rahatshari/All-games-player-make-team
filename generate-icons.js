import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// High-resolution SVG for standard icon (full bleed rounded)
const svgStandard = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3730A3" />
      <stop offset="50%" stop-color="#4338CA" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="40%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  
  <rect width="512" height="512" rx="115" fill="url(#bgGrad)"/>
  
  <!-- Subtle inner rim -->
  <rect x="16" y="16" width="480" height="480" rx="100" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="4"/>

  <!-- Trophy Pedestal -->
  <path d="M180 380 h152 v36 h-152 z" rx="8" fill="url(#goldGrad)" filter="url(#shadow)"/>
  <path d="M226 310 h60 v70 h-60 z" fill="url(#goldGrad)"/>
  
  <!-- Trophy Cup Body -->
  <path d="M156 140 h200 c0 90 -40 170 -100 170 c-60 0 -100 -80 -100 -170 z" fill="url(#goldGrad)" filter="url(#shadow)"/>
  
  <!-- Trophy Handles -->
  <path d="M156 170 c-65 0 -65 90 0 90" fill="none" stroke="url(#goldGrad)" stroke-width="26" stroke-linecap="round"/>
  <path d="M356 170 c65 0 65 90 0 90" fill="none" stroke="url(#goldGrad)" stroke-width="26" stroke-linecap="round"/>
  
  <!-- Trophy Star -->
  <polygon points="256,180 270,215 308,218 278,242 288,278 256,256 224,278 234,242 204,218 242,215" fill="#FFFFFF" filter="url(#shadow)"/>
  
  <!-- Crown / Sparkle accents -->
  <circle cx="256" cy="115" r="14" fill="#FDE047"/>
  <circle cx="196" cy="125" r="10" fill="#FDE047"/>
  <circle cx="316" cy="125" r="10" fill="#FDE047"/>
</svg>
`;

// Maskable icon: Needs safe margin around center graphic (~15-20% padding)
const svgMaskable = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3730A3" />
      <stop offset="50%" stop-color="#4338CA" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <linearGradient id="goldGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="40%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <filter id="shadowM" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  
  <!-- Full bleed background for maskable (no rounded corners, OS will clip) -->
  <rect width="512" height="512" fill="url(#bgGradM)"/>
  
  <!-- Scaled content centered with 20% safe zone margin -->
  <g transform="translate(51, 51) scale(0.8)">
    <path d="M180 380 h152 v36 h-152 z" rx="8" fill="url(#goldGradM)" filter="url(#shadowM)"/>
    <path d="M226 310 h60 v70 h-60 z" fill="url(#goldGradM)"/>
    <path d="M156 140 h200 c0 90 -40 170 -100 170 c-60 0 -100 -80 -100 -170 z" fill="url(#goldGradM)" filter="url(#shadowM)"/>
    <path d="M156 170 c-65 0 -65 90 0 90" fill="none" stroke="url(#goldGradM)" stroke-width="26" stroke-linecap="round"/>
    <path d="M356 170 c65 0 65 90 0 90" fill="none" stroke="url(#goldGradM)" stroke-width="26" stroke-linecap="round"/>
    <polygon points="256,180 270,215 308,218 278,242 288,278 256,256 224,278 234,242 204,218 242,215" fill="#FFFFFF" filter="url(#shadowM)"/>
    <circle cx="256" cy="115" r="14" fill="#FDE047"/>
    <circle cx="196" cy="125" r="10" fill="#FDE047"/>
    <circle cx="316" cy="125" r="10" fill="#FDE047"/>
  </g>
</svg>
`;

async function generate() {
  const stdBuf = Buffer.from(svgStandard);
  const maskBuf = Buffer.from(svgMaskable);

  // 192x192
  await sharp(stdBuf)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192.png'));
  console.log('Created icon-192.png');

  // 512x512
  await sharp(stdBuf)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512.png'));
  console.log('Created icon-512.png');

  // 512x512 maskable
  await sharp(maskBuf)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-512.png'));
  console.log('Created icon-maskable-512.png');

  // apple-touch-icon 180x180
  await sharp(stdBuf)
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Favicon 64x64 & 32x32
  await sharp(stdBuf)
    .resize(64, 64)
    .png()
    .toFile(path.join(__dirname, 'favicon.png'));
  console.log('Created favicon.png');

  // Update logo.svg with high quality artwork
  fs.writeFileSync(path.join(__dirname, 'logo.svg'), svgStandard);
  console.log('Updated logo.svg');
}

generate().catch(console.error);
