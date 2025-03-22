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
        console.log("🟢 Debug: Adding message to Zustand:", message);
        const { selectedChatData, selectedChatMessages = [] } = get();

        console.log("📝 Zustand: Before Update Messages:", selectedChatMessages);
        console.log("📨 New message received:", message);

        // 🔹 Validate message format
        if (!message || typeof message !== "object") {
            console.error("❌ Invalid message format. Skipping...");
            return;
        }

        // 🔹 Ensure sender & recipient are valid
        if (!message.sender?._id || !message.recipient?._id) {
            console.warn("⚠️ Message is missing sender or recipient. Ignoring.");
            return;
        }

        // 🔹 Ignore messages that don't belong to the selected chat
        if (
            !selectedChatData ||
            (selectedChatData._id !== message.sender._id && selectedChatData._id !== message.recipient._id)
        ) {
            console.warn("⚠️ Message does not belong to the selected chat. Skipping...");
            return;
        }

        // 🔹 Avoid duplicate messages (if `_id` exists)
        if (selectedChatMessages.some(msg => msg._id === message._id)) {
            console.warn("⚠️ Duplicate message detected. Skipping...");
            return;
        }

        // 🔹 Update Zustand state
        set((state) => ({
            selectedChatMessages: [...state.selectedChatMessages, message],
        }));

        console.log("✅ Zustand: After Update Messages:", get().selectedChatMessages);
    },
});
