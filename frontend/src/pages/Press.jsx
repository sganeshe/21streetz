import React from 'react';

const pressData = [
  { id: 'press_001', title: '7 questions with bhadrankar', source: 'offthedome', image: '/img/press.png', link: '#' },
];

export default function Press() {
  return (
    <div className="press">
      <div className="press-products">
        {pressData.map(item => (
          <div className="press-product" key={item.id}>
            <div className="press-product__img" style={{ backgroundImage: `url(${item.image})` }}></div>
            <div className="press-product__info">
              <div className="press-left"><p>{item.title}</p><span>{item.source}</span></div>
              <div className="press-right"><a href={item.link}><img src="/img/cross_arrow.png" alt="link" /></a></div>
            </div>
            <div className="press-product__line"></div>
          </div>
        ))}
      </div>
    </div>
  );
}