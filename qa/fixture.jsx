// Isolated browser fixture. This entry is not included in the production build.
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/manrope';
import '@fontsource/ibm-plex-mono/400.css';
import '../src/styles/tokens.css';
import '../src/styles/global.css';
import '../src/styles/layout.css';
import '../src/styles/motion.css';
import { siteConfig } from '../src/data/site';
import { photos } from '../src/data/photos';
import App from '../src/App';

siteConfig.name = 'Nayat Rahardian Photography & Visual Storytelling';
siteConfig.wordmark = 'nayat rahardian';
siteConfig.email = 'hello.photography.studio@example.com';
siteConfig.motion.enabled = false;
photos[0].title = 'A much longer photographic story about people, light, and the small moments that make a city feel like home';
photos[0].src = '/images/intentionally-missing-qa-image.webp';
photos[0].width = 1000;
photos[0].height = 1000;

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
