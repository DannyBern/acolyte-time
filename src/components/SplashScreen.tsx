import React, { useEffect, useState, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Jouer la vidéo et l'audio au montage du composant
    if (videoRef.current) {
      videoRef.current.volume = 0; // Video muette - seul l'audio d'intro joue
      videoRef.current.play().catch(err => {
        console.log('Video autoplay bloqué:', err);
        // Essayer en mode muet si autoplay échoue
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(e => console.log('Autoplay complètement bloqué:', e));
        }
      });
    }

    // Jouer l'audio d'intro
    if (audioRef.current) {
      audioRef.current.volume = 1.0; // Volume maximum pour qualité optimale
      audioRef.current.play().catch(err => {
        console.log('Audio autoplay bloqué:', err);
      });
    }
  }, []);

  const handleVideoEnded = () => {
    // Démarrer le fade-out smooth
    setIsFadingOut(true);

    // Fade-out progressif de l'audio
    if (audioRef.current) {
      const audio = audioRef.current;
      const fadeDuration = 500; // 500ms de fade-out
      const fadeSteps = 20;
      const fadeInterval = fadeDuration / fadeSteps;
      const volumeDecrement = audio.volume / fadeSteps;

      let currentStep = 0;
      const fadeOutInterval = setInterval(() => {
        currentStep++;
        if (currentStep >= fadeSteps || audio.volume <= 0.05) {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeOutInterval);
        } else {
          audio.volume = Math.max(0, audio.volume - volumeDecrement);
        }
      }, fadeInterval);
    }

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
      {/* Audio d'intro - invisible mais joue automatiquement */}
      <audio
        ref={audioRef}
        src="/acolyte-time/intro-sound.mp3"
        preload="auto"
      />

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
        muted={true}
        preload="auto"
        // Optimisations pour mobile et desktop
        webkit-playsinline="true"
        x5-playsinline="true"
      />
    </div>
  );
};

export default SplashScreen;
