"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import ProductCatalog from "@/components/home/ProductCatalog";
import BouquetBuilder from "@/components/home/BouquetBuilder";
import HandwrittenCardCreator from "@/components/home/HandwrittenCardCreator";
import StorySection from "@/components/home/StorySection";
import CustomerReviews from "@/components/home/CustomerReviews";
import FloatingContacts from "@/components/common/FloatingContacts";
import FloatingStickers from "@/components/common/FloatingStickers";
import MascotChatbot from "@/components/chat/MascotChatbot";
import OrderModal from "@/components/order/OrderModal";
import OrderLookupModal from "@/components/order/OrderLookupModal";
import ProductDetailModal from "@/components/product/ProductDetailModal";
import { Product, CustomBouquet } from "@/types";
import { sound } from "@/utils/sound";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCustomBouquet, setSelectedCustomBouquet] = useState<CustomBouquet | null>(null);
  const [attachedCardMessage, setAttachedCardMessage] = useState<string>("");
  const [cartCount, setCartCount] = useState(0);

  // Open chat
  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  // Select product for detail modal
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  // Direct order standard product
  const handleDirectOrder = (product: Product) => {
    setSelectedProduct(product);
    setSelectedCustomBouquet(null);
    setIsOrderModalOpen(true);
    setCartCount((c) => c + 1);
  };

  // Checkout custom bouquet built in BouquetBuilder
  const handleCheckoutCustomBouquet = (bouquet: CustomBouquet) => {
    setSelectedCustomBouquet(bouquet);
    setSelectedProduct(null);
    setIsOrderModalOpen(true);
    setCartCount((c) => c + 1);
  };

  // Attach handwritten card to current order
  const handleAttachCardMessage = (msg: string) => {
    setAttachedCardMessage(msg);
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-pastel-cream">
      {/* Background Floating Kawaii Stickers */}
      <FloatingStickers />

      {/* Header */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsOrderModalOpen(true)}
        onOpenChat={handleOpenChat}
        onOpenLookup={() => setIsLookupModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Banner */}
        <HeroBanner
          onOpenChat={handleOpenChat}
          onExploreProducts={() => handleScrollToSection("products")}
          onOpenBouquetBuilder={() => handleScrollToSection("bouquet-builder")}
        />

        {/* Product Catalog with Bloom Effect */}
        <ProductCatalog
          onSelectProduct={handleSelectProduct}
          onDirectOrder={handleDirectOrder}
        />

        {/* Mini-game DIY "Tự Bó Hoa Tặng Crush" (Bouquet Builder Studio 2.0) */}
        <BouquetBuilder onCheckoutCustomBouquet={handleCheckoutCustomBouquet} />

        {/* Handwritten Card Creator */}
        <HandwrittenCardCreator onAttachToOrder={handleAttachCardMessage} />

        {/* Interactive Wall of Love (Hơn 500+ nụ cười hạnh phúc & Khoe ảnh hoa) */}
        <CustomerReviews />

        {/* Brand Story of Anna Decor */}
        <StorySection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons (Zalo, Messenger, Chatbot) */}
      <FloatingContacts onOpenChat={handleOpenChat} />

      {/* Gemini AI Chatbot "Bé Mầm" Drawer */}
      <MascotChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
      />

      {/* Order Modal with Confetti & VietQR */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedProduct}
        customBouquet={selectedCustomBouquet}
        attachedCardMessage={attachedCardMessage}
      />

      {/* Order Lookup Modal for Customers */}
      <OrderLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOrderNow={handleDirectOrder}
      />
    </div>
  );
}
