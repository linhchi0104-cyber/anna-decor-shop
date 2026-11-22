"use client";

import { useState } from "react";
import MascotAvatar from "@/components/common/MascotAvatar";
import { sound } from "@/utils/sound";
import { Sparkles, Heart, ArrowRight, Palette, MessageCircle } from "lucide-react";

interface HeroBannerProps {
  onOpenChat: () => void;
  onExploreProducts: () => void;
  onOpenBouquetBuilder: () => void;
}

export default function HeroBanner({
  onOpenChat,
  onExploreProducts,
  onOpenBouquetBuilder,
}: HeroBannerProps) {
  const [mascotExp, setMascotExp] = useState<"happy" | "wink" | "sparkle">("happy");

  const handleMascotClick = () => {
    sound.playMagic();
    const next = mascotExp === "happy" ? "wink" : mascotExp === "wink" ? "sparkle" : "happy";
    setMascotExp(next);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Soft Pastel Background Blobs */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-pastel-pink/35 rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute top-24 right-1/4 w-96 h-96 bg-pastel-butter/45 rounded-full blur-3xl -z-10 animate-float-delayed" />
      <div className="absolute bottom-5 left-1/3 w-72 h-72 bg-pastel-mint/35 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Kawaii Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-pastel-pink shadow-kawaii-sm text-pastel-choco text-xs sm:text-sm font-bold animate-wiggle-soft">
              <span className="text-base">🌸</span>
              <span>Tiệm Hoa Thủ Công & Quà Tặng Xinh Xắn Đà Nẵng</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-pastel-choco tracking-tight leading-tight">
              Gói ghém <span className="text-pastel-pinkDark underline decoration-wavy decoration-pastel-butter">yêu thương</span> qua từng cánh hoa thủ công
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-pastel-choco/80 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Những đóa hoa kẽm nhung uốn tay tỉ mỉ, hoa móc len vintage bền màu và hoa sáp vĩnh cửu thơm ngát. Món quà ngọt ngào chuẩn gu Gen Z cho người thương, bạn thân và góc học tập xinh xắn.
            </p>

            {/* Value Highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-pastel-choco">
              <span className="px-3 py-1 rounded-2xl bg-pastel-pink/40 border border-pastel-pink/70 flex items-center gap-1">
                <span>🎀</span> 100% uốn tay tỉ mỉ
              </span>
              <span className="px-3 py-1 rounded-2xl bg-pastel-butter/60 border border-pastel-butter flex items-center gap-1">
                <span>💛</span> Giá sinh viên từ 49k
              </span>
              <span className="px-3 py-1 rounded-2xl bg-pastel-mint/50 border border-pastel-mint flex items-center gap-1">
                <span>🛵</span> Ship hỏa tốc Đà Nẵng
              </span>
              <span className="px-3 py-1 rounded-2xl bg-pastel-lavender/50 border border-pastel-lavender flex items-center gap-1">
                <span>💌</span> Tặng thiệp viết tay chibi
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenBouquetBuilder();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-3xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black shadow-kawaii-hover hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-base group"
              >
                <Palette className="w-5 h-5 text-pastel-choco" />
                <span>Tự Bó Hoa DIY Tặng Crush</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  onExploreProducts();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-3xl bg-white hover:bg-pastel-warmBg text-pastel-choco font-bold border-2 border-pastel-pink shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-base"
              >
                <span>Xem Mẫu Hoa Có Sẵn 🌸</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  onOpenChat();
                }}
                className="w-full sm:w-auto px-4 py-3.5 rounded-3xl bg-pastel-butter hover:bg-pastel-yellowGold text-pastel-choco font-bold border border-amber-300 shadow-sm transition-all flex items-center justify-center gap-1.5 text-sm"
              >
                <MessageCircle className="w-4 h-4 text-amber-700" />
                <span>Bé Mầm Tư Vấn AI</span>
              </button>
            </div>
          </div>

          {/* Right Mascot Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md bg-white/80 backdrop-blur-md rounded-5xl p-6 sm:p-8 border-3 border-pastel-pink shadow-kawaii text-center">
              {/* Cute corner tags */}
              <div className="absolute -top-3 -right-3 bg-pastel-butter text-pastel-choco text-xs font-black px-3.5 py-1.5 rounded-full border border-amber-300 shadow-sm rotate-6">
                Chạm vào tớ nha! ✨
              </div>

              {/* Interactive Mascot */}
              <div
                onClick={handleMascotClick}
                className="cursor-pointer mx-auto py-2 group inline-block"
                title="Bấm vào Bé Mầm để đổi biểu cảm vui nhộn"
              >
                <MascotAvatar
                  size="xl"
                  expression={mascotExp}
                  showSpeech={true}
                  speechText={
                    mascotExp === "wink"
                      ? "Hihi, tặng crush hoa tulip đi bạn! 🌷"
                      : mascotExp === "sparkle"
                      ? "Tiệm Anna có hoa kẽm nhung xinh xỉu! ✨"
                      : "Em Bé Mầm của Anna Decor ạ ~ 🌱"
                  }
                />
              </div>

              <div className="space-y-1.5 mt-3">
                <h3 className="text-xl font-black text-pastel-choco flex items-center justify-center gap-1.5">
                  Bé Mầm Anna <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                </h3>
                <p className="text-xs text-pastel-subtext font-medium">
                  Linh vật dẫn lối niềm vui tại tiệm hoa thủ công
                </p>
              </div>

              {/* Cute Mini Promo Banner */}
              <div className="mt-5 p-3.5 rounded-3xl bg-pastel-warmBg border border-pastel-pink/50 text-left space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-pastel-choco">
                  <span>📍 Nhận hoa tại tiệm:</span>
                  <span className="text-pastel-pinkDark">Thanh Khê, Đà Nẵng</span>
                </div>
                <p className="text-[11px] text-pastel-choco/75 leading-tight">
                  K317/23 Nguyễn Phước Nguyên - Alo trước 15p qua Zalo 0763.679.601 để chuẩn bị gói nơ thật xinh bạn nhé!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
