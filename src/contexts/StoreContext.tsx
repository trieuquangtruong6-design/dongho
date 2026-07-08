import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Order, Product, User } from "../types";

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  currentUser: User | null;
  authToken: string | null;
  orders: Order[];
  adminUsers: User[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  checkout: (details: { name: string; phone: string; address: string; note: string }) => Promise<{ success: boolean; message?: string; error?: string; order?: Order }>;
  fetchAdminOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
  createAdminProduct: (product: Product) => Promise<{ success: boolean; error?: string; product?: Product }>;
  updateAdminProduct: (productId: string, product: Product) => Promise<{ success: boolean; error?: string; product?: Product }>;
  deleteAdminProduct: (productId: string) => Promise<{ success: boolean; error?: string }>;
  fetchAdminUsers: () => Promise<void>;
  updateAdminUser: (userId: string, updates: Partial<User>) => Promise<{ success: boolean; error?: string; user?: User }>;
  deleteAdminUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const readStoredValue = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => readStoredValue<CartItem[]>("dq_cart", []));
  const [wishlist, setWishlist] = useState<Product[]>(() => readStoredValue<Product[]>("dq_wishlist", []));
  const [currentUser, setCurrentUser] = useState<User | null>(() => readStoredValue<User | null>("dq_user", null));
  const [authToken, setAuthToken] = useState<string | null>(() => readStoredValue<string | null>("dq_token", null));
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAuthHeaders = (token = authToken) => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  });

  useEffect(() => {
    if (currentUser?.id && authToken) {
      fetch(`/api/users/${currentUser.id}`, {
        headers: getAuthHeaders(authToken)
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          if (data?.user) {
            setCurrentUser(data.user);
          }
        })
        .catch(() => {
          // Keep the local session if the backend is temporarily unavailable.
        });
    }

    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to load products from server");
        }
      } catch (err) {
        console.error("Error loading products", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("dq_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("dq_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("dq_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("dq_user");
    }
  }, [currentUser]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("dq_token", JSON.stringify(authToken));
    } else {
      localStorage.removeItem("dq_token");
    }
  }, [authToken]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        setAuthToken(data.token || null);
        return { success: true };
      }
      return { success: false, error: data.error || "Đăng nhập thất bại" };
    } catch {
      return { success: false, error: "Lỗi kết nối máy chủ" };
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        setAuthToken(data.token || null);
        return { success: true };
      }
      return { success: false, error: data.error || "Đăng ký thất bại" };
    } catch {
      return { success: false, error: "Lỗi kết nối máy chủ" };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
  };

  const updateCurrentUser = async (updates: Partial<User>) => {
    if (!currentUser) {
      return { success: false, error: "Bạn cần đăng nhập để cập nhật tài khoản" };
    }

    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Cập nhật tài khoản thất bại" };
    } catch {
      return { success: false, error: "Lỗi kết nối máy chủ" };
    }
  };

  const getDiscountRate = () => {
    if (!currentUser) return 0;
    return currentUser.membership === "VIP" ? 0.1 : 0.05;
  };

  const checkout = async (details: { name: string; phone: string; address: string; note: string }) => {
    const totalOriginal = cart.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const discountRate = getDiscountRate();
    const totalDiscounted = Math.round(totalOriginal * (1 - discountRate));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: currentUser?.email || null,
          customerName: details.name,
          customerPhone: details.phone,
          customerAddress: details.address,
          items: cart,
          totalOriginal,
          totalDiscounted,
          discountRate,
          note: details.note
        })
      });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        if (currentUser && authToken) {
          const userRes = await fetch(`/api/users/${currentUser.id}`, {
            headers: getAuthHeaders()
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            setCurrentUser(userData.user);
          }
        }
        return { success: true, message: data.message, order: data.order };
      }
      return { success: false, error: data.error || "Thanh toán thất bại" };
    } catch {
      return { success: false, error: "Lỗi kết nối máy chủ khi thanh toán" };
    }
  };

  const fetchAdminOrders = async () => {
    try {
      const res = await fetch("/api/orders", {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders", err);
      setOrders([]);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchAdminOrders();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const createAdminProduct = async (product: Product) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(product)
      });
      const data = await res.json();
      if (res.ok && data.product) {
        setProducts((prev) => [...prev, data.product]);
        return { success: true, product: data.product };
      }
      return { success: false, error: data.error || "Khong the tao san pham" };
    } catch {
      return { success: false, error: "Loi ket noi may chu" };
    }
  };

  const updateAdminProduct = async (productId: string, product: Product) => {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(product)
      });
      const data = await res.json();
      if (res.ok && data.product) {
        setProducts((prev) => prev.map((item) => (item.id === productId ? data.product : item)));
        setCart((prev) => prev.map((item) => (
          item.product.id === productId ? { ...item, product: data.product } : item
        )));
        setWishlist((prev) => prev.map((item) => (item.id === productId ? data.product : item)));
        return { success: true, product: data.product };
      }
      return { success: false, error: data.error || "Khong the cap nhat san pham" };
    } catch {
      return { success: false, error: "Loi ket noi may chu" };
    }
  };

  const deleteAdminProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setProducts((prev) => prev.filter((item) => item.id !== productId));
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
        setWishlist((prev) => prev.filter((item) => item.id !== productId));
        return { success: true };
      }
      return { success: false, error: data.error || "Khong the xoa san pham" };
    } catch {
      return { success: false, error: "Loi ket noi may chu" };
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch("/api/users", {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data);
      } else {
        setAdminUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users", err);
      setAdminUsers([]);
    }
  };

  const updateAdminUser = async (userId: string, updates: Partial<User>) => {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(userId)}/admin`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setAdminUsers((prev) => prev.map((user) => (user.id === userId ? data.user : user)));
        if (currentUser?.id === userId) {
          setCurrentUser(data.user);
        }
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || "Khong the cap nhat tai khoan" };
    } catch {
      return { success: false, error: "Loi ket noi may chu" };
    }
  };

  const deleteAdminUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setAdminUsers((prev) => prev.filter((user) => user.id !== userId));
        return { success: true };
      }
      return { success: false, error: data.error || "Khong the xoa tai khoan" };
    } catch {
      return { success: false, error: "Loi ket noi may chu" };
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        currentUser,
        authToken,
        orders,
        adminUsers,
        isLoading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        login,
        registerUser,
        logout,
        updateCurrentUser,
        checkout,
        fetchAdminOrders,
        updateOrderStatus,
        createAdminProduct,
        updateAdminProduct,
        deleteAdminProduct,
        fetchAdminUsers,
        updateAdminUser,
        deleteAdminUser
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
