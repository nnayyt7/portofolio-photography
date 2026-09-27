import { useEffect } from 'react';

// The reference uses a native crosshair over the canvas and a hand on links.
// Leave the platform cursor intact on touch/reduced-motion devices.
export default function CustomCursor({ enabled }) {
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('reference-cursor');
    return () => document.documentElement.classList.remove('reference-cursor');
  }, [enabled]);
  return null;
}
