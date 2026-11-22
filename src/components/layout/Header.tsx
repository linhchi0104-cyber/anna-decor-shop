"use client";

import Link from "next/link";
import { useState } from "react";
import SoundToggle from "@/components/common/SoundToggle";
import MascotAvatar from "@/components/common/MascotAvatar";
import { sound } from "@/utils/sound";
import { ShoppingBag, Sparkles, Menu, X, Search, Heart } from "lucide-react";
import { Icon } from "@iconify/react";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenChat: () => void;
  onOpenLookup: () => void;
}

export default function Header({
  cartCount,
  onOpenCart,
  onOpenChat,
  onOpenLookup,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    sound.playPop();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-pastel-pink/40 shadow-kawaii-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Mascot Brand */}
          <Link
            href="/"
            onClick={() => sound.playPop()}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <MascotAvatar size="sm" className="group-hover:rotate-6 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-pastel-choco tracking-tight flex items-center gap-1.5">
                Anna Decor
                <Icon icon="fluent-emoji-flat:cherry-blossom" className="w-5 h-5 animate-wiggle-soft inline-block" />
              </span>
              <span className="text-[11px] font-medium text-pastel-subtext hidden sm:inline-block">
                Tiệm Hoa Thủ Công & Quà Tặng Xinh Xắn
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Customer Only - NO Admin links) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="#products"
              onClick={handleNavClick}
              className="px-3.5 py-2 rounded-2xl text-sm font-bold text-pastel-choco hover:text-pastel-pinkDark hover:bg-pastel-pink/30 transition-colors flex items-center gap-1"
            >
              <span>🌸</span> Bộ Sưu Tập
            </Link>
            <Link
              href="#bouquet-builder"
              onClick={handleNavClick}
              className="px-3.5 py-2 rounded-2xl text-sm font-bold text-pastel-choco hover:text-amber-600 hover:bg-pastel-butter/60 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              Tự Bó Hoa DIY
            </Link>
            <Link
              href="#card-creator"
              onClick={handleNavClick}
              className="px-3.5 py-2 rounded-2xl text-sm font-bold text-pastel-choco hover:text-purple-600 hover:bg-pastel-lavender/50 transition-colors flex items-center gap-1"
            >
              <span>💌</span> Thiệp Chibi
            </Link>
            <Link
              href="#wall-of-love"
              onClick={handleNavClick}
              className="px-3.5 py-2 rounded-2xl text-sm font-bold text-pastel-choco hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Lưu Bút Khách
            </Link>
            <Link
              href="#story"
              onClick={handleNavClick}
              className="px-3.5 py-2 rounded-2xl text-sm font-bold text-pastel-choco hover:text-emerald-700 hover:bg-pastel-mint/50 transition-colors flex items-center gap-1"
            >
              <span>🏡</span> Về Anna Decor
            </Link>

            {/* Tra Cứu Đơn Hàng Modal Trigger */}
            <button
              onClick={() => {
                sound.playPop();
                onOpenLookup();
              }}
              className="px-3 py-1.5 rounded-2xl text-xs font-bold text-pastel-choco/80 hover:text-pastel-pinkDark bg-pastel-warmBg hover:bg-pastel-pink/20 transition-colors flex items-center gap-1 border border-pastel-pink/50 ml-1"
            >
              <Search className="w-3.5 h-3.5 text-pastel-pinkDark" />
              <span>Tra Cứu Đơn</span>
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <SoundToggle />

            {/* AI Bé Mầm Chat Trigger */}
            <button
              onClick={() => {
                sound.playPop();
                onOpenChat();
              }}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-pastel-butter hover:bg-pastel-yellowGold text-pastel-choco border border-amber-300 shadow-sm transition-all"
            >
              <span className="text-sm">🌱</span> Bé Mầm AI
            </button>

            {/* Cart Button */}
            <button
              onClick={() => {
                sound.playPop();
                onOpenCart();
              }}
              className="relative p-2.5 rounded-full bg-pastel-pink/40 hover:bg-pastel-pink text-pastel-choco transition-all border border-pastel-pink"
              aria-label="Giỏ hoa & Chốt đơn"
            >
              <ShoppingBag className="w-5 h-5 text-pastel-choco" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pastel-pinkDark text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => {
                sound.playPop();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-2xl text-pastel-choco hover:bg-pastel-pink/30 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Customer Only) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-pastel-cream/95 backdrop-blur-md border-b border-pastel-pink/40 px-4 pt-2 pb-6 space-y-2">
          <Link
            href="#products"
            onClick={handleNavClick}
            className="block px-4 py-2.5 rounded-2xl font-bold text-pastel-choco hover:bg-pastel-pink/40"
          >
            🌸 Bộ Sưu Tập Hoa Handmade
          </Link>
          <Link
            href="#bouquet-builder"
            onClick={handleNavClick}
            className="block px-4 py-2.5 rounded-2xl font-bold text-pastel-choco hover:bg-pastel-butter/60"
          >
            🎨 Tự Bó Hoa Tặng Crush (DIY Studio)
          </Link>
          <Link
            href="#card-creator"
            onClick={handleNavClick}
            className="block px-4 py-2.5 rounded-2xl font-bold text-pastel-choco hover:bg-pastel-lavender/50"
          >
            💌 Viết Thiệp Tay Chibi Kute
          </Link>
          <Link
            href="#wall-of-love"
            onClick={handleNavClick}
            className="block px-4 py-2.5 rounded-2xl font-bold text-pastel-choco hover:bg-rose-50"
          >
            💖 Lưu Bút & Khoe Ảnh Hoa
          </Link>
          <Link
            href="#story"
            onClick={handleNavClick}
            className="block px-4 py-2.5 rounded-2xl font-bold text-pastel-choco hover:bg-pastel-mint/50"
          >
            🏡 Câu Chuyện Tiệm Anna
          </Link>

          <button
            onClick={() => {
              sound.playPop();
              setMobileMenuOpen(false);
              onOpenLookup();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-pastel-choco bg-white border border-pastel-pink shadow-sm"
          >
            <Search className="w-4 h-4 text-pastel-pinkDark" />
            <span>Tra Cứu Đơn Hàng Của Bạn</span>
          </button>

          <div className="pt-2">
            <button
              onClick={() => {
                sound.playPop();
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black shadow-kawaii"
            >
              🌱 Trò chuyện cùng Bé Mầm AI
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
