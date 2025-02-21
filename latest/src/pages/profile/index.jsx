import { useAppStore } from '../../store'; // Import the useAppStore function
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import apiClient from '../../lib/api-client';
import { UPDATE_PROFILE_ROUTE } from '../../utils/constants';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Label } from '@radix-ui/react-label'; // Correct import for Label component
import { Icons } from '../../components/ui/icons'; // Correct import path for Icons

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
      setName(userInfo.name);
      setEmail(userInfo.email);
      setAvatarUrl(userInfo.avatarUrl);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile.");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    saveChanges();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 relative overflow-hidden">
      {/* Floating Chat Bubbles */}
      <div className="absolute inset-0 flex items-center flex-col space-y-6 justify-center opacity-10">
        <div className="bg-gray-800 text-gray-400 px-4 py-2 rounded-full text-sm shadow-lg">Update your profile 🚀</div>
        <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-full text-sm shadow-lg">
          Customize your account details.
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-gray-900 bg-opacity-75 backdrop-blur-md border border-gray-800 shadow-xl rounded-2xl p-6 space-y-6 relative z-10"
      >
        {/* Profile Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Icons.user className="h-12 w-12 text-cyan-400 animate-pulse" />
          <h1 className="text-2xl font-bold text-white">Your Profile</h1>
        </div>

        <div className="flex justify-center mb-6">
          <Avatar
            className={`w-24 h-24 border-2 transition-all duration-300 ${hovered ? "border-cyan-500" : "border-cyan-400"}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <Label htmlFor="name" className="text-gray-300 text-sm">
              Name
            </Label>
            <input
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
            <input
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
            <Label htmlFor="avatar" className="text-gray-300 text-sm">
              Avatar URL
            </Label>
            <input
              id="avatar"
              placeholder="https://example.com/avatar.jpg"
              className="w-full bg-gray-800 text-white border-none placeholder-gray-500 rounded-full py-3 px-4 focus:ring-cyan-400 shadow-lg transition-all"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>

          {/* Replaced Radix Button with a regular HTML button */}
          <button
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-cyan-400/50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Update Profile
          </button>
        </form>

        <button
          className="w-full bg-gray-800 text-white border border-gray-600 hover:bg-gray-700 hover:border-cyan-400 transition-all duration-300 rounded-full mt-4"
          onClick={handleNavigate}
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          Back to Chat
        </button>
      </motion.div>
    </div>
  );
};

export default Profile;
