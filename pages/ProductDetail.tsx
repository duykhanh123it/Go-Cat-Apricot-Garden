
import React, { useState } from 'react';
import { Product, Page } from '../types';
import { products } from '../data';

interface ProductDetailProps {
  product: Product;
  setCurrentPage: (page: Page) => void;
  setSelectedProduct: (p: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, setCurrentPage, setSelectedProduct }) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'care'>('specs');
  const [mainImage, setMainImage] = useState(product.image);

  return (
    <div className="bg-slate-50 pb-20">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-6">
  <div className="flex gap-2 text-sm text-slate-400 select-none">
    <button
      onClick={() => setCurrentPage("home")}
      className="cursor-pointer hover:text-amber-500 transition-colors"
    >
      Trang chủ
    </button>

    <span className="cursor-default">/</span>

    <button
      onClick={() => setCurrentPage("products")}
      className="cursor-pointer hover:text-amber-500 transition-colors"
    >
      Sản phẩm
    </button>

    <span className="cursor-default">/</span>

    <span className="text-slate-900 font-medium truncate cursor-default">
      {product.name}
    </span>
  </div>
</div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl p-6 md:p-12 shadow-sm">
           {/* Image Gallery */}
           <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                 <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                 <button 
                    onClick={() => setMainImage(product.image)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${mainImage === product.image ? 'border-amber-500 shadow-md' : 'border-transparent'}`}
                 >
                    <img src={product.image} className="w-full h-full object-cover" alt="thumb-main" />
                 </button>
                 {product.thumbnails.map((thumb, idx) => (
                    <button 
                       key={idx}
                       onClick={() => setMainImage(thumb)}
                       className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${mainImage === thumb ? 'border-amber-500 shadow-md' : 'border-transparent'}`}
                    >
                       <img src={thumb} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                    </button>
                 ))}
              </div>
           </div>

           {/* Product Info */}
           <div className="flex flex-col">
              <div className="mb-8">
                <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest">Mã sản phẩm: {product.id}</p>
                <h1 className="text-4xl font-bold font-serif text-slate-900 mb-4">{product.name}</h1>
                <div className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase mb-6">
                  {product.category}
                </div>
                <p className="text-slate-600 leading-relaxed mb-8">{product.description}</p>
                
                <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Giá cho thuê (5 - 10 ngày)</p>
                      <p className="text-3xl font-bold text-amber-500">{product.rentPrice.toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-slate-400 mb-1">Giá bán sở hữu</p>
                    <p className="text-xl font-bold text-slate-700">Liên hệ</p>
                    <p className="text-[10px] text-amber-600 mt-1 italic">✨ Liên hệ để nhận báo giá chi tiết và ưu đãi đặc biệt</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                 <button 
                   onClick={() => setCurrentPage('booking')}
                   className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
                 >
                    Đặt Lịch Xem Trực Tiếp
                 </button>
                 <button className="w-full border-2 border-amber-400 text-amber-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Gọi Tư Vấn: 090 123 4567
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">🚚</div>
                    <div>
                      <p className="font-bold">Vận Chuyển An Toàn</p>
                      <p className="text-xs text-slate-400">Đội ngũ chuyên nghiệp</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">🎧</div>
                    <div>
                      <p className="font-bold">Hỗ Trợ Sau Tết</p>
                      <p className="text-xs text-slate-400">Tư vấn chăm sóc trọn đời</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm">
           <div className="flex gap-12 border-b border-slate-100 mb-8">
              <button 
                onClick={() => setActiveTab('specs')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'specs' ? 'text-amber-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-amber-400' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Thông Số Kỹ Thuật
              </button>
              <button 
                onClick={() => setActiveTab('care')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'care' ? 'text-amber-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-amber-400' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Hướng Dẫn Chăm Sóc
              </button>
           </div>

           {activeTab === 'specs' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                <div className="flex justify-between py-3 border-b border-slate-50">
                   <span className="text-slate-500">Chiều cao</span>
                   <span className="font-medium">{product.height}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-50">
                   <span className="text-slate-500">Hoành</span>
                   <span className="font-medium">---</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-50">
                   <span className="text-slate-500">Chiều ngang</span>
                   <span className="font-medium">{product.width}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-50">
                   <span className="text-slate-500">Số cánh hoa</span>
                   <span className="font-medium">8 - 15 cánh</span>
                </div>
             </div>
           ) : (
             <div className="space-y-6 max-w-3xl text-slate-600 leading-relaxed">
                <div>
                   <p className="font-bold text-amber-700 flex items-center gap-2 mb-2">💧 Tưới Nước</p>
                   <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Tưới 1 lần/ngày vào buổi trưa.</li>
                      <li>Tưới đều vào bầu đất trong chậu, không tưới trực tiếp lên hoa.</li>
                      <li>Tưới đúng cách giúp hoa nở tươi lâu, hạn chế rụng hoa.</li>
                   </ul>
                </div>
                <div>
                   <p className="font-bold text-red-700 flex items-center gap-2 mb-2">⚠️ Lưu ý quan trọng</p>
                   <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Không tưới nước nóng, nước đá.</li>
                      <li>Không tưới bia, rượu hoặc các loại hóa chất khác vì sẽ ảnh hưởng xấu đến cây mai.</li>
                   </ul>
                </div>
             </div>
           )}
        </div>

        {/* Related Products */}
        <div className="mt-20">
           <h2 className="text-3xl font-bold font-serif mb-12">Bạn Cũng Có Thể Thích</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map(p => (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col h-full">
                  <img src={p.image} alt={p.name} className="aspect-[4/3] object-cover" />
                  <div className="p-4 flex flex-col flex-1">
                     <h3 className="font-bold text-sm text-slate-800 mb-4 line-clamp-1">{p.name}</h3>
                     <div className="mt-auto flex justify-between items-center">
                        <span className="font-bold text-amber-600">{p.rentPrice.toLocaleString('vi-VN')}đ</span>
                        <button 
                          onClick={() => { setSelectedProduct(p); window.scrollTo(0,0); }}
                          className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                        >
                          Chi Tiết
                        </button>
                     </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
