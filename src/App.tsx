import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";

import { StoreProvider } from "./contexts/StoreContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Account from "./pages/Account";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Warranty from "./pages/Warranty";
import ThankYou from "./pages/ThankYou";
import { Product } from "./types";
import { useStore } from "./contexts/StoreContext";

export default function App() {
  return (
    <StoreProvider>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-850">
        {/* Main top branded navigation Header */}
        <Header />

        {/* Main Content scroll window */}
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:categoryName" element={<ShopCategoryRedirect />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/account" element={<Account />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/warranty" element={<Warranty />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route path="/admin" element={<AdminRoute />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer containing support hotlines & policies */}
        <Footer />
      </div>
    </StoreProvider>
  );
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
}

// Simple Helper component to redirect routes like /category/dong-ho directly to shop page with query params
function ShopCategoryRedirect() {
  const { categoryName } = useParams<{ categoryName: string }>();

  return <Navigate to={`/shop?category=${categoryName}`} replace />;
}

function AdminRoute() {
  const { currentUser, logout } = useStore();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (currentUser.role !== "ADMIN") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <div className="rounded-[8px] border border-red-100 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-black text-neutral-950">Bạn không có quyền quản trị</h1>
          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Trang quản trị chỉ dành cho tài khoản admin. Hãy đăng xuất và đăng nhập bằng tài khoản quản trị viên.
          </p>
          <button
            onClick={logout}
            className="mt-5 h-11 rounded bg-yellow-400 px-5 text-sm font-black text-neutral-950 hover:bg-yellow-300"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    );
  }

  return <Admin />;
}
