import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  RotateCcw, 
  Plus, 
  Trash2, 
  AlertTriangle,
  Bell,
  Volume2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface GameSettingsProps {
  customCategories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onResetGame: () => void;
}

export function GameSettings({ 
  customCategories, 
  onAddCategory, 
  onDeleteCategory, 
  onResetGame 
}: GameSettingsProps) {
  const [newCategory, setNewCategory] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  const handleAddCategory = () => {
    if (newCategory.trim() && !customCategories.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
      toast.success("Catégorie ajoutée avec succès");
    }
  };

  const handleDeleteCategory = (category: string) => {
    onDeleteCategory(category);
    toast.success("Catégorie supprimée");
  };

  const handleResetGame = () => {
    onResetGame();
    toast.success("Jeu remis à zéro", {
      description: "Toutes vos données ont été effacées"
    });
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        toast.success("Notifications activées");
      } else {
        toast.error("Notifications refusées");
      }
    }
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('soundEnabled', JSON.stringify(newValue));
    toast.success(newValue ? "Sons activés" : "Sons désactivés");
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
          <Settings className="h-6 w-6" />
          Paramètres
        </h2>
        <p className="text-muted-foreground">
          Personnalisez votre expérience de jeu
        </p>
      </div>

      {/* Categories Management */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-lg">Gestion des Catégories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nouvelle catégorie..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button onClick={handleAddCategory} disabled={!newCategory.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Catégories existantes</Label>
            <div className="flex flex-wrap gap-2">
              {customCategories.map((category) => (
                <Badge 
                  key={category}
                  variant="secondary" 
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {category}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications & Sound */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-lg">Préférences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <div>
                <Label className="font-medium">Notifications Web</Label>
                <p className="text-xs text-muted-foreground">
                  Rappels pour vos quêtes importantes
                </p>
              </div>
            </div>
            <Button
              variant={notificationsEnabled ? "default" : "outline"}
              size="sm"
              onClick={requestNotificationPermission}
              disabled={notificationsEnabled}
            >
              {notificationsEnabled ? "Activées" : "Activer"}
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              <div>
                <Label className="font-medium">Effets Sonores</Label>
                <p className="text-xs text-muted-foreground">
                  Sons lors de la complétion des quêtes
                </p>
              </div>
            </div>
            <Button
              variant={soundEnabled ? "default" : "outline"}
              size="sm"
              onClick={toggleSound}
            >
              {soundEnabled ? "Activés" : "Désactivés"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="card-glow border-destructive/20">
        <CardHeader>
          <CardTitle className="text-lg text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Zone de Danger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">Remise à Zéro Complète</h4>
              <p className="text-sm text-muted-foreground">
                Efface toutes vos données : quêtes, XP, succès, streaks et paramètres.
                Cette action est irréversible.
              </p>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Remettre à Zéro
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Toutes vos données seront 
                    définitivement supprimées :
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Toutes vos quêtes et leur historique</li>
                      <li>Votre niveau et XP accumulés</li>
                      <li>Vos succès et badges débloqués</li>
                      <li>Votre série (streak) actuelle</li>
                      <li>Vos pièces d'or et récompenses</li>
                      <li>Vos catégories personnalisées</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleResetGame}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Oui, tout effacer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}