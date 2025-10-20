import React, { useEffect, useState, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Jouer la vidéo au montage du composant
    if (videoRef.current) {
      videoRef.current.volume = 1.0; // Volume maximum pour qualité optimale
      videoRef.current.play().catch(err => {
        console.log('Video autoplay bloqué:', err);
        // Certains navigateurs bloquent l'autoplay
      });
    }
  }, []);

  const handleVideoEnded = () => {
    setIsVisible(false);
    // Attendre la fin du fade-out avant d'appeler onComplete
    setTimeout(onComplete, 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      {/* Vidéo d'intro fullscreen */}
      <video
        ref={videoRef}
        src="/acolyte-time/intro.mp4"
        className="w-full h-full object-cover"
        onEnded={handleVideoEnded}
        playsInline
        muted={false}
        preload="auto"
      />
    </div>
  );
};

export default SplashScreen;
