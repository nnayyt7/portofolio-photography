import { siteConfig } from '../data/site';
import ScrambleText from '../components/ScrambleText';
import OutlineWordmark from '../components/OutlineWordmark';

const coordinateColumns = [[138,204,269,334,579,645], [187,253,318,383,523,589], [236,302,367,432], [41,107,172,237,465,530,595,661], [187,253,318,383], [236,302,594,660,725]];

export default function Hero() {
  return <section id="home" className="hero" aria-labelledby="hero-heading">
    <h1 className="sr-only" id="hero-heading">{siteConfig.name} — {siteConfig.role} & {siteConfig.secondaryRole}</h1>
    <div className="coordinates" aria-hidden="true">{coordinateColumns.map((column, index) => <div className={`coordinate-column col-${index}`} key={index}>{column.map(number => <span key={number}><i />{String(number).padStart(3, '0')}</span>)}</div>)}</div>
    <div className="hero-role hero-enter"><span><ScrambleText>{siteConfig.role}</ScrambleText></span><span><ScrambleText>{siteConfig.secondaryRole}</ScrambleText></span><small className="mono">{siteConfig.location}</small></div>
    <div className="hero-statement hero-enter"><span><ScrambleText>Life, through</ScrambleText></span><span><ScrambleText>a different lens.</ScrambleText></span></div>
    <div className="hero-edition mono hero-enter">SELECTED FRAMES<br />{siteConfig.range}</div>
    <a href="#work" className="scroll-cue hero-enter"><span>Scroll<br />to explore</span><span aria-hidden="true">↓</span></a>
    <div className="light-anchor hero-light" data-glow aria-hidden="true"><div className="light-fallback" /></div>
    <OutlineWordmark />
    <div className="hero-bottom mono"><span>PHOTOGRAPHY & VISUAL STORIES</span><span>VOL. 01 — {siteConfig.year}</span></div>
  </section>;
}
