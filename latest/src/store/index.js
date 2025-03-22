import { create } from "zustand";
import { createChatSlice } from "./slices/chat-slice";

export const useAppStore = create((set, get) => ({
  userInfo: null, // Default state is NULL
  setUserInfo: (userInfo) => {
    if (!userInfo || typeof userInfo !== "object") {
      console.error("❌ Invalid userInfo received:", userInfo);
      return;
    }
  
    const user = userInfo?.user || userInfo; // Handle both structures
    if (!user?.id && !user?._id) {
      console.error("❌ Missing 'id' or '_id' in userInfo:", user);
      return;
    }
  
    const normalizedUser = { ...user, _id: user._id || user.id }; // Ensure `_id` is always available
  
    console.log("✅ Setting user info:", normalizedUser);
    set(() => ({ userInfo: normalizedUser }));
  },
  
  logout: () => {
    console.log("🔴 Logging out...");

    set(() => ({ userInfo: null })); // Reset user info
    set((state) => ({
      ...state,
      ...createChatSlice(set, get), // Reset chat slice separately
    }));
  },

  ...createChatSlice(set, get), // ✅ Include chat slice
}));
