import React from "react";
import { useAuth } from "./context/AuthContext";
import { useAppContext } from "./context/AppContext";
import { useCart } from "./context/CartContext";
import CanvasBackground from "./components/common/CanvasBackground";
import CartDrawer from "./components/common/CartDrawer";
import CheckoutPage from "./components/checkout/CheckoutPage";
import HyperText from "./components/common/HyperText";

// Import Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Press from "./pages/Press";
import News from "./pages/News";
import Media from "./pages/Media";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";

export default function App() {
  const {
    currentPage,
    navTo,
    selectedOrder,
    selectedProduct,
    isCheckout,
    isCartOpen,
    setIsCartOpen,
  } = useAppContext();
  
  const { cartCount } = useCart();
  const { isAuthenticated, logout, user } = useAuth();

  // Dynamic Color Helper for your navbar links
  const navTextColor = currentPage === "home" ? "#000000" : "#ff0000";

  // Reverting back to your seamless state-based router
  const renderContent = () => {
    if (isCheckout) return <CheckoutPage />;
    if (selectedOrder) return <OrderDetail />;
    if (selectedProduct) return <ProductDetail />;

    switch (currentPage) {
      case "home": return <Home />;
      case "about": return <About />;
      case "shop": return <Shop />;
      case "press": return <Press />;
      case "news": return <News />;
      case "media": return <Media />;
      case "login": return <Login />;
      case "signup": return <Signup />;
      case "orders": return <Orders />;
      default: return <Home />;
    }
  };

  return (
    <section className="scene">
      <CanvasBackground currentPage={currentPage} />
      <div className="scene__dots"></div>

      <div className={`scene__card ${currentPage !== "home" ? "is-inner" : ""}`}>
        <nav
          className="card__nav"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <a
            href="#"
            className={currentPage === "about" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); navTo("about"); }}
          >
            <HyperText text="about" />
          </a>
          <a
            href="#"
            className={currentPage === "shop" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); navTo("shop"); }}
          >
            <HyperText text="shop" />
          </a>
          <a
            href="#"
            className={currentPage === "press" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); navTo("press"); }}
          >
            <HyperText text="press" />
          </a>
          {/* <a
            href="#"
            className={currentPage === "news" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); navTo("news"); }}
          >
            news
          </a> */}
          <a
            href="#"
            className={currentPage === "media" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); navTo("media"); }}
          >
            <HyperText text="media" />
          </a>

          <a
            href="#"
            className="samaan-link"
            style={{
              color: navTextColor,
            }}
            onClick={(e) => {
              e.preventDefault();
              setIsCartOpen(true);
            }}
          >
            <HyperText text="samaan" />
            <sup>({cartCount || 0})</sup>
          </a>

          <a
            href="#"
            className={`account ${currentPage === "login" ? "active" : ""}`}
            style={{ textTransform: "lowercase", font: 'ibm-plex', color: navTextColor }}
            onClick={(e) => {
              e.preventDefault();
              navTo(isAuthenticated ? "orders" : "login");
            }}
          >
            <HyperText text={isAuthenticated ? user?.name : "login"} />
          </a>
        </nav>

        <div className="card__body" id="content">
          <div
            key={`${currentPage}-${selectedOrder || selectedProduct || "none"}-${isCheckout}`}
            className="classy-transition"
          >
            {renderContent()}
          </div>
        </div>

        <div className="card__ticker">
          <div className="ticker__track">
            <span className="ticker__item">
              21streetz • 21streetz • 21streetz • 21streetz • 21streetz •
              21streetz • 21streetz • 21streetz • 21streetz • 21streetz •
              21streetz • 21streetz • 21streetz • 21streetz • 21streetz •
              21streetz • 21streetz • 21streetz • 21streetz • 21streetz •
            </span>
          </div>
        </div>

        {isCartOpen && <CartDrawer />}
      </div>
    </section>
  );
}