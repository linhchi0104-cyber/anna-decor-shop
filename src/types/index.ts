export type ProductCategory = "kem-nhung" | "moc-len" | "hoa-sap" | "decor";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryName: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  description: string;
  materials: string[];
  dimensions: string;
  craftTime: string; // e.g. "1-2 ngày"
  stock: number; // Tồn kho hiện có (bó/chậu)
  featured?: boolean;
  bestseller?: boolean;
  rating: number;
  reviewCount: number;
}

export interface StemOption {
  id: string;
  name: string;
  flowerType: "kem-nhung" | "moc-len";
  price: number;
  color: string;
  colorHex: string;
  image: string;
  imageUrl?: string; // Ảnh mặt hoa đã tách phông nền trong suốt
  meaning: string;
}

export interface WrapOption {
  id: string;
  name: string;
  colorHex: string;
  pattern: string;
  price: number;
}

export interface RibbonOption {
  id: string;
  name: string;
  colorHex: string;
  price: number;
}

export interface AccessoryOption {
  id: string;
  name: string;
  icon: string;
  price: number;
}

export interface CustomBouquet {
  stems: { stem: StemOption; quantity: number }[];
  wrap: WrapOption;
  ribbon: RibbonOption;
  accessories: AccessoryOption[];
  cardMessage: string;
  totalPrice: number;
}

export type OrderStatus = "pending" | "crafting" | "ready" | "completed";
export type PaymentStatus = "unpaid" | "deposit_paid" | "fully_paid";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "standard" | "custom_bouquet";
  details?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryType: "delivery" | "pickup";
  deliveryDate: string;
  deliveryTimeSlot: string;
  cardMessage?: string;
  items: OrderItem[];
  totalAmount: number;
  depositAmount?: number; // Tiền cọc (thường 30-50% đơn)
  status: OrderStatus;
  paymentMethod: "cod" | "banking" | "deposit_20" | "deposit_30" | "deposit_50" | "deposit_100";
  paymentStatus: PaymentStatus; // Chưa cọc, Đã cọc, Đã thanh toán 100%
  createdAt: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  orderData?: Partial<Order>;
  quickActions?: { label: string; action: string }[];
}

export interface ShopBankConfig {
  bankName: string; // e.g. "MBBank", "Vietcombank", "TPBank"
  accountNumber: string;
  accountHolder: string;
  depositPercent: number; // 30, 50, hoặc 100%
}
