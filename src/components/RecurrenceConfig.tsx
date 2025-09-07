import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type QuestRecurrence, type RecurrenceConfig } from "@/types/game";
import { Repeat, Calendar } from "lucide-react";

interface RecurrenceConfigProps {
  recurrence: QuestRecurrence;
  config?: RecurrenceConfig;
  onRecurrenceChange: (recurrence: QuestRecurrence) => void;
  onConfigChange: (config?: RecurrenceConfig) => void;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' }
];

export function RecurrenceConfig({ recurrence, config, onRecurrenceChange, onConfigChange }: RecurrenceConfigProps) {
  const [frequency, setFrequency] = useState(config?.frequency || 1);
  const [selectedDays, setSelectedDays] = useState<number[]>(config?.daysOfWeek || []);
  const [dayOfMonth, setDayOfMonth] = useState(config?.dayOfMonth || 1);

  const handleRecurrenceChange = (newRecurrence: QuestRecurrence) => {
    onRecurrenceChange(newRecurrence);
    
    if (newRecurrence === 'none') {
      onConfigChange(undefined);
    } else {
      const newConfig: RecurrenceConfig = {
        frequency,
        ...(newRecurrence === 'weekly' && { daysOfWeek: selectedDays.length > 0 ? selectedDays : [1] }),
        ...(newRecurrence === 'monthly' && { dayOfMonth }),
      };
      onConfigChange(newConfig);
    }
  };

  const handleDayToggle = (day: number, checked: boolean) => {
    const newDays = checked 
      ? [...selectedDays, day]
      : selectedDays.filter(d => d !== day);
    
    setSelectedDays(newDays);
    if (recurrence === 'weekly') {
      onConfigChange({
        frequency,
        daysOfWeek: newDays
      });
    }
  };

  const handleFrequencyChange = (newFrequency: number) => {
    setFrequency(newFrequency);
    if (recurrence !== 'none') {
      onConfigChange({
        frequency: newFrequency,
        ...(recurrence === 'weekly' && { daysOfWeek: selectedDays }),
        ...(recurrence === 'monthly' && { dayOfMonth }),
      });
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Repeat className="h-4 w-4" />
          Configuration de récurrence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Type de récurrence</Label>
          <Select value={recurrence} onValueChange={handleRecurrenceChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune</SelectItem>
              <SelectItem value="daily">Quotidienne</SelectItem>
              <SelectItem value="weekly">Hebdomadaire</SelectItem>
              <SelectItem value="monthly">Mensuelle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {recurrence !== 'none' && (
          <>
            <div>
              <Label>Fréquence</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm">Tous les</span>
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={frequency}
                  onChange={(e) => handleFrequencyChange(parseInt(e.target.value) || 1)}
                  className="w-20"
                />
                <span className="text-sm">
                  {recurrence === 'daily' && 'jours'}
                  {recurrence === 'weekly' && 'semaines'}
                  {recurrence === 'monthly' && 'mois'}
                </span>
              </div>
            </div>

            {recurrence === 'weekly' && (
              <div>
                <Label>Jours de la semaine</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day.value}`}
                        checked={selectedDays.includes(day.value)}
                        onCheckedChange={(checked) => handleDayToggle(day.value, checked as boolean)}
                      />
                      <Label htmlFor={`day-${day.value}`} className="text-sm">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recurrence === 'monthly' && (
              <div>
                <Label>Jour du mois</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={dayOfMonth}
                  onChange={(e) => {
                    const day = parseInt(e.target.value) || 1;
                    setDayOfMonth(day);
                    onConfigChange({
                      frequency,
                      dayOfMonth: day
                    });
                  }}
                  className="w-20"
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}