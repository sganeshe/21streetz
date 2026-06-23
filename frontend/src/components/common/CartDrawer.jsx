import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useCart } from "../../context/CartContext";

export default function CartDrawer() {
  const { setIsCartOpen, setIsCheckout, setCurrentPage } = useAppContext();
  const { cartItems, updateQuantity, cartTotal } = useCart();

  const closeCart = () => setIsCartOpen(false);

  const goToCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage("shop");
    setIsCheckout(true);
  };

  return (
    <div
      className="cart-overlay"
      style={{
        position: "fixed", 
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 9999, 
        display: "flex",
        justifyContent: "flex-end",
        overflow: "hidden",
      }}
    >
      <div
        /* 🔑 ADDED HYPERTEXT BOOT ANIMATION HERE */
        className="cart-drawer hypertext-drawer-enter"
        style={{
          height: "100%",
          backgroundColor: "#050505",
          borderLeft: "1px solid #ff0000",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          color: "#ff0000",
          fontFamily: "monospace",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <span style={{ cursor: "pointer", fontSize: "18px" }} onClick={closeCart}>
            back
          </span>
          <span style={{ textDecoration: "underline", fontSize: "18px" }}>samaan</span>
        </div>

        {/* Cart Items */}
        <div className="cart-items" style={{ flex: 1, overflowY: "auto", paddingRight: "5px" }}>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div
                /* 🔑 ADDED HYPER-ITEM HOVER EFFECT HERE */
                className="cart-hyper-item"
                key={index}
                style={{
                  display: "flex",
                  gap: "1rem", 
                  marginBottom: "1.5rem",
                }}
              >
                <img
                  src={item.image || "/img/shirt3.png"}
                  alt={item.name}
                  className="cart-item-img"
                  style={{
                    objectFit: "cover",
                    border: "1px solid #ff0000",
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    fontSize: "18px", 
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", lineHeight: "1.2" }}>
                    <span style={{ width: "60px", opacity: 0.7 }}>ITEM</span>
                    <span style={{ flex: 1 }}>{item.name}</span>
                  </div>
                  <div style={{ display: "flex", lineHeight: "1.2" }}>
                    <span style={{ width: "60px", opacity: 0.7 }}>SIZE</span>
                    <span>{item.size}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", lineHeight: "1.2" }}>
                    <span style={{ width: "60px", opacity: 0.7 }}>QTY</span>
                    <span style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                      <span
                        style={{ cursor: "pointer", padding: "0 5px" }}
                        onClick={() => updateQuantity(item.product, item.size, item.qty - 1)}
                      >
                        -
                      </span>
                      <span>{item.qty}</span>
                      <span
                        style={{ cursor: "pointer", padding: "0 5px" }}
                        onClick={() => updateQuantity(item.product, item.size, item.qty + 1)}
                      >
                        +
                      </span>
                    </span>
                  </div>
                  <div style={{ display: "flex", lineHeight: "1.2" }}>
                    <span style={{ width: "60px", opacity: 0.7 }}>PRICE</span>
                    <span>₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1.5rem",
            borderTop: "1px solid #ff0000",
            paddingTop: "1rem",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>TOTAL</span>
          <span style={{ fontSize: "1.2rem" }}>₹{cartTotal.toFixed(2)}</span>
        </div>

        <button
          /* 🔑 ADDED BRUTALIST HYPERTEXT BUTTON LOGIC */
          className="btn-hypertext"
          style={{
            marginTop: "1rem",
            padding: "15px 20px",
            fontSize: "15px",
            width: "100%", 
            opacity: cartItems.length > 0 ? 1 : 0.5,
            cursor: cartItems.length > 0 ? "pointer" : "not-allowed",
            fontWeight: "bold",
          }}
          onClick={cartItems.length > 0 ? goToCheckout : null}
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
}