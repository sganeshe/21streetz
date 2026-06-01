import React, { useState } from 'react';
import CanvasBackground from './CanvasBackground';
import { infoData, shopData, pressData, newsData } from './data';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCheckout, setIsCheckout] = useState(false);

  const navTo = (page) => (e) => {
    e.preventDefault();
    setCurrentPage(page);
    setSelectedProduct(null); 
    setIsCheckout(false);
  };

  const addToCart = (product, selectedSize) => {
    const existingItem = cartItems.find(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existingItem) {
      setCartItems(cartItems.map((item) =>
        item.id === product.id && item.size === selectedSize
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, size: selectedSize, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const renderContent = () => {
    if (isCheckout) {
      return <CheckoutPage cartItems={cartItems} setCartItems={setCartItems} onBack={() => setIsCheckout(false)} />;
    }

    if (selectedProduct) {
      return (
        <ProductDetail 
          id={selectedProduct} 
          onBack={() => setSelectedProduct(null)} 
          addToCart={addToCart}
          cartItems={cartItems}
          setIsCartOpen={setIsCartOpen}
        />
      );
    }

    switch (currentPage) {
      case 'home': return <Home />;
      case 'about': return <About />;
      case 'shop': return <Shop onProductClick={setSelectedProduct} addToCart={addToCart} />;
      case 'press': return <Press />;
      case 'news': return <News />;
      case 'media': return <Media />;
      default: return <Home />;
    }
  };

  return (
    <section className="scene">
      <CanvasBackground currentPage={currentPage} selectedProduct={selectedProduct} />
      
      <div className="scene__dots"></div>

      <div className={`scene__card ${currentPage !== 'home' ? 'is-inner' : ''}`}>
        
        <nav className="card__nav">
          <a href="#" className={currentPage === 'about' ? 'active' : ''} onClick={navTo('about')}>about</a>
          <a href="#" className={currentPage === 'shop' ? 'active' : ''} onClick={navTo('shop')}>shop</a>
          <a href="#" className={currentPage === 'press' ? 'active' : ''} onClick={navTo('press')}>press</a>
          <a href="#" className={currentPage === 'news' ? 'active' : ''} onClick={navTo('news')}>news</a>
          <a href="#" className={currentPage === 'media' ? 'active' : ''} onClick={navTo('media')}>contact</a>
        </nav>

        <div className="card__body" id="content">
          <div key={`${currentPage}-${selectedProduct || 'none'}-${isCheckout}`} className="classy-transition">
            {renderContent()}
          </div>
        </div>

        <div className="card__ticker">
          <div className="ticker__track">
            <span className="ticker__item">
              21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz •
            </span>
          </div>
        </div>

      </div>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <CartDrawer 
          cartItems={cartItems} 
          setCartItems={setCartItems} 
          closeCart={() => setIsCartOpen(false)} 
          goToCheckout={() => {
            setIsCartOpen(false);
            setCurrentPage('shop');
            setSelectedProduct(null);
            setIsCheckout(true);
          }}
        />
      )}
    </section>
  );
}

/* ============================================================
   PAGE COMPONENTS
============================================================ */

function Home() {
  return (
    <div className="home">
      <div className="textured-logo" aria-label="21streetz Logo" role="img"></div>
    </div>
  );
}

function About() {
  return (
    <div className="about">
      <p>
        {infoData.about.description}<br /><br />
        <span>members</span><br />
        {infoData.about.members.join(', ')}
      </p>
    </div>
  );
}

function Shop({ onProductClick, addToCart }) {
  return (
    <div className="shop">
      <div className="products">
        {shopData.map(product => {
          const isLowStock = product.stock > 0 && product.stock <= 5;

          return (
            <div className="product" key={product.id} onClick={() => onProductClick(product.id)}>
              <div className="product__img" style={{ position: 'relative' }}>
                
                {isLowStock && (
                  <div className="low-stock-badge">
                    only few left
                  </div>
                )}

                <img src={product.image} alt={product.name} />
              </div>
              <div className="product__info">
                <div className="left">
                  <p>{product.name}</p>
                  <span>{product.price}</span>
                </div>
                <div 
                  className="right" 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, 'M');
                  }}
                >
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

function Press() {
  return (
    <div className="press">
      <div className="press-products">
        {pressData.map(item => (
          <div className="press-product" key={item.id}>
            <div 
              className="press-product__img" 
              style={{ backgroundImage: `url(${item.image})` }}
            ></div>
            <div className="press-product__info">
              <div className="press-left">
                <p>{item.title}</p>
                <span>{item.source}</span>
              </div>
              <div className="press-right">
                <a href={item.link}><img src="/img/cross_arrow.png" alt="link" /></a>
              </div>
            </div>
            <div className="press-product__line"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function News() {
  return (
    <div className="news">
      <h2>NEWS</h2>
      {newsData.map(news => (
        <p key={news.id}>{news.headline}</p>
      ))}
    </div>
  );
}

function Media() {
  return (
    <div className="media">
      <p>
        {infoData.contact.message}<br /><br />
        {infoData.contact.website}<br />
        {infoData.contact.email}
      </p>
    </div>
  );
}

function ProductDetail({ id, onBack, addToCart, cartItems, setIsCartOpen }) {
  const product = shopData.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState('M');

  if (!product) return <div>Product not found</div>;

  return (
    <div className="productDetail">
      <div className="pd__top">
        <span className="back" style={{ cursor: 'pointer' }} onClick={onBack}>back</span>
        <span className="pd__title" style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsCartOpen(true)}>
          samaan ({cartItems.length})
        </span>
      </div>
      <div className="pd__content">
        <div className="pd__left" style={{ position: 'relative' }}>
          {product.stock > 0 && product.stock <= 5 && (
             <div className="low-stock-badge">only few left</div>
          )}
          <img src={product.image} alt={product.name} />
        </div>
        <div className="pd__right">
          <h3>shop/{product.name.toLowerCase().replace(' ', '_')}</h3>
          
          {/* Size Selection Logic */}
          <p style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            size &nbsp; 
            {(product.sizes || ['S', 'M', 'L', 'XL']).map(size => (
              <span 
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{ 
                  cursor: 'pointer', 
                  color: selectedSize === size ? '#000' : '#444',
                  textDecoration: selectedSize === size ? 'underline' : 'none'
                }}
              >
                {size}
              </span>
            ))}
          </p>
          
          {/* Add to Cart Button */}
          <div className="pd__plus" style={{ cursor: 'pointer' }} onClick={() => addToCart(product, selectedSize)}>
            +
          </div>
          
          <div className="pd__accordion">
            <div className="acc__item">
              <span>jaankari</span>
              <img src="/img/arrow.png" alt="arrow" />
            </div>
            <div className="acc__item">
              <span>size chart</span>
              <img src="/img/arrow.png" alt="arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   NEW CART & CHECKOUT COMPONENTS
============================================================ */

function CartDrawer({ cartItems, setCartItems, closeCart, goToCheckout }) {
  
  const getPrice = (priceStr) => parseInt(priceStr.replace(/\D/g, ''), 10) || 0;

  const subtotal = cartItems.reduce((acc, item) => acc + (getPrice(item.price) * item.qty), 0);

  const updateQty = (id, size, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.size === size) {
        return { ...item, qty: Math.max(0, item.qty + delta) };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  return (
    <div className="cart-overlay" style={{ position: 'fixed', top: 186, left: 272, right: 272, bottom: 174, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', justifyContent: 'flex-end' }}>
      <div className="cart-drawer" style={{ width: '350px', height: '52.6%', position: 'fixed', top: 186, left: '642px', right: '500px', bottom: 174, backgroundColor: '#050505', padding: '2rem', display: 'flex', flexDirection: 'column', color: '#ff0000', fontFamily: 'monospace' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <span className="pd__title" style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => closeCart()}>
          <img src="/img/cross_arrow.png" alt="close" />
        </span>
        </div>
        
        <div className="cart-items" style={{ flex: 1, overflowY: 'auto' }}>
          {cartItems.length === 0 ? <p>Your cart is empty.</p> : cartItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', border: '1px solid #ff0000' }} />
              <div style={{ flex: 1, fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>ITEM NAME</span>
                  <span style={{ textAlign: 'right', textTransform: 'uppercase' }}>{item.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>SIZE</span>
                  <span style={{ textAlign: 'right', textTransform: 'uppercase' }}>{item.size}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span>QTY</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ cursor: 'pointer', }} onClick={() => updateQty(item.id, item.size, 1)}>+</span>
                    <span>{item.qty}</span>
                    <span style={{ cursor: 'pointer' }} onClick={() => updateQty(item.id, item.size, -1)}>-</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', textAlign: 'right', marginRight: '10px' }}>
                ₹{(getPrice(item.price) * item.qty).toFixed(2)}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>TAXES</span><span>₹0.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #ff0000', paddingTop: '0.5rem' }}>
            <span>TAXES</span><span>₹{subtotal.toFixed(2)}</span>
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

function CheckoutPage({ cartItems, setCartItems }) {
  const getPrice = (priceStr) => parseInt(priceStr.replace(/\D/g, ''), 10) || 0;
  const subtotal = cartItems.reduce((acc, item) => acc + (getPrice(item.price) * item.qty), 0);

  const updateQty = (id, size, delta) => {
    if (!setCartItems) return; 
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.size === size) {
        return { ...item, qty: Math.max(0, item.qty + delta) };
      }
      return item;
    }).filter(item => item.qty > 0)); 
  };

  const inputStyle = {
    background: 'transparent',
    border: '1px solid #ff0000',
    color: '#ff0000',
    padding: '10px',
    fontFamily: 'monospace',
    fontSize: '11px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    height: '38px'
  };

  const labelStyle = { 
    display: 'block', 
    fontSize: '11px', 
    marginBottom: '8px',
    textTransform: 'uppercase'
  };
  
  const groupStyle = { marginBottom: '1.5rem' };
  const headerStyle = { fontSize: '13px', marginBottom: '1.5rem', fontWeight: 'normal' };

  return (
    <div className="checkout-page" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', color: '#ff0000', fontFamily: 'monospace', width: '100%', height: '100%', overflowY: 'auto', padding: '0rem 1rem',boxSizing: 'border-box', }}>
      
      {/* LEFT COLUMN: Form */}
      <div style={{ flex: '1.5' }}>
        <h1 style={{ marginBottom: '1.5rem', textAlign: 'left', fontSize: '1.2rem', fontWeight: 'bold',}}>CONTACT INFORMATION</h1>
        
        <div style={groupStyle}>
          <h3 style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '0.75rem',}}>EMAIL ADDRESS</h3>
          <input type="email" style={inputStyle} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-0.8rem', marginBottom: '0.8rem' }}>
          <input type="checkbox" id="subscribe" style={{ accentColor: '#ff0000', cursor: 'pointer', width: '12px', height: '12px' }} />
          <label htmlFor="subscribe" style={{ fontSize: '9px', cursor: 'pointer' }}>SUBSCRIBE TO UPDATES AND NOTIFICATIONS</label>
        </div>

        <h3 style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '0.75rem',}}>SHIPPING ADDRESS</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', ...groupStyle }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '0.65rem',}}>FIRST NAME</h3>
            <input type="text" style={inputStyle} />
          </div>
          <div>
            <h3 style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '0.65rem',}}>LAST NAME</h3>
            <input type="text" style={inputStyle} />
          </div>
        </div>
        
        <div style={groupStyle}>
          <h3 style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '0.65rem',}}>ADDRESS</h3>
          <input type="text" style={inputStyle} />
        </div>
        
        <div style={groupStyle}>
          <h3 style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '0.65rem',}}>APARTMENT, SUITE, UNIT, ETC. (OPTIONAL)</h3>
          <input type="text" style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', ...groupStyle }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '0.65rem',}}>CITY</h3>
            <input type="text" style={inputStyle} />
          </div>
          <div>
            <h3 style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '0.65rem',}}>COUNTRY</h3>
            <input type="text" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', ...groupStyle }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '0.65rem',}}>STATE / PROVINCE</h3>
            <input type="text" style={inputStyle} />
          </div>
          <div>
            <h3 style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '0.65rem',}}>ZIP / POSTAL CODE</h3>
            <input type="text" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', ...groupStyle }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '0.65rem',}}>PHONE NUMBER</h3>
            <input type="tel" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Order Summary */}
      <div style={{ flex: '1', fontSize: '11px' }}>
        <h1 style={{ marginBottom: '1.5rem', textAlign: 'left', fontSize: '1.2rem', fontWeight: 'bold',}}>ORDER SUMMARY</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
          {cartItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem' }}>
              <img src={item.image} alt={item.name} style={{ width: '65px', height: '65px', objectFit: 'cover', border: '1px solid #ff0000' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2px 0' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.name}</span>
                  <span>₹{(getPrice(item.price) * item.qty).toFixed(2)}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>SIZE</span>
                  <span>{item.size}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>QTY</span>
                  <span style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ cursor: 'pointer' }} onClick={() => updateQty(item.id, item.size, 1)}>+</span>
                    <span>{item.qty}</span>
                    <span style={{ cursor: 'pointer' }} onClick={() => updateQty(item.id, item.size, -1)}>-</span>
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>SUBTOTAL</span><span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>SHIPPING</span><span>CALCULATED AT NEXT STEP</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>TAXES</span><span>₹0.00</span>
          </div>
          <br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>TOTAL</span><span>₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

    </div>
  );
}