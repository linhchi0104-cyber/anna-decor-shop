import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/common/CustomCursor";

export const metadata: Metadata = {
  title: "Anna Decor - Tiệm Hoa Thủ Công & Quà Tặng Xinh Xắn Đà Nẵng",
  description:
    "Gói ghém yêu thương qua từng cánh hoa thủ công. Hoa kẽm nhung uốn tay, hoa móc len vintage, hoa sáp thơm túi quà trong suốt kèm đèn led tại Đà Nẵng. Hotline/Zalo: 0763.679.601.",
  keywords: [
    "hoa kẽm nhung",
    "hoa kẽm nhung đà nẵng",
    "hoa móc len",
    "hoa sáp thơm",
    "anna decor",
    "tiệm hoa thủ công",
    "quà tặng sinh viên",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Quicksand:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen selection:bg-pastel-pink font-quicksand">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
