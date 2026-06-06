import React from 'react';
import { useAppContext } from './context/AppContext';
import CanvasBackground from './components/common/CanvasBackground';
import CartDrawer from './components/common/CartDrawer';
import CheckoutPage from './components/checkout/CheckoutPage';

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import Press from './pages/Press';
import News from './pages/News';
import Media from './pages/Media';
import ProductDetail from './pages/ProductDetail';

export default function App() {
  const { 
    currentPage, navTo, selectedProduct, 
    isCheckout, setIsCheckout, isCartOpen, setIsCartOpen, cartItems 
  } = useAppContext();

  const renderContent = () => {
    if (isCheckout) return <CheckoutPage />;
    if (selectedProduct) return <ProductDetail />;

    switch (currentPage) {
      case 'home': return <Home />;
      case 'about': return <About />;
      case 'shop': return <Shop />;
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
        <nav className="card__nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
          <a href="#" className={currentPage === 'about' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navTo('about'); }}>about</a>
          <a href="#" className={currentPage === 'shop' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navTo('shop'); }}>shop</a>
          <a href="#" className={currentPage === 'press' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navTo('press'); }}>press</a>
          <a href="#" className={currentPage === 'news' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navTo('news'); }}>news</a>
          <a href="#" className={currentPage === 'media' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navTo('media'); }}>contact</a>
          
          <a href="#" className="samaan-link" style={{ color: currentPage == 'home' ? '#000000' : '#ff0000' || isCartOpen ? '#ff0000' : '#000000', textDecoration: 'underline' }} 
             onClick={(e) => { e.preventDefault(); setIsCartOpen(true); }}>
            samaan<sup>({cartItems.length})</sup>
          </a>
        </nav>

        <div className="card__body" id="content">
          <div key={`${currentPage}-${selectedProduct || 'none'}-${isCheckout}`} className="classy-transition">
            {renderContent()}
          </div>
        </div>

        <div className="card__ticker">
          <div className="ticker__track">
            <span className="ticker__item">
              21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz •
            </span>
          </div>
        </div>
        {isCartOpen && <CartDrawer />}
      </div>
    </section>
  );
}