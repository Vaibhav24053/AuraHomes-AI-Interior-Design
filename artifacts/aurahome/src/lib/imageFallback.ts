const fallbackSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
    <defs>
      <linearGradient id="warm" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#eadac8"/>
        <stop offset=".52" stop-color="#c8896e"/>
        <stop offset="1" stop-color="#8b6b2e"/>
      </linearGradient>
      <filter id="grain">
        <feTurbulence baseFrequency=".75" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .12 0"/>
      </filter>
    </defs>
    <rect width="1200" height="900" fill="url(#warm)"/>
    <circle cx="950" cy="120" r="360" fill="none" stroke="#f3ecdf" stroke-opacity=".28" stroke-width="2"/>
    <circle cx="210" cy="760" r="290" fill="none" stroke="#29352f" stroke-opacity=".15" stroke-width="2"/>
    <rect width="1200" height="900" filter="url(#grain)" opacity=".35"/>
  </svg>
`;

export const warmImageFallback = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(fallbackSvg)}`;

export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = warmImageFallback;
}