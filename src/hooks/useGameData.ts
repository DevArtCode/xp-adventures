import { useState, useEffect } from 'react';
import { GameData, PlayerStats, Quest, Domain } from '@/types/game';

const STORAGE_KEY = 'rpg-productivity-game';

const getInitialStats = (): PlayerStats => ({
  level: 1,
  totalXP: 0,
  currentXP: 0,
  xpToNextLevel: 100,
  domainXP: {
    health: 0,
    knowledge: 0,
    creativity: 0,
    discipline: 0,
    relationships: 0
  },
  streak: 0,
  lastActiveDate: new Date().toDateString()
});

const calculateLevel = (totalXP: number): { level: number; currentXP: number; xpToNextLevel: number } => {
  let level = 1;
  let xpForCurrentLevel = 0;
  let xpForNextLevel = 100;
  
  while (totalXP >= xpForNextLevel) {
    level++;
    xpForCurrentLevel = xpForNextLevel;
    xpForNextLevel = Math.floor(100 * Math.pow(1.2, level - 1));
  }
  
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
        return {
          playerStats: parsed.playerStats || getInitialStats(),
          quests: parsed.quests || [],
          completedQuests: parsed.completedQuests || []
        };
      }
    } catch (error) {
      console.error('Failed to load game data:', error);
    }
    
    return {
      playerStats: getInitialStats(),
      quests: [],
      completedQuests: []
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
      createdAt: new Date()
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
      const newTotalXP = prev.playerStats.totalXP + quest.xp;
      const levelData = calculateLevel(newTotalXP);
      
      // Update domain XP
      const newDomainXP = { ...prev.playerStats.domainXP };
      newDomainXP[quest.domain] += quest.xp;

      // Update streak
      const today = new Date().toDateString();
      const isToday = prev.playerStats.lastActiveDate === today;
      const isYesterday = new Date(Date.now() - 86400000).toDateString() === prev.playerStats.lastActiveDate;
      
      let newStreak = prev.playerStats.streak;
      if (!isToday) {
        newStreak = isYesterday ? newStreak + 1 : 1;
      }

      return {
        ...prev,
        quests: prev.quests.filter(q => q.id !== questId),
        completedQuests: [...prev.completedQuests, completedQuest],
        playerStats: {
          ...prev.playerStats,
          ...levelData,
          totalXP: newTotalXP,
          domainXP: newDomainXP,
          streak: newStreak,
          lastActiveDate: today
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

  return {
    gameData,
    addQuest,
    completeQuest,
    deleteQuest
  };
}