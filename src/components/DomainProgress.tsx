import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlayerStats, DOMAIN_NAMES, DOMAIN_ICONS, DOMAIN_COLORS, Domain } from "@/types/game";
import { cn } from "@/lib/utils";

interface DomainProgressProps {
  stats: PlayerStats;
}

export function DomainProgress({ stats }: DomainProgressProps) {
  const domains = Object.keys(DOMAIN_NAMES) as Domain[];
  
  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle className="text-glow">Progression par Domaine</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {domains.map((domain) => {
          const xp = stats.domainXP[domain];
          const maxXP = Math.max(...Object.values(stats.domainXP), 100);
          const percentage = (xp / maxXP) * 100;
          
          return (
            <div key={domain} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{DOMAIN_ICONS[domain]}</span>
                  <span className="font-medium">{DOMAIN_NAMES[domain]}</span>
                </div>
                <span className="text-sm font-bold text-glow">{xp} XP</span>
              </div>
              <Progress
                value={percentage}
                className={cn("h-2")}
                style={{
                  // @ts-ignore
                  '--progress-background': `hsl(var(--${DOMAIN_COLORS[domain]}))`,
                }}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}