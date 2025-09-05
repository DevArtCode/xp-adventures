import { StatsCard } from "@/components/StatsCard";
import { QuestCard } from "@/components/QuestCard";
import { AddQuestForm } from "@/components/AddQuestForm";
import { DomainProgress } from "@/components/DomainProgress";
import { CompletedQuestsList } from "@/components/CompletedQuestsList";
import { QuestTemplates } from "@/components/QuestTemplates";
import { DomainLevels } from "@/components/DomainLevels";
import { Avatar } from "@/components/Avatar";
import { useGameData } from "@/hooks/useGameData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sword, Crown, Sparkles, BookTemplate, BarChart3, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { gameData, addQuest, completeQuest, deleteQuest, addTemplate, createQuestFromTemplate, deleteTemplate } = useGameData();
  const { toast } = useToast();

  const handleQuestComplete = (questId: string) => {
    const quest = gameData.quests.find(q => q.id === questId);
    if (quest) {
      const streakMultiplier = Math.min(1 + (gameData.playerStats.streak * 0.1), 3);
      const bonusXP = Math.floor(quest.xp * streakMultiplier);
      
      completeQuest(questId);
      toast({
        title: "🎉 Quête accomplie !",
        description: `Vous avez gagné ${bonusXP} XP en ${quest.title}${streakMultiplier > 1 ? ` (Bonus série x${streakMultiplier.toFixed(1)})` : ''}`,
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
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>Niveau {gameData.playerStats.level}</span>
            <span>•</span>
            <span>{gameData.playerStats.gold} Or</span>
            <span>•</span>
            <span>Série: {gameData.playerStats.streak} jour{gameData.playerStats.streak > 1 ? 's' : ''}</span>
          </div>
        </div>

          {/* Stats Overview */}
          <StatsCard stats={gameData.playerStats} />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <Tabs defaultValue="quests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <Sword className="h-4 w-4" />
              <span className="hidden sm:inline">Quêtes</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <BookTemplate className="h-4 w-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Progrès</span>
            </TabsTrigger>
            <TabsTrigger value="avatar" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Avatar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="space-y-6">
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
                    <AddQuestForm 
                      onAddQuest={addQuest} 
                      customCategories={gameData.customCategories}
                    />
                    
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
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <QuestTemplates
              templates={gameData.questTemplates}
              customCategories={gameData.customCategories}
              onCreateFromTemplate={createQuestFromTemplate}
              onAddTemplate={addTemplate}
              onDeleteTemplate={deleteTemplate}
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <DomainLevels stats={gameData.playerStats} />
              <div className="space-y-6">
                <DomainProgress stats={gameData.playerStats} />
                <CompletedQuestsList completedQuests={gameData.completedQuests} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="avatar" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Avatar 
                  avatar={gameData.playerStats.avatar} 
                  playerLevel={gameData.playerStats.level} 
                />
              </div>
              <div className="lg:col-span-2">
                <DomainLevels stats={gameData.playerStats} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
