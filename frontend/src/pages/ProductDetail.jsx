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
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const pageRef = useRef(null);
  
  React.useEffect(() => {
      pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

  useEffect(() => {
    if (!selectedProduct) return;

    const loadProduct = async () => {
      try {
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
  }, [selectedProduct]);

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
    <div className="productDetail" ref={pageRef}>
      <div className="pd__top">
        <span
          className="back"
          onClick={() => {
            setSelectedProduct(null);
          }}
        >
          back
        </span>
      </div>
      <div className="pd__content">
        <div className="pd__left">
          {totalStock > 0 && totalStock <= 5 && (
            <div className="low-stock-badge">only few left</div>
          )}
          <img
            src={product.images?.[0] || "/img/shirt3.png"}
            alt={product.name}
          />
        </div>
        <div className="pd__right">
          <h3>shop/{product.name.toLowerCase().replace(/ /g, "_")}</h3>
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
          <div className="pd__description">
            <div
              className="pd__description-header"
              onClick={() => setIsDescriptionOpen((open) => !open)}
            >
              <span>jaankari</span>
              <img
                className={`animated-arrow ${isDescriptionOpen ? "rotated" : ""}`}
                src="/img/arrow.png"
                alt="arrow"
              />
            </div>
            {isDescriptionOpen && (
              <div className="pd__description-text">{product.description}</div>
            )}
          </div>
          <div className="pd__accordion">
            <div
              className="acc__item"
              onClick={() => setIsSizeChartOpen((open) => !open)}
            >
              <span>size chart</span>
              <img
                className={`animated-arrow ${isSizeChartOpen ? "rotated" : ""}`}
                src="/img/arrow.png"
                alt="arrow"
              />
            </div>
            {isSizeChartOpen && (
              <div className="size-chart-details">
                {product.sizes?.map((s) => (
                  <div key={s.size} className="size-chart-row">
                    <span>{s.size}</span>
                    <span>{s.countInStock} in stock</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className="pd__plus"
            onClick={() => {
              if (totalStock > 0) addToCart(product, 1, selectedSize);
            }}
          >
            +
          </div>
        </div>
      </div>
    </div>
  );
}