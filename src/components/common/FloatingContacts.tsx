"use client";

import { MessageCircle, Phone, Sparkles } from "lucide-react";
import { SHOP_INFO } from "@/data/products";
import { sound } from "@/utils/sound";

interface FloatingContactsProps {
  onOpenChat: () => void;
}

export default function FloatingContacts({ onOpenChat }: FloatingContactsProps) {
  const handleChatClick = () => {
    sound.playPop();
    onOpenChat();
  };

  const handleZaloClick = () => {
    sound.playPop();
  };

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3 select-none">
      {/* Messenger Anna Decor */}
      <a
        href={SHOP_INFO.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleZaloClick}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#0084FF] to-[#00C6FF] text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
        title="Fanpage Facebook: Anna Decor"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-14 whitespace-nowrap bg-white text-pastel-choco text-xs font-semibold px-2.5 py-1 rounded-xl shadow-md border border-pastel-pink opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
          Chat Facebook Anna Decor
        </span>
      </a>

      {/* Zalo Button */}
      <a
        href={SHOP_INFO.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleZaloClick}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#0068FF] to-[#0091FF] text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
        title="Zalo / Hotline: 0763.679.601"
      >
        <span className="font-extrabold text-xs">Zalo</span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pastel-mintDark opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-pastel-mintDark"></span>
        </span>
        <span className="absolute right-14 whitespace-nowrap bg-white text-pastel-choco text-xs font-semibold px-2.5 py-1 rounded-xl shadow-md border border-pastel-pink opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
          Zalo: 0763.679.601 (Tư vấn 24/7)
        </span>
      </a>

      {/* Mascot Bé Mầm AI Chatbot Trigger */}
      <button
        onClick={handleChatClick}
        className="group relative flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-bold shadow-kawaii-hover hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white"
        aria-label="Mở chat với Bé Mầm AI"
      >
        {/* Animated Sprout Avatar Icon */}
        <div className="relative w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-inner overflow-hidden border border-pastel-pink">
          <span className="text-xl animate-wiggle-soft">🌱</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-extrabold text-pastel-choco flex items-center gap-1">
            Bé Mầm AI <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
          </span>
          <span className="text-[10px] text-pastel-choco/80 font-normal">Tư vấn & Chốt đơn</span>
        </div>
      </button>
    </div>
  );
}
