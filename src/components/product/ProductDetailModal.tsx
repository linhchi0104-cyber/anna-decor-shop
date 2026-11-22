"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { sound } from "@/utils/sound";
import {
  X,
  Star,
  Clock,
  Sparkles,
  ShoppingBag,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
} from "lucide-react";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOrderNow: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onOrderNow,
}: ProductDetailModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0); // -45, 0, +45

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-5xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-3 border-pastel-pink shadow-kawaii-hover p-6 sm:p-8 relative">
        <button
          onClick={() => {
            sound.playPop();
            setIsZoomed(false);
            setRotation(0);
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-pastel-pink/30 text-pastel-choco transition-colors z-20"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Image with Zoom x2 & 45 Degree Rotation */}
          <div>
            <div
              className="relative w-full h-72 sm:h-80 rounded-4xl overflow-hidden bg-pastel-warmBg border-2 border-pastel-pink/40 shadow-inner cursor-pointer"
              onClick={() => {
                sound.playPop();
                setIsZoomed(!isZoomed);
              }}
              style={{ perspective: 900 }}
            >
              <div
                className="relative w-full h-full transition-transform duration-500 ease-out"
                style={{
                  transform: `scale(${isZoomed ? 2 : 1}) rotateY(${rotation}deg)`,
                }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {product.badge && (
                <div className="absolute top-4 left-4 bg-white/95 text-pastel-choco text-xs font-black px-3 py-1 rounded-full border border-pastel-pink shadow-sm z-10">
                  {product.badge}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playPop();
                  setIsZoomed(!isZoomed);
                }}
                className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-pastel-choco shadow-md text-xs font-bold flex items-center gap-1 z-10"
                title={isZoomed ? "Thu nhỏ" : "Phóng to x2"}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4 text-pastel-pinkDark" />}
                <span>{isZoomed ? "x1" : "Zoom x2"}</span>
              </button>
            </div>

            {/* Rotation controls below image */}
            <div className="mt-2 flex items-center justify-center gap-2 bg-pastel-warmBg p-1.5 rounded-2xl border border-pastel-pink/40 text-[11px] font-bold text-pastel-choco">
              <button
                onClick={() => {
                  sound.playPop();
                  setRotation((r) => (r === -45 ? 0 : -45));
                }}
                className="px-2.5 py-1 rounded-xl bg-white hover:bg-pastel-pink/30 border border-pastel-pink/30 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-pastel-pinkDark" />
                <span>Xoay trái -45°</span>
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  setRotation(0);
                }}
                className="px-2 py-1 rounded-xl bg-white hover:bg-pastel-pink/30 border border-pastel-pink/30"
              >
                0°
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  setRotation((r) => (r === 45 ? 0 : 45));
                }}
                className="px-2.5 py-1 rounded-xl bg-white hover:bg-pastel-pink/30 border border-pastel-pink/30 flex items-center gap-1"
              >
                <span>Xoay phải +45°</span>
                <RotateCw className="w-3.5 h-3.5 text-pastel-pinkDark" />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-pastel-pinkDark uppercase tracking-wider block">
                {product.categoryName}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-pastel-choco mt-1 leading-snug">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-pastel-subtext">({product.reviewCount} đánh giá yêu thương)</span>
              </div>
            </div>

            {/* Price */}
            <div className="p-3 rounded-2xl bg-pastel-warmBg border border-pastel-pink/40 flex items-baseline gap-2">
              <span className="text-2xl font-black text-pastel-pinkDark">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {product.originalPrice.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-pastel-choco/85 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="space-y-2 text-xs text-pastel-choco bg-gray-50 p-3 rounded-2xl">
              <div>
                <strong>Chất liệu:</strong> {product.materials.join(", ")}
              </div>
              <div>
                <strong>Kích thước:</strong> {product.dimensions}
              </div>
              <div className="flex items-center gap-1 text-rose-500 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Thời gian uốn tay: {product.craftTime}</span>
              </div>
            </div>

            {/* Order Action */}
            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playPop();
                  onOrderNow(product);
                  onClose();
                }}
                className="w-full py-3.5 rounded-3xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black text-sm shadow-kawaii-hover hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-pastel-choco" />
                <span>Đặt Mua Bó Hoa Này Ngay 🌸</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
