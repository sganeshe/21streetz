import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useCart } from "../../context/CartContext"; // IMPORT CART CONTEXT

export default function CartDrawer() {
  const { setIsCartOpen, setIsCheckout, setCurrentPage } = useAppContext();

  const { cartItems, updateQuantity, cartTotal } = useCart();

  const closeCart = () => setIsCartOpen(false);

  const updateQty = (id, size, delta) => {
    updateQuantity(id, size, delta);
  };

  const goToCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage("shop");
    setIsCheckout(true);
  };

  return (
    <div
      className="cart-overlay"
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 100,
        display: "flex",
        justifyContent: "flex-end",
        overflow: "hidden",
      }}
    >
      <div
        className="cart-drawer"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "50%",
          backgroundColor: "#050505",
          borderLeft: "1px solid #ff0000",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          color: "#ff0000",
          fontFamily: "monospace",
        }}
      >
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

        <div className="cart-items" style={{ flex: 1, overflowY: "auto" }}>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <img
                  src={item.image || "/img/shirt3.png"}
                  alt={item.name}
                  style={{
                    width: "160px",
                    height: "160px",
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
                  <div style={{ display: "flex" }}>
                    <span style={{ width: "80px", opacity: 0.7 }}>ITEM</span>
                    <span>{item.name}</span>
                  </div>
                  <div style={{ display: "flex" }}>
                    <span style={{ width: "80px", opacity: 0.7 }}>SIZE</span>
                    <span>{item.size}</span>
                  </div>
                  <div style={{ display: "flex" }}>
                    <span style={{ width: "80px", opacity: 0.7 }}>QTY</span>
                    <span style={{ display: "flex", gap: "10px" }}>
                      {/* FIXED: Using updateQuantity and item.product (which holds the ID) */}
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          updateQuantity(item.product, item.size, item.qty + 1)
                        }
                      >
                        +
                      </span>
                      <span>{item.qty}</span>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          updateQuantity(item.product, item.size, item.qty - 1)
                        }
                      >
                        -
                      </span>
                    </span>
                  </div>
                  <div style={{ display: "flex" }}>
                    <span style={{ width: "80px", opacity: 0.7 }}>PRICE</span>
                    <span>₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
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
          style={{
            marginTop: "1rem", padding: "10px 20px", fontSize: "15px", background: "#ff0000", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold",
          }}
          onClick={cartItems.length > 0 ? goToCheckout : null}
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
}
