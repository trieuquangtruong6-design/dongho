import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma";

// Mock database for standard seed products
const PRODUCTS = [
  // 1. WATCHES (Nam)
  {
    id: "wat-pa-01",
    code: "PA-8440-A",
    name: "Đồng hồ Philippe Auguste Swiss Automatic - Royal Black Steel",
    category: "dong-ho",
    brand: "Philippe Auguste",
    origin: "Thuỵ Sỹ",
    target: "Nam",
    price: 18500000,
    discountPrice: 16650000, // 10% off
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
    isNew: true,
    isLimited: false,
    size: "41 mm",
    glassMaterial: true, // Sapphire
    caseMaterial: true, // Premium steel
    waterResistance: "5 ATM",
    description: "Bộ sưu tập Philippe Auguste Swiss Royal mang trong mình cấu trúc cơ khí lộ máy thể thao và tinh tế nhất lịch sử cơ học Thụy Sỹ. Từng viên đá hồng ngọc Sapphire chân kính được lộ diện dưới bánh đà tự động mạ vàng 18K mang lại phong thái đỉnh đạt cho quý ông."
  },
  {
    id: "wat-epos-01",
    code: "EP-3435-S",
    name: "Đồng hồ EPOS Swiss Special Edition - Classic Diamond Moonphase",
    category: "dong-ho",
    brand: "Epos Swiss",
    origin: "Thuỵ Sỹ",
    target: "Nam",
    price: 48000000,
    discountPrice: 43200000,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
    isNew: false,
    isLimited: true,
    size: "40 mm",
    glassMaterial: true,
    caseMaterial: true,
    waterResistance: "10 ATM",
    description: "Được khảm nạm 12 viên kim cương tự nhiên thay thế các múi giờ, Epos Special Moonphase vẽ lại biểu đồ bầu trời đêm Thụy Sỹ rực rỡ một cách thần kỳ trên cổ tay của bạn."
  },
  {
    id: "wat-at-01",
    code: "AT-6010-G",
    name: "Đồng hồ Atlantic Swiss Quartz - Elegance Gold Slim",
    category: "dong-ho",
    brand: "Atlantic Swiss",
    origin: "Thuỵ Sỹ",
    target: "Nam",
    price: 9500000,
    discountPrice: null,
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=600",
    isFeatured: false,
    isNew: false,
    isLimited: false,
    size: "39 mm",
    glassMaterial: true,
    caseMaterial: true,
    waterResistance: "3 ATM",
    description: "Thiết kế siêu mỏng tối giản chỉ 5.8mm, mạ vàng PVD hoàng gia sang trọng dễ dàng ẩn mình dưới tay áo vest của các doanh nhân đỉnh đạt."
  },
  {
    id: "wat-aries-01",
    code: "AG-7025",
    name: "Đồng hồ Aries Gold Nhật Bản - Urban Warrior Chronograph",
    category: "dong-ho",
    brand: "Aries Gold",
    origin: "Nhật Bản",
    target: "Nam",
    price: 5200000,
    discountPrice: 4160000, // 20% off
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
    isNew: true,
    isLimited: false,
    size: "43 mm",
    glassMaterial: false,
    caseMaterial: true,
    waterResistance: "10 ATM",
    description: "Sức mạnh từ động cơ Mecha-Quartz Nhật Bản đột phá, mặt số đa góc cạnh mang lại vẻ thể thao, năng động và phóng khoáng đậm khí chất đường phố."
  },

  // 2. WATCHES (Nữ)
  {
    id: "wat-pa-02",
    code: "PA-5110-W",
    name: "Đồng hồ Nữ Philippe Auguste Swiss Grace - Pearl & Rosegold",
    category: "dong-ho",
    brand: "Philippe Auguste",
    origin: "Thuỵ Sỹ",
    target: "Nữ",
    price: 14200000,
    discountPrice: 12780000,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
    isNew: true,
    isLimited: false,
    size: "32 mm",
    glassMaterial: true,
    caseMaterial: true,
    waterResistance: "5 ATM",
    description: "Vẻ đẹp thuần khiết tôn vinh đôi tay ngọc ngà của giới thượng lưu. Mặt số khảm trai tự nhiên phản chiếu quang phổ cầu vồng rực rỡ kết hợp dây đeo màu vàng hồng thanh tao."
  },
  {
    id: "wat-diamond-01",
    code: "DD-9011",
    name: "Đồng hồ Nữ Diamond D - Royal flower Empress Premium",
    category: "dong-ho",
    brand: "Diamond D",
    origin: "Đức",
    target: "Nữ",
    price: 8900000,
    discountPrice: 7120000,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
    isNew: false,
    isLimited: true,
    size: "30 mm",
    glassMaterial: true,
    caseMaterial: true,
    waterResistance: "3 ATM",
    description: "Lấy cảm hứng từ những đóa hồng kiêu sa trong vương quốc Hoàng gia Anh. Viền khảm pha lê Swarovsky lấp lánh phản xạ thu hút mọi ánh nhìn tại các buổi yến tiệc sang trọng."
  },
  {
    id: "wat-casio-01",
    code: "CS-1200",
    name: "Đồng hồ Nữ Casio Baby-G Active Chic Pink",
    category: "dong-ho",
    brand: "Casio",
    origin: "Nhật Bản",
    target: "Nữ",
    price: 2800000,
    discountPrice: null,
    image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&q=80&w=600",
    isFeatured: false,
    isNew: false,
    isLimited: false,
    size: "36 mm",
    glassMaterial: false,
    caseMaterial: false,
    waterResistance: "10 ATM",
    description: "Năng động, trẻ trung và cực kỳ bền bỉ. Đồng hồ chống shock, chống nước 100m hoàn hảo cho những chuyến dã ngoại năng động dưới nắng hè ngày dài."
  },

  // 3. EYEWEAR (Kính Mắt)
  {
    id: "ey-bb-01",
    code: "BB-R880",
    name: "Kính Râm Burberry Unisex - Check Aviator Luxury",
    category: "kinh-mat",
    brand: "Burberry",
    origin: "Ý",
    target: "Unisex",
    price: 7800000,
    discountPrice: 6630000,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
    isNew: true,
    isLimited: false,
    description: "Thiết kế phi công biểu tượng với điểm nhấn kẻ sọc sành điệu tinh tế hai bên gọng kính. Mắt kính phân cực Polarized chống lóa hoàn hảo và ngăn chặn hoàn toàn 100% tia UV xâm hại võng mạc."
  },
  {
    id: "ey-rb-01",
    code: "RB-3025",
    name: "Kính Râm Ray-Ban Aviator Classic Green Polarized",
    category: "kinh-mat",
    brand: "Ray-Ban",
    origin: "Mỹ",
    target: "Unisex",
    price: 5900000,
    discountPrice: null,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
    isNew: false,
    isLimited: false,
    description: "Huyền thoại của làng kính mát phi công thế giới suốt hơn 8 thập kỷ qua. Khung gọng vàng PVD thanh lịch kết hợp cùng tròng thủy tinh G-15 xanh rêu huyền ảo."
  },

  // 4. PENS (Bút Ký)
  {
    id: "pe-mont-01",
    code: "MT-9110",
    name: "Bút Ký Doanh Nhân Cao Cấp - Sincerity Executive Black & Gold",
    category: "but-ky",
    brand: "Sincerity",
    origin: "Ý",
    target: "Unisex",
    price: 3500000,
    discountPrice: 2800000,
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
    isNew: true,
    isLimited: true,
    description: "Ngòi bút ký chế tác vàng 14k thủ công sắc nét viết êm ái trơn tru, là trợ thủ tuyệt vời cho các sếp lớn khi đặt bút ký những hợp đồng triệu đô."
  },

  // 5. ACCESSORIES
  {
    id: "ac-led-01",
    code: "AC-100",
    name: "Hộp Lên Cót Đồng Hồ Cơ Đơn Xoay Tự Động Cao Cấp LED",
    category: "phu-kien",
    brand: "Premium Pack",
    origin: "Đức",
    target: "Unisex",
    price: 4500000,
    discountPrice: 3825000,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600",
    isFeatured: false,
    isNew: false,
    isLimited: true,
    description: "Cơ chế xoay xoay định kỳ 4 chế độ thông minh, bảo tồn hoàn hảo dầu bôi trơn và duy trì năng lượng tích cót khi bạn không đeo đồng hồ cơ hàng ngày."
  }
];

const HOME_WATCH_PRODUCTS = [
  {
    id: "home-epos-1",
    code: "E-4314.133.20.50.10",
    name: "Epos Swiss E-4314.133.20.50.10 - Nữ - Automatic - Size 32 mm",
    category: "dong-ho",
    brand: "Epos Swiss",
    origin: "Thuỵ Sỹ",
    target: "Nữ",
    price: 39000000,
    discountPrice: 31200000,
    image: "/images/e (1).jpg",
    isFeatured: true,
    isNew: true,
    isLimited: false,
    size: "32 mm",
    glassMaterial: true,
    caseMaterial: true,
    waterResistance: "5 ATM",
    description: "Mặt khảm trai tuyệt đỉnh Thụy Sỹ."
  },
  {
    id: "home-epos-2",
    code: "E-3506.133.24.16.34",
    name: "Epos Swiss E-3506.133.24.16.34 - Nam - Automatic - Size 41 mm",
    category: "dong-ho",
    brand: "Epos Swiss",
    origin: "Thuỵ Sỹ",
    target: "Nam",
    price: 60250000,
    discountPrice: 48200000,
    image: "/images/e (2).jpg",
    isFeatured: false,
    isNew: false,
    isLimited: false,
    size: "41 mm",
    glassMaterial: true,
    caseMaterial: true,
    waterResistance: "5 ATM",
    description: "Mặt số cơ lộ tim đầy tinh xảo."
  },
  {
    id: "home-epos-3",
    code: "E-3511.152.34.16.30",
    name: "Epos Swiss E-3511.152.34.16.30 - Nam - Automatic - Size 40 mm",
    category: "dong-ho",
    brand: "Epos Swiss",
    origin: "Thuỵ Sỹ",
    target: "Nam",
    price: 49500000,
    discountPrice: 39600000,
    image: "/images/e (3).jpg",
    isFeatured: false,
    isNew: true,
    isLimited: false,
    size: "40 mm",
    glassMaterial: true,
    caseMaterial: true,
    waterResistance: "5 ATM",
    description: "Mặt vuông góc bo tròn cổ điển lịch lãm."
  },
  {
    id: "home-epos-4",
    code: "E-3415.868.20.36.25",
    name: "Epos Swiss E-3415.868.20.36.25 - Nam - Automatic - Size 39.5mm",
    category: "dong-ho",
    brand: "Epos Swiss",
    origin: "Thuỵ Sỹ",
    target: "Nam",
    price: 82625000,
    discountPrice: 66100000,
    image: "/images/e (4).jpg",
    isFeatured: false,
    isNew: false,
    isLimited: false,
    size: "39.5 mm",
    glassMaterial: true,
    caseMaterial: true,
    waterResistance: "5 ATM",
    description: "Mặt xanh huyền bí lịch lãm quý phái."
  },
  {
    id: "home-epos-5",
    code: "E-3439.322.24.26.25",
    name: "Epos Swiss E-3439.322.24.26.25 - Nam - Automatic - Size 41.7 mm",
    category: "dong-ho",
    brand: "Epos Swiss",
    origin: "Thuỵ Sỹ",
    target: "Nam",
    price: 87875000,
    discountPrice: 70300000,
    image: "/images/e (5).jpg",
    isFeatured: false,
    isNew: true,
    isLimited: false,
    size: "41.7 mm",
    glassMaterial: true,
    caseMaterial: true,
    waterResistance: "5 ATM",
    description: "Chuẩn mực lướt trần độc đáo tinh phong."
  },
  {
    id: "home-epos-6",
    code: "E-8000.702.22.68.32",
    name: "Epos Swiss E-8000.702.22.68.32 - Nữ - Pin - Size 34 mm",
    category: "dong-ho",
    brand: "Epos Swiss",
    origin: "Thuỵ Sỹ",
    target: "Nữ",
    price: 26125000,
    discountPrice: 20900000,
    image: "/images/e (6).jpg",
    isFeatured: false,
    isNew: false,
    isLimited: false,
    size: "34 mm",
    glassMaterial: true,
    caseMaterial: true,
    waterResistance: "5 ATM",
    description: "Mặt khảm trai đá quý sang trọng."
  },
  ...[
    ["home-jl-1", "JL-1-1542P", "Jacques Lemans JL-1-1542P - Nam", "Jacques Lemans", "Áo", "Nam", 5720000, 4576000, "/images/5 (1).jpg", "Sản phẩm Jacques Lemans 1"],
    ["home-jl-2", "JL-1-1654K", "Jacques Lemans JL-1-1654K - Nam", "Jacques Lemans", "Áo", "Nam", 6350000, 5080000, "/images/5 (2).jpg", "Sản phẩm Jacques Lemans 2"],
    ["home-jl-3", "JL-1-1864D", "Jacques Lemans JL-1-1864D - Nữ", "Jacques Lemans", "Áo", "Nữ", 8670000, 6936000, "/images/5 (3).jpg", "Sản phẩm Jacques Lemans 3"],
    ["home-jl-4", "JL-1-2125D", "Jacques Lemans JL-1-2125D - Nam", "Jacques Lemans", "Áo", "Nam", 5190000, 4152000, "/images/5 (4).jpg", "Sản phẩm Jacques Lemans 4"],
    ["home-jl-5", "JL-1-3001", "Jacques Lemans JL-1-3001 - Nam", "Jacques Lemans", "Áo", "Nam", 5980000, 4784000, "/images/5 (5).jpg", "Sản phẩm Jacques Lemans 5"],
    ["home-jl-6", "JL-1-3002", "Jacques Lemans JL-1-3002 - Nữ", "Jacques Lemans", "Áo", "Nữ", 4590000, 3672000, "/images/5 (6).jpg", "Sản phẩm Jacques Lemans 6"],
    ["home-ag-1", "AG-6-1", "Aries Gold - Mẫu 1", "Aries Gold", "Singapore", "Nam", 6020000, 4816000, "/images/6 (1).jpg", "Aries Gold - Ảnh 1"],
    ["home-ag-2", "AG-6-2", "Aries Gold - Mẫu 2", "Aries Gold", "Singapore", "Nam", 9280000, 7424000, "/images/6 (2).jpg", "Aries Gold - Ảnh 2"],
    ["home-ag-3", "AG-6-3", "Aries Gold - Mẫu 3", "Aries Gold", "Singapore", "Nam", 5680000, 4544000, "/images/6 (3).jpg", "Aries Gold - Ảnh 3"],
    ["home-ag-4", "AG-6-4", "Aries Gold - Mẫu 4", "Aries Gold", "Singapore", "Nữ", 6847500, 5478000, "/images/6 (4).jpg", "Aries Gold - Ảnh 4"],
    ["home-ag-5", "AG-6-5", "Aries Gold - Mẫu 5", "Aries Gold", "Singapore", "Nữ", 4990000, 3992000, "/images/6 (5).jpg", "Aries Gold - Ảnh 5"],
    ["home-ag-6", "AG-6-6", "Aries Gold - Mẫu 6", "Aries Gold", "Singapore", "Nam", 4590000, 3672000, "/images/6 (6).jpg", "Aries Gold - Ảnh 6"],
    ["home-dd-1", "DD-8-1", "Diamond D DD-8-1 - Nữ", "Diamond D", "Áo", "Nữ", 5550000, 4440000, "/images/8 (1).jpg", "Diamond D - Ảnh 1"],
    ["home-dd-2", "DD-8-2", "Diamond D DD-8-2 - Nữ", "Diamond D", "Áo", "Nữ", 4050000, 3240000, "/images/8 (2).jpg", "Diamond D - Ảnh 2"],
    ["home-dd-3", "DD-8-3", "Diamond D DD-8-3 - Nữ", "Diamond D", "Áo", "Nữ", 5310000, 4248000, "/images/8 (3).jpg", "Diamond D - Ảnh 3"],
    ["home-dd-4", "DD-8-4", "Diamond D DD-8-4 - Nữ", "Diamond D", "Áo", "Nữ", 6020000, 4816000, "/images/8 (4).jpg", "Diamond D - Ảnh 4"],
    ["home-dd-5", "DD-8-5", "Diamond D DD-8-5 - Nữ", "Diamond D", "Áo", "Nữ", 4780000, 3824000, "/images/8 (5).jpg", "Diamond D - Ảnh 5"],
    ["home-dd-6", "DD-8-6", "Diamond D DD-8-6 - Nữ", "Diamond D", "Áo", "Nữ", 5190000, 4152000, "/images/8 (6).jpg", "Diamond D - Ảnh 6"],
    ["home-pa-1", "PA8602-1", "Philippe Auguste PA8602-1 - Nam - Pin - Size 42 mm", "Philippe Auguste", "Pháp", "Nam", 33400000, 26720000, "/images/9 (1).jpg", "Lịch thiệp vương giả Pháp."],
    ["home-pa-2", "PA8602-2", "Philippe Auguste PA8602-2 - Nam - Automatic - Size 35 mm", "Philippe Auguste", "Pháp", "Nam", 33400000, 26720000, "/images/9 (2).jpg", "Lớp vỏ tinh anh thép 316L cao cấp nhất."],
    ["home-pa-3", "PA6003S", "Philippe Auguste PA6003S - Nam - Automatic - Size 41 mm", "Philippe Auguste", "Pháp", "Nam", 10750000, 8600000, "/images/9 (3).jpg", "Huyền tích Paris cổ kính."],
    ["home-pa-4", "PA9004", "Philippe Auguste PA9004 - Nam - Pin - Size 40 mm", "Philippe Auguste", "Pháp", "Nam", 12800000, 10240000, "/images/9 (4).jpg", "Phong cách Pháp thanh lịch."],
    ["home-pa-5", "PA9005", "Philippe Auguste PA9005 - Nam - Automatic - Size 41 mm", "Philippe Auguste", "Pháp", "Nam", 15600000, 12480000, "/images/9 (5).jpg", "Thiết kế cổ điển cao cấp."],
    ["home-pa-6", "PA9006", "Philippe Auguste PA9006 - Nam - Pin - Size 42 mm", "Philippe Auguste", "Pháp", "Nam", 13900000, 11120000, "/images/9 (6).jpg", "Philippe Auguste chính hãng."],
    ["home-at-1", "AT-52851.45.25", "Atlantic Swiss AT-52851.45.25 - Nữ - Automatic - Size 27mm", "Atlantic Swiss", "Thụy Sỹ", "Nữ", 140000000, 112000000, "/images/kk (1).jpg", "Tuyệt đỉnh kim cương lộng lẫy xa hoa"],
    ["home-at-2", "AT-52851.44.25", "Atlantic Swiss AT-52851.44.25 - Nữ - Automatic - Size 31.5 mm", "Atlantic Swiss", "Thụy Sỹ", "Nữ", 140000000, 112000000, "/images/kk (2).jpg", "Duy mỹ lộng lẫy và hoàn hảo."],
    ["home-at-3", "AT-64452.41.51R", "Atlantic Swiss AT-64452.41.51R - Nam - Automatic - Size 42 mm", "Atlantic Swiss", "Thụy Sỹ", "Nam", 13980000, 11184000, "/images/kk (3).jpg", "Cơ cấu chống nước cực cao."],
    ["home-at-4", "AT-64452.42.51R", "Atlantic Swiss AT-64452.42.51R - Nam - Automatic - Size 42 mm", "Atlantic Swiss", "Thụy Sỹ", "Nam", 15800000, 12640000, "/images/kk (4).jpg", "Chuẩn mực Thụy Sỹ lịch lãm."],
    ["home-at-5", "AT-60342.43.21", "Atlantic Swiss AT-60342.43.21 - Nam - Pin - Size 40 mm", "Atlantic Swiss", "Thụy Sỹ", "Nam", 12600000, 10080000, "/images/kk (5).jpg", "Thanh lịch, bền bỉ và chính xác."],
    ["home-at-6", "AT-29038.41.11", "Atlantic Swiss AT-29038.41.11 - Nữ - Pin - Size 32 mm", "Atlantic Swiss", "Thụy Sỹ", "Nữ", 11800000, 9440000, "/images/kk (6).jpg", "Atlantic Swiss chính hãng."],
    ["home-ct-1", "CT-EU6072-56D", "Citizen CT-EU6072-56D - Nữ - Pin - Size 27mm", "Citizen", "Nhật Bản", "Nữ", 4200000, 3360000, "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=400", "Chuẩn xác tối cao từ Nhật Bản."],
    ["home-ct-2", "CT-NH8354-58A", "Citizen CT-NH8354-58A - Nam - Automatic - Size 40mm", "Citizen", "Nhật Bản", "Nam", 7425000, 5940000, "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=400", "Hiện đại bền bỉ."],
    ["home-ct-3", "CT-EL3042-84A", "Citizen CT-EL3042-84A - Nữ - Pin - Size 37 mm", "Citizen", "Nhật Bản", "Nữ", 4385000, 3508000, "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=400", "Citizen chính hãng."],
    ["home-tb-1", "TB8208A-16", "Tsar Bomba TB8208A-16 - Nam - Automatic - Size 42 mm", "Tsar Bomba", "Hồng Kông", "Nam", 14000000, 11200000, "/images/t (1).jpg", "Dũng mãnh thể thao cá tính mạnh mẽ."],
    ["home-tb-2", "TB8209D-03", "Tsar Bomba TB8209D-03 - Nam - Automatic - Size 40mm", "Tsar Bomba", "Hồng Kông", "Nam", 19250000, 15400000, "/images/t (2).jpg", "Kiểu dáng hầm hố hiện đại thể thao."],
    ["home-tb-3", "TB8209CF-04", "Tsar Bomba TB8209CF-04 - Nam - Automatic - Size 42 mm", "Tsar Bomba", "Hồng Kông", "Nam", 17500000, 14000000, "/images/t (3).jpg", "Cơ khí siêu năng lực chống lực cực cao."],
    ["home-tb-4", "TB8210A-12", "Tsar Bomba TB8210A-12 - Nam - Automatic - Size 44 mm", "Tsar Bomba", "Hồng Kông", "Nam", 16800000, 13440000, "/images/t (4).jpg", "Thiết kế cơ khí mạnh mẽ cho phong cách thể thao."],
    ["home-tb-5", "TB8211D-09", "Tsar Bomba TB8211D-09 - Nam - Automatic - Size 43 mm", "Tsar Bomba", "Hồng Kông", "Nam", 18500000, 14800000, "/images/t (5).jpg", "Chi tiết hầm hố, hiện đại và bền bỉ."],
    ["home-tb-6", "TB8212CF-06", "Tsar Bomba TB8212CF-06 - Nam - Automatic - Size 42 mm", "Tsar Bomba", "Hồng Kông", "Nam", 15900000, 12720000, "/images/t (6).jpg", "Mặt số cá tính, nổi bật và chuẩn xác."]
  ].map(([id, code, name, brand, origin, target, price, discountPrice, image, description], index) => ({
    id,
    code,
    name,
    category: "dong-ho",
    brand,
    origin,
    target,
    price,
    discountPrice,
    image,
    isFeatured: index % 6 === 0,
    isNew: index % 2 === 0,
    isLimited: false,
    size: "40 mm",
    glassMaterial: true,
    caseMaterial: true,
    waterResistance: "5 ATM",
    description
  }))
];

const EPOS_DETAIL_PRODUCTS = [
  ["epos-7", "E-8002.702.20.25.15", "Epos Swiss E-8002.702.20.25.15 - Nữ - Pin - Size 21 mm x 24.5", "Nữ", 19000000, 15200000, "/images/e (7).jpg", "Bản vuông tinh xảo sang quyến quý phái"],
  ["epos-8", "E-3426.132.20.86.16", "Epos Swiss E-3426.132.20.86.16 - Nam - Automatic - Size 32 mm", "Nam", 44500000, 35600000, "/images/e (8).jpg", "Hào hoa nam tính thanh lịch quý phái"],
  ["epos-9", "E-3439.322.20.18.25", "Epos Swiss E-3439.322.20.18.25 - Nam - Automatic - Size 41.7 mm", "Nam", 83875000, 67100000, "/images/e (9).jpg", "Vương uy chất ròng Thụy Sỹ."],
  ["epos-10", "E-3426.132.22.20.32", "Epos Swiss E-3426.132.22.20.32 +E - Nữ - Automatic - Size 41 mm", "Nữ", 90875000, 72700000, "/images/e (10).jpg", "Kính vạn hoa sắc vàng lấp lánh."],
  ["epos-11", "E-3430.172.24.12.30", "Epos Swiss E-3430.172.24.12.30 - Nữ - Automatic - Size 30 mm", "Nữ", 35400000, 28320000, "/images/e (11).jpg", "Thiết kế nhỏ gọn thanh lịch cho quý cô hiện đại."],
  ["epos-12", "E-3445.182.20.20.35", "Epos Swiss E-3445.182.20.20.35 - Nam - Automatic - Size 42 mm", "Nam", 48250000, 38600000, "/images/e (12).jpg", "Epos Swiss chính hãng."]
].map(([id, code, name, target, price, discountPrice, image, description]) => ({
  id,
  code,
  name,
  category: "dong-ho",
  brand: "Epos Swiss",
  origin: "Thuỵ Sỹ",
  target,
  price,
  discountPrice,
  image,
  isFeatured: false,
  isNew: true,
  isLimited: false,
  size: "40 mm",
  glassMaterial: true,
  caseMaterial: true,
  waterResistance: "5 ATM",
  description
}));

const TREND_DETAIL_PRODUCTS = [
  ["trend-1", "JL-1-1842.1D", "Jacques Lemans JL-1-1842.1D", "Jacques Lemans", "Áo", "Nữ", 5190000, 4152000, "/images/3 (1).jpg", "Sang quý tao nhã."],
  ["trend-2", "JL-1-1842.1F", "Jacques Lemans JL-1-1842.1F", "Jacques Lemans", "Áo", "Nữ", 3740000, 2992000, "/images/3 (2).jpg", "Điểm tuyệt đẹp rực rỡ."],
  ["trend-3", "ST-502.333X2", "Stuhrling Tourbillon ST-502.333X2", "Stuhrling", "Thụy Sỹ", "Nam", 86000000, 68800000, "/images/g.jpg", "Cơ khí kì diệu tuyệt đỉnh giá trị."],
  ["trend-4", "AG-L9003 S-BKMOP", "Aries Gold AG-L9003 S-BKMOP", "Aries Gold", "Singapore", "Nam", 7780000, 6224000, "/images/3 (4).jpg", "Náp vàng phượng hoàng lộng lẫy."],
  ["trend-5", "EP-1001", "Epos Swiss EP-1001", "Epos Swiss", "Thụy Sỹ", "Nam", 45000000, 36000000, "/images/3 (5).jpg", "Mẫu Epos nổi bật."],
  ["trend-6", "CT-EL3042-84A", "Citizen CT-EL3042-84A", "Citizen", "Nhật Bản", "Nữ", 4385000, 3508000, "/images/3 (6).jpg", "Thiết kế bền vững."],
  ["trend-7", "PA6003S", "Philippe Auguste PA6003S", "Philippe Auguste", "Pháp", "Nam", 10750000, 8600000, "/images/3 (7).jpg", "Huyền tích Paris."],
  ["trend-8", "DD-1014", "Diamond D DM1014-2TG-01", "Diamond D", "Áo", "Nữ", 5550000, 4440000, "/images/3 (1).jpg", "Chạm khắc nghệ thuật."],
  ["trend-9", "TB8208A-16", "Tsar Bomba TB8208A-16", "Tsar Bomba", "Hồng Kông", "Nam", 14000000, 11200000, "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=400", "Dũng mãnh thể thao."],
  ["trend-10", "AG-G102", "Aries Gold AG-G102", "Aries Gold", "Singapore", "Nam", 6020000, 4816000, "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=400", "Mẫu Aries nổi bật."],
  ["trend-11", "SE-100", "Seiko Modern SE-100", "Seiko", "Nhật", "Nam", 6500000, 5200000, "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400", "Seiko chất lượng."],
  ["trend-12", "OR-200", "Orient Classic OR-200", "Orient", "Nhật", "Nữ", 4200000, 3360000, "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400", "Orient thanh lịch."],
  ["trend-13", "QQ-01", "Q&Q Slim QQ-01", "Q&Q", "Nhật", "Unisex", 1200000, 960000, "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=400", "Giá hợp lý."],
  ["trend-14", "BR-01", "Bruno Söhnle BR-01", "Bruno Sohnle", "Đức", "Nam", 22000000, 17600000, "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=400", "Đức tinh xảo."],
  ["trend-15", "SRW-01", "SRWatch SRW-01", "SRWatch", "Anh", "Unisex", 3200000, 2560000, "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=400", "Thiết kế trẻ trung."]
].map(([id, code, name, brand, origin, target, price, discountPrice, image, description]) => ({
  id,
  code,
  name,
  category: "dong-ho",
  brand,
  origin,
  target,
  price,
  discountPrice,
  image,
  isFeatured: false,
  isNew: true,
  isLimited: false,
  size: "40 mm",
  glassMaterial: true,
  caseMaterial: true,
  waterResistance: "5 ATM",
  description
}));

const EYEWEAR_BRANDS = [
  { brand: "Prada", origin: "Ý", codePrefix: "PRA" },
  { brand: "Burberry", origin: "Anh", codePrefix: "BUR" },
  { brand: "Coach", origin: "Mỹ", codePrefix: "COA" },
  { brand: "Michael Kors", origin: "Mỹ", codePrefix: "MK" }
];

const EYEWEAR_PRODUCTS = Array.from({ length: 75 }, (_, index) => {
  const itemNumber = index + 1;
  const brandIndex = index < 19 ? 0 : index < 38 ? 1 : index < 57 ? 2 : 3;
  const brandInfo = EYEWEAR_BRANDS[brandIndex];
  const brandItemNumber = index - brandIndex * 19 + 1;
  const price = 3950000 + (index % 12) * 240000;
  const hasDiscount = index % 3 !== 1;
  const modelCode = `${brandInfo.codePrefix}-${3000 + brandItemNumber}QF-${(index % 8) + 1}${index % 2 === 0 ? "14" : "24"}/${(index % 5) + 1}${index % 3 === 0 ? "60" : "54"}IT`;

  return {
    id: `eye-a-${String(itemNumber).padStart(2, "0")}`,
    code: modelCode,
    name: `Kính mát ${brandInfo.brand} ${modelCode}`,
    category: "kinh-mat",
    brand: brandInfo.brand,
    origin: brandInfo.origin,
    target: index % 5 === 0 ? "Nữ" : index % 4 === 0 ? "Nam" : "Unisex",
    price,
    discountPrice: hasDiscount ? Math.floor(price * 0.85) : null,
    image: `/images/a (${itemNumber}).jpg`,
    isFeatured: index < 8,
    isNew: index % 2 === 0,
    isLimited: index % 11 === 0,
    description: "Kính mắt chính hãng với form dáng thời trang, chất liệu cao cấp và khả năng bảo vệ mắt khi sử dụng hằng ngày."
  };
});

const PEN_MODELS = [
  ["BUTPA-911/B", "BÚT KÝ PHILIPPE AUGUSTE BUTPA-911/B"],
  ["BUTPA-911/R", "BÚT KÝ PHILIPPE AUGUSTE BUTPA-911/R"],
  ["BUTPA-911/BL", "BÚT KÝ PHILIPPE AUGUSTE BUTPA-911/BL"],
  ["BUTPA-910/BL", "BÚT KÝ PHILIPPE AUGUSTE BUTPA-910/BL"],
  ["BUTPA-923/R", "BÚT KÝ PHILIPPE AUGUSTE BUTPA-923/R"],
  ["BUTPA-923/BL", "BÚT KÝ PHILIPPE AUGUSTE BUTPA-923/BL"],
  ["BUTPA-910/B", "BÚT KÝ PHILIPPE AUGUSTE BUTPA-910/B"],
  ["BUTPA-911/WG", "BÚT KÝ PHILIPPE AUGUSTE BUTPA-911/WG"],
  ["BUTPA-910/W", "BÚT KÝ PHILIPPE AUGUSTE BUTPA-910/W"],
  ["BUTPA-923/BG", "BÚT KÝ PHILIPPE AUGUSTE BUTPA-923/BG"],
  ["BUTPA-912/B", "BÚT KÝ PHILIPPE AUGUSTE BUTPA-912/B"],
  ["BUTPA-912/R", "BÚT KÝ PHILIPPE AUGUSTE BUTPA-912/R"]
];

const PEN_PRODUCTS = PEN_MODELS.map(([code, name], index) => ({
  id: `pen-b-${String(index + 1).padStart(2, "0")}`,
  code,
  name,
  category: "but-ky",
  brand: "Philippe Auguste",
  origin: "Pháp",
  target: "Unisex",
  price: 550000,
  discountPrice: null,
  image: `/images/b (${index + 1}).jpg`,
  isFeatured: index < 4,
  isNew: index % 2 === 0,
  isLimited: false,
  description: "Bút ký Philippe Auguste cao cấp, thiết kế thanh lịch dành cho doanh nhân và quà tặng sang trọng."
}));

const ACCESSORY_BRANDS = [
  { brand: "Epos Swiss", codePrefix: "EP", origin: "Thụy Sỹ" },
  { brand: "Jacques Lemans", codePrefix: "JL", origin: "Áo" },
  { brand: "Aries Gold", codePrefix: "AG", origin: "Singapore" },
  { brand: "Diamond D", codePrefix: "DD", origin: "Áo" },
  { brand: "Philippe Auguste", codePrefix: "PA", origin: "Pháp" },
  { brand: "Atlantic Swiss", codePrefix: "AT", origin: "Thụy Sỹ" },
  { brand: "Tsar Bomba", codePrefix: "TB", origin: "Hồng Kông" }
];

const ACCESSORY_MATERIALS = [
  "Dây da bê vân cá sấu",
  "Dây cá sấu bóng",
  "Dây da bê Saffiano",
  "Dây da trơn Classic",
  "Dây da Nubuck thể thao",
  "Dây da vân đuôi cá",
  "Dây da khâu tay",
  "Dây da cao cấp Signature",
  "Dây da mềm Comfort",
  "Dây da Elegant"
];

const ACCESSORY_COLORS = [
  "Black",
  "Brown",
  "Blue",
  "Grey",
  "Wine",
  "Tan",
  "Navy",
  "Cognac",
  "Green",
  "Coffee"
];

const ACCESSORY_PRODUCTS = Array.from({ length: 70 }, (_, index) => {
  const itemNumber = index + 1;
  const brandIndex = Math.floor(index / 10);
  const brandItemNumber = index % 10 + 1;
  const brandInfo = ACCESSORY_BRANDS[brandIndex];
  const material = ACCESSORY_MATERIALS[index % ACCESSORY_MATERIALS.length];
  const color = ACCESSORY_COLORS[index % ACCESSORY_COLORS.length];
  const size = brandItemNumber % 2 === 0 ? 22 : 20;
  const price = 790000 + (brandItemNumber % 5) * 180000 + brandIndex * 40000;
  const code = `D-${brandInfo.codePrefix}-${color.toUpperCase()}-${size}`;

  return {
    id: `strap-d-${String(itemNumber).padStart(2, "0")}`,
    code,
    name: `${material} ${brandInfo.brand} ${code}`,
    category: "phu-kien",
    brand: brandInfo.brand,
    origin: brandInfo.origin,
    target: "Unisex",
    price,
    discountPrice: brandItemNumber % 3 === 0 ? Math.floor(price * 0.9) : null,
    image: `/images/d (${itemNumber}).jpg`,
    isFeatured: brandItemNumber === 1,
    isNew: brandItemNumber % 2 === 0,
    isLimited: brandItemNumber === 10,
    size: `${size} mm`,
    description: `Dây đồng hồ ${brandInfo.brand} chính hãng, chất liệu da cao cấp, phối màu ${color} dễ kết hợp với nhiều mẫu đồng hồ.`
  };
});

const REMOVED_SHOP_PRODUCT_IDS = new Set([
  "wat-pa-01",
  "wat-epos-01",
  "wat-at-01",
  "wat-aries-01",
  "wat-pa-02",
  "wat-diamond-01",
  "wat-casio-01",
  "ey-bb-01",
  "ey-rb-01",
  "pe-mont-01",
  "ac-led-01",
  "home-ct-1",
  "home-ct-2",
  "home-ct-3"
]);

const ALL_PRODUCTS = [
  ...PRODUCTS,
  ...HOME_WATCH_PRODUCTS,
  ...EPOS_DETAIL_PRODUCTS,
  ...EYEWEAR_PRODUCTS,
  ...PEN_PRODUCTS,
  ...ACCESSORY_PRODUCTS
].filter(
  (product) => !REMOVED_SHOP_PRODUCT_IDS.has(String(product.id))
);

const DETAIL_ONLY_PRODUCTS = [...TREND_DETAIL_PRODUCTS];

function findProductById(id: string) {
  return (
    ALL_PRODUCTS.find((product) => product.id === id) ||
    HOME_WATCH_PRODUCTS.find((product) => product.id === `home-${id}`) ||
    DETAIL_ONLY_PRODUCTS.find((product) => product.id === id)
  );
}

function toApiProduct(product: any) {
  return {
    id: product.id,
    code: product.code,
    name: product.name,
    category: product.category,
    brand: product.brand,
    origin: product.origin,
    target: product.target || undefined,
    price: product.price,
    discountPrice: product.discountPrice,
    image: product.image,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    isLimited: product.isLimited,
    size: product.size || undefined,
    glassMaterial: product.glassMaterial ?? undefined,
    caseMaterial: product.caseMaterial ?? undefined,
    waterResistance: product.waterResistance || undefined,
    description: product.description
  };
}

function slugifyProductId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function normalizeProductInput(body: any, existingId?: string) {
  const name = String(body.name || "").trim();
  const code = String(body.code || "").trim();
  const category = String(body.category || "").trim();
  const brand = String(body.brand || "").trim();
  const origin = String(body.origin || "").trim();
  const image = String(body.image || "").trim();
  const description = String(body.description || "").trim();
  const price = Math.round(Number(body.price || 0));
  const discountPriceValue = body.discountPrice === "" || body.discountPrice == null
    ? null
    : Math.round(Number(body.discountPrice));

  if (!name || !code || !category || !brand || !origin || !image || !description) {
    throw new Error("Missing required product fields");
  }
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Product price must be greater than 0");
  }
  if (discountPriceValue != null && (!Number.isFinite(discountPriceValue) || discountPriceValue < 0)) {
    throw new Error("Discount price is invalid");
  }

  const id = existingId || slugifyProductId(String(body.id || code || name));
  if (!id) {
    throw new Error("Product id is invalid");
  }

  return {
    id,
    code,
    name,
    category,
    brand,
    origin,
    target: body.target ? String(body.target).trim() : null,
    price,
    discountPrice: discountPriceValue,
    image,
    isFeatured: Boolean(body.isFeatured),
    isNew: Boolean(body.isNew),
    isLimited: Boolean(body.isLimited),
    size: body.size ? String(body.size).trim() : null,
    glassMaterial: typeof body.glassMaterial === "boolean" ? body.glassMaterial : null,
    caseMaterial: typeof body.caseMaterial === "boolean" ? body.caseMaterial : null,
    waterResistance: body.waterResistance ? String(body.waterResistance).trim() : null,
    description
  };
}

function toApiUser(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    address: user.address || "",
    avatar: user.avatar || "",
    membership: user.membership || "MEMBER",
    role: user.role || "CUSTOMER",
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
    history: Array.isArray(user.orders)
      ? user.orders.map((order: any) => ({
          id: order.id,
          warrantyCode: order.warrantyCode,
          userEmail: order.userEmail || user.email,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerAddress: order.customerAddress,
          items: Array.isArray(order.items)
            ? order.items.map((item: any) => ({
                product: item.productSnapshot,
                quantity: item.quantity
              }))
            : [],
          totalOriginal: order.totalOriginal,
          totalDiscounted: order.totalDiscounted,
          discountRate: Number(order.discountRate || 0),
          status: order.status,
          note: order.note || "",
          createdAt:
            order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt
        }))
      : []
  };
}

function toApiOrder(order: any) {
  return {
    id: order.id,
    warrantyCode: order.warrantyCode,
    userEmail: order.userEmail || order.user?.email || "",
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    items: Array.isArray(order.items)
      ? order.items.map((item: any) => ({
          product: item.productSnapshot,
          quantity: item.quantity
        }))
      : [],
    totalOriginal: order.totalOriginal,
    totalDiscounted: order.totalDiscounted,
    discountRate: Number(order.discountRate || 0),
    status: order.status,
    note: order.note || "",
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt
  };
}

function signUserToken(user: any) {
  const secret = process.env.JWT_SECRET || "development-only-secret";
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role || "CUSTOMER"
    },
    secret,
    { expiresIn: "7d" }
  );
}

type AuthPayload = {
  sub?: string;
  email?: string;
  role?: string;
};

type AuthenticatedRequest = express.Request & {
  auth?: AuthPayload;
};

function getBearerToken(req: express.Request) {
  const authHeader = req.headers.authorization || "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
}

function verifyBearerToken(req: express.Request) {
  const token = getBearerToken(req);
  if (!token) return null;

  const secret = process.env.JWT_SECRET || "development-only-secret";
  return jwt.verify(token, secret) as AuthPayload;
}

function requireAuth(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  if (!getBearerToken(req)) {
    return res.status(401).json({ error: "Ban can dang nhap" });
  }

  try {
    req.auth = verifyBearerToken(req) || undefined;
    return next();
  } catch {
    return res.status(401).json({ error: "Phien dang nhap khong hop le" });
  }
}

function requireAdmin(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  if (!getBearerToken(req)) {
    return res.status(401).json({ error: "Ban can dang nhap bang tai khoan admin" });
  }

  try {
    const payload = verifyBearerToken(req);
    req.auth = payload || undefined;
    if (payload?.role !== "ADMIN") {
      return res.status(403).json({ error: "Tai khoan khong co quyen quan tri" });
    }
    return next();
  } catch {
    return res.status(401).json({ error: "Phien dang nhap khong hop le" });
  }
}

function canAccessUser(req: AuthenticatedRequest, userId: string) {
  return req.auth?.role === "ADMIN" || req.auth?.sub === userId;
}

async function findUserWithOrders(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true }
      }
    }
  });
}

type CreateAppOptions = {
  useVite?: boolean;
  serveStatic?: boolean;
};

export async function createApp(options: CreateAppOptions = {}) {
  const app = express();

  // Middleware for body parse
  app.use(express.json({ limit: "10mb" }));

  // API 1: Fetch Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: "asc" }
      });
      res.json(products.map(toApiProduct));
    } catch (error) {
      console.error("Khong the tai san pham tu database:", error);
      res.json(ALL_PRODUCTS);
    }
  });

  // API 2: Fetch Product Detail
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: req.params.id }
      });
      if (product) {
        return res.json(toApiProduct(product));
      }
    } catch (error) {
      console.error("Khong the tai chi tiet san pham tu database:", error);
    }

    const fallbackProduct = findProductById(req.params.id);
    if (fallbackProduct) {
      return res.json(fallbackProduct);
    }

    res.status(404).json({ error: "Product not found" });
  });

  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const productInput = normalizeProductInput(req.body);
      const product = await prisma.product.create({
        data: productInput
      });
      return res.status(201).json({ product: toApiProduct(product) });
    } catch (error: any) {
      console.error("Khong the tao san pham:", error);
      if (error?.code === "P2002") {
        return res.status(409).json({ error: "Ma san pham hoac ID da ton tai" });
      }
      return res.status(400).json({ error: error?.message || "Khong the tao san pham" });
    }
  });

  app.put("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const productInput = normalizeProductInput(req.body, req.params.id);
      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: productInput
      });
      return res.json({ product: toApiProduct(product) });
    } catch (error: any) {
      console.error("Khong the cap nhat san pham:", error);
      if (error?.code === "P2025") {
        return res.status(404).json({ error: "Khong tim thay san pham" });
      }
      if (error?.code === "P2002") {
        return res.status(409).json({ error: "Ma san pham da duoc su dung" });
      }
      return res.status(400).json({ error: error?.message || "Khong the cap nhat san pham" });
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      await prisma.product.delete({
        where: { id: req.params.id }
      });
      return res.json({ success: true });
    } catch (error: any) {
      console.error("Khong the xoa san pham:", error);
      if (error?.code === "P2025") {
        return res.status(404).json({ error: "Khong tim thay san pham" });
      }
      return res.status(400).json({ error: "Khong the xoa san pham" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Vui long nhap day du thong tin" });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      });
      if (existingUser) {
        return res.status(400).json({ error: "Email nay da duoc dang ky" });
      }

      const passwordHash = await bcrypt.hash(String(password), 12);
      const user = await prisma.user.create({
        data: {
          name: String(name).trim(),
          email: normalizedEmail,
          passwordHash,
          phone: "",
          address: "",
          avatar: "",
          membership: "MEMBER",
          role: "CUSTOMER"
        },
        include: { orders: { include: { items: true } } }
      });

      return res.json({
        message: "Dang ky thanh cong!",
        user: toApiUser(user),
        token: signUserToken(user)
      });
    } catch (error) {
      console.error("Khong the dang ky tai khoan:", error);
      return res.status(500).json({ error: "Khong the dang ky tai khoan" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const normalizedEmail = String(email || "").trim().toLowerCase();
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: {
          orders: {
            orderBy: { createdAt: "desc" },
            include: { items: true }
          }
        }
      });

      if (user) {
        const passwordMatches = await bcrypt.compare(String(password || ""), user.passwordHash);
        if (!passwordMatches) {
          return res.status(401).json({ error: "Email hoac mat khau sai!" });
        }

        return res.json({
          message: "Dang nhap thanh cong!",
          user: toApiUser(user),
          token: signUserToken(user)
        });
      }

      return res.status(401).json({ error: "Email hoac mat khau sai!" });
    } catch (error) {
      console.error("Khong the dang nhap:", error);
      return res.status(500).json({ error: "Khong the dang nhap" });
    }
  });

  app.get("/api/users", requireAdmin, async (_req, res) => {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          orders: {
            orderBy: { createdAt: "desc" },
            include: { items: true }
          }
        }
      });
      return res.json(users.map(toApiUser));
    } catch (error) {
      console.error("Khong the tai danh sach tai khoan:", error);
      return res.status(500).json({ error: "Khong the tai danh sach tai khoan" });
    }
  });

  app.put("/api/users/:id/admin", requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { name, email, phone, address, avatar, membership, role } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Ten va email khong duoc de trong" });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const emailOwner = await prisma.user.findFirst({
        where: {
          email: normalizedEmail,
          NOT: { id: req.params.id }
        }
      });
      if (emailOwner) {
        return res.status(400).json({ error: "Email nay da duoc tai khoan khac su dung" });
      }

      const normalizedRole = role === "ADMIN" ? "ADMIN" : "CUSTOMER";
      const normalizedMembership = membership === "VIP" ? "VIP" : "MEMBER";
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (req.auth?.sub === req.params.id && normalizedRole !== "ADMIN" && adminCount <= 1) {
        return res.status(400).json({ error: "Khong the ha quyen admin cuoi cung" });
      }

      await prisma.user.update({
        where: { id: req.params.id },
        data: {
          name: String(name).trim(),
          email: normalizedEmail,
          phone: phone ? String(phone).trim() : "",
          address: address ? String(address).trim() : "",
          avatar: avatar || "",
          membership: normalizedMembership,
          role: normalizedRole
        }
      });

      const user = await findUserWithOrders(req.params.id);
      return res.json({ user: toApiUser(user) });
    } catch (error: any) {
      console.error("Khong the cap nhat tai khoan admin:", error);
      if (error?.code === "P2025") {
        return res.status(404).json({ error: "Khong tim thay tai khoan" });
      }
      return res.status(500).json({ error: "Khong the cap nhat tai khoan" });
    }
  });

  app.delete("/api/users/:id", requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      if (req.auth?.sub === req.params.id) {
        return res.status(400).json({ error: "Khong the xoa tai khoan dang dang nhap" });
      }

      const user = await prisma.user.findUnique({ where: { id: req.params.id } });
      if (!user) {
        return res.status(404).json({ error: "Khong tim thay tai khoan" });
      }

      if (user.role === "ADMIN") {
        const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
        if (adminCount <= 1) {
          return res.status(400).json({ error: "Khong the xoa admin cuoi cung" });
        }
      }

      await prisma.user.delete({ where: { id: req.params.id } });
      return res.json({ success: true });
    } catch (error: any) {
      console.error("Khong the xoa tai khoan:", error);
      if (error?.code === "P2025") {
        return res.status(404).json({ error: "Khong tim thay tai khoan" });
      }
      return res.status(500).json({ error: "Khong the xoa tai khoan" });
    }
  });

  app.get("/api/users/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      if (!canAccessUser(req, req.params.id)) {
        return res.status(403).json({ error: "Tai khoan khong co quyen truy cap thong tin nay" });
      }

      const user = await findUserWithOrders(req.params.id);
      if (user) {
        return res.json({ user: toApiUser(user) });
      }

      return res.status(404).json({ error: "Khong tim thay tai khoan" });
    } catch (error) {
      console.error("Khong the tai tai khoan:", error);
      return res.status(500).json({ error: "Khong the tai tai khoan" });
    }
  });

  app.put("/api/users/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      if (!canAccessUser(req, req.params.id)) {
        return res.status(403).json({ error: "Tai khoan khong co quyen cap nhat thong tin nay" });
      }

      const { name, email, phone, address, avatar } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Ten va email khong duoc de trong" });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const emailOwner = await prisma.user.findFirst({
        where: {
          email: normalizedEmail,
          NOT: { id: req.params.id }
        }
      });
      if (emailOwner) {
        return res.status(400).json({ error: "Email nay da duoc tai khoan khac su dung" });
      }

      const userExists = await prisma.user.findUnique({
        where: { id: req.params.id }
      });
      if (!userExists) {
        return res.status(404).json({ error: "Khong tim thay tai khoan" });
      }

      await prisma.user.update({
        where: { id: req.params.id },
        data: {
          name: String(name).trim(),
          email: normalizedEmail,
          phone: phone ? String(phone).trim() : "",
          address: address ? String(address).trim() : "",
          avatar: avatar || ""
        }
      });

      const user = await findUserWithOrders(req.params.id);
      return res.json({
        message: "Cap nhat tai khoan thanh cong!",
        user: toApiUser(user)
      });
    } catch (error) {
      console.error("Khong the cap nhat tai khoan:", error);
      return res.status(500).json({ error: "Khong the cap nhat tai khoan" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const {
        userEmail,
        customerName,
        customerPhone,
        customerAddress,
        items,
        discountRate,
        note
      } = req.body;

      if (!customerName || !customerPhone || !customerAddress || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Vui long nhap day du thong tin dat hang va co san pham" });
      }

      const normalizedEmail = userEmail ? String(userEmail).trim().toLowerCase() : null;
      const user = normalizedEmail
        ? await prisma.user.findUnique({ where: { email: normalizedEmail } })
        : null;

      const orderItems = items.map((item: any) => {
        const product = item.product;
        const quantity = Math.max(1, Number(item.quantity || 1));
        if (!product?.id || !product?.name) {
          throw new Error("Invalid order item product");
        }

        const unitPrice = Number(product.discountPrice || product.price || 0);
        return {
          product,
          quantity,
          unitPrice,
          lineTotal: unitPrice * quantity
        };
      });

      const totalOriginal = orderItems.reduce((sum: number, item: any) => sum + item.lineTotal, 0);
      const normalizedDiscountRate = Math.max(0, Math.min(0.5, Number(discountRate || 0)));
      const totalDiscounted = Math.round(totalOriginal * (1 - normalizedDiscountRate));
      const orderNumber = Math.floor(Math.random() * 900000 + 100000);
      const orderId = `ORD-${orderNumber}`;
      const warrantyCode = `DQ-${new Date().getFullYear()}-${orderNumber}`;

      const order = await prisma.order.create({
        data: {
          id: orderId,
          warrantyCode,
          userId: user?.id,
          userEmail: normalizedEmail,
          customerName: String(customerName).trim(),
          customerPhone: String(customerPhone).trim(),
          customerAddress: String(customerAddress).trim(),
          totalOriginal,
          totalDiscounted,
          discountRate: normalizedDiscountRate,
          status: "CHO_XAC_NHAN",
          note: note ? String(note).trim() : "",
          items: {
            create: orderItems.map((item: any) => ({
              productSnapshot: item.product,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              lineTotal: item.lineTotal
            }))
          }
        },
        include: { items: true }
      });

      if (user) {
        const aggregate = await prisma.order.aggregate({
          where: { userId: user.id },
          _sum: { totalDiscounted: true }
        });
        if (Number(aggregate._sum.totalDiscounted || 0) > 15000000 && user.membership !== "VIP") {
          await prisma.user.update({
            where: { id: user.id },
            data: { membership: "VIP" }
          });
        }
      }

      return res.json({
        success: true,
        message: "Dat hang thanh cong! Dang Quang Watch chan thanh cam on quy khach.",
        order: toApiOrder(order)
      });
    } catch (error) {
      console.error("Khong the tao don hang:", error);
      return res.status(500).json({ error: "Khong the tao don hang" });
    }
  });

  app.get("/api/warranty/:code", async (req, res) => {
    try {
      const warrantyCode = String(req.params.code || "").trim().toUpperCase();
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { warrantyCode },
            { id: warrantyCode }
          ]
        },
        include: { items: true }
      });

      if (order) {
        return res.json({ order: toApiOrder(order) });
      }

      return res.status(404).json({ error: "Khong tim thay ma bao hanh" });
    } catch (error) {
      console.error("Khong the tra cuu bao hanh:", error);
      return res.status(500).json({ error: "Khong the tra cuu bao hanh" });
    }
  });

  app.get("/api/orders", requireAdmin, async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { items: true }
      });
      return res.json(orders.map(toApiOrder));
    } catch (error) {
      console.error("Khong the tai don hang:", error);
      return res.status(500).json({ error: "Khong the tai don hang" });
    }
  });

  app.put("/api/orders/:id", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status: String(status || "").trim() },
        include: { items: true }
      });

      return res.json({
        message: "Cap nhat don hang thanh cong!",
        order: toApiOrder(order)
      });
    } catch (error) {
      console.error("Khong the cap nhat don hang:", error);
      return res.status(404).json({ error: "Khong tim thay don dat hang" });
    }
  });


  // Vite middleware for development
  if (options.useVite) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (options.serveStatic) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}

async function startServer() {
  const PORT = 3000;
  const app = await createApp({
    useVite: process.env.NODE_ENV !== "production",
    serveStatic: process.env.NODE_ENV === "production"
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (process.env.VERCEL !== "1") {
  startServer();
}
