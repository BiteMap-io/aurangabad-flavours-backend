import sharp from 'sharp';
import s3Service from '../services/s3.service';

/**
 * @description Centralized image handling: base64 decoding, WebP compression, and CDN upload.
 * Incoming raster images are converted to WebP (smaller files, near-identical quality) before
 * being stored. Non-raster formats (SVG, GIF) are passed through untouched so they are not corrupted.
 */

// Quality used for WebP encoding (1-100). 80 keeps quality visually lossless while cutting size.
const WEBP_QUALITY = process.env.WEBP_QUALITY ? Number(process.env.WEBP_QUALITY) : 80;

// Raster formats safe to re-encode as WebP. SVG (vector) and GIF (animation) are intentionally excluded.
const CONVERTIBLE = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/tiff',
  'image/avif',
  'image/bmp',
]);

export interface DecodedImage {
  type: string;
  buffer: Buffer;
}

/**
 * Decode a base64 string (with or without a `data:` URI prefix) into a typed buffer.
 */
export const decodeBase64 = (base64String: string): DecodedImage | null => {
  const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return { type: matches[1], buffer: Buffer.from(matches[2], 'base64') };
  }
  // Fallback: assume raw base64 (no prefix) and default the type to PNG.
  try {
    const buffer = Buffer.from(base64String.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');
    return { type: 'image/png', buffer };
  } catch {
    return null;
  }
};

/**
 * Compress a raster image buffer to WebP. Returns the original buffer/type untouched for
 * non-convertible formats or if encoding fails, so an upload is never silently dropped.
 */
export async function compressImage(
  buffer: Buffer,
  mimetype: string
): Promise<{ buffer: Buffer; mimetype: string; extension: string }> {
  if (CONVERTIBLE.has(mimetype.toLowerCase())) {
    try {
      const out = await sharp(buffer)
        .rotate() // honor EXIF orientation before stripping metadata
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
      return { buffer: out, mimetype: 'image/webp', extension: 'webp' };
    } catch (err) {
      console.error('Image compression failed, storing original:', err);
    }
  }
  const extension = mimetype.split('/')[1] || 'bin';
  return { buffer, mimetype, extension };
}

const sanitizeName = (name: string) =>
  name
    .replace(/\.[^.]+$/, '') // drop existing extension
    .replace(/[^\w.-]+/g, '-')
    .slice(0, 60) || 'image';

/**
 * Compress (if a raster image) and upload to the S3/CDN bucket under `folder`.
 * Returns the public URL plus the stored content type and byte size.
 */
export async function uploadImage(
  folder: string,
  buffer: Buffer,
  mimetype: string,
  originalName = 'image'
): Promise<{ url: string; type: string; size: number }> {
  const compressed = await compressImage(buffer, mimetype);
  const key = `${folder}/${Date.now()}-${sanitizeName(originalName)}.${compressed.extension}`;
  const { url } = await s3Service.uploadBuffer(key, compressed.buffer, compressed.mimetype);
  return { url, type: compressed.mimetype, size: compressed.buffer.length };
}
