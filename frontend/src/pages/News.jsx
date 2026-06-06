import React from 'react';

const newsData = [
  { id: 'news_001', headline: 'Latest updates', description: 'More drops coming soon.' }
];

export default function News() {
  return (
    <div className="news">
      <h2>NEWS</h2>
      {newsData.map(news => (
        <p key={news.id}>{news.headline}</p>
      ))}
    </div>
  );
}