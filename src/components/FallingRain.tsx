import React from 'react';
import { useTheme } from '../context/ThemeContext';

const FallingRain: React.FC = () => {
  const { theme } = useTheme();

  // Only show in dark theme
  if (theme !== 'dark') {
    return null;
  }

  // Create water drops that slide down like on a window
  const raindrops = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    // Varied starting positions across the screen
    left: `${5 + Math.random() * 90}%`,
    top: `${-10 - Math.random() * 20}%`, // Start above screen
    // Varied animation delays
    delay: `${Math.random() * 8}s`,
    // Varied durations - slower sliding for realism
    duration: `${4 + Math.random() * 6}s`,
    // Varied sizes
    size: 0.8 + Math.random() * 1.2,
    // Random horizontal drift
    drift: -10 + Math.random() * 20,
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
          {/* Realistic water drop with trail above */}
          <svg
            width="20"
            height="150"
            viewBox="0 0 20 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.8)) drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))'
            }}
          >
            <defs>
              {/* Gradient for main drop - bright and visible */}
              <radialGradient id={`dropGradient-${drop.id}`} cx="50%" cy="40%">
                <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#93c5fd" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#60a5fa" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
              </radialGradient>

              {/* Gradient for trail - fades upward */}
              <linearGradient id={`trailGradient-${drop.id}`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="30%" stopColor="#60a5fa" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#93c5fd" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#dbeafe" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Trail path - starts from top, narrows toward drop */}
            <path
              d="M 10 0
                 Q 8 30, 7 60
                 Q 6.5 90, 7 110
                 Q 8 125, 10 135
                 Q 12 125, 13 110
                 Q 13.5 90, 13 60
                 Q 12 30, 10 0 Z"
              fill={`url(#trailGradient-${drop.id})`}
            />

            {/* Main water drop body - teardrop shape */}
            <ellipse
              cx="10"
              cy="140"
              rx="9"
              ry="11"
              fill={`url(#dropGradient-${drop.id})`}
            />

            {/* Bottom point of teardrop */}
            <path
              d="M 10 129 Q 6 135, 10 141 Q 14 135, 10 129 Z"
              fill={`url(#dropGradient-${drop.id})`}
            />

            {/* Bright highlight for realism */}
            <ellipse
              cx="8"
              cy="138"
              rx="3"
              ry="4"
              fill="rgba(255, 255, 255, 0.8)"
            />

            {/* Secondary smaller highlight */}
            <ellipse
              cx="11"
              cy="142"
              rx="1.5"
              ry="2"
              fill="rgba(255, 255, 255, 0.6)"
            />

            {/* Outline for better visibility */}
            <ellipse
              cx="10"
              cy="140"
              rx="9"
              ry="11"
              fill="none"
              stroke="rgba(147, 197, 253, 0.5)"
              strokeWidth="0.5"
            />
          </svg>
        </div>
      ))}

      <style>{`
        .raindrop {
          position: absolute;
          animation: slideDownWindow cubic-bezier(0.4, 0, 0.2, 1) infinite;
          opacity: 0;
          will-change: transform, opacity;
        }

        /* Realistic water drop sliding with acceleration and deceleration */
        @keyframes slideDownWindow {
          0% {
            transform: translateY(0) translateX(0) scale(0.8);
            opacity: 0;
          }
          3% {
            opacity: 0.95;
            transform: translateY(5vh) translateX(0.5vh) scale(1);
          }
          10% {
            opacity: 0.95;
          }
          /* Accelerate in middle */
          50% {
            opacity: 0.95;
          }
          /* Slight deceleration and drift near end */
          90% {
            opacity: 0.9;
          }
          97% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(110vh) translateX(8vh) scale(1.1);
            opacity: 0;
          }
        }

        .raindrop {
          animation: slideDownWindow var(--fall-duration, 5s) cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: var(--fall-delay, 0s);
        }
      `}</style>
    </div>
  );
};

export default FallingRain;
