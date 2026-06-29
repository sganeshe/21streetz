import React, { useState, useEffect, useRef } from "react";
import { productService } from "../services/product.service";
import { useAppContext } from "../context/AppContext";
import { useCart } from "../context/CartContext";

function SizePicker({ product, onSelect, onClose }) {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={pickerRef}
      style={{
        position: "absolute",
        bottom: "calc(100% + 6px)",
        right: 0,
        background: "#050505",
        border: "1px solid #ff0000",
        padding: "10px 12px",
        zIndex: 200,
        minWidth: "130px",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          fontSize: "9px",
          color: "#ff0000",
          opacity: 0.5,
          marginBottom: "8px",
          letterSpacing: "2px",
        }}
      >
        SELECT SIZE
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {product.sizes.map((s) => {
          const oos = s.countInStock === 0;
          return (
            <span
              key={s.size}
              onClick={() => !oos && onSelect(s.size)}
              style={{
                fontSize: "11px",
                letterSpacing: "1px",
                padding: "5px 9px",
                border: oos
                  ? "1px solid rgba(255,0,0,0.2)"
                  : "1px solid #ff0000",
                color: oos ? "rgba(255,0,0,0.25)" : "#ff0000",
                textDecoration: oos ? "line-through" : "none",
                cursor: oos ? "not-allowed" : "pointer",
                transition: "background 0.1s ease",
              }}
              onMouseEnter={(e) => {
                if (!oos)
                  e.currentTarget.style.background = "rgba(255,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {s.size}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  setSelectedProduct,
  addToCart,
  addingId,
  setAddingId,
}) {
  const [showSizePicker, setShowSizePicker] = useState(false);

  const totalStock =
    product.sizes?.reduce((sum, s) => sum + s.countInStock, 0) || 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;
  const isSoldOut = totalStock === 0;
  const availableSizes = product.sizes?.filter((s) => s.countInStock > 0) || [];
  const hasSingleSize = availableSizes.length === 1;
  const image = product.images?.[0] || "/img/shirt3.png";

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (isSoldOut || addingId === product._id) return;
    if (hasSingleSize) {
      addToCart(product, 1, availableSizes[0].size);
      setAddingId(product._id);
      setTimeout(() => setAddingId(null), 1200);
    } else {
      setShowSizePicker((prev) => !prev);
    }
  };

  const handleSizeSelect = (size) => {
    setShowSizePicker(false);
    addToCart(product, 1, size);
    setAddingId(product._id);
    setTimeout(() => setAddingId(null), 1200);
  };

  return (
    <div
      className="product"
      key={product._id}
      onClick={() => setSelectedProduct(product._id)}
      style={{ cursor: "pointer" }}
    >
      {/* Image */}
      <div className="product__img" style={{ position: "relative" }}>
        {isSoldOut ? (
          <div className="low-stock-badge">sold out</div>
        ) : isLowStock ? (
          <div className="low-stock-badge">only few left</div>
        ) : null}

        <img
          src={image}
          alt={product.name}
          style={{
            opacity: isSoldOut ? 0.35 : 1,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>

      {/* Info row */}
      <div className="product__info">
        <div className="left">
          <p>{product.name}</p>
          <span>₹{product.price}</span>
        </div>

        <div
          className="right"
          style={{ position: "relative" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            onClick={handleAddClick}
            style={{ cursor: isSoldOut ? "not-allowed" : "pointer" }}
          >
            {addingId === product._id ? (
              <span
                style={{
                  fontSize: "16px",
                  color: "#ff0000",
                  display: "block",
                }}
              >
                ✓
              </span>
            ) : (
              <img
                src="/img/plus.png"
                alt="add"
                style={{
                  opacity: isSoldOut ? 0.2 : 1,
                  transition: "opacity 0.3s ease",
                }}
              />
            )}
          </div>

          {showSizePicker && !isSoldOut && (
            <SizePicker
              product={product}
              onSelect={handleSizeSelect}
              onClose={() => setShowSizePicker(false)}
            />
          )}
        </div>
      </div>

      <div className="product__line"></div>
    </div>
  );
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const { setSelectedProduct } = useAppContext();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ color: "#ff0000", padding: "2rem" }}>
        Loading equipment...
      </div>
    );
  }

  return (
    <div className="shop">
      <div className="products">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            setSelectedProduct={setSelectedProduct}
            addToCart={addToCart}
            addingId={addingId}
            setAddingId={setAddingId}
          />
        ))}
      </div>
    </div>
  );
}