import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quest, Domain, QuestPriority, QuestRecurrence, RecurrenceConfig, DOMAIN_NAMES, DOMAIN_ICONS, PRIORITY_LABELS } from "@/types/game";
import { RecurrenceConfig as RecurrenceConfigComponent } from "./RecurrenceConfig";
import { Plus, Calendar, Zap } from "lucide-react";

interface AddQuestFormProps {
  onAddQuest: (quest: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => void;
  customCategories: string[];
}

const DOMAIN_CATEGORIES = {
  health: ['Sport', 'Nutrition', 'Sommeil', 'Bien-être', 'Méditation'],
  knowledge: ['Lecture', 'Études', 'Formation', 'Recherche', 'Apprentissage'],
  creativity: ['Art', 'Musique', 'Écriture', 'Design', 'Innovation'],
  discipline: ['Organisation', 'Travail', 'Productivité', 'Habitudes', 'Routine'],
  relationships: ['Famille', 'Amis', 'Réseau', 'Communication', 'Social']
};

export function AddQuestForm({ onAddQuest, customCategories }: AddQuestFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "health" as Domain,
    xp: 10,
    priority: "medium" as QuestPriority,
    recurrence: "none" as QuestRecurrence,
    category: "",
    dueDate: ""
  });
  const [recurrenceConfig, setRecurrenceConfig] = useState<RecurrenceConfig | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onAddQuest({
        title: formData.title,
        description: formData.description,
        domain: formData.domain,
        xp: formData.xp,
        priority: formData.priority,
        recurrence: formData.recurrence,
        recurrenceConfig,
        category: formData.category || undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      });
      
      setFormData({
        title: "",
        description: "",
        domain: "health",
        xp: 10,
        priority: "medium",
        recurrence: "none",
        category: "",
        dueDate: ""
      });
      setRecurrenceConfig(undefined);
      setIsExpanded(false);
    }
  };

  const handleQuickAdd = () => {
    if (formData.title.trim()) {
      onAddQuest({
        title: formData.title,
        description: "",
        domain: formData.domain,
        xp: 10,
        priority: "medium",
        recurrence: "none"
      });
      setFormData(prev => ({ ...prev, title: "" }));
    }
  };

  if (!isExpanded) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nouvelle quête rapide..."
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
            className="flex-1"
          />
          <Select value={formData.domain} onValueChange={(domain: Domain) => setFormData(prev => ({ ...prev, domain }))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DOMAIN_NAMES).map(([key, name]) => (
                <SelectItem key={key} value={key}>
                  {DOMAIN_ICONS[key as Domain]} {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleQuickAdd} disabled={!formData.title.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setIsExpanded(true)}
          className="w-full"
        >
          <Zap className="h-4 w-4 mr-2" />
          Créer une quête avancée
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg">Nouvelle Quête</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre de la quête *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Faire 30 minutes de sport"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Détails optionnels sur la quête"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Domaine</Label>
              <Select value={formData.domain} onValueChange={(domain: Domain) => setFormData(prev => ({ ...prev, domain }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DOMAIN_NAMES).map(([key, name]) => (
                    <SelectItem key={key} value={key}>
                      {DOMAIN_ICONS[key as Domain]} {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priorité</Label>
              <Select value={formData.priority} onValueChange={(priority: QuestPriority) => setFormData(prev => ({ ...prev, priority }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="xp">Points XP</Label>
              <Input
                id="xp"
                type="number"
                min="1"
                max="100"
                value={formData.xp}
                onChange={(e) => setFormData(prev => ({ ...prev, xp: parseInt(e.target.value) || 10 }))}
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Échéance</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Catégorie</Label>
            <Select value={formData.category} onValueChange={(category) => setFormData(prev => ({ ...prev, category }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {DOMAIN_CATEGORIES[formData.domain].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                {customCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <RecurrenceConfigComponent
            recurrence={formData.recurrence}
            config={recurrenceConfig}
            onRecurrenceChange={(recurrence) => setFormData(prev => ({ ...prev, recurrence }))}
            onConfigChange={setRecurrenceConfig}
          />

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="gradient-primary flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Créer la quête
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsExpanded(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}