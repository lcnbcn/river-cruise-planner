import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Anchor } from "lucide-react";
import cruiseHero from "@/assets/cruise-hero.jpg";

// Mock data - esto será reemplazado por datos de Supabase
const shipName = "MS Serenity River";
const schedule = [
  {
    time: "07:00",
    activity: "Desayuno buffet",
    location: "Restaurante principal",
    type: "meal"
  },
  {
    time: "09:00",
    activity: "Excursión a la ciudad histórica",
    location: "Puerto de Colonia",
    type: "excursion"
  },
  {
    time: "12:30",
    activity: "Almuerzo a bordo",
    location: "Restaurante principal",
    type: "meal"
  },
  {
    time: "15:00",
    activity: "Navegación panorámica",
    location: "Cubierta superior",
    type: "onboard"
  },
  {
    time: "17:30",
    activity: "Cóctel del capitán",
    location: "Salón principal",
    type: "entertainment"
  },
  {
    time: "19:30",
    activity: "Cena de gala",
    location: "Restaurante principal",
    type: "meal"
  },
  {
    time: "21:30",
    activity: "Espectáculo de tango",
    location: "Teatro",
    type: "entertainment"
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
    default:
      return <Anchor className="h-4 w-4" />;
  }
};

const getActivityBadge = (type: string) => {
  const badges = {
    meal: { variant: "secondary" as const, label: "Comida" },
    excursion: { variant: "default" as const, label: "Excursión" },
    entertainment: { variant: "outline" as const, label: "Entretenimiento" },
    onboard: { variant: "outline" as const, label: "A bordo" }
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
            <h1 className="text-5xl font-bold mb-4 tracking-wide">
              {shipName}
            </h1>
            <p className="text-xl opacity-90">
              Programa Diario de Actividades
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm opacity-80">
              <Anchor className="h-4 w-4" />
              <span>Crucero Fluvial de Lujo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Time Schedule Column */}
          <div className="lg:col-span-4">
            <Card className="sticky top-6">
              <CardHeader className="bg-gradient-wave text-primary-foreground">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horarios del Día
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {schedule.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-mono font-semibold text-primary">
                          {item.time}
                        </div>
                      </div>
                      <div className="text-2xl">
                        {typeof getActivityIcon(item.type) === 'string' ? 
                          getActivityIcon(item.type) : 
                          <div className="text-nautical-wave">{getActivityIcon(item.type)}</div>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activities Column */}
          <div className="lg:col-span-8">
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
                      {item.type === 'excursion' && "Descubre los encantos locales con nuestros guías expertos."}
                      {item.type === 'meal' && "Exquisita gastronomía preparada por nuestros chefs especializados."}
                      {item.type === 'entertainment' && "Disfruta de entretenimiento de primera clase a bordo."}
                      {item.type === 'onboard' && "Relájate y disfruta de las vistas panorámicas del río."}
                    </div>
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