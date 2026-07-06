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

  if (error && fallback) {
    return <img src={fallback} alt={alt} className={className} onLoad={handleLoad} />;
  }

  return (
    <>
      {!loaded && (
        <div className={`img-skeleton ${className}`} style={{ position: 'absolute', inset: 0 }} />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </>
  );
}