'use client';

import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export default function ImageWithSkeleton({ src, alt, className = '', fallback }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => setLoaded(true);
  const handleError = () => setError(true);

  const displaySrc = error && fallback ? fallback : src;

  return (
    <div className="relative overflow-hidden" style={{ paddingBottom: className.includes('h-') || className.includes('h[') ? undefined : '56.25%' }}>
      {!loaded && (
        <div 
          className="absolute inset-0 animate-pulse" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(233,30,99,0.05) 50%, rgba(212,175,55,0.05) 100%)',
            backgroundSize: '200% 200%',
          }} 
        />
      )}
      <img
        src={displaySrc}
        alt={alt}
        className={className}
        style={{ 
          opacity: loaded ? 1 : 0, 
          transition: 'opacity 0.4s ease',
          objectFit: 'cover',
        }}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}