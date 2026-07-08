import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useStore } from "../contexts/StoreContext";
import ProductCard from "../components/ProductCard";
import { Check, ChevronDown, ChevronRight, RefreshCw, SlidersHorizontal, X } from "lucide-react";

const WATCH_BRANDS = [
  { name: "Epos Swiss", logoSrc: "/images/2 (4).png" },
  { name: "Jacques Lemans", logoSrc: "/images/2 (5).png" },
  { name: "Aries Gold", logoSrc: "/images/2.png" },
  { name: "Diamond D", logoSrc: "/images/2 (3).png" },
  { name: "Philippe Auguste", logoSrc: "/images/2 (6).png" },
  { name: "Atlantic Swiss", logoSrc: "/images/2 (2).png" },
  { name: "Tsar Bomba", logoSrc: "/images/2 (1).png" }
];

const EYEWEAR_BRANDS = [
  { name: "Prada", logoSrc: "/images/l (1).jpg" },
  { name: "Burberry", logoSrc: "/images/l (2).jpg" },
  { name: "Coach", logoSrc: "/images/l (3).jpg" },
  { name: "Michael Kors", logoSrc: "/images/l (4).jpg" }
];

const SORT_OPTIONS = [
  { value: "news", label: "Mới cập nhật" },
  { value: "price_asc", label: "Giá tăng" },
  { value: "price_desc", label: "Giá giảm" },
  { value: "discount", label: "Ưu đãi" }
];

const CATEGORY_OPTIONS = [
  { value: "dong-ho", label: "Đồng hồ" },
  { value: "kinh-mat", label: "Kính mắt" },
  { value: "but-ky", label: "Bút ký" },
  { value: "phu-kien", label: "Phụ kiện" }
];

const TARGET_OPTIONS = [
  { value: "Nam", label: "Nam" },
  { value: "Nữ", label: "Nữ" },
  { value: "Unisex", label: "Unisex" }
];

const PRICE_OPTIONS = [
  { value: "", label: "Tất cả giá", minPrice: "", maxPrice: "" },
  { value: "under-2", label: "Dưới 2 triệu", minPrice: "", maxPrice: "2000000" },
  { value: "2-5", label: "Từ 2 đến 5 triệu", minPrice: "2000000", maxPrice: "5000000" },
  { value: "5-10", label: "Từ 5 đến 10 triệu", minPrice: "5000000", maxPrice: "10000000" },
  { value: "10-20", label: "Từ 10 đến 20 triệu", minPrice: "10000000", maxPrice: "20000000" },
  { value: "20-50", label: "Từ 20 đến 50 triệu", minPrice: "20000000", maxPrice: "50000000" },
  { value: "over-50", label: "Trên 50 triệu", minPrice: "50000000", maxPrice: "" }
];

export default function Shop() {
  const { products, isLoading } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState("news");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state from query parameters (brand, category, target, search)
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    const categoryParam = searchParams.get("category");
    const targetParam = searchParams.get("target");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    const newFilters: Record<string, string> = {};
    if (brandParam) newFilters.brand = brandParam;
    if (categoryParam) newFilters.category = categoryParam;
    if (targetParam) newFilters.target = targetParam;
    if (minPriceParam) newFilters.minPrice = minPriceParam;
    if (maxPriceParam) newFilters.maxPrice = maxPriceParam;

    // Preserve any existing filtering settings from state
    setFilters(newFilters);
  }, [searchParams, location.search]);

  const applyFilters = (updated: Record<string, string>) => {
    setFilters(updated);

    const newParams = new URLSearchParams();
    const searchVal = searchParams.get("search");
    if (searchVal) newParams.set("search", searchVal);

    Object.entries(updated).forEach(([k, v]) => {
      newParams.set(k, v);
    });
    setSearchParams(newParams);
  };

  // Handle active filter adjustments
  const handleFilterChange = (key: string, value: string) => {
    const updated = { ...filters };
    if (value === "") {
      delete updated[key];
    } else {
      updated[key] = value;
    }
    applyFilters(updated);
  };

  const handlePriceRangeChange = (option: (typeof PRICE_OPTIONS)[number]) => {
    const updated = { ...filters };
    if (option.minPrice) {
      updated.minPrice = option.minPrice;
    } else {
      delete updated.minPrice;
    }
    if (option.maxPrice) {
      updated.maxPrice = option.maxPrice;
    } else {
      delete updated.maxPrice;
    }
    applyFilters(updated);
  };

  const handleClearFilters = () => {
    setFilters({});
    setIsMobileFilterOpen(false);
    const newParams = new URLSearchParams();
    const searchVal = searchParams.get("search");
    if (searchVal) newParams.set("search", searchVal);
    setSearchParams(newParams);
  };

  // Filter products client-side for immediate performance
  const getProcessedProducts = () => {
    let result = [...products];

    // Filter by Search text parameter
    const searchVal = searchParams.get("search");
    if (searchVal) {
      const q = searchVal.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Filter by key items
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.brand) {
      result = result.filter((p) => p.brand.toLowerCase() === filters.brand.toLowerCase());
    }
    if (filters.target) {
      result = result.filter((p) => p.target === filters.target);
    }
    if (filters.origin) {
      result = result.filter((p) => p.origin === filters.origin);
    }
    if (filters.minPrice) {
      result = result.filter((p) => (p.discountPrice || p.price) >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((p) => (p.discountPrice || p.price) <= Number(filters.maxPrice));
    }

    // Apply Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === "discount") {
      result.sort((a, b) => {
        const discA = a.discountPrice ? a.price - a.discountPrice : 0;
        const discB = b.discountPrice ? b.price - b.discountPrice : 0;
        return discB - discA;
      });
    }

    return result;
  };

  const filteredList = getProcessedProducts();
  const activeSearch = searchParams.get("search");
  const isEyewearCategory = filters.category === "kinh-mat";
  const isPenCategory = filters.category === "but-ky";
  const brandLogos = isEyewearCategory ? EYEWEAR_BRANDS : WATCH_BRANDS;
  const selectedSortLabel = SORT_OPTIONS.find((option) => option.value === sortBy)?.label || "Mới cập nhật";
  const selectedPriceValue =
    PRICE_OPTIONS.find((option) => option.minPrice === (filters.minPrice || "") && option.maxPrice === (filters.maxPrice || ""))?.value || "";
  const activeFilterCount = Object.keys(filters).length + (sortBy !== "news" ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-3 py-5 sm:px-4 sm:py-8">
      {/* Breadcrumb section */}
      <div className="mb-4 flex min-w-0 flex-wrap items-center gap-1 text-xs text-neutral-500 select-none sm:mb-6">
        <span className="hover:text-yellow-600 cursor-pointer" onClick={() => handleClearFilters()}>Trang chủ</span>
        <ChevronRight size={12} />
        <span className="text-neutral-800 font-medium">Sản phẩm chính hãng</span>
        {filters.category && (
          <>
            <ChevronRight size={12} />
            <span className="text-yellow-600 font-bold capitalize">
              {filters.category === "dong-ho" && "Đồng Hồ"}
              {filters.category === "kinh-mat" && "Kính Mắt"}
              {filters.category === "but-ky" && "Bút Ký"}
              {filters.category === "phu-kien" && "Phụ Kiện"}
            </span>
          </>
        )}
      </div>

      {/* Catalog list Area */}
      <div className="space-y-6">
        {!isPenCategory && (
          <div
            className={
              isEyewearCategory
                ? "hidden select-none rounded-[8px] border border-neutral-200 bg-white px-3 py-3 shadow-sm sm:px-4 sm:py-4 md:block"
                : "hidden select-none border border-[#e8e1d6] bg-[#f7f4ef] px-3 py-3 shadow-sm sm:px-4 sm:py-5 md:block"
            }
          >
            <div
              className={
                isEyewearCategory
                  ? "mx-auto grid max-w-[860px] grid-cols-2 gap-3 sm:grid-cols-4"
                  : "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7"
              }
            >
              {brandLogos.map((brand) => {
                const isSelected = filters.brand === brand.name;

                return (
                  <button
                    key={brand.name}
                    type="button"
                    onClick={() => handleFilterChange("brand", isSelected ? "" : brand.name)}
                    aria-pressed={isSelected}
                    title={brand.name}
                    className={`group relative flex items-center justify-center overflow-hidden border bg-white text-center transition duration-300 hover:-translate-y-0.5 hover:border-[#f5c400] hover:bg-[#faf7f1] ${
                      isEyewearCategory
                        ? "h-[58px] w-full rounded-[6px] px-3 py-2 shadow-[0_6px_14px_rgba(20,20,20,0.06)] sm:h-[72px] sm:px-5 sm:py-3"
                        : "h-[68px] w-full rounded-[8px] px-2 py-3 shadow-[0_8px_18px_rgba(20,20,20,0.07)] sm:h-[96px] sm:px-3 sm:py-4"
                    } ${
                      isSelected
                        ? "border-[#f5c400] ring-2 ring-[#f5c400]/30"
                        : "border-[#ddd4c7]"
                    }`}
                  >
                    {isEyewearCategory && isSelected && (
                      <span className="absolute inset-x-4 bottom-0 h-[3px] rounded-t-full bg-[#f5c400]" />
                    )}
                    <img
                      src={brand.logoSrc}
                      alt={`${brand.name} logo`}
                      className={`${isEyewearCategory ? "h-auto max-h-[30px] w-auto max-w-[120px] sm:max-h-[36px] sm:max-w-[150px]" : "h-9 w-auto max-w-full sm:h-12"} object-contain transition duration-300 group-hover:opacity-90`}
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <main className="space-y-6">
          {/* Controls Bar */}
          {!isPenCategory && (
          <div className="relative z-20 flex items-center justify-between gap-2 select-none">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex h-10 min-w-[132px] items-center justify-center gap-2 border border-neutral-300 bg-neutral-950 px-3 text-[12px] font-black uppercase tracking-[0.08em] text-yellow-400 shadow-[0_8px_20px_rgba(0,0,0,0.12)] md:hidden"
            >
              <SlidersHorizontal size={15} />
              Bộ lọc
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1 text-[10px] font-black leading-none text-black">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsSortOpen((open) => !open)}
                aria-expanded={isSortOpen}
                className="ml-auto flex h-10 w-full items-center justify-between gap-3 border border-neutral-300 bg-white px-3.5 text-left shadow-[0_8px_20px_rgba(0,0,0,0.055)] transition-all hover:border-[#c9a23a] hover:shadow-[0_12px_26px_rgba(0,0,0,0.08)] sm:w-[220px]"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <SlidersHorizontal size={15} className="shrink-0 text-[#9b7a2c]" />
                  <span className="min-w-0 truncate text-[12px] font-black uppercase tracking-[0.08em] text-neutral-800">
                    {selectedSortLabel}
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-neutral-500 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-full border border-neutral-200 bg-white p-1 shadow-[0_18px_42px_rgba(0,0,0,0.16)] sm:w-[220px]">
                  {SORT_OPTIONS.map((option) => {
                    const isActive = sortBy === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`flex h-9 w-full items-center justify-between px-3 text-left text-[11px] font-black uppercase tracking-[0.08em] transition-colors ${
                          isActive
                            ? "bg-[#050505] text-[#f5c400]"
                            : "text-neutral-700 hover:bg-[#f8f4e7] hover:text-[#050505]"
                        }`}
                      >
                        {option.label}
                        {isActive && <Check size={14} strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          )}

          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-[90] bg-black/55 md:hidden">
              <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-hidden rounded-t-[14px] bg-white text-neutral-950 shadow-[0_-18px_50px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-950 px-4 py-3 text-white">
                  <div>
                    <div className="text-[15px] font-black uppercase tracking-[0.08em]">Bộ lọc sản phẩm</div>
                    <div className="mt-0.5 text-[11px] font-semibold text-neutral-400">{filteredList.length} sản phẩm phù hợp</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
                    aria-label="Đóng bộ lọc"
                  >
                    <X size={19} strokeWidth={2.6} />
                  </button>
                </div>

                <div className="max-h-[calc(88vh-118px)] space-y-5 overflow-y-auto px-4 py-4">
                  <section>
                    <div className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-neutral-500">Danh mục</div>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORY_OPTIONS.map((option) => {
                        const isActive = filters.category === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleFilterChange("category", isActive ? "" : option.value)}
                            className={`h-10 border px-3 text-[12px] font-black uppercase ${
                              isActive ? "border-neutral-950 bg-neutral-950 text-yellow-400" : "border-neutral-200 bg-neutral-50 text-neutral-800"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {!isPenCategory && (
                    <section>
                      <div className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-neutral-500">Thương hiệu</div>
                      <div className="grid grid-cols-2 gap-2">
                        {brandLogos.map((brand) => {
                          const isActive = filters.brand === brand.name;
                          return (
                            <button
                              key={brand.name}
                              type="button"
                              onClick={() => handleFilterChange("brand", isActive ? "" : brand.name)}
                              className={`flex h-[58px] items-center justify-center border bg-white px-3 ${
                                isActive ? "border-yellow-400 ring-2 ring-yellow-400/30" : "border-neutral-200"
                              }`}
                            >
                              <img src={brand.logoSrc} alt={`${brand.name} logo`} className="max-h-8 max-w-full object-contain" loading="lazy" />
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  <section>
                    <div className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-neutral-500">Khoảng giá</div>
                    <div className="grid grid-cols-1 gap-2">
                      {PRICE_OPTIONS.map((option) => {
                        const isActive = selectedPriceValue === option.value;
                        return (
                          <button
                            key={option.value || "all"}
                            type="button"
                            onClick={() => handlePriceRangeChange(option)}
                            className={`flex h-10 items-center justify-between border px-3 text-left text-[12px] font-bold ${
                              isActive ? "border-neutral-950 bg-neutral-950 text-yellow-400" : "border-neutral-200 bg-neutral-50 text-neutral-800"
                            }`}
                          >
                            {option.label}
                            {isActive && <Check size={15} strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section>
                    <div className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-neutral-500">Đối tượng</div>
                    <div className="grid grid-cols-3 gap-2">
                      {TARGET_OPTIONS.map((option) => {
                        const isActive = filters.target === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleFilterChange("target", isActive ? "" : option.value)}
                            className={`h-10 border px-2 text-[12px] font-black uppercase ${
                              isActive ? "border-neutral-950 bg-neutral-950 text-yellow-400" : "border-neutral-200 bg-neutral-50 text-neutral-800"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section>
                    <div className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-neutral-500">Sắp xếp theo</div>
                    <div className="grid grid-cols-2 gap-2">
                      {SORT_OPTIONS.map((option) => {
                        const isActive = sortBy === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setSortBy(option.value)}
                            className={`h-10 border px-3 text-[12px] font-black uppercase ${
                              isActive ? "border-neutral-950 bg-neutral-950 text-yellow-400" : "border-neutral-200 bg-neutral-50 text-neutral-800"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </div>

                <div className="grid grid-cols-[0.9fr_1.1fr] gap-2 border-t border-neutral-200 bg-white p-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("news");
                      handleClearFilters();
                    }}
                    className="h-11 border border-neutral-300 text-[12px] font-black uppercase text-neutral-800"
                  >
                    Xóa lọc
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="h-11 bg-yellow-400 text-[12px] font-black uppercase text-neutral-950 shadow-[0_8px_18px_rgba(202,138,4,0.24)]"
                  >
                    Xem kết quả
                  </button>
                </div>
              </div>
            </div>
          )}

          {isPenCategory && (
            <div className="flex items-center gap-3 select-none">
              <div className="h-px flex-1 bg-neutral-500" />
              <h2 className="shrink-0 text-base font-medium text-black sm:text-xl">Bút ký cao cấp</h2>
              <div className="h-px flex-1 bg-neutral-500" />
            </div>
          )}

          {/* Active search text notice */}
          {activeSearch && (
            <div className="flex flex-col gap-2 rounded border border-yellow-100 bg-yellow-100/50 p-3 text-xs text-neutral-800 sm:flex-row sm:items-center sm:justify-between">
              <span className="min-w-0">Kết quả tìm kiếm cho từ khóa: <strong className="break-words text-neutral-900">"{activeSearch}"</strong></span>
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete("search");
                  setSearchParams(newParams);
                }}
                className="self-start font-bold text-red-500 hover:underline sm:self-auto"
              >
                Xóa tìm kiếm [×]
              </button>
            </div>
          )}

          {/* Active filters badges */}
          {!isPenCategory && Object.keys(filters).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-neutral-500 text-[10px] font-bold">Đang chọn:</span>
              {Object.entries(filters).map(([k, v]) => (
                <span
                  key={k}
                  className="bg-yellow-400/10 text-neutral-900 font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-yellow-400/30"
                >
                  <span className="capitalize font-normal text-neutral-500">{k}:</span>
                  <span className="text-neutral-800">{v}</span>
                  <button
                    onClick={() => handleFilterChange(k, "")}
                    className="text-red-600 ml-1 font-black hover:text-red-800 text-xs cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-y border-neutral-200 bg-white px-3 py-2.5 text-xs shadow-sm md:hidden">
            <div className="min-w-0">
              <div className="font-black uppercase tracking-[0.12em] text-neutral-500">Kết quả</div>
              <div className="mt-0.5 truncate font-bold text-neutral-950">
                {isLoading ? "Đang tải sản phẩm" : `${filteredList.length} sản phẩm`}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="font-black uppercase tracking-[0.12em] text-neutral-500">Sắp xếp</div>
              <div className="mt-0.5 font-bold text-[#9b7a2c]">{selectedSortLabel}</div>
            </div>
          </div>

          {/* Results Grid layout */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-[280px] animate-pulse rounded-[10px] border border-neutral-200 bg-white shadow-sm">
                  <div className="h-[48%] bg-neutral-100" />
                  <div className="space-y-2 p-3">
                    <div className="h-3 w-2/3 rounded bg-neutral-100" />
                    <div className="h-3 w-full rounded bg-neutral-100" />
                    <div className="h-3 w-4/5 rounded bg-neutral-100" />
                    <div className="mt-5 h-8 rounded-full bg-neutral-100" />
                  </div>
                </div>
              ))}
              <div className="col-span-2 flex items-center justify-center gap-2 py-4 text-neutral-400 lg:col-span-4">
                <RefreshCw className="animate-spin text-yellow-500" size={20} />
                <span className="text-sm font-semibold">Đang cập nhật danh mục...</span>
              </div>
            </div>
          ) : filteredList.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {filteredList.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded border border-neutral-200 bg-white p-6 py-14 text-center shadow-sm sm:p-8 sm:py-20">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                <SlidersHorizontal size={22} />
              </span>
              <span className="mb-2 mt-4 block font-sans text-sm font-bold text-neutral-500">
                Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại của bạn.
              </span>
              <button
                onClick={handleClearFilters}
                className="text-xs bg-yellow-400 hover:bg-yellow-500 text-neutral-950 px-4 py-2 rounded font-extrabold transition-colors cursor-pointer mt-4"
              >
                XÓA LỰA CHỌN
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
