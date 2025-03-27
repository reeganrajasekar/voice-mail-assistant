
import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import EmailList from '../components/EmailList';
import EmailDetail from '../components/EmailDetail';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  // State for UI
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const { toast } = useToast();

  // Add welcome announcement for screen readers when the app first loads
  React.useEffect(() => {
    const welcomeMessage = "Welcome to Mail Reader. Speech functionality is available to read emails aloud.";
    setTimeout(() => {
      toast({
        title: "Mail Reader",
        description: welcomeMessage,
      });
    }, 1000);
  }, [toast]);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Handle selecting a folder
  const handleFolderSelect = (folder: string) => {
    setActiveFolder(folder);
    setSelectedEmail(null);
  };

  // Handle going back from email detail to list
  const handleBackToList = () => {
    setSelectedEmail(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Skip to content link (for screen readers) */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:p-2 focus:bg-white focus:z-50 focus:outline focus:outline-2 focus:outline-blue-500">
        Skip to main content
      </a>
      
      {/* Header */}
      <Header 
        toggleSidebar={toggleSidebar} 
      />
      
      {/* Main content */}
      <main 
        id="main-content" 
        className="flex flex-1 overflow-hidden"
        tabIndex={-1}
      >
        {/* Sidebar */}
        <Sidebar 
          visible={sidebarVisible} 
          activeFolder={activeFolder} 
          setActiveFolder={handleFolderSelect}
        />
        
        {/* Email content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Show email list if no email is selected, otherwise show on larger screens only */}
          <div className={`${selectedEmail ? 'hidden md:flex' : 'flex'} flex-col flex-1 overflow-hidden`}>
            <EmailList 
              activeFolder={activeFolder} 
              selectedEmail={selectedEmail} 
              setSelectedEmail={setSelectedEmail}
            />
          </div>
          
          {/* Show email detail when an email is selected */}
          {selectedEmail && (
            <div className="flex-1 overflow-hidden">
              <EmailDetail 
                emailId={selectedEmail} 
                onBack={handleBackToList}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
