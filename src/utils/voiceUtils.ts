
// Interface for speech synthesis options
export interface SpeechOptions {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
}

// Class for text-to-speech functionality
export class TextToSpeech {
  private static instance: TextToSpeech;
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private defaultOptions: SpeechOptions = {
    rate: 1,
    pitch: 1,
    volume: 1
  };
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    
    // Load voices if they change
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  public static getInstance(): TextToSpeech {
    if (!TextToSpeech.instance) {
      TextToSpeech.instance = new TextToSpeech();
    }
    return TextToSpeech.instance;
  }

  private loadVoices(): void {
    this.voices = this.synthesis.getVoices();
    console.log("Voices loaded:", this.voices.length);
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public speak(text: string, options: SpeechOptions = {}, onEnd?: () => void): void {
    // Cancel any ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply default options
    utterance.rate = options.rate || this.defaultOptions.rate || 1;
    utterance.pitch = options.pitch || this.defaultOptions.pitch || 1;
    utterance.volume = options.volume || this.defaultOptions.volume || 1;
    
    // Set voice if provided
    if (options.voice) {
      utterance.voice = options.voice;
    }

    this.currentUtterance = utterance;
    
    // Set end callback if provided
    if (onEnd) {
      utterance.onend = () => {
        console.log("Speech ended");
        this.currentUtterance = null;
        onEnd();
      };
    } else {
      utterance.onend = () => {
        console.log("Speech ended");
        this.currentUtterance = null;
      };
    }
    
    // Log when speech starts and errors
    utterance.onstart = () => console.log("Speech started");
    utterance.onerror = (event) => console.error("Speech error:", event);
    
    this.synthesis.speak(utterance);
  }

  public stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public pause(): void {
    if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  public resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  public isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  public isPaused(): boolean {
    return this.synthesis.paused;
  }

  public setDefaultOptions(options: SpeechOptions): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }
}

// Helper function to format text for better TTS reading
export const formatTextForSpeech = (text: string): string => {
  // Replace common symbols with their spoken equivalents
  let formattedText = text
    .replace(/@/g, " at ")
    .replace(/&/g, " and ")
    .replace(/#/g, " hashtag ")
    .replace(/\$/g, " dollar ")
    .replace(/%/g, " percent ")
    .replace(/\+/g, " plus ")
    .replace(/=/g, " equals ")
    .replace(/\*/g, " star ")
    .replace(/\//g, " slash ")
    .replace(/\\/g, " backslash ")
    .replace(/\|/g, " pipe ");
    
  // Add pauses at punctuation
  formattedText = formattedText
    .replace(/\./g, ". ")
    .replace(/\!/g, "! ")
    .replace(/\?/g, "? ")
    .replace(/,/g, ", ")
    .replace(/;/g, "; ")
    .replace(/:/g, ": ");
    
  // Remove excessive whitespace
  formattedText = formattedText.replace(/\s+/g, " ").trim();
  
  return formattedText;
};

// Format email content for better speech readability
export const formatEmailForSpeech = (email: any): string => {
  let speech = `Email from ${email.from.name}. `;
  speech += `Subject: ${email.subject}. `;
  
  // Format body text
  let body = email.body.replace(/\n\n/g, '. ').replace(/\n/g, '. ');
  
  // Add date information
  const date = new Date(email.date);
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
  
  speech += `Sent on ${formattedDate}. `;
  speech += `Message body: ${body}`;
  
  return formatTextForSpeech(speech);
};

// Format multiple emails for speech
export const formatMultipleEmailsForSpeech = (emails: any[], includeBody: boolean = false): string => {
  let speech = `You have ${emails.length} emails. `;
  
  if (emails.length === 0) {
    return "You have no emails in this folder.";
  }
  
  emails.forEach((email, index) => {
    speech += `Email ${index + 1}: From ${email.from.name}. Subject: ${email.subject}. `;
    
    // Only include email body if requested
    if (includeBody) {
      let body = email.body.replace(/\n\n/g, '. ').replace(/\n/g, '. ');
      if (body.length > 200) {
        body = body.substring(0, 200) + "... (message truncated)";
      }
      speech += `Message preview: ${body}. `;
    }
    
    // Add a longer pause between emails
    speech += ". ";
  });
  
  return formatTextForSpeech(speech);
};

// Function to summarize unread emails
export const formatUnreadEmailsForSpeech = (emails: any[]): string => {
  const unreadEmails = emails.filter(email => !email.read);
  
  if (unreadEmails.length === 0) {
    return "You have no unread emails.";
  }
  
  let speech = `You have ${unreadEmails.length} unread emails. `;
  
  unreadEmails.forEach((email, index) => {
    speech += `Unread email ${index + 1}: From ${email.from.name}. Subject: ${email.subject}. `;
    
    // Add a longer pause between emails
    speech += ". ";
  });
  
  return formatTextForSpeech(speech);
};
