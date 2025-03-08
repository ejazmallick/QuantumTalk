export const createAuthSlice = (set) => ({
    userInfo: { name: "Default User", avatar: "/default-avatar.jpg" }, // Default values
    setUserInfo: (userInfo) => set({ userInfo }),
  });
  