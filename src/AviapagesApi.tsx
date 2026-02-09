/**
 * AviaPages API Service (TypeScript)
 * 
 * IMPORTANT: AviaPages API uses "Token" authentication, NOT "Bearer"
 * Base URL: https://api.aviapages.com/v3
 * Documentation: https://api.aviapages.com/docs/
 */

import axios from 'axios';

const API_BASE_URL = 'https://api.aviapages.com/v3';
const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';

// Create axios instance with correct Token authentication
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'Authorization': `Token ${API_TOKEN}`, // IMPORTANT: Use "Token" not "Bearer"
    'Content-Type': 'application/json',
  },
});

// Types
type SearchParams = {
  origin: string;
  destination: string;
  departureDate: string;
  departureTime?: string;
  passengers?: number;
  tripType?: 'one_way' | 'round_trip';
  returnDate?: string;
  returnTime?: string;
};

type Airport = {
  id: number;
  name: string;
  icao: string;
  iata: string | null;
  city?: {
    id: number;
    name: string;
    country?: {
      id: number;
      name: string;
    };
  };
  country?: {
    id: number;
    name: string;
  };
  latitude: number;
  longitude: number;
};

type Aircraft = {
  id: number;
  registration_number: string;
  passengers_max: number;
  year_of_production: number;
  aircraft_type?: {
    id: number;
    name: string;
    icao: string;
    aircraft_class?: {
      id: number;
      name: string;
    };
  };
  company?: {
    id: number;
    name: string;
    phone: string | null;
    website: string | null;
  };
  images?: Array<{
    media: {
      id: number;
      path: string;
    };
    position: number;
  }>;
};

// Helper function to extract images from aircraft
const extractAircraftImages = (aircraft: Aircraft): string[] => {
  if (!aircraft?.images || !Array.isArray(aircraft.images)) return [];
  
  return aircraft.images
    .sort((a, b) => a.position - b.position)
    .map(img => img.media?.path)
    .filter(Boolean) as string[];
};

const AviapagesApi = {
  /**
   * Search for charter aircraft for a route
   */
  async searchFlights({
    origin,
    destination,
    departureDate,
    departureTime = '10:00',
    passengers = 1,
    tripType = 'one_way',
    returnDate,
    returnTime = '18:00',
  }: SearchParams) {
    if (!origin || !destination || !departureDate) {
      throw new Error('origin, destination and departureDate are required');
    }

    console.log('🟢 AviaPages Search Request:', {
      origin,
      destination,
      departureDate,
      passengers,
      tripType,
    });

    try {
      // Step 1: Search for charter aircraft for the route
      const legs = [{
        departure_airport: { icao: origin.toUpperCase() },
        arrival_airport: { icao: destination.toUpperCase() },
        pax: passengers,
      }];

      console.log('📍 Step 1: Searching charter aircraft...');
      const charterSearchRes = await api.post('/charter_search_aircraft/', { legs });
      
      console.log(`✅ Found ${charterSearchRes.data?.aircraft?.length || 0} aircraft`);

      const searchResults = charterSearchRes.data?.aircraft || [];

      // Step 2: Get detailed info for each aircraft
      console.log('📍 Step 2: Fetching aircraft details...');
      const detailedAircraft = [];
      
      for (const aircraft of searchResults.slice(0, 10)) {
        try {
          const detailRes = await api.get(`/charter_aircraft/${aircraft.id}/`);
          detailedAircraft.push(detailRes.data);
        } catch (err) {
          console.log(`Could not get details for aircraft ${aircraft.id}`);
          detailedAircraft.push(aircraft);
        }
      }

      // Step 3: Calculate flight time
      console.log('📍 Step 3: Calculating flight time...');
      let flightTime = null;
      try {
        const flightTimeRes = await api.post('/flight_calculator/', {
          departure_airport: { icao: origin.toUpperCase() },
          arrival_airport: { icao: destination.toUpperCase() },
        });
        flightTime = flightTimeRes.data;
        console.log('Flight time:', flightTime);
      } catch (err) {
        console.log('Flight time calculation failed, using estimate');
      }

      // Step 4: Get price estimate for each aircraft class
      console.log('📍 Step 4: Getting price estimates...');
      const priceEstimates: Record<string, number> = {};
      
      const aircraftClasses = ['Light', 'Midsize', 'Super midsize', 'Heavy'];
      for (const acClass of aircraftClasses) {
        try {
          const priceRes = await api.post('/charter_prices/', {
            legs: [{
              departure_airport: { icao: origin.toUpperCase() },
              arrival_airport: { icao: destination.toUpperCase() },
              pax: passengers,
              departure_datetime: `${departureDate}T${departureTime}`,
            }],
            aircraft: [{ ac_class: acClass }],
            currency_code: 'USD',
          });
          priceEstimates[acClass] = priceRes.data?.price || 0;
        } catch (err) {
          // Skip if price not available
        }
      }
      console.log('Price estimates:', priceEstimates);

      // Transform to app format
      const flights = detailedAircraft.map((aircraft: any, index: number) => {
        const images = extractAircraftImages(aircraft);
        const aircraftClass = aircraft.aircraft_type?.aircraft_class?.name || 'Midsize';
        const basePrice = priceEstimates[aircraftClass] || 15000;
        const serviceFee = Math.round(basePrice * 0.1);

        return {
          id: `avia-${aircraft.id}`,
          source: 'AVIAPAGES_REAL',
          
          aircraft: {
            id: aircraft.id,
            manufacturer: aircraft.aircraft_type?.aircraft_type_global_family?.name || 'Unknown',
            model: aircraft.aircraft_type?.name || 'Private Jet',
            seats: aircraft.passengers_max || 8,
            images: images,
            primaryImage: images[0] || null,
            year: aircraft.year_of_production,
            registrationNumber: aircraft.registration_number,
            class: aircraftClass,
          },

          pricing: {
            total: basePrice + serviceFee,
            base: basePrice,
            serviceFee: serviceFee,
            currency: 'USD',
          },

          itineraries: [{
            duration: flightTime?.flight_time || 'PT2H0M',
            segments: [{
              departure: {
                airport: origin.toUpperCase(),
                at: `${departureDate}T${departureTime}:00`,
              },
              arrival: {
                airport: destination.toUpperCase(),
                at: calculateArrivalTime(departureDate, departureTime, flightTime?.flight_time),
              },
              aircraft: aircraft.aircraft_type?.name || 'Private Jet',
              operator: aircraft.company?.name || 'Private Operator',
            }],
          }],

          meta: {
            emptyLeg: false,
            instantBooking: true,
            operator: aircraft.company?.name || 'Private Operator',
            companyId: aircraft.company?.id,
            companyPhone: aircraft.company?.phone,
            companyWebsite: aircraft.company?.website,
          },

          rawData: aircraft,
        };
      });

      return {
        success: true,
        data: flights,
        count: flights.length,
        searchParams: {
          origin,
          destination,
          departureDate,
          passengers,
          tripType,
        },
        metadata: {
          source: 'AVIAPAGES_REAL',
          apiVersion: 'v3',
          timestamp: new Date().toISOString(),
          flightTime: flightTime,
          priceEstimates: priceEstimates,
        },
      };

    } catch (err: any) {
      console.error('❌ AviaPages search error:', err.response?.data || err.message);
      
      // Return error response
      return {
        success: false,
        data: [],
        count: 0,
        error: err.response?.data?.detail || err.message || 'Search failed',
      };
    }
  },

  /**
   * Get aircraft details by ID
   */
  async getAircraftDetails(id: number | string) {
    try {
      const res = await api.get(`/charter_aircraft/${id}/`);
      return res.data;
    } catch (err: any) {
      console.error('Aircraft details error:', err.response?.data || err.message);
      throw err;
    }
  },

  /**
   * Search airports
   */
  async searchAirports(query: string): Promise<Airport[]> {
    try {
      const res = await api.get('/airports/', {
        params: { search: query }
      });
      return res.data?.results || [];
    } catch (err: any) {
      console.error('Airport search error:', err.response?.data || err.message);
      return [];
    }
  },

  /**
   * Calculate flight time between airports
   */
  async calculateFlightTime(departureIcao: string, arrivalIcao: string) {
    try {
      const res = await api.post('/flight_calculator/', {
        departure_airport: { icao: departureIcao },
        arrival_airport: { icao: arrivalIcao },
      });
      return res.data;
    } catch (err: any) {
      console.error('Flight time calculation error:', err.response?.data || err.message);
      return null;
    }
  },

  /**
   * Calculate charter price
   */
  async calculatePrice(
    departureIcao: string,
    arrivalIcao: string,
    passengers: number,
    departureDateTime: string,
    aircraftClass: string = 'Midsize'
  ) {
    try {
      const res = await api.post('/charter_prices/', {
        legs: [{
          departure_airport: { icao: departureIcao },
          arrival_airport: { icao: arrivalIcao },
          pax: passengers,
          departure_datetime: departureDateTime,
        }],
        aircraft: [{ ac_class: aircraftClass }],
        currency_code: 'USD',
      });
      return res.data;
    } catch (err: any) {
      console.error('Price calculation error:', err.response?.data || err.message);
      return null;
    }
  },

  /**
   * Get empty legs / availabilities
   */
  async getEmptyLegs(params: Record<string, any> = {}) {
    try {
      const res = await api.get('/availabilities/', { params });
      return res.data?.results || [];
    } catch (err: any) {
      console.error('Empty legs error:', err.response?.data || err.message);
      return [];
    }
  },

  /**
   * Create a charter quote request
   */
  async createQuoteRequest(
    legs: Array<{
      departure_airport: { icao: string };
      arrival_airport: { icao: string };
      pax: number;
      departure_datetime: string;
    }>,
    aircraft: Array<{ id?: number; ac_class?: string }>,
    comment: string = ''
  ) {
    try {
      const res = await api.post('/charter_quote_requests/', {
        legs,
        aircraft,
        comment,
        post_to_trip_board: true,
        channels: ['Email'],
      });
      return res.data;
    } catch (err: any) {
      console.error('Quote request error:', err.response?.data || err.message);
      throw err;
    }
  },

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const res = await api.get('/airports/', {
        params: { search: 'DXB' }
      });
      console.log('✅ API connection successful');
      return res.status === 200;
    } catch (err) {
      console.error('❌ API connection failed');
      return false;
    }
  },
};

// Helper function to calculate arrival time
function calculateArrivalTime(
  departureDate: string,
  departureTime: string,
  duration: string | null
): string {
  try {
    const departure = new Date(`${departureDate}T${departureTime}:00`);
    
    // Parse duration like "PT2H30M" or use default
    let hours = 2;
    let minutes = 0;
    
    if (duration) {
      const hoursMatch = duration.match(/(\d+)H/);
      const minutesMatch = duration.match(/(\d+)M/);
      if (hoursMatch) hours = parseInt(hoursMatch[1]);
      if (minutesMatch) minutes = parseInt(minutesMatch[1]);
    }
    
    const arrival = new Date(departure.getTime() + (hours * 60 + minutes) * 60 * 1000);
    return arrival.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export default AviapagesApi;
