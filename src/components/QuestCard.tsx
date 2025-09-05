import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Quest, DOMAIN_COLORS, DOMAIN_NAMES, DOMAIN_ICONS, PRIORITY_COLORS, PRIORITY_LABELS } from "@/types/game";
import { CheckCircle, Clock, Trash2, Zap, AlertCircle, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => void;
  onDelete: (questId: string) => void;
}

export function QuestCard({ quest, onComplete, onDelete }: QuestCardProps) {
  const domainColor = DOMAIN_COLORS[quest.domain];
  const domainName = DOMAIN_NAMES[quest.domain];
  const domainIcon = DOMAIN_ICONS[quest.domain];

  const handleComplete = () => {
    onComplete(quest.id);
  };

  const isOverdue = quest.dueDate && new Date(quest.dueDate) < new Date();

  return (
    <Card className={cn(
      "card-glow transition-smooth hover:scale-102 relative overflow-hidden",
      isOverdue && "border-destructive/50"
    )}>
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full",
        `bg-${domainColor}`
      )} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{domainIcon}</span>
            <Badge variant="secondary" className={cn(
              "text-xs",
              `bg-${domainColor}/10 text-${domainColor} border-${domainColor}/20`
            )}>
              {domainName}
            </Badge>
            {quest.priority !== 'medium' && (
              <Badge variant="outline" className={cn(
                "text-xs",
                PRIORITY_COLORS[quest.priority]
              )}>
                <AlertCircle className="h-3 w-3 mr-1" />
                {PRIORITY_LABELS[quest.priority]}
              </Badge>
            )}
            {quest.recurrence !== 'none' && (
              <Badge variant="outline" className="text-xs">
                <Repeat className="h-3 w-3 mr-1" />
                Récurrent
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-accent">
              <Zap className="h-3 w-3" />
              <span className="text-sm font-medium">{quest.xp}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(quest.id)}
              className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <CardTitle className="text-base leading-tight">{quest.title}</CardTitle>
        {quest.description && (
          <CardDescription className="text-sm">{quest.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {quest.dueDate
                ? `Échéance: ${new Date(quest.dueDate).toLocaleDateString()}`
                : 'Pas d\'échéance'
              }
            </span>
          </div>
          
          <Button
            onClick={handleComplete}
            size="sm"
            className="gradient-primary text-white border-0 hover:opacity-90"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Terminer
          </Button>
        </div>

        {quest.subQuests && quest.subQuests.length > 0 && (
          <div className="mt-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Sous-quêtes:</p>
            {quest.subQuests.map((subQuest) => (
              <div key={subQuest.id} className="flex items-center gap-2 text-sm">
                <CheckCircle className={cn(
                  "h-3 w-3",
                  subQuest.completed ? "text-health" : "text-muted-foreground"
                )} />
                <span className={cn(
                  subQuest.completed && "line-through text-muted-foreground"
                )}>
                  {subQuest.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}