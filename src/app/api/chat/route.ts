import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { PRODUCTS, SHOP_INFO } from "@/data/products";
import { getStoredGeminiApiKey, getStoredProducts } from "@/data/productsStore";
import { addOrder } from "@/data/ordersStore";
import { sendTelegramNotification } from "@/utils/telegram";
import { Order } from "@/types";

const SYSTEM_PROMPT = `
Bạn là "Bé Mầm Anna" 🌱🌸 - linh vật kiêm nhân viên tư vấn siêu dễ thương của tiệm hoa thủ công "Anna Decor" tại K317/23 Nguyễn Phước Nguyên, P. An Khê, Q. Thanh Khê, Đà Nẵng (Hotline/Zalo: 0763.679.601).
Slogan của tiệm: "Gói ghém yêu thương qua từng cánh hoa thủ công".

TÍNH CÁCH & XƯNG HÔ:
- Luôn xưng: "Em Bé Mầm của Anna Decor ạ ~" hoặc "Bé Mầm xin chào bạn nè ~".
- Giọng điệu ngọt ngào, ấm áp, kute đậm chất Gen Z, dùng nhiều emoji dễ thương (🌸✨🐰💖🌻🧶).
- Luôn nhiệt tình, lễ phép, tư vấn chính xác từng mẫu hoa, giá cả và thời gian giao nhận.

THÔNG TIN QUAN TRỌNG VỀ TIỆM ANNA DECOR:
1. Địa bàn phục vụ & Giao nhận:
   - Giao hoa tận nơi TOÀN QUỐC (trên khắp 63 tỉnh/thành Việt Nam như Hà Nội, TP.HCM, Đà Nẵng, Huế, Hải Phòng, Cần Thơ,...) bằng đóng gói chống sốc chuyên dụng.
   - Hoặc khách có thể ghé trực tiếp shop tại Đà Nẵng (K317/23 Nguyễn Phước Nguyên, Thanh Khê) để nhận hoa.
2. Khung giờ nhận hoa:
   - Từ 06:00 sáng đến 21:00 tối mỗi ngày, khách có thể hẹn chính xác giờ và phút nhận hoa.
3. Các gói đặt cọc & thanh toán linh hoạt:
   - Cọc 20%, Cọc 30%, Cọc 50%, Trả đủ 100% qua mã quét VietQR tự động.
   - Hoặc chọn Ship COD / Nhận hàng thanh toán tại shop.
4. Thời gian làm hoa thủ công (RẤT QUAN TRỌNG):
   - Luôn nhắc nhở thân thiện: "Hoa kẽm nhung và hoa len do thợ uốn tay 100% nên tiệm cần 1-2 ngày để hoàn thiện chỉn chu nhất ạ. Nếu bạn cần gấp trong ngày, tiệm có sẵn các mẫu hoa sáp thơm túi quà mica hoặc chậu mầm mini nha!"
5. Studio Tự Bó Hoa Tặng Crush:
   - Khách có thể tự phối từng mặt hoa kẽm nhung, hoa len, giấy gói pastel, nơ ruy băng và tự do KÉO THẢ sắp xếp trên bó hoa nghiêng góc 70 độ siêu chân thực!
6. Bảng giá tham khảo:
   - Bó Hướng Dương Mặt Trời Nhỏ: 95.000đ
   - Bó Tulip Pastel Tình Đầu: 135.000đ
   - Bó Cúc Họa Mi Kẽm Nhung: 85.000đ
   - Chậu Cây Mầm Chibi Má Hồng: 49.000đ
   - Bó Hoa Hồng Móc Len Vintage: 180.000đ
   - Bó Hoa Sáp Thơm Đèn LED Túi Trong: 115.000đ
`;

// Declarations for Gemini Function Calling
const flowerTools = [
  {
    functionDeclarations: [
      {
        name: "get_flower_catalog",
        description: "Lấy danh sách các mẫu hoa thủ công hiện có của tiệm Anna Decor theo danh mục hoặc mức giá",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            category: {
              type: SchemaType.STRING,
              description: "Danh mục hoa: 'kem-nhung', 'moc-len', 'hoa-sap', 'decor' hoặc 'all'",
            },
            maxPrice: {
              type: SchemaType.NUMBER,
              description: "Mức ngân sách tối đa (VNĐ)",
            },
          },
        },
      },
      {
        name: "submit_order",
        description: "Chốt đơn hàng hoa thủ công và tự động bắn thông báo về Telegram của chủ tiệm Anna Decor",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            customerName: { type: SchemaType.STRING, description: "Tên khách hàng" },
            phone: { type: SchemaType.STRING, description: "Số điện thoại hoặc Zalo" },
            address: { type: SchemaType.STRING, description: "Địa chỉ nhận hoa toàn quốc hoặc 'ghé shop lấy'" },
            flowerName: { type: SchemaType.STRING, description: "Tên mẫu hoa khách đặt" },
            cardMessage: { type: SchemaType.STRING, description: "Lời nhắn ghi trên thiệp chibi" },
            deliveryDate: { type: SchemaType.STRING, description: "Ngày hẹn giao (YYYY-MM-DD)" },
            deliveryTimeSlot: { type: SchemaType.STRING, description: "Khung giờ giao (06:00 - 21:00)" },
            totalAmount: { type: SchemaType.NUMBER, description: "Tổng tiền đơn hàng" },
          },
          required: ["customerName", "phone", "flowerName"],
        },
      },
    ],
  },
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, userMessage } = body;
    const clientKey = req.headers.get("x-gemini-key") || body?.apiKey;
    const apiKey = (clientKey && clientKey.trim()) || getStoredGeminiApiKey() || process.env.GEMINI_API_KEY;

    // IF GEMINI API KEY IS CONFIGURED
    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Using gemini-1.5-flash for super fast and responsive chat
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: SYSTEM_PROMPT,
          tools: flowerTools as any,
        });

        // Build history
        const chatHistory = (messages || []).slice(-8).map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

        const chat = model.startChat({
          history: chatHistory,
        });

        const result = await chat.sendMessage(userMessage);
        const response = result.response;

        // Check if model called a function
        const functionCalls = response.functionCalls();
        if (functionCalls && functionCalls.length > 0) {
          const call = functionCalls[0];
          if (call.name === "get_flower_catalog") {
            const currentProds = getStoredProducts();
            const catalogSummary = currentProds.map(
              (p) => `${p.name} (${p.categoryName}) - ${p.price.toLocaleString("vi-VN")}đ`
            ).join(", ");
            const followUp = await chat.sendMessage([
              {
                functionResponse: {
                  name: "get_flower_catalog",
                  response: { catalog: catalogSummary },
                },
              },
            ]);
            const replyText = followUp.response.text();
            return NextResponse.json({
              reply: replyText,
              content: replyText,
              source: "gemini_ai",
            });
          } else if (call.name === "submit_order") {
            const args = call.args as any;
            const newOrder: Order = {
              id: `ANNA-${Math.floor(1000 + Math.random() * 9000)}`,
              customerName: args.customerName,
              phone: args.phone,
              address: args.address || "K317/23 Nguyễn Phước Nguyên, Đà Nẵng",
              deliveryType: args.address?.toLowerCase().includes("tiệm") || args.address?.toLowerCase().includes("shop") ? "pickup" : "delivery",
              deliveryDate: args.deliveryDate || new Date().toISOString().split("T")[0],
              deliveryTimeSlot: args.deliveryTimeSlot || "09:00",
              cardMessage: args.cardMessage || "",
              items: [
                {
                  id: "order-from-ai",
                  name: args.flowerName,
                  price: args.totalAmount || 120000,
                  quantity: 1,
                  type: "standard",
                },
              ],
              totalAmount: args.totalAmount || 120000,
              depositAmount: Math.round((args.totalAmount || 120000) * 0.5),
              status: "pending",
              paymentMethod: "deposit_50",
              paymentStatus: "unpaid",
              createdAt: new Date().toISOString(),
              note: "Khách chốt đơn qua Chatbot Bé Mầm",
            };

            addOrder(newOrder);
            await sendTelegramNotification(newOrder);

            const followUp = await chat.sendMessage([
              {
                functionResponse: {
                  name: "submit_order",
                  response: {
                    success: true,
                    orderId: newOrder.id,
                    message: "Đơn hàng đã được lưu và gửi tới thợ làm hoa!",
                  },
                },
              },
            ]);

            const replyText = followUp.response.text();
            return NextResponse.json({
              reply: replyText,
              content: replyText,
              orderCreated: newOrder,
              source: "gemini_ai",
            });
          }
        }

        const replyText = response.text();
        return NextResponse.json({
          reply: replyText,
          content: replyText,
          source: "gemini_ai",
        });
      } catch (geminiError: any) {
        console.warn("Gemini API call failed, falling back to smart local rules:", geminiError?.message);
      }
    }

    // SMART LOCAL FALLBACK (When API key not yet set or offline)
    const lower = (userMessage || "").toLowerCase();
    let reply = "";

    if (lower.includes("giá") || lower.includes("bao nhiêu") || lower.includes("tiền")) {
      reply =
        "Dạ tiệm em có nhiều mẫu hoa xinh giá học sinh sinh viên lắm nè 🌸:\n\n" +
        "🌻 Bó Hướng Dương Mặt Trời Nhỏ: 95.000đ\n" +
        "🌷 Bó Tulip Pastel Tình Đầu: 135.000đ\n" +
        "🌼 Bó Cúc Họa Mi Kẽm Nhung: 85.000đ\n" +
        "🌱 Chậu Cây Mầm Chibi Má Hồng: 49.000đ\n" +
        "🧶 Bó Hoa Hồng Móc Len Vintage: 180.000đ\n" +
        "🎁 Bó Hoa Sáp Thơm Đèn LED: 115.000đ\n\n" +
        "Bạn thích mẫu nào để Bé Mầm tư vấn kỹ hơn nha! ✨";
    } else if (lower.includes("crush") || lower.includes("người yêu") || lower.includes("tỏ tình")) {
      reply =
        "Ôi tặng Crush là phải ngọt ngào và ấn tượng nè! 💖 Em gợi ý bạn mẫu **Bó Tulip Pastel Tình Đầu (135k)** hoặc ghé ngay **Studio Tự Bó Hoa Tặng Crush** ở trang chủ để tự tay chọn từng bông tulip, hoa chuông và kéo thả cắm hoa theo ý thích nhé. Crush nhận được bó hoa uốn tay đảm bảo đổ gục luôn ạ! 🌷✨";
    } else if (lower.includes("thời gian") || lower.includes("mấy ngày") || lower.includes("làm hoa") || lower.includes("gấp")) {
      reply =
        "Dạ hoa kẽm nhung và hoa len đều do các bạn thợ tại Anna Decor uốn tay 100% từng cánh, nên tiệm cần **1-2 ngày** để hoàn thiện đẹp nhất ạ! 🌸\n" +
        "Nếu bạn cần hoa gấp trong ngày, tiệm luôn có sẵn các mẫu hoa sáp thơm túi mica trong suốt và chậu mầm xinh xắn nha! Tiệm mở cửa giao hoa từ **06:00 đến 21:00** hàng ngày ạ. ⏰";
    } else if (lower.includes("ship") || lower.includes("giao") || lower.includes("địa chỉ")) {
      reply =
        "Dạ tiệm em nhận giao hoa tận nơi **trên toàn quốc (Việt Nam)** luôn đó ạ! 🛵📦 Tiệm đóng gói hộp carton cứng chống sốc siêu cẩn thận. Hoặc nếu bạn ở Đà Nẵng, bạn có thể ghé trực tiếp shop tại **K317/23 Nguyễn Phước Nguyên, Thanh Khê** để nhận hoa nha! 🌸";
    } else if (lower.includes("cọc") || lower.includes("thanh toán") || lower.includes("chuyển khoản")) {
      reply =
        "Dạ tiệm có 5 gói đặt hàng rất linh hoạt ạ 🌸:\n" +
        "1. Cọc trước 20%\n" +
        "2. Cọc trước 30%\n" +
        "3. Cọc trước 50% (Phổ biến nhất)\n" +
        "4. Trả đủ 100% qua quét mã VietQR tự động\n" +
        "5. Hoặc Ship COD / nhận hàng thanh toán tại shop ạ! ✨";
    } else {
      reply =
        "Dạ em Bé Mầm xin chào bạn ạ ~ 🌸 Tiệm hoa thủ công Anna Decor tụi em chuyên hoa kẽm nhung uốn tay, hoa móc len vintage và hoa sáp thơm vĩnh cửu. Bạn cần tìm hoa tặng bạn bè, sinh nhật, tặng crush hay tự tay bó hoa, cứ nhắn Bé Mầm hỗ trợ liền nha! 💖";
    }

    return NextResponse.json({
      reply,
      content: reply,
      source: "local_rules",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    const fallbackText = "Dạ Bé Mầm xin chào bạn nha ~ 🌸 Tiệm hoa Anna Decor sẵn sàng tư vấn hoa kẽm nhung & hoa len cho bạn ạ!";
    return NextResponse.json({
      reply: fallbackText,
      content: fallbackText,
      source: "fallback",
    });
  }
}
