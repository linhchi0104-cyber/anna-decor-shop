"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Order, OrderStatus, PaymentStatus, Product, ShopBankConfig, StemOption } from "@/types";
import { sound } from "@/utils/sound";
import { SHOP_INFO, DEFAULT_BANK_CONFIG } from "@/data/products";
import ImageUploadZone from "@/components/common/ImageUploadZone";
import MascotAvatar from "@/components/common/MascotAvatar";
import FlowerBackgroundRemover from "@/components/admin/FlowerBackgroundRemover";
import {
  Calendar,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Phone,
  MapPin,
  Send,
  Home,
  RefreshCw,
  Search,
  Sparkles,
  Package,
  DollarSign,
  TrendingUp,
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  KeyRound,
  Check,
  X,
  QrCode,
  ArrowLeft,
  FileSpreadsheet,
  Printer,
  Scissors,
  Tag,
  Star,
  Settings as SettingsIcon,
  Bot,
  ExternalLink,
} from "lucide-react";

type AdminTab = "schedule" | "stems" | "products" | "vouchers" | "reviews" | "payments" | "settings" | "reports";

interface VoucherItem {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  quantity: number;
  active: boolean;
}

interface ReviewItem {
  id: string;
  name: string;
  comment: string;
  stars: number;
  item: string;
  sticker: string;
  date: string;
}

export default function AdminPage() {
  // SECURITY & PIN LOCK STATE
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || "010491";

  const [activeTab, setActiveTab] = useState<AdminTab>("schedule");

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [filterDate, setFilterDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stems State (for Studio Bouquet)
  const [stems, setStems] = useState<StemOption[]>([]);
  const [isLoadingStems, setIsLoadingStems] = useState(false);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Bank Config State
  const [bankConfig, setBankConfig] = useState<ShopBankConfig>(DEFAULT_BANK_CONFIG);
  const [isSavingBank, setIsSavingBank] = useState(false);

  // Settings & Gemini API Key State
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState("");
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [testAiResponse, setTestAiResponse] = useState<string | null>(null);
  const [isTestingAi, setIsTestingAi] = useState(false);

  // Vouchers State
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [newVoucherForm, setNewVoucherForm] = useState({
    code: "",
    type: "percent" as "percent" | "fixed",
    value: 10,
    minOrder: 100000,
    quantity: 50,
  });

  // Reviews State
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Product Form State
  const [prodForm, setProdForm] = useState({
    name: "",
    category: "kem-nhung",
    price: 95000,
    originalPrice: 120000,
    image: "",
    badge: "Mới Ra Mắt ✨",
    description: "",
    materials: "Kẽm nhung mịn loại 1, cành kẽm, giấy gói pastel",
    dimensions: "Cao 30cm, đường kính 18cm",
    craftTime: "1 ngày",
    stock: 10,
  });

  // Check auth session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("anna_admin_authenticated");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput === correctPin) {
      sound.playSuccess();
      setIsAuthenticated(true);
      setPinError(false);
      sessionStorage.setItem("anna_admin_authenticated", "true");
    } else {
      sound.playPop();
      setPinError(true);
      setPinInput("");
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handleLogout = () => {
    sound.playPop();
    setIsAuthenticated(false);
    sessionStorage.removeItem("anna_admin_authenticated");
    setPinInput("");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch orders
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch stems
  const fetchStems = async () => {
    setIsLoadingStems(true);
    try {
      const res = await fetch("/api/stems");
      const data = await res.json();
      if (data.success && data.stems) {
        setStems(data.stems);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingStems(false);
    }
  };

  // Fetch bank & system settings
  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success) {
        if (data.bankConfig) setBankConfig(data.bankConfig);
        const hasServerKey = Boolean(data.settings?.hasGeminiApiKey);
        const hasLocalKey = typeof window !== "undefined" && Boolean(localStorage.getItem("anna_gemini_api_key"));
        setHasGeminiKey(hasServerKey || hasLocalKey);
        if (data.vouchers) setVouchers(data.vouchers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success && data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchProducts();
      fetchStems();
      fetchSettings();
      fetchReviews();
    }
  }, [isAuthenticated]);

  // Update order status
  const handleUpdateOrderStatus = async (
    orderId: string,
    status?: OrderStatus,
    paymentStatus?: PaymentStatus
  ) => {
    sound.playPop();
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status, paymentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        sound.playSuccess();
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: status || o.status,
                  paymentStatus: paymentStatus || o.paymentStatus,
                }
              : o
          )
        );
        showToast(`Đã cập nhật đơn ${orderId}!`);
      }
    } catch {
      alert("Lỗi khi cập nhật trạng thái đơn!");
    }
  };

  // EXPORT EXCEL / CSV WITH UTF-8 BOM
  const handleExportExcel = () => {
    sound.playMagic();
    const headers = [
      "Mã Đơn",
      "Khách Hàng",
      "Số Điện Thoại",
      "Hình Thức",
      "Địa Chỉ Giao",
      "Ngày Hẹn",
      "Giờ Hẹn",
      "Danh Sách Món Đặt",
      "Tổng Tiền (VNĐ)",
      "Tiền Cọc (VNĐ)",
      "Gói Đặt Hàng",
      "Trạng Thái Cọc",
      "Tiến Độ Đơn",
      "Lời Nhắn Thiệp",
      "Ghi Chú",
      "Thời Gian Đặt",
    ];

    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.deliveryType === "pickup" ? "Ghé tiệm lấy" : "Giao tận nơi"}"`,
      `"${(o.address || "").replace(/"/g, '""')}"`,
      `"${o.deliveryDate}"`,
      `"${o.deliveryTimeSlot}"`,
      `"${o.items.map((it) => `${it.quantity}x ${it.name}`).join("; ")}"`,
      o.totalAmount,
      o.depositAmount || 0,
      `"${o.paymentMethod}"`,
      `"${o.paymentStatus}"`,
      `"${o.status}"`,
      `"${(o.cardMessage || "").replace(/"/g, '""')}"`,
      `"${(o.note || "").replace(/"/g, '""')}"`,
      `"${new Date(o.createdAt).toLocaleString("vi-VN")}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Don-Hang-Anna-Decor-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Đã xuất danh sách đơn hàng ra file Excel / CSV thành công!");
  };

  // PRINT RECEIPT / SLIP MINI
  const handlePrintOrder = (order: Order) => {
    sound.playPop();
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Phiếu Giao Hoa - ${order.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; color: #333; max-width: 400px; margin: auto; }
            .header { text-align: center; border-bottom: 2px dashed #ff8eaa; padding-bottom: 12px; margin-bottom: 12px; }
            .logo { font-size: 20px; font-weight: 900; color: #c44d6e; }
            .sub { font-size: 11px; color: #666; margin-top: 2px; }
            .order-id { font-size: 14px; font-weight: bold; background: #fff0f3; padding: 4px 8px; border-radius: 8px; display: inline-block; margin-top: 6px; }
            .section { margin-bottom: 12px; font-size: 12px; line-height: 1.5; }
            .item { display: flex; justify-content: space-between; margin: 4px 0; border-bottom: 1px dotted #ddd; padding-bottom: 4px; }
            .total { font-size: 14px; font-weight: bold; display: flex; justify-content: space-between; border-top: 1px solid #333; padding-top: 6px; margin-top: 6px; }
            .card-box { background: #fff5f7; border: 1px solid #ffd6e0; border-radius: 8px; padding: 8px; font-style: italic; margin-top: 8px; font-size: 11px; }
            .footer { text-align: center; font-size: 11px; color: #888; margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🌸 TIỆM HOA ANNA DECOR 🌸</div>
            <div class="sub">K317/23 Nguyễn Phước Nguyên, Đà Nẵng • 0763.679.601</div>
            <div class="order-id">Mã đơn: ${order.id}</div>
          </div>
          <div class="section">
            <div><strong>Khách hàng:</strong> ${order.customerName}</div>
            <div><strong>SĐT / Zalo:</strong> ${order.phone}</div>
            <div><strong>Địa chỉ:</strong> ${order.address}</div>
            <div><strong>Hẹn ngày & giờ:</strong> ${order.deliveryDate} lúc ${order.deliveryTimeSlot}</div>
          </div>
          <div class="section">
            <strong>Chi tiết hoa:</strong>
            ${order.items
              .map(
                (it) => `
              <div class="item">
                <span>${it.quantity}x ${it.name}</span>
                <span>${it.price.toLocaleString("vi-VN")}đ</span>
              </div>
            `
              )
              .join("")}
            <div class="total">
              <span>Tổng đơn:</span>
              <span>${order.totalAmount.toLocaleString("vi-VN")}đ</span>
            </div>
            <div style="font-size: 11px; color: #666; margin-top: 4px;">
              Tiền cọc: ${(order.depositAmount || 0).toLocaleString("vi-VN")}đ | Còn thu: ${(order.totalAmount - (order.depositAmount || 0)).toLocaleString("vi-VN")}đ
            </div>
          </div>
          ${
            order.cardMessage
              ? `
            <div class="card-box">
              💌 <strong>Lời nhắn thiệp:</strong> "${order.cardMessage}"
            </div>
          `
              : ""
          }
          <div class="footer">
            Cảm ơn bạn đã yêu thương hoa thủ công Anna Decor! 🌸✨
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Add Stem to Studio
  const handleSaveCutoutStem = async (stemData: {
    name: string;
    flowerType: "kem-nhung" | "moc-len";
    price: number;
    color: string;
    colorHex: string;
    meaning: string;
    imageUrl: string;
  }) => {
    const res = await fetch("/api/stems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stemData),
    });
    const data = await res.json();
    if (data.success) {
      sound.playSuccess();
      showToast(`Đã thêm cành "${stemData.name}" vào Studio Tự Bó Hoa! 🌸`);
      fetchStems();
    } else {
      alert("Lỗi khi thêm cành hoa vào Studio");
    }
  };

  // Delete Stem from Studio
  const handleDeleteStem = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa cành "${name}" khỏi Studio không?`)) return;
    sound.playPop();
    try {
      const res = await fetch(`/api/stems?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa cành "${name}"!`);
        fetchStems();
      }
    } catch {
      alert("Lỗi khi xóa cành hoa");
    }
  };

  // Save Gemini API Key
  const handleSaveGeminiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = geminiApiKeyInput.trim();
    if (!key) {
      alert("Vui lòng nhập Gemini API Key");
      return;
    }
    sound.playPop();
    setIsSavingSettings(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("anna_gemini_api_key", key);
      }
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geminiApiKey: key }),
      });
      const data = await res.json();
      if (data.success) {
        sound.playSuccess();
        setHasGeminiKey(true);
        setGeminiApiKeyInput("");
        showToast("Đã lưu Gemini API Key thành công cho Chatbot Bé Mầm!");
      }
    } catch {
      alert("Lỗi lưu cấu hình Gemini API");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Test Gemini Chatbot
  const handleTestGeminiChat = async () => {
    sound.playPop();
    setIsTestingAi(true);
    setTestAiResponse(null);
    try {
      const storedKey = typeof window !== "undefined" ? localStorage.getItem("anna_gemini_api_key") || "" : "";
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-key": storedKey,
        },
        body: JSON.stringify({
          messages: [],
          userMessage: "Chào Bé Mầm, shop mình có những mẫu hoa gì dưới 100k và giao toàn quốc không?",
          apiKey: storedKey,
        }),
      });
      const data = await res.json();
      setTestAiResponse(data.reply || data.content || "Bé Mầm đã kết nối thành công! 🌸");
      sound.playSuccess();
    } catch {
      alert("Lỗi kiểm tra AI Gemini");
    } finally {
      setIsTestingAi(false);
    }
  };

  // Add Voucher
  const handleAddVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherForm.code.trim()) return;
    sound.playPop();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newVoucher: {
            ...newVoucherForm,
            code: newVoucherForm.code.trim().toUpperCase(),
            active: true,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        sound.playSuccess();
        setVouchers(data.vouchers);
        setNewVoucherForm({ code: "", type: "percent", value: 10, minOrder: 100000, quantity: 50 });
        showToast("Đã thêm mã giảm giá mới!");
      }
    } catch {
      alert("Lỗi thêm mã voucher");
    }
  };

  // Delete Voucher
  const handleDeleteVoucher = async (code: string) => {
    sound.playPop();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteVoucherCode: code }),
      });
      const data = await res.json();
      if (data.success) {
        setVouchers(data.vouchers);
        showToast(`Đã xóa voucher ${code}!`);
      }
    } catch {
      alert("Lỗi xóa voucher");
    }
  };

  // Delete Review
  const handleDeleteReview = async (id: string) => {
    if (!confirm("Bạn có chắc muốn ẩn/xóa đánh giá này không?")) return;
    sound.playPop();
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Đã xóa đánh giá!");
        fetchReviews();
      }
    } catch {
      alert("Lỗi xóa đánh giá");
    }
  };

  // Save bank config
  const handleSaveBankConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBank(true);
    sound.playPop();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bankConfig }),
      });
      const data = await res.json();
      if (data.success) {
        sound.playSuccess();
        showToast("Đã lưu thông tin tài khoản ngân hàng!");
      }
    } catch {
      alert("Lỗi khi lưu thông tin ngân hàng");
    } finally {
      setIsSavingBank(false);
    }
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    sound.playPop();
    setEditingProduct(null);
    setProdForm({
      name: "",
      category: "kem-nhung",
      price: 95000,
      originalPrice: 120000,
      image: "",
      badge: "Mới Ra Mắt ✨",
      description: "Hoa thủ công làm tay 100% tại Anna Decor Đà Nẵng.",
      materials: "Kẽm nhung mịn loại 1, cành kẽm, giấy gói pastel",
      dimensions: "Cao 30cm, đường kính 18cm",
      craftTime: "1 ngày",
      stock: 10,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    sound.playPop();
    setEditingProduct(p);
    setProdForm({
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      image: p.image,
      badge: p.badge || "",
      description: p.description,
      materials: p.materials.join(", "),
      dimensions: p.dimensions,
      craftTime: p.craftTime,
      stock: p.stock || 0,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.image) {
      alert("Vui lòng tải ảnh hoặc dán link ảnh mẫu hoa nhé! 🌸");
      return;
    }
    sound.playPop();
    try {
      const payload = {
        ...prodForm,
        materials: prodForm.materials.split(",").map((s) => s.trim()),
      };

      if (editingProduct) {
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProduct.id, ...payload }),
        });
        const data = await res.json();
        if (data.success) {
          sound.playSuccess();
          showToast(`Đã cập nhật hoa "${payload.name}"!`);
          setIsProductModalOpen(false);
          fetchProducts();
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          sound.playSuccess();
          showToast(`Đã thêm hoa mới "${payload.name}"!`);
          setIsProductModalOpen(false);
          fetchProducts();
        }
      }
    } catch {
      alert("Lỗi khi lưu sản phẩm");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa mẫu hoa "${name}" không?`)) return;
    sound.playPop();
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa mẫu hoa "${name}"!`);
        fetchProducts();
      }
    } catch {
      alert("Lỗi khi xóa sản phẩm");
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesDate = !filterDate || o.deliveryDate === filterDate;
    const matchesSearch =
      !searchQuery ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesSearch;
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const targetDateForLoad = filterDate || todayStr;
  const targetDateOrders = orders.filter(
    (o) => o.deliveryDate === targetDateForLoad && o.status !== "completed"
  );
  const dailyLoadCount = targetDateOrders.length;
  const isOverloaded = dailyLoadCount >= SHOP_INFO.maxDailyCapacity;

  const columns: { key: OrderStatus; title: string; icon: string; color: string }[] = [
    { key: "pending", title: "Chờ Làm", icon: "⏳", color: "border-amber-300 bg-amber-50/50" },
    { key: "crafting", title: "Đang Đan / Uốn", icon: "🧶", color: "border-blue-300 bg-blue-50/50" },
    { key: "ready", title: "Đã Xong Chờ Ship", icon: "📦", color: "border-purple-300 bg-purple-50/50" },
    { key: "completed", title: "Hoàn Thành", icon: "✅", color: "border-emerald-300 bg-emerald-50/50" },
  ];

  // Revenue metrics
  const totalRevenue = orders.reduce((sum, o) => {
    if (o.paymentStatus === "fully_paid" || o.status === "completed") {
      return sum + o.totalAmount;
    } else if (o.paymentStatus === "deposit_paid") {
      return sum + (o.depositAmount || 0);
    }
    return sum;
  }, 0);

  const totalDepositCollected = orders.reduce((sum, o) => {
    return sum + (o.depositAmount || 0);
  }, 0);

  const totalBouquetsSold = orders.reduce((sum, o) => {
    return sum + o.items.reduce((acc, it) => acc + it.quantity, 0);
  }, 0);

  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // ========================================================
  // 1. PIN CODE LOCK SCREEN (SECURITY GATE)
  // ========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-pastel-cream flex items-center justify-center p-4">
        <div
          className={`w-full max-w-md bg-white rounded-5xl border-3 border-pastel-pink shadow-kawaii p-8 text-center space-y-6 transition-transform ${
            pinError ? "animate-shake border-rose-400" : ""
          }`}
        >
          <div className="relative inline-block">
            <MascotAvatar size="lg" expression="wink" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-pastel-pinkDark text-white flex items-center justify-center shadow-md">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-pastel-choco">
              Quản Trị Tiệm Anna Decor
            </h2>
            <p className="text-xs text-pastel-subtext max-w-xs mx-auto">
              Khu vực dành riêng cho chủ shop. Vui lòng nhập Mã PIN bảo mật để tiếp tục.
            </p>
          </div>

          {/* PIN Input Form - No default password hint */}
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Nhập mã PIN bảo mật"
                className="w-full text-center text-xl tracking-widest px-4 py-3 rounded-2xl border-2 border-pastel-pink/70 focus:ring-2 focus:ring-pastel-pink outline-none font-black text-pastel-choco bg-pastel-warmBg"
              />
              {pinError && (
                <p className="text-xs text-rose-600 font-bold mt-2">
                  ⚠️ Mã PIN không đúng! Vui lòng thử lại nha.
                </p>
              )}
            </div>

            {/* Quick Virtual Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    if (pinInput.length < 6) setPinInput(pinInput + n);
                  }}
                  className="py-2.5 rounded-2xl bg-pastel-warmBg hover:bg-pastel-pink/30 font-black text-base text-pastel-choco shadow-sm transition-all"
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setPinInput("");
                }}
                className="py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-500"
              >
                Xóa
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  if (pinInput.length < 6) setPinInput(pinInput + "0");
                }}
                className="py-2.5 rounded-2xl bg-pastel-warmBg hover:bg-pastel-pink/30 font-black text-base text-pastel-choco shadow-sm transition-all"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setPinInput((prev) => prev.slice(0, -1));
                }}
                className="py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-500"
              >
                ⌫
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black text-sm shadow-kawaii-hover hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-4 h-4 text-pastel-choco" />
              <span>Mở Khóa Quản Trị</span>
            </button>
          </form>

          {/* Back to Shop Link */}
          <div className="pt-2 border-t border-gray-100">
            <Link
              href="/"
              onClick={() => sound.playPop()}
              className="inline-flex items-center gap-1.5 text-xs text-pastel-subtext hover:text-pastel-pinkDark font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang chủ tiệm hoa (Dành cho khách)</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // 2. MAIN ADMIN DASHBOARD (UNLOCKED)
  // ========================================================
  return (
    <div className="min-h-screen bg-pastel-cream text-pastel-choco pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-pastel-choco text-white px-4 py-2.5 rounded-2xl shadow-kawaii text-xs font-bold animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-white/95 border-b border-pastel-pink/50 sticky top-0 z-30 shadow-kawaii-sm px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={() => sound.playPop()}
              className="p-2.5 rounded-2xl bg-pastel-pink/30 hover:bg-pastel-pink text-pastel-choco transition-colors"
              title="Về lại cửa hàng"
            >
              <Home className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-pastel-choco">
                  Quản Trị Tiệm Anna Decor
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-pastel-pink text-pastel-choco text-[10px] font-black">
                  Admin Master
                </span>
              </div>
              <p className="text-xs text-pastel-subtext">
                Quản lý hoa, đơn hàng toàn quốc, xóa phông studio, AI Gemini & doanh thu
              </p>
            </div>
          </div>

          {/* Navigation Tabs & Logout */}
          <div className="flex flex-wrap items-center gap-1.5 bg-pastel-warmBg p-1.5 rounded-3xl border border-pastel-pink/40 shadow-inner">
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab("schedule");
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "schedule"
                  ? "bg-pastel-pinkDark text-white shadow-sm"
                  : "text-pastel-choco hover:bg-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Đơn Hàng ({orders.length})</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setActiveTab("stems");
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "stems"
                  ? "bg-pastel-pinkDark text-white shadow-sm"
                  : "text-pastel-choco hover:bg-white"
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Xóa Phông Hoa ({stems.length})</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setActiveTab("products");
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "products"
                  ? "bg-pastel-pinkDark text-white shadow-sm"
                  : "text-pastel-choco hover:bg-white"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Kho Hoa ({products.length})</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setActiveTab("vouchers");
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "vouchers"
                  ? "bg-pastel-pinkDark text-white shadow-sm"
                  : "text-pastel-choco hover:bg-white"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Mã Giảm Giá</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setActiveTab("reviews");
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "reviews"
                  ? "bg-pastel-pinkDark text-white shadow-sm"
                  : "text-pastel-choco hover:bg-white"
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Đánh Giá ({reviews.length})</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setActiveTab("payments");
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "payments"
                  ? "bg-pastel-pinkDark text-white shadow-sm"
                  : "text-pastel-choco hover:bg-white"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Tài Khoản VietQR</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setActiveTab("settings");
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "settings"
                  ? "bg-pastel-pinkDark text-white shadow-sm"
                  : "text-pastel-choco hover:bg-white"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Gemini</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setActiveTab("reports");
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "reports"
                  ? "bg-pastel-pinkDark text-white shadow-sm"
                  : "text-pastel-choco hover:bg-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Báo Cáo</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl bg-gray-100 hover:bg-rose-100 text-gray-600 hover:text-rose-600 transition-colors ml-1"
              title="Khóa bảo vệ trang quản trị"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* ======================================================== */}
        {/* TAB 1: SCHEDULE / KANBAN & ORDERS                         */}
        {/* ======================================================== */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            {/* WORKLOAD CAPACITY BANNER */}
            <div
              className={`p-4 sm:p-5 rounded-4xl border-2 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-kawaii-sm ${
                isOverloaded
                  ? "bg-rose-50 border-rose-300 text-rose-900"
                  : "bg-white border-pastel-pink/60 text-pastel-choco"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                    isOverloaded ? "bg-rose-200 text-rose-700" : "bg-pastel-mint text-emerald-800"
                  }`}
                >
                  {isOverloaded ? "⚠️" : "🌸"}
                </div>
                <div>
                  <h2 className="font-black text-base sm:text-lg flex items-center gap-2">
                    Năng Suất Uốn Hoa: {targetDateOrders.length} / {SHOP_INFO.maxDailyCapacity} bó
                    {isOverloaded && (
                      <span className="text-xs bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-bold">
                        ĐÃ CHẠM GIỚI HẠN!
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-pastel-subtext mt-0.5">
                    {isOverloaded
                      ? "Ngày này đã đầy tải uốn hoa thủ công. Website tự động khuyến khích khách nhận đơn sang ngày hôm sau để đảm bảo chất lượng."
                      : `Tiệm vẫn còn nhận thêm được ${SHOP_INFO.maxDailyCapacity - targetDateOrders.length} bó hoa thủ công nữa cho ngày ${targetDateForLoad}.`}
                  </p>
                </div>
              </div>

              <div className="w-full md:w-56 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Tiến độ tải:</span>
                  <span>{Math.round((dailyLoadCount / SHOP_INFO.maxDailyCapacity) * 100)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isOverloaded ? "bg-rose-500" : "bg-pastel-pinkDark"
                    }`}
                    style={{ width: `${Math.min(100, (dailyLoadCount / SHOP_INFO.maxDailyCapacity) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Filter Controls & Export Excel Button */}
            <div className="bg-white p-4 rounded-3xl border border-pastel-pink/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-pastel-subtext absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên khách, SĐT, mã đơn..."
                  className="w-full pl-9 pr-3 py-2 rounded-2xl border border-pastel-pink/50 text-xs focus:ring-2 focus:ring-pastel-pink outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span className="whitespace-nowrap">Lọc ngày:</span>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-3 py-1.5 rounded-2xl border border-pastel-pink/50 text-xs focus:ring-2 focus:ring-pastel-pink outline-none"
                  />
                  {filterDate && (
                    <button
                      onClick={() => setFilterDate("")}
                      className="text-xs text-rose-500 hover:underline font-semibold"
                    >
                      Xóa lọc
                    </button>
                  )}
                </div>

                {/* EXPORT EXCEL BUTTON */}
                <button
                  onClick={handleExportExcel}
                  className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Xuất Excel / CSV</span>
                </button>
              </div>
            </div>

            {/* KANBAN BOARD */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
              {columns.map((col) => {
                const colOrders = filteredOrders.filter((o) => o.status === col.key);

                return (
                  <div
                    key={col.key}
                    className={`rounded-4xl p-4 border-2 shadow-kawaii-sm flex flex-col min-h-[500px] ${col.color}`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{col.icon}</span>
                        <h3 className="font-black text-sm text-pastel-choco">{col.title}</h3>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-white text-pastel-choco font-black text-xs flex items-center justify-center shadow-sm">
                        {colOrders.length}
                      </span>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {colOrders.length === 0 ? (
                        <div className="text-center py-10 text-xs text-pastel-subtext italic">
                          Chưa có đơn ở mục này
                        </div>
                      ) : (
                        colOrders.map((order) => (
                          <div
                            key={order.id}
                            className="bg-white rounded-3xl p-4 border border-pastel-pink/50 shadow-sm hover:shadow-md transition-all space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-xs text-pastel-pinkDark bg-pastel-pink/30 px-2 py-0.5 rounded-full">
                                {order.id}
                              </span>
                              <div className="flex items-center gap-1">
                                {/* Print Slip Button */}
                                <button
                                  onClick={() => handlePrintOrder(order)}
                                  className="p-1 rounded-lg bg-gray-100 hover:bg-pastel-pink/30 text-pastel-choco text-[10px] flex items-center gap-1 px-1.5"
                                  title="In phiếu giao hoa mini"
                                >
                                  <Printer className="w-3 h-3 text-pastel-pinkDark" />
                                  <span>In phiếu</span>
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1 text-xs">
                              <p className="font-extrabold text-sm text-pastel-choco">
                                {order.customerName}
                              </p>
                              <p className="text-pastel-choco/80 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-pastel-pinkDark" />
                                <span>{order.phone}</span>
                              </p>
                              <p className="text-pastel-choco/80 flex items-start gap-1">
                                <MapPin className="w-3 h-3 text-pastel-pinkDark shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{order.address}</span>
                              </p>
                              <p className="text-pastel-choco/80 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-pastel-pinkDark" />
                                <span>
                                  {order.deliveryDate} ({order.deliveryTimeSlot})
                                </span>
                              </p>
                            </div>

                            {/* Items List */}
                            <div className="bg-pastel-warmBg p-2.5 rounded-2xl text-[11px] space-y-1">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="flex justify-between font-medium">
                                  <span className="line-clamp-1">
                                    {it.quantity}x {it.name}
                                  </span>
                                  <span className="font-bold text-pastel-pinkDark shrink-0 ml-1">
                                    {it.price.toLocaleString("vi-VN")}đ
                                  </span>
                                </div>
                              ))}
                              {order.cardMessage && (
                                <p className="italic text-[10px] text-pastel-pinkDark border-t border-pastel-pink/30 pt-1 mt-1">
                                  💌 &quot;{order.cardMessage}&quot;
                                </p>
                              )}
                            </div>

                            {/* Total and Deposit Info */}
                            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                              <div>
                                <span className="text-[10px] text-pastel-subtext block">Tổng:</span>
                                <span className="font-black text-pastel-pinkDark text-sm">
                                  {order.totalAmount.toLocaleString("vi-VN")}đ
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-pastel-subtext block">Cọc ({order.paymentMethod}):</span>
                                <span className="font-bold text-emerald-700 text-xs">
                                  {(order.depositAmount || 0).toLocaleString("vi-VN")}đ
                                </span>
                              </div>
                            </div>

                            {/* Status Changer Selects */}
                            <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-1.5 text-[10px]">
                              <div>
                                <label className="block text-gray-400 font-bold mb-0.5">Tiến độ:</label>
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                                  }
                                  className="w-full p-1.5 rounded-xl border border-pastel-pink/50 bg-white font-bold text-pastel-choco text-[10px]"
                                >
                                  <option value="pending">Chờ làm</option>
                                  <option value="crafting">Đang uốn</option>
                                  <option value="ready">Chờ ship</option>
                                  <option value="completed">Đã giao</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-gray-400 font-bold mb-0.5">Thanh toán:</label>
                                <select
                                  value={order.paymentStatus}
                                  onChange={(e) =>
                                    handleUpdateOrderStatus(order.id, undefined, e.target.value as PaymentStatus)
                                  }
                                  className="w-full p-1.5 rounded-xl border border-pastel-pink/50 bg-white font-bold text-pastel-choco text-[10px]"
                                >
                                  <option value="unpaid">Chưa cọc</option>
                                  <option value="deposit_paid">Đã nhận cọc</option>
                                  <option value="fully_paid">Đã trả đủ 100%</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: STEMS & BACKGROUND REMOVER STUDIO (YÊU CẦU 7)     */}
        {/* ======================================================== */}
        {activeTab === "stems" && (
          <div className="space-y-8">
            {/* Embedded Background Remover Studio */}
            <FlowerBackgroundRemover onSaveStem={handleSaveCutoutStem} />

            {/* List of Current Studio Stems */}
            <div className="bg-white rounded-5xl border-2 border-pastel-pink/50 p-6 sm:p-8 shadow-kawaii space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-pastel-pink/30">
                <div>
                  <h3 className="text-xl font-black text-pastel-choco">
                    Danh Sách Cành Hoa Trong Studio ({stems.length} cành)
                  </h3>
                  <p className="text-xs text-pastel-subtext">
                    Các cành hoa hiển thị cho khách tự do chọn và kéo thả tại Studio &quot;Tự Bó Hoa Tặng Crush&quot;
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {stems.map((stem) => (
                  <div
                    key={stem.id}
                    className="p-4 rounded-3xl border-2 border-pastel-pink/40 bg-pastel-warmBg/50 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-pastel-pink/30 shrink-0 overflow-hidden bg-white"
                          style={{ backgroundColor: `${stem.colorHex}25` }}
                        >
                          {stem.imageUrl ? (
                            <img src={stem.imageUrl} alt={stem.name} className="w-10 h-10 object-contain" />
                          ) : (
                            stem.image
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs text-pastel-choco line-clamp-1">
                            {stem.name}
                          </h4>
                          <span className="text-[10px] font-black text-pastel-pinkDark">
                            {stem.price.toLocaleString("vi-VN")}đ/cành
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteStem(stem.id, stem.name)}
                        className="p-1 rounded-lg hover:bg-rose-100 text-gray-400 hover:text-rose-600 transition-colors"
                        title="Xóa cành hoa khỏi Studio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[10px] text-pastel-subtext line-clamp-2 italic">
                      &quot;{stem.meaning}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PRODUCTS & INVENTORY                             */}
        {/* ======================================================== */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-pastel-pink/50 shadow-sm">
              <div>
                <h3 className="text-xl font-black text-pastel-choco">
                  Kho Mẫu Hoa Handmade Có Sẵn ({products.length})
                </h3>
                <p className="text-xs text-pastel-subtext">
                  Quản lý mẫu hoa trưng bày ở Bộ Sưu Tập Thủ Công trang chủ
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black text-xs shadow-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Mẫu Hoa Mới</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-4xl p-4 border-2 border-pastel-pink/40 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="relative w-full h-44 rounded-3xl overflow-hidden bg-pastel-warmBg mb-3">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                      {p.badge && (
                        <div className="absolute top-3 left-3 bg-white/95 text-pastel-choco text-[10px] font-black px-2.5 py-0.5 rounded-full border border-pastel-pink">
                          {p.badge}
                        </div>
                      )}
                    </div>

                    <h4 className="font-extrabold text-sm text-pastel-choco line-clamp-1 mb-1">
                      {p.name}
                    </h4>
                    <span className="text-xs font-black text-pastel-pinkDark block">
                      {p.price.toLocaleString("vi-VN")}đ
                    </span>
                    <p className="text-[11px] text-pastel-subtext line-clamp-2 mt-1">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-pastel-subtext font-bold">
                      Tồn kho: {p.stock}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-1.5 rounded-xl hover:bg-pastel-pink/30 text-pastel-choco transition-colors"
                        title="Chỉnh sửa mẫu hoa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 rounded-xl hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Xóa mẫu hoa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: VOUCHERS / COUPONS                               */}
        {/* ======================================================== */}
        {activeTab === "vouchers" && (
          <div className="space-y-6">
            <div className="bg-white rounded-5xl border-2 border-pastel-pink/50 p-6 sm:p-8 shadow-kawaii space-y-6">
              <div>
                <h3 className="text-xl font-black text-pastel-choco">
                  Quản Lý Mã Giảm Giá & Voucher Tiệm
                </h3>
                <p className="text-xs text-pastel-subtext">
                  Tạo các mã khuyến mãi (VD: ANNA10, VALENTINE) để thu hút khách chốt đơn
                </p>
              </div>

              {/* Form Create Voucher */}
              <form onSubmit={handleAddVoucher} className="bg-pastel-warmBg p-4 rounded-3xl border border-pastel-pink/40 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end text-xs">
                <div>
                  <label className="font-bold block mb-1">Mã Voucher *:</label>
                  <input
                    type="text"
                    required
                    value={newVoucherForm.code}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, code: e.target.value })}
                    placeholder="VD: CRUSH10"
                    className="w-full px-3 py-2 rounded-xl border border-pastel-pink/60 uppercase font-black"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Loại giảm:</label>
                  <select
                    value={newVoucherForm.type}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-pastel-pink/60 font-semibold"
                  >
                    <option value="percent">Giảm theo %</option>
                    <option value="fixed">Giảm số tiền (VNĐ)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Mức giảm:</label>
                  <input
                    type="number"
                    required
                    value={newVoucherForm.value}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-pastel-pink/60 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Đơn tối thiểu (VNĐ):</label>
                  <input
                    type="number"
                    value={newVoucherForm.minOrder}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, minOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-pastel-pink/60"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-pastel-pinkDark text-white font-black hover:opacity-90 transition-all flex items-center justify-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tạo Mã</span>
                </button>
              </form>

              {/* Vouchers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-pastel-pink/40 text-pastel-subtext uppercase">
                      <th className="py-2.5 px-3">Mã</th>
                      <th className="py-2.5 px-3">Mức Giảm</th>
                      <th className="py-2.5 px-3">Đơn Tối Thiểu</th>
                      <th className="py-2.5 px-3">Lượt Dùng Còn</th>
                      <th className="py-2.5 px-3">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vouchers.map((v) => (
                      <tr key={v.code} className="border-b border-gray-100 hover:bg-pastel-warmBg/50">
                        <td className="py-3 px-3 font-black text-pastel-pinkDark">{v.code}</td>
                        <td className="py-3 px-3 font-bold">
                          {v.type === "percent" ? `${v.value}%` : `${v.value.toLocaleString("vi-VN")}đ`}
                        </td>
                        <td className="py-3 px-3">{v.minOrder.toLocaleString("vi-VN")}đ</td>
                        <td className="py-3 px-3">{v.quantity}</td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleDeleteVoucher(v.code)}
                            className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors"
                            title="Xóa voucher"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: REVIEWS MODERATION                               */}
        {/* ======================================================== */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="bg-white rounded-5xl border-2 border-pastel-pink/50 p-6 sm:p-8 shadow-kawaii space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-pastel-pink/30">
                <div>
                  <h3 className="text-xl font-black text-pastel-choco">
                    Kiểm Duyệt Lưu Bút & Đánh Giá ({reviews.length})
                  </h3>
                  <p className="text-xs text-pastel-subtext">
                    Xem và quản lý phản hồi của khách hàng gửi về tiệm
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-3xl border border-pastel-pink/40 bg-pastel-warmBg/40 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-pastel-choco">{rev.name}</span>
                        <div className="flex text-amber-400 text-xs">
                          {"★".repeat(rev.stars)}
                        </div>
                      </div>
                      <span className="text-[10px] text-pastel-pinkDark font-semibold block mb-2">
                        {rev.item} • {rev.date}
                      </span>
                      <p className="text-xs text-pastel-choco/80 leading-relaxed italic">
                        &quot;{rev.comment}&quot;
                      </p>
                    </div>

                    <div className="pt-2 border-t border-pastel-pink/20 flex justify-end">
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa / Ẩn</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: PAYMENTS & VIETQR CONFIG                         */}
        {/* ======================================================== */}
        {activeTab === "payments" && (
          <div className="max-w-2xl mx-auto bg-white rounded-5xl border-2 border-pastel-pink/50 p-6 sm:p-8 shadow-kawaii space-y-6">
            <div>
              <h3 className="text-xl font-black text-pastel-choco">
                Cấu Hình Tài Khoản Ngân Hàng VietQR
              </h3>
              <p className="text-xs text-pastel-subtext">
                Khách chốt đơn sẽ quét mã VietQR tự động chuyển vào tài khoản này
              </p>
            </div>

            <form onSubmit={handleSaveBankConfig} className="space-y-4 text-xs text-pastel-choco">
              <div>
                <label className="font-bold block mb-1">Ngân hàng (VietQR code):</label>
                <input
                  type="text"
                  required
                  value={bankConfig.bankName}
                  onChange={(e) => setBankConfig({ ...bankConfig, bankName: e.target.value })}
                  placeholder="VD: MBBank, VCB, TPBank, VPBank..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-pastel-pink/60 font-bold"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Số tài khoản nhận tiền:</label>
                <input
                  type="text"
                  required
                  value={bankConfig.accountNumber}
                  onChange={(e) => setBankConfig({ ...bankConfig, accountNumber: e.target.value })}
                  placeholder="VD: 0763679601..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-pastel-pink/60 font-bold"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Tên chủ tài khoản (Không dấu):</label>
                <input
                  type="text"
                  required
                  value={bankConfig.accountHolder}
                  onChange={(e) => setBankConfig({ ...bankConfig, accountHolder: e.target.value })}
                  placeholder="VD: LE THI NGOC ANH"
                  className="w-full px-4 py-2.5 rounded-2xl border border-pastel-pink/60 uppercase font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingBank}
                className="w-full py-3.5 rounded-3xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black text-sm shadow-kawaii-hover hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-700" />
                <span>{isSavingBank ? "Đang lưu..." : "Lưu Thông Tin Ngân Hàng"}</span>
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: SETTINGS & GEMINI AI CONFIG (YÊU CẦU 10)         */}
        {/* ======================================================== */}
        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto bg-white rounded-5xl border-2 border-pastel-pink/50 p-6 sm:p-8 shadow-kawaii space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pastel-mint flex items-center justify-center text-2xl">
                🌱
              </div>
              <div>
                <h3 className="text-xl font-black text-pastel-choco">
                  Cấu Hình AI Gemini Cho Bé Mầm
                </h3>
                <p className="text-xs text-pastel-subtext">
                  Tích hợp Google Generative AI (Gemini 1.5 Flash) để tư vấn hoa và chốt đơn thông minh
                </p>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-pastel-warmBg border border-pastel-pink/40 space-y-2 text-xs text-pastel-choco">
              <div className="flex items-center justify-between">
                <span className="font-bold">Trạng thái kết nối API:</span>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-black ${
                    hasGeminiKey
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {hasGeminiKey ? "✅ Đã Kích Hoạt Gemini AI" : "⚠️ Đang Dùng Quy Tắc Mặc Định"}
                </span>
              </div>
              <p className="text-pastel-subtext text-[11px]">
                Khi nhập API Key, Chatbot Bé Mầm sẽ được trang bị trí tuệ nhân tạo Gemini để trả lời mượt mà, hiểu ngữ cảnh khách hàng và tự động tạo đơn.
              </p>
            </div>

            {/* Input Gemini API Key */}
            <form onSubmit={handleSaveGeminiKey} className="space-y-4 text-xs text-pastel-choco">
              <div>
                <label className="font-bold block mb-1">Google Gemini API Key:</label>
                <input
                  type="password"
                  value={geminiApiKeyInput}
                  onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                  placeholder={hasGeminiKey ? "Đã có key trong hệ thống (nhập mới để đổi key)" : "Dán mã AIzaSy... vào đây"}
                  className="w-full px-4 py-2.5 rounded-2xl border border-pastel-pink/60 focus:ring-2 focus:ring-pastel-pink outline-none font-mono text-xs"
                />
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-pastel-pinkDark hover:underline font-bold mt-1.5"
                >
                  <span>Lấy API Key Gemini miễn phí tại Google AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="flex-1 py-3.5 rounded-3xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black text-xs sm:text-sm shadow-kawaii-hover hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>{isSavingSettings ? "Đang lưu..." : "Lưu API Key Ngay"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestGeminiChat}
                  disabled={isTestingAi}
                  className="px-5 py-3.5 rounded-3xl bg-pastel-butter hover:bg-pastel-yellowGold text-pastel-choco font-black text-xs border border-amber-300 shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Bot className="w-4 h-4 text-amber-800" />
                  <span>{isTestingAi ? "Đang gọi..." : "Test Thử AI"}</span>
                </button>
              </div>
            </form>

            {/* Test result preview */}
            {testAiResponse && (
              <div className="p-4 rounded-3xl bg-white border-2 border-dashed border-pastel-pink/70 space-y-1.5 text-xs">
                <span className="font-black text-pastel-pinkDark block">
                  🌸 Câu Trả Lời Thử Nghiệm Của Bé Mầm:
                </span>
                <p className="text-pastel-choco leading-relaxed whitespace-pre-line bg-pastel-warmBg/60 p-3 rounded-2xl">
                  {testAiResponse}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: REPORTS & REVENUE                                */}
        {/* ======================================================== */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-4xl border border-pastel-pink/50 shadow-sm">
                <span className="text-xs text-pastel-subtext block font-bold">Tổng Doanh Thu</span>
                <span className="text-2xl font-black text-pastel-pinkDark mt-1 block">
                  {totalRevenue.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="bg-white p-5 rounded-4xl border border-pastel-pink/50 shadow-sm">
                <span className="text-xs text-pastel-subtext block font-bold">Tiền Cọc Đã Thu</span>
                <span className="text-2xl font-black text-emerald-700 mt-1 block">
                  {totalDepositCollected.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="bg-white p-5 rounded-4xl border border-pastel-pink/50 shadow-sm">
                <span className="text-xs text-pastel-subtext block font-bold">Số Bó Hoa Đã Bán</span>
                <span className="text-2xl font-black text-pastel-choco mt-1 block">
                  {totalBouquetsSold} bó
                </span>
              </div>
              <div className="bg-white p-5 rounded-4xl border border-pastel-pink/50 shadow-sm">
                <span className="text-xs text-pastel-subtext block font-bold">Giá Trị Đơn Trung Bình</span>
                <span className="text-2xl font-black text-amber-700 mt-1 block">
                  {averageOrderValue.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PRODUCT ADD/EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-5xl w-full max-w-xl max-h-[90vh] overflow-y-auto border-3 border-pastel-pink shadow-kawaii-hover p-6 sm:p-8 relative">
            <button
              onClick={() => {
                sound.playPop();
                setIsProductModalOpen(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-pastel-pink/30 text-pastel-choco"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-pastel-choco mb-4">
              {editingProduct ? `Chỉnh Sửa "${editingProduct.name}"` : "Thêm Mẫu Hoa Handmade Mới"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs text-pastel-choco">
              <div>
                <label className="font-bold block mb-1">Tên mẫu hoa *:</label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  placeholder="VD: Bó Tulip Pastel Tình Đầu"
                  className="w-full px-4 py-2 rounded-2xl border border-pastel-pink/60 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Danh mục:</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-2xl border border-pastel-pink/60 font-bold"
                  >
                    <option value="kem-nhung">Hoa Kẽm Nhung</option>
                    <option value="moc-len">Hoa Móc Len Vintage</option>
                    <option value="hoa-sap">Hoa Sáp Thơm Túi Trong</option>
                    <option value="decor">Phụ Kiện Decor</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Huy hiệu (Badge):</label>
                  <input
                    type="text"
                    value={prodForm.badge}
                    onChange={(e) => setProdForm({ ...prodForm, badge: e.target.value })}
                    placeholder="VD: Best Seller 🔥"
                    className="w-full px-3 py-2 rounded-2xl border border-pastel-pink/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Giá bán (VNĐ) *:</label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-2xl border border-pastel-pink/60 font-black text-pastel-pinkDark"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Số lượng tồn kho:</label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-2xl border border-pastel-pink/60 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Link ảnh mẫu hoa *:</label>
                <input
                  type="text"
                  required
                  value={prodForm.image}
                  onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 rounded-2xl border border-pastel-pink/60 text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Mô tả sản phẩm:</label>
                <textarea
                  rows={2}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-2xl border border-pastel-pink/60"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-gray-100 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-rose text-pastel-choco font-black text-xs shadow-sm hover:scale-105 transition-all"
                >
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
