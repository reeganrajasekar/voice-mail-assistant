
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import EmailList from '../components/EmailList';
import EmailDetail from '../components/EmailDetail';
import VoiceAssistant from '../components/VoiceAssistant';
import { VoiceAssistant as VoiceAssistantUtil, formatMultipleEmailsForSpeech, formatUnreadEmailsForSpeech } from '../utils/voiceUtils';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEmailsByFolder } from '../utils/emailData';

const Index = () => {
  // State for UI
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [voiceAssistantActive, setVoiceAssistantActive] = useState(false);
  const [microphoneError, setMicrophoneError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize voice assistant with additional commands for blind users
  useEffect(() => {
    const assistant = VoiceAssistantUtil.getInstance();
    
    // Register commands when component mounts
    assistant.registerCommand("open sidebar", () => {
      setSidebarVisible(true);
      assistant.speak("Sidebar opened");
      toast({
        title: "Voice Assistant",
        description: "Sidebar opened",
      });
    });
    
    assistant.registerCommand("close sidebar", () => {
      setSidebarVisible(false);
      assistant.speak("Sidebar closed");
      toast({
        title: "Voice Assistant",
        description: "Sidebar closed",
      });
    });

    // Command to activate voice assistant
    assistant.registerCommand("activate voice", () => {
      setVoiceAssistantActive(true);
      activateVoiceAssistant();
      toast({
        title: "Voice Assistant",
        description: "Voice assistant activated",
      });
    });

    // NEW: Add commands to read all emails and unread emails
    assistant.registerCommand("read all emails", () => {
      const allEmails = getEmailsByFolder(activeFolder);
      const speechText = formatMultipleEmailsForSpeech(allEmails, false);
      assistant.speak(speechText);
      toast({
        title: "Voice Assistant",
        description: "Reading all emails",
      });
    });
    
    assistant.registerCommand("read all mail", () => {
      const allEmails = getEmailsByFolder(activeFolder);
      const speechText = formatMultipleEmailsForSpeech(allEmails, false);
      assistant.speak(speechText);
      toast({
        title: "Voice Assistant",
        description: "Reading all emails",
      });
    });
    
    assistant.registerCommand("read unread emails", () => {
      const allEmails = getEmailsByFolder(activeFolder);
      const speechText = formatUnreadEmailsForSpeech(allEmails);
      assistant.speak(speechText);
      toast({
        title: "Voice Assistant",
        description: "Reading unread emails",
      });
    });
    
    assistant.registerCommand("read unread mail", () => {
      const allEmails = getEmailsByFolder(activeFolder);
      const speechText = formatUnreadEmailsForSpeech(allEmails);
      assistant.speak(speechText);
      toast({
        title: "Voice Assistant",
        description: "Reading unread emails",
      });
    });

    // Add welcome announcement for screen readers when the app first loads
    const welcomeMessage = "Welcome to Voice Mail. Voice assistant is available. Say 'activate voice' to turn it on.";
    setTimeout(() => {
      toast({
        title: "Voice Mail",
        description: welcomeMessage,
      });
      
      // Also speak the welcome message for blind users
      assistant.speak(welcomeMessage);
    }, 1000);
    
    // Clean up when component unmounts
    return () => {
      assistant.deactivate();
    };
  }, [toast, activeFolder]);

  // Function to handle microphone permissions and activate voice assistant
  const activateVoiceAssistant = async () => {
    try {
      console.log("Requesting microphone permission from Index component...");
      
      // Request microphone permission - just to check if we have access
      // The actual audio processing will happen in the VoiceAssistant component
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneError(null);
      
      // Stop tracks to release the microphone (important for mobile devices)
      stream.getTracks().forEach(track => track.stop());
      
      // Set the state to activate the assistant component
      setVoiceAssistantActive(true);
      
      // Notification that assistant is activated
      toast({
        title: "Voice Assistant",
        description: "Voice assistant activated. You can now speak commands.",
      });
    } catch (error) {
      console.error("Microphone permission error:", error);
      
      // Set specific error message based on error type
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          setMicrophoneError("Microphone access denied. Please allow microphone access in your browser settings.");
        } else if (error.name === "NotFoundError") {
          setMicrophoneError("No microphone detected. Please connect a microphone and try again.");
        } else if (error.name === "NotReadableError" || error.name === "AbortError") {
          setMicrophoneError("Could not access microphone. It may be in use by another application.");
        } else {
          setMicrophoneError(`Microphone access error: ${error.name}. Please check your device.`);
        }
      } else {
        setMicrophoneError("Could not access microphone. Please check your device and browser settings.");
      }
      
      // Show toast for immediate feedback
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Toggle voice assistant
  const toggleVoiceAssistant = () => {
    if (!voiceAssistantActive) {
      // If activating, check microphone first
      activateVoiceAssistant();
    } else {
      // If deactivating, just turn it off
      const assistant = VoiceAssistantUtil.getInstance();
      assistant.deactivate();
      setVoiceAssistantActive(false);
      toast({
        title: "Voice Assistant",
        description: "Voice assistant deactivated",
      });
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

  // Retry microphone access
  const retryMicrophoneAccess = () => {
    setMicrophoneError(null);
    activateVoiceAssistant();
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
        voiceAssistantActive={voiceAssistantActive}
        toggleVoiceAssistant={toggleVoiceAssistant}
      />
      
      {/* Microphone Error Banner (if needed) */}
      {microphoneError && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertTitle className="flex items-center gap-2">
            <Mic size={16} />
            Microphone Access Error
          </AlertTitle>
          <AlertDescription>
            {microphoneError}
            <Button 
              onClick={retryMicrophoneAccess}
              className="mt-2 w-full"
              variant="outline"
              size="sm"
            >
              Retry Microphone Access
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
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
