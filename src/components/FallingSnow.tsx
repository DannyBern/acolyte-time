import React from 'react';
import { useTheme } from '../context/ThemeContext';

const FallingSnow: React.FC = () => {
  const { theme } = useTheme();

  // Only show in light theme
  if (theme !== 'light') {
    return null;
  }

  // Create multiple snowflakes with different animations
  const snowflakes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    // Varied starting positions across the screen
    left: `${Math.random() * 100}%`,
    // Varied animation delays for natural effect
    delay: `${Math.random() * 10}s`,
    // Varied durations for different fall speeds
    duration: `${10 + Math.random() * 15}s`,
    // Varied sizes for depth
    size: 0.5 + Math.random() * 1.5,
    // Slight horizontal drift
    drift: Math.random() * 30 - 15,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
            '--start-left': flake.left,
            '--drift': `${flake.drift}px`,
            transform: `scale(${flake.size})`,
          } as React.CSSProperties}
        >
          {/* High-resolution SVG snowflake */}
          <svg
            width="150"
            height="150"
            viewBox="0 0 150 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
          >
            {/* Center circle */}
            <circle cx="75" cy="75" r="8" fill="white" opacity="0.95" />

            {/* 6 main branches */}
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 75 75)`}>
                {/* Main branch */}
                <line
                  x1="75"
                  y1="75"
                  x2="75"
                  y2="20"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                {/* Side branches */}
                <line x1="75" y1="35" x2="65" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                <line x1="75" y1="35" x2="85" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                <line x1="75" y1="50" x2="65" y2="45" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                <line x1="75" y1="50" x2="85" y2="45" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                {/* Tips */}
                <circle cx="75" cy="22" r="3" fill="white" opacity="0.9" />
              </g>
            ))}
          </svg>
        </div>
      ))}

      <style>{`
        .snowflake {
          position: absolute;
          top: -150px;
          animation: snowfall linear infinite, sway ease-in-out infinite, rotate linear infinite;
          opacity: 0;
        }

        /* Falling animation - gentle vertical descent */
        @keyframes snowfall {
          0% {
            top: -150px;
            left: var(--start-left);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            top: calc(100vh + 150px);
            left: calc(var(--start-left) + var(--drift));
            opacity: 0;
          }
        }

        /* Gentle swaying */
        @keyframes sway {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(20px);
          }
        }

        /* Slow rotation */
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .snowflake {
          animation:
            snowfall var(--fall-duration, 20s) linear infinite,
            sway 3s ease-in-out infinite,
            rotate 8s linear infinite;
          animation-delay: var(--fall-delay, 0s);
        }
      `}</style>
    </div>
  );
};

export default FallingSnow;
