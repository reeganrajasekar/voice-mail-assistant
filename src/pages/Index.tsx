
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import EmailList from '../components/EmailList';
import EmailDetail from '../components/EmailDetail';
import VoiceAssistant from '../components/VoiceAssistant';
import { VoiceAssistant as VoiceAssistantUtil } from '../utils/voiceUtils';

const Index = () => {
  // State for UI
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [voiceAssistantActive, setVoiceAssistantActive] = useState(false);

  // Initialize voice assistant
  useEffect(() => {
    const assistant = VoiceAssistantUtil.getInstance();
    
    // Register commands when component mounts
    assistant.registerCommand("open sidebar", () => {
      setSidebarVisible(true);
      assistant.speak("Sidebar opened");
    });
    
    assistant.registerCommand("close sidebar", () => {
      setSidebarVisible(false);
      assistant.speak("Sidebar closed");
    });
    
    // Clean up when component unmounts
    return () => {
      assistant.deactivate();
    };
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Toggle voice assistant
  const toggleVoiceAssistant = () => {
    setVoiceAssistantActive(!voiceAssistantActive);
    const assistant = VoiceAssistantUtil.getInstance();
    
    if (!voiceAssistantActive) {
      assistant.activate();
    } else {
      assistant.deactivate();
    }
  };

  // Handle selecting a folder
  const handleFolderSelect = (folder: string) => {
    setActiveFolder(folder);
    setSelectedEmail(null);
  };

  // Handle reading email with voice
  const handleReadEmail = (emailId: string) => {
    // This is handled in the EmailDetail component directly
  };

  // Handle going back from email detail to list
  const handleBackToList = () => {
    setSelectedEmail(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Skip to content link (for screen readers) */}
      <a href="#main-content" className="sr-only-focusable">
        Skip to main content
      </a>
      
      {/* Header */}
      <Header 
        toggleSidebar={toggleSidebar} 
        voiceAssistantActive={voiceAssistantActive}
        toggleVoiceAssistant={toggleVoiceAssistant}
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
      
      {/* Voice Assistant UI */}
      <VoiceAssistant 
        isActive={voiceAssistantActive}
        onToggle={toggleVoiceAssistant}
        onSelectFolder={handleFolderSelect}
        onReadEmail={handleReadEmail}
        onNavigateBack={handleBackToList}
      />
    </div>
  );
};

export default Index;
