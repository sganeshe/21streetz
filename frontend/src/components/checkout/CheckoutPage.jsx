import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { couponService } from '../../services/coupon.service';

export default function CheckoutPage() {
  const { setIsCheckout } = useAppContext();
  const { cartItems, cartTotal, updateQuantity } = useCart();
  const { isAuthenticated, login, register } = useAuth();

  // --- UI STATES ---
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', phone:'', password: '' });
  const { navTo } = useAppContext();
  
  const [shippingForm, setShippingForm] = useState({
    firstName: '', lastName: '', address: '', apartment: '',
    city: '', country: '', state: '', postalCode: '', phone: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // --- STYLES ---
  const inputStyle = {
    background: 'transparent', border: '1px solid #ff0000', color: '#ff0000', padding: '10px',
    fontFamily: 'monospace', fontSize: '11px', outline: 'none', width: '100%', boxSizing: 'border-box', height: '38px'
  };
  const labelStyle = { display: 'block', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase' };
  const groupStyle = { marginBottom: '1.5rem' };
  const headerStyle = { fontSize: '13px', marginBottom: '1.5rem', fontWeight: 'normal' };
  
  const pageRef = useRef(null);
  
  React.useEffect(() => {
      pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

  // --- SHARED DISCOUNT CALCULATION ---
  const calcDiscount = (coupon, subTotal) => {
    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      let rawDiscount = (subTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(rawDiscount, coupon.maxDiscountAmount);
      } else {
        discountAmount = rawDiscount;
      }
    } else if (coupon.discountType === "FIXED") {
      discountAmount = coupon.discountValue;
    }
    return discountAmount;
  };

  useEffect(() => {
    if (cartItems.length === 0 || cartTotal === 0) {
      setDiscountAmount(0);
      setAppliedCoupon(null);
      setCouponCode('');
      return;
    }
    if (!appliedCoupon) return;
    setDiscountAmount(calcDiscount(appliedCoupon, cartTotal));
  }, [cartTotal, cartItems.length, appliedCoupon]);

  // --- HANDLERS ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await login(authForm.email, authForm.password);
      } else {
        await register(authForm.name, authForm.email, authForm.password, authForm.phone);
      }
    } catch (err) {
      alert("Authentication failed. Please check your credentials.");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const response = await couponService.validate(couponCode);
      const coupon = response.coupon;
      const calculatedDiscount = calcDiscount(coupon, cartTotal);
      setAppliedCoupon(coupon); 
      setDiscountAmount(calculatedDiscount);
      alert(`Coupon applied! You saved ₹${calculatedDiscount.toFixed(2)}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid or expired coupon";
      alert(errorMsg);
      setDiscountAmount(0);
      setAppliedCoupon(null);
      setCouponCode(''); 
    }
  };

  const handlePaymentSubmit = () => {
    const orderPayload = {
      orderItems: cartItems.map(item => ({ qty: item.qty, product: item.product, size: item.size })),
      shippingAddress: {
        address: `${shippingForm.address} ${shippingForm.apartment}`,
        city: shippingForm.city,
        postalCode: shippingForm.postalCode,
        country: shippingForm.country
      },
      paymentMethod: "Razorpay",
      couponCode: couponCode.toUpperCase()
    };
    console.log("READY FOR PAYMENT GATEWAY:", orderPayload);
  };

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return (
    <div className="checkout-page checkout-layout" ref={pageRef} style={{ color: '#ff0000', fontFamily: 'monospace' }}>
      
      {/* LEFT COLUMN: ORDER SUMMARY */}
      <div className="checkout-col-left" style={{ fontSize: '11px' }}>
        <h3 style={{...headerStyle, marginBottom: "1rem", textAlign: "left", fontSize: "20px", textTransform: "uppercase"}}>ORDER SUMMARY</h3>

        {cartItems.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', height: '150px', border: '1px solid rgba(255,0,0,0.3)', fontSize: '18px', letterSpacing: '2px' }}>
            <span style={{ opacity: 0.6 }}>NO ITEM IN THE CART</span>
            <span onClick={() => navTo("shop")} style={{ cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', opacity: 0.8 }}>[ GO TO SHOP TO ADD ITEMS ]</span>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              {cartItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '1rem' }}>
                  <img src={item.image || '/img/shirt3.png'} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid #ff0000' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
                    <div style={{ display: 'flex' }}><span style={{ textAlign: 'right', paddingRight: '1rem', fontSize: '18px', width: '70px', opacity: 1 }}>ITEM</span><span style={{textAlign: 'left', fontSize: '18px', opacity: 1}}>{item.name}</span></div>
                    <div style={{ display: 'flex' }}><span style={{ textAlign: 'right', paddingRight: '1rem', fontSize: '18px', width: '70px', opacity: 1 }}>SIZE</span><span style={{textAlign: 'left', fontSize: '18px', opacity: 1}}>{item.size}</span></div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ textAlign: 'right', paddingRight: '1rem', fontSize: '18px', width: '70px', opacity: 1 }}>QTY</span>
                      <span style={{ display: 'flex', gap: '16px' }}>
                        <span style={{ cursor: 'pointer', textAlign: 'left', fontSize: '18px', opacity: 1 }} onClick={() => updateQuantity(item.product, item.size, item.qty - 1)}>-</span>
                        <span style={{ textAlign: 'left', fontSize: '18px', opacity: 1 }}>{item.qty}</span>
                        <span style={{ cursor: 'pointer', textAlign: 'left', fontSize: '18px', opacity: 1 }} onClick={() => updateQuantity(item.product, item.size, item.qty + 1)}>+</span>
                      </span>
                    </div>
                    <div style={{ display: 'flex' }}><span style={{ textAlign: 'right', paddingRight: '1rem', fontSize: '18px', width: '70px', opacity: 1 }}>PRICE</span><span style={{ textAlign: 'left', fontSize: '18px', width: '70px', opacity: 1 }}>₹{(item.price * item.qty).toFixed(2)}</span></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
              <input 
                type="text" 
                placeholder="PROMO CODE" 
                style={{ ...inputStyle, fontSize: '15px', width: '100%', textTransform: 'uppercase' }} 
                value={couponCode} 
                onChange={e => setCouponCode(e.target.value)} 
              />
              <button onClick={handleApplyCoupon} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>APPLY</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '18px', textAlign: 'left', fontWeight: 'bold' }}>SUBTOTAL</span><span style={{fontSize: '18px', textAlign: 'right', fontWeight: 'bold'}}>₹ {cartTotal.toFixed(2)}</span></div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0f0' }}><span style={{fontSize: '18px', textAlign: 'left', fontWeight: 'bold'}}>DISCOUNT</span><span style={{fontSize: '18px', textAlign: 'right', fontWeight: 'bold'}}>- ₹ {discountAmount.toFixed(2)}</span></div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{fontSize: '18px', textAlign: 'left', fontWeight: 'bold'}}>SHIPPING</span><span style={{fontSize: '18px', textAlign: 'right', fontWeight: 'bold'}}>CALCULATED AT NEXT STEP</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #ff0000', paddingTop: '1rem' }}>
                <span style={{ fontSize: '18px', textAlign: 'left', fontWeight: 'bold'}}>TOTAL</span><span style={{ fontSize: '18px', textAlign: 'right', fontWeight: 'bold' }}>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT COLUMN: SHIPPING DETAILS */}
      <div className="checkout-col-right">
        {!isAuthenticated ? (
          <form onSubmit={handleAuthSubmit} style={{ paddingBottom: '2rem' }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", borderBottom: "2px solid rgba(255,0,0,0.3)", paddingBottom: "0.5rem" }}>
              <h3 style={{ fontSize: "25px", fontWeight: "bold", textTransform: "lowercase", margin: 0 }}>{authMode === 'login' ? 'LOGIN TO CONTINUE' : 'CREATE ACCOUNT'}</h3>
              <span onClick={() => navTo("shop")} style={{ cursor: "pointer", fontSize: "18px", opacity: 0.8 }}>[ back_to_shop ]</span>
            </div>
            
            {authMode === 'register' && (
              <div style={groupStyle}><label style={{...labelStyle, textAlign: "left", fontSize: "15px", textTransform: "uppercase"}}>FULL NAME</label>
              <input type="text" style={{...inputStyle, fontSize: '16px'}} required value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} /></div>
            )}
            
            <div style={groupStyle}><label style={{...labelStyle, textAlign: "left", fontSize: "15px", textTransform: "uppercase"}}>EMAIL ADDRESS</label>
            <input type="email" style={{...inputStyle, fontSize: '16px'}} required value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} /></div>

            {authMode === 'register' && (
              <div style={groupStyle}><label style={{...labelStyle, textAlign: "left", fontSize: "15px", textTransform: "uppercase"}}>PHONE NUMBER</label>
              <input type="text" style={{...inputStyle, fontSize: '16px'}} required minLength={10} maxLength={15} value={authForm.phone} onChange={e => setAuthForm({...authForm, phone: e.target.value})} /></div>
            )}
            
            <div style={groupStyle}><label style={{...labelStyle, textAlign: "left", fontSize: "15px", textTransform: "uppercase"}}>PASSWORD</label>
            <input type="password" style={{...inputStyle, fontSize: '16px'}} required value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} /></div>
            
            <button type="submit" style={{ ...inputStyle, fontSize: '15px', cursor: 'pointer', background: '#ff0000', color: '#000', border: 'none', fontWeight: 'bold' }}>
              {authMode === 'login' ? 'EXECUTE_LOGIN' : 'INITIALIZE_ACCOUNT'}
            </button>
            
            <p style={{ marginTop: '1rem', fontSize: '16px', cursor: 'pointer', textAlign: 'center' }}>
              <span style={{ opacity: 0.7 }}>{authMode === 'login' ? 'Don\'t have an account? ' : 'Already have an account? '}</span>
              <span onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                {authMode === 'login' ? 'Sign up here' : 'Login here'}
              </span>
            </p>
          </form>

        ) : (
          <div style={{ paddingBottom: '2rem' }}>
            <h3 style={{...headerStyle, marginBottom: "1rem", textAlign: "left", fontSize: "20px", textTransform: "uppercase"}}>SHIPPING ADDRESS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', ...groupStyle }}>
              <div><label style={{...labelStyle, textAlign: "left", fontSize: "15px", textTransform: "uppercase"}}>FIRST NAME</label><input type="text" style={{...inputStyle, fontSize: "16px"}} onChange={e => setShippingForm({...shippingForm, firstName: e.target.value})} /></div>
              <div><label style={{...labelStyle, textAlign: "left", fontSize: "15px", textTransform: "uppercase"}}>LAST NAME</label><input type="text" style={{...inputStyle, fontSize: "16px"}} onChange={e => setShippingForm({...shippingForm, lastName: e.target.value})} /></div>
            </div>
            <div style={groupStyle}><label style={{...labelStyle, textAlign: "left", fontSize: "15px", textTransform: "uppercase"}}>ADDRESS</label><input type="text" style={{...inputStyle, fontSize: "16px"}} onChange={e => setShippingForm({...shippingForm, address: e.target.value})} /></div>
            <div style={groupStyle}><label style={{...labelStyle, textAlign: "left", fontSize: "15px", textTransform: "uppercase"}}>APARTMENT, SUITE, ETC.</label><input type="text" style={{...inputStyle, fontSize: "16px"}} onChange={e => setShippingForm({...shippingForm, apartment: e.target.value})} /></div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', ...groupStyle }}>
              <div><label style={{...labelStyle, textAlign: "left", fontSize: "15px", textTransform: "uppercase"}}>CITY</label><input type="text" style={{...inputStyle, fontSize: "16px"}} onChange={e => setShippingForm({...shippingForm, city: e.target.value})} /></div>
              <div><label style={{...labelStyle, textAlign: "left", fontSize: "15px", textTransform: "uppercase"}}>COUNTRY</label><input type="text" style={{...inputStyle, fontSize: "16px"}} onChange={e => setShippingForm({...shippingForm, country: e.target.value})} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', ...groupStyle }}>
              <div><label style={{...labelStyle, textAlign: "left", fontSize: "15px", textTransform: "uppercase"}}>STATE / PROVINCE</label><input type="text" style={{...inputStyle, fontSize: "16px"}} onChange={e => setShippingForm({...shippingForm, state: e.target.value})} /></div>
              <div><label style={{...labelStyle, textAlign: "left", fontSize: "15px", textTransform: "uppercase"}}>ZIP / POSTAL CODE</label><input type="text" style={{...inputStyle, fontSize: "16px"}} onChange={e => setShippingForm({...shippingForm, postalCode: e.target.value})} /></div>
            </div>
            
            <button
              onClick={handlePaymentSubmit}
              disabled={cartItems.length === 0}
              style={{
                ...inputStyle,
                fontSize: '15px',
                marginTop: '1rem',
                border: 'none',
                fontWeight: 'bold',
                ...(cartItems.length === 0
                  ? { background: '#555', color: '#999', cursor: 'not-allowed', opacity: 0.6 }
                  : { background: '#ff0000', color: '#000', cursor: 'pointer' })
              }}
            >CONTINUE TO PAYMENT</button>
          </div>
        )}
      </div>
    </div>
  );
};