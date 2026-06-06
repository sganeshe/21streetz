import React from 'react';
import { useAppContext } from '../../context/AppContext';

export default function CheckoutPage() {
  const { cartItems, setCartItems, setIsCheckout } = useAppContext();
  
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

  const inputStyle = {
    background: 'transparent', border: '1px solid #ff0000', color: '#ff0000', padding: '10px',
    fontFamily: 'monospace', fontSize: '11px', outline: 'none', width: '100%', boxSizing: 'border-box', height: '38px'
  };

  const labelStyle = { display: 'block', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase' };
  const groupStyle = { marginBottom: '1.5rem' };
  const headerStyle = { fontSize: '13px', marginBottom: '1.5rem', fontWeight: 'normal' };

  return (
    <div className="checkout-page" style={{ display: 'flex', flexWrap: 'wrap', gap: '5rem', color: '#ff0000', fontFamily: 'monospace', width: '100%', height: '100%', overflowY: 'auto', padding: '2rem 1rem', boxSizing: 'border-box' }}>
      
      {/* Left Column: Form */}
      <div style={{ flex: '1.3', minWidth: '300px' }}>
        <span onClick={() => setIsCheckout(false)} style={{ cursor: 'pointer', textDecoration: 'underline', marginBottom: '2rem', display: 'block' }}>back to shop</span>
        <h3 style={headerStyle}>CONTACT INFORMATION</h3>
        
        <div style={groupStyle}><label style={labelStyle}>EMAIL ADRESS</label><input type="email" style={inputStyle} /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-0.8rem', marginBottom: '2.5rem' }}>
          <input type="checkbox" id="subscribe" style={{ accentColor: '#ff0000', cursor: 'pointer', width: '12px', height: '12px' }} />
          <label htmlFor="subscribe" style={{ fontSize: '9px', cursor: 'pointer' }}>SUBSCRIBE TO UPDATES AND NOTIFICATIONS</label>
        </div>

        <h3 style={headerStyle}>SHIPPING ADRESS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', ...groupStyle }}>
          <div><label style={labelStyle}>FIRST NAME</label><input type="text" style={inputStyle} /></div>
          <div><label style={labelStyle}>LAST NAME</label><input type="text" style={inputStyle} /></div>
        </div>
        <div style={groupStyle}><label style={labelStyle}>ADRESS</label><input type="text" style={inputStyle} /></div>
        <div style={groupStyle}><label style={labelStyle}>APARTMENT, SUITE, ETC. (OPTIONAL)</label><input type="text" style={inputStyle} /></div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', ...groupStyle }}>
          <div><label style={labelStyle}>CITY</label><input type="text" style={inputStyle} /></div>
          <div><label style={labelStyle}>COUNTRY</label><input type="text" style={inputStyle} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', ...groupStyle }}>
          <div><label style={labelStyle}>STATE / PROVINCE</label><input type="text" style={inputStyle} /></div>
          <div><label style={labelStyle}>ZIP / POSTAL CODE</label><input type="text" style={inputStyle} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', ...groupStyle }}>
          <div><label style={labelStyle}>PHONE NUMBER</label><input type="tel" style={inputStyle} /></div>
        </div>
        <button style={{ ...inputStyle, marginTop: '1rem', cursor: 'pointer', background: '#ff0000', color: '#000', border: 'none' }}>CONTINUE TO PAYMENT</button>
      </div>

      {/* Right Column: Summary */}
      <div style={{ flex: '1', fontSize: '11px', minWidth: '300px', marginTop: '3.3rem' }}>
        <h3 style={headerStyle}>ORDER SUMMARY</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          {cartItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem' }}>
              
              <img src={item.images?.[0] || item.image || '/img/shirt3.png'} alt={item.name} style={{ width: '65px', height: '65px', objectFit: 'cover', border: '1px solid #ff0000' }} />
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '70px', opacity: 0.7 }}>ITEM NAME</span><span>{item.name}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '70px', opacity: 0.7 }}>SIZE</span><span>{item.size}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '70px', opacity: 0.7 }}>QTY</span>
                  <span style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ cursor: 'pointer' }} onClick={() => updateQty(item._id || item.id, item.size, 1)}>+</span>
                    <span>{item.qty}</span>
                    <span style={{ cursor: 'pointer' }} onClick={() => updateQty(item._id || item.id, item.size, -1)}>-</span>
                  </span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '70px', opacity: 0.7 }}>PRICE</span><span>₹{(getPrice(item.price) * item.qty).toFixed(2)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SUBTOTAL</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SHIPPING</span><span>CALCULATED AT NEXT STEP</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>TAXES</span><span>₹0.00</span></div><br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>TOTAL</span><span>₹{subtotal.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}