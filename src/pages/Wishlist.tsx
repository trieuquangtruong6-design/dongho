import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../contexts/StoreContext";
import ProductCard from "../components/ProductCard";
import { Heart, ArrowLeft } from "lucide-react";

export default function Wishlist() {
  const { wishlist } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 select-none">
        <Heart className="mx-auto text-neutral-300 w-16 h-16" />
        <h2 className="text-lg font-black text-neutral-800 uppercase">Danh sách yêu thích trống!</h2>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          Đánh dấu thả tim ❤ bất kỳ mẫu đồng hồ hay kính mắt sang trọng nào khi tham quan để ghi nhớ và tra cứu nhanh tại đây.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-black text-xs px-6 py-3 rounded inline-block uppercase"
          >
            Quay lại chọn đồng hồ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 select-none">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-neutral-900 uppercase tracking-tight flex items-center gap-1.5">
            <span>❤️ Bộ Sưu Tập Đồng Hồ Yêu Thích Của Bạn</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Lưu trữ tối đa các mẫu đồng hồ dạo mát của bạn.</p>
        </div>
        <Link
          to="/shop"
          className="text-xs text-neutral-600 hover:text-yellow-600 font-bold flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          <span>Quay lại cửa hàng</span>
        </Link>
      </div>

      {/* Grid displays items */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
