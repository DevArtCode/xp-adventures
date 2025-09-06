import React, { useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { QuestCard } from "@/components/QuestCard";
import { AddQuestForm } from "@/components/AddQuestForm";
import { DomainProgress } from "@/components/DomainProgress";
import { CompletedQuestsList } from "@/components/CompletedQuestsList";
import { QuestTemplates } from "@/components/QuestTemplates";
import { DomainLevels } from "@/components/DomainLevels";
import { Avatar } from "@/components/Avatar";
import { AchievementsSystem } from "@/components/AchievementsSystem";
import { DetailedStats } from "@/components/DetailedStats";
import { QuestFilters } from "@/components/QuestFilters";
import { NotificationSystem } from "@/components/NotificationSystem";
import { useGameData } from "@/hooks/useGameData";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sword, Crown, Sparkles, BookTemplate, BarChart3, User, Trophy, Bell, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Quest } from "@/types/game";

const Index = () => {
  const { gameData, addQuest, completeQuest, deleteQuest, addTemplate, createQuestFromTemplate, deleteTemplate } = useGameData();
  const { toast } = useToast();
  const { playQuestComplete, playLevelUp } = useSoundEffects();
  const [filteredQuests, setFilteredQuests] = useState<Quest[]>(gameData.quests);

  const handleQuestComplete = (questId: string) => {
    const quest = gameData.quests.find(q => q.id === questId);
    if (quest) {
      const previousLevel = gameData.playerStats.level;
      const streakMultiplier = Math.min(1 + (gameData.playerStats.streak * 0.1), 3);
      const bonusXP = Math.floor(quest.xp * streakMultiplier);
      
      completeQuest(questId);
      
      // Play sound effects
      playQuestComplete();
      
      // Check for level up after completing quest
      setTimeout(() => {
        if (gameData.playerStats.level > previousLevel) {
          playLevelUp();
        }
      }, 100);
      
      toast({
        title: "🎉 Quête accomplie !",
        description: `Vous avez gagné ${bonusXP} XP en ${quest.title}${streakMultiplier > 1 ? ` (Bonus série x${streakMultiplier.toFixed(1)})` : ''}`,
      });
    }
  };

  // Update filtered quests when gameData.quests changes
  React.useEffect(() => {
    setFilteredQuests(gameData.quests);
  }, [gameData.quests]);

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
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
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
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Succès</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quest Filters */}
                <QuestFilters 
                  quests={gameData.quests}
                  onFilteredQuestsChange={setFilteredQuests}
                />
                
                {/* Active Quests */}
                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sword className="h-5 w-5 text-primary" />
                      Quêtes Actives ({filteredQuests.length})
                      {filteredQuests.length !== gameData.quests.length && (
                        <span className="text-sm text-muted-foreground">
                          sur {gameData.quests.length}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AddQuestForm 
                      onAddQuest={addQuest} 
                      customCategories={gameData.customCategories}
                    />
                    
                    {filteredQuests.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-2">
                          {gameData.quests.length === 0 ? "Aucune quête active" : "Aucune quête trouvée avec les filtres actuels"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {gameData.quests.length === 0 
                            ? "Créez votre première quête pour commencer votre aventure !"
                            : "Modifiez vos filtres pour voir plus de quêtes"
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {filteredQuests.map((quest) => (
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

          <TabsContent value="achievements" className="space-y-6">
            <AchievementsSystem 
              stats={gameData.playerStats} 
              completedQuests={gameData.completedQuests} 
            />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <DetailedStats 
              stats={gameData.playerStats} 
              completedQuests={gameData.completedQuests} 
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <NotificationSystem quests={gameData.quests} />
              <div className="space-y-6">
                <Avatar 
                  avatar={gameData.playerStats.avatar} 
                  playerLevel={gameData.playerStats.level} 
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
