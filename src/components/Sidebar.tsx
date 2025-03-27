
import React from 'react';
import { 
  Inbox, Star, Send, File, Trash, AlertCircle, 
  Plus, ChevronDown, Tag, Mail 
} from 'lucide-react';
import { folders, labels, getUnreadCount } from '../utils/emailData';

interface SidebarProps {
  visible: boolean;
  activeFolder: string;
  setActiveFolder: (folder: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  visible, 
  activeFolder, 
  setActiveFolder 
}) => {
  const [expandedLabels, setExpandedLabels] = React.useState(false);
  const unreadCount = getUnreadCount();

  const handleFolderClick = (folderId: string) => {
    setActiveFolder(folderId);
  };

  const toggleLabels = () => {
    setExpandedLabels(!expandedLabels);
  };

  return (
    <aside 
      className={`${visible ? 'translate-x-0' : '-translate-x-full'} 
                  fixed md:static inset-y-0 left-0 z-20 w-64 
                  bg-background shadow-md transition-transform duration-300 ease-in-out
                  border-r border-border
                  md:translate-x-0 md:shadow-none`}
      aria-label="Email folders"
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Compose button */}
        <div className="p-4">
          <button 
            className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-primary px-6 py-3 rounded-2xl shadow-sm transition-colors font-medium"
            aria-label="Compose new email"
          >
            <Plus size={18} />
            <span>Compose</span>
          </button>
        </div>
        
        {/* Folders */}
        <nav className="flex-1 overflow-y-auto">
          <div className="animate-slide-in space-y-1 p-2">
            {folders.map((folder) => (
              <button
                key={folder.id}
                className={`sidebar-item w-full text-left text-foreground ${activeFolder === folder.id ? 'sidebar-item-active' : ''}`}
                onClick={() => handleFolderClick(folder.id)}
                aria-current={activeFolder === folder.id ? 'page' : undefined}
              >
                {folder.id === 'inbox' && (
                  <Inbox size={18} className={activeFolder === folder.id ? 'text-primary' : 'text-foreground'} />
                )}
                {folder.id === 'starred' && (
                  <Star size={18} className={activeFolder === folder.id ? 'text-primary' : 'text-foreground'} />
                )}
                {folder.id === 'sent' && (
                  <Send size={18} className={activeFolder === folder.id ? 'text-primary' : 'text-foreground'} />
                )}
                {folder.id === 'drafts' && (
                  <File size={18} className={activeFolder === folder.id ? 'text-primary' : 'text-foreground'} />
                )}
                {folder.id === 'spam' && (
                  <AlertCircle size={18} className={activeFolder === folder.id ? 'text-primary' : 'text-foreground'} />
                )}
                {folder.id === 'trash' && (
                  <Trash size={18} className={activeFolder === folder.id ? 'text-primary' : 'text-foreground'} />
                )}
                
                <span className="flex-1">{folder.name}</span>
                
                {folder.count > 0 && (
                  <span 
                    className={`${folder.id === 'inbox' && folder.count > 0 && !activeFolder ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} 
                               text-xs px-2 py-0.5 rounded-full`}
                  >
                    {folder.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Labels */}
          <div className="mt-4 animate-slide-in animation-delay-100">
            <button 
              className="flex items-center justify-between w-full px-6 py-2 text-foreground hover:bg-accent"
              onClick={toggleLabels}
              aria-expanded={expandedLabels}
              aria-controls="label-list"
            >
              <div className="flex items-center gap-2">
                <Tag size={16} />
                <span className="text-sm font-medium">Labels</span>
              </div>
              <ChevronDown 
                size={16} 
                className={`transform transition-transform ${expandedLabels ? 'rotate-180' : ''}`}
              />
            </button>
            
            {expandedLabels && (
              <div id="label-list" className="animate-slide-in space-y-1 py-1 px-2">
                {labels.map((label) => (
                  <button
                    key={label.id}
                    className="sidebar-item w-full text-left"
                    style={{ color: label.color }}
                  >
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: label.color }}
                    ></span>
                    <span>{label.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
