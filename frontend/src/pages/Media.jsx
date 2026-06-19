import React, { useRef } from 'react';

export default function Media() {
  const pageRef = useRef(null);

  React.useEffect(() => {
    pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="media" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "1500px", maxWidth: "100%", padding: "0rem" }}>
      <p style={{ fontSize: "25px", color: "#ff0000", fontFamily: "monospace" }}>
        reach us out at for any queries related to products or for any audio visual services<br /><br />
        21streetz.com<br />
        21streetz@gmail.com
      </p>
    </div>
  );
}