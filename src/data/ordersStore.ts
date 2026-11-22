import { Order, PaymentStatus } from "@/types";

// Initial sample orders with payment & deposit status
export const initialOrders: Order[] = [
  {
    id: "ANNA-8901",
    customerName: "Nguyễn Hải Yến",
    phone: "0905123456",
    address: "K317/23 Nguyễn Phước Nguyên, Đà Nẵng",
    deliveryType: "pickup",
    deliveryDate: new Date().toISOString().split("T")[0],
    deliveryTimeSlot: "15:00 - 17:00",
    cardMessage: "Chúc bạn thân thi tốt nghiệp điểm cao chót vót nha! 🌻✨",
    items: [
      {
        id: "kn-01",
        name: "Bó Hướng Dương Mặt Trời Nhỏ Để Bàn",
        price: 95000,
        quantity: 1,
        type: "standard",
      },
    ],
    totalAmount: 95000,
    depositAmount: 50000,
    status: "crafting",
    paymentMethod: "deposit_50",
    paymentStatus: "deposit_paid", // Đã cọc 50k
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    note: "Khách đã chuyển cọc 50k qua MBBank",
  },
  {
    id: "ANNA-8902",
    customerName: "Trần Minh Quân",
    phone: "0935888999",
    address: "Đại học Bách Khoa Đà Nẵng, 54 Nguyễn Lương Bằng",
    deliveryType: "delivery",
    deliveryDate: new Date().toISOString().split("T")[0],
    deliveryTimeSlot: "10:00 - 12:00",
    cardMessage: "Mong em luôn rạng rỡ như những đóa tulip này 🌷💖",
    items: [
      {
        id: "kn-02",
        name: "Bó Tulip Pastel 'Tình Đầu Ngọt Ngào'",
        price: 135000,
        quantity: 1,
        type: "standard",
      },
      {
        id: "kn-04",
        name: "Chậu Cây Mầm Chibi 'Bé Mầm Anna' Có Má Hồng",
        price: 49000,
        quantity: 1,
        type: "standard",
      },
    ],
    totalAmount: 184000,
    depositAmount: 184000,
    status: "ready",
    paymentMethod: "banking",
    paymentStatus: "fully_paid", // Đã thanh toán 100%
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    note: "Ship tới cổng phụ trường ĐH Bách Khoa, đã chuyển khoản đủ",
  },
  {
    id: "ANNA-8903",
    customerName: "Lê Phương Thảo",
    phone: "0977234567",
    address: "Hòa Cường Bắc, Hải Châu, Đà Nẵng",
    deliveryType: "delivery",
    deliveryDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    deliveryTimeSlot: "14:00 - 16:00",
    cardMessage: "Happy Birthday my sunshine! 🎂💐",
    items: [
      {
        id: "custom-01",
        name: "Bó Hoa Tự Phối DIY (1 Hướng Dương, 2 Tulip, Giấy Hồng)",
        price: 142000,
        quantity: 1,
        type: "custom_bouquet",
        details: "1x Cành Hướng Dương + 2x Tulip Hồng Baby + Giấy gói hồng pastel + Nơ satin",
      },
    ],
    totalAmount: 142000,
    depositAmount: 70000,
    status: "pending",
    paymentMethod: "deposit_50",
    paymentStatus: "unpaid", // Chờ khách chuyển cọc
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    note: "Chờ khách quét mã VietQR cọc 50%",
  },
  {
    id: "ANNA-8904",
    customerName: "Hoàng Gia Bảo",
    phone: "0914555666",
    address: "K317/23 Nguyễn Phước Nguyên, Đà Nẵng",
    deliveryType: "pickup",
    deliveryDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    deliveryTimeSlot: "09:00",
    cardMessage: "Cảm ơn cô vì đã luôn tận tụy dìu dắt chúng em!",
    items: [
      {
        id: "kn-05",
        name: "Bó Hoa Ly Hồng Kẽm Nhung Quý Phái",
        price: 165000,
        quantity: 1,
        type: "standard",
      },
    ],
    totalAmount: 165000,
    depositAmount: 0,
    status: "completed",
    paymentMethod: "cod",
    paymentStatus: "fully_paid",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __annaOrders: Order[] | undefined;
}

export function getOrders(): Order[] {
  if (!global.__annaOrders) {
    global.__annaOrders = [...initialOrders];
  }
  return global.__annaOrders;
}

export function addOrder(order: Order): Order {
  const orders = getOrders();
  orders.unshift(order);
  return order;
}

export function updateOrderStatus(
  orderId: string,
  status?: Order["status"],
  paymentStatus?: PaymentStatus,
  depositAmount?: number
): Order | null {
  const orders = getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (depositAmount !== undefined) order.depositAmount = depositAmount;
    return order;
  }
  return null;
}
