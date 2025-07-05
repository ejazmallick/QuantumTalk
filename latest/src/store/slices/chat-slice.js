export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],

    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => {
        console.log("📥 Setting selected chat messages:", selectedChatMessages);
        set({ selectedChatMessages });
    },

    closeChat: () => set({
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: [],
    }),

    addMessage: (message) => {
        console.log("🟢 Debug: Adding message to Zustand:", message);
        const { selectedChatData, selectedChatMessages = [] } = get();

        console.log("📝 Zustand: Before Update Messages:", selectedChatMessages);
        console.log("📨 New message received:", message);

        if (!message || typeof message !== "object") {
            console.error("❌ Invalid message format. Skipping...");
            return;
        }

        if (!message.sender?._id || !message.recipient?._id) {
            console.warn("⚠️ Message is missing sender or recipient. Ignoring.");
            return;
        }

        if (!selectedChatData || (selectedChatData._id !== message.sender._id && selectedChatData._id !== message.recipient._id)) {
            console.warn("⚠️ Message does not belong to the selected chat. Skipping...");
            return;
        }

        if (selectedChatMessages.some(msg => msg._id === message._id)) {
            console.warn("⚠️ Duplicate message detected. Skipping...");
            return;
        }

        set((state) => ({
            selectedChatMessages: [...state.selectedChatMessages, message],
        }));

        console.log("✅ Zustand: After Update Messages:", get().selectedChatMessages);
    },
});
