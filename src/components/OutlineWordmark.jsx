import { siteConfig } from '../data/site';

export default function OutlineWordmark({ className = '' }) {
  return (
    <div className={`outline-wordmark ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 1400 390" preserveAspectRatio="none">
        <text x="-8" y="350" textLength="1400" lengthAdjust="spacingAndGlyphs">{siteConfig.wordmark}</text>
        <text className="outline-echo" x="-2" y="356" textLength="1400" lengthAdjust="spacingAndGlyphs">{siteConfig.wordmark}</text>
      </svg>
    </div>
  );
}
