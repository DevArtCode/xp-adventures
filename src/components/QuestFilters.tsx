import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Quest, Domain, QuestPriority, DOMAIN_NAMES, PRIORITY_LABELS } from "@/types/game";
import { Search, Filter, X, SortAsc, SortDesc } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestFiltersProps {
  quests: Quest[];
  onFilteredQuestsChange: (quests: Quest[]) => void;
}

type SortOption = 'date' | 'priority' | 'xp' | 'domain' | 'title';
type SortOrder = 'asc' | 'desc';

export function QuestFilters({ quests, onFilteredQuestsChange }: QuestFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<Domain | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<QuestPriority | 'all'>('all');
  const [selectedRecurrence, setSelectedRecurrence] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const applyFilters = () => {
    let filtered = [...quests];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(quest => 
        quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Domain filter
    if (selectedDomain !== 'all') {
      filtered = filtered.filter(quest => quest.domain === selectedDomain);
    }

    // Priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(quest => quest.priority === selectedPriority);
    }

    // Recurrence filter
    if (selectedRecurrence !== 'all') {
      filtered = filtered.filter(quest => quest.recurrence === selectedRecurrence);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'xp':
          aValue = a.xp;
          bValue = b.xp;
          break;
        case 'domain':
          aValue = a.domain;
          bValue = b.domain;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    onFilteredQuestsChange(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDomain('all');
    setSelectedPriority('all');
    setSelectedRecurrence('all');
    setSortBy('date');
    setSortOrder('desc');
    onFilteredQuestsChange(quests);
  };

  const hasActiveFilters = searchTerm || selectedDomain !== 'all' || selectedPriority !== 'all' || selectedRecurrence !== 'all';

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedDomain, selectedPriority, selectedRecurrence, sortBy, sortOrder, quests]);

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Filter className="h-4 w-4" />
        Filtres et Tri
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-6 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Effacer
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une quête..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Select value={selectedDomain} onValueChange={(value) => setSelectedDomain(value as Domain | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Domaine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les domaines</SelectItem>
            {Object.entries(DOMAIN_NAMES).map(([key, name]) => (
              <SelectItem key={key} value={key}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPriority} onValueChange={(value) => setSelectedPriority(value as QuestPriority | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les priorités</SelectItem>
            {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedRecurrence} onValueChange={setSelectedRecurrence}>
          <SelectTrigger>
            <SelectValue placeholder="Récurrence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les récurrences</SelectItem>
            <SelectItem value="none">Ponctuel</SelectItem>
            <SelectItem value="daily">Quotidien</SelectItem>
            <SelectItem value="weekly">Hebdomadaire</SelectItem>
            <SelectItem value="monthly">Mensuel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Trier par:</span>
        
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="priority">Priorité</SelectItem>
            <SelectItem value="xp">XP</SelectItem>
            <SelectItem value="domain">Domaine</SelectItem>
            <SelectItem value="title">Titre</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="h-8 px-2"
        >
          {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Recherche: "{searchTerm}"
            </Badge>
          )}
          {selectedDomain !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {DOMAIN_NAMES[selectedDomain]}
            </Badge>
          )}
          {selectedPriority !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {PRIORITY_LABELS[selectedPriority]}
            </Badge>
          )}
          {selectedRecurrence !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {selectedRecurrence === 'none' ? 'Ponctuel' : 
               selectedRecurrence === 'daily' ? 'Quotidien' :
               selectedRecurrence === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}