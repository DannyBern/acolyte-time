import React from 'react';
import { useTheme } from '../context/ThemeContext';

const FallingRain: React.FC = () => {
  const { theme } = useTheme();

  // Only show in dark theme
  if (theme !== 'dark') {
    return null;
  }

  // Create water drops that slide down like on a window
  const raindrops = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    // Varied starting positions across the screen
    left: `${5 + Math.random() * 90}%`,
    top: `${Math.random() * 30}%`,
    // Varied animation delays
    delay: `${Math.random() * 5}s`,
    // Varied durations - slower sliding
    duration: `${3 + Math.random() * 4}s`,
    // Varied sizes
    size: 0.6 + Math.random() * 1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="raindrop"
          style={{
            left: drop.left,
            top: drop.top,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
            transform: `scale(${drop.size})`,
          } as React.CSSProperties}
        >
          {/* SVG water drop sliding down window */}
          <svg
            width="30"
            height="80"
            viewBox="0 0 30 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(96, 165, 250, 0.6))' }}
          >
            {/* Main water drop body with gradient */}
            <ellipse
              cx="15"
              cy="15"
              rx="12"
              ry="15"
              fill="url(#waterGradient)"
              opacity="0.85"
            />
            {/* Trail effect */}
            <path
              d="M 10 15 Q 12 40, 13 65 Q 14 70, 15 75 Q 16 70, 17 65 Q 18 40, 20 15"
              fill="url(#trailGradient)"
              opacity="0.6"
            />
            {/* Highlight for 3D effect */}
            <ellipse
              cx="12"
              cy="12"
              rx="4"
              ry="6"
              fill="rgba(255, 255, 255, 0.6)"
            />
            <defs>
              <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.75" />
              </linearGradient>
              <linearGradient id="trailGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}

      <style>{`
        .raindrop {
          position: absolute;
          animation: slideDown ease-in infinite;
          opacity: 0;
          will-change: transform, opacity;
        }

        /* Water drop sliding down window effect */
        @keyframes slideDown {
          0% {
            transform: translateY(0) translateX(0) scale(var(--drop-scale, 1));
            opacity: 0;
          }
          5% {
            opacity: 0.9;
          }
          85% {
            opacity: 0.9;
          }
          100% {
            /* Slide down with slight diagonal movement */
            transform: translateY(100vh) translateX(15vh) scale(var(--drop-scale, 1));
            opacity: 0;
          }
        }

        .raindrop {
          animation: slideDown var(--fall-duration, 4s) ease-in infinite;
          animation-delay: var(--fall-delay, 0s);
        }
      `}</style>
    </div>
  );
};

export default FallingRain;
