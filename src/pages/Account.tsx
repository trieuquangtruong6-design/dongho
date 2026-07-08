import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Heart, ShoppingCart, User, ShieldCheck, LogOut, Camera, Save } from "lucide-react";
import { useStore } from "../contexts/StoreContext";

export default function Account() {
  const { currentUser, cart, wishlist, logout, updateCurrentUser } = useStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: ""
  });
  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        avatar: currentUser.avatar || ""
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const membershipLabel = currentUser.membership === "VIP" ? "Khách hàng VIP" : "Thành viên";
  const discountLabel = currentUser.membership === "VIP" ? "10%" : "5%";

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatar: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setSavedMessage("");
    setErrorMessage("");

    const result = await updateCurrentUser({
      name: form.name.trim() || currentUser.name,
      email: form.email.trim() || currentUser.email,
      phone: form.phone.trim(),
      address: form.address.trim(),
      avatar: form.avatar
    });

    setIsSaving(false);
    if (result.success) {
      setSavedMessage("Đã lưu thông tin tài khoản vào backend.");
      window.setTimeout(() => setSavedMessage(""), 2400);
    } else {
      setErrorMessage(result.error || "Không thể lưu thông tin tài khoản.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 text-xs text-neutral-500">
        <Link to="/" className="hover:text-yellow-600">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-bold text-neutral-900">Tài khoản của tôi</span>
      </div>

      <div className="overflow-hidden rounded-[8px] border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-neutral-200 bg-neutral-950 px-4 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#FFD700] text-black">
              {form.avatar ? (
                <img src={form.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
              ) : (
                <User size={30} strokeWidth={2.4} />
              )}
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-neutral-400">Tài khoản của tôi</div>
              <h1 className="mt-1 text-2xl font-black">{currentUser.name}</h1>
              <div className="mt-2 inline-flex items-center gap-2 rounded bg-yellow-400 px-2.5 py-1 text-[11px] font-black text-neutral-950">
                <ShieldCheck size={14} />
                {membershipLabel}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded border border-neutral-700 px-4 text-xs font-bold text-neutral-200 transition-colors hover:border-red-500 hover:text-red-400"
          >
            <LogOut size={15} />
            Thoát tài khoản
          </button>
        </div>

        <form onSubmit={handleSave} className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="rounded-[6px] border border-neutral-200 bg-neutral-50 p-4">
            <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white text-neutral-400">
              {form.avatar ? (
                <img src={form.avatar} alt="Avatar preview" className="h-full w-full object-cover" />
              ) : (
                <User size={44} />
              )}
            </div>
            <label className="mt-4 flex h-10 cursor-pointer items-center justify-center gap-2 rounded border border-neutral-300 bg-white text-xs font-black text-neutral-800 transition-colors hover:border-yellow-400 hover:bg-yellow-50">
              <Camera size={15} />
              Thêm ảnh avatar
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[11px] font-bold uppercase text-neutral-500">Họ và tên</span>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-2 h-11 w-full rounded border border-neutral-300 px-3 text-sm font-semibold outline-none focus:border-yellow-400"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-bold uppercase text-neutral-500">Email đăng nhập</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="mt-2 h-11 w-full rounded border border-neutral-300 px-3 text-sm font-semibold outline-none focus:border-yellow-400"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-bold uppercase text-neutral-500">Số điện thoại</span>
              <input
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Nhập số điện thoại"
                className="mt-2 h-11 w-full rounded border border-neutral-300 px-3 text-sm font-semibold outline-none focus:border-yellow-400"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-bold uppercase text-neutral-500">Mã tài khoản</span>
              <input
                value={currentUser.id}
                disabled
                className="mt-2 h-11 w-full rounded border border-neutral-200 bg-neutral-100 px-3 text-sm font-semibold text-neutral-500"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-[11px] font-bold uppercase text-neutral-500">Địa chỉ nhận hàng</span>
              <textarea
                value={form.address}
                onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                placeholder="Nhập địa chỉ mặc định"
                rows={3}
                className="mt-2 w-full rounded border border-neutral-300 px-3 py-2 text-sm font-semibold outline-none focus:border-yellow-400"
              />
            </label>

            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded bg-yellow-400 px-5 text-xs font-black text-neutral-950 transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={15} />
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              {savedMessage && <span className="text-xs font-bold text-green-600">{savedMessage}</span>}
              {errorMessage && <span className="text-xs font-bold text-red-600">{errorMessage}</span>}
            </div>
          </div>
        </form>

        <div className="grid gap-4 border-t border-neutral-200 p-4 sm:grid-cols-2 sm:p-6">
          <div className="rounded-[6px] border border-neutral-200 bg-neutral-50 p-4">
            <div className="text-[11px] font-bold uppercase text-neutral-500">Ưu đãi thành viên</div>
            <div className="mt-2 text-sm font-black text-neutral-900">Giảm {discountLabel} khi thanh toán</div>
          </div>
          <div className="rounded-[6px] border border-neutral-200 bg-neutral-50 p-4">
            <div className="text-[11px] font-bold uppercase text-neutral-500">Hạng thành viên</div>
            <div className="mt-2 text-sm font-black text-neutral-900">{membershipLabel}</div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-neutral-200 p-4 sm:grid-cols-2 sm:p-6">
          <Link
            to="/cart"
            className="flex items-center justify-between rounded-[6px] border border-neutral-200 p-4 transition-colors hover:border-yellow-400 hover:bg-yellow-50"
          >
            <div>
              <div className="text-sm font-black text-neutral-900">Giỏ hàng</div>
              <div className="mt-1 text-xs text-neutral-500">{cartCount} sản phẩm đang chọn</div>
            </div>
            <ShoppingCart className="text-yellow-600" size={24} />
          </Link>

          <Link
            to="/wishlist"
            className="flex items-center justify-between rounded-[6px] border border-neutral-200 p-4 transition-colors hover:border-yellow-400 hover:bg-yellow-50"
          >
            <div>
              <div className="text-sm font-black text-neutral-900">Sản phẩm yêu thích</div>
              <div className="mt-1 text-xs text-neutral-500">{wishlist.length} sản phẩm đã lưu</div>
            </div>
            <Heart className="text-red-500" size={24} />
          </Link>
        </div>

      </div>
    </div>
  );
}
