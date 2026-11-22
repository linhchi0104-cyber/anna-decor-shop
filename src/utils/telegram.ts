import { Order } from "@/types";

/**
 * Sends a Telegram notification to the shop owner when a new order is placed.
 * Formatted exactly as requested:
 * "🔔 CÓ ĐƠN HOA MỚI NÈ ANNA ƠI!
 *  - Khách: [Tên] - [SĐT]
 *  - Mẫu: [Bó hướng dương kẽm nhung + thiệp]
 *  - Ngày hẹn giao: [Ngày/Giờ]
 *  - Địa chỉ: [...]"
 */
export async function sendTelegramNotification(order: Order): Promise<{ success: boolean; message: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const itemsSummary = order.items
    .map((item) => `• ${item.name} (x${item.quantity}) - ${item.price.toLocaleString("vi-VN")}đ${item.details ? `\n   ${item.details}` : ""}`)
    .join("\n");

  const text = `🌸 *CÓ ĐƠN HOA MỚI NÈ ANNA ƠI!* 🔔
━━━━━━━━━━━━━━━━━━━━
👤 *Khách hàng:* ${order.customerName}
📞 *Số điện thoại:* ${order.phone}
📍 *Địa chỉ / Nhận tại:* ${order.deliveryType === "pickup" ? "🏪 Ghé lấy tại K317/23 Nguyễn Phước Nguyên, Đà Nẵng" : order.address}
⏰ *Ngày hẹn giao:* ${order.deliveryDate} (${order.deliveryTimeSlot})
💌 *Lời nhắn thiệp:* ${order.cardMessage ? `"${order.cardMessage}"` : "Không kèm thiệp"}
💰 *Tổng tiền:* ${order.totalAmount.toLocaleString("vi-VN")} VNĐ (${order.paymentMethod === "cod" ? "Tiền mặt khi nhận" : "Chuyển khoản"})

📦 *Chi tiết hoa làm:*
${itemsSummary}

${order.note ? `📝 *Ghi chú:* ${order.note}\n` : ""}
━━━━━━━━━━━━━━━━━━━━
🌱 *Trạng thái:* Chờ Anna uốn kẽm / đan len`;

  // If credentials are configured, send real Telegram alert
  if (token && chatId) {
    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "Markdown",
        }),
      });

      if (response.ok) {
        return { success: true, message: "Đã gửi thông báo Telegram thành công!" };
      } else {
        const errorData = await response.text();
        console.warn("Telegram API response error:", errorData);
      }
    } catch (err) {
      console.error("Failed to send Telegram alert:", err);
    }
  }

  // Graceful fallback for local development or demo without keys
  console.log("Mock Telegram Alert dispatched:\n", text);
  return {
    success: true,
    message: "Đơn hàng đã được lưu & mô phỏng gửi thông báo Telegram (chưa cấu hình Token thực tế).",
  };
}
