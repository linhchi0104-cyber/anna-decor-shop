"use client";

import { useState } from "react";
import { Order } from "@/types";
import { sound } from "@/utils/sound";
import { Search, X, Package, Clock, CheckCircle2, Phone, MapPin, Sparkles } from "lucide-react";

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderLookupModal({ isOpen, onClose }: OrderLookupModalProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundOrders, setFoundOrders] = useState<Order[] | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    sound.playPop();
    setIsSearching(true);
    setFoundOrders(null);

    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && data.orders) {
        const cleanQuery = query.trim().toLowerCase();
        const matches = data.orders.filter(
          (o: Order) =>
            o.phone.includes(cleanQuery) ||
            o.id.toLowerCase().includes(cleanQuery) ||
            o.customerName.toLowerCase().includes(cleanQuery)
        );
        setFoundOrders(matches);
        if (matches.length > 0) {
          sound.playChime();
        }
      }
    } catch {
      alert("Không thể tra cứu đơn lúc này. Bạn vui lòng nhắn Zalo 0763.679.601 nha!");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusInfo = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: "Tiệm đang chuẩn bị nguyên liệu",
          icon: "⏳",
          color: "text-amber-800 bg-amber-100 border-amber-300",
        };
      case "crafting":
        return {
          label: "Thợ đang uốn kẽm / đan len tỉ mỉ",
          icon: "🧶",
          color: "text-blue-800 bg-blue-100 border-blue-300",
        };
      case "ready":
        return {
          label: "Đã hoàn thành, đang chờ ship / chờ bạn ghé lấy",
          icon: "📦",
          color: "text-purple-800 bg-purple-100 border-purple-300",
        };
      case "completed":
        return {
          label: "Đã giao hoa thành công",
          icon: "🌸",
          color: "text-emerald-800 bg-emerald-100 border-emerald-300",
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-5xl w-full max-w-lg max-h-[90vh] overflow-y-auto border-3 border-pastel-pink shadow-kawaii-hover p-6 sm:p-8 relative">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-pastel-pink/30 text-pastel-choco transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pastel-pink/40 border border-pastel-pink text-xs font-bold text-pastel-choco">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Tra Cứu Tiến Độ Làm Hoa</span>
          </div>
          <h3 className="text-2xl font-black text-pastel-choco">
            Kiểm Tra Đơn Hoa Của Bạn
          </h3>
          <p className="text-xs text-pastel-subtext max-w-sm mx-auto">
            Nhập số điện thoại đặt hàng hoặc mã đơn (VD: 0905... hoặc ANNA-8901)
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-pastel-subtext absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập SĐT hoặc Mã đơn ANNA-xxxx..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none text-xs sm:text-sm text-pastel-choco"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black text-xs shadow-kawaii hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shrink-0"
          >
            {isSearching ? "Đang tìm..." : "Tra Cứu"}
          </button>
        </form>

        {/* Results */}
        {foundOrders !== null && (
          <div className="space-y-4">
            {foundOrders.length === 0 ? (
              <div className="text-center py-8 bg-pastel-warmBg rounded-3xl border border-pastel-pink/40 space-y-2">
                <span className="text-3xl">🌱</span>
                <p className="text-xs font-bold text-pastel-choco">
                  Chưa tìm thấy đơn hàng với thông tin &quot;{query}&quot;
                </p>
                <p className="text-[11px] text-pastel-subtext">
                  Bạn kiểm tra lại SĐT hoặc nhắn tin trực tiếp Zalo 0763.679.601 để tiệm kiểm tra ngay nha!
                </p>
              </div>
            ) : (
              foundOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 rounded-4xl bg-white border-2 border-pastel-pink shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-pastel-pink/30">
                      <div>
                        <span className="text-xs font-black text-pastel-pinkDark bg-pastel-pink/30 px-2.5 py-0.5 rounded-full">
                          {order.id}
                        </span>
                        <h4 className="font-black text-sm text-pastel-choco mt-1">
                          {order.customerName}
                        </h4>
                      </div>
                      <span className="text-sm font-black text-pastel-pinkDark">
                        {order.totalAmount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`p-2.5 rounded-2xl border flex items-center gap-2 text-xs font-bold ${statusInfo.color}`}
                    >
                      <span className="text-base">{statusInfo.icon}</span>
                      <span>{statusInfo.label}</span>
                    </div>

                    {/* Details */}
                    <div className="text-xs space-y-1 text-pastel-choco bg-pastel-warmBg p-3 rounded-2xl">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Hẹn nhận: <strong>{order.deliveryDate}</strong> ({order.deliveryTimeSlot})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-pastel-pinkDark" />
                        <span className="truncate">{order.address}</span>
                      </div>
                      <div className="pt-1 text-[11px] text-pastel-subtext">
                        Mẫu: {order.items.map((it) => `${it.name} (x${it.quantity})`).join(", ")}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
