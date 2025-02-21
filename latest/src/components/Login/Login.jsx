import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import Label from "../../components/ui/label";
import { motion } from "framer-motion";
import { Icons } from "../../components/ui/icons";
import { useState } from "react";
import axios from "axios";


export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8747/api/auth/login",
        {
          email,
          password,
        }
      );
      if (response.status === 200) {
        localStorage.setItem('authToken', response.data.token); 
        navigate("/profile");
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setIsLoading(false), 3000);
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 relative overflow-hidden">
      {/* Floating chat bubbles */}
      <div className="absolute inset-0 flex flex-col space-y-6 items-center justify-center opacity-10">
        <div className="bg-gray-800 text-gray-400 px-4 py-2 rounded-full text-sm shadow-lg">
          Welcome back! 👋
        </div>
        <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-full text-sm shadow-lg">
          Enter your credentials to sign in.
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-gray-900 bg-opacity-75 backdrop-blur-md border border-gray-800 shadow-xl rounded-2xl p-6 space-y-6 relative z-10"
      >
        {/* /* Chat-style logo header */ }
        <div className="flex items-center space-x-3">
          <Icons.logo className="h-12 w-12 text-cyan-400 animate-pulse" />
          <h1 className="text-2xl font-bold text-white">Chat Login</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <Label htmlFor="email" className="text-gray-300 text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 text-white border-none placeholder-gray-500 rounded-full py-3 px-4 focus:ring-cyan-400 shadow-lg transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div className="relative">
            <Label htmlFor="password" className="text-gray-300 text-sm">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 text-white border-none placeholder-gray-500 rounded-full py-3 px-4 focus:ring-cyan-400 shadow-lg transition-all"
              placeholder="••••••••"
            />
          </div>

          <Button
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-cyan-400/50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Start Chatting
          </Button>
        </form>
        <div className="text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-cyan-400 hover:underline transition-all"
          >
            Forgot password?
          </Link>
        </div>
        {/* Divider */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-900 px-2 text-gray-400">
              Or sign in with
            </span>
          </div>
        </div>
        {/* Social Login Buttons */}
        <div className="flex flex-col space-y-2 mt-4">
          <Button
            variant="outline"
            className="bg-gray-800 text-white border border-gray-600 hover:bg-gray-700 hover:border-cyan-400 transition-all duration-300 rounded-full"
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button
            variant="outline"
            className="bg-gray-800 text-white border border-gray-600 hover:bg-gray-700 hover:border-cyan-400 transition-all duration-300 rounded-full"
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">
          New to the app?{" "}
          <Link
            to="/signup"
            className="font-semibold text-cyan-400 hover:underline transition-all"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
