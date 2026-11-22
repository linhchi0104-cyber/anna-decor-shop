"use client";

import React from "react";

interface MascotAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  expression?: "happy" | "wink" | "shy" | "sparkle";
  showSpeech?: boolean;
  speechText?: string;
}

export default function MascotAvatar({
  size = "md",
  className = "",
  expression = "happy",
  showSpeech = false,
  speechText = "Xin chào bạn nè! 🌸",
}: MascotAvatarProps) {
  const sizeMap = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {showSpeech && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 backdrop-blur-sm text-pastel-choco text-xs md:text-sm font-semibold px-3 py-1.5 rounded-2xl shadow-kawaii border border-pastel-pink animate-float">
          {speechText}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-pastel-pink rotate-45" />
        </div>
      )}

      {/* Mascot Bé Mầm Anna SVG */}
      <svg
        className={`${sizeMap[size]} filter drop-shadow-md hover:scale-105 transition-transform duration-300`}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft background glow */}
        <circle cx="60" cy="65" r="45" fill="#FFE5EC" fillOpacity="0.6" />

        {/* Cute Baby Sprout Head */}
        <ellipse cx="60" cy="72" rx="42" ry="38" fill="#FFFDF9" stroke="#5C3D2E" strokeWidth="3" />

        {/* Sprout Stem */}
        <path
          d="M60 36 C60 22 55 12 45 10 C42 16 48 28 58 35"
          fill="#A7F3D0"
          stroke="#5C3D2E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Sprout Leaf Right */}
        <path
          d="M60 35 C65 20 78 14 85 18 C86 28 72 34 62 36"
          fill="#7EE7B8"
          stroke="#5C3D2E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Cute Ribbon on the head */}
        <ellipse cx="50" cy="38" rx="7" ry="5" fill="#FF8EAA" stroke="#5C3D2E" strokeWidth="2" transform="rotate(-20 50 38)" />
        <ellipse cx="68" cy="36" rx="7" ry="5" fill="#FF8EAA" stroke="#5C3D2E" strokeWidth="2" transform="rotate(20 68 36)" />
        <circle cx="59" cy="37" r="3.5" fill="#FFE699" stroke="#5C3D2E" strokeWidth="1.5" />

        {/* Rosy Cheeks */}
        <ellipse cx="34" cy="78" rx="8" ry="5" fill="#FFB7B2" fillOpacity="0.75" />
        <ellipse cx="86" cy="78" rx="8" ry="5" fill="#FFB7B2" fillOpacity="0.75" />
        {/* Cheek twinkle */}
        <circle cx="33" cy="76" r="1.5" fill="#FFFFFF" />
        <circle cx="85" cy="76" r="1.5" fill="#FFFFFF" />

        {/* Eyes based on expression */}
        {expression === "wink" ? (
          <>
            {/* Left eye winking curve */}
            <path d="M40 68 Q48 74 52 68" stroke="#5C3D2E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Right eye open cute */}
            <ellipse cx="74" cy="68" rx="5.5" ry="7" fill="#5C3D2E" />
            <circle cx="72" cy="65" r="2.5" fill="#FFFFFF" />
            <circle cx="76" cy="71" r="1" fill="#FFFFFF" />
          </>
        ) : expression === "sparkle" ? (
          <>
            {/* Sparkle Eyes */}
            <path d="M46 62 L48 67 L53 69 L48 71 L46 76 L44 71 L39 69 L44 67 Z" fill="#FFE699" stroke="#5C3D2E" strokeWidth="1.5" />
            <path d="M74 62 L76 67 L81 69 L76 71 L74 76 L72 71 L67 69 L72 67 Z" fill="#FFE699" stroke="#5C3D2E" strokeWidth="1.5" />
          </>
        ) : (
          <>
            {/* Standard Big Kawaii Eyes */}
            <ellipse cx="46" cy="68" rx="5.5" ry="7" fill="#5C3D2E" />
            <circle cx="44" cy="65" r="2.5" fill="#FFFFFF" />
            <circle cx="48" cy="71" r="1" fill="#FFFFFF" />

            <ellipse cx="74" cy="68" rx="5.5" ry="7" fill="#5C3D2E" />
            <circle cx="72" cy="65" r="2.5" fill="#FFFFFF" />
            <circle cx="76" cy="71" r="1" fill="#FFFFFF" />
          </>
        )}

        {/* Tiny Cute Smile */}
        <path d="M54 78 Q60 84 66 78" stroke="#5C3D2E" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Tiny Flower Pin on Cheeks */}
        <circle cx="95" cy="88" r="3" fill="#FFE699" />
        <circle cx="95" cy="88" r="1" fill="#FF8EAA" />
      </svg>
    </div>
  );
}
