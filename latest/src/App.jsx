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

// ✅ Secure Private Route (Checks for token expiration)
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/signup" />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("authToken");
      return <Navigate to="/signup" />;
    }
  } catch (error) {
    console.error("Invalid token", error);
    localStorage.removeItem("authToken");
    return <Navigate to="/signup" />;
  }

  return userInfo ? children : <Navigate to="/signup" />;
};

// ✅ Secure Auth Route (Redirects logged-in users to Chat)
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const token = localStorage.getItem("authToken");
  const isAuthenticated = !!userInfo && !!token;

  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.warn("No JWT token found, redirecting to signup...");
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      setTimeout(getUserData, 500); // 🔥 Delay fetching user data slightly
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/signup" />} /> {/* ✅ Default route to Signup */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
