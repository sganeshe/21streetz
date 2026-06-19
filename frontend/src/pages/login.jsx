import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";

export default function Login() {
  const { login } = useAuth();
  const { navTo } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  
  const pageRef = useRef(null);

  React.useEffect(() => {
    pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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
      ref={pageRef}
      className="login-page" 
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
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", borderBottom: "2px solid rgba(255,0,0,0.3)", paddingBottom: "0.5rem" }}>
          <h3 style={{ fontSize: "25px", fontWeight: "bold", textTransform: "lowercase", margin: 0 }}>Login To Continue</h3>
          <span onClick={() => navTo("shop")} style={{ cursor: "pointer", fontSize: "18px", opacity: 0.8 }}>[ back_to_shop ]</span>
        </div>
        
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {error && <div style={{ color: "#ff0000", border: "1px solid #ff0000", padding: "8px", fontSize: "20px" }}>[ERROR] {error}</div>}
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ textAlign: "left", fontSize: "20px", textTransform: "uppercase" }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{...inputStyle, fontSize: "20px"}} required />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ textAlign: "left", fontSize: "20px", textTransform: "uppercase" }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{...inputStyle, fontSize: "20px"}} required />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
            <button type="submit" style={{ ...inputStyle, fontSize: "15px", background: "#ff0000", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" }}>
              EXECUTE_LOGIN
            </button>
            
            <p style={{ fontSize: "20px", margin: "1rem", textAlign: "center" }}>
              <span style={{ opacity: 0.7 }}>Don't have an account? </span>
              <span onClick={() => navTo("signup")} style={{ cursor: "pointer", textDecoration: "underline" }}>Sign up here</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}