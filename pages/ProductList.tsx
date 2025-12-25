import React, { useMemo, useState } from "react";
import { Product, Page } from "../types";
import { products } from "../data";

interface ProductListProps {
  setCurrentPage: (page: Page) => void;
  setSelectedProduct: (p: Product) => void;
}

/**
 * =========================
 * Helpers: Parse data.ts
 * =========================
 */

// rentPrice trong data.ts là number, nhưng mình vẫn parse “an toàn” phòng khi sau này bạn đổi sang string.
const parseMoney = (v: unknown): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const digits = v.replace(/[^\d]/g, "");
    return digits ? Number(digits) : 0;
  }
  return 0;
};

/**
 * height trong data.ts đang là dạng: '1m8', '1m5', '1m2'
 * => parse ra mét: 1.8, 1.5, 1.2
 *
 * Hỗ trợ thêm các dạng thường gặp:
 * - '1.8m', '1,8m'
 * - '180cm'
 * - '2m' (=> 2.0)
 */
const parseHeightMeters = (raw: unknown): number | null => {
  if (raw == null) return null;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;

  const s = String(raw).trim().toLowerCase();
  if (!s) return null;

  // 180cm => 1.8m
  const cmMatch = s.match(/^(\d+(?:[.,]\d+)?)\s*cm$/i);
  if (cmMatch) {
    const cm = Number(cmMatch[1].replace(",", "."));
    return Number.isFinite(cm) ? cm / 100 : null;
  }

  // 1.8m / 1,8m
  const decimalMMatch = s.match(/^(\d+(?:[.,]\d+)?)\s*m$/i);
  if (decimalMMatch) {
    const m = Number(decimalMMatch[1].replace(",", "."));
    return Number.isFinite(m) ? m : null;
  }

  // 1m8 / 1m5 / 1m2 / 2m / 2m30
  const compactMatch = s.match(/^(\d+)\s*m\s*(\d+)?$/i);
  if (compactMatch) {
    const whole = Number(compactMatch[1]);
    const tail = compactMatch[2]; // phần sau 'm'

    if (!Number.isFinite(whole)) return null;
    if (!tail) return whole;

    // Quy ước:
    // - '1m8' => 1.8 (1 chữ số => phần thập phân)
    // - '1m20' => 1.20 => 1.2 (2 chữ số => cm)
    // - '1m05' => 1.05
    if (tail.length === 1) return whole + Number(tail) / 10;
    if (tail.length === 2) return whole + Number(tail) / 100;

    // dài hơn: coi như cm (vd 1m250 => 1 + 250/100 = 3.5) — hiếm, nhưng vẫn “có lý”
    return whole + Number(tail) / 100;
  }

  // fallback: bắt số đầu tiên
  const any = s.match(/(\d+(?:[.,]\d+)?)/);
  if (!any) return null;
  const n = Number(any[1].replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

type PriceKey = "All" | "under5" | "5to10" | "10to20" | "over20";
type HeightKey = "All" | "under1" | "1to2" | "2to3" | "3to4";

const PRICE_OPTIONS: Array<{ key: PriceKey; label: string }> = [
  { key: "All", label: "Tất Cả Mức Giá" },
  { key: "under5", label: "Dưới 5 triệu" },
  { key: "5to10", label: "5 - 10 triệu" },
  { key: "10to20", label: "10 - 20 triệu" },
  { key: "over20", label: "Trên 20 triệu" },
];

const HEIGHT_OPTIONS: Array<{ key: Exclude<HeightKey, "All">; label: string }> = [
  { key: "under1", label: "Dưới 1m" },
  { key: "1to2", label: "1m - 2m" },
  { key: "2to3", label: "2m - 3m" },
  { key: "3to4", label: "3m - 4m" },
];

const matchesPrice = (price: number, key: PriceKey) => {
  const m5 = 5_000_000;
  const m10 = 10_000_000;
  const m20 = 20_000_000;

  switch (key) {
    case "All":
      return true;
    case "under5":
      return price < m5;
    case "5to10":
      // không hở, không chồng: [5, 10)
      return price >= m5 && price < m10;
    case "10to20":
      // [10, 20)
      return price >= m10 && price < m20;
    case "over20":
      // >= 20
      return price >= m20;
    default:
      return true;
  }
};

const matchesHeight = (heightMeters: number | null, key: HeightKey) => {
  if (key === "All") return true;

  // Nếu data sản phẩm chưa có height hợp lệ thì “đừng chặn”
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

const ProductList: React.FC<ProductListProps> = ({ setCurrentPage, setSelectedProduct }) => {
  const [filterType, setFilterType] = useState<string>("All");
  const [filterPrice, setFilterPrice] = useState<PriceKey>("All");
  const [filterHeight, setFilterHeight] = useState<HeightKey>("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Tự động lấy danh sách category từ data.ts (khỏi hardcode)
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of products as Product[]) {
      if (p?.category) set.add(String(p.category));
    }
    const arr = Array.from(set).sort((a, b) => a.localeCompare(b, "vi"));
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

  const resetFilters = () => {
    setFilterType("All");
    setFilterPrice("All");
    setFilterHeight("All");
    setSearchTerm("");
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Banner */}
      <section
        className="text-white py-16 relative overflow-hidden"
        style={{ background: "linear-gradient(to right, #2F5D3A, #D4A017)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"4\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\"/></svg>')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Sản Phẩm Mai Tết</h1>
          <p className="text-lg opacity-90">Khám phá bộ sưu tập mai đa dạng, chất lượng cao</p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filter */}
        <aside className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
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
                      type="button"
                      onClick={() => setFilterType(type)}
                      className={`text-left px-4 py-2 rounded-lg text-sm transition-all select-none
                        ${
                          filterType === type
                            ? "bg-amber-400 text-amber-950 font-bold"
                            : "hover:bg-amber-50 text-slate-600"
                        }`}
                    >
                      {type === "All" ? "Tất Cả" : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mức Giá */}
              <div>
                <label className="text-sm text-slate-500 block mb-3">Mức Giá</label>
                <div className="flex flex-col gap-2">
                  {PRICE_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setFilterPrice(opt.key)}
                      className={`text-left px-4 py-2 rounded-lg text-sm transition-all select-none
                        ${
                          filterPrice === opt.key
                            ? "bg-amber-100 text-amber-900 font-bold ring-2 ring-black/80"
                            : "hover:bg-amber-50 text-slate-600"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chiều cao */}
              <div>
                <label className="text-sm text-slate-500 block mb-3">Chiều cao</label>

                <button
                  type="button"
                  onClick={() => setFilterHeight("All")}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all font-bold mb-2 select-none
                    ${filterHeight === "All" ? "bg-amber-400 text-amber-950" : "hover:bg-amber-50 text-slate-600"}`}
                >
                  Tất Cả Chiều cao
                </button>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {HEIGHT_OPTIONS.map((it) => (
                    <button
                      key={it.key}
                      type="button"
                      onClick={() => setFilterHeight(it.key)}
                      className={`p-2 border rounded transition-all select-none
                        ${
                          filterHeight === it.key
                            ? "bg-amber-100 border-amber-400 text-amber-900 font-bold"
                            : "hover:bg-amber-50 hover:border-amber-400 border-slate-200 text-slate-700"
                        }`}
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <button
                type="button"
                onClick={resetFilters}
                className="w-full mt-2 px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all select-none"
              >
                Reset bộ lọc
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="md:col-span-3">
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-lg">
              <input
                type="text"
                placeholder="Tìm kiếm mã/tên sản phẩm..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <p className="text-slate-500 text-sm">{filteredProducts.length} sản phẩm</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p: any) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase text-amber-700 shadow-sm">
                    {p.category}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-800 mb-2 line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{p.description}</p>

                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Giá thuê (5 - 10 ngày)</p>
                        <p className="text-lg font-bold text-red-600">
                          {parseMoney(p.rentPrice).toLocaleString("vi-VN")}đ
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(p);
                          setCurrentPage("detail");
                        }}
                        className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
                      >
                        Chi Tiết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductList;
