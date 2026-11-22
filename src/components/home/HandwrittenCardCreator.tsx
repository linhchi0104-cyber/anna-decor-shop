"use client";

import { useState } from "react";
import { sound } from "@/utils/sound";
import { Sparkles, Copy, Check, Heart, Smile } from "lucide-react";

interface HandwrittenCardCreatorProps {
  onAttachToOrder?: (message: string) => void;
}

export default function HandwrittenCardCreator({ onAttachToOrder }: HandwrittenCardCreatorProps) {
  const [recipient, setRecipient] = useState("Gửi Crush Dễ Thương 🌸");
  const [sender, setSender] = useState("Người Luôn Ủng Hộ Bạn ✨");
  const [message, setMessage] = useState(
    "Chúc bạn một ngày tràn ngập niềm vui, lúc nào cũng cười thật tươi và rạng rỡ như những bông hoa hướng dương kẽm nhung của Anna Decor nha!"
  );
  const [selectedTheme, setSelectedTheme] = useState<"pink" | "kraft" | "mint" | "lavender">("pink");
  const [selectedStickers, setSelectedStickers] = useState<string[]>(["🌱", "💖", "✨"]);
  const [copied, setCopied] = useState(false);
  const [attached, setAttached] = useState(false);

  const presets = [
    {
      title: "Tỏ tình / Crush",
      text: "Từng cánh hoa kẽm nhung uốn tay này giống như tình cảm chân thành tớ dành cho cậu vậy. Mong cậu luôn hạnh phúc và mỉm cười nhé! 🌷",
    },
    {
      title: "Chúc thi tốt",
      text: "Gửi chút năng lượng mặt trời ấm áp đến bạn thân! Bình tĩnh, tự tin và làm bài điểm thật cao chót vót nha. You can do it! 🌻💯",
    },
    {
      title: "Sinh nhật",
      text: "Happy Birthday! Chúc bạn tuổi mới luôn xinh đẹp, ngọt ngào, đạt được mọi ước mơ và giữ trọn sự đáng yêu này nha! 🎂🎉",
    },
    {
      title: "Tri ân Thầy Cô",
      text: "Kính chúc Cô luôn mạnh khỏe, hạnh phúc và luôn tràn đầy nhiệt huyết dìu dắt bao thế hệ học trò nên người. Cảm ơn Cô thật nhiều! 💐",
    },
  ];

  const stickers = ["🌱", "🐰", "🧸", "🌻", "🌷", "💖", "✨", "🎀"];

  const themeStyles = {
    pink: {
      bg: "bg-[#FFF0F4]",
      border: "border-pink-300",
      tape: "bg-pink-300/80",
      text: "text-[#5C3D2E]",
    },
    kraft: {
      bg: "bg-[#F7EFE5]",
      border: "border-[#D4BBA5]",
      tape: "bg-[#D4BBA5]/80",
      text: "text-[#4A3B32]",
    },
    mint: {
      bg: "bg-[#EBFBF3]",
      border: "border-[#A7F3D0]",
      tape: "bg-[#A7F3D0]/80",
      text: "text-[#2D4A3E]",
    },
    lavender: {
      bg: "bg-[#F5EEFB]",
      border: "border-[#DDD6FE]",
      tape: "bg-[#DDD6FE]/80",
      text: "text-[#4A3258]",
    },
  };

  const handleToggleSticker = (stk: string) => {
    sound.playPop();
    if (selectedStickers.includes(stk)) {
      setSelectedStickers(selectedStickers.filter((s) => s !== stk));
    } else {
      if (selectedStickers.length < 5) {
        setSelectedStickers([...selectedStickers, stk]);
      }
    }
  };

  const handleCopy = () => {
    sound.playPop();
    const fullText = `💌 ${recipient}\n\n${message}\n\n-- ${sender} --`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAttach = () => {
    sound.playMagic();
    const fullText = `${recipient} - ${message} (Từ: ${sender})`;
    if (onAttachToOrder) {
      onAttachToOrder(fullText);
    }
    setAttached(true);
    setTimeout(() => setAttached(false), 2500);
  };

  return (
    <section id="card-creator" className="py-14 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pastel-lavender border border-purple-200 text-xs font-bold text-pastel-choco">
            <span>💌</span> Quà Tặng Đính Kèm
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-pastel-choco">
            Trình Tạo Thiệp Viết Tay Chibi
          </h2>
          <p className="text-sm sm:text-base text-pastel-subtext max-w-xl mx-auto">
            Gõ lời chúc ngọt ngào, Anna Decor sẽ chép tay nắn nót lên thiệp giấy thơm kute kèm sticker trang trí gắn vào bó hoa của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Controls & Form */}
          <div className="lg:col-span-6 space-y-5 bg-white p-6 sm:p-8 rounded-5xl border-2 border-pastel-pink/40 shadow-kawaii">
            {/* Quick Presets */}
            <div>
              <label className="text-xs font-bold text-pastel-choco block mb-2">
                Gợi ý lời chúc theo dịp:
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playPop();
                      setMessage(p.text);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-pastel-pink/25 hover:bg-pastel-pink/50 text-pastel-choco transition-all border border-pastel-pink/40"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-pastel-choco block mb-1">
                  Người nhận (Gửi đến):
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-pastel-pink/60 focus:outline-none focus:ring-2 focus:ring-pastel-pink text-sm text-pastel-choco"
                  placeholder="VD: Gửi Bé Mèo Dễ Thương..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-pastel-choco block mb-1">
                  Lời nhắn gửi gắm (tối đa 150 chữ):
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={250}
                  className="w-full px-4 py-2.5 rounded-2xl border border-pastel-pink/60 focus:outline-none focus:ring-2 focus:ring-pastel-pink text-sm text-pastel-choco leading-relaxed"
                  placeholder="Nhập tâm sự ngọt ngào của bạn..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-pastel-choco block mb-1">
                  Ký tên (Từ ai):
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-pastel-pink/60 focus:outline-none focus:ring-2 focus:ring-pastel-pink text-sm text-pastel-choco"
                  placeholder="VD: Từ một người thầm thích bạn"
                />
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="text-xs font-bold text-pastel-choco block mb-2">
                Màu sắc tấm thiệp:
              </label>
              <div className="flex gap-2">
                {(["pink", "kraft", "mint", "lavender"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      sound.playPop();
                      setSelectedTheme(t);
                    }}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-extrabold capitalize border-2 transition-all ${
                      selectedTheme === t
                        ? "border-pastel-pinkDark bg-pastel-pink/30 scale-105"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {t === "pink" ? "Hồng Phấn" : t === "kraft" ? "Kraft Retro" : t === "mint" ? "Xanh Mint" : "Lavender"}
                  </button>
                ))}
              </div>
            </div>

            {/* Chibi Stickers Selector */}
            <div>
              <label className="text-xs font-bold text-pastel-choco block mb-2 flex items-center justify-between">
                <span>Dán sticker Chibi trang trí:</span>
                <span className="text-[11px] text-pastel-subtext">Chọn tối đa 5 sticker</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {stickers.map((stk, i) => (
                  <button
                    key={i}
                    onClick={() => handleToggleSticker(stk)}
                    className={`w-9 h-9 rounded-2xl text-lg flex items-center justify-center border-2 transition-all ${
                      selectedStickers.includes(stk)
                        ? "border-pastel-pinkDark bg-pastel-pink/40 scale-110 shadow-sm"
                        : "border-gray-100 hover:border-pastel-pink/30 bg-white"
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Live Realistic Card Preview */}
          <div className="lg:col-span-6 sticky top-28 space-y-4">
            <div
              className={`p-8 sm:p-10 rounded-4xl border-3 shadow-kawaii relative transition-all duration-300 ${themeStyles[selectedTheme].bg} ${themeStyles[selectedTheme].border}`}
            >
              {/* Washi Tape Graphic Corners */}
              <div
                className={`absolute -top-3 left-8 w-16 h-6 rotate-[-4deg] rounded-sm shadow-sm opacity-80 ${themeStyles[selectedTheme].tape}`}
              />
              <div
                className={`absolute -top-3 right-8 w-16 h-6 rotate-[5deg] rounded-sm shadow-sm opacity-80 ${themeStyles[selectedTheme].tape}`}
              />

              {/* Stamp on Card */}
              <div className="absolute top-6 right-6 border-2 border-dashed border-rose-300 p-1.5 rounded-lg text-center rotate-6 select-none">
                <span className="text-xs block font-bold text-rose-400">ANNA DECOR</span>
                <span className="text-[9px] text-rose-300">HANDMADE WITH LOVE</span>
              </div>

              {/* Card Body with Handwritten Font Vibe */}
              <div className="space-y-4 pt-2">
                <div className="font-bubble text-lg sm:text-xl font-bold text-pastel-choco/90 flex items-center gap-1.5">
                  <span>💌</span>
                  <span>{recipient || "Gửi người thương..."}</span>
                </div>

                <p className="font-bubble text-base sm:text-lg leading-relaxed text-pastel-choco whitespace-pre-line min-h-[100px] border-l-2 border-dashed border-pastel-pink/60 pl-4 py-1">
                  &quot;{message || "Hãy gõ lời nhắn yêu thương ở bảng bên trái nha..."}&quot;
                </p>

                <div className="text-right font-bubble text-base sm:text-lg font-bold text-pastel-choco/90 pt-2">
                  -- {sender || "Người gửi ẩn danh"} --
                </div>
              </div>

              {/* Stickers Attached at Bottom */}
              <div className="mt-6 pt-4 border-t border-dashed border-gray-300 flex items-center justify-between">
                <div className="flex items-center gap-2 text-2xl animate-wiggle-soft">
                  {selectedStickers.map((stk, i) => (
                    <span key={i} className="filter drop-shadow-sm inline-block">
                      {stk}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-pastel-subtext">
                  Kèm thiệp miễn phí 100%
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 py-3 rounded-2xl bg-white hover:bg-gray-50 border border-pastel-pink text-pastel-choco font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Đã sao chép thiệp!" : "Sao chép lời nhắn"}</span>
              </button>

              <button
                onClick={handleAttach}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black text-xs shadow-kawaii-hover hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                {attached ? <Check className="w-4 h-4 text-emerald-800" /> : <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />}
                <span>{attached ? "Đã đính kèm đơn hoa!" : "Gắn vào đơn hoa này 🌸"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
