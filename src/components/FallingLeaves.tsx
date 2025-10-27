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
    // Varied sizes - 10x bigger (6x to 12x original size)
    size: 6 + Math.random() * 6,
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
            '--start-left': leaf.left,
            transform: `scale(${leaf.size})`,
          } as React.CSSProperties}
        >
          {/* High-resolution SVG leaf shape */}
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))' }}
          >
            {/* Main leaf shape - detailed and organic */}
            <path
              d="M100 20C100 20 60 60 60 100C60 140 100 180 100 180C100 180 140 140 140 100C140 60 100 20 100 20Z"
              fill="var(--leaf-color)"
              opacity="0.9"
            />
            {/* Center vein */}
            <path
              d="M100 20C100 20 80 60 80 100C80 140 100 180 100 180"
              stroke="rgba(86, 70, 53, 0.4)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Detail veins - left side */}
            <path
              d="M100 50L70 70M100 80L65 95M100 110L70 120M100 140L75 155"
              stroke="rgba(86, 70, 53, 0.25)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Detail veins - right side */}
            <path
              d="M100 50L130 70M100 80L135 95M100 110L130 120M100 140L125 155"
              stroke="rgba(86, 70, 53, 0.25)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Highlight for depth */}
            <path
              d="M100 30C100 30 75 65 75 100C75 125 90 160 95 170"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2"
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

        /* Falling animation with 20° angle */
        @keyframes fall {
          0% {
            top: -250px;
            left: var(--start-left);
            opacity: 0;
          }
          5% {
            opacity: 0.9;
          }
          95% {
            opacity: 0.9;
          }
          100% {
            top: calc(100vh + 250px);
            /* Move right by tan(20°) * height ≈ 0.364 * viewport height */
            left: calc(var(--start-left) + 36.4vh);
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
