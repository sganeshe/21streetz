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
  const [sizeError, setSizeError] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const pageRef = useRef(null);

  useEffect(() => {
    pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;
    setLoading(true);
    setProduct(null);
    setCurrentImgIndex(0);
    setSizeError(false);

    const load = async () => {
      try {
        const data = await productService.getById(selectedProduct);
        setProduct(data.product);
        const firstAvailable = data.product.sizes?.find((s) => s.countInStock > 0);
        setSelectedSize(firstAvailable?.size || "");
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedProduct]);

  if (loading)
    return <div style={{ color: "#ff0000", padding: "2rem" }}>Loading details...</div>;

  if (!product)
    return <div style={{ color: "#ff0000", padding: "2rem" }}>Product not found</div>;

  const totalStock = product.sizes?.reduce((sum, s) => sum + s.countInStock, 0) || 0;
  const imagesArray = product.images?.length > 0 ? product.images : ["/img/shirt3.png"];

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((i) => (i - 1 + imagesArray.length) % imagesArray.length);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((i) => (i + 1) % imagesArray.length);
  };

  const handleAddToCart = () => {
    if (totalStock === 0 || isAdding) return;
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 700);
      return;
    }
    const sizeObj = product.sizes?.find((s) => s.size === selectedSize);
    if (!sizeObj || sizeObj.countInStock === 0) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 700);
      return;
    }
    addToCart(product, 1, selectedSize);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1200);
  };

  return (
    <div ref={pageRef} className="productDetail">

      {/* Top bar */}
      <div className="pd__top">
        <span
          className="back"
          onClick={() => setSelectedProduct(null)}
        >
          back
        </span>
        <span
          className="pd__title"
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => setIsCartOpen(true)}
        >
          samaan<sup>({cartCount})</sup>
        </span>
      </div>

      <div className="pd__content">

        {/* LEFT — fixed-ratio image, no background, no drop-shadow */}
        <div className="pd__left" style={{ position: "relative" }}>

          {totalStock === 0 ? (
            <div className="low-stock-badge">sold out</div>
          ) : totalStock <= 5 ? (
            <div className="low-stock-badge">only few left</div>
          ) : null}

          {/*
            aspect-ratio box locks the image area to 3:4.
            background: transparent so it matches the red page behind it.
            objectFit: contain keeps the shirt centred without cropping.
          */}
          <div
            style={{
              width: "85%",
              maxWidth: "340px",
              aspectRatio: "3 / 4",
              position: "relative",
              overflow: "hidden",
              background: "transparent",   /* ← matches page red, no box visible */
              margin: "0 auto",
            }}
          >
            <img
              src={imagesArray[currentImgIndex]}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",        /* ← whole shirt visible, no crop */
                display: "block",
                opacity: totalStock === 0 ? 0.35 : 1,
                transition: "opacity 0.3s ease",
                filter: "drop-shadow(0px 6px 0px rgba(0,0,0,0.35))",
              }}
            />

            {/* Arrows — only when multiple images */}
            {imagesArray.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.45)",
                    border: "none",
                    borderRight: "1px solid rgba(0,0,0,0.6)",
                    color: "#000",
                    fontFamily: "monospace",
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 9px",
                    cursor: "pointer",
                    lineHeight: 1,
                  }}
                >
                  {"<"}
                </button>
                <button
                  onClick={nextImage}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.45)",
                    border: "none",
                    borderLeft: "1px solid rgba(0,0,0,0.6)",
                    color: "#000",
                    fontFamily: "monospace",
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 9px",
                    cursor: "pointer",
                    lineHeight: 1,
                  }}
                >
                  {">"}
                </button>

                {/* Dot indicators */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  {imagesArray.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(idx); }}
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: idx === currentImgIndex ? "#000" : "rgba(0,0,0,0.35)",
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT — your original layout, added padding-left gap from image */}
        <div className="pd__right" style={{ paddingLeft: "2rem" }}>

          <h3>shop/{product.name.toLowerCase().replace(/ /g, "_")}</h3>

          {/* Size row */}
          <p style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ color: sizeError ? "rgba(0,0,0,0.5)" : undefined, transition: "color 0.2s" }}>
              size{sizeError && <span style={{ fontSize: "11px", marginLeft: "6px", opacity: 0.7 }}>— pick one</span>}
            </span>
            {product.sizes?.map((s) => {
              const oos = s.countInStock === 0;
              return (
                <span
                  key={s.size}
                  onClick={() => { if (!oos) { setSelectedSize(s.size); setSizeError(false); } }}
                  style={{
                    cursor: oos ? "not-allowed" : "pointer",
                    color:
                      selectedSize === s.size
                        ? "#000"
                        : oos
                        ? "rgba(0,0,0,0.25)"
                        : "rgba(0,0,0,0.55)",
                    textDecoration:
                      selectedSize === s.size
                        ? "underline"
                        : oos
                        ? "line-through"
                        : "none",
                    fontWeight: selectedSize === s.size ? "bold" : "normal",
                  }}
                >
                  {s.size}
                </span>
              );
            })}
          </p>

          {/* Price */}
          <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>₹{product.price}</p>

          {/* Add + button */}
          <div
            className="pd__plus"
            style={{
              cursor: totalStock === 0 ? "not-allowed" : "pointer",
              opacity: totalStock === 0 ? 0.25 : 1,
              transition: "opacity 0.2s ease",
            }}
            onClick={handleAddToCart}
          >
            {isAdding ? "✓" : "+"}
          </div>

          {/* Accordions */}
          <div className="pd__accordion">
            <div
              className="acc__item"
              style={{ cursor: "pointer" }}
              onClick={() => setIsDescriptionOpen((o) => !o)}
            >
              <span>jaankari</span>
              <img
                src="/img/arrow.png"
                alt="arrow"
                style={{
                  transform: isDescriptionOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </div>
            {isDescriptionOpen && (
              <div style={{ padding: "10px 0 12px", fontSize: "13px", lineHeight: "1.7", opacity: 0.75 }}>
                {product.description}
              </div>
            )}

            <div
              className="acc__item"
              style={{ cursor: "pointer" }}
              onClick={() => setIsSizeChartOpen((o) => !o)}
            >
              <span>size chart</span>
              <img
                src="/img/arrow.png"
                alt="arrow"
                style={{
                  transform: isSizeChartOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </div>
            {isSizeChartOpen && (
              <div style={{ padding: "8px 0 12px" }}>
                {product.sizes?.map((s) => (
                  <div
                    key={s.size}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      padding: "5px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.1)",
                      opacity: s.countInStock === 0 ? 0.3 : 0.8,
                    }}
                  >
                    <span>{s.size}</span>
                    <span>{s.countInStock === 0 ? "sold out" : `${s.countInStock} left`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}