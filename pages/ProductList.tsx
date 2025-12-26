import React, { useEffect, useMemo, useState } from "react";
import { Product, Page } from "../types";
import { products } from "../data";

interface ProductListProps {
  setCurrentPage: (page: Page) => void;
  setSelectedProduct: (p: Product) => void;
}

/**
 * =========================
 * Helpers
 * =========================
 */

// rentPrice trong data.ts là number|null, nhưng mình vẫn parse “an toàn”
const parseMoney = (v: any): number | null => {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;

  const s = String(v).trim();
  if (!s) return null;

  // remove currency symbols/commas
  const cleaned = s.replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

const parseHeightMeters = (v: any): number | null => {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;

  const s = String(v).trim().toLowerCase();
  if (!s) return null;

  // 2.5m / 2,5m
  const mMatch = s.match(/^(\d+(?:[.,]\d+)?)\s*m$/i);
  if (mMatch) {
    const n = Number(mMatch[1].replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  // 1m8 / 1m20 / 2m30
  const compactMatch = s.match(/^(\d+)\s*m\s*(\d+)?$/i);
  if (compactMatch) {
    const whole = Number(compactMatch[1]);
    const tail = compactMatch[2];

    if (!Number.isFinite(whole)) return null;
    if (!tail) return whole;

    if (tail.length === 1) return whole + Number(tail) / 10;
    if (tail.length === 2) return whole + Number(tail) / 100;

    return whole + Number(tail) / 100;
  }

  const any = s.match(/(\d+(?:[.,]\d+)?)/);
  if (!any) return null;
  const n = Number(any[1].replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

type PriceKey = "All" | "under5" | "5to10" | "10to20" | "over20";
type HeightKey = "All" | "under1" | "1to2" | "2to3" | "3to4";

const matchesPrice = (priceVnd: number | null, key: PriceKey) => {
  if (key === "All") return true;

  // Nếu chưa có giá thuê thì “đừng chặn” (để vẫn thấy sản phẩm)
  if (priceVnd == null) return true;

  const million = priceVnd / 1_000_000;

  switch (key) {
    case "under5":
      return million < 5;
    case "5to10":
      return million >= 5 && million < 10;
    case "10to20":
      return million >= 10 && million < 20;
    case "over20":
      return million >= 20;
    default:
      return true;
  }
};

const matchesHeight = (heightMeters: number | null, key: HeightKey) => {
  if (key === "All") return true;

  // Nếu chưa có height hợp lệ thì “đừng chặn”
  if (heightMeters == null) return true;

  switch (key) {
    case "under1":
      return heightMeters < 1;
    case "1to2":
      return heightMeters >= 1 && heightMeters < 2;
    case "2to3":
      return heightMeters >= 2 && heightMeters < 3;
    case "3to4":
      return heightMeters >= 3 && heightMeters < 4;
    default:
      return true;
  }
};

const FALLBACK_IMG = "/no-avatar.png";

const formatVND = (v: number | null) => {
  if (v === null) return "Liên hệ";
  return `${v.toLocaleString("vi-VN")}đ`;
};

const onImgError: React.ReactEventHandler<HTMLImageElement> = (e) => {
  const img = e.currentTarget;
  if (img.src.endsWith(FALLBACK_IMG)) return;
  img.src = FALLBACK_IMG;
};

const PER_PAGE = 9;

const ProductList: React.FC<ProductListProps> = ({ setCurrentPage, setSelectedProduct }) => {
  const [filterType, setFilterType] = useState<string>("All");
  const [filterPrice, setFilterPrice] = useState<PriceKey>("All");
  const [filterHeight, setFilterHeight] = useState<HeightKey>("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [page, setPage] = useState<number>(1);

  // Tự động lấy danh sách category từ data.ts (khỏi hardcode)
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of products as Product[]) {
      set.add(String(p.category || "Khác"));
    }
    const arr = Array.from(set).filter(Boolean).sort((a, b) => a.localeCompare(b, "vi"));
    return ["All", ...arr];
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return (products as Product[]).filter((p) => {
      const typeOk = filterType === "All" || String(p.category) === filterType;

      const searchOk =
        q === "" ||
        String(p.name ?? "").toLowerCase().includes(q) ||
        String(p.id ?? "").toLowerCase().includes(q);

      const price = parseMoney((p as any).rentPrice);
      const priceOk = matchesPrice(price, filterPrice);

      const h = parseHeightMeters((p as any).height);
      const heightOk = matchesHeight(h, filterHeight);

      return typeOk && searchOk && priceOk && heightOk;
    });
  }, [filterType, filterPrice, filterHeight, searchTerm]);

  // Khi đổi filter/search → quay về trang 1
  useEffect(() => {
    setPage(1);
  }, [filterType, filterPrice, filterHeight, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PER_PAGE));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const pagedProducts = useMemo(() => {
    const start = (safePage - 1) * PER_PAGE;
    return filteredProducts.slice(start, start + PER_PAGE);
  }, [filteredProducts, safePage]);

  const resetFilters = () => {
    setFilterType("All");
    setFilterPrice("All");
    setFilterHeight("All");
    setSearchTerm("");
    setPage(1);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-2">
      {/* Banner */}
      <section
        className="text-white py-16 relative overflow-hidden"
        style={{ background: "linear-gradient(to right, #2F5D3A, #D4A017)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"240\" height=\"240\" viewBox=\"0 0 240 240\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\"/></svg>')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Sản Phẩm Mai Tết</h1>
          <p className="text-white/90">Khám phá bộ sưu tập mai đa dạng, chất lượng cao</p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Sidebar filters */}
          <aside className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-bold flex items-center gap-2 mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-amber-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707L13 15v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Bộ Lọc
            </h3>

            <div className="space-y-6">
              {/* Loại Mai */}
              <div>
                <label className="text-sm text-slate-500 block mb-3">Loại Mai</label>
                <div className="flex flex-col gap-2">
                  {categoryOptions.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        filterType === type
                          ? "bg-amber-400 text-amber-950"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                      }`}
                      type="button"
                    >
                      {type === "All" ? "Tất cả" : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mức Giá */}
              <div>
                <label className="text-sm text-slate-500 block mb-3">Mức Giá</label>
                <div className="flex flex-col gap-2">
                  {([
                    ["All", "Tất cả mức giá"],
                    ["under5", "Dưới 5 triệu"],
                    ["5to10", "5 - 10 triệu"],
                    ["10to20", "10 - 20 triệu"],
                    ["over20", "Trên 20 triệu"],
                  ] as Array<[PriceKey, string]>).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setFilterPrice(key)}
                      className={`text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        filterPrice === key
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                      }`}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chiều cao */}
              <div>
                <label className="text-sm text-slate-500 block mb-3">Chiều cao</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    ["All", "Tất cả"],
                    ["under1", "Dưới 1m"],
                    ["1to2", "1m - 2m"],
                    ["2to3", "2m - 3m"],
                    ["3to4", "3m - 4m"],
                  ] as Array<[HeightKey, string]>).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setFilterHeight(key)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        filterHeight === key
                          ? "bg-amber-400 text-amber-950"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                      }`}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full mt-4 px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all select-none"
                >
                  Reset bộ lọc
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div>
            {/* Search + count */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm mã/tên sản phẩm..."
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-amber-200 transition"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <p className="text-slate-500 text-sm whitespace-nowrap">
                {filteredProducts.length} sản phẩm
              </p>
            </div>

            {/* Grid (chỉ 9 sp/trang) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagedProducts.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={p.image || FALLBACK_IMG}
                      onError={onImgError}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        {p.category || "Khác"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1">{p.name}</h3>

                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                      {p.description || `Mã cây: ${p.id}. Liên hệ để xem cây thực tế.`}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Giá thuê (5 - 10 ngày)</p>
                        <p className="text-lg font-bold text-red-600">{formatVND(p.rentPrice)}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(p);
                          setCurrentPage("product-detail");
                          window.scrollTo(0, 0);
                        }}
                        className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                      >
                        Chi Tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gợi ý tư vấn khi chưa tìm được cây phù hợp */}
            <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-slate-700 text-center md:text-left">
                <p className="font-bold text-lg">
                  Bạn chưa tìm được cây phù hợp?
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Không tìm được cây phù hợp?
                  {/* 🌼 Nhà vườn còn nhiều cây chưa đăng đủ thông tin.
                  👉 Gọi ngay để được dẫn xem cây đúng ngân sách & không gian của bạn. */}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  🌼 Nhà vườn còn nhiều cây chưa đăng đủ thông tin.
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  👉 Gọi ngay để được dẫn xem cây đúng ngân sách & không gian của bạn.
                </p>
              </div>

              <a
                href="tel:0922727277"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
              >
                📞 Gọi Ngay
              </a>
            </div>


            {/* Pagination */}
            {totalPages > 1 && (
  <div className="mt-8 sm:mt-9 mb-6 flex items-center justify-center">
    <div className="flex items-center bg-white text-slate-800 rounded-full shadow-md px-3 py-1.5 sm:px-4 sm:py-2 border border-slate-200">
      <button
        type="button"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={safePage <= 1}
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full grid place-items-center transition text-sm ${
          safePage <= 1
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-slate-100"
        }`}
        aria-label="Trang trước"
      >
        ←
      </button>

      <div className="flex items-center gap-1.5 sm:gap-2 mx-2 sm:mx-3 whitespace-nowrap">
        {/* Ẩn chữ Trang trên mobile */}
        <span className="text-xs text-slate-600 hidden sm:inline">
          Trang
        </span>

        <input
          value={safePage}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isFinite(n)) return;
            setPage(Math.min(Math.max(1, Math.trunc(n)), totalPages));
          }}
          onBlur={() => setPage((p) => Math.min(Math.max(1, p), totalPages))}
          className="w-12 sm:w-14 text-center bg-slate-100 border border-slate-300 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-amber-300 text-xs text-slate-800"
          type="number"
          min={1}
          max={totalPages}
        />

        <span className="text-xs text-slate-600">
          / {totalPages}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={safePage >= totalPages}
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full grid place-items-center transition text-sm ${
          safePage >= totalPages
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-slate-100"
        }`}
        aria-label="Trang sau"
      >
        →
      </button>
    </div>
  </div>
)}



          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
