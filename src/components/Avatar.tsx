import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar as UIAvatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AvatarState } from '@/types/game';
import { User, Star, Shield, Palette, Sparkles } from 'lucide-react';

interface AvatarProps {
  avatar: AvatarState;
  playerLevel: number;
  shopItems?: any[];
  onCustomize?: () => void;
}

export function Avatar({ avatar, playerLevel, shopItems = [], onCustomize }: AvatarProps) {
  const getAvatarRank = (level: number) => {
    if (level >= 50) return { title: 'Légende', color: 'text-creativity', icon: '👑' };
    if (level >= 30) return { title: 'Héros', color: 'text-accent', icon: '⚔️' };
    if (level >= 20) return { title: 'Champion', color: 'text-knowledge', icon: '🏆' };
    if (level >= 10) return { title: 'Guerrier', color: 'text-health', icon: '🛡️' };
    if (level >= 5) return { title: 'Aventurier', color: 'text-discipline', icon: '🗡️' };
    return { title: 'Novice', color: 'text-muted-foreground', icon: '🧙‍♂️' };
  };

  const rank = getAvatarRank(playerLevel);

  const getAvatarAppearance = (level: number, accessories: string[]) => {
    let baseAvatar = '👤';
    
    if (level >= 50) baseAvatar = '🧙‍♂️';
    else if (level >= 30) baseAvatar = '🦸‍♂️';
    else if (level >= 20) baseAvatar = '👨‍💼';
    else if (level >= 10) baseAvatar = '🧑‍🎓';
    else if (level >= 5) baseAvatar = '👤';
    
    // Ajouter les accessoires
    let accessoryEmojis = '';
    if (accessories.includes('Couronne Dorée')) accessoryEmojis += '👑';
    if (accessories.includes('Cape de Héros')) accessoryEmojis += '🦸‍♀️';
    if (accessories.includes('Épée Légendaire')) accessoryEmojis += '⚔️';
    if (accessories.includes('Armure Mystique')) accessoryEmojis += '🛡️';
    if (accessories.includes('Ailes d\'Ange')) accessoryEmojis += '👼';
    if (accessories.includes('Auréole Divine')) accessoryEmojis += '😇';
    
    return baseAvatar + accessoryEmojis;
  };
  
  const getActiveEffects = (accessories: string[]) => {
    const effects = [];
    if (accessories.includes('Effet Doré')) effects.push('✨');
    if (accessories.includes('Traînée Arc-en-ciel')) effects.push('🌈');
    if (accessories.includes('Aura de Feu')) effects.push('🔥');
    if (accessories.includes('Éclairs Cosmiques')) effects.push('⚡');
    if (accessories.includes('Champ d\'Étoiles')) effects.push('⭐');
    return effects;
  };

  // Compter les objets débloqués de la boutique
  const unlockedShopItems = shopItems.filter(item => item.unlocked).length;

  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Mon Avatar
        </CardTitle>
      </CardHeader>

      <CardContent className="text-center space-y-4">
        <div className="relative mx-auto">
          <UIAvatar className="w-32 h-32 mx-auto border-4 border-primary/30 bg-gradient-to-br from-primary/20 to-accent/20">
            <AvatarFallback className="text-6xl bg-transparent">
              {getAvatarAppearance(playerLevel, avatar.accessories)}
            </AvatarFallback>
          </UIAvatar>
          
          {/* Effets visuels */}
          {getActiveEffects(avatar.accessories).length > 0 && (
            <div className="absolute -top-2 -right-2 animate-pulse-glow">
              <div className="flex gap-1">
                {getActiveEffects(avatar.accessories).map((effect, index) => (
                  <span key={index} className="text-2xl animate-bounce-in" style={{animationDelay: `${index * 0.2}s`}}>
                    {effect}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{rank.icon}</span>
            <Badge className={rank.color}>
              {rank.title}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Niveau Avatar: {avatar.level}
          </div>
        </div>

        {avatar.accessories.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Accessoires</h4>
            <div className="flex flex-wrap gap-1 justify-center">
              {avatar.accessories.map((accessory, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {accessory}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm flex items-center gap-1">
              <Star className="h-3 w-3" />
              Collection
            </h4>
            {onCustomize && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onCustomize}
                className="text-xs"
              >
                <Palette className="h-3 w-3 mr-1" />
                Personnaliser
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-primary font-medium">{unlockedShopItems}</div>
              <div className="text-muted-foreground">Objets boutique</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-accent font-medium">{avatar.unlocked.length}</div>
              <div className="text-muted-foreground">Récompenses</div>
            </div>
          </div>
          
          {getActiveEffects(avatar.accessories).length > 0 && (
            <div className="bg-creativity/10 border border-creativity/30 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="h-3 w-3 text-creativity" />
                <span className="text-xs font-medium text-creativity">Effets actifs</span>
              </div>
              <div className="flex gap-1">
                {getActiveEffects(avatar.accessories).map((effect, index) => (
                  <span key={index} className="text-sm">{effect}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}