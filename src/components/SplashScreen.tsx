import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Durée totale de l'animation: 2.5 secondes
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Attendre la fin du fade-out avant d'appeler onComplete
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 animate-splash-fade-out">
      <div className="relative">
        {/* Effet de lueur derrière le logo */}
        <div className="absolute inset-0 blur-3xl opacity-30 animate-splash-glow">
          <div className="w-full h-full bg-gradient-to-br from-gold-500 to-gold-600 rounded-full"></div>
        </div>

        {/* Logo avec animation de zoom dramatique */}
        <img
          src="/acolyte-time/acolyte-logo.png"
          alt="Acolyte"
          className="relative w-48 h-48 object-contain animate-splash-zoom"
          style={{
            imageRendering: '-webkit-optimize-contrast',
            WebkitFontSmoothing: 'antialiased',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
          }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
