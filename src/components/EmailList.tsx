import React from 'react';
import { Star, Clock, Paperclip } from 'lucide-react';
import { Email, getEmailsByFolder } from '../utils/emailData';

interface EmailListProps {
  activeFolder: string;
  selectedEmail: string | null;
  setSelectedEmail: (id: string) => void;
}

const EmailList: React.FC<EmailListProps> = ({ 
  activeFolder, 
  selectedEmail, 
  setSelectedEmail 
}) => {
  const emails = getEmailsByFolder(activeFolder);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // This year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise, show date with year
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Handle email selection
  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email.id);
  };

  // Get preview text from email body
  const getPreviewText = (body: string) => {
    // Strip any markdown or formatting
    const plainText = body.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
  };

  return (
    <div className="flex-1 overflow-auto border-l border-gmail-border h-full" role="region" aria-label="Email list">
      <div className="sticky top-0 bg-white z-10 px-4 py-2 border-b border-gmail-border flex justify-between items-center">
        <h2 className="text-lg font-medium capitalize">
          {activeFolder}
          {activeFolder === 'inbox' && emails.length > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              ({emails.filter(e => !e.read).length} unread)
            </span>
          )}
        </h2>
      </div>
      
      {emails.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full animate-fade-in">
          <div className="w-24 h-24 mb-4 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg text-gray-500">No emails in this folder</p>
        </div>
      ) : (
        <ul className="divide-y divide-gmail-border" aria-label="Email list">
          {emails.map((email, index) => (
            <li 
              key={email.id}
              className={`email-row group ${email.read ? 'email-row-read' : 'email-row-unread'} 
                         ${selectedEmail === email.id ? 'bg-blue-50' : ''} 
                         animate-slide-in`}
              style={{ animationDelay: `${index * 30}ms` }}
              onClick={() => handleEmailClick(email)}
              aria-selected={selectedEmail === email.id}
              tabIndex={0}
            >
              <div className="flex items-center w-full">
                {/* Email metadata - visible on all screen sizes */}
                <div className="flex items-center mr-3">
                  <button 
                    className="p-2 rounded-full text-gray-400 hover:text-yellow-500 focus:outline-none"
                    aria-label={email.starred ? "Remove star" : "Add star"}
                  >
                    <Star 
                      size={16} 
                      className={email.starred ? 'fill-yellow-500 text-yellow-500' : ''} 
                    />
                  </button>
                </div>
                
                {/* Email content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`truncate font-medium ${email.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {email.from.name}
                    </span>
                    <span className="ml-2 whitespace-nowrap text-sm text-gray-500 flex items-center">
                      {email.hasAttachments && <Paperclip size={14} className="mr-1" />}
                      {formatDate(email.date)}
                    </span>
                  </div>
                  
                  <h3 className={`text-sm truncate ${email.read ? 'text-gray-600' : 'text-gray-800'}`}>
                    {email.subject}
                  </h3>
                  
                  <p className="text-sm text-gray-500 truncate">
                    {getPreviewText(email.body)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmailList;
