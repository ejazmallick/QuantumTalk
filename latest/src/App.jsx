import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import LoginPage from "./components/Login/Login";
import SignupPage from "./components/Signup/Signup";
import { useAppStore } from "./store";
import apiClient from "./lib/api-client";
import {jwtDecode} from "jwt-decode";
import { GET_USER_INFO } from "./utils/constants"; // ✅ Fix missing import

const validateToken = (token) => {
  try {
    if (!token) return false;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    console.error("Invalid token", error);
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const token = localStorage.getItem("authToken");

  if (!token || !validateToken(token)) {
    return <Navigate to="/login" />;
  }

  return userInfo ? children : <div>Loading...</div>;
};

const AuthHandler = () => {
  const { userInfo, setUserInfo, logout } = useAppStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token || !validateToken(token)) {
        console.warn("🔴 No valid token found. Logging out...");
        localStorage.removeItem("authToken");
        logout();
        setLoading(false);
        navigate("/login", { replace: true });
        return;
      }

      try {
        console.log("🔍 Fetching user data...");
        const response = await apiClient.get(GET_USER_INFO, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.user) {
          console.log("✅ User data received:", response.data.user);
          setUserInfo(response.data.user);
        } else {
          console.error("❌ Invalid user data format:", response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        localStorage.removeItem("authToken");
        logout();
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      loadUserData();
    }
  }, [userInfo, setUserInfo, logout, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthHandler />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
