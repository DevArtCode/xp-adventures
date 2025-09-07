export type Domain = 'health' | 'knowledge' | 'creativity' | 'discipline' | 'relationships';

export type QuestPriority = 'low' | 'medium' | 'high' | 'critical';
export type QuestRecurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

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
  priority: QuestPriority;
  recurrence: QuestRecurrence;
  recurrenceConfig?: RecurrenceConfig;
  subQuests?: SubQuest[];
  isTemplate?: boolean;
  templateId?: string;
  category?: string;
}

export interface RecurrenceConfig {
  frequency: number; // every X days/weeks/months
  daysOfWeek?: number[]; // 0-6 for weekly recurrence
  dayOfMonth?: number; // for monthly recurrence
  endDate?: Date;
}

export interface SubQuest {
  id: string;
  title: string;
  completed: boolean;
}

export interface DomainStats {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
}

export interface PlayerStats {
  level: number;
  totalXP: number;
  currentXP: number;
  xpToNextLevel: number;
  domainXP: Record<Domain, number>;
  domainStats: Record<Domain, DomainStats>;
  streak: number;
  lastActiveDate: string;
  gold: number;
  streakMultiplier: number;
  avatar: AvatarState;
}

export interface AvatarState {
  level: number;
  accessories: string[];
  unlocked: string[];
}

export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  domain: Domain;
  xp: number;
  priority: QuestPriority;
  recurrence: QuestRecurrence;
  recurrenceConfig?: RecurrenceConfig;
  category?: string;
  subQuests?: Omit<SubQuest, 'id' | 'completed'>[];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'avatar' | 'effect' | 'boost';
  unlocked: boolean;
}

export interface GameData {
  playerStats: PlayerStats;
  quests: Quest[];
  completedQuests: Quest[];
  questTemplates: QuestTemplate[];
  customCategories: string[];
  shopItems?: ShopItem[];
  questsCompletedToday?: number;
}

export const DOMAIN_COLORS: Record<Domain, string> = {
  health: 'health',
  knowledge: 'knowledge', 
  creativity: 'creativity',
  discipline: 'discipline',
  relationships: 'relationships'
};

export const PRIORITY_COLORS: Record<QuestPriority, string> = {
  low: 'text-muted-foreground',
  medium: 'text-knowledge',
  high: 'text-creativity',
  critical: 'text-destructive'
};

export const PRIORITY_LABELS: Record<QuestPriority, string> = {
  low: 'Faible',
  medium: 'Moyenne',
  high: 'Haute', 
  critical: 'Critique'
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