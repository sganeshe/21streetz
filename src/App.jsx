import { useState } from 'react';
import CanvasBackground from './CanvasBackground';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navTo = (page) => (e) => {
    e.preventDefault();
    setCurrentPage(page);
    setSelectedProduct(null); 
  };

  const renderContent = () => {
    if (selectedProduct) {
      return (
        <ProductDetail 
          id={selectedProduct} 
          onBack={() => setSelectedProduct(null)} 
        />
      );
    }

    switch (currentPage) {
      case 'home': return <Home />;
      case 'about': return <About />;
      case 'shop': return <Shop onProductClick={setSelectedProduct} />;
      case 'press': return <Press />;
      case 'news': return <News />;
      case 'media': return <Media />;
      default: return <Home />;
    }
  };

  return (
    <section className="scene">
      <CanvasBackground />
      <div className="scene__dots"></div>

      <div className={`scene__card ${currentPage !== 'home' ? 'is-inner' : ''}`}>
        <nav className="card__nav">
          <a href="#" className={currentPage === 'about' ? 'active' : ''} onClick={navTo('about')}>about</a>
          <a href="#" className={currentPage === 'shop' ? 'active' : ''} onClick={navTo('shop')}>shop</a>
          <a href="#" className={currentPage === 'press' ? 'active' : ''} onClick={navTo('press')}>press</a>
          <a href="#" className={currentPage === 'news' ? 'active' : ''} onClick={navTo('news')}>news</a>
          <a href="#" className={currentPage === 'media' ? 'active' : ''} onClick={navTo('media')}>media</a>
        </nav>

        <div className="card__body" id="content">
          {renderContent()}
        </div>

        <div className="card__ticker">
          <div className="ticker__track">
            <span className="ticker__item">21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz</span>
            <span className="ticker__item">21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz</span>
            <span className="ticker__item">21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div className="home">
      <img src="/img/Logo.svg" style={{ width: '480px' }} alt="21streetz Logo" />
    </div>
  );
}

function About() {
  return (
    <div className="about">
      <p><span>21 streetz </span>is a music collective emerging from Vadodara,
      which provides audio and visual services<br /><br />
      <span>members</span><br />
      bhadrankar, jay, vastavik, groovy, tapan, yuvakmandal</p>
    </div>
  );
}

function Shop({ onProductClick }) {
  return (
    <div className="shop">
      <div className="products">
        {['shirt_001', 'shirt_002', 'shirt_003'].map(id => (
          <div className="product" key={id} onClick={() => onProductClick(id)}>
            <div className="product__img">
              <img src="/img/shirt3.png" alt={id} />
            </div>
            <div className="product__info">
              <div className="left">
                <p>{id.replace('_', ' ').toUpperCase()}</p>
                <span>₹1999</span>
              </div>
              <div className="right"><img src="/img/plus.png" alt="add" /></div>
            </div>
            <div className="product__line"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Press() {
  return (
    <div className="press">
      <div className="press-products">
        <div className="press-product">
          <div className="press-product__img"></div>
          <div className="press-product__info">
            <div className="press-left">
              <p>7 questions with bhadrankar</p>
              <span>offthedome</span>
            </div>
            <div className="press-right">
              <img src="/img/cross_arrow.png" alt="link" />
            </div>
          </div>
          <div className="press-product__line"></div>
        </div>
      </div>
    </div>
  );
}

function News() {
  return (
    <div className="news">
      <h2>NEWS</h2>
      <p>Latest updates</p>
    </div>
  );
}

function Media() {
  return (
    <div className="media">
      <p>reach us out at for any queries related to products or for any audio visual services<br /><br />
      21streetz.com<br />
      21streetz@gmail.com</p>
    </div>
  );
}

function ProductDetail({ id, onBack }) {
  return (
    <div className="productDetail">
      <div className="pd__top">
        <span className="back" onClick={onBack}>back</span>
        <span className="pd__title">samaan</span>
      </div>
      <div className="pd__content">
        <div className="pd__left">
          <img src="/img/shirt3.png" alt="product" />
        </div>
        <div className="pd__right">
          <h3>shop/{id}</h3>
          <p>size &nbsp; S M L XL</p>
          <div className="pd__plus">+</div>
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