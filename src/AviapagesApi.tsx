// // AviapagesFlightService.js
// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'https://api.aviapages.com',
//   timeout: 30000,
//   headers: {
//     Accept: 'application/json',
//     Authorization: 'Bearer zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn',
//     'Content-Type': 'application/json',
//   },
// });

// // ---------- helpers ----------
// const formatImageUrl = (url) => {
//   if (!url) return null;
//   if (url.startsWith('http')) return url;
//   return `https://api.aviapages.com${url}`;
// };

// const extractAircraftImages = (aircraft) => {
//   if (!aircraft) return [];
//   const sources = [
//     aircraft.images,
//     aircraft.photos,
//     aircraft.exterior_images,
//     aircraft.interior_images,
//     aircraft.image,
//   ];

//   const images = [];
//   sources.forEach(src => {
//     if (Array.isArray(src)) {
//       src.forEach(i => formatImageUrl(i) && images.push(formatImageUrl(i)));
//     } else if (typeof src === 'string') {
//       formatImageUrl(src) && images.push(formatImageUrl(src));
//     }
//   });

//   return [...new Set(images)];
// };

// // ---------- main service ----------
// export const AviapagesApi = {
//   async searchFlights({ origin, destination, departureDate, returnDate, passengers }) {
//     if (!origin || !destination || !departureDate) {
//       throw new Error('origin, destination and departureDate required');
//     }

//     const params = {
//       from: origin.toUpperCase(),
//       to: destination.toUpperCase(),
//       date: departureDate,
//       passengers,
//       trip_type: returnDate ? 'round_trip' : 'one_way',
//       return_date: returnDate || undefined,
//     };

//     const response = await API.get('/api/v1/search/', { params });

//     const rawFlights =
//       response.data?.results ||
//       response.data?.data ||
//       response.data?.flights ||
//       [];

//     if (!Array.isArray(rawFlights)) {
//       return { success: true, data: [], count: 0 };
//     }

//     const flights = rawFlights
//       .map((flight) => {
//         if (!flight.itineraries || !flight.price) return null;

//         const aircraft =
//           flight.aircraft ||
//           flight.aircraft_info ||
//           flight.aircraft_details;

//         const images = extractAircraftImages(aircraft);

//         return {
//           id: flight.id || flight.offer_id,

//           aircraft: aircraft && {
//             manufacturer: aircraft.manufacturer,
//             model: aircraft.model,
//             seats: aircraft.seats,
//             images,
//             primaryImage: images[0] || null,
//           },

//           pricing: {
//             total: flight.price.total,
//             currency: flight.price.currency,
//             perPassenger: flight.price.per_passenger,
//           },

//           itineraries: flight.itineraries.map(it => ({
//             duration: it.duration,
//             segments: it.segments.map(seg => ({
//               departure: {
//                 airport: seg.departure_airport,
//                 at: seg.departure_time,
//               },
//               arrival: {
//                 airport: seg.arrival_airport,
//                 at: seg.arrival_time,
//               },
//               aircraft: seg.aircraft,
//               operator: seg.operator,
//               flightNumber: seg.flight_number,
//               cabinClass: seg.cabin_class,
//             })),
//           })),

//           meta: {
//             emptyLeg: flight.empty_leg,
//             instantBooking: flight.instant_booking,
//             operator: flight.operator,
//           },
//         };
//       })
//       .filter(Boolean); // ❗ static / fake entries removed

//     return {
//       success: true,
//       data: flights,
//       count: flights.length,
//     };
//   },

//   async getAircraftDetails(id) {
//     const res = await API.get(`/api/v1/aircraft/${id}/`);
//     return res.data;
//   },

//   async getAirportDetails(code) {
//     const res = await API.get(`/api/v1/airports/${code}/`);
//     return res.data;
//   },

//   async bookFlight(flightId, payload) {
//     const res = await API.post('/api/v1/bookings/', {
//       flight_id: flightId,
//       ...payload,
//     });
//     return res.data;
//   },
// };

// export default AviapagesApi;
// src/services/AviapagesApi.js
// src/services/AviapagesApi.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.aviapages.com',
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    Authorization: 'Bearer zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn',
    'Content-Type': 'application/json',
  },
});

type SearchParams = {
  origin: string;
  destination: string;
  departureDate: string;
  passengers?: number;
  tripType?: 'one_way' | 'round_trip';
  returnDate?: string;
};

const ENDPOINTS = [
  '/api/v1/availability/search/',
  '/api/v1/search/',
  '/api/v1/flights/search/',
  '/api/v1/charters/search/',
];

const AviapagesApi = {
  async searchFlights({
    origin,
    destination,
    departureDate,
    passengers = 1,
    tripType = 'one_way',
    returnDate,
  }: SearchParams) {
    if (!origin || !destination || !departureDate) {
      throw new Error('origin, destination and departureDate are required');
    }

    const body: any = {
      from: origin.toUpperCase(),
      to: destination.toUpperCase(),
      departure_date: departureDate,
      passengers,
      trip_type: tripType,
    };

    if (tripType === 'round_trip') {
      body.return_date = returnDate;
    }

    console.log('🟢 Aviapages BODY:', body);

    let lastError: any = null;

    for (const endpoint of ENDPOINTS) {
      try {
        console.log(`🔍 Trying ${endpoint}`);
        const res = await api.post(endpoint, body);
        console.log(`✅ Success from ${endpoint}`, res.data);

        return {
          success: true,
          endpoint,
          data:
            res.data?.availability ||
            res.data?.results ||
            res.data?.data ||
            [],
        };
      } catch (err: any) {
        console.log(`❌ ${endpoint} failed`, err.response?.status);
        lastError = err;
      }
    }

    // ❌ No endpoint allowed
    throw new Error(
      lastError?.response?.status === 404
        ? 'Aviapages API access not enabled for this token'
        : 'Aviapages request failed'
    );
  },
};

export default AviapagesApi;
