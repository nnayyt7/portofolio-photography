import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { photos, assetUrl } from '../data/photos';
import { useOverlayFocus } from '../hooks/useOverlayFocus';

export default function PhotoViewer({ photoId, onClose, lenis, reduced }) {
  const ref = useRef(null);
  const [index, setIndex] = useState(() => Math.max(0, photos.findIndex(photo => photo.id === photoId)));
  const [failed, setFailed] = useState(false);
  const startTouch = useRef(null);
  const photo = photos[index];
  const step = delta => { setFailed(false); setIndex(value => (value + delta + photos.length) % photos.length); };
  useOverlayFocus(ref, onClose, lenis);
  useEffect(() => {
    const keydown = event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, []);
  useGSAP(() => {
    if (!reduced) gsap.from('.viewer-image', { opacity: 0, scale: .97, duration: .45, ease: 'power2.out' });
  }, { scope: ref, dependencies: [index], revertOnUpdate: true });
  return <div ref={ref} className="photo-viewer" role="dialog" aria-modal="true" aria-labelledby="viewer-title" data-lenis-prevent>
    <header className="viewer-header"><span className="mono">SELECTED FRAME / {String(index + 1).padStart(3, '0')}</span><button className="pill" onClick={onClose}>CLOSE ×</button></header>
    <div className="viewer-stage" onTouchStart={event => { startTouch.current = event.touches[0].clientX; }} onTouchEnd={event => { if (startTouch.current === null) return; const delta = event.changedTouches[0].clientX - startTouch.current; if (Math.abs(delta) > 70) step(delta < 0 ? 1 : -1); startTouch.current = null; }}>
      <img key={photo.id} className="viewer-image" src={assetUrl(failed ? '/images/fallback.svg' : photo.src)} alt={photo.alt} onError={() => setFailed(true)} />
    </div>
    <footer className="viewer-footer"><div aria-live="polite"><h2 id="viewer-title">{photo.title}</h2><p className="mono">{photo.category} / {photo.year}</p></div><div className="viewer-controls"><button onClick={() => step(-1)} aria-label="Previous photograph">← <span>PREV</span></button><span className="mono">{String(index + 1).padStart(2, '0')} / {photos.length}</span><button onClick={() => step(1)} aria-label="Next photograph"><span>NEXT</span> →</button></div></footer>
  </div>;
}
