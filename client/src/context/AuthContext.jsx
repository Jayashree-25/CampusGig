import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async (existingToken) => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${existingToken}` },
      });
      const profile = response.data.user;
      setUser({
        id: profile.id,
        username: profile.username,
        email: profile.email,
      });
      return true;
    } catch {
      logout();
      return false;
    }
  }, [logout]);

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return response.data;
  };

  const register = async (username, email, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      email,
      password,
    });
    return response.data;
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await refreshUser(storedToken);
      }
      setLoading(false);
    };
    initAuth();
  }, [refreshUser]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
