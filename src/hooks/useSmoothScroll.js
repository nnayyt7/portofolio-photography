import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../data/site';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll(enabled) {
  const lenis = useRef(null);
  useEffect(() => {
    if (!enabled || !siteConfig.motion.smoothScroll) return;
    const instance = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false, autoRaf: false, anchors: { offset: -110 } });
    lenis.current = instance;
    instance.on('scroll', ScrollTrigger.update);
    const tick = time => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      instance.off('scroll', ScrollTrigger.update);
      instance.destroy();
      lenis.current = null;
    };
  }, [enabled]);
  return lenis;
}
