import React, { useState, useEffect, useRef } from "react";
import { productService } from "../services/product.service";
import { useAppContext } from "../context/AppContext";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { selectedProduct, setSelectedProduct, setIsCartOpen } = useAppContext();
  const { addToCart, cartCount } = useCart(); 

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);

  const pageRef = useRef(null);
  
  React.useEffect(() => {
      pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

  useEffect(() => {
    if (!selectedProduct) return;

    const loadProduct = async () => {
      try {
        // FIXED: Using selectedProduct instead of id
        const data = await productService.getById(selectedProduct);
        setProduct(data.product);
        if (data.product.sizes?.length > 0) {
          setSelectedSize(data.product.sizes[0].size); // Auto-select first size
        }
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [selectedProduct]); // Trigger when selectedProduct changes

  if (loading)
    return (
      <div style={{ color: "#ff0000", padding: "2rem" }}>
        Loading details...
      </div>
    );
    
  if (!product)
    return (
      <div style={{ color: "#ff0000", padding: "2rem" }}>Product not found</div>
    );

  const totalStock =
    product.sizes?.reduce((sum, s) => sum + s.countInStock, 0) || 0;

  return (
    <div className="productDetail" ref={pageRef} style={{overflowY: "auto"}}>
      <div className="pd__top">
        <span
          className="back"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedProduct(null);
          }}
        >
          back
        </span>
      </div>
      <div className="pd__content">
        <div className="pd__left" style={{ marginRight: "1rem", position: "relative" }}>
          {totalStock > 0 && totalStock <= 5 && (
            <div className="low-stock-badge">only few left</div>
          )}
          <img
            src={product.images?.[0] || "/img/shirt3.png"}
            alt={product.name}
          />
        </div>
        <div className="pd__right">
          <h3 style={{ fontSize: "25px", marginTop: "-2.75rem" }}>shop/{product.name.toLowerCase().replace(/ /g, "_")}</h3>
          <p style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            size &nbsp;
            {product.sizes?.map((s) => (
              <span
                key={s.size}
                onClick={() => {
                  if (s.countInStock > 0) setSelectedSize(s.size);
                }}
                style={{
                  cursor: s.countInStock === 0 ? "not-allowed" : "pointer",
                  color:
                    selectedSize === s.size
                      ? "#000"
                      : s.countInStock === 0
                        ? "#555"
                        : "#fff",
                  textDecoration:
                    selectedSize === s.size
                      ? "underline"
                      : s.countInStock === 0
                        ? "line-through"
                        : "none",
                }}
              >
                {s.size}
              </span>
            ))}
          </p>
          <p style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {product.description}
            </span>
          </p>
          <div
            className="pd__plus"
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (totalStock > 0) addToCart(product, 1, selectedSize);
            }}
          >
            +
          </div>
          <div className="pd__accordion">
            <div className="acc__item">
              <span>jaankari</span>
              <img src="/img/arrow.png" alt="arrow" />
            </div>
            <div className="acc__item">
              <span>size chart</span>
              <img src="/img/arrow.png" alt="arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}