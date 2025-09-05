import { StatsCard } from "@/components/StatsCard";
import { QuestCard } from "@/components/QuestCard";
import { AddQuestForm } from "@/components/AddQuestForm";
import { DomainProgress } from "@/components/DomainProgress";
import { CompletedQuestsList } from "@/components/CompletedQuestsList";
import { useGameData } from "@/hooks/useGameData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sword, Crown, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { gameData, addQuest, completeQuest, deleteQuest } = useGameData();
  const { toast } = useToast();

  const handleQuestComplete = (questId: string) => {
    const quest = gameData.quests.find(q => q.id === questId);
    if (quest) {
      completeQuest(questId);
      toast({
        title: "🎉 Quête accomplie !",
        description: `Vous avez gagné ${quest.xp} XP en ${quest.title}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8 relative">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-glow">Quest Master RPG</h1>
              <Sparkles className="h-8 w-8 text-accent" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transformez votre vie en aventure épique. Accomplissez des quêtes, gagnez de l'XP et devenez le héros de votre propre histoire !
            </p>
          </div>

          {/* Stats Overview */}
          <StatsCard stats={gameData.playerStats} />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Quests */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sword className="h-5 w-5 text-primary" />
                  Quêtes Actives ({gameData.quests.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AddQuestForm onAddQuest={addQuest} />
                
                {gameData.quests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">Aucune quête active</p>
                    <p className="text-sm text-muted-foreground">
                      Créez votre première quête pour commencer votre aventure !
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {gameData.quests.map((quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        onComplete={handleQuestComplete}
                        onDelete={deleteQuest}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <DomainProgress stats={gameData.playerStats} />
            <CompletedQuestsList completedQuests={gameData.completedQuests} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
