import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronUp, MessageCircle } from "lucide-react";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-black text-[#cccccc] text-[12px] select-none border-t border-neutral-900 font-sans relative">
      {/* 5-Column Navigation Grid */}
      <div className="bg-[#0c0c0c] py-12 border-b border-neutral-900/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 items-start gap-6 px-3 sm:px-4 md:grid-cols-3 md:gap-8 lg:grid-cols-5">
          
          {/* Column 1: THÔNG TIN CHUNG */}
          <div className="space-y-4">
            <h4 className="text-[#f59e0b] font-bold text-[13px] uppercase tracking-wider border-b border-neutral-900 pb-2 flex items-center justify-between">
              <span>Thông tin chung</span>
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link to="/about" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Giới thiệu</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Hệ thống cửa hàng</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Hướng dẫn mua hàng Online</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Liên hệ</Link>
              </li>
              <li>
                <Link to="/warranty" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Bảo hành</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: HỖ TRỢ KHÁCH HÀNG */}
          <div className="space-y-4">
            <h4 className="text-[#f59e0b] font-bold text-[13px] uppercase tracking-wider border-b border-neutral-900 pb-2">
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link to="/shop" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Chính sách & Quy định chung</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Chính sách bảo mật thông tin khách hàng</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Chính sách xử lý dữ liệu cá nhân</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Chính sách bảo mật thanh toán</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Chính sách bảo hành 10 năm</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Chính sách đổi hàng</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Chính sách vận chuyển</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: DANH MỤC */}
          <div className="space-y-4">
            <h4 className="text-[#f59e0b] font-bold text-[13px] uppercase tracking-wider border-b border-neutral-900 pb-2">
              Danh mục sản phẩm
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link to="/category/dong-ho" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Đồng hồ chính hãng</Link>
              </li>
              <li>
                <Link to="/category/kinh-mat" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Kính mắt thời trang</Link>
              </li>
              <li>
                <Link to="/category/phu-kien" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Dây da đồng hồ</Link>
              </li>
              <li>
                <Link to="/category/kinh-mat" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Gọng kính cao cấp</Link>
              </li>
              <li>
                <Link to="/category/but-ky" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Bút ký cao cấp</Link>
              </li>
              <li>
                <Link to="/category/phu-kien" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Hộp đồng hồ</Link>
              </li>
              <li>
                <Link to="/category/dong-ho" className="hover:text-[#f59e0b] transition-colors py-0.5 block">Đồng hồ cơ Thụy Sỹ</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: HỆ THỐNG CỬA HÀNG */}
          <div className="space-y-4">
            <h4 className="text-[#f59e0b] font-bold text-[13px] uppercase tracking-wider border-b border-neutral-900 pb-2">
              Hệ thống cửa hàng
            </h4>
            <div className="space-y-3">
              {/* Store system visual */}
              <Link to="/shop" className="relative block h-32 w-full overflow-hidden border border-neutral-800 rounded group shadow-md">
                <img 
                  src="/images/o.jpg" 
                  alt="Đăng Quang Store"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-center group-hover:bg-black/55 transition-colors">
                  <span className="text-yellow-400 font-extrabold text-[12px] uppercase tracking-wide drop-shadow-md">ĐĂNG QUANG WATCH</span>
                  <span className="text-white text-[10px] mt-1 italic border border-white/20 px-2 py-0.5 rounded backdrop-blur-[1px]">Tìm cửa hàng gần bạn</span>
                </div>
              </Link>
              <Link to="/shop" className="block text-center text-[11px] font-bold text-white hover:text-yellow-400 transition-colors uppercase underline decoration-neutral-700 hover:decoration-yellow-400">
                Xem tất cả cửa hàng
              </Link>
            </div>
          </div>

          {/* Column 5: KẾT NỐI VỚI DQW */}
          <div className="space-y-5">
            <h4 className="text-[#f59e0b] font-bold text-[13px] uppercase tracking-wider border-b border-neutral-900 pb-2">
              Kết nối với DQW
            </h4>
            <div className="space-y-3">
              {/* FaceBook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors group">
                <span className="w-6 h-6 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-transform select-none">
                  f
                </span>
                <span className="text-[11px] font-medium">Fanpage Facebook</span>
              </a>

              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors group">
                <span className="w-6 h-6 rounded-full bg-[#ff0000] flex items-center justify-center text-white text-[9px] shadow-sm group-hover:scale-105 transition-transform select-none">
                  ▶
                </span>
                <span className="text-[11px] font-medium">Kênh Youtube</span>
              </a>

              {/* Zalo */}
              <a href="https://zalo.me" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors group">
                <span className="w-6 h-6 rounded-full bg-[#0068ff] flex items-center justify-center text-white font-extrabold text-[8px] tracking-tighter shadow-sm group-hover:scale-105 transition-transform select-none">
                  Zalo
                </span>
                <span className="text-[11px] font-medium">Zalo chat Official</span>
              </a>
            </div>

            {/* Ministry Seals */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <img src="/images/i (1).png" alt="Đã đăng ký Bộ Công Thương" className="h-8 w-auto object-contain" />
              <img src="/images/i (2).png" alt="Đã thông báo Bộ Công Thương" className="h-8 w-auto object-contain" />
            </div>
          </div>

        </div>
      </div>

      {/* Corporate Slogan + Credentials Area (As requested in Bottom Bar design analysis and reference image) */}
      <div className="bg-[#050505] py-8 text-neutral-400 select-none">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-5 px-3 sm:px-4 lg:flex-row lg:gap-8">
          
          {/* Slogan Logo Column */}
          <div className="flex flex-col items-center lg:items-start gap-1 lg:max-w-xs text-center lg:text-left">
            <span className="font-extrabold text-lg tracking-wider text-yellow-400 font-sans leading-none block">
              ĐĂNG QUANG WATCH
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#a3a3a3] font-bold leading-relaxed block mt-0.5">
              Đẳng Cấp Doanh Nhân <br/> Phong Cách Thượng Lưu
            </span>
          </div>

          {/* Firm Credentials Details */}
          <div className="max-w-4xl flex-1 space-y-1.5 text-center text-[10.5px] leading-relaxed text-neutral-400 sm:text-[11px] lg:text-left">
            <h5 className="font-black text-yellow-500 uppercase tracking-wide text-xs">
              CÔNG TY CỔ PHẦN TRỰC TUYẾN ĐĂNG QUANG
            </h5>
            <p>
              VPGD: <strong className="text-neutral-300">Số BH9A-SP.9A-60 Vinhomes Ocean Park 1, Xã Dương Xá, Huyện Gia Lâm, Hà Nội</strong>
            </p>
            <p>
              Giấy CNĐKKD và MSDN số: <span className="text-neutral-300">0104938104</span> đăng ký lần đầu do Sở Kế hoạch và Đầu tư Thành phố Hà Nội cấp ngày 07/10/2010.
            </p>
            <p>
              Email: <a href="mailto:contact@dangquangwatch.vn" className="text-yellow-400 hover:underline">contact@dangquangwatch.vn</a> - Hotline hỗ trợ khách hàng miễn phí: <strong>1800 6005</strong>
            </p>
          </div>

          {/* Action widgets & elements */}
          <div className="flex flex-row items-center gap-4 flex-shrink-0">
            {/* Live Support Floating/Bottom trigger */}
            <div className="bg-[#121212] hover:bg-[#1a1a1a] border border-neutral-800 rounded-full px-4 py-2.5 flex items-center gap-2 cursor-pointer shadow-md select-none group transition-all">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              <MessageCircle size={14} className="text-yellow-400 group-hover:scale-105 transition-transform" />
              <div className="text-left font-bold text-[10px] leading-tight uppercase text-white group-hover:text-yellow-400 transition-colors">
                HỖ TRỢ TRỰC TUYẾN
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CopyRight line footer bar */}
      <div className="bg-black py-4 border-t border-neutral-900/40 text-neutral-600 text-center text-[10px]">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-2 px-3 sm:px-4 md:flex-row">
          <span>© 1998 - 2026 Đăng Quang Watch. Thiết kế bởi Đội ngũ kỹ sư Đăng Quang.</span>
          <span>Khách hàng là tài sản quý nhất của chúng tôi</span>
        </div>
      </div>

      {/* Back to top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50 flex h-10 w-10 cursor-pointer select-none flex-col items-center justify-center bg-[#f59e0b] text-black shadow-lg transition-all hover:bg-[#ffb020] active:scale-90 sm:bottom-6 sm:right-6"
          title="Lên đầu trang"
        >
          <ChevronUp size={18} className="translate-y-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 stroke-[3]" />
          <span className="text-[8px] font-black uppercase tracking-tighter leading-none">Top</span>
        </button>
      )}
    </footer>
  );
}
