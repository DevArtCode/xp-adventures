import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlayerStats, Quest } from "@/types/game";
import { Trophy, Star, Zap, Crown, Target, Calendar, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'milestone' | 'streak' | 'domain' | 'special';
  requirement: number;
  current: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementsSystemProps {
  stats: PlayerStats;
  completedQuests: Quest[];
}

const rarityColors = {
  common: 'text-muted-foreground border-muted',
  rare: 'text-knowledge border-knowledge',
  epic: 'text-creativity border-creativity',
  legendary: 'text-accent border-accent'
};

export function AchievementsSystem({ stats, completedQuests }: AchievementsSystemProps) {
  const calculateAchievements = (): Achievement[] => {
    const totalCompleted = completedQuests.length;
    const domainCounts = completedQuests.reduce((acc, quest) => {
      acc[quest.domain] = (acc[quest.domain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate daily and weekly intensity
    const today = new Date();
    const todayStr = today.toDateString();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const todayQuests = completedQuests.filter(q => 
      q.completedAt && new Date(q.completedAt).toDateString() === todayStr
    );
    const weekQuests = completedQuests.filter(q => 
      q.completedAt && new Date(q.completedAt) >= weekStart
    );

    return [
      // XP Milestones
      {
        id: 'first_steps',
        title: 'Premiers Pas',
        description: 'Atteindre 100 XP total',
        icon: <Star className="h-5 w-5" />,
        type: 'milestone',
        requirement: 100,
        current: stats.totalXP,
        unlocked: stats.totalXP >= 100,
        rarity: 'common'
      },
      {
        id: 'novice',
        title: 'Novice Aventurier',
        description: 'Atteindre 500 XP total',
        icon: <Trophy className="h-5 w-5" />,
        type: 'milestone',
        requirement: 500,
        current: stats.totalXP,
        unlocked: stats.totalXP >= 500,
        rarity: 'common'
      },
      {
        id: 'experienced',
        title: 'Aventurier Expérimenté',
        description: 'Atteindre 1000 XP total',
        icon: <Crown className="h-5 w-5" />,
        type: 'milestone',
        requirement: 1000,
        current: stats.totalXP,
        unlocked: stats.totalXP >= 1000,
        rarity: 'rare'
      },
      {
        id: 'expert',
        title: 'Expert Légendaire',
        description: 'Atteindre 5000 XP total',
        icon: <Crown className="h-5 w-5" />,
        type: 'milestone',
        requirement: 5000,
        current: stats.totalXP,
        unlocked: stats.totalXP >= 5000,
        rarity: 'epic'
      },
      {
        id: 'master',
        title: 'Maître Ultime',
        description: 'Atteindre 10000 XP total',
        icon: <Crown className="h-5 w-5" />,
        type: 'milestone',
        requirement: 10000,
        current: stats.totalXP,
        unlocked: stats.totalXP >= 10000,
        rarity: 'legendary'
      },
      
      // Streak Achievements
      {
        id: 'consistent',
        title: 'Consistance',
        description: 'Maintenir une série de 7 jours',
        icon: <Calendar className="h-5 w-5" />,
        type: 'streak',
        requirement: 7,
        current: stats.streak,
        unlocked: stats.streak >= 7,
        rarity: 'common'
      },
      {
        id: 'dedicated',
        title: 'Dédication',
        description: 'Maintenir une série de 30 jours',
        icon: <Zap className="h-5 w-5" />,
        type: 'streak',
        requirement: 30,
        current: stats.streak,
        unlocked: stats.streak >= 30,
        rarity: 'rare'
      },
      {
        id: 'centurion',
        title: 'Centurion',
        description: 'Maintenir une série de 100 jours',
        icon: <Crown className="h-5 w-5" />,
        type: 'streak',
        requirement: 100,
        current: stats.streak,
        unlocked: stats.streak >= 100,
        rarity: 'epic'
      },
      {
        id: 'immortal',
        title: 'Immortel',
        description: 'Maintenir une série de 365 jours',
        icon: <Crown className="h-5 w-5" />,
        type: 'streak',
        requirement: 365,
        current: stats.streak,
        unlocked: stats.streak >= 365,
        rarity: 'legendary'
      },
      
      // Intensity Achievements
      {
        id: 'productive_day',
        title: 'Journée Productive',
        description: 'Compléter 5 quêtes en un jour',
        icon: <Zap className="h-5 w-5" />,
        type: 'special',
        requirement: 5,
        current: todayQuests.length,
        unlocked: todayQuests.length >= 5,
        rarity: 'common'
      },
      {
        id: 'super_productive',
        title: 'Super Productif',
        description: 'Compléter 10 quêtes en un jour',
        icon: <Target className="h-5 w-5" />,
        type: 'special',
        requirement: 10,
        current: todayQuests.length,
        unlocked: todayQuests.length >= 10,
        rarity: 'rare'
      },
      {
        id: 'weekly_warrior',
        title: 'Guerrier Hebdomadaire',
        description: 'Compléter 25 quêtes en une semaine',
        icon: <Award className="h-5 w-5" />,
        type: 'special',
        requirement: 25,
        current: weekQuests.length,
        unlocked: weekQuests.length >= 25,
        rarity: 'epic'
      },
      
      // Quest Achievements
      {
        id: 'questmaster',
        title: 'Maître des Quêtes',
        description: 'Compléter 100 quêtes au total',
        icon: <Target className="h-5 w-5" />,
        type: 'special',
        requirement: 100,
        current: totalCompleted,
        unlocked: totalCompleted >= 100,
        rarity: 'rare'
      },
      
      // Domain Achievements
      {
        id: 'healthy',
        title: 'Gardien de la Santé',
        description: 'Compléter 50 quêtes de Santé',
        icon: <Award className="h-5 w-5" />,
        type: 'domain',
        requirement: 50,
        current: domainCounts.health || 0,
        unlocked: (domainCounts.health || 0) >= 50,
        rarity: 'common'
      },
      {
        id: 'scholar',
        title: 'Érudit',
        description: 'Compléter 50 quêtes de Savoirs',
        icon: <Award className="h-5 w-5" />,
        type: 'domain',
        requirement: 50,
        current: domainCounts.knowledge || 0,
        unlocked: (domainCounts.knowledge || 0) >= 50,
        rarity: 'common'
      },
      {
        id: 'artist',
        title: 'Artiste',
        description: 'Compléter 50 quêtes de Créativité',
        icon: <Award className="h-5 w-5" />,
        type: 'domain',
        requirement: 50,
        current: domainCounts.creativity || 0,
        unlocked: (domainCounts.creativity || 0) >= 50,
        rarity: 'common'
      },
      {
        id: 'disciplined',
        title: 'Discipliné',
        description: 'Compléter 50 quêtes de Discipline',
        icon: <Award className="h-5 w-5" />,
        type: 'domain',
        requirement: 50,
        current: domainCounts.discipline || 0,
        unlocked: (domainCounts.discipline || 0) >= 50,
        rarity: 'common'
      },
      {
        id: 'social',
        title: 'Papillon Social',
        description: 'Compléter 50 quêtes de Relations',
        icon: <Award className="h-5 w-5" />,
        type: 'domain',
        requirement: 50,
        current: domainCounts.relationships || 0,
        unlocked: (domainCounts.relationships || 0) >= 50,
        rarity: 'common'
      }
    ];
  };

  const achievements = calculateAchievements();
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const progressAchievements = achievements.filter(a => !a.unlocked && a.current > 0);

  return (
    <div className="space-y-6">
      {/* Unlocked Achievements */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Succès Débloqués ({unlockedAchievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unlockedAchievements.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Aucun succès débloqué pour le moment
            </p>
          ) : (
            <div className="grid gap-3">
              {unlockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border-2 transition-smooth",
                    "bg-gradient-to-r from-background to-card hover:scale-102",
                    rarityColors[achievement.rarity]
                  )}
                >
                  <div className="p-2 rounded-full bg-primary/20 text-primary">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        rarityColors[achievement.rarity]
                      )}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Trophy className="h-5 w-5 text-accent animate-pulse-glow" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Achievements */}
      {progressAchievements.length > 0 && (
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Succès en Cours ({progressAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {progressAchievements.map((achievement) => {
                const progress = Math.min((achievement.current / achievement.requirement) * 100, 100);
                
                return (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 rounded-lg border transition-smooth hover:scale-102"
                  >
                    <div className="p-2 rounded-full bg-muted text-muted-foreground">
                      {achievement.icon}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          rarityColors[achievement.rarity]
                        )}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{achievement.current} / {achievement.requirement}</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}