import React, { useEffect, useState, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Jouer la vidéo au montage du composant
    if (videoRef.current) {
      videoRef.current.volume = 1.0; // Volume maximum pour qualité optimale
      videoRef.current.play().catch(err => {
        console.log('Video autoplay bloqué:', err);
        // Certains navigateurs bloquent l'autoplay avec son
        // Essayer en mode muet si autoplay échoue
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(e => console.log('Autoplay complètement bloqué:', e));
        }
      });
    }
  }, []);

  const handleVideoEnded = () => {
    // Démarrer le fade-out smooth
    setIsFadingOut(true);
    // Attendre la fin de l'animation de fade-out (500ms) avant de masquer complètement
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 500);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        // Forcer le plein écran et empêcher tout scrolling
        overflow: 'hidden',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      {/* Vidéo d'intro fullscreen avec optimisations professionnelles */}
      <video
        ref={videoRef}
        src="/acolyte-time/intro.mp4"
        className="w-full h-full"
        style={{
          // Optimisations pour une présentation fullscreen professionnelle
          objectFit: 'cover',
          objectPosition: 'center',
          // Smooth rendering sur tous les navigateurs
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          // Empêcher les barres noires
          width: '100%',
          height: '100%',
        } as React.CSSProperties}
        onEnded={handleVideoEnded}
        playsInline
        muted={false}
        preload="auto"
        // Optimisations pour mobile et desktop
        webkit-playsinline="true"
        x5-playsinline="true"
      />
    </div>
  );
};

export default SplashScreen;
