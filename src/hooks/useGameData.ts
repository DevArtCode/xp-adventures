import { useState, useEffect } from 'react';
import { GameData, PlayerStats, Quest, Domain, DomainStats, QuestTemplate, QuestPriority, ShopItem } from '@/types/game';

const STORAGE_KEY = 'rpg-productivity-game';

const calculateDomainLevel = (xp: number): DomainStats => {
  let level = 1;
  let xpForCurrentLevel = 0;
  let xpForNextLevel = 50; // Domains level up faster than general
  
  while (xp >= xpForNextLevel) {
    level++;
    xpForCurrentLevel = xpForNextLevel;
    xpForNextLevel = Math.floor(50 * Math.pow(1.15, level - 1));
  }
  
  return {
    level,
    currentXP: xp - xpForCurrentLevel,
    xpToNextLevel: xpForNextLevel - xpForCurrentLevel,
    totalXP: xp
  };
};

const getInitialStats = (): PlayerStats => {
  const domainXP = {
    health: 0,
    knowledge: 0,
    creativity: 0,
    discipline: 0,
    relationships: 0
  };

  const domainStats = Object.entries(domainXP).reduce((acc, [domain, xp]) => {
    acc[domain as Domain] = calculateDomainLevel(xp);
    return acc;
  }, {} as Record<Domain, DomainStats>);

  return {
    level: 1,
    totalXP: 0,
    currentXP: 0,
    xpToNextLevel: 100,
    domainXP,
    domainStats,
    streak: 0,
    lastActiveDate: new Date().toDateString(),
    gold: 0,
    streakMultiplier: 1,
    avatar: {
      level: 1,
      accessories: [],
      unlocked: ['basic_outfit']
    }
  };
};

const calculateLevel = (totalXP: number): { level: number; currentXP: number; xpToNextLevel: number } => {
  // Linear progression: Level 1 = 50 XP, Level 10 = 500 XP, Level 20 = 1000 XP
  let level = 1;
  let xpForCurrentLevel = 0;
  
  // Find current level using linear progression (50 * n)
  while (xpForCurrentLevel + (50 * level) <= totalXP) {
    xpForCurrentLevel += 50 * level;
    level++;
  }
  
  const xpForNextLevel = xpForCurrentLevel + (50 * level);
  
  return {
    level,
    currentXP: totalXP - xpForCurrentLevel,
    xpToNextLevel: xpForNextLevel - xpForCurrentLevel
  };
};

export function useGameData() {
  const [gameData, setGameData] = useState<GameData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Migration for existing data
        const migratedStats = parsed.playerStats ? {
          ...getInitialStats(),
          ...parsed.playerStats,
          domainStats: parsed.playerStats.domainStats || Object.entries(parsed.playerStats.domainXP || {}).reduce((acc, [domain, xp]) => {
            acc[domain as Domain] = calculateDomainLevel(xp as number);
            return acc;
          }, {} as Record<Domain, DomainStats>),
          gold: parsed.playerStats.gold || 0,
          streakMultiplier: parsed.playerStats.streakMultiplier || 1,
          avatar: parsed.playerStats.avatar || getInitialStats().avatar
        } : getInitialStats();

        return {
          playerStats: migratedStats,
          quests: parsed.quests || [],
          completedQuests: parsed.completedQuests || [],
          questTemplates: parsed.questTemplates || [],
          customCategories: parsed.customCategories || ['Personnel', 'Travail', 'Formation', 'Sport', 'Social'],
          shopItems: parsed.shopItems || [],
          questsCompletedToday: 0
        };
      }
    } catch (error) {
      console.error('Failed to load game data:', error);
    }
    
    return {
      playerStats: getInitialStats(),
      quests: [],
      completedQuests: [],
      questTemplates: [],
      customCategories: ['Personnel', 'Travail', 'Formation', 'Sport', 'Social'],
      shopItems: [],
      questsCompletedToday: 0
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
    } catch (error) {
      console.error('Failed to save game data:', error);
    }
  }, [gameData]);

  const addQuest = (quest: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => {
    const newQuest: Quest = {
      ...quest,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date(),
      priority: quest.priority || 'medium',
      recurrence: quest.recurrence || 'none'
    };
    
    setGameData(prev => ({
      ...prev,
      quests: [...prev.quests, newQuest]
    }));
  };

  const completeQuest = (questId: string) => {
    setGameData(prev => {
      const quest = prev.quests.find(q => q.id === questId);
      if (!quest || quest.completed) return prev;

      const completedQuest = { ...quest, completed: true, completedAt: new Date() };
      
      // Calculate streak bonus
      const today = new Date().toDateString();
      const isToday = prev.playerStats.lastActiveDate === today;
      const isYesterday = new Date(Date.now() - 86400000).toDateString() === prev.playerStats.lastActiveDate;
      
      let newStreak = prev.playerStats.streak;
      let streakMultiplier = 1;
      
      if (!isToday) {
        newStreak = isYesterday ? newStreak + 1 : 1;
        // Exponential streak bonus (max 3x)
        streakMultiplier = Math.min(1 + (newStreak * 0.1), 3);
      } else {
        streakMultiplier = Math.min(1 + (newStreak * 0.1), 3);
      }

      // Calculate XP with streak bonus
      const bonusXP = Math.floor(quest.xp * streakMultiplier);
      const newTotalXP = prev.playerStats.totalXP + bonusXP;
      const levelData = calculateLevel(newTotalXP);
      
      // Update domain XP and stats
      const newDomainXP = { ...prev.playerStats.domainXP };
      newDomainXP[quest.domain] += bonusXP;
      
      const newDomainStats = { ...prev.playerStats.domainStats };
      newDomainStats[quest.domain] = calculateDomainLevel(newDomainXP[quest.domain]);

      // Calculate gold reward (based on XP and level)
      const goldReward = Math.floor(bonusXP * 0.5) + Math.floor(levelData.level * 0.2);

      // Calculate today's completed quests
      const todayCompleted = prev.completedQuests.filter(q => 
        q.completedAt && new Date(q.completedAt).toDateString() === today
      ).length + 1;

      return {
        ...prev,
        quests: prev.quests.filter(q => q.id !== questId),
        completedQuests: [...prev.completedQuests, completedQuest],
        questsCompletedToday: todayCompleted,
        playerStats: {
          ...prev.playerStats,
          ...levelData,
          totalXP: newTotalXP,
          domainXP: newDomainXP,
          domainStats: newDomainStats,
          streak: newStreak,
          streakMultiplier,
          lastActiveDate: today,
          gold: prev.playerStats.gold + goldReward,
          avatar: {
            ...prev.playerStats.avatar,
            level: Math.floor(levelData.level / 2) + 1
          }
        }
      };
    });
  };

  const deleteQuest = (questId: string) => {
    setGameData(prev => ({
      ...prev,
      quests: prev.quests.filter(q => q.id !== questId)
    }));
  };

  const addTemplate = (template: Omit<QuestTemplate, 'id'>) => {
    const newTemplate: QuestTemplate = {
      ...template,
      id: Date.now().toString()
    };
    
    setGameData(prev => ({
      ...prev,
      questTemplates: [...prev.questTemplates, newTemplate]
    }));
  };

  const createQuestFromTemplate = (templateId: string) => {
    const template = gameData.questTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newQuest: Quest = {
      ...template,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date(),
      templateId: template.id,
      subQuests: template.subQuests?.map(sq => ({
        ...sq,
        id: Date.now().toString() + Math.random(),
        completed: false
      }))
    };

    addQuest(newQuest);
  };

  const addCategory = (category: string) => {
    setGameData(prev => ({
      ...prev,
      customCategories: [...prev.customCategories, category]
    }));
  };

  const deleteTemplate = (templateId: string) => {
    setGameData(prev => ({
      ...prev,
      questTemplates: prev.questTemplates.filter(t => t.id !== templateId)
    }));
  };

  const purchaseItem = (itemId: string) => {
    setGameData(prev => {
      const item = prev.shopItems?.find(i => i.id === itemId);
      if (!item || item.unlocked || prev.playerStats.gold < item.price) return prev;

      const updatedShopItems = prev.shopItems?.map(i => 
        i.id === itemId ? { ...i, unlocked: true } : i
      ) || [];

      return {
        ...prev,
        shopItems: updatedShopItems,
        playerStats: {
          ...prev.playerStats,
          gold: prev.playerStats.gold - item.price,
          avatar: {
            ...prev.playerStats.avatar,
            accessories: item.type === 'avatar' 
              ? [...prev.playerStats.avatar.accessories, item.id]
              : prev.playerStats.avatar.accessories
          }
        }
      };
    });
  };

  const resetGame = () => {
    const resetData = {
      playerStats: getInitialStats(),
      quests: [],
      completedQuests: [],
      questTemplates: [],
      customCategories: ['Personnel', 'Travail', 'Formation', 'Sport', 'Social'],
      shopItems: [],
      questsCompletedToday: 0
    };
    setGameData(resetData);
  };

  const deleteCategory = (categoryToDelete: string) => {
    setGameData(prev => ({
      ...prev,
      customCategories: prev.customCategories.filter(cat => cat !== categoryToDelete)
    }));
  };

  return {
    gameData,
    addQuest,
    completeQuest,
    deleteQuest,
    addTemplate,
    createQuestFromTemplate,
    addCategory,
    deleteTemplate,
    resetGame,
    deleteCategory,
    purchaseItem
  };
}