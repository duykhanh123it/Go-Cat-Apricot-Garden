import React from "react";
import { Page } from "../types";

type ContactProps = {
  setCurrentPage: (page: Page) => void;
};

const Contact: React.FC<ContactProps> = ({ setCurrentPage }) => {
  const openGoogleMaps = () => {
    // Link chỉ đường đến địa chỉ (bạn có thể đổi query nếu muốn)
    window.open(
      "https://www.google.com/maps/search/?api=1&query=56%20%C4%90%C6%B0%E1%BB%9Dng%20882%2C%20P.%20Long%20Tr%C6%B0%E1%BB%9Dng%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh",
      "_blank"
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Banner */}
      <section
        className="text-white py-20"
        style={{
          background: "linear-gradient(to right, #D4A017, #2F5D3A)",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold font-serif mb-4">Liên Hệ Tư Vấn</h1>
          <p className="text-xl opacity-90">Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn 24/7</p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-12">
        {/* Advisor card */}
        <section className="mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold font-serif mb-10 tracking-widest">
              ĐỘI NGŨ TƯ VẤN VIÊN
            </h2>

            <div className="w-28 h-28 mx-auto rounded-full bg-slate-100 flex items-center justify-center shadow-inner mb-6 border-4 border-amber-100">
              <span className="text-4xl text-slate-400">👤</span>
            </div>

            <h3 className="text-xl font-bold text-amber-700 mb-2">Ông Lê Minh Quý</h3>
            <p className="text-slate-500 mb-8">Nghệ nhân Mai Vàng hơn 25 năm kinh nghiệm</p>

            <div className="flex flex-col md:flex-row gap-4 w-full max-w-md mx-auto">
              {/* Gọi điện */}
              <a
                href="tel:0922727277"
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-amber-950 py-4 rounded-xl
                           font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
              >
                <span className="text-xl">📞</span> 092 272 7277
              </a>

              {/* Chat Zalo */}
              <a
                href="https://zalo.me/0922727277"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl
                           font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
              >
                <span className="text-xl">💬</span> Chat Zalo
              </a>
            </div>
          </div>
        </section>

        {/* Contact info grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Left column */}
          <div>
            <h3 className="text-2xl font-bold font-serif mb-8 border-l-4 border-amber-500 pl-4">
              Thông Tin Liên Hệ
            </h3>

            <div className="space-y-6">
              <div className="p-6 bg-white rounded-2xl shadow-sm space-y-2">
                <p className="font-bold text-amber-600 uppercase text-xs tracking-widest">📍 Địa Chỉ Vườn</p>
                <p className="text-slate-700 leading-relaxed">
                  56 Đường 882, P. Long Trường, Thành phố Hồ Chí Minh, Việt Nam
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-sm space-y-2">
                <p className="font-bold text-amber-600 uppercase text-xs tracking-widest">📞 Hotline</p>
                <div className="space-y-1 text-slate-700">
                  <a className="hover:underline" href="tel:0922727277">
                    0922 727 277: Lê Minh Quý
                  </a>
                  <br />
                  <a className="hover:underline" href="tel:0908019236">
                    0908 019 236: Lê Hoàng Minh Phụng
                  </a>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-sm space-y-2">
                <p className="font-bold text-amber-600 uppercase text-xs tracking-widest">⏰ Giờ Làm Việc</p>
                <p className="text-slate-700">Thứ 2 - Chủ Nhật: 7:00 - 18:00</p>
              </div>
            </div>

            {/* Social buttons (đồng bộ footer) */}
            <div className="mt-8 flex gap-4">
              <a
                href="https://www.facebook.com/vuonmaigocatquan9"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Vườn Mai Gò Cát"
                className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center shadow-lg
                           hover:rotate-12 transition-all select-none"
              >
                f
              </a>

              <a
                href="https://m.me/vuonmaigocatquan9"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Messenger Vườn Mai Gò Cát"
                className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg
                           hover:rotate-12 transition-all select-none text-xl"
              >
                💬
              </a>

              <a
                href="tel:0922727277"
                aria-label="Gọi điện Vườn Mai Gò Cát"
                className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg
                           hover:rotate-12 transition-all select-none text-white text-xl"
              >
                📞
              </a>
            </div>
          </div>

          {/* Right column: Map */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold font-serif mb-8 border-l-4 border-amber-500 pl-4">
              Bản Đồ Đường Đi
            </h3>

            <div className="bg-white p-4 rounded-3xl shadow-xl h-[400px] relative group overflow-hidden">
              <img
                src="/map.png"
                className="w-full h-full object-cover brightness-75 rounded-2xl transition-transform duration-1000 group-hover:scale-110"
                alt="map"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/20 p-6 text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  📍
                </div>
                <p className="font-bold text-2xl mb-2">Vườn Mai Gò Cát</p>
                <p className="text-sm opacity-80 mb-6 max-w-xs">
                  Đường Gò Cát, Phú Hữu, Quận 9, TP.HCM
                </p>

                <button
                  type="button"
                  onClick={openGoogleMaps}
                  className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-6 py-3 rounded-xl
                             font-bold shadow-lg transition-all active:scale-95"
                >
                  Mở Google Maps
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA bottom */}
        <section
          className="relative py-20 px-6 md:px-12 rounded-[3rem] overflow-hidden"
          style={{
            background: "linear-gradient(to right, #D4A017, #2F5D3A)",
          }}
        >
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative z-10 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">Cần Tư Vấn Ngay?</h2>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-light">
              Liên hệ hotline hoặc đặt lịch hẹn để được phục vụ tốt nhất cho mùa Tết này
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <a
                href="tel:0922727277"
                className="bg-white text-[#2F5D3A] px-10 py-5 rounded-2xl font-bold text-lg shadow-xl
                           flex items-center justify-center gap-3 transition-all hover:bg-slate-50 active:scale-95"
              >
                <span className="text-2xl">📞</span> Gọi Ngay: 0922 727 277
              </a>

              <button
                type="button"
                onClick={() => setCurrentPage("booking")}
                className="bg-white/15 backdrop-blur-md border border-white/30 text-white
                           px-10 py-5 rounded-2xl font-bold text-lg
                           flex items-center justify-center transition-all
                           hover:bg-white/25 active:scale-95"
              >
                Đặt Lịch Hẹn
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
