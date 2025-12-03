import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  created_at: string;
  sender_id: number;
  status: string;
}

interface ChatWindowProps {
  chat: {
    id: number;
    name: string;
    avatar_url?: string;
    is_group?: boolean;
  } | null;
  userId: number;
}

const API_URL = 'https://functions.poehali.dev/0749f3a7-9a6a-4a5f-bfc3-ca4866708a12';

export default function ChatWindow({ chat, userId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!chat) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_URL}?chat_id=${chat.id}`);
        const data = await response.json();
        
        if (data.length > messages.length && messages.length > 0) {
          const newMessages = data.slice(messages.length);
          const hasNewFromOthers = newMessages.some((msg: Message) => msg.sender_id !== userId);
          
          if (hasNewFromOthers) {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIF2i58+adTRAMUKfk77dhGwU7k9bxy3goBS57zO/ckjwKElyx6OyrUhMGPZva8r1qIAUrgc7z2YcyCBxlvPDinUgLCEup4/C4YhgFOJLX8st6JwUte8vw3ZI8ChJcsfDsqVAUBjuZ2fK8aB4DLYPO89iHLwYYY7vw450/DApMqePwuGIYBziS1/HLeSYELHrL8N+SOgoTXLDv7KlSFAU7mNjyu2gdAy2Dz/PYhy8GGmK68+OdQAwLSqng77dhHAU5ktfxy3cnByx5y/DekzoKE1yw7+ypUhQFO5jZ8rtpHQMtg8/z2IYuBhhiu/Hjn0ALCkuq4O+2YRsGOJLX8ct4JgQsecvw3pQ7ChNcsO7tqVEUBjqZ2PK7aRwDLIPP89iFLgUYY7rw4Z5ACgpKq9/utmAaBjmS1vLLeCgELHnL796TPAoSW7Hu66lUFAU6mdnyumodAy2Dz/PYhS4GGmO68OOeQQsLS6jg7rdhGgY4kdbxy3goBSx5y/DflTsKElyx7uupUhQFO5jY8rtqHgMtg8/y2IUuBRhjuvDjnkALC0qr3+62YBoFOZLW8st5KAUsecvw3pI8ChFbsO3sqVMTBTuY2PG8aR0DL4PP89iFLgYZY7rw4p5AC0tKq9/vtl8aBTeS1fHLeCoELHrK796UOwsRXLDu6qlTFQU7mNjxu2sfBC2Cz/PYhC4FGmO68OOeQApLSavf77VgGgU3ktXxy3goBSx7yvDflTsLEVux7eqoUhUIOpjY8rpqHQMtg8/z2IQtBRlkuvDjnj8LSkqq3++1YRoFN5LV8ct4KAUsecvw35M7ChJbsO3rpFIVBTuY2PG7ah4DLYLPtm8aBTWS1fHLeScGLHvL8N+TOwsRW7Dt66hSFAY7l9fxu2odAy2Cz/PXhC4FGmO68OKeQApLSqre77VfGgY2ktXxy3goBSx7yvDflDsLEVuw7euoUhQGOpfX8bpqHQMtgs/z14MuBRpjuvDinkAKSkqq3++1YBoGNpLV8ct4KAYse8rw35Q7CxFbse3qp1IUBjuX1/G6ah0DLIHPtC4FGWO68OKdQApLSqre77ZgGgY3ktXwy3koBSx7yvDfkzsKElyw7OqoUhQGOpfY8bppHQMtgs/z14MtBRpjuvDinkEKSkqq3u+2YRoFN5HV8ct5KAUse8nw3pM7ChJcr+zqp1MUBTuY2PG6ah0DLYHO');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play failed:', e));
          }
        }
        
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    
    const interval = setInterval(fetchMessages, 2000);
    
    return () => clearInterval(interval);
  }, [chat, messages.length, userId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chat.id,
          sender_id: userId,
          text: newMessage,
        }),
      });

      const newMsg = await response.json();
      setMessages([...messages, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
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
              <AvatarImage src={chat.avatar_url || ''} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {chat.is_group ? <Icon name="Users" size={20} /> : chat.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
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
          {messages.map((message) => {
            const isMine = message.sender_id === userId;
            const time = new Date(message.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div
                key={message.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMine
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className={`text-xs ${isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {time}
                    </span>
                    {isMine && (
                      <Icon
                        name={message.status === 'read' ? 'CheckCheck' : 'Check'}
                        size={14}
                        className={message.status === 'read' ? 'text-secondary' : 'text-primary-foreground/70'}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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