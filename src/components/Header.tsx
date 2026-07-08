import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../contexts/StoreContext";
import { CartItem, Product } from "../types";
import { ShoppingCart, Heart, Search, User, LogOut, Menu, X, Phone, MapPin } from "lucide-react";

const WATCH_BRANDS = [
  { name: "Epos Swiss", logoSrc: "/images/2 (4).png" },
  { name: "Jacques Lemans", logoSrc: "/images/2 (5).png" },
  { name: "Aries Gold", logoSrc: "/images/2.png" },
  { name: "Diamond D", logoSrc: "/images/2 (3).png" },
  { name: "Philippe Auguste", logoSrc: "/images/2 (6).png" },
  { name: "Atlantic Swiss", logoSrc: "/images/2 (2).png" },
  { name: "Tsar Bomba", logoSrc: "/images/2 (1).png" }
];

const MOBILE_QUICK_LINKS = [
  { label: "Đồng hồ nam", to: "/shop?category=dong-ho&target=Nam" },
  { label: "Đồng hồ nữ", to: "/shop?category=dong-ho&target=Nữ" },
  { label: "Đồng hồ đôi", to: "/shop?search=đồng%20hồ%20đôi" },
  { label: "Limited", to: "/shop?tag=limited" }
];

export default function Header() {
  const { cart, wishlist, currentUser, logout, products } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/shop");
    }
    setIsMobileMenuOpen(false);
    setIsSearchFocused(false);
  };

  const handleBrandNavigate = (brand: string) => {
    setIsCategoryOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/shop?category=dong-ho&brand=${encodeURIComponent(brand)}`);
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const categorySuggestions = [
    { label: "Đồng hồ", to: "/shop?category=dong-ho" },
    { label: "Kính mắt", to: "/shop?category=kinh-mat" },
    { label: "Phụ kiện", to: "/shop?category=phu-kien" },
    { label: "Bút ký", to: "/shop?category=but-ky" }
  ].filter((item) => item.label.toLowerCase().includes(normalizedSearch));

  const brandSuggestions = Array.from(new Set(products.map((product) => product.brand)))
    .filter((brand) => brand.toLowerCase().includes(normalizedSearch))
    .slice(0, 5);

  const productSuggestions = products
    .filter((product) => {
      const haystack = `${product.name} ${product.brand} ${product.code} ${product.description}`.toLowerCase();
      return normalizedSearch.length > 0 && haystack.includes(normalizedSearch);
    })
    .slice(0, 6);

  const showSearchSuggestions =
    isSearchFocused &&
    normalizedSearch.length > 0 &&
    (categorySuggestions.length > 0 || brandSuggestions.length > 0 || productSuggestions.length > 0);

  const formattedPrice = (price: number) => `${new Intl.NumberFormat("vi-VN").format(price)} đ`;

  const PreviewPanel = ({
    title,
    items,
    totalCount,
    emptyText,
    to,
    actionLabel,
    showQuantity = false
  }: {
    title: string;
    items: { product: Product; quantity?: number }[];
    totalCount: number;
    emptyText: string;
    to: string;
    actionLabel: string;
    showQuantity?: boolean;
  }) => (
    <div className="pointer-events-none absolute right-0 top-full z-[80] w-[360px] translate-y-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-2 group-hover:opacity-100">
      <div className="overflow-hidden rounded-[8px] border border-neutral-200 bg-white text-neutral-950 shadow-[0_18px_48px_rgba(0,0,0,0.32)]">
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-3">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-neutral-500">{title}</div>
            <div className="mt-0.5 text-xs font-bold text-neutral-900">{totalCount} sản phẩm đang lưu</div>
          </div>
          <span className="rounded-full bg-yellow-400 px-2.5 py-1 text-[11px] font-black text-black">{totalCount}</span>
        </div>

        {items.length > 0 ? (
          <div className="max-h-[330px] overflow-y-auto py-1">
            {items.map(({ product, quantity }) => {
              const price = product.discountPrice || product.price;
              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 px-4 py-3 text-left transition-colors hover:bg-yellow-50"
                >
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[6px] border border-neutral-200 bg-neutral-50">
                    <img src={product.image} alt={product.name} className="h-full w-full object-contain p-1" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0">
                    <div className="line-clamp-2 text-xs font-black leading-snug text-neutral-950">{product.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-neutral-500">
                      <span className="truncate">{product.brand}</span>
                      {showQuantity && <span className="shrink-0 text-neutral-700">SL: {quantity}</span>}
                    </div>
                    <div className="mt-1.5 text-sm font-black text-red-600">{formattedPrice(price)}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="px-4 py-6 text-center text-sm font-bold text-neutral-500">{emptyText}</div>
        )}

        <div className="border-t border-neutral-100 bg-white p-3">
          <Link
            to={to}
            className="flex h-10 items-center justify-center rounded-[4px] bg-neutral-950 text-sm font-black uppercase text-yellow-400 transition-colors hover:bg-yellow-400 hover:text-black"
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );

  const goToSearchSuggestion = (to: string) => {
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
    navigate(to);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishCount = wishlist.length;
  const cartPreview: CartItem[] = cart.slice(0, 4);
  const wishlistPreview = wishlist.slice(0, 4).map((product) => ({ product }));
  const navIconClass = "h-4 w-4 shrink-0 object-contain";

  return (
    <header className="w-full text-white sticky top-0 z-50 shadow-md select-none border-none rounded-none p-0">
      <div className="bg-black md:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-3">
          <Link to="/" className="min-w-0" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="truncate text-[19px] font-extrabold leading-none tracking-wide text-yellow-500">
              ĐĂNG QUANG WATCH
            </div>
            <div className="mt-1 truncate text-[8px] font-black uppercase tracking-[0.12em] text-neutral-400">
              Đồng hồ chính hãng cao cấp
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              to={currentUser ? "/account" : "/login"}
              aria-label="Tài khoản"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-yellow-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User size={18} strokeWidth={2.4} />
            </Link>
            <Link
              to="/cart"
              aria-label="Giỏ hàng"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-yellow-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShoppingCart size={18} strokeWidth={2.4} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black leading-none text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-yellow-400 text-black"
            >
              {isMobileMenuOpen ? <X size={21} strokeWidth={2.6} /> : <Menu size={21} strokeWidth={2.6} />}
            </button>
          </div>
        </div>

        <div className="border-t border-neutral-900 px-3 pb-3">
          <div className="relative z-50">
            <form onSubmit={handleSearchSubmit} className="flex h-10 overflow-hidden bg-white">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => window.setTimeout(() => setIsSearchFocused(false), 160)}
                placeholder="Tìm kiếm đồng hồ"
                className="min-w-0 flex-1 border-none px-3 text-[13px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Tìm kiếm"
                className="flex h-full w-12 cursor-pointer items-center justify-center bg-yellow-400 text-black"
              >
                <Search size={17} strokeWidth={2.6} />
              </button>
            </form>

            {showSearchSuggestions && (
              <div
                onMouseDown={(event) => event.preventDefault()}
                className="absolute left-0 right-0 top-[calc(100%+6px)] max-h-[70vh] overflow-y-auto rounded-[6px] border border-neutral-200 bg-white text-neutral-900 shadow-[0_18px_44px_rgba(0,0,0,0.30)]"
              >
                {(categorySuggestions.length > 0 || brandSuggestions.length > 0) && (
                  <div className="border-b border-neutral-100 bg-neutral-50 px-3 py-3">
                    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">Gợi ý nhanh</div>
                    <div className="flex flex-wrap gap-2">
                      {categorySuggestions.map((item) => (
                        <button
                          type="button"
                          key={item.to}
                          onClick={() => goToSearchSuggestion(item.to)}
                          className="rounded-full border border-yellow-300 bg-yellow-50 px-3 py-1.5 text-[11px] font-black text-neutral-900"
                        >
                          {item.label}
                        </button>
                      ))}
                      {brandSuggestions.map((brand) => (
                        <button
                          type="button"
                          key={brand}
                          onClick={() => goToSearchSuggestion(`/shop?brand=${encodeURIComponent(brand)}`)}
                          className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-black text-neutral-800"
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {productSuggestions.length > 0 ? (
                  <div className="py-1">
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">Sản phẩm phù hợp</div>
                    {productSuggestions.map((product) => {
                      const price = product.discountPrice || product.price;
                      return (
                        <button
                          type="button"
                          key={product.id}
                          onClick={() => goToSearchSuggestion(`/product/${product.id}`)}
                          className="grid w-full grid-cols-[50px_minmax(0,1fr)] gap-3 px-3 py-2 text-left"
                        >
                          <div className="flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded border border-neutral-200 bg-neutral-50">
                            <img src={product.image} alt={product.name} className="h-full w-full object-contain p-1" referrerPolicy="no-referrer" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-xs font-black text-neutral-950">{product.name}</div>
                            <div className="mt-1 truncate text-[10px] font-bold text-neutral-500">{product.brand} - Mã: {product.code}</div>
                            <div className="mt-1 text-xs font-black text-red-600">{formattedPrice(price)}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => goToSearchSuggestion(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-xs font-bold text-neutral-700"
                  >
                    <span className="min-w-0 truncate">Tìm tất cả với "{searchQuery.trim()}"</span>
                    <span className="shrink-0 text-yellow-600">›</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-neutral-900 bg-[#070707] px-3 pb-4 pt-3 shadow-[0_18px_38px_rgba(0,0,0,0.32)]">
            <div className="mb-3 grid grid-cols-2 gap-2">
              {MOBILE_QUICK_LINKS.map((item) => (
                <Link
                  key={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  to={item.to}
                  className="border border-yellow-400/30 bg-yellow-400/10 px-3 py-2.5 text-center text-[11px] font-black uppercase tracking-[0.08em] text-yellow-400"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/category/dong-ho" className="bg-yellow-400 px-3 py-3 text-center text-[12px] font-black uppercase text-black">Đồng hồ</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/category/kinh-mat" className="bg-yellow-400 px-3 py-3 text-center text-[12px] font-black uppercase text-black">Kính mắt</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/category/phu-kien" className="bg-yellow-400 px-3 py-3 text-center text-[12px] font-black uppercase text-black">Phụ kiện</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/category/but-ky" className="bg-yellow-400 px-3 py-3 text-center text-[12px] font-black uppercase text-black">Bút ký</Link>
            </div>

            <div className="mt-4 border border-neutral-800 bg-black">
              <div className="flex items-center justify-between border-b border-neutral-800 px-3 py-2">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-yellow-400">Thương hiệu đồng hồ</span>
                <Link
                  onClick={() => setIsMobileMenuOpen(false)}
                  to="/shop?category=dong-ho"
                  className="text-[10px] font-black uppercase text-neutral-400"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2">
                {WATCH_BRANDS.map((brand) => (
                  <button
                    type="button"
                    key={brand.name}
                    onClick={() => handleBrandNavigate(brand.name)}
                    className="flex h-[58px] cursor-pointer items-center justify-center border border-neutral-800 bg-white px-3"
                    title={brand.name}
                  >
                    <img src={brand.logoSrc} alt={`${brand.name} logo`} className="max-h-8 max-w-full object-contain" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 grid gap-2 text-[12px] font-bold text-neutral-200">
              <Link onClick={() => setIsMobileMenuOpen(false)} to={currentUser ? "/account" : "/login"} className="flex items-center justify-between border border-neutral-800 bg-neutral-950 px-3 py-3">
                <span>{currentUser ? "Tài khoản của tôi" : "Đăng nhập / Đăng ký"}</span>
                <span className="text-yellow-400">›</span>
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/about" className="flex items-center justify-between border border-neutral-800 px-3 py-3">Giới thiệu <span className="text-yellow-400">›</span></Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/warranty" className="flex items-center justify-between border border-neutral-800 px-3 py-3">Bảo hành <span className="text-yellow-400">›</span></Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/contact" className="flex items-center justify-between border border-neutral-800 px-3 py-3">Liên hệ <span className="text-yellow-400">›</span></Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/wishlist" className="flex items-center justify-between border border-neutral-800 px-3 py-3">Yêu thích ({wishCount}) <span className="text-yellow-400">›</span></Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/shop" className="flex items-center gap-2 border border-neutral-800 px-3 py-3">
                <MapPin size={15} className="text-yellow-400" />
                Hệ thống cửa hàng
              </Link>
              <a href="tel:18006005" className="flex items-center gap-2 border border-neutral-800 px-3 py-3">
                <Phone size={15} className="text-yellow-400" />
                Hotline 1800 6005
              </a>
            </div>
          </div>
        )}
      </div>
      
      {/* Strict #000000 pure black main header block */}
      <div className="hidden bg-[#000000] w-full border-none rounded-none md:block">
        
        {/* Subtle, sleek credentials utility line embedded at the top edge of the black bar for high usability */}
        <div className="max-w-7xl mx-auto px-4 pt-1.5 pb-1 flex justify-between items-center text-[10px] text-neutral-400 border-b border-neutral-900/30">
          <span className="text-neutral-500 font-medium">Hệ thống phân phối đồng hồ Thụy Sỹ chính hãng cao cấp</span>
          <div className="flex items-center gap-3">
            {/* Wishlist module */}
            <div className="group relative">
              <Link to="/wishlist" className="flex items-center gap-1 transition-colors hover:text-red-500">
                <Heart size={10} className={wishCount > 0 ? "fill-red-600 text-red-600" : ""} />
                <span>Yêu thích ({wishCount})</span>
              </Link>
              <PreviewPanel
                title="Sản phẩm yêu thích"
                items={wishlistPreview}
                totalCount={wishCount}
                emptyText="Bạn chưa lưu sản phẩm yêu thích nào."
                to="/wishlist"
                actionLabel="Xem yêu thích"
              />
            </div>
            <span className="text-neutral-800">|</span>
            {/* Administration portal */}
            <Link to="/admin" className="text-yellow-500 hover:text-yellow-400 font-bold uppercase transition-all">
              Quản trị viên
            </Link>
          </div>
        </div>

        {/* Core Main Bar container */}
        <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-4 bg-[#000000] px-5 py-4 xl:flex-row xl:gap-6">
          
          {/* Company Brand Logo Block with absolute alignment */}
          <Link to="/" className="group flex w-full shrink-0 flex-col items-start gap-0.5 xl:w-[380px]">
            <h1 className="whitespace-nowrap font-sans text-[26px] font-extrabold leading-none tracking-[0.04em] text-yellow-500 lg:text-[32px]">
              ĐĂNG QUANG WATCH
            </h1>
            <span className="mt-1.5 whitespace-nowrap text-[9px] font-black uppercase leading-none tracking-widest text-[#999999]">
              Đẳng Cấp Doanh Nhân - Phong Cách Thượng Lưu
            </span>
          </Link>

          {/* Search with autocomplete suggestions */}
          <div className="relative z-50 w-full xl:w-[360px] xl:shrink-0">
            <form onSubmit={handleSearchSubmit} className="flex h-10 items-stretch overflow-hidden rounded-none border-none p-0 shadow-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => window.setTimeout(() => setIsSearchFocused(false), 160)}
                placeholder="Nhập từ khóa..."
                className="h-full min-w-0 flex-1 rounded-none border-none bg-white px-4 text-sm font-medium leading-none text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
              <button
                type="submit"
                className="flex h-full min-w-[124px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-none border-none bg-[#FFD700] px-4 text-sm font-black text-black outline-none transition-all hover:bg-[#ffe136]"
              >
                <Search size={14} strokeWidth={2.6} />
                Tìm kiếm
              </button>
            </form>

            {showSearchSuggestions && (
              <div
                onMouseDown={(event) => event.preventDefault()}
                className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-[8px] border border-neutral-200 bg-white text-neutral-900 shadow-[0_18px_46px_rgba(0,0,0,0.28)]"
              >
                {(categorySuggestions.length > 0 || brandSuggestions.length > 0) && (
                  <div className="border-b border-neutral-100 bg-neutral-50 px-3 py-3">
                    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">Gợi ý nhanh</div>
                    <div className="flex flex-wrap gap-2">
                      {categorySuggestions.map((item) => (
                        <button
                          type="button"
                          key={item.to}
                          onClick={() => goToSearchSuggestion(item.to)}
                          className="rounded-full border border-yellow-300 bg-yellow-50 px-3 py-1.5 text-[11px] font-black text-neutral-900 transition-colors hover:bg-yellow-400"
                        >
                          {item.label}
                        </button>
                      ))}
                      {brandSuggestions.map((brand) => (
                        <button
                          type="button"
                          key={brand}
                          onClick={() => goToSearchSuggestion(`/shop?brand=${encodeURIComponent(brand)}`)}
                          className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-black text-neutral-800 transition-colors hover:border-yellow-400 hover:text-yellow-700"
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {productSuggestions.length > 0 ? (
                  <div className="max-h-[360px] overflow-y-auto py-1">
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">Sản phẩm phù hợp</div>
                    {productSuggestions.map((product) => {
                      const price = product.discountPrice || product.price;
                      return (
                        <button
                          type="button"
                          key={product.id}
                          onClick={() => goToSearchSuggestion(`/product/${product.id}`)}
                          className="grid w-full grid-cols-[54px_minmax(0,1fr)] gap-3 px-3 py-2 text-left transition-colors hover:bg-yellow-50"
                        >
                          <div className="flex h-[54px] w-[54px] items-center justify-center overflow-hidden rounded border border-neutral-200 bg-neutral-50">
                            <img src={product.image} alt={product.name} className="h-full w-full object-contain p-1" referrerPolicy="no-referrer" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-xs font-black text-neutral-950">{product.name}</div>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-bold text-neutral-500">
                              <span>{product.brand}</span>
                              <span>Mã: {product.code}</span>
                            </div>
                            <div className="mt-1 text-xs font-black text-red-600">{formattedPrice(price)}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => goToSearchSuggestion(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-xs font-bold text-neutral-700 hover:bg-yellow-50"
                  >
                    <span>Tìm tất cả với "{searchQuery.trim()}"</span>
                    <span className="text-yellow-600">›</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Classic Action Area on the Right with yellow highlights and sharp vertical borders */}
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-0 text-xs text-neutral-300 xl:flex-nowrap xl:justify-end">
            
            {/* Giỏ hàng action widget */}
            <div className="group relative">
              <Link to="/cart" className="flex h-12 min-w-[104px] cursor-pointer items-center gap-2 border-r border-[#333333] px-2.5">
                <div className="text-[#FFD700] transition-all group-hover:scale-105">
                  <ShoppingCart size={20} className="stroke-[2.5]" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[10px] text-neutral-400 uppercase">Giỏ hàng</span>
                  <span className="mt-0.5 block text-xs font-black text-white transition-colors group-hover:text-[#FFD700]">
                    Giỏ hàng ({cartCount})
                  </span>
                </div>
              </Link>
              <PreviewPanel
                title="Giỏ hàng của bạn"
                items={cartPreview}
                totalCount={cartCount}
                emptyText="Giỏ hàng đang trống."
                to="/cart"
                actionLabel="Xem giỏ hàng"
                showQuantity
              />
            </div>

            {/* Hotline action widget */}
            <div className="flex h-12 min-w-[122px] items-center gap-2 border-r border-[#333333] px-2.5">
              <div className="text-[#FFD700]">
                {/* Vintage Styled Phone SVG Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[10px] text-neutral-400 uppercase">Hotline mua hàng</span>
                <span className="block text-xs font-black text-[#FFD700] mt-0.5">1800 6005</span>
              </div>
            </div>

            {/* Store Network Finder widget */}
            <Link to="/shop" className="group flex h-12 min-w-[132px] items-center gap-2 border-r border-[#333333] px-2.5 text-neutral-300 transition-colors hover:text-white">
              <div className="text-[#FFD700]">
                {/* GPS Pin icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[10px] text-neutral-400 uppercase">Hệ thống cửa hàng</span>
                <span className="block text-xs font-black text-[#FFD700] mt-0.5">63 tỉnh thành</span>
              </div>
            </Link>

            {/* Customer account widget */}
            {currentUser ? (
              <div className="ml-2.5 flex h-12 max-w-[220px] items-center gap-2 rounded-[3px] border border-neutral-800 bg-neutral-950/70 px-2.5">
                <Link to="/account" className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFD700] text-black">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <User size={18} strokeWidth={2.4} />
                    )}
                  </div>
                  <div className="min-w-0 text-left leading-tight">
                    <span className="block text-[10px] uppercase text-neutral-400">Tài khoản của tôi</span>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="max-w-[88px] truncate text-xs font-black text-white">
                        {currentUser.name}
                      </span>
                      <span className={`shrink-0 rounded-[2px] px-1.5 py-0.5 text-[9px] font-black leading-none ${
                        currentUser.membership === "VIP"
                          ? "bg-amber-500 text-neutral-950"
                          : "bg-neutral-800 text-neutral-200"
                      }`}>
                        {currentUser.membership}
                      </span>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded border border-neutral-800 text-neutral-400 transition-colors hover:border-red-500 hover:text-red-500"
                  title="Đăng xuất"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2.5 flex h-12 items-center gap-2 rounded-[3px] border border-neutral-800 bg-neutral-950/70 px-3 text-neutral-300 transition-colors hover:border-[#FFD700] hover:text-white"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD700] text-black">
                  <User size={18} strokeWidth={2.4} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[10px] uppercase text-neutral-400">Tài khoản</span>
                  <span className="block text-xs font-black text-white">Đăng nhập / Đăng ký</span>
                </div>
              </Link>
            )}

          </div>
        </div>

      </div>

      {/* Navigation bar with full-width bright yellow (#FFD700) background & bold text */}
      <nav className="hidden bg-[#FFD700] text-black font-extrabold text-[12px] select-none border-none rounded-none p-0 shadow-sm md:block">
        <div className="mx-auto flex max-w-[1500px] flex-col items-stretch md:h-14 md:flex-row">
          
          {/* DANH MỤC SẢN PHẨM block with dropdown brand selector */}
          <div className="relative z-40">
            <button
              type="button"
              onClick={() => setIsCategoryOpen((open) => !open)}
              className="flex h-full min-w-[254px] cursor-pointer items-center justify-center gap-2 rounded-none bg-[#333333] px-5 py-3.5 font-black uppercase tracking-wide text-white transition-colors hover:bg-[#262626]"
              aria-expanded={isCategoryOpen}
            >
              <span className="text-[14px] leading-none text-[#FFD700]">☰</span>
              <span className="text-[11px] lg:text-[12px]">DANH MỤC SẢN PHẨM</span>
            </button>

            {isCategoryOpen && (
              <div className="absolute left-0 top-full w-[292px] overflow-hidden border border-neutral-800 bg-[#0b0b0b] text-white shadow-[0_22px_46px_rgba(0,0,0,0.36)]">
                <div className="border-b border-neutral-800 bg-[linear-gradient(90deg,#111_0%,#050505_100%)] px-4 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] font-black uppercase tracking-[0.2em] text-yellow-400">Thương hiệu đồng hồ</div>
                    <div className="h-px flex-1 bg-yellow-400/35" />
                  </div>
                </div>
                <div className="py-1.5">
                  {WATCH_BRANDS.map((brand) => (
                    <button
                      type="button"
                      key={brand.name}
                      onClick={() => handleBrandNavigate(brand.name)}
                      className="group relative flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-xs font-black uppercase transition-colors hover:bg-[#161616]"
                    >
                      <span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-r bg-yellow-400 transition-all group-hover:h-7" />
                      <span className="transition-transform group-hover:translate-x-1 group-hover:text-yellow-300">{brand.name}</span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-700 text-yellow-400 transition-colors group-hover:border-yellow-400 group-hover:bg-yellow-400 group-hover:text-neutral-950">›</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Navigation Item Links with elegant separators and localized styled vector icons */}
          <div className="flex flex-1 flex-wrap items-stretch gap-y-1 px-2 py-1 md:py-0">
            
            {/* ĐỒNG HỒ */}
            <Link 
              to="/category/dong-ho" 
              className="flex items-center gap-1.5 self-stretch border-r border-black/10 px-5 uppercase text-black transition-all hover:bg-black/5 active:bg-black/10"
            >
              <span>ĐỒNG HỒ</span>
              <img src="/images/q (2).png" alt="" className={navIconClass} />
            </Link>

            {/* KÍNH MẮT */}
            <Link 
              to="/category/kinh-mat" 
              className="flex items-center gap-1.5 self-stretch border-r border-black/10 px-5 uppercase text-black transition-all hover:bg-black/5 active:bg-black/10"
            >
              <span>KÍNH MẮT</span>
              <img src="/images/q (3).png" alt="" className={navIconClass} />
            </Link>

            {/* PHỤ KIỆN */}
            <Link 
              to="/category/phu-kien" 
              className="flex items-center gap-1.5 self-stretch border-r border-black/10 px-5 uppercase text-black transition-all hover:bg-black/5 active:bg-black/10"
            >
              <span>PHỤ KIỆN</span>
              <img src="/images/q (4).png" alt="" className={navIconClass} />
            </Link>

            {/* BÚT KÝ */}
            <Link 
              to="/category/but-ky" 
              className="flex items-center gap-1.5 self-stretch border-r border-black/10 px-5 uppercase text-black transition-all hover:bg-black/5 active:bg-black/10"
            >
              <span>BÚT KÝ</span>
              <img src="/images/q (1).png" alt="" className={navIconClass} />
            </Link>

            {/* GIỚI THIỆU */}
            <Link
              to="/about"
              className="flex items-center gap-1.5 self-stretch border-r border-black/10 px-5 uppercase text-black transition-all hover:bg-black/5 active:bg-black/10"
            >
              <span>GIỚI THIỆU</span>
            </Link>

            {/* LIÊN HỆ */}
            <Link
              to="/contact"
              className="flex items-center gap-1.5 self-stretch border-r border-black/10 px-5 uppercase text-black transition-all hover:bg-black/5 active:bg-black/10"
            >
              <span>LIÊN HỆ</span>
            </Link>

            {/* BẢO HÀNH */}
            <Link
              to="/warranty"
              className="flex items-center gap-1.5 self-stretch border-r border-black/10 px-5 uppercase text-black transition-all hover:bg-black/5 active:bg-black/10"
            >
              <span>BẢO HÀNH</span>
            </Link>

            {/* Premium, sharp rectangular highlighted Action Blocks aligned on the far right of the bar */}
            <div className="ml-auto flex items-center gap-2.5 self-stretch py-1.5 md:py-0">
              
              {/* ĐỒNG HỒ LIMITED block (pure solid white background, black bold uppercase font) */}
              <Link 
                to="/shop?tag=limited" 
                className="flex h-8 items-center bg-white px-5 text-[10.5px] font-black uppercase tracking-tight text-black transition-all hover:bg-neutral-100"
              >
                ĐỒNG HỒ LIMITED
              </Link>

            </div>

          </div>

        </div>
      </nav>
    </header>
  );
}
