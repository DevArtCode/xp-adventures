import { useState, useEffect } from "react";
import { useGameData } from "@/hooks/useGameData";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { AddQuestForm } from "@/components/AddQuestForm";
import { QuestCard } from "@/components/QuestCard";
import { StatsCard } from "@/components/StatsCard";
import { QuestTemplates } from "@/components/QuestTemplates";
import { DomainLevels } from "@/components/DomainLevels";
import { Avatar } from "@/components/Avatar";
import { AvatarCustomization } from "@/components/AvatarCustomization";
import { AchievementsSystem } from "@/components/AchievementsSystem";
import { DetailedStats } from "@/components/DetailedStats";
import { QuestFilters } from "@/components/QuestFilters";
import { NotificationSystem } from "@/components/NotificationSystem";
import { CompletedQuestsList } from "@/components/CompletedQuestsList";
import { UnlockedZones } from "@/components/UnlockedZones";
import { ZoneInterface } from "@/components/ZoneInterface";
import { GameSettings } from "@/components/GameSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sword, Trophy, BarChart3, User, Settings, Target, Map, ShoppingBag } from "lucide-react";

export default function Index() {
  const { 
    gameData, 
    addQuest, 
    completeQuest, 
    deleteQuest,
    addTemplate,
    createQuestFromTemplate,
    deleteTemplate,
    addCategory,
    deleteCategory,
    resetGame,
    purchaseItem
  } = useGameData();
  
  const { playQuestComplete } = useSoundEffects();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showAvatarCustomization, setShowAvatarCustomization] = useState(false);
  
  // Calculate quests completed today
  const today = new Date().toDateString();
  const questsCompletedToday = gameData.completedQuests.filter(quest => 
    quest.completedAt && new Date(quest.completedAt).toDateString() === today
  ).length;
  
  const handleQuestComplete = (questId: string) => {
    completeQuest(questId);
    playQuestComplete();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8 relative">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Quest Master RPG</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transformez votre vie en aventure épique !
            </p>
          </div>
          <StatsCard stats={gameData.playerStats} questsCompletedToday={questsCompletedToday} />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <Tabs defaultValue="quests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <Sword className="h-4 w-4" />
              Quêtes
            </TabsTrigger>
            <TabsTrigger value="avatar" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Avatar
            </TabsTrigger>
            <TabsTrigger value="zones" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Zones
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Boutique
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Succès
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="space-y-6">
            <div className="space-y-4">
              <AddQuestForm 
                onAddQuest={addQuest} 
                customCategories={gameData.customCategories}
              />
              
              <QuestFilters 
                quests={gameData.quests}
                onFilteredQuestsChange={(filtered) => {}}
              />
              
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
            </div>
          </TabsContent>

          <TabsContent value="avatar" className="space-y-6">
            {showAvatarCustomization ? (
              <AvatarCustomization
                playerStats={gameData.playerStats}
                shopItems={gameData.shopItems || []}
                onPurchase={purchaseItem}
                onBack={() => setShowAvatarCustomization(false)}
              />
            ) : (
              <>
                <Avatar 
                  avatar={gameData.playerStats.avatar} 
                  playerLevel={gameData.playerStats.level}
                  shopItems={gameData.shopItems || []}
                  onCustomize={() => setShowAvatarCustomization(true)}
                />
                <DomainLevels stats={gameData.playerStats} />
              </>
            )}
          </TabsContent>

          <TabsContent value="zones" className="space-y-6">
            {selectedZone ? (
              <ZoneInterface
                selectedZone={selectedZone}
                stats={gameData.playerStats}
                completedQuests={gameData.completedQuests}
                shopItems={gameData.shopItems || []}
                onPurchase={purchaseItem}
                onBack={() => setSelectedZone(null)}
              />
            ) : (
              <UnlockedZones 
                stats={gameData.playerStats}
                onZoneSelect={setSelectedZone}
                selectedZone=""
              />
            )}
          </TabsContent>

          <TabsContent value="shop" className="space-y-6">
            <ZoneInterface
              selectedZone="shop"
              stats={gameData.playerStats}
              completedQuests={gameData.completedQuests}
              shopItems={gameData.shopItems || []}
              onPurchase={purchaseItem}
              onBack={() => {}}
            />
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

          <TabsContent value="templates" className="space-y-6">
            <QuestTemplates
              templates={gameData.questTemplates}
              onCreateFromTemplate={createQuestFromTemplate}
              onAddTemplate={addTemplate}
              onDeleteTemplate={deleteTemplate}
              customCategories={gameData.customCategories}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <GameSettings
              customCategories={gameData.customCategories}
              onAddCategory={addCategory}
              onDeleteCategory={deleteCategory}
              onResetGame={resetGame}
            />
            <CompletedQuestsList completedQuests={gameData.completedQuests} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
