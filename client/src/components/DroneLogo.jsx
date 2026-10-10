import React from 'react';

export default function DroneLogo({ className = 'w-6 h-6', animated = false }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? 'group' : ''}`}
    >
      <defs>
        <linearGradient id="droneCoreGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="droneCenterGrad" x1="32" y1="22" x2="32" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      {/* 4 Rotors & Propellers */}
      {/* Top Left */}
      <circle cx="16" cy="16" r="9" stroke="#34d399" strokeWidth="1.6" strokeOpacity="0.45" strokeDasharray="3 2" />
      <ellipse cx="16" cy="16" rx="8" ry="2.2" fill="#34d399" transform="rotate(-30 16 16)" fillOpacity="0.95" />
      <circle cx="16" cy="16" r="2.2" fill="#ffffff" />

      {/* Top Right */}
      <circle cx="48" cy="16" r="9" stroke="#34d399" strokeWidth="1.6" strokeOpacity="0.45" strokeDasharray="3 2" />
      <ellipse cx="48" cy="16" rx="8" ry="2.2" fill="#34d399" transform="rotate(30 48 16)" fillOpacity="0.95" />
      <circle cx="48" cy="16" r="2.2" fill="#ffffff" />

      {/* Bottom Left */}
      <circle cx="16" cy="48" r="9" stroke="#34d399" strokeWidth="1.6" strokeOpacity="0.45" strokeDasharray="3 2" />
      <ellipse cx="16" cy="48" rx="8" ry="2.2" fill="#34d399" transform="rotate(30 16 48)" fillOpacity="0.95" />
      <circle cx="16" cy="48" r="2.2" fill="#ffffff" />

      {/* Bottom Right */}
      <circle cx="48" cy="48" r="9" stroke="#34d399" strokeWidth="1.6" strokeOpacity="0.45" strokeDasharray="3 2" />
      <ellipse cx="48" cy="48" rx="8" ry="2.2" fill="#34d399" transform="rotate(-30 48 48)" fillOpacity="0.95" />
      <circle cx="48" cy="48" r="2.2" fill="#ffffff" />

      {/* Quadcopter Arms */}
      <line x1="19" y1="19" x2="27" y2="27" stroke="url(#droneCoreGrad)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="19" x2="37" y2="27" stroke="url(#droneCoreGrad)" strokeWidth="3" strokeLinecap="round" />
      <line x1="19" y1="45" x2="27" y2="37" stroke="url(#droneCoreGrad)" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="45" x2="37" y2="37" stroke="url(#droneCoreGrad)" strokeWidth="3" strokeLinecap="round" />

      {/* Central Chassis Body */}
      <path
        d="M32 23 L39 27.5 L39 36.5 L32 41 L25 36.5 L25 27.5 Z"
        fill="url(#droneCenterGrad)"
        stroke="#6ee7b7"
        strokeWidth="1.5"
      />

      {/* Agriculture Leaf Symbol at Center */}
      <path d="M32 27 C35 29 36 33 32 37 C28 33 29 29 32 27 Z" fill="#ffffff" />
      <circle cx="32" cy="32" r="1.5" fill="#047857" />

      {/* Spray droplets */}
      <circle cx="28" cy="45" r="1.2" fill="#6ee7b7" fillOpacity="0.85" />
      <circle cx="32" cy="47" r="1.5" fill="#a7f3d0" />
      <circle cx="36" cy="45" r="1.2" fill="#6ee7b7" fillOpacity="0.85" />
    </svg>
  );
}
