import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react"; 
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
  
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  const pageRef = useRef(null);

  React.useEffect(() => {
    pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // --- FRONTEND VALIDATION LOGIC ---
  const validateForm = () => {
    // 1. Phone Validation (Exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("Phone number must be exactly 10 digits.");
      return false;
    }

    // 2. Password Validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return false;
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      setError("Password must contain at least one special character.");
      return false;
    }

    setError(null); // Clear errors if everything passes
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    
    // Stop submission if validation fails
    if (!validateForm()) {
      return; 
    }

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
          <span onClick={() => navTo("login")} style={{cursor: "pointer"}}>[ back_to_login ]</span>
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
              maxLength="10" // Prevents typing more than 10 characters
              className="auth-input" 
              required 
            />
          </div>
          
          <div className="auth-input-group">
            <label>Password</label>
            {/* Wrapper div for relative positioning of the eye icon */}
            <div style={{ position: "relative" }}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="auth-input" 
                style={{ paddingRight: "40px", width: "100%", boxSizing: "border-box" }} // Prevent text from hiding under the icon
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  padding: 0
                }}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-neutral-500" />
                ) : (
                  <Eye className="w-4 h-4 text-neutral-500" />
                )}
              </button>
            </div>
          </div>
          
          <button type="submit" className="auth-submit">
            INITIALIZE_ACCOUNT
          </button>
        </form>
      </div>
    </div>
  );
}