import { NextResponse } from "next/server";
import { getStoredStems, addStoredStem, deleteStoredStem } from "@/data/stemsStore";
import { StemOption } from "@/types";

export async function GET() {
  const stems = getStoredStems();
  return NextResponse.json({ success: true, stems });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newStem: StemOption = {
      id: `stem-custom-${Date.now()}`,
      name: body.name || "Cành Hoa Mới",
      flowerType: body.flowerType || "kem-nhung",
      price: Number(body.price) || 25000,
      color: body.color || "Tự nhiên",
      colorHex: body.colorHex || "#FFB7B2",
      image: body.image || "🌸",
      imageUrl: body.imageUrl,
      meaning: body.meaning || "Hoa tự bó thủ công",
    };

    const added = addStoredStem(newStem);
    return NextResponse.json({ success: true, stem: added });
  } catch (error) {
    console.error("Error creating custom stem:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi thêm cành hoa" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID cành hoa" }, { status: 400 });
    }
    const deleted = deleteStoredStem(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("Error deleting stem:", error);
    return NextResponse.json({ success: false, message: "Lỗi xóa cành hoa" }, { status: 500 });
  }
}
