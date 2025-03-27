
import React from 'react';
import { Menu, Search, Settings, HelpCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-background border-b border-border flex items-center justify-between h-16 px-4">
      {/* Left section with menu toggle and logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="p-2 rounded-full hover:bg-accent"
        >
          <Menu size={20} className="text-foreground" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-medium text-lg">M</span>
          </div>
          <span className="text-xl font-medium hidden sm:inline text-foreground">Mail</span>
        </div>
      </div>
      
      {/* Search bar - centered on larger screens */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-muted-foreground" />
          </div>
          <Input
            type="search"
            placeholder="Search mail"
            className="w-full pl-10 focus-visible:ring-1 focus-visible:ring-border"
          />
        </div>
      </div>
      
      {/* Right section with settings, help, and theme toggle */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <button 
          aria-label="Settings"
          className="p-2 rounded-full hover:bg-accent"
        >
          <Settings size={20} className="text-foreground" />
        </button>
        
        <button
          aria-label="Help"
          className="p-2 rounded-full hover:bg-accent"
        >
          <HelpCircle size={20} className="text-foreground" />
        </button>
      </div>
    </header>
  );
};

export default Header;
