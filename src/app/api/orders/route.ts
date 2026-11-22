import { NextResponse } from "next/server";
import { getOrders, addOrder, updateOrderStatus } from "@/data/ordersStore";
import { sendTelegramNotification } from "@/utils/telegram";
import { Order, PaymentStatus } from "@/types";

export async function GET() {
  const orders = getOrders();
  return NextResponse.json({ success: true, orders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const totalAmount = body.totalAmount || 0;
    const paymentMethod = body.paymentMethod || "cod";

    // Auto compute deposit amount: If deposit_50, deposit is 50%; if banking, deposit is 100%; if cod, deposit is 0 or 30k
    const depositAmount =
      body.depositAmount !== undefined
        ? body.depositAmount
        : paymentMethod === "deposit_50"
        ? Math.round(totalAmount * 0.5)
        : paymentMethod === "banking"
        ? totalAmount
        : 0;

    const newOrder: Order = {
      id: `ANNA-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: body.customerName || "Khách Hàng",
      phone: body.phone || "",
      address: body.address || "K317/23 Nguyễn Phước Nguyên, Đà Nẵng",
      deliveryType: body.deliveryType || "delivery",
      deliveryDate: body.deliveryDate || new Date().toISOString().split("T")[0],
      deliveryTimeSlot: body.deliveryTimeSlot || "Sáng 9h - 11h",
      cardMessage: body.cardMessage || "",
      items: body.items || [],
      totalAmount,
      depositAmount,
      status: "pending",
      paymentMethod,
      paymentStatus: body.paymentStatus || (paymentMethod === "cod" ? "unpaid" : "unpaid"),
      createdAt: new Date().toISOString(),
      note: body.note || "",
    };

    addOrder(newOrder);

    // Trigger instant Telegram alert to shop owner
    const telegramResult = await sendTelegramNotification(newOrder);

    return NextResponse.json({
      success: true,
      order: newOrder,
      telegramNotification: telegramResult,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tạo đơn hàng. Vui lòng thử lại!" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { orderId, status, paymentStatus, depositAmount } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Thiếu orderId" },
        { status: 400 }
      );
    }

    const updated = updateOrderStatus(orderId, status, paymentStatus as PaymentStatus, depositAmount);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ success: false, message: "Lỗi cập nhật trạng thái" }, { status: 500 });
  }
}
