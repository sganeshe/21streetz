import React, { useState, useEffect } from 'react';
import { newsService } from '../services/news.service';

export default function News() {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    newsService.getAll().then(data => setNewsData(data.newsList || []));
  }, []);

  return (
    <div className="news">
      <h2 style={{ fontSize: '25px', color: '#ff0000', fontFamily: 'monospace', marginBottom: '1rem' }}>NEWS</h2>
      {newsData.map(news => (
        <p key={news._id} style={{ paddingLeft: '1rem', marginTop: '1rem', textAlign: 'left' }}>
          <strong style={{ fontSize: '20px', textAlign: 'left', color: '#ff0000', fontFamily: 'monospace' }}>{news.title}</strong><br />
          {news.content}
        </p>
      ))}
    </div>
  );
}