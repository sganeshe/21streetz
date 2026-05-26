import { useState } from 'react';
import CanvasBackground from './CanvasBackground';
import { infoData, shopData, pressData, newsData } from './data';

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
      <CanvasBackground currentPage={currentPage} selectedProduct={selectedProduct} />
      
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
          <div key={`${currentPage}-${selectedProduct || 'none'}`} className="classy-transition">
            {renderContent()}
          </div>
        </div>

        <div className="card__ticker">
          <div className="ticker__track">
            <span className="ticker__item">
              21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz •&nbsp;
            </span>
            <span className="ticker__item">
              21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz • 21streetz •&nbsp;
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ============================================================
   PAGE COMPONENTS (Powered by data.js)
============================================================ */

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
      <p>
        <span>21 streetz </span>{infoData.about.description}<br /><br />
        <span>members</span><br />
        {infoData.about.members.join(', ')}
      </p>
    </div>
  );
}

function Shop({ onProductClick }) {
  return (
    <div className="shop">
      <div className="products">
        {/* Mapping through shopData dynamically */}
        {shopData.map(product => (
          <div className="product" key={product.id} onClick={() => onProductClick(product.id)}>
            <div className="product__img">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product__info">
              <div className="left">
                <p>{product.name}</p>
                <span>{product.price}</span>
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
        {/* Mapping through pressData dynamically */}
        {pressData.map(item => (
          <div className="press-product" key={item.id}>
            {/* Using inline style for dynamic background image */}
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

function ProductDetail({ id, onBack }) {
  const product = shopData.find(p => p.id === id);

  if (!product) return <div>Product not found</div>;

  return (
    <div className="productDetail">
      <div className="pd__top">
        <span className="back" onClick={onBack}>back</span>
        <span className="pd__title">samaan</span>
      </div>
      <div className="pd__content">
        <div className="pd__left">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="pd__right">
          <h3>shop/{product.name.toLowerCase().replace(' ', '_')}</h3>
          <p>size &nbsp; {product.sizes ? product.sizes.join(' ') : 'S M L XL'}</p>
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