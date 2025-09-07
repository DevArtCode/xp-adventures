import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlayerStats } from "@/types/game";
import { 
  BookOpen, 
  Swords, 
  Crown, 
  Palette,
  Quote,
  Scroll,
  Sword,
  Shield,
  Target,
  Trophy,
  Star,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ZoneContentProps {
  zoneId: string;
  stats: PlayerStats;
}

export function ZoneContent({ zoneId, stats }: ZoneContentProps) {
  if (zoneId === 'market') {
    return (
      <div className="space-y-6">
        <Card className="border-creativity/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-creativity">
              <Palette className="h-5 w-5" />
              Atelier de Personnalisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-dashed border-creativity/50">
                <CardContent className="p-4 text-center space-y-2">
                  <div className="w-12 h-12 mx-auto bg-creativity/20 rounded-full flex items-center justify-center">
                    <Palette className="h-6 w-6 text-creativity" />
                  </div>
                  <h4 className="font-medium">Thèmes Personnalisés</h4>
                  <p className="text-sm text-muted-foreground">
                    Changez les couleurs de l'interface
                  </p>
                  <Badge variant="outline">Bientôt disponible</Badge>
                </CardContent>
              </Card>
              
              <Card className="border-dashed border-creativity/50">
                <CardContent className="p-4 text-center space-y-2">
                  <div className="w-12 h-12 mx-auto bg-creativity/20 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-creativity" />
                  </div>
                  <h4 className="font-medium">Badges Personnalisés</h4>
                  <p className="text-sm text-muted-foreground">
                    Créez vos propres récompenses
                  </p>
                  <Badge variant="outline">En développement</Badge>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (zoneId === 'library') {
    const quotes = [
      {
        text: "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.",
        author: "Winston Churchill"
      },
      {
        text: "La seule façon d'accomplir un excellent travail est d'aimer ce que vous faites.",
        author: "Steve Jobs"
      },
      {
        text: "Votre limitation—c'est seulement votre imagination.",
        author: "Anonyme"
      },
      {
        text: "De grandes choses ne viennent jamais des zones de confort.",
        author: "Anonyme"
      }
    ];

    const tips = [
      {
        title: "Technique Pomodoro",
        description: "25 minutes de travail, 5 minutes de pause. Répétez 4 fois puis prenez une pause plus longue.",
        icon: <Target className="h-5 w-5" />
      },
      {
        title: "Règle des 2 minutes",
        description: "Si une tâche prend moins de 2 minutes, faites-la immédiatement.",
        icon: <Zap className="h-5 w-5" />
      },
      {
        title: "Batch Processing",
        description: "Groupez les tâches similaires et traitez-les en une seule session.",
        icon: <BookOpen className="h-5 w-5" />
      }
    ];

    return (
      <div className="space-y-6">
        {/* Citations */}
        <Card className="border-knowledge/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-knowledge">
              <Quote className="h-5 w-5" />
              Citations Inspirantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quotes.map((quote, index) => (
              <Card key={index} className="bg-muted/30">
                <CardContent className="p-4">
                  <blockquote className="italic text-center mb-2">
                    "{quote.text}"
                  </blockquote>
                  <div className="text-sm text-muted-foreground text-center">
                    — {quote.author}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Conseils Productivité */}
        <Card className="border-knowledge/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-knowledge">
              <Scroll className="h-5 w-5" />
              Techniques de Productivité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tips.map((tip, index) => (
              <Card key={index} className="border-knowledge/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-knowledge/20 rounded-lg text-knowledge">
                      {tip.icon}
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (zoneId === 'arena') {
    return (
      <div className="space-y-6">
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Swords className="h-5 w-5" />
              Mode Défi Hardcore
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-destructive" />
                <span className="font-medium text-destructive">Attention : Zone à Risque</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Dans l'arène, l'échec a des conséquences ! Perdez de l'XP si vous n'accomplissez pas vos défis.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-dashed border-destructive/50">
                <CardContent className="p-4 text-center space-y-2">
                  <div className="w-12 h-12 mx-auto bg-destructive/20 rounded-full flex items-center justify-center">
                    <Sword className="h-6 w-6 text-destructive" />
                  </div>
                  <h4 className="font-medium">Défis Quotidiens</h4>
                  <p className="text-sm text-muted-foreground">
                    Quêtes avec pénalités d'échec
                  </p>
                  <Badge variant="outline">Niveau 30 requis</Badge>
                </CardContent>
              </Card>
              
              <Card className="border-dashed border-destructive/50">
                <CardContent className="p-4 text-center space-y-2">
                  <div className="w-12 h-12 mx-auto bg-destructive/20 rounded-full flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-destructive" />
                  </div>
                  <h4 className="font-medium">Tournois</h4>
                  <p className="text-sm text-muted-foreground">
                    Compétitions hebdomadaires
                  </p>
                  <Badge variant="outline">Bientôt disponible</Badge>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (zoneId === 'sanctuary') {
    return (
      <div className="space-y-6">
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Crown className="h-5 w-5" />
              Sanctuaire Légendaire
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-accent" />
                <span className="font-medium text-accent">Royaume des Légendes</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Seuls les maîtres de niveau 50+ peuvent accéder aux quêtes légendaires et leurs récompenses extraordinaires.
              </p>
            </div>

            <div className="text-center py-8">
              <Crown className="h-16 w-16 mx-auto mb-4 text-accent animate-pulse-glow" />
              <h3 className="text-xl font-bold mb-2 gradient-text">
                Sanctuaire Mystique
              </h3>
              <p className="text-muted-foreground mb-4">
                Les plus grandes quêtes vous attendent...
              </p>
              
              {stats.level >= 50 ? (
                <Badge className="bg-accent text-accent-foreground">
                  Accès débloqué
                </Badge>
              ) : (
                <div className="space-y-2">
                  <Progress 
                    value={(stats.level / 50) * 100} 
                    className="w-64 mx-auto"
                  />
                  <p className="text-sm text-muted-foreground">
                    Niveau {stats.level}/50 - Il vous manque {50 - stats.level} niveaux
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}