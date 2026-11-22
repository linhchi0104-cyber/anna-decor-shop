"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  STEM_OPTIONS,
  WRAP_OPTIONS,
  RIBBON_OPTIONS,
  ACCESSORY_OPTIONS,
} from "@/data/products";
import { StemOption, WrapOption, RibbonOption, AccessoryOption, CustomBouquet } from "@/types";
import { sound } from "@/utils/sound";
import {
  SunflowerStemSVG,
  TulipStemSVG,
  DaisyStemSVG,
  CrochetRoseStemSVG,
  CrochetBellStemSVG,
  EucalyptusBranchSVG,
} from "@/components/bouquet/FlowerStemsSVG";
import { Plus, Minus, Sparkles, Heart, RefreshCw, Palette, Camera, Move } from "lucide-react";

interface BouquetBuilderProps {
  onCheckoutCustomBouquet: (bouquet: CustomBouquet) => void;
}

interface FlowerItemInstance {
  instanceId: string;
  stemId: string;
  angle: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  zIndex: number;
}

export default function BouquetBuilder({ onCheckoutCustomBouquet }: BouquetBuilderProps) {
  // Stems list (includes default + custom stems added by Admin)
  const [stemsList, setStemsList] = useState<StemOption[]>(STEM_OPTIONS);

  // Stem counts
  const [stemCounts, setStemCounts] = useState<Record<string, number>>({
    "stem-sunflower": 1,
    "stem-tulip-pink": 2,
    "stem-daisy-white": 2,
  });

  const [selectedWrap, setSelectedWrap] = useState<WrapOption>(WRAP_OPTIONS[0]);
  const [selectedRibbon, setSelectedRibbon] = useState<RibbonOption>(RIBBON_OPTIONS[0]);
  const [selectedAccessories, setSelectedAccessories] = useState<AccessoryOption[]>([
    ACCESSORY_OPTIONS[0], // LED lights
  ]);
  const [cardMessage, setCardMessage] = useState<string>(
    "Chúc bạn luôn xinh đẹp và rạng rỡ như những đóa hoa này! 🌸✨"
  );

  // Arrangement seed to reset positions
  const [arrangementSeed, setArrangementSeed] = useState(0);

  const bouquetCanvasRef = useRef<HTMLDivElement>(null);

  // Fetch latest stems from API
  useEffect(() => {
    const fetchStems = async () => {
      try {
        const res = await fetch("/api/stems");
        const data = await res.json();
        if (data.success && data.stems && data.stems.length > 0) {
          setStemsList(data.stems);
        }
      } catch (err) {
        console.error("Failed to load stems:", err);
      }
    };
    fetchStems();
  }, []);

  // Handle stem increment/decrement
  const handleStemChange = (stemId: string, delta: number) => {
    sound.playPop();
    setStemCounts((prev) => {
      const current = prev[stemId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [stemId]: next };
    });
  };

  const handleToggleAccessory = (acc: AccessoryOption) => {
    sound.playPop();
    setSelectedAccessories((prev) => {
      const exists = prev.some((a) => a.id === acc.id);
      if (exists) {
        return prev.filter((a) => a.id !== acc.id);
      } else {
        return [...prev, acc];
      }
    });
  };

  const handleReset = () => {
    sound.playChime();
    setStemCounts({
      "stem-sunflower": 1,
      "stem-tulip-pink": 2,
      "stem-daisy-white": 2,
    });
    setSelectedWrap(WRAP_OPTIONS[0]);
    setSelectedRibbon(RIBBON_OPTIONS[0]);
    setSelectedAccessories([ACCESSORY_OPTIONS[0]]);
    setArrangementSeed((s) => s + 1);
  };

  // Build list of stacked flower instances with harmonious fan-out angles
  const bouquetFlowerInstances = useMemo(() => {
    const list: FlowerItemInstance[] = [];
    let count = 0;

    Object.entries(stemCounts).forEach(([stemId, qty]) => {
      for (let i = 0; i < qty; i++) {
        const angle =
          count === 0
            ? 0
            : (count % 2 === 0 ? 1 : -1) * (10 - Math.min(6, count * 1.5));
        const offsetX =
          count === 0 ? 0 : (count % 2 === 0 ? 1 : -1) * (count * 20);
        const offsetY = -Math.abs(count * 8);
        const scale = 0.95 + (count % 3) * 0.04;

        list.push({
          instanceId: `${stemId}-${i}`,
          stemId,
          angle,
          offsetX: Math.max(-100, Math.min(100, offsetX)),
          offsetY: Math.max(-60, offsetY),
          scale,
          zIndex: 10 + count,
        });
        count++;
      }
    });

    return list;
  }, [stemCounts]);

  // Totals
  const totalStemsCount = Object.values(stemCounts).reduce((a, b) => a + b, 0);

  const stemsPrice = Object.entries(stemCounts).reduce((sum, [stemId, count]) => {
    const stem = stemsList.find((s) => s.id === stemId);
    return sum + (stem ? stem.price * count : 0);
  }, 0);

  const accessoriesPrice = selectedAccessories.reduce((sum, acc) => sum + acc.price, 0);
  const totalPrice = stemsPrice + selectedWrap.price + selectedRibbon.price + accessoriesPrice;

  // Render flower head / face (mặt hoa không cành, phù hợp với góc nghiêng 70 độ)
  const renderFlowerFace = (stem: StemOption | undefined) => {
    if (!stem) return <span>🌸</span>;

    // If stem has transparent cut-out image URL from Admin Background Remover
    if (stem.imageUrl) {
      return (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-md select-none pointer-events-none">
          <img
            src={stem.imageUrl}
            alt={stem.name}
            className="w-full h-full object-contain pointer-events-none select-none"
          />
        </div>
      );
    }

    // Default SVG Stems
    switch (stem.id) {
      case "stem-sunflower":
        return <SunflowerStemSVG className="w-24 h-28 filter drop-shadow-md pointer-events-none" />;
      case "stem-tulip-pink":
        return <TulipStemSVG color="#FF8EAA" innerColor="#FFD6E0" className="w-20 h-28 filter drop-shadow-md pointer-events-none" />;
      case "stem-tulip-butter":
        return <TulipStemSVG color="#FBBF24" innerColor="#FEF3C7" className="w-20 h-28 filter drop-shadow-md pointer-events-none" />;
      case "stem-daisy-white":
        return <DaisyStemSVG color="#FFFFFF" centerColor="#F59E0B" className="w-20 h-24 filter drop-shadow-md pointer-events-none" />;
      case "stem-daisy-purple":
        return <DaisyStemSVG color="#E8D7F1" centerColor="#8B5CF6" className="w-20 h-24 filter drop-shadow-md pointer-events-none" />;
      case "stem-crochet-rose":
        return <CrochetRoseStemSVG className="w-20 h-28 filter drop-shadow-md pointer-events-none" />;
      case "stem-crochet-bell":
        return <CrochetBellStemSVG className="w-20 h-28 filter drop-shadow-md pointer-events-none" />;
      default:
        return (
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl bg-white/90 shadow-md border border-pastel-pink/40 select-none pointer-events-none">
            {stem.image || "🌸"}
          </div>
        );
    }
  };

  const handleProceed = () => {
    if (totalStemsCount === 0) {
      alert("Bạn ơi, hãy chọn ít nhất 1 cành hoa cho bó hoa của mình nhé! 🌸");
      return;
    }
    sound.playMagic();

    const activeStems = Object.entries(stemCounts)
      .filter(([, count]) => count > 0)
      .map(([stemId, quantity]) => {
        const stem = stemsList.find((s) => s.id === stemId)!;
        return { stem, quantity };
      });

    const customBouquet: CustomBouquet = {
      stems: activeStems,
      wrap: selectedWrap,
      ribbon: selectedRibbon,
      accessories: selectedAccessories,
      cardMessage,
      totalPrice,
    };

    onCheckoutCustomBouquet(customBouquet);
  };

  return (
    <section id="bouquet-builder" className="py-14 md:py-24 bg-gradient-to-b from-pastel-cream via-[#FFF5F7] to-pastel-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pastel-butter border border-amber-300 text-xs sm:text-sm font-black text-pastel-choco shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
            <span>Bouquet Builder Studio 2.0</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-pastel-choco">
            Studio &quot;Tự Bó Hoa Tặng Crush&quot;
          </h2>
          <p className="text-sm sm:text-base text-pastel-subtext max-w-2xl mx-auto">
            Tự tay chọn từng mặt hoa hướng dương kẽm nhung, tulip pastel, hoa chuông len và <strong>kéo thả sắp xếp trực tiếp</strong> trên bó hoa nghiêng góc 70° siêu chân thực!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: SELECTION PANELS */}
          <div className="lg:col-span-7 space-y-8 bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-5xl border-2 border-pastel-pink/50 shadow-kawaii">
            {/* Step 1: Chọn Cành Hoa */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-pastel-choco text-lg sm:text-xl flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-pastel-pinkDark text-white text-xs flex items-center justify-center font-black">
                    1
                  </span>
                  Chọn Cành Hoa Thủ Công ({totalStemsCount} cành đã chọn)
                </h3>
                <button
                  onClick={handleReset}
                  className="text-xs text-pastel-subtext hover:text-pastel-pinkDark flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Đặt lại
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {stemsList.map((stem) => {
                  const qty = stemCounts[stem.id] || 0;
                  return (
                    <div
                      key={stem.id}
                      className={`p-3 rounded-3xl border-2 transition-all flex items-center justify-between ${
                        qty > 0
                          ? "border-pastel-pinkDark bg-pastel-pink/20 shadow-sm"
                          : "border-gray-100 hover:border-pastel-pink/40 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-pastel-pink/30 shrink-0 overflow-hidden"
                          style={{ backgroundColor: `${stem.colorHex}35` }}
                        >
                          {stem.imageUrl ? (
                            <img src={stem.imageUrl} alt={stem.name} className="w-9 h-9 object-contain" />
                          ) : (
                            stem.image
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-pastel-choco leading-tight">
                            {stem.name}
                          </h4>
                          <span className="text-[11px] font-black text-pastel-pinkDark">
                            {stem.price.toLocaleString("vi-VN")}đ/cành
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-pastel-pink/50 shadow-sm shrink-0">
                        <button
                          onClick={() => handleStemChange(stem.id, -1)}
                          disabled={qty === 0}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-pastel-choco hover:bg-pastel-pink/40 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Giảm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-black text-pastel-choco">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleStemChange(stem.id, 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-pastel-choco hover:bg-pastel-pink/40"
                          aria-label="Tăng"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Chọn Giấy Gói & Nơ */}
            <div className="pt-6 border-t border-pastel-pink/40">
              <h3 className="font-black text-pastel-choco text-lg sm:text-xl flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-pastel-pinkDark text-white text-xs flex items-center justify-center font-black">
                  2
                </span>
                Chọn Giấy Gói & Nơ Thắt
              </h3>

              <div className="space-y-4">
                {/* Wrap Paper */}
                <div>
                  <span className="text-xs font-bold text-pastel-choco/80 block mb-2">
                    Màu giấy gói:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {WRAP_OPTIONS.map((wrap) => {
                      const isSelected = selectedWrap.id === wrap.id;
                      return (
                        <button
                          key={wrap.id}
                          onClick={() => {
                            sound.playPop();
                            setSelectedWrap(wrap);
                          }}
                          className={`p-2.5 rounded-2xl border-2 text-left transition-all flex items-center gap-2 ${
                            isSelected
                              ? "border-pastel-pinkDark bg-pastel-pink/30 shadow-sm"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-gray-300 shrink-0 shadow-inner"
                            style={{ backgroundColor: wrap.colorHex }}
                          />
                          <div className="truncate">
                            <span className="text-xs font-bold text-pastel-choco block truncate">
                              {wrap.name}
                            </span>
                            <span className="text-[10px] text-pastel-subtext">
                              +{wrap.price.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ribbon Bow */}
                <div>
                  <span className="text-xs font-bold text-pastel-choco/80 block mb-2">
                    Màu nơ ruy băng:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {RIBBON_OPTIONS.map((ribbon) => {
                      const isSelected = selectedRibbon.id === ribbon.id;
                      return (
                        <button
                          key={ribbon.id}
                          onClick={() => {
                            sound.playPop();
                            setSelectedRibbon(ribbon);
                          }}
                          className={`p-2 rounded-2xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "border-pastel-pinkDark bg-pastel-pink/30 shadow-sm text-pastel-choco"
                              : "border-gray-200 bg-white text-pastel-choco/80"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border shrink-0"
                            style={{ backgroundColor: ribbon.colorHex }}
                          />
                          <span>{ribbon.name}</span>
                          <span className="text-[10px] text-pastel-subtext">
                            (+{ribbon.price.toLocaleString("vi-VN")}đ)
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accessories Options */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-pastel-choco/80 block mb-2">
                    Gói phụ kiện thêm:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ACCESSORY_OPTIONS.map((acc) => {
                      const isSelected = selectedAccessories.some((a) => a.id === acc.id);
                      return (
                        <button
                          key={acc.id}
                          onClick={() => handleToggleAccessory(acc)}
                          className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                            isSelected
                              ? "border-pastel-mintDark bg-pastel-mint/30 shadow-sm"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="text-xl mb-1">{acc.icon}</div>
                          <div className="text-[11px] font-bold text-pastel-choco line-clamp-1">
                            {acc.name}
                          </div>
                          <div className="text-[10px] font-extrabold text-pastel-pinkDark">
                            +{acc.price.toLocaleString("vi-VN")}đ
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE VISUAL CANVAS / 70° TILT BOUQUET STUDIO WITH DRAG & DROP */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-white rounded-5xl p-6 sm:p-8 border-3 border-pastel-pink shadow-kawaii text-center relative overflow-hidden">
              {/* Badge Top */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-pink/40 border border-pastel-pink text-xs font-bold text-pastel-choco mb-4">
                <Palette className="w-3.5 h-3.5 text-pastel-pinkDark" />
                <span>Bó Hoa Nghiêng 70° (Tự Do Kéo Thả)</span>
              </div>

              {/* VISUAL BOUQUET STUDIO CANVAS */}
              <div
                ref={bouquetCanvasRef}
                className="relative w-full h-[400px] sm:h-[430px] rounded-4xl bg-gradient-to-b from-[#FFF5F8] via-[#FFEBF1] to-[#FFE0E9] flex flex-col items-center justify-end p-4 border-2 border-dashed border-pastel-pink/70 overflow-hidden shadow-inner select-none"
                style={{ perspective: 900 }}
              >
                {/* Cute Drag Hint Pill on Canvas */}
                <div className="absolute top-3 left-3 z-50 bg-white/90 backdrop-blur-sm border border-pastel-pink px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-pastel-choco shadow-sm flex items-center gap-1 pointer-events-none">
                  <Move className="w-3 h-3 text-pastel-pinkDark" />
                  <span>Kéo thả từng mặt hoa để sắp xếp</span>
                </div>

                {/* Reset Auto Fan-out Button */}
                <button
                  onClick={() => {
                    sound.playPop();
                    setArrangementSeed((s) => s + 1);
                  }}
                  className="absolute top-3 right-3 z-50 bg-white/90 hover:bg-white text-pastel-choco hover:text-pastel-pinkDark border border-pastel-pink px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 transition-all"
                  title="Tự động xếp tròn lại"
                >
                  <RefreshCw className="w-3 h-3 text-pastel-pinkDark" />
                  <span>Xếp lại</span>
                </button>

                {/* Back Paper Silhouette Layer */}
                <div
                  className="absolute bottom-14 w-72 h-72 rounded-full opacity-60 filter blur-sm transition-colors duration-500 pointer-events-none"
                  style={{ backgroundColor: selectedWrap.colorHex }}
                />

                {/* Ambient Eucalyptus Foliage in background */}
                {totalStemsCount > 0 && (
                  <>
                    <div className="absolute top-10 left-6 -rotate-25 opacity-70 pointer-events-none">
                      <EucalyptusBranchSVG />
                    </div>
                    <div className="absolute top-10 right-6 rotate-25 opacity-70 pointer-events-none">
                      <EucalyptusBranchSVG />
                    </div>
                  </>
                )}

                {/* 70-DEGREE TILTED FLOWER BED WITH DRAG & DROP MOTIONS */}
                <div
                  className="relative w-full h-60 flex items-center justify-center z-20 mb-8"
                  style={{
                    transform: "rotateX(20deg)", // Perspective tilt angle: 70° upward looking
                    transformStyle: "preserve-3d",
                  }}
                >
                  {totalStemsCount === 0 ? (
                    <div className="text-xs text-pastel-subtext italic self-center">
                      Chưa có cành hoa nào. Hãy bấm dấu &quot;+&quot; bên cạnh để thêm hoa nha! 🌸
                    </div>
                  ) : (
                    bouquetFlowerInstances.map((item) => {
                      const stem = stemsList.find((s) => s.id === item.stemId);
                      return (
                        <motion.div
                          key={`${item.instanceId}-${arrangementSeed}`}
                          drag
                          dragConstraints={bouquetCanvasRef}
                          dragElastic={0.05}
                          dragMomentum={false}
                          whileDrag={{ scale: 1.18, zIndex: 99, cursor: "grabbing" }}
                          whileHover={{ scale: 1.08, cursor: "grab" }}
                          className="absolute cursor-grab active:cursor-grabbing touch-none select-none transition-shadow"
                          style={{
                            transform: `translate(${item.offsetX}px, ${item.offsetY}px) rotate(${item.angle}deg) scale(${item.scale})`,
                            zIndex: item.zIndex,
                          }}
                        >
                          <div className="p-1 rounded-3xl hover:bg-white/40 transition-colors">
                            {renderFlowerFace(stem)}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Wrapping Paper Cone Shape (Front Layer) - tilted 70° upward */}
                <div
                  className="relative w-56 sm:w-64 h-36 rounded-b-5xl flex items-center justify-center shadow-lg transition-colors duration-500 border-2 border-white/90 z-30 pointer-events-none"
                  style={{
                    backgroundColor: selectedWrap.colorHex,
                    clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",
                  }}
                >
                  <div className="text-[11px] font-black text-pastel-choco/90 bg-white/85 px-3 py-1 rounded-full shadow-sm mt-3 border border-pastel-pink/40">
                    {selectedWrap.name}
                  </div>
                </div>

                {/* Ribbon Bow Graphic at center fold */}
                <div
                  className="relative -top-3 z-40 px-4 py-1.5 rounded-full text-xs font-black text-white shadow-md flex items-center gap-1.5 border-2 border-white animate-pulse-slow pointer-events-none"
                  style={{ backgroundColor: selectedRibbon.colorHex }}
                >
                  <span>🎀</span>
                  <span>{selectedRibbon.name}</span>
                </div>

                {/* Floating Accessories Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-50 pointer-events-none">
                  {selectedAccessories.map((acc) => (
                    <span
                      key={acc.id}
                      className="px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-bold text-pastel-choco shadow-sm border border-pastel-mint"
                    >
                      {acc.icon} {acc.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bouquet Recipe Summary */}
              <div className="mt-4 p-3.5 rounded-3xl bg-pastel-warmBg border border-pastel-pink/50 text-left space-y-1.5 text-xs text-pastel-choco">
                <div className="font-extrabold text-sm text-pastel-choco flex items-center justify-between">
                  <span>Bó hoa phối gồm:</span>
                  <span className="text-pastel-pinkDark font-black">
                    {totalStemsCount} cành uốn tay
                  </span>
                </div>
                <p className="text-pastel-choco/80 truncate">
                  • Mặt hoa: {Object.entries(stemCounts)
                    .filter(([, c]) => c > 0)
                    .map(([id, c]) => `${c}x ${stemsList.find((s) => s.id === id)?.name || id}`)
                    .join(", ")}
                </p>
                <p className="text-pastel-choco/80">
                  • Giấy gói: <strong>{selectedWrap.name}</strong> | Nơ: <strong>{selectedRibbon.name}</strong>
                </p>
              </div>

              {/* Total Price & Checkout Button */}
              <div className="mt-4 pt-3 border-t border-pastel-pink/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-pastel-subtext block text-left">Tổng dự kiến:</span>
                  <span className="text-2xl font-black text-pastel-pinkDark">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>

                <button
                  onClick={handleProceed}
                  disabled={totalStemsCount === 0}
                  className="px-5 py-3 rounded-3xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black text-xs sm:text-sm shadow-kawaii-hover hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4 text-pastel-choco" />
                  <span>Chốt Bó Hoa Này Ngay! 🌸</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
