import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    adminSecret: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminSecret, setShowAdminSecret] = useState(false);

  const validateForm = () => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      showToast("Phone number must be exactly 10 digits.", "error");
      return false;
    }

    const { password } = formData;
    if (password.length < 8) {
      showToast("Password must be at least 8 characters long.", "error");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      showToast("Password must contain at least one uppercase letter.", "error");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      showToast("Password must contain at least one number.", "error");
      return false;
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      showToast("Password must contain at least one special character.", "error");
      return false;
    }

    return true;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); 
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await authService.registerAdmin(formData);
      showToast("Admin account created successfully!", "success");
      
      await login({ email: formData.email, password: formData.password });
      navigate('/dashboard');
    } catch (error) {
      showToast(error.response?.data?.message || "Registration failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-8 font-sans text-white">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-white">21 Streetz</h2>
          <p className="text-sm text-neutral-400 mt-2">Create your administrator profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Full Name</label>
            <input 
              type="text" name="name" value={formData.name} onChange={handleChange} required 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email Address</label>
            <input 
              type="email" name="email" value={formData.email} onChange={handleChange} required 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Phone Number</label>
            <input 
              type="tel" name="phone" value={formData.phone} onChange={handleChange} required minLength="10" maxLength="15"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                minLength="8"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors p-1 flex items-center justify-center"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-neutral-950 rounded-xl border border-neutral-800">
            <label className="flex items-center justify-between text-sm font-medium text-neutral-200 mb-2">
              <span>Security Key</span>
              <span className="text-xs text-neutral-500 font-normal">Required</span>
            </label>
            <div className="relative">
              <input 
                type={showAdminSecret ? "text" : "password"} 
                name="adminSecret" 
                value={formData.adminSecret} 
                onChange={handleChange} 
                required 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowAdminSecret(!showAdminSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors p-1 flex items-center justify-center"
              >
                {showAdminSecret ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" disabled={isSubmitting}
            className="w-full bg-white hover:bg-neutral-200 text-black text-sm font-semibold rounded-lg py-3 transition-colors disabled:opacity-50 mt-6"
          >
            {isSubmitting ? 'Registering...' : 'Create Admin Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-500">
          Already authorized? <Link to="/login" className="text-white hover:text-neutral-300 font-medium">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}