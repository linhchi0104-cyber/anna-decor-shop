"use client";

import React from "react";
import { Icon } from "@iconify/react";

export default function FloatingStickers() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden hidden xl:block select-none">
      {/* Top Left Floating Sprout */}
      <div className="absolute top-28 left-6 animate-float opacity-75 hover:opacity-100 transition-opacity">
        <div className="p-2.5 rounded-3xl bg-white/70 backdrop-blur-sm border border-pastel-pink/50 shadow-kawaii-sm -rotate-12">
          <Icon icon="fluent-emoji-flat:seedling" className="w-8 h-8" />
        </div>
      </div>

      {/* Top Right Floating Bouquet */}
      <div className="absolute top-36 right-8 animate-float-delayed opacity-75 hover:opacity-100 transition-opacity">
        <div className="p-2.5 rounded-3xl bg-white/70 backdrop-blur-sm border border-pastel-pink/50 shadow-kawaii-sm rotate-12">
          <Icon icon="fluent-emoji-flat:bouquet" className="w-9 h-9" />
        </div>
      </div>

      {/* Mid Left Floating Yarn Ball */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 animate-float opacity-70 hover:opacity-100 transition-opacity">
        <div className="p-2 rounded-2xl bg-white/60 backdrop-blur-sm border border-pastel-lavender shadow-sm rotate-6">
          <Icon icon="fluent-emoji-flat:yarn" className="w-7 h-7" />
        </div>
      </div>

      {/* Mid Right Floating Sparkles & Heart */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 animate-float-delayed opacity-75 hover:opacity-100 transition-opacity">
        <div className="p-2 rounded-2xl bg-white/60 backdrop-blur-sm border border-pastel-butter shadow-sm -rotate-6">
          <Icon icon="fluent-emoji-flat:sparkles" className="w-7 h-7" />
        </div>
      </div>

      {/* Bottom Left Floating Gift */}
      <div className="absolute bottom-32 left-10 animate-float opacity-70 hover:opacity-100 transition-opacity">
        <div className="p-2.5 rounded-3xl bg-white/70 backdrop-blur-sm border border-pastel-mint shadow-sm rotate-12">
          <Icon icon="fluent-emoji-flat:wrapped-gift" className="w-8 h-8" />
        </div>
      </div>

      {/* Bottom Right Floating Ribbon */}
      <div className="absolute bottom-40 right-28 animate-float-delayed opacity-70 hover:opacity-100 transition-opacity">
        <div className="p-2 rounded-2xl bg-white/60 backdrop-blur-sm border border-pastel-pink shadow-sm -rotate-12">
          <Icon icon="fluent-emoji-flat:ribbon" className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
}
