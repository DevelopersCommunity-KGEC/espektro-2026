"""
Image to WebP Converter for Web Project
Recursively converts all images in specified directories to optimized WebP format.
"""

import os
from pathlib import Path
from PIL import Image
import time
import sys

# Configuration
# By default, we'll scan common image directories
SEARCH_DIRECTORIES = ["public/images", "public/club_logos", "src/assets"]
# If directories don't exist, we'll scan the whole project but exclude some
EXCLUDE_DIRS = {".next", "node_modules", ".git", "public/script", "public/fonts", "public/music"}

# WebP optimization settings
WEBP_QUALITY = 75
MAX_WIDTH = 1920
MAX_HEIGHT = 1920

# Supported input formats
SUPPORTED_FORMATS = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.gif'}

def resize_image(image, max_width=MAX_WIDTH, max_height=MAX_HEIGHT):
    """Resize image if it exceeds maximum dimensions while maintaining aspect ratio."""
    width, height = image.size
    if width <= max_width and height <= max_height:
        return image
    
    ratio = min(max_width / width, max_height / height)
    new_width = int(width * ratio)
    new_height = int(height * ratio)
    return image.resize((new_width, new_height), Image.Resampling.LANCZOS)

def convert_to_webp(input_path):
    """Convert an image to WebP format in-place (same directory, new extension)."""
    output_path = input_path.with_suffix('.webp')
    
    # Skip if webp already exists and is newer than source
    if output_path.exists() and output_path.stat().st_mtime > input_path.stat().st_mtime:
        return None  # Already converted

    try:
        with Image.open(input_path) as img:
            # Handle transparency for PNG/RGBA
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                # We'll keep transparency for WebP
                pass
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            img = resize_image(img)
            
            # Save as WebP
            img.save(
                output_path,
                'WEBP',
                quality=WEBP_QUALITY,
                method=4
            )
            return output_path
    except Exception as e:
        print(f"  ✗ Error converting {input_path.name}: {str(e)}")
        return False

def find_images(root_dir):
    """Find all supported images recursively, skipping excluded directories."""
    found_images = []
    root = Path(root_dir)
    
    for path in root.rglob('*'):
        # Skip directories
        if not path.is_file():
            continue
            
        # Check if any parent part is in EXCLUDE_DIRS
        if any(part in EXCLUDE_DIRS for part in path.parts):
            continue
            
        if path.suffix.lower() in SUPPORTED_FORMATS:
            found_images.append(path)
            
    return found_images

def format_size(bytes_size):
    """Format bytes to human-readable size."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_size < 1024.0:
            return f"{bytes_size:.2f} {unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.2f} TB"

def main():
    print("=" * 60)
    print("Project-wide Image to WebP Converter")
    print("=" * 60)
    
    # Get project root (parent of public/script)
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent.parent
    os.chdir(project_root)
    print(f"Working in: {project_root}")
    
    images = find_images(".")
    
    if not images:
        print("✗ No images found!")
        return

    print(f"✓ Found {len(images)} image(s) to process")
    
    success_count = 0
    skipped_count = 0
    start_time = time.time()
    
    for i, img_path in enumerate(images, 1):
        rel_path = img_path.relative_to(".")
        print(f"[{i}/{len(images)}] Processing: {rel_path}")
        
        result = convert_to_webp(img_path)
        if result is None:
            print("  - Skipped (already exists)")
            skipped_count += 1
        elif result:
            success_count += 1
            print(f"  ✓ Created: {result.name}")
        
    elapsed_time = time.time() - start_time
    print("=" * 60)
    print("Summary")
    print(f"Total processed: {len(images)}")
    print(f"Successfully converted: {success_count}")
    print(f"Skipped: {skipped_count}")
    print(f"Time: {elapsed_time:.2f}s")
    print("=" * 60)

if __name__ == "__main__":
    main()
