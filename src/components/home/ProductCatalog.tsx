"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PRODUCTS as INITIAL_PRODS } from "@/data/products";
import { Product, ProductCategory } from "@/types";
import { sound } from "@/utils/sound";
import {
  Star,
  Clock,
  Sparkles,
  Heart,
  Eye,
  ShoppingBag,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RotateCw,
  X,
} from "lucide-react";

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
  onDirectOrder: (product: Product) => void;
}

const ITEMS_PER_PAGE = 8;

export default function ProductCatalog({
  onSelectProduct,
  onDirectOrder,
}: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODS);
  const [activeCategory, setActiveCategory] = useState<"all" | ProductCategory>("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Pagination state (8 items per page)
  const [currentPage, setCurrentPage] = useState(1);

  // 45 degree rotation state per product ID (-45, 0, 45)
  const [rotations, setRotations] = useState<Record<string, number>>({});

  // Zoom x2 modal state
  const [zoomProduct, setZoomProduct] = useState<Product | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(2); // 1x or 2x
  const [modalRotation, setModalRotation] = useState<number>(0);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic products:", err);
      }
    };
    fetchLatestProducts();
  }, []);

  const categories: { key: "all" | ProductCategory; label: string; icon: string }[] = [
    { key: "all", label: "Tất Cả Hoa Xinh", icon: "🌸" },
    { key: "kem-nhung", label: "Hoa Kẽm Nhung", icon: "🌻" },
    { key: "moc-len", label: "Hoa Móc Len Vintage", icon: "🧶" },
    { key: "hoa-sap", label: "Hoa Sáp Thơm Túi Trong", icon: "🎁" },
    { key: "decor", label: "Phụ Kiện Decor", icon: "✨" },
  ];

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  // Reset to page 1 when category changes
  const handleCategoryChange = (cat: "all" | ProductCategory) => {
    sound.playPop();
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    sound.playPop();
    setCurrentPage(page);
    const section = document.getElementById("products");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCardHover = (id: string) => {
    if (hoveredId !== id) {
      setHoveredId(id);
      sound.playPop();
    }
  };

  // Rotate flower left/right 45 degrees
  const handleRotate = (id: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPop();
    setRotations((prev) => {
      const current = prev[id] || 0;
      let next = current + delta;
      if (next > 45) next = -45;
      if (next < -45) next = 45;
      return { ...prev, [id]: next };
    });
  };

  // Open Zoom x2 Modal
  const handleOpenZoom = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playMagic();
    setZoomProduct(product);
    setZoomScale(2);
    setModalRotation(rotations[product.id] || 0);
  };

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section id="products" className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pastel-pink/40 border border-pastel-pink text-xs font-bold text-pastel-choco">
            <span>💐</span> Bộ Sưu Tập Thủ Công
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-pastel-choco">
            Góc Hoa Handmade Cưng Xỉu
          </h2>
          <p className="text-sm sm:text-base text-pastel-subtext max-w-xl mx-auto">
            Từng cánh hoa được nghệ nhân Anna Decor uốn kẽm, đan móc và phối màu pastel tỉ mỉ. Không bao giờ tàn, giữ trọn kỉ niệm đẹp.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center gap-1.5 ${
                activeCategory === cat.key
                  ? "bg-pastel-pinkDark text-white shadow-kawaii scale-105"
                  : "bg-white text-pastel-choco border border-pastel-pink/50 hover:bg-pastel-pink/20"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Top Controls: Pagination summary & Side arrows */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="text-xs sm:text-sm text-pastel-choco font-bold">
            Hiển thị <strong>8 mẫu hoa / trang</strong> (Tổng {filteredProducts.length} mẫu)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-2xl bg-white border border-pastel-pink/50 hover:bg-pastel-pink/20 text-pastel-choco disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all flex items-center gap-1 text-xs font-bold"
              title="Xem trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Trang trước</span>
            </button>
            <span className="text-xs font-black text-pastel-pinkDark px-2">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-2xl bg-white border border-pastel-pink/50 hover:bg-pastel-pink/20 text-pastel-choco disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all flex items-center gap-1 text-xs font-bold"
              title="Xem thêm bên cạnh (Trang tiếp theo)"
            >
              <span className="hidden sm:inline">Xem thêm bên cạnh</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Grid - Exactly 8 items per page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => {
            const isHovered = hoveredId === product.id;
            const currentRotation = rotations[product.id] || 0;

            return (
              <div
                key={product.id}
                onMouseEnter={() => handleCardHover(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group bg-white rounded-4xl p-4 border-2 border-pastel-pink/40 shadow-kawaii-sm hover:shadow-kawaii-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Badge Top Left */}
                {product.badge && (
                  <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur-sm text-pastel-choco text-[11px] font-black px-2.5 py-1 rounded-full border border-pastel-pink shadow-sm">
                    {product.badge}
                  </div>
                )}

                {/* Quick Action Buttons on Top Right: Zoom x2 */}
                <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleOpenZoom(product, e)}
                    className="p-2 rounded-full bg-white/95 hover:bg-white text-pastel-choco shadow-sm hover:text-pastel-pinkDark transition-all border border-pastel-pink/40"
                    title="Phóng to Zoom x2 để xem chi tiết cánh hoa"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-pastel-pinkDark" />
                  </button>
                </div>

                <div>
                  {/* Flower Bloom Image Container with 3D 45-degree rotation */}
                  <div
                    className="relative w-full h-56 rounded-3xl overflow-hidden bg-pastel-warmBg mb-3 select-none"
                    style={{ perspective: 800 }}
                  >
                    <div
                      className="relative w-full h-full transition-transform duration-500 ease-out"
                      style={{
                        transform: `rotateY(${currentRotation}deg)`,
                      }}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className={`object-cover transition-transform duration-500 ease-out ${
                          isHovered ? "scale-105" : "scale-100"
                        }`}
                      />
                    </div>

                    {/* Flower Bloom Flutter Sparkle Overlay */}
                    {isHovered && (
                      <div className="absolute inset-0 bg-gradient-to-t from-pastel-pink/20 to-transparent flex items-center justify-center pointer-events-none animate-sparkle">
                        <span className="text-3xl filter drop-shadow">🌸</span>
                      </div>
                    )}

                    {/* Quick View Button on Image */}
                    <button
                      onClick={() => {
                        sound.playPop();
                        onSelectProduct(product);
                      }}
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-pastel-choco shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Xem thông tin chi tiết"
                    >
                      <Eye className="w-4 h-4 text-pastel-choco" />
                    </button>
                  </div>

                  {/* 45-degree Rotation Controls (Xoay Trái / Phải 45 độ) */}
                  <div className="flex items-center justify-center gap-2 mb-3 bg-pastel-warmBg/80 p-1.5 rounded-2xl border border-pastel-pink/30 text-[11px] font-bold text-pastel-choco">
                    <button
                      onClick={(e) => handleRotate(product.id, -45, e)}
                      className="px-2 py-0.5 rounded-xl bg-white hover:bg-pastel-pink/30 border border-pastel-pink/40 flex items-center gap-0.5 text-pastel-choco transition-all active:scale-95"
                      title="Xoay trái 45 độ"
                    >
                      <RotateCcw className="w-3 h-3 text-pastel-pinkDark" />
                      <span>-45°</span>
                    </button>
                    <span className="text-[10px] text-pastel-subtext font-semibold">
                      {currentRotation === 0 ? "Góc 0°" : `${currentRotation > 0 ? "+" : ""}${currentRotation}°`}
                    </span>
                    <button
                      onClick={(e) => handleRotate(product.id, 45, e)}
                      className="px-2 py-0.5 rounded-xl bg-white hover:bg-pastel-pink/30 border border-pastel-pink/40 flex items-center gap-0.5 text-pastel-choco transition-all active:scale-95"
                      title="Xoay phải 45 độ"
                    >
                      <span>+45°</span>
                      <RotateCw className="w-3 h-3 text-pastel-pinkDark" />
                    </button>
                  </div>

                  {/* Rating & Craft Time */}
                  <div className="flex items-center justify-between text-xs text-pastel-subtext mb-1.5">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-gray-400 font-normal">({product.reviewCount})</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" />
                      <span>{product.craftTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => {
                      sound.playPop();
                      onSelectProduct(product);
                    }}
                    className="font-black text-pastel-choco text-base line-clamp-2 hover:text-pastel-pinkDark cursor-pointer transition-colors mb-2"
                  >
                    {product.name}
                  </h3>

                  {/* Description preview */}
                  <p className="text-xs text-pastel-choco/75 line-clamp-2 leading-relaxed mb-3">
                    {product.description}
                  </p>
                </div>

                {/* Price & Order Action */}
                <div className="pt-3 border-t border-pastel-pink/30 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-pastel-subtext block">Giá hạt dẻ</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-pastel-pinkDark">
                        {product.price.toLocaleString("vi-VN")}đ
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {product.originalPrice.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sound.playPop();
                      onDirectOrder(product);
                    }}
                    className="px-3.5 py-2 rounded-2xl bg-pastel-butter hover:bg-pastel-yellowGold text-pastel-choco font-black text-xs border border-amber-300 shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-800" />
                    <span>Đặt Ngay</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2.5 rounded-2xl bg-white border-2 border-pastel-pink/60 hover:bg-pastel-pink/20 text-pastel-choco disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs shadow-sm flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trang trước</span>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 rounded-2xl font-black text-xs transition-all flex items-center justify-center ${
                    currentPage === page
                      ? "bg-pastel-pinkDark text-white shadow-kawaii scale-105"
                      : "bg-white text-pastel-choco border border-pastel-pink/50 hover:bg-pastel-pink/20"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2.5 rounded-2xl bg-white border-2 border-pastel-pink/60 hover:bg-pastel-pink/20 text-pastel-choco disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs shadow-sm flex items-center gap-1 transition-all"
            >
              <span>Xem thêm bên cạnh</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ZOOM X2 MODAL & LIGHTBOX WITH 45 DEGREE ROTATION */}
      {zoomProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-5xl w-full max-w-3xl overflow-hidden border-3 border-pastel-pink shadow-2xl relative p-6 sm:p-8 space-y-4">
            <button
              onClick={() => {
                sound.playPop();
                setZoomProduct(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-pastel-pink/30 text-pastel-choco transition-colors z-20 bg-white/80"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between pb-3 border-b border-pastel-pink/30 pr-10">
              <div>
                <span className="text-xs font-bold text-pastel-pinkDark uppercase tracking-wider block">
                  Kính Lúp Phóng To Chi Tiết (Zoom x2)
                </span>
                <h3 className="text-xl font-black text-pastel-choco">
                  {zoomProduct.name}
                </h3>
              </div>
            </div>

            {/* Main Interactive Zoom Canvas */}
            <div
              className="relative w-full h-80 sm:h-96 rounded-4xl overflow-hidden bg-pastel-warmBg border-2 border-pastel-pink/50 flex items-center justify-center cursor-zoom-in"
              onClick={() => {
                sound.playPop();
                setZoomScale((prev) => (prev === 2 ? 1 : 2));
              }}
              style={{ perspective: 1000 }}
            >
              <div
                className="relative w-full h-full transition-transform duration-500 ease-out"
                style={{
                  transform: `scale(${zoomScale}) rotateY(${modalRotation}deg)`,
                }}
              >
                <Image
                  src={zoomProduct.image}
                  alt={zoomProduct.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority
                />
              </div>

              {/* Watermark / instruction badge */}
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                Đang xem mức: <strong>x{zoomScale}</strong> (Nhấp vào ảnh để phóng to/thu nhỏ)
              </div>
            </div>

            {/* Zoom & 45-degree Rotation Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playPop();
                    setZoomScale(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    zoomScale === 1
                      ? "bg-pastel-pinkDark text-white border-pastel-pinkDark"
                      : "bg-white text-pastel-choco border-gray-200 hover:bg-pastel-pink/20"
                  }`}
                >
                  <ZoomOut className="w-3.5 h-3.5 inline mr-1" />
                  Chuẩn x1
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    setZoomScale(2);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    zoomScale === 2
                      ? "bg-pastel-pinkDark text-white border-pastel-pinkDark"
                      : "bg-white text-pastel-choco border-gray-200 hover:bg-pastel-pink/20"
                  }`}
                >
                  <ZoomIn className="w-3.5 h-3.5 inline mr-1" />
                  Phóng to x2 (Zoom x2)
                </button>
              </div>

              {/* Angle Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-pastel-subtext">Xoay góc:</span>
                <button
                  onClick={() => {
                    sound.playPop();
                    setModalRotation((r) => (r === -45 ? 0 : -45));
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-pastel-pink/30 border border-pastel-pink/40 text-xs font-bold text-pastel-choco flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-pastel-pinkDark" />
                  <span>-45°</span>
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    setModalRotation(0);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-pastel-pink/30 border border-pastel-pink/40 text-xs font-bold text-pastel-choco"
                >
                  0°
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    setModalRotation((r) => (r === 45 ? 0 : 45));
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-pastel-pink/30 border border-pastel-pink/40 text-xs font-bold text-pastel-choco flex items-center gap-1"
                >
                  <span>+45°</span>
                  <RotateCw className="w-3.5 h-3.5 text-pastel-pinkDark" />
                </button>
              </div>

              {/* Order Button from Zoom Modal */}
              <button
                onClick={() => {
                  sound.playPop();
                  const p = zoomProduct;
                  setZoomProduct(null);
                  onDirectOrder(p);
                }}
                className="px-5 py-2.5 rounded-2xl bg-pastel-butter hover:bg-pastel-yellowGold text-pastel-choco font-black text-xs border border-amber-300 shadow-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all ml-auto"
              >
                <ShoppingBag className="w-4 h-4 text-amber-800" />
                <span>Đặt Mẫu Này Ngay ({zoomProduct.price.toLocaleString("vi-VN")}đ)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
