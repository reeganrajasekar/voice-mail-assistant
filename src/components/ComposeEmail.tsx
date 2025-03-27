
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Paperclip, MinusSquare, Maximize2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ComposeEmailProps {
  isOpen: boolean;
  onClose: () => void;
  minimized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

const ComposeEmail: React.FC<ComposeEmailProps> = ({ 
  isOpen, 
  onClose,
  minimized = false,
  onMinimize,
  onMaximize
}) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSend = () => {
    if (!to) {
      toast({
        title: "Error",
        description: "Please specify at least one recipient",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    
    // Simulate sending email
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Email sent successfully"
      });
      
      // Reset form
      setTo('');
      setSubject('');
      setBody('');
      setIsSending(false);
      
      // Close dialog
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`sm:max-w-[600px] ${minimized ? 'h-14 overflow-hidden' : ''}`}
        style={{ marginTop: minimized ? 'calc(100vh - 56px)' : undefined }}
      >
        <DialogHeader className="flex flex-row items-center justify-between p-2">
          <DialogTitle>New Message</DialogTitle>
          <div className="flex items-center gap-1">
            {onMinimize && !minimized && (
              <Button variant="ghost" size="icon" onClick={onMinimize} className="h-7 w-7">
                <MinusSquare size={18} />
              </Button>
            )}
            {onMaximize && minimized && (
              <Button variant="ghost" size="icon" onClick={onMaximize} className="h-7 w-7">
                <Maximize2 size={18} />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
              <X size={18} />
            </Button>
          </div>
        </DialogHeader>
        
        {!minimized && (
          <>
            <div className="grid gap-3 py-2">
              <div className="border-b pb-2">
                <Input 
                  placeholder="To" 
                  value={to} 
                  onChange={(e) => setTo(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                />
              </div>
              <div className="border-b pb-2">
                <Input 
                  placeholder="Subject" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                />
              </div>
              <Textarea 
                placeholder="Compose email..." 
                value={body} 
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[200px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none px-2"
              />
            </div>
            <DialogFooter className="flex justify-between items-center">
              <div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Paperclip size={18} />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={onClose}>
                  Discard
                </Button>
                <Button onClick={handleSend} disabled={isSending}>
                  {isSending ? "Sending..." : "Send"}
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ComposeEmail;
