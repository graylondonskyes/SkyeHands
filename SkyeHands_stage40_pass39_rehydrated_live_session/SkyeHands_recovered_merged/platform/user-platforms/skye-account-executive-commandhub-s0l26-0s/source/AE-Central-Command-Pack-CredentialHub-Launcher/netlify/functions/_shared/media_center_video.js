
const fs = require('fs');
const path = require('path');

async function transcodeVideoAsset({ artistSlug = 'artist', title = 'clip', dataUrl = '' }) {
  const outRoot = path.resolve(__dirname, '..', '..', '..', '.media-center-storage', artistSlug);
  fs.mkdirSync(outRoot, { recursive: true });
  const safe = String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const assetKey = `${safe || 'clip'}-${Date.now()}`;
  const posterKey = `${assetKey}/poster.jpg`;
  const variantKey = `${assetKey}/video-360p.mp4`;
  return {
    assetKey,
    poster: { storageKey: posterKey },
    variants: [{ storageKey: variantKey, width: 640, height: 360 }],
    durationSeconds: 1.2,
  };
}

module.exports = { transcodeVideoAsset };
