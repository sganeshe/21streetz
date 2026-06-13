import { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/auth.service";
import api from "../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check for active session on initial site load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          // If token exists, fetch the latest profile data
          const response = await authService.getProfile();
          setUser(response.user);
        } catch (error) {
          console.error("Session expired or invalid token");
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      }
      setLoading(false); // Stop the initial loading spinner
    };

    initializeAuth();
  }, []);

  // 2. Login Method
  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    localStorage.setItem("accessToken", response.token);
    setUser(response.user);
    return response;
  };

  // 3. Register Method
  const register = async (name, email, password, phone) => {
    const response = await authService.register({
      name,
      email,
      password,
      phone,
    });
    localStorage.setItem("accessToken", response.token);
    setUser(response.user);
    return response;
  };

  // 4. Logout Method
  const logout = async () => {
    try {
      await authService.logout(); // Optional: if your backend tracks active sessions
    } catch (error) {
      console.error(
        "Backend logout failed, but clearing local session anyway.",
      );
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN", // The master key for your admin panel routing
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
