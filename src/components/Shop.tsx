import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShopItem, PlayerStats } from "@/types/game";
import { Coins, ShoppingBag, Sparkles, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopProps {
  playerStats: PlayerStats;
  shopItems: ShopItem[];
  onPurchase: (itemId: string) => void;
}

const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'avatar_crown',
    name: 'Couronne Dorée',
    description: 'Une couronne majestueuse pour votre avatar',
    price: 100,
    type: 'avatar',
    unlocked: false
  },
  {
    id: 'avatar_cape',
    name: 'Cape de Héros',
    description: 'Une cape épique qui flotte au vent',
    price: 150,
    type: 'avatar',
    unlocked: false
  },
  {
    id: 'xp_boost',
    name: 'Potion d\'XP',
    description: '+50% XP pendant 24h',
    price: 75,
    type: 'boost',
    unlocked: false
  },
  {
    id: 'golden_effect',
    name: 'Effet Doré',
    description: 'Particules dorées autour de votre avatar',
    price: 200,
    type: 'effect',
    unlocked: false
  },
  {
    id: 'double_gold',
    name: 'Multiplicateur d\'Or',
    description: 'Double les gains d\'or pendant 1 semaine',
    price: 300,
    type: 'boost',
    unlocked: false
  },
  {
    id: 'avatar_sword',
    name: 'Épée Légendaire',
    description: 'Une épée brillante pour les vrais guerriers',
    price: 250,
    type: 'avatar',
    unlocked: false
  }
];

export function Shop({ playerStats, shopItems = DEFAULT_SHOP_ITEMS, onPurchase }: ShopProps) {
  const canAfford = (price: number) => playerStats.gold >= price;

  const getTypeIcon = (type: ShopItem['type']) => {
    switch (type) {
      case 'avatar': return <User className="h-4 w-4" />;
      case 'effect': return <Sparkles className="h-4 w-4" />;
      case 'boost': return <Zap className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: ShopItem['type']) => {
    switch (type) {
      case 'avatar': return 'health';
      case 'effect': return 'creativity';
      case 'boost': return 'discipline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          Boutique
        </h2>
        <div className="flex items-center justify-center gap-2 text-lg">
          <Coins className="h-5 w-5 text-accent" />
          <span className="font-semibold text-accent">{playerStats.gold}</span>
          <span className="text-muted-foreground">pièces d'or</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shopItems.map((item) => (
          <Card 
            key={item.id}
            className={cn(
              "transition-all duration-300 border-2",
              item.unlocked ? "opacity-60 border-muted" : "hover:scale-102 card-glow border-primary/30"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-2 rounded-lg",
                    `bg-${getTypeColor(item.type)}/20 text-${getTypeColor(item.type)}`
                  )}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{item.name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs mt-1",
                        `border-${getTypeColor(item.type)}/50 text-${getTypeColor(item.type)}`
                      )}
                    >
                      {item.type === 'avatar' && 'Cosmétique'}
                      {item.type === 'effect' && 'Effet'}
                      {item.type === 'boost' && 'Amélioration'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                {item.description}
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-accent">
                  <Coins className="h-4 w-4" />
                  <span className="font-semibold">{item.price}</span>
                </div>
                
                {item.unlocked ? (
                  <Button variant="outline" disabled>
                    Possédé
                  </Button>
                ) : (
                  <Button
                    onClick={() => onPurchase(item.id)}
                    disabled={!canAfford(item.price)}
                    size="sm"
                    className={cn(
                      canAfford(item.price) 
                        ? "gradient-primary text-white" 
                        : "opacity-50"
                    )}
                  >
                    Acheter
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {playerStats.gold < 50 && (
        <Card className="border-primary/20">
          <CardContent className="p-4 text-center">
            <Coins className="h-8 w-8 mx-auto mb-2 text-accent" />
            <p className="text-sm text-muted-foreground">
              Complétez plus de quêtes pour gagner de l'or et débloquer des objets !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}