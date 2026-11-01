import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import ffmpegPath from 'ffmpeg-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root paths & CLI overrides
const siteDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const srcArgIndex = args.indexOf('--src');
const customSrc = srcArgIndex !== -1 ? args[srcArgIndex + 1] : null;

const artVideosDir = customSrc
  ? path.resolve(process.cwd(), customSrc)
  : path.resolve(siteDir, '../art/videos');

const outputDir = path.resolve(siteDir, 'public/art/video');

if (!ffmpegPath) {
  throw new Error('ffmpeg-static binary not found. Please install ffmpeg-static.');
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const NAME_MAP = {
  'mission-completed': 'mission-complete',
};

function getDuration(videoPath) {
  try {
    execFileSync(ffmpegPath, ['-i', videoPath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    throw new Error(`Failed to extract duration for ${videoPath}: ffmpeg command exited without printing duration.`);
  } catch (err) {
    const output = (err.stderr || err.stdout || '').toString();
    const match = output.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      const h = parseFloat(match[1]);
      const m = parseFloat(match[2]);
      const s = parseFloat(match[3]);
      return h * 3600 + m * 60 + s;
    }
    throw new Error(`Failed to parse duration for ${videoPath} from ffmpeg output: ${output.slice(0, 300)}`);
  }
}

async function run() {
  console.log('--- Video Encoding Script ---');
  console.log(`Source dir: ${artVideosDir}`);
  console.log(`Output dir: ${outputDir}`);

  if (!fs.existsSync(artVideosDir)) {
    console.warn(`Source folder ${artVideosDir} not found.`);
    return;
  }

  const files = fs.readdirSync(artVideosDir).filter((f) => f.endsWith('.mp4'));
  const processedKeys = [];

  for (const file of files) {
    const rawKey = path.basename(file, '.mp4');
    const key = NAME_MAP[rawKey] || rawKey;
    const srcPath = path.join(artVideosDir, file);
    const srcStat = fs.statSync(srcPath);

    const mp4Out = path.join(outputDir, `${key}.mp4`);
    const webmOut = path.join(outputDir, `${key}.webm`);
    const posterOut = path.join(outputDir, `${key}-poster.webp`);

    const shouldEncode =
      !fs.existsSync(mp4Out) ||
      !fs.existsSync(webmOut) ||
      !fs.existsSync(posterOut) ||
      fs.statSync(mp4Out).mtimeMs < srcStat.mtimeMs ||
      fs.statSync(webmOut).mtimeMs < srcStat.mtimeMs ||
      fs.statSync(posterOut).mtimeMs < srcStat.mtimeMs;

    if (shouldEncode) {
      console.log(`\nEncoding [${rawKey} -> ${key}]...`);
      const dur = getDuration(srcPath);
      const offset = Math.max(0, dur - 1.6).toFixed(2);
      console.log(`  Duration: ${dur.toFixed(2)}s, xfade offset: ${offset}s`);

      // 1. Generate seamless loop MP4
      const filterComplex = `[0:v]split[a][b];[a]trim=start=0.8,setpts=PTS-STARTPTS[main];[b]trim=end=0.8,setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=0.8:offset=${offset},format=yuv420p[v]`;

      console.log('  Generating MP4 (H.264 high, CRF 25)...');
      execFileSync(
        ffmpegPath,
        [
          '-y',
          '-i',
          srcPath,
          '-filter_complex',
          filterComplex,
          '-map',
          '[v]',
          '-c:v',
          'libx264',
          '-crf',
          '25',
          '-pix_fmt',
          'yuv420p',
          '-movflags',
          '+faststart',
          '-an',
          mp4Out,
        ],
        { stdio: 'inherit' }
      );

      // 2. Generate poster WebP (first frame of the processed loop)
      console.log('  Generating poster WebP (quality 80)...');
      execFileSync(
        ffmpegPath,
        [
          '-y',
          '-i',
          mp4Out,
          '-vframes',
          '1',
          '-c:v',
          'libwebp',
          '-quality',
          '80',
          posterOut,
        ],
        { stdio: 'inherit' }
      );

      // 3. Generate WebM (VP9, CRF 34, -b:v 0)
      console.log('  Generating WebM (VP9, CRF 34)...');
      execFileSync(
        ffmpegPath,
        [
          '-y',
          '-i',
          mp4Out,
          '-c:v',
          'libvpx-vp9',
          '-crf',
          '34',
          '-b:v',
          '0',
          '-an',
          webmOut,
        ],
        { stdio: 'inherit' }
      );

      console.log(`✓ Completed ${key}`);
    } else {
      console.log(`Skipping [${key}] (up to date)`);
    }

    if (fs.existsSync(mp4Out) && fs.existsSync(webmOut) && fs.existsSync(posterOut)) {
      processedKeys.push(key);
    }
  }

  // Write videos.json
  const manifestPath = path.join(outputDir, 'videos.json');
  fs.writeFileSync(manifestPath, JSON.stringify(processedKeys.sort(), null, 2), 'utf8');
  console.log(`\nWrote manifest with ${processedKeys.length} videos to ${manifestPath}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
