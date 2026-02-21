import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = 'public';

// Skip these file patterns
const IGNORE_PATTERNS = [
    'favicon',
    'apple-touch-icon',
];

async function cleanupAssets() {
    console.log('--- Cleaning Up Original Assets ---');

    // Find PNG files
    const pngFiles = await glob(`${PUBLIC_DIR}/**/*.png`);
    for (const file of pngFiles) {
        if (IGNORE_PATTERNS.some(p => file.includes(p))) {
            console.log(`Preserving ignore list file: ${file}`);
            continue;
        }

        // Safety check: only delete if a .webp version exists
        const webpFile = file.replace(/\.png$/i, '.webp');
        if (fs.existsSync(webpFile)) {
            fs.unlinkSync(file);
            console.log(`Deleted original: ${file}`);
        } else {
            console.warn(`Skipping deletion, no WebP version found for: ${file}`);
        }
    }

    // Find WAV files
    const wavFiles = await glob(`${PUBLIC_DIR}/**/*.wav`);
    for (const file of wavFiles) {
        // Safety check: only delete if an .mp3 version exists
        const mp3File = file.replace(/\.wav$/i, '.mp3');
        if (fs.existsSync(mp3File)) {
            fs.unlinkSync(file);
            console.log(`Deleted original: ${file}`);
        } else {
            console.warn(`Skipping deletion, no MP3 version found for: ${file}`);
        }
    }

    console.log('\nCleanup complete!');
}

cleanupAssets().catch(err => {
    console.error('Cleanup failed:', err);
    process.exit(1);
});
