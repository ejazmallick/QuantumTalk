import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";

const ChatContainer = () => {
    return (
        <div className="flex flex-col flex-grow h-screen bg-[#1c1d25]">
            <ChatHeader />
            <MessageBar />
        </div>
    );
};

export default ChatContainer;
