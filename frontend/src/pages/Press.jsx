import React, { useState, useEffect } from 'react';
import { pressService } from '../services/press.service';

export default function Press() {
  const [pressData, setPressData] = useState([]);

  useEffect(() => {
    pressService.getAll().then(data => setPressData(data.pressList || []));
  }, []);

  return (
    <div className="press">
      <div className="press-products">
        {pressData.map(item => (
          <div className="press-product" key={item._id}>
            <div className="press-product__img" style={{ backgroundImage: `url(${item.image})` }}></div>
            <div className="press-product__info">
              <div className="press-left"><p>{item.headline}</p></div>
              <div className="press-right"><a href={item.redirectLink} target="_blank" rel="noreferrer"><img src="/img/cross_arrow.png" alt="link" /></a></div>
            </div>
            <div className="press-product__line"></div>
          </div>
        ))}
      </div>
    </div>
  );
}