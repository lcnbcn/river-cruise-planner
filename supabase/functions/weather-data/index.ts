import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache configuration: 30 minutes
const CACHE_DURATION_MS = 30 * 60 * 1000;

// Rate limiting: 100 requests per minute
const RATE_LIMIT_PER_MINUTE = 100;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface CachedWeatherData {
  data: any;
  timestamp: number;
}

const weatherCache = new Map<string, CachedWeatherData>();

// Clean expired cache entries
function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, value] of weatherCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION_MS) {
      weatherCache.delete(key);
    }
  }
}

// Rate limiting check
function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(clientId);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + 60000 });
    return true;
  }

  if (limit.count >= RATE_LIMIT_PER_MINUTE) {
    return false;
  }

  limit.count++;
  return true;
}

// Fetch weather with retry logic
async function fetchWeatherWithRetry(
  apiKey: string,
  location: string,
  date?: string,
  maxRetries = 3
): Promise<any> {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      let url: string;
      
      if (date) {
        // Historical or forecast data
        const targetDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (targetDate < today) {
          // Historical weather
          url = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${encodeURIComponent(location)}&dt=${date}`;
        } else {
          // Forecast weather
          url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&dt=${date}&days=1`;
        }
      } else {
        // Current weather
        url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}`;
      }

      console.log(`Fetching weather (attempt ${attempt + 1}/${maxRetries}):`, url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`WeatherAPI error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Weather data received successfully');
      return data;
      
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('WEATHER_API_KEY');
    if (!apiKey) {
      throw new Error('WEATHER_API_KEY not configured');
    }

    // Read parameters from request body
    const requestBody = await req.json();
    const location = requestBody.location;
    const date = requestBody.date;
    const clientId = req.headers.get('x-client-info') || 'default';

    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Location parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
    if (!checkRateLimit(clientId)) {
      console.warn(`Rate limit exceeded for client: ${clientId}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean expired cache periodically
    cleanExpiredCache();

    // Generate cache key
    const cacheKey = `${location}:${date || 'current'}`;
    
    // Check cache
    const cached = weatherCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION_MS)) {
      console.log('Returning cached weather data for:', cacheKey);
      return new Response(
        JSON.stringify({ ...cached.data, cached: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch fresh data
    console.log('Fetching fresh weather data for:', cacheKey);
    const weatherData = await fetchWeatherWithRetry(apiKey, location, date);

    // Cache the result
    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now()
    });

    return new Response(
      JSON.stringify({ ...weatherData, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Weather data error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch weather data',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
