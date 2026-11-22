"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { CustomerReviewItem, initialReviews } from "@/data/reviewsStore";
import { sound } from "@/utils/sound";
import ImageUploadZone from "@/components/common/ImageUploadZone";
import { Star, Heart, Camera, Plus, X, Sparkles, ChevronLeft, ChevronRight, Check } from "lucide-react";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<CustomerReviewItem[]>(initialReviews);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [item, setItem] = useState("");
  const [comment, setComment] = useState("");
  const [stars, setStars] = useState(5);
  const [image, setImage] = useState("");
  const [selectedSticker, setSelectedSticker] = useState("🥰");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stickers = [
    { emoji: "🥰", label: "Xỉu up xỉu down" },
    { emoji: "💖", label: "Hạnh phúc" },
    { emoji: "🌸", label: "Vui sướng" },
    { emoji: "😲", label: "Bất ngờ" },
    { emoji: "✨", label: "Rạng rỡ" },
    { emoji: "🌱", label: "Cute mầm cây" },
  ];

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success && data.reviews) {
        setReviews(data.reviews);
      }
    } catch {
      // fallback to initial
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Pagination calculation
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert("Vui lòng nhập tên và cảm nhận của bạn nha! 🌸");
      return;
    }

    setIsSubmitting(true);
    sound.playPop();

    try {
      const currentStickerObj = stickers.find((s) => s.emoji === selectedSticker);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          item: item || "Bó hoa thủ công Anna Decor",
          comment,
          stars,
          sticker: selectedSticker,
          stickerLabel: currentStickerObj?.label || "Hạnh phúc",
          image: image || "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=600&q=80",
        }),
      });

      const data = await res.json();
      if (data.success) {
        sound.playSuccess();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#FFD6E0", "#FFB7B2", "#FFE699", "#C1F0DC"],
        });

        setIsModalOpen(false);
        setName("");
        setItem("");
        setComment("");
        setImage("");
        fetchReviews();
        setCurrentPage(1);
      }
    } catch {
      alert("Lỗi khi gửi đánh giá, bạn thử lại nhé!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const washiTapes = ["bg-pink-200/80", "bg-yellow-200/80", "bg-emerald-200/80", "bg-purple-200/80"];

  return (
    <section id="wall-of-love" className="py-16 md:py-24 bg-gradient-to-b from-[#FFF5F7] via-pastel-warmBg to-pastel-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pastel-pink/40 border border-pastel-pink text-xs font-bold text-pastel-choco">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Wall Of Love & Khoảnh Khắc</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-pastel-choco">
              Hơn 500+ Nụ Cười Hạnh Phúc
            </h2>
            <p className="text-sm text-pastel-subtext max-w-lg">
              Bảng lưu bút những đóa hoa thủ công trao tay các bạn học sinh, sinh viên và cặp đôi tại Đà Nẵng.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              setIsModalOpen(true);
            }}
            className="px-6 py-3.5 rounded-3xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black text-xs sm:text-sm shadow-kawaii-hover hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border-2 border-white shrink-0"
          >
            <Camera className="w-4 h-4 text-pastel-choco" />
            <span>Viết Cảm Nhận & Khoe Ảnh Hoa 🌸</span>
          </button>
        </div>

        {/* Polaroid Grid (Exactly 6 per page) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedReviews.map((rev, index) => {
            const rot = index % 3 === 0 ? "-rotate-1" : index % 3 === 1 ? "rotate-1" : "-rotate-2";
            const tapeColor = washiTapes[index % washiTapes.length];

            return (
              <div
                key={rev.id}
                className={`bg-white p-4 pt-6 pb-5 rounded-3xl border-2 border-pastel-pink/40 shadow-kawaii-sm hover:shadow-kawaii-hover hover:-translate-y-2 hover:rotate-0 transition-all duration-300 relative flex flex-col justify-between ${rot}`}
              >
                {/* Washi Tape on top */}
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 ${tapeColor} rounded-sm shadow-sm rotate-1 opacity-85 select-none`}
                />

                {/* Polaroid Photo */}
                <div className="space-y-3">
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                    <Image
                      src={rev.image || "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=600&q=80"}
                      alt={rev.item}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      unoptimized={Boolean(rev.image && rev.image.startsWith("data:"))}
                    />

                    {/* Sticker Emotion Pill */}
                    <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-black text-pastel-choco shadow-sm border border-pastel-pink flex items-center gap-1 select-none">
                      <span className="text-base">{rev.sticker}</span>
                      <span className="text-[10px]">{rev.stickerLabel || "Dễ thương"}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="font-bubble text-sm text-pastel-choco leading-relaxed italic">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>

                {/* Author & Item */}
                <div className="pt-3 border-t border-dashed border-pastel-pink/40 mt-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-black text-pastel-choco">{rev.name}</h4>
                    <span className="text-[11px] text-pastel-pinkDark font-semibold block">
                      {rev.item}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{rev.date}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                sound.playPop();
                setCurrentPage((p) => Math.max(1, p - 1));
              }}
              disabled={currentPage === 1}
              className="p-2.5 rounded-2xl bg-white border border-pastel-pink/60 text-pastel-choco hover:bg-pastel-pink/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              aria-label="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  sound.playPop();
                  setCurrentPage(page);
                }}
                className={`w-9 h-9 rounded-2xl text-xs font-black transition-all ${
                  currentPage === page
                    ? "bg-pastel-pinkDark text-white shadow-kawaii scale-105"
                    : "bg-white border border-pastel-pink/50 text-pastel-choco hover:bg-pastel-pink/20"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => {
                sound.playPop();
                setCurrentPage((p) => Math.min(totalPages, p + 1));
              }}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-2xl bg-white border border-pastel-pink/60 text-pastel-choco hover:bg-pastel-pink/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              aria-label="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* MODAL: VIẾT LƯU BÚT & KHOE ẢNH HOA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-5xl w-full max-w-lg max-h-[90vh] overflow-y-auto border-3 border-pastel-pink shadow-kawaii-hover p-6 sm:p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-pastel-pink/30 text-pastel-choco transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pastel-pink/40 text-pastel-choco text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Góc Lưu Bút Đáng Yêu</span>
              </div>
              <h3 className="text-2xl font-black text-pastel-choco">
                Khoe Bó Hoa & Cảm Nhận 🌸
              </h3>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-pastel-choco block mb-1">
                    Tên hoặc Biệt danh của bạn *:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Khánh Linh, Bé Mèo..."
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none text-pastel-choco"
                  />
                </div>

                <div>
                  <label className="font-bold text-pastel-choco block mb-1">
                    Mẫu hoa bạn đã nhận:
                  </label>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    placeholder="VD: Bó Tulip Pastel, Hoa Len..."
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none text-pastel-choco"
                  />
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="font-bold text-pastel-choco block mb-1">
                  Độ ưng ý của bạn:
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setStars(s);
                      }}
                      className="p-1 text-2xl hover:scale-110 transition-transform"
                    >
                      {s <= stars ? "⭐" : "☆"}
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-600 self-center ml-2">
                    {stars === 5 ? "Tuyệt vời ông mặt trời 5/5" : `${stars}/5 sao`}
                  </span>
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="font-bold text-pastel-choco block mb-1">
                  Lời nhắn gửi tiệm Anna Decor *:
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ khoảnh khắc vui sướng khi mở hộp hoa nha..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none text-pastel-choco leading-relaxed"
                />
              </div>

              {/* Image Upload Zone */}
              <ImageUploadZone
                value={image}
                onChange={setImage}
                label="Tải ảnh chụp bó hoa thực tế của bạn 📸:"
              />

              {/* Sticker Choice */}
              <div>
                <label className="font-bold text-pastel-choco block mb-1.5">
                  Chọn Sticker cảm xúc của bạn:
                </label>
                <div className="flex flex-wrap gap-2">
                  {stickers.map((stk) => (
                    <button
                      key={stk.emoji}
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setSelectedSticker(stk.emoji);
                      }}
                      className={`px-3 py-1.5 rounded-2xl border-2 transition-all flex items-center gap-1.5 text-xs font-bold ${
                        selectedSticker === stk.emoji
                          ? "border-pastel-pinkDark bg-pastel-pink/40 scale-105"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <span className="text-lg">{stk.emoji}</span>
                      <span>{stk.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-pastel-choco font-bold text-xs transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black text-xs shadow-kawaii-hover hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-pastel-choco" />
                  <span>{isSubmitting ? "Đang dán lưu bút..." : "Đăng Lên Bảng Lưu Bút 🌸"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
