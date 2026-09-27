import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import PointerFlow from './PointerFlow';
import { siteConfig } from '../data/site';
import photoVertex from './photoWarp.vert.glsl?raw';
import photoFragment from './photoWarp.frag.glsl?raw';
import glowFragment from './exposureGlow.frag.glsl?raw';

const plainVertex = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }';

export default function VisualEffects({ enabled }) {
  const canvas = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    let disposed = false;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas.current, alpha: true, antialias: false, powerPreference: 'low-power' }); }
    catch { return; }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-innerWidth / 2, innerWidth / 2, innerHeight / 2, -innerHeight / 2, .1, 100);
    camera.position.z = 10;
    const photoGeometry = new THREE.PlaneGeometry(1, 1, 72, 72);
    const glowGeometry = new THREE.PlaneGeometry(1, 1);
    const pointer = new THREE.Vector2(-1000, -1000);
    const flow = new PointerFlow(renderer);
    const viewport = new THREE.Vector2(innerWidth, innerHeight);
    const frames = [...document.querySelectorAll('[data-warp-frame]')];
    const cleanupListeners = [];
    const items = [];
    const nearViewport = new Set();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) nearViewport.add(entry.target);
      else nearViewport.delete(entry.target);
    }), { rootMargin: '250px' });
    const createPhoto = frame => {
      const img = frame.querySelector('img');
      let item;
      const load = () => {
        if (disposed || !img.naturalWidth) return;
        if (item) { scene.remove(item.mesh); item.material.dispose(); item.texture.dispose(); items.splice(items.indexOf(item), 1); }
        frame.classList.remove('gpu-ready');
        // Keep uploaded originals untouched; only cap the GPU copy to avoid
        // allocating a full-resolution camera file for every gallery plane.
        const longest = Math.max(img.naturalWidth, img.naturalHeight);
        const limit = Math.min(2048, renderer.capabilities.maxTextureSize);
        const scale = Math.min(1, limit / longest);
        // drawImage uses the browser-decoded EXIF orientation. Canvas strips
        // that metadata so WebGL cannot interpret the rotation a second time.
        const source = document.createElement('canvas');
        source.width = Math.round(img.naturalWidth * scale);
        source.height = Math.round(img.naturalHeight * scale);
        source.getContext('2d').drawImage(img, 0, 0, source.width, source.height);
        const texture = new THREE.CanvasTexture(source);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;
        const focal = (frame.dataset.focal || '50% 50%').split(' ').map(value => parseFloat(value) / 100);
        const material = new THREE.ShaderMaterial({
          vertexShader: photoVertex, fragmentShader: photoFragment, transparent: true, depthTest: false, depthWrite: false,
          uniforms: { uTexture: { value: texture }, uFlow: { value: flow.read.texture }, uViewport: { value: viewport }, uRect: { value: new THREE.Vector4() }, uWarp: { value: 185 * siteConfig.motion.intensity }, uHover: { value: 0 }, uDither: { value: .55 }, uCover: { value: new THREE.Vector2(1,1) }, uFocal: { value: new THREE.Vector2(focal[0], 1 - (focal[1] ?? .5)) }, uOpacity: { value: 1 }, uReveal: { value: 1 } },
        });
        const mesh = new THREE.Mesh(photoGeometry, material);
        mesh.frustumCulled = false;
        mesh.renderOrder = 2;
        scene.add(mesh);
        item = { frame, img, material, mesh, texture, card: frame.closest('.photo-card'), ready: false };
        items.push(item);
      };
      img.addEventListener('load', load);
      if (img.complete) load();
      cleanupListeners.push(() => img.removeEventListener('load', load));
      observer.observe(frame);
    };
    frames.forEach(createPhoto);
    // Rasterize our own outlined type after its local font is ready. The DOM SVG
    // remains the accessible, responsive fallback if GPU rendering is unavailable.
    document.fonts.ready.then(() => {
      if (disposed) return;
      document.querySelectorAll('.outline-wordmark').forEach(frame => {
        const source = frame.querySelector('text');
        const surface = document.createElement('canvas');
        surface.width = 2800; surface.height = 780;
        const context = surface.getContext('2d');
        const style = getComputedStyle(source);
        context.scale(2, 2);
        context.font = `500 440px ${style.fontFamily}`;
        const scale = 1400 / context.measureText(source.textContent).width;
        context.scale(scale, 1);
        context.lineWidth = 1.05;
        context.strokeStyle = style.stroke;
        context.strokeText(source.textContent, -8 / scale, 350);
        context.strokeStyle = '#37251f';
        context.strokeText(source.textContent, -2 / scale, 356);
        const texture = new THREE.CanvasTexture(surface);
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.ShaderMaterial({ vertexShader: photoVertex, fragmentShader: photoFragment, transparent: true, depthTest: false, depthWrite: false,
          uniforms: { uTexture: { value: texture }, uFlow: { value: flow.read.texture }, uViewport: { value: viewport }, uRect: { value: new THREE.Vector4() }, uWarp: { value: 75 * siteConfig.motion.intensity }, uHover: { value: 0 }, uDither: { value: 0 }, uCover: { value: new THREE.Vector2(1, 1) }, uFocal: { value: new THREE.Vector2(.5, .5) }, uOpacity: { value: 1 }, uReveal: { value: 1 } },
        });
        const mesh = new THREE.Mesh(photoGeometry, material);
        mesh.frustumCulled = false; mesh.renderOrder = 3;
        scene.add(mesh); frames.push(frame); observer.observe(frame);
        items.push({ frame, img: { naturalWidth: 1400, naturalHeight: 390 }, material, mesh, texture, ready: false, wordmark: true });
      });
    });
    const glows = [...document.querySelectorAll('[data-glow]')].map(anchor => {
      const material = new THREE.ShaderMaterial({ vertexShader: plainVertex, fragmentShader: glowFragment, transparent: true, depthTest: false, depthWrite: false, uniforms: { uFlow: { value: flow.read.texture }, uViewport: { value: viewport }, uRect: { value: new THREE.Vector4() }, uTime: { value: 0 }, uPointer: { value: new THREE.Vector2() }, uOpacity: { value: .94 } } });
      const mesh = new THREE.Mesh(glowGeometry, material);
      mesh.frustumCulled = false;
      mesh.renderOrder = 0;
      scene.add(mesh);
      observer.observe(anchor);
      return { anchor, material, mesh };
    });
    const resize = () => {
      renderer.setSize(innerWidth, innerHeight, false);
      viewport.set(innerWidth, innerHeight); flow.resize();
      camera.left = -innerWidth / 2; camera.right = innerWidth / 2; camera.top = innerHeight / 2; camera.bottom = -innerHeight / 2;
      camera.updateProjectionMatrix();
    };
    resize();
    const move = event => { pointer.set(event.clientX, event.clientY); flow.move(event.clientX, event.clientY); };
    const leave = () => { pointer.set(-1000, -1000); flow.leave(); };
    const positionMesh = (mesh, rect) => {
      mesh.position.set(rect.left + rect.width / 2 - innerWidth / 2, -rect.top - rect.height / 2 + innerHeight / 2, 0);
      mesh.scale.set(rect.width, rect.height, 1);
    };
    const tick = (time, delta) => {
      if (disposed || document.hidden || document.body.dataset.overlay) return;
      const flowTexture = flow.update(delta);
      const alpha = 1 - Math.exp(-Math.min(delta, 50) / 100);

      for (const item of items) {
        const { frame, img, mesh, material, card } = item;
        mesh.visible = nearViewport.has(frame);
        if (!mesh.visible) continue;
        const rect = frame.getBoundingClientRect();
        if (!rect.width || !rect.height) { mesh.visible = false; continue; }
        positionMesh(mesh, rect);
        const ratio = rect.width / rect.height;
        const imageRatio = item.wordmark ? ratio : img.naturalWidth / img.naturalHeight;
        material.uniforms.uCover.value.set(Math.min(1, ratio / imageRatio), Math.min(1, imageRatio / ratio));
        material.uniforms.uFlow.value = flowTexture;
        material.uniforms.uRect.value.set(rect.left, rect.top, rect.width, rect.height);
        const cardStyle = card ? getComputedStyle(card) : null;
        material.uniforms.uOpacity.value = item.wordmark ? Number(getComputedStyle(frame).opacity) : cardStyle ? Number(cardStyle.opacity) : 1;
        material.uniforms.uReveal.value = cardStyle ? parseFloat(cardStyle.getPropertyValue('--reveal')) || 0 : 1;
        const inside = pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom;
        material.uniforms.uHover.value += ((inside ? 1 : 0) - material.uniforms.uHover.value) * alpha;
      }
      for (const { anchor, mesh, material } of glows) {
        mesh.visible = nearViewport.has(anchor);
        if (!mesh.visible) continue;
        const rect = anchor.getBoundingClientRect();
        positionMesh(mesh, rect);
        material.uniforms.uFlow.value = flowTexture;
        material.uniforms.uRect.value.set(rect.left, rect.top, rect.width, rect.height);
        material.uniforms.uTime.value = time;
        material.uniforms.uPointer.value.lerp(new THREE.Vector2(pointer.x > -900 ? pointer.x / innerWidth - .5 : 0, pointer.y > -900 ? .5 - pointer.y / innerHeight : 0), alpha * .3);
      }
      try {
        renderer.render(scene, camera);
        items.forEach(item => { if (item.mesh.visible && !item.ready) { item.frame.classList.add('gpu-ready'); item.ready = true; } });
        glows.forEach(item => { if (item.mesh.visible) item.anchor.classList.add('gpu-ready'); });
      } catch { restoreDom(); }
    };
    const restoreDom = () => {
      frames.forEach(frame => frame.classList.remove('gpu-ready'));
      glows.forEach(({ anchor }) => anchor.classList.remove('gpu-ready'));
      canvas.current.style.visibility = 'hidden';
      gsap.ticker.remove(tick);
    };
    const contextLost = event => { event.preventDefault(); restoreDom(); };
    const element = canvas.current;
    element.style.visibility = '';
    element.addEventListener('webglcontextlost', contextLost);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    gsap.ticker.add(tick);
    return () => {
      disposed = true;
      gsap.ticker.remove(tick); observer.disconnect();
      element.removeEventListener('webglcontextlost', contextLost);
      window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave);
      cleanupListeners.forEach(clean => clean());
      frames.forEach(frame => frame.classList.remove('gpu-ready'));
      items.forEach(({ material, texture }) => { material.dispose(); texture.dispose(); });
      glows.forEach(({ anchor, material }) => { anchor.classList.remove('gpu-ready'); material.dispose(); });
      photoGeometry.dispose(); glowGeometry.dispose(); flow.dispose(); renderer.dispose();
    };
  }, [enabled]);
  return <canvas ref={canvas} className="visual-effects" aria-hidden="true" />;
}
