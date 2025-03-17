import ProfileInfo from "./components/profile-info"; // Ensure correct import
import { useAppStore } from '@/store'; // Corrected import path for Zustand store
import NewDM from "./components/profile-info/new-dm";

const ContactsContainer = () => {
  const { userInfo, setSelectedChatType } = useAppStore(); // Include setSelectedChatType

  return (
    <div className="flex flex-col h-screen w-75 bg-[#1b1c24] border-r-2 border-[#2f303b]">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="flex items-center justify-between my-5 px-4">
        <Title text="Direct Messages" />
        <NewDM />
      </div>

      <div className="my-2 flex items-center justify-between px-4" onClick={() => setSelectedChatType('someChatType')}>
        <Title text="Channels" />
      </div>

      {/* Push everything up */}
      <div className="flex-grow"></div>

      {/* Profile */}
      <ProfileInfo user={userInfo} />
    </div>
  );
};

export default ContactsContainer;

// Logo Component
const Logo = () => {
  return (
    <div className="flex p-5 justify-center items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M55.5 0H77.5L58.5 32h36.5L55.5 0Z" fill="#8338ec"></path>
        <path d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z" fill="#975aed"></path>
        <path d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z" fill="#a16ee8"></path>
      </svg>
      <span className="text-3xl font-semibold text-white">Quantum</span>
    </div>
  );
};

// Title Component
const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm hover:text-white transition duration-200">
      {text}
    </h6>
  );
};
