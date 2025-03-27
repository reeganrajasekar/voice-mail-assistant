
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { TextToSpeech, formatEmailForSpeech } from "@/utils/voiceUtils";

interface SpeechButtonProps {
  email: any;
}

const SpeechButton: React.FC<SpeechButtonProps> = ({ email }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const tts = TextToSpeech.getInstance();

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      tts.stop();
      setIsSpeaking(false);
    } else {
      const formattedText = formatEmailForSpeech(email);
      tts.speak(formattedText, {}, () => {
        setIsSpeaking(false);
      });
      setIsSpeaking(true);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={handleToggleSpeech}
      aria-label={isSpeaking ? "Stop speaking" : "Read email aloud"}
    >
      {isSpeaking ? (
        <>
          <VolumeX size={16} />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 size={16} />
          <span>Read aloud</span>
        </>
      )}
    </Button>
  );
};

export default SpeechButton;
