import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import { useAppContext } from '../context/AppContext';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedProduct, addToCart } = useAppContext();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  if (loading) return <div style={{ color: '#ff0000', padding: '2rem' }}>Loading equipment...</div>;

  return (
    <div className="shop">
      <div className="products">
        {products.map(product => {
          const isLowStock = product.stock > 0 && product.stock <= 5;
          return (
            <div className="product" key={product._id} onClick={() => setSelectedProduct(product._id)}>
              <div className="product__img" style={{ position: 'relative' }}>
                {isLowStock && <div className="low-stock-badge">only few left</div>}
                <img src={product.images?.[0] || product.image || '/img/shirt3.png'} alt={product.name} />
              </div>
              <div className="product__info">
                <div className="left">
                  <p>{product.name}</p>
                  <span>₹{product.price}</span>
                </div>
                <div className="right" onClick={(e) => { e.stopPropagation(); addToCart(product, 'M'); }}>
                  <img src="/img/plus.png" alt="add" />
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