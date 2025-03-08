export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [], // Initialize messages state

    setSelectedChatType: (selectedChatType) => 
        set({ selectedChatType }),

    setSelectedChatData: (selectedChatData) => 
        set({ selectedChatData }),

    setSelectedChatMessages: (selectedChatMessages) => 
        set({ selectedChatMessages }),

    closeChat: () => 
        set({ 
            selectedChatType: undefined,
            selectedChatData: undefined,
            selectedChatMessages: [], // Clear messages when chat is closed
        }),
});
