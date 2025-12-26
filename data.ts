// src/data.ts

import raw from "./products_raw.json";
import { Product } from "./types";

/**
 * Kiểu dữ liệu gốc từ JSON
 * (giữ nguyên key tiếng Việt để map chính xác)
 */
type RawRow = {
  "Mã Cây": string;
  "Giá Thuê (triệu)": number | null;
  "Giá Bán (triệu)": number | null;
  "Cao_m": number | null;
  "Ngang_m": number | null;
  "Hoành_cm": number | null;
  "Chậu_m": number | null;
};

/** Triệu → VND */
const toVND = (million: number | null): number | null => {
  if (million === null) return null;
  const n = Number(million);
  return Number.isFinite(n) ? Math.round(n * 1_000_000) : null;
};

/** Số mét → chuỗi hiển thị (vd: 2.5 → "2.5m") */
const fmtMeter = (m: number | null): string | null => {
  if (m === null) return null;
  const n = Number(m);
  if (!Number.isFinite(n)) return null;
  return `${n}m`;
};

/** Chuẩn hoá mã cây để hiển thị */
const normalizeCode = (code: string): string =>
  String(code).trim().replace(/\s+/g, " "); // "BS   01" → "BS 01"

/** Chuẩn hoá mã cây cho tên file ảnh */
const codeForImage = (code: string): string =>
  normalizeCode(code).replace(/\s+/g, ""); // "BS 01" → "BS01"

/**
 * DANH SÁCH SẢN PHẨM DÙNG CHO TOÀN BỘ WEB
 */
export const products: Product[] = (raw as RawRow[])
  .filter((row) => row && row["Mã Cây"])
  .map((row) => {
    const code = normalizeCode(row["Mã Cây"]);
    const imageCode = codeForImage(code);

    // Quy ước ảnh:
    // public/products/BS01.jpg
    // nếu chưa có ảnh → dùng ảnh fallback
    const fallbackImage = "/no-avatar.png";
    const image = `/products/${imageCode}.jpg`;

    return {
      id: code,
      name: `Mai ${code}`,

      category: "Mai Bonsai",

      price: toVND(row["Giá Bán (triệu)"]),
      rentPrice: toVND(row["Giá Thuê (triệu)"]),

      height: fmtMeter(row["Cao_m"]),
      width: fmtMeter(row["Ngang_m"]),
      age: null,

      image: image || fallbackImage,
      thumbnails: [image || fallbackImage],

      description: `Mã cây ${code}. Vui lòng liên hệ để xem cây thực tế và nhận tư vấn chi tiết.`,
    };
  });
