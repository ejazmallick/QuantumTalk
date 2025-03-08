import { useAppStore } from '../../store';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import apiClient from '../../lib/api-client';
import { UPDATE_PROFILE_ROUTE, ADD_PROFILE_IMAGE_ROUTE } from '../../utils/constants';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Label } from '@radix-ui/react-label';
import { Icons } from '../../components/ui/icons';

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!userInfo) return;
  
    // Retrieve the avatar from localStorage first, fallback to userInfo.image
    const storedAvatar = localStorage.getItem("userAvatar") || userInfo.image;
  
    console.log("🛠️ Stored Avatar from LocalStorage:", storedAvatar);
  
    setName(userInfo.name || '');
    setEmail(userInfo.email || '');
    
    // ✅ Prevent resetting avatar after upload
    setAvatarUrl((prev) => prev || storedAvatar || '');
  }, [userInfo]);
  
  const saveChanges = async () => {
    if (!name) {
      toast.error('Name is required.');
      return;
    }
  
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication failed.');
        return;
      }
  
      const response = await apiClient.put(
        UPDATE_PROFILE_ROUTE,
        { name, email, image: avatarUrl },  // ✅ Ensure profile image is included
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
  
      if (response.status === 200) {
        toast.success('Profile updated successfully.');
  
        // ✅ Ensure profileSetup is marked as complete
        const updatedUser = { ...response.data.user, profileSetup: true };
  
        localStorage.setItem("userAvatar", updatedUser.image);
        setUserInfo(updatedUser);  // ✅ This ensures Chat sees the updated userInfo
  
        navigate('/chat', { replace: true });  // ✅ Replace history to prevent going back
      }
    } catch (error) {
      toast.error('Profile update failed.');
      console.error('Error details:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleFileInputClick = () => fileInputRef.current.click();
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select an image.");
      return;
    }
  
    // ✅ Show Temporary Preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
  
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Authentication required.");
      return;
    }
  
    const formData = new FormData();
    formData.append("profileImage", file);
  
    try {
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      if (response.status === 200 && response.data.user.image) {
        let finalImageUrl = response.data.user.image;
  
        // ✅ Ensure the image URL is complete
        if (!finalImageUrl.startsWith("http")) {
          finalImageUrl = `http://localhost:8747${finalImageUrl}`;
        }
  
        // ✅ Update State and Local Storage
        setAvatarUrl(finalImageUrl);
        setUserInfo((prev) => ({ ...prev, image: finalImageUrl }));
        localStorage.setItem("userAvatar", finalImageUrl);
  
        toast.success("Image uploaded successfully.");
      } else {
        toast.error("Failed to retrieve image URL.");
      }
    } catch (error) {
      console.error("❌ Image Upload Error:", error.response ? error.response.data : error);
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
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-24 h-24 border-2 border-cyan-400 rounded-full overflow-hidden">
            <AvatarImage src={avatarUrl} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:8747/default-avatar-url.jpg'; }} />
            


            <AvatarFallback className="text-gray-400">{name ? name[0] : '?'}</AvatarFallback>

          </Avatar>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          <button
            onClick={handleFileInputClick}
            className="mt-3 px-3 py-2 bg-cyan-500 text-black rounded-md hover:bg-cyan-600 transition"
          >
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
