import { NextResponse } from "next/server";
import {
  getStoredProducts,
  addStoredProduct,
  updateStoredProduct,
  deleteStoredProduct,
} from "@/data/productsStore";
import { Product } from "@/types";

export async function GET() {
  const products = getStoredProducts();
  return NextResponse.json({ success: true, products });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProduct: Product = {
      id: body.id || `custom-${Date.now()}`,
      name: body.name || "Mẫu Hoa Mới",
      category: body.category || "kem-nhung",
      categoryName:
        body.category === "kem-nhung"
          ? "Hoa Kẽm Nhung"
          : body.category === "moc-len"
          ? "Hoa Móc Len"
          : body.category === "hoa-sap"
          ? "Hoa Sáp Thơm"
          : "Phụ Kiện Decor",
      price: Number(body.price) || 99000,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      image:
        body.image ||
        "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=700&q=80",
      badge: body.badge || "Mới Ra Mắt ✨",
      description: body.description || "Hoa thủ công làm tay 100% tại Anna Decor Đà Nẵng.",
      materials: body.materials || ["Kẽm nhung mềm mịn", "Giấy gói pastel", "Nơ xinh"],
      dimensions: body.dimensions || "Cao 30cm",
      craftTime: body.craftTime || "1-2 ngày",
      stock: body.stock !== undefined ? Number(body.stock) : 10,
      rating: 5.0,
      reviewCount: 1,
      featured: Boolean(body.featured),
      bestseller: Boolean(body.bestseller),
    };

    addStoredProduct(newProduct);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi thêm sản phẩm" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Thiếu ID sản phẩm" },
        { status: 400 }
      );
    }

    const updated = updateStoredProduct(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật sản phẩm" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Thiếu ID sản phẩm cần xóa" },
        { status: 400 }
      );
    }

    const success = deleteStoredProduct(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa sản phẩm" },
      { status: 500 }
    );
  }
}
