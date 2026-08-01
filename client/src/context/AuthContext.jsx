import { createContext, useState, useEffect } from "react";
import api from "../services/api.js";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("staynear_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("staynear_token"));
  const [loading, setLoading] = useState(true);

  // Restore session on initial mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("staynear_token");
      if (storedToken) {
        try {
          const response = await api.get("/auth/profile");
          if (response.data.success) {
            setUser(response.data.user);
            localStorage.setItem("staynear_user", JSON.stringify(response.data.user));
          }
        } catch (err) {
          console.error("Session restore failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Auth Actions
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token: authToken, user: userData } = response.data;

      localStorage.setItem("staynear_token", authToken);
      localStorage.setItem("staynear_user", JSON.stringify(userData));

      setToken(authToken);
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (formData) => {
    try {
      const response = await api.post("/auth/register", formData);
      toast.success(response.data.message || "Registration successful! Please login.");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed.";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("staynear_token");
    localStorage.removeItem("staynear_user");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const isAuthenticated = !!token && !!user;
  const isOwner = user?.role === "owner";
  const isStudent = user?.role === "student";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isOwner,
        isStudent,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
