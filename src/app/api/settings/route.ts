import { NextResponse } from "next/server";
import {
  getStoredBankConfig,
  updateStoredBankConfig,
  getStoredSettings,
  updateStoredSettings,
  getStoredVouchers,
  addStoredVoucher,
  deleteStoredVoucher,
} from "@/data/productsStore";

export async function GET() {
  const bankConfig = getStoredBankConfig();
  const settings = getStoredSettings();
  const vouchers = getStoredVouchers();
  return NextResponse.json({
    success: true,
    bankConfig,
    settings: {
      hasGeminiApiKey: Boolean(settings.geminiApiKey || process.env.GEMINI_API_KEY),
      geminiApiKey: settings.geminiApiKey ? `${settings.geminiApiKey.slice(0, 8)}...` : "",
      geminiModel: settings.geminiModel || process.env.GEMINI_MODEL || "gemini-2.0-flash-lite",
      shopOpen: settings.shopOpen ?? true,
    },
    vouchers,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Bank config
    if (body.bankConfig) {
      updateStoredBankConfig(body.bankConfig);
    } else if (body.bankName || body.accountNumber) {
      updateStoredBankConfig(body);
    }

    // 2. Gemini API Key, Model or Shop Settings
    if (body.geminiApiKey !== undefined || body.geminiModel !== undefined || body.shopOpen !== undefined) {
      updateStoredSettings({
        geminiApiKey: body.geminiApiKey,
        geminiModel: body.geminiModel,
        shopOpen: body.shopOpen,
      });
    }

    // 3. New Voucher
    if (body.newVoucher) {
      addStoredVoucher(body.newVoucher);
    }

    // 4. Delete Voucher
    if (body.deleteVoucherCode) {
      deleteStoredVoucher(body.deleteVoucherCode);
    }

    const bankConfig = getStoredBankConfig();
    const settings = getStoredSettings();
    const vouchers = getStoredVouchers();

    return NextResponse.json({
      success: true,
      bankConfig,
      settings: {
        hasGeminiApiKey: Boolean(settings.geminiApiKey || process.env.GEMINI_API_KEY),
        geminiApiKey: settings.geminiApiKey ? `${settings.geminiApiKey.slice(0, 8)}...` : "",
        geminiModel: settings.geminiModel || process.env.GEMINI_MODEL || "gemini-2.0-flash-lite",
        shopOpen: settings.shopOpen ?? true,
      },
      vouchers,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi cập nhật cấu hình hệ thống" },
      { status: 500 }
    );
  }
}
