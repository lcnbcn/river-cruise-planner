import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Clock, MapPin, Anchor, ExternalLink, Calendar, Phone, MessageCircle, Cloud } from "lucide-react";
import cruiseHero from "@/assets/charles-dickens-cruise.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ProgramaItem = {
  id: number;
  hora: string;
  actividad: string;
  tipo_actividad: string;
  obs: string;
};

type DestacadoItem = {
  id: number;
  lugar: string;
  descripcion: string;
  direccion: string;
  img: string;
};

type BarcoInfo = {
  id: number;
  barco: string;
  dia: string;
  temperatura1: number;
  ciudad1: string;
  temperatura2: number | null;
  ciudad2: string | null;
  atraque: string;
  todos_abordos: string;
  salida: string;
};

// Convierte enlaces de Google Maps (q, query, place, dir, @coords) a una consulta válida para Apple Maps
const googleToAppleQuery = (input: string, fallback: string) => {
  if (!input) return fallback;
  try {
    // Si es texto plano, úsalo tal cual
    if (!/^https?:\/\//i.test(input)) return input;

    const url = new URL(input);
    const params = url.searchParams;

    // 1) Parámetros comunes
    const byParam = params.get('q') || params.get('query') || params.get('destination');
    if (byParam) return decodeURIComponent(byParam);

    // 2) Ruta /place/<nombre>
    const placeMatch = url.pathname.match(/\/place\/([^/]+)/);
    if (placeMatch?.[1]) {
      return decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    }

    // 3) Coordenadas en el patrón @lat,lon,zoom
    const coordsMatch = input.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordsMatch) return `${coordsMatch[1]},${coordsMatch[2]}`;

    // 4) Último recurso: todo el texto sin la URL
    return fallback;
  } catch {
    return fallback;
  }
};

// Traducir condiciones del clima al español
const translateWeatherCondition = (condition: string): string => {
  const translations: { [key: string]: string } = {
    'sunny': 'Soleado',
    'clear': 'Despejado',
    'partly cloudy': 'Parcialmente nublado',
    'cloudy': 'Nublado',
    'overcast': 'Cubierto',
    'mist': 'Niebla',
    'patchy rain possible': 'Posible lluvia dispersa',
    'patchy rain nearby': 'Lluvia dispersa cercana',
    'patchy snow possible': 'Posible nieve dispersa',
    'patchy sleet possible': 'Posible aguanieve dispersa',
    'patchy freezing drizzle possible': 'Posible llovizna helada',
    'thundery outbreaks possible': 'Posibles tormentas',
    'blowing snow': 'Nieve con viento',
    'blizzard': 'Ventisca',
    'fog': 'Niebla',
    'freezing fog': 'Niebla helada',
    'patchy light drizzle': 'Llovizna ligera dispersa',
    'light drizzle': 'Llovizna ligera',
    'freezing drizzle': 'Llovizna helada',
    'heavy freezing drizzle': 'Llovizna helada intensa',
    'patchy light rain': 'Lluvia ligera dispersa',
    'light rain': 'Lluvia ligera',
    'moderate rain at times': 'Lluvia moderada a intervalos',
    'moderate rain': 'Lluvia moderada',
    'heavy rain at times': 'Lluvia intensa a intervalos',
    'heavy rain': 'Lluvia intensa',
    'light freezing rain': 'Lluvia helada ligera',
    'moderate or heavy freezing rain': 'Lluvia helada moderada o intensa',
    'light sleet': 'Aguanieve ligera',
    'moderate or heavy sleet': 'Aguanieve moderada o intensa',
    'patchy light snow': 'Nieve ligera dispersa',
    'light snow': 'Nieve ligera',
    'patchy moderate snow': 'Nieve moderada dispersa',
    'moderate snow': 'Nieve moderada',
    'patchy heavy snow': 'Nieve intensa dispersa',
    'heavy snow': 'Nieve intensa',
    'ice pellets': 'Granizo',
    'light rain shower': 'Chubascos ligeros',
    'moderate or heavy rain shower': 'Chubascos moderados o intensos',
    'torrential rain shower': 'Chubascos torrenciales',
    'light sleet showers': 'Chubascos ligeros de aguanieve',
    'moderate or heavy sleet showers': 'Chubascos de aguanieve moderados o intensos',
    'light snow showers': 'Chubascos ligeros de nieve',
    'moderate or heavy snow showers': 'Chubascos de nieve moderados o intensos',
    'light showers of ice pellets': 'Chubascos ligeros de granizo',
    'moderate or heavy showers of ice pellets': 'Chubascos de granizo moderados o intensos',
    'patchy light rain with thunder': 'Lluvia ligera dispersa con truenos',
    'moderate or heavy rain with thunder': 'Lluvia moderada o intensa con truenos',
    'patchy light snow with thunder': 'Nieve ligera dispersa con truenos',
    'moderate or heavy snow with thunder': 'Nieve moderada o intensa con truenos'
  };
  
  // Convertir a minúsculas para hacer la búsqueda case-insensitive
  const conditionLower = condition.toLowerCase();
  return translations[conditionLower] || condition;
};

// Normaliza nombres de ciudades al formato esperado por WeatherAPI
const normalizeLocation = (input?: string | null): string => {
  const raw = (input ?? '').trim();
  if (!raw) return '';
  const noAccents = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const key = noAccents.toLowerCase();
  const map: Record<string, string> = {
    'colonia': 'Cologne, Germany',
    'köln': 'Cologne, Germany',
    'koln': 'Cologne, Germany',
    'koln, alemania': 'Cologne, Germany',
    'maguncia': 'Mainz, Germany',
    'mainz': 'Mainz, Germany',
    'bonn': 'Bonn, Germany',
    'barcelona': 'Barcelona, Spain',
    'madrid': 'Madrid, Spain',
    'passau': 'Passau, Germany',
  };
  return map[key] || raw;
};

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

// Universal function to add activity to calendar - works on all browsers
const addToCalendar = (activity: ProgramaItem) => {
  const today = new Date();
  const [hours, minutes] = activity.hora.split(':').map(Number);
  
  // Crear fecha de inicio
  const startDate = new Date(today);
  startDate.setHours(hours, minutes, 0, 0);
  
  // Crear fecha de fin (1 hora después)
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 1);
  
  // Formatear fechas para ICS (formato correcto: YYYYMMDDTHHMMSSZ)
  const formatDateICS = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const startFormatted = formatDateICS(startDate);
  const endFormatted = formatDateICS(endDate);
  
  // Crear contenido ICS universal compatible con todos los calendarios
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MS Charles Dickens//Cruise Schedule//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `DTSTAMP:${formatDateICS(new Date())}`,
    `UID:${Date.now()}-${Math.random().toString(36).substr(2, 9)}@cruise-schedule.com`,
    `SUMMARY:${activity.actividad}`,
    `DESCRIPTION:${activity.obs || 'Actividad del crucero'}`,
    'LOCATION:MS Charles Dickens - Köln\\, Alemania',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  const fileName = `${activity.actividad.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  
  // Detección específica de navegador
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua) && !/CriOS/i.test(ua); // Solo Safari real, no Chrome
  
  console.log('🔍 Debug - Navegador:', ua);
  console.log('🔍 Debug - Es iOS:', isIOS);
  console.log('🔍 Debug - Es Safari:', isSafari);
  
  // Para iOS: usar data URL con ICS para calendario nativo
  if (isIOS) {
    const dataUrl = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent);
    toast.success('Abriendo Calendario...');
    window.location.href = dataUrl;
    return;
  }

  // Solo Safari desktop: descargar ICS para calendario nativo
  if (isSafari) {
    console.log('🔍 Debug - Descargando ICS para Safari');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    toast.success('Archivo descargado. Se abrirá en tu calendario nativo.');
    return;
  }

  // Todos los demás navegadores (Chrome, Firefox, Edge): usar Google Calendar
  const title = encodeURIComponent(activity.actividad);
  const details = encodeURIComponent(activity.obs || '');
  const location = encodeURIComponent('MS Charles Dickens - Köln, Alemania');
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${details}&location=${location}`;
  
  console.log('🔍 Debug - Usando Google Calendar para:', ua);
  console.log('🔍 Debug - URL:', googleCalendarUrl);
  
  try {
    const newWindow = window.open(googleCalendarUrl, '_blank');
    if (newWindow === null || typeof newWindow === 'undefined') {
      toast.error('Las ventanas emergentes están bloqueadas. Redirigiendo...');
      window.location.href = googleCalendarUrl;
    } else {
      toast.success('Abriendo Google Calendar...');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    window.location.href = googleCalendarUrl;
  }


};

export default function CruiseSchedule() {
  const [schedule, setSchedule] = useState<ProgramaItem[]>([]);
  const [destacados, setDestacados] = useState<DestacadoItem[]>([]);
  const [barcoInfo, setBarcoInfo] = useState<BarcoInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDestacados, setLoadingDestacados] = useState(true);
  const [loadingBarco, setLoadingBarco] = useState(true);
  const [weatherData1, setWeatherData1] = useState<any>(null);
  const [weatherData2, setWeatherData2] = useState<any>(null);

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

    const fetchDestacados = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('destacado')
          .select('id, lugar, descripcion, direccion, img')
          .order('id', { ascending: true });

        if (error) {
          console.error('Error fetching destacados:', error);
        } else {
          setDestacados(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingDestacados(false);
      }
    };

    const fetchBarcoInfo = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('barco')
          .select('id, barco, dia, temperatura1, ciudad1, temperatura2, ciudad2, atraque, todos_abordos, salida')
          .eq('id', 1)
          .single();

        if (error) {
          console.error('Error fetching barco info:', error);
        } else {
          setBarcoInfo(data);
          
          // Fetch weather data for ciudad1 con retardo aleatorio (0-5s) para distribuir carga; en móvil = 0ms
          const isMobile = /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent);
          const delay1 = isMobile ? 0 : Math.random() * 5000;
          setTimeout(async () => {
            try {
              const location = normalizeLocation(data.ciudad1);
              const date = data.dia;
              
              if (location && date) {
                const { data: weatherResult, error: weatherError } = await supabase.functions.invoke('weather-data', {
                  body: { location, date }
                });

                if (weatherError) {
                  console.warn('Weather data fetch failed for ciudad1 (silent):', weatherError);
                } else if (weatherResult) {
                  setWeatherData1(weatherResult);
                }
              }
            } catch (err) {
              console.warn('Weather request error for ciudad1 (silent):', err);
            }
          }, delay1);

          // Fetch weather data for ciudad2 if it exists
          if (data.ciudad2) {
            const delay2 = isMobile ? 0 : Math.random() * 5000;
            setTimeout(async () => {
              try {
                const location = normalizeLocation(data.ciudad2);
                const date = data.dia;
                
                if (location && date) {
                  const { data: weatherResult, error: weatherError } = await supabase.functions.invoke('weather-data', {
                    body: { location, date }
                  });

                  if (weatherError) {
                    console.warn('Weather data fetch failed for ciudad2 (silent):', weatherError);
                  } else if (weatherResult) {
                    setWeatherData2(weatherResult);
                  }
                }
              } catch (err) {
                console.warn('Weather request error for ciudad2 (silent):', err);
              }
            }, delay2);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingBarco(false);
      }
    };

    fetchSchedule();
    fetchDestacados();
    fetchBarcoInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-horizon">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img 
          src={cruiseHero} 
          alt="Crucero fluvial de lujo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-ocean opacity-75"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="text-primary-foreground max-w-4xl w-full">
            <h1 className="text-3xl sm:text-5xl font-bold mb-2 tracking-wide">
              {loadingBarco ? "Cargando..." : barcoInfo?.barco || "MS Charles Dickens"}
            </h1>
            <div className="flex justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <Anchor className="h-6 w-6 sm:h-8 sm:w-8" />
              <Anchor className="h-6 w-6 sm:h-8 sm:w-8" />
              <Anchor className="h-6 w-6 sm:h-8 sm:w-8" />
              <Anchor className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <p className="text-xl sm:text-3xl font-bold opacity-90">
              Programa diario
            </p>
            <div className="flex flex-col items-center gap-1 sm:gap-2 mt-3 sm:mt-4 text-sm sm:text-lg opacity-90">
              <span className="text-center">
                {loadingBarco ? "Cargando fecha..." : barcoInfo?.dia ? 
                  new Date(barcoInfo.dia).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 
                  new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                }
              </span>
              
              {/* Weather info - stacked on mobile */}
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 flex-wrap justify-center">
                {loadingBarco ? "Cargando..." : (
                  <>
                    {/* Ciudad 1 */}
                    <span className="flex items-center gap-1 sm:gap-2">
                      {weatherData1?.current ? (
                        <>
                          <img 
                            src={weatherData1.current.condition.icon} 
                            alt={weatherData1.current.condition.text}
                            className="h-4 w-4 sm:h-5 sm:w-5 inline-block"
                          />
                          <span className="text-xs sm:text-sm">
                            {Math.round(weatherData1.current.temp_c)}°C - {barcoInfo?.ciudad1 || "Köln, Alemania"}
                            {weatherData1.current.condition.text && ` (${translateWeatherCondition(weatherData1.current.condition.text.toLowerCase())})`}
                          </span>
                        </>
                      ) : (
                        <>
                          🌤️ {barcoInfo?.temperatura1 || 18}°C - {barcoInfo?.ciudad1 || "Köln, Alemania"}
                        </>
                      )}
                    </span>
                    
                    {/* Ciudad 2 */}
                    {barcoInfo?.temperatura2 && barcoInfo?.ciudad2 && (
                      <>
                        <span className="hidden sm:inline opacity-50">•</span>
                        <span className="flex items-center gap-1 sm:gap-2">
                          {weatherData2?.current ? (
                            <>
                              <img 
                                src={weatherData2.current.condition.icon} 
                                alt={weatherData2.current.condition.text}
                                className="h-4 w-4 sm:h-5 sm:w-5 inline-block"
                              />
                              <span className="text-xs sm:text-sm">
                                {Math.round(weatherData2.current.temp_c)}°C - {barcoInfo.ciudad2}
                                {weatherData2.current.condition.text && ` (${translateWeatherCondition(weatherData2.current.condition.text.toLowerCase())})`}
                              </span>
                            </>
                          ) : (
                            <>
                              🌤️ {barcoInfo.temperatura2}°C - {barcoInfo.ciudad2}
                            </>
                          )}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información de embarque */}
      <div className="container mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="bg-card rounded-lg border shadow-lg p-4 sm:p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <Anchor className="h-5 w-5" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold">Información de embarque</h3>
          </div>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="break-words">{loadingBarco ? "Cargando ubicación..." : googleToAppleQuery(barcoInfo?.atraque || "", "Konrad‑Adenauer‑Ufer 3, 50668 Köln")}</span>
            </div>
            <div className="flex items-start gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="break-words">Todos a bordo: <span className="font-bold text-foreground">{loadingBarco ? "..." : barcoInfo?.todos_abordos || "20:15"}</span> | Salida: <span className="font-bold text-foreground">{loadingBarco ? "..." : barcoInfo?.salida || "20:30"}</span></span>
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
                  <DialogDescription className="sr-only">Seleccioná la app de mapas para abrir la ubicación</DialogDescription>
                </DialogHeader>
                 <div className="grid grid-cols-1 gap-3 py-4">
                   <Button
                     variant="outline"
                     onClick={() => {
                       const location = barcoInfo?.atraque || "Konrad‑Adenauer‑Ufer 3, 50668 Köln";
                       const query = googleToAppleQuery(location, location);
                       window.open(`https://maps.apple.com/?q=${encodeURIComponent(query)}`, '_blank');
                     }}
                     className="justify-start gap-3"
                   >
                     <img src="https://developer.apple.com/assets/elements/icons/maps/maps-96x96_2x.png" alt="Apple Maps" className="w-6 h-6" />
                     Mapas
                   </Button>
                   <Button
                     variant="outline"
                     onClick={() => {
                       const location = barcoInfo?.atraque || "Konrad‑Adenauer‑Ufer 3, 50668 Köln";
                       const url = location && /^https?:\/\//i.test(location) ? location : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
                       window.open(url, '_blank');
                     }}
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
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">
                Actividades y Excursiones
              </h2>
              
              {loading ? (
                <div className="text-center py-8">Cargando programa...</div>
              ) : schedule.map((item, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                  <CardContent className="p-3 sm:p-6">
                     <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="flex items-start sm:items-center gap-3 flex-1">
                          <div className="bg-primary text-primary-foreground rounded-lg p-2 text-base sm:text-lg font-mono font-bold min-w-[55px] sm:min-w-[60px] text-center flex-shrink-0">
                            {item.hora}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors break-words">
                              {item.actividad}
                            </h3>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:justify-center sm:p-3 sm:bg-muted/30 sm:rounded-lg">
                          <Badge {...getActivityBadge(item.tipo_actividad)} className="flex-shrink-0 w-fit">
                            {getActivityBadge(item.tipo_actividad).label}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToCalendar(item)}
                            className="gap-2 whitespace-nowrap text-xs w-full sm:w-auto"
                          >
                            <Calendar className="h-4 w-4" />
                            Añadir al calendario
                          </Button>
                        </div>
                      </div>
                     
                     {item.obs && (
                       <div className="text-muted-foreground text-xs sm:text-base break-words">
                         {item.obs}
                       </div>
                     )}
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
                      <p className="text-xl font-bold text-primary">13:00 a 15:00</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Cena</h3>
                      <p className="text-xl font-bold text-primary">20:00 a 22:30</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Highlights Section */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                🌟 Qué no perderse en {loadingBarco ? "..." : barcoInfo?.ciudad1 || "Colonia"}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {loadingDestacados ? (
                  <div className="text-center py-8 col-span-2">Cargando destacados...</div>
                ) : destacados.map((destacado, index) => (
                   <Card key={index} className="border-l-4 border-l-accent">
                     <CardContent className="p-4">
                       {destacado.img && (
                         <div className="w-full mb-3">
                           <img 
                             src={destacado.img} 
                             alt={destacado.lugar}
                             className="w-full h-32 object-cover rounded-lg"
                           />
                         </div>
                       )}
                       <h3 className="font-semibold text-foreground mb-2">{destacado.lugar}</h3>
                       <p className="text-sm text-muted-foreground mb-3">{destacado.descripcion}</p>
                      {destacado.direccion && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full">
                              <MapPin className="h-4 w-4 mr-2" />
                              Ver ubicación en mapa
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md px-3">
                            <DialogHeader>
                              <DialogTitle>Abrir ubicación en:</DialogTitle>
                              <DialogDescription className="sr-only">Seleccioná la app de mapas para abrir la ubicación</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 gap-3 py-4">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  const input = destacado.direccion || destacado.lugar;
                                  const query = googleToAppleQuery(input, destacado.lugar);
                                  window.open(`https://maps.apple.com/?q=${encodeURIComponent(query)}`, '_blank');
                                }}
                                className="justify-start gap-3"
                              >
                                <img src="https://developer.apple.com/assets/elements/icons/maps/maps-96x96_2x.png" alt="Apple Maps" className="w-6 h-6" />
                                Mapas
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  const url = destacado.direccion;
                                  if (url && /^https?:\/\//i.test(url)) {
                                    window.open(url, '_blank');
                                  } else {
                                    const search = url || destacado.lugar;
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(search)}`, '_blank');
                                  }
                                }}
                                className="justify-start gap-3"
                              >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/512px-Google_Maps_Logo_2020.svg.png" alt="Google Maps" className="w-6 h-6" />
                                Google Maps
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
          </div>
        </div>

      </div>

      {/* Sección Contactos - Fuera del container */}
      <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm border mx-4 sm:mx-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Contactos</h2>
        
        {/* Contacto del Barco */}
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-2">Barco – MS Charles Dickens</h3>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-muted-foreground">+49 152 09349674</span>
          </div>
          <div className="flex gap-2">
            <a
              href="tel:+4915209349674"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              Llamar
            </a>
          
          </div>
        </div>

        {/* Contacto de Emergencias */}
        <div>
          <h3 className="font-semibold text-foreground mb-2">Emergencias CATAI</h3>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-muted-foreground">+34 644 02 67 81</span>
          </div>
          <div className="flex gap-2">
            <a
              href="tel:+34644026781"
              className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              Llamar
            </a>
            <a
              href="https://wa.me/34644026781"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}