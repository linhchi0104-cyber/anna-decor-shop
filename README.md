# 🌸 Anna Decor - Tiệm Hoa Thủ Công & Quà Tặng Xinh Xắn (Handmade & Decor)

> **Slogan:** *"Gói ghém yêu thương qua từng cánh hoa thủ công"*  
> **Địa chỉ:** K317/23 Nguyễn Phước Nguyên, P. An Khê, Q. Thanh Khê, TP. Đà Nẵng  
> **Hotline / Zalo:** 0763.679.601  
> **Fanpage:** [Anna Decor (fb.com/Annadecor123)](https://fb.com/Annadecor123)

---

## 🎀 1. Các Tính Năng Mới Nâng Cấp Hoàn Thiện

1. **Thanh Toán Cọc & VietQR Tự Động:**
   - Hỗ trợ thanh cuộn ngang chọn các gói đặt cọc: **20%**, **30%**, **50%**, **100%** và **Ship COD / Nhận tại shop**.
   - Tự động sinh mã VietQR theo đúng số tiền cọc, số tài khoản và nội dung chuyển khoản để khách chụp màn hình thanh toán.
2. **Khung Giờ Nhận Hoa Chính Xác (06:00 - 21:00):**
   - Bộ chọn thời gian chính xác từng giờ và phút, phục vụ liên tục từ 06:00 sáng đến 21:00 tối mỗi ngày.
3. **Giao Hoa Toàn Quốc (Việt Nam) & Nhận Tại Shop:**
   - Hỗ trợ giao tận nơi trên 63 tỉnh/thành cả nước bằng đóng gói chống sốc chuyên dụng.
   - Hỗ trợ tùy chọn ghé lấy trực tiếp tại tiệm ở Đà Nẵng (K317/23 Nguyễn Phước Nguyên).
4. **Bộ Sưu Tập Thủ Công (8 Bó Hoa / Trang):**
   - Cố định 8 mẫu hoa / trang kèm thanh phân trang và nút xem thêm bên cạnh.
   - Chức năng **Zoom x2 (Kính lúp phóng to)** soi rõ từng đường nét uốn kẽm nhung và đan len.
   - Chức năng **Xoay 3D trái/phải 45 độ** (-45°, 0°, +45°) để ngắm hoa ở nhiều góc độ.
5. **Studio "Tự Bó Hoa Tặng Crush" (Góc Nghiêng 70° & Kéo Thả Sắp Xếp):**
   - Thiết kế phối hoa theo góc nghiêng hướng lên 70 độ chân thực, chỉ hiển thị mặt hoa mà không lộ cành thô.
   - Tự do **chạm và kéo thả (Drag & Drop)** từng mặt hoa trên khung vẽ để cắm và tạo hình bó hoa tùy thích.
6. **Admin: Công Cụ Xóa Phông Nền Cành Hoa (Background Remover Studio):**
   - Tải ảnh chụp mặt hoa thật → Tẩy nền trong suốt bằng **Đũa thần (Magic Wand)** hoặc **Cọ tẩy** → Xem trước góc 70° → 1-click nạp vào Studio cho khách cắm.
7. **Admin: Bộ Công Cụ Quản Trị Toàn Diện:**
   - **Xuất đơn hàng ra Excel / CSV UTF-8 (BOM):** Mở trực tiếp bằng Microsoft Excel trên Windows không bị lỗi font tiếng Việt.
   - **In Phiếu Giao Hoa Mini (Print Slip):** In khổ nhỏ dán lên hộp/bó hoa kèm thông tin khách và lời nhắn thiệp.
   - **Quản lý Mã Giảm Giá (Vouchers):** Tạo mã khuyến mãi (% hoặc số tiền).
   - **Kiểm duyệt Đánh Giá (Reviews):** Xem và ẩn/xóa phản hồi của khách hàng.
   - **Cấu hình Gemini AI API Key:** Nhập và lưu API Key của Gemini ngay trên giao diện web, kèm nút test kết nối trực tiếp.
8. **Bảo Mật Admin:**
   - Đã xóa thông báo gợi ý mật khẩu ở placeholder.
   - Mật khẩu mã PIN mặc định: **`010491`**.

---

## 🚀 2. Hướng Dẫn Đưa Lên GitHub & Triển Khai Web Hosting (Bước 2)

### A. Đưa Mã Nguồn Lên GitHub

1. **Cài đặt Git & Mở Terminal (PowerShell):**
   Mở terminal tại thư mục dự án `D:\du an web hoa kem nhung`.

2. **Khởi tạo Git repository & Tạo commit đầu tiên:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete anna decor web shop with 10 features, studio 70deg and admin suite"
   ```

3. **Tạo Repository mới trên GitHub:**
   - Đăng nhập vào tài khoản [GitHub](https://github.com).
   - Bấm nút **New Repository** (Tạo repo mới).
   - Đặt tên: `anna-decor-shop` (chọn **Public** hoặc **Private**).
   - Không tick chọn "Add a README file" (vì dự án đã có sẵn).
   - Bấm **Create repository**.

4. **Liên kết và đẩy mã nguồn lên GitHub:**
   ```bash
   # Đổi tên nhánh chính thành main
   git branch -M main

   # Thêm remote origin (thay YOUR_USERNAME bằng username GitHub của bạn)
   git remote add origin https://github.com/YOUR_USERNAME/anna-decor-shop.git

   # Đẩy code lên GitHub
   git push -u origin main
   ```

---

### B. Triển Khai Lên Nguồn Web (Deploy Web Hosting Miễn Phí)

Website được xây dựng bằng Next.js nên nền tảng tối ưu và nhanh nhất là **Vercel** (công ty sáng lập Next.js, hoàn toàn miễn phí):

1. **Đăng nhập Vercel:**
   - Truy cập [vercel.com](https://vercel.com) và chọn **Sign in with GitHub**.

2. **Import Dự Án:**
   - Bấm **Add New...** → **Project**.
   - Chọn kho `anna-decor-shop` vừa đẩy lên từ GitHub.

3. **Cấu Hình Biến Môi Trường (Environment Variables):**
   Trong mục **Environment Variables** trên Vercel, thêm các khóa:
   - `NEXT_PUBLIC_ADMIN_PIN`: `010491`
   - `GEMINI_API_KEY`: *(Mã API của bạn lấy từ [Google AI Studio](https://aistudio.google.com/app/apikey))*
   - `TELEGRAM_BOT_TOKEN`: *(Nếu dùng bot thông báo đơn)*
   - `TELEGRAM_CHAT_ID`: *(Nếu dùng bot thông báo đơn)*

4. **Bấm "Deploy":**
   - Vercel sẽ tự động build và cấp cho bạn một tên miền miễn phí cực đẹp dạng:  
     `https://anna-decor-shop.vercel.app`
   - Bạn có thể gắn tên miền riêng (ví dụ: `annadecor.vn`) trong mục Settings → Domains của Vercel hoàn toàn miễn phí.
