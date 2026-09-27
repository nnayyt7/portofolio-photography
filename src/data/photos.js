export const photos = [
  { id: 'profile-portrait', title: 'Quiet Portrait', category: 'Portrait', year: '2026', src: '/images/profile/profile.jpeg', width: 3024, height: 4032, focalPoint: '50% 40%', layout: 'portrait-center', featured: false, alt: 'Profile portrait of Nayat' },
  { id: 'city-rhythm', title: 'Street Pulse', category: 'Street', year: '2025', src: '/images/selected/DSC03214.JPEG', width: 1920, height: 1080, focalPoint: '50% 50%', layout: 'landscape-right', featured: true, alt: 'Urban street rhythm and architecture in a busy city scene' },
  { id: 'woven-detail', title: 'Threadwork', category: 'Documentary', year: '2025', src: '/images/selected/DSC03342.JPEG', width: 1920, height: 1080, focalPoint: '50% 50%', layout: 'landscape-left', featured: true, alt: 'Hiasan kepala manik-manik berwarna di atas anyaman dengan latar rumput' },
  { id: 'portrait-contrast', title: 'Light Study', category: 'Portrait', year: '2025', src: '/images/selected/DSC03345.JPEG', width: 1920, height: 1080, focalPoint: '50% 35%', layout: 'landscape-right', featured: true, alt: 'Portrait with soft contrast in natural light' },
  { id: 'quiet-lane', title: 'Slow Road', category: 'Documentary', year: '2025', src: '/images/selected/DSC03353.JPEG', width: 1920, height: 1080, focalPoint: '50% 50%', layout: 'landscape-left', featured: true, alt: 'Quiet road and soft light in a documentary frame' },
  { id: 'between-breaths', title: 'In Between', category: 'Portrait', year: '2026', src: '/images/selected/DSC03426.JPEG', width: 1920, height: 1080, focalPoint: '50% 45%', layout: 'landscape-right', featured: true, alt: 'Close portrait framed with soft, intimate expression' },
  { id: 'night-gathering', title: 'After Hours', category: 'Event', year: '2025', src: '/images/selected/DSC03430.JPEG', width: 1080, height: 1920, focalPoint: '50% 50%', layout: 'portrait-left', featured: true, alt: 'Evening gathering under warm lights and a crowd of people' },
  { id: 'concrete-lines', title: 'Concrete Form', category: 'Street', year: '2024', src: '/images/selected/DSC03433.JPEG', width: 1080, height: 1440, focalPoint: '50% 50%', layout: 'portrait-right', featured: true, alt: 'Architectural lines and geometric forms in concrete' },
  { id: 'open-road', title: 'Long Road', category: 'Documentary', year: '2025', src: '/images/selected/DSC03493.JPEG', width: 1616, height: 1080, focalPoint: '50% 50%', layout: 'landscape-right', featured: false, alt: 'Open landscape and open road under soft sunlight' },
  { id: 'coastline', title: 'Sea Line', category: 'Documentary', year: '2026', src: '/images/selected/DSC03506.JPEG', width: 1616, height: 1080, focalPoint: '50% 50%', layout: 'small-left', featured: false, alt: 'Coastal horizon and natural textures by the sea' },
  { id: 'passing-faces', title: 'Passing Glances', category: 'Portrait', year: '2025', src: '/images/selected/IMG_9749.JPEG', width: 960, height: 640, focalPoint: '50% 35%', layout: 'portrait-left', featured: false, alt: 'Street portrait with a quiet and observant gaze' },
  { id: 'wild-morning', title: 'Morning Terrain', category: 'Documentary', year: '2024', src: '/images/selected/ld-export-88327c08-05092025.JPEG', width: 3024, height: 4032, focalPoint: '50% 50%', layout: 'small-left', featured: false, alt: 'Wild landscape in the soft morning light' },
  { id: 'first-light', title: 'First Horizon', category: 'Documentary', year: '2026', src: '/images/selected/ld-export-aaba62e5-05092025.JPEG', width: 1080, height: 1440, focalPoint: '50% 50%', layout: 'portrait-center', featured: false, alt: 'Atmospheric early morning scenery with layered mountains' },
];

export function assetUrl(path) {
  if (!path) return `${import.meta.env.BASE_URL}images/fallback.svg`;
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
