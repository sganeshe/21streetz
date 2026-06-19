import React, { useState, useEffect, useRef } from 'react';
import { pressService } from '../services/press.service';

export default function Press() {
  const [pressData, setPressData] = useState([]);
  const pageRef = useRef(null);
    
  React.useEffect(() => {
      pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

  useEffect(() => {
    pressService.getAll().then(data => setPressData(data.pressList || []));
  }, []);

  return (
    <div className="press" style={{overflowY: 'scroll',}}>
      <div className="press-products" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',}}>
        {pressData.map(item => (
          <div className="press-product" key={item._id}>
            <div className="press-product__img" style={{ backgroundImage: `url(${item.image})` }}></div>
            <div className="press-product__info">
              <div className="press-left" style={{ color: "#ff0000", fontFamily: "monospace",}}><p style={{marginLeft: "-0.5rem", textAlign: "left", fontSize: "20px",}}>{item.headline}</p></div>
              <div className="press-right"><a href={item.redirectLink} target="_blank" rel="noreferrer"><img src="/img/cross_arrow.png" alt="link" /></a></div>
            </div>
            <div className="press-product__line"></div>
          </div>
        ))}
      </div>
    </div>
  );
}