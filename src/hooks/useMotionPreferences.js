import { useEffect, useState } from 'react';
import { siteConfig } from '../data/site';

export function useMotionPreferences() {
  const read = () => ({
    reduced: !siteConfig.motion.enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    fine: window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches,
  });
  const [preferences, setPreferences] = useState(read);
  useEffect(() => {
    const queries = ['(prefers-reduced-motion: reduce)', '(hover: hover) and (pointer: fine) and (min-width: 768px)'].map(q => window.matchMedia(q));
    const update = () => setPreferences(read());
    queries.forEach(query => query.addEventListener('change', update));
    return () => queries.forEach(query => query.removeEventListener('change', update));
  }, []);
  return preferences;
}
