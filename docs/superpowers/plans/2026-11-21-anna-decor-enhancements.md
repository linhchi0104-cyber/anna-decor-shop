# Kế hoạch Nâng Cấp Toàn Diện Shop Hoa Anna Decor

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện 10 yêu cầu nâng cấp tính năng cho khách hàng và quyền quản trị tiệm hoa Anna Decor, dọn dẹp mã nguồn, và chuẩn bị hướng dẫn đưa lên GitHub và Host web.

**Architecture:** 
- Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion.
- Quản lý trạng thái: Client state + In-memory API routes (`/api/orders`, `/api/products`, `/api/settings`, `/api/chat`, `/api/stems`).
- Studio bó hoa: 70° tilt canvas với Framer Motion Drag & Drop cho từng mặt hoa.
- Admin Panel: Công cụ xóa phông Canvas, quản lý cành hoa Studio, cấu hình API Gemini, xuất Excel/CSV, in đơn, quản lý voucher và mật khẩu mặc định 010491.

---

## Danh Sách Nhiệm Vụ (Task Breakdown)

### Task 1: Cập nhật Mật khẩu Admin & Bỏ gợi ý PIN (Yêu cầu 9)
- Sửa file `src/app/admin/page.tsx`, `.env.local`, `.env.local.example`.
- Bỏ placeholder nhắc pass `(Mặc định: 123456)`.
- Đổi mã PIN mặc định thành `010491`.

### Task 2: Nâng cấp Form Đặt Hoa & Thanh toán Cọc (Yêu cầu 1, 2, 3, 4)
- **Thanh toán cọc dạng thanh cuộn (Horizontal Scroll / Selector):** 20%, 30%, 50%, 100%, Ship COD / Nhận hàng thanh toán tại shop. Tự động tính tiền cọc và cập nhật VietQR.
- **Khung giờ nhận hoa:** Thay thế hoàn toàn bằng bộ chọn thời gian chính xác (06:00 - 21:00) với giờ và phút.
- **Địa chỉ giao hoa:** Hỗ trợ giao hoa toàn quốc Việt Nam (63 tỉnh/thành hoặc nhập địa chỉ chi tiết toàn quốc) và tùy chọn "Ghé nhận tại shop (K317/23 Nguyễn Phước Nguyên, Đà Nẵng)".
- **Mã VietQR:** Hiển thị tự động, rõ nét, tối ưu cho khách chụp màn hình chuyển khoản; lược bỏ các nút chia sẻ trả hộ không cần thiết.

### Task 3: Bộ Sưu Tập Thủ Công: 8 hoa/trang, Phân trang, Xem thêm bên cạnh, Zoom x2 & Xoay 45° (Yêu cầu 5)
- Giới hạn 8 sản phẩm/trang, có thanh phân trang và nút chuyển trang bên cạnh.
- Thêm chức năng **Zoom x2 (Kính lúp / Phóng to chi tiết)** khi xem sản phẩm.
- Thêm nút/chức năng **Xoay trái/phải 45 độ** (-45°, 0°, +45°) để khách ngắm mẫu hoa ở nhiều góc độ.

### Task 4: Studio "Tự Bó Hoa Tặng Crush": Góc nghiêng 70° & Kéo Thả Sắp Xếp Mặt Hoa (Yêu cầu 6)
- Cập nhật góc phối hoa nghiêng hướng lên 70 độ (Isometric / 70° tilt perspective) để chỉ cần mặt hoa là cắm vào bó cực kỳ tự nhiên.
- Kích hoạt Kéo thả (Drag & Drop với Framer Motion) cho từng mặt hoa trên bó, cho phép khách tự tay di chuyển, sắp xếp bố cục tự do.

### Task 5: Admin Tool Xóa Phông Cành Hoa & Nạp vào Studio (Yêu cầu 7)
- Xây dựng công cụ **Tách phông nền Canvas** (Magic wand / Background remover) ngay trong trang Admin.
- Cho phép Admin tải ảnh mặt hoa lên, tẩy nền trong suốt, xem trước góc nghiêng 70°, đặt giá & tên cành, và 1-click lưu vào Studio để khách tự bó.

### Task 6: Cấu hình Gemini API Key & Nâng cấp Chatbot Bé Mầm (Yêu cầu 10)
- Thêm ô nhập và lưu Gemini API Key ngay trên giao diện Admin (`/admin`).
- Tối ưu hóa System Prompt của Bé Mầm trong `api/chat/route.ts` để chatbot trả lời chính xác thông tin tiệm, giá bán, gói cọc, ship toàn quốc, thời gian làm hoa thủ công (1-2 ngày).

### Task 7: Bộ Công Cụ Quản Trị Admin Toàn Diện (Yêu cầu 8)
- Thêm chức năng **Xuất danh sách đơn hàng ra file Excel / CSV UTF-8** cho shipper/kế toán.
- Thêm chức năng **In phiếu giao hàng mini (Print Order)** cho từng đơn để dán lên bó hoa.
- Thêm quản lý **Mã giảm giá (Voucher)**.
- Thêm quản lý **Kiểm duyệt đánh giá (Reviews Moderator)**.

### Task 8: Dọn Dẹp Mã Nguồn & Kiểm Thử Toàn Diện (Build Test)
- Rà soát toàn bộ dự án, xóa code thừa, kiểm tra TypeScript và chạy `npm run build`.

### Task 9: Hướng Dẫn Chi Tiết Đưa Lên GitHub & Triển Khai Hosting Web (Bước 2)
- Hướng dẫn khởi tạo git repo, commit, đẩy lên GitHub.
- Hướng dẫn triển khai miễn phí lên Vercel / Netlify với tên miền riêng.
