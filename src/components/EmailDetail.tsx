
import React from 'react';
import { ArrowLeft, Star, Reply, Trash, Mail, Volume2, VolumeX } from 'lucide-react';
import { Email, getEmailById } from '../utils/emailData';
import { VoiceAssistant, formatEmailForSpeech, TextToSpeech } from '../utils/voiceUtils';

interface EmailDetailProps {
  emailId: string | null;
  onBack: () => void;
}

const EmailDetail: React.FC<EmailDetailProps> = ({ emailId, onBack }) => {
  const [email, setEmail] = React.useState<Email | null>(null);
  const [isReading, setIsReading] = React.useState(false);
  const voiceAssistant = VoiceAssistant.getInstance();
  const tts = TextToSpeech.getInstance();

  React.useEffect(() => {
    if (emailId) {
      const selectedEmail = getEmailById(emailId);
      if (selectedEmail) {
        setEmail(selectedEmail);
      }
    } else {
      setEmail(null);
    }
  }, [emailId]);

  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white border-l border-gmail-border">
        <p className="text-gray-500">Select an email to view</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const handleReadEmail = () => {
    if (isReading) {
      // Use the TTS instance to stop reading
      tts.stop();
      setIsReading(false);
    } else {
      const emailText = formatEmailForSpeech(email);
      voiceAssistant.speak(emailText, () => {
        setIsReading(false);
      });
      setIsReading(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white border-l border-gmail-border overflow-auto animate-fade-in">
      {/* Email header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gmail-border">
        <div className="p-3 flex items-center justify-between">
          <button 
            onClick={onBack}
            aria-label="Back to email list"
            className="p-2 rounded-full hover:bg-gmail-hover"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleReadEmail}
              aria-label={isReading ? "Stop reading email" : "Read email aloud"}
              className={`p-2 rounded-full hover:bg-gmail-hover ${isReading ? 'text-gmail-primary' : ''}`}
            >
              {isReading ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            <button 
              aria-label="Reply to email"
              className="p-2 rounded-full hover:bg-gmail-hover"
            >
              <Reply size={20} />
            </button>
            
            <button 
              aria-label="Delete email"
              className="p-2 rounded-full hover:bg-gmail-hover"
            >
              <Trash size={20} />
            </button>
            
            <button 
              aria-label={email.starred ? "Remove star" : "Add star"}
              className="p-2 rounded-full hover:bg-gmail-hover"
            >
              <Star size={20} className={email.starred ? 'fill-yellow-500 text-yellow-500' : ''} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Email content */}
      <article className="p-6 flex-1" aria-label="Email content">
        <header className="mb-6">
          <h1 className="text-2xl font-medium mb-4">{email.subject}</h1>
          
          <div className="flex items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-gmail-primary text-white flex items-center justify-center mr-4">
              <span className="font-medium">{email.from.name.charAt(0)}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-medium">{email.from.name}</span>
                  <span className="text-gray-500 text-sm ml-2">&lt;{email.from.email}&gt;</span>
                </div>
                <span className="text-gray-500 text-sm">{formatDate(email.date)}</span>
              </div>
              
              <div className="text-sm text-gray-500">
                to {email.to}
              </div>
            </div>
          </div>
          
          {email.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {email.labels.map((label) => (
                <span 
                  key={label} 
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </header>
        
        <div className="prose prose-sm max-w-none">
          {email.body.split('\n\n').map((paragraph, index) => (
            <React.Fragment key={index}>
              {paragraph.split('\n').map((line, lineIndex) => (
                <React.Fragment key={lineIndex}>
                  {line}
                  {lineIndex < paragraph.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
              {index < email.body.split('\n\n').length - 1 && <p></p>}
            </React.Fragment>
          ))}
        </div>
      </article>
    </div>
  );
};

export default EmailDetail;
