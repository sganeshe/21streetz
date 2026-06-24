import React from 'react';

export default function Home() {
  return (
    <div 
      className="home"
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem'
      }}
    >
      <div 
        className="textured-logo" 
        aria-label="21streetz Logo" 
        role="img"
        style={{
          width: '100%',
          maxWidth: '1600px',
          height: '40vh',
          minHeight: '200px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      ></div>
    </div>
  );
}