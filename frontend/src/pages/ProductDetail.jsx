import React, { useState, useEffect } from 'react';
import { fetchProductById } from '../services/api';
import { useAppContext } from '../context/AppContext';

export default function ProductDetail() {
  const { selectedProduct: id, setSelectedProduct, addToCart, cartItems, setIsCartOpen } = useAppContext();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductById(id);
      setProduct(data);
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  if (loading) return <div style={{ color: '#ff0000', padding: '2rem' }}>Loading details...</div>;
  if (!product) return <div style={{ color: '#ff0000', padding: '2rem' }}>Product not found</div>;

  return (
    <div className="productDetail">
      <div className="pd__top">
        <span className="back" style={{ cursor: 'pointer' }} onClick={() => setSelectedProduct(null)}>back</span>
        <span className="pd__title" style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsCartOpen(true)}>
          samaan<sup>({cartItems.length})</sup>
        </span>
      </div>
      <div className="pd__content">
        <div className="pd__left" style={{ position: 'relative' }}>
          {product.stock > 0 && product.stock <= 5 && <div className="low-stock-badge">only few left</div>}
          <img src={product.images?.[0] || product.image || '/img/shirt3.png'} alt={product.name} />
        </div>
        <div className="pd__right">
          <h3>shop/{product.name.toLowerCase().replace(/ /g, '_')}</h3>
          <p style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            size &nbsp; 
            {(product.sizes || ['S', 'M', 'L', 'XL']).map(size => (
              <span key={size} onClick={() => setSelectedSize(size)}
                style={{ cursor: 'pointer', color: selectedSize === size ? '#ff0000' : '#888', textDecoration: selectedSize === size ? 'underline' : 'none' }}>
                {size}
              </span>
            ))}
          </p>
          <div className="pd__plus" style={{ cursor: 'pointer' }} onClick={() => addToCart(product, selectedSize)}>+</div>
          <div className="pd__accordion">
            <div className="acc__item"><span>jaankari</span><img src="/img/arrow.png" alt="arrow" /></div>
            <div className="acc__item"><span>size chart</span><img src="/img/arrow.png" alt="arrow" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}