import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { useStore } from "../contexts/StoreContext";

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const unitPrice = item.product.discountPrice || item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
          <ShoppingBag size={38} />
        </div>
        <h1 className="mt-6 text-2xl font-black text-neutral-950">Giỏ hàng đang trống</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">
          Hãy chọn thêm sản phẩm yêu thích để bắt đầu đơn hàng của bạn.
        </p>
        <Link
          to="/shop"
          className="mt-7 inline-flex h-11 items-center justify-center rounded bg-yellow-400 px-6 text-sm font-black text-neutral-950 transition-colors hover:bg-yellow-300"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50">
      <div className="mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-8 lg:py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700">Đăng Quang Watch</div>
            <h1 className="mt-2 text-2xl font-black text-neutral-950 lg:text-3xl">Giỏ hàng của bạn</h1>
            <p className="mt-2 text-sm text-neutral-500">
              {cart.length} dòng sản phẩm, {totalItems} sản phẩm đang chờ thanh toán.
            </p>
          </div>
          <Link to="/shop" className="text-sm font-bold text-neutral-700 underline-offset-4 hover:text-yellow-700 hover:underline">
            Tiếp tục chọn sản phẩm
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <section className="overflow-hidden rounded-[8px] border border-neutral-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <div>
                <h2 className="text-base font-black text-neutral-950">Sản phẩm đã thêm</h2>
                <p className="mt-1 text-xs text-neutral-500">Kiểm tra sản phẩm và số lượng trước khi thanh toán.</p>
              </div>
              <PackageCheck className="text-yellow-600" size={24} />
            </div>

            <div className="divide-y divide-neutral-100">
              {cart.map((item) => {
                const price = item.product.discountPrice || item.product.price;

                return (
                  <article key={item.product.id} className="grid gap-4 p-3 sm:grid-cols-[112px_minmax(0,1fr)] sm:p-5">
                    <Link
                      to={`/product/${item.product.id}`}
                      className="flex aspect-square items-center justify-center overflow-hidden rounded-[6px] border border-neutral-200 bg-neutral-50"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-contain p-2"
                        referrerPolicy="no-referrer"
                      />
                    </Link>

                    <div className="min-w-0">
                      <div className="flex gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold uppercase text-yellow-700">{item.product.brand}</div>
                          <Link
                            to={`/product/${item.product.id}`}
                            className="mt-1 block text-base font-black leading-snug text-neutral-950 hover:text-yellow-700"
                          >
                            {item.product.name}
                          </Link>
                          <div className="mt-2 text-xs font-semibold text-neutral-500">Mã sản phẩm: {item.product.code}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded border border-neutral-200 text-neutral-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <div className="mb-2 text-xs font-bold uppercase text-neutral-400">Số lượng</div>
                          <div className="inline-flex h-10 items-center rounded border border-neutral-300 bg-white">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="flex h-full w-10 cursor-pointer items-center justify-center text-neutral-700 transition-colors hover:bg-neutral-100"
                            >
                              <Minus size={15} />
                            </button>
                            <span className="flex h-full min-w-11 items-center justify-center border-x border-neutral-300 px-3 text-sm font-black text-neutral-950">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="flex h-full w-10 cursor-pointer items-center justify-center text-neutral-700 transition-colors hover:bg-neutral-100"
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-xs font-semibold text-neutral-500">Đơn giá {formattedPrice(price)}</div>
                          <div className="mt-1 text-xl font-black text-red-600">{formattedPrice(price * item.quantity)}</div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-4">
            <section className="rounded-[8px] border border-neutral-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-black text-neutral-950">Tóm tắt giỏ hàng</h2>
              <div className="mt-4 space-y-3 border-t border-neutral-200 pt-4 text-sm">
                <div className="flex justify-between gap-4 text-neutral-600">
                  <span>Số lượng</span>
                  <strong className="text-neutral-950">{totalItems} sản phẩm</strong>
                </div>
                <div className="flex justify-between gap-4 text-neutral-600">
                  <span>Tạm tính</span>
                  <strong className="text-neutral-950">{formattedPrice(subtotal)}</strong>
                </div>
                <div className="flex items-center gap-2 rounded-[6px] bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
                  <Truck size={16} />
                  Phí vận chuyển sẽ được xác nhận ở bước thanh toán.
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-5 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded bg-yellow-400 text-sm font-black text-neutral-950 transition-colors hover:bg-yellow-300"
              >
                Thanh toán
                <ArrowRight size={17} />
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
