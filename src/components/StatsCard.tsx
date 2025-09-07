import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlayerStats } from "@/types/game";
import { Zap, Trophy, Target, Flame } from "lucide-react";

interface StatsCardProps {
  stats: PlayerStats;
  questsCompletedToday?: number;
}

export function StatsCard({ stats, questsCompletedToday = 0 }: StatsCardProps) {
  const progressPercentage = (stats.currentXP / stats.xpToNextLevel) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="card-glow transition-smooth hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Niveau</CardTitle>
          <Trophy className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-glow">{stats.level}</div>
          <Progress value={progressPercentage} className="mt-2 h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {stats.currentXP} / {stats.xpToNextLevel} XP
          </p>
        </CardContent>
      </Card>

      <Card className="card-glow transition-smooth hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">XP Total</CardTitle>
          <Zap className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-glow">{stats.totalXP.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Expérience accumulée
          </p>
        </CardContent>
      </Card>

      <Card className="card-glow transition-smooth hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Série</CardTitle>
          <Flame className="h-4 w-4 text-discipline" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-glow">{stats.streak}</div>
          <p className="text-xs text-muted-foreground">
            {stats.streak > 0 ? 'jours consécutifs' : 'Commencez aujourd\'hui!'}
          </p>
        </CardContent>
      </Card>

      <Card className="card-glow transition-smooth hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quêtes du jour</CardTitle>
          <Target className="h-4 w-4 text-health" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-glow">{questsCompletedToday}</div>
          <p className="text-xs text-muted-foreground">
            Accomplies aujourd'hui
          </p>
        </CardContent>
      </Card>
    </div>
  );
}