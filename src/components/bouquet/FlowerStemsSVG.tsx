"use client";

import React from "react";

// Beautiful handmade fuzzy wire / crochet flower SVGs
export function SunflowerStemSVG({ className = "w-28 h-40", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 160" fill="none" className={className} style={style}>
      {/* Green Stem */}
      <path d="M50 70 Q48 110 50 160" stroke="#4D7C0F" strokeWidth="6" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M48 105 Q30 95 24 110 Q38 120 49 115" fill="#65A30D" stroke="#365314" strokeWidth="1.5" />
      <path d="M51 125 Q70 115 76 130 Q62 140 51 135" fill="#65A30D" stroke="#365314" strokeWidth="1.5" />
      {/* Petals */}
      <g transform="translate(50, 48)">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-28"
            rx="8"
            ry="18"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="1.5"
            transform={`rotate(${deg})`}
          />
        ))}
        {/* Inner fluff petals */}
        {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-22"
            rx="6"
            ry="14"
            fill="#F59E0B"
            transform={`rotate(${deg})`}
          />
        ))}
        {/* Fluffy Center Brown with Fuzzy Wire Texture */}
        <circle cx="0" cy="0" r="18" fill="#78350F" stroke="#451A03" strokeWidth="2" />
        <circle cx="0" cy="0" r="14" fill="#92400E" stroke="#78350F" strokeWidth="1.5" strokeDasharray="2 2" />
        <circle cx="0" cy="0" r="8" fill="#451A03" />
        {/* Cute smile on sunflower center */}
        <circle cx="-5" cy="-2" r="2" fill="#FEF3C7" />
        <circle cx="5" cy="-2" r="2" fill="#FEF3C7" />
        <path d="M-4 4 Q0 8 4 4" stroke="#FEF3C7" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export function TulipStemSVG({
  className = "w-24 h-40",
  color = "#FF8EAA",
  innerColor = "#FFB7B2",
  style = {},
}: {
  className?: string;
  color?: string;
  innerColor?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 90 160" fill="none" className={className} style={style}>
      {/* Stem */}
      <path d="M45 65 Q43 110 45 160" stroke="#4D7C0F" strokeWidth="5.5" strokeLinecap="round" />
      {/* Tall sleek tulip leaf */}
      <path d="M45 110 Q20 80 16 115 Q30 135 45 125" fill="#65A30D" stroke="#365314" strokeWidth="1.5" />
      {/* Flower Petals 3D Layered */}
      <g transform="translate(45, 45)">
        {/* Back petal */}
        <ellipse cx="0" cy="-6" rx="16" ry="26" fill={innerColor} stroke="#9F1239" strokeWidth="1.5" />
        {/* Left petal */}
        <path
          d="M-4 12 C-26 8 -24 -24 -2 -28 C-8 -4 -2 8 -4 12 Z"
          fill={color}
          stroke="#881337"
          strokeWidth="1.5"
        />
        {/* Right petal */}
        <path
          d="M4 12 C26 8 24 -24 2 -28 C8 -4 2 8 4 12 Z"
          fill={color}
          stroke="#881337"
          strokeWidth="1.5"
        />
        {/* Center fold petal */}
        <ellipse cx="0" cy="0" rx="13" ry="24" fill={color} stroke="#9F1239" strokeWidth="1.5" />
        {/* Highlight sheen */}
        <ellipse cx="-4" cy="-5" rx="3" ry="12" fill="#FFFFFF" fillOpacity="0.4" />
      </g>
    </svg>
  );
}

export function DaisyStemSVG({
  className = "w-24 h-36",
  color = "#FFFFFF",
  centerColor = "#F59E0B",
  style = {},
}: {
  className?: string;
  color?: string;
  centerColor?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 80 150" fill="none" className={className} style={style}>
      {/* Stem */}
      <path d="M40 55 Q38 100 40 150" stroke="#4D7C0F" strokeWidth="4.5" strokeLinecap="round" />
      {/* Leaf */}
      <path d="M40 90 Q58 80 62 95 Q50 105 40 100" fill="#65A30D" stroke="#365314" strokeWidth="1" />
      {/* Flower */}
      <g transform="translate(40, 38)">
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-18"
            rx="5.5"
            ry="14"
            fill={color}
            stroke="#94A3B8"
            strokeWidth="1.2"
            transform={`rotate(${deg})`}
          />
        ))}
        {/* Fluffy Center */}
        <circle cx="0" cy="0" r="10" fill={centerColor} stroke="#B45309" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="6" fill="#FDE68A" />
      </g>
    </svg>
  );
}

export function CrochetRoseStemSVG({ className = "w-24 h-40", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 90 160" fill="none" className={className} style={style}>
      {/* Wool Stem */}
      <path d="M45 65 Q47 110 45 160" stroke="#365314" strokeWidth="5.5" strokeLinecap="round" />
      {/* Crochet Leaf */}
      <path d="M45 100 Q25 90 22 108 Q35 118 45 110" fill="#4D7C0F" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Multi-layered crochet petals */}
      <g transform="translate(45, 42)">
        <circle cx="0" cy="0" r="26" fill="#BE123C" stroke="#881337" strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="0" cy="0" r="20" fill="#E11D48" stroke="#9F1239" strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="0" cy="0" r="14" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />
        <circle cx="0" cy="0" r="8" fill="#FB7185" />
        <path d="M-5 -2 Q0 -8 5 -2 Q8 4 0 6 Q-8 4 -5 -2" fill="#881337" stroke="#4C0519" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function CrochetBellStemSVG({ className = "w-24 h-40", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 90 160" fill="none" className={className} style={style}>
      {/* Arching Stem */}
      <path d="M30 160 Q35 90 65 50" stroke="#4D7C0F" strokeWidth="5" strokeLinecap="round" />
      {/* Little hanging bells */}
      <g transform="translate(62, 54)">
        <path d="M0 0 Q6 8 8 16 Q0 18 -8 16 Q-6 8 0 0 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
        <circle cx="0" cy="17" r="2.5" fill="#C1F0DC" />
      </g>
      <g transform="translate(48, 76)">
        <path d="M0 0 Q-6 8 -8 16 Q0 18 8 16 Q6 8 0 0 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
        <circle cx="0" cy="17" r="2.5" fill="#C1F0DC" />
      </g>
      <g transform="translate(38, 102)">
        <path d="M0 0 Q6 8 8 14 Q0 16 -8 14 Q-6 8 0 0 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
        <circle cx="0" cy="15" r="2.5" fill="#C1F0DC" />
      </g>
    </svg>
  );
}

export function EucalyptusBranchSVG({ className = "w-20 h-36", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 70 140" fill="none" className={className} style={style}>
      <path d="M35 140 Q35 70 35 20" stroke="#65A30D" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="22" cy="40" rx="10" ry="7" fill="#A7F3D0" stroke="#059669" strokeWidth="1" transform="rotate(-25 22 40)" />
      <ellipse cx="48" cy="55" rx="10" ry="7" fill="#A7F3D0" stroke="#059669" strokeWidth="1" transform="rotate(25 48 55)" />
      <ellipse cx="20" cy="75" rx="11" ry="8" fill="#6EE7B7" stroke="#059669" strokeWidth="1" transform="rotate(-30 20 75)" />
      <ellipse cx="50" cy="95" rx="11" ry="8" fill="#6EE7B7" stroke="#059669" strokeWidth="1" transform="rotate(30 50 95)" />
    </svg>
  );
}
