import { Product, ShopBankConfig } from "@/types";
import { INITIAL_PRODUCTS, DEFAULT_BANK_CONFIG } from "./products";

export interface AppSettings {
  geminiApiKey?: string;
  shopOpen?: boolean;
}

export interface Voucher {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  quantity: number;
  active: boolean;
}

const INITIAL_VOUCHERS: Voucher[] = [
  { code: "ANNA10", type: "percent", value: 10, minOrder: 100000, quantity: 50, active: true },
  { code: "CRUSH20K", type: "fixed", value: 20000, minOrder: 150000, quantity: 30, active: true },
  { code: "VALENTINE", type: "percent", value: 15, minOrder: 200000, quantity: 20, active: true },
];

declare global {
  // eslint-disable-next-line no-var
  var __annaProducts: Product[] | undefined;
  // eslint-disable-next-line no-var
  var __annaBankConfig: ShopBankConfig | undefined;
  // eslint-disable-next-line no-var
  var __annaSettings: AppSettings | undefined;
  // eslint-disable-next-line no-var
  var __annaVouchers: Voucher[] | undefined;
}

export function getStoredProducts(): Product[] {
  if (!global.__annaProducts) {
    global.__annaProducts = [...INITIAL_PRODUCTS];
  }
  return global.__annaProducts;
}

export function addStoredProduct(product: Product): Product {
  const products = getStoredProducts();
  products.unshift(product);
  return product;
}

export function updateStoredProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    return products[index];
  }
  return null;
}

export function deleteStoredProduct(id: string): boolean {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products.splice(index, 1);
    return true;
  }
  return false;
}

export function getStoredBankConfig(): ShopBankConfig {
  if (!global.__annaBankConfig) {
    global.__annaBankConfig = { ...DEFAULT_BANK_CONFIG };
  }
  return global.__annaBankConfig;
}

export function updateStoredBankConfig(updates: Partial<ShopBankConfig>): ShopBankConfig {
  const current = getStoredBankConfig();
  global.__annaBankConfig = { ...current, ...updates };
  return global.__annaBankConfig;
}

export function getStoredSettings(): AppSettings {
  if (!global.__annaSettings) {
    global.__annaSettings = {
      geminiApiKey: process.env.GEMINI_API_KEY || "",
      shopOpen: true,
    };
  }
  return global.__annaSettings;
}

export function updateStoredSettings(updates: Partial<AppSettings>): AppSettings {
  const current = getStoredSettings();
  global.__annaSettings = { ...current, ...updates };
  return global.__annaSettings;
}

export function getStoredGeminiApiKey(): string {
  const settings = getStoredSettings();
  return settings.geminiApiKey || process.env.GEMINI_API_KEY || "";
}

export function getStoredVouchers(): Voucher[] {
  if (!global.__annaVouchers) {
    global.__annaVouchers = [...INITIAL_VOUCHERS];
  }
  return global.__annaVouchers;
}

export function addStoredVoucher(v: Voucher): Voucher {
  const list = getStoredVouchers();
  list.unshift(v);
  return v;
}

export function deleteStoredVoucher(code: string): boolean {
  const list = getStoredVouchers();
  const idx = list.findIndex((item) => item.code.toUpperCase() === code.toUpperCase());
  if (idx !== -1) {
    list.splice(idx, 1);
    return true;
  }
  return false;
}
