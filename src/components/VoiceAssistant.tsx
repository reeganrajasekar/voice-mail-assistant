
import React, { useEffect, useState, useRef } from 'react';
import { Mic, X, Volume2, VolumeX, Settings, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import { VoiceAssistant as VoiceAssistantUtil, SpeechRecognition, TextToSpeech } from '../utils/voiceUtils';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface VoiceAssistantProps {
  isActive: boolean;
  onToggle: () => void;
  onSelectFolder: (folder: string) => void;
  onReadEmail: (emailId: string) => void;
  onNavigateBack: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  isActive,
  onToggle,
  onSelectFolder,
  onReadEmail,
  onNavigateBack
}) => {
  const [expanded, setExpanded] = useState(true); // Start expanded to show UI feedback
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechRate, setSpeechRate] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [microphoneError, setMicrophoneError] = useState<string | null>(null);
  const assistantInstance = useRef(VoiceAssistantUtil.getInstance()).current;
  const recognitionInstance = useRef(SpeechRecognition.getInstance()).current;
  const ttsInstance = useRef(TextToSpeech.getInstance()).current;
  const { toast } = useToast();

  // Update listening status when voice assistant is toggled
  useEffect(() => {
    setIsListening(isActive);
    
    if (isActive) {
      // Clear any previous errors
      setMicrophoneError(null);
      
      // Expand the UI when activated
      setExpanded(true);
      
      // Check for microphone permission first
      checkMicrophonePermission();
      
      // Announce that the assistant is listening
      toast({
        title: "Voice Assistant",
        description: "Voice assistant is listening for commands",
      });
    }
  }, [isActive, toast]);

  // Function to check microphone permission
  const checkMicrophonePermission = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneError(null);
      
      // Once we have permission, start recognition
      startRecognition();
    } catch (error) {
      console.error("Microphone permission error:", error);
      
      // Set specific error message based on error type
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          setMicrophoneError("Microphone access denied. Please allow microphone access in your browser settings.");
        } else if (error.name === "NotFoundError") {
          setMicrophoneError("No microphone detected. Please connect a microphone and try again.");
        } else {
          setMicrophoneError(`Microphone access error: ${error.message}`);
        }
      } else {
        setMicrophoneError("Could not access microphone. Please check your device and browser settings.");
      }
      
      // Also show toast for immediate feedback
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Register voice commands
    if (isActive) {
      // Enhanced commands for blind users
      
      // Command to read the current email
      assistantInstance.registerCommand("read email", () => {
        assistantInstance.speak("Reading current email");
        // This will trigger onReadEmail with the currently selected email
        const announceText = "Reading email content now";
        toast({
          title: "Voice Assistant",
          description: announceText,
        });
        assistantInstance.speak(announceText);
      });
      
      // Command to summarize the email
      assistantInstance.registerCommand("summarize", () => {
        const announceText = "Summarizing the current email content";
        toast({
          title: "Voice Assistant",
          description: announceText,
        });
        assistantInstance.speak(announceText);
        // In a real app, this would call an AI service to summarize the email
      });

      // Command to reply to email
      assistantInstance.registerCommand("reply", () => {
        const announceText = "Opening reply composer";
        toast({
          title: "Voice Assistant",
          description: announceText,
        });
        assistantInstance.speak(announceText);
        // This would open the reply composer
      });

      // Command to delete email
      assistantInstance.registerCommand("delete", () => {
        const announceText = "Deleting current email";
        toast({
          title: "Voice Assistant", 
          description: announceText,
        });
        assistantInstance.speak(announceText);
        // This would delete the current email
      });

      // Command to mark as important
      assistantInstance.registerCommand("mark important", () => {
        const announceText = "Marking email as important";
        toast({
          title: "Voice Assistant",
          description: announceText,
        });
        assistantInstance.speak(announceText);
        // This would mark the email as important
      });

      // Command to navigate to a folder
      assistantInstance.registerCommand("open", (args) => {
        if (args) {
          const folder = args.toLowerCase();
          if (["inbox", "starred", "sent", "drafts", "trash", "spam"].includes(folder)) {
            const announceText = `Opening ${folder} folder`;
            toast({
              title: "Voice Assistant",
              description: announceText,
            });
            assistantInstance.speak(announceText);
            onSelectFolder(folder);
          } else {
            assistantInstance.speak(`I couldn't find a folder named ${folder}`);
          }
        }
      });

      // Command to go back
      assistantInstance.registerCommand("go back", () => {
        const announceText = "Going back to email list";
        toast({
          title: "Voice Assistant",
          description: announceText,
        });
        assistantInstance.speak(announceText);
        onNavigateBack();
      });

      // Enhanced accessibility commands
      assistantInstance.registerCommand("describe page", () => {
        const currentPage = "You are in the email viewer. You can use voice commands to navigate and manage your emails.";
        assistantInstance.speak(currentPage);
      });

      // Set voice settings
      assistantInstance.registerCommand("speed", (args) => {
        if (args) {
          const speed = parseFloat(args);
          if (!isNaN(speed) && speed >= 0.5 && speed <= 2) {
            setSpeechRate(speed);
            ttsInstance.setDefaultOptions({ rate: speed });
            assistantInstance.speak(`Speech rate set to ${speed}`);
          } else {
            assistantInstance.speak("Speed should be between 0.5 and 2");
          }
        }
      });

      // Set volume
      assistantInstance.registerCommand("volume", (args) => {
        if (args) {
          const volume = parseFloat(args);
          if (!isNaN(volume) && volume >= 0 && volume <= 1) {
            setSpeechVolume(volume);
            ttsInstance.setDefaultOptions({ volume });
            assistantInstance.speak(`Volume set to ${volume}`);
          } else {
            assistantInstance.speak("Volume should be between 0 and 1");
          }
        }
      });

      // New command to retry microphone access if there was an error
      assistantInstance.registerCommand("retry microphone", () => {
        assistantInstance.speak("Retrying microphone access");
        checkMicrophonePermission();
      });
    } else {
      // Stop listening when inactive
      recognitionInstance.stop();
    }

    return () => {
      // Clean up
      recognitionInstance.stop();
    };
  }, [isActive, assistantInstance, recognitionInstance, ttsInstance, onSelectFolder, onNavigateBack, toast]);

  // New function to start recognition with proper error handling
  const startRecognition = () => {
    try {
      recognitionInstance.start(
        { 
          continuous: true, 
          interimResults: true 
        }, 
        (result, isFinal) => {
          // Show interim results (what you're currently saying)
          if (!isFinal) {
            setInterimTranscript(result);
          } else {
            // When a phrase is finalized
            setInterimTranscript('');
            setTranscript(result);
            setCommandHistory(prev => [result, ...prev].slice(0, 5));
            
            // Also log to console for debugging
            console.log("Recognized speech (final):", result);
          }
        }
      );
      setIsListening(true);
      setMicrophoneError(null);
      
      // Add event handlers for recognition errors and status changes
      recognitionInstance.onError((error) => {
        console.error("Speech recognition error:", error);
        setIsListening(false);
        
        // Set appropriate error message based on error type
        if (error === "audio-capture") {
          setMicrophoneError("Could not capture audio. Please check your microphone connection and permissions.");
        } else if (error === "not-allowed") {
          setMicrophoneError("Microphone access denied. Please allow microphone access in your browser settings.");
        } else if (error === "no-speech") {
          // For no-speech, just reset listening state but don't show permanent error
          setMicrophoneError(null);
        } else {
          setMicrophoneError(`Recognition error: ${error}. Please try again.`);
        }
        
        toast({
          title: "Voice Assistant Error",
          description: `Recognition error: ${error}. ${error === "audio-capture" ? "Please check your microphone connection." : "Try again."}`,
          variant: "destructive",
        });
        
        // Only try to restart for certain errors
        if (error === "no-speech" || error === "aborted") {
          setTimeout(startRecognition, 1000);
        }
      });
      
      recognitionInstance.onEnd(() => {
        console.log("Recognition ended");
        setIsListening(false);
        
        // Only restart if the assistant is still active and there's no microphone error
        if (isActive && !microphoneError) {
          setTimeout(startRecognition, 500);
        }
      });
      
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setMicrophoneError("Could not start speech recognition. Please check browser permissions.");
      toast({
        title: "Voice Assistant Error",
        description: "Could not start speech recognition. Please check browser permissions.",
        variant: "destructive",
      });
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    setSpeechRate(rate);
    ttsInstance.setDefaultOptions({ rate });
    assistantInstance.speak(`Speech rate set to ${rate}`);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setSpeechVolume(volume);
    ttsInstance.setDefaultOptions({ volume });
  };

  const handleStop = () => {
    if (ttsInstance.isSpeaking()) {
      ttsInstance.stop();
    }
  };

  const handleRetryMicrophone = () => {
    checkMicrophonePermission();
  };

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out
                 ${expanded ? 'w-80' : 'w-auto'} animate-scale`}
      style={{ 
        maxHeight: expanded ? '500px' : '60px',
        transform: isActive ? 'scale(1)' : 'scale(0.95)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gmail-primary text-white">
        <button
          onClick={toggleExpanded}
          aria-label={expanded ? "Collapse voice assistant panel" : "Expand voice assistant panel"}
          className="flex items-center gap-2"
        >
          <Mic size={20} className={isListening ? "animate-pulse text-red-200" : ""} />
          <span className="font-medium">Voice Assistant</span>
          {expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleStop}
            aria-label="Stop speaking"
            className="p-1 rounded-full hover:bg-white/20"
          >
            <VolumeX size={18} />
          </button>
          
          <button
            onClick={onToggle}
            aria-label={isActive ? "Deactivate voice assistant" : "Activate voice assistant"}
            className={`p-1 rounded-full ${isActive ? 'bg-white/20' : 'hover:bg-white/20'}`}
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {expanded && (
        <>
          {/* Microphone Error Alert */}
          {microphoneError && (
            <Alert variant="destructive" className="m-3">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Microphone Error</AlertTitle>
              <AlertDescription>
                {microphoneError}
                <button 
                  onClick={handleRetryMicrophone}
                  className="block mt-2 text-sm underline"
                >
                  Retry microphone access
                </button>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Current transcript with listening status */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">I heard:</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${isListening ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {isListening ? 'Listening...' : 'Not listening'}
              </span>
            </div>
            
            <div className="bg-gray-50 p-3 rounded min-h-[3.5rem] relative">
              {/* Display the final transcript */}
              <p className="text-gray-800 mb-1">
                {transcript || "Say something..."}
              </p>
              
              {/* Display the interim transcript in italics if available */}
              {interimTranscript && (
                <p className="text-gray-500 italic text-sm">
                  {interimTranscript}
                </p>
              )}
              
              {/* Visual indicator that microphone is active */}
              {isListening && (
                <div className="absolute right-2 top-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
          
          {/* Command history */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Recent commands:</h3>
            {commandHistory.length > 0 ? (
              <ul className="text-sm space-y-1 max-h-20 overflow-y-auto">
                {commandHistory.map((cmd, idx) => (
                  <li key={idx} className="text-gray-600">• {cmd}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm italic">No recent commands</p>
            )}
          </div>
          
          {/* Settings */}
          <div className="p-4">
            <h3 className="flex items-center text-sm font-medium text-gray-500 mb-3">
              <Settings size={14} className="mr-1" />
              Voice Settings
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="flex items-center justify-between text-sm text-gray-600">
                  <span>Speech Rate: {speechRate.toFixed(1)}x</span>
                </label>
                <input 
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={handleRateChange}
                  className="w-full accent-gmail-primary"
                />
              </div>
              
              <div>
                <label className="flex items-center justify-between text-sm text-gray-600">
                  <span>Volume: {Math.round(speechVolume * 100)}%</span>
                </label>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={speechVolume}
                  onChange={handleVolumeChange}
                  className="w-full accent-gmail-primary"
                />
              </div>
            </div>
          </div>
          
          {/* Help text */}
          <div className="p-4 bg-gray-50 text-xs text-gray-500">
            <p className="font-medium mb-1">Available commands:</p>
            <ul className="space-y-1">
              <li>• "open inbox/starred/sent/etc"</li>
              <li>• "read email"</li>
              <li>• "summarize"</li>
              <li>• "reply"</li>
              <li>• "delete"</li>
              <li>• "mark important"</li>
              <li>• "go back"</li>
              <li>• "speed 0.8" (0.5-2.0)</li>
              <li>• "volume 0.5" (0-1)</li>
              <li>• "retry microphone"</li>
              <li>• "help"</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default VoiceAssistant;
