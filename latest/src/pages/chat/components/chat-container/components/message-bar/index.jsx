import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store"; // Zustand store
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { MdSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { useSocket } from "../../../../../../context/SocketContext";

const MessageBar = () => {
  const emojiRef = useRef();
  const { socket } = useSocket();
  const { selectedChatType, selectedChatData, userInfo, addMessage } = useAppStore();

  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      console.log("⚠️ Message is empty. Not sending.");
      return;
    }
    if (!userInfo?._id) {
      console.error("❌ User info is missing. Cannot send message.");
      return;
    }

    if (!selectedChatData?._id) {
      console.error("❌ No recipient selected.");
      return;
    }

    if (!socket || !socket.connected) {
      console.error("❌ Socket is not connected. Message not sent.");
      return;
    }

    const newMessage = {
      _id: Date.now().toString(),
      sender: { _id: userInfo?._id },
      recipient: { _id: selectedChatData?._id },
      messageType: "text",
      content: message,
      timestamp: new Date().toISOString(),
    };

    console.log("📨 Sending message:", newMessage);

    // Optimistic UI update
    addMessage(newMessage);

    // Send message via socket with acknowledgment
    socket.emit("sendMessage", newMessage, (ack) => {
      if (ack?.error) {
        console.error("❌ Error sending message:", ack.error);
      } else {
        console.log("✅ Message sent successfully:", ack);
      }
    });

    setMessage("");
    setImage(null);
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full flex justify-center">
      <div className="bg-[#1c1d25] px-4 py-3 flex justify-center items-center rounded-full shadow-lg w-[90%] md:w-[60%] lg:w-[50%]">
        <div className="flex items-center bg-[#2a2b33] rounded-full border border-[#3a3b44] px-3 py-2 w-full">
          {/* Emoji Picker and Attachment Buttons */}
          <div className="relative flex items-center space-x-2">
            <button
              className="text-neutral-400 hover:text-white transition duration-300 p-2 rounded-full"
              onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
            >
              <RiEmojiStickerLine className="text-xl" />
            </button>

            {emojiPickerOpen && (
              <div
                className="absolute bottom-12 left-0 bg-[#2a2b33] rounded-lg shadow-lg border border-[#3a3b44] z-10"
                ref={emojiRef}
              >
                <EmojiPicker
                  theme="dark"
                  onEmojiClick={handleAddEmoji}
                  autoFocusSearch={false}
                  emojiStyle="native"
                />
              </div>
            )}

            <button className="text-neutral-400 hover:text-white transition duration-300 p-2 rounded-full">
              <GrAttachment className="text-xl" />
            </button>
          </div>

          {/* Message Input */}
          <input
            type="text"
            className="flex-1 px-3 py-1 bg-transparent focus:outline-none text-white placeholder-neutral-500 text-sm"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            className={`${
              message.trim() ? "bg-[#8417ff] hover:bg-[#741bda]" : "bg-gray-500 cursor-not-allowed"
            } text-white rounded-full p-3 transition duration-300 flex items-center justify-center ml-2`}
            disabled={!message.trim()}
          >
            <MdSend className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBar;