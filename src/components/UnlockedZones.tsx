import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayerStats } from "@/types/game";
import { 
  Crown, 
  BarChart3, 
  Palette, 
  Trophy, 
  BookOpen, 
  Swords, 
  Lock, 
  Unlock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UnlockedZonesProps {
  stats: PlayerStats;
  onZoneSelect: (zone: string) => void;
  selectedZone: string;
}

interface Zone {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  levelRequired: number;
  unlocked: boolean;
  color: string;
}

export function UnlockedZones({ stats, onZoneSelect, selectedZone }: UnlockedZonesProps) {
  const zones: Zone[] = [
    {
      id: 'training',
      name: 'Salle d\'Entraînement',
      description: 'Statistiques détaillées et graphiques de progression',
      icon: <BarChart3 className="h-6 w-6" />,
      levelRequired: 5,
      unlocked: stats.level >= 5,
      color: 'health'
    },
    {
      id: 'market',
      name: 'Marché',
      description: 'Customisation visuelle avec vos pièces d\'or',
      icon: <Palette className="h-6 w-6" />,
      levelRequired: 10,
      unlocked: stats.level >= 10,
      color: 'creativity'
    },
    {
      id: 'trophy-hall',
      name: 'Salle des Trophées',
      description: 'Collection complète de vos succès et badges',
      icon: <Trophy className="h-6 w-6" />,
      levelRequired: 15,
      unlocked: stats.level >= 15,
      color: 'discipline'
    },
    {
      id: 'library',
      name: 'Bibliothèque',
      description: 'Citations motivantes et conseils de productivité',
      icon: <BookOpen className="h-6 w-6" />,
      levelRequired: 20,
      unlocked: stats.level >= 20,
      color: 'knowledge'
    },
    {
      id: 'arena',
      name: 'Arène',
      description: 'Mode défi hardcore avec risques et récompenses',
      icon: <Swords className="h-6 w-6" />,
      levelRequired: 30,
      unlocked: stats.level >= 30,
      color: 'destructive'
    },
    {
      id: 'sanctuary',
      name: 'Sanctuaire Légendaire',
      description: 'Quêtes légendaires aux récompenses extraordinaires',
      icon: <Crown className="h-6 w-6" />,
      levelRequired: 50,
      unlocked: stats.level >= 50,
      color: 'accent'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold gradient-text">Zones Débloquées</h2>
        <p className="text-muted-foreground">
          Explorez de nouvelles zones selon votre niveau
        </p>
      </div>

      <div className="grid gap-4">
        {zones.map((zone) => (
          <Card 
            key={zone.id}
            className={cn(
              "transition-all duration-300 cursor-pointer border-2",
              zone.unlocked ? "hover:scale-102 card-glow" : "opacity-60",
              selectedZone === zone.id && "ring-2 ring-primary/50",
              zone.unlocked ? `border-${zone.color}/30` : "border-muted"
            )}
            onClick={() => zone.unlocked && onZoneSelect(zone.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-3 rounded-lg",
                    zone.unlocked ? `bg-${zone.color}/20 text-${zone.color}` : "bg-muted text-muted-foreground"
                  )}>
                    {zone.unlocked ? zone.icon : <Lock className="h-6 w-6" />}
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {zone.name}
                      {zone.unlocked ? (
                        <Unlock className="h-4 w-4 text-success" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {zone.description}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={zone.unlocked ? "secondary" : "outline"}
                  className={cn(
                    zone.unlocked ? `bg-${zone.color}/20 text-${zone.color} border-${zone.color}/30` : ""
                  )}
                >
                  Niv. {zone.levelRequired}
                </Badge>
              </div>
            </CardHeader>
            
            {!zone.unlocked && (
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Débloquage au niveau {zone.levelRequired}</span>
                  <span>
                    {zone.levelRequired - stats.level} niveaux restants
                  </span>
                </div>
              </CardContent>
            )}
            
            {zone.unlocked && selectedZone !== zone.id && (
              <CardContent className="pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onZoneSelect(zone.id);
                  }}
                >
                  Explorer cette zone
                </Button>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {stats.level < 5 && (
        <Card className="border-primary/20">
          <CardContent className="p-4 text-center">
            <Crown className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">
              Atteignez le niveau 5 pour débloquer votre première zone spéciale !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}