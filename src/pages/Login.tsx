import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Award, CheckCircle, Lock, Mail, ShieldAlert, User } from "lucide-react";
import { useStore } from "../contexts/StoreContext";

export default function Login() {
  const { login, registerUser, currentUser } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/shop";

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!name.trim() || !email.trim() || !password) {
          setError("Vui lòng điền đầy đủ các thông tin.");
          setLoading(false);
          return;
        }

        const result = await registerUser(name, email, password);
        if (result.success) {
          setMessage("Đăng ký thành viên Đăng Quang thành công.");
          setTimeout(() => navigate("/shop"), 1000);
        } else {
          setError(result.error || "Gặp lỗi khi tạo tài khoản.");
        }
      } else {
        if (!email.trim() || !password) {
          setError("Vui lòng điền email và mật khẩu.");
          setLoading(false);
          return;
        }

        const result = await login(email, password);
        if (result.success) {
          setMessage("Đăng nhập thành công.");
          setTimeout(() => navigate(redirectTo, { replace: true }), 700);
        } else {
          setError(result.error || "Tài khoản hoặc mật khẩu không chính xác.");
        }
      }
    } catch {
      setError("Không kết nối được tới hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return (
      <div className="mx-auto max-w-md select-none space-y-6 px-4 py-20 text-center">
        <CheckCircle className="mx-auto h-16 w-16 animate-bounce text-yellow-400" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold uppercase text-neutral-800">Bạn đang đăng nhập</h2>
          <p className="text-xs text-neutral-400">
            Tài khoản: <strong className="text-neutral-900">{currentUser.email}</strong> ({currentUser.membership})
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate(currentUser.role === "ADMIN" ? "/admin" : "/shop")}
            className="rounded bg-yellow-400 px-6 py-2.5 text-xs font-black text-neutral-950 shadow hover:bg-yellow-500"
          >
            {currentUser.role === "ADMIN" ? "Vào trang quản trị" : "Vào cửa hàng mua sắm"}
          </button>
          <Link
            to="/"
            className="rounded bg-neutral-150 px-6 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-200"
          >
            Trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl select-none grid-cols-1 items-center gap-12 px-4 py-16 lg:grid-cols-2">
      <div className="space-y-6 rounded border border-neutral-800 bg-neutral-900 p-8 text-white shadow-xl sm:p-10">
        <div className="space-y-1">
          <span className="block text-xs font-black uppercase tracking-widest text-yellow-400">Privilege Platinum Club</span>
          <h2 className="text-lg font-black uppercase leading-tight tracking-tight text-white sm:text-2xl">
            Trở thành hội viên VIP Đăng Quang Thượng Lưu
          </h2>
          <p className="text-xs text-neutral-400">
            Hợp tác bền vững, trao gửi đẳng cấp và quyền lợi trọn đời.
          </p>
        </div>

        <div className="space-y-4 border-t border-neutral-800 pt-4 text-xs">
          <div className="flex gap-3">
            <Award className="shrink-0 text-yellow-400" size={20} />
            <div>
              <span className="block text-[11px] font-bold uppercase text-white">Thành viên Đồng</span>
              <p className="text-neutral-400">
                Nhận chiết khấu trực tiếp <strong className="text-yellow-400">5%</strong> cho các đơn đặt hàng.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Award className="shrink-0 text-yellow-400" size={20} />
            <div>
              <span className="block text-[11px] font-bold uppercase text-white">Thành viên Vàng</span>
              <p className="text-neutral-400">
                Tự động nâng cấp khi tích lũy doanh số trên 15 triệu VND, hưởng chiết khấu lên tới <strong className="text-yellow-400">10%</strong>.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <ShieldAlert className="shrink-0 text-yellow-400" size={20} />
            <div>
              <span className="block text-[11px] font-bold uppercase text-white">Bảo mật tài khoản</span>
              <p className="text-neutral-400">
                Thông tin đăng nhập được bảo vệ và mật khẩu được mã hóa trên hệ thống.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex gap-6 border-b border-neutral-200">
          <button
            onClick={() => {
              setIsRegisterMode(false);
              setError("");
            }}
            className={`cursor-pointer border-b-2 pb-3 text-sm font-extrabold transition-colors sm:text-base ${
              !isRegisterMode ? "border-yellow-400 text-neutral-900" : "border-transparent text-neutral-400"
            }`}
          >
            Đăng nhập tài khoản
          </button>
          <button
            onClick={() => {
              setIsRegisterMode(true);
              setError("");
            }}
            className={`cursor-pointer border-b-2 pb-3 text-sm font-extrabold transition-colors sm:text-base ${
              isRegisterMode ? "border-yellow-400 text-neutral-900" : "border-transparent text-neutral-400"
            }`}
          >
            Đăng ký thành viên mới
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div className="space-y-1">
              <span className="block text-[10px] font-extrabold uppercase text-neutral-500 sm:text-xs">Họ và tên khách hàng</span>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nhập họ và tên đầy đủ..."
                  className="w-full rounded border border-neutral-300 bg-neutral-50 py-2.5 pl-9 pr-3 text-xs placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
                <User className="absolute left-3 text-neutral-400" size={14} />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <span className="block text-[10px] font-extrabold uppercase text-neutral-500 sm:text-xs">Địa chỉ email</span>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Ví dụ: name@gmail.com"
                className="w-full rounded border border-neutral-300 bg-neutral-50 py-2.5 pl-9 pr-3 text-xs placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
              <Mail className="absolute left-3 text-neutral-400" size={14} />
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-extrabold uppercase text-neutral-500 sm:text-xs">Mật khẩu</span>
            <div className="relative flex items-center">
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full rounded border border-neutral-300 bg-neutral-50 py-2.5 pl-9 pr-3 text-xs placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
              <Lock className="absolute left-3 text-neutral-400" size={14} />
            </div>
          </div>

          {error && <div className="rounded border border-red-200 bg-red-50 p-2 text-xs font-bold text-red-500">{error}</div>}
          {message && <div className="rounded border border-green-200 bg-green-50 p-2 text-xs font-bold text-green-600">{message}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded bg-yellow-400 py-3 text-xs font-black text-neutral-950 transition-colors hover:bg-yellow-500 disabled:bg-neutral-200 disabled:text-neutral-400 sm:text-sm"
          >
            {loading ? "Đang kết nối hệ thống..." : isRegisterMode ? "Hoàn tất đăng ký hội viên" : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-[10px] uppercase leading-tight text-neutral-400">
          Cam kết bảo vệ quyền riêng tư. Đăng Quang Watch không chia sẻ tài khoản của quý khách cho bên thứ ba.
        </p>
      </div>
    </div>
  );
}
