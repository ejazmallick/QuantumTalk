import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "@/store"; // Import Zustand store

const ChatHeader = () => {
  const { userInfo } = useAppStore(); // Get user info

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-4 w-full bg-[#1b1c24]">
      {/* Left Side - User Info */}
      <div className="flex items-center gap-4">
        <img
          src={userInfo?.image || "/default-avatar.png"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border border-purple-500"
        />
        <div>
          <h3 className="text-white font-medium">{userInfo?.name || "User"}</h3>
          <p className="text-xs text-gray-400">{userInfo?.email || "No Email"}</p>
        </div>
      </div>

      {/* Right Side - Close Button */}
      <button className="text-neutral-500 hover:text-white transition-all">
        <RiCloseFill className="text-3xl" />
      </button>
    </div>
  );
};

export default ChatHeader;
