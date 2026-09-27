import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MagneticLink({ as: Tag = 'a', children, className = '', ...props }) {
  const inner = useRef(null);
  useEffect(() => { const element = inner.current; return () => gsap.killTweensOf(element); }, []);
  const move = event => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'off') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-12, Math.min(12, (event.clientX - rect.left - rect.width / 2) * .25));
    const y = Math.max(-8, Math.min(8, (event.clientY - rect.top - rect.height / 2) * .28));
    gsap.to(inner.current, { x, y, duration: .3, ease: 'power3.out', overwrite: true });
  };
  return <Tag className={`magnetic ${className}`} onPointerMove={move} onPointerLeave={() => gsap.to(inner.current, { x: 0, y: 0, duration: .85, ease: 'elastic.out(1,.45)', overwrite: true })} {...props}><span ref={inner}>{children}</span></Tag>;
}
