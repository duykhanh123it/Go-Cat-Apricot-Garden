
import React from 'react';
import { Page } from '../types';
import anhMai1 from '../img/anhmai1_tc.png';
import anhMai2 from '../img/anhmai2_tc.png';
import anhMai3 from '../img/anhmai3_tc.png';
import anhMai4 from '../img/anhmai4_tc.png';
import anhBiaHeader from '../img/anhBiaHeader.png';
import anhBiaHeadr from '../img/anhBiaHeader.png';


interface HomeProps {
  setCurrentPage: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ setCurrentPage }) => {
  const images = [
    anhMai1,
    anhMai2,
    anhMai3,
    anhMai4,
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        <img 
          src={anhBiaHeader}
          alt="hero" 
          className="absolute inset-0 w-full h-full object-cover brightness-50" 
        />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight">Vườn Mai Gò Cát</h1>
          <p className="text-xl md:text-2xl mb-8 font-light text-slate-200">
            Tinh Hoa Mai Tết Miền Nam - Hơn 25 Năm Khẳng Định Chất Lượng
          </p>
          <button 
            onClick={() => setCurrentPage('products')}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-8 py-3 rounded-full font-bold text-lg transition-all shadow-lg active:scale-95"
          >
            Khám Phá Bộ Sưu Tập
          </button>
        </div>
      </section>

      {/* Intro Info */}
      <section className="bg-slate-50 pb-8">
        <div className="container mx-auto px-4">
          <div className="relative z-10 -mt-20 md:-mt-24 lg:-mt-32">
            <div className="max-w-4xl mx-auto bg-amber-50 rounded-2xl shadow-xl overflow-hidden md:flex">
              <div className="p-8 md:p-12 text-center flex-1">
                <h2 className="text-3xl font-bold font-serif text-amber-900 mb-6 uppercase tracking-wide">
                  Hơn 25 Năm Khẳng Định Chất Lượng
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Vườn Mai Gò Cát tự hào là địa chỉ uy tín hàng đầu trong việc cung cấp mai Tết cao cấp tại miền Nam. 
                  Với kinh nghiệm trên 25 năm, chúng tôi mang đến những cây mai đẹp nhất, được chăm sóc tỉ mỉ từ nghệ nhân giàu tâm huyết, 
                  đảm bảo mỗi khách hàng đều có một mùa Tết thật trọn vẹn và ý nghĩa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Gallery Section */}
      <section className="container mx-auto px-4 pt-28 md:pt-32 lg:pt-36 pb-20">
        <h2 className="text-3xl font-bold font-serif text-center mb-12">Khám phá Vườn Mai Gò Cát</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
           {images.map((img, i) => (
             <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-md group cursor-pointer">
                <img src={img} alt={`gallery-${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
             </div>
           ))}
        </div>
      </section>

      {/* Booking CTA Banner */}
      <section
  className="relative overflow-hidden py-20 text-white"
  style={{
    background: "linear-gradient(to right, #2F5D3A, #D4A017)",
  }}
>
  {/* Gradient mask (tăng độ đậm vàng + nhạt dần sang xanh) */}
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      background:
        "radial-gradient(1200px 600px at 85% 70%, rgba(255,255,255,0.18), rgba(0,0,0,0) 60%), linear-gradient(to right, rgba(0,0,0,0.12), rgba(0,0,0,0))",
      mixBlendMode: "overlay",
      opacity: 0.9,
    }}
  />

  {/* Sparkle / bokeh (chấm sáng tập trung góc phải dưới) */}
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      backgroundImage: `
        radial-gradient(circle at 88% 82%, rgba(255,255,255,0.50) 0 2px, transparent 3px),
        radial-gradient(circle at 92% 78%, rgba(255,255,255,0.35) 0 1.5px, transparent 3px),
        radial-gradient(circle at 84% 88%, rgba(255,255,255,0.28) 0 1.2px, transparent 3px),
        radial-gradient(circle at 95% 90%, rgba(255,255,255,0.22) 0 1.2px, transparent 3px),
        radial-gradient(circle at 80% 80%, rgba(255,255,255,0.18) 0 1px, transparent 3px),
        radial-gradient(circle at 90% 92%, rgba(255,255,255,0.18) 0 1px, transparent 3px),

        /* glow rộng ở góc phải dưới */
        radial-gradient(700px 350px at 86% 86%, rgba(255,236,150,0.28), rgba(0,0,0,0) 60%)
      `,
      backgroundRepeat: "no-repeat",
      opacity: 0.9,
      filter: "blur(0.2px)",
    }}
  />

  {/* Noise (hạt nhỏ li ti) */}
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
      backgroundRepeat: "repeat",
      mixBlendMode: "soft-light",
      opacity: 0.28,
    }}
  />

  {/* Nội dung */}
  <div className="relative container mx-auto px-4 text-center">
    <h2 className="text-4xl font-bold font-serif mb-6">
      Đặt Lịch Tham Quan Vườn
    </h2>

    <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
      Hãy đến trực tiếp vườn để trải nghiệm không gian mai vàng rực rỡ và được tư vấn tận tình nhất.
    </p>

    <button
      onClick={() => setCurrentPage("booking")}
      className="bg-white text-[#2F5D3A] hover:bg-slate-100 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl active:scale-95"
    >
      Đặt Lịch Hẹn Ngay
    </button>
  </div>
</section>


      {/* Mini Info & Map */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold font-serif mb-8 border-l-4 border-amber-500 pl-4">Thông Tin Liên Hệ</h3>
            <div className="space-y-6">
               <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">📍</div>
                  <div>
                    <p className="font-bold">Địa Chỉ Vườn</p>
                    <p className="text-slate-500 text-sm">56 Đường 882, P. Long Trường, Thành phố Hồ Chí Minh</p>
                  </div>
               </div>
               <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">📞</div>
                  <div>
                    <p className="font-bold">Hotline</p>
                    <p className="text-slate-500 text-sm">0922 727 277: Lê Minh Quý</p>
                    <p className="text-slate-500 text-sm">0908 019 236: Lê Hoàng Minh Phụng</p>
                  </div>
               </div>
               <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">⏰</div>
                  <div>
                    <p className="font-bold">Giờ Làm Việc</p>
                    <p className="text-slate-500 text-sm">Thứ 2 - Chủ Nhật: 7:00 - 18:00</p>
                  </div>
               </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl h-80 relative group">
            <img
  src="/map.png"
  className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
  alt="map"
/>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/20">
               <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">📍</div>
               <p className="font-bold text-xl mb-4">Vườn Mai Gò Cát</p>
               <button
  type="button"
  onClick={() => window.open("https://maps.app.goo.gl/peJCCfcFDsLrZ7UY7", "_blank", "noopener,noreferrer")}
  className="bg-amber-400 text-amber-950 px-6 py-2 rounded-lg font-bold text-sm"
>
  Mở Google Maps
</button>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
