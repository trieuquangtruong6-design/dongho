import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../contexts/StoreContext";
import ProductCard from "../components/ProductCard";
import { ShoppingCart, Heart, ShieldCheck, ChevronRight, CheckCircle, RefreshCw, Star, Info, MessageSquare, AlertCircle } from "lucide-react";
import { Product } from "../types";

function getMovementLabel(product: Product) {
  const text = `${product.name} ${product.description}`.toLowerCase();
  if (text.includes("automatic") || text.includes("tự động")) return "máy cơ Automatic";
  if (text.includes("quartz") || text.includes("pin")) return "máy pin Quartz";
  if (text.includes("mecha")) return "máy Mecha-Quartz";
  if (product.category === "but-ky") return "cơ chế bút ký tiện dụng";
  if (product.category === "kinh-mat") return "tròng kính thời trang bảo vệ mắt";
  if (product.category === "phu-kien") return "phụ kiện thay thế và phối đồng hồ";
  return "bộ máy ổn định";
}

function getProductTone(product: Product) {
  if (product.category === "kinh-mat") {
    const target = product.target === "Nữ" ? "gương mặt thanh thoát" : product.target === "Nam" ? "gương mặt nam tính" : "nhiều dáng gương mặt";
    return `Form kính ${product.brand} được chọn theo phong cách hiện đại, dễ đeo với ${target}. Thiết kế tập trung vào độ cân đối khi nhìn trực diện, phần gọng tạo cảm giác gọn gàng và phù hợp sử dụng hằng ngày.`;
  }

  if (product.category === "but-ky") {
    return `${product.name} có dáng bút thon, thân bút hoàn thiện bóng mịn và điểm nhấn kim loại sang trọng. Sản phẩm phù hợp đặt trên bàn làm việc, dùng ký hợp đồng hoặc làm quà tặng cho đối tác, quản lý và khách hàng quan trọng.`;
  }

  if (product.category === "phu-kien") {
    return `${product.name} được thiết kế để làm mới diện mạo đồng hồ ${product.brand}. Chất da và tông màu của dây giúp đồng hồ nhìn chỉn chu hơn, đặc biệt khi cần thay dây cũ hoặc phối lại phong cách đeo hằng ngày.`;
  }

  const target = product.target === "Nữ" ? "cổ tay nữ" : product.target === "Nam" ? "cổ tay nam" : "nhiều phong cách đeo";
  return `${product.name} mang tinh thần ${product.brand} với bố cục mặt số rõ ràng, tỷ lệ vỏ ${product.size || "vừa vặn"} và cảm giác đeo hợp với ${target}. Mẫu này thiên về sự lịch lãm, dễ phối trong môi trường công sở nhưng vẫn đủ nổi bật khi đi tiệc hoặc gặp gỡ đối tác.`;
}

function getMaterialSummary(product: Product) {
  if (product.category === "kinh-mat") {
    return `Tròng kính được định hướng cho nhu cầu che nắng, giảm chói và bảo vệ mắt khi di chuyển ngoài trời. Gọng ${product.brand} ưu tiên độ nhẹ, độ ôm và sự chắc chắn khi sử dụng lâu.`;
  }

  if (product.category === "but-ky") {
    return "Thân bút cầm đầm tay, bề mặt hoàn thiện sạch và dễ bảo quản. Nét viết phù hợp ghi chú, ký tên và sử dụng trong các cuộc họp cần sự trang trọng.";
  }

  if (product.category === "phu-kien") {
    return `Kích thước ${product.size || "phổ thông"} giúp dây dễ tương thích với nhiều mẫu đồng hồ cùng chuẩn càng. Bề mặt da được chọn để hạn chế cảm giác cứng tay khi mới sử dụng.`;
  }

  const glass = product.glassMaterial ? "kính Sapphire chống xước tốt" : "kính cứng dễ quan sát";
  const caseMaterial = product.caseMaterial ? "vỏ thép 316L chắc chắn" : "vỏ kim loại nhẹ";
  return `Trang bị ${glass}, ${caseMaterial}, khả năng kháng nước ${product.waterResistance || "cơ bản"} và ${getMovementLabel(product)}. Đây là cấu hình phù hợp cho nhu cầu đeo thường xuyên, ưu tiên độ bền và sự ổn định.`;
}

function getStylingAdvice(product: Product) {
  if (product.category === "kinh-mat") {
    return `Phù hợp phối với áo sơ mi, polo, blazer hoặc trang phục du lịch. Với thương hiệu ${product.brand}, mẫu kính này nên được chọn khi bạn muốn tổng thể nhìn gọn, sang và có điểm nhấn ở khuôn mặt.`;
  }

  if (product.category === "but-ky") {
    return "Hợp với môi trường văn phòng, phòng họp, quầy lễ tân hoặc bộ quà tặng doanh nghiệp. Khi đặt cùng sổ da hoặc hộp bút, sản phẩm tạo cảm giác chuyên nghiệp và chỉn chu hơn.";
  }

  if (product.category === "phu-kien") {
    return `Dây ${product.brand} hợp với đồng hồ mặt sáng, mặt xanh hoặc mặt đen tùy tông màu thực tế. Khi thay dây, tổng thể đồng hồ sẽ mới hơn mà không cần đổi sang một mẫu đồng hồ khác.`;
  }

  if (product.target === "Nữ") {
    return "Dễ phối cùng váy công sở, áo sơ mi lụa, blazer sáng màu hoặc trang phục dự tiệc. Kích thước nhỏ gọn giúp đồng hồ trở thành điểm nhấn tinh tế thay vì quá nặng trên cổ tay.";
  }

  return "Dễ phối với sơ mi, vest, polo hoặc trang phục smart-casual. Kích thước và phong cách của mẫu này hợp với người thích đồng hồ nổi bật vừa đủ, không quá phô nhưng vẫn thể hiện gu cá nhân.";
}

function getProductDetailCards(product: Product) {
  return [
    { title: "Thiết kế", text: getProductTone(product) },
    { title: "Chất liệu & cấu hình", text: getMaterialSummary(product) },
    { title: "Gợi ý sử dụng", text: getStylingAdvice(product) }
  ];
}

function getProductDetailPoints(product: Product) {
  const points = [
    `Thương hiệu ${product.brand}, xuất xứ ${product.origin}, mã sản phẩm ${product.code}.`,
    product.target ? `Định hướng cho nhóm khách hàng ${product.target.toLowerCase()}, dễ chọn làm sản phẩm đeo cá nhân hoặc quà tặng.` : "",
    product.size ? `Kích thước ${product.size} tạo tỷ lệ cân đối khi lên tay.` : "",
    product.category === "dong-ho" && product.waterResistance ? `Kháng nước ${product.waterResistance}, phù hợp các tình huống sinh hoạt thường ngày.` : "",
    product.category === "kinh-mat" ? "Phù hợp đi nắng, lái xe, du lịch và sử dụng như phụ kiện hoàn thiện trang phục." : "",
    product.category === "but-ky" ? "Phù hợp ký kết, ghi chú công việc và làm quà tặng doanh nhân." : "",
    product.category === "phu-kien" ? "Phù hợp thay mới dây đồng hồ, làm mới phong cách và tăng sự thoải mái khi đeo." : ""
  ].filter(Boolean);

  return points.slice(0, 5);
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, wishlist, toggleWishlist, isInWishlist } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "spec" | "reviews">("desc");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [wristMeasure, setWristMeasure] = useState("");
  const [sizeAdvice, setSizeAdvice] = useState("");

  // Review state
  const [reviews, setReviews] = useState([
    { name: "Phạm Hồng Minh", rating: 5, date: "15/04/2026", text: "Đồng hồ đẹp tuyệt vời, cầm rất nặng tay sắc nét. Giao hàng siêu nhanh đóng gói cực kỳ cẩn thận. Rất ưng ý với Philippe Auguste!" },
    { name: "Nguyễn Hoài Thu", rating: 5, date: "02/05/2026", text: "Mua tặng sinh nhật ông xã, ổng thích mê luôn. Mặt kính Sapphire chống xước tuyệt đối đem đi trà đá va quệt suốt không một vết. Nhân viên phục vụ chu đáo." },
    { name: "Lương Thế Kiên", rating: 4, date: "18/05/2026", text: "Động cơ Automatic chạy ổn định, độ sai số rất nhỏ chỉ khoảng vài giây một ngày. Cót giữ được lâu. Ủng hộ Đăng Quang Watch tiếp các sản phẩm sau." }
  ]);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!id) return;
      setIsDetailLoading(true);

      const found = products.find((p) => p.id === id);
      if (found) {
        if (isMounted) {
          setProduct(found);
          setQuantity(1);
          setIsDetailLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`/api/products/${encodeURIComponent(id)}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        if (isMounted) {
          setProduct(data);
          setQuantity(1);
        }
      } catch {
        if (isMounted) {
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setIsDetailLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, products]);

  if (isDetailLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <RefreshCw className="animate-spin text-yellow-500 mx-auto" size={32} />
        <p className="text-neutral-500 text-sm font-semibold">Đang tìm thông tin chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-neutral-700 text-sm font-bold">Không tìm thấy sản phẩm.</p>
        <Link to="/shop" className="inline-flex rounded bg-yellow-400 px-4 py-2 text-xs font-black text-neutral-950">
          Quay lại danh mục
        </Link>
      </div>
    );
  }

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const isFavorited = isInWishlist(product.id);
  const categoryLabels: Record<string, string> = {
    "dong-ho": "Đồng Hồ",
    "kinh-mat": "Kính Mắt",
    "but-ky": "Bút Ký",
    "phu-kien": "Phụ Kiện"
  };
  const shouldContainProductImage = product.category !== "dong-ho";

  // Suggested accessories or related watches in same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Size helper algorithm
  const handleSizeCalc = (e: React.FormEvent) => {
    e.preventDefault();
    const mm = parseFloat(wristMeasure);
    if (isNaN(mm) || mm <= 0) {
      setSizeAdvice("Vui lòng nhập kích thước hợp lệ.");
      return;
    }
    if (mm < 140) {
      setSizeAdvice("Cổ tay rất nhỏ: Khuyên sử dụng mặt kính 30mm - 34mm.");
    } else if (mm >= 140 && mm < 165) {
      setSizeAdvice("Cổ tay trung bình nhỏ: Khuyên sử dụng mặt kính 36mm - 38mm.");
    } else if (mm >= 165 && mm < 185) {
      setSizeAdvice("Cổ tay vừa đẹp: Có thể thoải mái đeo mặt kính cơ tiêu chuẩn 40mm - 42mm.");
    } else {
      setSizeAdvice("Cổ tay lớn lực lưỡng: Khuyên dùng các mẫu thể thao hầm hố từ 43mm - 45mm.");
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) return;

    const added = {
      name: newReviewName,
      rating: newReviewRating,
      date: new Date().toLocaleDateString("vi-VN"),
      text: newReviewText
    };
    setReviews([added, ...reviews]);
    setNewReviewName("");
    setNewReviewText("");
    alert("Đã gửi đánh giá thành công! Đăng Quang Watch chân thành cảm ơn đóng góp của bạn.");
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  return (
      <div className="max-w-7xl mx-auto px-3 py-5 space-y-8 sm:px-4 sm:py-8 sm:space-y-12">
      {/* Breadcrumb row */}
      <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-2 select-none">
        <Link to="/" className="hover:text-yellow-600">Trang chủ</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-yellow-600">Sản phẩm chính hãng</Link>
        <ChevronRight size={12} />
        <Link to={`/shop?category=${product.category}`} className="hover:text-yellow-600 capitalize">
          {categoryLabels[product.category] || "Sản phẩm"}
        </Link>
        <ChevronRight size={12} />
        <span className="text-neutral-800 font-bold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main product presentation Block */}
      <div className="grid grid-cols-1 gap-6 rounded border border-neutral-200 bg-white p-3 shadow-sm sm:p-8 lg:grid-cols-2 lg:gap-10">
        {/* Left Side: Photo Frame container */}
        <div className="space-y-4">
          <div className={`w-full relative rounded overflow-hidden pt-[100%] border border-neutral-150 ${shouldContainProductImage ? "bg-white p-6" : "bg-neutral-50"}`}>
            <img
              src={product.image}
              alt={product.name}
              className={`absolute inset-0 w-full h-full ${shouldContainProductImage ? "object-contain p-6" : "object-cover"}`}
              referrerPolicy="no-referrer"
            />
            {product.isLimited && (
              <span className="absolute top-4 left-4 bg-amber-500 text-neutral-950 font-black text-[10px] tracking-widest px-3 py-1 rounded uppercase">
                LIMITED EDITION
              </span>
            )}
          </div>

          <div className="overflow-hidden rounded-[8px] border border-neutral-200 bg-white shadow-sm">
            <div className="grid sm:grid-cols-[150px_minmax(0,1fr)]">
              <div className="relative flex min-h-36 items-center justify-center overflow-hidden bg-neutral-950 p-4">
                <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full border border-yellow-400/25" />
                <div className="absolute -bottom-8 -right-6 h-24 w-24 rounded-full bg-yellow-400/20" />
                <div className="absolute inset-x-5 bottom-5 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
                <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-yellow-400 bg-white shadow-[0_18px_36px_rgba(0,0,0,0.34)]">
                  <img
                    src={product.image}
                    alt={`${product.name} - ảnh chính thức`}
                    className={`h-full w-full ${shouldContainProductImage ? "object-contain p-2" : "object-cover"}`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-yellow-700">Bộ nhận diện sản phẩm</div>
                    <div className="mt-1 line-clamp-2 text-sm font-black leading-snug text-neutral-950">{product.name}</div>
                  </div>
                  <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded bg-yellow-400 px-3.5 py-2 text-[11px] font-black uppercase text-neutral-950 shadow-[0_10px_20px_rgba(250,204,21,0.28)]">
                    <ShieldCheck size={14} />
                    Chính hãng
                  </span>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-[6px] border border-neutral-200 bg-neutral-50 px-3 py-2">
                    <div className="text-[10px] font-bold uppercase text-neutral-400">Mã</div>
                    <div className="mt-1 truncate text-xs font-black text-neutral-950">{product.code}</div>
                  </div>
                  <div className="rounded-[6px] border border-neutral-200 bg-neutral-50 px-3 py-2">
                    <div className="text-[10px] font-bold uppercase text-neutral-400">Thương hiệu</div>
                    <div className="mt-1 truncate text-xs font-black text-neutral-950">{product.brand}</div>
                  </div>
                  <div className="rounded-[6px] border border-neutral-200 bg-neutral-50 px-3 py-2">
                    <div className="text-[10px] font-bold uppercase text-neutral-400">Phiên bản</div>
                    <div className="mt-1 truncate text-xs font-black text-neutral-950">{product.size || product.origin}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Configuration & Transaction panel */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest text-yellow-600 bg-yellow-400/10 px-2 py-0.5 rounded uppercase">
                {product.brand}
              </span>
              <span className="text-[10px] font-mono text-neutral-500 font-bold">Mã sản phẩm: {product.code}</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-neutral-900 leading-tight">
              {product.name}
            </h1>

            {/* Stars score */}
            <div className="flex items-center gap-1.5 text-yellow-500 select-none">
              <div className="flex">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
              <span className="text-xs text-neutral-500 font-bold">5.0 (3 đánh giá chính thức)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-neutral-50 p-4 border border-neutral-200 rounded">
            {product.discountPrice ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-red-600 font-mono">
                    {formattedPrice(product.discountPrice)}
                  </span>
                  <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded">
                    GIẢM {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                  </span>
                </div>
                <div className="text-xs text-neutral-400">
                  Giá bán lẻ niêm yết: <span className="line-through">{formattedPrice(product.price)}</span>
                </div>
              </div>
            ) : (
              <span className="text-2xl font-black text-neutral-900 font-mono">
                {formattedPrice(product.price)}
              </span>
            )}
            <p className="text-[10px] text-green-600 font-bold mt-2">✓ Giá đã bao gồm thuế GTGT và bảo hành trọn vẹn 10 năm.</p>
          </div>

          {/* Sizing advisor tools (Expandable size guide calculator) */}
          {product.category === "dong-ho" && (
            <div className="border border-neutral-200 rounded p-3 text-xs bg-yellow-50/20">
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(!isSizeGuideOpen)}
                className="w-full flex justify-between items-center font-bold text-neutral-900 focus:outline-none cursor-pointer"
              >
                <span>📐 Công cụ gợi ý chọn Size cổ tay của Đáng Quang</span>
                <span className="text-yellow-600 font-black">{isSizeGuideOpen ? "[-] Đóng" : "[+] Xem"}</span>
              </button>

              {isSizeGuideOpen && (
                <form onSubmit={handleSizeCalc} className="mt-3 pt-3 border-t border-dashed border-neutral-200 space-y-2">
                  <p className="text-neutral-500 text-[10px]">Nhập chu vi cổ tay của bạn (đơn vị milimet - mm, ví dụ: 155):</p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={wristMeasure}
                      onChange={(e) => setWristMeasure(e.target.value)}
                      placeholder="Ví dụ: 155"
                      className="bg-white border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none max-w-[120px]"
                    />
                    <button
                      type="submit"
                      className="bg-yellow-400 hover:bg-yellow-500 font-bold text-neutral-950 px-3 py-1.5 rounded transition-all cursor-pointer"
                    >
                      Kiểm tra
                    </button>
                  </div>
                  {sizeAdvice && (
                    <div className="bg-yellow-100/50 p-2 border border-yellow-200 text-[11px] font-bold text-neutral-800 rounded mt-1">
                      {sizeAdvice}
                    </div>
                  )}
                </form>
              )}
            </div>
          )}

          {/* Amount and buy Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-500 font-bold">Số lượng đặt mua:</span>
              <div className="flex items-center border border-neutral-300 rounded select-none">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                  className="px-3 py-1.5 hover:bg-neutral-100 font-bold rounded-l cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-1 flex items-center justify-center font-semibold text-xs font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 hover:bg-neutral-100 font-bold rounded-r cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-neutral-900 border border-neutral-900 hover:bg-neutral-800 text-yellow-400 font-extrabold text-sm py-3 px-4 rounded flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingCart size={16} />
                <span>THÊM VÀO GIỎ HÀNG</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-yellow-400 text-neutral-950 font-black text-sm py-3 px-4 rounded hover:bg-yellow-500 transition-colors shadow-md shadow-yellow-400/20 cursor-pointer"
              >
                MUA NGAY - GIAO TẬN NHÀ
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className="bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 text-neutral-700 p-3 rounded"
                title="Lưu vào danh sách yêu thích"
              >
                <Heart size={18} fill={isFavorited ? "#ef4444" : "none"} className={isFavorited ? "text-red-500" : ""} />
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100 text-[11px] text-neutral-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="text-yellow-600" size={15} />
              <span>Bảo hành chính hãng 10 năm</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="text-green-500" size={15} />
              <span>Miễn phí thay pin trọn đời</span>
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshCw className="text-yellow-600" size={15} />
              <span>1 đổi 1 trong 30 ngày (nếu lỗi)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Info className="text-neutral-500" size={15} />
              <span>Bồi thường 1 tỷ nếu hàng giả</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs list: Description, Specifications, Reviews */}
      <div className="space-y-4 select-none">
          <div className="flex gap-1 overflow-x-auto border-b border-neutral-200">
          <button
            onClick={() => setActiveTab("desc")}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "desc"
                ? "border-yellow-400 text-neutral-900 font-extrabold"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Thông tin chi tiết
          </button>
          <button
            onClick={() => setActiveTab("spec")}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "spec"
                ? "border-yellow-400 text-neutral-900 font-extrabold"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Thông số kỹ thuật
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "reviews"
                ? "border-yellow-400 text-neutral-900 font-extrabold"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Đánh giá từ khách hàng ({reviews.length})
          </button>
        </div>

        {/* Tab contents panel */}
        <div className="bg-white border border-neutral-200 rounded p-4 sm:p-6 text-sm text-neutral-700 leading-relaxed min-h-36">
          {activeTab === "desc" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-neutral-900">Tổng quan về: {product.name}</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-700">{product.description}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {getProductDetailCards(product).map((card) => (
                  <div key={card.title} className="rounded-[6px] border border-neutral-200 bg-neutral-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-neutral-900">
                      <CheckCircle size={15} className="text-yellow-600" />
                      {card.title}
                    </div>
                    <p className="text-xs leading-6 text-neutral-600">{card.text}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[6px] border border-yellow-200 bg-yellow-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase text-neutral-950">
                  <Info size={15} className="text-yellow-700" />
                  Chi tiết đáng chú ý
                </div>
                <div className="grid gap-2 text-xs leading-6 text-neutral-700 sm:grid-cols-2">
                  {getProductDetailPoints(product).map((point) => (
                    <div key={point} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "spec" && (
            <div className="max-w-md space-y-2">
              <div className="overflow-x-auto">
              <table className="min-w-[560px] w-full text-xs text-neutral-600 border-collapse">
                <tbody>
                  <tr className="border-b border-neutral-100">
                    <td className="py-2.5 font-bold text-neutral-800 w-1/3">Thương hiệu</td>
                    <td className="py-2.5 uppercase">{product.brand}</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-2.5 font-bold text-neutral-800">Mã sản phẩm</td>
                    <td className="py-2.5 font-mono">{product.code}</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-2.5 font-bold text-neutral-800">Xuất xứ sản phẩm</td>
                    <td className="py-2.5">{product.origin}</td>
                  </tr>
                  {product.target && (
                    <tr className="border-b border-neutral-100">
                      <td className="py-2.5 font-bold text-neutral-800">Đối tượng phục vụ</td>
                      <td className="py-2.5">{product.target}</td>
                    </tr>
                  )}
                  {product.size && (
                    <tr className="border-b border-neutral-100">
                      <td className="py-2.5 font-bold text-neutral-800">Kích thước mặt số</td>
                      <td className="py-2.5">{product.size}</td>
                    </tr>
                  )}
                  {product.glassMaterial !== undefined && (
                    <tr className="border-b border-neutral-100">
                      <td className="py-2.5 font-bold text-neutral-800">Chất liệu thấu kính</td>
                      <td className="py-2.5">
                        {product.glassMaterial ? "Sapphire nguyên khối chống lóa đỉnh cao" : "Kính khoáng cường lực Mineral"}
                      </td>
                    </tr>
                  )}
                  {product.caseMaterial !== undefined && (
                    <tr className="border-b border-neutral-100">
                      <td className="py-2.5 font-bold text-neutral-800">Chất liệu vỏ bọc</td>
                      <td className="py-2.5">
                        {product.caseMaterial ? "Thép không gỉ 316L mạ màu PVD" : "Kim loại Alloy bền màu"}
                      </td>
                    </tr>
                  )}
                  {product.waterResistance && (
                    <tr className="border-b border-neutral-100">
                      <td className="py-2.5 font-bold text-neutral-800">Khả năng kháng nước</td>
                      <td className="py-2.5 font-mono">{product.waterResistance}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8">
              {/* Feedback list */}
              <div className="space-y-4">
                {reviews.map((rev, i) => (
                  <div key={i} className="border-b border-neutral-150 pb-4 space-y-2 last:border-none last:pb-0">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-neutral-900">{rev.name}</span>
                      <span className="text-neutral-400 font-mono">{rev.date}</span>
                    </div>
                    {/* Stars count indicator */}
                    <div className="flex text-yellow-500">
                      {Array.from({ length: rev.rating }).map((_, st) => (
                        <Star key={st} size={11} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-neutral-600 text-xs sm:text-sm">{rev.text}</p>
                  </div>
                ))}
              </div>

              {/* Review submit form */}
              <div className="bg-neutral-50 p-4 border border-neutral-200 rounded space-y-3">
                <span className="font-bold text-neutral-900 text-xs sm:text-sm block uppercase">✍️ Viết đánh giá của bạn</span>
                <form onSubmit={handleAddReview} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-neutral-500 block">Họ & Tên khách hàng:</span>
                      <input
                        type="text"
                        required
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-neutral-500 block">Số điểm chấm sao:</span>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="bg-white border border-neutral-300 rounded px-3 py-2 text-xs focus:outline-none w-28 font-medium"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ 5 Sao</option>
                        <option value="4">⭐⭐⭐⭐ 4 Sao</option>
                        <option value="3">⭐⭐⭐ 3 Sao</option>
                        <option value="2">⭐⭐ 2 Sao</option>
                        <option value="1">⭐ 1 Sao</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-neutral-500 block">Lời đánh giá khách quan:</span>
                    <textarea
                      required
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm sử dụng thực tế sản phẩm (độ bóng, độ đúng giờ, sự chu đáo showroom...)"
                      rows={3}
                      className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-neutral-900 hover:bg-neutral-800 text-yellow-400 font-extrabold text-xs px-5 py-2 rounded transition-all cursor-pointer"
                  >
                    GỬI ĐÁNH GIÁ CHẤT LƯỢNG
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested related watches recommendations */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="border-b-2 border-neutral-200 pb-3">
            <h2 className="text-md sm:text-lg font-black text-neutral-950 uppercase tracking-tight flex items-center gap-1.5">
              <span>💎 Có thể bạn cũng yêu thích các mẫu này</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
