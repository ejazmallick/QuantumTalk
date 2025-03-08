import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { toast } from "react-toastify";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const { userInfo, selectedChatType } = useAppStore();
  const navigate = useNavigate();
  const [toastShown, setToastShown] = useState(false); // Prevent duplicate toasts

  useEffect(() => {
    if (!userInfo) return; // Wait for userInfo to load

    if (!userInfo.profileSetup && !toastShown) {
      toast.warn("Please complete your profile to continue");
      setToastShown(true); // Prevent duplicate toasts
      navigate("/profile", { replace: true }); // Redirect if profile isn't set up
    }
  }, [userInfo, navigate, toastShown]);

  if (!userInfo || !userInfo.profileSetup) {
    return null; // Avoid rendering chat if profile setup isn't done
  }

  return (
    <div className="relative flex h-screen text-white overflow-hidden"> 
      <ContactsContainer/>
    {
      selectedChatType=== undefined ? (
        <EmptyChatContainer/>
      ) : (
        <ChatContainer/>
      )
    }
    </div>
  );
};

export default Chat;
