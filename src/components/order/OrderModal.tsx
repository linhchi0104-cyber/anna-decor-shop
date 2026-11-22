"use client";

import { useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Product, CustomBouquet, OrderItem } from "@/types";
import { sound } from "@/utils/sound";
import { SHOP_INFO, DEFAULT_BANK_CONFIG } from "@/data/products";
import {
  X,
  Sparkles,
  Clock,
  MapPin,
  Heart,
  QrCode,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  customBouquet?: CustomBouquet | null;
  attachedCardMessage?: string;
}

type PaymentMethodType = "deposit_20" | "deposit_30" | "deposit_50" | "deposit_100" | "cod";

const VIETNAM_PROVINCES = [
  "Đà Nẵng",
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Hải Phòng",
  "Cần Thơ",
  "Thừa Thiên Huế",
  "Quảng Nam",
  "Quảng Ngãi",
  "Bình Định",
  "Khánh Hòa",
  "Lâm Đồng",
  "Đắk Lắk",
  "Bình Dương",
  "Đồng Nai",
  "Bà Rịa - Vũng Tàu",
  "Nghệ An",
  "Thanh Hóa",
  "Quảng Ninh",
  "Bắc Ninh",
  "Hải Dương",
  "Thái Nguyên",
  "Vĩnh Phúc",
  "Nam Định",
  "Thái Bình",
  "Tỉnh khác (Toàn quốc)",
];

export default function OrderModal({
  isOpen,
  onClose,
  product,
  customBouquet,
  attachedCardMessage = "",
}: OrderModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [deliveryCity, setDeliveryCity] = useState("Đà Nẵng");
  const [detailedAddress, setDetailedAddress] = useState("");
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [deliveryDate, setDeliveryDate] = useState(tomorrowStr);
  const [deliveryTime, setDeliveryTime] = useState("09:00");
  const [cardMessage, setCardMessage] = useState(
    attachedCardMessage || (customBouquet ? customBouquet.cardMessage : "")
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("deposit_50");
  const [note, setNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ id: string; depositAmount: number } | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);

  if (!isOpen) return null;

  // Determine items and total price
  let orderItems: OrderItem[] = [];
  let totalAmount = 0;

  if (customBouquet) {
    const stemsDesc = customBouquet.stems.map((s) => `${s.quantity}x ${s.stem.name}`).join(", ");
    orderItems = [
      {
        id: "custom-diy-bouquet",
        name: `Bó Hoa Tự Phối DIY (${customBouquet.stems.reduce((a, b) => a + b.quantity, 0)} cành)`,
        price: customBouquet.totalPrice,
        quantity: 1,
        type: "custom_bouquet",
        details: `Mặt hoa: ${stemsDesc} | Giấy: ${customBouquet.wrap.name} | Nơ: ${customBouquet.ribbon.name}${
          customBouquet.accessories.length > 0
            ? ` | Phụ kiện: ${customBouquet.accessories.map((a) => a.name).join(", ")}`
            : ""
        }`,
      },
    ];
    totalAmount = customBouquet.totalPrice;
  } else if (product) {
    orderItems = [
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        type: "standard",
      },
    ];
    totalAmount = product.price;
  }

  // Calculate deposit required
  let depositAmount = 0;
  if (paymentMethod === "deposit_20") {
    depositAmount = Math.round(totalAmount * 0.2);
  } else if (paymentMethod === "deposit_30") {
    depositAmount = Math.round(totalAmount * 0.3);
  } else if (paymentMethod === "deposit_50") {
    depositAmount = Math.round(totalAmount * 0.5);
  } else if (paymentMethod === "deposit_100") {
    depositAmount = totalAmount;
  } else {
    depositAmount = 0;
  }

  const depositOptions = [
    {
      key: "deposit_20",
      name: "Cọc 20%",
      badge: "20%",
      desc: "Giữ chỗ làm hoa",
      amount: Math.round(totalAmount * 0.2),
    },
    {
      key: "deposit_30",
      name: "Cọc 30%",
      badge: "30%",
      desc: "Cọc tiêu chuẩn",
      amount: Math.round(totalAmount * 0.3),
    },
    {
      key: "deposit_50",
      name: "Cọc 50%",
      badge: "50% Khuyên dùng",
      desc: "Ưu tiên uốn trước",
      amount: Math.round(totalAmount * 0.5),
    },
    {
      key: "deposit_100",
      name: "Trả đủ 100%",
      badge: "100%",
      desc: "Chuyển khoản VietQR",
      amount: totalAmount,
    },
    {
      key: "cod",
      name: "Ship COD / Shop",
      badge: "COD 0đ Cọc",
      desc: "Nhận hoa thanh toán",
      amount: 0,
    },
  ];

  // Confetti Petals & Hearts Celebration
  const triggerKawaiiConfetti = () => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 65,
      origin: { x: 0.1, y: 0.6 },
      colors: ["#FFD6E0", "#FFB7B2", "#FFF3B0", "#C1F0DC", "#FF8EAA"],
      scalar: 1.2,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 65,
      origin: { x: 0.9, y: 0.6 },
      colors: ["#FFD6E0", "#FFB7B2", "#FFE699", "#E8D7F1", "#FF8EAA"],
      scalar: 1.2,
    });
  };

  const fullAddress =
    deliveryType === "pickup"
      ? "Ghé lấy tại tiệm: K317/23 Nguyễn Phước Nguyên, P. An Khê, Q. Thanh Khê, TP. Đà Nẵng"
      : `${detailedAddress ? `${detailedAddress.trim()}, ` : ""}${deliveryCity}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) {
      alert("Vui lòng điền Họ tên và Số điện thoại bạn nhé! 🌸");
      return;
    }

    if (deliveryType === "delivery" && !detailedAddress.trim()) {
      alert("Vui lòng nhập địa chỉ giao hoa chi tiết (số nhà, đường, quận/huyện) bạn nhé! 🛵");
      return;
    }

    if (deliveryTime < "06:00" || deliveryTime > "21:00") {
      alert("Khung giờ nhận hoa của tiệm từ 06:00 đến 21:00. Bạn vui lòng chọn giờ trong khoảng này nhé! ⏰");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          address: fullAddress,
          deliveryType,
          deliveryDate,
          deliveryTimeSlot: `${deliveryTime} (Khung 06:00 - 21:00)`,
          cardMessage,
          items: orderItems,
          totalAmount,
          depositAmount,
          paymentMethod,
          paymentStatus: depositAmount > 0 ? "unpaid" : "unpaid",
          note,
        }),
      });

      const data = await res.json();
      if (data.success) {
        sound.playSuccess();
        triggerKawaiiConfetti();
        setOrderSuccess({ id: data.order.id, depositAmount });
      } else {
        alert("Có chút lỗi khi tạo đơn. Bạn vui lòng thử lại hoặc nhắn Zalo 0763.679.601 nhé!");
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối. Bạn liên hệ trực tiếp Zalo 0763.679.601 nha!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyBank = (text: string) => {
    sound.playPop();
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleResetAndClose = () => {
    sound.playPop();
    setOrderSuccess(null);
    onClose();
  };

  // Generate VietQR Link
  const transferAmount = orderSuccess?.depositAmount || depositAmount;
  const transferContent = orderSuccess ? orderSuccess.id : "ANNA DECOR";
  const vietQrUrl = `https://img.vietqr.io/image/${DEFAULT_BANK_CONFIG.bankName}-${DEFAULT_BANK_CONFIG.accountNumber}-compact2.png?amount=${transferAmount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(DEFAULT_BANK_CONFIG.accountHolder)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-5xl w-full max-w-xl max-h-[92vh] overflow-y-auto border-3 border-pastel-pink shadow-kawaii-hover p-6 sm:p-8 relative">
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-pastel-pink/30 text-pastel-choco transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {orderSuccess ? (
          /* SUCCESS SCREEN WITH VIETQR PAYMENT */
          <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-pastel-mint flex items-center justify-center text-3xl shadow-kawaii animate-bounce">
              🌸
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-pastel-choco">
                Đặt Hoa Thành Công Rồi Nè!
              </h3>
              <p className="text-xs sm:text-sm text-pastel-subtext">
                Mã đơn hàng:{" "}
                <strong className="text-pastel-pinkDark font-black text-base">
                  {orderSuccess.id}
                </strong>
              </p>
            </div>

            {/* VIETQR TRANSFER CARD IF DEPOSIT OR BANKING */}
            {orderSuccess.depositAmount > 0 ? (
              <div className="p-4 sm:p-5 rounded-4xl bg-gradient-to-b from-white to-pastel-warmBg border-2 border-dashed border-pastel-pink text-left space-y-3 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-pastel-pink/40">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-pastel-pinkDark" />
                    <span className="font-extrabold text-xs sm:text-sm text-pastel-choco">
                      Mã Quét VietQR Thanh Toán / Cọc
                    </span>
                  </div>
                  <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                    {orderSuccess.depositAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* QR Image */}
                  <div className="relative w-44 h-44 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm shrink-0">
                    <Image
                      src={vietQrUrl}
                      alt="VietQR Chuyển khoản"
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>

                  {/* Bank Transfer Details */}
                  <div className="space-y-2 text-xs text-pastel-choco flex-1 w-full">
                    <div>
                      <span className="text-gray-400 block">Ngân hàng:</span>
                      <strong>{DEFAULT_BANK_CONFIG.bankName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Số tài khoản:</span>
                      <div className="flex items-center justify-between bg-white p-1.5 rounded-xl border border-gray-200">
                        <strong className="text-sm tracking-wider text-pastel-pinkDark">
                          {DEFAULT_BANK_CONFIG.accountNumber}
                        </strong>
                        <button
                          onClick={() => handleCopyBank(DEFAULT_BANK_CONFIG.accountNumber)}
                          className="text-[11px] font-bold text-pastel-choco hover:text-pastel-pinkDark flex items-center gap-0.5"
                        >
                          {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedBank ? "Đã copy" : "Copy"}</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Chủ tài khoản:</span>
                      <strong>{DEFAULT_BANK_CONFIG.accountHolder}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Nội dung chuyển khoản:</span>
                      <strong className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-black">
                        {orderSuccess.id}
                      </strong>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-pastel-choco/80 italic bg-pastel-pink/20 p-2.5 rounded-2xl border border-pastel-pink/40">
                  📸 <strong>Mẹo nhỏ:</strong> Bạn hãy <strong>chụp ảnh màn hình mã QR</strong> này để thanh toán hoặc gửi cho bạn bè, người thân quét mã nhé. Sau khi chuyển, bạn gửi ảnh bill qua Zalo <strong>0763.679.601</strong> để tiệm uốn hoa ngay nha!
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-3xl bg-pastel-mint/30 border border-pastel-mintDark text-left space-y-1 text-xs text-pastel-choco">
                <p className="font-bold">📦 Đơn hàng hình thức: Nhận hoa thanh toán (COD / Tại Shop)</p>
                <p className="text-pastel-subtext">Tiệm sẽ liên hệ số điện thoại {phone} để xác nhận và chuẩn bị hoa cho bạn nhé!</p>
              </div>
            )}

            {/* Receipt Summary Card */}
            <div className="bg-pastel-warmBg p-4 rounded-3xl border border-pastel-pink/60 text-left space-y-1.5 text-xs text-pastel-choco">
              <div className="font-extrabold pb-1.5 border-b border-pastel-pink/40 flex justify-between">
                <span>Khách hàng: {customerName}</span>
                <span className="text-pastel-pinkDark font-black">
                  Tổng: {totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <p>📞 <strong>SĐT / Zalo:</strong> {phone}</p>
              <p>📍 <strong>Địa chỉ nhận:</strong> {fullAddress}</p>
              <p>⏰ <strong>Hẹn ngày & giờ:</strong> {deliveryDate} lúc {deliveryTime} (06:00 - 21:00)</p>
              {cardMessage && (
                <p className="italic text-pastel-pinkDark">
                  💌 &quot;{cardMessage}&quot;
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={SHOP_INFO.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playPop()}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#0068FF] to-[#0091FF] text-white font-black text-xs text-center shadow-md hover:opacity-95 transition-all"
              >
                Nhắn Zalo Tiệm (0763.679.601) 💬
              </a>
              <button
                onClick={handleResetAndClose}
                className="flex-1 py-3.5 rounded-2xl bg-pastel-pink/40 hover:bg-pastel-pink text-pastel-choco font-black text-xs transition-all"
              >
                Xong & Tiếp Tục Xem Hoa 🌸
              </button>
            </div>
          </div>
        ) : (
          /* ORDER FORM */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pastel-pink/40 text-pastel-choco text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Chốt Đơn Hoa Thủ Công</span>
              </div>
              <h3 className="text-2xl font-black text-pastel-choco">
                Gói Ghém Yêu Thương
              </h3>
            </div>

            {/* Selected Item Summary */}
            <div className="p-3 rounded-3xl bg-pastel-warmBg border border-pastel-pink/60 flex items-center justify-between text-xs text-pastel-choco">
              <div>
                <span className="font-bold block text-sm">{orderItems[0]?.name || "Mẫu hoa đã chọn"}</span>
                {orderItems[0]?.details && (
                  <p className="text-[11px] text-pastel-subtext line-clamp-1">{orderItems[0].details}</p>
                )}
              </div>
              <span className="text-base font-black text-pastel-pinkDark shrink-0">
                {totalAmount.toLocaleString("vi-VN")}đ
              </span>
            </div>

            {/* Crafting Time reminder */}
            <div className="p-2.5 rounded-2xl bg-pastel-butter/60 border border-amber-300 text-xs text-pastel-choco flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Nhắc nhở nhẹ:</strong> Hoa kẽm nhung & hoa len được thợ uốn tay 100% nên tiệm cần <strong>1-2 ngày</strong> để hoàn thành đẹp nhất ạ.
              </p>
            </div>

            {/* Inputs Form */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-pastel-choco block mb-1">
                    Họ & Tên khách hàng *:
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="VD: Nguyễn Hải Yến"
                    className="w-full px-4 py-2.5 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none text-pastel-choco"
                  />
                </div>
                <div>
                  <label className="font-bold text-pastel-choco block mb-1">
                    Số điện thoại / Zalo *:
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="VD: 0905.xxx.xxx"
                    className="w-full px-4 py-2.5 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none text-pastel-choco"
                  />
                </div>
              </div>

              {/* Delivery Type (Toàn Quốc vs Nhận tại Shop) */}
              <div>
                <label className="font-bold text-pastel-choco block mb-1">
                  Hình thức nhận hoa:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setDeliveryType("delivery");
                    }}
                    className={`py-2 px-3 rounded-2xl font-bold text-xs border-2 transition-all flex items-center justify-center gap-1.5 ${
                      deliveryType === "delivery"
                        ? "border-pastel-pinkDark bg-pastel-pink/30 text-pastel-choco shadow-sm"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <span>🛵 Giao hoa toàn quốc</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setDeliveryType("pickup");
                    }}
                    className={`py-2 px-3 rounded-2xl font-bold text-xs border-2 transition-all flex items-center justify-center gap-1.5 ${
                      deliveryType === "pickup"
                        ? "border-pastel-pinkDark bg-pastel-pink/30 text-pastel-choco shadow-sm"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <span>🏪 Ghé nhận tại shop</span>
                  </button>
                </div>
              </div>

              {/* Address Section */}
              {deliveryType === "delivery" ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-1">
                      <label className="font-bold text-pastel-choco block mb-1 text-xs">
                        Tỉnh / Thành phố:
                      </label>
                      <select
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none text-pastel-choco text-xs font-semibold"
                      >
                        {VIETNAM_PROVINCES.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-bold text-pastel-choco block mb-1 text-xs">
                        Địa chỉ chi tiết (số nhà, đường, quận/huyện) *:
                      </label>
                      <input
                        type="text"
                        required
                        value={detailedAddress}
                        onChange={(e) => setDetailedAddress(e.target.value)}
                        placeholder="VD: 54 Nguyễn Lương Bằng, Hòa Khánh Bắc, Liên Chiểu..."
                        className="w-full px-4 py-2 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none text-pastel-choco text-xs"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-pastel-subtext italic">
                    🚚 Tiệm hỗ trợ đóng gói chống sốc và gửi bưu điện / hỏa tốc tới mọi tỉnh thành trên cả nước.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-pastel-warmBg text-xs text-pastel-choco border border-pastel-pink/50 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-pastel-pinkDark shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Địa chỉ shop nhận hoa:</span>
                    <strong className="text-pastel-pinkDark">K317/23 Nguyễn Phước Nguyên, P. An Khê, Q. Thanh Khê, TP. Đà Nẵng</strong>
                    <span className="block text-[11px] text-pastel-subtext mt-0.5">Hotline/Zalo: 0763.679.601 (Bạn ghé tiệm nhận hoa kiểm tra thoải mái nha)</span>
                  </div>
                </div>
              )}

              {/* Delivery Date & Exact Time (06:00 - 21:00) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-pastel-choco block mb-1">
                    Ngày cần nhận hoa *:
                  </label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none text-pastel-choco text-xs sm:text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-pastel-choco block mb-1 flex items-center justify-between">
                    <span>Giờ nhận (06:00 - 21:00) *:</span>
                    <span className="text-[10px] text-pastel-pinkDark font-bold">Chính xác giờ & phút</span>
                  </label>
                  <input
                    type="time"
                    required
                    min="06:00"
                    max="21:00"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none text-pastel-choco text-xs sm:text-sm font-bold"
                  />
                  <span className="text-[10px] text-pastel-subtext mt-1 block">
                    ⏰ Khung giờ phục vụ: 06:00 sáng đến 21:00 tối mỗi ngày
                  </span>
                </div>
              </div>

              {/* Card message */}
              <div>
                <label className="font-bold text-pastel-choco block mb-1">
                  Lời nhắn viết thiệp kèm theo (miễn phí):
                </label>
                <input
                  type="text"
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  placeholder="Ghi lời nhắn chúc mừng, tỏ tình, kỷ niệm..."
                  className="w-full px-4 py-2 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none text-pastel-choco"
                />
              </div>

              {/* Payment Methods - Scrollable Selector (Thanh Cuộn Ngang) */}
              <div>
                <label className="font-bold text-pastel-choco block mb-1.5 flex items-center justify-between">
                  <span>Gói đặt hàng & phương thức cọc:</span>
                  <span className="text-[11px] text-pastel-pinkDark font-black">
                    {depositAmount > 0
                      ? `Cần chuyển cọc: ${depositAmount.toLocaleString("vi-VN")}đ`
                      : "Không cần cọc trước"}
                  </span>
                </label>

                {/* Horizontal Scroll Bar for Deposit Options */}
                <div className="overflow-x-auto pb-2 -mx-1 px-1 flex items-stretch gap-2.5 scrollbar-thin scroll-smooth snap-x">
                  {depositOptions.map((opt) => {
                    const isSelected = paymentMethod === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          sound.playPop();
                          setPaymentMethod(opt.key as PaymentMethodType);
                        }}
                        className={`snap-start shrink-0 w-36 sm:w-40 p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-pastel-pinkDark bg-pastel-pink/30 text-pastel-choco shadow-sm ring-2 ring-pastel-pink/40"
                            : "border-gray-200 bg-white hover:border-pastel-pink/40"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? "bg-pastel-pinkDark text-white"
                                  : "bg-pastel-warmBg text-pastel-choco border border-pastel-pink/30"
                              }`}
                            >
                              {opt.badge}
                            </span>
                          </div>
                          <div className="font-extrabold text-xs text-pastel-choco line-clamp-1">
                            {opt.name}
                          </div>
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-pastel-pink/20">
                          <div className="text-xs font-black text-pastel-pinkDark">
                            {opt.amount > 0
                              ? `${opt.amount.toLocaleString("vi-VN")}đ`
                              : "Trả khi nhận"}
                          </div>
                          <div className="text-[10px] text-pastel-subtext leading-tight mt-0.5">
                            {opt.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[10px] text-pastel-subtext mt-1 px-1">
                  <span>👉 Cuộn ngang để chọn gói cọc 20%, 30%, 50%, 100% hoặc COD</span>
                  <ChevronRight className="w-3.5 h-3.5 text-pastel-pinkDark" />
                </div>
              </div>
            </div>

            {/* Total and Submit Button */}
            <div className="pt-3 border-t border-pastel-pink/40 flex items-center justify-between">
              <div>
                <span className="text-xs text-pastel-subtext block">Tổng thanh toán:</span>
                <span className="text-2xl font-black text-pastel-pinkDark">
                  {totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3.5 rounded-3xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black text-sm shadow-kawaii-hover hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>{isSubmitting ? "Đang gửi đơn..." : "Chốt Đơn Ngay 🌸"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
