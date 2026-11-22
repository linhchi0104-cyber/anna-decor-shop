import { NextResponse } from "next/server";
import { getStoredReviews, addStoredReview, deleteStoredReview, CustomerReviewItem } from "@/data/reviewsStore";

export async function GET() {
  const reviews = getStoredReviews();
  return NextResponse.json({ success: true, reviews });
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Thiếu ID" }, { status: 400 });
    const success = deleteStoredReview(id);
    return NextResponse.json({ success });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Lỗi xóa đánh giá" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newReview: CustomerReviewItem = {
      id: `rev-${Date.now()}`,
      name: body.name || "Khách hàng dễ thương",
      comment: body.comment || "Hoa của Anna Decor siêu xinh xắn luôn ạ!",
      stars: Number(body.stars) || 5,
      item: body.item || "Bó hoa thủ công",
      sticker: body.sticker || "🥰",
      stickerLabel: body.stickerLabel || "Hạnh phúc",
      image:
        body.image ||
        "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=600&q=80",
      date: new Date().toLocaleDateString("vi-VN"),
    };

    addStoredReview(newReview);
    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi gửi lưu bút" },
      { status: 500 }
    );
  }
}
