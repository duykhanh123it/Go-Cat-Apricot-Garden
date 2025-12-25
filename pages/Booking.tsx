import React, { useMemo, useState } from "react";

/**
 * Booking.tsx (Option B: Google Sheet via Apps Script Web App)
 *
 * Bạn chỉ cần:
 * 1) Tạo Google Sheet + Apps Script (mình gửi code ở chat)
 * 2) Deploy Web App => dán URL vào APPS_SCRIPT_WEBAPP_URL bên dưới
 *
 * Lưu ý CORS:
 * - Google Apps Script Web App thường chặn CORS với fetch trực tiếp.
 * - Vì vậy mình dùng fetch({ mode: "no-cors" }) để gửi dữ liệu "fire-and-forget".
 * - Nếu bạn muốn nhận lại "mã đặt lịch" từ server, mình sẽ đưa phương án iframe+postMessage.
 */

const APPS_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycby-xOXCtHDQJ3G1tMp-dqrN0Pfu8hVx-9mzQZkZCm51FrvaWobjFRaC9iSqPQxvgaVW/exec"; // TODO: dán URL dạng https://script.google.com/macros/s/XXXX/exec

type BookingForm = {
  name: string;
  phone: string;
  email: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  note: string;
  // honeypot chống bot
  website: string;
};

const phoneVN = (s: string) => {
  const p = s.replace(/\s/g, "");
  return /^(0|\+84)\d{9}$/.test(p);
};

const isFutureOrToday = (dateISO: string) => {
  if (!dateISO) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateISO + "T00:00:00");
  return d.getTime() >= today.getTime();
};

const toVNPhone = (s: string) => s.replace(/\s/g, "");

const Booking: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successCode, setSuccessCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState<BookingForm>({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    note: "",
    website: "",
  });

  const canSubmit = useMemo(() => {
    return (
      formData.name.trim() &&
      phoneVN(formData.phone) &&
      formData.date &&
      isFutureOrToday(formData.date) &&
      formData.time
    );
  }, [formData]);

  const setField =
    <K extends keyof BookingForm>(key: K) =>
    (value: BookingForm[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      note: "",
      website: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessCode("");

    // Honeypot: bot hay điền field ẩn
    if (formData.website.trim()) return;

    if (!formData.name.trim()) return setError("Vui lòng nhập họ và tên.");
    if (!phoneVN(formData.phone)) return setError("Số điện thoại không hợp lệ (0xxxxxxxxx hoặc +84xxxxxxxxx).");
    if (!formData.date) return setError("Vui lòng chọn ngày tham quan.");
    if (!isFutureOrToday(formData.date)) return setError("Ngày tham quan phải từ hôm nay trở đi.");
    if (!formData.time) return setError("Vui lòng chọn giờ hẹn.");

    if (!APPS_SCRIPT_WEBAPP_URL) {
      return setError("Chưa cấu hình APPS_SCRIPT_WEBAPP_URL. Bạn hãy dán URL Web App (Apps Script) vào Booking.tsx.");
    }

    const payload = {
      ...formData,
      phone: toVNPhone(formData.phone),
      createdAt: new Date().toISOString(),
      source: "vuonmaigocat_web",
    };

    // Code hiển thị cho người dùng (tạm thời) – vì no-cors không đọc được response
    const localCode = ("DL" + Date.now().toString().slice(-8)).toUpperCase();

    setLoading(true);
    try {
      // Fire-and-forget (no-cors)
      await fetch(APPS_SCRIPT_WEBAPP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          // Apps Script đọc e.postData.contents được, kể cả text/plain
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      setSuccessCode(localCode);
      setIsSubmitted(true);
      resetForm();
    } catch (err: any) {
      setError(err?.message || "Gửi đặt lịch thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Đặt Lịch Tham Quan</h1>
          <p className="text-white/90 text-lg">Hãy đến trực tiếp vườn để trải nghiệm và chọn lựa cây mai ưng ý</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left column */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&auto=format&fit=crop&q=60"
                alt="Vườn Mai Gò Cát"
                className="w-full h-80 object-cover"
                loading="lazy"
              />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-md">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-7 bg-amber-500 rounded-full" />
                Thông Tin Vườn
              </h3>

              <div className="space-y-6 text-slate-700">
                <div className="flex gap-4">
                  <div className="text-amber-500 font-bold">📍</div>
                  <div>
                    <p className="font-bold">Địa Chỉ</p>
                    <p className="text-slate-500 text-sm">
                      56 Đường 882, P. Long Trường, Thành phố Hồ Chí Minh
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-amber-500 font-bold">⏰</div>
                  <div>
                    <p className="font-bold">Giờ Làm Việc</p>
                    <p className="text-slate-500 text-sm">Hàng ngày: 7:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl">
              <p className="font-bold text-amber-800 flex items-center gap-2 mb-4">💡 Gợi Ý Cho Bạn</p>
              <ul className="text-amber-900/80 text-sm space-y-3 leading-relaxed">
                <li>• Nên đến vườn vào buổi sáng để chọn mai trong điều kiện ánh sáng tốt nhất.</li>
                <li>• Mang theo ảnh không gian đặt mai để được tư vấn kích thước phù hợp.</li>
                <li>• Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ bạn tại vườn.</li>
              </ul>
            </div>
          </div>

          {/* Right column - Form */}
          <div className="bg-white p-10 rounded-3xl shadow-xl">
            {!isSubmitted ? (
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-8">Thông Tin Đặt Lịch</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot (ẩn) */}
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setField("website")(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      Họ và Tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      value={formData.name}
                      onChange={(e) => setField("name")(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      Số Điện Thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="090 123 4567"
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      value={formData.phone}
                      onChange={(e) => setField("phone")(e.target.value)}
                      required
                    />
                    {formData.phone && !phoneVN(formData.phone) && (
                      <p className="text-xs text-red-600 mt-2">SĐT phải có 10 số (0xxxxxxxxx) hoặc +84xxxxxxxxx.</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-700">Email</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      value={formData.email}
                      onChange={(e) => setField("email")(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700">
                        Ngày Tham Quan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        value={formData.date}
                        onChange={(e) => setField("date")(e.target.value)}
                        required
                      />
                      {formData.date && !isFutureOrToday(formData.date) && (
                        <p className="text-xs text-red-600 mt-2">Ngày tham quan phải từ hôm nay trở đi.</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-700">
                        Giờ Hẹn <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        value={formData.time}
                        onChange={(e) => setField("time")(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-700">Ghi Chú</label>
                    <textarea
                      placeholder="Nhu cầu cụ thể của bạn..."
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[120px]"
                      value={formData.note}
                      onChange={(e) => setField("note")(e.target.value)}
                    />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading || !canSubmit}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all
                      ${
                        loading || !canSubmit
                          ? "bg-red-300 cursor-not-allowed"
                          : "bg-red-700 hover:bg-red-800 active:scale-[0.99]"
                      }`}
                  >
                    {loading ? "Đang gửi..." : "Xác Nhận Đặt Lịch Hẹn"}
                  </button>

                  <p className="text-xs text-slate-400 text-center mt-4">
                    Bằng việc đặt lịch, bạn đồng ý với các điều khoản dịch vụ của chúng tôi.
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center space-y-4 py-10">
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-green-600 text-5xl mx-auto mb-8 border-4 border-green-200 bg-green-100">
                  ✓
                </div>

                <h4 className="text-2xl font-bold text-slate-900">Đặt Lịch Thành Công!</h4>

                <p className="text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Chúng tôi đã nhận được yêu cầu của bạn. Đội ngũ sẽ liên hệ xác nhận trong thời gian sớm nhất.
                </p>

                {successCode && (
                  <div className="inline-block mt-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm">
                    Mã lịch hẹn (tạm thời): <b>{successCode}</b>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setError("");
                    setSuccessCode("");
                  }}
                  className="text-amber-600 font-bold hover:underline"
                >
                  Đặt một lịch hẹn khác
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
