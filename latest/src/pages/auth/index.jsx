import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { MessageCircle, Users, Zap } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from 'react';
import apiClient from '../../lib/api-client';
import { SIGNUP_ROUTE } from '../../utils/constants';
import { useAppStore } from '../../store';

export default function Auth() {
  const navigate = useNavigate();
  const {setUserInfo} = useAppStore;
  
  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  }

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match");
      return false;
    }
    return true;
  };
  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
  
        if (response.data.user.id) {
          setUserInfo(response.data.user);
          
          // ✅ Store the JWT token securely
          localStorage.setItem("authToken", response.data.token);
  
          // ✅ Redirect based on profile setup
          if (response.data.user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };
  

  const handleSignup = async () => {
    if (validateSignup()) {
      const response = await apiClient.post(SIGNUP_ROUTE, { email, password },{ withCredentials: true});

      if(response.status === 201){
        setUserInfo(response.data.user);
        navigate('/profile');
      }
      console.log({ response });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-black to-gray-950 relative overflow-hidden">
      {/* Floating chat bubbles */}
      <div className="absolute inset-0 flex flex-col space-y-6 items-center justify-center opacity-10">
        <div className="bg-gray-800 text-gray-400 px-4 py-2 rounded-full text-sm shadow-lg">
          Join the conversation! 🎉
        </div>
        <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-full text-sm shadow-lg">
          Connect with friends in real-time.
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-900 bg-opacity-75 backdrop-blur-md border border-gray-800 shadow-xl rounded-2xl p-6 space-y-6 relative z-10"
      >
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Icons.logo className="h-12 w-12 text-cyan-400 animate-pulse" />
          <h1 className="text-2xl font-bold text-white">Welcome to ChatWave</h1>
        </div>

        <p className="text-gray-300 text-center">
          The next-gen chat platform for seamless communication.
        </p>

        {/* Feature Highlights */}
        <div className="space-y-4">
          <FeatureCard
            icon={<MessageCircle className="w-8 h-8 text-cyan-400" />}
            title="Instant Messaging"
            description="Enjoy real-time, secure conversations."
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-cyan-400" />}
            title="Group Chats"
            description="Create and manage group conversations."
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-cyan-400" />}
            title="Lightning Fast"
            description="Experience smooth and responsive chats."
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-4">
          <Link to="/login">
            <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-4 rounded-full shadow-lg transition-all">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="w-full bg-gray-800 text-white border border-gray-600 hover:bg-gray-700 hover:border-cyan-400 transition-all rounded-full py-3 px-4">
              Sign Up
            </button>
          </Link>
        </div>
      </motion.div>
      <ToastContainer />
    </div>
  );
}

const FeatureCard = ({ icon, title, description }) => (
  <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-md">
    <div>{icon}</div>
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);