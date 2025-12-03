import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  time: string;
  isMine: boolean;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatWindowProps {
  chat: {
    id: number;
    name: string;
    avatar: string;
    online: boolean;
    isGroup?: boolean;
  } | null;
}

export default function ChatWindow({ chat }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Привет! Как дела?', time: '12:30', isMine: false, status: 'read' },
    { id: 2, text: 'Привет! Всё отлично, спасибо! А у тебя как?', time: '12:32', isMine: true, status: 'read' },
    { id: 3, text: 'Тоже всё хорошо. Хотел обсудить проект', time: '12:33', isMine: false, status: 'read' },
    { id: 4, text: 'Конечно, давай обсудим. Что конкретно интересует?', time: '12:35', isMine: true, status: 'delivered' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        text: newMessage,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
        status: 'sent',
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="MessageCircle" size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-medium mb-2">Выберите чат</h2>
          <p className="text-muted-foreground">Начните общение с друзьями</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
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
          <div>
            <h2 className="font-medium">{chat.name}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Icon name="Lock" size={12} />
              Сквозное шифрование
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Icon name="Phone" size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="Video" size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="MoreVertical" size={20} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMine ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  message.isMine
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className={`text-xs ${message.isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {message.time}
                  </span>
                  {message.isMine && (
                    <Icon
                      name={message.status === 'read' ? 'CheckCheck' : 'Check'}
                      size={14}
                      className={message.status === 'read' ? 'text-secondary' : 'text-primary-foreground/70'}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Icon name="Paperclip" size={20} />
          </Button>
          <Input
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button variant="ghost" size="icon">
            <Icon name="Smile" size={20} />
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
