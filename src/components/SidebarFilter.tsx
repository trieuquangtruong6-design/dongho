import React from "react";

interface SidebarFilterProps {
  currentFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const BRANDS = [
  "Epos Swiss",
  "Jacques Lemans",
  "Aries Gold",
  "Diamond D",
  "Philippe Auguste",
  "Atlantic Swiss",
  "Tsar Bomba"
];
const ORIGINS = ["Thuỵ Sỹ", "Nhật Bản", "Đức", "Ý", "Mỹ"];
const GENDERS = ["Nam", "Nữ", "Unisex"];

const PRICE_RANGES = [
  { label: "Dưới 2 triệu", min: "0", max: "2000000" },
  { label: "Từ 2 - 5 triệu", min: "2000000", max: "5000000" },
  { label: "Từ 5 - 10 triệu", min: "5000000", max: "10000000" },
  { label: "Từ 10 - 20 triệu", min: "10000000", max: "20000000" },
  { label: "Trên 20 triệu", min: "20000000", max: "999000000" }
];

export default function SidebarFilter({
  currentFilters,
  onFilterChange,
  onClearFilters
}: SidebarFilterProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded p-4 space-y-6 select-none shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <span className="font-black text-sm text-neutral-900 uppercase tracking-tight flex items-center gap-1">
          ⚙️ Bộ lọc tìm kiếm
        </span>
        {Object.keys(currentFilters).length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-[11px] text-red-500 hover:text-red-650 hover:underline font-bold cursor-pointer"
          >
            Xóa bộ lọc ❌
          </button>
        )}
      </div>

      {/* Target Gender */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
          Đối tượng khách hàng
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {GENDERS.map((gender) => (
            <button
              key={gender}
              onClick={() => onFilterChange("target", currentFilters.target === gender ? "" : gender)}
              className={`text-xs px-2.5 py-1.5 rounded transition-all cursor-pointer font-medium border ${
                currentFilters.target === gender
                  ? "bg-yellow-400 border-yellow-400 text-neutral-900 font-bold"
                  : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300"
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      {/* Brand selection list */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
          Thương hiệu nổi bật
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {BRANDS.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2.5 text-xs text-neutral-600 cursor-pointer hover:text-neutral-900"
            >
              <input
                type="checkbox"
                checked={currentFilters.brand === brand}
                onChange={() => onFilterChange("brand", currentFilters.brand === brand ? "" : brand)}
                className="rounded border-neutral-300 text-yellow-500 focus:ring-yellow-400 w-3.5 h-3.5 cursor-pointer"
              />
              <span className={currentFilters.brand === brand ? "font-bold text-neutral-900" : ""}>
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Origins selection */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
          Xuất xứ sản phẩm
        </h4>
        <div className="space-y-1.5">
          {ORIGINS.map((origin) => (
            <label
              key={origin}
              className="flex items-center gap-2.5 text-xs text-neutral-600 cursor-pointer hover:text-neutral-900"
            >
              <input
                type="checkbox"
                checked={currentFilters.origin === origin}
                onChange={() => onFilterChange("origin", currentFilters.origin === origin ? "" : origin)}
                className="rounded border-neutral-300 text-yellow-500 focus:ring-yellow-400 w-3.5 h-3.5 cursor-pointer"
              />
              <span className={currentFilters.origin === origin ? "font-bold text-neutral-900" : ""}>
                {origin}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price filter list */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
          Mức giá tìm kiếm
        </h4>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2.5 text-xs text-neutral-600 cursor-pointer hover:text-neutral-900"
            >
              <input
                type="radio"
                name="price_range"
                checked={currentFilters.minPrice === range.min && currentFilters.maxPrice === range.max}
                onChange={() => {
                  onFilterChange("minPrice", range.min);
                  onFilterChange("maxPrice", range.max);
                }}
                className="text-yellow-500 focus:ring-yellow-400 w-3.5 h-3.5 cursor-pointer"
              />
              <span
                className={
                  currentFilters.minPrice === range.min && currentFilters.maxPrice === range.max
                    ? "font-bold text-neutral-900"
                    : ""
                }
              >
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
