import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, Percent, Award } from "lucide-react";

const HERO_SLIDES = [
  {
    image: "/images/hero-luxury-dark.png",
    title: "EPOS SWISS LUXURY DIAMOND",
    subtitle: "Tinh Hoa Chế Tác Kim Cương Tự Nhiên",
    description: "Bộ sưu tập mang đậm màu sắc quý phái cổ điển, mặt kính hoa khảm trai lấp lánh nâng tầm sức hút quý cô.",
    link: "/category/dong-ho",
    badge: "Thương Hiệu Thụy Sỹ"
  },
  {
    image: "/images/hero-luxury-marble.png",
    title: "PHILLIP AUGUSTE SWISS",
    subtitle: "Đại Diện Cho Đẳng Cấp Hoàng Gia Thụy Sỹ",
    description: "Khám phá bộ sưu tập Tonneau cơ học lộ máy thể thao và tinh tế mới nhất 2026. Ưu đãi 10% cho khách hàng mới.",
    link: "/category/dong-ho",
    badge: "Phân Phối Độc Quyền"
  },
  {
    image: "/images/hero-luxury-eyewear.png",
    title: "KÍNH MẮT BURBERRY & RAY-BAN",
    subtitle: "Phong Cách Thời Thượng, Chống UV Tuyệt Đối",
    description: "Mẫu kính râm phi công huyền thoại chống chói phân cực bảo vệ thị lực rực rỡ dưới nắng hè.",
    link: "/category/kinh-mat",
    badge: "Sale Up To 30%"
  }
];

export default function HomeHero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full relative bg-neutral-950 text-white overflow-hidden select-none">
      {/* Slider Core Container */}
      <div className="relative h-[260px] sm:h-[360px] md:h-[430px] lg:h-[460px] w-full flex items-center bg-black">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out flex items-center bg-neutral-950 ${
              index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            style={{
              backgroundImage: `
                linear-gradient(115deg, #030405 0%, #08090b 45%, #13100a 100%)
              `,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <img
              src={slide.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-fill brightness-[1.02] contrast-[1.12] saturate-[1.06]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,4,5,0.6)_0%,rgba(3,4,5,0.42)_30%,rgba(3,4,5,0.08)_58%,rgba(3,4,5,0)_100%),linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0)_48%,rgba(0,0,0,0.18)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_48%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_20%_52%,rgba(214,179,90,0.08),transparent_34%)]" />
            {/* Slide Content Overlay */}
            <div className="w-full relative z-20 space-y-2 md:space-y-3 pl-6 pr-5 sm:pl-16 md:pl-[8.5%] lg:pl-[8.8%]">
              <span className="bg-[#b99328] text-[#14110a] font-black text-[8px] md:text-[10px] tracking-wide px-3 py-1.5 rounded-sm inline-block uppercase shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
                {slide.badge}
              </span>
              <h1 className="text-[27px] sm:text-[42px] md:text-[50px] lg:text-[54px] font-black text-[#d7b75b] max-w-[560px] line-clamp-2 uppercase leading-[0.88] drop-shadow-[0_2px_12px_rgba(0,0,0,0.68)]">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-bold text-[#d6ad3d] max-w-xl leading-snug">
                {slide.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-neutral-100/88 max-w-[445px] hidden sm:block leading-relaxed">
                {slide.description}
              </p>
              <div className="pt-2 md:pt-3">
                <Link
                  to={slide.link}
                  className="bg-[#e8b800] hover:bg-[#ffd21a] text-neutral-950 font-extrabold text-xs px-4 sm:px-5 py-2.5 rounded-sm inline-block transition-colors shadow-[0_10px_24px_rgba(232,184,0,0.3)]"
                >
                  MUA NGAY HÔM NAY
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/35 hover:bg-[#f2c300] hover:text-neutral-950 text-white/85 p-2 rounded-full cursor-pointer transition-colors backdrop-blur-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/35 hover:bg-[#f2c300] hover:text-neutral-950 text-white/85 p-2 rounded-full cursor-pointer transition-colors backdrop-blur-sm"
        >
          <ChevronRight size={20} />
        </button>

        {/* Carousel indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                index === activeSlide ? "bg-[#f2c300] w-6" : "bg-white/45"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="bg-neutral-900 border-t border-b border-neutral-800 text-neutral-300 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center text-left">
            <Truck className="text-yellow-400 flex-shrink-0" size={28} />
            <div>
              <span className="text-xs sm:text-xs font-bold text-white block uppercase">Vận Chuyển Siêu Tốc</span>
              <span className="text-[10px] text-neutral-400 block leading-tight">Miễn phí toàn quốc từ 3 sản phẩm</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center text-left">
            <ShieldCheck className="text-yellow-400 flex-shrink-0" size={28} />
            <div>
              <span className="text-xs sm:text-xs font-bold text-white block uppercase">Bảo Hành 10 Năm</span>
              <span className="text-[10px] text-neutral-400 block leading-tight">Hỗ trợ miễn phí lau dầu máy cơ học</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center text-left">
            <Percent className="text-yellow-400 flex-shrink-0" size={28} />
            <div>
              <span className="text-xs sm:text-xs font-bold text-white block uppercase">Trả Góp 0% Lãi Suất</span>
              <span className="text-[10px] text-neutral-400 block leading-tight">Giao dịch an toàn qua Visa/Mastercard</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center text-left">
            <Award className="text-yellow-400 flex-shrink-0" size={28} />
            <div>
              <span className="text-xs sm:text-xs font-bold text-white block uppercase">Bảo Đảm 100% Chính Hãng</span>
              <span className="text-[10px] text-neutral-400 block leading-tight">Bồi thường 1 tỷ nếu phát hiện hàng giả</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
