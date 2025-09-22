import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, MapPin, Anchor, ExternalLink, Calendar } from "lucide-react";
import cruiseHero from "@/assets/charles-dickens-cruise.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

// Datos reales basados en el formato de RiverOk
const shipName = "MS Charles Dickens";
const currentDestination = "Colonia";
const embarkationInfo = {
  location: "Puerto Fluvial - Rambla de las Américas, Colonia del Sacramento",
  allAboard: "20:15",
  departure: "20:30"
};

type ProgramaItem = {
  id: number;
  hora: string;
  actividad: string;
  tipo_actividad: string;
  obs: string;
};

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
  // Normalizar el tipo para el mapeo
  const normalizedType = type?.toLowerCase().trim();
  
  // Mapeo dinámico basado en los tipos reales de la base de datos
  const badges = {
    'excursión': { variant: "default" as const, label: "Excursión" },
    'entretenimiento': { variant: "outline" as const, label: "Entretenimiento" },
    'llegada': { variant: "default" as const, label: "Llegada" },
    'salida': { variant: "destructive" as const, label: "Salida" },
    'charla': { variant: "secondary" as const, label: "Charla" },
    'importante': { variant: "destructive" as const, label: "Importante" }
  };
  
  // Si no encuentra el tipo exacto, usar el tipo original como label
  return badges[normalizedType as keyof typeof badges] || { 
    variant: "outline" as const, 
    label: type || "A bordo" 
  };
};

const addToCalendar = (activity: ProgramaItem) => {
  const today = new Date();
  const [hours, minutes] = activity.hora.split(':').map(Number);
  
  // Crear fecha de inicio
  const startDate = new Date(today);
  startDate.setHours(hours, minutes, 0, 0);
  
  // Crear fecha de fin (1 hora después)
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 1);
  
  // Formatear fechas para el formato ICS
  const formatDateICS = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const startFormatted = formatDateICS(startDate);
  const endFormatted = formatDateICS(endDate);
  
  // Crear archivo ICS
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MS Charles Dickens//Cruise Schedule//ES',
    'BEGIN:VEVENT',
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:${activity.actividad}`,
    `DESCRIPTION:${activity.obs || ''}`,
    'LOCATION:MS Charles Dickens - Köln\\, Alemania',
    `UID:${Date.now()}@cruise-schedule.com`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  // Crear blob y URL para descargar
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  // Crear enlace de descarga temporal
  const link = document.createElement('a');
  link.href = url;
  link.download = `${activity.actividad.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Limpiar URL
  URL.revokeObjectURL(url);
};

export default function CruiseSchedule() {
  const [schedule, setSchedule] = useState<ProgramaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data, error } = await supabase
          .from('programa_diario')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error('Error fetching schedule:', error);
        } else {
          setSchedule(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

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
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 text-lg opacity-90">
              <span>{new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-2">
                🌤️ 18°C - Köln, Alemania
              </span>
            </div>
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
              <DialogContent className="sm:max-w-md px-3">
                <DialogHeader>
                  <DialogTitle>Abrir ubicación en:</DialogTitle>
                </DialogHeader>
                 <div className="grid grid-cols-1 gap-3 py-4">
                   <Button
                     variant="outline"
                     onClick={() => window.open(`https://maps.apple.com/?q=Konrad‑Adenauer‑Ufer+3,+50668+Köln`, '_blank')}
                     className="justify-start gap-3"
                   >
                     <img src="https://developer.apple.com/assets/elements/icons/maps/maps-96x96_2x.png" alt="Apple Maps" className="w-6 h-6" />
                     Mapas
                   </Button>
                   <Button
                     variant="outline"
                     onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=Konrad‑Adenauer‑Ufer+3,+50668+Köln`, '_blank')}
                     className="justify-start gap-3"
                   >
                     <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/512px-Google_Maps_Logo_2020.svg.png" alt="Google Maps" className="w-6 h-6" />
                     Google Maps
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
              
              {loading ? (
                <div className="text-center py-8">Cargando programa...</div>
              ) : schedule.map((item, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                  <CardContent className="p-4 sm:p-6">
                     <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="bg-primary text-primary-foreground rounded-lg p-2 text-lg font-mono font-bold min-w-[60px] text-center">
                            {item.hora}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                              {item.actividad}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 justify-center p-3 bg-muted/30 rounded-lg">
                          <Badge {...getActivityBadge(item.tipo_actividad)} className="flex-shrink-0">
                            {getActivityBadge(item.tipo_actividad).label}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToCalendar(item)}
                            className="gap-2 whitespace-nowrap text-xs"
                          >
                            <Calendar className="h-4 w-4" />
                            Añadir al calendario
                          </Button>
                        </div>
                      </div>
                     
                     <div className="text-muted-foreground text-sm sm:text-base">
                       {item.obs}
                     </div>
                   </CardContent>
                </Card>
              ))}
            </div>

            {/* Restaurant Schedule Section */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                🍽️ Horario restaurante
              </h2>
              
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-3 gap-6 text-center">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Desayuno</h3>
                      <p className="text-xl font-bold text-primary">7:00 a 9:30</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Almuerzo</h3>
                      <p className="text-xl font-bold text-secondary">13:00 a 15:00</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Cena</h3>
                      <p className="text-xl font-bold text-accent">20:00 a 22:30</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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