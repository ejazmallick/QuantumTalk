import ChatHeader from "./components/chat-header";
import MessageList from "./components/message-list"; // Correct import path
import MessageBar from "./components/message-bar";

const ChatContainer = () => {
  return (
    <div className="flex flex-col flex-grow h-screen bg-[#1c1d25]">
      <ChatHeader />
      
      {/* ✅ Add MessageList to display messages */}
      <div className="flex-grow overflow-y-auto p-4">
        <MessageList />
      </div>

      <MessageBar />
    </div>
  );
};

export default ChatContainer;