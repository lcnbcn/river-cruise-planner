import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, MapPin, Anchor, ExternalLink } from "lucide-react";
import cruiseHero from "@/assets/charles-dickens-cruise.jpg";

// Datos reales basados en el formato de RiverOk
const shipName = "MS Charles Dickens";
const currentDestination = "Colonia del Sacramento";
const embarkationInfo = {
  location: "Puerto Fluvial - Rambla de las Américas, Colonia del Sacramento",
  allAboard: "20:15",
  departure: "20:30"
};

const schedule = [
  {
    time: "08:00",
    activity: "Llegada a Colonia del Sacramento",
    location: "Puerto histórico",
    type: "arrival",
    description: "Llegada al puerto de la ciudad histórica declarada Patrimonio de la Humanidad"
  },
  {
    time: "08:45",
    activity: "Charla: Historia Colonial del Río de la Plata",
    location: "Salón Panorámico",
    type: "onboard",
    description: "Introducción histórica de 30 minutos sobre la época colonial"
  },
  {
    time: "09:30",
    activity: "Visita guiada al Barrio Histórico",
    location: "Casco histórico",
    type: "excursion",
    description: "Recorrido por las calles empedradas y monumentos coloniales (llevar radioguías)"
  },
  {
    time: "12:30",
    activity: "Almuerzo típico uruguayo",
    location: "Restaurante principal",
    type: "meal",
    description: "Degustación de especialidades locales con vista al río"
  },
  {
    time: "16:00",
    activity: "Tour gastronómico y cata de vinos",
    location: "Bodegas locales",
    type: "excursion",
    description: "Opcional. Degustación de vinos uruguayos y productos artesanales"
  },
  {
    time: "18:30",
    activity: "Café & Té panorámico",
    location: "Salón Panorámico",
    type: "onboard",
    description: "Música en vivo con vista al atardecer sobre el río (30 min)"
  },
  {
    time: "20:15",
    activity: "TODOS A BORDO - Zarpe hacia Montevideo",
    location: "Puerto",
    type: "departure",
    description: "Último embarque antes de partir hacia el próximo destino"
  },
  {
    time: "22:00",
    activity: "Espectáculo: Noche de Tango Rioplatense",
    location: "Teatro del barco",
    type: "entertainment",
    description: "Show en vivo con bailarines profesionales de tango"
  }
];

const highlights = [
  {
    name: "Barrio Histórico",
    description: "Patrimonio de la Humanidad UNESCO. A 5 min a pie del puerto.",
    category: "historic"
  },
  {
    name: "Faro de Colonia",
    description: "Vista panorámica del Río de la Plata y Buenos Aires.",
    category: "landmark"
  },
  {
    name: "Museo Portugués",
    description: "Historia de la colonización portuguesa en la región.",
    category: "museum"
  },
  {
    name: "Rambla Costanera",
    description: "Paseo junto al río con vistas espectaculares.",
    category: "scenic"
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "excursion":
      return <MapPin className="h-4 w-4" />;
    case "entertainment":
      return "🎭";
    case "meal":
      return "🍽️";
    case "arrival":
      return "⚓";
    case "departure":
      return "🚢";
    default:
      return <Anchor className="h-4 w-4" />;
  }
};

const getActivityBadge = (type: string) => {
  const badges = {
    meal: { variant: "secondary" as const, label: "Comida" },
    excursion: { variant: "default" as const, label: "Excursión" },
    entertainment: { variant: "outline" as const, label: "Entretenimiento" },
    onboard: { variant: "outline" as const, label: "A bordo" },
    arrival: { variant: "default" as const, label: "Llegada" },
    departure: { variant: "destructive" as const, label: "Partida" }
  };
  return badges[type as keyof typeof badges] || badges.onboard;
};

export default function CruiseSchedule() {
  return (
    <div className="min-h-screen bg-gradient-horizon">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={cruiseHero} 
          alt="Crucero fluvial de lujo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-ocean opacity-75"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="text-primary-foreground">
            <h1 className="text-5xl font-bold mb-2 tracking-wide">
              {shipName}
            </h1>
            <div className="flex justify-center gap-4 mb-4">
              <Anchor className="h-8 w-8" />
              <Anchor className="h-8 w-8" />
              <Anchor className="h-8 w-8" />
              <Anchor className="h-8 w-8" />
            </div>
            <p className="text-3xl font-bold opacity-90">
              Programa diario
            </p>
          </div>
        </div>
      </div>

      {/* Información de embarque */}
      <div className="container mx-auto px-6 -mt-6 relative z-10">
        <div className="bg-card rounded-lg border shadow-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <Anchor className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">Información de embarque</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Konrad‑Adenauer‑Ufer 3, 50668 Köln</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Todos a bordo: <span className="font-bold text-foreground">20:15</span> | Salida: <span className="font-bold text-foreground">20:30</span></span>
            </div>
          </div>
          <div className="mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver ubicación en mapa
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Abrir ubicación en:</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-3 py-4">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://maps.apple.com/?q=Konrad‑Adenauer‑Ufer+3,+50668+Köln`, '_blank')}
                    className="justify-start"
                  >
                    🍎 Apple Maps
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=Konrad‑Adenauer‑Ufer+3,+50668+Köln`, '_blank')}
                    className="justify-start"
                  >
                    🗺️ Google Maps
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Actividades y Excursiones
              </h2>
              
              {schedule.map((item, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground rounded-lg p-2 text-lg font-mono font-bold">
                          {item.time}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.activity}
                          </h3>
                          <div className="flex items-center gap-1 text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{item.location}</span>
                          </div>
                        </div>
                      </div>
                      <Badge {...getActivityBadge(item.type)}>
                        {getActivityBadge(item.type).label}
                      </Badge>
                    </div>
                    
                    <div className="text-muted-foreground">
                      {item.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Highlights Section */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                🌟 Qué no perderse en {currentDestination}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {highlights.map((highlight, index) => (
                  <Card key={index} className="border-l-4 border-l-accent">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-2">{highlight.name}</h3>
                      <p className="text-sm text-muted-foreground">{highlight.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {highlight.category === 'historic' && '🏛️ Histórico'}
                        {highlight.category === 'landmark' && '🗼 Punto de interés'}
                        {highlight.category === 'museum' && '🏛️ Museo'}
                        {highlight.category === 'scenic' && '🌅 Paisajístico'}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}