
import React from 'react';
import { Menu, Search, Settings, HelpCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gmail-border flex items-center justify-between h-16 px-4">
      {/* Left section with menu toggle and logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="p-2 rounded-full hover:bg-gmail-hover"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gmail-primary rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-lg">M</span>
          </div>
          <span className="text-xl font-medium hidden sm:inline">Mail</span>
        </div>
      </div>
      
      {/* Search bar - centered on larger screens */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search mail"
            className="w-full bg-gray-100 border-none pl-10 focus-visible:ring-1 focus-visible:ring-gmail-border"
          />
        </div>
      </div>
      
      {/* Right section with settings and help */}
      <div className="flex items-center gap-2">
        <button 
          aria-label="Settings"
          className="p-2 rounded-full hover:bg-gmail-hover"
        >
          <Settings size={20} />
        </button>
        
        <button
          aria-label="Help"
          className="p-2 rounded-full hover:bg-gmail-hover"
        >
          <HelpCircle size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
