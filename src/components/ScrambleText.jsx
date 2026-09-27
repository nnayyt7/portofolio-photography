import { useEffect, useRef } from 'react';

export default function ScrambleText({ children, className = '' }) {
  const text = String(children);
  const visual = useRef(null);
  const frame = useRef(0);
  const pointer = useRef(null);
  const lastMove = useRef(0);
  useEffect(() => () => { cancelAnimationFrame(frame.current); frame.current = 0; }, [text]);
  const move = event => {
    if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 767px)').matches || document.documentElement.dataset.motion === 'off') return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    lastMove.current = performance.now();
    if (frame.current) return;
    const letters = [...visual.current.children];
    const origins = letters.map(letter => ({ x: letter.offsetLeft + letter.offsetWidth / 2, y: letter.offsetTop + letter.offsetHeight / 2 }));
    const start = performance.now();
    const tick = now => {
      const active = pointer.current && now - lastMove.current < 450;
      const fade = Math.max(0, 1 - (now - lastMove.current) / 450);
      letters.forEach((letter, index) => {
        const original = [...text][index] === ' ' ? '\u00a0' : [...text][index];
        const d = active ? origins[index].x - pointer.current.x : 1000;
        const influence = Math.exp(-(d * d) / 2200) * fade;
        const lift = influence * Math.sin(index * 1.4 + (now - start) / 180) * 5;
        letter.style.transform = `translateY(${lift}px) rotate(${influence * d * .12}deg)`;
        // Resolve to the original letter quickly; stable widths prevent layout shifts.
        const alphabet = original === original.toLowerCase() ? 'abcdefghijklmnopqrstuvwxyz' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        letter.textContent = influence > .45 && now - start < 170 && /[a-z]/i.test(original) ? alphabet[(Math.floor(now / 55) + index * 7) % alphabet.length] : original;
      });
      if (active || now - lastMove.current < 460) frame.current = requestAnimationFrame(tick);
      else { frame.current = 0; letters.forEach((letter, i) => { letter.style.transform = ''; letter.textContent = [...text][i] === ' ' ? '\u00a0' : [...text][i]; }); }
    };
    frame.current = requestAnimationFrame(tick);
  };
  return <span className={`scramble ${className}`} onPointerMove={move} onPointerLeave={() => { pointer.current = null; }}>
    <span className="scramble-measure">{text}</span><span aria-hidden="true" className="scramble-visual" ref={visual}>{[...text].map((letter, i) => <span className="scramble-letter" key={i}>{letter === ' ' ? '\u00a0' : letter}</span>)}</span>
  </span>;
}
