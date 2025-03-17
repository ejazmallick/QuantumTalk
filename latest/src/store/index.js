import { create } from "zustand";
import { createChatSlice } from "./slices/chat-slice";

export const useAppStore = create((set, get) => ({
  userInfo: null, // Default state is NULL

  setUserInfo: (userInfo) => {
    console.log("✅ Setting user info:", userInfo);
    set({ userInfo });
  },

  ...createChatSlice(set, get), // ✅ Include chat slice
}));
