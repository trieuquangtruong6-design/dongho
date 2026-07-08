/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Building, 
  Clock, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Wrench, 
  Compass, 
  ArrowRight, 
  Users, 
  Calendar, 
  GraduationCap, 
  Heart, 
  Coins 
} from 'lucide-react';

// Interfaces
interface Milestone {
  year: string;
  title: string;
  description: string;
  highlight: string;
  icon: React.ReactNode;
}

interface EliteExpert {
  name: string;
  role: string;
  experience: string;
  credentials: string;
  philosophy: string;
}

export default function AboutView() {
  const [selectedAtelierStep, setSelectedAtelierStep] = useState<number>(0);

  // Milestones on timeline
  const milestones: Milestone[] = [
    {
      year: '2010',
      title: 'Khởi đầu một khát vọng lớn',
      description: 'Đăng Quang Watch khai trương Showroom đầu tiên tại Hà Nội, thiết lập sứ mệnh mang đồng hồ cơ chính hãng, tinh xảo Thụy Sỹ về thị trường Việt Nam với cam kết trung thực tuyệt đối.',
      highlight: 'Khai sinh Boutique Hà Nội',
      icon: <Building className="w-5 h-5 text-[#C5A059]" />
    },
    {
      year: '2015',
      title: 'Hợp tác độc quyền Châu Âu',
      description: 'Chạm mốc 40 Boutique độc quyền toàn quốc. Chính thức được Epos Swiss và Atlantic Swiss bổ nhiệm làm Nhà phân phối độc quyền chính thức duy nhất tại Việt Nam.',
      highlight: 'Đạt 40 Showrooms & Độc quyền Thụy Sỹ',
      icon: <Award className="w-5 h-5 text-[#C5A566]" />
    },
    {
      year: '2020',
      title: 'Vươn tầm vị thế - 100 chi nhánh',
      description: 'Gia nhập hàng ngũ các nhà bán lẻ quy mô lớn toàn Đông Nam Á với hơn 100 Showrooms. Ra mắt kênh bảo hành điện tử số hóa và thẻ VIP số cho hàng triệu khách hàng.',
      highlight: 'Hệ thống dịch vụ 100+ Showrooms',
      icon: <Globe className="w-5 h-5 text-[#C5A059]" />
    },
    {
      year: '2026',
      title: 'Kỷ nguyên Đăng Quang Concierge VIP',
      description: 'Nâng tầm dịch vụ lên tiêu chuẩn 5 sao thế giới. Thiết kế các Lounge VIP sang trọng tiếp đón thượng khách, mở rộng phòng bảo dưỡng cơ học với trang thiết bị đo cao tần nhập trực tiếp từ Thụy Sỹ.',
      highlight: 'Dịch vụ thượng lưu, Lounge VIP',
      icon: <Sparkles className="w-5 h-5 text-[#C5A059] animate-pulse" />
    }
  ];

  // Experts details
  const experts: EliteExpert[] = [
    {
      name: 'Nghệ nhân Nguyễn Minh Đức',
      role: 'Giám đốc Kỹ thuật & Thẩm định trưởng Đăng Quang',
      experience: 'Hơn 22 năm cơ khí và phục chế đồng hồ cơ cao cấp',
      credentials: 'Tiêu chuẩn hoàn thiện máy cơ Thụy Sỹ chứng nhận bởi Epos Swiss tại Jura, Thụy Sỹ.',
      philosophy: 'Mỗi bánh răng hay lò xo tóc không chỉ có công năng cơ lý đơn thuần, đó là cả một nhịp thở tâm hồn của một nghệ nhân Thụy Sỹ gửi gắm.'
    },
    {
      name: 'Chuyên gia Marc Dubois',
      role: 'Cố vấn Kỹ thuật Thụ động (Cựu kỹ sư trưởng máy cơ Thụy Sỹ)',
      experience: '35 năm kinh nghiệm chế tác tại Vallée de Joux, Geneva',
      credentials: 'Bằng Thạc sỹ Horology tại Học viện Chế tác Đồng hồ danh giá Thụy sỹ.',
      philosophy: 'Đồng hồ cơ khí là loại máy độc nhất vô nhị không cần dòng điện nhưng có thể dao động chính xác cả trăm năm nhờ sự ăn hiệu cơ học tinh xảo.'
    },
    {
      name: 'Nghệ nhân Trần Duy Khang',
      role: 'Chuyên gia hiệu chỉnh vi sai cơ học Chronometre',
      experience: '15 năm hiệu chỉnh cơ cấu bánh lắc và dây cót',
      credentials: 'Chứng chỉ hiệu chỉnh Thụy Sỹ COSC chuyên sâu.',
      philosophy: 'Nhiệm vụ tối cao của chúng tôi là phục hồi dòng năng lượng, đưa tần số dao động trở về độ tinh chuẩn tuyệt đối như ngày đầu cự xuất từ xưởng Thụy Sỹ.'
    }
  ];

  // Atelier Steps
  const atelierSteps = [
    {
      id: 1,
      title: 'Vệ sinh siêu âm vi sai',
      details: 'Đồng hồ được tháo rời hoàn toàn hàng trăm linh kiện cơ học siêu nhỏ. Toàn bộ vỏ, bánh răng, trục bánh lật được đưa vào máy tẩy sóng siêu âm dung dịch chuyên dụng của Đức để loại bỏ hoàn toàn bụi mịn và dầu cũ kết tủa.'
    },
    {
      id: 2,
      title: 'Tra dầu đa điểm Thụy Sỹ',
      details: 'Sử dụng 4 loại dầu bôi trơn Moebius chuyên dụng Thụy Sỹ riêng biệt cho từng vị trí chịu ma sát khác nhau trong máy. Quá trình tra dầu đòi hỏi đôi tay tĩnh lặng tuyệt đối dưới kính hiển vi độ phóng đại 20x.'
    },
    {
      id: 3,
      title: 'Đo lường vi sai Witschi',
      details: 'Các nghệ nhân đặt máy cơ lên máy phân tích điện tử Witschi (Thụy Sỹ) để kiểm tra biên độ dao động, sai số giây/ngày, độ nghiêng trục bánh xe cân bằng, tiến hành tinh chỉnh ốc vi lượng đảm bảo chuẩn COSC Thụy Sỹ.'
    },
    {
      id: 4,
      title: 'Thử áp suất khí chân không',
      details: 'Đặt đồng hồ trong máy nén khí nén chân không nén thủy lực để đo biến dạng mặt kính Sapphire. Đảm bảo độ kín nước tuyệt đối từ 50m đến 300m trước khi bàn giao hoàn hảo cho thượng khách.'
    }
  ];

  return (
    <div className="space-y-24 pb-12">
      
      {/* 1. HERO GIỚI THIỆU HOÀNH TRÁNG */}
      <section id="about-hero" className="relative bg-[#0E1322] text-white py-24 md:py-32 px-4 md:px-8 overflow-hidden border-b border-[#C5A059]/15">
        <img
          src="/images/hero-luxury-dark.png"
          alt="Không gian đồng hồ cao cấp Đăng Quang Watch"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-90 brightness-[0.86] contrast-[1.12] saturate-[1.08]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,5,6,0.58)_0%,rgba(8,9,10,0.42)_36%,rgba(8,9,10,0.16)_68%,rgba(8,9,10,0.04)_100%),radial-gradient(circle_at_72%_34%,rgba(212,175,90,0.18),transparent_32%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.10)_0%,rgba(0,0,0,0)_46%,rgba(0,0,0,0.22)_100%)]"></div>
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(197,160,89,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.35)_1px,transparent_1px)] bg-[size:42px_42px]"></div>
        
        {/* Giant Rotating Mechanical Gear Wheel background vector for prestige feel */}
        <div className="absolute right-[-15%] top-[-15%] w-[450px] h-[450px] md:w-[750px] md:h-[750px] rounded-full border-4 border-dashed border-[#C5A059]/10 pointer-events-none flex items-center justify-center opacity-45">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full rounded-full border border-[#C5A059]/15 flex items-center justify-center"
          >
            <div className="w-[85%] h-[85%] rounded-full border-2 border-dashed border-[#C5A059]/10 flex items-center justify-center">
              <div className="w-[60%] h-[60%] rounded-full border border-[#C5A059]/15 flex items-center justify-center">
                <Compass className="w-16 h-16 text-[#C5A059]/15 animate-pulse" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-[#C5A059]/40 bg-[#1F2937]/90 text-[#C5A059] text-[10px] tracking-widest uppercase font-bold">
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              Atelier d'Haute Horlogerie - Kể câu chuyện thời gian
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-none text-white">
              Hành Trình Kiến Tạo <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B89047] via-[#F4D086] to-[#C5A059]">
                Kỷ Nguyên Thời Gian
              </span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
              Hơn 15 năm đặt nền móng kiến thức và uy tín, Đăng Quang Watch tự hào là biểu tượng dẫn đầu trong việc đưa các tinh hoa cơ khí chính xác nhất từ Thụy Sỹ, Âu Châu về cận kề cổ tay người Việt. Chúng tôi coi đồng hồ không chỉ là công cụ tính giây, mà là di sản trường tồn của phong cách thượng lưu.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#about-philosophy"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B89047] to-[#C5A059] text-[#090D16] font-bold text-xs tracking-wider uppercase shadow-xl hover:scale-[1.01] transition-all"
              >
                Khám Phá Sứ Mệnh
              </a>
              <a 
                href="#about-history"
                className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs tracking-wider uppercase transition-all"
              >
                Niên Biểu Lịch Sử
              </a>
            </div>
          </div>

          {/* Majestic stats block */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111827]/70 backdrop-blur-md p-6 rounded-2xl border border-[#C5A059]/15 text-center">
              <span className="block text-3xl md:text-4xl font-serif font-black text-[#C5A059] tracking-tight">16+</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mt-1">Năm Phát Triển</span>
            </div>
            
            <div className="bg-[#111827]/70 backdrop-blur-md p-6 rounded-2xl border border-[#C5A059]/15 text-center">
              <span className="block text-3xl md:text-4xl font-serif font-black text-[#C5A059] tracking-tight">100+</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mt-1">Showrooms Toàn Quốc</span>
            </div>

            <div className="bg-[#111827]/70 backdrop-blur-md p-6 rounded-2xl border border-[#C5A059]/15 text-center">
              <span className="block text-3xl md:text-4xl font-serif font-black text-[#C5A059] tracking-tight">2TR+</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mt-1">Khách Hàng Thân Thiết</span>
            </div>

            <div className="bg-[#111827]/70 backdrop-blur-md p-6 rounded-2xl border border-[#C5A059]/15 text-center">
              <span className="block text-3xl md:text-4xl font-serif font-black text-[#C5A059] tracking-tight">100%</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mt-1">Chính hãng độc quyền</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE VALUES BENTO GRID */}
      <section id="about-philosophy" className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#C5A059] text-[11px] tracking-widest uppercase font-bold">Triết Lý Vận Hành</span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900">
            Giá Trị Cốt Lõi Tối Thượng
          </h2>
          <div className="w-14 h-0.5 bg-[#C5A059] mx-auto"></div>
          <p className="text-xs text-slate-500">
            Nền tảng giúp Đăng Quang Watch giữ vững lòng tin trọn vẹn của hơn hai triệu thượng khách Việt trong suốt gần 2 thập kỷ qua.
          </p>
        </div>

        {/* Bento grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          
          {/* Box 1 (3 cols): Cam kết 100% chính hãng, đền gấp 10 lần */}
          <div className="md:col-span-3 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden relative group hover:border-[#C5A059]/50 transition-all duration-300">
            <div className="absolute right-0 bottom-0 w-32 h-32 opacity-5 text-emerald-600 group-hover:opacity-10 transition-opacity">
              <ShieldCheck className="w-full h-full" />
            </div>
            
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-250/30 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            <h4 className="text-lg font-serif font-black text-slate-900 mb-2.5">
              Cam Kết Chính Hãng Tuyệt Đối 100%
            </h4>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
              Cam kết cốt lõi làm nên chỗ đứng của Đăng Quang Watch. Toàn bộ nguồn hàng đều có đầy đủ chứng thư nhập khẩu chính hãng CO/CQ từ Thụy Sỹ và Âu Châu. Chúng tôi thực hiện chính sách <strong>đền bù gấp 10 lần giá trị sản phẩm</strong> nếu phát hiện sai lệch xuất xứ hoặc hàng giả hàng nhái.
            </p>
          </div>

          {/* Box 2 (3 cols): Bảo hành trọn đời */}
          <div className="md:col-span-3 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden relative group hover:border-[#C5A059]/50 transition-all duration-300">
            <div className="absolute right-0 bottom-0 w-32 h-32 opacity-5 text-[#C5A059] group-hover:opacity-10 transition-opacity">
              <Clock className="w-full h-full" />
            </div>
            
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C5A059] border border-amber-200/50 flex items-center justify-center mb-6">
              <Clock className="w-6 h-6" />
            </div>
            
            <h4 className="text-lg font-serif font-black text-slate-900 mb-2.5">
              Bảo Hành Trọn Đời - Vượt Niên Hạn
            </h4>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
              Chúng tôi không chỉ bán đồng hồ, chúng tôi chịu trách nhiệm chăm sóc cỗ máy đó mãi mãi. Chế độ hậu mãi độc quyền của Đăng Quang bao gồm miễn phí thay pin định kỳ trơn đời cho dòng quartz, hỗ trợ bảo dưỡng lau dầu máy chuẩn cơ học Thụy Sỹ trọn niên hạn sử dụng với chiết khấu thành viên VIP.
            </p>
          </div>

          {/* Box 3 (2 cols): Phong thủy cá nhân */}
          <div className="md:col-span-2 bg-[#111827] text-white p-8 rounded-3xl border border-[#C5A059]/25 shadow-xl relative overflow-hidden group hover:shadow-[0_10px_30px_rgba(197,160,89,0.15)] transition-all duration-300">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 text-[#C5A059] opacity-10 font-mono text-[9px] pointer-events-none">
              HOROLOGY
            </div>
            <div className="w-11 h-11 rounded-1.5xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] mb-5">
              <Compass className="w-5.5 h-5.5" />
            </div>
            <h4 className="text-base font-serif font-black text-[#C5A059] mb-2">
              Bản Mệnh & Phong Thủy
            </h4>
            <p className="text-xs text-slate-300 leading-normal">
              Đồng hồ là vật phẩm phong thủy đại diện cho Thủy và Kim. Chuyên viên Đăng Quang được đào tạo phong thủy bài bản để tư vấn màu sắc mặt số, chất liệu dây đai, số lượng chân kính phù hợp tần số rung động và năm sinh của doanh nhân, thu hút chiêu tài vượng khí.
            </p>
          </div>

          {/* Box 4 (4 cols): Tiếp đãi chuẩn 5 sao VIP */}
          <div className="md:col-span-4 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden relative group hover:border-[#C5A059]/50 transition-all duration-300">
            <div className="absolute right-0 bottom-0 w-36 h-36 opacity-5 text-[#B89047] group-hover:opacity-10 transition-opacity">
              <Sparkles className="w-full h-full" />
            </div>
            
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C5A059] border border-amber-205/50 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            
            <h4 className="text-lg font-serif font-black text-slate-900 mb-2.5">
              Hệ Sinh Thái Concierge VIP Tiếp Đón Thượng Lưu
            </h4>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
              Trải nghiệm mua sắm đồng hồ cao cấp phải song hành cùng nghệ thuật phục vụ thượng đỉnh. Đăng Quang Watch xây dựng các phòng đàm đạo VIP ấm cúng, thiết đãi quý khách trà sen đầm Liên Hoa hoặc Espresso thượng hạng trong lúc trao đổi về lịch sử cơ máy. Quý khách được đón tiếp bằng sự riêng tư trọn vẹn và an ninh tối mật tuyệt đối.
            </p>
          </div>

        </div>
      </section>

      {/* 3. TIMELINE HISTORY */}
      <section id="about-history" className="bg-[#FAF9F5]/40 border-y border-slate-200/40 py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#C5A059] text-[11px] tracking-widest uppercase font-bold">Biên Niên Sử Vàng Son</span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900">
              Chặng Đường 16 Năm Kiến Tạo
            </h2>
            <div className="w-14 h-0.5 bg-[#C5A059] mx-auto"></div>
            <p className="text-xs text-slate-500">
              Hành trình chuyển mình vượt bậc của Đăng Quang Watch từ một showroom đơn sơ ban đầu đến tập đoàn bán lẻ đồng hồ cao cấp chính hãng quy mô hàng đầu Việt Nam.
            </p>
          </div>

          {/* Timeline Process Line */}
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C5A059]/20 via-[#C5A059] to-[#C5A059]/20 hidden md:block"></div>

            <div className="space-y-12">
              {milestones.map((ms, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={ms.year} className={`flex flex-col md:flex-row items-center gap-6 md:gap-0 relative ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    {/* Visual dot on center line */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-[#C5A059] flex items-center justify-center z-10 shadow-md hidden md:flex">
                      {ms.icon}
                    </div>

                    {/* Timeline card container (half width) */}
                    <div className="w-full md:w-[45%]">
                      <div className="bg-white p-6.5 md:p-8 rounded-3xl border border-slate-205/65 shadow-lg space-y-3 hover:shadow-xl transition-all relative">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl md:text-3xl font-serif font-black text-[#C5A059] font-mono tracking-tight">{ms.year}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded">{ms.highlight}</span>
                        </div>
                        <h4 className="text-base md:text-lg font-serif font-bold text-slate-950 leading-snug">
                          {ms.title}
                        </h4>
                        <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                          {ms.description}
                        </p>
                      </div>
                    </div>
                    {/* Placeholders for visual balance */}
                    <div className="w-full md:w-[45%] hidden md:block"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE ATELIER EXPERIENCE - WORKSHOP */}
      <section id="about-atelier" className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left information list about Watchmaker atelier (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[#C5A059] text-[11px] tracking-widest uppercase font-bold block">The Professional Atelier</span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 leading-none">
              Trung Tâm Sửa Chữa & Bảo Dưỡng <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B89047] to-[#C5A059]">
                Tiêu Chuẩn Thụy Sỹ
              </span>
            </h2>
            <div className="w-14 h-0.5 bg-[#C5A059]"></div>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-2xl">
              Mỗi chiếc đồng hồ cơ là một tổ hợp các chi tiết cơ khí tinh vi hoạt động liên tục hàng giây. Tại Đăng Quang, xưởng sửa chữa được quản trị như một phòng lab vô trùng, trang bị các thiết bị chuyên dụng đắt giá từ Geneva để khôi phục hoàn hảo chất lượng đỉnh cao của cỗ máy.
            </p>

            {/* Interactive Atelier steps tab selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {atelierSteps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setSelectedAtelierStep(idx)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    selectedAtelierStep === idx 
                      ? 'bg-[#111827] text-[#C5A059] border-[#C5A059] shadow-lg' 
                      : 'bg-white text-slate-800 border-slate-200/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${selectedAtelierStep === idx ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-slate-100 text-slate-500'}`}>
                      Bước 0{step.id}
                    </span>
                    <Wrench className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs md:text-sm font-serif font-black uppercase tracking-wider">{step.title}</h4>
                </button>
              ))}
            </div>

            {/* Step content detail frame */}
            <div className="bg-[#FAF9F5] p-6 rounded-2.5xl border border-slate-200/60 shadow-inner">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedAtelierStep}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <h4 className="font-serif font-black text-slate-900 border-b border-slate-200 pb-2 text-sm md:text-base flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-[#C5A059]" />
                    {atelierSteps[selectedAtelierStep].title}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed pt-1.5">
                    {atelierSteps[selectedAtelierStep].details}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right image/badge mock display card (5 cols) */}
          <div className="lg:col-span-5 bg-[#0F1424] text-slate-100 p-8 rounded-3xl border border-[#C5A059]/35 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute right-[-15%] bottom-[-15%] opacity-5 text-[#C5A059]">
              <Compass className="w-64 h-64" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] bg-amber-500/10 text-[#C5A059] border border-[#C5A059]/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block">
                Swiss Calibration Lab
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-black text-white">
                Niêm Ấn Chất Lượng
              </h3>
              <p className="text-xs text-slate-400">Thiết bị tối tân nhập khẩu nguyên chiếc từ Thụy Sỹ và Âu Châu:</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex gap-3 hover:bg-slate-800/40 p-2.5 rounded-lg transition-colors border-l-2 border-[#C5A059]">
                <div>
                  <h5 className="font-bold text-white uppercase text-[11px] tracking-wider text-[#C5A059]">Máy Đo Áp Suất ChronoProof Thụy Sỹ</h5>
                  <p className="text-slate-400 mt-0.5 text-[11px] leading-normal">Đo lường sai lệch cơ thể mặt vỏ ở cấp độ Micro để bảo đảm độ sâu áp suất nước hoàn thiện.</p>
                </div>
              </div>

              <div className="flex gap-3 hover:bg-slate-800/40 p-2.5 rounded-lg transition-colors border-l-2 border-[#C5A059]">
                <div>
                  <h5 className="font-bold text-white uppercase text-[11px] tracking-wider text-[#C5A059]">Dầu Tra Moebius Thụy Sỹ 100%</h5>
                  <p className="text-slate-400 mt-0.5 text-[11px] leading-normal">Bảo vệ bộ thoát bánh lái và ổ cót trữ năng lượng, duy trì bôi trơn lên đến 5-7 năm không kết tủa.</p>
                </div>
              </div>

              <div className="flex gap-3 hover:bg-slate-800/40 p-2.5 rounded-lg transition-colors border-l-2 border-[#C5A059]">
                <div>
                  <h5 className="font-bold text-white uppercase text-[11px] tracking-wider text-[#C5A059]">Máy Đo Chu kỳ COSC Witschi Analyzer 2</h5>
                  <p className="text-slate-400 mt-0.5 text-[11px] leading-normal">Đặt 5 góc nghiêng đo tần số vi sai Chronometre tự động để tinh căn sai số dưới 3 giây/ngày.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => {
                  const el = document.getElementById('main-header');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 bg-gradient-to-r from-[#B89047] to-[#C5A059] text-[#090D16] rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all text-center block"
              >
                Liên Hệ Kiểm Tra Đồng Hồ Miễn Phí
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 5. ELITE EXPERTS TEAM */}
      <section id="about-experts" className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#C5A059] text-[11px] tracking-widest uppercase font-bold">Ban Hội Đồng Nghệ Nhân</span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900">
            Đội Ngũ Chuyên Gia Tuyệt Mỹ
          </h2>
          <div className="w-14 h-0.5 bg-[#C5A059] mx-auto"></div>
          <p className="text-xs text-slate-500">
            Nơi tập hợp những chuyên gia, nghệ nhân ưu tú được vinh danh trong ngành phục chế cơ khí đồng hồ chính hãng tại Việt Nam.
          </p>
        </div>

        {/* Experts List Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          {experts.map(expert => (
            <div key={expert.name} className="bg-white p-7 rounded-3xl border border-slate-200/60 shadow-xl space-y-5 hover:shadow-2xl transition-all relative overflow-hidden group hover:border-[#C5A059]/40 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Initials avatar avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1E2937] to-[#111827] text-[#C5A059] border-2 border-[#C5A059] flex items-center justify-center font-serif text-lg font-bold shadow-inner">
                  {expert.name.split(' ').slice(-1)[0][0]}
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif font-black text-base md:text-lg text-slate-900 leading-tight">
                    {expert.name}
                  </h4>
                  <p className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">{expert.role}</p>
                </div>

                <div className="space-y-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <p><strong>Thâm niên:</strong> {expert.experience}</p>
                  <p><strong>Chứng chỉ:</strong> {expert.credentials}</p>
                </div>
              </div>

              <div className="bg-[#FAF9F5] p-4.5 rounded-2xl border border-slate-100 italic text-[11px] leading-relaxed text-slate-600 mt-4">
                "{expert.philosophy}"
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TRUST OUTLOOK HERO */}
      <section className="py-12 max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-[#111827] text-white p-8 md:p-12 rounded-3xl border border-[#C5A059]/20 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-br from-[#C5A059]/10 to-transparent blur-3xl pointer-events-none"></div>
          
          <div className="space-y-3 max-w-xl text-center lg:text-left relative z-10">
            <span className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest block">Cam Kết Pháp Nhân Thương Hiệu</span>
            <h3 className="font-serif font-black text-2xl md:text-3xl text-white">Chúng Tôi Bảo Vệ Giá Trị Thật Cho Quý Khách</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mỗi sản phẩm Đăng Quang Watch phân phối đều mang theo toàn bộ niềm kiêu hãnh của nhà chế tác Châu Âu. Chúng tôi luôn đồng hành để giữ gìn sự chính tực tuyệt đối trên thị trường Việt Nam.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center sm:justify-start shrink-0">
            <button 
              onClick={() => {
                const el = document.getElementById('main-header');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#B89047] to-[#C5A059] text-[#090D16] font-bold text-xs tracking-wider uppercase shadow-xl hover:scale-105 transition-all text-center block"
            >
              Xem dòng máy Thụy Sỹ đặc trưng
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
