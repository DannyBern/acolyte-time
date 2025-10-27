import React from 'react';
import { useTheme } from '../context/ThemeContext';

const FallingLeaves: React.FC = () => {
  const { theme } = useTheme();

  // Only show in zen theme
  if (theme !== 'zen') {
    return null;
  }

  // Create multiple leaves with different animations
  const leaves = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    // Varied starting positions across the screen
    left: `${Math.random() * 100}%`,
    // Varied animation delays for natural effect
    delay: `${Math.random() * 15}s`,
    // Varied durations for different fall speeds
    duration: `${15 + Math.random() * 10}s`,
    // Different leaf colors from zen palette
    color: i % 4 === 0 ? '#889D35' : i % 4 === 1 ? '#D2C0A7' : i % 4 === 2 ? '#b8975a' : '#a08860',
    // Varied sizes
    size: 0.6 + Math.random() * 0.6,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="leaf"
          style={{
            left: leaf.left,
            animationDelay: leaf.delay,
            animationDuration: leaf.duration,
            '--leaf-color': leaf.color,
            transform: `scale(${leaf.size})`,
          } as React.CSSProperties}
        >
          {/* SVG leaf shape */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
          >
            {/* Organic leaf shape */}
            <path
              d="M10 2C10 2 6 6 6 10C6 14 10 18 10 18C10 18 14 14 14 10C14 6 10 2 10 2Z"
              fill="var(--leaf-color)"
              opacity="0.85"
            />
            <path
              d="M10 2C10 2 8 6 8 10C8 14 10 18 10 18"
              stroke="rgba(86, 70, 53, 0.3)"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
            {/* Add some detail lines */}
            <path
              d="M10 6L8 8M10 10L7 11M10 14L8 15"
              stroke="rgba(86, 70, 53, 0.2)"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}

      <style>{`
        .leaf {
          position: absolute;
          top: -30px;
          animation: fall linear infinite, sway ease-in-out infinite, rotate linear infinite;
          animation-duration: inherit;
          opacity: 0;
        }

        /* Falling animation */
        @keyframes fall {
          0% {
            top: -30px;
            opacity: 0;
          }
          5% {
            opacity: 0.85;
          }
          95% {
            opacity: 0.85;
          }
          100% {
            top: calc(100vh + 30px);
            opacity: 0;
          }
        }

        /* Swaying side-to-side */
        @keyframes sway {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(50px);
          }
          75% {
            transform: translateX(-50px);
          }
        }

        /* Rotation for natural tumbling effect */
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Apply multiple animations with different timings */
        .leaf {
          animation:
            fall var(--fall-duration, 20s) linear infinite,
            sway 4s ease-in-out infinite,
            rotate 3s linear infinite;
          animation-delay: var(--fall-delay, 0s);
        }
      `}</style>
    </div>
  );
};

export default FallingLeaves;
