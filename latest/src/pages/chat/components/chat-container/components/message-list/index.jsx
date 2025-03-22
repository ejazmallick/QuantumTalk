import React, { useEffect, useRef } from "react";
import { useAppStore } from "@/store"; // Zustand store

const MessageList = () => {
  const { selectedChatMessages, userInfo } = useAppStore();
  const messagesEndRef = useRef(null);

  // ✅ Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatMessages]);

  return (
    <div
      className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      style={{ paddingBottom: "80px" }} // Ensures space for MessageBar
    >
      {selectedChatMessages.map((message) => {
        const isOwnMessage = message.sender._id === userInfo?._id;

        return (
          <div
            key={message._id}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-lg max-w-[75%] text-sm shadow-md ${
                isOwnMessage
                  ? "bg-purple-600 text-white rounded-br-none"
                  : "bg-gray-700 text-white rounded-bl-none"
              }`}
            >
              {/* Sender Name (Only Show for Other Users) */}
              {!isOwnMessage && (
                <div className="text-xs text-gray-400 mb-1">{message.sender.name}</div>
              )}

              {/* Message Content */}
              <div>{message.content}</div>

              {/* Timestamp */}
              <div className="text-xs text-gray-300 mt-1 text-right">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* ✅ Auto-scroll target */}
      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
};

export default MessageList;
