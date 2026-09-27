import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ReactiveLine() {
  const ref = useRef(null);
  useEffect(() => {
    const line = ref.current;
    const parent = line.parentElement.parentElement;
    const move = event => {
      if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 767px)').matches || document.documentElement.dataset.motion === 'off') return;
      const rect = parent.getBoundingClientRect();
      const x = Math.max(0, Math.min(1000, (event.clientX - rect.left) / rect.width * 1000));
      const pull = Math.max(-18, Math.min(18, (event.clientY - rect.bottom) * -.32));
      gsap.to(line, { attr: { d: `M0,10 Q${x},${10 + pull} 1000,10` }, duration: .18, overwrite: true });
    };
    const leave = () => gsap.to(line, { attr: { d: 'M0,10 Q500,10 1000,10' }, duration: .8, ease: 'elastic.out(1,0.4)', overwrite: true });
    parent.addEventListener('pointermove', move);
    parent.addEventListener('pointerleave', leave);
    return () => { gsap.killTweensOf(line); parent.removeEventListener('pointermove', move); parent.removeEventListener('pointerleave', leave); };
  }, []);
  return <svg className="reactive-line" viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden="true"><path ref={ref} d="M0,10 Q500,10 1000,10" /></svg>;
}
