import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { toast } from "react-toastify";

const chat = () => {
    const { userInfo } = useAppStore();
    const navigate = useNavigate();
    useEffect(() => {
      if ( !userInfo.profileSetup) {
        toast("Please complete your profile to continue");
        navigate("/profile");
      }
    }, [userInfo, navigate]);
    return <div>chat</div>;
};

export default chat; 