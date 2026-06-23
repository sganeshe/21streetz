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
    <div ref={pageRef} className="auth-page">
      <div className="auth-container">
        
        <div className="auth-header">
          <h3>Create Account</h3>
          <span onClick={() => navTo("login")}>[ back_to_login ]</span>
        </div>
        
        <form onSubmit={submit} className="auth-form">
          
          {error && <div className="auth-error">[ERROR] {error}</div>}
          
          <div className="auth-input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="auth-input" 
              required 
            />
          </div>
          
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
            <label>Phone Number</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
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
          
          <button type="submit" className="auth-submit">
            INITIALIZE_ACCOUNT
          </button>
        </form>
      </div>
    </div>
  );
}