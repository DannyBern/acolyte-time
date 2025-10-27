import React from 'react';
import { useTheme } from '../context/ThemeContext';

const FallingRain: React.FC = () => {
  const { theme } = useTheme();

  // Only show in dark theme
  if (theme !== 'dark') {
    return null;
  }

  // Create multiple raindrops with different animations
  const raindrops = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    // Varied starting positions across the screen
    left: `${Math.random() * 100}%`,
    // Varied animation delays for natural effect
    delay: `${Math.random() * 3}s`,
    // Varied durations - rain falls faster than snow
    duration: `${0.5 + Math.random() * 1}s`,
    // Varied lengths
    length: 40 + Math.random() * 40,
    // Slight opacity variation
    opacity: 0.3 + Math.random() * 0.4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="raindrop"
          style={{
            left: drop.left,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
            '--start-left': drop.left,
            '--drop-length': `${drop.length}px`,
            opacity: drop.opacity,
          } as React.CSSProperties}
        >
          {/* SVG raindrop - thin vertical line */}
          <svg
            width="2"
            height={drop.length}
            viewBox={`0 0 2 ${drop.length}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="1"
              y1="0"
              x2="1"
              y2={drop.length}
              stroke="url(#rainGradient)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}

      <style>{`
        .raindrop {
          position: absolute;
          top: -100px;
          animation: rainfall linear infinite;
          will-change: transform;
        }

        /* Fast falling animation at 20° angle */
        @keyframes rainfall {
          0% {
            top: -100px;
            left: var(--start-left);
          }
          100% {
            top: calc(100vh + 100px);
            /* 20° angle: tan(20°) ≈ 0.364 */
            left: calc(var(--start-left) + 36.4vh);
          }
        }

        .raindrop {
          animation: rainfall var(--fall-duration, 1s) linear infinite;
          animation-delay: var(--fall-delay, 0s);
        }
      `}</style>
    </div>
  );
};

export default FallingRain;
