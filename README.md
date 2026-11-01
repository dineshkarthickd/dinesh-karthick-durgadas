# Dinesh Karthick — GTA Vice City-Themed Interactive Portfolio

An interactive, responsive developer portfolio inspired by GTA Vice City's neon aesthetic and gameplay UI. Built with React 19, TypeScript, Vite, Tailwind CSS v4, and Motion.

## Features

- **GTA Gameplay HUD**: Minimap, star wanted rating, live Colombo/Kolkata clock, respect score/money tracker, and interactive DK FM 104.9 radio player.
- **Weapon-Wheel Loadout**: 9 skill trees arranged on an interactive weapon wheel with mouse-aim and keyboard hotkeys.
- **GTA Announcement Certificate Viewer**: Protected in-game trophy modal with custom watermark, zoom, and anti-copy deterrents.
- **Living Backgrounds**: Seamless cinemagraph loop videos and WebP fallbacks with smooth cross-dissolve transitions.
- **Responsive Layout**: Dedicated desktop arcade frame for wide screens (≥1024px landscape) and native touch-scrolling stacked layout for mobile & tablet viewports.

## Getting Started

### Installation & Development

```bash
cd site
npm install
npm run dev
```

### Production Build & Linting

```bash
npm run build
npm run lint
```

## Asset Pipeline Scripts

### 1. Living Video Background Encoding

Encodes cross-faded seamless video loops (WebM VP9 & MP4 H.264) and first-frame posters from `../art/videos` into `public/art/video/`:

```bash
node scripts/encode-videos.mjs
# Override video source folder:
node scripts/encode-videos.mjs --src ../custom/videos
```

### 2. Watermarked Certificate Previews

Renders watermarked 1400px WebP certificate previews from offline PDF documents in `../Certificates` into `src/assets/certs/`:

```bash
node scripts/render-certificates.mjs
# Override certificates source folder:
node scripts/render-certificates.mjs --src ../custom/certificates
```

### 3. Favicon & Web App Icon Generation

Crops the empty margin from `../Favicon.png` and generates optimized multi-resolution favicons (`favicon.ico`, PNG sizes 16, 32, 48, 180, 192, 512) into `public/`:

```bash
npm run favicons
# or:
node scripts/make-favicons.mjs
# Override favicon source file:
node scripts/make-favicons.mjs --src ../custom/Favicon.png
```

## Deployment

Configured for hosting on **Vercel**:
- Set **Root Directory** to `site` in Vercel project settings.
- Build command: `npm run build`
- Output directory: `dist`
