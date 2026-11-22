export interface CustomerReviewItem {
  id: string;
  name: string;
  comment: string;
  stars: number;
  item: string;
  sticker: string;
  stickerLabel?: string;
  image?: string;
  date: string;
}

export const initialReviews: CustomerReviewItem[] = [
  {
    id: "rev-01",
    name: "Khánh Linh (ĐH Sư Phạm ĐN)",
    comment: "Mình đặt bó tulip kẽm nhung tặng sinh nhật nhỏ bạn thân, mở túi quà ra cưng xỉu luôn á! Cánh hoa uốn bồng bềnh, lại có thiệp viết tay font tròn cute xỉu. 10/10!",
    stars: 5,
    item: "Bó Tulip Pastel 'Tình Đầu'",
    sticker: "🥰",
    stickerLabel: "Xỉu up xỉu down",
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=600&q=80",
    date: "20/11/2026",
  },
  {
    id: "rev-02",
    name: "Minh Triết (THPT Phan Châu Trinh)",
    comment: "Mua bó hướng dương để bàn học ôn thi tốt nghiệp, nhìn vào có động lực học bài hẳn. Giá siêu rẻ đối với học sinh tụi mình. Bé Mầm tư vấn cực dễ thương luôn ạ!",
    stars: 5,
    item: "Bó Hướng Dương Để Bàn",
    sticker: "🌻",
    stickerLabel: "Rạng rỡ",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80",
    date: "18/11/2026",
  },
  {
    id: "rev-03",
    name: "Thảo Vy & Hoàng Long",
    comment: "Bó hoa sáp thơm túi mica có đèn led phát sáng ban đêm lãng mạn dã man. Tặng crush xong người ta đồng ý làm người yêu luôn rồi nè tiệm ơi! Cảm ơn Anna Decor nha!",
    stars: 5,
    item: "Hoa Sáp Kèm Túi Mica & Đèn",
    sticker: "💖",
    stickerLabel: "Hạnh phúc",
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=80",
    date: "15/11/2026",
  },
  {
    id: "rev-04",
    name: "Bảo Ngọc (Hòa Khánh, ĐN)",
    comment: "Bó cúc họa mi đa sắc uốn tay chắc chắn, không bị rụng hay mất form. Tiệm giao hỏa tốc đóng gói túi chống nước rất chỉn chu. Sẽ tiếp tục ủng hộ!",
    stars: 5,
    item: "Bó Cúc Họa Mi Kẽm Nhung",
    sticker: "🌸",
    stickerLabel: "Vui sướng",
    image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80",
    date: "12/11/2026",
  },
  {
    id: "rev-05",
    name: "Hoài An (ĐH Kinh Tế ĐN)",
    comment: "Chậu mầm chibi có má hồng đặt trên bàn làm việc xua tan mọi mệt mỏi! Bạn cùng phòng thấy cưng quá cũng nhờ mình đặt thêm 2 bé nữa nè hihi.",
    stars: 5,
    item: "Chậu Cây Mầm Chibi Anna",
    sticker: "🌱",
    stickerLabel: "Cute xỉu",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80",
    date: "09/11/2026",
  },
  {
    id: "rev-06",
    name: "Hải Đăng & Nhóm K19",
    comment: "Cả nhóm đặt bó hoa ly kẽm nhung và hoa chuông len tặng cô giáo ngày 20/11. Cô khen tấm tắc vì hoa thủ công giữ được nhiều năm làm kỷ niệm.",
    stars: 5,
    item: "Bó Hoa Chuông Linh Lan Móc Len",
    sticker: "💐",
    stickerLabel: "Biết ơn",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80",
    date: "05/11/2026",
  },
  {
    id: "rev-07",
    name: "Phương Linh (Thanh Khê)",
    comment: "Mình dùng tính năng Tự Bó Hoa DIY mix 3 cành tulip hồng + 1 cành hướng dương, nhận hoa y chang bản preview trên web luôn á. 10 điểm cho sự sáng tạo của tiệm!",
    stars: 5,
    item: "Bó Hoa Tự Phối DIY",
    sticker: "✨",
    stickerLabel: "Bất ngờ",
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80",
    date: "01/11/2026",
  },
  {
    id: "rev-08",
    name: "Thành Trung (Hải Châu)",
    comment: "Đã nhận hoa đúng giờ hẹn, thiệp chép tay font chữ tròn như học sinh viết cưng lắm. Crush mình rất thích, cảm ơn chị chủ Anna Decor nhiều nhé!",
    stars: 5,
    item: "Bó Hoa Hồng Đỏ Móc Len",
    sticker: "🥰",
    stickerLabel: "Hạnh phúc",
    image: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&w=600&q=80",
    date: "28/10/2026",
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __annaReviews: CustomerReviewItem[] | undefined;
}

export function getStoredReviews(): CustomerReviewItem[] {
  if (!global.__annaReviews) {
    global.__annaReviews = [...initialReviews];
  }
  return global.__annaReviews;
}

export function addStoredReview(review: CustomerReviewItem): CustomerReviewItem {
  const reviews = getStoredReviews();
  reviews.unshift(review);
  return review;
}

export function deleteStoredReview(id: string): boolean {
  const reviews = getStoredReviews();
  const index = reviews.findIndex((r) => r.id === id);
  if (index !== -1) {
    reviews.splice(index, 1);
    return true;
  }
  return false;
}
