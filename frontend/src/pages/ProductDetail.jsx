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
  
  const [isAdding, setIsAdding] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

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
        setCurrentImgIndex(0); 
        if (data.product.sizes?.length > 0) {
          setSelectedSize(data.product.sizes[0].size);
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
    return <div style={{ color: "#ff0000", padding: "2rem" }}>Loading details...</div>;
    
  if (!product)
    return <div style={{ color: "#ff0000", padding: "2rem" }}>Product not found</div>;

  const totalStock = product.sizes?.reduce((sum, s) => sum + s.countInStock, 0) || 0;
  const imagesArray = product.images && product.images.length > 0 ? product.images : ["/img/shirt3.png"];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % imagesArray.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + imagesArray.length) % imagesArray.length);
  };

  return (
    <div className="productDetail" ref={pageRef}>
      <div className="pd__top">
        <span className="back" onClick={() => setSelectedProduct(null)}>back</span>
      </div>
      <div className="pd__content">
        
        {/* Main Product Image Container */}
        <div className="pd__left" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          
          <div className="image-bounds">
            {/* Flush Brutalist Badge */}
            {totalStock === 0 ? (
              <div className="brutalist-badge">sold out</div>
            ) : totalStock > 0 && totalStock <= 5 ? (
              <div className="brutalist-badge">only few left</div>
            ) : null}
            
            <img
              src={imagesArray[currentImgIndex]}
              alt={product.name}
              style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
            />

            {/* Brutalist Monospace Arrows */}
            {imagesArray.length > 1 && (
              <>
                <button className="brutalist-arrow arrow-left" onClick={prevImage}>
                  {"<"}
                </button>

                <button className="brutalist-arrow arrow-right" onClick={nextImage}>
                  {">"}
                </button>
              </>
            )}
          </div>
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
                  color: selectedSize === s.size ? "#000" : s.countInStock === 0 ? "#555" : "#fff",
                  textDecoration: selectedSize === s.size ? "underline" : s.countInStock === 0 ? "line-through" : "none",
                  transition: "color 0.2s ease",
                }}
              >
                {s.size}
              </span>
            ))}
          </p>
          <div className="pd__description">
            <div className="pd__description-header" onClick={() => setIsDescriptionOpen((open) => !open)}>
              <span>jaankari</span>
              <img className={`animated-arrow ${isDescriptionOpen ? "rotated" : ""}`} src="/img/arrow.png" alt="arrow" />
            </div>
            {isDescriptionOpen && <div className="pd__description-text">{product.description}</div>}
          </div>
          <div className="pd__accordion">
            <div className="acc__item" onClick={() => setIsSizeChartOpen((open) => !open)}>
              <span>size chart</span>
              <img className={`animated-arrow ${isSizeChartOpen ? "rotated" : ""}`} src="/img/arrow.png" alt="arrow" />
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
            className={`pd__plus ${isAdding ? "btn-added-success" : ""}`}
            style={{ 
              display: "flex", justifyContent: "center", alignItems: "center", 
              transition: "background-color 0.4s ease", cursor: isAdding ? "default" : "pointer"
            }}
            onClick={() => {
              if (totalStock > 0 && !isAdding) {
                addToCart(product, 1, selectedSize);
                setIsAdding(true);
                setTimeout(() => setIsAdding(false), 1200);
              }
            }}
          >
            <span className={isAdding ? "icon-fade-enter" : ""} style={{ transition: "opacity 0.4s ease" }}>
              {isAdding ? "✓" : "+"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}