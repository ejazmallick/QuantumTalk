import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/auth';
import Chat from './pages/chat';
import Profile from './pages/profile';
import LoginPage from './components/Login/Login';
import SignupPage from './components/Signup/Signup';
import { GET_USER_INFO } from './utils/constants';
import { useAppStore } from './store'; 
import apiClient from './lib/api-client';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
} 

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading , setLoading] = useState(true);

  useEffect(()=> {
    const getUserData = async() => {
      try {
        const response = await apiClient.get(GET_USER_INFO,{
          withCredentials : true,
          headers: {
            Authorization: `Bearer ${document.cookie.replace('jwt=', '')}`,
          },
        });
        console.log({response});
        setUserInfo(response.data);
      } catch (error) {
        console.log({error});
      } finally {
        setLoading(false);
      }
    };
    if (!userInfo){
      getUserData();
    } else {
      setLoading(false);
    }
  },[userInfo, setUserInfo]);

  if(loading) {
    return <div>loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute>
          <Auth />
        </AuthRoute>} />
        <Route path="/chat" element={<PrivateRoute>
          <Chat />
        </PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute>
          <Profile />
        </PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;