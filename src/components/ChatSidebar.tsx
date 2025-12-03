import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Chat {
  id: number;
  name: string;
  avatar_url?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  is_group?: boolean;
}

interface ChatSidebarProps {
  onSelectChat: (chat: Chat) => void;
  selectedChatId: number | null;
  userId: number;
}

const API_URL = 'https://functions.poehali.dev/0749f3a7-9a6a-4a5f-bfc3-ca4866708a12';

export default function ChatSidebar({ onSelectChat, selectedChatId, userId }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`${API_URL}?user_id=${userId}`);
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
    
    const interval = setInterval(fetchChats, 3000);
    
    return () => clearInterval(interval);
  }, [userId]);

  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (hours < 48) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div className="w-80 border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Поиск чатов..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-accent/50 transition-colors ${
              selectedChatId === chat.id ? 'bg-accent' : ''
            }`}
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={chat.avatar_url || ''} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {chat.is_group ? <Icon name="Users" size={20} /> : chat.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                <span className="text-xs text-muted-foreground">{formatTime(chat.last_message_time)}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{chat.last_message || 'Нет сообщений'}</p>
            </div>

            {chat.unread_count && chat.unread_count > 0 && (
              <Badge className="bg-primary text-primary-foreground rounded-full h-5 min-w-5 px-2">
                {chat.unread_count}
              </Badge>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}