import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { photos, assetUrl } from '../data/photos';
import { siteConfig } from '../data/site';
import ScrambleText from '../components/ScrambleText';
import PhotoFrame from '../components/PhotoFrame';
import ReactiveLine from '../components/ReactiveLine';
import OutlineWordmark from '../components/OutlineWordmark';

export default function WorkGallery({ onOpen }) {
  const preview = useRef(null);
  const previewImage = useRef(null);
  const previewTween = useRef(null);
  useEffect(() => () => previewTween.current?.kill(), []);
  const categories = [...new Set(photos.map(photo => photo.category))];
  const showPreview = (event, category) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'off') return;
    const photo = photos.find(item => item.category === category);
    previewImage.current.src = assetUrl(photo.src);
    preview.current.style.opacity = '1';
    const rect = event.currentTarget.parentElement.getBoundingClientRect();
    previewTween.current = gsap.to(preview.current, { x: Math.min(rect.width - 260, Math.max(0, event.clientX - rect.left - 130)), y: event.clientY - rect.top - 170, rotate: -4, duration: .6, ease: 'power3.out', overwrite: true });
  };
  const selected = photos.filter(photo => photo.featured);
  const archive = photos.filter(photo => !photo.featured);
  return <>
    <section className="intro section-pad" aria-labelledby="intro-heading"><span className="section-kicker mono">(01 — A WAY OF SEEING)</span><h2 id="intro-heading">{siteConfig.intro.map((line, i) => <span className={`statement-line ${i === 2 ? 'muted' : ''}`} key={line}>{line}</span>)}</h2><p>{siteConfig.statement}</p><span className="intro-asterisk" aria-hidden="true">✳</span></section>
    <section id="work" className="work section-pad" aria-labelledby="work-heading"><header className="section-header"><h2 id="work-heading">Selected<br /><span className="serif-word">frames.</span></h2><div className="section-caption mono">A FEW THINGS I’VE SEEN.<br />A FEW THINGS I’VE FELT.<br /><span>{siteConfig.range} / {String(selected.length).padStart(2, '0')} STORIES</span></div><span className="section-kicker mono">(02 — SELECTED WORK)</span></header>
      <div className="selected-gallery">{selected.map((photo, index) => <PhotoFrame photo={photo} index={photos.indexOf(photo)} key={photo.id} onOpen={onOpen} priority={index < 2} />)}</div>
      <div className="work-end mono"><span>EVERY FRAME HAS A FEELING.</span><span>KEEP LOOKING ↓</span></div>
    </section>
    <section id="archive" className="archive section-pad" aria-labelledby="archive-heading"><header className="archive-header"><h2 id="archive-heading">Notes from<br />everywhere.</h2><p className="mono">THE UNPLANNED. THE IN-BETWEEN.<br />AN ONGOING VISUAL DIARY.</p><span className="section-kicker mono">(03 — THE ARCHIVE)</span></header><div className="archive-artboard"><OutlineWordmark />{archive.map((photo, index) => <PhotoFrame photo={photo} index={photos.indexOf(photo)} key={photo.id} onOpen={onOpen} className={`archive-photo archive-${index % 6}`} />)}</div></section>
    <section className="category-index section-pad" aria-labelledby="index-heading"><header><h2 className="mono" id="index-heading">EXPLORE BY FEELING</h2><span className="mono">INDEX / {String(categories.length).padStart(2, '0')}</span></header><div className="index-rows" onPointerLeave={() => { if (preview.current) preview.current.style.opacity = '0'; }}>
      {categories.map((category, index) => <button className="index-row" key={category} onClick={() => onOpen(photos.find(photo => photo.category === category).id)} onPointerMove={event => showPreview(event, category)}><span className="mono">0{index + 1}</span><span className="index-name"><ScrambleText>{category}</ScrambleText></span><span className="index-count mono">{String(photos.filter(photo => photo.category === category).length).padStart(2, '0')} FRAMES</span><span className="index-arrow" aria-hidden="true">↗</span><ReactiveLine /></button>)}
      <div className="category-preview" ref={preview} aria-hidden="true"><img ref={previewImage} alt="" /></div>
    </div></section>
  </>;
}
