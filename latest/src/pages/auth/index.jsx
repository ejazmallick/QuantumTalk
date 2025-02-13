//import background from '../../assets/login2.png';
// import victory from "../../assets/victory.svg";
import { MessageCircle, Users, Zap, ArrowRight } from "lucide-react";
import {Link} from 'react-router-dom';
import { TabsList } from "../../components/ui/tabs";

const Auth = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col">
      {/* Navigation */}
      <nav className="w-full p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">ChatWave</span>
          </div>
          <div className="space-x-4">
         
       

            <Link to="/login">
              <button className="bg-white text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg">Login</button>
            </Link>
            <Link to="/signup">
              <button className="bg-white text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg">Sign Up</button>
            </Link>
       
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Welcome to ChatWave
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Connect, collaborate, and chat in real-time with friends and
              colleagues. Experience the next level of communication.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-100">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button> */}
              {/* <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-indigo-600"
            >
              Learn More
            </Button> */}
            </div>
          </div>
          <div className="lg:w-1/2">
            {/* <Image
            src="/placeholder.svg?height=400&width=400"
            alt="ChatWave App"
            width={400}
            height={400}
            className="rounded-lg shadow-2xl"
          /> */}
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose ChatWave?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageCircle className="w-12 h-12 text-indigo-600" />}
              title="Real-time Messaging"
              description="Instantly connect with your contacts and enjoy seamless conversations."
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-indigo-600" />}
              title="Group Chats"
              description="Create and manage group conversations for team collaboration or friend circles."
            />
            <FeatureCard
              icon={<Zap className="w-12 h-12 text-indigo-600" />}
              title="Fast & Secure"
              description="Experience lightning-fast messaging with end-to-end encryption for your privacy."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xl font-semibold">ChatWave</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-indigo-200">
              About
            </a>
            <a href="#" className="hover:text-indigo-200">
              Privacy
            </a>
            <a href="#" className="hover:text-indigo-200">
              Terms
            </a>
            <a href="#" className="hover:text-indigo-200">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Auth;
