"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { sound } from "@/utils/sound";
import {
  Wand2,
  Eraser,
  RotateCcw,
  Upload,
  Check,
  Sparkles,
  Eye,
  Sliders,
  Scissors,
  HelpCircle,
} from "lucide-react";

interface FlowerBackgroundRemoverProps {
  onSaveStem: (stemData: {
    name: string;
    flowerType: "kem-nhung" | "moc-len";
    price: number;
    color: string;
    colorHex: string;
    meaning: string;
    imageUrl: string;
  }) => Promise<void>;
}

export default function FlowerBackgroundRemover({ onSaveStem }: FlowerBackgroundRemoverProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [flowerType, setFlowerType] = useState<"kem-nhung" | "moc-len">("kem-nhung");
  const [price, setPrice] = useState(25000);
  const [color, setColor] = useState("Hồng Phấn");
  const [colorHex, setColorHex] = useState("#FFB7B2");
  const [meaning, setMeaning] = useState("Tình cảm chân thành, lời nhắn ngọt ngào");

  const [tolerance, setTolerance] = useState<number>(35); // 0-100 threshold
  const [toolMode, setToolMode] = useState<"magic" | "eraser">("magic");
  const [eraserSize, setEraserSize] = useState<number>(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasRemovedBg, setHasRemovedBg] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const isDrawingRef = useRef(false);

  // Load uploaded image onto Canvas
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playPop();
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImageSrc(dataUrl);
      setHasRemovedBg(false);

      const img = new window.Image();
      img.onload = () => {
        originalImageRef.current = img;
        drawInitialImage(img);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const drawInitialImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Constrain max canvas size for smooth processing
    const maxDim = 500;
    let width = img.width;
    let height = img.height;
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
  };

  // Magic Wand Auto Remove Background from clicked point
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (toolMode !== "magic") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const startIndex = (y * canvas.width + x) * 4;

    const targetR = data[startIndex];
    const targetG = data[startIndex + 1];
    const targetB = data[startIndex + 2];
    const targetA = data[startIndex + 3];

    if (targetA === 0) return; // already transparent

    sound.playMagic();
    setIsProcessing(true);

    setTimeout(() => {
      // Color distance remover
      const tolDist = (tolerance / 100) * 255;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dist = Math.sqrt(
          (r - targetR) ** 2 + (g - targetG) ** 2 + (b - targetB) ** 2
        );
        if (dist <= tolDist) {
          data[i + 3] = 0; // Transparent!
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setHasRemovedBg(true);
      setIsProcessing(false);
    }, 50);
  };

  // 1-Click Auto Remove Light/White Background (corners detection)
  const handleAutoRemoveLightBg = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    sound.playMagic();
    setIsProcessing(true);

    setTimeout(() => {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample 4 corners average color
      const sampleIndices = [
        0, // top-left
        (canvas.width - 1) * 4, // top-right
        ((canvas.height - 1) * canvas.width) * 4, // bottom-left
        ((canvas.height - 1) * canvas.width + canvas.width - 1) * 4, // bottom-right
      ];

      let avgR = 0, avgG = 0, avgB = 0;
      sampleIndices.forEach((idx) => {
        avgR += data[idx];
        avgG += data[idx + 1];
        avgB += data[idx + 2];
      });
      avgR /= 4;
      avgG /= 4;
      avgB /= 4;

      const tolDist = (tolerance / 100) * 255;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dist = Math.sqrt(
          (r - avgR) ** 2 + (g - avgG) ** 2 + (b - avgB) ** 2
        );
        if (dist <= tolDist) {
          data[i + 3] = 0; // Transparent
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setHasRemovedBg(true);
      setIsProcessing(false);
    }, 50);
  };

  // Manual Eraser Brush
  const startEraser = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (toolMode !== "eraser") return;
    isDrawingRef.current = true;
    eraseAt(e);
  };

  const drawEraser = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || toolMode !== "eraser") return;
    eraseAt(e);
  };

  const stopEraser = () => {
    isDrawingRef.current = false;
  };

  const eraseAt = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, eraserSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    setHasRemovedBg(true);
  };

  // Reset to original image
  const handleResetImage = () => {
    if (!originalImageRef.current) return;
    sound.playPop();
    drawInitialImage(originalImageRef.current);
    setHasRemovedBg(false);
  };

  // Save Stem into Studio
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập tên cành hoa bạn nhé! 🌸");
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      alert("Vui lòng tải ảnh hoa và xóa phông trước khi lưu nha!");
      return;
    }

    sound.playMagic();
    setIsSaving(true);
    try {
      const transparentDataUrl = canvas.toDataURL("image/png");
      await onSaveStem({
        name,
        flowerType,
        price,
        color,
        colorHex,
        meaning,
        imageUrl: transparentDataUrl,
      });

      // Reset form
      setName("");
      setImageSrc(null);
      setHasRemovedBg(false);
    } catch {
      alert("Lỗi khi lưu cành hoa vào Studio");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-5xl border-2 border-pastel-pink/50 p-6 sm:p-8 shadow-kawaii space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pastel-pink/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-pink/40 border border-pastel-pink text-xs font-bold text-pastel-choco mb-1">
            <Scissors className="w-3.5 h-3.5 text-pastel-pinkDark" />
            <span>Studio Tách Nền & Quản Lý Cành Hoa</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-pastel-choco">
            Xóa Phông Hoa & Nạp Vào Studio Tự Bó
          </h2>
          <p className="text-xs text-pastel-subtext">
            Chụp ảnh mặt hoa thật (kẽm nhung, hoa len) → Tẩy nền trong suốt → Đưa vào Studio cho khách cắm góc nghiêng 70°!
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <label className="cursor-pointer px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black text-xs shadow-sm hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Tải Ảnh Mặt Hoa Mới</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: CANVAS WORKSPACE & REMOVAL TOOLS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-pastel-warmBg p-3 rounded-2xl border border-pastel-pink/40">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setToolMode("magic");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  toolMode === "magic"
                    ? "bg-pastel-pinkDark text-white shadow-sm"
                    : "bg-white text-pastel-choco border border-gray-200"
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Đũa Thần (Click Xóa Nền)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setToolMode("eraser");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  toolMode === "eraser"
                    ? "bg-pastel-pinkDark text-white shadow-sm"
                    : "bg-white text-pastel-choco border border-gray-200"
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Cọ Tẩy Rìa Thừa</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetImage}
              disabled={!imageSrc}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1 disabled:opacity-40"
              title="Khôi phục lại ảnh gốc"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục</span>
            </button>
          </div>

          {/* Quick Tolerance & 1-Click Auto Clean Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <span className="font-bold text-pastel-choco shrink-0">Độ nhạy xóa:</span>
              <input
                type="range"
                min="10"
                max="80"
                value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="w-full accent-pastel-pinkDark"
              />
              <span className="font-black text-pastel-pinkDark w-8">{tolerance}%</span>
            </div>

            {toolMode === "eraser" ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-pastel-choco">Cỡ cọ:</span>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={eraserSize}
                  onChange={(e) => setEraserSize(Number(e.target.value))}
                  className="w-24 accent-pastel-pinkDark"
                />
                <span className="font-bold">{eraserSize}px</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAutoRemoveLightBg}
                disabled={!imageSrc || isProcessing}
                className="px-3 py-1.5 rounded-xl bg-pastel-butter hover:bg-pastel-yellowGold text-pastel-choco font-black border border-amber-300 shadow-sm flex items-center gap-1 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Tự Động Xóa Nền Trắng / Sáng</span>
              </button>
            )}
          </div>

          {/* Canvas Board (Transparent Checkerboard Pattern) */}
          <div
            className="relative w-full h-[360px] sm:h-[400px] rounded-3xl border-2 border-dashed border-pastel-pink flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          >
            {imageSrc ? (
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseDown={startEraser}
                onMouseMove={drawEraser}
                onMouseUp={stopEraser}
                onMouseLeave={stopEraser}
                className={`max-w-full max-h-full object-contain ${
                  toolMode === "magic" ? "cursor-crosshair" : "cursor-cell"
                }`}
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-pastel-pink/30 flex items-center justify-center text-2xl">
                  🌸
                </div>
                <h4 className="font-bold text-sm text-pastel-choco">Chưa Có Ảnh Mặt Hoa Nào</h4>
                <p className="text-xs text-pastel-subtext max-w-xs">
                  Hãy bấm nút &quot;Tải Ảnh Mặt Hoa Mới&quot; ở trên (ảnh chụp mặt hoa không cành) để bắt đầu tách phông nhé!
                </p>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center text-xs font-bold text-pastel-choco">
                <span className="animate-spin mr-2">🌸</span> Đang tách phông trong suốt...
              </div>
            )}
          </div>

          <div className="text-[11px] text-pastel-subtext italic bg-pastel-pink/15 p-2.5 rounded-2xl border border-pastel-pink/30">
            💡 <strong>Hướng dẫn:</strong> Bật chế độ <strong>Đũa Thần</strong> và click thẳng vào nền ảnh để xóa phông tự động. Dùng thêm <strong>Cọ Tẩy</strong> để xóa sạch các chi tiết rìa nếu muốn!
          </div>
        </div>

        {/* RIGHT: STEM DETAILS FORM & 70° ANGLE PREVIEW */}
        <div className="lg:col-span-5 space-y-5">
          {/* Mini 70° Angle Preview Box */}
          <div className="bg-gradient-to-b from-[#FFF5F8] to-[#FFE0E9] p-4 rounded-3xl border border-pastel-pink/60 text-center relative overflow-hidden">
            <span className="text-[10px] font-black uppercase text-pastel-pinkDark block mb-1">
              Xem Trước Mặt Hoa Trên Bó Nghiêng 70°
            </span>
            <div
              className="relative w-full h-36 flex items-center justify-center"
              style={{ perspective: 600 }}
            >
              {/* Mini Wrapping Cone */}
              <div
                className="absolute bottom-0 w-40 h-24 rounded-b-4xl opacity-90 shadow-md flex items-end justify-center pb-2 z-10"
                style={{
                  backgroundColor: colorHex,
                  clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)",
                }}
              >
                <span className="text-[9px] font-bold text-white bg-black/30 px-2 py-0.5 rounded-full">
                  Giấy phối {color}
                </span>
              </div>

              {/* Cut-out Flower Face preview tilted 70° */}
              <div
                className="relative z-20 transition-transform duration-300"
                style={{
                  transform: "rotateX(20deg) scale(0.9)",
                }}
              >
                {imageSrc && canvasRef.current ? (
                  <div className="w-20 h-20 filter drop-shadow-lg flex items-center justify-center">
                    <img
                      src={canvasRef.current.toDataURL()}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-4xl filter drop-shadow">🌸</span>
                )}
              </div>
            </div>
            <p className="text-[10px] text-pastel-subtext mt-1">
              Mặt hoa khi tách phông sẽ xếp gọn gàng vào Studio &quot;Tự Bó Hoa Tặng Crush&quot;
            </p>
          </div>

          {/* Form to submit stem */}
          <form onSubmit={handleSave} className="space-y-3.5 text-xs text-pastel-choco">
            <div>
              <label className="font-bold block mb-1">Tên cành hoa thủ công *:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Cành Mẫu Đơn Đỏ Kẽm Nhung"
                className="w-full px-3.5 py-2 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none font-bold text-pastel-choco"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold block mb-1">Loại chất liệu:</label>
                <select
                  value={flowerType}
                  onChange={(e) => setFlowerType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none font-semibold text-pastel-choco"
                >
                  <option value="kem-nhung">Hoa Kẽm Nhung</option>
                  <option value="moc-len">Hoa Móc Len Vintage</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Giá bán / cành (VNĐ) *:</label>
                <input
                  type="number"
                  required
                  step={1000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none font-black text-pastel-pinkDark"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold block mb-1">Tên tone màu:</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="VD: Hồng Baby"
                  className="w-full px-3 py-2 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Mã màu đại diện:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-10 h-8 rounded-xl border border-gray-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-2xl border border-pastel-pink/60 uppercase font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Ý nghĩa cành hoa:</label>
              <input
                type="text"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="VD: Lời tỏ tình ngọt ngào, may mắn..."
                className="w-full px-3.5 py-2 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving || !imageSrc}
              className="w-full py-3.5 rounded-3xl bg-gradient-to-r from-pastel-pink to-pastel-rose hover:opacity-95 text-pastel-choco font-black text-xs sm:text-sm shadow-kawaii-hover hover:scale-102 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-700" />
              <span>{isSaving ? "Đang lưu..." : "Lưu Cành Hoa Vào Studio Tự Bó Ngay 🌸"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
