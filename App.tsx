import React, { useCallback, useMemo, useState } from "react";
import { Page, Product } from "./types";
import { products } from "./data";
import { Navbar, Footer } from "./components/Layout";

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";

const App: React.FC = () => {
  const initialProduct = useMemo<Product | null>(() => products?.[0] ?? null, []);

  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct);

  /**
   * ✅ Điều hướng chuẩn cho toàn app:
   * - đổi tab (page)
   * - tự cuộn về đầu trang (fix lỗi: bấm CTA đổi tab nhưng giữ nguyên vị trí scroll)
   */
  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" }); // muốn "rụp" thì đổi thành "auto"
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home setCurrentPage={navigate} />;

      case "products":
        return <ProductList setCurrentPage={navigate} setSelectedProduct={setSelectedProduct} />;

      case "product-detail":
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            setCurrentPage={navigate}
            setSelectedProduct={setSelectedProduct}
          />
        ) : (
          <ProductList setCurrentPage={navigate} setSelectedProduct={setSelectedProduct} />
        );

      case "booking":
        return <Booking />;

      case "contact":
        return <Contact setCurrentPage={navigate} />;

      default:
        return <Home setCurrentPage={navigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentPage={currentPage} setCurrentPage={navigate} />

      <main className="flex-grow">{renderPage()}</main>

      <Footer setCurrentPage={navigate} />

      {/* Persistent Floating Call-to-Action (giữ nguyên như bản cũ) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 md:hidden">
        <button className="w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl animate-bounce">
          💬
        </button>
        <button className="w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl">
          📞
        </button>
      </div>
    </div>
  );
};

export default App;
