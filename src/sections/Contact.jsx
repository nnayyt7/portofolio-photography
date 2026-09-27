import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../data/site';
import OutlineWordmark from '../components/OutlineWordmark';
import ScrambleText from '../components/ScrambleText';

export default function Contact() {
  const [copyStatus, setCopyStatus] = useState('COPY');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    clearTimeout(timer.current);
    try { await navigator.clipboard.writeText(siteConfig.email); setCopyStatus('COPIED ✓'); }
    catch { setCopyStatus('SELECT EMAIL TO COPY'); }
    timer.current = setTimeout(() => setCopyStatus('COPY'), 2600);
  };
  const socials = siteConfig.socials.filter(social => /^https?:\/\//.test(social.url));
  return <section id="contact" className="contact" aria-labelledby="contact-heading"><span className="section-kicker mono">(05 — THE NEXT STORY)</span><div className="light-anchor contact-light" data-glow aria-hidden="true"><div className="light-fallback" /></div><div className="contact-invitation"><h2 id="contact-heading">{siteConfig.contactHeading.map(line => <span key={line}>{line}</span>)}</h2><a href={`mailto:${siteConfig.email}`} className="text-link">Drop me a line <span aria-hidden="true">↗</span></a></div><div className="contact-email"><button className="copy-control mono" onClick={copy} aria-label="Copy email address"><span aria-live="polite">{copyStatus}</span> ↗</button><a className="highlight-link" href={`mailto:${siteConfig.email}`}><ScrambleText>{siteConfig.email}</ScrambleText></a></div><div className="contact-social"><span className="accent">{socials.length ? 'Elsewhere:' : 'Based in:'}</span>{socials.length ? socials.map(social => <a className="highlight-link" key={social.label} href={social.url} target="_blank" rel="noreferrer">↗ <ScrambleText>{social.label}</ScrambleText></a>) : <span>{siteConfig.location}</span>}<p>{siteConfig.contactLabel}</p></div><OutlineWordmark /><footer className="contact-footer"><span>{siteConfig.name}<br /><span className="accent">© {siteConfig.year}</span></span>{siteConfig.demoPhotos && <span className="demo-note mono">DEMO PHOTOGRAPHY / UNSPLASH</span>}<a href="#home" className="back-top">Back to top ↗</a></footer></section>;
}
