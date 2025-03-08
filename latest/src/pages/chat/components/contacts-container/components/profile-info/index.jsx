import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiLogOut } from "react-icons/fi"; // Import icons
import apiClient from "../../../../../../lib/api-client";
import { LOGOUT_ROUTE } from "../../../../../../utils/constants";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore(); // Zustand store
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });

        if (response.status === 200) {
            localStorage.removeItem("authToken"); // ❌ Clear token
            setUserInfo(null); // ❌ Clear Zustand store
            navigate("/auth", { replace: true }); // ✅ Redirect properly
        }
    } catch (error) {
        console.error("Logout failed:", error);
    }
};


  return (
    <div className="absolute bottom-4 left-4 w-[220px] h-14 flex items-center justify-between px-4 bg-[#2a2b33] border border-[#3a3b44] rounded-xl shadow-lg">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <img
          src={userInfo?.image || "/default-avatar.jpg"}
          alt="User Avatar"
          className="h-10 w-10 rounded-full object-cover border border-[#3a3b44]"
        />
        <span className="text-white text-sm font-medium truncate">{userInfo?.name || "User"}</span>
      </div>

      {/* Action Icons (Edit & Logout) */}
      <div className="flex gap-3">
        {/* Edit Profile */}
        <button
          className="text-neutral-400 hover:text-white transition duration-300 p-2 rounded-full hover:bg-[#3a3b44]"
          onClick={() => navigate("/profile")}
        >
          <FiEdit2 className="text-lg" />
        </button>

        {/* Logout */}
        <button
          className="text-red-500 hover:text-red-400 transition duration-300 p-2 rounded-full hover:bg-[#3a3b44]"
          onClick={handleLogout}
        >
          <FiLogOut className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
