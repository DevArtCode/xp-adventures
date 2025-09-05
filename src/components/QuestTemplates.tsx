import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuestTemplate, Domain, QuestPriority, DOMAIN_NAMES, DOMAIN_ICONS, PRIORITY_LABELS } from '@/types/game';
import { BookTemplate, Play, Trash2, Plus, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestTemplatesProps {
  templates: QuestTemplate[];
  customCategories: string[];
  onCreateFromTemplate: (templateId: string) => void;
  onAddTemplate: (template: Omit<QuestTemplate, 'id'>) => void;
  onDeleteTemplate: (templateId: string) => void;
}

export function QuestTemplates({ 
  templates, 
  customCategories, 
  onCreateFromTemplate, 
  onAddTemplate, 
  onDeleteTemplate 
}: QuestTemplatesProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Omit<QuestTemplate, 'id'>>({
    title: '',
    description: '',
    domain: 'health',
    xp: 10,
    priority: 'medium',
    recurrence: 'none'
  });

  const handleCreateTemplate = () => {
    if (newTemplate.title.trim()) {
      onAddTemplate(newTemplate);
      setNewTemplate({
        title: '',
        description: '',
        domain: 'health',
        xp: 10,
        priority: 'medium',
        recurrence: 'none'
      });
      setIsCreating(false);
    }
  };

  return (
    <Card className="card-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookTemplate className="h-5 w-5 text-creativity" />
              Templates de Quêtes ({templates.length})
            </CardTitle>
            <CardDescription>
              Créez des modèles pour vos quêtes récurrentes
            </CardDescription>
          </div>
          
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-primary">
                <Plus className="h-4 w-4 mr-1" />
                Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un Template</DialogTitle>
                <DialogDescription>
                  Définissez un modèle de quête réutilisable
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Séance de sport"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description optionnelle"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Domaine</Label>
                    <Select value={newTemplate.domain} onValueChange={(domain: Domain) => setNewTemplate(prev => ({ ...prev, domain }))}>
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
                    <Select value={newTemplate.priority} onValueChange={(priority: QuestPriority) => setNewTemplate(prev => ({ ...prev, priority }))}>
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

                <div>
                  <Label htmlFor="xp">Points XP</Label>
                  <Input
                    id="xp"
                    type="number"
                    min="1"
                    max="100"
                    value={newTemplate.xp}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, xp: parseInt(e.target.value) || 10 }))}
                  />
                </div>

                <Button onClick={handleCreateTemplate} className="w-full gradient-primary">
                  Créer le Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {templates.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <BookTemplate className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Aucun template créé</p>
            <p className="text-sm">Créez vos premiers modèles de quêtes !</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{DOMAIN_ICONS[template.domain]}</span>
                    <h4 className="font-medium">{template.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {PRIORITY_LABELS[template.priority]}
                    </Badge>
                  </div>
                  {template.description && (
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {template.xp} XP
                    </span>
                    {template.category && (
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCreateFromTemplate(template.id)}
                    className="h-8 w-8 p-0 hover:bg-primary/20"
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTemplate(template.id)}
                    className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}