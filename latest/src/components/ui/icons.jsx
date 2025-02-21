import { Loader2, Moon, SunMedium, Twitter, Type, Github, ChromeIcon as Google } from "lucide-react";

export const Icons = {
  logo: Type,
  spinner: Loader2,
  sun: SunMedium,
  moon: Moon,
  twitter: Twitter,
  gitHub: Github,
  google: Google,
  user: () => (
    <svg role="img" aria-label="user" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-1.66 0-3-1.34-3-3 0-1.66 1.34-3 3-3 1.66 0 3 1.34 3 3 0 1.66-1.34 3-3 3zm0-10.4c-.83 0-1.5-.67-1.5-1.5 0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5c0 .83-.67 1.5-1.5 1.5z" />
    </svg>
  ),
  arrowLeft: () => (
    <svg role="img" aria-label="arrow-left" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L9.83 12z" />
    </svg>
  ),
};