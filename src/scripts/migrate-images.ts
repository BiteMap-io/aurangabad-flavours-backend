import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import config from '../config';
import s3Service from '../services/s3.service';
import { compressImage } from '../utils/image';
import Restaurant from '../models/restaurant.model';
import Dish from '../models/dish.model';
import Article from '../models/article.model';
import Event from '../models/event.model';
import Gallery from '../models/gallery.model';
import Media from '../models/media.model';

/**
 * @description One-off backfill: recompresses every image already sitting in the bucket
 * to WebP, re-uploads it, repoints the owning DB record at the new URL, then deletes the
 * old object. Run with no flags first (dry run) to see what would happen.
 *
 * Usage:
 *   npx ts-node src/scripts/migrate-images.ts            # dry run, no changes
 *   npx ts-node src/scripts/migrate-images.ts --apply     # actually migrate
 *   npx ts-node src/scripts/migrate-images.ts --apply --force  # also re-encode existing .webp
 */

const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');

const stats = { scanned: 0, skippedExternal: 0, skippedWebp: 0, skippedNoGain: 0, migrated: 0, failed: 0, bytesBefore: 0, bytesAfter: 0 };

/** Mirrors s3Service.getFileUrl()'s format so we can recover the object key from a stored URL. */
function keyFromUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const bucket = config.s3.bucket;
  if (!bucket) return null;

  try {
    if (config.s3.endpoint) {
      const baseUrl = config.s3.endpoint.replace(/\/$/, '');
      const prefix = `${baseUrl}/${bucket}/`;
      if (url.startsWith(prefix)) return decodeURIComponent(url.slice(prefix.length));
      return null;
    }
    const host = `${bucket}.s3.${config.s3.region}.amazonaws.com/`;
    const idx = url.indexOf(host);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + host.length));
  } catch {
    return null;
  }
}

function guessMimetype(key: string): string {
  const ext = key.split('.').pop()?.toLowerCase() || '';
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
    gif: 'image/gif', svg: 'image/svg+xml', bmp: 'image/bmp', tiff: 'image/tiff', avif: 'image/avif',
  };
  return map[ext] || 'application/octet-stream';
}

/**
 * Migrate a single image URL. Returns the new URL on success, or null if nothing changed
 * (external URL, already WebP, no size gain, or a failure — all logged, never thrown).
 */
async function migrateUrl(url: string, folder: string): Promise<string | null> {
  stats.scanned++;
  const key = keyFromUrl(url);
  if (!key) {
    stats.skippedExternal++;
    return null;
  }

  const mimetype = guessMimetype(key);
  if (!FORCE && mimetype === 'image/webp') {
    stats.skippedWebp++;
    return null;
  }

  try {
    const { buffer } = await s3Service.getObject(key);
    const compressed = await compressImage(buffer, mimetype);

    if (compressed.buffer.length >= buffer.length && mimetype === compressed.mimetype) {
      stats.skippedNoGain++;
      return null;
    }

    const newKey = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${compressed.extension}`;

    console.log(`  ${APPLY ? 'migrating' : '[dry-run] would migrate'}: ${key} (${buffer.length}B) -> ${newKey} (${compressed.buffer.length}B)`);

    stats.bytesBefore += buffer.length;
    stats.bytesAfter += compressed.buffer.length;
    stats.migrated++;

    if (!APPLY) {
      return null; // dry run never returns a new URL, so callers never write it to the DB
    }

    // Upload first, then the caller persists the new URL to the DB, then we delete the old
    // object — so a crash mid-migration never loses an image.
    const { url: newUrl } = await s3Service.uploadBuffer(newKey, compressed.buffer, compressed.mimetype);
    return newUrl;
  } catch (err) {
    console.error(`  FAILED: ${key}`, err instanceof Error ? err.message : err);
    stats.failed++;
    return null;
  }
}

async function deleteOldIfMigrated(oldUrl: string, newUrl: string | null) {
  if (!APPLY || !newUrl) return;
  const oldKey = keyFromUrl(oldUrl);
  if (!oldKey) return;
  try {
    await s3Service.deleteObject(oldKey);
  } catch (err) {
    console.error(`  Warning: failed to delete old object ${oldKey}:`, err instanceof Error ? err.message : err);
  }
}

async function migrateRestaurants() {
  console.log('\n--- Restaurants ---');
  const restaurants = await Restaurant.find();
  for (const r of restaurants) {
    let changed = false;
    const oldImage = r.image;
    const newImage = await migrateUrl(r.image, 'restaurants');
    if (newImage) { r.image = newImage; changed = true; }

    const newGallery: string[] = [];
    const oldGalleryUrls: { old: string; replaced: string | null }[] = [];
    for (const g of r.gallery || []) {
      const newUrl = await migrateUrl(g, 'restaurants');
      newGallery.push(newUrl || g);
      oldGalleryUrls.push({ old: g, replaced: newUrl });
      if (newUrl) changed = true;
    }
    if (changed && APPLY) {
      r.gallery = newGallery;
      await r.save();
      if (newImage) await deleteOldIfMigrated(oldImage, newImage);
      for (const { old, replaced } of oldGalleryUrls) await deleteOldIfMigrated(old, replaced);
    }
  }
}

async function migrateSingleField<T extends { save: () => Promise<any> }>(
  docs: T[],
  field: keyof T,
  folder: string
) {
  for (const doc of docs) {
    const oldUrl = doc[field] as unknown as string;
    const newUrl = await migrateUrl(oldUrl, folder);
    if (newUrl && APPLY) {
      (doc[field] as unknown as string) = newUrl;
      await doc.save();
      await deleteOldIfMigrated(oldUrl, newUrl);
    }
  }
}

async function run() {
  console.log(`Image migration — mode: ${APPLY ? 'APPLY (will modify bucket + DB)' : 'DRY RUN (no changes)'}${FORCE ? ' [force]' : ''}`);
  console.log('Connecting to MongoDB...');
  await mongoose.connect(config.mongodbUri);
  console.log('Connected.\n');

  await migrateRestaurants();

  console.log('\n--- Dishes ---');
  await migrateSingleField(await Dish.find(), 'image', 'dishes');

  console.log('\n--- Articles ---');
  await migrateSingleField(await Article.find(), 'image', 'articles');

  console.log('\n--- Events ---');
  await migrateSingleField(await Event.find(), 'image', 'events');

  console.log('\n--- Gallery ---');
  await migrateSingleField(await Gallery.find(), 'url', 'gallery');

  console.log('\n--- Media ---');
  await migrateSingleField(await Media.find(), 'url', 'media');

  console.log('\n========== Summary ==========');
  console.log(`Scanned:           ${stats.scanned}`);
  console.log(`Migrated:          ${stats.migrated}`);
  console.log(`Skipped (external):${stats.skippedExternal}`);
  console.log(`Skipped (.webp):   ${stats.skippedWebp}`);
  console.log(`Skipped (no gain): ${stats.skippedNoGain}`);
  console.log(`Failed:            ${stats.failed}`);
  const savedMb = ((stats.bytesBefore - stats.bytesAfter) / (1024 * 1024)).toFixed(2);
  console.log(`Bytes before/after: ${stats.bytesBefore} -> ${stats.bytesAfter} (saved ~${savedMb} MB)`);
  if (!APPLY) console.log('\nThis was a dry run. Re-run with --apply to actually migrate.');

  process.exit(0);
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
