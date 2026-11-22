"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { sound } from "@/utils/sound";
import { UploadCloud, X, Link as LinkIcon, Image as ImageIcon, Check } from "lucide-react";

interface ImageUploadZoneProps {
  value: string;
  onChange: (dataUrlOrUrl: string) => void;
  label?: string;
  aspectRatio?: "square" | "portrait" | "video";
}

export default function ImageUploadZone({
  value,
  onChange,
  label = "Hình ảnh sản phẩm *:",
  aspectRatio = "square",
}: ImageUploadZoneProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize and compress image client-side to keep Base64 lightweight
  const processFileToBase64 = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP)!");
      return;
    }

    setIsProcessing(true);
    sound.playPop();

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Scale to max 900x900 to keep Base64 size well under 300KB
        const maxDim = 900;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          onChange(dataUrl);
        }
        setIsProcessing(false);
        sound.playChime();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFileToBase64(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFileToBase64(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      sound.playPop();
      onChange(urlInput.trim());
    }
  };

  const handleClear = () => {
    sound.playPop();
    onChange("");
    setUrlInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-bold text-pastel-choco text-xs block">{label}</label>
        <div className="flex gap-1 text-[11px] bg-pastel-warmBg p-1 rounded-xl border border-pastel-pink/40">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeTab === "upload"
                ? "bg-pastel-pinkDark text-white shadow-sm"
                : "text-pastel-choco hover:text-pastel-pinkDark"
            }`}
          >
            📁 Tải ảnh từ máy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeTab === "url"
                ? "bg-pastel-pinkDark text-white shadow-sm"
                : "text-pastel-choco hover:text-pastel-pinkDark"
            }`}
          >
            🔗 Dán link URL
          </button>
        </div>
      </div>

      {value ? (
        /* Image Preview Box */
        <div className="relative rounded-3xl overflow-hidden border-2 border-pastel-pink/60 bg-pastel-warmBg p-2 flex items-center gap-3">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-pastel-pink/40 bg-white shrink-0 shadow-sm">
            <Image
              src={value}
              alt="Ảnh xem trước"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0 text-xs">
            <span className="font-black text-pastel-choco block flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Đã tải ảnh lên thành công!
            </span>
            <span className="text-[10px] text-pastel-subtext truncate block mt-0.5">
              {value.startsWith("data:") ? "Ảnh gốc từ thiết bị (Base64)" : value}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="mt-1.5 px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] flex items-center gap-1 border border-rose-200 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Xóa / Chọn lại ảnh khác</span>
            </button>
          </div>
        </div>
      ) : activeTab === "upload" ? (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-5 rounded-3xl border-2 border-dashed text-center cursor-pointer transition-all ${
            isDragging
              ? "border-pastel-pinkDark bg-pastel-pink/20 scale-102"
              : "border-pastel-pink/70 hover:border-pastel-pinkDark bg-pastel-warmBg/60 hover:bg-pastel-pink/10"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-12 h-12 mx-auto rounded-2xl bg-white flex items-center justify-center text-pastel-pinkDark shadow-sm mb-2 border border-pastel-pink/40">
            {isProcessing ? (
              <span className="text-xl animate-spin">🌱</span>
            ) : (
              <UploadCloud className="w-6 h-6 animate-wiggle-soft" />
            )}
          </div>

          <p className="text-xs font-bold text-pastel-choco">
            {isProcessing ? "Đang xử lý ảnh..." : "Kéo thả ảnh vào đây, hoặc click để chọn ảnh"}
          </p>
          <span className="text-[11px] text-pastel-subtext block mt-0.5">
            Hỗ trợ PNG, JPG, WEBP từ điện thoại & máy tính
          </span>

          <div className="mt-3">
            <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-pastel-pink/40 text-pastel-choco text-xs font-extrabold border border-pastel-pink">
              📁 Chọn ảnh từ thiết bị
            </span>
          </div>
        </div>
      ) : (
        /* URL Input Field */
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Dán link ảnh https://..."
            className="flex-1 px-3 py-2 rounded-xl border border-pastel-pink/60 text-xs focus:ring-2 focus:ring-pastel-pink outline-none"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 py-2 rounded-xl bg-pastel-pinkDark text-white font-bold text-xs hover:bg-rose-500 transition-colors"
          >
            Áp Dụng
          </button>
        </div>
      )}
    </div>
  );
}
