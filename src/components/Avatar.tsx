import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AvatarState } from '@/types/game';
import { User, Star, Shield } from 'lucide-react';

interface AvatarProps {
  avatar: AvatarState;
  playerLevel: number;
}

export function Avatar({ avatar, playerLevel }: AvatarProps) {
  const getAvatarRank = (level: number) => {
    if (level >= 50) return { title: 'Légende', color: 'text-creativity', icon: '👑' };
    if (level >= 30) return { title: 'Héros', color: 'text-accent', icon: '⚔️' };
    if (level >= 20) return { title: 'Champion', color: 'text-knowledge', icon: '🏆' };
    if (level >= 10) return { title: 'Guerrier', color: 'text-health', icon: '🛡️' };
    if (level >= 5) return { title: 'Aventurier', color: 'text-discipline', icon: '🗡️' };
    return { title: 'Novice', color: 'text-muted-foreground', icon: '🧙‍♂️' };
  };

  const rank = getAvatarRank(playerLevel);

  const getAvatarAppearance = (level: number) => {
    // Avatar évolue selon le niveau du joueur
    if (level >= 50) return '🧙‍♂️✨'; // Mage puissant
    if (level >= 30) return '🦸‍♂️'; // Super héros
    if (level >= 20) return '👨‍💼⚔️'; // Guerrier en armure
    if (level >= 10) return '🧑‍🎓🛡️'; // Étudiant guerrier
    if (level >= 5) return '👤🗡️'; // Aventurier de base
    return '👤'; // Novice
  };

  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Mon Avatar
        </CardTitle>
      </CardHeader>

      <CardContent className="text-center space-y-4">
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 rounded-full border-4 border-primary/30">
          <div className="text-4xl">
            {getAvatarAppearance(playerLevel)}
          </div>
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

        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center justify-center gap-1">
            <Star className="h-3 w-3" />
            Débloqués
          </h4>
          <div className="text-xs text-muted-foreground">
            {avatar.unlocked.length} élément{avatar.unlocked.length > 1 ? 's' : ''} débloqué{avatar.unlocked.length > 1 ? 's' : ''}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}