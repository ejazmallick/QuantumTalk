import { create } from "zustand";
import { createChatSlice } from "./slices/chat-slice";

export const useAppStore = create((set, get) => ({
  messages: [], // Array to hold chat messages
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })), // Method to add a new message

  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),

  ...createChatSlice(set, get), // ✅ Pass set and get correctly
}));
