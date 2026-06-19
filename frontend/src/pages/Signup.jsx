import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";

export default function Signup() {
  const { register } = useAuth();
  const { navTo } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const pageRef = useRef(null);

  React.useEffect(() => {
    pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const inputStyle = {
    background: "transparent", border: "1px solid #ff0000", color: "#ff0000", padding: "10px",
    fontFamily: "monospace", fontSize: "20px", outline: "none", width: "100%", boxSizing: "border-box", height: "38px"
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, phone);
      navTo("shop");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div 
      ref={pageRef}
      className="signup-page" 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "stretch", 
        justifyContent: "flex-start", 
        height: "100%",
        padding: "1rem", 
        color: "#ff0000", 
        fontFamily: "monospace",
        overflowY: "auto"
      }}
    >
      <div style={{ marginTop: "0rem", width: "100%" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", borderBottom: "1px solid rgba(255,0,0,0.3)", paddingBottom: "0.5rem" }}>
          <h3 style={{ fontSize: "25px", fontWeight: "bold", textTransform: "lowercase", margin: 0 }}>Create Account</h3>
          <span onClick={() => navTo("login")} style={{ cursor: "pointer", fontSize: "18px", opacity: 0.8 }}>[ back_to_login ]</span>
        </div>
        
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {error && <div style={{ color: "#ff0000", border: "1px solid #ff0000", padding: "8px", fontSize: "20px" }}>[ERROR] {error}</div>}
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ textAlign: "left", fontSize: "20px", textTransform: "uppercase" }}>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ textAlign: "left", fontSize: "20px", textTransform: "uppercase" }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ textAlign: "left", fontSize: "20px", textTransform: "uppercase" }}>Phone Number</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} required />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ textAlign: "left", fontSize: "20px", textTransform: "uppercase" }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          </div>
          
          <button type="submit" style={{ ...inputStyle, fontSize: "15px", background: "#ff0000", color: "#000", border: "none", cursor: "pointer", marginTop: "0.5rem", fontWeight: "bold" }}>
            INITIALIZE_ACCOUNT
          </button>
        </form>
      </div>
    </div>
  );
}