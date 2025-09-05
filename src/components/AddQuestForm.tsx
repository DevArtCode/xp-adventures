import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Domain, DOMAIN_NAMES, DOMAIN_ICONS } from "@/types/game";
import { Plus, Sparkles } from "lucide-react";

interface AddQuestFormProps {
  onAddQuest: (quest: {
    title: string;
    description: string;
    domain: Domain;
    xp: number;
    dueDate?: Date;
  }) => void;
}

export function AddQuestForm({ onAddQuest }: AddQuestFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState<Domain>("health");
  const [xp, setXp] = useState(50);
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    onAddQuest({
      title: title.trim(),
      description: description.trim(),
      domain,
      xp,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    // Reset form
    setTitle("");
    setDescription("");
    setDomain("health");
    setXp(50);
    setDueDate("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Card className="card-glow transition-smooth hover:scale-102 cursor-pointer" onClick={() => setIsOpen(true)}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Plus className="h-12 w-12 text-primary mx-auto mb-2" />
            <p className="text-lg font-medium text-glow">Créer une nouvelle quête</p>
            <p className="text-sm text-muted-foreground">Transformez vos tâches en aventures épiques</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Nouvelle Quête
        </CardTitle>
        <CardDescription>
          Créez une nouvelle quête pour votre progression RPG
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Titre de la quête (ex: Faire 30 min de sport)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Textarea
              placeholder="Description optionnelle..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select value={domain} onValueChange={(value: Domain) => setDomain(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DOMAIN_NAMES).map(([key, name]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span>{DOMAIN_ICONS[key as Domain]}</span>
                        <span>{name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                type="number"
                placeholder="XP"
                value={xp}
                onChange={(e) => setXp(Number(e.target.value))}
                min={10}
                max={500}
                step={10}
              />
            </div>
          </div>

          <div>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="gradient-primary text-white border-0 hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-1" />
              Créer la quête
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}