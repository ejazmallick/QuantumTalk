import { useAppStore } from '../../store';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import apiClient from '../../lib/api-client';
import { UPDATE_PROFILE_ROUTE, ADD_PROFILE_IMAGE_ROUTE, HOST } from '../../utils/constants';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Label } from '@radix-ui/react-label';
import { Icons } from '../../components/ui/icons';

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setAvatarUrl(userInfo.avatarUrl);
    }
  }, [userInfo]);

  const saveChanges = async () => {
    if (!name) {
      toast.error("Name is required.");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You are not authenticated. Please log in.");
        return;
      }
      const response = await apiClient.post(
        UPDATE_PROFILE_ROUTE,
        { name, email, avatarUrl },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      if (response.status === 200) {
        setUserInfo({ ...response.data.user });
        toast.success("Profile updated successfully.");
        navigate("/chat");
      }
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handleFileInputClick = () => fileInputRef.current.click();

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile-image", file);

    try {
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true });
      if (response.status === 200 && response.data.image) {
        const newAvatarUrl = `${HOST}/${response.data.image}`;
        setUserInfo({ ...userInfo, avatarUrl: newAvatarUrl });
        setAvatarUrl(newAvatarUrl);
        toast.success("Image uploaded successfully.");
      }
    } catch (error) {
      toast.error("Failed to upload image.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-gray-900 bg-opacity-75 backdrop-blur-md border border-gray-800 shadow-xl rounded-2xl p-6 space-y-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Icons.user className="h-12 w-12 text-cyan-400 animate-pulse" />
          <h1 className="text-2xl font-bold text-white">Your Profile</h1>
        </div>
        <div className="flex justify-center mb-6">
          <Avatar className="w-24 h-24 border-2 border-cyan-400">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{name ? name[0] : "?"}</AvatarFallback>
          </Avatar>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          <button onClick={handleFileInputClick} className="mt-3 px-3 py-2 bg-cyan-500 text-black rounded-md hover:bg-cyan-600 transition">
            Change Avatar
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); saveChanges(); }} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300 text-sm">Name</Label>
            <input id="name" className="w-full bg-gray-800 text-white rounded-full py-3 px-4 focus:ring-cyan-400" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-300 text-sm">Email</Label>
            <input id="email" type="email" className="w-full bg-gray-800 text-white rounded-full py-3 px-4 focus:ring-cyan-400" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-4 rounded-full shadow-lg" type="submit" disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} Update Profile
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
