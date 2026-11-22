import MascotAvatar from "@/components/common/MascotAvatar";
import { SHOP_INFO } from "@/data/products";
import { Sparkles, Heart, Clock, Smile } from "lucide-react";

export default function StorySection() {
  return (
    <section id="story" className="py-16 md:py-24 bg-white/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Collage & Mascot Graphic */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-tr from-pastel-pink/30 to-pastel-butter/40 p-6 sm:p-8 rounded-5xl border-3 border-pastel-pink shadow-kawaii">
              <div className="text-center space-y-4">
                <MascotAvatar size="lg" expression="wink" />
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-pastel-choco">Anna Decor Đà Nẵng</h3>
                  <p className="text-xs text-pastel-subtext font-semibold">
                    K317/23 Nguyễn Phước Nguyên, Thanh Khê
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-left">
                  <div className="bg-white/90 p-3 rounded-2xl border border-pastel-pink/50">
                    <span className="text-xl block mb-1">🤲</span>
                    <span className="text-xs font-bold text-pastel-choco block">100% Uốn Tay</span>
                    <span className="text-[10px] text-pastel-subtext">Không sản xuất hàng loạt</span>
                  </div>
                  <div className="bg-white/90 p-3 rounded-2xl border border-pastel-pink/50">
                    <span className="text-xl block mb-1">⏳</span>
                    <span className="text-xs font-bold text-pastel-choco block">15 Bó / Ngày</span>
                    <span className="text-[10px] text-pastel-subtext">Đảm bảo độ tinh xảo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Brand Story Text */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pastel-mint border border-pastel-mintDark text-xs font-bold text-pastel-choco">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chuyện Của Tiệm Nhỏ</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-pastel-choco leading-tight">
              &quot;Gói ghém yêu thương qua từng cánh hoa thủ công&quot;
            </h2>

            <div className="space-y-3.5 text-sm sm:text-base text-pastel-choco/85 leading-relaxed">
              <p>
                Khởi đầu từ một góc bàn học nhỏ tại Đà Nẵng ngập tràn kẽm nhung và cuộn len màu pastel, <strong>Anna Decor</strong> ra đời với một ước mơ giản dị: <em>Biến những cảm xúc chân thành thành những món quà thủ công vĩnh cửu không bao giờ tàn.</em>
              </p>
              <p>
                Khác với hoa tươi chóng úa, mỗi bông hoa kẽm nhung hay hoa móc len tại tiệm đều được người thợ uốn nắn từng nếp gấp, khéo léo phối màu pastel ngọt ngào. Đó có thể là lời chúc thi cử may mắn cho bạn thân, lời tỏ tình dịu ngọt gửi tới crush, hay chút an ủi dịu êm cho chính góc học tập của bạn sau giờ ôn thi căng thẳng.
              </p>
              <div className="p-4 rounded-3xl bg-pastel-butter/40 border border-pastel-yellowGold flex items-start gap-3">
                <span className="text-2xl">🌱</span>
                <p className="text-xs sm:text-sm text-pastel-choco font-semibold">
                  Mỗi ngày tiệm chỉ nhận tối đa <strong>15 đơn hoa thủ công</strong> để đảm bảo từng cánh hoa đều được chăm chút kỹ lưỡng nhất. Cảm ơn bạn đã đồng hành và ủng hộ tiệm nhỏ của chúng mình!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
