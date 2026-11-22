import Link from "next/link";
import MascotAvatar from "@/components/common/MascotAvatar";
import { SHOP_INFO } from "@/data/products";
import { MapPin, Phone, Heart, Sparkles } from "lucide-react";
import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-pastel-warmBg to-[#FDE8EF] border-t border-pastel-pink/40 pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Decorative Pastel Clouds */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-[radial-gradient(circle,#FFD6E0_30%,transparent_31%)] bg-[length:24px_24px] -translate-y-2 opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MascotAvatar size="md" />
              <div>
                <h3 className="text-xl font-black text-pastel-choco">Anna Decor</h3>
                <p className="text-xs text-pastel-subtext font-medium">Tiệm Hoa Thủ Công & Quà Tặng</p>
              </div>
            </div>
            <p className="text-sm text-pastel-choco/80 leading-relaxed italic">
              &quot;{SHOP_INFO.slogan}&quot;
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pastel-pink/40 border border-pastel-pink text-xs font-semibold text-pastel-choco">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              100% Uốn Kẽm & Đan Len Thủ Công
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-pastel-choco text-sm uppercase tracking-wider">
              Ghé Thăm Tiệm Anna
            </h4>
            <div className="space-y-2.5 text-sm text-pastel-choco/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-pastel-pinkDark shrink-0 mt-0.5" />
                <span>{SHOP_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-pastel-pinkDark shrink-0" />
                <a
                  href={`tel:${SHOP_INFO.hotline}`}
                  className="font-bold text-pastel-choco hover:text-pastel-pinkDark transition-colors"
                >
                  {SHOP_INFO.hotline} (Zalo)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 flex items-center justify-center text-blue-500 font-bold shrink-0">f</span>
                <a
                  href={SHOP_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline text-blue-600"
                >
                  fb.com/Annadecor123
                </a>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-pastel-choco text-sm uppercase tracking-wider">
              Danh Mục Yêu Thích
            </h4>
            <ul className="space-y-2 text-sm text-pastel-choco/80 font-medium">
              <li>
                <Link href="#products" className="hover:text-pastel-pinkDark transition-colors flex items-center gap-1">
                  <span>🌻</span> Hoa kẽm nhung bàn học
                </Link>
              </li>
              <li>
                <Link href="#products" className="hover:text-pastel-pinkDark transition-colors flex items-center gap-1">
                  <span>🧶</span> Hoa móc len vintage vĩnh cửu
                </Link>
              </li>
              <li>
                <Link href="#products" className="hover:text-pastel-pinkDark transition-colors flex items-center gap-1">
                  <span>🎁</span> Hoa sáp túi quà trong suốt
                </Link>
              </li>
              <li>
                <Link href="#bouquet-builder" className="hover:text-pastel-pinkDark transition-colors flex items-center gap-1">
                  <span>🎨</span> Studio tự bó hoa tặng crush
                </Link>
              </li>
              <li>
                <Link href="#wall-of-love" className="hover:text-pastel-pinkDark transition-colors flex items-center gap-1">
                  <span>💖</span> Lưu bút & Khoe ảnh hoa khách
                </Link>
              </li>
            </ul>
          </div>

          {/* Notice & Shop Hours */}
          <div className="space-y-3 bg-white/70 p-4 rounded-3xl border border-pastel-pink/60 shadow-sm">
            <h4 className="font-extrabold text-pastel-choco text-sm flex items-center gap-1.5">
              <span>⏰</span> Giờ Mở Cửa & Đặt Hàng
            </h4>
            <p className="text-xs text-pastel-choco/80 leading-relaxed">
              • Tiệm mở: <strong>8:00 - 21:00</strong> (Tất cả các ngày trong tuần)
            </p>
            <p className="text-xs text-pastel-pinkDark font-semibold leading-relaxed">
              ⚠️ Hoa kẽm nhung & hoa len cần đặt trước 1-2 ngày để thợ uốn tay thật xinh xắn nha bạn ơi!
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-pastel-subtext block">
                Tiệm hoa thủ công Đà Nẵng • Gói trọn yêu thương
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-pastel-pink/40 flex flex-col sm:flex-row items-center justify-between text-xs text-pastel-subtext gap-3">
          <p>© 2026 Anna Decor. All rights reserved. Made with love in Da Nang.</p>
          <p className="flex items-center gap-1">
            Gói ghém từng cánh hoa bằng cả trái tim <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
