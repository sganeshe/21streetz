import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";

export default function Login() {
  const { login } = useAuth();
  const { navTo } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const inputStyle = {
    background: "transparent", border: "1px solid #ff0000", color: "#ff0000", padding: "10px",
    fontFamily: "monospace", fontSize: "11px", outline: "none", width: "100%", boxSizing: "border-box", height: "38px"
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navTo("shop");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div 
      className="login-page" 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "60vh", 
        padding: "2rem", 
        color: "#ff0000", 
        fontFamily: "monospace" 
      }}
    >
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <span onClick={() => navTo("shop")} style={{ cursor: "pointer", textDecoration: "underline", marginBottom: "2rem", display: "inline-block" }}>back to shop</span>
        
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "normal", textTransform: "uppercase", margin: 0 }}>Login To Continue</h3>
          
          {error && <div style={{ color: "#ff0000", border: "1px solid #ff0000", padding: "8px", fontSize: "11px" }}>[ERROR] {error}</div>}
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "11px", textTransform: "uppercase" }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "11px", textTransform: "uppercase" }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
            <button type="submit" style={{ ...inputStyle, background: "#ff0000", color: "#000", border: "none", cursor: "pointer" }}>
              LOGIN
            </button>
            
            <p style={{ fontSize: "11px", margin: 0 }}>
              <span style={{ opacity: 0.7 }}>Don't have an account? </span>
              <span onClick={() => navTo("signup")} style={{ cursor: "pointer", textDecoration: "underline" }}>Sign up here</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}