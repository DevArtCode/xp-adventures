import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quest, DOMAIN_COLORS, DOMAIN_NAMES, DOMAIN_ICONS } from "@/types/game";
import { Trophy, Calendar, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompletedQuestsListProps {
  completedQuests: Quest[];
  limit?: number;
}

export function CompletedQuestsList({ completedQuests, limit = 5 }: CompletedQuestsListProps) {
  const recentQuests = completedQuests
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, limit);

  if (recentQuests.length === 0) {
    return (
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Quêtes Accomplies
          </CardTitle>
          <CardDescription>Vos dernières victoires apparaîtront ici</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Aucune quête accomplie pour le moment. Commencez votre aventure !
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Quêtes Accomplies
        </CardTitle>
        <CardDescription>Vos {recentQuests.length} dernières victoires</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentQuests.map((quest) => {
          const domainColor = DOMAIN_COLORS[quest.domain];
          const domainName = DOMAIN_NAMES[quest.domain];
          const domainIcon = DOMAIN_ICONS[quest.domain];
          
          return (
            <div
              key={quest.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 transition-smooth hover:bg-muted/50"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  `bg-${domainColor}/20`
                )}>
                  <span className="text-sm">{domainIcon}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{quest.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", `bg-${domainColor}/10 text-${domainColor}`)}
                    >
                      {domainName}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {quest.completedAt && new Date(quest.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-accent">
                <Zap className="h-3 w-3" />
                <span className="text-sm font-medium">+{quest.xp}</span>
              </div>
            </div>
          );
        })}
        
        {completedQuests.length > limit && (
          <p className="text-center text-xs text-muted-foreground pt-2">
            Et {completedQuests.length - limit} autres quêtes accomplies...
          </p>
        )}
      </CardContent>
    </Card>
  );
}