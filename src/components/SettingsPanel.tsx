import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

export default function SettingsPanel() {
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeen, setLastSeen] = useState(true);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold">Настройки</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="privacy">Приватность</TabsTrigger>
              <TabsTrigger value="notifications">Уведомления</TabsTrigger>
              <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    Я
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Icon name="Camera" size={16} className="mr-2" />
                    Изменить фото
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" defaultValue="Иван Петров" className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input id="username" defaultValue="@ivan_petrov" className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="bio">О себе</Label>
                  <Input id="bio" defaultValue="Доступен для общения" className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input id="phone" defaultValue="+7 (999) 123-45-67" className="mt-2" disabled />
                </div>
              </div>

              <Button className="w-full">Сохранить изменения</Button>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Время последнего визита</Label>
                    <p className="text-sm text-muted-foreground">
                      Показывать, когда вы были в сети
                    </p>
                  </div>
                  <Switch checked={lastSeen} onCheckedChange={setLastSeen} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Статус прочтения</Label>
                    <p className="text-sm text-muted-foreground">
                      Отправлять подтверждения о прочтении сообщений
                    </p>
                  </div>
                  <Switch checked={readReceipts} onCheckedChange={setReadReceipts} />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Кто может видеть ваш профиль</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-accent">
                      <span>Все</span>
                      <Icon name="ChevronRight" size={20} />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-accent">
                      <span>Только контакты</span>
                      <Icon name="ChevronRight" size={20} />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-accent">
                      <span>Никто</span>
                      <Icon name="ChevronRight" size={20} />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Icon name="Lock" size={16} />
                    Блокировка приложения
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Защитите ваши сообщения с помощью биометрии или PIN-кода
                  </p>
                  <Button variant="outline" className="w-full">
                    Настроить блокировку
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Уведомления</Label>
                    <p className="text-sm text-muted-foreground">
                      Получать уведомления о новых сообщениях
                    </p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Звук уведомлений</Label>
                    <p className="text-sm text-muted-foreground">
                      Воспроизводить звук при получении сообщения
                    </p>
                  </div>
                  <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Предварительный просмотр</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Показывать текст сообщения в уведомлении
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-accent">
                      <span>Показывать</span>
                      <Icon name="Check" size={20} className="text-primary" />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-accent">
                      <span>Скрывать</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Icon name="Bell" size={16} />
                    Режим "Не беспокоить"
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Отключить уведомления на определенное время
                  </p>
                  <Button variant="outline" className="w-full">
                    Настроить расписание
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Тема оформления</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border-2 border-primary rounded-lg p-4 cursor-pointer bg-card">
                      <div className="w-full h-20 bg-background rounded mb-2"></div>
                      <span className="text-sm font-medium">Темная</span>
                      <Icon name="Check" size={16} className="text-primary ml-2 inline" />
                    </div>
                    <div className="border border-border rounded-lg p-4 cursor-pointer hover:border-primary bg-card">
                      <div className="w-full h-20 bg-white rounded mb-2"></div>
                      <span className="text-sm font-medium">Светлая</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Цветовой акцент</Label>
                  <div className="flex gap-3 flex-wrap">
                    <div className="w-10 h-10 rounded-full bg-primary border-2 border-primary cursor-pointer"></div>
                    <div className="w-10 h-10 rounded-full bg-secondary border-2 border-transparent cursor-pointer hover:border-secondary"></div>
                    <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-transparent cursor-pointer hover:border-blue-500"></div>
                    <div className="w-10 h-10 rounded-full bg-green-500 border-2 border-transparent cursor-pointer hover:border-green-500"></div>
                    <div className="w-10 h-10 rounded-full bg-orange-500 border-2 border-transparent cursor-pointer hover:border-orange-500"></div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Размер шрифта</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-accent">
                      <span className="text-sm">Маленький</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-accent">
                      <span>Средний</span>
                      <Icon name="Check" size={20} className="text-primary" />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-accent">
                      <span className="text-lg">Большой</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Фон чата</Label>
                  <Button variant="outline" className="w-full">
                    <Icon name="Image" size={16} className="mr-2" />
                    Выбрать изображение
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
