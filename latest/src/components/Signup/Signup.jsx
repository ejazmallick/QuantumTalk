import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import Label from "../../components/ui/label";
import { Icons } from "@/components/ui/icons";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";



export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8747/api/auth/signup",
        {
          name,
          email,
          password,
        }
      );
      if (response.status === 201) {
        navigate("/profile");
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 relative overflow-hidden">
      {/* Floating Chat Bubbles */}
      <div className="absolute inset-0 flex items-center flex-col space-y-6 justify-center opacity-10">
        <div className="bg-gray-800 text-gray-400 px-4 py-2 rounded-full text-sm shadow-lg">
          Ready to join? 🚀
        </div>
        <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-full text-sm shadow-lg">
          Enter your details and get started.
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-gray-900 bg-opacity-75 backdrop-blur-md border border-gray-800 shadow-xl rounded-2xl p-6 space-y-6 relative z-10"
      >
        {/* Chat-style Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Icons.logo className="h-12 w-12 text-cyan-400 animate-pulse" />
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <Label htmlFor="name" className="text-gray-300 text-sm">
              Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              required
              className="w-full bg-gray-800 text-white border-none placeholder-gray-500 rounded-full py-3 px-4 focus:ring-cyan-400 shadow-lg transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="relative">
            <Label htmlFor="email" className="text-gray-300 text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              className="w-full bg-gray-800 text-white border-none placeholder-gray-500 rounded-full py-3 px-4 focus:ring-cyan-400 shadow-lg transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="w-full bg-gray-800 text-white border-none placeholder-gray-500 rounded-full py-3 px-4 focus:ring-cyan-400 shadow-lg transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Get Started
          </Button>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-900 px-2 text-gray-400">
              Or sign up with
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-cyan-400 hover:underline transition-all"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
