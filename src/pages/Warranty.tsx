/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Clock, 
  Check, 
  X, 
  AlertCircle, 
  Award, 
  Wrench, 
  Calendar, 
  Send, 
  Compass, 
  Sparkles, 
  Fingerprint, 
  Droplet, 
  Activity, 
  Cpu, 
  Gem, 
  CheckCircle2, 
  HelpCircle,
  RefreshCw,
  Sliders,
  QrCode,
  FileText,
  FileDown,
  Zap,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';

interface MockWarranty {
  code: string;
  customerName: string;
  phoneRaw: string;
  productName: string;
  sku: string;
  purchaseDate: string;
  durationYears: number;
  vipTier: 'Gold' | 'Platinum' | 'Diamond';
  remainingDays: number;
  status: 'Hiệu lực' | 'Sắp hết hạn' | 'Hết hiệu lực';
  // Advanced Diagnostics for Swiss Calibration
  diagnostics: {
    amplitude: number; // in degrees (Ideal: 270 - 315)
    dailyRate: number; // s/d (Ideal: -4 to +6 for COSC)
    beatError: number; // ms (Ideal: 0.0 - 0.5)
    frequency: string; // e.g. "28,800 a/h (4Hz)"
    waterPressureTest: string; // e.g. "10 Bar (100% Pass)"
    moistureLevel: string; // e.g. "0.01% (Hermetic Seal)"
    lubricantStatus: 'Tối ưu' | 'Trung bình' | 'Cần thay dầu';
  };
  history: Array<{
    date: string;
    action: string;
    expert: string;
    place: string;
    notes?: string;
  }>;
}

const MOCK_WARRANTIES: Record<string, MockWarranty> = {
  'DQ-2026-EPOS': {
    code: 'DQ-2026-EPOS',
    customerName: 'Triệu Quang Trường',
    phoneRaw: '098*****88',
    productName: 'Epos Swiss Skeleton Chronograph 3424',
    sku: 'EP-3424-SKEL-GOLD',
    purchaseDate: '12/04/2024',
    durationYears: 10,
    vipTier: 'Diamond',
    remainingDays: 2865,
    status: 'Hiệu lực',
    diagnostics: {
      amplitude: 298,
      dailyRate: 1.8,
      beatError: 0.1,
      frequency: '28,800 a/h (4 Hz)',
      waterPressureTest: '5 Bar (100% Pass)',
      moistureLevel: '0.01% (Hermetic)',
      lubricantStatus: 'Tối ưu'
    },
    history: [
      { 
        date: '12/04/2024', 
        action: 'Kích hoạt bảo hành điện tử VIP Toàn quốc', 
        expert: 'Hệ thống tự động', 
        place: 'Showroom 55 Trần Đăng Ninh, HN',
        notes: 'Chào mừng Thượng khách Diamond gia nhập Đăng Quang Elite Club'
      },
      { 
        date: '14/10/2025', 
        action: 'Lau dầu định kỳ & Hiệu chuẩn vi sai COSC', 
        expert: 'Nghệ nhân ưu tú Nguyễn Minh Đức', 
        place: 'Trung tâm Kỹ thuật Quốc Gia Hà Nội',
        notes: 'Châm dầu lót Moebius Thụy Sỹ cao cấp, biên độ dao động khôi phục mức lý tưởng.'
      },
      {
        date: '15/10/2025',
        action: 'Thử nghiệm phòng nén nén sấy & thay thế roăng đáy silicon',
        expert: 'Kỹ sư cao cấp Trần Duy Khang',
        place: 'Trung tâm Kỹ thuật Quốc Gia Hà Nội',
        notes: 'Kiểm định áp thủy lực chống nước đạt 5 Bar khô ráo.'
      }
    ]
  },
  'DQ-7711-ATL': {
    code: 'DQ-7711-ATL',
    customerName: 'Phạm Minh Thư',
    phoneRaw: '091*****12',
    productName: 'Atlantic Swiss Sea-Hunter Auto',
    sku: 'AT-8012-CR-SH',
    purchaseDate: '28/08/2025',
    durationYears: 5,
    vipTier: 'Platinum',
    remainingDays: 1542,
    status: 'Hiệu lực',
    diagnostics: {
      amplitude: 285,
      dailyRate: -2.3,
      beatError: 0.2,
      frequency: '28,000 a/h (4 Hz)',
      waterPressureTest: '10 Bar (100% Pass)',
      moistureLevel: '0.02% (Hermetic)',
      lubricantStatus: 'Tối ưu'
    },
    history: [
      { 
        date: '28/08/2025', 
        action: 'Kích hoạt bảo hành & Kiểm định áp lực nước chân không', 
        expert: 'Kỹ thuật viên Trương Anh Vũ', 
        place: 'Showroom 863 Nguyễn Trãi, TP.HCM',
        notes: 'Test áp suất thủy lực đạt chuẩn 10 ATM đi bơi hoàn thiện.'
      }
    ]
  },
  'DQ-8833-BRU': {
    code: 'DQ-8833-BRU',
    customerName: 'Lê Hải Đăng',
    phoneRaw: '090*****45',
    productName: 'Bruno Söhnle Glashütte Quartz Precision',
    sku: 'BS-9912-PREC-QTZ',
    purchaseDate: '15/01/2021',
    durationYears: 5,
    vipTier: 'Gold',
    remainingDays: -142,
    status: 'Hết hiệu lực',
    diagnostics: {
      amplitude: 0, // Quartz do not have mechanical amplitude
      dailyRate: 0.1, // extremely precise quartz
      beatError: 0.0,
      frequency: '32,768 Hz Tuned Quartz',
      waterPressureTest: '3 Bar (Pass)',
      moistureLevel: '0.05% (Hermetic - Seal aged)',
      lubricantStatus: 'Cần thay dầu'
    },
    history: [
      { 
        date: '15/01/2021', 
        action: 'Kích hoạt bảo hành điện tử', 
        expert: 'Hệ thống tự động', 
        place: 'Showroom 235 Hùng Vương, Đà Nẵng',
        notes: 'Mua nguyên hộp chính hãng.' 
      },
      { 
        date: '20/03/2023', 
        action: 'Thay pin cúc áo Renata Thụy Sỹ miễn phí trọn đời', 
        expert: 'Kỹ sư Phạm Hoàng Long', 
        place: 'Showroom 235 Hùng Vương, Đà Nẵng',
        notes: 'Thay thế miễn phí trọn vẹn đặc quyền VIP Đăng Quang.' 
      }
    ]
  }
};

const createWarrantyFromOrder = (order: any): MockWarranty => {
  const firstItem = order.items?.[0];
  const firstProduct = firstItem?.product;
  const extraItems = Math.max((order.items?.length || 1) - 1, 0);
  const purchaseDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("vi-VN")
    : new Date().toLocaleDateString("vi-VN");
  const durationYears = Number(order.totalDiscounted || 0) >= 10000000 ? 10 : 5;
  const vipTier: MockWarranty["vipTier"] =
    Number(order.totalDiscounted || 0) >= 30000000 ? "Diamond" : Number(order.totalDiscounted || 0) >= 10000000 ? "Platinum" : "Gold";

  return {
    code: order.warrantyCode || order.id,
    customerName: order.customerName || "Khách hàng Đăng Quang Watch",
    phoneRaw: order.customerPhone || "",
    productName: firstProduct ? `${firstProduct.name}${extraItems > 0 ? ` và ${extraItems} sản phẩm khác` : ""}` : "Sản phẩm Đăng Quang Watch",
    sku: firstProduct?.code || order.id,
    purchaseDate,
    durationYears,
    vipTier,
    remainingDays: durationYears * 365,
    status: MOCK_WARRANTIES["DQ-2026-EPOS"].status,
    diagnostics: {
      amplitude: 288,
      dailyRate: 2,
      beatError: 0.2,
      frequency: "28,800 a/h (4 Hz)",
      waterPressureTest: "5 Bar",
      moistureLevel: "0.02%",
      lubricantStatus: MOCK_WARRANTIES["DQ-2026-EPOS"].diagnostics.lubricantStatus,
    },
    history: [
      {
        date: purchaseDate,
        action: "Kích hoạt bảo hành điện tử từ hóa đơn mua hàng",
        expert: "Hệ thống Đăng Quang Watch",
        place: "Đơn hàng trực tuyến",
        notes: `Mã đơn hàng ${order.id} đã được liên kết với mã bảo hành ${order.warrantyCode || order.id}.`,
      },
    ],
  };
};

export default function WarrantyView() {
  // Search tool state
  const [warrantyCodeInput, setWarrantyCodeInput] = useState<string>('');
  const [searchResult, setSearchResult] = useState<MockWarranty | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>('');

  // Redesign: Interactive Step-by-Step Swiss Overhaul Process State
  const [activeStep, setActiveStep] = useState<number>(0);

  // Redesign: VIP Perks and Warranty Calculator State
  const [calcBrand, setCalcBrand] = useState<string>('Epos Swiss');
  const [calcValue, setCalcValue] = useState<number>(35000000); // 35 million VNĐ by default

  // Search filter for FAQs
  const [faqQuery, setFaqQuery] = useState<string>('');

  // Active policy type tab state
  const [activePolicyTab, setActivePolicyTab] = useState<'machine' | 'battery' | 'water' | 'case-glass' | 'non-covered'>('machine');

  // Booking Warranty Service form state
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    warrantyCode: '',
    serviceType: 'Lau dầu cơ khí automatic & tinh chỉnh COSC Thụy Sỹ',
    date: '',
    branch: 'Showroom 55 Trần Đăng Ninh (HQ Cầu Giấy)',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Search logic
  const handleWarrantySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = warrantyCodeInput.trim().toUpperCase();
    
    if (!cleanCode) {
      setSearchError('Vui lòng điền mã số thẻ bảo hành (Ví dụ: DQ-2026-EPOS)');
      setSearchResult(null);
      setHasSearched(false);
      return;
    }

    setSearchError('');
    try {
      const response = await fetch(`/api/warranty/${encodeURIComponent(cleanCode)}`);
      const data = await response.json();

      if (response.ok && data.order) {
        setSearchResult(createWarrantyFromOrder(data.order));
        setHasSearched(true);
        return;
      }
    } catch {
      // Fall back to the local sample warranty cards when the API is unavailable.
    }

    if (MOCK_WARRANTIES[cleanCode]) {
      setSearchResult(MOCK_WARRANTIES[cleanCode]);
      setHasSearched(true);
    } else {
      setSearchResult(null);
      setHasSearched(true);
      setSearchError('Không tìm thấy tài khoản thẻ bảo hành số trùng khớp. Quý khách hãy dùng thử các mã mẫu bên dưới của hệ thống.');
    }
  };

  // Form Booking Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!bookingForm.name.trim()) errs.name = 'Vui lòng cung cấp họ và tên quý khách';
    if (!bookingForm.phone.trim()) {
      errs.phone = 'Vui lòng cung cấp số điện thoại liên lạc';
    } else if (!/^[0-9.‐+()\s]{9,12}$/.test(bookingForm.phone.replace(/\s+/g, ''))) {
      errs.phone = 'Số điện thoại không hợp lệ (9 - 12 chữ số)';
    }
    if (!bookingForm.date) {
      errs.date = 'Vui lòng chọn thời gian quý khách mong muốn ghé qua';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit booking
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  // Reset Form
  const resetBookingForm = () => {
    setBookingForm({
      name: '',
      phone: '',
      warrantyCode: '',
      serviceType: 'Lau dầu cơ khí automatic & tinh chỉnh COSC Thụy Sỹ',
      date: '',
      branch: 'Showroom 55 Trần Đăng Ninh (HQ Cầu Giấy)',
      notes: ''
    });
    setIsSuccess(false);
  };

  // 9-Step Overhaul Details
  const OVERHAUL_STEPS = [
    {
      title: 'Thẩm định & Chuẩn đoán sơ bộ',
      sub: 'Chẩn đoán âm học ban đầu bằng thiết bị Witschi máy đo nhịp độ.',
      desc: 'Nghệ nhân đo lường biên độ dao động (Amplitude), tần số sai số giây dạng đồ thị và kiểm tra phân cực từ của vỏ kim loại. Lập kế hoạch phân rã chi tiết.',
      tools: 'Witschi Chronoscope, Elma Antimag Demagnetizer',
      time: '15 - 30 Phút'
    },
    {
      title: 'Tách vỏ bọc & Tháo gỡ vi linh kiện',
      sub: 'Phân rã máy cơ và sườn vỏ đồng hồ một cách tỉ mỉ nhất.',
      desc: 'Sử dụng tua vít vi lượng của Thụy Sỹ tháo dỡ nắp lưng, mặt hiển thị kính, bộ kim chỉ giờ và sau đó tách rời bộ máy gạt cơ học khỏi khung sườn kim loại an toàn.',
      tools: 'Hệ kính hiển vi cơ học Leica, Bộ nhíp chống trầy Bergeon',
      time: '30 Phút'
    },
    {
      title: 'Tẩy sửa bể dòng siêu âm đa bể',
      sub: 'Chăm sóc, rửa rã vết dầu khô cặn trong hệ thống dung môi Thụy Sỹ.',
      desc: 'Toàn bộ bánh răng, trục niken, cầu máy, con xoay rotor được đặt vào rổ rây lưới vi mỏng và sấy tẩy tự động qua 4 phòng xoáy sấy dung môi Elmasolvex cao cấp.',
      tools: 'Hệ máy rửa siêu âm tự động Elmasolvex VA',
      time: '45 Phút'
    },
    {
      title: 'Kiểm tra hao mòn & Thay thế nguyên trang',
      sub: 'Giám định lực phục tùng dưới độ phóng đại 40x.',
      desc: 'Nghệ nhân kiểm định xem hệ răng bánh xe có bị sứt mẻ góc, trục lá có rơ mòn, hay ổ có lỏng rộng hở chân đá ruby xước không. Các linh kiện kém đạt sẽ được thay thế 100% chính hãng.',
      tools: 'Kính núp Horotec Thụy Sỹ, Trục xỏ ổ chân kính',
      time: '30 Phút'
    },
    {
      title: 'Lắp ráp tỉ mỉ & Tra mỡ bôi trơn Moebius',
      sub: 'Ráp liên kết cơ cấu & bổ sung sáu loại dầu chuyên biệt.',
      desc: 'Đây là linh hồn kỹ nghệ. Kỹ sư tra dầu Moebius Thụy Sỹ với liều lượng chính xác đến 1/10 giọt tại mỗi vị trí đặc thù: dầu đặc cho ổ cót, dầu nhẹ cho bánh thoát và mỡ đặc chế cho ngựa gạt.',
      tools: 'Kim châm nhớt lỏng dầu Moebius 100% Swiss Made',
      time: '60 Phút'
    },
    {
      title: 'Hiệu chuẩn đa chiều vi sai thế nằm',
      sub: 'Khống chế biên độ COSC tối cao đạt dưới 5 giây/ngày.',
      desc: 'Đặt máy đồng hồ lên giá đỡ máy phân tích Witschi xoay 5 đến 6 vị trí thế nằm thiết yếu (Ngửa mặt, úp mặt, núm hướng lên, hướng xuống...). Tinh chỉnh dây tóc xoắn ốc thăng bằng tuyệt vỹ.',
      tools: 'Witschi Analyzer 2, Bộ vặn cót hiệu chỉnh và bánh gai',
      time: '30 - 45 Phút'
    },
    {
      title: 'Lắp gioăng đệm & bơm nén khí Argon khô',
      sub: 'Niêm kín sườn vỏ chống ẩm tuyệt mật.',
      desc: 'Toàn bộ gioăng cao su nắp đáy, mặt kính, trục núm ty được thay thế hoàn toàn bằng gioăng dẻo silicon Thụy Sỹ mỡ bôi trơn mỡ silicone chống thấm, kèm bơm niêm kín chống sương muối.',
      tools: 'Mỡ Silicon kỹ nghệ dán màng Horotec',
      time: '20 Phút'
    },
    {
      title: 'Kiểm nghiệm áp lực nước chân không phòng nén',
      sub: 'Chứng thực chỉ số ATM bằng lực nén khí và nước thực tế.',
      desc: 'Đặt đồng hồ vào buồng nén Proofmaster để thử nghiệm kiểm chứng độ đàn hồi giãn vỏ cơ học dưới không khí nén, đảm bảo độ kín từ 3ATM đến 10ATM không có bọt khí sùi lọt.',
      tools: 'Máy thử nước Proofmaster Thụy Sỹ',
      time: '15 Phút'
    },
    {
      title: 'Giám định thẩm mỹ & Quan sát sai số 72-120H',
      sub: 'Chạy thử nghiệm độc lập trên cánh tay Robot xoay ly tâm.',
      desc: 'Sau khi hoàn thành lắp sườn, đồng hồ được đặt trên máy tự động xoay 360 độ liên tục mô phỏng hành vi thể thao của người đeo trong 3 ngày đêm để thử mức giữ dự trữ năng lượng cót và độ ổn định.',
      tools: 'Vòng xoay Cyclotest sạc cót, Hệ kính phóng đại kiểm tra kẽ bụi sườn',
      time: '72 - 120 Giờ'
    }
  ];

  // Dynamic calculation values for perks calculator
  const calculatedSpecs = useMemo(() => {
    let warrantyYears = 2;
    let unlockedVIP = 'Gold VIP';
    let discountPercent = 5;
    let oilDiscount = 'Miễn phí lau dầu 20%';
    let transportPerk = 'Miễn phí chuyển phát đồng hồ sửa chữa';
    let cardGradient = 'from-[#B89047] via-[#D5B26A] to-[#C5A059]';
    let prestigeLevel = 'Prestige Level I';

    if (calcBrand === 'Epos Swiss' || calcBrand === 'Atlantic Swiss') {
      warrantyYears = 5;
    } else if (calcBrand === 'Bruno Söhnle') {
      warrantyYears = 5;
    } else {
      warrantyYears = 2;
    }

    if (calcValue >= 100000000) {
      unlockedVIP = 'Diamond VIP';
      discountPercent = 15;
      oilDiscount = 'Miễn phí lau dầu 100% TRỌN ĐỜI MÁY';
      transportPerk = 'Đại diện Đăng Quang đón trả đồng hồ tận tư gia VIP';
      cardGradient = 'from-[#111827] via-[#1E2937] to-[#090D16] border-2 border-[#C5A059]';
      prestigeLevel = 'Prestige Level III (Highest Honor)';
      warrantyYears += 5; // Extra 5 years for premium collection watches
    } else if (calcValue >= 40000000) {
      unlockedVIP = 'Platinum VIP';
      discountPercent = 10;
      oilDiscount = 'Miễn phí lau dầu 50% trọn đời';
      transportPerk = 'Bảo hiểm trọn gói chuyển phát nhanh 100% miễn phí';
      cardGradient = 'from-[#2D3748] via-[#1E2937] to-[#111827] border border-[#C5A059]';
      prestigeLevel = 'Prestige Level II';
      warrantyYears += 2; // Extra 2 years
    } else if (calcValue >= 15000000) {
      unlockedVIP = 'Gold VIP';
      discountPercent = 5;
      oilDiscount = 'Miễn phí lau dầu 30% trọn đời';
      transportPerk = 'Miễn phí giao trả tại mọi Showroom Đăng Quang';
      cardGradient = 'from-[#2D303D] via-[#1A1C23] to-[#0B0C0F] border border-slate-800';
      prestigeLevel = 'Prestige Level I';
    } else {
      unlockedVIP = 'Standard Member';
      discountPercent = 2;
      oilDiscount = 'Hỗ trợ lau dầu chuẩn giá gốc hãng';
      transportPerk = 'Nhận trả máy trực tiếp tại Boutique';
      cardGradient = 'from-[#4B5563] via-[#374151] to-[#1F2937]';
      prestigeLevel = 'Base Member Level';
    }

    return {
      warrantyYears,
      unlockedVIP,
      discountPercent,
      oilDiscount,
      transportPerk,
      cardGradient,
      prestigeLevel
    };
  }, [calcBrand, calcValue]);

  // FAQ mock list
  const FAQS = [
    {
      q: 'Tôi không giữ thẻ vật lý bằng nhựa, có được Đăng Quang bảo dưỡng máy không?',
      a: 'Hoàn toàn ĐƯỢC và bình thường. Toàn bộ thông tin mua hàng của quý khách từ số điện thoại, tên, cấu trúc máy, ngày giao dịch đều được số hóa đồng bộ tức thì trên Máy chủ Trung tâm Đăng Quang Cloud. Bạn chỉ cần đọc số điện thoại để kỹ thuật truy cập hồ sơ bảo trì lịch sử.'
    },
    {
      q: 'Chính sách thay pin miễn phí trọn đời có áp dụng cho đồng hồ cơ (Automatic) không?',
      a: 'Không, chương trình đặc quyền này chỉ áp dụng cho sản phẩm pin Thạch Anh (Quartz/Solarglow-Pin năng lượng ánh sáng) vốn cần nạp năng lượng định kỳ. Đồng hồ cơ (Automatic/Hand-winding) vận hành thông qua lò xo dây tóc tự động nên không sử dụng pin, thay vào đó quý khách hưởng chính sách miễn phí căn chỉnh sai số COSC Thụy Sỹ vô hạn lần.'
    },
    {
      q: 'Quá trình đại tu toàn bộ (lau dầu, thay gioăng, chống nước) diễn ra trong bao lâu?',
      a: 'Với tính cẩn trọng tuyệt đối, quy trình tháo dỡ vệ sinh siêu thanh rã vi mạch mỏng, tinh chỉnh sai số 5 thế nằm và quan sát trữ năng lượng ổn định COSC yêu cầu tối thiểu từ 24 đến 48 giờ chạy kiểm định thực tế. Đăng Quang từ chối làm ẩu lấy ngay để tránh sai lỗi cơ học đáng tiếc.'
    },
    {
      q: 'Đăng Quang có sửa chữa đồng hồ mua tại luồng hàng xách tay bên ngoài không?',
      a: 'Có. Là hệ thống phân phối và đại tu đồng hồ chính quy chuẩn Châu Âu lớn hàng đầu Việt Nam, Xưởng Kỹ thuật Đăng Quang mở cửa tiếp nhận toàn bộ các cỗ máy nhập ngoại xách tay chính hãng Thụy Sỹ, Nhật Bản... với bảng phí hỗ trợ tối đa linh kiện đặc thù Moebius tiêu chuẩn quốc tế.'
    },
    {
      q: 'Đồng hồ bị hấp hơi mờ sương mặt kính Sapphire trong có thuộc phạm vi bảo hành miễn phí?',
      a: 'Nếu đồng hồ còn trong hạn bảo hành và phát sinh hấp mờ do mép roăng lão hóa lỗi tự nhiên từ nhà sản xuất, Đăng Quang sẽ thực hiện tháo sấy nén chân không nạp khí Argon miễn phí cho quý vị. Nếu xảy ra do người dùng mở núm kéo giờ ngoài mưa ẩm hoặc mang xông hơi nhiệt độ cao, hệ thống hỗ trợ sấy khôi phục với 50% hỗ trợ chi phí gioăng silicone mới.'
    },
    {
      q: 'Làm thế nào để đổi mới nguyên chiếc nếu máy phát sinh trục trặc kỹ thuật lỗi nhà sản xuất?',
      a: 'Tập đoàn Đăng Quang bảo hộ quyền lợi tối đa: Đổi mới 100% 1-đổi-1 sang sản phẩm cùng loại hoặc tương đương giá trị trong vòng 30 ngày đầu mua sắm nếu Biên bản của Hội đồng Kỹ sư Đăng Quang ghi nhận lỗi lỗi nghiêm trọng từ động cơ phát hành từ nhà máy.'
    }
  ];

  // Filtering FAQs
  const filteredFaqs = FAQS.filter(faq => {
    return faq.q.toLowerCase().includes(faqQuery.toLowerCase()) || 
           faq.a.toLowerCase().includes(faqQuery.toLowerCase());
  });

  return (
    <div className="space-y-24 bg-[#FCFBF8] text-[#1E293B] font-sans antialiased selection:bg-[#C5A059]/20 selection:text-[#B89047]">
      
      {/* SECTION 1: MASTER LUXURY HERO BRAND BANNER */}
      <section className="relative bg-[#090C15] text-white py-24 md:py-32 px-4 md:px-8 overflow-hidden border-b border-[#C5A059]/20">
        {/* Background watch image */}
        <img
          src="/images/hero-warranty-technical.png"
          alt="Nền xác thực bảo hành Đăng Quang Watch"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-90 brightness-[0.9] contrast-[1.14] saturate-[1.05]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,18,0.62)_0%,rgba(7,14,24,0.48)_42%,rgba(7,14,24,0.20)_72%,rgba(7,14,24,0.04)_100%),radial-gradient(circle_at_72%_35%,rgba(197,160,89,0.18),transparent_34%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,14,0.12)_0%,rgba(2,6,14,0)_46%,rgba(2,6,14,0.26)_100%)]"></div>
        {/* Subtle decorative grid lines inspired by luxury watches blueprint */}
        <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(rgba(197,160,89,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.16)_1px,transparent_1px)] bg-[size:28px_28px]"></div>
        
        {/* Absolute rotating gear outlines behind */}
        <div className="absolute right-[-15%] top-[-10%] w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full border border-[#C5A059]/10 pointer-events-none flex items-center justify-center opacity-30">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full rounded-full border border-dashed border-[#C5A059]/15 flex items-center justify-center"
          >
            <div className="w-[80%] h-[80%] rounded-full border border-[#C5A059]/10 flex items-center justify-center">
              <Compass className="w-12 h-12 text-[#C5A059]/10 animate-pulse" />
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-[#C5A059]/40 bg-[#1A2238] text-[#C5A059] text-[10px] tracking-widest uppercase font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              TRUNG TÂM KỸ THUẬT QUỐC GIA ĐĂNG QUANG CONCIERGE CARE
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-none text-white">
              Định Chế Bảo Hộ <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B89047] via-[#F4D086] to-[#C5A059]">
                Kỹ Nghệ Thụy Sỹ
              </span>
            </h1>

            <p className="text-slate-350 text-xs md:text-sm leading-relaxed max-w-xl">
              Mỗi sản phẩm thời gian sắm tại Đăng Quang là biểu hiện của phong thái sống chuẩn mực. Để bảo vệ kiệt tác của quý thượng khách trước tác nhân hao mòn vật lý, chúng tôi thiết lập định chế bảo hành đỉnh cao: kết hợp giữa Nghệ Nhân Ưu Tú, Thiết Bị Căn Chỉnh COSC Đầy Đủ và đặc quyền Thẻ Điện Tử VIP trọn đời.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#digital-lookup-terminal" 
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#B89047] to-[#C5A059] text-[#090D16] font-extrabold text-[11px] tracking-widest uppercase shadow-xl hover:scale-[1.01] transition-all"
              >
                Tra cứu hồ sơ máy điện tử
              </a>
              <a 
                href="#9step-atelier-experience" 
                className="px-6 py-4 rounded-xl bg-[#1F293D] hover:bg-[#2A3752] text-slate-200 border border-slate-700/80 font-extrabold text-[11px] tracking-widest uppercase transition-all"
              >
                9 Bước Đại Tu Chuẩn Thụy Sỹ
              </a>
            </div>
          </div>

          {/* Golden Badge Grid Metrics */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            
            <div className="bg-[#1A2238]/60 backdrop-blur-md p-5 rounded-2.5xl border border-[#C5A059]/20 flex flex-col justify-between text-left h-36">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/25 flex items-center justify-center text-[#C5A059]">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-2xl font-serif font-black text-white leading-none">10 NĂM</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5">Bảo hành vàng cơ học</span>
              </div>
            </div>

            <div className="bg-[#1A2238]/60 backdrop-blur-md p-5 rounded-2.5xl border border-[#C5A059]/20 flex flex-col justify-between text-left h-36">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/25 flex items-center justify-center text-[#C5A059]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-2xl font-serif font-black text-[#C5A059] leading-none">TRỌN ĐỜI</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5">Thay pin Renata miễn phí</span>
              </div>
            </div>

            <div className="bg-[#1A2238]/60 backdrop-blur-md p-5 rounded-2.5xl border border-[#C5A059]/20 flex flex-col justify-between text-left h-36">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/25 flex items-center justify-center text-[#C5A059]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-2xl font-serif font-black text-white leading-none">COSC CHUẨN</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5">Cân chỉnh vi sai 5 vị trí</span>
              </div>
            </div>

            <div className="bg-[#1A2238]/60 backdrop-blur-md p-5 rounded-2.5xl border border-[#C5A059]/20 flex flex-col justify-between text-left h-36">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/25 flex items-center justify-center text-[#C5A059]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-2xl font-serif font-black text-[#C5A059] leading-none">CAM KẾT 10X</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5">Đền gấp 10 lần nếu giả mạo</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: INTERACTIVE DIGITAL WARRANTY LOOKUP & SWISS DIAGNOSTIC TERMINAL */}
      <section id="digital-lookup-terminal" className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#C5A059] text-[11px] tracking-widest uppercase font-bold">Cloud Synced Real-time Database</span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 leading-tight">
            Cổng Tra Cứu Bảo Hành Điện Tử & Nhật Ký Kỹ Thuật
          </h2>
          <div className="w-14 h-0.5 bg-[#C5A059] mx-auto"></div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Nhập mã thẻ VIP khắc bằng tia laser quang học trên thẻ cứng nhận được khi mua sắm để truy vấn đầy đủ thông số gốc máy, sai số COSC, biên độ ngấm nước và nhật ký bàn bàn tay thợ cả sửa chữa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left search pane (5 cols) */}
          <div className="lg:col-span-5 bg-white p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-xl flex flex-col justify-between space-y-6">
            
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <Fingerprint className="w-5 h-5 text-[#C5A059]" />
                <div>
                  <h4 className="font-serif font-black text-slate-900 text-sm md:text-base leading-none">Mã Bảo Mật Xác Thực</h4>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider">SECURE CONCIERGE VALIDATOR</span>
                </div>
              </div>

              <form onSubmit={handleWarrantySearch} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 tracking-wider uppercase block">Nhập mã số thẻ bảo hành *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={warrantyCodeInput}
                      onChange={e => setWarrantyCodeInput(e.target.value)}
                      placeholder="Nhập mã thẻ mẫu: DQ-2026-EPOS..."
                      className="w-full pl-4 pr-11 py-3.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:border-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]/20 font-mono tracking-wider text-slate-900 uppercase placeholder:normal-case font-semibold"
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-2 p-1.5 rounded-lg bg-[#0F1424] hover:bg-[#1E293F] text-[#C5A059] transition-all"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3.5 rounded-xl bg-[#0F1424] text-[#C5A059] hover:text-white font-bold text-xs uppercase tracking-widest border border-[#C5A059]/30 hover:bg-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <QrCode className="w-4 h-4 text-[#C5A059]" />
                TÌm kiếm bảo hành
                </button>
              </form>

              {searchError && (
                <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2 leading-normal">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-500 mt-0.5" />
                  <span>{searchError}</span>
                </div>
              )}
            </div>

            {/* Quick click options with rich label */}
            <div className="bg-[#FAF9F5] p-5 rounded-2.5xl border border-[#C5A059]/15 text-left">
              <span className="text-[10px] uppercase font-bold text-[#C5A059] block mb-3.5 tracking-wider">
                CHỌN THỬ MÃ BẢO HÀNH GỐC ĐỂ KIỂM TRA :
              </span>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setWarrantyCodeInput('DQ-2026-EPOS');
                    setSearchResult(MOCK_WARRANTIES['DQ-2026-EPOS']);
                    setHasSearched(true);
                    setSearchError('');
                  }}
                  className="w-full text-left font-mono text-xs font-bold text-slate-800 hover:text-[#C5A059] flex items-center justify-between p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#C5A059]"></div>
                    <span>DQ-2026-EPOS (Epos Swiss)</span>
                  </div>
                  <span className="text-[9px] bg-[#C5A059]/15 text-[#C5A059] px-2 py-0.5 rounded uppercase font-sans font-black">Diamond VIP</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWarrantyCodeInput('DQ-7711-ATL');
                    setSearchResult(MOCK_WARRANTIES['DQ-7711-ATL']);
                    setHasSearched(true);
                    setSearchError('');
                  }}
                  className="w-full text-left font-mono text-xs font-bold text-slate-800 hover:text-[#C5A059] flex items-center justify-between p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <span>DQ-7711-ATL (Atlantic Swiss)</span>
                  </div>
                  <span className="text-[9px] bg-slate-200 text-slate-650 px-2 py-0.5 rounded uppercase font-sans font-black">Platinum VIP</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWarrantyCodeInput('DQ-8833-BRU');
                    setSearchResult(MOCK_WARRANTIES['DQ-8833-BRU']);
                    setHasSearched(true);
                    setSearchError('');
                  }}
                  className="w-full text-left font-mono text-xs font-bold text-slate-800 hover:text-[#C5A059] flex items-center justify-between p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span>DQ-8833-BRU (Bruno S.)</span>
                  </div>
                  <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase font-sans font-black">Hết hạn</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right medical diagnostic results (7 cols) */}
          <div className="lg:col-span-7 bg-[#0E1322] text-white rounded-3xl border border-[#C5A059]/25 shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[480px]">
             {/* Blueprint matrix backdrop */}
             <div className="absolute inset-0 bg-[#070A14] opacity-[0.4] bg-[linear-gradient(rgba(197,160,89,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
             
             <AnimatePresence mode="wait">
               {hasSearched && searchResult ? (
                 <motion.div
                   key="diagnostic-report"
                   initial={{ opacity: 0, scale: 0.98, y: 10 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.98, y: -10 }}
                   className="p-6 md:p-8 space-y-6 text-left relative z-10"
                 >
                   {/* Diagnostic Header */}
                   <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-4">
                     <div>
                       <span className="text-[8px] bg-gradient-to-r from-[#B89047] to-[#C5A059] text-[#090D16] px-2 py-0.5 rounded font-black uppercase tracking-wider block w-max mb-1.5 font-sans">
                         ATELIER SECURE IDENTITY
                       </span>
                       <h3 className="text-2xl font-serif font-black text-white flex items-center flex-wrap gap-2.5">
                         {searchResult.customerName}
                         <span className="text-[10px] bg-amber-500/15 text-[#C5A059] border border-[#C5A059]/40 px-2.5 py-0.5 rounded-full font-sans uppercase font-black tracking-widest">
                           {searchResult.vipTier} Member
                         </span>
                       </h3>
                     </div>
                     <div className="text-right shrink-0">
                       <span className="text-[9px] text-[#C5A059] font-mono block uppercase">Hợp đồng điện tử</span>
                       <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full border mt-1 select-none ${
                         searchResult.status === 'Hiệu lực' 
                           ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                           : 'bg-red-500/10 text-red-400 border-red-500/30'
                       }`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${searchResult.status === 'Hiệu lực' ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`}></span>
                         {searchResult.status.toUpperCase()}
                       </span>
                     </div>
                   </div>

                   {/* Holographic Digital VIP Card Illustration */}
                   <div className="relative group">
                     {/* Gradient shadow backing */}
                     <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#B89047] to-[#C5A059] opacity-30 blur-md pointer-events-none group-hover:opacity-65 transition-all"></div>
                     
                     <div className="relative bg-gradient-to-tr from-[#1E293B] via-[#0F172A] to-[#010515] p-5 rounded-2xl border border-[#C5A059]/40 text-left space-y-4 shadow-xl overflow-hidden">
                       {/* Shiny particle circle overlay list */}
                       <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full border border-[#C5A059]/15 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none"></div>
                       
                       <div className="flex justify-between items-start">
                         <div className="space-y-0.5">
                           <span className="text-[8px] font-bold text-slate-500 tracking-[0.2em] block">ELECTRONIC WARRANTY CERTIFICATE</span>
                           <span className="text-[15px] font-serif font-black text-[#C5A059] tracking-widest">ĐĂNG QUANG WATCH GROUP</span>
                         </div>
                         <Fingerprint className="w-8 h-8 text-[#C5A059]/80 animate-pulse" />
                       </div>

                       <div className="space-y-1 pt-2">
                         <span className="text-[9px] text-slate-400 tracking-wider font-mono block">CỖ MÁY THỰC THỂ</span>
                         <h4 className="text-sm font-serif font-bold text-white tracking-wide leading-tight">{searchResult.productName}</h4>
                         <span className="font-mono text-[10px] text-slate-400 block tracking-wider">SKU Code: <span className="text-slate-205">{searchResult.sku}</span></span>
                       </div>

                       <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/80 text-[10px] font-mono">
                         <div>
                           <span className="text-slate-500 block">CARD ID NO.</span>
                           <span className="text-slate-200 font-bold">{searchResult.code}</span>
                         </div>
                         <div>
                           <span className="text-slate-500 block">KÍCH HOẠT</span>
                           <span className="text-slate-200 font-bold">{searchResult.purchaseDate}</span>
                         </div>
                         <div>
                           <span className="text-slate-500 block">BẢO CHỮA</span>
                           <span className="text-[#C5A566] font-bold">{searchResult.durationYears} Năm VIP</span>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Master Swiss Diagnostic Diagnostics Panel (Visual sensors) */}
                   <div className="space-y-3">
                     <span className="block text-[10px] font-bold text-[#C5A059] uppercase tracking-widest flex items-center gap-1.5 font-mono">
                       <Activity className="w-3.5 h-3.5 animate-pulse" />
                       MASTER HOROLOGICAL CALIBRATION DATA (CHỈ SỐ COSC & ÁP NƯỚC)
                     </span>
                     
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                       
                       {/* Amplitude Sensor */}
                       <div className="bg-[#111A2E] p-3 rounded-xl border border-slate-800 flex flex-col justify-between h-20 text-left">
                         <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">Amplitude (Biên độ)</span>
                         <div>
                           <span className="text-sm font-serif font-bold text-white block leading-none">
                             {searchResult.diagnostics.amplitude > 0 ? `${searchResult.diagnostics.amplitude}°` : 'N/A (Quartz)'}
                           </span>
                           <span className="text-[8px] text-emerald-400 uppercase font-mono tracking-widest block mt-1 font-bold">
                             {searchResult.diagnostics.amplitude > 0 ? '● Tuyệt hảo (COSC)' : 'Pin Điện Tử'}
                           </span>
                         </div>
                       </div>

                       {/* Daily Rate Sensor */}
                       <div className="bg-[#111A2E] p-3 rounded-xl border border-slate-800 flex flex-col justify-between h-20 text-left">
                         <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">Daily Rate (Sai số)</span>
                         <div>
                           <span className="text-sm font-bold text-white font-mono block leading-none">
                             {searchResult.diagnostics.dailyRate >= 0 ? `+${searchResult.diagnostics.dailyRate} s/d` : `${searchResult.diagnostics.dailyRate} s/d`}
                           </span>
                           <span className="text-[8px] text-[#C5A059] uppercase font-mono tracking-widest block mt-1 font-black">
                             {searchResult.vipTier === 'Diamond' ? '● CHUẨN THỦY SỸ' : '● ĐÃ TINH CHỈNH'}
                           </span>
                         </div>
                       </div>

                       {/* Moisture level */}
                       <div className="bg-[#111A2E] p-3 rounded-xl border border-slate-800 flex flex-col justify-between h-20 text-left col-span-2 sm:col-span-1">
                         <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">Buồng ẩm (Moisture)</span>
                         <div>
                           <span className="text-sm font-bold text-white font-mono block leading-none">
                             {searchResult.diagnostics.moistureLevel}
                           </span>
                           <span className="text-[8px] text-emerald-400 uppercase font-mono tracking-widest block mt-1 font-bold">
                             ● Hermetic Seal OK
                           </span>
                         </div>
                       </div>

                       {/* Beat Error Sensor */}
                       <div className="bg-[#111A2E] p-3 rounded-xl border border-slate-800 flex flex-col justify-between h-20 text-left">
                         <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">Góc Lệch (Beat Error)</span>
                         <div>
                           <span className="text-sm font-bold text-white font-mono block leading-none">
                             {searchResult.diagnostics.beatError} ms
                           </span>
                           <span className="text-[8px] text-emerald-400 uppercase font-mono tracking-wider block mt-1 font-bold">
                             ● Khớp Trục 100%
                           </span>
                         </div>
                       </div>

                       {/* Water pressure */}
                       <div className="bg-[#111A2E] p-3 rounded-xl border border-slate-800 flex flex-col justify-between h-20 text-left">
                         <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">Chịu lực nước</span>
                         <div>
                           <span className="text-sm font-bold text-white font-mono block leading-none">
                             {searchResult.diagnostics.waterPressureTest}
                           </span>
                           <span className="text-[8px] text-[#C5A059] uppercase font-mono tracking-wider block mt-1 font-black">
                             ● Thử áp lực khí nén
                           </span>
                         </div>
                       </div>

                       {/* Lubricant Status */}
                       <div className="bg-[#111A2E] p-3 rounded-xl border border-slate-800 flex flex-col justify-between h-20 text-left col-span-2 sm:col-span-1">
                         <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">Trạng thái Dầu máy</span>
                         <div>
                           <span className={`text-sm font-bold block leading-none ${
                             searchResult.diagnostics.lubricantStatus === 'Cần thay dầu' ? 'text-red-400' : 'text-slate-105'
                           }`}>
                             {searchResult.diagnostics.lubricantStatus}
                           </span>
                           <span className="text-[8px] text-slate-500 uppercase font-mono tracking-wider block mt-1 font-bold">
                             {searchResult.diagnostics.lubricantStatus === 'Tối ưu' ? 'Moebius Synthetics' : 'Hết hạn bảo dưỡng'}
                           </span>
                         </div>
                       </div>

                     </div>
                   </div>

                   {/* Diagnostic Timeline Logs */}
                   <div className="space-y-3">
                     <span className="block text-[10px] font-bold text-[#C5A059] uppercase tracking-widest flex items-center gap-1.5 font-mono">
                       <FileText className="w-3.5 h-3.5" />
                       LỊCH SỬ KHỞI PHỤC & ĐẠI TU TẠI QUỐC GIA (LOGS)
                     </span>
                     <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                       {searchResult.history.map((h, i) => (
                         <div key={i} className="bg-[#090D18] border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                           <div className="flex justify-between items-center text-[10px]">
                             <span className="text-[#C5A059] font-bold font-mono">{h.date}</span>
                             <span className="text-slate-500 font-mono italic">{h.place}</span>
                           </div>
                           <h5 className="font-extrabold text-white">{h.action}</h5>
                           <p className="text-slate-450 text-[11px] leading-relaxed italic">
                             &ldquo;{h.notes || 'Không ghi nhận ghi chú bổ sung.'}&rdquo;
                           </p>
                           <span className="block text-[9px] text-slate-550 mt-1 font-mono uppercase">
                             Nghệ Nhân Đảm Trách: <span className="text-slate-350 font-bold">{h.expert}</span>
                           </span>
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* Action: Download digital warranty card */}
                   <div className="pt-2 flex flex-wrap gap-3">
                     <button
                       type="button"
                       onClick={() => alert(`Chứng Nhận Bảo Hành VIP Đăng Quang điện tử:
Mã: ${searchResult.code}
Thượng khách: ${searchResult.customerName}
Duyệt hệ thống: Thụy Sỹ Approved
Mã hóa bảo vệ: 256-Bit SHA.`)}
                       className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-750 text-slate-200 text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all text-center select-none"
                     >
                       <FileDown className="w-4 h-4 text-[#C5A059]" />
                       Xuất thẻ Chứng nhận
                     </button>
                     <a 
                       href="#concierge-quick-booking"
                       className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#B89047] via-[#C5A059] to-[#D5B26A] text-[#090D16] text-[11px] font-black tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all text-center select-none"
                     >
                       Đặt lịch bảo trì định kỳ ngay
                     </a>
                   </div>

                 </motion.div>
               ) : (
                 <motion.div
                   key="diagnostic-idle"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="p-8 text-center space-y-5"
                 >
                   <div className="w-16 h-16 rounded-full border border-dashed border-[#C5A059]/40 bg-[#161B2B] flex items-center justify-center text-[#C5A059] mx-auto animate-pulse">
                     <ShieldCheck className="w-9 h-9" />
                   </div>
                   <div className="space-y-1.5 max-w-sm mx-auto">
                     <h4 className="font-serif font-black text-white text-base">Hệ Thống Đang Trạng Thái Chờ...</h4>
                     <p className="text-xs text-slate-400 leading-relaxed">
                       Vui lòng điền mã số thẻ bảo hành của quý khách vào biểu mẫu tra cứu bên cạnh để xuất hồ sơ chuẩn đoán đồng hồ cơ chuẩn Thụy Sỹ của Đăng Quang Watch.
                     </p>
                   </div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] uppercase font-bold tracking-widest rounded-full">
                     <Zap className="w-3.5 h-3.5" />
                     Bảo mật tuyệt mật thông tin tư thù khách hàng
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

        </div>
      </section>

      {/* SECTION 3: THE ROYAL OVERHAUL STAGE (9-step precision process walkthrough) */}
      <section id="9step-atelier-experience" className="bg-[#FAF9F4] py-24 px-4 md:px-8 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#C5A059] text-[11px] tracking-widest uppercase font-bold">9-Step Horology Perfection Journey</span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 leading-tight">
              Quy Trình 9 Bước Kỹ Nghệ Đại Tu Độc Bản Thụy Sỹ
            </h2>
            <div className="w-14 h-0.5 bg-[#C5A059] mx-auto"></div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mỗi chiếc đồng hồ đem đến bảo dưỡng tại Đăng Quang Watch đều phải trải qua hành chánh hồi sinh nghiêm ngặt. Trực tiếp thực thi bởi Nghệ Nhân Ưu Tú được cấp chứng chỉ Thụy Sỹ toàn diện.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Steps Guide Selector (4 cols) */}
            <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {OVERHAUL_STEPS.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-4 rounded-xl flex items-center gap-4 border transition-all text-sm group cursor-pointer ${
                    activeStep === idx 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.01]' 
                      : 'bg-white text-slate-700 border-slate-205 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold shrink-0 text-xs ${
                    activeStep === idx ? 'bg-[#C5A059] text-[#090D16]' : 'bg-slate-100 text-slate-500 group-hover:bg-[#C5A059]/15'
                  }`}>
                    0{idx+1}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs md:text-sm leading-none">{step.title}</h4>
                    <span className={`text-[10px] block mt-1.5 ${activeStep === idx ? 'text-slate-400' : 'text-slate-500'}`}>{step.time} CARING</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Detailed Visualizer viewport (8 cols) */}
            <div className="lg:col-span-7 bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-2xl space-y-6 relative overflow-hidden min-h-[420px] text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-2xl pointer-events-none"></div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <span className="text-[#C5A059] font-mono text-xs font-black uppercase tracking-widest block">Giai đoạn thực trạng 0{activeStep + 1}</span>
                      <h3 className="text-xl md:text-2xl font-serif font-black text-slate-900">{OVERHAUL_STEPS[activeStep].title}</h3>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase">
                      Thời hạn: {OVERHAUL_STEPS[activeStep].time}
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed leading-normal">
                    {OVERHAUL_STEPS[activeStep].desc}
                  </p>

                  <div className="p-4 rounded-2xl bg-[#FCFBF8] border border-[#C5A059]/20 space-y-2">
                    <strong className="text-slate-900 block font-serif font-bold uppercase text-[10px] text-[#C5A059] tracking-wider flex items-center gap-1.5">
                      <Wrench className="w-4.5 h-4.5 text-[#C5A059]" />
                      Thiết bị phòng chuẩn Thụy Sỹ vận hành:
                    </strong>
                    <p className="text-xs text-slate-550 pl-6 leading-relaxed font-semibold">
                      {OVERHAUL_STEPS[activeStep].tools}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-900 text-amber-400 rounded-2xl text-[11px] leading-relaxed flex gap-3 border border-[#C5A059]/35">
                    <ShieldCheck className="w-5 h-5 shrink-0 text-[#C5A059]" />
                    <div>
                      <span className="text-white block font-serif font-black uppercase text-[10px] tracking-wider mb-0.5">Cam kết của Cửa hàng:</span>
                      Không đi tắt quy trình. Mọi khâu thao tác đều được lưu vết Camera giám sát nội bộ của Đăng Quang Watch và kiểm tra chéo hai tầng kỹ sư trưởng phòng.
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next trigger arrows */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(prev => prev - 1)}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 select-none disabled:opacity-40 cursor-pointer"
                >
                  &larr; Bước trước
                </button>
                <div className="text-slate-550 font-mono text-xs">
                  Trực quan Bước <strong>0{activeStep + 1}</strong> trên 09
                </div>
                <button
                  type="button"
                  disabled={activeStep === OVERHAUL_STEPS.length - 1}
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 border border-slate-900 text-white hover:bg-slate-950 select-none disabled:opacity-40 cursor-pointer"
                >
                  Bước tiếp theo &rarr;
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: INTERACTIVE WARRANTY & VIP LEVEL CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#C5A059] text-[11px] tracking-widest uppercase font-bold">VIP Perks & Values Calculator</span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 leading-tight">
            Thẩm Định Đặc Quyền & Thời Hạn Bảo Hành
          </h2>
          <div className="w-14 h-0.5 bg-[#C5A059] mx-auto"></div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Mức thời hạn và hạng Membership tại Đăng Quang tự động nở rộng theo hiệu năng thương giá của dòng máy sở hữu. Thử kéo thanh tính bên dưới để xem đặc khi sắm đồng hồ của quý vị.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Calculator Sliders Selection (5 cols) */}
          <div className="lg:col-span-5 bg-white p-7 md:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-left">
            
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <SlidersHorizontal className="w-5.5 h-5.5 text-[#C5A059]" />
              <div>
                <h4 className="font-serif font-black text-slate-930 text-sm md:text-base leading-none">Bộ Công Cụ Dự Tính</h4>
                <span className="text-[10px] text-slate-400 font-mono block mt-1">DÒNG HÃNG & TRỊ GIÁ SẮM</span>
              </div>
            </div>

            {/* Selector: Watch brand */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">1. Lựa chọn Nhóm hãng sản xuất</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {['Epos Swiss', 'Atlantic Swiss', 'Bruno Söhnle', 'Hãng Khác'].map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setCalcBrand(brand)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      calcBrand === brand 
                        ? 'bg-[#0F1424] text-[#C5A059] border-[#0F1424]' 
                        : 'bg-slate-50 text-slate-750 border-slate-205 hover:bg-slate-100'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider range: Value */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700 uppercase tracking-widest">2. Trị giá Đồng hồ định sắm</label>
                <span className="text-[#C5A059] font-mono font-black text-[15px] underline">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calcValue)}
                </span>
              </div>
              
              <input 
                type="range" 
                min={5000000} 
                max={200000000} 
                step={500000}
                value={calcValue}
                onChange={e => setCalcValue(Number(e.target.value))}
                className="w-full accent-[#C5A059] h-2 bg-slate-100 rounded-lg cursor-pointer transition-all"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono font-semibold">
                <span>5 TRIỆU VNĐ</span>
                <span>50 TRIỆU</span>
                <span>100 TRIỆU</span>
                <span>200 TRIỆU +</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-orange-50 text-orange-850 text-xs leading-normal border border-orange-100 flex items-start gap-2.5">
              <Sparkles className="w-5.5 h-5.5 shrink-0 text-orange-500 mt-0.5 animate-spin" />
              <span>
                Với trị giá này, Đăng Quang tự hào nâng niu đồng hành của quý khách trong diện được hưởng định nghĩa Thẻ <strong>{calculatedSpecs.unlockedVIP}</strong> tự động phân thạng.
              </span>
            </div>

          </div>

          {/* Right Visual Resulting card (7 cols) */}
          <div className="lg:col-span-7 bg-[#0E1322] p-6 md:p-8 rounded-3xl border border-[#C5A059]/25 shadow-2xl relative overflow-hidden text-left text-white min-h-[440px] flex flex-col justify-between">
            {/* Ambient gold blur */}
            <div className="absolute top-[-30%] right-[-10%] w-72 h-72 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              
              {/* Gold Header */}
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div>
                  <span className="text-[10px] text-[#C5A059] font-mono uppercase tracking-[0.2em] block">ATELIER ASSURANCE PREMIUM</span>
                  <span className="text-base font-serif font-black tracking-wider block mt-0.5">BÁO CÁO TOÀN DIỆN ĐẶC QUYỀN BẢO HÀNH</span>
                </div>
                <Award className="w-9 h-9 text-[#C5A059] animate-pulse" />
              </div>

              {/* VIP Card preview rendering dynamically */}
              <div className={`p-5 rounded-2xl bg-gradient-to-r ${calculatedSpecs.cardGradient} text-left space-y-4 shadow-2xl relative overflow-hidden transition-all duration-500`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[8px] font-mono tracking-widest text-slate-100 block">DANG QUANG MEMBRES GOLD CLUB</span>
                    <h4 className="text-xl font-serif font-black text-[#C5A566] tracking-widest uppercase mt-0.5">{calculatedSpecs.unlockedVIP}</h4>
                  </div>
                  <Gem className="w-7 h-7 text-[#C5A059]/90" />
                </div>
                <div className="flex justify-between items-end border-t border-white/10 pt-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[9px]">NEXT PURCHASE REBATE</span>
                    <span className="text-white font-extrabold text-sm">Giảm {calculatedSpecs.discountPercent}% trực tiếp</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[9px]">HONOR CLASS LEVEL</span>
                    <span className="text-[#C5A059] font-black">{calculatedSpecs.prestigeLevel}</span>
                  </div>
                </div>
              </div>

              {/* Specific breakdown metrics lists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                
                <div className="space-y-1">
                  <span className="text-slate-450 text-[10px] uppercase font-mono block">Tổng thời hạn Bảo hiểm Cơ khí:</span>
                  <p className="text-white text-base font-bold font-serif flex items-center gap-1">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    {calculatedSpecs.warrantyYears} Năm Chính Hãng
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-450 text-[10px] uppercase font-mono block">Chính sách Bảo trì Dầu máy:</span>
                  <p className="text-amber-400 text-sm font-bold flex items-center gap-1">
                    <Wrench className="w-4.5 h-4.5 text-[#C5A059] shrink-0" />
                    {calculatedSpecs.oilDiscount}
                  </p>
                </div>

                <div className="space-y-1 col-span-1 sm:col-span-2">
                  <span className="text-slate-450 text-[10px] uppercase font-mono block">Phúc lợi Vận chuyển & Giao nhận:</span>
                  <p className="text-slate-200 text-xs leading-relaxed font-semibold flex items-center gap-1">
                    <Droplet className="w-4.5 h-4.5 text-[#C5A059] shrink-0 animate-bounce" />
                    {calculatedSpecs.transportPerk}
                  </p>
                </div>

              </div>
            </div>

            {/* Quick Button to secure booking matching computed tiers */}
            <div className="pt-6 border-t border-white/5 relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                Lưu ý: Mọi mức trị giá được tích lũy trọn vẹn vĩnh cửu theo thông tin mua hàng.
              </span>
              <a
                href="#concierge-quick-booking"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#B89047] to-[#C5A059] text-[#090D16] font-black tracking-widest uppercase transition-all hover:scale-[1.01] shadow"
              >
                Kích hoạt Thẻ ưu đãi VIP
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: DETAILED CLAUSES ACCORDION PANEL (Movement, Battery, Waterproofing, Case, etc.) */}
      <section id="detailed-policies-table" className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#C5A059] text-[11px] tracking-widest uppercase font-bold">Comprehensive Rules & Safeguards</span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 leading-tight">
            Văn Bản Pháp Quy Chương Trình Bảo Hộ Kỹ Thuật
          </h2>
          <div className="w-14 h-0.5 bg-[#C5A059] mx-auto"></div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Sự rõ ràng xây đắp thành trì niềm tin. Dưới đây là văn văn soạn lục chi tiết định nghĩa quyền lợi và các trường hợp quy định pháp chế áp dụng cho đồng hồ của quý vị.
          </p>
        </div>

        {/* Tab selection design */}
        <div className="flex flex-wrap gap-2 justify-center bg-slate-100 p-1.5 rounded-2xl max-w-3xl mx-auto text-xs font-bold text-slate-650">
          <button
            onClick={() => setActivePolicyTab('machine')}
            className={`flex-1 min-w-[130px] py-3 rounded-xl transition-all cursor-pointer ${
              activePolicyTab === 'machine' ? 'bg-[#0F1424] text-[#C5A059] shadow-lg' : 'hover:text-[#0F1424]'
            }`}
          >
            Bảo hành Máy (Bộ thoát)
          </button>
          
          <button
            onClick={() => setActivePolicyTab('battery')}
            className={`flex-1 min-w-[130px] py-3 rounded-xl transition-all cursor-pointer ${
              activePolicyTab === 'battery' ? 'bg-[#0F1424] text-[#C5A059] shadow-lg' : 'hover:text-[#0F1424]'
            }`}
          >
            Bảo hành Pin Trọn Đời
          </button>

          <button
            onClick={() => setActivePolicyTab('water')}
            className={`flex-1 min-w-[130px] py-3 rounded-xl transition-all cursor-pointer ${
              activePolicyTab === 'water' ? 'bg-[#0F1424] text-[#C5A059] shadow-lg' : 'hover:text-[#0F1424]'
            }`}
          >
            Chống Nước Chuẩn Hãng
          </button>

          <button
            onClick={() => setActivePolicyTab('case-glass')}
            className={`flex-1 min-w-[130px] py-3 rounded-xl transition-all cursor-pointer ${
              activePolicyTab === 'case-glass' ? 'bg-[#0F1424] text-[#C5A059] shadow-lg' : 'hover:text-[#0F1424]'
            }`}
          >
            Vỏ Thân & Kính Sapphire
          </button>

          <button
            onClick={() => setActivePolicyTab('non-covered')}
            className={`flex-1 min-w-[130px] py-3 rounded-xl transition-all cursor-pointer ${
              activePolicyTab === 'non-covered' ? 'bg-[#0F1424] text-red-400 shadow-lg' : 'hover:text-[#0F1424]'
            }`}
          >
            Trường Hợp Miễn Trừ
          </button>
        </div>

        {/* Display Accordion panel Details cards */}
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200/80 shadow-2xl max-w-4xl mx-auto text-left">
          <AnimatePresence mode="wait">
            
            {activePolicyTab === 'machine' && (
              <motion.div
                key="machine-detail"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-12 h-12 bg-[#FAF9F5] rounded-xl border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-slate-900 text-lg">Phạm Vi Bảo Hành Động Cơ & Tổ Thiết Cơ Học</h3>
                    <p className="text-slate-400 text-[10px] font-mono uppercase font-bold">Movement, Gear-Train & escapement codes</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
                  <p>
                    Hệ thống máy cơ khí (Automatic / Hand-winding) và máy điện tử (Quartz Chrono) là phức hợp của hàng trăm bánh gai tinh vi chuyển động không ngừng nghỉ. Đăng Quang Watch cam kết bảo hộ tối đa tính nguyên trạng liên kết cơ cấu này:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-bold text-[#C5A059] block uppercase text-[10px] mb-1 font-mono tracking-wider">HẠNG MỤC CẤU THÀNH ĐƯỢC BẢO HỘ</span>
                      <ul className="space-y-2 text-xs list-disc pl-4 mt-2 text-slate-550 leading-relaxed font-semibold">
                        <li>Sai sót chế tác gốc từ nhà sản xuất (Gãy trục gai, mỏng thăng bằng dây tóc).</li>
                        <li>Đồng hồ đứng bất thình lình khi năng lượng sạc cơ đầy 100%.</li>
                        <li>Trưng ra tình trạng sụt cót (Power reserve) quá 40% so với mô tả hãng.</li>
                        <li>Khóa gá thạch anh dao động Quartz bị đoản mạch IC.</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#C5A059]/15">
                      <span className="font-bold text-slate-905 block uppercase text-[10px] mb-1 font-mono tracking-wider text-[#C5A059]">TIÊU CHUẨN ĐẠI BỒI DỊCH VỤ</span>
                      <p className="text-xs leading-normal mt-2 leading-relaxed">
                        Toàn bộ dịch vụ căn chỉnh vi sai COSC bằng máy nén hơi Witschi, dầu mỡ Moebius Thụy Sỹ, công tẩy rửa sóng siêu âm đa bể Elma đều được thực chất <strong>MIỄN PHÍ TRĂM PHẦN TRĂM</strong> trong thời hạn thẻ, không phát sinh bất kỳ khoản phí sườn bảo hiểm nào của quý thượng khách.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activePolicyTab === 'battery' && (
              <motion.div
                key="battery-detail"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-12 h-12 bg-[#FAF9F5] rounded-xl border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-slate-900 text-lg">Cam Kết Thay Pin Renata Thụy Sỹ Miễn Phí Vô Hạn</h3>
                    <p className="text-slate-400 text-[10px] font-mono uppercase font-bold">Renata Swiss Battery Lifetime Guarantee</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
                  <p>
                    Thay pin đồng hồ tưởng chừng là thao tác đơn lẻ, tuy nhiên nếu sử dụng pin kém chất lượng (rò axit ăn mòn rỉ sét cực đồng sườn) hoặc mở nắp vụng về làm rách gioăng cao su, chiếc đồng hồ đắt tiền sẽ bị hủy hoại. Đăng Quang Watch tự phát động Chương trình Tuyệt đối:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-4.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-xl font-serif font-black text-[#C5A059]">0 ĐỒNG</span>
                      <p className="text-[9px] text-slate-500 font-bold uppercase block mt-1">Chi phí nhân viên & pin</p>
                    </div>
                    <div className="p-4.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-xl font-serif font-black text-[#C5A059]">100% RENATA</span>
                      <p className="text-[9px] text-slate-500 font-bold uppercase block mt-1">Đồng cực Oxit bạc Thụy Sỹ</p>
                    </div>
                    <div className="p-4.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-xl font-serif font-black text-[#C5A059]">VÔ BIÊN LẦN</span>
                      <p className="text-[9px] text-slate-500 font-bold uppercase block mt-1">Số lần sạc trong suốt đời</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-450 italic mt-2 leading-relaxed">
                    * Quy chuẩn thao tác khép kín: Mỗi chu kỳ thay pin tại Atelier Đăng Quang cam kết gồm 5 khâu: Vệ sinh dọn bụi sườn vỏ - tháo rã tháo pin cũ - sấy khử tĩnh cực - thay pin oxit bạc Renata chính ngạch - bơm mỡ silicone niêm kín hột gioăng chống nước.
                  </p>
                </div>
              </motion.div>
            )}

            {activePolicyTab === 'water' && (
              <motion.div
                key="water-detail"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-12 h-12 bg-[#FAF9F5] rounded-xl border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                    <Droplet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-slate-900 text-lg">Định Chế Niêm Kín Áp Suất & Chống Hấp Hơi Nước</h3>
                    <p className="text-slate-400 text-[10px] font-mono uppercase font-bold">Hermetic Seal Waterproofing Directives</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
                  <p>
                    Đăng Quang Watch tôn trọng từng chi tiết máy cơ học. Khí ẩm rò sườn có thể gây rỉ sét cầu máy trong 7 ngày. Để đảm bảo độ khô ráo tuyệt đối, chúng tôi duy trì quy chế kiểm thử nước nghiêm ngặt bậc nhất bằng buồng nén nén sấy cao cấp:
                  </p>

                  <div className="p-4.5 rounded-xl bg-[#FAF9F4] border border-[#C5A059]/20 space-y-2">
                    <strong className="text-slate-900 block font-serif text-xs uppercase text-[#C5A059] tracking-wider font-bold">ƯU TIÊN BẢO TRÌ CHỐNG THẤM ĐÃ BAO GỒM TRONG CƠ CHẾ BẢO HÀNH:</strong>
                    <ul className="space-y-2 text-xs list-disc pl-4 text-slate-550 leading-relaxed font-semibold">
                      <li>Khôi phục màng silicon đệm chống sương đọng nước cho hệ nắp sau đáy đồng hồ.</li>
                      <li>Khử sấy bốc bốc hơi sương mặt kính Sapphire trong của các đồng hồ ngấm nhẹ.</li>
                      <li>Vệ sinh tẩy rỉ bám trục ty núm sườn, trục khóa lùa, bôi trơn hột nút bấm kích chrono không bị kẹt cứng do muối mồ hôi ăn mòn bám rỉ.</li>
                    </ul>
                  </div>

                  <p className="text-xs text-slate-400 leading-normal">
                    * Khuyến cáo an toàn: Tuyệt đối không kéo bóp núm ty giờ dưới vòi hoa sen áp suất mạnh, bồn nước nóng hoặc môi trường xông hơi khô/ướt (Sauna). Nhiệt độ nóng đột ngột làm co ngót gioăng silicone lót, dẫn đến hiện tượng hút hơi ẩm rỉ ty và rỉ sét không được tính vào lỗi chế tạo miễn phí.
                  </p>
                </div>
              </motion.div>
            )}

            {activePolicyTab === 'case-glass' && (
              <motion.div
                key="case-glass-detail"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-12 h-12 bg-[#FAF9F5] rounded-xl border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-slate-900 text-lg">Chính Sách Vỏ Thân Ngoài & Khung Kính Sapphire</h3>
                    <p className="text-slate-400 text-[10px] font-mono uppercase font-bold">Exterior casing and anti-scratch crystal protection</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
                  <p>
                    Bề ngoài kiêu quý của chiếc đồng hồ khẳng định đẳng cấp nghệ nhân. Đăng Quang Watch đưa ra các chính sách bổ sung cho lớp áo giáp ngoài vỏ máy:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-bold text-[#C5A059] block uppercase text-[10px] font-mono">BẢO CHỮA LẤY LIỀN MIỄN PHÍ</span>
                      <p className="text-xs text-slate-550 leading-relaxed">
                        Căn chỉnh siết chặt vấu nối dây đeo kim loại bị lỏng rơ định vị, đánh bóng nhẹ mặt khóa gài inox xước dăm nhẹ nắp sườn không tính phí khi quý khách ghé qua bảo bảo dưỡng lau dầu máy.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-bold text-[#C5A059] block uppercase text-[10px] font-mono">HỖ TRỢ THAY KÍNH SAPPHIRE CHÍNH HÃNG</span>
                      <p className="text-xs text-slate-550 leading-relaxed">
                        Với trường hợp va chấn cơ học làm vỡ nứt mặt kính hoặc móp méo nặng sườn vỏ, Đăng Quang hỗ trợ cung cấp linh kiện kính sapphire chống lóa Thụy Sỹ với <strong>chiết khấu từ 30% đến 50% trị giá gốc</strong> cho thành viên VIP Đăng Quang.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activePolicyTab === 'non-covered' && (
              <motion.div
                key="non-covered-detail"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl border border-red-300 flex items-center justify-center text-red-500">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-slate-900 text-lg">Các Điều Khoản Loại Trừ & Từ Chối Trách Nhiệm</h3>
                    <p className="text-slate-400 text-[10px] font-mono uppercase font-bold text-red-550">Standard Exclusions and limited liability clauses</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
                  <p>
                    Đăng Quang Watch hoạt động trên nền tảng chính trực tối thượng. Để bảo vệ tính công bằng, chúng tôi từ chối bảo trì miễn phí (nhưng sẵn sàng sửa chữa hỗ trợ biểu phí hữu nghị) cho các tình trạng phát sinh từ hành hành vi phi kỹ thuật bên ngoài:
                  </p>

                  <ul className="space-y-2.5 list-disc pl-4 text-xs text-slate-550 leading-relaxed font-semibold">
                    <li>Dây đeo da bị mốc gãy lột mục nát tự nhiên, trầy xước sườn mạ vàng sườn do tiếp xúc ma sát với áo khóa, trang sức sườn, hay vết mồ hôi ăn mòn mạ tự nhiên theo năm lịch.</li>
                    <li>Nứt vỡ tan nát nắp kính, đứt núm sườn vặn dập vỡ nút đẩy phụ cơ học do người đeo bị ngã ngụp, tai nạn lực phanh cơ học ghê gớm tác động trực tiếp ngoài đường.</li>
                    <li>Cố ý mang thiết bị lặn thám hiểm biển sâu vượt quá giới hạ ATM của máy (ví dụ sắm đồng hồ văn phòng 3ATM đi lặn ngập sâu 50 mét dưới lòng biển).</li>
                    <li>Sản phẩm đã bị tự ý rã bóc nắp máy gá cơ, can thiệp chỉnh dây tóc cơ vớ vẩn bên ngoài tại các thợ sửa lề đường mạt hạng không thuộc mạng lưới Quốc gia Đăng Quang Watch.</li>
                  </ul>

                  <div className="p-4 rounded-xl bg-red-550/5 text-red-700/90 border border-red-200 text-xs italic flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                    <span>Chúng tôi thấu hiểu sự nuối tiếc của quý khách khi kiệt tác vô tình hỏng hóc cơ học. Do đó, xưởng đại tu Đăng Quang cam kết <strong>trợ giá bồi hoàn đến 50% hóa đơn linh kiện thay mới</strong> để thương khách an tâm tái hòa nhập cỗ máy thân thuộc.</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 6: CONCIERGE CARE REPAIR APPOINTMENT RESERVATION (Atelier Appointment) */}
      <section id="concierge-quick-booking" className="py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="bg-white p-7 md:p-10 rounded-3xl border border-slate-200/80 shadow-2xl space-y-8 relative overflow-hidden text-left">
          {/* Top royal border bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B89047] via-[#C5A059] to-[#D5B26A]"></div>

          <div className="space-y-2 pb-4 border-b border-slate-100">
            <span className="text-[#C5A059] text-[10px] font-bold tracking-widest uppercase block font-mono">Premium Appointment Booking</span>
            <h3 className="text-2xl font-serif font-black text-slate-930">
              Đặt Lịch Hẹn Cao Cấp Đặc Quyền VIP
            </h3>
            <p className="text-xs text-slate-500 leading-normal">
              Tránh thời gian xếp nộp chờ đợi mệt mỏi tại Showroom. Đặt lịch tiếp đón đặc quyền VIP giúp xưởng Kỹ thuật chuẩn bị sẵn sàng thiết bị nén sấy Proofmaster, khay Bergeon riêng biệt và phân bổ Kỹ sư trưởng đón tiếp quý vị chu đáo chuẩn thượng lưu.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="booking-form"
                onSubmit={handleBookingSubmit}
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-750 uppercase tracking-wider block">Danh Tính Thượng Khách *</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Anh Hoàng Lâm..."
                      value={bookingForm.name}
                      onChange={e => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 bg-slate-50 border text-xs rounded-xl focus:outline-none focus:ring-1 transition-all ${
                        formErrors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/10' : 'border-slate-205 focus:border-[#C5A059] focus:ring-[#C5A059]/20'
                      }`}
                    />
                    {formErrors.name && <p className="text-[10px] font-semibold text-red-500">{formErrors.name}</p>}
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-750 uppercase tracking-wider block font-sans">Số điện thoại VIP liên lạc *</label>
                    <input 
                      type="text" 
                      placeholder="Để hệ thống gửi SMS xác định..."
                      value={bookingForm.phone}
                      onChange={e => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full px-4 py-3 bg-slate-50 border text-xs rounded-xl focus:outline-none focus:ring-1 transition-all ${
                        formErrors.phone ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/10' : 'border-slate-205 focus:border-[#C5A059] focus:ring-[#C5A059]/20'
                      }`}
                    />
                    {formErrors.phone && <p className="text-[10px] font-semibold text-red-500">{formErrors.phone}</p>}
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Warranty Code in form */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-750 uppercase tracking-wider block">Thẻ Bảo Hành Điện Tử (Nếu có)</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: DQ-2026-EPOS..."
                      value={bookingForm.warrantyCode}
                      onChange={e => setBookingForm(prev => ({ ...prev, warrantyCode: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-205 text-xs rounded-xl focus:border-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]/20 font-mono text-slate-900 font-bold uppercase"
                    />
                  </div>

                  {/* Dropdown service choice */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-750 uppercase tracking-wider block">Hạng Mục Sửa Bảo Dưỡng VIP</label>
                    <select
                      value={bookingForm.serviceType}
                      onChange={e => setBookingForm(prev => ({ ...prev, serviceType: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-205 text-xs rounded-xl focus:border-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]/20 font-bold text-slate-800"
                    >
                      <option value="Lau dầu cơ khí automatic & tinh chỉnh COSC Thụy Sỹ">Lau dầu cơ khí automatic & tinh chỉnh COSC Thụy Sỹ</option>
                      <option value="Thay pin Renata Thụy Sỹ miễn phí trọn đời (Quartz)">Thay pin Renata Thụy Sỹ miễn phí (Thành viên Quartz)</option>
                      <option value="Nén sấy phòng không khử nước sương kính">Thay thử nước bơm silicone đệm chống ẩm sương kính</option>
                      <option value="Kiểm chuẩn mặt kính, thay thế kính Sapphire lóa">Thay thế sườn vỏ, phục chế mặt kính Sapphire lóa</option>
                      <option value="Xác thực nguồn gốc máy Thật - Giả miễn phí">Kiểm thạch xác thực Thật - Giả miễn phí danh dự</option>
                      <option value="Căn chỉnh thu hẹp dây kim loại, vệ sinh ngoài">Đánh bóng sườn mạ vàng, siết vấu xích kim loại lấy ngay</option>
                    </select>
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Showroom Select */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-750 uppercase tracking-wider block">Boutique Tiếp Nhận Yêu cầu</label>
                    <select
                      value={bookingForm.branch}
                      onChange={e => setBookingForm(prev => ({ ...prev, branch: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-205 text-xs rounded-xl focus:border-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]/20 font-semibold"
                    >
                      <option value="Showroom 55 Trần Đăng Ninh (HQ Cầu Giấy)">Showroom 55 Trần Đăng Ninh (Trụ sở HQ Cầu Giấy)</option>
                      <option value="Showroom 7 Lê Văn Lương (Hà Nội)">Showroom 7 Lê Văn Lương (Thanh Xuân, HN)</option>
                      <option value="Showroom 102 Trần Nhân Tông (Hà Nội)">Showroom 102 Trần Nhân Tông (Hai Bà Trưng, HN)</option>
                      <option value="Showroom 863 Nguyễn Trãi (Quận 5, TP.HCM)">Showroom 863 Nguyễn Trãi (Quận 5, TP.HCM)</option>
                      <option value="Showroom 235 Hùng Vương (Đà Nẵng)">Showroom 235 Hùng Vương (Hải Châu, Đà Nẵng)</option>
                    </select>
                  </div>

                  {/* Calendar Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-750 uppercase tracking-wider block flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      Thời Gian Hẹn Mong Muốn *
                    </label>
                    <input 
                      type="datetime-local" 
                      value={bookingForm.date}
                      onChange={e => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                      className={`w-full px-4 py-3 bg-slate-50 border text-xs rounded-xl focus:outline-none focus:ring-1 transition-all ${
                        formErrors.date ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/10' : 'border-slate-205 focus:border-[#C5A059] focus:ring-[#C5A059]/20'
                      }`}
                    />
                    {formErrors.date && <p className="text-[10px] font-semibold text-red-500">{formErrors.date}</p>}
                  </div>

                </div>

                {/* Notes box in form */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-750 uppercase tracking-wider block">Ghi chú thêm chuẩn đoán máy của quý vị</label>
                  <textarea 
                    rows={2}
                    placeholder="Mô tả mức độ chạy chậm giây/ngày, đồng hồ bị ngấm nước do bơi lội hoặc nhu cầu chỉnh dây gốc kim loại..."
                    value={bookingForm.notes}
                    onChange={e => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-205 text-xs rounded-xl focus:border-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]/20 placeholder:text-slate-400"
                  ></textarea>
                </div>

                {/* Submit trigger button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#B89047] via-[#C5A059] to-[#D5B26A] text-[#090D16] font-extrabold text-xs uppercase tracking-widest shadow-xl hover:shadow-yellow-500/20 active:translate-y-0.5 hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4.5 h-4.5 border-2 border-[#090D16] border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang kết nối Máy chủ Kỹ thuật Đăng Quang Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>XÁC NHẬN ĐĂNG KÝ VIP APPOINTMENT</span>
                    </>
                  )}
                </button>

              </motion.form>
            ) : (
              <motion.div
                key="booking-success"
                className="p-8 bg-slate-50 rounded-2.5xl border-2 border-dashed border-[#C5A059] text-center space-y-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="w-16 h-16 rounded-full bg-[#0F1424] text-[#C5A059] border-2 border-[#C5A059]/50 flex items-center justify-center animate-bounce mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif font-black text-slate-900 text-xl leading-none">Lịch Hẹn Thành Công!</h4>
                  <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                    Xưởng sửa chữa Đăng Quang Watch đã phong tỏa sẵn một khung giờ rảnh VIP cho quý thượng khách. Đầu mối Kỹ sư Trưởng tại Boutique mong ước sẽ tự tay chăm lo cho cỗ máy của quý vị chu đáo nhất. Biên lai điện tử đã lưu thành công:
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2.5 shadow-sm">
                  <p className="text-slate-500 pb-2 border-b border-slate-100 flex justify-between">
                    <strong className="text-slate-800">DANH TÍNH VIP:</strong> 
                    <span className="text-[#090D16] font-mono font-black uppercase text-[13px]">{bookingForm.name}</span>
                  </p>
                  <p className="text-slate-500 flex justify-between">
                    <strong>Hạng mục đăng ký:</strong> 
                    <span className="text-slate-800 font-bold text-right">{bookingForm.serviceType}</span>
                  </p>
                  <p className="text-slate-500 flex justify-between">
                    <strong>Boutique Đón chào:</strong> 
                    <span className="text-slate-800 font-bold text-right">{bookingForm.branch}</span>
                  </p>
                  <p className="text-slate-500 flex justify-between">
                    <strong>Mã hồ sơ (Nếu bồi):</strong> 
                    <span className="text-slate-800 font-mono font-bold">{bookingForm.warrantyCode || 'Chưa liên kết thẻ'}</span>
                  </p>
                  {bookingForm.date && (
                    <p className="text-[#C5A059] pt-2 border-t border-slate-100 flex justify-between text-xs font-bold leading-none">
                      <span>GIỜ HẸN KHÓA CỨNG:</span> 
                      <span className="font-mono text-slate-900 text-sm tracking-wide">{bookingForm.date.replace('T', ' ')}</span>
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={resetBookingForm}
                    className="px-6 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all inline-flex items-center gap-2 select-none cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Đăng ký đặt hẹn cho đồng hồ khác
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 7: DETAILED KNOWLEDGE BASE & FAQ PANEL WITH LIVE FILTER SEARCH */}
      <section className="py-12 max-w-4xl mx-auto px-4 md:px-8 space-y-10 border-t border-slate-200 pb-16">
        <div className="text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-[#C5A059] mx-auto animate-bounce" />
          <h3 className="font-serif font-black text-2xl md:text-3xl text-slate-920">Thư Viện Câu Hỏi Thường Gặp</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Hồi đáp nhanh mọi thắc mắc của hàng vạn thương khách về các thủ tục, chính sách hoặc kiến thức cơ bản về bảo dưỡng đồng hồ.
          </p>

          {/* Quick Search FAQ inputs */}
          <div className="relative max-w-md mx-auto pt-4">
            <input 
              type="text" 
              value={faqQuery}
              onChange={e => setFaqQuery(e.target.value)}
              placeholder="Tìm kiếm nhanh thắc mắc (ví dụ: thẻ bơ cứng, automatic, pin...)"
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-xs rounded-xl focus:border-[#C5A059] focus:outline-none text-slate-900 placeholder:text-slate-400 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-[29px] -translate-y-1/2" />
            {faqQuery && (
              <button 
                onClick={() => setFaqQuery('')}
                className="absolute right-3 top-[29px] -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-900"
              >
                Xóa lọc
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4 text-left">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5.5 space-y-2 hover:shadow-lg transition-all">
                <h5 className="font-bold text-slate-940 border-l-2 border-[#C5A059] pl-3 text-xs md:text-sm">
                  {faq.q}
                </h5>
                <p className="text-slate-550 leading-relaxed pl-3 text-xs md:text-sm pt-1">
                  {faq.a}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
              Không tìm thấy kết quả câu hỏi trùng khớp với từ khóa &ldquo;{faqQuery}&rdquo;. Quý khách vui lòng tham khảo các mục FAQ mặc định có sẵn.
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
