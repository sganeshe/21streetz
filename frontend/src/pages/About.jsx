import React, { useState, useEffect, useRef } from 'react';

export default function About() {
  const pageRef = useRef(null);
  
  React.useEffect(() => {
      pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

  return (
    <div ref={pageRef} className="about" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", width: "1500px", maxWidth: "100%", padding: "2rem" }}>
      <p style={{ fontSize: "25px", lineHeight: "1.5", color: "#ff0000", fontFamily: "monospace" }}>
        21 streetz is a music collective emerging from Vadodara, which provides audio and visual services<br /><br />
        <span>members</span><br />
        bhadrankar, jay, vastavik, groovy, tapan, yuvakmandal
      </p>
    </div>
  );
}