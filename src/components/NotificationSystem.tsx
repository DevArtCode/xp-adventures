import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Quest } from "@/types/game";
import { Bell, BellOff, Clock, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSystemProps {
  quests: Quest[];
}

interface NotificationSettings {
  enabled: boolean;
  reminderTime: string; // HH:MM format
  dailyReminder: boolean;
  questReminders: boolean;
}

export function NotificationSystem({ quests }: NotificationSystemProps) {
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notification-settings');
    return saved ? JSON.parse(saved) : {
      enabled: false,
      reminderTime: '09:00',
      dailyReminder: true,
      questReminders: true
    };
  });

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notification-settings', JSON.stringify(settings));
  }, [settings]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }));
        toast({
          title: "✅ Notifications activées",
          description: "Vous recevrez maintenant des rappels pour vos quêtes"
        });
      } else {
        toast({
          title: "❌ Permission refusée",
          description: "Les notifications ne fonctionneront pas sans permission"
        });
      }
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('🎮 Quest Master RPG', {
        body: 'Ceci est une notification de test !',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  };

  const scheduleNotifications = () => {
    if (!settings.enabled || permission !== 'granted') return;

    // Clear existing notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications().then(notifications => {
          notifications.forEach(notification => notification.close());
        });
      });
    }

    // Schedule daily reminder
    if (settings.dailyReminder) {
      scheduleDailyReminder();
    }

    // Schedule quest reminders
    if (settings.questReminders) {
      scheduleQuestReminders();
    }
  };

  const scheduleDailyReminder = () => {
    const [hours, minutes] = settings.reminderTime.split(':').map(Number);
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    setTimeout(() => {
      if (permission === 'granted' && settings.enabled) {
        new Notification('🎯 Quest Master RPG - Rappel quotidien', {
          body: `Vous avez ${quests.length} quête(s) à accomplir aujourd'hui !`,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }
      // Schedule next day
      scheduleDailyReminder();
    }, timeUntilReminder);
  };

  const scheduleQuestReminders = () => {
    quests.forEach(quest => {
      if (quest.dueDate) {
        const dueDate = new Date(quest.dueDate);
        const now = new Date();
        const timeUntilDue = dueDate.getTime() - now.getTime();

        // Remind 2 hours before due date
        const reminderTime = timeUntilDue - (2 * 60 * 60 * 1000);

        if (reminderTime > 0) {
          setTimeout(() => {
            if (permission === 'granted' && settings.enabled) {
              new Notification('⏰ Quête bientôt due !', {
                body: `"${quest.title}" est due dans 2 heures`,
                icon: '/favicon.ico',
                badge: '/favicon.ico'
              });
            }
          }, reminderTime);
        }
      }
    });
  };

  useEffect(() => {
    scheduleNotifications();
  }, [settings, quests, permission]);

  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications & Rappels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {permission === 'default' && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm mb-3">
              Activez les notifications pour recevoir des rappels intelligents sur vos quêtes
            </p>
            <Button onClick={requestPermission} className="w-full">
              <Bell className="h-4 w-4 mr-2" />
              Activer les notifications
            </Button>
          </div>
        )}

        {permission === 'denied' && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <BellOff className="h-4 w-4" />
              <span className="font-medium">Notifications désactivées</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Les notifications ont été refusées. Vous pouvez les réactiver dans les paramètres de votre navigateur.
            </p>
          </div>
        )}

        {permission === 'granted' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span className="font-medium">Notifications activées</span>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(enabled) => setSettings(prev => ({ ...prev, enabled }))}
              />
            </div>

            {settings.enabled && (
              <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Rappel quotidien</label>
                  <Switch
                    checked={settings.dailyReminder}
                    onCheckedChange={(dailyReminder) => setSettings(prev => ({ ...prev, dailyReminder }))}
                  />
                </div>

                {settings.dailyReminder && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm text-muted-foreground">Heure:</label>
                    <input
                      type="time"
                      value={settings.reminderTime}
                      onChange={(e) => setSettings(prev => ({ ...prev, reminderTime: e.target.value }))}
                      className="px-2 py-1 text-sm border rounded bg-background"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <label className="text-sm">Rappels de quêtes</label>
                  <Switch
                    checked={settings.questReminders}
                    onCheckedChange={(questReminders) => setSettings(prev => ({ ...prev, questReminders }))}
                  />
                </div>

                <Button variant="outline" size="sm" onClick={sendTestNotification} className="w-full">
                  Tester les notifications
                </Button>
              </div>
            )}
          </div>
        )}

        {quests.length > 0 && (
          <div className="p-3 bg-card border rounded-lg">
            <p className="text-sm text-muted-foreground">
              📋 {quests.length} quête(s) active(s) • 
              {quests.filter(q => q.dueDate).length} avec échéance
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}