import React, { createContext, useState, useEffect } from "react";
import { getToken, getUser, setAuthTokens, logout } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getUser();
    const token = getToken();

    if (storedUser && token) {
      setUser(storedUser);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  const login = (accessToken, refreshToken, user) => {
    setAuthTokens(accessToken, refreshToken, user);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
