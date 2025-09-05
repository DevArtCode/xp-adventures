import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PlayerStats, Domain, DOMAIN_NAMES, DOMAIN_ICONS } from '@/types/game';
import { Crown, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DomainLevelsProps {
  stats: PlayerStats;
}

export function DomainLevels({ stats }: DomainLevelsProps) {
  const getDomainRank = (level: number) => {
    if (level >= 20) return { title: 'Maître', color: 'text-creativity' };
    if (level >= 15) return { title: 'Expert', color: 'text-accent' };
    if (level >= 10) return { title: 'Avancé', color: 'text-knowledge' };
    if (level >= 5) return { title: 'Compétent', color: 'text-health' };
    return { title: 'Novice', color: 'text-muted-foreground' };
  };

  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Maîtrise des Domaines
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Coins className="h-4 w-4 text-accent" />
            <span className="font-bold text-accent">{stats.gold}</span>
            <span className="text-muted-foreground">Or</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {Object.entries(stats.domainStats).map(([domain, domainStat]) => {
          const domainKey = domain as Domain;
          const rank = getDomainRank(domainStat.level);
          const progressPercentage = (domainStat.currentXP / domainStat.xpToNextLevel) * 100;

          return (
            <div key={domain} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{DOMAIN_ICONS[domainKey]}</span>
                  <div>
                    <h4 className="font-medium">{DOMAIN_NAMES[domainKey]}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={cn('text-xs', rank.color)}>
                        {rank.title}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Niveau {domainStat.level}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-glow">{domainStat.totalXP}</div>
                  <div className="text-xs text-muted-foreground">XP Total</div>
                </div>
              </div>
              
              <div>
                <Progress 
                  value={progressPercentage} 
                  className={cn(
                    'h-2',
                    `bg-${domain}/10`
                  )}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{domainStat.currentXP} XP</span>
                  <span>{domainStat.xpToNextLevel} XP</span>
                </div>
              </div>
            </div>
          );
        })}

        {stats.streak > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-primary">Série Active</h4>
                <p className="text-sm text-muted-foreground">
                  {stats.streak} jour{stats.streak > 1 ? 's' : ''} consécutif{stats.streak > 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{stats.streakMultiplier.toFixed(1)}x</div>
                <div className="text-xs text-muted-foreground">Bonus XP</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}