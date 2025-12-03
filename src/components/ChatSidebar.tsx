import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  isGroup?: boolean;
}

const mockChats: Chat[] = [
  { id: 1, name: 'Анна Петрова', avatar: '', lastMessage: 'Отлично, встретимся завтра!', time: '14:23', unread: 2, online: true },
  { id: 2, name: 'Команда разработки', avatar: '', lastMessage: 'Михаил: Код готов к ревью', time: '13:45', unread: 5, online: false, isGroup: true },
  { id: 3, name: 'Дмитрий Иванов', avatar: '', lastMessage: 'Привет! Как дела?', time: '12:30', unread: 0, online: true },
  { id: 4, name: 'Семейный чат', avatar: '', lastMessage: 'Мама: Не забудь про ужин', time: '11:15', unread: 1, online: false, isGroup: true },
  { id: 5, name: 'Мария Сидорова', avatar: '', lastMessage: 'Спасибо за помощь!', time: '10:20', unread: 0, online: false },
  { id: 6, name: 'Книжный клуб', avatar: '', lastMessage: 'Олег: Новая книга просто огонь 🔥', time: 'Вчера', unread: 0, online: false, isGroup: true },
];

interface ChatSidebarProps {
  onSelectChat: (chat: Chat) => void;
  selectedChatId: number | null;
}

export default function ChatSidebar({ onSelectChat, selectedChatId }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <AvatarImage src={chat.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {chat.isGroup ? <Icon name="Users" size={20} /> : chat.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                <span className="text-xs text-muted-foreground">{chat.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
            </div>

            {chat.unread > 0 && (
              <Badge className="bg-primary text-primary-foreground rounded-full h-5 min-w-5 px-2">
                {chat.unread}
              </Badge>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
