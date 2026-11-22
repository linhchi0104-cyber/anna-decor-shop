"use client";

import { useState, useEffect } from "react";
import { sound } from "@/utils/sound";
import { Volume2, VolumeX } from "lucide-react";

export default function SoundToggle({ className = "" }: { className?: string }) {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const handleToggle = () => {
    const nextState = sound.toggleMute();
    setIsMuted(nextState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border shadow-sm ${
        isMuted
          ? "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
          : "bg-pastel-pink/40 text-pastel-choco border-pastel-pink hover:bg-pastel-pink/70"
      } ${className}`}
      title={isMuted ? "Bật âm thanh kute" : "Tắt âm thanh"}
      aria-label="Toggle Sound"
    >
      {isMuted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-gray-400" />
          <span className="hidden sm:inline">SFX: Tắt</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-pastel-pinkDark animate-wiggle-soft" />
          <span className="hidden sm:inline">SFX: Bật 🎶</span>
        </>
      )}
    </button>
  );
}
