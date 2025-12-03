import { useState } from 'react';
import NavigationSidebar from '@/components/NavigationSidebar';
import ChatSidebar from '@/components/ChatSidebar';
import ChatWindow from '@/components/ChatWindow';
import SettingsPanel from '@/components/SettingsPanel';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  isGroup?: boolean;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      <NavigationSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {activeSection === 'chats' && (
        <>
          <ChatSidebar
            onSelectChat={(chat) => setSelectedChat(chat)}
            selectedChatId={selectedChat?.id || null}
          />
          <ChatWindow chat={selectedChat} />
        </>
      )}

      {activeSection === 'groups' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-xl font-medium mb-2">Групповые чаты</h2>
            <p className="text-muted-foreground">Создавайте группы и общайтесь вместе</p>
          </div>
        </div>
      )}

      {activeSection === 'calls' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📞</div>
            <h2 className="text-xl font-medium mb-2">Звонки</h2>
            <p className="text-muted-foreground">История ваших звонков появится здесь</p>
          </div>
        </div>
      )}

      {activeSection === 'contacts' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📇</div>
            <h2 className="text-xl font-medium mb-2">Контакты</h2>
            <p className="text-muted-foreground">Управляйте своими контактами</p>
          </div>
        </div>
      )}

      {activeSection === 'notifications' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-xl font-medium mb-2">Уведомления</h2>
            <p className="text-muted-foreground">Здесь будут важные уведомления</p>
          </div>
        </div>
      )}

      {activeSection === 'settings' && <SettingsPanel />}
    </div>
  );
};

export default Index;