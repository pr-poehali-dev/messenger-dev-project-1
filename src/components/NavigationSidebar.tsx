import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface NavigationSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function NavigationSidebar({ activeSection, onSectionChange }: NavigationSidebarProps) {
  const sections = [
    { id: 'chats', icon: 'MessageSquare', label: 'Чаты' },
    { id: 'groups', icon: 'Users', label: 'Группы' },
    { id: 'calls', icon: 'Phone', label: 'Звонки' },
    { id: 'contacts', icon: 'UserPlus', label: 'Контакты' },
    { id: 'notifications', icon: 'Bell', label: 'Уведомления' },
  ];

  return (
    <div className="w-20 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 gap-4">
      <div className="mb-2">
        <Avatar className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            Я
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant="ghost"
            size="icon"
            onClick={() => onSectionChange(section.id)}
            className={`w-12 h-12 relative ${
              activeSection === section.id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
            title={section.label}
          >
            <Icon name={section.icon as any} size={24} />
            {section.id === 'notifications' && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></div>
            )}
          </Button>
        ))}
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onSectionChange('settings')}
        className={`w-12 h-12 ${
          activeSection === 'settings'
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent'
        }`}
        title="Настройки"
      >
        <Icon name="Settings" size={24} />
      </Button>
    </div>
  );
}