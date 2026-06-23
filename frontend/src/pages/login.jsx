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
    <div ref={pageRef} className="auth-page">
      <div className="auth-container">
        
        <div className="auth-header">
          <h3>Login To Continue</h3>
          <span onClick={() => navTo("shop")}>[ back_to_shop ]</span>
        </div>
        
        <form onSubmit={submit} className="auth-form">
          
          {error && <div className="auth-error">[ERROR] {error}</div>}
          
          <div className="auth-input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="auth-input" 
              required 
            />
          </div>
          
          <div className="auth-input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="auth-input" 
              required 
            />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <button type="submit" className="auth-submit">
              EXECUTE_LOGIN
            </button>
            
            <p style={{ fontSize: "16px", marginTop: "1rem", textAlign: "center" }}>
              <span style={{ opacity: 0.7 }}>Don't have an account? </span>
              <span 
                onClick={() => navTo("signup")} 
                style={{ cursor: "pointer", textDecoration: "underline", fontWeight: "bold" }}
              >
                Sign up here
              </span>
            </p>
          </div>
          
        </form>
      </div>
    </div>
  );
}