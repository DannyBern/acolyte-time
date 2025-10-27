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
          {/* High-resolution SVG snowflake with thick outline */}
          <svg
            width="150"
            height="150"
            viewBox="0 0 150 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 3px 6px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 10px rgba(255,255,255,0.8))' }}
          >
            {/* Center circle with outline */}
            <circle cx="75" cy="75" r="10" fill="white" opacity="1" />
            <circle cx="75" cy="75" r="10" fill="none" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="2" opacity="1" />

            {/* 6 main branches with thick outline */}
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 75 75)`}>
                {/* Main branch - outline first */}
                <line
                  x1="75"
                  y1="75"
                  x2="75"
                  y2="20"
                  stroke="rgba(59, 130, 246, 0.9)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="1"
                />
                {/* Main branch - white fill */}
                <line
                  x1="75"
                  y1="75"
                  x2="75"
                  y2="20"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity="1"
                />
                {/* Side branches - outline */}
                <line x1="75" y1="35" x2="65" y2="30" stroke="rgba(59, 130, 246, 0.9)" strokeWidth="6" strokeLinecap="round" opacity="1" />
                <line x1="75" y1="35" x2="85" y2="30" stroke="rgba(59, 130, 246, 0.9)" strokeWidth="6" strokeLinecap="round" opacity="1" />
                <line x1="75" y1="50" x2="65" y2="45" stroke="rgba(59, 130, 246, 0.9)" strokeWidth="6" strokeLinecap="round" opacity="1" />
                <line x1="75" y1="50" x2="85" y2="45" stroke="rgba(59, 130, 246, 0.9)" strokeWidth="6" strokeLinecap="round" opacity="1" />
                {/* Side branches - white fill */}
                <line x1="75" y1="35" x2="65" y2="30" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="1" />
                <line x1="75" y1="35" x2="85" y2="30" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="1" />
                <line x1="75" y1="50" x2="65" y2="45" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="1" />
                <line x1="75" y1="50" x2="85" y2="45" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="1" />
                {/* Tips with outline */}
                <circle cx="75" cy="22" r="5" fill="white" opacity="1" />
                <circle cx="75" cy="22" r="5" fill="none" stroke="rgba(59, 130, 246, 0.9)" strokeWidth="2" opacity="1" />
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
