import React from 'react';
import { useAppContext } from '../../context/AppContext';

export default function CartDrawer() {
  const { cartItems, setCartItems, setIsCartOpen, setIsCheckout, setCurrentPage, setSelectedProduct } = useAppContext();
  
  const getPrice = (price) => typeof price === 'string' ? parseInt(price.replace(/\D/g, ''), 10) : (price || 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (getPrice(item.price) * item.qty), 0);

  const updateQty = (id, size, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item._id === id && item.size === size) {
        return { ...item, qty: Math.max(0, item.qty + delta) };
      }
      return item;
    }).filter(item => item.qty > 0)); 
  };

  const closeCart = () => setIsCartOpen(false);
  
  const goToCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('shop'); 
    setSelectedProduct(null);
    setIsCheckout(true);
  };

  return (
    <div className="cart-overlay" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', justifyContent: 'flex-end', overflow: 'hidden' }}>
      <div className="cart-drawer" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(400px, 95%)', backgroundColor: '#050505', borderLeft: '1px solid #ff0000', padding: '2rem', display: 'flex', flexDirection: 'column', color: '#ff0000', fontFamily: 'monospace' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <span style={{ cursor: 'pointer' }} onClick={closeCart}>back</span>
          <span style={{ textDecoration: 'underline' }}>samaan</span>
        </div>
        
        <div className="cart-items" style={{ flex: 1, overflowY: 'auto' }}>
          {cartItems.length === 0 ? <p>Your cart is empty.</p> : cartItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              
              <img src={item.images?.[0] || item.image || '/img/shirt3.png'} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', border: '1px solid #ff0000' }} />

              <div style={{ flex: 1, fontSize: '11px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '80px', opacity: 0.7 }}>ITEM NAME</span><span>{item.name}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '80px', opacity: 0.7 }}>SIZE</span><span>{item.size}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '80px', opacity: 0.7 }}>QTY</span>
                  <span style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ cursor: 'pointer' }} onClick={() => updateQty(item._id || item.id, item.size, 1)}>+</span>
                    <span>{item.qty}</span>
                    <span style={{ cursor: 'pointer' }} onClick={() => updateQty(item._id || item.id, item.size, -1)}>-</span>
                  </span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '80px', opacity: 0.7 }}>PRICE</span><span>₹{(getPrice(item.price) * item.qty).toFixed(2)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="cart-summary" style={{ fontSize: '0.8rem', marginTop: '2rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>SUBTOTAL</span><span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>SHIPPING</span><span>CALCULATED AT NEXT STEP</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #ff0000', paddingTop: '0.5rem' }}>
            <span>TOTAL</span><span>₹{subtotal.toFixed(2)}</span>
          </div>
        </div>

        <button 
          style={{ marginTop: '2rem', background: 'none', border: 'none', color: '#ff0000', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'monospace', fontSize: '1rem' }}
          onClick={cartItems.length > 0 ? goToCheckout : null}
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
}