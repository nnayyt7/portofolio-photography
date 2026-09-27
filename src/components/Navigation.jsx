import { siteConfig } from '../data/site';
import MagneticLink from './MagneticLink';
import ScrambleText from './ScrambleText';

export default function Navigation({ onMenu }) {
  return <>
    <a href="#work" className="skip-link">Skip to photographs</a>
    <header className="site-nav">
      <MagneticLink as="button" type="button" className="pill" onClick={onMenu} aria-haspopup="dialog"><ScrambleText>MENU</ScrambleText></MagneticLink>
      <MagneticLink href="#contact" className="pill"><ScrambleText>LET’S TALK</ScrambleText></MagneticLink>
    </header>
    <a href="#home" className="vertical-identity" aria-label={`${siteConfig.name}, back to top`}>{siteConfig.wordmark}<span>®</span></a>
  </>;
}
