import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import { photos } from '../src/data/photos.js';
import { siteConfig } from '../src/data/site.js';

assert(photos.length >= 1, 'Add at least one photograph');
assert.equal(new Set(photos.map(photo => photo.id)).size, photos.length, 'Photo IDs must be unique');
for (const photo of photos) {
  for (const field of ['id', 'title', 'category', 'year', 'src', 'alt']) assert(photo[field], `${photo.id}: missing ${field}`);
  assert(photo.width > 0 && photo.height > 0, `${photo.id}: invalid dimensions`);
  if (!/^https?:/.test(photo.src)) assert((await stat(`public/${photo.src.replace(/^\/+/, '')}`)).size > 0, `Missing image ${photo.src}`);
}
assert(siteConfig.name && siteConfig.wordmark, 'Name and wordmark are required');
assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(siteConfig.email), 'Use a valid email address');
assert((await stat('public/images/fallback.svg')).size > 0);
console.log(`Content check passed: ${photos.length} local photographs, unique IDs, required metadata, fallback and site identity.`);
