import React, { useState } from "react";
import { useStore } from "../contexts/StoreContext";
import HomeHero from "../components/HomeHero";
import BrandBar from "../components/BrandBar";
import ProductCard from "../components/ProductCard";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const { products, isLoading, toggleWishlist, isInWishlist } = useStore();

  // Local state to keep track of active sub-tab filters for specific brand sections
  const [brandFilters, setBrandFilters] = useState<Record<string, "all" | "Nam" | "Nữ" | "limited">>({
    "jacques lemans": "all",
    "aries gold": "all",
    "diamond d": "all",
    "philippe auguste": "all",
    "atlantic swiss": "all",
    "citizen": "all"
  });
  const [jacquesCarouselIndex, setJacquesCarouselIndex] = useState(0);
  const [jacquesCarouselDirection, setJacquesCarouselDirection] = useState<"next" | "prev">("next");
  const [ariesCarouselIndex, setAriesCarouselIndex] = useState(0);
  const [ariesCarouselDirection, setAriesCarouselDirection] = useState<"next" | "prev">("next");
  const [diamondCarouselIndex, setDiamondCarouselIndex] = useState(0);
  const [diamondCarouselDirection, setDiamondCarouselDirection] = useState<"next" | "prev">("next");
  const [philippeCarouselIndex, setPhilippeCarouselIndex] = useState(0);
  const [philippeCarouselDirection, setPhilippeCarouselDirection] = useState<"next" | "prev">("next");
  const [atlanticCarouselIndex, setAtlanticCarouselIndex] = useState(0);
  const [atlanticCarouselDirection, setAtlanticCarouselDirection] = useState<"next" | "prev">("next");
  const [tsarCarouselIndex, setTsarCarouselIndex] = useState(0);
  const [tsarCarouselDirection, setTsarCarouselDirection] = useState<"next" | "prev">("next");
  const [trendingCarouselIndex, setTrendingCarouselIndex] = useState(0);
  const [trendingCarouselDirection, setTrendingCarouselDirection] = useState<"next" | "prev">("next");

  // Helper resolver to retrieve products belonging to a brand name and return at least 4 items dynamically
  const getProductsByBrand = (brandName: string): any[] => {
    const normalized = brandName.toLowerCase();
    
    let list: any[] = [];
    
    // Exact lists to mirror mock images perfectly
    if (normalized.includes("epos")) {
      list = [
        {
          id: "epos-1",
          code: "E-4314.133.20.50.10",
          name: "Epos Swiss E-4314.133.20.50.10 - Nữ - Automatic - Size 32 mm",
          category: "dong-ho",
          brand: "Epos Swiss",
          origin: "Thuỵ Sỹ",
          target: "Nữ",
          price: 39000000,
          discountPrice: 31200000,
          image: "/images/e (1).jpg",
          description: "Mặt khảm trai tuyệt đỉnh Thụy Sỹ."
        },
        {
          id: "epos-2",
          code: "E-3506.133.24.16.34",
          name: "Epos Swiss E-3506.133.24.16.34 - Nam - Automatic - Size 41 mm",
          category: "dong-ho",
          brand: "Epos Swiss",
          origin: "Thuỵ Sỹ",
          target: "Nam",
          price: 60250000,
          discountPrice: 48200000,
          image: "/images/e (2).jpg",
          description: "Mặt số cơ lộ tim đầy tinh xảo."
        },
        {
          id: "epos-3",
          code: "E-3511.152.34.16.30",
          name: "Epos Swiss E-3511.152.34.16.30 - Nam - Automatic - Size 40 mm",
          category: "dong-ho",
          brand: "Epos Swiss",
          origin: "Thuỵ Sỹ",
          target: "Nam",
          price: 49500000,
          discountPrice: 39600000,
          image: "/images/e (3).jpg",
          description: "Mặt vuông góc bo tròn cổ điển lịch lãm."
        },
        {
          id: "epos-4",
          code: "E-3415.868.20.36.25",
          name: "Epos Swiss E-3415.868.20.36.25 - Nam - Automatic - Size 39.5mm",
          category: "dong-ho",
          brand: "Epos Swiss",
          origin: "Thuỵ Sỹ",
          target: "Nam",
          price: 82625000,
          discountPrice: 66100000,
          image: "/images/e (4).jpg",
          description: "Mặt xanh huyền bí lịch lãm quý phái."
        },
        {
          id: "epos-5",
          code: "E-3439.322.24.26.25",
          name: "Epos Swiss E-3439.322.24.26.25 - Nam - Automatic - Size 41.7 mm",
          category: "dong-ho",
          brand: "Epos Swiss",
          origin: "Thuỵ Sỹ",
          target: "Nam",
          price: 87875000,
          discountPrice: 70300000,
          image: "/images/e (5).jpg",
          description: "Chuẩn mực lướt trần độc đáo tinh phong."
        },
        {
          id: "epos-6",
          code: "E-8000.702.22.68.32",
          name: "Epos Swiss E-8000.702.22.68.32 - Nữ - Pin - Size 34 mm",
          category: "dong-ho",
          brand: "Epos Swiss",
          origin: "Thuỵ Sỹ",
          target: "Nữ",
          price: 26125000,
          discountPrice: 20900000,
          image: "/images/e (6).jpg",
          description: "Mặt khảm trai đá quý sang trọng."
        },
        {
          id: "epos-7",
          code: "E-8002.702.20.25.15",
          name: "Epos Swiss E-8002.702.20.25.15 - Nữ - Pin - Size 21 mm x 24.5",
          category: "dong-ho",
          brand: "Epos Swiss",
          origin: "Thuỵ Sỹ",
          target: "Nữ",
          price: 19000000,
          discountPrice: 15200000,
          image: "/images/e (7).jpg",
          description: "Bản vuông tinh xảo sang quyến quý phái"
        },
        {
          id: "epos-8",
          code: "E-3426.132.20.86.16",
          name: "Epos Swiss E-3426.132.20.86.16 - Nam - Automatic - Size 32 mm",
          category: "dong-ho",
          brand: "Epos Swiss",
          origin: "Thuỵ Sỹ",
          target: "Nam",
          price: 44500000,
          discountPrice: 35600000,
          image: "/images/e (8).jpg",
          description: "Hào hoa nam tính thanh lịch quý phái"
        },
        {
          id: "epos-9",
          code: "E-3439.322.20.18.25",
          name: "Epos Swiss E-3439.322.20.18.25 - Nam - Automatic - Size 41.7 mm",
          category: "dong-ho",
          brand: "Epos Swiss",
          origin: "Thuỵ Sỹ",
          target: "Nam",
          price: 83875000,
          discountPrice: 67100000,
          image: "/images/e (9).jpg",
          description: "Vương uy chất ròng Thụy Sỹ."
        },
        {
          id: "epos-10",
          code: "E-3426.132.22.20.32",
          name: "Epos Swiss E-3426.132.22.20.32 +E - Nữ - Automatic - Size 41 mm",
          category: "dong-ho",
          brand: "Epos Swiss",
          origin: "Thuỵ Sỹ",
          target: "Nữ",
          price: 90875000,
          discountPrice: 72700000,
          image: "/images/e (10).jpg",
          description: "Kính vạn hoa sắc vàng lấp lánh."
        },
        {
          id: "epos-11",
          code: "E-3430.172.24.12.30",
          name: "Epos Swiss E-3430.172.24.12.30 - Nữ - Automatic - Size 30 mm",
          category: "dong-ho",
          brand: "Epos Swiss",
          origin: "Thuỵ Sỹ",
          target: "Nữ",
          price: 35400000,
          discountPrice: 28320000,
          image: "/images/e (11).jpg",
          description: "Thiết kế nhỏ gọn thanh lịch cho quý cô hiện đại."
        },
        {
          id: "epos-12",
          code: "E-3445.182.20.20.35",
          name: "Epos Swiss E-3445.182.20.20.35 - Nam - Automatic - Size 42 mm",
          category: "dong-ho",
          brand: "Epos Swiss",
          origin: "Thuỵ Sỹ",
          target: "Nam",
          price: 48250000,
          discountPrice: 38600000,
          image: "/images/e (12).jpg",
          description: "Phong cách thể thao mạnh mẽ với mặt số xanh dương."
        }
      ];
    }
    
    else if (normalized.includes("jacques")) {
      list = [
        {
          id: "jl-1",
          code: "JL-1-1542P",
          name: "Jacques Lemans JL-1-1542P - Nam",
          category: "dong-ho",
          brand: "Jacques Lemans",
          origin: "Áo",
          target: "Nam",
          price: 5720000,
          discountPrice: 4576000,
          image: "/images/5 (1).jpg",
          description: "Sản phẩm Jacques Lemans 1"
        },
        {
          id: "jl-2",
          code: "JL-1-1654K",
          name: "Jacques Lemans JL-1-1654K - Nam",
          category: "dong-ho",
          brand: "Jacques Lemans",
          origin: "Áo",
          target: "Nam",
          price: 6350000,
          discountPrice: 5080000,
          image: "/images/5 (2).jpg",
          description: "Sản phẩm Jacques Lemans 2"
        },
        {
          id: "jl-3",
          code: "JL-1-1864D",
          name: "Jacques Lemans JL-1-1864D - Nữ",
          category: "dong-ho",
          brand: "Jacques Lemans",
          origin: "Áo",
          target: "Nữ",
          price: 8670000,
          discountPrice: 6936000,
          image: "/images/5 (3).jpg",
          description: "Sản phẩm Jacques Lemans 3"
        },
        {
          id: "jl-4",
          code: "JL-1-2125D",
          name: "Jacques Lemans JL-1-2125D - Nam",
          category: "dong-ho",
          brand: "Jacques Lemans",
          origin: "Áo",
          target: "Nam",
          price: 5190000,
          discountPrice: 4152000,
          image: "/images/5 (4).jpg",
          description: "Sản phẩm Jacques Lemans 4"
        },
        {
          id: "jl-5",
          code: "JL-1-3001",
          name: "Jacques Lemans JL-1-3001 - Nam",
          category: "dong-ho",
          brand: "Jacques Lemans",
          origin: "Áo",
          target: "Nam",
          price: 5980000,
          discountPrice: 4784000,
          image: "/images/5 (5).jpg",
          description: "Sản phẩm Jacques Lemans 5"
        },
        {
          id: "jl-6",
          code: "JL-1-3002",
          name: "Jacques Lemans JL-1-3002 - Nữ",
          category: "dong-ho",
          brand: "Jacques Lemans",
          origin: "Áo",
          target: "Nữ",
          price: 4590000,
          discountPrice: 3672000,
          image: "/images/5 (6).jpg",
          description: "Sản phẩm Jacques Lemans 6"
        }
      ];
    }

    else if (normalized.includes("aries")) {
      list = [
        {
          id: "ag-1",
          code: "AG-6-1",
          name: "Aries Gold - Mẫu 1",
          category: "dong-ho",
          brand: "Aries Gold",
          origin: "Singapore",
          target: "Nam",
          price: 6020000,
          discountPrice: 4816000,
          image: "/images/6 (1).jpg",
          description: "Aries Gold - Ảnh 1"
        },
        {
          id: "ag-2",
          code: "AG-6-2",
          name: "Aries Gold - Mẫu 2",
          category: "dong-ho",
          brand: "Aries Gold",
          origin: "Singapore",
          target: "Nam",
          price: 9280000,
          discountPrice: 7424000,
          image: "/images/6 (2).jpg",
          description: "Aries Gold - Ảnh 2"
        },
        {
          id: "ag-3",
          code: "AG-6-3",
          name: "Aries Gold - Mẫu 3",
          category: "dong-ho",
          brand: "Aries Gold",
          origin: "Singapore",
          target: "Nam",
          price: 5680000,
          discountPrice: 4544000,
          image: "/images/6 (3).jpg",
          description: "Aries Gold - Ảnh 3"
        },
        {
          id: "ag-4",
          code: "AG-6-4",
          name: "Aries Gold - Mẫu 4",
          category: "dong-ho",
          brand: "Aries Gold",
          origin: "Singapore",
          target: "Nữ",
          price: 6847500,
          discountPrice: 5478000,
          image: "/images/6 (4).jpg",
          description: "Aries Gold - Ảnh 4"
        },
        {
          id: "ag-5",
          code: "AG-6-5",
          name: "Aries Gold - Mẫu 5",
          category: "dong-ho",
          brand: "Aries Gold",
          origin: "Singapore",
          target: "Nữ",
          price: 4990000,
          discountPrice: 3992000,
          image: "/images/6 (5).jpg",
          description: "Aries Gold - Ảnh 5"
        },
        {
          id: "ag-6",
          code: "AG-6-6",
          name: "Aries Gold - Mẫu 6",
          category: "dong-ho",
          brand: "Aries Gold",
          origin: "Singapore",
          target: "Nam",
          price: 4590000,
          discountPrice: 3672000,
          image: "/images/6 (6).jpg",
          description: "Aries Gold - Ảnh 6"
        }
      ];
    }

    else if (normalized.includes("diamond")) {
      list = [
        {
          id: "dd-1",
          code: "DD-8-1",
          name: "Diamond D DD-8-1 - Nữ",
          category: "dong-ho",
          brand: "Diamond D",
          origin: "Áo",
          target: "Nữ",
          price: 5550000,
          discountPrice: 4440000,
          image: "/images/8 (1).jpg",
          description: "Diamond D - Ảnh 1"
        },
        {
          id: "dd-2",
          code: "DD-8-2",
          name: "Diamond D DD-8-2 - Nữ",
          category: "dong-ho",
          brand: "Diamond D",
          origin: "Áo",
          target: "Nữ",
          price: 4050000,
          discountPrice: 3240000,
          image: "/images/8 (2).jpg",
          description: "Diamond D - Ảnh 2"
        },
        {
          id: "dd-3",
          code: "DD-8-3",
          name: "Diamond D DD-8-3 - Nữ",
          category: "dong-ho",
          brand: "Diamond D",
          origin: "Áo",
          target: "Nữ",
          price: 5310000,
          discountPrice: 4248000,
          image: "/images/8 (3).jpg",
          description: "Diamond D - Ảnh 3"
        },
        {
          id: "dd-4",
          code: "DD-8-4",
          name: "Diamond D DD-8-4 - Nữ",
          category: "dong-ho",
          brand: "Diamond D",
          origin: "Áo",
          target: "Nữ",
          price: 6020000,
          discountPrice: 4816000,
          image: "/images/8 (4).jpg",
          description: "Diamond D - Ảnh 4"
        },
        {
          id: "dd-5",
          code: "DD-8-5",
          name: "Diamond D DD-8-5 - Nữ",
          category: "dong-ho",
          brand: "Diamond D",
          origin: "Áo",
          target: "Nữ",
          price: 4780000,
          discountPrice: 3824000,
          image: "/images/8 (5).jpg",
          description: "Diamond D - Ảnh 5"
        },
        {
          id: "dd-6",
          code: "DD-8-6",
          name: "Diamond D DD-8-6 - Nữ",
          category: "dong-ho",
          brand: "Diamond D",
          origin: "Áo",
          target: "Nữ",
          price: 5190000,
          discountPrice: 4152000,
          image: "/images/8 (6).jpg",
          description: "Diamond D - Ảnh 6"
        }
      ];
    }

    else if (normalized.includes("philippe")) {
      list = [
        {
          id: "pa-1",
          code: "PA8602-1",
          name: "Philippe Auguste PA8602-1 - Nam - Pin - Size 42 mm",
          category: "dong-ho",
          brand: "Philippe Auguste",
          origin: "Pháp",
          target: "Nam",
          price: 33400000,
          discountPrice: 26720000,
          image: "/images/9 (1).jpg",
          description: "Lịch thiệp vương giả Pháp."
        },
        {
          id: "pa-2",
          code: "PA8602-2",
          name: "Philippe Auguste PA8602-2 - Nam - Automatic - Size 35 mm",
          category: "dong-ho",
          brand: "Philippe Auguste",
          origin: "Pháp",
          target: "Nam",
          price: 33400000,
          discountPrice: 26720000,
          image: "/images/9 (2).jpg",
          description: "Lớp vỏ tinh anh thép 316L cao cấp nhất."
        },
        {
          id: "pa-3",
          code: "PA6003S",
          name: "Philippe Auguste PA6003S - Nam - Automatic - Size 41 mm",
          category: "dong-ho",
          brand: "Philippe Auguste",
          origin: "Pháp",
          target: "Nam",
          price: 10750000,
          discountPrice: 8600000,
          image: "/images/9 (3).jpg",
          description: "Huyền tích Paris cổ kính."
        },
        {
          id: "pa-4",
          code: "PA9004",
          name: "Philippe Auguste PA9004 - Nam - Pin - Size 40 mm",
          category: "dong-ho",
          brand: "Philippe Auguste",
          origin: "Pháp",
          target: "Nam",
          price: 12800000,
          discountPrice: 10240000,
          image: "/images/9 (4).jpg",
          description: "Phong cách Pháp thanh lịch."
        },
        {
          id: "pa-5",
          code: "PA9005",
          name: "Philippe Auguste PA9005 - Nam - Automatic - Size 41 mm",
          category: "dong-ho",
          brand: "Philippe Auguste",
          origin: "Pháp",
          target: "Nam",
          price: 15600000,
          discountPrice: 12480000,
          image: "/images/9 (5).jpg",
          description: "Thiết kế cổ điển cao cấp."
        },
        {
          id: "pa-6",
          code: "PA9006",
          name: "Philippe Auguste PA9006 - Nam - Pin - Size 42 mm",
          category: "dong-ho",
          brand: "Philippe Auguste",
          origin: "Pháp",
          target: "Nam",
          price: 13900000,
          discountPrice: 11120000,
          image: "/images/9 (6).jpg",
          description: "Tinh thần Paris hiện đại."
        }
      ];
    }

    else if (normalized.includes("atlantic")) {
      list = [
        {
          id: "at-1",
          code: "AT-52851.45.25",
          name: "Atlantic Swiss AT-52851.45.25 - Nữ - Automatic - Size 27mm",
          category: "dong-ho",
          brand: "Atlantic Swiss",
          origin: "Thụy Sỹ",
          target: "Nữ",
          price: 140000000,
          discountPrice: 112000000,
          image: "/images/kk (1).jpg",
          description: "Tuyệt đỉnh kim cương lộng lẫy xa hoa"
        },
        {
          id: "at-2",
          code: "AT-52851.44.25",
          name: "Atlantic Swiss AT-52851.44.25 - Nữ - Automatic - Size 31.5 mm",
          category: "dong-ho",
          brand: "Atlantic Swiss",
          origin: "Thụy Sỹ",
          target: "Nữ",
          price: 140000000,
          discountPrice: 112000000,
          image: "/images/kk (2).jpg",
          description: "Duy mỹ lộng lẫy và hoàn hảo."
        },
        {
          id: "at-3",
          code: "AT-64452.41.51R",
          name: "Atlantic Swiss AT-64452.41.51R - Nam - Automatic - Size 42 mm",
          category: "dong-ho",
          brand: "Atlantic Swiss",
          origin: "Thụy Sỹ",
          target: "Nam",
          price: 13980000,
          discountPrice: 11184000,
          image: "/images/kk (3).jpg",
          description: "Cơ cấu chống nước cực cao."
        },
        {
          id: "at-4",
          code: "AT-64452.42.51R",
          name: "Atlantic Swiss AT-64452.42.51R - Nam - Automatic - Size 42 mm",
          category: "dong-ho",
          brand: "Atlantic Swiss",
          origin: "Thụy Sỹ",
          target: "Nam",
          price: 15800000,
          discountPrice: 12640000,
          image: "/images/kk (4).jpg",
          description: "Chuẩn mực Thụy Sỹ lịch lãm."
        },
        {
          id: "at-5",
          code: "AT-60342.43.21",
          name: "Atlantic Swiss AT-60342.43.21 - Nam - Pin - Size 40 mm",
          category: "dong-ho",
          brand: "Atlantic Swiss",
          origin: "Thụy Sỹ",
          target: "Nam",
          price: 12600000,
          discountPrice: 10080000,
          image: "/images/kk (5).jpg",
          description: "Thanh lịch, bền bỉ và chính xác."
        },
        {
          id: "at-6",
          code: "AT-29038.41.11",
          name: "Atlantic Swiss AT-29038.41.11 - Nữ - Pin - Size 32 mm",
          category: "dong-ho",
          brand: "Atlantic Swiss",
          origin: "Thụy Sỹ",
          target: "Nữ",
          price: 11800000,
          discountPrice: 9440000,
          image: "/images/kk (6).jpg",
          description: "Dáng vẻ tinh tế cho phong cách hiện đại."
        }
      ];
    }

    else if (normalized.includes("citizen")) {
      list = [
        {
          id: "ct-1",
          code: "CT-EU6072-56D",
          name: "Citizen CT-EU6072-56D - Nữ - Pin - Size 27mm",
          category: "dong-ho",
          brand: "Citizen",
          origin: "Nhật Bản",
          target: "Nữ",
          price: 4200000,
          discountPrice: 3360000,
          image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=400",
          description: "Chuẩn xác tối cao từ Nhật Bản."
        },
        {
          id: "ct-2",
          code: "CT-NH8354-58A",
          name: "Citizen CT-NH8354-58A - Nam - Automatic - Size 40mm",
          category: "dong-ho",
          brand: "Citizen",
          origin: "Nhật Bản",
          target: "Nam",
          price: 7425000,
          discountPrice: 5940000,
          image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=400",
          description: "Hiện đại bền bỉ."
        },
        {
          id: "ct-3",
          code: "CT-EL3042-84A",
          name: "Citizen CT-EL3042-84A - Nữ - Pin - Size 37 mm",
          category: "dong-ho",
          brand: "Citizen",
          origin: "Nhật Bản",
          target: "Nữ",
          price: 4385000,
          discountPrice: 3508000,
          image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=400",
          description: "Thiết kế bền vững và thanh tao gót sọc."
        }
      ];
    }

    else if (normalized.includes("tsar")) {
      list = [
        {
          id: "tb-1",
          code: "TB8208A-16",
          name: "Tsar Bomba TB8208A-16 - Nam - Automatic - Size 42 mm",
          category: "dong-ho",
          brand: "Tsar Bomba",
          origin: "Hồng Kông",
          target: "Nam",
          price: 14000000,
          discountPrice: 11200000,
          image: "/images/t (1).jpg",
          description: "Dũng mãnh thể thao cá tính mạnh mẽ."
        },
        {
          id: "tb-2",
          code: "TB8209D-03",
          name: "Tsar Bomba TB8209D-03 - Nam - Automatic - Size 40mm",
          category: "dong-ho",
          brand: "Tsar Bomba",
          origin: "Hồng Kông",
          target: "Nam",
          price: 19250000,
          discountPrice: 15400000,
          image: "/images/t (2).jpg",
          description: "Kiểu dáng hầm hố hiện đại thể thao."
        },
        {
          id: "tb-3",
          code: "TB8209CF-04",
          name: "Tsar Bomba TB8209CF-04 - Nam - Automatic - Size 42 mm",
          category: "dong-ho",
          brand: "Tsar Bomba",
          origin: "Hồng Kông",
          target: "Nam",
          price: 17500000,
          discountPrice: 14000000,
          image: "/images/t (3).jpg",
          description: "Cơ khí siêu năng lực chống lực cực cao."
        },
        {
          id: "tb-4",
          code: "TB8210A-12",
          name: "Tsar Bomba TB8210A-12 - Nam - Automatic - Size 44 mm",
          category: "dong-ho",
          brand: "Tsar Bomba",
          origin: "Hồng Kông",
          target: "Nam",
          price: 16800000,
          discountPrice: 13440000,
          image: "/images/t (4).jpg",
          description: "Thiết kế cơ khí mạnh mẽ cho phong cách thể thao."
        },
        {
          id: "tb-5",
          code: "TB8211D-09",
          name: "Tsar Bomba TB8211D-09 - Nam - Automatic - Size 43 mm",
          category: "dong-ho",
          brand: "Tsar Bomba",
          origin: "Hồng Kông",
          target: "Nam",
          price: 18500000,
          discountPrice: 14800000,
          image: "/images/t (5).jpg",
          description: "Chi tiết hầm hố, hiện đại và bền bỉ."
        },
        {
          id: "tb-6",
          code: "TB8212CF-06",
          name: "Tsar Bomba TB8212CF-06 - Nam - Automatic - Size 42 mm",
          category: "dong-ho",
          brand: "Tsar Bomba",
          origin: "Hồng Kông",
          target: "Nam",
          price: 15900000,
          discountPrice: 12720000,
          image: "/images/t (6).jpg",
          description: "Mặt số cá tính, nổi bật và chuẩn xác."
        }
      ];
    }

    else {
      list = products.filter((p) => p.brand.toLowerCase().includes(normalized));
    }

    // Ensure every object perfectly matches the Product interface keys required by ProductCard
    return list.map((item, index) => ({
      brand: brandName,
      category: "dong-ho",
      description: item.description || "Đồng hồ Đăng Quang phân phối chính hãng.",
      discountPrice: item.discountPrice || Math.floor(item.price * 0.8),
      isLimited: typeof item.isLimited === 'boolean' ? item.isLimited : false,
      isFeatured: typeof item.isFeatured === 'boolean' ? item.isFeatured : index === 0,
      isNew: typeof item.isNew === 'boolean' ? item.isNew : index % 2 === 0,
      size: item.size || "40 mm",
      glassMaterial: typeof item.glassMaterial !== 'undefined' ? item.glassMaterial : "Kính Sapphire chống trầy xước",
      caseMaterial: typeof item.caseMaterial !== 'undefined' ? item.caseMaterial : "Thép không gỉ 316L",
      waterResistance: item.waterResistance || "5 ATM",
      code: item.code || `CODE-${index}`,
      origin: item.origin || "Thụy Sỹ",
      target: item.target || (index % 2 === 0 ? "Nam" : "Nữ"),
      image: item.image || "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=400",
      ...item
    }));
  };

  // Filter category products based on active brand subset filter
  const getFilteredBrandProducts = (brandName: string) => {
    const allBrandProducts = getProductsByBrand(brandName);
    const filterValue = brandFilters[brandName.toLowerCase()];
    if (!filterValue || filterValue === "all") return allBrandProducts;
    if (filterValue === "Nam" || filterValue === "Nữ") {
      const genderProducts = allBrandProducts.filter(p => p.target === filterValue);
      if (
        genderProducts.length === allBrandProducts.length &&
        ["diamond d", "philippe auguste"].includes(brandName.toLowerCase())
      ) {
        return [...genderProducts.slice(1), ...genderProducts.slice(0, 1)];
      }
      return genderProducts;
    }
    if (filterValue === "limited") return allBrandProducts.filter(p => p.isLimited || p.isFeatured);
    return allBrandProducts;
  };

  // Toggle active sub-filter for a brand
  const handleBrandFilterChange = (brandName: string, value: "all" | "Nam" | "Nữ" | "limited") => {
    setBrandFilters(prev => ({
      ...prev,
      [brandName.toLowerCase()]: value
    }));
    if (brandName.toLowerCase() === "jacques lemans") {
      setJacquesCarouselIndex(0);
      setJacquesCarouselDirection("next");
    }
    if (brandName.toLowerCase() === "aries gold") {
      setAriesCarouselIndex(0);
      setAriesCarouselDirection("next");
    }
    if (brandName.toLowerCase() === "diamond d") {
      setDiamondCarouselIndex(0);
      setDiamondCarouselDirection("next");
    }
    if (brandName.toLowerCase() === "philippe auguste") {
      setPhilippeCarouselIndex(0);
      setPhilippeCarouselDirection("next");
    }
    if (brandName.toLowerCase() === "atlantic swiss") {
      setAtlanticCarouselIndex(0);
      setAtlanticCarouselDirection("next");
    }
  };

  const getJacquesCarouselProducts = () => {
    const jacquesItems = getFilteredBrandProducts("Jacques Lemans");
    return [...jacquesItems.slice(1), ...jacquesItems, ...jacquesItems, ...jacquesItems].slice(0, 6);
  };

  const getJacquesVisibleProducts = () => {
    const carouselProducts = getJacquesCarouselProducts();
    if (carouselProducts.length === 0) return [];
    return Array.from({ length: Math.min(3, carouselProducts.length) }, (_, offset) => {
      return carouselProducts[(jacquesCarouselIndex + offset) % carouselProducts.length];
    });
  };

  const handleJacquesCarouselNext = () => {
    const carouselProducts = getJacquesCarouselProducts();
    if (carouselProducts.length === 0) return;
    setJacquesCarouselDirection("next");
    setJacquesCarouselIndex((prev) => (prev + 1) % carouselProducts.length);
  };

  const handleJacquesCarouselPrev = () => {
    const carouselProducts = getJacquesCarouselProducts();
    if (carouselProducts.length === 0) return;
    setJacquesCarouselDirection("prev");
    setJacquesCarouselIndex((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length);
  };

  const getAriesCarouselProducts = () => {
    const ariesItems = getFilteredBrandProducts("Aries Gold");
    return [...ariesItems.slice(1), ...ariesItems, ...ariesItems, ...ariesItems].slice(0, 6);
  };

  const getAriesVisibleProducts = () => {
    const carouselProducts = getAriesCarouselProducts();
    if (carouselProducts.length === 0) return [];
    return Array.from({ length: Math.min(3, carouselProducts.length) }, (_, offset) => {
      return carouselProducts[(ariesCarouselIndex + offset) % carouselProducts.length];
    });
  };

  const handleAriesCarouselNext = () => {
    const carouselProducts = getAriesCarouselProducts();
    if (carouselProducts.length === 0) return;
    setAriesCarouselDirection("next");
    setAriesCarouselIndex((prev) => (prev + 1) % carouselProducts.length);
  };

  const handleAriesCarouselPrev = () => {
    const carouselProducts = getAriesCarouselProducts();
    if (carouselProducts.length === 0) return;
    setAriesCarouselDirection("prev");
    setAriesCarouselIndex((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length);
  };

  const getDiamondCarouselProducts = () => {
    const diamondItems = getFilteredBrandProducts("Diamond D");
    return [...diamondItems.slice(1), ...diamondItems, ...diamondItems, ...diamondItems].slice(0, 6);
  };

  const getDiamondVisibleProducts = () => {
    const carouselProducts = getDiamondCarouselProducts();
    if (carouselProducts.length === 0) return [];
    return Array.from({ length: Math.min(3, carouselProducts.length) }, (_, offset) => {
      return carouselProducts[(diamondCarouselIndex + offset) % carouselProducts.length];
    });
  };

  const handleDiamondCarouselNext = () => {
    const carouselProducts = getDiamondCarouselProducts();
    if (carouselProducts.length === 0) return;
    setDiamondCarouselDirection("next");
    setDiamondCarouselIndex((prev) => (prev + 1) % carouselProducts.length);
  };

  const handleDiamondCarouselPrev = () => {
    const carouselProducts = getDiamondCarouselProducts();
    if (carouselProducts.length === 0) return;
    setDiamondCarouselDirection("prev");
    setDiamondCarouselIndex((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length);
  };

  const getPhilippeCarouselProducts = () => {
    const philippeItems = getFilteredBrandProducts("Philippe Auguste");
    return [...philippeItems.slice(1), ...philippeItems, ...philippeItems, ...philippeItems].slice(0, 6);
  };

  const getPhilippeVisibleProducts = () => {
    const carouselProducts = getPhilippeCarouselProducts();
    if (carouselProducts.length === 0) return [];
    return Array.from({ length: Math.min(3, carouselProducts.length) }, (_, offset) => {
      return carouselProducts[(philippeCarouselIndex + offset) % carouselProducts.length];
    });
  };

  const handlePhilippeCarouselNext = () => {
    const carouselProducts = getPhilippeCarouselProducts();
    if (carouselProducts.length === 0) return;
    setPhilippeCarouselDirection("next");
    setPhilippeCarouselIndex((prev) => (prev + 1) % carouselProducts.length);
  };

  const handlePhilippeCarouselPrev = () => {
    const carouselProducts = getPhilippeCarouselProducts();
    if (carouselProducts.length === 0) return;
    setPhilippeCarouselDirection("prev");
    setPhilippeCarouselIndex((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length);
  };

  const getAtlanticCarouselProducts = () => {
    const atlanticItems = getFilteredBrandProducts("Atlantic Swiss");
    return [...atlanticItems.slice(1), ...atlanticItems, ...atlanticItems, ...atlanticItems].slice(0, 6);
  };

  const getAtlanticVisibleProducts = () => {
    const carouselProducts = getAtlanticCarouselProducts();
    if (carouselProducts.length === 0) return [];
    return Array.from({ length: Math.min(3, carouselProducts.length) }, (_, offset) => {
      return carouselProducts[(atlanticCarouselIndex + offset) % carouselProducts.length];
    });
  };

  const handleAtlanticCarouselNext = () => {
    const carouselProducts = getAtlanticCarouselProducts();
    if (carouselProducts.length === 0) return;
    setAtlanticCarouselDirection("next");
    setAtlanticCarouselIndex((prev) => (prev + 1) % carouselProducts.length);
  };

  const handleAtlanticCarouselPrev = () => {
    const carouselProducts = getAtlanticCarouselProducts();
    if (carouselProducts.length === 0) return;
    setAtlanticCarouselDirection("prev");
    setAtlanticCarouselIndex((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length);
  };

  const getTsarCarouselProducts = () => {
    const tsarItems = getProductsByBrand("Tsar Bomba");
    return [...tsarItems.slice(1), ...tsarItems, ...tsarItems, ...tsarItems].slice(0, 6);
  };

  const getTsarVisibleProducts = () => {
    const carouselProducts = getTsarCarouselProducts();
    if (carouselProducts.length === 0) return [];
    return Array.from({ length: Math.min(3, carouselProducts.length) }, (_, offset) => {
      return carouselProducts[(tsarCarouselIndex + offset) % carouselProducts.length];
    });
  };

  const handleTsarCarouselNext = () => {
    const carouselProducts = getTsarCarouselProducts();
    if (carouselProducts.length === 0) return;
    setTsarCarouselDirection("next");
    setTsarCarouselIndex((prev) => (prev + 1) % carouselProducts.length);
  };

  const handleTsarCarouselPrev = () => {
    const carouselProducts = getTsarCarouselProducts();
    if (carouselProducts.length === 0) return;
    setTsarCarouselDirection("prev");
    setTsarCarouselIndex((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length);
  };

  // Get trending/featured watches for "XU HƯỚNG MUA SẮM" (return 15 items)
  const getTrendingWatches = () => {
    const list = [
      { id: "trend-1", code: "JL-1-1842.1D", name: "Jacques Lemans JL-1-1842.1D", category: "dong-ho", brand: "Jacques Lemans", origin: "Áo", target: "Nữ", price: 5190000, discountPrice: 4152000, image: "/images/3 (1).jpg", description: "Sang quý tao nhã." },
      { id: "trend-2", code: "JL-1-1842.1F", name: "Jacques Lemans JL-1-1842.1F", category: "dong-ho", brand: "Jacques Lemans", origin: "Áo", target: "Nữ", price: 3740000, discountPrice: 2992000, image: "/images/3 (2).jpg", description: "Điểm tuyệt đẹp rực rỡ." },
      { id: "trend-3", code: "ST-502.333X2", name: "Stuhrling Tourbillon ST-502.333X2", category: "dong-ho", brand: "Stuhrling", origin: "Thụy Sỹ", target: "Nam", price: 86000000, discountPrice: 68800000, image: "/images/g.jpg", description: "Cơ khí kì diệu tuyệt đỉnh giá trị." },
      { id: "trend-4", code: "AG-L9003 S-BKMOP", name: "Aries Gold AG-L9003 S-BKMOP", category: "dong-ho", brand: "Aries Gold", origin: "Singapore", target: "Nam", price: 7780000, discountPrice: 6224000, image: "/images/3 (4).jpg", description: "Náp vàng phượng hoàng lộng lẫy." },
      { id: "trend-5", code: "EP-1001", name: "Epos Swiss EP-1001", category: "dong-ho", brand: "Epos Swiss", origin: "Thụy Sỹ", target: "Nam", price: 45000000, discountPrice: 36000000, image: "/images/3 (5).jpg", description: "Mẫu Epos nổi bật." },
      { id: "trend-6", code: "CT-EL3042-84A", name: "Citizen CT-EL3042-84A", category: "dong-ho", brand: "Citizen", origin: "Nhật Bản", target: "Nữ", price: 4385000, discountPrice: 3508000, image: "/images/3 (6).jpg", description: "Thiết kế bền vững." },
      { id: "trend-7", code: "PA6003S", name: "Philippe Auguste PA6003S", category: "dong-ho", brand: "Philippe Auguste", origin: "Pháp", target: "Nam", price: 10750000, discountPrice: 8600000, image: "/images/3 (7).jpg", description: "Huyền tích Paris." },
      { id: "trend-8", code: "DD-1014", name: "Diamond D DM1014-2TG-01", category: "dong-ho", brand: "Diamond D", origin: "Áo", target: "Nữ", price: 5550000, discountPrice: 4440000, image: "/images/3 (1).jpg", description: "Chạm khắc nghệ thuật." },
      { id: "trend-9", code: "TB8208A-16", name: "Tsar Bomba TB8208A-16", category: "dong-ho", brand: "Tsar Bomba", origin: "Hồng Kông", target: "Nam", price: 14000000, discountPrice: 11200000, image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=400", description: "Dũng mãnh thể thao." },
      { id: "trend-10", code: "AG-G102", name: "Aries Gold AG-G102", category: "dong-ho", brand: "Aries Gold", origin: "Singapore", target: "Nam", price: 6020000, discountPrice: 4816000, image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=400", description: "Mẫu Aries nổi bật." },
      { id: "trend-11", code: "SE-100", name: "Seiko Modern SE-100", category: "dong-ho", brand: "Seiko", origin: "Nhật", target: "Nam", price: 6500000, discountPrice: 5200000, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400", description: "Seiko chất lượng." },
      { id: "trend-12", code: "OR-200", name: "Orient Classic OR-200", category: "dong-ho", brand: "Orient", origin: "Nhật", target: "Nữ", price: 4200000, discountPrice: 3360000, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400", description: "Orient thanh lịch." },
      { id: "trend-13", code: "QQ-01", name: "Q&Q Slim QQ-01", category: "dong-ho", brand: "Q&Q", origin: "Nhật", target: "Unisex", price: 1200000, discountPrice: 960000, image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=400", description: "Giá hợp lý." },
      { id: "trend-14", code: "BR-01", name: "Bruno Söhnle BR-01", category: "dong-ho", brand: "Bruno Sohnle", origin: "Đức", target: "Nam", price: 22000000, discountPrice: 17600000, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=400", description: "Đức tinh xảo." },
      { id: "trend-15", code: "SRW-01", name: "SRWatch SRW-01", category: "dong-ho", brand: "SRWatch", origin: "Anh", target: "Unisex", price: 3200000, discountPrice: 2560000, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=400", description: "Thiết kế trẻ trung." }
    ];

    return list.map((item, index) => ({
      ...item,
      category: item.category || "dong-ho",
      description: item.description || "Sản phẩm hot tại Đăng Quang.",
      discountPrice: item.discountPrice || Math.floor((item.price || 0) * 0.85),
      isLimited: (item as any).isLimited || false,
      isFeatured: (item as any).isFeatured || index === 0,
      isNew: (item as any).isNew || index % 2 === 0,
      size: (item as any).size || "40 mm",
      glassMaterial: (item as any).glassMaterial || "Kính Sapphire chống trầy xước",
      caseMaterial: (item as any).caseMaterial || "Thép không gỉ 316L",
      waterResistance: (item as any).waterResistance || "5 ATM",
    }));
  };

  // Trending carousel helpers (mirror Jacques carousel behavior)
  const getTrendingCarouselProducts = () => {
    const items = getTrendingWatches();
    return [...items.slice(1), ...items, ...items].slice(0, 7);
  };

  const getTrendingVisibleProducts = () => {
    const carouselProducts = getTrendingCarouselProducts();
    if (carouselProducts.length === 0) return [];
    return Array.from({ length: Math.min(4, carouselProducts.length) }, (_, offset) => {
      return carouselProducts[(trendingCarouselIndex + offset) % carouselProducts.length];
    });
  };

  const handleTrendingNext = () => {
    const carouselProducts = getTrendingCarouselProducts();
    if (carouselProducts.length === 0) return;
    setTrendingCarouselDirection("next");
    setTrendingCarouselIndex((prev) => (prev + 1) % carouselProducts.length);
  };

  const handleTrendingPrev = () => {
    const carouselProducts = getTrendingCarouselProducts();
    if (carouselProducts.length === 0) return;
    setTrendingCarouselDirection("prev");
    setTrendingCarouselIndex((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length);
  };

  // Get eyewear products
  const getEyewearProducts = () => {
    const eyewear = products.filter((p) => p.category === "kinh-mat");
    if (eyewear.length >= 4) return eyewear.slice(0, 4);
    
    // Add realistic mock items to fill layout if needed
    const list = [...eyewear];
    const images = [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1511599767150-a48a237f0083?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400"
    ];
    let i = list.length;
    while (list.length < 4) {
      list.push({
        id: `synth-eye-${i}`,
        code: `EYE-0${i}`,
        name: `Kính mắt thời trang cao cấp Italia Exclusive Polarized`,
        category: "kinh-mat",
        brand: i % 2 === 0 ? "Burberry" : "Ray-Ban",
        origin: "Ý",
        target: "Unisex",
        price: 6800000,
        discountPrice: 5440000,
        image: images[i % images.length],
        isFeatured: true,
        isNew: true,
        isLimited: false,
        description: "Kính mát phân cực cao cấp chống hoàn toàn 100% tia UV, nâng tầm phong thái thời thượng."
      });
      i++;
    }
    return list.slice(0, 4);
  };

  return (
    <div className="w-full bg-[#fcfcfc] pb-16">
      {/* 1. Main Hero Slider and Guarantees */}
      <HomeHero />

      {/* 2. Brand catalogs scroll bar */}
      <div className="my-6">
        <BrandBar />
      </div>

      {/* =========================================
                     MODULAR SECTIONS
         ========================================= */}

      {/* SECTION 1: XU HƯỚNG MUA SẮM */}
      <section id="section-nam-nu-trend" className="max-w-7xl mx-auto px-3 sm:px-4 mb-10 md:mb-[60px]">
        <div className="bg-[#ffa500] p-4 sm:p-6 border-0 relative">
          {/* Header inside orange block */}
          <div className="text-center mb-6 relative">
            <h2 className="text-xl md:text-2xl font-black uppercase text-white tracking-widest font-sans inline-block bg-[#ffa500] px-6 relative z-10">
              XU HƯỚNG MUA SẮM
            </h2>
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/40 z-0"></div>
          </div>

          {/* Product slider container (7-item carousel, 4 visible) */}
          <div className="relative">
            {/* Carousel navigation controls overlaying of cards */}
            <button onClick={handleTrendingPrev} type="button" className="absolute left-0 top-1/2 -translate-y-1/2 bg-neutral-900/40 hover:bg-neutral-900/70 text-white w-10 h-16 transition-all z-20 cursor-pointer flex items-center justify-center select-none">
              <span className="text-lg font-bold font-mono">‹</span>
            </button>
            <button onClick={handleTrendingNext} type="button" className="absolute right-0 top-1/2 -translate-y-1/2 bg-neutral-900/40 hover:bg-neutral-900/70 text-white w-10 h-16 transition-all z-20 cursor-pointer flex items-center justify-center select-none">
              <span className="text-lg font-bold font-mono">›</span>
            </button>

            {isLoading ? (
              <div className="text-center py-12 bg-white">
                <span className="text-neutral-500 font-semibold animate-pulse">Đang tải sản phẩm hot...</span>
              </div>
            ) : (
              <div className="px-2 sm:px-6">
                <style>{`
                  @keyframes trendingSlideNext { from { opacity: .35; transform: translateX(22px); } to { opacity: 1; transform: translateX(0); } }
                  @keyframes trendingSlidePrev { from { opacity: .35; transform: translateX(-22px); } to { opacity: 1; transform: translateX(0); } }
                  .trendingCarouselNext { animation: trendingSlideNext 300ms ease both; }
                  .trendingCarouselPrev { animation: trendingSlidePrev 300ms ease both; }
                `}</style>

                <div key={trendingCarouselIndex} className={`grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 ${trendingCarouselDirection === "next" ? "trendingCarouselNext" : "trendingCarouselPrev"}`}>
                  {getTrendingVisibleProducts().map((prod) => (
                    <ProductCard key={`${prod.id}-trend-${trendingCarouselIndex}`} product={prod} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: BRAND LOGOS CONTAINER (THƯƠNG HIỆU) */}
      <section className="hidden">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-black uppercase text-neutral-900 tracking-wider font-sans">
            Thương hiệu nổi bật
          </h2>
          <div className="w-24 h-[3px] bg-[#FFD700] mx-auto mt-2"></div>
          <p className="text-xs text-neutral-500 mt-3 italic max-w-2xl mx-auto font-sans leading-relaxed">
            Đăng Quang Watch phân phối độc quyền đồng hồ đeo tay Nam Nữ của các thương hiệu nổi tiếng thế giới từ Thuỵ Sỹ, Nhật Bản, Anh, Áo, Đức...
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 select-none">
          {[
            "Atlantic", "Epos Swiss", "Jacques Lemans", "Aries Gold", "Diamond D", "Philippe Auguste", "Citizen",
            "Tsar Bomba", "Casio", "SRWatch", "Seiko", "Orient", "Q&Q", "Bruno Sohnle"
          ].map((brand) => (
            <div
              key={brand}
              onClick={() => {
                const element = document.getElementById(`section-${brand.toLowerCase().replace(" ", "-")}`);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="border border-[#eeeeee] p-3 flex items-center justify-center text-center font-black text-neutral-700 hover:text-[#A52A2A] hover:border-[#FFD700] transition-colors cursor-pointer text-[10px] h-14 bg-[#fafafa]"
            >
              {brand.toUpperCase()}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: ĐỒNG HỒ EPOS SWISS */}
      <section id="section-epos-swiss" className="max-w-7xl mx-auto px-3 sm:px-4 mb-10 md:mb-[60px]">
        <div className="text-center mb-8 relative">
          <h2 className="text-xl md:text-2xl font-black uppercase text-neutral-900 tracking-widest font-sans inline-block bg-[#fcfcfc] px-6 relative z-10">
            Đồng hồ Epos Swiss
          </h2>
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#FFD700] z-0"></div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-[30px] lg:grid-cols-4">
          {getProductsByBrand("Epos Swiss").map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* SECTION 4: JACQUES LEMANS (WITH SUB-FILTERS) */}
      <section id="section-jacques-lemans" className="jacquesSection max-w-[1320px] mx-auto px-3 sm:px-4 md:px-6 py-5 md:py-8 mb-9 md:mb-[50px] bg-gradient-to-br from-[#f7f4ef] via-[#f5f3ef] to-[#ece9e2]">
        <div className="jacquesHeader flex flex-col lg:flex-row lg:items-center gap-5 mb-6">
          <div className="shrink-0">
            <h2 className="text-[22px] md:text-[36px] font-black uppercase text-[#050505] tracking-wide font-sans whitespace-normal md:whitespace-nowrap leading-none">
              Jacques Lemans
            </h2>
            <p className="mt-3 text-[11px] md:text-xs font-bold uppercase tracking-[0.24em] text-[#9b7a2c]">
              Bộ sưu tập đồng hồ Áo cao cấp
            </p>
          </div>
          <div className="hidden lg:block h-px bg-[#d6a11f] flex-1 relative">
            <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#d6a11f]"></span>
          </div>

          {/* Interactive sub-filters */}
          <div className="flex justify-start lg:justify-end gap-2 flex-wrap">
            <button
              onClick={() => handleBrandFilterChange("Jacques Lemans", "all")}
              className={`h-[42px] px-5 text-[10px] font-black border rounded-[3px] cursor-pointer tracking-[0.08em] uppercase transition-all duration-300 ${
                brandFilters["jacques lemans"] === "all"
                  ? "bg-[#f5c400] text-[#050505] border-[#f5c400] shadow-[0_10px_22px_rgba(214,161,31,0.24)]"
                  : "bg-white/80 text-[#111111] border-[#e3ded3] hover:bg-[#fff4bf] hover:border-[#f5c400]"
              }`}
            >
              Jacques Lemans
            </button>
            <button
              onClick={() => handleBrandFilterChange("Jacques Lemans", "limited")}
              className={`h-[42px] px-5 text-[10px] font-black border rounded-[3px] cursor-pointer tracking-[0.08em] uppercase transition-all duration-300 ${
                brandFilters["jacques lemans"] === "limited"
                  ? "bg-[#f5c400] text-[#050505] border-[#f5c400] shadow-[0_10px_22px_rgba(214,161,31,0.24)]"
                  : "bg-white/80 text-[#111111] border-[#e3ded3] hover:bg-[#fff4bf] hover:border-[#f5c400]"
              }`}
            >
              Phiên bản giới hạn
            </button>
          </div>
        </div>

        <div className="jacquesGrid grid grid-cols-1 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-4">
          <Link to="/shop?brand=Jacques%20Lemans" className="jacquesBanner relative block h-[300px] sm:h-[420px] lg:h-[650px] overflow-hidden rounded-[6px] bg-[#050505] group/banner shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
            <img
              src="/images/5.jpg"
              alt="Jacques Lemans"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover/banner:scale-[1.04]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.12),transparent_32%),linear-gradient(to_top,rgba(0,0,0,0.95),rgba(0,0,0,0.56)_45%,rgba(0,0,0,0.18))] transition-opacity duration-300 group-hover/banner:opacity-95"></div>
            <div className="absolute -right-8 bottom-12 text-[210px] font-black text-white/[0.035] leading-none select-none">JL</div>
            <div className="absolute left-6 right-6 bottom-7 text-white transition-transform duration-300 ease-out group-hover/banner:-translate-y-1">
              <span className="inline-block bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-3 py-1.5 rounded-[2px] mb-4 tracking-[0.12em]">
                Thương hiệu
              </span>
              <h3 className="text-[31px] md:text-[52px] font-serif uppercase leading-[0.95] tracking-tight">Jacques Lemans</h3>
              <p className="text-[13px] font-black text-[#f5c400] uppercase tracking-[0.34em] mt-4">Đồng hồ Áo</p>
              <div className="w-8 h-px bg-[#f5c400] mt-4"></div>
              <p className="text-sm text-white/86 font-medium mt-4 max-w-[330px] leading-relaxed">
                Thiết kế mạnh mẽ, lịch lãm và chuẩn xác cho phong cách của người đàn ông hiện đại.
              </p>
              <span className="inline-flex items-center gap-3 mt-6 border border-[#f5c400] text-[#f5c400] group-hover/banner:bg-[#f5c400] group-hover/banner:text-[#050505] px-5 py-3 text-[11px] font-black uppercase tracking-[0.12em] transition-colors duration-300">
                Khám phá bộ sưu tập <span className="transition-transform duration-300 group-hover/banner:translate-x-1">→</span>
              </span>
            </div>
          </Link>

          <div className="grid grid-cols-1 gap-4">
            {getFilteredBrandProducts("Jacques Lemans").slice(0, 1).map((prod) => {
              const discountPercent = prod.discountPrice
                ? Math.round(((prod.price - prod.discountPrice) / prod.price) * 100)
                : 0;

              return (
                <Link
                  key={prod.id}
                  to={`/product/${prod.id}`}
                  className="jacquesFeatured group/featured relative min-h-[250px] sm:min-h-[320px] lg:h-[312px] overflow-hidden rounded-[6px] bg-[#050505] shadow-[0_18px_42px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_58px_rgba(0,0,0,0.22)]"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="absolute inset-0 h-full w-full object-cover object-[74%_50%] opacity-100 brightness-110 contrast-125 saturate-110 transition-transform duration-300 group-hover/featured:scale-[1.035]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.88)_34%,rgba(0,0,0,0.38)_56%,rgba(0,0,0,0.06)_78%,rgba(0,0,0,0.18)_100%)] transition-opacity duration-300 group-hover/featured:opacity-95"></div>
                  <div className="absolute inset-y-0 right-0 w-[58%] bg-[radial-gradient(circle_at_54%_48%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.07)_25%,transparent_52%)]"></div>
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/58 to-transparent"></div>
                  <div className="relative z-10 flex h-full max-w-[70%] min-w-0 flex-col justify-center p-4 sm:max-w-[45%] sm:min-w-[225px] md:p-7 text-white">
                    {discountPercent > 0 && (
                      <span className="mb-6 inline-block w-fit bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-3 py-1.5 rounded-[2px] tracking-wide">
                        Giảm -{discountPercent}%
                      </span>
                    )}
                    <div className="flex items-center justify-between gap-6 text-[9px] uppercase tracking-[0.14em] text-white/72 font-mono">
                      <span>Jacques Lemans</span>
                      <span>{prod.code}</span>
                    </div>
                    <h3 className="mt-4 max-w-[250px] text-[21px] md:text-[24px] font-black leading-[1.22] tracking-normal text-white font-sans">
                      Đồng hồ cơ cao cấp
                    </h3>
                    <div className="w-7 h-px bg-[#f5c400] mt-4"></div>
                    <div className="jacquesPrice mt-6 flex items-end gap-3">
                      {prod.discountPrice ? (
                        <>
                          <span className="text-sm line-through text-white/55 font-mono">
                            {prod.price.toLocaleString("vi-VN")} ₫
                          </span>
                          <span className="text-[20px] font-black text-[#ff1f1f] font-mono leading-none">
                            {prod.discountPrice.toLocaleString("vi-VN")} ₫
                          </span>
                        </>
                      ) : (
                        <span className="text-[20px] font-black text-[#ff1f1f] font-mono leading-none">
                          {prod.price.toLocaleString("vi-VN")} ₫
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}

            <div className="relative">
              <style>{`
                @keyframes jacquesSlideNext {
                  from { opacity: .35; transform: translateX(22px); }
                  to { opacity: 1; transform: translateX(0); }
                }
                @keyframes jacquesSlidePrev {
                  from { opacity: .35; transform: translateX(-22px); }
                  to { opacity: 1; transform: translateX(0); }
                }
                .jacquesCarouselNext { animation: jacquesSlideNext 300ms ease both; }
                .jacquesCarouselPrev { animation: jacquesSlidePrev 300ms ease both; }
              `}</style>
              <button
                type="button"
                onClick={handleJacquesCarouselPrev}
                className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-[#f5c400] hover:text-[#050505] xl:flex"
                aria-label="Xem sản phẩm trước"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleJacquesCarouselNext}
                className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-[#f5c400] hover:text-[#050505]"
                aria-label="Xem thêm sản phẩm"
              >
                ›
              </button>

              <div
                key={jacquesCarouselIndex}
                className={`grid grid-cols-1 gap-4 pb-1 sm:grid-cols-2 xl:grid-cols-3 ${
                  jacquesCarouselDirection === "next" ? "jacquesCarouselNext" : "jacquesCarouselPrev"
                }`}
              >
                {getJacquesVisibleProducts().map((prod, index) => {
                    const discountPercent = prod.discountPrice
                      ? Math.round(((prod.price - prod.discountPrice) / prod.price) * 100)
                      : 0;

                    return (
                      <div
                        key={`${prod.id}-jacques-visible-${jacquesCarouselIndex}-${index}`}
                        className={`jacquesCard group/card relative h-[320px] overflow-hidden rounded-[6px] bg-[#050505] shadow-[0_14px_36px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_22px_52px_rgba(0,0,0,0.24)] ${
                          index === 1 ? "hidden sm:block" : index === 2 ? "hidden xl:block" : ""
                        }`}
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/34 to-transparent"></div>
                        {discountPercent > 0 && (
                          <span className="absolute top-4 left-4 z-10 bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-2.5 py-1 rounded-[2px] tracking-wide">
                            Giảm -{discountPercent}%
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(prod);
                          }}
                          className={`absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-xl leading-none shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white ${
                            isInWishlist(prod.id) ? "text-red-500" : "text-white hover:text-red-500"
                          }`}
                          title={isInWishlist(prod.id) ? "Xóa khỏi yêu thích" : "Yêu thích"}
                        >
                          {isInWishlist(prod.id) ? "♥" : "♡"}
                        </button>
                        <Link
                          to={`/product/${prod.id}`}
                          className="absolute inset-0 z-20"
                          aria-label={`Xem sản phẩm ${prod.name}`}
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 text-white">
                          <div className="text-[8.5px] uppercase tracking-[0.2em] text-white/62 font-mono">
                            Đồng hồ Áo
                          </div>
                          <div className="mt-2 block text-[17px] font-serif leading-tight text-white">
                            Jacques Lemans
                          </div>
                          <div className="jacquesPrice mt-4">
                            {prod.discountPrice ? (
                              <div className="flex flex-col gap-1">
                                <span className="text-xs line-through text-white/55 font-mono">
                                  {prod.price.toLocaleString("vi-VN")} ₫
                                </span>
                                <span className="text-[15px] font-black text-[#ff1f1f] font-mono leading-tight">
                                  {prod.discountPrice.toLocaleString("vi-VN")} ₫
                                </span>
                              </div>
                            ) : (
                              <span className="text-[15px] font-black text-[#ff1f1f] font-mono leading-none">
                                {prod.price.toLocaleString("vi-VN")} ₫
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ARIES GOLD (WITH SUB-FILTERS) */}
      <section id="section-aries-gold" className="ariesSection max-w-[1320px] mx-auto px-3 sm:px-4 md:px-6 py-5 md:py-8 mb-9 md:mb-[50px] bg-gradient-to-br from-[#f7f4ef] via-[#f5f3ef] to-[#ece9e2]">
        <div className="ariesHeader flex flex-col lg:flex-row lg:items-center gap-5 mb-6">
          <div className="shrink-0">
            <h2 className="text-[22px] md:text-[36px] font-black uppercase text-[#050505] tracking-wide font-sans whitespace-normal md:whitespace-nowrap leading-none">
              Aries Gold
            </h2>
            <p className="mt-3 text-[11px] md:text-xs font-bold uppercase tracking-[0.24em] text-[#9b7a2c]">
              Bộ sưu tập đồng hồ Singapore cao cấp
            </p>
          </div>
          <div className="hidden lg:block h-px bg-[#d6a11f] flex-1 relative">
            <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#d6a11f]"></span>
          </div>

          <div className="flex justify-start lg:justify-end gap-2 flex-wrap">
            <button
              onClick={() => handleBrandFilterChange("Aries Gold", "all")}
              className={`h-[42px] px-5 text-[10px] font-black border rounded-[3px] cursor-pointer tracking-[0.08em] uppercase transition-all duration-300 ${
                brandFilters["aries gold"] === "all"
                  ? "bg-[#f5c400] text-[#050505] border-[#f5c400] shadow-[0_10px_22px_rgba(214,161,31,0.24)]"
                  : "bg-white/80 text-[#111111] border-[#e3ded3] hover:bg-[#fff4bf] hover:border-[#f5c400]"
              }`}
            >
              Aries Gold
            </button>
            <button
              onClick={() => handleBrandFilterChange("Aries Gold", "Nam")}
              className={`h-[42px] px-5 text-[10px] font-black border rounded-[3px] cursor-pointer tracking-[0.08em] uppercase transition-all duration-300 ${
                brandFilters["aries gold"] === "Nam"
                  ? "bg-[#f5c400] text-[#050505] border-[#f5c400] shadow-[0_10px_22px_rgba(214,161,31,0.24)]"
                  : "bg-white/80 text-[#111111] border-[#e3ded3] hover:bg-[#fff4bf] hover:border-[#f5c400]"
              }`}
            >
              Đồng hồ nam
            </button>
            <button
              onClick={() => handleBrandFilterChange("Aries Gold", "Nữ")}
              className={`h-[42px] px-5 text-[10px] font-black border rounded-[3px] cursor-pointer tracking-[0.08em] uppercase transition-all duration-300 ${
                brandFilters["aries gold"] === "Nữ"
                  ? "bg-[#f5c400] text-[#050505] border-[#f5c400] shadow-[0_10px_22px_rgba(214,161,31,0.24)]"
                  : "bg-white/80 text-[#111111] border-[#e3ded3] hover:bg-[#fff4bf] hover:border-[#f5c400]"
              }`}
            >
              Đồng hồ nữ
            </button>
          </div>
        </div>

        {(() => {
          const ariesProducts = getFilteredBrandProducts("Aries Gold");
          const featured = ariesProducts[0];

          return (
            <div className="ariesGrid grid grid-cols-1 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-4">
              <Link to="/shop?brand=Aries%20Gold" className="ariesBanner relative block h-[300px] sm:h-[420px] lg:h-[650px] overflow-hidden rounded-[6px] bg-[#050505] group/banner shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
                <img
                  src="/images/7.jpg"
                  alt="Aries Gold"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover/banner:scale-[1.04]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.12),transparent_32%),linear-gradient(to_top,rgba(0,0,0,0.95),rgba(0,0,0,0.56)_45%,rgba(0,0,0,0.18))] transition-opacity duration-300 group-hover/banner:opacity-95"></div>
                <div className="absolute -right-8 bottom-12 text-[210px] font-black text-white/[0.035] leading-none select-none">AG</div>
                <div className="absolute left-6 right-6 bottom-7 text-white transition-transform duration-300 ease-out group-hover/banner:-translate-y-1">
                  <span className="inline-block bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-3 py-1.5 rounded-[2px] mb-4 tracking-[0.12em]">
                    Thương hiệu
                  </span>
                  <h3 className="text-[31px] md:text-[52px] font-serif uppercase leading-[0.95] tracking-tight">Aries Gold</h3>
                  <p className="text-[13px] font-black text-[#f5c400] uppercase tracking-[0.34em] mt-4">Đồng hồ Singapore</p>
                  <div className="w-8 h-px bg-[#f5c400] mt-4"></div>
                  <p className="text-sm text-white/86 font-medium mt-4 max-w-[330px] leading-relaxed">
                    Phong thái hiện đại, mạnh mẽ và chuẩn xác cho cổ tay doanh nhân.
                  </p>
                  <span className="inline-flex items-center gap-3 mt-6 border border-[#f5c400] text-[#f5c400] group-hover/banner:bg-[#f5c400] group-hover/banner:text-[#050505] px-5 py-3 text-[11px] font-black uppercase tracking-[0.12em] transition-colors duration-300">
                    Khám phá bộ sưu tập <span className="transition-transform duration-300 group-hover/banner:translate-x-1">→</span>
                  </span>
                </div>
              </Link>

              <div className="grid grid-cols-1 gap-4">
                {featured && (
                  <Link
                    to={`/product/${featured.id}`}
                    className="ariesFeatured group/featured relative min-h-[250px] sm:min-h-[320px] lg:h-[360px] overflow-hidden rounded-[8px] bg-[#120b0d] shadow-[0_18px_42px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_58px_rgba(0,0,0,0.22)]"
                  >
                    <img
                      src={featured.image}
                      alt={featured.name}
                      className="absolute inset-0 h-full w-full object-cover object-[52%_50%] opacity-100 brightness-110 contrast-115 saturate-105 transition-transform duration-300 group-hover/featured:scale-[1.035]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,11,13,0.98)_0%,rgba(18,11,13,0.86)_34%,rgba(18,11,13,0.28)_58%,rgba(255,238,222,0.04)_78%,rgba(18,11,13,0.12)_100%)] transition-opacity duration-300 group-hover/featured:opacity-95"></div>
                    <div className="absolute inset-y-0 right-0 w-[58%] bg-[radial-gradient(circle_at_55%_48%,rgba(255,232,210,0.28)_0%,rgba(255,232,210,0.12)_27%,transparent_55%)]"></div>
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#120b0d]/64 to-transparent"></div>
                    <div className="relative z-10 flex h-full max-w-[70%] min-w-0 flex-col justify-center p-4 sm:max-w-[45%] sm:min-w-[225px] md:p-7 text-white">
                      {featured.discountPrice && (
                        <span className="mb-6 inline-block w-fit bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-3 py-1.5 rounded-[2px] tracking-wide">
                          Giảm -{Math.round(((featured.price - featured.discountPrice) / featured.price) * 100)}%
                        </span>
                      )}
                      <div className="flex items-center justify-between gap-6 text-[9px] uppercase tracking-[0.14em] text-white/72 font-mono">
                        <span>Aries Gold</span>
                        <span>{featured.code}</span>
                      </div>
                      <h3 className="mt-4 max-w-[260px] text-[21px] md:text-[24px] font-black leading-[1.22] tracking-normal text-white font-sans">
                        Đồng hồ doanh nhân
                      </h3>
                      <div className="w-7 h-px bg-[#f5c400] mt-4"></div>
                      <div className="ariesPrice mt-6 flex items-end gap-3">
                        {featured.discountPrice ? (
                          <>
                            <span className="text-sm line-through text-white/55 font-mono">
                              {featured.price.toLocaleString("vi-VN")} ₫
                            </span>
                            <span className="text-[20px] font-black text-[#ff1f1f] font-mono leading-none">
                              {featured.discountPrice.toLocaleString("vi-VN")} ₫
                            </span>
                          </>
                        ) : (
                          <span className="text-[20px] font-black text-[#ff1f1f] font-mono leading-none">
                            {featured.price.toLocaleString("vi-VN")} ₫
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )}

                <div className="relative">
                  <style>{`
                    @keyframes ariesSlideNext {
                      from { opacity: .35; transform: translateX(22px); }
                      to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes ariesSlidePrev {
                      from { opacity: .35; transform: translateX(-22px); }
                      to { opacity: 1; transform: translateX(0); }
                    }
                    .ariesCarouselNext { animation: ariesSlideNext 300ms ease both; }
                    .ariesCarouselPrev { animation: ariesSlidePrev 300ms ease both; }
                  `}</style>
                  <button
                    type="button"
                    onClick={handleAriesCarouselPrev}
                    className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-[#f5c400] hover:text-[#050505] xl:flex"
                    aria-label="Xem sản phẩm trước"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleAriesCarouselNext}
                    className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-[#f5c400] hover:text-[#050505]"
                    aria-label="Xem thêm sản phẩm"
                  >
                    ›
                  </button>

                  <div
                    key={ariesCarouselIndex}
                    className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ${
                      ariesCarouselDirection === "next" ? "ariesCarouselNext" : "ariesCarouselPrev"
                    }`}
                  >
                  {getAriesVisibleProducts().map((prod, index) => {
                    const discountPercent = prod.discountPrice
                      ? Math.round(((prod.price - prod.discountPrice) / prod.price) * 100)
                      : 0;

                    return (
                      <div
                        key={`${prod.id}-aries-visible-${ariesCarouselIndex}-${index}`}
                        className={`ariesCard group/card relative h-[320px] overflow-hidden rounded-[6px] bg-[#050505] shadow-[0_14px_36px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_22px_52px_rgba(0,0,0,0.24)] ${
                          index === 1 ? "hidden sm:block" : index === 2 ? "hidden xl:block" : ""
                        }`}
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/34 to-transparent"></div>
                        {discountPercent > 0 && (
                          <span className="absolute top-4 left-4 z-10 bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-2.5 py-1 rounded-[2px] tracking-wide">
                            Giảm -{discountPercent}%
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(prod);
                          }}
                          className={`absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-xl leading-none shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white ${
                            isInWishlist(prod.id) ? "text-red-500" : "text-white hover:text-red-500"
                          }`}
                          title={isInWishlist(prod.id) ? "Xóa khỏi yêu thích" : "Yêu thích"}
                        >
                          {isInWishlist(prod.id) ? "♥" : "♡"}
                        </button>
                        <Link
                          to={`/product/${prod.id}`}
                          className="absolute inset-0 z-20"
                          aria-label={`Xem sản phẩm ${prod.name}`}
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 text-white">
                          <div className="text-[8.5px] uppercase tracking-[0.2em] text-white/62 font-mono">
                            Đồng hồ Singapore
                          </div>
                          <div className="mt-2 block text-[17px] font-serif leading-tight text-white">
                            Aries Gold
                          </div>
                          <div className="ariesPrice mt-4">
                            {prod.discountPrice ? (
                              <div className="flex flex-col gap-1">
                                <span className="text-xs line-through text-white/55 font-mono">
                                  {prod.price.toLocaleString("vi-VN")} ₫
                                </span>
                                <span className="text-[15px] font-black text-[#ff1f1f] font-mono leading-tight">
                                  {prod.discountPrice.toLocaleString("vi-VN")} ₫
                                </span>
                              </div>
                            ) : (
                              <span className="text-[15px] font-black text-[#ff1f1f] font-mono leading-none">
                                {prod.price.toLocaleString("vi-VN")} ₫
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* SECTION 6: DIAMOND D */}
      <section id="section-diamond-d" className="diamondSection max-w-[1320px] mx-auto px-3 sm:px-4 md:px-6 py-5 md:py-8 mb-9 md:mb-[50px] bg-gradient-to-br from-[#faf3e6] via-[#f4e2c8] to-[#e5cda9]">
        <div className="diamondHeader flex flex-col lg:flex-row lg:items-center gap-5 mb-6">
          <div className="shrink-0">
            <h2 className="text-[22px] md:text-[36px] font-black uppercase text-[#050505] tracking-wide font-sans whitespace-normal md:whitespace-nowrap leading-none">
              Diamond D
            </h2>
            <p className="mt-3 text-[11px] md:text-xs font-bold uppercase tracking-[0.24em] text-[#9b7a2c]">
              Bộ sưu tập đồng hồ nữ đính đá cao cấp
            </p>
          </div>
          <div className="hidden lg:block h-px bg-[#d6a11f] flex-1 relative">
            <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#d6a11f]"></span>
          </div>

          <div className="flex justify-start lg:justify-end gap-2 flex-wrap">
            <button
              onClick={() => handleBrandFilterChange("Diamond D", "all")}
              className={`h-[42px] px-5 text-[10px] font-black border rounded-[3px] cursor-pointer tracking-[0.08em] uppercase transition-all duration-300 ${
                brandFilters["diamond d"] === "all"
                  ? "bg-[#f5c400] text-[#050505] border-[#f5c400] shadow-[0_10px_22px_rgba(214,161,31,0.24)]"
                  : "bg-white/80 text-[#111111] border-[#e3ded3] hover:bg-[#fff4bf] hover:border-[#f5c400]"
              }`}
            >
              Diamond D
            </button>
            <button
              onClick={() => handleBrandFilterChange("Diamond D", "Nữ")}
              className={`h-[42px] px-5 text-[10px] font-black border rounded-[3px] cursor-pointer tracking-[0.08em] uppercase transition-all duration-300 ${
                brandFilters["diamond d"] === "Nữ"
                  ? "bg-[#f5c400] text-[#050505] border-[#f5c400] shadow-[0_10px_22px_rgba(214,161,31,0.24)]"
                  : "bg-white/80 text-[#111111] border-[#e3ded3] hover:bg-[#fff4bf] hover:border-[#f5c400]"
              }`}
            >
              Đồng hồ nữ
            </button>
          </div>
        </div>

        {(() => {
          const diamondProducts = getFilteredBrandProducts("Diamond D");
          const featured = diamondProducts[0];

          return (
            <div className="diamondGrid grid grid-cols-1 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-4">
              <Link to="/shop?brand=Diamond%20D" className="diamondBanner relative block h-[300px] sm:h-[420px] lg:h-[650px] overflow-hidden rounded-[6px] bg-[#1b1018] group/banner shadow-[0_24px_70px_rgba(214,161,31,0.28)]">
                <img
                  src="/images/8.jpg"
                  alt="Diamond D"
                  className="absolute inset-0 w-full h-full object-cover object-[52%_50%] transition-transform duration-300 ease-out group-hover/banner:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_16%,rgba(255,214,50,0.16),transparent_28%),linear-gradient(to_top,rgba(18,11,13,0.94),rgba(18,11,13,0.58)_46%,rgba(18,11,13,0.14))] transition-opacity duration-300 group-hover/banner:opacity-95"></div>
                <div className="absolute -right-8 bottom-12 text-[210px] font-black text-white/[0.04] leading-none select-none">DD</div>
                <div className="absolute left-6 right-6 bottom-7 text-white transition-transform duration-300 ease-out group-hover/banner:-translate-y-1">
                  <span className="inline-block bg-[#ffd12a] text-[#050505] text-[10px] font-black uppercase px-3 py-1.5 rounded-[2px] mb-4 tracking-[0.12em] shadow-[0_8px_18px_rgba(255,209,42,0.18)]">
                    Thương hiệu
                  </span>
                  <h3 className="text-[31px] md:text-[52px] font-serif uppercase leading-[0.95] tracking-tight">Diamond D</h3>
                  <p className="text-[13px] font-black text-[#f5c400] uppercase tracking-[0.34em] mt-4">Đồng hồ nữ đính đá</p>
                  <div className="w-8 h-px bg-[#f5c400] mt-4"></div>
                  <p className="text-sm text-white/86 font-medium mt-4 max-w-[330px] leading-relaxed">
                    Vẻ đẹp thanh lịch, tinh xảo và lấp lánh cho phong cách nữ tính hiện đại.
                  </p>
                  <span className="inline-flex items-center gap-3 mt-6 border border-[#f5c400] text-[#f5c400] group-hover/banner:bg-[#f5c400] group-hover/banner:text-[#050505] px-5 py-3 text-[11px] font-black uppercase tracking-[0.12em] transition-colors duration-300">
                    Xem bộ sưu tập <span className="transition-transform duration-300 group-hover/banner:translate-x-1">→</span>
                  </span>
                </div>
              </Link>

              <div className="grid grid-cols-1 gap-4">
                {featured && (
                  <Link
                    to={`/product/${featured.id}`}
                    className="diamondFeatured group/featured relative min-h-[250px] sm:min-h-[320px] lg:h-[312px] overflow-hidden rounded-[6px] bg-[#1b1018] shadow-[0_20px_52px_rgba(214,161,31,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(214,161,31,0.30)]"
                  >
                    <img
                      src={featured.image}
                      alt={featured.name}
                      className="absolute inset-0 h-full w-full object-cover object-[76%_50%] opacity-100 brightness-110 contrast-125 saturate-110 transition-transform duration-300 group-hover/featured:scale-[1.035]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,11,13,0.98)_0%,rgba(18,11,13,0.86)_34%,rgba(18,11,13,0.28)_58%,rgba(255,238,222,0.04)_78%,rgba(18,11,13,0.12)_100%)] transition-opacity duration-300 group-hover/featured:opacity-95"></div>
                    <div className="absolute inset-y-0 right-0 w-[58%] bg-[radial-gradient(circle_at_55%_48%,rgba(255,232,210,0.28)_0%,rgba(255,232,210,0.12)_27%,transparent_55%)]"></div>
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#120b0d]/64 to-transparent"></div>
                    <div className="relative z-10 flex h-full max-w-[70%] min-w-0 flex-col justify-center p-4 sm:max-w-[45%] sm:min-w-[225px] md:p-7 text-white">
                      {featured.discountPrice && (
                        <span className="mb-6 inline-block w-fit bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-3 py-1.5 rounded-[2px] tracking-wide">
                          Giảm -{Math.round(((featured.price - featured.discountPrice) / featured.price) * 100)}%
                        </span>
                      )}
                      <div className="flex items-center justify-between gap-6 text-[9px] uppercase tracking-[0.14em] text-white/72 font-mono">
                        <span>Diamond D</span>
                        <span>{featured.code}</span>
                      </div>
                      <h3 className="mt-4 max-w-[260px] text-[24px] md:text-[30px] font-black leading-[1.16] tracking-tight text-white font-sans">
                        Đồng hồ nữ đính đá
                      </h3>
                      <div className="w-10 h-px bg-[#ffd12a] mt-4"></div>
                      <div className="diamondPrice mt-6 flex items-end gap-4">
                        {featured.discountPrice ? (
                          <>
                            <span className="text-sm line-through text-white/65 font-mono">
                              {featured.price.toLocaleString("vi-VN")} ₫
                            </span>
                            <span className="text-[24px] md:text-[28px] font-black text-[#ffd12a] font-mono leading-none">
                              {featured.discountPrice.toLocaleString("vi-VN")} ₫
                            </span>
                          </>
                        ) : (
                          <span className="text-[20px] font-black text-[#ff1f1f] font-mono leading-none">
                            {featured.price.toLocaleString("vi-VN")} ₫
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )}

                <div className="relative">
                  <style>{`
                    @keyframes diamondSlideNext {
                      from { opacity: .35; transform: translateX(22px); }
                      to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes diamondSlidePrev {
                      from { opacity: .35; transform: translateX(-22px); }
                      to { opacity: 1; transform: translateX(0); }
                    }
                    .diamondCarouselNext { animation: diamondSlideNext 300ms ease both; }
                    .diamondCarouselPrev { animation: diamondSlidePrev 300ms ease both; }
                  `}</style>
                  <button
                    type="button"
                    onClick={handleDiamondCarouselPrev}
                    className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#120b0d]/70 text-white backdrop-blur-sm transition-all hover:bg-[#f5c400] hover:text-[#050505] xl:flex"
                    aria-label="Xem sản phẩm trước"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleDiamondCarouselNext}
                    className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#120b0d]/70 text-white backdrop-blur-sm transition-all hover:bg-[#f5c400] hover:text-[#050505]"
                    aria-label="Xem thêm sản phẩm"
                  >
                    ›
                  </button>

                  <div
                    key={diamondCarouselIndex}
                    className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ${
                      diamondCarouselDirection === "next" ? "diamondCarouselNext" : "diamondCarouselPrev"
                    }`}
                  >
                  {getDiamondVisibleProducts().map((prod, index) => {
                    const discountPercent = prod.discountPrice
                      ? Math.round(((prod.price - prod.discountPrice) / prod.price) * 100)
                      : 0;

                    return (
                      <div
                        key={`${prod.id}-diamond-visible-${diamondCarouselIndex}-${index}`}
                        className={`diamondCard group/card relative h-[320px] overflow-hidden rounded-[6px] bg-[#120b0d] shadow-[0_14px_36px_rgba(67,41,35,0.14)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_22px_52px_rgba(67,41,35,0.24)] ${
                          index === 1 ? "hidden sm:block" : index === 2 ? "hidden xl:block" : ""
                        }`}
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="absolute inset-0 h-full w-full object-cover brightness-105 contrast-110 saturate-105 transition-transform duration-300 group-hover/card:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(255,232,210,0.18),transparent_28%),linear-gradient(to_top,rgba(18,11,13,0.9),rgba(18,11,13,0.36),rgba(18,11,13,0.1))]"></div>
                        {discountPercent > 0 && (
                          <span className="absolute top-4 left-4 z-10 bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-2.5 py-1 rounded-[2px] tracking-wide">
                            Giảm -{discountPercent}%
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(prod);
                          }}
                          className={`absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[#120b0d]/62 text-xl leading-none shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white ${
                            isInWishlist(prod.id) ? "text-red-500" : "text-white hover:text-red-500"
                          }`}
                          title={isInWishlist(prod.id) ? "Xóa khỏi yêu thích" : "Yêu thích"}
                        >
                          {isInWishlist(prod.id) ? "♥" : "♡"}
                        </button>
                        <Link
                          to={`/product/${prod.id}`}
                          className="absolute inset-0 z-20"
                          aria-label={`Xem sản phẩm ${prod.name}`}
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 text-white">
                          <div className="text-[8.5px] uppercase tracking-[0.2em] text-white/64 font-mono">
                            Đồng hồ đính đá
                          </div>
                          <div className="mt-2 block text-[17px] font-serif leading-tight text-white">
                            Diamond D
                          </div>
                          <div className="diamondPrice mt-4">
                            {prod.discountPrice ? (
                              <div className="flex flex-col gap-1">
                                <span className="text-xs line-through text-white/55 font-mono">
                                  {prod.price.toLocaleString("vi-VN")} ₫
                                </span>
                                <span className="text-[15px] font-black text-[#ff1f1f] font-mono leading-tight">
                                  {prod.discountPrice.toLocaleString("vi-VN")} ₫
                                </span>
                              </div>
                            ) : (
                              <span className="text-[15px] font-black text-[#ff1f1f] font-mono leading-none">
                                {prod.price.toLocaleString("vi-VN")} ₫
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* SECTION 6: DIAMOND D */}
      <section id="section-diamond-d-legacy" className="hidden">
        <div className="text-center mb-6">
          <div className="relative mb-4">
            <h2 className="text-xl md:text-2xl font-black uppercase text-neutral-900 tracking-widest font-sans inline-block bg-[#fcfcfc] px-6 relative z-10">
              Diamond D
            </h2>
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#FFD700] z-0"></div>
          </div>

          {/* Interactive sub-filters */}
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => handleBrandFilterChange("Diamond D", "all")}
              className={`px-3 py-1.5 text-[10px] font-extrabold border rounded-none cursor-pointer tracking-wider transition-colors ${
                brandFilters["diamond d"] === "all"
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-600 border-[#eeeeee]"
              }`}
            >
              TẤT CẢ DIAMOND D
            </button>
            <button
              onClick={() => handleBrandFilterChange("Diamond D", "Nữ")}
              className={`px-3 py-1.5 text-[10px] font-extrabold border rounded-none cursor-pointer tracking-wider transition-colors ${
                brandFilters["diamond d"] === "Nữ"
                  ? "bg-[#A52A2A] text-white border-[#A52A2A]"
                  : "bg-white text-neutral-600 border-[#eeeeee]"
              }`}
            >
              ĐỒNG HỒ NỮ HÀNH
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-[30px] lg:grid-cols-4">
          {getFilteredBrandProducts("Diamond D").map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* SECTION 7: PHILIPPE AUGUSTE */}
      <section id="section-philippe-auguste" className="philippeSection max-w-[1320px] mx-auto px-3 sm:px-4 md:px-6 py-5 md:py-8 mb-9 md:mb-[50px] bg-gradient-to-br from-[#f7f4ef] via-[#f5f3ef] to-[#ece9e2]">
        <div className="philippeHeader flex flex-col lg:flex-row lg:items-center gap-5 mb-6">
          <div className="shrink-0">
            <h2 className="text-[22px] md:text-[36px] font-black uppercase text-[#050505] tracking-wide font-sans whitespace-normal md:whitespace-nowrap leading-none">
              Philippe Auguste
            </h2>
            <p className="mt-3 text-[11px] md:text-xs font-bold uppercase tracking-[0.24em] text-[#9b7a2c]">
              Bộ sưu tập đồng hồ Pháp cao cấp
            </p>
          </div>
          <div className="hidden lg:block h-px bg-[#d6a11f] flex-1 relative">
            <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#d6a11f]"></span>
          </div>

          <div className="flex justify-start lg:justify-end gap-2 flex-wrap">
            <button
              onClick={() => handleBrandFilterChange("Philippe Auguste", "all")}
              className={`h-[42px] px-5 text-[10px] font-black border rounded-[3px] cursor-pointer tracking-[0.08em] uppercase transition-all duration-300 ${
                brandFilters["philippe auguste"] === "all"
                  ? "bg-[#f5c400] text-[#050505] border-[#f5c400] shadow-[0_10px_22px_rgba(214,161,31,0.24)]"
                  : "bg-white/80 text-[#111111] border-[#e3ded3] hover:bg-[#fff4bf] hover:border-[#f5c400]"
              }`}
            >
              Philippe Auguste
            </button>
            <button
              onClick={() => handleBrandFilterChange("Philippe Auguste", "Nam")}
              className={`h-[42px] px-5 text-[10px] font-black border rounded-[3px] cursor-pointer tracking-[0.08em] uppercase transition-all duration-300 ${
                brandFilters["philippe auguste"] === "Nam"
                  ? "bg-[#f5c400] text-[#050505] border-[#f5c400] shadow-[0_10px_22px_rgba(214,161,31,0.24)]"
                  : "bg-white/80 text-[#111111] border-[#e3ded3] hover:bg-[#fff4bf] hover:border-[#f5c400]"
              }`}
            >
              Đồng hồ nam
            </button>
          </div>
        </div>

        {(() => {
          const philippeProducts = getFilteredBrandProducts("Philippe Auguste");
          const featured = philippeProducts[0];

          return (
            <div className="philippeGrid grid grid-cols-1 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-4">
              <Link to="/shop?brand=Philippe%20Auguste" className="philippeBanner relative block h-[300px] sm:h-[420px] lg:h-[650px] overflow-hidden rounded-[6px] bg-[#050505] group/banner shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
                <img
                  src="/images/999.jpg"
                  alt="Philippe Auguste"
                  className="absolute inset-0 w-full h-full object-cover object-[46%_50%] transition-transform duration-300 ease-out group-hover/banner:scale-[1.04]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_24%,rgba(245,196,0,0.13),transparent_30%),linear-gradient(to_top,rgba(0,0,0,0.95),rgba(0,0,0,0.58)_45%,rgba(0,0,0,0.16))] transition-opacity duration-300 group-hover/banner:opacity-95"></div>
                <div className="absolute -right-10 bottom-12 text-[190px] font-black text-white/[0.035] leading-none select-none">PA</div>
                <div className="absolute left-6 right-6 bottom-7 text-white transition-transform duration-300 ease-out group-hover/banner:-translate-y-1">
                  <span className="inline-block bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-3 py-1.5 rounded-[2px] mb-4 tracking-[0.12em]">
                    Thương hiệu
                  </span>
                  <h3 className="text-[30px] md:text-[50px] font-serif uppercase leading-[0.95] tracking-tight">Philippe Auguste</h3>
                  <p className="text-[13px] font-black text-[#f5c400] uppercase tracking-[0.34em] mt-4">Đồng hồ Pháp</p>
                  <div className="w-8 h-px bg-[#f5c400] mt-4"></div>
                  <p className="text-sm text-white/86 font-medium mt-4 max-w-[330px] leading-relaxed">
                    Phong thái cổ điển, lịch lãm và tinh tế cho người yêu chất Pháp.
                  </p>
                  <span className="inline-flex items-center gap-3 mt-6 border border-[#f5c400] text-[#f5c400] group-hover/banner:bg-[#f5c400] group-hover/banner:text-[#050505] px-5 py-3 text-[11px] font-black uppercase tracking-[0.12em] transition-colors duration-300">
                    Xem bộ sưu tập <span className="transition-transform duration-300 group-hover/banner:translate-x-1">→</span>
                  </span>
                </div>
              </Link>

              <div className="grid grid-cols-1 gap-4">
                {featured && (
                  <Link
                    to={`/product/${featured.id}`}
                    className="philippeFeatured group/featured relative min-h-[250px] sm:min-h-[320px] lg:h-[312px] overflow-hidden rounded-[6px] bg-[#050505] shadow-[0_18px_42px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_58px_rgba(0,0,0,0.22)]"
                  >
                    <img
                      src={featured.image}
                      alt={featured.name}
                      className="absolute inset-0 h-full w-full object-cover object-[70%_50%] opacity-100 brightness-110 contrast-120 saturate-105 transition-transform duration-300 group-hover/featured:scale-[1.035]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.97)_0%,rgba(0,0,0,0.86)_33%,rgba(0,0,0,0.36)_58%,rgba(0,0,0,0.08)_80%,rgba(0,0,0,0.18)_100%)] transition-opacity duration-300 group-hover/featured:opacity-95"></div>
                    <div className="absolute inset-y-0 right-0 w-[58%] bg-[radial-gradient(circle_at_58%_48%,rgba(245,196,0,0.17)_0%,rgba(255,255,255,0.07)_26%,transparent_54%)]"></div>
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="relative z-10 flex h-full max-w-[70%] min-w-0 flex-col justify-center p-4 sm:max-w-[45%] sm:min-w-[225px] md:p-7 text-white">
                      {featured.discountPrice && (
                        <span className="mb-6 inline-block w-fit bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-3 py-1.5 rounded-[2px] tracking-wide">
                          Giảm -{Math.round(((featured.price - featured.discountPrice) / featured.price) * 100)}%
                        </span>
                      )}
                      <div className="flex items-center justify-between gap-6 text-[9px] uppercase tracking-[0.14em] text-white/72 font-mono">
                        <span>Philippe Auguste</span>
                        <span>{featured.code}</span>
                      </div>
                      <h3 className="mt-4 max-w-[260px] text-[21px] md:text-[24px] font-black leading-[1.22] tracking-normal text-white font-sans">
                        Đồng hồ cổ điển Pháp
                      </h3>
                      <div className="w-7 h-px bg-[#f5c400] mt-4"></div>
                      <div className="philippePrice mt-6 flex items-end gap-3">
                        {featured.discountPrice ? (
                          <>
                            <span className="text-sm line-through text-white/55 font-mono">
                              {featured.price.toLocaleString("vi-VN")} ₫
                            </span>
                            <span className="text-[20px] font-black text-[#ff1f1f] font-mono leading-none">
                              {featured.discountPrice.toLocaleString("vi-VN")} ₫
                            </span>
                          </>
                        ) : (
                          <span className="text-[20px] font-black text-[#ff1f1f] font-mono leading-none">
                            {featured.price.toLocaleString("vi-VN")} ₫
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )}

                <div className="relative">
                  <style>{`
                    @keyframes philippeSlideNext {
                      from { opacity: .35; transform: translateX(22px); }
                      to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes philippeSlidePrev {
                      from { opacity: .35; transform: translateX(-22px); }
                      to { opacity: 1; transform: translateX(0); }
                    }
                    .philippeCarouselNext { animation: philippeSlideNext 300ms ease both; }
                    .philippeCarouselPrev { animation: philippeSlidePrev 300ms ease both; }
                  `}</style>
                  <button
                    type="button"
                    onClick={handlePhilippeCarouselPrev}
                    className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-[#f5c400] hover:text-[#050505] xl:flex"
                    aria-label="Xem sản phẩm trước"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handlePhilippeCarouselNext}
                    className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-[#f5c400] hover:text-[#050505]"
                    aria-label="Xem thêm sản phẩm"
                  >
                    ›
                  </button>

                  <div
                    key={philippeCarouselIndex}
                    className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ${
                      philippeCarouselDirection === "next" ? "philippeCarouselNext" : "philippeCarouselPrev"
                    }`}
                  >
                  {getPhilippeVisibleProducts().map((prod, index) => {
                    const discountPercent = prod.discountPrice
                      ? Math.round(((prod.price - prod.discountPrice) / prod.price) * 100)
                      : 0;

                    return (
                      <div
                        key={`${prod.id}-philippe-visible-${philippeCarouselIndex}-${index}`}
                        className={`philippeCard group/card relative h-[320px] overflow-hidden rounded-[6px] bg-[#050505] shadow-[0_14px_36px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_22px_52px_rgba(0,0,0,0.24)] ${
                          index === 1 ? "hidden sm:block" : index === 2 ? "hidden xl:block" : ""
                        }`}
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="absolute inset-0 h-full w-full object-cover object-center brightness-105 contrast-115 saturate-95 transition-transform duration-300 group-hover/card:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.18),rgba(245,196,0,0.08)_38%,rgba(0,0,0,0.16)_72%),linear-gradient(to_top,rgba(0,0,0,0.88),rgba(0,0,0,0.34),transparent)]"></div>
                        {discountPercent > 0 && (
                          <span className="absolute top-4 left-4 z-10 bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-2.5 py-1 rounded-[2px] tracking-wide">
                            Giảm -{discountPercent}%
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(prod);
                          }}
                          className={`absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-xl leading-none shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white ${
                            isInWishlist(prod.id) ? "text-red-500" : "text-white hover:text-red-500"
                          }`}
                          title={isInWishlist(prod.id) ? "Xóa khỏi yêu thích" : "Yêu thích"}
                        >
                          {isInWishlist(prod.id) ? "♥" : "♡"}
                        </button>
                        <Link
                          to={`/product/${prod.id}`}
                          className="absolute inset-0 z-20"
                          aria-label={`Xem sản phẩm ${prod.name}`}
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 text-white">
                          <div className="text-[8.5px] uppercase tracking-[0.2em] text-white/62 font-mono">
                            Đồng hồ Pháp
                          </div>
                          <div className="mt-2 block text-[17px] font-serif leading-tight text-white">
                            Philippe Auguste
                          </div>
                          <div className="philippePrice mt-4">
                            {prod.discountPrice ? (
                              <div className="flex flex-col gap-1">
                                <span className="text-xs line-through text-white/55 font-mono">
                                  {prod.price.toLocaleString("vi-VN")} ₫
                                </span>
                                <span className="text-[15px] font-black text-[#ff1f1f] font-mono leading-tight">
                                  {prod.discountPrice.toLocaleString("vi-VN")} ₫
                                </span>
                              </div>
                            ) : (
                              <span className="text-[15px] font-black text-[#ff1f1f] font-mono leading-none">
                                {prod.price.toLocaleString("vi-VN")} ₫
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* SECTION 8: ATLANTIC SWISS */}
      <section id="section-atlantic-swiss" className="atlanticSection max-w-[1320px] mx-auto px-3 sm:px-4 md:px-6 py-5 md:py-8 mb-9 md:mb-[50px] bg-gradient-to-br from-[#f7f4ef] via-[#f5f3ef] to-[#ece9e2]">
        <div className="atlanticHeader flex flex-col lg:flex-row lg:items-center gap-5 mb-6">
          <div className="shrink-0">
            <h2 className="text-[22px] md:text-[36px] font-black uppercase text-[#050505] tracking-wide font-sans whitespace-normal md:whitespace-nowrap leading-none">
              Atlantic Swiss
            </h2>
            <p className="mt-3 text-[11px] md:text-xs font-bold uppercase tracking-[0.24em] text-[#9b7a2c]">
              Bộ sưu tập đồng hồ Thụy Sĩ cao cấp
            </p>
          </div>
          <div className="hidden lg:block h-px bg-[#d6a11f] flex-1 relative">
            <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#d6a11f]"></span>
          </div>

          <div className="flex justify-start lg:justify-end gap-2 flex-wrap">
            <button
              onClick={() => handleBrandFilterChange("Atlantic Swiss", "all")}
              className={`h-[42px] px-5 text-[10px] font-black border rounded-[3px] cursor-pointer tracking-[0.08em] uppercase transition-all duration-300 ${
                brandFilters["atlantic swiss"] === "all"
                  ? "bg-[#f5c400] text-[#050505] border-[#f5c400] shadow-[0_10px_22px_rgba(214,161,31,0.24)]"
                  : "bg-white/80 text-[#111111] border-[#e3ded3] hover:bg-[#fff4bf] hover:border-[#f5c400]"
              }`}
            >
              Atlantic Swiss
            </button>
            <button
              onClick={() => handleBrandFilterChange("Atlantic Swiss", "Nam")}
              className={`h-[42px] px-5 text-[10px] font-black border rounded-[3px] cursor-pointer tracking-[0.08em] uppercase transition-all duration-300 ${
                brandFilters["atlantic swiss"] === "Nam"
                  ? "bg-[#f5c400] text-[#050505] border-[#f5c400] shadow-[0_10px_22px_rgba(214,161,31,0.24)]"
                  : "bg-white/80 text-[#111111] border-[#e3ded3] hover:bg-[#fff4bf] hover:border-[#f5c400]"
              }`}
            >
              Đồng hồ nam
            </button>
            <button
              onClick={() => handleBrandFilterChange("Atlantic Swiss", "Nữ")}
              className={`h-[42px] px-5 text-[10px] font-black border rounded-[3px] cursor-pointer tracking-[0.08em] uppercase transition-all duration-300 ${
                brandFilters["atlantic swiss"] === "Nữ"
                  ? "bg-[#f5c400] text-[#050505] border-[#f5c400] shadow-[0_10px_22px_rgba(214,161,31,0.24)]"
                  : "bg-white/80 text-[#111111] border-[#e3ded3] hover:bg-[#fff4bf] hover:border-[#f5c400]"
              }`}
            >
              Đồng hồ nữ
            </button>
          </div>
        </div>

        {(() => {
          const atlanticProducts = getFilteredBrandProducts("Atlantic Swiss");
          const featured = atlanticProducts[0];

          return (
            <div className="atlanticGrid grid grid-cols-1 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-4">
              <Link to="/shop?brand=Atlantic%20Swiss" className="atlanticBanner relative block h-[300px] sm:h-[420px] lg:h-[650px] overflow-hidden rounded-[6px] bg-[#050505] group/banner shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
                <img
                  src="/images/kkk.jpg"
                  alt="Atlantic Swiss"
                  className="absolute inset-0 w-full h-full object-cover object-[50%_50%] contrast-110 transition-transform duration-300 ease-out group-hover/banner:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_18%,rgba(255,255,255,0.16),transparent_30%),linear-gradient(to_top,rgba(0,0,0,0.94),rgba(0,0,0,0.54)_45%,rgba(0,0,0,0.12))] transition-opacity duration-300 group-hover/banner:opacity-95"></div>
                <div className="absolute -right-12 bottom-12 text-[190px] font-black text-white/[0.035] leading-none select-none">AS</div>
                <div className="absolute left-6 right-6 bottom-7 text-white transition-transform duration-300 ease-out group-hover/banner:-translate-y-1">
                  <span className="inline-block bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-3 py-1.5 rounded-[2px] mb-4 tracking-[0.12em]">
                    Thương hiệu
                  </span>
                  <h3 className="text-[31px] md:text-[52px] font-serif uppercase leading-[0.95] tracking-tight">Atlantic Swiss</h3>
                  <p className="text-[13px] font-black text-[#f5c400] uppercase tracking-[0.34em] mt-4">Đồng hồ Thụy Sĩ</p>
                  <div className="w-8 h-px bg-[#f5c400] mt-4"></div>
                  <p className="text-sm text-white/86 font-medium mt-4 max-w-[330px] leading-relaxed">
                    Chuẩn mực chính xác, bền bỉ và sang trọng theo tinh thần chế tác Thụy Sĩ.
                  </p>
                  <span className="inline-flex items-center gap-3 mt-6 border border-[#f5c400] text-[#f5c400] group-hover/banner:bg-[#f5c400] group-hover/banner:text-[#050505] px-5 py-3 text-[11px] font-black uppercase tracking-[0.12em] transition-colors duration-300">
                    Xem bộ sưu tập <span className="transition-transform duration-300 group-hover/banner:translate-x-1">→</span>
                  </span>
                </div>
              </Link>

              <div className="grid grid-cols-1 gap-4">
                {featured && (
                  <Link
                    to={`/product/${featured.id}`}
                    className="atlanticFeatured group/featured relative min-h-[250px] sm:min-h-[320px] lg:h-[312px] overflow-hidden rounded-[6px] bg-[#050505] shadow-[0_18px_42px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_58px_rgba(0,0,0,0.22)]"
                  >
                    <img
                      src={featured.image}
                      alt={featured.name}
                      className="absolute inset-0 h-full w-full object-cover object-[78%_50%] opacity-100 brightness-112 contrast-125 saturate-95 transition-transform duration-300 group-hover/featured:scale-[1.035]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.97)_0%,rgba(0,0,0,0.86)_32%,rgba(0,0,0,0.34)_58%,rgba(0,0,0,0.06)_80%,rgba(0,0,0,0.16)_100%)] transition-opacity duration-300 group-hover/featured:opacity-95"></div>
                    <div className="absolute inset-y-0 right-0 w-[56%] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_34px),radial-gradient(circle_at_58%_48%,rgba(255,255,255,0.16)_0%,rgba(245,196,0,0.08)_28%,transparent_54%)]"></div>
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/58 to-transparent"></div>
                    <div className="relative z-10 flex h-full max-w-[70%] min-w-0 flex-col justify-center p-4 sm:max-w-[45%] sm:min-w-[225px] md:p-7 text-white">
                      {featured.discountPrice && (
                        <span className="mb-6 inline-block w-fit bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-3 py-1.5 rounded-[2px] tracking-wide">
                          Giảm -{Math.round(((featured.price - featured.discountPrice) / featured.price) * 100)}%
                        </span>
                      )}
                      <div className="flex items-center justify-between gap-6 text-[9px] uppercase tracking-[0.14em] text-white/72 font-mono">
                        <span>Atlantic Swiss</span>
                        <span>{featured.code}</span>
                      </div>
                      <h3 className="mt-4 max-w-[260px] text-[21px] md:text-[24px] font-black leading-[1.22] tracking-normal text-white font-sans">
                        Đồng hồ chuẩn Thụy Sĩ
                      </h3>
                      <div className="w-7 h-px bg-[#f5c400] mt-4"></div>
                      <div className="atlanticPrice mt-6 flex items-end gap-3">
                        {featured.discountPrice ? (
                          <>
                            <span className="text-sm line-through text-white/55 font-mono">
                              {featured.price.toLocaleString("vi-VN")} ₫
                            </span>
                            <span className="text-[20px] font-black text-[#ff1f1f] font-mono leading-none">
                              {featured.discountPrice.toLocaleString("vi-VN")} ₫
                            </span>
                          </>
                        ) : (
                          <span className="text-[20px] font-black text-[#ff1f1f] font-mono leading-none">
                            {featured.price.toLocaleString("vi-VN")} ₫
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )}

                <div className="relative">
                  <style>{`
                    @keyframes atlanticSlideNext {
                      from { opacity: .35; transform: translateX(22px); }
                      to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes atlanticSlidePrev {
                      from { opacity: .35; transform: translateX(-22px); }
                      to { opacity: 1; transform: translateX(0); }
                    }
                    .atlanticCarouselNext { animation: atlanticSlideNext 300ms ease both; }
                    .atlanticCarouselPrev { animation: atlanticSlidePrev 300ms ease both; }
                  `}</style>
                  <button
                    type="button"
                    onClick={handleAtlanticCarouselPrev}
                    className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-[#f5c400] hover:text-[#050505] xl:flex"
                    aria-label="Xem sản phẩm trước"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleAtlanticCarouselNext}
                    className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-[#f5c400] hover:text-[#050505]"
                    aria-label="Xem thêm sản phẩm"
                  >
                    ›
                  </button>

                  <div
                    key={atlanticCarouselIndex}
                    className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ${
                      atlanticCarouselDirection === "next" ? "atlanticCarouselNext" : "atlanticCarouselPrev"
                    }`}
                  >
                  {getAtlanticVisibleProducts().map((prod, index) => {
                    const discountPercent = prod.discountPrice
                      ? Math.round(((prod.price - prod.discountPrice) / prod.price) * 100)
                      : 0;

                    return (
                      <div
                        key={`${prod.id}-atlantic-visible-${atlanticCarouselIndex}-${index}`}
                        className={`atlanticCard group/card relative h-[320px] overflow-hidden rounded-[6px] bg-[#050505] shadow-[0_14px_36px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_22px_52px_rgba(0,0,0,0.24)] ${
                          index === 1 ? "hidden sm:block" : index === 2 ? "hidden xl:block" : ""
                        }`}
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="absolute inset-0 h-full w-full object-cover object-center brightness-108 contrast-120 saturate-95 transition-transform duration-300 group-hover/card:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.88),rgba(0,0,0,0.30),transparent),linear-gradient(90deg,rgba(255,255,255,0.06)_0,transparent_20%,rgba(245,196,0,0.08)_52%,transparent_76%)]"></div>
                        {discountPercent > 0 && (
                          <span className="absolute top-4 left-4 z-10 bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-2.5 py-1 rounded-[2px] tracking-wide">
                            Giảm -{discountPercent}%
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(prod);
                          }}
                          className={`absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-xl leading-none shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white ${
                            isInWishlist(prod.id) ? "text-red-500" : "text-white hover:text-red-500"
                          }`}
                          title={isInWishlist(prod.id) ? "Xóa khỏi yêu thích" : "Yêu thích"}
                        >
                          {isInWishlist(prod.id) ? "♥" : "♡"}
                        </button>
                        <Link
                          to={`/product/${prod.id}`}
                          className="absolute inset-0 z-20"
                          aria-label={`Xem sản phẩm ${prod.name}`}
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 text-white">
                          <div className="text-[8.5px] uppercase tracking-[0.2em] text-white/62 font-mono">
                            Đồng hồ Thụy Sĩ
                          </div>
                          <div className="mt-2 block text-[17px] font-serif leading-tight text-white">
                            Atlantic Swiss
                          </div>
                          <div className="atlanticPrice mt-4">
                            {prod.discountPrice ? (
                              <div className="flex flex-col gap-1">
                                <span className="text-xs line-through text-white/55 font-mono">
                                  {prod.price.toLocaleString("vi-VN")} ₫
                                </span>
                                <span className="text-[15px] font-black text-[#ff1f1f] font-mono leading-tight">
                                  {prod.discountPrice.toLocaleString("vi-VN")} ₫
                                </span>
                              </div>
                            ) : (
                              <span className="text-[15px] font-black text-[#ff1f1f] font-mono leading-none">
                                {prod.price.toLocaleString("vi-VN")} ₫
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      <section id="section-atlantic-swiss-legacy" className="hidden">
        <div className="text-center mb-6">
          <div className="relative mb-4">
            <h2 className="text-xl md:text-2xl font-black uppercase text-neutral-900 tracking-widest font-sans inline-block bg-[#fcfcfc] px-6 relative z-10">
              Atlantic Swiss
            </h2>
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#FFD700] z-0"></div>
          </div>

          {/* Interactive sub-filters */}
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => handleBrandFilterChange("Atlantic Swiss", "all")}
              className={`px-3 py-1.5 text-[10px] font-extrabold border rounded-none cursor-pointer tracking-wider transition-colors ${
                brandFilters["atlantic swiss"] === "all"
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-600 border-[#eeeeee]"
              }`}
            >
              TẤT CẢ ATLANTIC
            </button>
            <button
              onClick={() => handleBrandFilterChange("Atlantic Swiss", "Nam")}
              className={`px-3 py-1.5 text-[10px] font-extrabold border rounded-none cursor-pointer tracking-wider transition-colors ${
                brandFilters["atlantic swiss"] === "Nam"
                  ? "bg-[#A52A2A] text-white border-[#A52A2A]"
                  : "bg-white text-neutral-600 border-[#eeeeee]"
              }`}
            >
              ĐỒNG HỒ NAM
            </button>
            <button
              onClick={() => handleBrandFilterChange("Atlantic Swiss", "Nữ")}
              className={`px-3 py-1.5 text-[10px] font-extrabold border rounded-none cursor-pointer tracking-wider transition-colors ${
                brandFilters["atlantic swiss"] === "Nữ"
                  ? "bg-[#A52A2A] text-white border-[#A52A2A]"
                  : "bg-white text-neutral-600 border-[#eeeeee]"
              }`}
            >
              ĐỒNG HỒ NỮ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-[30px] lg:grid-cols-4">
          {getFilteredBrandProducts("Atlantic Swiss").map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* SECTION 9: CITIZEN */}
      <section id="section-citizen-removed" className="hidden">
        <div className="text-center mb-6">
          <div className="relative mb-4">
            <h2 className="text-xl md:text-2xl font-black uppercase text-neutral-900 tracking-widest font-sans inline-block bg-[#fcfcfc] px-6 relative z-10">
              Citizen
            </h2>
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#FFD700] z-0"></div>
          </div>

          {/* Interactive sub-filters */}
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => handleBrandFilterChange("Citizen", "all")}
              className={`px-3 py-1.5 text-[10px] font-extrabold border rounded-none cursor-pointer tracking-wider transition-colors ${
                brandFilters["citizen"] === "all"
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-600 border-[#eeeeee]"
              }`}
            >
              TẤT CẢ CITIZEN
            </button>
            <button
              onClick={() => handleBrandFilterChange("Citizen", "Nam")}
              className={`px-3 py-1.5 text-[10px] font-extrabold border rounded-none cursor-pointer tracking-wider transition-colors ${
                brandFilters["citizen"] === "Nam"
                  ? "bg-[#A52A2A] text-white border-[#A52A2A]"
                  : "bg-white text-neutral-600 border-[#eeeeee]"
              }`}
            >
              ĐỒNG HỒ NAM
            </button>
            <button
              onClick={() => handleBrandFilterChange("Citizen", "Nữ")}
              className={`px-3 py-1.5 text-[10px] font-extrabold border rounded-none cursor-pointer tracking-wider transition-colors ${
                brandFilters["citizen"] === "Nữ"
                  ? "bg-[#A52A2A] text-white border-[#A52A2A]"
                  : "bg-white text-neutral-600 border-[#eeeeee]"
              }`}
            >
              ĐỒNG HỒ NỮ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-[30px] lg:grid-cols-4">
          {getFilteredBrandProducts("Citizen").map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* SECTION 10: ĐỒNG HỒ TSAR BOMBA */}
      <section id="section-tsar-bomba" className="tsarSection max-w-[1320px] mx-auto px-3 sm:px-4 md:px-6 py-5 md:py-8 mb-9 md:mb-[50px] bg-gradient-to-br from-[#f7f4ef] via-[#f5f3ef] to-[#ece9e2]">
        <div className="tsarHeader flex flex-col lg:flex-row lg:items-center gap-5 mb-6">
          <div className="shrink-0">
            <h2 className="text-[22px] md:text-[36px] font-black uppercase text-[#050505] tracking-wide font-sans whitespace-normal md:whitespace-nowrap leading-none">
              Tsar Bomba
            </h2>
            <p className="mt-3 text-[11px] md:text-xs font-bold uppercase tracking-[0.24em] text-[#9b7a2c]">
              Bộ sưu tập đồng hồ cơ khí thể thao cao cấp
            </p>
          </div>
          <div className="hidden lg:block h-px bg-[#d6a11f] flex-1 relative">
            <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#d6a11f]"></span>
          </div>
          <div className="flex justify-start lg:justify-end gap-2 flex-wrap">
            <span className="h-[42px] inline-flex items-center px-5 text-[10px] font-black border rounded-[3px] tracking-[0.08em] uppercase bg-[#f5c400] text-[#050505] border-[#f5c400] shadow-[0_10px_22px_rgba(214,161,31,0.24)]">
              Tsar Bomba
            </span>
          </div>
        </div>

        {(() => {
          const tsarProducts = getProductsByBrand("Tsar Bomba");
          const featured = tsarProducts[0];

          return (
            <div className="tsarGrid grid grid-cols-1 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-4">
              <Link to="/shop?brand=Tsar%20Bomba" className="tsarBanner relative block h-[300px] sm:h-[420px] lg:h-[650px] overflow-hidden rounded-[6px] bg-[#050505] group/banner shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
                <img
                  src="/images/tt.jpg"
                  alt="Tsar Bomba"
                  className="absolute inset-0 w-full h-full object-cover object-[54%_50%] contrast-125 saturate-90 transition-transform duration-300 ease-out group-hover/banner:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_66%_24%,rgba(245,196,0,0.18),transparent_28%),linear-gradient(to_top,rgba(0,0,0,0.96),rgba(0,0,0,0.60)_45%,rgba(0,0,0,0.18))] transition-opacity duration-300 group-hover/banner:opacity-95"></div>
                <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.10)_0,rgba(255,255,255,0.10)_1px,transparent_1px,transparent_18px)]"></div>
                <div className="absolute -right-12 bottom-12 text-[180px] font-black text-white/[0.035] leading-none select-none">TB</div>
                <div className="absolute left-6 right-6 bottom-7 text-white transition-transform duration-300 ease-out group-hover/banner:-translate-y-1">
                  <span className="inline-block bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-3 py-1.5 rounded-[2px] mb-4 tracking-[0.12em]">
                    Thương hiệu
                  </span>
                  <h3 className="text-[31px] md:text-[52px] font-serif uppercase leading-[0.95] tracking-tight">Tsar Bomba</h3>
                  <p className="text-[13px] font-black text-[#f5c400] uppercase tracking-[0.34em] mt-4">Đồng hồ cơ khí</p>
                  <div className="w-8 h-px bg-[#f5c400] mt-4"></div>
                  <p className="text-sm text-white/86 font-medium mt-4 max-w-[330px] leading-relaxed">
                    Thiết kế mạnh mẽ, cấu trúc cơ khí nổi bật và cá tính thể thao hiện đại.
                  </p>
                  <span className="inline-flex items-center gap-3 mt-6 border border-[#f5c400] text-[#f5c400] group-hover/banner:bg-[#f5c400] group-hover/banner:text-[#050505] px-5 py-3 text-[11px] font-black uppercase tracking-[0.12em] transition-colors duration-300">
                    Xem bộ sưu tập <span className="transition-transform duration-300 group-hover/banner:translate-x-1">→</span>
                  </span>
                </div>
              </Link>

              <div className="grid grid-cols-1 gap-4">
                {featured && (
                  <Link
                    to={`/product/${featured.id}`}
                    className="tsarFeatured group/featured relative min-h-[250px] sm:min-h-[320px] lg:h-[312px] overflow-hidden rounded-[6px] bg-[#050505] shadow-[0_18px_42px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_58px_rgba(0,0,0,0.22)]"
                  >
                    <img
                      src={featured.image}
                      alt={featured.name}
                      className="absolute inset-0 h-full w-full object-cover object-[76%_50%] opacity-100 brightness-110 contrast-130 saturate-90 transition-transform duration-300 group-hover/featured:scale-[1.035]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.88)_32%,rgba(0,0,0,0.36)_58%,rgba(0,0,0,0.08)_82%,rgba(0,0,0,0.18)_100%)] transition-opacity duration-300 group-hover/featured:opacity-95"></div>
                    <div className="absolute inset-y-0 right-0 w-[58%] bg-[radial-gradient(circle_at_56%_48%,rgba(245,196,0,0.18)_0%,rgba(255,255,255,0.06)_26%,transparent_54%)]"></div>
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(120deg,transparent_0%,transparent_46%,rgba(245,196,0,0.16)_46%,rgba(245,196,0,0.16)_48%,transparent_48%,transparent_100%)]"></div>
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="relative z-10 flex h-full max-w-[70%] min-w-0 flex-col justify-center p-4 sm:max-w-[45%] sm:min-w-[225px] md:p-7 text-white">
                      {featured.discountPrice && (
                        <span className="mb-6 inline-block w-fit bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-3 py-1.5 rounded-[2px] tracking-wide">
                          Giảm -{Math.round(((featured.price - featured.discountPrice) / featured.price) * 100)}%
                        </span>
                      )}
                      <div className="flex items-center justify-between gap-6 text-[9px] uppercase tracking-[0.14em] text-white/72 font-mono">
                        <span>Tsar Bomba</span>
                        <span>{featured.code}</span>
                      </div>
                      <h3 className="mt-4 max-w-[260px] text-[21px] md:text-[24px] font-black leading-[1.22] tracking-normal text-white font-sans">
                        Đồng hồ cơ khí thể thao
                      </h3>
                      <div className="w-7 h-px bg-[#f5c400] mt-4"></div>
                      <div className="tsarPrice mt-6 flex items-end gap-3">
                        {featured.discountPrice ? (
                          <>
                            <span className="text-sm line-through text-white/55 font-mono">
                              {featured.price.toLocaleString("vi-VN")} ₫
                            </span>
                            <span className="text-[20px] font-black text-[#ff1f1f] font-mono leading-none">
                              {featured.discountPrice.toLocaleString("vi-VN")} ₫
                            </span>
                          </>
                        ) : (
                          <span className="text-[20px] font-black text-[#ff1f1f] font-mono leading-none">
                            {featured.price.toLocaleString("vi-VN")} ₫
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )}

                <div className="relative">
                  <style>{`
                    @keyframes tsarSlideNext {
                      from { opacity: .35; transform: translateX(22px); }
                      to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes tsarSlidePrev {
                      from { opacity: .35; transform: translateX(-22px); }
                      to { opacity: 1; transform: translateX(0); }
                    }
                    .tsarCarouselNext { animation: tsarSlideNext 300ms ease both; }
                    .tsarCarouselPrev { animation: tsarSlidePrev 300ms ease both; }
                  `}</style>
                  <button
                    type="button"
                    onClick={handleTsarCarouselPrev}
                    className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-[#f5c400] hover:text-[#050505] xl:flex"
                    aria-label="Xem sản phẩm trước"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleTsarCarouselNext}
                    className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-[#f5c400] hover:text-[#050505]"
                    aria-label="Xem thêm sản phẩm"
                  >
                    ›
                  </button>

                  <div
                    key={tsarCarouselIndex}
                    className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ${
                      tsarCarouselDirection === "next" ? "tsarCarouselNext" : "tsarCarouselPrev"
                    }`}
                  >
                  {getTsarVisibleProducts().map((prod, index) => {
                    const discountPercent = prod.discountPrice
                      ? Math.round(((prod.price - prod.discountPrice) / prod.price) * 100)
                      : 0;

                    return (
                      <div
                        key={`${prod.id}-tsar-visible-${tsarCarouselIndex}-${index}`}
                        className={`tsarCard group/card relative h-[320px] overflow-hidden rounded-[6px] bg-[#050505] shadow-[0_14px_36px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_22px_52px_rgba(0,0,0,0.24)] ${
                          index === 1 ? "hidden sm:block" : index === 2 ? "hidden xl:block" : ""
                        }`}
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="absolute inset-0 h-full w-full object-cover object-center brightness-105 contrast-125 saturate-90 transition-transform duration-300 group-hover/card:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.88),rgba(0,0,0,0.34),transparent),radial-gradient(circle_at_70%_24%,rgba(245,196,0,0.16),transparent_30%)]"></div>
                        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.12)_0,rgba(255,255,255,0.12)_1px,transparent_1px,transparent_22px)]"></div>
                        {discountPercent > 0 && (
                          <span className="absolute top-4 left-4 z-10 bg-[#f5c400] text-[#050505] text-[10px] font-black uppercase px-2.5 py-1 rounded-[2px] tracking-wide">
                            Giảm -{discountPercent}%
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(prod);
                          }}
                          className={`absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-xl leading-none shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white ${
                            isInWishlist(prod.id) ? "text-red-500" : "text-white hover:text-red-500"
                          }`}
                          title={isInWishlist(prod.id) ? "Xóa khỏi yêu thích" : "Yêu thích"}
                        >
                          {isInWishlist(prod.id) ? "♥" : "♡"}
                        </button>
                        <Link
                          to={`/product/${prod.id}`}
                          className="absolute inset-0 z-20"
                          aria-label={`Xem sản phẩm ${prod.name}`}
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 text-white">
                          <div className="text-[8.5px] uppercase tracking-[0.2em] text-white/62 font-mono">
                            Đồng hồ cơ khí
                          </div>
                          <div className="mt-2 block text-[17px] font-serif leading-tight text-white">
                            Tsar Bomba
                          </div>
                          <div className="tsarPrice mt-4">
                            {prod.discountPrice ? (
                              <div className="flex flex-col gap-1">
                                <span className="text-xs line-through text-white/55 font-mono">
                                  {prod.price.toLocaleString("vi-VN")} ₫
                                </span>
                                <span className="text-[15px] font-black text-[#ff1f1f] font-mono leading-tight">
                                  {prod.discountPrice.toLocaleString("vi-VN")} ₫
                                </span>
                              </div>
                            ) : (
                              <span className="text-[15px] font-black text-[#ff1f1f] font-mono leading-none">
                                {prod.price.toLocaleString("vi-VN")} ₫
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      <section id="section-tsar-bomba-legacy" className="hidden">
        <div className="text-center mb-8 relative">
          <h2 className="text-xl md:text-2xl font-black uppercase text-neutral-900 tracking-widest font-sans inline-block bg-[#fcfcfc] px-6 relative z-10">
            Đồng Hồ Tsar Bomba
          </h2>
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#FFD700] z-0"></div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-[30px] lg:grid-cols-4">
          {getProductsByBrand("Tsar Bomba").map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* SECTION 11: KÍNH MẮT THỜI TRANG */}
      <section id="section-kinh-mat-removed" className="hidden">
        <div className="text-center mb-8 relative">
          <h2 className="text-xl md:text-2xl font-black uppercase text-neutral-900 tracking-widest font-sans inline-block bg-[#fcfcfc] px-6 relative z-10">
            Kính Mắt Thời Trang
          </h2>
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#FFD700] z-0"></div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-[30px] lg:grid-cols-4">
          {getEyewearProducts().map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

    </div>
  );
}
