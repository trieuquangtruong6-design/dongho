import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Check, CheckCircle, Copy } from "lucide-react";
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

export default function ThankYou() {
  const navigate = useNavigate();
  const [copiedWarrantyCode, setCopiedWarrantyCode] = useState(false);

  const savedOrder = sessionStorage.getItem("dq_last_order");
  const order: PlacedOrder | null = savedOrder ? JSON.parse(savedOrder) : null;

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const copyWarrantyCode = async () => {
    if (!order?.warrantyCode) return;

    await navigator.clipboard.writeText(order.warrantyCode);
    setCopiedWarrantyCode(true);
    window.setTimeout(() => setCopiedWarrantyCode(false), 1800);
  };

  if (!order) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="overflow-hidden rounded-[8px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 bg-neutral-950 px-6 py-7 text-center text-white">
          <CheckCircle className="mx-auto mb-4 h-14 w-14 text-yellow-400" />
          <h1 className="text-2xl font-black uppercase">Cảm ơn quý khách</h1>
          <p className="mt-2 text-sm text-neutral-300">Đăng Quang Watch đã ghi nhận đơn hàng của quý khách.</p>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-[6px] border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex justify-between gap-4 border-b border-neutral-200 pb-3 text-sm">
              <span className="text-neutral-500">Mã đơn hàng</span>
              <span className="font-black text-neutral-950">{order.code}</span>
            </div>

            {order.warrantyCode && (
              <div className="mt-3 rounded border border-yellow-200 bg-yellow-50 p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.12em] text-yellow-800">Mã thẻ bảo hành</div>
                    <div className="mt-1 font-mono text-base font-black tracking-wide text-neutral-950">{order.warrantyCode}</div>
                  </div>
                  <button
                    type="button"
                    onClick={copyWarrantyCode}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded border border-yellow-300 bg-white px-4 text-xs font-black uppercase tracking-[0.1em] text-yellow-800 transition-colors hover:bg-yellow-100"
                    title="Sao chép mã bảo hành"
                  >
                    {copiedWarrantyCode ? <Check size={16} /> : <Copy size={16} />}
                    {copiedWarrantyCode ? "Đã sao chép" : "Sao chép"}
                  </button>
                </div>
                <p className="mt-2 text-xs font-semibold leading-5 text-neutral-600">
                  Mã này đã được lưu cùng hóa đơn trong hệ thống. Bạn có thể sao chép và dán vào trang bảo hành để tra cứu.
                </p>
              </div>
            )}

            <div className="mt-4 grid gap-3 text-sm text-neutral-600 sm:grid-cols-2">
              <div>
                <span className="block text-xs font-bold uppercase text-neutral-400">Người nhận</span>
                <strong className="text-neutral-900">{order.name}</strong>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-neutral-400">Điện thoại</span>
                <strong className="text-neutral-900">{order.phone}</strong>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-xs font-bold uppercase text-neutral-400">Địa chỉ giao hàng</span>
                <strong className="text-neutral-900">{order.address}</strong>
              </div>
            </div>
          </div>

          <div className="rounded-[6px] border border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <div>
                <div className="text-sm font-black text-neutral-950">Sản phẩm đã mua</div>
                <div className="mt-1 text-xs text-neutral-500">Trạng thái: {order.status}</div>
              </div>
              <div className="text-xs font-bold text-neutral-500">{order.items?.length || 0} sản phẩm</div>
            </div>
            <div className="divide-y divide-neutral-100">
              {(order.items || []).map((item) => {
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
          </div>

          <div className="flex items-end justify-between rounded-[6px] border border-yellow-200 bg-yellow-50 p-4">
            <div>
              <div className="text-xs font-bold uppercase text-neutral-500">Tổng thanh toán</div>
              <div className="mt-1 text-sm text-neutral-600">Nhân viên sẽ gọi xác nhận trong 15-30 phút.</div>
            </div>
            <div className="text-right text-2xl font-black text-red-600">{formattedPrice(order.final)}</div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {order.warrantyCode && (
              <Link
                to="/warranty"
                className="inline-flex h-11 flex-1 items-center justify-center rounded border border-yellow-300 bg-yellow-50 px-5 text-sm font-black text-yellow-800 transition-colors hover:bg-yellow-100"
              >
                Tra cứu bảo hành
              </Link>
            )}
            <button
              onClick={() => navigate("/shop")}
              className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded bg-yellow-400 px-5 text-sm font-black text-neutral-950 transition-colors hover:bg-yellow-300"
            >
              Tiếp tục mua sắm
            </button>
            <Link
              to="/"
              className="inline-flex h-11 flex-1 items-center justify-center rounded border border-neutral-300 px-5 text-sm font-bold text-neutral-800 transition-colors hover:border-neutral-950"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
