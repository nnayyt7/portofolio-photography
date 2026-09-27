import { siteConfig } from '../data/site';
import { photos } from '../data/photos';
import PhotoFrame from '../components/PhotoFrame';

export default function About({ onOpen }) {
  const profile = photos.find(photo => photo.id === siteConfig.profilePhotoId);
  return <section id="about" className="about section-pad" aria-labelledby="about-heading"><span className="section-kicker mono">(04 — BEHIND THE LENS)</span><h2 id="about-heading">A curious eye.<br /><span className="muted">An open heart.</span></h2><div className="about-layout">{profile && <div className="about-portrait"><PhotoFrame photo={profile} index={photos.indexOf(profile)} onOpen={onOpen} /><span className="portrait-mark" aria-hidden="true">+</span></div>}<div className="about-copy"><p>{siteConfig.about}</p><p>{siteConfig.aboutSecond}</p><dl><div><dt className="mono">BASED IN</dt><dd>{siteConfig.location}</dd></div><div><dt className="mono">DRAWN TO</dt><dd>{siteConfig.focus.join(' / ')}</dd></div></dl><a className="text-link" href="#contact">Let’s tell your story <span aria-hidden="true">↗</span></a></div></div></section>;
}
