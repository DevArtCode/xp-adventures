import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayerStats, ShopItem } from "@/types/game";
import { 
  BarChart3, 
  Palette, 
  Trophy, 
  BookOpen, 
  Swords, 
  Crown,
  ArrowLeft,
  ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DetailedStats } from "./DetailedStats";
import { AchievementsSystem } from "./AchievementsSystem";
import { Shop } from "./Shop";
import { ZoneContent } from "./ZoneContent";

interface ZoneInterfaceProps {
  selectedZone: string;
  stats: PlayerStats;
  completedQuests: any[];
  shopItems: ShopItem[];
  onPurchase: (itemId: string) => void;
  onBack: () => void;
}

const ZONE_CONFIG = {
  training: {
    name: 'Salle d\'Entraînement',
    description: 'Analysez vos performances et suivez vos progrès',
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'health',
    levelRequired: 5
  },
  market: {
    name: 'Marché',
    description: 'Customisez votre expérience avec vos pièces d\'or',
    icon: <Palette className="h-6 w-6" />,
    color: 'creativity',
    levelRequired: 10
  },
  'trophy-hall': {
    name: 'Salle des Trophées',
    description: 'Admirez vos succès et débloquez de nouveaux défis',
    icon: <Trophy className="h-6 w-6" />,
    color: 'discipline',
    levelRequired: 15
  },
  library: {
    name: 'Bibliothèque',
    description: 'Découvrez des conseils et citations motivantes',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'knowledge',
    levelRequired: 20
  },
  arena: {
    name: 'Arène',
    description: 'Relevez des défis hardcore avec des risques',
    icon: <Swords className="h-6 w-6" />,
    color: 'destructive',
    levelRequired: 30
  },
  sanctuary: {
    name: 'Sanctuaire Légendaire',
    description: 'Quêtes légendaires aux récompenses extraordinaires',
    icon: <Crown className="h-6 w-6" />,
    color: 'accent',
    levelRequired: 50
  },
  shop: {
    name: 'Boutique',
    description: 'Échangez vos pièces d\'or contre des objets précieux',
    icon: <ShoppingBag className="h-6 w-6" />,
    color: 'accent',
    levelRequired: 0
  }
};

export function ZoneInterface({ 
  selectedZone, 
  stats, 
  completedQuests, 
  shopItems,
  onPurchase,
  onBack 
}: ZoneInterfaceProps) {
  const zone = ZONE_CONFIG[selectedZone as keyof typeof ZONE_CONFIG];
  
  if (!zone) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Zone non trouvée</p>
          <Button onClick={onBack} className="mt-4">Retour</Button>
        </CardContent>
      </Card>
    );
  }

  const isUnlocked = stats.level >= zone.levelRequired;

  if (!isUnlocked && selectedZone !== 'shop') {
    return (
      <Card className="border-destructive/50">
        <CardContent className="p-6 text-center space-y-4">
          <div className={cn(
            "p-4 rounded-lg mx-auto w-fit",
            "bg-muted text-muted-foreground"
          )}>
            {zone.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">{zone.name}</h3>
            <p className="text-muted-foreground mb-4">{zone.description}</p>
            <Badge variant="outline">
              Niveau {zone.levelRequired} requis
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Il vous manque {zone.levelRequired - stats.level} niveaux pour accéder à cette zone.
          </p>
          <Button onClick={onBack}>Retour aux zones</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Zone Header */}
      <Card className={cn("border-2", `border-${zone.color}/30`)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-3 rounded-lg",
                `bg-${zone.color}/20 text-${zone.color}`
              )}>
                {zone.icon}
              </div>
              <div>
                <CardTitle className="text-xl">{zone.name}</CardTitle>
                <p className="text-muted-foreground">{zone.description}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Zone Content */}
      {selectedZone === 'training' && (
        <DetailedStats stats={stats} completedQuests={completedQuests} />
      )}
      
      {selectedZone === 'trophy-hall' && (
        <AchievementsSystem stats={stats} completedQuests={completedQuests} />
      )}
      
      {selectedZone === 'shop' && (
        <Shop 
          playerStats={stats} 
          shopItems={shopItems}
          onPurchase={onPurchase}
        />
      )}
      
      {(selectedZone === 'market' || selectedZone === 'library' || selectedZone === 'arena' || selectedZone === 'sanctuary') && (
        <ZoneContent zoneId={selectedZone} stats={stats} />
      )}
    </div>
  );
}