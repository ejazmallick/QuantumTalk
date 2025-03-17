import { useEffect, useRef } from "react";
import { useAppStore } from "../../../../../../store";
import moment from "moment";

const MessageContainer = () => {
  const scrollRef = useRef();

  const { selectedChatMessages, selectedChatType, selectedChatData, userInfo, forceUpdate } = useAppStore();

  console.log("🎯 UI Render - Selected Messages:", selectedChatMessages);

  useEffect(() => {
    console.log("📨 UI Updated with New Messages:", selectedChatMessages);

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  }, [selectedChatMessages, forceUpdate]);

  const renderMessages = () => {
    if (!selectedChatData) return <p className="text-center text-gray-500">No chat selected</p>;

    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id || index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "dm" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    const isSentByCurrentUser = message.sender?._id === userInfo._id || message.sender === userInfo._id;

    return (
      <div className={`my-2 ${isSentByCurrentUser ? "text-right" : "text-left"}`}>
        <div
          className={`border inline-block p-4 rounded my-1 max-w-[50%] break-words 
          ${isSentByCurrentUser ? 
            "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20" : 
            "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
          }`}
        >
          {message.content}
        </div>
        <div className="text-xs text-gray-400">{moment(message.timestamp).format("LT")}</div>
      </div>
    );
  };

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {selectedChatMessages.length > 0 ? renderMessages() : (
        <p className="text-center text-gray-500">No messages yet</p>
      )}
    </div>
  );
};

export default MessageContainer;
