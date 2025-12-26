// src/types.ts

// Các trang đang dùng trong App.tsx
export type Page =
  | "home"
  | "products"
  | "product-detail"
  | "booking"
  | "contact";

/**
 * Product dùng cho web Vườn Mai Gò Cát
 * - Các field số có thể null để tránh bug khi data thiếu
 * - KHÔNG dùng undefined để dễ kiểm soát render
 */
export interface Product {
  /** ID hiển thị & dùng nội bộ (vd: "BS 01") */
  id: string;

  /** Tên hiển thị (vd: "Mai BS 01") */
  name: string;

  /** Giá bán (VND) – null = Liên hệ */
  price: number | null;

  /** Giá thuê (VND) – null = Liên hệ */
  rentPrice: number | null;

  /** Phân loại hiển thị */
  category: "Mai Bonsai" | "Mai Tán" | "Khác";

  /** Chiều cao (vd: "2.5m") */
  height: string | null;

  /** Tán / ngang (vd: "1.8m") */
  width: string | null;

  /** Tuổi cây (nếu có) */
  age: number | null;

  /** Ảnh chính */
  image: string;

  /** Ảnh phụ */
  thumbnails: string[];

  /** Mô tả chi tiết */
  description: string;
}
