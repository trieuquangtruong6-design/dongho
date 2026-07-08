import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Edit3,
  Eye,
  Filter,
  LayoutDashboard,
  Package,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Truck,
  Save,
  Trash2,
  Users,
  Wallet,
  X,
  XCircle
} from "lucide-react";
import { useStore } from "../contexts/StoreContext";
import { Order, Product, User } from "../types";

const STATUS_OPTIONS = [
  { id: "ALL", label: "Tất cả đơn" },
  { id: "CHO_XAC_NHAN", label: "Chờ xác nhận" },
  { id: "DA_DUYET", label: "Đã duyệt" },
  { id: "DANG_SHIP", label: "Đang giao" },
  { id: "DA_HOAN_TAT", label: "Hoàn tất" },
  { id: "DA_HUY", label: "Đã hủy" }
];

const WORKFLOW_STATUSES = STATUS_OPTIONS.filter((status) => status.id !== "ALL");

const NAV_ITEMS = [
  { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
  { id: "orders", label: "Đơn hàng", icon: ClipboardList },
  { id: "products", label: "Sản phẩm", icon: Boxes },
  { id: "customers", label: "Khách hàng", icon: Users }
];

type AdminTab = (typeof NAV_ITEMS)[number]["id"];

type ProductEditorMode = "create" | "edit";

function normalizeStatus(status: string) {
  if (status === "CHỜ XÁC NHẬN") return "CHO_XAC_NHAN";
  if (status === "ĐÃ DUYỆT" || status === "ĐẤ DUYỆT") return "DA_DUYET";
  if (status === "ĐANG SHIP") return "DANG_SHIP";
  if (status === "ĐÃ HOÀN TẤT") return "DA_HOAN_TAT";
  if (status === "ĐÃ HỦY") return "DA_HUY";
  return status || "CHO_XAC_NHAN";
}

function getStatusLabel(status: string) {
  const normalizedStatus = normalizeStatus(status);
  return WORKFLOW_STATUSES.find((item) => item.id === normalizedStatus)?.label || status;
}

function getStatusClass(status: string) {
  const normalizedStatus = normalizeStatus(status);
  if (normalizedStatus === "CHO_XAC_NHAN") return "bg-amber-50 text-amber-700 border-amber-200";
  if (normalizedStatus === "DA_DUYET") return "bg-sky-50 text-sky-700 border-sky-200";
  if (normalizedStatus === "DANG_SHIP") return "bg-violet-50 text-violet-700 border-violet-200";
  if (normalizedStatus === "DA_HOAN_TAT") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (normalizedStatus === "DA_HUY") return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-neutral-50 text-neutral-700 border-neutral-200";
}

function getOrderCustomerKey(order: Order) {
  return order.userEmail || `${order.customerPhone}-${order.customerName}`;
}

export default function Admin() {
  const {
    currentUser,
    orders,
    adminUsers,
    products,
    fetchAdminOrders,
    updateOrderStatus,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
    fetchAdminUsers,
    updateAdminUser,
    deleteAdminUser
  } = useStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [productCategory, setProductCategory] = useState("ALL");
  const [productEditorMode, setProductEditorMode] = useState<ProductEditorMode | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productActionMessage, setProductActionMessage] = useState("");
  const [productActionError, setProductActionError] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [userActionMessage, setUserActionMessage] = useState("");
  const [userActionError, setUserActionError] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      await Promise.all([fetchAdminOrders(), fetchAdminUsers()]);
      setLoading(false);
    };
    loadOrders();
  }, []);

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(price);

  const approvedOrders = orders.filter((order) => normalizeStatus(order.status) !== "DA_HUY");
  const revenueTotal = approvedOrders.reduce((sum, order) => sum + order.totalDiscounted, 0);
  const pendingCount = orders.filter((order) => normalizeStatus(order.status) === "CHO_XAC_NHAN").length;
  const shippingCount = orders.filter((order) => normalizeStatus(order.status) === "DANG_SHIP").length;
  const completedCount = orders.filter((order) => normalizeStatus(order.status) === "DA_HOAN_TAT").length;
  const canceledCount = orders.filter((order) => normalizeStatus(order.status) === "DA_HUY").length;
  const customerCount = new Set(orders.map(getOrderCustomerKey)).size;
  const averageOrderValue = approvedOrders.length ? Math.round(revenueTotal / approvedOrders.length) : 0;

  const filteredOrdersList = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = activeFilter === "ALL" || normalizeStatus(order.status) === activeFilter;
      const haystack = [
        order.id,
        order.warrantyCode,
        order.userEmail,
        order.customerName,
        order.customerPhone,
        order.customerAddress,
        order.note,
        ...order.items.map((item) => item.product.name)
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!keyword || haystack.includes(keyword));
    });
  }, [activeFilter, orders, query]);

  const selectedOrder = useMemo(() => {
    if (!filteredOrdersList.length) return null;
    return filteredOrdersList.find((order) => order.id === selectedOrderId) || filteredOrdersList[0];
  }, [filteredOrdersList, selectedOrderId]);

  const filteredUsers = useMemo(() => {
    const keyword = userQuery.trim().toLowerCase();
    return adminUsers.filter((user) => {
      const haystack = `${user.name} ${user.email} ${user.phone || ""} ${user.address || ""} ${user.membership} ${user.role}`.toLowerCase();
      return !keyword || haystack.includes(keyword);
    });
  }, [adminUsers, userQuery]);

  const selectedUser = useMemo(() => {
    if (!filteredUsers.length) return null;
    return filteredUsers.find((user) => user.id === selectedUserId) || filteredUsers[0];
  }, [filteredUsers, selectedUserId]);

  const productStats = useMemo(() => {
    const categoryCounts = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    const brandCounts = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {});

    const topBrands = Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return { categoryCounts, topBrands };
  }, [products]);

  const productCategories = useMemo(
    () => Object.keys(productStats.categoryCounts).sort((a, b) => a.localeCompare(b)),
    [productStats.categoryCounts]
  );

  const filteredProducts = useMemo(() => {
    const keyword = productQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = productCategory === "ALL" || product.category === productCategory;
      const haystack = `${product.name} ${product.code} ${product.brand} ${product.origin} ${product.category}`.toLowerCase();
      return matchesCategory && (!keyword || haystack.includes(keyword));
    });
  }, [productCategory, productQuery, products]);

  const spotlightProducts = useMemo(
    () => products.filter((product) => product.isFeatured || product.isNew || product.isLimited).slice(0, 8),
    [products]
  );

  const recentOrders = orders.slice(0, 5);

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([fetchAdminOrders(), fetchAdminUsers()]);
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setUpdatingOrderId(orderId);
    const updated = await updateOrderStatus(orderId, status);
    if (updated) {
      setSelectedOrderId(orderId);
    }
    setUpdatingOrderId(null);
  };

  const openCreateProduct = () => {
    setEditingProduct(null);
    setProductEditorMode("create");
    setProductActionError("");
    setProductActionMessage("");
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductEditorMode("edit");
    setProductActionError("");
    setProductActionMessage("");
  };

  const closeProductEditor = () => {
    setProductEditorMode(null);
    setEditingProduct(null);
    setSavingProduct(false);
  };

  const handleProductSubmit = async (product: Product) => {
    setSavingProduct(true);
    setProductActionError("");
    setProductActionMessage("");

    const result = productEditorMode === "edit" && editingProduct
      ? await updateAdminProduct(editingProduct.id, product)
      : await createAdminProduct(product);

    setSavingProduct(false);

    if (result.success) {
      setProductActionMessage(productEditorMode === "edit" ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm mới lên shop.");
      closeProductEditor();
      window.setTimeout(() => setProductActionMessage(""), 2600);
    } else {
      setProductActionError(result.error || "Không thể lưu sản phẩm.");
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(`Xóa sản phẩm "${product.name}" khỏi shop?`);
    if (!confirmed) return;

    setDeletingProductId(product.id);
    setProductActionError("");
    setProductActionMessage("");
    const result = await deleteAdminProduct(product.id);
    setDeletingProductId(null);

    if (result.success) {
      setProductActionMessage("Đã xóa sản phẩm khỏi shop.");
      window.setTimeout(() => setProductActionMessage(""), 2600);
    } else {
      setProductActionError(result.error || "Không thể xóa sản phẩm.");
    }
  };

  const handleUserUpdate = async (userId: string, updates: Partial<User>) => {
    setSavingUserId(userId);
    setUserActionError("");
    setUserActionMessage("");
    const result = await updateAdminUser(userId, updates);
    setSavingUserId(null);

    if (result.success) {
      setSelectedUserId(userId);
      setUserActionMessage("Đã cập nhật tài khoản.");
      window.setTimeout(() => setUserActionMessage(""), 2400);
    } else {
      setUserActionError(result.error || "Không thể cập nhật tài khoản.");
    }
  };

  const handleUserDelete = async (user: User) => {
    const confirmed = window.confirm(`Xóa tài khoản "${user.name}"?`);
    if (!confirmed) return;

    setDeletingUserId(user.id);
    setUserActionError("");
    setUserActionMessage("");
    const result = await deleteAdminUser(user.id);
    setDeletingUserId(null);

    if (result.success) {
      setUserActionMessage("Đã xóa tài khoản.");
      if (selectedUserId === user.id) {
        setSelectedUserId(null);
      }
      window.setTimeout(() => setUserActionMessage(""), 2400);
    } else {
      setUserActionError(result.error || "Không thể xóa tài khoản.");
    }
  };

  const kpis = [
    {
      label: "Doanh thu hợp lệ",
      value: formattedPrice(revenueTotal),
      detail: "Không tính đơn đã hủy",
      icon: Wallet,
      accent: "text-neutral-950",
      bg: "bg-yellow-50"
    },
    {
      label: "Tổng đơn hàng",
      value: `${orders.length} đơn`,
      detail: `${filteredOrdersList.length} đơn đang hiển thị`,
      icon: ClipboardList,
      accent: "text-sky-700",
      bg: "bg-sky-50"
    },
    {
      label: "Cần xử lý",
      value: `${pendingCount} đơn`,
      detail: "Ưu tiên gọi xác nhận",
      icon: Clock,
      accent: "text-amber-700",
      bg: "bg-amber-50"
    },
    {
      label: "Hoàn tất",
      value: `${completedCount} đơn`,
      detail: `${shippingCount} đơn đang giao`,
      icon: CheckCircle2,
      accent: "text-emerald-700",
      bg: "bg-emerald-50"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-neutral-900">
      <div className="mx-auto flex w-full max-w-[1480px] gap-5 px-3 py-5 sm:px-4 lg:px-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-4 overflow-hidden rounded-[8px] border border-neutral-200 bg-neutral-950 text-white shadow-sm">
            <div className="border-b border-white/10 px-5 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-yellow-400 text-neutral-950">
                <ShieldCheck size={22} />
              </div>
              <div className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-yellow-300">Admin Console</div>
              <div className="mt-1 truncate text-sm font-bold text-white">{currentUser?.name || "Quản trị viên"}</div>
            </div>

            <nav className="space-y-1 p-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex h-11 w-full cursor-pointer items-center justify-between rounded-[6px] px-3 text-sm font-black transition-colors ${
                      isActive
                        ? "bg-yellow-400 text-neutral-950"
                        : "text-neutral-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={17} />
                      {item.label}
                    </span>
                    {isActive && <ChevronRight size={15} />}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-white/10 p-4 text-xs leading-5 text-neutral-400">
              Theo dõi đơn hàng, doanh thu và tình trạng sản phẩm từ một màn hình vận hành.
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 space-y-5">
          <section className="rounded-[8px] border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-neutral-400">
                  <span>Đăng Quang Watch</span>
                  <span className="h-1 w-1 rounded-full bg-neutral-300" />
                  <span>{new Date().toLocaleDateString("vi-VN")}</span>
                </div>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">
                  Bảng điều khiển quản trị
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-500">
                  Quản lý đơn hàng, kiểm tra doanh thu, rà soát khách hàng và theo dõi danh mục sản phẩm.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <button
                  onClick={() => setActiveTab("orders")}
                  className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-neutral-200 bg-neutral-50 px-4 text-sm font-black text-neutral-800 transition-colors hover:border-neutral-300 hover:bg-white"
                >
                  <Eye size={16} />
                  Xem đơn
                </button>
                <button
                  onClick={handleRefresh}
                  className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-yellow-400 px-4 text-sm font-black text-neutral-950 shadow-[0_10px_24px_rgba(250,204,21,0.22)] transition-colors hover:bg-yellow-300"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  Làm mới
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-4 lg:hidden">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[6px] border px-3 text-xs font-black ${
                      activeTab === item.id
                        ? "border-neutral-950 bg-neutral-950 text-yellow-300"
                        : "border-neutral-200 bg-neutral-50 text-neutral-600"
                    }`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-[8px] border border-neutral-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[11px] font-black uppercase tracking-[0.12em] text-neutral-400">{item.label}</div>
                      <div className={`mt-3 break-words text-xl font-black ${item.accent}`}>{item.value}</div>
                    </div>
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] ${item.bg}`}>
                      <Icon size={21} className={item.accent} />
                    </div>
                  </div>
                  <div className="mt-4 border-t border-neutral-100 pt-3 text-xs font-bold text-neutral-500">{item.detail}</div>
                </div>
              );
            })}
          </section>

          {activeTab === "overview" && (
            <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
              <div className="rounded-[8px] border border-neutral-200 bg-white shadow-sm">
                <div className="border-b border-neutral-200 p-4">
                  <div className="flex items-center gap-2 text-base font-black text-neutral-950">
                    <BarChart3 size={18} className="text-yellow-600" />
                    Tổng quan vận hành
                  </div>
                  <p className="mt-1 text-xs font-semibold text-neutral-500">Các chỉ số giúp ưu tiên xử lý trong ngày.</p>
                </div>

                <div className="grid gap-3 p-4 sm:grid-cols-2">
                  <InsightCard label="Giá trị đơn trung bình" value={formattedPrice(averageOrderValue)} detail="Tính trên đơn không hủy" />
                  <InsightCard label="Khách đã đặt hàng" value={`${customerCount} khách`} detail="Gộp theo email hoặc số điện thoại" />
                  <InsightCard label="Đơn đang giao" value={`${shippingCount} đơn`} detail="Theo dõi sát để chốt hoàn tất" />
                  <InsightCard label="Đơn đã hủy" value={`${canceledCount} đơn`} detail="Cần xem lý do để tối ưu vận hành" />
                </div>
              </div>

              <div className="rounded-[8px] border border-neutral-200 bg-white shadow-sm">
                <div className="border-b border-neutral-200 p-4">
                  <div className="flex items-center gap-2 text-base font-black text-neutral-950">
                    <CalendarDays size={18} className="text-sky-600" />
                    Đơn mới nhất
                  </div>
                </div>
                <div className="divide-y divide-neutral-100">
                  {recentOrders.length ? (
                    recentOrders.map((order) => (
                      <button
                        key={order.id}
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setActiveTab("orders");
                        }}
                        className="flex w-full cursor-pointer items-start gap-3 p-4 text-left transition-colors hover:bg-neutral-50"
                      >
                        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-neutral-100 text-neutral-600">
                          <Package size={16} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-black text-neutral-950">{order.customerName}</span>
                          <span className="mt-1 block text-xs font-semibold text-neutral-500">{order.id} - {formattedPrice(order.totalDiscounted)}</span>
                        </span>
                        <span className={`rounded-full border px-2 py-1 text-[9px] font-black uppercase ${getStatusClass(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </button>
                    ))
                  ) : (
                    <EmptyMini message="Chưa có đơn mới để hiển thị" />
                  )}
                </div>
              </div>
            </section>
          )}

          {activeTab === "orders" && (
            <OrdersPanel
              activeFilter={activeFilter}
              filteredOrdersList={filteredOrdersList}
              formattedPrice={formattedPrice}
              loading={loading}
              query={query}
              selectedOrder={selectedOrder}
              setActiveFilter={setActiveFilter}
              setQuery={setQuery}
              setSelectedOrderId={setSelectedOrderId}
              updatingOrderId={updatingOrderId}
              onStatusUpdate={handleStatusUpdate}
            />
          )}

          {activeTab === "products" && (
            <ProductCatalogPanel
              categories={productCategories}
              deletingProductId={deletingProductId}
              filteredProducts={filteredProducts}
              formattedPrice={formattedPrice}
              onCreate={openCreateProduct}
              onDelete={handleDeleteProduct}
              onEdit={openEditProduct}
              productActionError={productActionError}
              productActionMessage={productActionMessage}
              productCategory={productCategory}
              productQuery={productQuery}
              productStats={productStats}
              products={products}
              setProductCategory={setProductCategory}
              setProductQuery={setProductQuery}
              spotlightProducts={spotlightProducts}
            />
          )}

          {false && activeTab === "products" && (
            <section className="grid gap-5 xl:grid-cols-[0.8fr_1fr]">
              <div className="rounded-[8px] border border-neutral-200 bg-white shadow-sm">
                <div className="border-b border-neutral-200 p-4">
                  <div className="flex items-center gap-2 text-base font-black text-neutral-950">
                    <Boxes size={18} className="text-yellow-600" />
                    Tổng quan sản phẩm
                  </div>
                  <p className="mt-1 text-xs font-semibold text-neutral-500">Dữ liệu đọc từ danh mục đang tải trên website.</p>
                </div>
                <div className="grid gap-3 p-4 sm:grid-cols-2">
                  <InsightCard label="Tổng sản phẩm" value={`${products.length} SP`} detail="Đang hiển thị trên shop" />
                  <InsightCard label="Sản phẩm nổi bật" value={`${products.filter((p) => p.isFeatured).length} SP`} detail="Dùng cho trang chủ" />
                  <InsightCard label="Hàng mới" value={`${products.filter((p) => p.isNew).length} SP`} detail="Có nhãn mới" />
                  <InsightCard label="Phiên bản giới hạn" value={`${products.filter((p) => p.isLimited).length} SP`} detail="Có nhãn limited" />
                </div>
              </div>

              <div className="rounded-[8px] border border-neutral-200 bg-white shadow-sm">
                <div className="border-b border-neutral-200 p-4">
                  <div className="text-base font-black text-neutral-950">Cơ cấu danh mục</div>
                </div>
                <div className="space-y-3 p-4">
                  {Object.entries(productStats.categoryCounts).map(([category, count]) => (
                    <ProgressRow key={category} label={category} value={count} total={Math.max(products.length, 1)} />
                  ))}
                </div>
                <div className="border-t border-neutral-100 p-4">
                  <div className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-neutral-400">Top thương hiệu</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {productStats.topBrands.map(([brand, count]) => (
                      <div key={brand} className="flex items-center justify-between rounded-[6px] border border-neutral-200 bg-neutral-50 px-3 py-2">
                        <span className="truncate text-xs font-black text-neutral-800">{brand}</span>
                        <span className="text-xs font-black text-yellow-700">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "customers" && (
            <UsersPanel
              currentUserId={currentUser?.id || ""}
              deletingUserId={deletingUserId}
              filteredUsers={filteredUsers}
              formattedPrice={formattedPrice}
              loading={loading}
              onDelete={handleUserDelete}
              onSelect={setSelectedUserId}
              onUpdate={handleUserUpdate}
              query={userQuery}
              savingUserId={savingUserId}
              selectedUser={selectedUser}
              setQuery={setUserQuery}
              userActionError={userActionError}
              userActionMessage={userActionMessage}
              users={adminUsers}
            />
          )}

          {false && activeTab === "customers" && (
            <section className="rounded-[8px] border border-neutral-200 bg-white shadow-sm">
              <div className="border-b border-neutral-200 p-4">
                <div className="flex items-center gap-2 text-base font-black text-neutral-950">
                  <Users size={18} className="text-sky-600" />
                  Khách hàng từ đơn đặt
                </div>
                <p className="mt-1 text-xs font-semibold text-neutral-500">Tổng hợp nhanh từ dữ liệu đơn hàng hiện có.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-xs">
                  <thead className="bg-neutral-50 text-[10px] font-black uppercase tracking-[0.12em] text-neutral-500">
                    <tr>
                      <th className="px-4 py-3">Khách hàng</th>
                      <th className="px-4 py-3">Liên hệ</th>
                      <th className="px-4 py-3 text-right">Số đơn</th>
                      <th className="px-4 py-3 text-right">Tổng chi tiêu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {getCustomerRows(orders).map((customer) => (
                      <tr key={customer.key} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 font-black text-neutral-950">{customer.name}</td>
                        <td className="px-4 py-3 text-neutral-500">
                          <div>{customer.phone}</div>
                          <div className="mt-1">{customer.email || "Chưa có email"}</div>
                        </td>
                        <td className="px-4 py-3 text-right font-black">{customer.orders}</td>
                        <td className="px-4 py-3 text-right font-black text-red-600">{formattedPrice(customer.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>

      {productEditorMode && (
        <ProductEditorModal
          mode={productEditorMode}
          product={editingProduct}
          saving={savingProduct}
          error={productActionError}
          onClose={closeProductEditor}
          onSubmit={handleProductSubmit}
        />
      )}
    </div>
  );
}

function getEmptyProduct(): Product {
  return {
    id: "",
    code: "",
    name: "",
    category: "dong-ho",
    brand: "",
    origin: "Thụy Sỹ",
    target: "Nam",
    price: 0,
    discountPrice: null,
    image: "/images/1 (1).jpg",
    isFeatured: false,
    isNew: true,
    isLimited: false,
    size: "40 mm",
    glassMaterial: true,
    caseMaterial: true,
    waterResistance: "5 ATM",
    description: ""
  };
}

function ProductEditorModal({
  error,
  mode,
  onClose,
  onSubmit,
  product,
  saving
}: {
  error: string;
  mode: ProductEditorMode;
  onClose: () => void;
  onSubmit: (product: Product) => Promise<void>;
  product: Product | null;
  saving: boolean;
}) {
  const [form, setForm] = useState<Product>(() => product ? { ...product } : getEmptyProduct());
  const [discountInput, setDiscountInput] = useState(() => product?.discountPrice ? String(product.discountPrice) : "");

  const updateField = <K extends keyof Product>(key: K, value: Product[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      ...form,
      id: form.id.trim(),
      code: form.code.trim(),
      name: form.name.trim(),
      brand: form.brand.trim(),
      origin: form.origin.trim(),
      image: form.image.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discountPrice: discountInput.trim() ? Number(discountInput) : null
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-3 py-6">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[8px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <div className="text-lg font-black text-neutral-950">
              {mode === "edit" ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
            </div>
            <div className="mt-1 text-xs font-semibold text-neutral-500">
              Lưu thành công sẽ cập nhật ngay danh mục shop.
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[6px] border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid max-h-[calc(92vh-73px)] overflow-y-auto lg:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="border-b border-neutral-200 bg-neutral-50 p-5 lg:border-b-0 lg:border-r">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[8px] border border-neutral-200 bg-white p-4">
              {form.image ? (
                <img src={form.image} alt={form.name || "Preview"} className="h-full w-full object-contain" />
              ) : (
                <Package className="text-neutral-300" size={54} />
              )}
            </div>
            <div className="mt-4 rounded-[6px] border border-yellow-200 bg-yellow-50 p-3 text-xs font-semibold leading-5 text-neutral-700">
              Nhập đường dẫn ảnh trong thư mục public, ví dụ <span className="font-mono">/images/1 (1).jpg</span>, hoặc URL ảnh ngoài.
            </div>
          </aside>

          <div className="space-y-5 p-5">
            {error && (
              <div className="rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="ID sản phẩm">
                <input
                  value={form.id}
                  onChange={(event) => updateField("id", event.target.value)}
                  disabled={mode === "edit"}
                  placeholder="vd: epos-new-2026"
                  className="admin-input disabled:bg-neutral-100 disabled:text-neutral-400"
                />
              </FormField>
              <FormField label="Mã sản phẩm">
                <input
                  required
                  value={form.code}
                  onChange={(event) => updateField("code", event.target.value)}
                  placeholder="vd: EP-NEW-001"
                  className="admin-input"
                />
              </FormField>
              <FormField label="Tên sản phẩm">
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Tên hiển thị trên shop"
                  className="admin-input"
                />
              </FormField>
              <FormField label="Thương hiệu">
                <input
                  required
                  value={form.brand}
                  onChange={(event) => updateField("brand", event.target.value)}
                  placeholder="Epos Swiss"
                  className="admin-input"
                />
              </FormField>
              <FormField label="Danh mục">
                <select
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  className="admin-input"
                >
                  <option value="dong-ho">Đồng hồ</option>
                  <option value="kinh-mat">Kính mắt</option>
                  <option value="phu-kien">Phụ kiện</option>
                  <option value="but-ky">Bút ký</option>
                </select>
              </FormField>
              <FormField label="Đối tượng">
                <select
                  value={form.target || ""}
                  onChange={(event) => updateField("target", event.target.value)}
                  className="admin-input"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </FormField>
              <FormField label="Xuất xứ">
                <input
                  required
                  value={form.origin}
                  onChange={(event) => updateField("origin", event.target.value)}
                  placeholder="Thụy Sỹ"
                  className="admin-input"
                />
              </FormField>
              <FormField label="Size">
                <input
                  value={form.size || ""}
                  onChange={(event) => updateField("size", event.target.value)}
                  placeholder="40 mm"
                  className="admin-input"
                />
              </FormField>
              <FormField label="Giá niêm yết">
                <input
                  required
                  type="number"
                  min="1"
                  value={form.price || ""}
                  onChange={(event) => updateField("price", Number(event.target.value))}
                  className="admin-input"
                />
              </FormField>
              <FormField label="Giá khuyến mãi">
                <input
                  type="number"
                  min="0"
                  value={discountInput}
                  onChange={(event) => setDiscountInput(event.target.value)}
                  placeholder="Bỏ trống nếu không giảm"
                  className="admin-input"
                />
              </FormField>
              <FormField label="Chống nước">
                <input
                  value={form.waterResistance || ""}
                  onChange={(event) => updateField("waterResistance", event.target.value)}
                  placeholder="5 ATM"
                  className="admin-input"
                />
              </FormField>
              <FormField label="Ảnh sản phẩm">
                <input
                  required
                  value={form.image}
                  onChange={(event) => updateField("image", event.target.value)}
                  placeholder="/images/..."
                  className="admin-input"
                />
              </FormField>
            </div>

            <FormField label="Mô tả">
              <textarea
                required
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                rows={3}
                placeholder="Mô tả ngắn hiển thị ở trang sản phẩm"
                className="admin-input min-h-[92px] py-2"
              />
            </FormField>

            <div className="grid gap-3 sm:grid-cols-3">
              <ToggleField checked={Boolean(form.isFeatured)} label="Nổi bật" onChange={(value) => updateField("isFeatured", value)} />
              <ToggleField checked={Boolean(form.isNew)} label="Hàng mới" onChange={(value) => updateField("isNew", value)} />
              <ToggleField checked={Boolean(form.isLimited)} label="Limited" onChange={(value) => updateField("isLimited", value)} />
              <ToggleField checked={Boolean(form.glassMaterial)} label="Kính sapphire" onChange={(value) => updateField("glassMaterial", value)} />
              <ToggleField checked={Boolean(form.caseMaterial)} label="Vỏ thép cao cấp" onChange={(value) => updateField("caseMaterial", value)} />
            </div>

            <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-[6px] border border-neutral-200 px-5 text-sm font-black text-neutral-700 hover:bg-neutral-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-yellow-400 px-5 text-sm font-black text-neutral-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                {mode === "edit" ? "Lưu thay đổi" : "Thêm lên shop"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-neutral-500">{label}</span>
      {children}
    </label>
  );
}

function ToggleField({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex h-11 cursor-pointer items-center justify-between rounded-[6px] border border-neutral-200 bg-neutral-50 px-3 text-xs font-black text-neutral-700">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-yellow-500"
      />
    </label>
  );
}

function UsersPanel({
  currentUserId,
  deletingUserId,
  filteredUsers,
  formattedPrice,
  loading,
  onDelete,
  onSelect,
  onUpdate,
  query,
  savingUserId,
  selectedUser,
  setQuery,
  userActionError,
  userActionMessage,
  users
}: {
  currentUserId: string;
  deletingUserId: string | null;
  filteredUsers: User[];
  formattedPrice: (price: number) => string;
  loading: boolean;
  onDelete: (user: User) => Promise<void>;
  onSelect: (userId: string) => void;
  onUpdate: (userId: string, updates: Partial<User>) => Promise<void>;
  query: string;
  savingUserId: string | null;
  selectedUser: User | null;
  setQuery: (query: string) => void;
  userActionError: string;
  userActionMessage: string;
  users: User[];
}) {
  const adminCount = users.filter((user) => user.role === "ADMIN").length;
  const vipCount = users.filter((user) => user.membership === "VIP").length;
  const customerCount = users.filter((user) => user.role === "CUSTOMER").length;
  const revenueByUser = new Map<string, number>();

  for (const user of users) {
    const total = (user.history || []).reduce((sum, order) => (
      normalizeStatus(order.status) === "DA_HUY" ? sum : sum + order.totalDiscounted
    ), 0);
    revenueByUser.set(user.id, total);
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InsightCard label="Tài khoản" value={`${users.length} user`} detail="Tổng người dùng trong hệ thống" />
        <InsightCard label="Khách hàng" value={`${customerCount} user`} detail="Role CUSTOMER" />
        <InsightCard label="VIP" value={`${vipCount} user`} detail="Đang hưởng ưu đãi VIP" />
        <InsightCard label="Admin" value={`${adminCount} user`} detail="Có quyền quản trị" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="overflow-hidden rounded-[8px] border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-base font-black text-neutral-950">
                  <Users size={18} className="text-sky-600" />
                  Quản lý người dùng
                </div>
                <p className="mt-1 text-xs font-semibold text-neutral-500">
                  Xem, phân quyền và cập nhật thông tin tài khoản.
                </p>
              </div>
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-3 text-neutral-400" size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm tên, email, số điện thoại..."
                  className="h-10 w-full rounded-[6px] border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-xs font-semibold outline-none transition-colors focus:border-yellow-400 focus:bg-white"
                />
              </div>
            </div>

            {(userActionMessage || userActionError) && (
              <div className={`mt-3 rounded-[6px] border px-3 py-2 text-xs font-bold ${
                userActionError
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}>
                {userActionError || userActionMessage}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
              <RefreshCw className="animate-spin text-yellow-500" size={34} />
              <span className="mt-4 text-sm font-bold">Đang nạp danh sách người dùng...</span>
            </div>
          ) : filteredUsers.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-xs">
                <thead className="bg-neutral-50 text-[10px] font-black uppercase tracking-[0.12em] text-neutral-500">
                  <tr>
                    <th className="px-4 py-3">Người dùng</th>
                    <th className="px-4 py-3">Liên hệ</th>
                    <th className="px-4 py-3">Nhóm</th>
                    <th className="px-4 py-3 text-right">Đơn hàng</th>
                    <th className="px-4 py-3 text-right">Chi tiêu</th>
                    <th className="px-4 py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <button onClick={() => onSelect(user.id)} className="flex cursor-pointer items-center gap-3 text-left">
                          <UserAvatar user={user} />
                          <span className="min-w-0">
                            <span className="block truncate font-black text-neutral-950">{user.name}</span>
                            <span className="mt-1 block font-mono text-[10px] font-bold text-neutral-400">{user.id}</span>
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-neutral-500">
                        <div className="font-bold text-neutral-700">{user.phone || "Chưa có SĐT"}</div>
                        <div className="mt-1">{user.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          <UserPill tone={user.role === "ADMIN" ? "yellow" : "gray"}>{user.role}</UserPill>
                          <UserPill tone={user.membership === "VIP" ? "green" : "gray"}>{user.membership}</UserPill>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-black">{user.history?.length || 0}</td>
                      <td className="px-4 py-3 text-right font-black text-red-600">{formattedPrice(revenueByUser.get(user.id) || 0)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onSelect(user.id)}
                            className="inline-flex h-8 cursor-pointer items-center justify-center rounded-[6px] border border-neutral-200 px-3 text-xs font-black hover:bg-neutral-50"
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() => onDelete(user)}
                            disabled={deletingUserId === user.id || currentUserId === user.id}
                            className="inline-flex h-8 cursor-pointer items-center justify-center rounded-[6px] border border-red-200 bg-red-50 px-3 text-xs font-black text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingUserId === user.id ? <RefreshCw size={13} className="animate-spin" /> : "Xóa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyMini message="Không tìm thấy người dùng phù hợp" />
          )}
        </div>

        <UserDetailPanel
          currentUserId={currentUserId}
          formattedPrice={formattedPrice}
          onUpdate={onUpdate}
          saving={savingUserId === selectedUser?.id}
          user={selectedUser}
        />
      </div>
    </section>
  );
}

function UserDetailPanel({
  currentUserId,
  formattedPrice,
  onUpdate,
  saving,
  user
}: {
  currentUserId: string;
  formattedPrice: (price: number) => string;
  onUpdate: (userId: string, updates: Partial<User>) => Promise<void>;
  saving: boolean;
  user: User | null;
}) {
  const [form, setForm] = useState<Partial<User>>({});

  useEffect(() => {
    setForm(user ? { ...user } : {});
  }, [user?.id]);

  if (!user) {
    return (
      <aside className="rounded-[8px] border border-neutral-200 bg-white shadow-sm">
        <EmptyMini message="Chọn một người dùng để xem chi tiết" />
      </aside>
    );
  }

  const totalSpent = (user.history || []).reduce((sum, order) => (
    normalizeStatus(order.status) === "DA_HUY" ? sum : sum + order.totalDiscounted
  ), 0);

  return (
    <aside className="rounded-[8px] border border-neutral-200 bg-white shadow-sm xl:sticky xl:top-4 xl:self-start">
      <div className="border-b border-neutral-200 p-4">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} size="lg" />
          <div className="min-w-0">
            <div className="truncate text-base font-black text-neutral-950">{user.name}</div>
            <div className="mt-1 truncate text-xs font-semibold text-neutral-500">{user.email}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <InsightCard label="Đơn hàng" value={`${user.history?.length || 0}`} detail="Tổng đơn đã tạo" />
          <InsightCard label="Chi tiêu" value={formattedPrice(totalSpent)} detail="Không tính đơn hủy" />
        </div>

        <div className="grid gap-3">
          <FormField label="Họ tên">
            <input className="admin-input" value={form.name || ""} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </FormField>
          <FormField label="Email">
            <input className="admin-input" value={form.email || ""} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
          </FormField>
          <FormField label="Số điện thoại">
            <input className="admin-input" value={form.phone || ""} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} />
          </FormField>
          <FormField label="Địa chỉ">
            <textarea className="admin-input min-h-[88px] py-2" value={form.address || ""} onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))} />
          </FormField>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Thành viên">
              <select className="admin-input" value={form.membership || "MEMBER"} onChange={(event) => setForm((prev) => ({ ...prev, membership: event.target.value as User["membership"] }))}>
                <option value="MEMBER">MEMBER</option>
                <option value="VIP">VIP</option>
              </select>
            </FormField>
            <FormField label="Quyền">
              <select className="admin-input" value={form.role || "CUSTOMER"} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as User["role"] }))}>
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </FormField>
          </div>
        </div>

        <button
          onClick={() => onUpdate(user.id, form)}
          disabled={saving}
          className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-yellow-400 text-sm font-black text-neutral-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {currentUserId === user.id ? "Lưu tài khoản của tôi" : "Lưu thay đổi"}
        </button>
      </div>
    </aside>
  );
}

function UserAvatar({ user, size = "md" }: { user: User; size?: "md" | "lg" }) {
  const dimension = size === "lg" ? "h-12 w-12" : "h-9 w-9";
  return (
    <span className={`flex ${dimension} shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-950 text-xs font-black text-yellow-300`}>
      {user.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : user.name.slice(0, 2).toUpperCase()}
    </span>
  );
}

function UserPill({ children, tone }: { children: React.ReactNode; tone: "yellow" | "green" | "gray" }) {
  const className =
    tone === "yellow"
      ? "border-yellow-200 bg-yellow-50 text-yellow-800"
      : tone === "green"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-neutral-200 bg-neutral-50 text-neutral-600";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${className}`}>
      {children}
    </span>
  );
}

function ProductCatalogPanel({
  categories,
  deletingProductId,
  filteredProducts,
  formattedPrice,
  onCreate,
  onDelete,
  onEdit,
  productActionError,
  productActionMessage,
  productCategory,
  productQuery,
  productStats,
  products,
  setProductCategory,
  setProductQuery,
  spotlightProducts
}: {
  categories: string[];
  deletingProductId: string | null;
  filteredProducts: Product[];
  formattedPrice: (price: number) => string;
  onCreate: () => void;
  onDelete: (product: Product) => Promise<void>;
  onEdit: (product: Product) => void;
  productActionError: string;
  productActionMessage: string;
  productCategory: string;
  productQuery: string;
  productStats: { categoryCounts: Record<string, number>; topBrands: [string, number][] };
  products: Product[];
  setProductCategory: (category: string) => void;
  setProductQuery: (query: string) => void;
  spotlightProducts: Product[];
}) {
  const heroProduct = spotlightProducts[0] || products[0];

  return (
    <section className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <div className="overflow-hidden rounded-[8px] border border-neutral-200 bg-white shadow-sm">
          {heroProduct ? (
            <div className="grid min-h-[280px] lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="flex flex-col justify-between gap-6 bg-neutral-950 p-5 text-white sm:p-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-yellow-200">
                    <Star size={13} />
                    Sản phẩm tiêu điểm
                  </div>
                  <h2 className="mt-4 max-w-2xl text-2xl font-black leading-tight sm:text-3xl">
                    {heroProduct.name}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-300">
                    {heroProduct.brand} - {getCategoryLabel(heroProduct.category)} - {heroProduct.origin}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <ProductMetric label="Giá niêm yết" value={formattedPrice(heroProduct.price)} />
                  <ProductMetric label="Giá bán" value={formattedPrice(heroProduct.discountPrice || heroProduct.price)} />
                  <ProductMetric label="Mã hàng" value={heroProduct.code} />
                </div>
              </div>
              <div className="relative flex min-h-[260px] items-center justify-center bg-gradient-to-br from-neutral-100 to-white p-6">
                <img
                  src={heroProduct.image}
                  alt={heroProduct.name}
                  className="max-h-[240px] w-full max-w-[280px] object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.16)]"
                />
                <div className="absolute right-4 top-4 flex gap-2">
                  {heroProduct.isFeatured && <ProductPill tone="yellow">Featured</ProductPill>}
                  {heroProduct.isNew && <ProductPill tone="green">New</ProductPill>}
                  {heroProduct.isLimited && <ProductPill tone="red">Limited</ProductPill>}
                </div>
              </div>
            </div>
          ) : (
            <EmptyMini message="Chưa tải được danh mục sản phẩm" />
          )}
        </div>

        <div className="rounded-[8px] border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 p-4">
            <div className="flex items-center gap-2 text-base font-black text-neutral-950">
              <Boxes size={18} className="text-yellow-600" />
              Thống kê sản phẩm
            </div>
            <p className="mt-1 text-xs font-semibold text-neutral-500">Tổng hợp danh mục đang bán trên website.</p>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-1">
            <InsightCard label="Tổng sản phẩm" value={`${products.length} SP`} detail="Đang hiển thị trên shop" />
            <InsightCard label="Sản phẩm nổi bật" value={`${products.filter((p) => p.isFeatured).length} SP`} detail="Đẩy lên trang chủ" />
            <InsightCard label="Hàng mới" value={`${products.filter((p) => p.isNew).length} SP`} detail="Có nhãn mới" />
            <InsightCard label="Phiên bản giới hạn" value={`${products.filter((p) => p.isLimited).length} SP`} detail="Có nhãn limited" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-[8px] border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2 text-base font-black text-neutral-950">
                  <Package size={18} className="text-yellow-600" />
                  Danh mục hàng hóa
                </div>
                <p className="mt-1 text-xs font-semibold text-neutral-500">
                  {filteredProducts.length} / {products.length} sản phẩm đang hiển thị.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_190px_auto] xl:w-[700px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-3 text-neutral-400" size={16} />
                  <input
                    value={productQuery}
                    onChange={(event) => setProductQuery(event.target.value)}
                    placeholder="Tìm tên, mã, thương hiệu..."
                    className="h-10 w-full rounded-[6px] border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-xs font-semibold outline-none transition-colors focus:border-yellow-400 focus:bg-white"
                  />
                </div>
                <div className="relative">
                  <Filter className="pointer-events-none absolute left-3 top-3 text-neutral-400" size={16} />
                  <select
                    value={productCategory}
                    onChange={(event) => setProductCategory(event.target.value)}
                    className="h-10 w-full cursor-pointer rounded-[6px] border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-xs font-black outline-none transition-colors focus:border-yellow-400 focus:bg-white"
                  >
                    <option value="ALL">Tất cả danh mục</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {getCategoryLabel(category)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={onCreate}
                  className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-yellow-400 px-4 text-xs font-black text-neutral-950 transition-colors hover:bg-yellow-300"
                >
                  <Plus size={15} />
                  Thêm sản phẩm
                </button>
              </div>
            </div>

            {(productActionMessage || productActionError) && (
              <div className={`mt-3 rounded-[6px] border px-3 py-2 text-xs font-bold ${
                productActionError
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}>
                {productActionError || productActionMessage}
              </div>
            )}
          </div>

          {filteredProducts.length ? (
            <div className="grid gap-3 p-4 sm:grid-cols-2 2xl:grid-cols-3">
              {filteredProducts.slice(0, 24).map((product) => (
                <ProductAdminCard
                  key={product.id}
                  deleting={deletingProductId === product.id}
                  formattedPrice={formattedPrice}
                  product={product}
                  onDelete={() => onDelete(product)}
                  onEdit={() => onEdit(product)}
                />
              ))}
            </div>
          ) : (
            <EmptyMini message="Không có sản phẩm phù hợp với bộ lọc" />
          )}

          {filteredProducts.length > 24 && (
            <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-3 text-center text-xs font-bold text-neutral-500">
              Đang hiển thị 24 sản phẩm đầu tiên. Hãy tìm kiếm hoặc lọc để thu hẹp danh sách.
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-[8px] border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-200 p-4">
              <div className="text-base font-black text-neutral-950">Cơ cấu danh mục</div>
            </div>
            <div className="space-y-3 p-4">
              {Object.entries(productStats.categoryCounts).map(([category, count]) => (
                <ProgressRow key={category} label={getCategoryLabel(category)} value={count} total={Math.max(products.length, 1)} />
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-200 p-4">
              <div className="text-base font-black text-neutral-950">Top thương hiệu</div>
            </div>
            <div className="grid gap-2 p-4">
              {productStats.topBrands.map(([brand, count]) => (
                <div key={brand} className="flex items-center justify-between rounded-[6px] border border-neutral-200 bg-neutral-50 px-3 py-2">
                  <span className="truncate text-xs font-black text-neutral-800">{brand}</span>
                  <span className="text-xs font-black text-yellow-700">{count} SP</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-dashed border-neutral-300 bg-white p-4 text-center shadow-sm">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[6px] bg-yellow-50 text-yellow-700">
              <Plus size={20} />
            </div>
            <div className="mt-3 text-sm font-black text-neutral-950">Quản trị sản phẩm nâng cao</div>
            <p className="mt-2 text-xs font-semibold leading-5 text-neutral-500">
              Bước tiếp theo có thể thêm form tạo/sửa sản phẩm, upload ảnh và quản lý tồn kho.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function OrdersPanel({
  activeFilter,
  filteredOrdersList,
  formattedPrice,
  loading,
  query,
  selectedOrder,
  setActiveFilter,
  setQuery,
  setSelectedOrderId,
  updatingOrderId,
  onStatusUpdate
}: {
  activeFilter: string;
  filteredOrdersList: Order[];
  formattedPrice: (price: number) => string;
  loading: boolean;
  query: string;
  selectedOrder: Order | null;
  setActiveFilter: (filter: string) => void;
  setQuery: (query: string) => void;
  setSelectedOrderId: (orderId: string) => void;
  updatingOrderId: string | null;
  onStatusUpdate: (orderId: string, status: string) => Promise<void>;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="overflow-hidden rounded-[8px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-base font-black text-neutral-950">Danh sách đơn hàng</h2>
              <p className="mt-1 text-xs font-semibold text-neutral-500">Tìm kiếm, lọc và cập nhật trạng thái xử lý.</p>
            </div>
            <div className="relative w-full xl:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-3 text-neutral-400" size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm mã đơn, khách, SĐT, sản phẩm..."
                className="h-10 w-full rounded-[6px] border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-xs font-semibold outline-none transition-colors focus:border-yellow-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status.id}
                onClick={() => setActiveFilter(status.id)}
                className={`h-9 shrink-0 cursor-pointer rounded-[6px] border px-3 text-xs font-black transition-colors ${
                  activeFilter === status.id
                    ? "border-neutral-950 bg-neutral-950 text-yellow-300"
                    : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-yellow-400 hover:bg-yellow-50 hover:text-neutral-950"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-bold text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span>{filteredOrdersList.length} đơn đang hiển thị</span>
          <span>Cập nhật trạng thái ngay trên từng đơn</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
            <RefreshCw className="animate-spin text-yellow-500" size={34} />
            <span className="mt-4 text-sm font-bold">Đang nạp dữ liệu đơn hàng...</span>
          </div>
        ) : filteredOrdersList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageCheck className="text-neutral-300" size={44} />
            <div className="mt-4 text-sm font-black text-neutral-800">Chưa có đơn hàng phù hợp</div>
            <p className="mt-2 text-xs text-neutral-500">Hãy đổi bộ lọc hoặc kiểm tra lại từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 p-3 md:hidden">
              {filteredOrdersList.map((order) => (
                <OrderCard
                  key={order.id}
                  formattedPrice={formattedPrice}
                  order={order}
                  updatingOrderId={updatingOrderId}
                  onSelect={() => setSelectedOrderId(order.id)}
                  onStatusUpdate={onStatusUpdate}
                />
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1080px] border-collapse text-left text-xs">
                <thead className="bg-neutral-50 text-[10px] font-black uppercase tracking-[0.12em] text-neutral-500">
                  <tr>
                    <th className="px-4 py-3">Mã đơn</th>
                    <th className="px-4 py-3">Khách hàng</th>
                    <th className="px-4 py-3">Sản phẩm</th>
                    <th className="px-4 py-3 text-right">Thanh toán</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3">Cập nhật</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredOrdersList.map((order) => (
                    <OrderRow
                      key={order.id}
                      formattedPrice={formattedPrice}
                      order={order}
                      updatingOrderId={updatingOrderId}
                      onSelect={() => setSelectedOrderId(order.id)}
                      onStatusUpdate={onStatusUpdate}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <OrderDetailPanel formattedPrice={formattedPrice} order={selectedOrder} />
    </section>
  );
}

function OrderRow({
  formattedPrice,
  order,
  updatingOrderId,
  onSelect,
  onStatusUpdate
}: {
  formattedPrice: (price: number) => string;
  order: Order;
  updatingOrderId: string | null;
  onSelect: () => void;
  onStatusUpdate: (orderId: string, status: string) => Promise<void>;
}) {
  return (
    <tr className="align-top transition-colors hover:bg-neutral-50/70">
      <td className="px-4 py-4">
        <button onClick={onSelect} className="cursor-pointer text-left font-mono text-sm font-black text-neutral-950 hover:text-yellow-700">
          {order.id}
        </button>
        <div className="mt-1 text-[11px] font-semibold text-neutral-400">
          {new Date(order.createdAt).toLocaleString("vi-VN")}
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="font-black text-neutral-950">{order.customerName}</div>
        <div className="mt-1 text-xs font-semibold text-neutral-500">{order.customerPhone}</div>
        <div className="mt-1 max-w-[260px] truncate text-xs text-neutral-500" title={order.customerAddress}>
          {order.customerAddress}
        </div>
        {order.note && <div className="mt-2 rounded bg-neutral-100 px-2 py-1 text-[11px] italic text-neutral-500">Ghi chú: {order.note}</div>}
      </td>

      <td className="px-4 py-4">
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.product.id} className="grid grid-cols-[42px_minmax(0,1fr)] gap-3">
              <ProductThumb image={item.product.image} name={item.product.name} />
              <div className="min-w-0">
                <div className="line-clamp-1 font-bold text-neutral-900">{item.product.name}</div>
                <div className="mt-0.5 text-[11px] font-semibold text-neutral-500">SL: {item.quantity}</div>
              </div>
            </div>
          ))}
        </div>
      </td>

      <td className="px-4 py-4 text-right">
        <div className="text-sm font-black text-red-600">{formattedPrice(order.totalDiscounted)}</div>
        <div className="mt-1 text-[11px] font-semibold text-neutral-400">COD khi nhận hàng</div>
      </td>

      <td className="px-4 py-4">
        <StatusBadge status={order.status} />
      </td>

      <td className="px-4 py-4">
        <StatusSelect order={order} updatingOrderId={updatingOrderId} onStatusUpdate={onStatusUpdate} />
      </td>
    </tr>
  );
}

function OrderCard({
  formattedPrice,
  order,
  updatingOrderId,
  onSelect,
  onStatusUpdate
}: {
  formattedPrice: (price: number) => string;
  order: Order;
  updatingOrderId: string | null;
  onSelect: () => void;
  onStatusUpdate: (orderId: string, status: string) => Promise<void>;
}) {
  return (
    <article className="rounded-[8px] border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <button onClick={onSelect} className="cursor-pointer font-mono text-sm font-black text-neutral-950">
            {order.id}
          </button>
          <div className="mt-1 text-[11px] font-semibold text-neutral-400">
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="font-black text-neutral-950">{order.customerName}</div>
        <div className="text-xs font-semibold text-neutral-500">{order.customerPhone}</div>
        <div className="text-xs leading-5 text-neutral-500">{order.customerAddress}</div>
        {order.note && <div className="rounded bg-neutral-100 px-2 py-1 text-[11px] italic text-neutral-500">Ghi chú: {order.note}</div>}
      </div>

      <div className="mt-4 space-y-2 border-t border-neutral-100 pt-3">
        {order.items.map((item) => (
          <div key={item.product.id} className="grid grid-cols-[44px_minmax(0,1fr)] gap-3">
            <ProductThumb image={item.product.image} name={item.product.name} />
            <div className="min-w-0">
              <div className="line-clamp-2 text-xs font-bold text-neutral-900">{item.product.name}</div>
              <div className="mt-0.5 text-[11px] font-semibold text-neutral-500">SL: {item.quantity}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-neutral-100 pt-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400">Thanh toán</span>
        <span className="text-sm font-black text-red-600">{formattedPrice(order.totalDiscounted)}</span>
      </div>

      <div className="mt-4">
        <StatusSelect order={order} updatingOrderId={updatingOrderId} onStatusUpdate={onStatusUpdate} />
      </div>
    </article>
  );
}

function StatusSelect({
  order,
  updatingOrderId,
  onStatusUpdate
}: {
  order: Order;
  updatingOrderId: string | null;
  onStatusUpdate: (orderId: string, status: string) => Promise<void>;
}) {
  return (
    <div className="relative">
      <select
        value={normalizeStatus(order.status)}
        disabled={updatingOrderId === order.id}
        onChange={(event) => onStatusUpdate(order.id, event.target.value)}
        className="h-10 w-full min-w-[190px] cursor-pointer rounded-[6px] border border-neutral-300 bg-white px-3 text-xs font-bold text-neutral-800 outline-none transition-colors focus:border-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {WORKFLOW_STATUSES.map((status) => (
          <option key={status.id} value={status.id}>
            {status.label}
          </option>
        ))}
      </select>
      {updatingOrderId === order.id && (
        <RefreshCw className="absolute right-3 top-3 animate-spin text-yellow-500" size={14} />
      )}
    </div>
  );
}

function OrderDetailPanel({
  formattedPrice,
  order
}: {
  formattedPrice: (price: number) => string;
  order: Order | null;
}) {
  return (
    <aside className="rounded-[8px] border border-neutral-200 bg-white shadow-sm xl:sticky xl:top-4 xl:self-start">
      <div className="border-b border-neutral-200 p-4">
        <div className="flex items-center gap-2 text-base font-black text-neutral-950">
          <AlertCircle size={18} className="text-yellow-600" />
          Chi tiết xử lý
        </div>
      </div>

      {order ? (
        <div className="space-y-4 p-4">
          <div>
            <div className="font-mono text-lg font-black text-neutral-950">{order.id}</div>
            <div className="mt-1 text-xs font-semibold text-neutral-500">{order.warrantyCode || "Chưa có mã bảo hành"}</div>
          </div>

          <StatusBadge status={order.status} />

          <div className="grid gap-3 text-xs">
            <DetailLine label="Khách hàng" value={order.customerName} />
            <DetailLine label="Số điện thoại" value={order.customerPhone} />
            <DetailLine label="Địa chỉ" value={order.customerAddress} />
            <DetailLine label="Email" value={order.userEmail || "Chưa có email"} />
            <DetailLine label="Ngày tạo" value={new Date(order.createdAt).toLocaleString("vi-VN")} />
          </div>

          <div className="rounded-[6px] border border-neutral-200 bg-neutral-50 p-3">
            <div className="mb-3 text-[11px] font-black uppercase tracking-[0.12em] text-neutral-400">Sản phẩm</div>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.product.id} className="grid grid-cols-[44px_minmax(0,1fr)] gap-3">
                  <ProductThumb image={item.product.image} name={item.product.name} />
                  <div className="min-w-0">
                    <div className="line-clamp-2 text-xs font-bold text-neutral-900">{item.product.name}</div>
                    <div className="mt-1 text-[11px] font-semibold text-neutral-500">Số lượng: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[6px] bg-neutral-950 p-4 text-white">
            <div className="text-[11px] font-black uppercase tracking-[0.12em] text-neutral-400">Tổng thanh toán</div>
            <div className="mt-2 text-xl font-black text-yellow-300">{formattedPrice(order.totalDiscounted)}</div>
            <div className="mt-1 text-xs text-neutral-400">Chiết khấu: {Math.round(order.discountRate * 100)}%</div>
          </div>
        </div>
      ) : (
        <EmptyMini message="Chọn một đơn hàng để xem chi tiết xử lý" />
      )}
    </aside>
  );
}

function InsightCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[8px] border border-neutral-200 bg-neutral-50 p-4">
      <div className="text-[11px] font-black uppercase tracking-[0.12em] text-neutral-400">{label}</div>
      <div className="mt-2 break-words text-lg font-black text-neutral-950">{value}</div>
      <div className="mt-2 text-xs font-semibold text-neutral-500">{detail}</div>
    </div>
  );
}

function ProductAdminCard({
  deleting,
  formattedPrice,
  onDelete,
  onEdit,
  product
}: {
  deleting: boolean;
  formattedPrice: (price: number) => string;
  onDelete: () => void;
  onEdit: () => void;
  product: Product;
}) {
  const salePrice = product.discountPrice || product.price;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <article className="group overflow-hidden rounded-[8px] border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-neutral-50 p-4">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.isFeatured && <ProductPill tone="yellow">Hot</ProductPill>}
          {product.isNew && <ProductPill tone="green">Mới</ProductPill>}
          {product.isLimited && <ProductPill tone="red">Limited</ProductPill>}
        </div>
        {discountPercent > 0 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-black text-white">
            -{discountPercent}%
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-[11px] font-black uppercase tracking-[0.12em] text-yellow-700">{product.brand}</span>
            <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-black text-neutral-500">
              {getCategoryLabel(product.category)}
            </span>
          </div>
          <h3 className="mt-2 line-clamp-2 min-h-[40px] text-sm font-black leading-5 text-neutral-950">
            {product.name}
          </h3>
          <div className="mt-1 font-mono text-[11px] font-bold text-neutral-400">{product.code}</div>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-neutral-100 pt-3">
          <div>
            {product.discountPrice && (
              <div className="text-[11px] font-bold text-neutral-400 line-through">{formattedPrice(product.price)}</div>
            )}
            <div className="text-sm font-black text-red-600">{formattedPrice(salePrice)}</div>
          </div>
          <div className="text-right text-[11px] font-bold text-neutral-500">
            <div>{product.origin}</div>
            <div className="mt-1">{product.target || "Unisex"}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3">
          <button
            onClick={onEdit}
            className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-neutral-200 bg-white text-xs font-black text-neutral-700 transition-colors hover:border-yellow-400 hover:bg-yellow-50 hover:text-neutral-950"
          >
            <Edit3 size={14} />
            Sửa
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-red-200 bg-red-50 text-xs font-black text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Xóa
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[6px] border border-white/10 bg-white/5 p-3">
      <div className="text-[10px] font-black uppercase tracking-[0.12em] text-neutral-400">{label}</div>
      <div className="mt-2 break-words text-sm font-black text-white">{value}</div>
    </div>
  );
}

function ProductPill({ children, tone }: { children: React.ReactNode; tone: "yellow" | "green" | "red" }) {
  const className =
    tone === "yellow"
      ? "bg-yellow-400 text-neutral-950"
      : tone === "green"
        ? "bg-emerald-500 text-white"
        : "bg-red-600 text-white";

  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase shadow-sm ${className}`}>
      {children}
    </span>
  );
}

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    "dong-ho": "Đồng hồ",
    "kinh-mat": "Kính mắt",
    "phu-kien": "Phụ kiện",
    "but-ky": "Bút ký"
  };

  return labels[category] || category;
}

function ProgressRow({ label, value, total }: { label: string; value: number; total: number }) {
  const percent = Math.round((value / total) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-black">
        <span className="capitalize text-neutral-800">{label.replace("-", " ")}</span>
        <span className="text-neutral-500">{value} SP</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
        <div className="h-full rounded-full bg-yellow-400" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ProductThumb({ image, name }: { image: string; name: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[6px] border border-neutral-200 bg-neutral-50">
      <img src={image} alt={name} className="h-full w-full object-contain p-1" />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase ${getStatusClass(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-black uppercase tracking-[0.12em] text-neutral-400">{label}</div>
      <div className="mt-1 font-bold leading-5 text-neutral-800">{value}</div>
    </div>
  );
}

function EmptyMini({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <PackageCheck className="text-neutral-300" size={36} />
      <div className="mt-3 text-sm font-black text-neutral-700">{message}</div>
    </div>
  );
}

function getCustomerRows(orders: Order[]) {
  const rows = new Map<string, { key: string; name: string; phone: string; email: string; orders: number; total: number }>();

  for (const order of orders) {
    const key = getOrderCustomerKey(order);
    const current = rows.get(key) || {
      key,
      name: order.customerName,
      phone: order.customerPhone,
      email: order.userEmail || "",
      orders: 0,
      total: 0
    };

    current.orders += 1;
    if (normalizeStatus(order.status) !== "DA_HUY") {
      current.total += order.totalDiscounted;
    }
    rows.set(key, current);
  }

  return Array.from(rows.values()).sort((a, b) => b.total - a.total).slice(0, 30);
}
