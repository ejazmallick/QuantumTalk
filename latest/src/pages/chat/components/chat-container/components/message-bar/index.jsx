import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store"; // Zustand store
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { MdSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

const MessageBar = () => {
  const emojiRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSend = async () => {
    useAppStore.getState().addMessage(message);
    console.log("Message:", message);
    console.log("Image:", image);
    setMessage("");
    setImage(null);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#1c1d25] px-4 py-3 flex justify-center items-center rounded-full shadow-lg max-w-xl w-[80%] md:w-[50%]">
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
          onClick={handleSend}
          className="bg-[#8417ff] hover:bg-[#741bda] text-white rounded-full p-3 transition duration-300 flex items-center justify-center ml-2"
        >
          <MdSend className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default MessageBar;
