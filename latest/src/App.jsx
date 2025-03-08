import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import LoginPage from "./components/Login/Login";
import SignupPage from "./components/Signup/Signup";
import { GET_USER_INFO } from "./utils/constants";
import { useAppStore } from "./store";
import apiClient from "./lib/api-client";
import { jwtDecode } from "jwt-decode";

// ✅ Token Validation Function
const validateToken = (token) => {
  try {
    if (!token) return false;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now(); // Check expiration
  } catch (error) {
    console.error("Invalid token", error);
    return false;
  }
};

// ✅ Secure Private Route (Ensures token is valid)
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const token = localStorage.getItem("authToken");

  if (!token || !validateToken(token)) {
    console.warn("🔴 Invalid or expired token. Redirecting to login...");
    return <Navigate to="/login" />;
  }

  return userInfo ? children : <div>Loading...</div>;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadUserData = async () => {
        const token = localStorage.getItem("authToken");

        if (!token || !validateToken(token)) {
            console.warn("🔴 No valid token found. Logging out...");
            localStorage.removeItem("authToken");
            setUserInfo(null);
            setLoading(false);
            navigate("/login", { replace: true }); // ✅ Force logout
            return;
        }

        try {
            console.log("🔍 Fetching user data...");
            const response = await apiClient.get(GET_USER_INFO, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ User data received:", response.data);
            setUserInfo(response.data);
        } catch (error) {
            console.error("❌ Error fetching user data:", error);
            localStorage.removeItem("authToken");
            setUserInfo(null);
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) {
        setTimeout(() => loadUserData(), 500);
    }
}, [userInfo, setUserInfo]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
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
