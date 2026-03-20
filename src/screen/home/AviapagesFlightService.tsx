import { getCharterAircraft, calculateFlightTime } from '../../Aviapages/api';
import { base_url, constant } from '../../config/constant';

const AVIA_PAGE_BASE_URL = 'https://api.aviapages.com';
const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';
const SERVICE_FEE_PERCENTAGE = 10;

 
const AIRPORT_DATABASE = [
  { id: 'DXB', iataCode: 'DXB', city: 'Dubai', country: 'United Arab Emirates', displayName: 'Dubai International Airport (DXB)', timezone: 'Asia/Dubai', hasPrivateTerminal: true, lat: 25.2532, lng: 55.3657 },
  { id: 'AUH', iataCode: 'AUH', city: 'Abu Dhabi', country: 'United Arab Emirates', displayName: 'Abu Dhabi International Airport (AUH)', timezone: 'Asia/Dubai', hasPrivateTerminal: true, lat: 24.4330, lng: 54.6511 },
  { id: 'DOH', iataCode: 'DOH', city: 'Doha', country: 'Qatar', displayName: 'Hamad International Airport (DOH)', timezone: 'Asia/Qatar', hasPrivateTerminal: true, lat: 25.2731, lng: 51.6080 },
  { id: 'RUH', iataCode: 'RUH', city: 'Riyadh', country: 'Saudi Arabia', displayName: 'King Khalid International Airport (RUH)', timezone: 'Asia/Riyadh', hasPrivateTerminal: true, lat: 24.9576, lng: 46.6988 },
  { id: 'JED', iataCode: 'JED', city: 'Jeddah', country: 'Saudi Arabia', displayName: 'King Abdulaziz International Airport (JED)', timezone: 'Asia/Riyadh', hasPrivateTerminal: true, lat: 21.6702, lng: 39.1525 },

  { id: 'LHR', iataCode: 'LHR', city: 'London', country: 'United Kingdom', displayName: 'Heathrow Airport (LHR)', timezone: 'Europe/London', hasPrivateTerminal: true, lat: 51.4700, lng: -0.4543 },
  { id: 'CDG', iataCode: 'CDG', city: 'Paris', country: 'France', displayName: 'Charles de Gaulle Airport (CDG)', timezone: 'Europe/Paris', hasPrivateTerminal: true, lat: 49.0097, lng: 2.5479 },
  { id: 'LBG', iataCode: 'LBG', city: 'Paris', country: 'France', displayName: 'Le Bourget Airport (LBG)', timezone: 'Europe/Paris', hasPrivateTerminal: true, lat: 48.9694, lng: 2.4414 },
  { id: 'NCE', iataCode: 'NCE', city: 'Nice', country: 'France', displayName: 'Nice Côte d’Azur Airport (NCE)', timezone: 'Europe/Paris', hasPrivateTerminal: true, lat: 43.6653, lng: 7.2150 },

  { id: 'JFK', iataCode: 'JFK', city: 'New York', country: 'United States', displayName: 'John F Kennedy International Airport (JFK)', timezone: 'America/New_York', hasPrivateTerminal: true, lat: 40.6413, lng: -73.7781 },
  { id: 'LAX', iataCode: 'LAX', city: 'Los Angeles', country: 'United States', displayName: 'Los Angeles International Airport (LAX)', timezone: 'America/Los_Angeles', hasPrivateTerminal: true, lat: 33.9416, lng: -118.4085 },
  { id: 'TEB', iataCode: 'TEB', city: 'Teterboro', country: 'United States', displayName: 'Teterboro Airport (TEB)', timezone: 'America/New_York', hasPrivateTerminal: true, lat: 40.8501, lng: -74.0608 },
  { id: 'MIA', iataCode: 'MIA', city: 'Miami', country: 'United States', displayName: 'Miami International Airport (MIA)', timezone: 'America/New_York', hasPrivateTerminal: true, lat: 25.7959, lng: -80.2870 },
  { id: 'OPF', iataCode: 'OPF', city: 'Miami', country: 'United States', displayName: 'Miami-Opa Locka Executive Airport (OPF)', timezone: 'America/New_York', hasPrivateTerminal: true, lat: 25.9070, lng: -80.2784 },

  { id: 'BOM', iataCode: 'BOM', city: 'Mumbai', country: 'India', displayName: 'Chhatrapati Shivaji Maharaj International Airport (BOM)', timezone: 'Asia/Kolkata', hasPrivateTerminal: true, lat: 19.0896, lng: 72.8656 },
  { id: 'DEL', iataCode: 'DEL', city: 'Delhi', country: 'India', displayName: 'Indira Gandhi International Airport (DEL)', timezone: 'Asia/Kolkata', hasPrivateTerminal: true, lat: 28.5562, lng: 77.1000 },
  { id: 'BLR', iataCode: 'BLR', city: 'Bangalore', country: 'India', displayName: 'Kempegowda International Airport (BLR)', timezone: 'Asia/Kolkata', hasPrivateTerminal: false, lat: 13.1986, lng: 77.7066 },
  { id: 'HYD', iataCode: 'HYD', city: 'Hyderabad', country: 'India', displayName: 'Rajiv Gandhi International Airport (HYD)', timezone: 'Asia/Kolkata', hasPrivateTerminal: false, lat: 17.2403, lng: 78.4294 },

  { id: 'SIN', iataCode: 'SIN', city: 'Singapore', country: 'Singapore', displayName: 'Singapore Changi Airport (SIN)', timezone: 'Asia/Singapore', hasPrivateTerminal: true, lat: 1.3644, lng: 103.9915 },
  { id: 'HKG', iataCode: 'HKG', city: 'Hong Kong', country: 'Hong Kong', displayName: 'Hong Kong International Airport (HKG)', timezone: 'Asia/Hong_Kong', hasPrivateTerminal: true, lat: 22.3080, lng: 113.9185 },
  { id: 'IST', iataCode: 'IST', city: 'Istanbul', country: 'Turkey', displayName: 'Istanbul Airport (IST)', timezone: 'Europe/Istanbul', hasPrivateTerminal: true, lat: 41.2753, lng: 28.7519 },
  { id: 'AMS', iataCode: 'AMS', city: 'Amsterdam', country: 'Netherlands', displayName: 'Amsterdam Schiphol Airport (AMS)', timezone: 'Europe/Amsterdam', hasPrivateTerminal: true, lat: 52.3105, lng: 4.7683 },

  { id: 'APF', iataCode: 'APF', city: 'Naples', country: 'United States', displayName: 'Naples Municipal Airport (APF)', timezone: 'America/New_York', hasPrivateTerminal: true, lat: 26.1526, lng: -81.7753 },
  { id: 'NAP', iataCode: 'NAP', city: 'Naples', country: 'Italy', displayName: 'Naples International Airport (NAP)', timezone: 'Europe/Rome', hasPrivateTerminal: false, lat: 40.8860, lng: 14.2908 },
];

const verifyApiToken = async (): Promise<boolean> => {
  try {
    const endpoints = [
      `${AVIA_PAGE_BASE_URL}/api/v1/auth/verify`,
      `${AVIA_PAGE_BASE_URL}/api/v1/profile/me`,
      `${AVIA_PAGE_BASE_URL}/api/v1/health`,
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) return true;
      } catch {
        continue;
      }
    }

    return false;
  } catch {
    return false;
  }
};

const addServiceFeeToFlight = (flight: any) => {
  const basePrice = Number(flight?.price?.total || 0);
  const serviceFee = Math.round((basePrice * SERVICE_FEE_PERCENTAGE) / 100);
  const totalWithFee = basePrice + serviceFee;

  return {
    ...flight,
    price: {
      ...(flight?.price || {}),
      total: totalWithFee,
      base: Math.round(basePrice),
      serviceFee,
      currency: flight?.price?.currency || 'USD',
    },
    pricing: {
      ...(flight?.pricing || {}),
      baseFare: Math.round(basePrice),
      serviceFee,
      total: totalWithFee,
      currency: flight?.price?.currency || 'USD',
    },
  };
};

const findAirport = (code) => {
  if (!code) return null;
  const query = code.trim().toUpperCase();

  return (
    AIRPORT_DATABASE.find(
      airport =>
        airport.iataCode?.toUpperCase() === query || airport.id?.toUpperCase() === query
    ) || null
  );
};

const toRad = (value) => (value * Math.PI) / 180;

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getRouteDistanceKm = (origin, destination) => {
  const from = findAirport(origin);
  const to = findAirport(destination);

  if (!from?.lat || !from?.lng || !to?.lat || !to?.lng) {
    return 1200;
  }

  return Math.round(haversineKm(from.lat, from.lng, to.lat, to.lng));
};

const getRouteDurationFromDistance = (distanceKm, category = 'Private Jet') => {
  let avgSpeed = 750;

  if (/heavy/i.test(category)) avgSpeed = 850;
  else if (/medium/i.test(category)) avgSpeed = 780;
  else if (/light/i.test(category)) avgSpeed = 700;
  else if (/turbo/i.test(category)) avgSpeed = 500;

  const airborneHours = distanceKm / avgSpeed;
  const totalHours = airborneHours + 0.6;

  const hours = Math.floor(totalHours);
  const minutes = Math.max(0, Math.round((totalHours - hours) * 60));

  return {
    hours,
    minutes,
    totalHours,
    iso: `PT${hours}H${minutes}M`,
  };
};

const normalizeDbFlightToAppFormat = (row, index) => {
  if (row?.itineraries && row?.price && typeof row?.price?.total !== 'undefined') {
    return row;
  }

  const id = row?.id || `db-flight-${index}`;
  const origin = row?.origin || row?.departure_airport || row?.from || row?.origin_iata || 'XXX';
  const destination = row?.destination || row?.arrival_airport || row?.to || row?.destination_iata || 'XXX';
  const departureDate = row?.departure_date || row?.departureDate || new Date().toISOString().split('T')[0];
  const departureTime = row?.departure_time || row?.departureTime || '08:00';
  const total = Number(row?.price || row?.total || row?.price_total || 0);
  const currency = row?.currency || 'USD';

  const departureDateTime = new Date(`${departureDate}T${departureTime}:00`);
  const distanceKm = getRouteDistanceKm(origin, destination);
  const routeDuration = getRouteDurationFromDistance(
    distanceKm,
    row?.aircraft_type || row?.model || 'Private Jet'
  );
  const arrivalDateTime = new Date(
    departureDateTime.getTime() + routeDuration.totalHours * 60 * 60 * 1000
  );

  return {
    id,
    type: 'charter-flight',
    source: 'DATABASE',
    timestamp: new Date().toISOString(),
    price: {
      currency,
      total,
      base: total,
    },
    itineraries: [
      {
        duration: routeDuration.iso,
        segments: [
          {
            departure: {
              iataCode: origin,
              at: departureDateTime.toISOString(),
              terminal: 'Private Terminal',
              scheduledTime: departureTime,
            },
            arrival: {
              iataCode: destination,
              at: arrivalDateTime.toISOString(),
              terminal: 'Private Terminal',
            },
            carrierCode: 'PJ',
            number: `PJ${1000 + index}`,
            aircraft: {
              code: row?.aircraft_type || 'PJ',
              name: row?.aircraft_name || row?.aircraft_type || row?.model || 'Private Charter',
            },
            duration: routeDuration.iso,
            id: `segment-${index}`,
            numberOfStops: 0,
            operatingCarrier: row?.operator || row?.airline || 'Private Charter',
          },
        ],
      },
    ],
    aircraftInfo: {
      id: row?.aircraft_id || row?.id,
      name: row?.aircraft_name || row?.model || 'Private Jet',
      manufacturer: row?.manufacturer || '',
      model: row?.model || row?.aircraft_name || 'Private Jet',
      year: row?.year || 2020,
      seats: row?.seats || row?.pax || 8,
      images: row?.images || row?.photos || [],
      features: row?.features || ['Luxury Seating', 'Refreshments'],
      airline: row?.operator || row?.airline || 'Private Charter',
    },
    _priceSource: 'database',
    _isEstimated: false,
  };
};

const fetchFlightsFromDatabase = async (
  origin,
  destination,
  departureDate,
  departureTime,
  returnDate,
  returnTime,
  passengers
) => {
  try {
    const params = {
      origin: origin || '',
      destination: destination || '',
      departure_date: departureDate || '',
      departure_time: departureTime || '08:00',
      return_date: returnDate || '',
      return_time: returnTime || '',
      passengers: parseInt(String(passengers), 10) || 1,
    };

    const url = `${base_url}${constant.getFlights}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) return null;

    const json = await response.json();
    const list =
      json?.data ?? json?.flights ?? json?.result ?? (Array.isArray(json) ? json : []);

    if (!Array.isArray(list) || list.length === 0) return null;

    return {
      data: list.map((row, i) =>
        addServiceFeeToFlight(normalizeDbFlightToAppFormat(row, i))
      ),
    };
  } catch {
    return null;
  }
};

const fetchRealAviapagesFlights = async (
  origin,
  destination,
  departureDate,
  departureTime,
  returnDate,
  returnTime: string,
  passengers: number
) => {
  try {
    const requestBody = {
      departure_airport: origin,
      arrival_airport: destination,
      departure_date: departureDate,
      departure_time: departureTime,
      passengers: Number(passengers) || 1,
      ...(returnDate
        ? {
            return_date: returnDate,
            return_time: returnTime,
            trip_type: 'round_trip',
          }
        : {}),
    };

    const endpoints = [
      `${AVIA_PAGE_BASE_URL}/api/v1/charter/flights/search`,
      `${AVIA_PAGE_BASE_URL}/api/v1/flights/search`,
      `${AVIA_PAGE_BASE_URL}/api/v1/price_calculator/`,
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) continue;

        const apiData = await response.json();
        const list =
          apiData?.results ||
          apiData?.data ||
          apiData?.flights ||
          apiData?.items ||
          [];

        if (!Array.isArray(list) || list.length === 0) continue;

        const normalized = list
          .map((item: any, index: number) => {
            const total =
              Number(item?.price?.total) ||
              Number(item?.total_price) ||
              Number(item?.price_total) ||
              Number(item?.quote_price) ||
              0;

            if (!total) return null;

            const dep = new Date(`${departureDate}T${departureTime}:00`);
            const duration =
              item?.itineraries?.[0]?.duration ||
              item?.duration ||
              getRouteDurationFromDistance(
                getRouteDistanceKm(origin, destination),
                item?.aircraft?.category || item?.aircraft_type || 'Private Jet'
              ).iso;

            const match = String(duration).match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
            const h = Number(match?.[1] || 2);
            const m = Number(match?.[2] || 30);
            const arr = new Date(dep.getTime() + (h * 60 + m) * 60 * 1000);

            return {
              id: item?.id || `api-flight-${index}`,
              type: 'charter-flight',
              source: 'AVIAPAGES_REAL_API',
              timestamp: new Date().toISOString(),
              price: {
                currency: item?.currency || item?.price?.currency || 'USD',
                total,
                base: total,
              },
              itineraries: [
                {
                  duration,
                  segments: [
                    {
                      departure: {
                        iataCode: origin,
                        at: dep.toISOString(),
                        terminal: 'Private Terminal',
                        scheduledTime: departureTime,
                      },
                      arrival: {
                        iataCode: destination,
                        at: arr.toISOString(),
                        terminal: 'Private Terminal',
                      },
                      carrierCode: item?.operator_code || 'PJ',
                      number: item?.flight_number || `PJ${1000 + index}`,
                      aircraft: {
                        code: item?.aircraft?.code || 'PJ',
                        name:
                          item?.aircraft?.name ||
                          item?.aircraft_type?.name ||
                          item?.aircraft_name ||
                          'Private Jet',
                      },
                      duration,
                      id: `segment-${index}`,
                      numberOfStops: 0,
                      operatingCarrier:
                        item?.operator?.name ||
                        item?.company?.name ||
                        item?.airline ||
                        'Private Charter',
                    },
                  ],
                },
              ],
              aircraftInfo: {
                id: item?.aircraft?.id || index,
                name:
                  item?.aircraft?.name ||
                  item?.aircraft_type?.name ||
                  item?.aircraft_name ||
                  'Private Jet',
                manufacturer: item?.aircraft?.manufacturer || '',
                model: item?.aircraft?.model || item?.aircraft_type?.name || '',
                year: item?.aircraft?.year || item?.year_of_production || 2020,
                seats: item?.aircraft?.seats || item?.passengers_max || 8,
                images: item?.images || item?.aircraft?.images || [],
                features: item?.features || ['Luxury Seating'],
                airline:
                  item?.operator?.name ||
                  item?.company?.name ||
                  item?.airline ||
                  'Private Charter',
              },
              _priceSource: 'aviapages_real',
              _isEstimated: false,
            };
          })
          .filter(Boolean);

        if (normalized.length > 0) {
          return { data: normalized.map(addServiceFeeToFlight) };
        }
      } catch {
        continue;
      }
    }

    return null;
  } catch {
    return null;
  }
};

const getAircraftFeatures = (aircraft: any) => {
  const features: string[] = [];

  if (aircraft?.wifi || aircraft?.has_wifi) features.push('WiFi');
  if (aircraft?.entertainment) features.push('Entertainment System');
  if (aircraft?.galley || aircraft?.has_galley) features.push('Full Galley');
  if (aircraft?.lavatory || aircraft?.has_lavatory) features.push('Lavatory');
  if (aircraft?.flight_attendant) features.push('Flight Attendant');
  if (aircraft?.pets_allowed) features.push('Pets Allowed');
  if (aircraft?.smoking_allowed) features.push('Smoking Allowed');
  if (aircraft?.cargo_capacity) features.push(`Cargo: ${aircraft.cargo_capacity}`);

  return features.length === 0
    ? ['Luxury Seating', 'Climate Control', 'Refreshments', 'Luggage Space']
    : features;
};

const getDefaultAircraftImages = (category: string) => {
  const defaultImages: Record<string, string[]> = {
    'Heavy Jet': [
      'https://md.aviapages.com/media/2025/08/29/67c586329c3acd93449ee0c4_Union-Aviation-YL-ECT-interior-12.jpg',
      'https://md.aviapages.com/media/2025/08/29/67c5862fd83c81736b0a6606_Union-Aviation-YL-ECT-interior-3.jpg',
    ],
    'Medium Jet': [
      'https://md.aviapages.com/media/thmb/2022/02/01/q90/g1920/crcenter/image-005.jpg.webp',
      'https://md.aviapages.com/media/2022/02/01/image-006.jpg',
    ],
    'Light Jet': [
      'https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_1_1600x1200.jpg',
      'https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_2_1600x1200.jpg',
    ],
    default: [
      'https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_1_1600x1200.jpg',
      'https://md.aviapages.com/media/2022/02/01/image-005.jpg.webp',
    ],
  };

  return defaultImages[category] || defaultImages.default;
};

const fetchAllCharterAircraftEstimated = async (
  origin: string,
  destination: string,
  departureDate: string,
  departureTime: string,
  passengers: number
) => {
  try {
    const charterAircraftResponse = await getCharterAircraft({
      page_size: 100,
      ordering: '-year_of_production',
    });

    const allAircraft = charterAircraftResponse?.results || charterAircraftResponse || [];
    if (!Array.isArray(allAircraft) || allAircraft.length === 0) return null;

    let routeMinutes = 0;

    try {
      const ft = await calculateFlightTime(origin, destination);
      if (ft?.flight_time) {
        routeMinutes = Number(ft.flight_time);
      }
    } catch {}

    if (!routeMinutes || Number.isNaN(routeMinutes)) {
      routeMinutes = Math.round(
        getRouteDurationFromDistance(getRouteDistanceKm(origin, destination)).totalHours * 60
      );
    }

    const flights = allAircraft.map((aircraft: any, index: number) => {
      const category = aircraft?.aircraft_type?.aircraft_class?.name || 'Private Jet';
      const hourlyRate =
        Number(aircraft?.hourly_rate) ||
        Number(aircraft?.price_per_hour) ||
        Number(aircraft?.selling_price_per_hour) ||
        5000;

      const flightHours = routeMinutes / 60;

      const repositionFactor = 1.18;
      const airportOpsFactor = 1.08;
      const passengerFactor = 1 + Math.max(0, passengers - 1) * 0.015;

      const estimatedBase = Math.round(
        hourlyRate * flightHours * repositionFactor * airportOpsFactor * passengerFactor
      );

      const departureDateTime = new Date(`${departureDate}T${departureTime}:00`);
      const arrivalDateTime = new Date(
        departureDateTime.getTime() + routeMinutes * 60 * 1000
      );

      const images =
        aircraft?.images?.map((p: any) => p?.media?.path).filter(Boolean) ||
        getDefaultAircraftImages(category);

      return {
        id: `estimated-${aircraft?.id || index}`,
        type: 'charter-flight',
        source: 'AVIAPAGES_ESTIMATED',
        timestamp: new Date().toISOString(),
        price: {
          currency: aircraft?.selling_currency || 'USD',
          total: estimatedBase,
          base: estimatedBase,
        },
        itineraries: [
          {
            duration: `PT${Math.floor(routeMinutes / 60)}H${routeMinutes % 60}M`,
            segments: [
              {
                departure: {
                  iataCode: origin,
                  at: departureDateTime.toISOString(),
                  terminal: 'Private Terminal',
                  scheduledTime: departureTime,
                },
                arrival: {
                  iataCode: destination,
                  at: arrivalDateTime.toISOString(),
                  terminal: 'Private Terminal',
                },
                carrierCode: aircraft?.company?.name?.substring(0, 2)?.toUpperCase() || 'PJ',
                number: `PJ${1000 + index}`,
                aircraft: {
                  code: aircraft?.aircraft_type?.icao || 'PJ',
                  name: aircraft?.aircraft_type?.name || 'Private Jet',
                },
                duration: `PT${Math.floor(routeMinutes / 60)}H${routeMinutes % 60}M`,
                id: `segment-${index}`,
                numberOfStops: 0,
                operatingCarrier: aircraft?.company?.name || 'Private Charter',
              },
            ],
          },
        ],
        aircraftInfo: {
          id: aircraft?.id,
          name: aircraft?.aircraft_type?.name || 'Private Jet',
          manufacturer: aircraft?.aircraft_type?.name?.split(' ')[0] || '',
          model: aircraft?.aircraft_type?.name || '',
          year: aircraft?.year_of_production || 2020,
          seats: aircraft?.passengers_max || 8,
          speed: '850 km/h',
          range: '5000 km',
          images,
          features: getAircraftFeatures(aircraft),
          airline: aircraft?.company?.name || 'Private Charter',
          airlineLogo: '',
          hourlyRate,
          category,
          registration: aircraft?.registration_number || '',
          homeBase: aircraft?.base_airport?.name || '',
          availability: 'Available',
          instantConfirmation: true,
        },
        _priceSource: 'estimated_from_aircraft_directory',
        _isEstimated: true,
      };
    });

    return {
      data: flights
        .map(addServiceFeeToFlight)
        .sort((a, b) => (a?.pricing?.total || 0) - (b?.pricing?.total || 0)),
    };
  } catch {
    return null;
  }
};

const generateTimeSlots = (preferredTime: string | null = null) => {
  const slots = [];
  const baseTime = preferredTime || '10:00';
  const [baseHour] = baseTime.split(':').map(Number);

  for (let hour = 5; hour <= 23; hour++) {
    if (!preferredTime || Math.abs(hour - baseHour) <= 3) {
      for (const minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        slots.push({
          time,
          display: formatTimeForDisplay(time),
          available: true,
          isPeak: (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19),
          isPreferred: time === preferredTime,
        });
      }
    }
  }

  return slots;
};

const formatTimeForDisplay = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const searchAirportsFallback = async (query: string) => {
  if (!query || query.trim().length < 2) return { data: [] };

  try {
    const response = await fetch(
      `${AVIA_PAGE_BASE_URL}/api/v1/airports/?search=${encodeURIComponent(query)}&page_size=20`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const json = await response.json();
      const results = json?.results || json?.data || (Array.isArray(json) ? json : []);

      const normalized = results
        .map((a: any) => ({
          id: a?.iata_code || a?.icao_code || a?.id || String(a?.pk || ''),
          iataCode: a?.iata_code || a?.code || '',
          icaoCode: a?.icao_code || '',
          city: a?.city?.name || a?.city || a?.municipality || '',
          country: a?.country?.name || a?.country || '',
          displayName: a?.name
            ? `${a.name} (${a.iata_code || a.icao_code || ''})`
            : a?.iata_code || a?.icao_code || '',
          timezone: a?.timezone || '',
          hasPrivateTerminal: a?.has_private_terminal || false,
        }))
        .filter((a: any) => a?.iataCode || a?.icaoCode);

      if (normalized.length > 0) return { data: normalized };
    }
  } catch {}

  const q = query.toLowerCase().trim();

  const filtered = AIRPORT_DATABASE.filter(
    airport =>
      airport.city.toLowerCase().includes(q) ||
      airport.iataCode.toLowerCase().includes(q) ||
      airport.displayName.toLowerCase().includes(q) ||
      airport.country.toLowerCase().includes(q)
  );

  filtered.sort((a, b) => {
    const aExact = a.iataCode.toLowerCase() === q ? 0 : 1;
    const bExact = b.iataCode.toLowerCase() === q ? 0 : 1;
    if (aExact !== bExact) return aExact - bExact;

    const aStarts = a.city.toLowerCase().startsWith(q) ? 0 : 1;
    const bStarts = b.city.toLowerCase().startsWith(q) ? 0 : 1;
    return aStarts - bStarts;
  });

  return { data: filtered.slice(0, 15) };
};

export const AviapagesFlightService = {
  searchFlights: async (
    origin: string,
    destination: string,
    departureDate: string,
    departureTime = '08:00',
    returnDate: string | null = null,
    returnTime = '18:00',
    passengers = 1
  ) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(departureTime)) departureTime = '08:00';
    if (returnDate && !timeRegex.test(returnTime)) returnTime = '18:00';

    const passengerCount = Math.max(1, parseInt(String(passengers), 10) || 1);

    const applyRoundTrip = (flights: any[]) =>
      returnDate
        ? flights.map(f => ({
            ...f,
            tripType: 'round_trip',
            returnDate,
            returnTime,
            pricing: {
              ...f?.pricing,
              baseFare: (f?.pricing?.baseFare || 0) * 2,
              serviceFee: (f?.pricing?.serviceFee || 0) * 2,
              total: (f?.pricing?.total || 0) * 2,
              currency: f?.pricing?.currency || 'USD',
            },
            price: {
              ...f?.price,
              total: (f?.price?.total || 0) * 2,
              base: (f?.price?.base || 0) * 2,
            },
            roundTrip: true,
          }))
        : flights;

    const buildResult = (data: any[], source: string) => ({
      data: applyRoundTrip(data),
      searchParams: {
        origin,
        destination,
        departureDate,
        departureTime,
        returnDate,
        returnTime,
        passengers: passengerCount,
      },
      metadata: {
        source,
        timestamp: new Date().toISOString(),
        totalResults: data.length,
        message:
          source === 'AVIAPAGES_ESTIMATED'
            ? `Found ${data.length} estimated charter aircraft options`
            : `Found ${data.length} charter aircraft available for your route`,
      },
    });

    const dbFlights = await fetchFlightsFromDatabase(
      origin,
      destination,
      departureDate,
      departureTime,
      returnDate,
      returnTime,
      passengerCount
    );
    if (dbFlights?.data?.length > 0) {
      return buildResult(dbFlights.data, 'DATABASE');
    }

    const realFlights = await fetchRealAviapagesFlights(
      origin,
      destination,
      departureDate,
      departureTime,
      returnDate,
      returnTime,
      passengerCount
    );
    if (realFlights?.data?.length > 0) {
      return buildResult(realFlights.data, 'AVIAPAGES_REAL_API');
    }

    const estimatedFlights = await fetchAllCharterAircraftEstimated(
      origin,
      destination,
      departureDate,
      departureTime,
      passengerCount
    );
    if (estimatedFlights?.data?.length > 0) {
      return buildResult(estimatedFlights.data, 'AVIAPAGES_ESTIMATED');
    }

    return buildResult([], 'NO_RESULTS');
  },

  getCharterDetails: async (charterId: string, preferredTime: string | null = null) => {
    return {
      success: true,
      charterId,
      availableSlots: generateTimeSlots(preferredTime),
      preferredTime,
    };
  },

  searchAirports: async (query: string) => {
    return await searchAirportsFallback(query);
  },

  testApiConnection: async () => verifyApiToken(),

  getAvailableTimeSlots: async (charterId: string, date: string, preferredTime: string | null = null) => {
    try {
      return {
        success: true,
        data: generateTimeSlots(preferredTime),
        charterId,
        date,
        preferredTime,
        note: 'Private jets offer flexible scheduling.',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: error?.message || 'Unknown error',
      };
    }
  },

  validateTimePreference: (time: string, flexible = false) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!timeRegex.test(time)) {
      return {
        valid: false,
        message: 'Invalid time format. Please use HH:MM format (24-hour).',
        suggested: '08:00',
      };
    }

    const [hours] = time.split(':').map(Number);

    if (hours < 5 || hours > 23) {
      return {
        valid: false,
        message: 'Private jet operations are typically from 5:00 AM to 11:00 PM.',
        suggested: hours < 5 ? '05:00' : '22:00',
      };
    }

    return {
      valid: true,
      message: flexible
        ? 'Time preference noted. We will show options within ±2 hours.'
        : 'Fixed time preference set.',
      operational: true,
    };
  },

  calculateFlexiblePricing: (basePrice: number, isExactTime = false, timeAdjustment = 0) => {
    const multiplier = isExactTime ? 1.1 : Math.abs(timeAdjustment) === 2 ? 0.9 : 1.0;
    return Math.round(basePrice * multiplier);
  },
};

export default AviapagesFlightService;








/**
 * AviapagesFlightService.ts — FINAL CLEAN VERSION
 *
 * Confirmed working:
 *   POST /v3/flight_calculator/  → flight_time_wind_impact, distance_airway_km
 *   POST /v3/price_calculator/   → total_flight_price ✅ CONFIRMED field name
 *
 * Request body:
 *   departure_airport: "VAID"   (plain ICAO string)
 *   arrival_airport:   "VABB"   (plain ICAO string)
 *   aircraft:          "F10"    (type ICAO string — REQUIRED)
 *   dep_date:          "2026-03-18T08:00"
 *   pax:               1
 */

// const BASE_URL  = 'https://api.aviapages.com';
// const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';
// const HEADERS   = {
//   'Content-Type': 'application/json',
//   Authorization:  `Token ${API_TOKEN}`,
// };

// /* ─── Aircraft classes ────────────────────────────────────────── */
// const CLASS_PROFILES = [
//   { classId: 12, className: 'Light Jet',       typeIcao: 'F10',  seats: 6  },
//   { classId: 7,  className: 'Midsize Jet',      typeIcao: 'C56X', seats: 8  },
//   { classId: 1,  className: 'Super Midsize',    typeIcao: 'C68A', seats: 9  },
//   { classId: 6,  className: 'Heavy Jet',        typeIcao: 'GLEX', seats: 14 },
//   { classId: 13, className: 'Ultra Long Range', typeIcao: 'B7W',  seats: 16 },
// ];

// /* ─── Helpers ─────────────────────────────────────────────────── */
// const hhmmToMins = (t: string): number => {
//   const [h, m] = (t || '00:00').split(':').map(Number);
//   return h * 60 + m;
// };
// const minsToPT  = (m: number) =>
//   `PT${Math.floor(m / 60)}H${String(m % 60).padStart(2, '0')}M`;
// const minsToDur = (m: number) =>
//   `${Math.floor(m / 60)}H ${String(m % 60).padStart(2, '0')}M`;
// const toISO = (date: string, time: string): string => {
//   const [h, m] = time.split(':').map(Number);
//   const d = new Date(`${date}T00:00:00`);
//   d.setHours(h, m, 0, 0);
//   return d.toISOString();
// };
// const addMins = (iso: string, mins: number): string => {
//   const d = new Date(iso);
//   d.setMinutes(d.getMinutes() + mins);
//   return d.toISOString();
// };

// /* ─── IATA → ICAO ─────────────────────────────────────────────── */
// const ICAO_MAP: Record<string, string> = {
//   // India
//   BOM: 'VABB', DEL: 'VIDP', IDR: 'VAID', MAA: 'VOMM', BLR: 'VOBL',
//   HYD: 'VOHS', CCU: 'VECC', AMD: 'VAAH', GOI: 'VOGO', JAI: 'VIJP',
//   LKO: 'VILK', PNQ: 'VAPO', COK: 'VOCI', NAG: 'VANP', VNS: 'VIBN',
//   IXC: 'VICG', ATQ: 'VIAR', SXR: 'VISR', IXB: 'VEBD', GAU: 'VEGT',
//   BBI: 'VEBB', PAT: 'VEPT', BHO: 'VABP', UDR: 'VAUD', JDH: 'VIJO',
//   IXM: 'VOCL', TRV: 'VOTV', MYQ: 'VOMD', KNU: 'VIKA', RPR: 'VARP',
//   // International
//   LHR: 'EGLL', JFK: 'KJFK', DXB: 'OMDB', SIN: 'WSSS', CDG: 'LFPG',
//   FRA: 'EDDF', AMS: 'EHAM', MUC: 'EDDM', ZRH: 'LSZH', IST: 'LTBA',
//   DOH: 'OTHH', AUH: 'OMAA', BKK: 'VTBS', KUL: 'WMKK', HKG: 'VHHH',
//   NRT: 'RJAA', SYD: 'YSSY', MEL: 'YMML', LAX: 'KLAX', ORD: 'KORD',
// };
// const _icaoCache: Record<string, string> = {};

// const toICAO = async (code: string): Promise<string> => {
//   const c = code.toUpperCase().trim();
//   if (/^[A-Z]{4}$/.test(c)) return c;
//   if (_icaoCache[c]) return _icaoCache[c];
//   if (ICAO_MAP[c]) {
//     _icaoCache[c] = ICAO_MAP[c];
//     return ICAO_MAP[c];
//   }
//   try {
//     const r = await fetch(
//       `${BASE_URL}/v3/airports/?search_iata=${c}`,
//       { headers: HEADERS },
//     );
//     const j = await r.json();
//     const icao = j?.results?.[0]?.icao;
//     if (icao) {
//       _icaoCache[c] = icao;
//       console.log(`[ICAO] ${c} → ${icao}`);
//       return icao;
//     }
//   } catch (_) {}
//   return c;
// };

// /* ─── POST /v3/flight_calculator/ ─────────────────────────────── */
// const callFlightCalc = async (
//   dep: string,
//   arr: string,
//   date: string,
//   time: string,
//   pax: number,
//   typeIcao: string,
// ): Promise<{ flightMins: number; distKm: number; distNmi: number } | null> => {

//   const body = {
//     departure_airport: dep,
//     arrival_airport:   arr,
//     aircraft:          typeIcao,
//     dep_date:          `${date}T${time}`,
//     pax,
//   };

//   console.log('[FlightCalc] →', dep, '→', arr, 'aircraft:', typeIcao);

//   const r = await fetch(`${BASE_URL}/v3/flight_calculator/`, {
//     method: 'POST',
//     headers: HEADERS,
//     body: JSON.stringify(body),
//   });

//   console.log('[FlightCalc] status:', r.status);

//   if (!r.ok) {
//     console.error('[FlightCalc] ❌', await r.text());
//     return null;
//   }

//   const j = await r.json();
//   const res = j?.result ?? j;

//   const timeStr: string =
//     res?.flight_time_wind_impact ??
//     res?.flight_time ??
//     res?.avg_speed_time ??
//     '02:30';

//   const flightMins = hhmmToMins(timeStr);
//   const distKm: number  = res?.distance_airway_km ?? res?.distance_gc_km ?? 0;
//   const distNmi: number = res?.distance_airway_nmi ?? res?.distance_gc_nmi ?? Math.round(distKm * 0.54);

//   console.log(`[FlightCalc] ✅ ${timeStr} = ${flightMins}min | ${distKm}km`);
//   return { flightMins, distKm, distNmi };
// };

// /* ─── POST /v3/price_calculator/ ──────────────────────────────── */
// const callPriceCalc = async (
//   dep: string,
//   arr: string,
//   date: string,
//   time: string,
//   pax: number,
//   typeIcao: string,
// ): Promise<{
//   price: number;
//   currency: string;
//   aircraftType: string;
//   aircraftClass: string;
// } | null> => {

//   const body = {
//     departure_airport: dep,
//     arrival_airport:   arr,
//     aircraft:          typeIcao,
//     dep_date:          `${date}T${time}`,
//     pax,
//   };

//   const r = await fetch(`${BASE_URL}/v3/price_calculator/`, {
//     method: 'POST',
//     headers: HEADERS,
//     body: JSON.stringify(body),
//   });

//   console.log(`[PriceCalc] ${typeIcao} status:`, r.status);

//   if (!r.ok) {
//     console.warn(`[PriceCalc] ❌ ${typeIcao}:`, (await r.text()).slice(0, 150));
//     return null;
//   }

//   const j = await r.json();
//   const res = j?.result ?? j;

//   // ✅ CONFIRMED field: total_flight_price
//   const price = Number(res?.total_flight_price ?? res?.total_price ?? res?.price ?? 0);

//   console.log(`[PriceCalc] ✅ ${typeIcao} → $${price}`);

//   return {
//     price,
//     currency:     res?.currency ?? res?.currency_code ?? 'USD',
//     aircraftType: res?.aircraft_type_name ?? res?.aircraft_type ?? typeIcao,
//     aircraftClass: res?.aircraft_class_name ?? res?.aircraft_class ?? '',
//   };
// };

// /* ─── Build flight card ───────────────────────────────────────── */
// const buildCard = (
//   idx: number,
//   dep: string, arr: string,
//   depISO: string, depTime: string,
//   flightMins: number, distKm: number, distNmi: number,
//   price: number, currency: string,
//   acType: string, acClass: string, seats: number,
// ) => {
//   const fee = Math.round(price * 0.1);
//   return {
//     id: `fc-${idx}-${acClass.replace(/\s/g, '')}`,
//     _isEstimated: true,
//     price:   { total: price, currency },
//     pricing: { baseFare: price - fee, serviceFee: fee, total: price, currency },
//     itineraries: [{
//       duration: minsToPT(flightMins),
//       segments: [{
//         departure: { iataCode: dep, at: depISO, userPreferredTime: depTime },
//         arrival:   { iataCode: arr, at: addMins(depISO, flightMins) },
//         carrierCode: 'CHARTER',
//         aircraft: { code: acType },
//       }],
//     }],
//     aircraftInfo: {
//       airline:           'Private Charter',
//       manufacturer:      acType.split(' ')[0] ?? '',
//       model:             acType,
//       seats,
//       images:            [],
//       category:          acClass,
//       distanceKm:        distKm,
//       distanceNmi:       distNmi,
//       flightTimeDisplay: minsToDur(flightMins),
//     },
//     userPreferredDepartureTime: depTime,
//   };
// };

// /* ─── Main exported service ───────────────────────────────────── */
// export const AviapagesFlightService = {
//   searchFlights: async (
//     origin: string,
//     destination: string,
//     departureDate: string,
//     departureTime: string,
//     returnDate: string | null,
//     returnTime: string,
//     passengers: number,
//     _unused = false,
//   ): Promise<{ data: any[] }> => {

//     if (!origin || !destination || !departureDate)
//       throw new Error('Origin, destination aur date required hai');

//     // IATA → ICAO
//     const [dep, arr] = await Promise.all([
//       toICAO(origin),
//       toICAO(destination),
//     ]);
//     console.log(`\n[Service] ${origin}→${dep} | ${destination}→${arr} | ${departureDate} ${departureTime}`);

//     const depISO = toISO(departureDate, departureTime);

//     // Step 1: Flight time
//     const calc = await callFlightCalc(
//       dep, arr,
//       departureDate, departureTime,
//       passengers,
//       CLASS_PROFILES[0].typeIcao,
//     );

//     if (!calc) throw new Error(`Flight calculator failed: ${dep} → ${arr}`);

//     const { flightMins, distKm, distNmi } = calc;
//     console.log(`[Service] ✅ ${minsToDur(flightMins)} | ${distKm}km`);

//     // Step 2: Price per class (parallel)
//     const priceResults = await Promise.allSettled(
//       CLASS_PROFILES.map(cp =>
//         callPriceCalc(dep, arr, departureDate, departureTime, passengers, cp.typeIcao)
//           .then(r => ({ cp, r }))
//       )
//     );

//     const items: any[] = [];

//     priceResults.forEach((s, idx) => {
//       if (s.status !== 'fulfilled') return;
//       const { cp, r } = s.value;
//       if (!r || r.price <= 0) return;
//       items.push(buildCard(
//         idx, dep, arr, depISO, departureTime,
//         flightMins, distKm, distNmi,
//         r.price, r.currency,
//         r.aircraftType  || cp.className,
//         r.aircraftClass || cp.className,
//         cp.seats,
//       ));
//     });

//     // Fallback if no prices
//     if (items.length === 0) {
//       console.warn('[Service] ⚠️ No API prices — using distance estimates');
//       [10, 15, 20, 28, 38].forEach((rate, idx) => {
//         const cp  = CLASS_PROFILES[idx];
//         const price = Math.max(Math.round(distKm * rate / 100) * 100, 2000);
//         items.push(buildCard(idx, dep, arr, depISO, departureTime,
//           flightMins, distKm, distNmi, price, 'USD',
//           cp.className, cp.className, cp.seats));
//       });
//     }

//     // Round trip return leg
//     if (returnDate) {
//       const retISO = toISO(returnDate, returnTime);
//       const retCalc = await callFlightCalc(
//         arr, dep, returnDate, returnTime,
//         passengers, CLASS_PROFILES[0].typeIcao,
//       );
//       if (retCalc) {
//         const retResults = await Promise.allSettled(
//           CLASS_PROFILES.slice(0, 3).map(cp =>
//             callPriceCalc(arr, dep, returnDate, returnTime, passengers, cp.typeIcao)
//               .then(r => ({ cp, r }))
//           )
//         );
//         retResults.forEach((s, idx) => {
//           if (s.status !== 'fulfilled') return;
//           const { cp, r } = s.value;
//           if (!r || r.price <= 0) return;
//           items.push(buildCard(
//             items.length + idx, arr, dep, retISO, returnTime,
//             retCalc.flightMins, retCalc.distKm, retCalc.distNmi,
//             r.price, r.currency,
//             r.aircraftType  || cp.className,
//             r.aircraftClass || cp.className,
//             cp.seats,
//           ));
//         });
//       }
//     }

//     // Cheapest first → index 0 = BEST DEAL
//     items.sort((a, b) => a.pricing.total - b.pricing.total);

//     console.log(`\n[Service] ===== ${items.length} cards =====`);
//     items.forEach(i =>
//       console.log(`  ${(i.aircraftInfo.model || '').padEnd(22)} $${i.pricing.total}  ${i.aircraftInfo.flightTimeDisplay}`)
//     );

//     return { data: items };
//   },
// };