import { create } from "zustand";
import { createChatSlice } from "./slices/chat-slice";

export const useAppStore = create((set, get) => ({
  userInfo: null, // Default state is NULL

  setUserInfo: (userInfo) => {
    console.log("✅ Setting user info:", userInfo);
    set({ userInfo });
  },

  logout: () => {
    console.log("🔴 Logging out...");
    set({ userInfo: null, ...createChatSlice(set, get) }); // Reset userInfo and chat slice
  },

  ...createChatSlice(set, get), // ✅ Include chat slice
}));