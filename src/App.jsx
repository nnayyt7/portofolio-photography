import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from './data/site';
import { useMotionPreferences } from './hooks/useMotionPreferences';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import MenuOverlay from './components/MenuOverlay';
import PhotoViewer from './components/PhotoViewer';
import Loader from './components/Loader';
import Hero from './sections/Hero';
import WorkGallery from './sections/WorkGallery';
import About from './sections/About';
import Contact from './sections/Contact';

const VisualEffects = lazy(() => import('./effects/VisualEffects'));
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function App() {
  const root = useRef(null);
  const progress = useRef(null);
  const pendingNavigation = useRef(null);
  const { reduced, fine } = useMotionPreferences();
  const lenis = useSmoothScroll(!reduced && fine);
  const [ready, setReady] = useState(false);
  const [overlay, setOverlay] = useState(null);
  const finishLoading = useCallback(() => setReady(true), []);
  const closeOverlay = useCallback(() => setOverlay(null), []);
  const openPhoto = useCallback(id => setOverlay({ type: 'photo', id }), []);
  const navigate = id => {
    pendingNavigation.current = id;
    setOverlay(null);
  };
  useEffect(() => {
    if (overlay || !pendingNavigation.current) return;
    const id = pendingNavigation.current;
    pendingNavigation.current = null;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(id);
      lenis.current?.resize();
      if (lenis.current) lenis.current.scrollTo(target, { offset: -110 });
      else target?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
      history.replaceState(null, '', `#${id}`);
    });
    return () => cancelAnimationFrame(frame);
  }, [overlay, lenis, reduced]);
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'off' : 'on';
    document.title = `${siteConfig.name} — Photography & Visual Stories`;
    document.querySelector('meta[name="description"]').content = siteConfig.seoDescription;
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = siteConfig.seoDescription;
  }, [reduced]);
  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      if (progress.current) progress.current.style.transform = `scaleY(${total > 0 ? scrollY / total : 0})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  useGSAP(() => {
    if (!ready || reduced) return;
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    timeline.from('.hero-enter', { y: 22, opacity: 0, duration: .95, stagger: .08 }).from('.hero .outline-wordmark', { yPercent: 35, opacity: 0, duration: 1.3 }, .05).from('.coordinates', { opacity: 0, duration: 1 }, .3);
    gsap.utils.toArray('.statement-line').forEach(line => gsap.from(line, { yPercent: 40, opacity: 0, duration: .9, scrollTrigger: { trigger: line, start: 'top 92%', once: true } }));
    gsap.utils.toArray('.photo-card').forEach(card => {
      gsap.fromTo(card, { y: 40, '--reveal': 0 }, { y: 0, '--reveal': 1, duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 96%', once: true } });
    });
    gsap.from('.about-copy', { y: 30, opacity: 0, duration: .8, scrollTrigger: { trigger: '.about-copy', start: 'top 90%', once: true } });
    if (fine) {
      gsap.utils.toArray('.photo-card').forEach((card, index) => {
        const surface = card.querySelector('.photo-button');
        if (!surface) return;
        gsap.fromTo([surface, card.querySelector('figcaption')].filter(Boolean), { y: index % 2 ? 26 : -22 }, { y: index % 2 ? -26 : 22, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: .65 } });
      });
      gsap.to('.hero .coordinates', { y: -90, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
      gsap.to('.hero-light', { y: -100, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
    }
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, { scope: root, dependencies: [ready, reduced, fine], revertOnUpdate: true });
  return <>
    <div ref={root} id="site-content"><Navigation onMenu={() => setOverlay({ type: 'menu' })} /><main><Hero /><WorkGallery onOpen={openPhoto} /><About onOpen={openPhoto} /><Contact /></main></div>
    {ready && fine && !reduced && <Suspense fallback={null}><VisualEffects enabled /></Suspense>}
    <CustomCursor enabled={fine && !reduced} resetKey={overlay?.type} />
    <div className="scroll-progress" aria-hidden="true"><span ref={progress} /></div>
    {overlay?.type === 'menu' && <MenuOverlay onClose={closeOverlay} onNavigate={navigate} lenis={lenis} reduced={reduced} />}
    {overlay?.type === 'photo' && <PhotoViewer photoId={overlay.id} onClose={closeOverlay} lenis={lenis} reduced={reduced} />}
    {!ready && <Loader onReady={finishLoading} reduced={reduced} />}
  </>;
}
