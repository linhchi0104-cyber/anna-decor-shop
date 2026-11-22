"use client";

import { useState, useRef, useEffect } from "react";
import MascotAvatar from "@/components/common/MascotAvatar";
import { sound } from "@/utils/sound";
import { ChatMessage } from "@/types";
import { Send, X, Sparkles, ShoppingBag, Clock, CheckCircle2 } from "lucide-react";

interface MascotChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderModal?: () => void;
}

export default function MascotChatbot({
  isOpen,
  onClose,
  onOpenOrderModal,
}: MascotChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content:
        "Em Bé Mầm của Anna Decor xin chào bạn ạ ~ 🌸✨\nBạn đang muốn tìm mẫu hoa kẽm nhung, hoa len hay hoa sáp để tặng ai nè? Hoặc bạn cần tư vấn hoa theo ngân sách sinh viên hay cung hoàng đạo thì cứ nhắn cho Bé Mầm nha! 💖",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    { label: "Tặng Crush 🌷", query: "Tư vấn hoa tặng crush tỏ tình ngọt ngào" },
    { label: "Dưới 100k 💛", query: "Có mẫu hoa nào giá sinh viên dưới 100k không Bé Mầm?" },
    { label: "Cần gấp trong ngày ⏰", query: "Mình cần hoa gấp trong ngày hôm nay thì có kịp không?" },
    { label: "Sinh nhật bạn thân 🌻", query: "Tư vấn bó hoa tặng sinh nhật bạn thân" },
    { label: "Địa chỉ tiệm 📍", query: "Tiệm Anna Decor ở đâu vậy bạn?" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customQuery?: string) => {
    const textToSend = customQuery || input.trim();
    if (!textToSend || isLoading) return;

    sound.playPop();
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userMessage: textToSend,
        }),
      });

      const data = await res.json();
      sound.playChime();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.content || "Bé Mầm xin lỗi, bạn nhắn lại giúp em nha! 🌸",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        orderData: data.orderData,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content:
            "Ôi bé mầm đang bận tưới kẽm nhung xíu xiu ~ Bạn có thể kết nối Zalo tiệm 0763.679.601 để được tư vấn siêu nhanh nha! 🌸✨",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-white/95 backdrop-blur-md rounded-5xl border-3 border-pastel-pink shadow-kawaii-hover flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-pastel-pink via-pastel-rose to-pastel-pink px-4 py-3 border-b border-pastel-pink flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MascotAvatar size="sm" expression="wink" />
          <div>
            <h3 className="font-black text-sm text-pastel-choco flex items-center gap-1">
              Bé Mầm Anna AI <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            </h3>
            <span className="text-[10px] text-pastel-choco/80 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sẵn sàng tư vấn & chốt đơn
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="p-1.5 rounded-full hover:bg-white/40 text-pastel-choco transition-colors"
          aria-label="Đóng chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Handmade Reminder Strip */}
      <div className="bg-pastel-butter/60 px-3 py-1.5 border-b border-amber-200 text-[11px] font-semibold text-pastel-choco flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Hoa kẽm nhung & len uốn tay cần đặt trước 1-2 ngày nha bạn ơi! 🌸</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#FFFDF9] to-[#FFF5F8]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                m.role === "user"
                  ? "bg-pastel-pinkDark text-white rounded-br-none"
                  : "bg-white text-pastel-choco border border-pastel-pink/60 rounded-bl-none"
              }`}
            >
              {m.content}
            </div>

            {/* Special Order Receipt Card if order created */}
            {m.orderData && (
              <div className="mt-2 w-full bg-pastel-mint/30 border-2 border-dashed border-pastel-mintDark rounded-3xl p-3 text-xs text-pastel-choco space-y-1.5 shadow-sm">
                <div className="flex items-center gap-1.5 font-black text-emerald-800 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã ghi nhận đơn hàng {m.orderData.id}!</span>
                </div>
                <p>👤 <strong>Khách:</strong> {m.orderData.customerName} ({m.orderData.phone})</p>
                <p>📍 <strong>Giao tới:</strong> {m.orderData.address}</p>
                <p>⏰ <strong>Hẹn ngày:</strong> {m.orderData.deliveryDate} ({m.orderData.deliveryTimeSlot})</p>
                <p className="text-[11px] text-pastel-subtext italic">
                  🔔 Hệ thống đã tự động bắn tin nhắn thông báo về Telegram cho chị chủ Anna Decor uốn hoa rồi nha!
                </p>
              </div>
            )}

            <span className="text-[10px] text-pastel-subtext mt-1 px-1">
              {m.timestamp}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-pastel-subtext italic">
            <span className="animate-spin text-base">🌱</span>
            <span>Bé Mầm đang suy nghĩ câu trả lời kute nhất...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Chips Bar */}
      <div className="px-3 py-2 bg-white border-t border-pastel-pink/30 overflow-x-auto flex gap-1.5 no-scrollbar">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.query)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-bold bg-pastel-pink/30 hover:bg-pastel-pink/70 text-pastel-choco transition-all border border-pastel-pink/50"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-pastel-pink/40 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhắn tin với Bé Mầm..."
          className="flex-1 px-4 py-2.5 rounded-full border border-pastel-pink/60 focus:outline-none focus:ring-2 focus:ring-pastel-pink text-xs sm:text-sm text-pastel-choco bg-pastel-warmBg"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-full bg-pastel-pinkDark hover:bg-rose-500 text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          aria-label="Gửi tin nhắn"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
