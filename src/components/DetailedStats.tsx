import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PlayerStats, Quest, DOMAIN_NAMES, DOMAIN_COLORS } from "@/types/game";
import { BarChart3, TrendingUp, Calendar, Zap, Crown, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailedStatsProps {
  stats: PlayerStats;
  completedQuests: Quest[];
}

export function DetailedStats({ stats, completedQuests }: DetailedStatsProps) {
  const calculateWeeklyProgress = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekQuests = completedQuests.filter(quest => 
      quest.completedAt && new Date(quest.completedAt) >= weekStart
    );

    return {
      quests: weekQuests.length,
      xp: weekQuests.reduce((sum, quest) => sum + quest.xp, 0),
      domains: weekQuests.reduce((acc, quest) => {
        acc[quest.domain] = (acc[quest.domain] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  const calculateMonthlyProgress = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthQuests = completedQuests.filter(quest => 
      quest.completedAt && new Date(quest.completedAt) >= monthStart
    );

    return {
      quests: monthQuests.length,
      xp: monthQuests.reduce((sum, quest) => sum + quest.xp, 0),
      domains: monthQuests.reduce((acc, quest) => {
        acc[quest.domain] = (acc[quest.domain] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  const weeklyStats = calculateWeeklyProgress();
  const monthlyStats = calculateMonthlyProgress();

  const getDomainPercentage = (domain: string, total: number) => {
    const domainCount = Object.values(stats.domainXP)[0] > 0 ? 
      (stats.domainXP[domain as keyof typeof stats.domainXP] / stats.totalXP) * 100 : 0;
    return Math.round(domainCount);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Niveau Total</p>
                <p className="text-2xl font-bold text-primary">{stats.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">XP Total</p>
                <p className="text-2xl font-bold text-accent">{stats.totalXP.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-health" />
              <div>
                <p className="text-sm text-muted-foreground">Série</p>
                <p className="text-2xl font-bold text-health">{stats.streak}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-discipline" />
              <div>
                <p className="text-sm text-muted-foreground">Or</p>
                <p className="text-2xl font-bold text-discipline">{stats.gold}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly & Monthly Progress */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-health" />
              Progrès Hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Quêtes complétées</span>
              <Badge variant="secondary">{weeklyStats.quests}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">XP gagnés</span>
              <Badge variant="outline" className="text-accent border-accent/20">
                {weeklyStats.xp} XP
              </Badge>
            </div>
            
            {Object.keys(weeklyStats.domains).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Domaines actifs</p>
                {Object.entries(weeklyStats.domains).map(([domain, count]) => (
                  <div key={domain} className="flex justify-between items-center">
                    <span className={cn(
                      "text-sm",
                      `text-${DOMAIN_COLORS[domain as keyof typeof DOMAIN_COLORS]}`
                    )}>
                      {DOMAIN_NAMES[domain as keyof typeof DOMAIN_NAMES]}
                    </span>
                    <span className="text-xs text-muted-foreground">{count} quêtes</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-creativity" />
              Progrès Mensuel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Quêtes complétées</span>
              <Badge variant="secondary">{monthlyStats.quests}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">XP gagnés</span>
              <Badge variant="outline" className="text-accent border-accent/20">
                {monthlyStats.xp} XP
              </Badge>
            </div>
            
            {Object.keys(monthlyStats.domains).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Domaines actifs</p>
                {Object.entries(monthlyStats.domains).map(([domain, count]) => (
                  <div key={domain} className="flex justify-between items-center">
                    <span className={cn(
                      "text-sm",
                      `text-${DOMAIN_COLORS[domain as keyof typeof DOMAIN_COLORS]}`
                    )}>
                      {DOMAIN_NAMES[domain as keyof typeof DOMAIN_NAMES]}
                    </span>
                    <span className="text-xs text-muted-foreground">{count} quêtes</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Domain Distribution */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Répartition par Domaine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(stats.domainXP).map(([domain, xp]) => {
            const percentage = stats.totalXP > 0 ? (xp / stats.totalXP) * 100 : 0;
            const domainStats = stats.domainStats[domain as keyof typeof stats.domainStats];
            
            return (
              <div key={domain} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-medium",
                      `text-${DOMAIN_COLORS[domain as keyof typeof DOMAIN_COLORS]}`
                    )}>
                      {DOMAIN_NAMES[domain as keyof typeof DOMAIN_NAMES]}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Niv. {domainStats.level}
                    </Badge>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{xp} XP ({Math.round(percentage)}%)</div>
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className={cn(
                    "h-2",
                    `[&>div]:bg-${DOMAIN_COLORS[domain as keyof typeof DOMAIN_COLORS]}`
                  )} 
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Streak Information */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-health" />
            Informations sur la Série
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-card border">
              <p className="text-2xl font-bold text-health">{stats.streak}</p>
              <p className="text-sm text-muted-foreground">Jours consécutifs</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-card border">
              <p className="text-2xl font-bold text-accent">
                x{stats.streakMultiplier.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">Multiplicateur XP</p>
            </div>
          </div>
          
          {stats.streak >= 7 && (
            <div className="p-3 rounded-lg bg-gradient-to-r from-health/10 to-accent/10 border border-health/20">
              <p className="text-sm text-center">
                🔥 Série exceptionnelle ! Vous gagnez {Math.round((stats.streakMultiplier - 1) * 100)}% d'XP bonus !
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}