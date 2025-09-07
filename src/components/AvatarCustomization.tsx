import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlayerStats, ShopItem } from "@/types/game";
import { 
  User, 
  ShoppingBag, 
  Sparkles, 
  Zap, 
  Crown,
  ArrowLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarCustomizationProps {
  playerStats: PlayerStats;
  shopItems: ShopItem[];
  onPurchase: (itemId: string) => void;
  onBack: () => void;
}

export function AvatarCustomization({ 
  playerStats, 
  shopItems, 
  onPurchase, 
  onBack 
}: AvatarCustomizationProps) {
  const canAfford = (price: number) => playerStats.gold >= price;

  const avatarItems = shopItems.filter(item => item.type === 'avatar');
  const effectItems = shopItems.filter(item => item.type === 'effect');
  const boostItems = shopItems.filter(item => item.type === 'boost');

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

  const ItemSection = ({ title, items, icon }: { 
    title: string; 
    items: ShopItem[]; 
    icon: React.ReactNode;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold text-lg">{title}</h3>
        <Badge variant="secondary">{items.length}</Badge>
      </div>
      
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Card 
            key={item.id}
            className={cn(
              "transition-all duration-300",
              item.unlocked 
                ? "bg-muted/30 border-muted" 
                : "hover:scale-102 card-glow border-primary/20"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded-md",
                    `bg-${getTypeColor(item.type)}/20 text-${getTypeColor(item.type)}`
                  )}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-accent">
                  <Crown className="h-3 w-3" />
                  <span className="text-sm font-semibold">{item.price}</span>
                </div>
                
                {item.unlocked ? (
                  <Badge variant="outline" className="text-xs">
                    Possédé
                  </Badge>
                ) : (
                  <Button
                    onClick={() => onPurchase(item.id)}
                    disabled={!canAfford(item.price)}
                    size="sm"
                    variant={canAfford(item.price) ? "default" : "secondary"}
                    className="text-xs"
                  >
                    Acheter
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/20 text-primary">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Personnalisation Avatar</CardTitle>
                <p className="text-muted-foreground">
                  Customisez votre apparence et vos effets
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Inventory Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-health">
                {avatarItems.filter(i => i.unlocked).length}
              </div>
              <div className="text-sm text-muted-foreground">Cosmétiques</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-creativity">
                {effectItems.filter(i => i.unlocked).length}
              </div>
              <div className="text-sm text-muted-foreground">Effets</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-discipline">
                {boostItems.filter(i => i.unlocked).length}
              </div>
              <div className="text-sm text-muted-foreground">Améliorations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Sections */}
      <ItemSection 
        title="Cosmétiques Avatar" 
        items={avatarItems}
        icon={<User className="h-5 w-5 text-health" />}
      />
      
      <Separator />
      
      <ItemSection 
        title="Effets Visuels" 
        items={effectItems}
        icon={<Sparkles className="h-5 w-5 text-creativity" />}
      />
      
      <Separator />
      
      <ItemSection 
        title="Améliorations" 
        items={boostItems}
        icon={<Zap className="h-5 w-5 text-discipline" />}
      />
    </div>
  );
}