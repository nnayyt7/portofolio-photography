import { useEffect, useState } from 'react';
import { assetUrl } from '../data/photos';
import { layouts, defaultLayout } from '../data/layouts';

export default function PhotoFrame({ photo, index, onOpen, className = '', priority = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [photo.src]);
  const layout = layouts[photo.layout] || defaultLayout;

  return <figure className={`photo-card ${className}`} style={{ '--photo-column': layout.column, '--photo-offset': layout.offset }}>
    <button className="photo-button" type="button" onClick={() => onOpen(photo.id)} aria-label={`View ${photo.title}`}>
      <span className="photo-surface" data-warp-frame data-focal={photo.focalPoint || '50% 50%'} style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
        <img src={assetUrl(failed ? '/images/fallback.svg' : photo.src)} alt={photo.alt} width={photo.width} height={photo.height} loading={priority ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} style={{ objectPosition: photo.focalPoint }} />
      </span>
      <span className="photo-corner corner-a" aria-hidden="true" /><span className="photo-corner corner-b" aria-hidden="true" />
    </button>
    <figcaption><span className="photo-number">{String(index + 1).padStart(3, '0')}</span><span className="photo-caption"><span className="photo-title">{photo.title}</span><span className="photo-meta">{photo.category} / {photo.year}</span></span><span className="photo-arrow" aria-hidden="true">↗</span></figcaption>
  </figure>;
}
