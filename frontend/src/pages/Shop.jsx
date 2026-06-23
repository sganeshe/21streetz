import React, { useState, useEffect } from "react";
import { productService } from "../services/product.service";
import { useAppContext } from "../context/AppContext";
import { useCart } from "../context/CartContext";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div style={{ color: "#ff0000", padding: "2rem", textAlign: "center" }}>
        Loading equipment...
      </div>
    );
  }

  return (
    <div className="shop">
      <div className="products">
        {products.map((product) => {
          const totalStock = product.sizes?.reduce((sum, s) => sum + s.countInStock, 0) || 0;
          const isLowStock = totalStock > 0 && totalStock <= 5;
          const isSoldOut = totalStock === 0;

          return (
            <div
              className="product"
              key={product._id}
              onClick={() => setSelectedProduct(product._id)}
            >
              <div className="product__img">
                {isSoldOut ? (
                  <div className="low-stock-badge">sold out</div>
                ) : isLowStock ? (
                  <div className="low-stock-badge">only few left</div>
                ) : null}
                <img
                  src={product.images?.[0] || "/img/shirt3.png"}
                  alt={product.name}
                  style={{ 
                    opacity: isSoldOut ? 0.3 : 1, 
                    transition: "opacity 0.3s ease-in-out" 
                  }}
                />
              </div>
              <div className="product__info">
                <div className="left">
                  {/* Clean class names that our CSS Grid controls perfectly */}
                  <p className="product-title">{product.name}</p>
                  <span className="product-price">₹{product.price}</span>
                </div>
                <div
                  className="right"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSoldOut) {
                      addToCart(product, 1, product.sizes?.[0]?.size || "M");
                    }
                  }}
                >
                  <img
                    src="/img/plus.png"
                    alt="add"
                    className="add-btn-img"
                    style={{ opacity: isSoldOut ? 0.3 : 1 }}
                  />
                </div>
              </div>
              <div className="product__line"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}