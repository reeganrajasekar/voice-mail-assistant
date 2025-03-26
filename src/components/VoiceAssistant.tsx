import React, { useEffect, useState, useRef } from 'react';
import { Mic, X, Volume2, VolumeX, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { VoiceAssistant as VoiceAssistantUtil, SpeechRecognition, TextToSpeech } from '../utils/voiceUtils';
import { useToast } from "@/components/ui/use-toast";

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
  const [expanded, setExpanded] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechRate, setSpeechRate] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const assistantInstance = useRef(VoiceAssistantUtil.getInstance()).current;
  const recognitionInstance = useRef(SpeechRecognition.getInstance()).current;
  const ttsInstance = useRef(TextToSpeech.getInstance()).current;
  const { toast } = useToast();

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

      // Start listening for commands
      recognitionInstance.start({}, (result, isFinal) => {
        if (isFinal) {
          setTranscript(result);
          setCommandHistory(prev => [result, ...prev].slice(0, 5));
        }
      });

      return () => {
        recognitionInstance.stop();
      };
    }
  }, [isActive, assistantInstance, recognitionInstance, ttsInstance, onSelectFolder, onNavigateBack, toast]);

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

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out
                 ${expanded ? 'w-80' : 'w-auto'} animate-scale`}
      style={{ 
        maxHeight: expanded ? '400px' : '60px',
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
          <Mic size={20} />
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
          {/* Current transcript */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">I heard:</h3>
            <p className="text-gray-800 bg-gray-50 p-2 rounded min-h-[2.5rem]">
              {transcript || "Listening..."}
            </p>
          </div>
          
          {/* Command history */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Recent commands:</h3>
            {commandHistory.length > 0 ? (
              <ul className="text-sm space-y-1">
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
              <li>• "help"</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default VoiceAssistant;
