import { useEffect } from 'react';

export function useOverlayFocus(ref, onClose, lenis) {
  useEffect(() => {
    const previous = document.activeElement;
    const background = document.getElementById('site-content');
    const y = window.scrollY;
    const bodyStyle = { position: document.body.style.position, top: document.body.style.top, width: document.body.style.width };
    lenis.current?.stop();
    document.body.dataset.overlay = 'true';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${y}px`;
    document.body.style.width = '100%';
    background.inert = true;
    const focusable = () => [...ref.current.querySelectorAll('a[href],button:not([disabled]),[tabindex="0"]')];
    focusable()[0]?.focus({ preventScroll: true });
    const keydown = event => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const nodes = focusable();
      const first = nodes[0];
      const last = nodes.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.removeEventListener('keydown', keydown);
      background.inert = false;
      delete document.body.dataset.overlay;
      Object.assign(document.body.style, bodyStyle);
      window.scrollTo(0, y);
      lenis.current?.start();
      lenis.current?.resize();
      lenis.current?.scrollTo(y, { immediate: true, force: true });
      previous?.focus({ preventScroll: true });
    };
  }, [onClose, lenis, ref]);
}
