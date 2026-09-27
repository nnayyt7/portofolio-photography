import { useCallback, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { siteConfig, navigation } from '../data/site';
import { useOverlayFocus } from '../hooks/useOverlayFocus';

export default function MenuOverlay({ onClose, onNavigate, lenis, reduced }) {
  const ref = useRef(null);
  const closing = useRef(false);
  const exit = useCallback((callback = onClose) => {
    if (closing.current) return;
    closing.current = true;
    if (reduced) { callback(); return; }
    gsap.to(ref.current, { clipPath: 'inset(0 0 100% 0)', duration: .4, ease: 'power3.inOut', overwrite: true, onComplete: callback });
  }, [onClose, reduced]);
  const close = useCallback(() => exit(), [exit]);
  useOverlayFocus(ref, close, lenis);
  useGSAP(() => {
    if (reduced) return;
    gsap.from(ref.current, { clipPath: 'inset(0 0 100% 0)', duration: .55, ease: 'power3.inOut' });
    gsap.from('.menu-link', { yPercent: 100, stagger: .07, delay: .15, duration: .65, ease: 'power3.out' });
  }, { scope: ref });
  return <div ref={ref} className="menu-overlay" role="dialog" aria-modal="true" aria-label="Navigation" data-lenis-prevent>
    <button className="pill menu-close" onClick={close}>CLOSE <span aria-hidden="true">×</span></button>
    <span className="menu-note mono">A COLLECTION OF MOMENTS<br />{siteConfig.range}</span>
    <nav aria-label="Main navigation"><ol>{navigation.map((item, index) => <li key={item.id}><a className="menu-link" href={`#${item.id}`} onClick={event => { event.preventDefault(); exit(() => onNavigate(item.id)); }}><span className="mono menu-index">0{index + 1}</span><span>{item.label}</span><span className="menu-arrow" aria-hidden="true">↗</span></a></li>)}</ol></nav>
    <footer className="menu-footer"><span>{siteConfig.name}®</span><span>{siteConfig.location}</span><a href={`mailto:${siteConfig.email}`}>{siteConfig.email} ↗</a></footer>
  </div>;
}
