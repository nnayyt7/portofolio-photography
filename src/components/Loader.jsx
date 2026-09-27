import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { siteConfig } from '../data/site';

export default function Loader({ onReady, reduced }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let cancelled = false;
    let finished = false;
    let tween;
    const finish = () => {
      if (finished || cancelled) return;
      finished = true;
      setProgress(100);
      if (reduced) { onReady(); return; }
      tween = gsap.to(ref.current, { clipPath: 'inset(0 0 100% 0)', duration: .7, delay: .12, ease: 'power3.inOut', onComplete: onReady });
    };
    const fontReady = document.fonts.ready.then(() => { if (!cancelled && !finished) setProgress(100); });
    fontReady.then(finish, finish);
    const timeout = setTimeout(finish, 2500);
    return () => { cancelled = true; clearTimeout(timeout); tween?.kill(); };
  }, [onReady, reduced]);
  return <div className="loader" ref={ref} aria-hidden="true"><span>{siteConfig.name}®</span><div className="loader-bottom mono"><span>LOOK A LITTLE CLOSER.</span><span>{String(progress).padStart(3, '0')}</span></div><div className="loader-line" style={{ transform: `scaleX(${progress / 100})` }} /></div>;
}
