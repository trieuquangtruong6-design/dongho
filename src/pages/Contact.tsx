/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Search, 
  Send, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  ExternalLink,
  Navigation,
  Check,
  Building,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Award,
  Wrench,
  Coffee,
  Calendar,
  Globe,
  Info,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Showroom {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  mapEmbedUrl: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const CITIES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];

const createMapUrl = (query: string) => `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

const SHOWROOMS: Showroom[] = [
  {
    id: 'hn-1',
    name: 'Cửa hàng 55 Trần Đăng Ninh (Trụ sở chính)',
    city: 'Hà Nội',
    address: 'Số 55 Trần Đăng Ninh, Q. Cầu Giấy, Hà Nội',
    phone: '024.3793.9481',
    mapEmbedUrl: createMapUrl('55 Tran Dang Ninh Cau Giay Hanoi Vietnam'),
  },
  {
    id: 'hn-2',
    name: 'Cửa hàng 7 Lê Văn Lương',
    city: 'Hà Nội',
    address: 'Số 7 Lê Văn Lương, Q. Thanh Xuân, Hà Nội',
    phone: '024.3556.1268',
    mapEmbedUrl: createMapUrl('7 Le Van Luong Thanh Xuan Hanoi Vietnam'),
  },
  {
    id: 'hn-3',
    name: 'Cửa hàng 102 Trần Nhân Tông',
    city: 'Hà Nội',
    address: 'Số 102 Trần Nhân Tông, Q. Hai Bà Trưng, Hà Nội',
    phone: '024.3944.8688',
    mapEmbedUrl: createMapUrl('102 Tran Nhan Tong Hai Ba Trung Hanoi Vietnam'),
  },
  {
    id: 'hcm-1',
    name: 'Cửa hàng Quận 1',
    city: 'TP. Hồ Chí Minh',
    address: 'Khu vực Quận 1, TP. Hồ Chí Minh',
    phone: '028.3822.6005',
    mapEmbedUrl: createMapUrl('District 1 Ho Chi Minh City Vietnam'),
  },
  {
    id: 'dn-1',
    name: 'Cửa hàng Hải Châu',
    city: 'Đà Nẵng',
    address: 'Khu vực Hải Châu, Đà Nẵng',
    phone: '0236.356.6005',
    mapEmbedUrl: createMapUrl('Hai Chau Da Nang Vietnam'),
  },
  {
    id: 'hp-1',
    name: 'Cửa hàng Hải Phòng',
    city: 'Hải Phòng',
    address: 'Trung tâm Hải Phòng',
    phone: '0225.366.6005',
    mapEmbedUrl: createMapUrl('Hai Phong Vietnam'),
  },
  {
    id: 'ct-1',
    name: 'Cửa hàng Cần Thơ',
    city: 'Cần Thơ',
    address: 'Trung tâm Cần Thơ',
    phone: '0292.366.6005',
    mapEmbedUrl: createMapUrl('Can Tho Vietnam'),
  },
];

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Thời gian bảo hành các sản phẩm đồng hồ tại Đăng Quang Watch là bao lâu?',
    answer:
      'Các sản phẩm được tư vấn chính sách bảo hành rõ ràng theo từng thương hiệu. Một số dòng cao cấp được hỗ trợ bảo hành quốc tế và chăm sóc sau mua theo điều kiện cụ thể.',
  },
  {
    id: 'faq-2',
    question: 'Tôi có thể mua trả góp đồng hồ tại Đăng Quang Watch hay không?',
    answer:
      'Khách hàng có thể gửi yêu cầu tư vấn để được hướng dẫn phương án thanh toán phù hợp theo từng thời điểm, từng sản phẩm và chính sách hiện hành.',
  },
  {
    id: 'faq-3',
    question: 'Làm thế nào để tôi xác minh đồng hồ Đăng Quang bán là chính hãng?',
    answer:
      'Đội ngũ tư vấn sẽ cung cấp thông tin thương hiệu, chính sách bảo hành, chứng từ liên quan và hướng dẫn cách kiểm tra sản phẩm trước khi mua.',
  },
  {
    id: 'faq-4',
    question: 'Chính sách đổi trả hàng hóa khi mua trực tuyến như thế nào?',
    answer:
      'Bạn có thể liên hệ hotline hoặc gửi yêu cầu qua form. Bộ phận hỗ trợ sẽ kiểm tra tình trạng đơn hàng, điều kiện sản phẩm và hướng dẫn quy trình phù hợp.',
  },
];

// Các thương hiệu cao cấp được giới thiệu tại Đăng Quang Watch
interface BrandDetail {
  id: string;
  name: string;
  origin: string;
  description: string;
  founded: string;
  specialty: string;
}

const PREMIUM_BRANDS: BrandDetail[] = [
  {
    id: 'epos',
    name: 'Epos Swiss',
    origin: 'Thụy Sỹ',
    founded: '1925',
    specialty: 'Đồng hồ cơ siêu mỏng, thiết kế lộ cơ nghệ thuật',
    description: 'Thương hiệu đồng hồ Thụy Sĩ sang trọng chế tác hoàn toàn thủ công từ bang Jura, nổi danh thế giới với những bộ máy được khảm nghệ thuật, lộ cơ tinh tế cho giới mộ điệu.'
  },
  {
    id: 'atlantic',
    name: 'Atlantic Swiss',
    origin: 'Thụy Sỹ',
    founded: '1888',
    specialty: 'Đồng hồ thể thao, khả năng chống nước vượt trội',
    description: 'Hơn 135 năm lịch sử chế tác cơ khí chính xác hàng đầu Thụy Sỹ. Atlantic mang đậm hơi thở thể thao quý tộc, sự bền bỉ của thép Thụy Sỹ và khả năng chịu nước độc bản.'
  },
  {
    id: 'bruno',
    name: 'Diamond D',
    origin: 'Glashutte (Đức)',
    founded: '1957',
    specialty: 'Tiêu chuẩn hàng đầu Glashütte, tinh xảo cơ khí Đức',
    description: 'Sản xuất tại "thánh địa" đồng hồ Đức Glashütte, mang phong cách tối giản sang trọng kết hợp bộ máy thạch anh và cơ khí được tinh chỉnh tinh xảo bởi các bậc thầy chế tác Đức.'
  },
  {
    id: 'philippe',
    name: 'Philippe Auguste',
    origin: 'Pháp - Thụy Sỹ',
    founded: '2010',
    specialty: 'Phong cách cổ điển hoàng gia Pháp, kính xa-phia nguyên khối',
    description: 'Sự giao thoa hoàn hảo giữa nét lãng mạn quý tộc Pháp và sự vận hành trơn tru của linh kiện đồng hồ Thụy Sỹ, hướng đến đối tượng doanh nhân và chính khách.'
  }
];

export default function ContactView() {
  // Store Locator State
  const [selectedCity, setSelectedCity] = useState<string>('Hà Nội');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hq' | 'parking' | 'tech'>('all');
  const [selectedShowroom, setSelectedShowroom] = useState<Showroom>(
    SHOWROOMS.find(s => s.city === 'Hà Nội') || SHOWROOMS[0]
  );

  // Brand Hub State
  const [selectedBrand, setSelectedBrand] = useState<string>('epos');

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  // Concierge Form State (Elevated for Vip Experience)
  const [formInput, setFormInput] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Đăng ký tư vấn VIP',
    brandPreference: 'Epos Swiss',
    showroomTarget: 'Cửa hàng 55 Trần Đăng Ninh (Trụ sở chính)',
    preferredDate: '',
    refreshment: 'Trà sen Liên Hoa thượng hạng',
    isRestorationRequested: false,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Filter Showrooms with extra tags
  const filteredShowrooms = useMemo(() => {
    return SHOWROOMS.filter(s => {
      const matchCity = s.city === selectedCity;
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchCity || !matchSearch) return false;

      if (selectedFilter === 'hq') {
        return s.name.includes('Trụ sở chính') || s.id === 'hn-1';
      }
      if (selectedFilter === 'tech') {
        return s.id === 'hn-1' || s.id === 'hcm-1' || s.id === 'dn-1';
      }
      return true;
    });
  }, [selectedCity, searchQuery, selectedFilter]);

  // Handle City Change
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSearchQuery('');
    setSelectedFilter('all');
    const firstOfCity = SHOWROOMS.find(s => s.city === city);
    if (firstOfCity) {
      setSelectedShowroom(firstOfCity);
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formInput.name.trim()) {
      errors.name = 'Vui lòng cung danh tính quý danh khách hàng';
    }
    if (!formInput.phone.trim()) {
      errors.phone = 'Vui lòng cung cấp số điện thoại liên lạc';
    } else if (!/^[0-9.‐+()\s]{10,12}$/.test(formInput.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ (9-12 chữ số)';
    }
    if (!formInput.email.trim()) {
      errors.email = 'Vui lòng cung cấp hòm thư điện tử';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formInput.email)) {
      errors.email = 'Địa chỉ email không đúng định dạng';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submission
  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1800);
  };

  // Đặt lại biểu mẫu
  const handleResetForm = () => {
    setIsSuccess(false);
    setFormInput(prev => ({
      ...prev,
      name: '',
      phone: '',
      email: '',
      message: '',
      preferredDate: ''
    }));
  };

  return (
    <div className="space-y-2">
      
      {/* 1. HERO EPIC COUTURE SECTION */}
      <section id="hero-vintage" className="relative bg-[#0D121F] text-white py-20 md:py-28 px-4 md:px-8 overflow-hidden border-b border-[#C5A059]/15">
        <img
          src="/images/hero-contact-concierge.png"
          alt="Không gian tiếp đón khách hàng Đăng Quang Watch"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-92 brightness-[0.88] contrast-[1.1] saturate-[1.08]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,4,4,0.62)_0%,rgba(10,8,5,0.42)_38%,rgba(18,12,5,0.12)_72%,rgba(18,12,5,0.02)_100%),radial-gradient(circle_at_78%_38%,rgba(221,174,78,0.18),transparent_30%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0)_48%,rgba(0,0,0,0.22)_100%)]"></div>
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(90deg,transparent_0%,rgba(197,160,89,0.35)_50%,transparent_100%)]"></div>
        
        <div className="absolute right-[-10%] top-[-10%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full border border-[#C5A059]/10 pointer-events-none flex items-center justify-center opacity-30">
          <div className="w-[80%] h-[80%] rounded-full border border-dashed border-[#C5A059]/15 flex items-center justify-center">
            <div className="w-[60%] h-[60%] rounded-full border border-[#C5A059]/10"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full border border-[#C5A059]/45 bg-[#1F2937]/90 text-[#C5A059] text-[11px] tracking-widest uppercase font-bold">
              <Sparkles className="w-3 h-3 text-[#C5A059] animate-pulse" />
              Sự phục vụ hoàn hảo - dịch vụ chuyên biệt
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-none text-white">
              Đẳng Cấp Chăm Sóc <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B89047] via-[#F4D086] to-[#C5A059]">
                Thượng khách VIP
              </span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-lg">
              Chào mừng quý khách đến với không gian trải nghiệm dịch vụ đỉnh cao của Đăng Quang Watch. Chúng tôi luôn đồng hành để hỗ trợ, tư vấn lựa chọn và bảo dưỡng những cỗ máy thời gian độc bản của quý vị.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href="#concierge-booking"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B89047] to-[#C5A059] text-[#090D16] font-bold text-xs tracking-wider uppercase shadow-xl hover:shadow-[#C5A059]/20 hover:scale-[1.01] transition-all"
              >
                Đặt lịch đón tiếp VIP
              </a>
              <a 
                href="#showrooms-section"
                className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs tracking-wider uppercase transition-all"
              >
                Hệ Thống {SHOWROOMS.length} Cửa Hàng
              </a>
            </div>
          </div>

            {/* Khối giới thiệu thương hiệu */}
          <div className="bg-[#111827]/80 backdrop-blur-md rounded-3xl p-6.5 md:p-8 border border-[#C5A059]/20 shadow-2xl relative">
            <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] text-amber-400 font-mono tracking-wider">
              <Award className="w-3.5 h-3.5" />
              NHẬP KHẨU ĐỘC QUYỀN
            </div>
            
            <h3 className="font-serif text-lg font-bold text-slate-155 mb-1">
              Di Tích Chế Tác
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Khám phá di sản tinh hoa từ các nhà chế tác Thụy Sỹ & Đức phân phối độc quyền tại Đăng Quang Watch:
            </p>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {PREMIUM_BRANDS.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`py-2 px-1 rounded-lg text-[10px] md:text-xs font-bold uppercase transition-all border text-center ${
                    selectedBrand === brand.id
                      ? 'bg-gradient-to-br from-[#1E2937] to-[#111827] text-[#C5A059] border-[#C5A059] shadow-inner font-extrabold'
                      : 'bg-[#1F2937]/30 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {brand.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {PREMIUM_BRANDS.filter(b => b.id === selectedBrand).map(brand => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-end border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-serif font-black text-white flex items-center gap-2">
                        {brand.name}
                        <span className="text-[10px] text-slate-400 font-mono font-normal">({brand.origin})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Thành lập: {brand.founded}</p>
                    </div>
                    <span className="text-[10px] text-[#C5A059] font-mono tracking-wider font-semibold">Chứng nhận chính hãng</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{brand.description}"
                  </p>

                  <div className="bg-[#1A2333] p-3 rounded-xl border border-slate-800">
                    <span className="block text-[10px] font-bold text-[#C5A059] uppercase tracking-wider mb-1">
                      Kỹ nghệ sở trường của hãng:
                    </span>
                    <p className="text-xs text-slate-300 font-medium">{brand.specialty}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 2. Khu tư vấn và thông tin liên hệ */}
      <section id="concierge-booking" className="py-20 px-4 md:px-8 max-w-7xl mx-auto ScrollSection">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Thông tin trụ sở và hỗ trợ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-[#111827] to-[#0F1424] text-white p-7 md:p-8 rounded-3xl border border-[#C5A059]/20 shadow-xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                <div>
                  <h4 className="text-xl font-serif font-black text-[#C5A059] tracking-wider">
                    TRỤ SỞ CHÍNH
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Hỗ trợ & chăm sóc khách hàng</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-[#C5A059]/40 bg-[#1A2333] flex items-center justify-center text-[#C5A059]">
                  <Building className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-4 text-xs md:text-sm">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-350 block text-[11px] uppercase tracking-wider font-bold">Địa chỉ Trụ sở</strong>
                    <p className="text-slate-200 mt-0.5 leading-relaxed">
                      Số 55 Trần Đăng Ninh, Q. Cầu Giấy, Hà Nội
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-355 block text-[11px] uppercase tracking-wider font-bold">Tư Vấn Miễn Phí</strong>
                    <p className="text-[#C5A059] mt-0.5 font-bold text-sm tracking-wider">
                      1800 6005
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-355 block text-[11px] uppercase tracking-wider font-bold">Thư điện tử hành chính</strong>
                    <p className="text-slate-200 mt-0.5 font-mono">
                      contact@dangquangwatch.vn
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 p-4.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059]">
                  <Clock className="w-4 h-4" />
                  XƯỞNG KỸ THUẬT QUỐC GIA
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Lau dầu, căn chỉnh vi sai tại trụ sở mở cửa từ 08:30 đến 18:00 các ngày trong tuần (Kể cả lễ tết).
                </p>
              </div>
            </div>

            {/* Chứng nhận cam kết */}
            <div className="bg-[#FAF9F5] p-6.5 rounded-3xl border border-slate-200/60 shadow-lg space-y-4">
              <h5 className="font-serif font-black text-sm text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Chứng Chỉ Cam Kết Đặc Quyền
              </h5>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200/50 flex flex-col justify-between">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider">Chứng nhận 01</span>
                  <p className="font-bold text-slate-800 mt-1 leading-snug">Chính Hãng <br/>100% Quốc Tế</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/50 flex flex-col justify-between">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider">Chứng nhận 02</span>
                  <p className="font-bold text-slate-800 mt-1 leading-snug">Bảo hành Thụy Sỹ <br/>Lên tới 10 năm</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed leading-normal">
                Toàn bộ đồng hồ bán từ Đăng Quang Watch đều kèm theo Thẻ bảo hành quốc tế tương thích toàn cầu và ID mã hóa chống hàng nhái chính chủ.
              </p>
            </div>
          </div>

          {/* Biểu mẫu đặt lịch tư vấn */}
          <div className="lg:col-span-7 bg-white p-7 md:p-9 rounded-3xl border border-slate-200/80 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B89047] via-[#C5A059] to-[#D5B26A]"></div>

            <div className="space-y-1.5 text-left pb-4 border-b border-slate-100">
              <span className="text-[#C5A059] text-[10px] font-bold tracking-widest uppercase block">Độ Tư hữu Tối Cao</span>
              <h3 className="text-2xl font-serif font-black text-[#1E293B]">
                Đặt lịch đón tiếp VIP
              </h3>
              <p className="text-xs text-slate-500">
                Tận hưởng đặc quyền tư vấn thiết kế, phong thủy đồng hồ riêng tư cùng Nghệ Nhân Trưởng Đăng Quang.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form 
                  key="vip-form"
                  onSubmit={handleSubmitContact}
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase block">Quý Danh Khách Hàng *</label>
                      <input 
                        type="text" 
                        placeholder="Ví dụ: Anh Triệu Quang Trường..."
                        value={formInput.name}
                        onChange={e => setFormInput(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-xl border text-xs focus:ring-1 focus:outline-none transition-all ${
                          formErrors.name 
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/20' 
                            : 'border-slate-200 focus:border-[#C5A059] focus:ring-[#C5A059]/20 bg-slate-50/50'
                        }`}
                      />
                      {formErrors.name && <p className="text-[10px] font-semibold text-red-500">{formErrors.name}</p>}
                    </div>

                    {/* Phone input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase block">Số Điện Thoại Liên Lạc *</label>
                      <input 
                        type="text" 
                        placeholder="Số di động chính thức..."
                        value={formInput.phone}
                        onChange={e => setFormInput(prev => ({ ...prev, phone: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-xl border text-xs focus:ring-1 focus:outline-none transition-all ${
                          formErrors.phone 
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/20' 
                            : 'border-slate-200 focus:border-[#C5A059] focus:ring-[#C5A059]/20 bg-slate-50/50'
                        }`}
                      />
                      {formErrors.phone && <p className="text-[10px] font-semibold text-red-500">{formErrors.phone}</p>}
                    </div>
                  </div>

                  {/* Địa chỉ thư điện tử */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase block">Địa chỉ thư điện tử *</label>
                    <input 
                      type="email" 
                      placeholder="TruongKa@gmail.com"
                      value={formInput.email}
                      onChange={e => setFormInput(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border text-xs focus:ring-1 focus:outline-none transition-all ${
                        formErrors.email 
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/20' 
                          : 'border-slate-200 focus:border-[#C5A059] focus:ring-[#C5A059]/20 bg-slate-50/50'
                      }`}
                    />
                    {formErrors.email && <p className="text-[10px] font-semibold text-red-500">{formErrors.email}</p>}
                  </div>

                  {/* Date & targets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase block flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                        Ngày Giờ Dự Kiến Đón Tiếp
                      </label>
                      <input 
                        type="datetime-local" 
                        value={formInput.preferredDate}
                        onChange={e => setFormInput(prev => ({ ...prev, preferredDate: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase block flex items-center gap-1.5">
                        <Coffee className="w-3.5 h-3.5 text-[#C5A059]" />
                        Thực đơn thiết đãi
                      </label>
                      <select 
                        value={formInput.refreshment}
                        onChange={e => setFormInput(prev => ({ ...prev, refreshment: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 focus:outline-none"
                      >
                        <option value="Trà sen Liên Hoa thượng hạng">Trà sen Liên Hoa thượng hạng</option>
                        <option value="Espresso Macchiato nguyên hạt Ý">Espresso Macchiato Ý</option>
                        <option value="Trà Ô Long cổ hữu vùng núi cao">Trà Ô Long Hoàng Gia</option>
                        <option value="Rượu vang sủi Pháp tại trụ sở">Rượu vang sủi Pháp tại trụ sở</option>
                      </select>
                    </div>
                  </div>

                  {/* Brand targets */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase block">Thương Hiệu Ưu Tiên Tư Vấn</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Epos Swiss', 'Atlantic Thụy Sỹ', 'Diamond D Đức', 'Thương Hiệu Khác...'].map(b => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setFormInput(prev => ({ ...prev, brandPreference: b }))}
                          className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all text-center ${
                            formInput.brandPreference === b 
                              ? 'bg-[#111827] text-[#C5A059] border-[#C5A059]' 
                              : 'bg-slate-50 text-[#192F42] border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mechanical Restoration Switch */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-slate-800 tracking-wide uppercase block">Kèm dịch vụ phục chế phục hồi</span>
                      <p className="text-[10px] text-slate-500">Tôi muốn mang theo đồng hồ cũ để nghệ nhân thẩm định và lau dầu trực tiếp.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormInput(p => ({ ...p, isRestorationRequested: !p.isRestorationRequested }))}
                      className={`relative w-12 h-6.5 rounded-full transition-colors flex items-center p-0.5 focus:outline-none ${
                        formInput.isRestorationRequested ? 'bg-[#C5A059]' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`w-5.5 h-5.5 rounded-full bg-white transition-all transform flex items-center justify-center shadow-md ${
                        formInput.isRestorationRequested ? 'translate-x-[22px]' : 'translate-x-0'
                      }`}>
                        {formInput.isRestorationRequested && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                      </span>
                    </button>
                  </div>

                  {/* Message box */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase block">Ghi Chú Yêu Cầu Riêng Biệt (Nếu có)</label>
                    <textarea 
                      rows={3}
                      placeholder="Cung cấp size cổ tay của quý khách, mẫu mã yêu cầu tìm độc bản hoặc câu hỏi bảo dưỡng cơ khí..."
                      value={formInput.message}
                      onChange={e => setFormInput(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#B89047] via-[#C5A059] to-[#D5B26A] text-[#090D16] font-bold text-xs uppercase tracking-widest shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/25 hover:scale-[1.01] active:translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#090D16] border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang gửi thông tin đặt lịch...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Ký Xác Nhận & Đăng Ký Đón Tiếp</span>
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="vip-success animate-all"
                  className="bg-slate-50/80 p-8 rounded-2.5xl border border-amber-300 flex flex-col items-center text-center space-y-5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#C5A059] border-2 border-dashed border-[#C5A059] flex items-center justify-center animate-bounce">
                    <CheckCircle className="w-9 h-9" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-serif font-black text-slate-900 text-lg md:text-xl">
                      Đã tiếp nhận hồ sơ VIP!
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                      Kính thưa quý khách VIP, hồ sơ tư vấn đã được hệ thống mã hóa bảo mật gửi trực tiếp đến Trợ lý nghệ nhân trưởng Đăng Quang. Chúng tôi sẽ gọi điện thoại liên hệ trực tiếp cho quý vị trong thời gian sớm nhất.
                    </p>
                  </div>

                  <div className="w-full bg-white p-4.5 rounded-2xl border border-slate-200 text-left space-y-2 text-[11px] sm:text-xs">
                    <p className="text-slate-500"><strong>Thương khách:</strong> <span className="text-slate-800 font-bold">{formInput.name}</span></p>
                    <p className="text-slate-500"><strong>Dòng máy:</strong> <span className="text-slate-800 font-bold">{formInput.brandPreference}</span></p>
                    <p className="text-slate-500"><strong>Thực đơn:</strong> <span className="text-slate-800 font-bold">{formInput.refreshment}</span></p>
                    {formInput.preferredDate && <p className="text-slate-500"><strong>Thời gian:</strong> <span className="text-[#C5A059] font-black">{formInput.preferredDate.replace('T', ' ')}</span></p>}
                  </div>

                  <button 
                    onClick={handleResetForm}
                    className="px-5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-200 flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Đăng ký cho người thân
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 3. METROPOLITAN SHOWROOM LOCATOR MAP */}
      <section id="showrooms-section" className="bg-[#FAF9F5]/50 py-20 px-4 md:px-8 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 pb-2">
            <div className="space-y-3 text-left">
              <span className="text-[#C5A059] text-[11px] tracking-widest uppercase font-bold block">Địa Chỉ Uy Tín</span>
              <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 leading-none">
                Hệ Thống Trải Nghiệm Thượng Lưu
              </h2>
              <div className="w-14 h-0.5 bg-[#C5A059]"></div>
              <p className="text-xs text-slate-500 max-w-sm">
                Tìm kiếm cửa hàng chính hãng Đăng Quang Watch gần nhất để trực tiếp trải nghiệm các mẫu đồng hồ cao cấp.
              </p>
            </div>

            {/* City Tab switcher */}
            <div className="flex flex-wrap gap-2">
              {CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => handleCityChange(city)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                    selectedCity === city 
                      ? 'bg-[#111827] text-[#C5A059] border-[#C5A059] shadow-lg scale-98'
                      : 'bg-white text-slate-800 border-slate-205/60 hover:bg-slate-50'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Showroom List Filterable (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              
              <div className="space-y-3 shrink-0">
                {/* Search query box */}
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 text-slate-400 w-4.5 h-4.5" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo phố (Trần Đăng Ninh, Q1, Lê Duẩn...)"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 text-xs rounded-xl focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 focus:outline-none"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-3.5 text-[10px] text-slate-400 font-bold hover:text-slate-600"
                    >
                      Xóa
                    </button>
                  )}
                </div>

                {/* Attributes specific filtering tabs */}
                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-[10px] sm:text-xs">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all ${selectedFilter === 'all' ? 'bg-white text-[#111827] shadow' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Tất cả ({SHOWROOMS.filter(s => s.city === selectedCity).length})
                  </button>
                  <button
                    onClick={() => setSelectedFilter('hq')}
                    className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all ${selectedFilter === 'hq' ? 'bg-white text-[#111827] shadow' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Trụ sở VIP
                  </button>
                  <button
                    onClick={() => setSelectedFilter('tech')}
                    className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all ${selectedFilter === 'tech' ? 'bg-white text-[#111827] shadow' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Kỹ thuật
                  </button>
                </div>
              </div>

              {/* Showroom Cards list with fixed viewport scroll */}
              <div className="flex-1 min-h-[350px] max-h-[460px] overflow-y-auto scrollbar-luxury pr-1.5 space-y-2.5">
                <AnimatePresence mode="popLayout">
                  {filteredShowrooms.length > 0 ? (
                    filteredShowrooms.map(s => {
                      const isSelected = selectedShowroom.id === s.id;
                      const hasLauDau = s.name.includes('Trụ sở') || s.id === 'hn-1' || s.id === 'hcm-1';
                      return (
                        <motion.div
                          key={s.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => setSelectedShowroom(s)}
                          className={`p-4 rounded-2.5xl border cursor-pointer text-left transition-all ${
                            isSelected 
                              ? 'bg-white border-[#C5A059] shadow-md ring-1 ring-[#C5A059]/30' 
                              : 'bg-white/80 border-slate-200/50 hover:bg-white hover:border-slate-350 shadow-sm'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <span className="text-[10px] text-slate-400 font-mono tracking-tight uppercase font-medium">{s.city} · 08:30 - 21:00</span>
                            <div className="flex gap-1 shrink-0">
                              {hasLauDau && (
                                <span className="bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
                                  Lau Dầu Thụy Sỹ
                                </span>
                              )}
                              <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
                                Đỗ Ô Tô
                              </span>
                            </div>
                          </div>

                          <h4 className="font-serif font-black text-sm text-[#111827]">
                            {s.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-1 mt-0.5 font-medium">
                            {s.address}
                          </p>

                          <div className="border-t border-slate-100 mt-2.5 pt-2 flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-mono text-[10px] text-[#C5A059] font-bold">{s.phone}</span>
                            <span className="text-[10px] text-[#C5A059] font-semibold flex items-center gap-1">Chính hãng độc quyền <Check className="w-3 h-3 text-emerald-500" /></span>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="py-12 bg-white rounded-2.5xl border border-dashed border-slate-205 flex flex-col items-center justify-center text-center space-y-2">
                      <p className="text-xs text-slate-400 font-medium">Không tìm thấy cửa hàng phù hợp với bộ lọc</p>
                      <button 
                        onClick={() => { setSearchQuery(''); setSelectedFilter('all'); }}
                        className="py-1 px-2.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold hover:bg-slate-200 transition-colors"
                      >
                        Khôi phục bộ lọc
                      </button>
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>

              {/* Bản đồ cửa hàng */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              
              {/* Map Canvas container */}
              <div className="flex-1 bg-slate-200 border border-slate-300 rounded-3xl overflow-hidden relative shadow-md min-h-[350px] lg:min-h-[460px]">
                {/* Khung bản đồ */}
                <iframe 
                  id="google-maps-frame"
                  src={selectedShowroom.mapEmbedUrl}
                  style={{ border: 0 }}
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Cửa hàng Đăng Quang Watch"
                  className="rounded-3xl shadow-inner w-full h-full"
                ></iframe>
              </div>

              {/* Selected boutique details for verification */}
              <div className="bg-white p-5 rounded-2.5xl border border-slate-200/60 shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-3.5 items-center">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1E2937] to-[#111827] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
                    <Navigation className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h5 className="font-serif font-black text-sm text-[#111827]">
                      {selectedShowroom.name}
                    </h5>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-sm mt-0.5">
                      {selectedShowroom.address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto shrink-0">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedShowroom.name} ${selectedShowroom.address}`)}`}
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 md:flex-none py-2.5 px-4.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Mở bản đồ</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  
                  <a 
                    href={`tel:${selectedShowroom.phone.replace(/\./g, '')}`}
                    className="flex-1 md:flex-none py-2.5 px-4.5 rounded-xl bg-[#111827] text-[#C5A059] text-xs font-bold border border-[#C5A059]/30 text-center hover:bg-[#1E2937] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi điện</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. EXPANDABLE VIP QUESTIONS ACCORDION */}
      <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-12">
        
        {/* Header FAQs */}
        <div className="text-center space-y-3">
          <span className="text-[#C5A059] text-[11px] tracking-widest uppercase font-bold">Làm Rõ Hoài Nghi</span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900">
            Hồi Đáp Kiến Thức Đồng Hồ
          </h2>
          <div className="w-14 h-0.5 bg-[#C5A059] mx-auto"></div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tổng hợp giải đáp chuyên sâu về nguồn gốc sở hữu, giấy tờ pháp lý nhập khẩu, chính sách bảo hành tối cao của Tập đoàn Đăng Quang.
          </p>
        </div>

        {/* FAQs list list */}
        <div className="space-y-4">
          {FAQS.map(faq => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <div 
                key={faq.id}
                className="bg-white rounded-2.5xl border border-slate-200/50 shadow-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                  className="w-full text-left px-5 md:px-7 py-5.5 flex justify-between items-center gap-4 hover:bg-[#FAF9F5]/40 transition-colors focus:outline-none"
                >
                  <span className="font-serif font-black text-sm md:text-base text-slate-850 leading-snug">
                    {faq.question}
                  </span>
                  <div className="shrink-0 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
                    {isExpanded ? (
                      <ChevronUp className="w-4.5 h-4.5 text-[#C5A059]" />
                    ) : (
                      <ChevronDown className="w-4.5 h-4.5" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 md:px-7 pb-6.5 pt-1 text-xs md:text-sm text-slate-500 leading-relaxed border-t border-slate-50 space-y-2 mt-1 text-left">
                        <p>{faq.answer}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#B89047] font-semibold pt-1">
                          <Check className="w-3.5 h-3.5" />
                          Trung tâm thẩm định quốc tế ủy quyền của Đăng Quang hỗ trợ kiểm tra mác chính hãng 24/7.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still need help callout */}
        <div className="bg-[#111827] text-white p-6.5 md:p-8 rounded-3xl border border-[#C5A059]/20 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-radial-gradient from-[#C5A059]/10 to-transparent blur-3xl pointer-events-none"></div>
          
          <div className="space-y-1.5 text-center md:text-left relative z-10">
            <h4 className="font-serif font-bold text-lg text-white">Quý khách vẫn còn câu hỏi phức tạp khác?</h4>
            <p className="text-xs text-slate-400">Đội ngũ nghệ nhân kỹ thuật cơ khí của Đăng Quang luôn túc trực hỗ trợ khẩn cấp.</p>
          </div>

          <a 
            href="tel:18006005"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#B89047] to-[#C5A059] text-[#090D16] font-bold text-xs tracking-wider uppercase shadow-lg hover:scale-105 transition-all text-center shrink-0 w-full md:w-auto"
          >
            LIÊN HỆ ĐƯỜNG DÂY NÓNG TRỰC TIẾP
          </a>
        </div>

      </section>

    </div>
  );
}
