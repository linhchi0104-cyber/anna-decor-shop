"use client";

import { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isPointer, setIsPointer] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const colors = ["#FFD6E0", "#FFF3B0", "#C1F0DC", "#E8D7F1", "#FFB7B2"];
    let idCounter = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!hasMoved) setHasMoved(true);

      // Check if target is clickable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.classList.contains("clickable"))
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }

      // Add gentle sparkle every few pixels
      if (Math.random() > 0.45) {
        const newSparkle: Sparkle = {
          id: idCounter++,
          x: e.clientX + (Math.random() * 14 - 7),
          y: e.clientY + (Math.random() * 14 - 7),
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        setSparkles((prev) => [...prev.slice(-12), newSparkle]);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const interval = setInterval(() => {
      setSparkles((prev) => prev.filter((_, idx) => idx > 1));
    }, 200);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [hasMoved]);

  if (!hasMoved) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Sparkles Trail */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full animate-ping pointer-events-none transition-opacity"
          style={{
            left: s.x,
            top: s.y,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            boxShadow: `0 0 8px ${s.color}`,
            transform: "translate(-50%, -50%)",
            opacity: 0.7,
            animationDuration: "0.8s",
          }}
        />
      ))}

      {/* Main Cursor: Magic Wand / Cute Flower */}
      <div
        className="absolute pointer-events-none transition-transform duration-75 ease-out"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-2px, -2px) scale(${isPointer ? 1.25 : 1})`,
        }}
      >
        <span className="text-xl select-none inline-block filter drop-shadow">
          {isPointer ? "🪄" : "🌸"}
        </span>
      </div>
    </div>
  );
}
