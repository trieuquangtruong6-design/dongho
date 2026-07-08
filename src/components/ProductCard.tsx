import React from "react";
import { Link } from "react-router-dom";
import { Droplets, Gem, Heart, Ruler, Shield, ShoppingCart } from "lucide-react";
import { Product } from "../types";
import { useStore } from "../contexts/StoreContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const formattedPrice = (price: number) =>
    `${new Intl.NumberFormat("vi-VN").format(price)} đ`;

  const isFavorited = isInWishlist(product.id);
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const localizedProductName = product.name
    .replace(/\bAutomatic\b/g, "Tự động")
    .replace(/\bQuartz\/Pin\b/g, "Pin")
    .replace(/\bSize\b/g, "Cỡ");
  const isPenProduct = product.category === "but-ky";
  const shouldContainImage = isPenProduct;

  return (
    <div
      id={`product-card-${product.id}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[10px] border transition-all duration-300 hover:-translate-y-1 ${
        isPenProduct
          ? "border-[#d8d0c1] bg-[#eeeae1] shadow-[0_8px_22px_rgba(20,20,20,0.13)] hover:shadow-[0_18px_38px_rgba(20,20,20,0.20)]"
          : "border-black/5 bg-[#fbfaf7] shadow-[0_8px_20px_rgba(20,20,20,0.15)] hover:shadow-[0_16px_34px_rgba(20,20,20,0.20)]"
      }`}
    >
      <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col gap-1 select-none sm:left-4 sm:top-4 sm:gap-1.5">
        {product.isNew && (
          <span className="flex h-5 min-w-[34px] items-center justify-center rounded-[4px] border border-white/60 bg-[linear-gradient(135deg,#f6e9b8_0%,#b7943b_58%,#8a6b21_100%)] px-1.5 text-[8px] font-medium uppercase text-[#1b160b] shadow-[0_4px_9px_rgba(0,0,0,0.18)] sm:h-7 sm:min-w-[42px] sm:rounded-[5px] sm:px-2 sm:text-[10px]">
            MỚI
          </span>
        )}
        {product.isLimited && (
          <span className="flex h-5 min-w-[42px] items-center justify-center rounded-[4px] border border-white/70 bg-[linear-gradient(135deg,#ffffff_0%,#cbc7bd_54%,#8b877c_100%)] px-1.5 text-[7px] font-bold uppercase text-[#171717] shadow-[0_4px_9px_rgba(0,0,0,0.16)] sm:h-7 sm:min-w-[50px] sm:rounded-[5px] sm:px-2 sm:text-[8px]">
            GIỚI HẠN
          </span>
        )}
        {discountPercent > 0 && (
          <span className="w-fit rounded-[3px] bg-[#d60000] px-1.5 py-0.5 text-[8px] font-black text-white shadow-sm sm:px-2 sm:text-[9px]">
            -{discountPercent}%
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute right-2 top-2 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 active:scale-95 sm:right-4 sm:top-4 sm:h-9 sm:w-9 ${
          isFavorited
            ? "border-red-200 bg-red-50/95 text-red-500 shadow-[0_8px_18px_rgba(185,28,28,0.18)]"
            : "border-white/70 bg-white/72 text-[#1f1f1f] shadow-[0_8px_18px_rgba(0,0,0,0.14)] hover:border-red-100 hover:bg-white hover:text-red-500 hover:shadow-[0_10px_22px_rgba(185,28,28,0.16)]"
        }`}
        title={isFavorited ? "Xóa khỏi danh sách yêu thích" : "Yêu thích sản phẩm"}
      >
        <Heart
          size={19}
          strokeWidth={1.9}
          fill={isFavorited ? "#ef4444" : "none"}
          className={isFavorited ? "text-red-500" : ""}
        />
      </button>

      <Link
        to={`/product/${product.id}`}
        className={`relative block aspect-[0.98/1] overflow-hidden sm:aspect-[1.08/1] ${
          isPenProduct
            ? "bg-[radial-gradient(circle_at_50%_42%,#ffffff_0%,#f3efe6_48%,#ded7ca_100%)] p-2 sm:p-4"
            : shouldContainImage
              ? "bg-white p-2 sm:p-4"
              : "bg-[#f4f2ed]"
        }`}
      >
        <img
          src={product.image}
          alt={localizedProductName}
          className={`absolute inset-0 h-full w-full object-center transition-transform duration-500 ${
            isPenProduct
              ? "object-contain p-3 mix-blend-multiply brightness-95 contrast-125 saturate-110 drop-shadow-[0_18px_16px_rgba(0,0,0,0.26)] group-hover:scale-[1.08] sm:p-5"
              : `filter brightness-110 contrast-110 saturate-110 group-hover:scale-[1.045] ${shouldContainImage ? "object-contain p-2 sm:p-4" : "object-cover"}`
          }`}
          loading="eager"
          decoding="sync"
          referrerPolicy="no-referrer"
        />
        {isPenProduct ? (
          <>
            <div className="absolute inset-x-6 bottom-8 h-8 rounded-full bg-black/10 blur-xl transition-opacity group-hover:opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/[0.07] via-transparent to-white/[0.02]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-black/[0.03] via-transparent to-white/[0.03]" />
        )}
      </Link>

      <div className={`flex flex-1 flex-col px-2.5 pb-2.5 pt-2 sm:px-4 sm:pb-3.5 sm:pt-3 ${isPenProduct ? "bg-[#eeeae1]" : "bg-[#fbfaf7]"}`}>
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-end justify-between gap-2 border-b border-[#1b1b1b]/45 pb-1 text-[#111111]">
            <span className="truncate font-serif text-[13px] font-medium leading-none sm:text-[16px]">
              {product.brand}
            </span>
            <span className="hidden whitespace-nowrap text-[10.5px] font-medium text-[#333333] sm:block">
              Mã: {product.code}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 text-[9.5px] font-bold uppercase tracking-[0.04em] text-[#8a7b62] sm:hidden">
            <span className="truncate">Mã: {product.code}</span>
            {product.category === "dong-ho" && <span className="shrink-0 text-[#9b7a2c]">{product.waterResistance || "5 ATM"}</span>}
          </div>

          <Link
            to={`/product/${product.id}`}
            className="block min-h-[34px] text-[12px] font-semibold leading-[1.28] text-[#111111] line-clamp-2 transition-colors hover:text-[#9b7a2c] sm:min-h-[36px] sm:text-[13px] sm:leading-[1.3]"
          >
            {localizedProductName}
          </Link>

          {product.category === "dong-ho" && (
            <div className="hidden grid-cols-2 overflow-hidden rounded-[4px] border border-[#c8c1b4] bg-[#d9d4ca] text-[10px] text-[#211f1a] shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] sm:grid">
              <div className="flex items-center gap-1.5 truncate border-b border-r border-[#bdb5a7] px-2 py-1">
                <Ruler size={14} className="shrink-0 rounded-full bg-[#f6f0df] p-0.5 text-[#9b7a2c]" />
                <span className="truncate">Cỡ: {product.size || "38 mm"}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate border-b border-[#bdb5a7] px-2 py-1">
                <Gem size={14} className="shrink-0 rounded-full bg-[#f6f0df] p-0.5 text-[#9b7a2c]" />
                <span className="truncate">Kính: {product.glassMaterial ? "Sapphire" : "Cường lực"}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate border-r border-[#bdb5a7] px-2 py-1">
                <Shield size={14} className="shrink-0 rounded-full bg-[#f6f0df] p-0.5 text-[#9b7a2c]" />
                <span className="truncate">Vỏ: {product.caseMaterial ? "Thép 316L" : "Kim loại"}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate px-2 py-1">
                <Droplets size={14} className="shrink-0 rounded-full bg-[#f6f0df] p-0.5 text-[#9b7a2c]" />
                <span className="truncate">Nước: {product.waterResistance || "5 ATM"}</span>
              </div>
            </div>
          )}

          {product.origin && (
            <div className="hidden text-[10.5px] text-[#7a7165] sm:block">
              Xuất xứ: <span className="font-semibold text-[#333333]">{product.origin}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-1 sm:hidden">
            <span className="rounded-[3px] bg-[#f1ead8] px-1.5 py-0.5 text-[9px] font-black uppercase text-[#7a5a12]">
              Chính hãng
            </span>
            <span className="rounded-[3px] bg-[#f1ead8] px-1.5 py-0.5 text-[9px] font-black uppercase text-[#7a5a12]">
              Bảo hành
            </span>
          </div>
        </div>

        <div className="mt-auto pt-2 sm:pt-3">
          <div className="flex flex-col items-stretch gap-2 border-t border-[#d9d4ca] pt-2 sm:flex-row sm:items-end sm:gap-3 sm:pt-2.5">
            <div className="min-w-0 flex-1 sm:min-w-[132px]">
              {product.discountPrice ? (
                <div className="flex flex-col">
                  <span className="truncate font-mono text-[14px] font-black leading-none text-[#9e1111] sm:whitespace-nowrap sm:text-[17px]">
                    {formattedPrice(product.discountPrice)}
                  </span>
                  <span className="mt-1 truncate text-[9.5px] leading-none text-[#777] line-through sm:whitespace-nowrap sm:text-[10.5px]">
                    {formattedPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="block truncate font-mono text-[14px] font-black leading-none text-[#111111] sm:whitespace-nowrap sm:text-[17px]">
                  {formattedPrice(product.price)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="flex h-8 w-full shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#b58d2f] bg-[linear-gradient(180deg,#e5c75f_0%,#c79b28_100%)] px-3 text-[11px] font-bold text-[#16120a] shadow-[inset_0_1px_0_rgba(255,255,255,0.58),0_5px_12px_rgba(80,61,14,0.20)] transition-all hover:brightness-105 hover:shadow-[0_8px_16px_rgba(80,61,14,0.24)] active:scale-[0.98] sm:w-auto sm:px-4 sm:text-[12px]"
            >
              <ShoppingCart size={14} strokeWidth={2} />
              <span className="sm:hidden">Thêm</span>
              <span className="hidden sm:inline">Thêm giỏ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
