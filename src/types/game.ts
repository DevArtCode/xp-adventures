export type Domain = 'health' | 'knowledge' | 'creativity' | 'discipline' | 'relationships';

export interface Quest {
  id: string;
  title: string;
  description: string;
  domain: Domain;
  xp: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  subQuests?: SubQuest[];
}

export interface SubQuest {
  id: string;
  title: string;
  completed: boolean;
}

export interface PlayerStats {
  level: number;
  totalXP: number;
  currentXP: number;
  xpToNextLevel: number;
  domainXP: Record<Domain, number>;
  streak: number;
  lastActiveDate: string;
}

export interface GameData {
  playerStats: PlayerStats;
  quests: Quest[];
  completedQuests: Quest[];
}

export const DOMAIN_COLORS: Record<Domain, string> = {
  health: 'health',
  knowledge: 'knowledge', 
  creativity: 'creativity',
  discipline: 'discipline',
  relationships: 'relationships'
};

export const DOMAIN_NAMES: Record<Domain, string> = {
  health: 'Santé',
  knowledge: 'Savoirs',
  creativity: 'Créativité', 
  discipline: 'Discipline',
  relationships: 'Relations'
};

export const DOMAIN_ICONS: Record<Domain, string> = {
  health: '🌱',
  knowledge: '📚',
  creativity: '🎨',
  discipline: '⚔️',
  relationships: '❤️'
};