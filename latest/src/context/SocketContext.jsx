import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAppStore } from "../store"; // Zustand store
import { HOST } from "../utils/constants"; // Ensure HOST is correct

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const { userInfo } = useAppStore(); // ✅ Get user info from Zustand
    const [isConnected, setIsConnected] = useState(false);
    const [socketInstance, setSocketInstance] = useState(null);

    useEffect(() => {
        if (!userInfo) {
            console.warn("❌ No user info available, cannot connect to socket.");
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            console.warn("❌ No token found in localStorage. Cannot connect to socket.");
            return;
        }

        console.log("🔗 Connecting to socket with token:", token);

        if (socketRef.current) {
            console.log("🔄 Disconnecting existing socket before reconnecting...");
            socketRef.current.disconnect();
        }

        const newSocket = io(HOST, {
            transports: ["websocket"], // Ensure WebSocket transport is used
            withCredentials: true,
            auth: { token },
        });

        socketRef.current = newSocket;
        setSocketInstance(newSocket);

        // 🔹 Handle Connection Events
        newSocket.on("connect", () => {
            setIsConnected(true);
            console.log("✅ Connected to socket server with ID:", newSocket.id);
        });

        newSocket.on("disconnect", (reason) => {
            setIsConnected(false);
            console.warn("❌ Socket disconnected:", reason);
        });

        // 🔹 Handle Incoming Messages
        newSocket.on("receiveMessage", (message) => {
            console.log("📩 Received message via socket:", message);
            
            console.log("📩 New WebSocket message received:", message);

            if (!message?.sender?._id || !message?.recipient?._id) {
                console.warn("❌ Received message with missing sender or recipient. Ignoring.");
                return;
            }

            const { selectedChatType, selectedChatData, selectedChatMessages, addMessage } = useAppStore.getState();

            console.log("📝 Checking message validity:", {
                selectedChatType,
                selectedChatData: selectedChatData?._id,
                messageSender: message.sender._id,
                messageRecipient: message.recipient._id,
            });

            if (
                selectedChatType &&
                (selectedChatData?._id === message.sender._id || selectedChatData?._id === message.recipient._id)
            ) {
                // ✅ Ensure `selectedChatMessages` exists before checking duplicates
                if (selectedChatMessages?.some((msg) => msg._id === message._id)) {
                    console.warn("⚠️ Duplicate message detected. Skipping...");
                    return;
                }

                console.log("💬 Adding message to selected chat:", message);
                addMessage(message);
            } else {
                console.warn("⚠️ Message does not belong to the selected chat. Ignoring.");
            }
        });

        return () => {
            console.log("♻️ Cleaning up socket connection...");
            if (socketRef.current) {
                socketRef.current.off("receiveMessage");
                socketRef.current.off("connect");
                socketRef.current.off("disconnect");
                socketRef.current.disconnect();
            }
            setIsConnected(false);
        };
    }, [userInfo]); // ✅ Only re-run when `userInfo` changes

    // 🔹 Function to Send Messages
    const sendMessage = ({ recipient, messageType, content }) => {
        const sender = useAppStore.getState().userInfo; // ✅ Auto-fetch sender from Zustand

        if (!socketInstance) {
            console.error("❌ No socket connection available.");
            return;
        }

        if (!sender?._id || !recipient?._id) {
            console.error("❌ Invalid sender or recipient. Cannot send message.");
            return;
        }
        if (!recipient?._id || sender._id === recipient._id) {
            console.warn("⚠️ Invalid recipient! Sender and recipient are the same.");
            return;
        }

        console.log("📨 Sending message:", {
            sender: sender._id,
            recipient: recipient._id,
            messageType,
            content,
        });

        socketInstance.emit("sendMessage", {
            sender: { _id: sender._id },
            recipient: { _id: recipient._id },
            messageType,
            content,
        });
    };

    return (
        <SocketContext.Provider value={{ socket: socketInstance, isConnected, sendMessage }}>
            {children}
        </SocketContext.Provider>
    );
};
