import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CheckoutPage() {
  const { setIsCheckout } = useAppContext();
  const { cartItems, cartTotal, updateQuantity } = useCart();
  const { isAuthenticated, login, register } = useAuth();

  // --- UI STATES ---
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  
  const [shippingForm, setShippingForm] = useState({
    firstName: '', lastName: '', address: '', apartment: '',
    city: '', country: '', state: '', postalCode: '', phone: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // --- STYLES ---
  const inputStyle = {
    background: 'transparent', border: '1px solid #ff0000', color: '#ff0000', padding: '10px',
    fontFamily: 'monospace', fontSize: '11px', outline: 'none', width: '100%', boxSizing: 'border-box', height: '38px'
  };
  const labelStyle = { display: 'block', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase' };
  const groupStyle = { marginBottom: '1.5rem' };
  const headerStyle = { fontSize: '13px', marginBottom: '1.5rem', fontWeight: 'normal' };

  // --- HANDLERS ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await login(authForm.email, authForm.password);
      } else {
        await register(authForm.name, authForm.email, authForm.password);
      }
    } catch (err) {
      alert("Authentication failed. Please check your credentials.");
    }
  };

  const handleApplyCoupon = () => {
    // In a real scenario, you'd hit a /api/coupons/validate endpoint here.
    // For now, let's mock a 10% discount if they type "21STREETZ"
    if (couponCode.toUpperCase() === '21STREETZ') {
      setDiscountAmount(cartTotal * 0.10);
    } else {
      alert("Invalid or expired coupon");
      setDiscountAmount(0);
    }
  };

  const handlePaymentSubmit = () => {
    // This is where you will send the final payload to your backend/payment gateway!
    const orderPayload = {
      orderItems: cartItems.map(item => ({ qty: item.qty, product: item.product, size: item.size })),
      shippingAddress: {
        address: `${shippingForm.address} ${shippingForm.apartment}`,
        city: shippingForm.city,
        postalCode: shippingForm.postalCode,
        country: shippingForm.country
      },
      paymentMethod: "Razorpay", // or Stripe
      couponCode: couponCode.toUpperCase()
    };
    console.log("READY FOR PAYMENT GATEWAY:", orderPayload);
  };

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return (
    <div className="checkout-page" style={{ display: 'flex', flexWrap: 'wrap', gap: '5rem', color: '#ff0000', fontFamily: 'monospace', width: '100%', height: '100%', overflowY: 'auto', padding: '2rem 1rem', boxSizing: 'border-box' }}>
      
      {/* LEFT COLUMN: AUTH OR SHIPPING */}
      <div style={{ flex: '1.3', minWidth: '300px' }}>
        <span onClick={() => setIsCheckout(false)} style={{ cursor: 'pointer', textDecoration: 'underline', marginBottom: '2rem', display: 'block' }}>back to shop</span>
        
        {!isAuthenticated ? (
          // --- LOGIN / SIGNUP FORM ---
          <form onSubmit={handleAuthSubmit}>
            <h3 style={headerStyle}>{authMode === 'login' ? 'LOGIN TO CONTINUE' : 'CREATE ACCOUNT'}</h3>
            
            {authMode === 'register' && (
              <div style={groupStyle}><label style={labelStyle}>FULL NAME</label>
              <input type="text" style={inputStyle} required value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} /></div>
            )}
            
            <div style={groupStyle}><label style={labelStyle}>EMAIL ADDRESS</label>
            <input type="email" style={inputStyle} required value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} /></div>
            
            <div style={groupStyle}><label style={labelStyle}>PASSWORD</label>
            <input type="password" style={inputStyle} required value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} /></div>
            
            <button type="submit" style={{ ...inputStyle, cursor: 'pointer', background: '#ff0000', color: '#000', border: 'none' }}>
              {authMode === 'login' ? 'LOGIN' : 'SIGN UP'}
            </button>
            
            <p style={{ marginTop: '1rem', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }} 
               onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
              {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
            </p>
          </form>

        ) : (

          // --- SHIPPING FORM ---
          <div>
            <h3 style={headerStyle}>SHIPPING ADDRESS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', ...groupStyle }}>
              <div><label style={labelStyle}>FIRST NAME</label><input type="text" style={inputStyle} onChange={e => setShippingForm({...shippingForm, firstName: e.target.value})} /></div>
              <div><label style={labelStyle}>LAST NAME</label><input type="text" style={inputStyle} onChange={e => setShippingForm({...shippingForm, lastName: e.target.value})} /></div>
            </div>
            <div style={groupStyle}><label style={labelStyle}>ADDRESS</label><input type="text" style={inputStyle} onChange={e => setShippingForm({...shippingForm, address: e.target.value})} /></div>
            <div style={groupStyle}><label style={labelStyle}>APARTMENT, SUITE, ETC.</label><input type="text" style={inputStyle} onChange={e => setShippingForm({...shippingForm, apartment: e.target.value})} /></div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', ...groupStyle }}>
              <div><label style={labelStyle}>CITY</label><input type="text" style={inputStyle} onChange={e => setShippingForm({...shippingForm, city: e.target.value})} /></div>
              <div><label style={labelStyle}>COUNTRY</label><input type="text" style={inputStyle} onChange={e => setShippingForm({...shippingForm, country: e.target.value})} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', ...groupStyle }}>
              <div><label style={labelStyle}>STATE / PROVINCE</label><input type="text" style={inputStyle} onChange={e => setShippingForm({...shippingForm, state: e.target.value})} /></div>
              <div><label style={labelStyle}>ZIP / POSTAL CODE</label><input type="text" style={inputStyle} onChange={e => setShippingForm({...shippingForm, postalCode: e.target.value})} /></div>
            </div>
            
            <button onClick={handlePaymentSubmit} style={{ ...inputStyle, marginTop: '1rem', cursor: 'pointer', background: '#ff0000', color: '#000', border: 'none' }}>CONTINUE TO PAYMENT</button>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: ORDER SUMMARY */}
      <div style={{ flex: '1', fontSize: '11px', minWidth: '300px', marginTop: '3.3rem' }}>
        <h3 style={headerStyle}>ORDER SUMMARY</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          {cartItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem' }}>
              <img src={item.image || '/img/shirt3.png'} alt={item.name} style={{ width: '65px', height: '65px', objectFit: 'cover', border: '1px solid #ff0000' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
                <div style={{ display: 'flex' }}><span style={{ width: '70px', opacity: 0.7 }}>ITEM</span><span>{item.name}</span></div>
                <div style={{ display: 'flex' }}><span style={{ width: '70px', opacity: 0.7 }}>SIZE</span><span>{item.size}</span></div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '70px', opacity: 0.7 }}>QTY</span>
                  <span style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ cursor: 'pointer' }} onClick={() => updateQuantity(item.product, item.size, item.qty + 1)}>+</span>
                    <span>{item.qty}</span>
                    <span style={{ cursor: 'pointer' }} onClick={() => updateQuantity(item.product, item.size, item.qty - 1)}>-</span>
                  </span>
                </div>
                <div style={{ display: 'flex' }}><span style={{ width: '70px', opacity: 0.7 }}>PRICE</span><span>₹{(item.price * item.qty).toFixed(2)}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* COUPON SECTION */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
          <input 
            type="text" 
            placeholder="PROMO CODE" 
            style={{ ...inputStyle, textTransform: 'uppercase' }} 
            value={couponCode} 
            onChange={e => setCouponCode(e.target.value)} 
          />
          <button onClick={handleApplyCoupon} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>APPLY</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SUBTOTAL</span><span>₹{cartTotal.toFixed(2)}</span></div>
          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0f0' }}><span>DISCOUNT</span><span>-₹{discountAmount.toFixed(2)}</span></div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SHIPPING</span><span>CALCULATED AT NEXT STEP</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #ff0000', paddingTop: '1rem' }}>
            <span style={{ fontSize: '14px' }}>TOTAL</span><span style={{ fontSize: '14px' }}>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}