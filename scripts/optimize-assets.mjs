import sharp from 'sharp';
import ffmpeg from 'ffmpeg-static';
import { execSync } from 'child_process';
import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = 'public';
const SRC_DIR = 'src';

// Skip these file patterns
const IGNORE_PATTERNS = [
    'favicon',
    'apple-touch-icon',
];

async function optimizeImages() {
    console.log('--- Optimizing Images ---');
    const pngFiles = await glob(`${PUBLIC_DIR}/**/*.png`);

    for (const file of pngFiles) {
        if (IGNORE_PATTERNS.some(p => file.includes(p))) {
            console.log(`Skipping ignored file: ${file}`);
            continue;
        }

        const webpFile = file.replace(/\.png$/i, '.webp');
        if (fs.existsSync(webpFile)) {
            console.log(`WebP already exists for: ${file}`);
            continue;
        }

        try {
            await sharp(file)
                .webp({ quality: 80 })
                .toFile(webpFile);
            console.log(`Converted: ${file} -> ${webpFile}`);
        } catch (err) {
            console.error(`Error converting ${file}:`, err.message);
        }
    }
}

async function optimizeAudio() {
    console.log('\n--- Optimizing Audio ---');
    const wavFiles = await glob(`${PUBLIC_DIR}/**/*.wav`);

    for (const file of wavFiles) {
        const mp3File = file.replace(/\.wav$/i, '.mp3');
        if (fs.existsSync(mp3File)) {
            console.log(`MP3 already exists for: ${file}`);
            continue;
        }

        try {
            // Use ffmpeg to convert wav to mp3 (128k bitrate for good reduction)
            execSync(`"${ffmpeg}" -i "${file}" -b:a 128k "${mp3File}" -y`, { stdio: 'ignore' });
            console.log(`Converted: ${file} -> ${mp3File}`);
        } catch (err) {
            console.error(`Error converting ${file}:`, err.message);
        }
    }
}

function updateReferences() {
    console.log('\n--- Updating References ---');
    // Find all tsx, ts, css, scss files in src
    const files = glob.sync(`${SRC_DIR}/**/*.{tsx,ts,css,scss}`, { nodir: true });

    let totalReplacements = 0;

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');
        let originalContent = content;

        // Replace .png with .webp (excluding favicon/apple-touch)
        content = content.replace(/\/(?!favicon|apple-touch)[^"'\s]+\.png/g, (match) => {
            return match.replace(/\.png$/i, '.webp');
        });

        // Replace .wav with .mp3
        content = content.replace(/\.wav/gi, '.mp3');

        if (content !== originalContent) {
            fs.writeFileSync(file, content);
            console.log(`Updated references in: ${file}`);
            totalReplacements++;
        }
    }
    console.log(`Total files updated: ${totalReplacements}`);
}

async function main() {
    try {
        await optimizeImages();
        await optimizeAudio();
        updateReferences();
        console.log('\nAsset optimization complete!');
    } catch (err) {
        console.error('Fatal error:', err);
    }
}

main();
