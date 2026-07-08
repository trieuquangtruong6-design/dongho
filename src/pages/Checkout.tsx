import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Info,
  PackageCheck,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { useStore } from "../contexts/StoreContext";
import type { CartItem } from "../types";

type PlacedOrder = {
  name: string;
  phone: string;
  address: string;
  note: string;
  items: CartItem[];
  original: number;
  savings: number;
  final: number;
  code: string;
  warrantyCode?: string;
  status: string;
  createdAt: string;
};

export default function Checkout() {
  const { cart, currentUser, checkout } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [note, setNote] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalOriginal = cart.reduce((sum, item) => {
    const unitPrice = item.product.discountPrice || item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);
  const loyaltyRate = currentUser ? (currentUser.membership === "VIP" ? 0.1 : 0.05) : 0;
  const loyaltySavings = Math.round(totalOriginal * loyaltyRate);
  const finalTotal = Math.round(totalOriginal * (1 - loyaltyRate));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setCheckoutError("");

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setCheckoutError("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.");
      return;
    }

    setIsSubmitting(true);
    try {
      const cartSnapshot = cart.map((item) => ({ ...item }));
      const response = await checkout({ name, phone, address, note });

      if (response.success) {
        const placedOrder: PlacedOrder = {
          name,
          phone,
          address,
          note,
          items: response.order?.items || cartSnapshot,
          original: totalOriginal,
          savings: loyaltySavings,
          final: finalTotal,
          code: response.order?.id || `ORD-${Math.floor(Math.random() * 900000 + 100000)}`,
          warrantyCode: response.order?.warrantyCode,
          status: response.order?.status || "CHỜ XÁC NHẬN",
          createdAt: response.order?.createdAt || new Date().toISOString(),
        };
        sessionStorage.setItem("dq_last_order", JSON.stringify(placedOrder));
        navigate("/thank-you", { replace: true });
      } else {
        setCheckoutError(response.error || "Gặp lỗi khi xử lý đơn hàng.");
      }
    } catch {
      setCheckoutError("Lỗi kết nối máy chủ khi đặt hàng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700">Thanh toán</div>
            <h1 className="mt-2 text-2xl font-black text-neutral-950 lg:text-3xl">Thông tin đặt hàng</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Vui lòng kiểm tra báo giá và điền thông tin để Đăng Quang Watch xác nhận đơn hàng.
            </p>
          </div>
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-700 hover:text-yellow-700">
            <ArrowLeft size={16} />
            Quay lại giỏ hàng
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <div className="space-y-6">
            <section className="rounded-[8px] border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3 border-b border-neutral-200 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-neutral-950 text-yellow-400">
                  <UserRound size={20} />
                </div>
                <div>
                  <h2 className="text-base font-black text-neutral-950">Thông tin nhận hàng</h2>
                  <p className="mt-1 text-xs text-neutral-500">Thông tin này dùng để xác nhận và giao đơn hàng.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold uppercase text-neutral-500">Họ và tên</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nhập họ tên người nhận"
                    className="mt-2 h-11 w-full rounded border border-neutral-300 bg-white px-3 text-sm font-semibold outline-none transition-colors focus:border-yellow-400"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase text-neutral-500">Số điện thoại</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Ví dụ: 0987654321"
                    className="mt-2 h-11 w-full rounded border border-neutral-300 bg-white px-3 text-sm font-semibold outline-none transition-colors focus:border-yellow-400"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold uppercase text-neutral-500">Địa chỉ giao hàng</span>
                  <textarea
                    required
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    rows={3}
                    className="mt-2 w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold outline-none transition-colors focus:border-yellow-400"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold uppercase text-neutral-500">Ghi chú</span>
                  <input
                    type="text"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Giao giờ hành chính, gọi trước khi giao..."
                    className="mt-2 h-11 w-full rounded border border-neutral-300 bg-white px-3 text-sm font-semibold outline-none transition-colors focus:border-yellow-400"
                  />
                </label>
              </div>
            </section>

            <section className="overflow-hidden rounded-[8px] border border-neutral-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <div>
                  <h2 className="text-base font-black text-neutral-950">Sản phẩm thanh toán</h2>
                  <p className="mt-1 text-xs text-neutral-500">{totalItems} sản phẩm trong đơn hàng.</p>
                </div>
                <PackageCheck className="text-yellow-600" size={24} />
              </div>

              <div className="divide-y divide-neutral-100">
                {cart.map((item) => {
                  const price = item.product.discountPrice || item.product.price;

                  return (
                    <div key={item.product.id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 p-4">
                      <div className="flex aspect-square items-center justify-center overflow-hidden rounded border border-neutral-200 bg-neutral-50">
                        <img src={item.product.image} alt={item.product.name} className="h-full w-full object-contain p-1.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="line-clamp-2 text-sm font-black text-neutral-950">{item.product.name}</div>
                        <div className="mt-1 text-xs font-semibold text-neutral-500">Mã: {item.product.code}</div>
                        <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                          <span className="text-neutral-500">
                            Số lượng: <strong className="text-neutral-900">{item.quantity}</strong>
                          </span>
                          <strong className="text-red-600">{formattedPrice(price * item.quantity)}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-4">
            <section className="rounded-[8px] border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-4">
                <div>
                  <h2 className="text-base font-black text-neutral-950">Báo giá đơn hàng</h2>
                  <p className="mt-1 text-xs text-neutral-500">Thanh toán khi nhận hàng</p>
                </div>
                <CreditCard className="text-yellow-600" size={24} />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4 text-neutral-600">
                  <span>Tạm tính</span>
                  <strong className="text-neutral-950">{formattedPrice(totalOriginal)}</strong>
                </div>
                {currentUser ? (
                  <div className="flex justify-between gap-4 text-green-600">
                    <span>Ưu đãi {currentUser.membership}</span>
                    <strong>-{formattedPrice(loyaltySavings)}</strong>
                  </div>
                ) : (
                  <div className="rounded-[6px] border border-yellow-200 bg-yellow-50 p-3 text-xs leading-5 text-neutral-700">
                    <Link to="/login" className="font-black text-yellow-700 underline">
                      Đăng nhập
                    </Link>{" "}
                    để nhận ưu đãi thành viên 5% - 10%.
                  </div>
                )}
                <div className="flex justify-between gap-4 text-neutral-600">
                  <span>Vận chuyển</span>
                  <strong className="text-green-600">Miễn phí</strong>
                </div>
              </div>

              <div className="mt-5 border-t border-neutral-200 pt-5">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-sm font-black text-neutral-950">Tổng thanh toán</span>
                  <span className="text-2xl font-black text-red-600">{formattedPrice(finalTotal)}</span>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-[6px] bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
                  <ShieldCheck size={16} />
                  Bảo mật thông tin, thanh toán khi nhận hàng.
                </div>
              </div>

              {checkoutError && (
                <div className="mt-4 flex items-start gap-2 rounded-[6px] border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600">
                  <Info size={16} className="mt-0.5 shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded bg-yellow-400 text-sm font-black text-neutral-950 transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
              >
                {isSubmitting ? "Đang tạo đơn hàng..." : "Xác nhận đặt hàng"}
                {!isSubmitting && <ArrowRight size={17} />}
              </button>
            </section>

            <section className="grid gap-3 rounded-[8px] border border-neutral-200 bg-white p-4 text-xs text-neutral-600 shadow-sm">
              <div className="flex items-center gap-3">
                <Truck className="text-yellow-600" size={18} />
                <span>Miễn phí giao hàng toàn quốc cho đơn hàng hiện tại.</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-600" size={18} />
                <span>Sản phẩm chính hãng, hỗ trợ bảo hành theo chính sách cửa hàng.</span>
              </div>
            </section>
          </aside>
        </form>
      </div>
    </div>
  );
}
