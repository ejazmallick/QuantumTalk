import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store"; // Zustand store
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { MdSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { useSocket } from "../../../../../../context/SocketContext";
import { UPLOAD_FILE_ROUTE } from "../../../../../../utils/constants";
import apiClient from "../../../../../../lib/api-client"; // ✅ Ensure apiClient is imported

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const { socket } = useSocket();
  const { selectedChatType, selectedChatData, userInfo, addMessage } = useAppStore();

  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    if (!message.trim() && !file) return;

    if (!userInfo || !userInfo._id || !selectedChatData?._id || !socket?.connected) {
      console.error("❌ Missing required data to send message.");
      return;
    }

    const newMessage = {
      _id: Date.now().toString(),
      sender: { _id: userInfo._id },
      recipient: { _id: selectedChatData._id },
      messageType: file ? "file" : "text",
      content: file ? file.url : message,
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", newMessage, (ack) => {
      if (ack?.error) {
        console.error("❌ Error sending message:", ack.error);
      } else {
        addMessage({ ...newMessage, _id: ack.messageId || newMessage._id });
      }
    });

    setMessage("");
    setFile(null);
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleAttachmentChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, { withCredentials: true });

      if (response.status === 200 && response.data) {
        const fileUrl = response.data.filePath;

        const newFileMessage = {
          sender: userInfo._id,
          content: fileUrl, // ✅ Now correctly setting the file URL
          recipient: selectedChatData._id,
          messageType: "file",
          fileUrl,
        };

        socket.emit("newMessage", newFileMessage);

        setFile({ name: selectedFile.name, url: fileUrl });
      }
    } catch (error) {
      console.error("❌ Error uploading file:", error);
    } finally {
      setUploading(false);
    }
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
                <EmojiPicker theme="dark" onEmojiClick={handleAddEmoji} autoFocusSearch={false} emojiStyle="native" />
              </div>
            )}

            <button
              className="text-neutral-400 hover:text-white transition duration-300 p-2 rounded-full"
              onClick={handleAttachmentClick}
              disabled={uploading}
            >
              {uploading ? "⏳" : <GrAttachment className="text-xl" />}
            </button>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
          </div>

          {/* Message Input */}
          <input
            type="text"
            className="flex-1 px-3 py-1 bg-transparent focus:outline-none text-white placeholder-neutral-500 text-sm"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }} // 🚀 Press "Enter" to send, Shift+Enter for new line
            disabled={uploading}
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            className={`${
              message.trim() || file ? "bg-[#8417ff] hover:bg-[#741bda]" : "bg-gray-500 cursor-not-allowed"
            } text-white rounded-full p-3 transition duration-300 flex items-center justify-center ml-2`}
            disabled={!message.trim() && !file}
          >
            <MdSend className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBar;
