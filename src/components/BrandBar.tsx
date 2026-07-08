import React from "react";
import { useNavigate } from "react-router-dom";

const BRANDS = [
  { name: "Epos Swiss", slogan: "Cơ khí Thụy Sĩ", logoText: "EPOS", logoSrc: "/images/2 (4).png" },
  { name: "Jacques Lemans", slogan: "Đồng hồ Áo cao cấp", logoText: "JL", logoSrc: "/images/2 (5).png" },
  { name: "Aries Gold", slogan: "Đồng hồ Singapore", logoText: "ARIES", logoSrc: "/images/2.png" },
  { name: "Diamond D", slogan: "Đồng hồ nữ đính đá", logoText: "DIAMOND D", logoSrc: "/images/2 (3).png" },
  { name: "Philippe Auguste", slogan: "Phong cách Pháp cổ điển", logoText: "PA", logoSrc: "/images/2 (6).png" },
  { name: "Atlantic Swiss", slogan: "Chuẩn mực Thụy Sĩ", logoText: "ATLANTIC", logoSrc: "/images/2 (2).png" },
  { name: "Tsar Bomba", slogan: "Cơ khí thể thao", logoText: "TB", logoSrc: "/images/2 (1).png" },
];

export default function BrandBar() {
  const navigate = useNavigate();

  const handleBrandClick = (brandName: string) => {
    navigate(`/shop?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <section className="w-full select-none border-y border-[#e8e1d6] bg-[#f7f4ef] py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#8f7d65]">
            Thương hiệu độc quyền
          </p>
          <h3 className="text-2xl font-black uppercase tracking-tight text-[#050505] sm:text-3xl">
            Thương hiệu chính hãng
          </h3>
          <div className="mt-2 h-1.5 w-20 rounded-full bg-[#f5c400]" />
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {BRANDS.map((brand) => (
            <button
              key={brand.name}
              type="button"
              onClick={() => handleBrandClick(brand.name)}
              className="group flex w-full max-w-[160px] min-h-[110px] cursor-pointer items-center justify-center overflow-hidden rounded-[22px] border border-[#ddd4c7] bg-white px-3 py-4 text-center shadow-[0_8px_18px_rgba(20,20,20,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#f5c400] hover:bg-[#faf7f1]"
            >
              <div className="flex h-full items-center justify-center">
                {brand.logoSrc ? (
                  <img
                    src={brand.logoSrc}
                    alt={`${brand.name} logo`}
                    className="h-14 w-auto object-contain transition duration-300 group-hover:opacity-90"
                    loading="lazy"
                  />
                ) : (
                  <span className="font-black uppercase tracking-[0.24em] text-[#050505] transition-colors duration-300 group-hover:text-[#f5c400]">
                    {brand.logoText}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
