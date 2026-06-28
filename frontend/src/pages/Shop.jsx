import React, { useState, useEffect } from "react";
import { productService } from "../services/product.service";
import { useAppContext } from "../context/AppContext";
import { useCart } from "../context/CartContext";

function ProductCard({ product, setSelectedProduct, addToCart, addingId, setAddingId }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const totalStock = product.sizes?.reduce((sum, s) => sum + s.countInStock, 0) || 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;
  const isSoldOut = totalStock === 0;

  const imagesArray = product.images && product.images.length > 0 ? product.images : ["/img/shirt3.png"];

  useEffect(() => {
    let interval;
    if (isHovered && imagesArray.length > 1) {
      interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % imagesArray.length);
      }, 1200);
    } else {
      setCurrentImgIndex(0); 
    }
    return () => clearInterval(interval);
  }, [isHovered, imagesArray]);

  return (
    <div
      className="product"
      key={product._id}
      onClick={() => setSelectedProduct(product._id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product__img image-bounds">
  
        {/* Badges perfectly pinned to top-left with sharp corners */}
        {isSoldOut ? (
          <div className="brutalist-badge">
            sold out
          </div>
        ) : isLowStock ? (
          <div className="brutalist-badge">
            only few left
          </div>
        ) : null}

        {/* Image Stack for Hover Fade */}
        {imagesArray.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={product.name}
            style={{
              position: index === 0 ? "relative" : "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: index === currentImgIndex ? (isSoldOut ? 0.4 : 1) : 0,
              transition: "opacity 0.6s ease-in-out",
              zIndex: index === currentImgIndex ? 2 : 1,
              pointerEvents: "none"
            }}
          />
        ))}
      </div>

      <div className="product__info">
        <div className="left">
          <p className="product-title">{product.name}</p>
          <span className="product-price">₹{product.price}</span>
        </div>
        <div
          className="right"
          onClick={(e) => {
            e.stopPropagation();
            if (!isSoldOut && addingId !== product._id) {
              addToCart(product, 1, product.sizes?.[0]?.size || "M");
              setAddingId(product._id);
              setTimeout(() => setAddingId(null), 1200);
            }
          }}
        >
          {addingId === product._id ? (
            <span className="icon-fade-enter" style={{ fontSize: "16px", color: "#ff0000" }}>✓</span>
          ) : (
            <img
              src="/img/plus.png"
              alt="add"
              className="add-btn-img"
              style={{ opacity: isSoldOut ? 0.3 : 1, transition: "opacity 0.3s ease" }}
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
    return <div style={{ color: "#ff0000", padding: "2rem", textAlign: "center" }}>Loading equipment...</div>;
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