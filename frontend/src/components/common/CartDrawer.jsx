import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { useCart } from "../../context/CartContext";
import { productService } from "../../services/product.service";

export default function CartDrawer() {
  const { setIsCartOpen, setCurrentPage, setIsCheckout } = useAppContext();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  // stockMap: { [productId_size]: { available: bool, maxQty: number } }
  const [stockMap, setStockMap] = useState({});
  const [validating, setValidating] = useState(false);

  const closeCart = () => setIsCartOpen(false);

  // Validate stock whenever cart opens or cartItems change
  useEffect(() => {
    if (cartItems.length === 0) {
      setStockMap({});
      return;
    }

    const validate = async () => {
      setValidating(true);
      const uniqueProductIds = [...new Set(cartItems.map((i) => i.product))];

      const results = await Promise.allSettled(
        uniqueProductIds.map((id) => productService.getById(id))
      );

      const map = {};
      results.forEach((result, idx) => {
        const productId = uniqueProductIds[idx];
        if (result.status === "fulfilled") {
          const product = result.value.product;
          product.sizes?.forEach((s) => {
            map[`${productId}_${s.size}`] = {
              available: s.countInStock > 0,
              maxQty: s.countInStock,
            };
          });
        } else {
          // Product fetch failed — treat as unavailable
          cartItems
            .filter((i) => i.product === productId)
            .forEach((i) => {
              map[`${productId}_${i.size}`] = { available: false, maxQty: 0 };
            });
        }
      });

      setStockMap(map);
      setValidating(false);
    };

    validate();
  }, [cartItems.length]); // Re-validate when item count changes (add/remove)

  const getStockInfo = (item) =>
    stockMap[`${item.product}_${item.size}`] ?? { available: true, maxQty: Infinity };

  const oosItems = cartItems.filter((item) => {
    const info = getStockInfo(item);
    return !info.available || item.qty > info.maxQty;
  });

  const hasOosItems = oosItems.length > 0;

  const goToCheckout = () => {
    if (hasOosItems) return;
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
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
          <span style={{ cursor: "pointer", fontSize: "18px" }} onClick={closeCart}>
            back
          </span>
          <span style={{ textDecoration: "underline", fontSize: "18px" }}>samaan</span>
        </div>

        {/* Validation banner */}
        {validating && (
          <div style={{ fontSize: "11px", opacity: 0.5, marginBottom: "1rem", letterSpacing: "1px" }}>
            CHECKING STOCK...
          </div>
        )}

        {!validating && hasOosItems && (
          <div
            style={{
              border: "1px solid #ff0000",
              padding: "10px 12px",
              marginBottom: "1.5rem",
              fontSize: "11px",
              letterSpacing: "0.5px",
              lineHeight: "1.6",
              background: "rgba(255,0,0,0.05)",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
              [STOCK CONFLICT]
            </div>
            {oosItems.map((item) => {
              const info = getStockInfo(item);
              const msg =
                !info.available
                  ? `${item.name} (${item.size}) — out of stock`
                  : `${item.name} (${item.size}) — only ${info.maxQty} left, you have ${item.qty}`;
              return (
                <div key={`${item.product}_${item.size}`} style={{ opacity: 0.85 }}>
                  • {msg}
                </div>
              );
            })}
            <div style={{ marginTop: "6px", opacity: 0.6 }}>
              Remove or update these items to proceed.
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="cart-items" style={{ flex: 1, overflowY: "auto", paddingRight: "5px" }}>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => {
              const info = getStockInfo(item);
              const isOos = !info.available;
              const overQty = info.available && item.qty > info.maxQty;
              const flagged = isOos || overQty;

              return (
                <div
                  className="cart-hyper-item"
                  key={index}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                    opacity: isOos ? 0.5 : 1,
                    position: "relative",
                  }}
                >
                  <img
                    src={item.image || "/img/shirt3.png"}
                    alt={item.name}
                    className="cart-item-img"
                    style={{
                      objectFit: "cover",
                      border: flagged ? "1px solid #ff4444" : "1px solid #ff0000",
                      filter: isOos ? "grayscale(60%)" : "none",
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
                        <span
                          style={{
                            color: overQty ? "#ff4444" : "inherit",
                          }}
                        >
                          {item.qty}
                          {overQty && (
                            <span style={{ fontSize: "11px", marginLeft: "4px", opacity: 0.8 }}>
                              (max {info.maxQty})
                            </span>
                          )}
                        </span>
                        <span
                          style={{
                            cursor: overQty || item.qty >= info.maxQty ? "not-allowed" : "pointer",
                            padding: "0 5px",
                            opacity: overQty || item.qty >= info.maxQty ? 0.3 : 1,
                          }}
                          onClick={() => {
                            if (item.qty < info.maxQty) {
                              updateQuantity(item.product, item.size, item.qty + 1);
                            }
                          }}
                        >
                          +
                        </span>
                      </span>
                    </div>
                    <div style={{ display: "flex", lineHeight: "1.2" }}>
                      <span style={{ width: "60px", opacity: 0.7 }}>PRICE</span>
                      <span>₹{(item.price * item.qty).toFixed(2)}</span>
                    </div>

                    {/* OOS inline label + remove shortcut */}
                    {flagged && (
                      <div
                        style={{
                          fontSize: "11px",
                          letterSpacing: "0.5px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginTop: "2px",
                        }}
                      >
                        <span style={{ color: "#ff4444" }}>
                          {isOos ? "OUT OF STOCK" : `ONLY ${info.maxQty} AVAILABLE`}
                        </span>
                        <span
                          onClick={() => removeFromCart(item.product, item.size)}
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                            opacity: 0.7,
                            fontSize: "11px",
                          }}
                        >
                          [REMOVE]
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
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
          className="btn-hypertext"
          style={{
            marginTop: "1rem",
            padding: "15px 20px",
            fontSize: "15px",
            width: "100%",
            opacity: cartItems.length > 0 && !hasOosItems && !validating ? 1 : 0.4,
            cursor: cartItems.length > 0 && !hasOosItems && !validating ? "pointer" : "not-allowed",
            fontWeight: "bold",
          }}
          onClick={
            cartItems.length > 0 && !hasOosItems && !validating
              ? goToCheckout
              : null
          }
        >
          {validating
            ? "VALIDATING..."
            : hasOosItems
            ? "RESOLVE ITEMS TO CHECKOUT"
            : "CHECKOUT"}
        </button>
      </div>
    </div>
  );
}