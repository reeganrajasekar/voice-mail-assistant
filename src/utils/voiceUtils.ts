
// Interface for speech synthesis options
export interface SpeechOptions {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
}

// Interface for speech recognition options
export interface RecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
}

// Fix for TypeScript browser API types
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
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

  public speak(text: string, options: SpeechOptions = {}): void {
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
    this.synthesis.speak(utterance);
    
    // Log when speech starts and ends
    utterance.onstart = () => console.log("Speech started");
    utterance.onend = () => {
      console.log("Speech ended");
      this.currentUtterance = null;
    };
    utterance.onerror = (event) => console.error("Speech error:", event);
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

// Class for speech recognition functionality
export class SpeechRecognition {
  private static instance: SpeechRecognition;
  private recognition: any; // Using any because the Web Speech API types might not be available
  private isListening: boolean = false;
  private defaultOptions: RecognitionOptions = {
    continuous: true,
    interimResults: true,
    lang: 'en-US'
  };
  private errorCallback: ((error: string) => void) | null = null;
  private endCallback: (() => void) | null = null;

  private constructor() {
    // Check for browser support
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      console.error("Speech recognition not supported in this browser");
      return;
    }
    
    this.recognition = new SpeechRecognitionAPI();
    this.setupRecognition();
  }

  public static getInstance(): SpeechRecognition {
    if (!SpeechRecognition.instance) {
      SpeechRecognition.instance = new SpeechRecognition();
    }
    return SpeechRecognition.instance;
  }

  private setupRecognition(): void {
    // Apply default options
    this.recognition.continuous = this.defaultOptions.continuous;
    this.recognition.interimResults = this.defaultOptions.interimResults;
    this.recognition.lang = this.defaultOptions.lang;
    
    // Handle errors
    this.recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      this.isListening = false;
      
      if (this.errorCallback) {
        this.errorCallback(event.error);
      }
    };
    
    // Handle when recognition stops
    this.recognition.onend = () => {
      console.log("Speech recognition ended");
      this.isListening = false;
      
      if (this.endCallback) {
        this.endCallback();
      }
    };
  }

  public start(options: RecognitionOptions = {}, onResult: (result: string, isFinal: boolean) => void): void {
    // Check if already listening and don't attempt to start again
    if (this.isListening) {
      console.log("Speech recognition is already active");
      return;
    }
    
    // Apply any new options
    if (options.continuous !== undefined) this.recognition.continuous = options.continuous;
    if (options.interimResults !== undefined) this.recognition.interimResults = options.interimResults;
    if (options.lang !== undefined) this.recognition.lang = options.lang;
    
    // Set up result handler
    this.recognition.onresult = (event: any) => {
      const result = event.results[event.resultIndex];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;
      
      console.log(`Recognized: ${transcript} (${isFinal ? 'final' : 'interim'})`);
      onResult(transcript, isFinal);
    };
    
    // Start recognition
    try {
      this.recognition.start();
      this.isListening = true;
      console.log("Speech recognition started");
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      this.isListening = false;
      if (this.errorCallback) {
        this.errorCallback("failed-to-start");
      }
    }
  }

  public stop(): void {
    if (this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
        console.log("Speech recognition stopped");
      } catch (error) {
        console.error("Failed to stop speech recognition:", error);
      }
    }
  }

  public isRecognizing(): boolean {
    return this.isListening;
  }

  public setDefaultOptions(options: RecognitionOptions): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
    this.setupRecognition();
  }
  
  // Add callback methods for error and end events
  public onError(callback: (error: string) => void): void {
    this.errorCallback = callback;
  }
  
  public onEnd(callback: () => void): void {
    this.endCallback = callback;
  }
}

// Voice assistant class that combines TTS and STT for a complete voice interface
export class VoiceAssistant {
  private static instance: VoiceAssistant;
  private tts: TextToSpeech;
  private stt: SpeechRecognition;
  private commandHandlers: Map<string, (args?: string) => void> = new Map();
  private isActive: boolean = false;

  private constructor() {
    this.tts = TextToSpeech.getInstance();
    this.stt = SpeechRecognition.getInstance();
    this.registerDefaultCommands();
  }

  public static getInstance(): VoiceAssistant {
    if (!VoiceAssistant.instance) {
      VoiceAssistant.instance = new VoiceAssistant();
    }
    return VoiceAssistant.instance;
  }

  private registerDefaultCommands(): void {
    // Default help command
    this.registerCommand("help", () => {
      this.speak("Available commands: " + Array.from(this.commandHandlers.keys()).join(", "));
    });
    
    // Stop listening command
    this.registerCommand("stop listening", () => {
      this.speak("Voice assistant deactivated");
      this.deactivate();
    });
  }

  public registerCommand(command: string, handler: (args?: string) => void): void {
    this.commandHandlers.set(command.toLowerCase(), handler);
  }

  public activate(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.speak("Voice assistant activated. How can I help you?");
    
    // Start listening for commands
    this.stt.start({}, (result, isFinal) => {
      if (isFinal) {
        this.processCommand(result);
      }
    });
  }

  public deactivate(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    this.stt.stop();
  }

  public isActivated(): boolean {
    return this.isActive;
  }

  public speak(text: string, onComplete?: () => void): void {
    console.log("Speaking:", text);
    
    // Stop speech recognition while speaking to avoid feedback loop
    const wasListening = this.stt.isRecognizing();
    if (wasListening) this.stt.stop();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      // Resume listening after speaking if it was active before
      if (wasListening && this.isActive) {
        this.stt.start({}, (result, isFinal) => {
          if (isFinal) {
            this.processCommand(result);
          }
        });
      }
      if (onComplete) onComplete();
    };
    
    this.tts.speak(text);
  }

  private processCommand(text: string): void {
    const lowerText = text.toLowerCase().trim();
    console.log("Processing command:", lowerText);
    
    // Check for exact command matches
    for (const [command, handler] of this.commandHandlers.entries()) {
      if (lowerText === command) {
        console.log(`Executing command: ${command}`);
        handler();
        return;
      }
    }
    
    // Check for commands with arguments
    for (const [command, handler] of this.commandHandlers.entries()) {
      if (lowerText.startsWith(command + " ")) {
        const args = lowerText.substring(command.length).trim();
        console.log(`Executing command: ${command} with args: ${args}`);
        handler(args);
        return;
      }
    }
    
    // No command matched
    this.speak("I'm sorry, I didn't understand that command. Say 'help' for a list of available commands.");
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

// NEW: Functions to format multiple emails for speech
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

// NEW: Function to summarize unread emails
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
