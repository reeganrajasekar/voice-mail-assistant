
import React from 'react';
import { Search, Bell, Menu, Mic, MicOff, Settings, HelpCircle } from 'lucide-react';
import { VoiceAssistant } from '../utils/voiceUtils';

interface HeaderProps {
  toggleSidebar: () => void;
  voiceAssistantActive: boolean;
  toggleVoiceAssistant: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  toggleSidebar, 
  voiceAssistantActive, 
  toggleVoiceAssistant 
}) => {
  const assistant = VoiceAssistant.getInstance();

  const handleVoiceAssistantToggle = () => {
    toggleVoiceAssistant();
    if (!voiceAssistantActive) {
      assistant.speak("Voice assistant activated. How can I help you?");
    } else {
      assistant.speak("Voice assistant deactivated", () => {
        assistant.deactivate();
      });
    }
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 border-b border-gmail-border bg-white shadow-sm animate-fade-in">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="p-2 rounded-full hover:bg-gmail-hover"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center">
          <span className="text-gmail-primary text-xl font-medium mr-1">Voice</span>
          <span className="text-gray-600 text-xl font-normal">Mail</span>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="search"
            className="w-full py-2 pl-10 pr-4 bg-gmail-hover border-none rounded-full focus:outline-none focus:ring-2 focus:ring-gmail-primary"
            placeholder="Search emails"
            aria-label="Search emails"
          />
        </div>
      </div>
      
      {/* Right section */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleVoiceAssistantToggle}
          aria-label={voiceAssistantActive ? "Deactivate voice assistant" : "Activate voice assistant"}
          className={`btn-voice ${voiceAssistantActive ? 'bg-red-500' : 'bg-gmail-primary'}`}
        >
          {voiceAssistantActive ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        
        <button 
          aria-label="Help"
          className="p-2 rounded-full hover:bg-gmail-hover"
        >
          <HelpCircle size={20} className="text-gray-600" />
        </button>
        
        <button 
          aria-label="Settings"
          className="p-2 rounded-full hover:bg-gmail-hover"
        >
          <Settings size={20} className="text-gray-600" />
        </button>
        
        <button 
          aria-label="Notifications"
          className="p-2 rounded-full hover:bg-gmail-hover"
        >
          <Bell size={20} className="text-gray-600" />
        </button>
        
        <button 
          aria-label="User profile"
          className="w-9 h-9 rounded-full bg-gmail-primary text-white flex items-center justify-center"
        >
          <span className="font-medium text-sm">U</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
