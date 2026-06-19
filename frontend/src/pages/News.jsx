import React, { useState, useEffect } from 'react';
import { newsService } from '../services/news.service';

export default function News() {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    newsService.getAll().then(data => setNewsData(data.newsList || []));
  }, []);

  return (
    <div className="news">
      <h2>NEWS</h2>
      {newsData.map(news => (
        <p key={news._id} style={{ marginBottom: '1rem' }}>
          <strong>{news.title}</strong><br />
          {news.content}
        </p>
      ))}
    </div>
  );
}