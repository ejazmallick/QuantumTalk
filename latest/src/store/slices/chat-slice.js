export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],

    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),

    closeChat: () => set({
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: [],
    }),

    addMessage: (message) => {
        const { selectedChatMessages = [] } = get();

        console.log("📝 Zustand: Before Update Messages:", selectedChatMessages);
        console.log("📨 New message received:", message);

        // 🔹 Ensure message has an ID and avoid duplicates
        if (!message._id || selectedChatMessages.some(msg => msg._id === message._id)) {
            console.warn("⚠️ Invalid or duplicate message detected. Skipping...");
            return;
        }

        // 🔹 Ensure correct sender/recipient format
        const newMessage = {
            ...message,
            recipient: message?.recipient?._id || message?.recipient || "unknown",
            sender: message?.sender?._id || message?.sender || "unknown",
        };

        // 🔹 Create new array instead of mutating existing state
        const updatedMessages = [...selectedChatMessages, newMessage];

        console.log("✅ Zustand: After Update Messages:", updatedMessages);

        set({ selectedChatMessages: updatedMessages });
    },
});
