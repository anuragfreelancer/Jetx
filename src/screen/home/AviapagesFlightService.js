 

// const AVIA_PAGE_BASE_URL = 'https://api.aviapages.com';
// const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';

// // API Token Verification Function
// const verifyApiToken = async () => {
//   try {
//     console.log('🔐 Verifying API token...');
    
//     // Try different authentication endpoints
//     const authEndpoints = [
//       `${AVIA_PAGE_BASE_URL}/api/v1/auth/verify`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/auth/check`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/profile`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/health`
//     ];

//     for (const endpoint of authEndpoints) {
//       try {
//         const response = await fetch(endpoint, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${API_TOKEN}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.ok) {
//           console.log('✅ API Token is valid');
//           return true;
//         }
//       } catch (error) {
//         console.log(`❌ Endpoint ${endpoint} failed:`, error.message);
//         continue;
//       }
//     }

//     console.log('❌ All authentication endpoints failed');
//     return false;
//   } catch (error) {
//     console.error('❌ Token verification error:', error);
//     return false;
//   }
// };

// // Real API Call Function
// const fetchRealAviapagesFlights = async (origin, destination, departureDate, returnDate, passengers) => {
//   try {
//     console.log('🚀 Fetching REAL flights from Aviapages...');

//     // Aviapages API के according parameters
//     const requestData = {
//       departure_airport: origin,
//       arrival_airport: destination,
//       departure_date: departureDate,
//       passengers: parseInt(passengers) || 1,
//       trip_type: returnDate ? 'round_trip' : 'one_way',
//       ...(returnDate && { return_date: returnDate })
//     };

//     console.log('📤 API Request:', requestData);

//     // Try different flight search endpoints
//     const flightEndpoints = [
//       `${AVIA_PAGE_BASE_URL}/api/v1/charter/flights/search`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/flights/search`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/aircraft/search`,
//       `${AVIA_PAGE_BASE_URL}/api/charter/flights`
//     ];

//     let lastError = null;

//     for (const endpoint of flightEndpoints) {
//       try {
//         console.log(`🔧 Trying endpoint: ${endpoint}`);
        
//         const response = await fetch(endpoint, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${API_TOKEN}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//           },
//           body: JSON.stringify(requestData)
//         });

//         console.log('📥 API Response Status:', response);

//         if (response.ok) {
//           const apiData = await response.json();
            
//           // Transform Aviapages format to our app format
//           return transformRealAviapagesResponse(apiData, origin, destination, passengers);
//         } else {
//           const errorText = await response.text();
//           console.log(`❌ Endpoint ${endpoint} failed: ${response.status} - ${errorText}`);
//           lastError = new Error(`API Error: ${response.status} - ${errorText}`);
//         }
//       } catch (error) {
//         console.log(`❌ Endpoint ${endpoint} error:`, error.message);
//         lastError = error;
//         continue;
//       }
//     }

//     throw lastError || new Error('All flight search endpoints failed');

//   } catch (error) {
//     console.error('❌ Real API call failed:', error);
//     throw error;
//   }
// };

// // Real API Response Transformer
// const transformRealAviapagesResponse = (apiData, origin, destination, passengers) => {
//   try {
 
//     // Check different possible response formats
//     const flights = apiData.flights || apiData.aircrafts || apiData.data || apiData.results || [];
    
//     if (flights.length === 0) {
//       console.log('No flights data in API response');
//       return { data: [] };
//     }

//     console.log(`📊 Found ${flights.length} flights in API response`);

//     const transformedFlights = flights.map((flight, index) => {
//       // Calculate price based on real data
//       const totalPrice = flight.price?.total || 
//                         flight.quote_amount || 
//                         flight.cost ||
//                         flight.price ||
//                         calculateDynamicPrice(flight, passengers);

//       // Get aircraft information
//       const aircraft = flight.aircraft || flight.aircraft_details || {};
//       const operator = flight.operator || flight.operator_details || {};

//       return {
//         id: flight.id || `real-flight-${index}-${Date.now()}`,
//         type: 'flight-offer',
//         source: 'AVIAPAGES_REAL',
//         lastTicketingDate: new Date().toISOString().split('T')[0],
//         numberOfBookableSeats: flight.available_seats || passengers,
        
//         price: {
//           currency: flight.price?.currency || 'USD',
//           total: totalPrice,
//           base: Math.round(totalPrice * 0.7),
//           taxes: Math.round(totalPrice * 0.3)
//         },
        
//         itineraries: [
//           {
//             duration: formatFlightDuration(flight.duration_minutes),
//             segments: [
//               {
//                 departure: {
//                   iataCode: origin,
//                   at: flight.departure_time || generateFlightTime(8, 20),
//                   terminal: flight.departure_terminal || '1'
//                 },
//                 arrival: {
//                   iataCode: destination,
//                   at: flight.arrival_time || generateArrivalTime(flight.departure_time, origin, destination),
//                   terminal: flight.arrival_terminal || '1'
//                 },
//                 carrierCode: operator.code || 'PJ',
//                 number: flight.flight_number || `PJ${Math.floor(100 + Math.random() * 900)}`,
//                 aircraft: {
//                   code: aircraft.model || 'PJT'
//                 },
//                 operating: {
//                   carrierCode: operator.code || 'PJ'
//                 },
//                 duration: formatFlightDuration(flight.duration_minutes),
//                 id: `real-segment-${index}`,
//                 numberOfStops: flight.stops || 0,
//                 blacklistedInEU: false
//               }
//             ]
//           }
//         ],
        
//         pricingOptions: {
//           fareType: ['PUBLISHED'],
//           includedCheckedBagsOnly: true
//         },
        
//         validatingAirlineCodes: [operator.code || 'PJ'],
//         travelerPricings: generateTravelerPricings(totalPrice, passengers),
        
//         // Real aircraft information
//         aircraftInfo: {
//           name: aircraft.name || `${aircraft.manufacturer || 'Private'} ${aircraft.model || 'Jet'}`,
//           manufacturer: aircraft.manufacturer,
//           model: aircraft.model,
//           year: aircraft.year,
//           seats: aircraft.max_passengers || flight.available_seats || passengers,
//           speed: aircraft.cruise_speed ? `${aircraft.cruise_speed} km/h` : '800 km/h',
//           range: aircraft.range ? `${aircraft.range} km` : '4000 km',
//           image: getAircraftImage(aircraft.model),
//           features: getAircraftFeatures(aircraft.max_passengers || passengers),
//           airline: operator.name || 'Private Jet',
//           airlineLogo: operator.logo || getAirlineLogo(operator.code)
//         },

//         // Real availability and booking info
//         realTimeData: {
//           available: flight.available !== undefined ? flight.available : true,
//           instantConfirm: flight.instant_confirmation || true,
//           operator: operator,
//           aircraft: aircraft,
//           actualPrice: flight.price,
//           bookingUrl: flight.booking_url,
//           terms: flight.terms_conditions
//         }
//       };
//     });

//      return { data: transformedFlights };

//   } catch (error) {
//     console.error('Error transforming real API response:', error);
//     return { data: [] };
//   }
// };

// // Supporting Functions
// const formatFlightDuration = (minutes) => {
//   if (!minutes) return 'PT2H0M';
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return `PT${hours}H${mins}M`;
// };

// const calculateDynamicPrice = (flight, passengers) => {
//   const basePrice = 3000;
//   const passengerMultiplier = Math.max(1, passengers / 4);
//   return Math.round(basePrice * passengerMultiplier * (0.8 + Math.random() * 0.4));
// };

// const generateTravelerPricings = (totalPrice, passengers) => {
//   const travelerPricings = [];
//   const pricePerPerson = Math.round(totalPrice / Math.max(1, passengers));
  
//   for (let i = 1; i <= passengers; i++) {
//     travelerPricings.push({
//       travelerId: i.toString(),
//       fareOption: 'STANDARD',
//       travelerType: 'ADULT',
//       price: {
//         currency: 'USD',
//         total: pricePerPerson,
//         base: Math.round(pricePerPerson * 0.7)
//       },
//       fareDetailsBySegment: [
//         {
//           segmentId: `real-segment-${i}`,
//           cabin: 'BUSINESS',
//           fareBasis: 'PRO',
//           class: 'J',
//           includedCheckedBags: {
//             quantity: 2
//           }
//         }
//       ]
//     });
//   }
  
//   return travelerPricings;
// };

// const searchRealAirports = async (query) => {
//   try {
//     const response = await fetch(`${AVIA_PAGE_BASE_URL}/api/v1/airports/search?query=${encodeURIComponent(query)}`, {
//       headers: {
//         'Authorization': `Bearer ${API_TOKEN}`,
//         'Content-Type': 'application/json',
//       },
//     });
// console.log("response --- >>>>",response)
//     if (response.ok) {
//       const data = await response.json();
//       return transformAirportResponse(data);
//     }
//     throw new Error('Airport search failed');
//   } catch (error) {
//     console.error('Real airport search error:', error);
//     return searchAirportsFallback(query);
//   }
// };

// const transformAirportResponse = (apiData) => {
//   console.log("apiData --- >>>>",apiData)

//   if (!apiData.airports) return { data: [] };
  
//   const transformedAirports = apiData.airports.map(airport => ({
//     id: airport.id,
//     displayName: `${airport.name} (${airport.iata_code})`,
//     iataCode: airport.iata_code,
//     city: airport.city,
//     country: airport.country,
//     subType: 'AIRPORT'
//   }));
  
//   return { data: transformedAirports };
// };

// // Generate realistic mock flights (Fallback)
// const generateMockFlights = (origin, destination, departureDate, passengers) => {
//   console.log('🔄 Generating mock flight data...');
  
//   const airlines = [
//     { code: 'EK', name: 'Emirates', logo: 'https://img.freepik.com/free-vector/gradient-abstract-emirates-logo_23-2148442607.jpg' },
//     { code: 'EY', name: 'Etihad Airways', logo: 'https://img.freepik.com/free-vector/etihad-airways-logo_23-2148442608.jpg' },
//     { code: 'QR', name: 'Qatar Airways', logo: 'https://img.freepik.com/free-vector/qatar-airways-logo_23-2148442609.jpg' },
//     { code: 'SV', name: 'Saudia', logo: 'https://img.freepik.com/free-vector/saudia-airlines-logo_23-2148442610.jpg' }
//   ];

//   const aircraftTypes = [
//     { model: 'G650', manufacturer: 'Gulfstream', seats: 14, range: '12,000 km', speed: '956 km/h' },
//     { model: 'Challenger 350', manufacturer: 'Bombardier', seats: 10, range: '5,900 km', speed: '870 km/h' },
//     { model: 'Falcon 8X', manufacturer: 'Dassault', seats: 12, range: '11,900 km', speed: '900 km/h' },
//     { model: 'Phenom 300', manufacturer: 'Embraer', seats: 8, range: '3,650 km', speed: '835 km/h' }
//   ];

//   const mockFlights = [];

//   // Generate 5-8 mock flights
//   const flightCount = 5 + Math.floor(Math.random() * 3);

//   for (let i = 0; i < flightCount; i++) {
//     const airline = airlines[Math.floor(Math.random() * airlines.length)];
//     const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
    
//     // Calculate base price based on route and aircraft
//     let basePrice = calculateBasePrice(origin, destination, aircraft.seats);
    
//     // Add some random variation
//     const finalPrice = Math.round(basePrice * (0.9 + Math.random() * 0.3));
    
//     // Generate flight times
//     const departureTime = generateFlightTime(8, 20); // Between 8 AM and 8 PM
//     const arrivalTime = generateArrivalTime(departureTime, origin, destination);
    
//     const flight = {
//       id: `flight-${i}-${Date.now()}`,
//       type: 'flight-offer',
//       source: 'AVIAPAGES',
      
//       price: {
//         currency: 'USD',
//         total: finalPrice,
//         base: Math.round(finalPrice * 0.7)
//       },
      
//       itineraries: [
//         {
//           duration: calculateFlightDuration(origin, destination),
//           segments: [
//             {
//               departure: {
//                 iataCode: origin,
//                 at: departureTime,
//                 terminal: '1'
//               },
//               arrival: {
//                 iataCode: destination,
//                 at: arrivalTime,
//                 terminal: '1'
//               },
//               carrierCode: airline.code,
//               number: `${airline.code}${Math.floor(1000 + Math.random() * 9000)}`,
//               aircraft: {
//                 code: aircraft.model
//               },
//               operating: {
//                 carrierCode: airline.code
//               },
//               duration: calculateFlightDuration(origin, destination),
//               id: `segment-${i}`,
//               numberOfStops: 0,
//               blacklistedInEU: false
//             }
//           ]
//         }
//       ],
      
//       pricingOptions: {
//         fareType: ['PUBLISHED'],
//         includedCheckedBagsOnly: true
//       },
      
//       validatingAirlineCodes: [airline.code],
//       travelerPricings: [
//         {
//           travelerId: '1',
//           fareOption: 'STANDARD',
//           travelerType: 'ADULT',
//           price: {
//             currency: 'USD',
//             total: finalPrice,
//             base: Math.round(finalPrice * 0.7)
//           },
//           fareDetailsBySegment: [
//             {
//               segmentId: `segment-${i}`,
//               cabin: 'BUSINESS',
//               fareBasis: 'PRO',
//               class: 'J',
//               includedCheckedBags: {
//                 quantity: 2
//               }
//             }
//           ]
//         }
//       ],
      
//       aircraftInfo: {
//         name: `${aircraft.manufacturer} ${aircraft.model}`,
//         manufacturer: aircraft.manufacturer,
//         model: aircraft.model,
//         year: 2015 + Math.floor(Math.random() * 8),
//         seats: aircraft.seats,
//         speed: aircraft.speed,
//         range: aircraft.range,
//         image: getAircraftImage(aircraft.model),
//         features: getAircraftFeatures(aircraft.seats),
//         airline: airline.name,
//         airlineLogo: airline.logo
//       }
//     };
    
//     mockFlights.push(flight);
//   }

//   // Sort by price
//   mockFlights.sort((a, b) => a.price.total - b.price.total);

//   console.log(`✅ Generated ${mockFlights.length} mock flights`);
//   return { data: mockFlights };
// };

// // Calculate base price based on route and aircraft
// const calculateBasePrice = (origin, destination, seats) => {
//   let basePrice = 3000; // Default base price
  
//   // Route-based pricing
//   const routePrices = {
//     'DXB-AUH': 2500,
//     'DXB-DOH': 4000,
//     'DXB-RUH': 3500,
//     'JFK-LAX': 8000,
//     'LHR-CDG': 4500,
//     'default': 5000
//   };
  
//   const route = `${origin}-${destination}`;
//   basePrice = routePrices[route] || routePrices.default;
  
//   // Adjust for aircraft size
//   if (seats <= 6) basePrice *= 0.8;
//   else if (seats <= 10) basePrice *= 1.0;
//   else basePrice *= 1.3;
  
//   return basePrice;
// };

// // Generate departure time
// const generateFlightTime = (startHour, endHour) => {
//   const date = new Date();
//   date.setHours(startHour + Math.floor(Math.random() * (endHour - startHour)));
//   date.setMinutes(Math.floor(Math.random() * 12) * 5); // Multiple of 5 minutes
//   return date.toISOString();
// };

// // Generate arrival time based on departure and route
// const generateArrivalTime = (departureTime, origin, destination) => {
//   const depTime = new Date(departureTime);
//   const duration = getRouteDuration(origin, destination);
  
//   depTime.setHours(depTime.getHours() + duration.hours);
//   depTime.setMinutes(depTime.getMinutes() + duration.minutes);
  
//   return depTime.toISOString();
// };

// // Get route duration in hours and minutes
// const getRouteDuration = (origin, destination) => {
//   const routeDurations = {
//     'DXB-AUH': { hours: 1, minutes: 0 },
//     'DXB-DOH': { hours: 1, minutes: 15 },
//     'DXB-RUH': { hours: 1, minutes: 30 },
//     'JFK-LAX': { hours: 6, minutes: 0 },
//     'LHR-CDG': { hours: 1, minutes: 15 },
//     'default': { hours: 2, minutes: 30 }
//   };
  
//   const route = `${origin}-${destination}`;
//   return routeDurations[route] || routeDurations.default;
// };

// // Calculate flight duration for Amadeus format
// const calculateFlightDuration = (origin, destination) => {
//   const duration = getRouteDuration(origin, destination);
//   return `PT${duration.hours}H${duration.minutes}M`;
// };

// // Get aircraft image
// const getAircraftImage = (model) => {
//   const images = {
//     'G650': 'https://img.freepik.com/free-photo/luxury-private-jet-flying-sky_53876-133587.jpg',
//     'Challenger 350': 'https://img.freepik.com/free-photo/private-jet-airport_53876-101155.jpg',
//     'Falcon 8X': 'https://img.freepik.com/free-photo/airplane-aircraft-travel-trip_53876-30273.jpg',
//     'Phenom 300': 'https://img.freepik.com/free-photo/business-jet-flying-cloudy-sky_53876-133588.jpg'
//   };
  
//   return images[model] || 'https://img.freepik.com/free-photo/luxury-private-jet-flying-sky_53876-133587.jpg';
// };

// // Get aircraft features
// const getAircraftFeatures = (seats) => {
//   const baseFeatures = ['WiFi', 'Entertainment System', 'Luxury Seating', 'Refreshments'];
  
//   if (seats > 8) {
//     baseFeatures.push('Conference Table', 'Private Suite');
//   }
  
//   if (seats > 12) {
//     baseFeatures.push('Shower', 'Full Galley');
//   }
  
//   return baseFeatures;
// };

// // Get airline logo
// const getAirlineLogo = (airlineCode) => {
//   const logos = {
//     'EK': 'https://img.freepik.com/free-vector/gradient-abstract-emirates-logo_23-2148442607.jpg',
//     'EY': 'https://img.freepik.com/free-vector/etihad-airways-logo_23-2148442608.jpg',
//     'QR': 'https://img.freepik.com/free-vector/qatar-airways-logo_23-2148442609.jpg',
//     'SV': 'https://img.freepik.com/free-vector/saudia-airlines-logo_23-2148442610.jpg',
//     'PJ': 'https://img.freepik.com/free-vector/private-jet-logo_23-2148442611.jpg'
//   };
  
//   return logos[airlineCode] || 'https://img.freepik.com/free-vector/private-jet-logo_23-2148442611.jpg';
// };

// // Airport search fallback
// const searchAirportsFallback = async (query) => {
//   const popularAirports = [
//     // North America
//     { id: 'JFK', displayName: 'John F Kennedy International Airport (JFK)', iataCode: 'JFK', city: 'New York', country: 'United States', subType: 'AIRPORT' },
//     { id: 'LAX', displayName: 'Los Angeles International Airport (LAX)', iataCode: 'LAX', city: 'Los Angeles', country: 'United States', subType: 'AIRPORT' },
//     { id: 'ORD', displayName: "Chicago O'Hare International Airport (ORD)", iataCode: 'ORD', city: 'Chicago', country: 'United States', subType: 'AIRPORT' },
//     { id: 'YYZ', displayName: 'Toronto Pearson International Airport (YYZ)', iataCode: 'YYZ', city: 'Toronto', country: 'Canada', subType: 'AIRPORT' },
    
//     // Middle East
//     { id: 'DXB', displayName: 'Dubai International Airport (DXB)', iataCode: 'DXB', city: 'Dubai', country: 'United Arab Emirates', subType: 'AIRPORT' },
//     { id: 'AUH', displayName: 'Abu Dhabi International Airport (AUH)', iataCode: 'AUH', city: 'Abu Dhabi', country: 'United Arab Emirates', subType: 'AIRPORT' },
//     { id: 'DOH', displayName: 'Hamad International Airport (DOH)', iataCode: 'DOH', city: 'Doha', country: 'Qatar', subType: 'AIRPORT' },
//     { id: 'RUH', displayName: 'King Khalid International Airport (RUH)', iataCode: 'RUH', city: 'Riyadh', country: 'Saudi Arabia', subType: 'AIRPORT' },
    
//     // Europe
//     { id: 'LHR', displayName: 'Heathrow Airport (LHR)', iataCode: 'LHR', city: 'London', country: 'United Kingdom', subType: 'AIRPORT' },
//     { id: 'CDG', displayName: 'Charles de Gaulle Airport (CDG)', iataCode: 'CDG', city: 'Paris', country: 'France', subType: 'AIRPORT' },
//     { id: 'FRA', displayName: 'Frankfurt Airport (FRA)', iataCode: 'FRA', city: 'Frankfurt', country: 'Germany', subType: 'AIRPORT' },
//     { id: 'AMS', displayName: 'Amsterdam Schiphol Airport (AMS)', iataCode: 'AMS', city: 'Amsterdam', country: 'Netherlands', subType: 'AIRPORT' },
    
//     // Asia
//     { id: 'DEL', displayName: 'Indira Gandhi International Airport (DEL)', iataCode: 'DEL', city: 'Delhi', country: 'India', subType: 'AIRPORT' },
//     { id: 'BOM', displayName: 'Chhatrapati Shivaji Maharaj International Airport (BOM)', iataCode: 'BOM', city: 'Mumbai', country: 'India', subType: 'AIRPORT' },
//     { id: 'SIN', displayName: 'Changi Airport (SIN)', iataCode: 'SIN', city: 'Singapore', country: 'Singapore', subType: 'AIRPORT' },
//     { id: 'BKK', displayName: 'Suvarnabhumi Airport (BKK)', iataCode: 'BKK', city: 'Bangkok', country: 'Thailand', subType: 'AIRPORT' },
//   ];

//   if (!query || query.length < 2) {
//     return { data: [] };
//   }

//   const filteredAirports = popularAirports.filter(airport => 
//     airport?.city?.toLowerCase().includes(query.toLowerCase()) ||
//     airport.iataCode.toLowerCase().includes(query.toLowerCase()) ||
//     airport.displayName.toLowerCase().includes(query.toLowerCase()) ||
//     airport.country.toLowerCase().includes(query.toLowerCase())
//   );

//   return { data: filteredAirports };
// };

// // Main Service Export
// export const AviapagesFlightService = {
//   // Search flights using REAL Aviapages API
//   searchFlights: async (origin, destination, departureDate, returnDate, passengers) => {
//     try {
  
//       // पहले API token verify करें
//       const isTokenValid = await verifyApiToken();
//       if (!isTokenValid) {
//         console.log('⚠️ Using mock data due to invalid token');
//         return generateMockFlights(origin, destination, departureDate, passengers);
//       }

//       // Real API call करें
//       const realFlights = await fetchRealAviapagesFlights(origin, destination, departureDate, returnDate, passengers);
      
//       if (realFlights.data && realFlights.data.length > 0) {
//         console.log(`✅ Found ${realFlights.data.length} real flights`);
//         return realFlights;
//       } else {
//         console.log('⚠️ No real flights found, using mock data');
//         return generateMockFlights(origin, destination, departureDate, passengers);
//       }

//     } catch (error) {
//       console.error('❌ Error in flight search:', error);
//       return generateMockFlights(origin, destination, departureDate, passengers);
//     }
//   },

//   // Search airports - REAL API
//   searchAirports: async (query) => {
//     try {
//       // const isTokenValid = await verifyApiToken();
//       // if (!isTokenValid) {
//       //   return await searchAirportsFallback(query);
//       // }
//        searchAirportsFallback(query);

//       return await searchRealAirports(query);
//     } catch (error) {
//        return await searchAirportsFallback(query);
//     }
//   },

//   // Get aircraft details
//   getAircraftDetails: async (aircraftId) => {
//     try {
//       const response = await fetch(`${AVIA_PAGE_BASE_URL}/api/v1/aircraft/${aircraftId}`, {
//         headers: {
//           'Authorization': `Bearer ${API_TOKEN}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to fetch aircraft details');
//     } catch (error) {
//       console.error('Error fetching aircraft details:', error);
//       return null;
//     }
//   },

//   // Test API connection
//   testApiConnection: async () => {
//     return await verifyApiToken();
//   }
// };

// // For backward compatibility
// export const FlightService = AviapagesFlightService;

// export default AviapagesFlightService;


// AviapagesFlightService.js
// AviapagesFlightService.js
// const AVIA_PAGE_BASE_URL = 'https://api.aviapages.com';
// const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';
// const SERVICE_FEE_PERCENTAGE = 10; // 10% service fee

// // API Token Verification Function
// const verifyApiToken = async () => {
//   try {
//     console.log('🔐 Verifying API token...');
    
//     // Try different authentication endpoints
//     const authEndpoints = [
//       `${AVIA_PAGE_BASE_URL}/api/v1/auth/verify`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/auth/check`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/profile`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/health`
//     ];

//     for (const endpoint of authEndpoints) {
//       try {
//         const response = await fetch(endpoint, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${API_TOKEN}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.ok) {
//           console.log('✅ API Token is valid');
//           return true;
//         }
//       } catch (error) {
//         console.log(`❌ Endpoint ${endpoint} failed:`, error.message);
//         continue;
//       }
//     }

//     console.log('❌ All authentication endpoints failed');
//     return false;
//   } catch (error) {
//     console.error('❌ Token verification error:', error);
//     return false;
//   }
// };

// // Real API Call Function
// const fetchRealAviapagesFlights = async (origin, destination, departureDate, returnDate, passengers) => {
//   try {
//     console.log('🚀 Fetching REAL flights from Aviapages...');

//     // Aviapages API के according parameters
//     const requestData = {
//       departure_airport: origin,
//       arrival_airport: destination,
//       departure_date: departureDate,
//       passengers: parseInt(passengers) || 1,
//       trip_type: returnDate ? 'round_trip' : 'one_way',
//       ...(returnDate && { return_date: returnDate })
//     };

//     console.log('📤 API Request:', requestData);

//     // Try different flight search endpoints
//     const flightEndpoints = [
//       `${AVIA_PAGE_BASE_URL}/api/v1/charter/flights/search`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/flights/search`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/aircraft/search`,
//       `${AVIA_PAGE_BASE_URL}/api/charter/flights`
//     ];

//     let lastError = null;

//     for (const endpoint of flightEndpoints) {
//       try {
//         console.log(`🔧 Trying endpoint: ${endpoint}`);
        
//         const response = await fetch(endpoint, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${API_TOKEN}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//           },
//           body: JSON.stringify(requestData)
//         });

//         console.log('📥 API Response Status:', response);

//         if (response.ok) {
//           const apiData = await response.json();
            
//           // Transform Aviapages format to our app format
//           return transformRealAviapagesResponse(apiData, origin, destination, passengers);
//         } else {
//           const errorText = await response.text();
//           console.log(`❌ Endpoint ${endpoint} failed: ${response.status} - ${errorText}`);
//           lastError = new Error(`API Error: ${response.status} - ${errorText}`);
//         }
//       } catch (error) {
//         console.log(`❌ Endpoint ${endpoint} error:`, error.message);
//         lastError = error;
//         continue;
//       }
//     }

//     throw lastError || new Error('All flight search endpoints failed');

//   } catch (error) {
//     console.error('❌ Real API call failed:', error);
//     throw error;
//   }
// };

// // Real API Response Transformer
// const transformRealAviapagesResponse = (apiData, origin, destination, passengers) => {
//   try {
//     // Check different possible response formats
//     const flights = apiData.flights || apiData.aircrafts || apiData.data || apiData.results || [];
    
//     if (flights.length === 0) {
//       console.log('No flights data in API response');
//       return { data: [] };
//     }

//     console.log(`📊 Found ${flights.length} flights in API response`);

//     const transformedFlights = flights.map((flight, index) => {
//       // Calculate price based on real data
//       const basePrice = flight.price?.total || 
//                         flight.quote_amount || 
//                         flight.cost ||
//                         flight.price ||
//                         calculateDynamicPrice(flight, passengers);

//       // Get aircraft information
//       const aircraft = flight.aircraft || flight.aircraft_details || {};
//       const operator = flight.operator || flight.operator_details || {};

//       return {
//         id: flight.id || `real-flight-${index}-${Date.now()}`,
//         type: 'flight-offer',
//         source: 'AVIAPAGES_REAL',
//         lastTicketingDate: new Date().toISOString().split('T')[0],
//         numberOfBookableSeats: flight.available_seats || passengers,
        
//         price: {
//           currency: flight.price?.currency || 'USD',
//           total: basePrice,
//           base: Math.round(basePrice * 0.7),
//           taxes: Math.round(basePrice * 0.3)
//         },
        
//         itineraries: [
//           {
//             duration: formatFlightDuration(flight.duration_minutes),
//             segments: [
//               {
//                 departure: {
//                   iataCode: origin,
//                   at: flight.departure_time || generateFlightTime(8, 20),
//                   terminal: flight.departure_terminal || '1'
//                 },
//                 arrival: {
//                   iataCode: destination,
//                   at: flight.arrival_time || generateArrivalTime(flight.departure_time, origin, destination),
//                   terminal: flight.arrival_terminal || '1'
//                 },
//                 carrierCode: operator.code || 'PJ',
//                 number: flight.flight_number || `PJ${Math.floor(100 + Math.random() * 900)}`,
//                 aircraft: {
//                   code: aircraft.model || 'PJT'
//                 },
//                 operating: {
//                   carrierCode: operator.code || 'PJ'
//                 },
//                 duration: formatFlightDuration(flight.duration_minutes),
//                 id: `real-segment-${index}`,
//                 numberOfStops: flight.stops || 0,
//                 blacklistedInEU: false
//               }
//             ]
//           }
//         ],
        
//         pricingOptions: {
//           fareType: ['PUBLISHED'],
//           includedCheckedBagsOnly: true
//         },
        
//         validatingAirlineCodes: [operator.code || 'PJ'],
//         travelerPricings: generateTravelerPricings(basePrice, passengers),
        
//         // Real aircraft information
//         aircraftInfo: {
//           name: aircraft.name || `${aircraft.manufacturer || 'Private'} ${aircraft.model || 'Jet'}`,
//           manufacturer: aircraft.manufacturer,
//           model: aircraft.model,
//           year: aircraft.year,
//           seats: aircraft.max_passengers || flight.available_seats || passengers,
//           speed: aircraft.cruise_speed ? `${aircraft.cruise_speed} km/h` : '800 km/h',
//           range: aircraft.range ? `${aircraft.range} km` : '4000 km',
//           image: getAircraftImage(aircraft.model),
//           features: getAircraftFeatures(aircraft.max_passengers || passengers),
//           airline: operator.name || 'Private Jet',
//           airlineLogo: operator.logo || getAirlineLogo(operator.code)
//         },

//         // Real availability and booking info
//         realTimeData: {
//           available: flight.available !== undefined ? flight.available : true,
//           instantConfirm: flight.instant_confirmation || true,
//           operator: operator,
//           aircraft: aircraft,
//           actualPrice: flight.price,
//           bookingUrl: flight.booking_url,
//           terms: flight.terms_conditions
//         }
//       };
//     });

//     return { data: transformedFlights };

//   } catch (error) {
//     console.error('Error transforming real API response:', error);
//     return { data: [] };
//   }
// };

// // Add service fee calculation
// const addServiceFeeToFlight = (flight) => {
//   const basePrice = flight.price?.total || 0;
//   const serviceFee = (basePrice * SERVICE_FEE_PERCENTAGE) / 100;
//   const totalWithFee = basePrice + serviceFee;

//   return {
//     ...flight,
//     price: {
//       ...flight.price,
//       total: totalWithFee,
//       base: flight.price?.base || Math.round(totalWithFee * 0.7),
//       taxes: flight.price?.taxes || Math.round(totalWithFee * 0.3),
//       serviceFee: serviceFee
//     },
//     pricing: {
//       baseFare: basePrice,
//       serviceFee: serviceFee,
//       total: totalWithFee,
//       currency: flight.price?.currency || 'USD'
//     }
//   };
// };

// // Generate realistic mock flights (Fallback)
// const generateMockFlights = (origin, destination, departureDate, passengers) => {
//   console.log('🔄 Generating mock flight data...');
  
//   const airlines = [
//     { code: 'EK', name: 'Emirates', logo: 'https://img.freepik.com/free-vector/gradient-abstract-emirates-logo_23-2148442607.jpg' },
//     { code: 'EY', name: 'Etihad Airways', logo: 'https://img.freepik.com/free-vector/etihad-airways-logo_23-2148442608.jpg' },
//     { code: 'QR', name: 'Qatar Airways', logo: 'https://img.freepik.com/free-vector/qatar-airways-logo_23-2148442609.jpg' },
//     { code: 'SV', name: 'Saudia', logo: 'https://img.freepik.com/free-vector/saudia-airlines-logo_23-2148442610.jpg' }
//   ];

//   const aircraftTypes = [
//     { model: 'G650', manufacturer: 'Gulfstream', seats: 14, range: '12,000 km', speed: '956 km/h' },
//     { model: 'Challenger 350', manufacturer: 'Bombardier', seats: 10, range: '5,900 km', speed: '870 km/h' },
//     { model: 'Falcon 8X', manufacturer: 'Dassault', seats: 12, range: '11,900 km', speed: '900 km/h' },
//     { model: 'Phenom 300', manufacturer: 'Embraer', seats: 8, range: '3,650 km', speed: '835 km/h' }
//   ];

//   const mockFlights = [];

//   // Generate 5-8 mock flights
//   const flightCount = 5 + Math.floor(Math.random() * 3);

//   for (let i = 0; i < flightCount; i++) {
//     const airline = airlines[Math.floor(Math.random() * airlines.length)];
//     const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
    
//     // Calculate base price based on route and aircraft
//     let basePrice = calculateBasePrice(origin, destination, aircraft.seats);
    
//     // Add some random variation
//     const finalPrice = Math.round(basePrice * (0.9 + Math.random() * 0.3));
    
//     // Generate flight times
//     const departureTime = generateFlightTime(8, 20); // Between 8 AM and 8 PM
//     const arrivalTime = generateArrivalTime(departureTime, origin, destination);
    
//     const flight = {
//       id: `flight-${i}-${Date.now()}`,
//       type: 'flight-offer',
//       source: 'AVIAPAGES',
      
//       price: {
//         currency: 'USD',
//         total: finalPrice,
//         base: Math.round(finalPrice * 0.7)
//       },
      
//       itineraries: [
//         {
//           duration: calculateFlightDuration(origin, destination),
//           segments: [
//             {
//               departure: {
//                 iataCode: origin,
//                 at: departureTime,
//                 terminal: '1'
//               },
//               arrival: {
//                 iataCode: destination,
//                 at: arrivalTime,
//                 terminal: '1'
//               },
//               carrierCode: airline.code,
//               number: `${airline.code}${Math.floor(1000 + Math.random() * 9000)}`,
//               aircraft: {
//                 code: aircraft.model
//               },
//               operating: {
//                 carrierCode: airline.code
//               },
//               duration: calculateFlightDuration(origin, destination),
//               id: `segment-${i}`,
//               numberOfStops: 0,
//               blacklistedInEU: false
//             }
//           ]
//         }
//       ],
      
//       pricingOptions: {
//         fareType: ['PUBLISHED'],
//         includedCheckedBagsOnly: true
//       },
      
//       validatingAirlineCodes: [airline.code],
//       travelerPricings: [
//         {
//           travelerId: '1',
//           fareOption: 'STANDARD',
//           travelerType: 'ADULT',
//           price: {
//             currency: 'USD',
//             total: finalPrice,
//             base: Math.round(finalPrice * 0.7)
//           },
//           fareDetailsBySegment: [
//             {
//               segmentId: `segment-${i}`,
//               cabin: 'BUSINESS',
//               fareBasis: 'PRO',
//               class: 'J',
//               includedCheckedBags: {
//                 quantity: 2
//               }
//             }
//           ]
//         }
//       ],
      
//       aircraftInfo: {
//         name: `${aircraft.manufacturer} ${aircraft.model}`,
//         manufacturer: aircraft.manufacturer,
//         model: aircraft.model,
//         year: 2015 + Math.floor(Math.random() * 8),
//         seats: aircraft.seats,
//         speed: aircraft.speed,
//         range: aircraft.range,
//         image: getAircraftImage(aircraft.model),
//         features: getAircraftFeatures(aircraft.seats),
//         airline: airline.name,
//         airlineLogo: airline.logo
//       }
//     };
    
//     mockFlights.push(flight);
//   }

//   // Sort by price
//   mockFlights.sort((a, b) => a.price.total - b.price.total);

//   console.log(`✅ Generated ${mockFlights.length} mock flights`);
//   return { data: mockFlights };
// };

// // Enhanced mock flights with service fees
// const generateMockFlightsWithServiceFee = (origin, destination, departureDate, returnDate, passengers) => {
//   const mockFlights = generateMockFlights(origin, destination, departureDate, passengers);
  
//   // Add service fee to each flight
//   const flightsWithFees = mockFlights.data.map(flight => addServiceFeeToFlight(flight));
  
//   return { data: flightsWithFees };
// };

// // Enhance charter data with images and details
// const enhanceCharterData = (charterData) => {
//   const images = generateCharterImages(charterData);
//   const cabinMap = generateCabinMap(charterData);
  
//   return {
//     ...charterData,
//     images: images.slice(0, 5), // Max 5 images
//     cabinMap: cabinMap,
//     amenities: getCharterAmenities(charterData),
//     specifications: getCharterSpecifications(charterData),
//     pricing: addServiceFeeToFlight(charterData)
//   };
// };

// // Generate up to 5 images for each charter
// const generateCharterImages = (charter) => {
//   const aircraftImages = {
//     'G650': [
//       'https://images.unsplash.com/photo-1587019158091-1a103c5dd17f',
//       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
//       'https://images.unsplash.com/photo-1569629743817-70d8db3e496f',
//       'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99',
//       'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6'
//     ],
//     'Challenger 350': [
//       'https://images.unsplash.com/photo-1540452798298-b9a60c1e0b2e',
//       'https://images.unsplash.com/photo-1551784171-81c0a6b5b0a5',
//       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
//       'https://images.unsplash.com/photo-1541337138-e89b2f5b4b8f',
//       'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6'
//     ],
//     'default': [
//       'https://images.unsplash.com/photo-1587019158091-1a103c5dd17f',
//       'https://images.unsplash.com/photo-1540452798298-b9a60c1e0b2e',
//       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
//       'https://images.unsplash.com/photo-1569629743817-70d8db3e496f',
//       'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6'
//     ]
//   };

//   const model = charter.aircraft?.model || charter.model || 'default';
//   return aircraftImages[model] || aircraftImages.default;
// };

// // Generate cabin map image
// const generateCabinMap = (charter) => {
//   const cabinMaps = {
//     'G650': 'https://images.unsplash.com/photo-1569629743817-70d8db3e496f',
//     'Challenger 350': 'https://images.unsplash.com/photo-1541337138-e89b2f5b4b8f',
//     'default': 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6'
//   };

//   const model = charter.aircraft?.model || charter.model || 'default';
//   return cabinMaps[model] || cabinMaps.default;
// };

// // Generate mock charter details
// const generateMockCharterDetails = (charterId) => {
//   const aircraftTypes = {
//     'G650': {
//       name: 'Gulfstream G650',
//       manufacturer: 'Gulfstream',
//       model: 'G650',
//       year: 2022,
//       seats: 14,
//       speed: '956 km/h',
//       range: '12,000 km',
//       features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Conference Table', 'Private Suite', 'Shower', 'Full Galley']
//     },
//     'Challenger 350': {
//       name: 'Bombardier Challenger 350',
//       manufacturer: 'Bombardier',
//       model: 'Challenger 350',
//       year: 2021,
//       seats: 10,
//       speed: '870 km/h',
//       range: '5,900 km',
//       features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Refreshments', 'Conference Table']
//     },
//     'Falcon 8X': {
//       name: 'Dassault Falcon 8X',
//       manufacturer: 'Dassault',
//       model: 'Falcon 8X',
//       year: 2020,
//       seats: 12,
//       speed: '900 km/h',
//       range: '11,900 km',
//       features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Refreshments', 'Conference Table', 'Private Suite']
//     },
//     'default': {
//       name: 'Private Jet',
//       manufacturer: 'Private',
//       model: 'Jet',
//       year: 2021,
//       seats: 8,
//       speed: '800 km/h',
//       range: '4,000 km',
//       features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Refreshments']
//     }
//   };

//   const modelMatch = charterId.match(/G650|Challenger|Falcon/) || ['default'];
//   const model = modelMatch[0];
//   const aircraft = aircraftTypes[model] || aircraftTypes.default;

//   return {
//     id: charterId,
//     ...aircraft,
//     images: generateCharterImages({ model: model }),
//     cabinMap: generateCabinMap({ model: model }),
//     amenities: aircraft.features,
//     specifications: {
//       maxPassengers: aircraft.seats,
//       cruiseSpeed: aircraft.speed,
//       maxRange: aircraft.range,
//       cabinHeight: '1.9m',
//       cabinWidth: '2.2m',
//       cabinLength: '13.5m',
//       baggageCapacity: '5.7 m³'
//     }
//   };
// };

// // Get charter amenities
// const getCharterAmenities = (charterData) => {
//   const baseAmenities = ['WiFi', 'Entertainment System', 'Luxury Seating', 'Refreshments'];
  
//   if (charterData.seats > 8) {
//     baseAmenities.push('Conference Table', 'Private Suite');
//   }
  
//   if (charterData.seats > 12) {
//     baseAmenities.push('Shower', 'Full Galley');
//   }
  
//   return baseAmenities;
// };

// // Get charter specifications
// const getCharterSpecifications = (charterData) => {
//   return {
//     maxPassengers: charterData.seats || charterData.aircraftInfo?.seats || 8,
//     cruiseSpeed: charterData.speed || charterData.aircraftInfo?.speed || '800 km/h',
//     maxRange: charterData.range || charterData.aircraftInfo?.range || '4,000 km',
//     cabinHeight: '1.9m',
//     cabinWidth: '2.2m',
//     cabinLength: '13.5m',
//     baggageCapacity: '5.7 m³'
//   };
// };

// // Supporting Functions
// const formatFlightDuration = (minutes) => {
//   if (!minutes) return 'PT2H0M';
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return `PT${hours}H${mins}M`;
// };

// const calculateDynamicPrice = (flight, passengers) => {
//   const basePrice = 3000;
//   const passengerMultiplier = Math.max(1, passengers / 4);
//   return Math.round(basePrice * passengerMultiplier * (0.8 + Math.random() * 0.4));
// };

// const generateTravelerPricings = (totalPrice, passengers) => {
//   const travelerPricings = [];
//   const pricePerPerson = Math.round(totalPrice / Math.max(1, passengers));
  
//   for (let i = 1; i <= passengers; i++) {
//     travelerPricings.push({
//       travelerId: i.toString(),
//       fareOption: 'STANDARD',
//       travelerType: 'ADULT',
//       price: {
//         currency: 'USD',
//         total: pricePerPerson,
//         base: Math.round(pricePerPerson * 0.7)
//       },
//       fareDetailsBySegment: [
//         {
//           segmentId: `real-segment-${i}`,
//           cabin: 'BUSINESS',
//           fareBasis: 'PRO',
//           class: 'J',
//           includedCheckedBags: {
//             quantity: 2
//           }
//         }
//       ]
//     });
//   }
  
//   return travelerPricings;
// };

// const searchRealAirports = async (query) => {
//   try {
//     const response = await fetch(`${AVIA_PAGE_BASE_URL}/api/v1/airports/search?query=${encodeURIComponent(query)}`, {
//       headers: {
//         'Authorization': `Bearer ${API_TOKEN}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.ok) {
//       const data = await response.json();
//       return transformAirportResponse(data);
//     }
//     throw new Error('Airport search failed');
//   } catch (error) {
//     console.error('Real airport search error:', error);
//     return searchAirportsFallback(query);
//   }
// };

// const transformAirportResponse = (apiData) => {
//   if (!apiData.airports) return { data: [] };
  
//   const transformedAirports = apiData.airports.map(airport => ({
//     id: airport.id,
//     displayName: `${airport.name} (${airport.iata_code})`,
//     iataCode: airport.iata_code,
//     city: airport.city,
//     country: airport.country,
//     subType: 'AIRPORT'
//   }));
  
//   return { data: transformedAirports };
// };

// // Calculate base price based on route and aircraft
// const calculateBasePrice = (origin, destination, seats) => {
//   let basePrice = 3000; // Default base price
  
//   // Route-based pricing
//   const routePrices = {
//     'DXB-AUH': 2500,
//     'DXB-DOH': 4000,
//     'DXB-RUH': 3500,
//     'JFK-LAX': 8000,
//     'LHR-CDG': 4500,
//     'default': 5000
//   };
  
//   const route = `${origin}-${destination}`;
//   basePrice = routePrices[route] || routePrices.default;
  
//   // Adjust for aircraft size
//   if (seats <= 6) basePrice *= 0.8;
//   else if (seats <= 10) basePrice *= 1.0;
//   else basePrice *= 1.3;
  
//   return basePrice;
// };

// // Generate departure time
// const generateFlightTime = (startHour, endHour) => {
//   const date = new Date();
//   date.setHours(startHour + Math.floor(Math.random() * (endHour - startHour)));
//   date.setMinutes(Math.floor(Math.random() * 12) * 5); // Multiple of 5 minutes
//   return date.toISOString();
// };

// // Generate arrival time based on departure and route
// const generateArrivalTime = (departureTime, origin, destination) => {
//   const depTime = new Date(departureTime);
//   const duration = getRouteDuration(origin, destination);
  
//   depTime.setHours(depTime.getHours() + duration.hours);
//   depTime.setMinutes(depTime.getMinutes() + duration.minutes);
  
//   return depTime.toISOString();
// };

// // Get route duration in hours and minutes
// const getRouteDuration = (origin, destination) => {
//   const routeDurations = {
//     'DXB-AUH': { hours: 1, minutes: 0 },
//     'DXB-DOH': { hours: 1, minutes: 15 },
//     'DXB-RUH': { hours: 1, minutes: 30 },
//     'JFK-LAX': { hours: 6, minutes: 0 },
//     'LHR-CDG': { hours: 1, minutes: 15 },
//     'default': { hours: 2, minutes: 30 }
//   };
  
//   const route = `${origin}-${destination}`;
//   return routeDurations[route] || routeDurations.default;
// };

// // Calculate flight duration for Amadeus format
// const calculateFlightDuration = (origin, destination) => {
//   const duration = getRouteDuration(origin, destination);
//   return `PT${duration.hours}H${duration.minutes}M`;
// };

// // Get aircraft image
// const getAircraftImage = (model) => {
//   const images = {
//     'G650': 'https://img.freepik.com/free-photo/luxury-private-jet-flying-sky_53876-133587.jpg',
//     'Challenger 350': 'https://img.freepik.com/free-photo/private-jet-airport_53876-101155.jpg',
//     'Falcon 8X': 'https://img.freepik.com/free-photo/airplane-aircraft-travel-trip_53876-30273.jpg',
//     'Phenom 300': 'https://img.freepik.com/free-photo/business-jet-flying-cloudy-sky_53876-133588.jpg'
//   };
  
//   return images[model] || 'https://img.freepik.com/free-photo/luxury-private-jet-flying-sky_53876-133587.jpg';
// };

// // Get aircraft features
// const getAircraftFeatures = (seats) => {
//   const baseFeatures = ['WiFi', 'Entertainment System', 'Luxury Seating', 'Refreshments'];
  
//   if (seats > 8) {
//     baseFeatures.push('Conference Table', 'Private Suite');
//   }
  
//   if (seats > 12) {
//     baseFeatures.push('Shower', 'Full Galley');
//   }
  
//   return baseFeatures;
// };

// // Get airline logo
// const getAirlineLogo = (airlineCode) => {
//   const logos = {
//     'EK': 'https://img.freepik.com/free-vector/gradient-abstract-emirates-logo_23-2148442607.jpg',
//     'EY': 'https://img.freepik.com/free-vector/etihad-airways-logo_23-2148442608.jpg',
//     'QR': 'https://img.freepik.com/free-vector/qatar-airways-logo_23-2148442609.jpg',
//     'SV': 'https://img.freepik.com/free-vector/saudia-airlines-logo_23-2148442610.jpg',
//     'PJ': 'https://img.freepik.com/free-vector/private-jet-logo_23-2148442611.jpg'
//   };
  
//   return logos[airlineCode] || 'https://img.freepik.com/free-vector/private-jet-logo_23-2148442611.jpg';
// };

// // Airport search fallback
// const searchAirportsFallback = async (query) => {
//   const popularAirports = [
//     // North America
//     { id: 'JFK', displayName: 'John F Kennedy International Airport (JFK)', iataCode: 'JFK', city: 'New York', country: 'United States', subType: 'AIRPORT' },
//     { id: 'LAX', displayName: 'Los Angeles International Airport (LAX)', iataCode: 'LAX', city: 'Los Angeles', country: 'United States', subType: 'AIRPORT' },
//     { id: 'ORD', displayName: "Chicago O'Hare International Airport (ORD)", iataCode: 'ORD', city: 'Chicago', country: 'United States', subType: 'AIRPORT' },
//     { id: 'YYZ', displayName: 'Toronto Pearson International Airport (YYZ)', iataCode: 'YYZ', city: 'Toronto', country: 'Canada', subType: 'AIRPORT' },
    
//     // Middle East
//     { id: 'DXB', displayName: 'Dubai International Airport (DXB)', iataCode: 'DXB', city: 'Dubai', country: 'United Arab Emirates', subType: 'AIRPORT' },
//     { id: 'AUH', displayName: 'Abu Dhabi International Airport (AUH)', iataCode: 'AUH', city: 'Abu Dhabi', country: 'United Arab Emirates', subType: 'AIRPORT' },
//     { id: 'DOH', displayName: 'Hamad International Airport (DOH)', iataCode: 'DOH', city: 'Doha', country: 'Qatar', subType: 'AIRPORT' },
//     { id: 'RUH', displayName: 'King Khalid International Airport (RUH)', iataCode: 'RUH', city: 'Riyadh', country: 'Saudi Arabia', subType: 'AIRPORT' },
    
//     // Europe
//     { id: 'LHR', displayName: 'Heathrow Airport (LHR)', iataCode: 'LHR', city: 'London', country: 'United Kingdom', subType: 'AIRPORT' },
//     { id: 'CDG', displayName: 'Charles de Gaulle Airport (CDG)', iataCode: 'CDG', city: 'Paris', country: 'France', subType: 'AIRPORT' },
//     { id: 'FRA', displayName: 'Frankfurt Airport (FRA)', iataCode: 'FRA', city: 'Frankfurt', country: 'Germany', subType: 'AIRPORT' },
//     { id: 'AMS', displayName: 'Amsterdam Schiphol Airport (AMS)', iataCode: 'AMS', city: 'Amsterdam', country: 'Netherlands', subType: 'AIRPORT' },
    
//     // Asia
//     { id: 'DEL', displayName: 'Indira Gandhi International Airport (DEL)', iataCode: 'DEL', city: 'Delhi', country: 'India', subType: 'AIRPORT' },
//     { id: 'BOM', displayName: 'Chhatrapati Shivaji Maharaj International Airport (BOM)', iataCode: 'BOM', city: 'Mumbai', country: 'India', subType: 'AIRPORT' },
//     { id: 'SIN', displayName: 'Changi Airport (SIN)', iataCode: 'SIN', city: 'Singapore', country: 'Singapore', subType: 'AIRPORT' },
//     { id: 'BKK', displayName: 'Suvarnabhumi Airport (BKK)', iataCode: 'BKK', city: 'Bangkok', country: 'Thailand', subType: 'AIRPORT' },
//   ];

//   if (!query || query.length < 2) {
//     return { data: [] };
//   }

//   const filteredAirports = popularAirports.filter(airport => 
//     airport?.city?.toLowerCase().includes(query.toLowerCase()) ||
//     airport.iataCode.toLowerCase().includes(query.toLowerCase()) ||
//     airport.displayName.toLowerCase().includes(query.toLowerCase()) ||
//     airport.country.toLowerCase().includes(query.toLowerCase())
//   );

//   return { data: filteredAirports };
// };

// // Main Service Export
// export const AviapagesFlightService = {
//   // Search flights using REAL Aviapages API
//   searchFlights: async (origin, destination, departureDate, returnDate, passengers) => {
//     try {
//       // पहले API token verify करें
//       const isTokenValid = await verifyApiToken();
//       if (!isTokenValid) {
//         console.log('⚠️ Using mock data due to invalid token');
//         return generateMockFlightsWithServiceFee(origin, destination, departureDate, returnDate, passengers);
//       }

//       // Real API call करें
//       const realFlights = await fetchRealAviapagesFlights(origin, destination, departureDate, returnDate, passengers);
      
//       if (realFlights.data && realFlights.data.length > 0) {
//         console.log(`✅ Found ${realFlights.data.length} real flights`);
//         // Add service fee to real flights
//         const flightsWithFees = realFlights.data.map(flight => addServiceFeeToFlight(flight));
//         return { data: flightsWithFees };
//       } else {
//         console.log('⚠️ No real flights found, using mock data');
//         return generateMockFlightsWithServiceFee(origin, destination, departureDate, returnDate, passengers);
//       }

//     } catch (error) {
//       console.error('❌ Error in flight search:', error);
//       return generateMockFlightsWithServiceFee(origin, destination, departureDate, returnDate, passengers);
//     }
//   },

//   // Get charter details with images
//   getCharterDetails: async (charterId) => {
//     try {
//       // Try to get real charter details
//       const endpoints = [
//         `${AVIA_PAGE_BASE_URL}/api/v1/charter/${charterId}`,
//         `${AVIA_PAGE_BASE_URL}/api/v1/aircraft/${charterId}`,
//       ];

//       for (const endpoint of endpoints) {
//         try {
//           const response = await fetch(endpoint, {
//             headers: {
//               'Authorization': `Bearer ${API_TOKEN}`,
//               'Content-Type': 'application/json',
//             },
//           });

//           if (response.ok) {
//             const data = await response.json();
//             return enhanceCharterData(data);
//           }
//         } catch (error) {
//           continue;
//         }
//       }

//       // Fallback to mock data
//       return generateMockCharterDetails(charterId);
//     } catch (error) {
//       console.error('Error getting charter details:', error);
//       return generateMockCharterDetails(charterId);
//     }
//   },

//   // Search airports - REAL API
//   searchAirports: async (query) => {
//     try {
//       return await searchRealAirports(query);
//     } catch (error) {
//       console.error('Real airport search error, using fallback:', error);
//       return await searchAirportsFallback(query);
//     }
//   },

//   // Test API connection
//   testApiConnection: async () => {
//     return await verifyApiToken();
//   }
// };

// // For backward compatibility
// export const FlightService = AviapagesFlightService;

// export default AviapagesFlightService;

// const AVIA_PAGE_BASE_URL = 'https://api.aviapages.com';
// const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';
// const SERVICE_FEE_PERCENTAGE = 10; // 10% service fee

// // API Token Verification Function
// const verifyApiToken = async () => {
//   try {
//     console.log('🔐 Verifying API token...');
    
//     // Try different authentication endpoints
//     const authEndpoints = [
//       `${AVIA_PAGE_BASE_URL}/api/v1/auth/verify`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/auth/check`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/profile`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/health`
//     ];

//     for (const endpoint of authEndpoints) {
//       try {
//         const response = await fetch(endpoint, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${API_TOKEN}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.ok) {
//           console.log('✅ API Token is valid');
//           return true;
//         }
//       } catch (error) {
//         console.log(`❌ Endpoint ${endpoint} failed:`, error.message);
//         continue;
//       }
//     }

//     console.log('❌ All authentication endpoints failed');
//     return false;
//   } catch (error) {
//     console.error('❌ Token verification error:', error);
//     return false;
//   }
// };

// // Add service fee calculation
// const addServiceFeeToFlight = (flight) => {
//   const basePrice = flight.price?.total || 0;
//   const serviceFee = Math.round((basePrice * SERVICE_FEE_PERCENTAGE) / 100);
//   const totalWithFee = basePrice + serviceFee;

//   return {
//     ...flight,
//     price: {
//       ...flight.price,
//       total: totalWithFee,
//       base: Math.round(basePrice),
//       serviceFee: serviceFee
//     },
//     pricing: {
//       baseFare: basePrice,
//       serviceFee: serviceFee,
//       total: totalWithFee,
//       currency: flight.price?.currency || 'USD'
//     }
//   };
// };

// // Generate realistic mock flights (Fallback)
// const generateMockFlights = (origin, destination, departureDate, passengers) => {
//   console.log('🔄 Generating mock flight data...');
  
//   const airlines = [
//     { code: 'PJ', name: 'Private Jet Charter', logo: 'https://img.freepik.com/free-vector/private-jet-logo_23-2148442611.jpg' },
//     { code: 'EJ', name: 'Executive Jets', logo: 'https://img.freepik.com/free-vector/jet-aircraft-logo_23-2148442612.jpg' },
//     { code: 'LX', name: 'Luxury Jets', logo: 'https://img.freepik.com/free-vector/premium-jet-logo_23-2148442613.jpg' },
//     { code: 'GJ', name: 'Global Jets', logo: 'https://img.freepik.com/free-vector/global-jet-logo_23-2148442614.jpg' }
//   ];

//   const aircraftTypes = [
//     { 
//       model: 'G650', 
//       manufacturer: 'Gulfstream', 
//       seats: 14, 
//       range: '12,000 km', 
//       speed: '956 km/h',
//       images: [
//    "https://md.aviapages.com/media/thmb/2025/02/25/q90/g1920/crcenter/FHFN.png.webp"  ,
//  "https://md.aviapages.com/media/2025/02/25/DSC02446-scaled.jpg",
//  "https://md.aviapages.com/media/2025/11/26/OM-NEX4-1024x768.jpg" ,
//  "https://md.aviapages.com/media/2025/11/26/OM-NEX3-768x1024.jpg",
//       ]
//     },
//     { 
//       model: 'Challenger 350', 
//       manufacturer: 'Bombardier', 
//       seats: 10, 
//       range: '5,900 km', 
//       speed: '870 km/h',
//       images: [
//        "https://md.aviapages.com/media/2025/02/25/DSC02446-scaled.jpg",
//  "https://md.aviapages.com/media/2025/11/26/OM-NEX4-1024x768.jpg" ,
//       ]
//     },
//     { 
//       model: 'Falcon 8X', 
//       manufacturer: 'Dassault', 
//       seats: 12, 
//       range: '11,900 km', 
//       speed: '900 km/h',
//       images: [
//  "https://md.aviapages.com/media/2025/02/25/DSC02446-scaled.jpg",
//  "https://md.aviapages.com/media/2025/11/26/OM-NEX4-1024x768.jpg" ,
//       ]
//     },
//     { 
//       model: 'Phenom 300', 
//       manufacturer: 'Embraer', 
//       seats: 8, 
//       range: '3,650 km', 
//       speed: '835 km/h',
//       images: [
//  "https://md.aviapages.com/media/2025/02/25/DSC02446-scaled.jpg",
//  "https://md.aviapages.com/media/2025/11/26/OM-NEX4-1024x768.jpg" ,
//  "https://md.aviapages.com/media/2025/11/26/OM-NEX3-768x1024.jpg",
//        ]
//     }
//   ];

//   const mockFlights = [];

//   // Generate 5-8 mock flights
//   const flightCount = 5 + Math.floor(Math.random() * 3);

//   for (let i = 0; i < flightCount; i++) {
//     const airline = airlines[Math.floor(Math.random() * airlines.length)];
//     const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
    
//     // Calculate base price based on route and aircraft
//     let basePrice = calculateBasePrice(origin, destination, aircraft.seats);
    
//     // Add some random variation
//     const finalPrice = Math.round(basePrice * (0.9 + Math.random() * 0.3));
    
//     // Generate flight times
//     const departureTime = generateFlightTime(8, 20); // Between 8 AM and 8 PM
//     const arrivalTime = generateArrivalTime(departureTime, origin, destination);
    
//     const flight = {
//       id: `flight-${i}-${Date.now()}`,
//       type: 'charter-flight',
//       source: 'AVIAPAGES',
      
//       price: {
//         currency: 'USD',
//         total: finalPrice,
//         base: Math.round(finalPrice)
//       },
      
//       itineraries: [
//         {
//           duration: calculateFlightDuration(origin, destination),
//           segments: [
//             {
//               departure: {
//                 iataCode: origin,
//                 at: departureTime,
//                 terminal: 'Private'
//               },
//               arrival: {
//                 iataCode: destination,
//                 at: arrivalTime,
//                 terminal: 'Private'
//               },
//               carrierCode: airline.code,
//               number: `${airline.code}${Math.floor(1000 + Math.random() * 9000)}`,
//               aircraft: {
//                 code: aircraft.model
//               },
//               operating: {
//                 carrierCode: airline.code
//               },
//               duration: calculateFlightDuration(origin, destination),
//               id: `segment-${i}`,
//               numberOfStops: 0,
//               blacklistedInEU: false
//             }
//           ]
//         }
//       ],
      
//       aircraftInfo: {
//         id: `aircraft-${i}-${Date.now()}`,
//         name: `${aircraft.manufacturer} ${aircraft.model}`,
//         manufacturer: aircraft.manufacturer,
//         model: aircraft.model,
//         year: 2015 + Math.floor(Math.random() * 8),
//         seats: aircraft.seats,
//         speed: aircraft.speed,
//         range: aircraft.range,
//         images: aircraft.images,
//         features: getAircraftFeatures(aircraft.seats),
//         airline: airline.name,
//         airlineLogo: airline.logo,
//         hourlyRate: Math.round(finalPrice / 2),
//         category: aircraft.seats > 10 ? 'Heavy Jet' : 'Medium Jet'
//       },
      
//       pricingOptions: {
//         fareType: ['CHARTER'],
//         includedCheckedBagsOnly: true
//       },
      
//       validatingAirlineCodes: [airline.code]
//     };
    
//     // Add service fee
//     const flightWithFee = addServiceFeeToFlight(flight);
//     mockFlights.push(flightWithFee);
//   }

//   // Sort by price
//   mockFlights.sort((a, b) => a.pricing.total - b.pricing.total);

//   console.log(`✅ Generated ${mockFlights.length} mock flights`);
//   return { data: mockFlights };
// };

// // Calculate base price based on route and aircraft
// const calculateBasePrice = (origin, destination, seats) => {
//   let basePrice = 5000; // Default base price
  
//   // Route-based pricing
//   const routePrices = {
//     'DXB-AUH': 4500,
//     'DXB-DOH': 6500,
//     'DXB-RUH': 5500,
//     'JFK-LAX': 15000,
//     'LHR-CDG': 8500,
//     'LHR-DXB': 18000,
//     'JFK-LHR': 20000,
//     'default': 8000
//   };
  
//   const route = `${origin}-${destination}`;
//   basePrice = routePrices[route] || routePrices.default;
  
//   // Adjust for aircraft size
//   if (seats <= 6) basePrice *= 0.7;
//   else if (seats <= 10) basePrice *= 1.0;
//   else if (seats <= 14) basePrice *= 1.5;
//   else basePrice *= 2.0;
  
//   return Math.round(basePrice);
// };

// // Generate departure time
// const generateFlightTime = (startHour, endHour) => {
//   const date = new Date();
//   date.setDate(date.getDate() + Math.floor(Math.random() * 7) + 1); // Next 1-7 days
//   date.setHours(startHour + Math.floor(Math.random() * (endHour - startHour)));
//   date.setMinutes(Math.floor(Math.random() * 12) * 5); // Multiple of 5 minutes
//   return date.toISOString();
// };

// // Generate arrival time based on departure and route
// const generateArrivalTime = (departureTime, origin, destination) => {
//   const depTime = new Date(departureTime);
//   const duration = getRouteDuration(origin, destination);
  
//   depTime.setHours(depTime.getHours() + duration.hours);
//   depTime.setMinutes(depTime.getMinutes() + duration.minutes);
  
//   return depTime.toISOString();
// };

// // Get route duration in hours and minutes
// const getRouteDuration = (origin, destination) => {
//   const routeDurations = {
//     'DXB-AUH': { hours: 1, minutes: 0 },
//     'DXB-DOH': { hours: 1, minutes: 15 },
//     'DXB-RUH': { hours: 1, minutes: 30 },
//     'JFK-LAX': { hours: 6, minutes: 0 },
//     'LHR-CDG': { hours: 1, minutes: 15 },
//     'LHR-DXB': { hours: 6, minutes: 30 },
//     'JFK-LHR': { hours: 7, minutes: 0 },
//     'default': { hours: 2, minutes: 30 }
//   };
  
//   const route = `${origin}-${destination}`;
//   return routeDurations[route] || routeDurations.default;
// };

// // Calculate flight duration for Amadeus format
// const calculateFlightDuration = (origin, destination) => {
//   const duration = getRouteDuration(origin, destination);
//   return `PT${duration.hours}H${duration.minutes}M`;
// };

// // Get aircraft features
// const getAircraftFeatures = (seats) => {
//   const baseFeatures = ['WiFi', 'Entertainment System', 'Luxury Seating', 'Refreshments'];
  
//   if (seats > 8) {
//     baseFeatures.push('Conference Table', 'Private Suite');
//   }
  
//   if (seats > 12) {
//     baseFeatures.push('Shower', 'Full Galley', 'Private Bedroom');
//   }
  
//   return baseFeatures;
// };

// // Generate mock charter details with images
// const generateMockCharterDetails = (charterId) => {
//   const aircraftTypes = {
//     'G650': {
//       id: charterId,
//       name: 'Gulfstream G650',
//       manufacturer: 'Gulfstream',
//       model: 'G650',
//       year: 2022,
//       seats: 14,
//       speed: '956 km/h',
//       range: '12,000 km',
//       category: 'Heavy Jet',
//       hourlyRate: 8000,
//       images: [
//         "https://md.aviapages.com/media/thmb/2025/02/04/q90/g1920/crcenter/image2.jpg.webp",
//         'https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_1_1600x1200.jpg',
//         "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_2_1600x1200.jpg" ,
//         "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Aft_Cabin_3_1600x1200.jpg" ,
//         "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Aft_Cabin_2_1600x1200.jpg"
//        ],
//       features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Conference Table', 'Private Suite', 'Shower', 'Full Galley', 'Private Bedroom']
//     },
//     'Challenger 350': {
//       id: charterId,
//       name: 'Bombardier Challenger 350',
//       manufacturer: 'Bombardier',
//       model: 'Challenger 350',
//       year: 2021,
//       seats: 10,
//       speed: '870 km/h',
//       range: '5,900 km',
//       category: 'Medium Jet',
//       hourlyRate: 6000,
//       images: [
//      "https://md.aviapages.com/media/thmb/2025/11/26/q90/g640x384/crcenter/upscale/B737-800-OM-HEX-Central-Cabin-1024x480.jpeg.webp",
//       'https://md.aviapages.com/media/2025/11/26/B737-800-OM-GEX-Front-Cabin-1024x479.jpeg',     // cabin
//       'https://md.aviapages.com/media/2025/11/26/B737-800-OM-GEX-Rear-Cabin-1024x480.jpeg', // luxury seats
//       'https://md.aviapages.com/media/2025/11/26/B737-800-OM-HEX-Central-Cabin-1024x480.jpeg'  // jet inside

//        ],
//       features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Conference Table', 'Refreshments', 'Entertainment System']
//     },
//     'Falcon 8X': {
//       id: charterId,
//       name: 'Dassault Falcon 8X',
//       manufacturer: 'Dassault',
//       model: 'Falcon 8X',
//       year: 2020,
//       seats: 12,
//       speed: '900 km/h',
//       range: '11,900 km',
//       category: 'Heavy Jet',
//       hourlyRate: 7500,
//       images: [
//    "https://md.aviapages.com/media/thmb/2025/05/13/q90/g1920/crcenter/Dassault_Falcon_7X_sn096_Exterior_1_1600x1200_0.jpg.webp",
//    "https://md.aviapages.com/media/2025/02/04/image22.jpg" ,
//    "https://md.aviapages.com/media/2025/02/04/image21.jpg" ,
//    "https://md.aviapages.com/media/2025/02/04/image30.jpg" ,
//    "https://md.aviapages.com/media/2025/02/04/image26.jpg"
//        ],
//       features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Conference Table', 'Private Suite', 'Refreshments']
//     },
//     'default': {
//       id: charterId,
//       name: 'Private Jet',
//       manufacturer: 'Private',
//       model: 'Jet',
//       year: 2021,
//       seats: 8,
//       speed: '800 km/h',
//       range: '4,000 km',
//       category: 'Light Jet',
//       hourlyRate: 5000,
//       images: [
//  "https://md.aviapages.com/media/thmb/2025/02/25/q90/g1920/crcenter/FHFN.png.webp"  ,
//  "https://md.aviapages.com/media/2025/02/25/DSC02446-scaled.jpg",
//  "https://md.aviapages.com/media/2025/11/26/OM-NEX4-1024x768.jpg" ,
//  "https://md.aviapages.com/media/2025/11/26/OM-NEX3-768x1024.jpg",
 

// ],
//       features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Refreshments']
//     }
//   };

//   // Extract model from charterId
//   let model = 'default';
//   if (charterId.includes('G650')) model = 'G650';
//   else if (charterId.includes('Challenger')) model = 'Challenger 350';
//   else if (charterId.includes('Falcon')) model = 'Falcon 8X';
  
//   const aircraft = aircraftTypes[model] || aircraftTypes.default;
  
//   // Calculate pricing with service fee
//   const basePrice = aircraft.hourlyRate * 2; // 2 hours minimum
//   const serviceFee = Math.round((basePrice * SERVICE_FEE_PERCENTAGE) / 100);
//   const totalPrice = basePrice + serviceFee;

//   return {
//     ...aircraft,
//     pricing: {
//       baseFare: basePrice,
//       serviceFee: serviceFee,
//       total: totalPrice,
//       currency: 'USD'
//     },
//     price: {
//       currency: 'USD',
//       total: totalPrice,
//       base: basePrice
//     },
//     specifications: {
//       maxPassengers: aircraft.seats,
//       cruiseSpeed: aircraft.speed,
//       maxRange: aircraft.range,
//       cabinHeight: '1.9m',
//       cabinWidth: '2.2m',
//       cabinLength: '13.5m',
//       baggageCapacity: '5.7 m³'
//     },
//     amenities: aircraft.features
//   };
// };

// // Real API Call Function
// const fetchRealAviapagesFlights = async (origin, destination, departureDate, returnDate, passengers) => {
//   try {
//     console.log('🚀 Fetching REAL flights from Aviapages...');

//     // Try different flight search endpoints
//     const flightEndpoints = [
//       `${AVIA_PAGE_BASE_URL}/api/v1/charter/flights/search`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/flights/search`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/aircraft/search`,
//       `${AVIA_PAGE_BASE_URL}/api/charter/flights`
//     ];

//     let lastError = null;

//     for (const endpoint of flightEndpoints) {
//       try {
//         console.log(`🔧 Trying endpoint: ${endpoint}`);
        
//         const response = await fetch(endpoint, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${API_TOKEN}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//           },
//           body: JSON.stringify({
//             departure_airport: origin,
//             arrival_airport: destination,
//             departure_date: departureDate,
//             passengers: parseInt(passengers) || 1,
//             ...(returnDate && { return_date: returnDate, trip_type: 'round_trip' })
//           })
//         });

//         console.log('📥 API Response Status:', response.status);

//         if (response.ok) {
//           const apiData = await response.json();
//           console.log('📊 API Response Data:', apiData);
          
//           // Transform and add service fee
//           if (apiData.data && apiData.data.length > 0) {
//             const flightsWithFees = apiData.data.map(flight => addServiceFeeToFlight(flight));
//             return { data: flightsWithFees };
//           }
//         }
//       } catch (error) {
//         console.log(`❌ Endpoint ${endpoint} error:`, error.message);
//         lastError = error;
//         continue;
//       }
//     }

//     throw lastError || new Error('All flight search endpoints failed');

//   } catch (error) {
//     console.error('❌ Real API call failed:', error);
//     throw error;
//   }
// };

// // Airport search fallback
// const searchAirportsFallback = async (query) => {
//   const popularAirports = [
//     // Middle East
//     { id: 'DXB', displayName: 'Dubai International Airport (DXB)', iataCode: 'DXB', city: 'Dubai', country: 'United Arab Emirates', subType: 'AIRPORT' },
//     { id: 'AUH', displayName: 'Abu Dhabi International Airport (AUH)', iataCode: 'AUH', city: 'Abu Dhabi', country: 'United Arab Emirates', subType: 'AIRPORT' },
//     { id: 'DOH', displayName: 'Hamad International Airport (DOH)', iataCode: 'DOH', city: 'Doha', country: 'Qatar', subType: 'AIRPORT' },
//     { id: 'RUH', displayName: 'King Khalid International Airport (RUH)', iataCode: 'RUH', city: 'Riyadh', country: 'Saudi Arabia', subType: 'AIRPORT' },
    
//     // North America
//     { id: 'JFK', displayName: 'John F Kennedy International Airport (JFK)', iataCode: 'JFK', city: 'New York', country: 'United States', subType: 'AIRPORT' },
//     { id: 'LAX', displayName: 'Los Angeles International Airport (LAX)', iataCode: 'LAX', city: 'Los Angeles', country: 'United States', subType: 'AIRPORT' },
    
//     // Europe
//     { id: 'LHR', displayName: 'Heathrow Airport (LHR)', iataCode: 'LHR', city: 'London', country: 'United Kingdom', subType: 'AIRPORT' },
//     { id: 'CDG', displayName: 'Charles de Gaulle Airport (CDG)', iataCode: 'CDG', city: 'Paris', country: 'France', subType: 'AIRPORT' },
//   ];

//   if (!query || query.length < 2) {
//     return { data: [] };
//   }

//   const filteredAirports = popularAirports.filter(airport => 
//     airport?.city?.toLowerCase().includes(query.toLowerCase()) ||
//     airport.iataCode.toLowerCase().includes(query.toLowerCase()) ||
//     airport.displayName.toLowerCase().includes(query.toLowerCase()) ||
//     airport.country.toLowerCase().includes(query.toLowerCase())
//   );

//   return { data: filteredAirports };
// };

// // Main Service Export
// export const AviapagesFlightService = {
//   // Search flights using REAL Aviapages API
//   searchFlights: async (origin, destination, departureDate, returnDate, passengers) => {
//     try {
//       // First verify API token
//       const isTokenValid = await verifyApiToken();
//       if (!isTokenValid) {
//         console.log('⚠️ Using mock data due to invalid token');
//         return generateMockFlights(origin, destination, departureDate, passengers);
//       }

//       // Try real API call
//       const realFlights = await fetchRealAviapagesFlights(origin, destination, departureDate, returnDate, passengers);
      
//       if (realFlights.data && realFlights.data.length > 0) {
//         console.log(`✅ Found ${realFlights.data.length} real flights`);
//         return realFlights;
//       } else {
//         console.log('⚠️ No real flights found, using mock data');
//         return generateMockFlights(origin, destination, departureDate, passengers);
//       }

//     } catch (error) {
//       console.error('❌ Error in flight search:', error);
//       return generateMockFlights(origin, destination, departureDate, passengers);
//     }
//   },

//   // Get charter details with images
//   getCharterDetails: async (charterId) => {
//     try {
//     // Try to get real charter details
//       const endpoints = [
//         `${AVIA_PAGE_BASE_URL}/api/v1/charter/${charterId}`,
//         `${AVIA_PAGE_BASE_URL}/api/v1/aircraft/${charterId}`,
//       ];

//       for (const endpoint of endpoints) {
//         try {
//           const response = await fetch(endpoint, {
//             headers: {
//               'Authorization': `Bearer ${API_TOKEN}`,
//               'Content-Type': 'application/json',
//             },
//           });

//           if (response.ok) {
//             const data = await response.json();
//             // Add service fee to charter details
//             return addServiceFeeToFlight(data);
//           }
//         } catch (error) {
//           continue;
//         }
//       }

//       // Fallback to mock data with images
//       return generateMockCharterDetails(charterId);
//     } catch (error) {
//       console.error('Error getting charter details:', error);
//       return generateMockCharterDetails(charterId);
//     }
//   },

//   // Search airports
//   searchAirports: async (query) => {
//     try {
//       return await searchAirportsFallback(query);
//     } catch (error) {
//       console.error('Airport search error:', error);
//       return await searchAirportsFallback(query);
//     }
//   },

//   // Test API connection
//   testApiConnection: async () => {
//     return await verifyApiToken();
//   }
// };

// // For backward compatibility
// export const FlightService = AviapagesFlightService;

// export default AviapagesFlightService;
// const AVIA_PAGE_BASE_URL = 'https://api.aviapages.com';
// const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';
// const SERVICE_FEE_PERCENTAGE = 10;

//  const verifyApiToken = async () => {
//   try {
//     console.log('🔐 Verifying API token...');
    
//     const endpoints = [
//       `${AVIA_PAGE_BASE_URL}/api/v1/auth/verify`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/profile/me`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/health`,
//       'https://api.aviapages.com/auth/verify'  // Try different URL format
//     ];

//     for (const endpoint of endpoints) {
//       try {
//         console.log(`Trying endpoint: ${endpoint}`);
//         const response = await fetch(endpoint, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${API_TOKEN}`,
//             'Content-Type': 'application/json',
//           },
//           timeout: 5000
//         });

//         console.log(`Response status: ${response.status}`);
        
//         if (response.ok) {
//           const data = await response.json();
//           console.log('✅ API Token is valid:', data);
//           return true;
//         }
//       } catch (error) {
//         console.log(`❌ Endpoint failed: ${error.message}`);
//         continue;
//       }
//     }

//     console.log('⚠️ Using mock data mode');
//     return false;
//   } catch (error) {
//     console.error('Token verification error:', error);
//     return false;
//   }
// };

// // Service fee calculation
// const addServiceFeeToFlight = (flight) => {
//   const basePrice = flight.price?.total || 0;
//   const serviceFee = Math.round((basePrice * SERVICE_FEE_PERCENTAGE) / 100);
//   const totalWithFee = basePrice + serviceFee;

//   return {
//     ...flight,
//     price: {
//       ...flight.price,
//       total: totalWithFee,
//       base: Math.round(basePrice),
//       serviceFee: serviceFee
//     },
//     pricing: {
//       baseFare: basePrice,
//       serviceFee: serviceFee,
//       total: totalWithFee,
//       currency: flight.price?.currency || 'USD'
//     }
//   };
// };

// // Real API Call for Flights
// const fetchRealAviapagesFlights = async (origin, destination, departureDate, returnDate, passengers) => {
//   try {
//     console.log('🚀 Fetching REAL flights from Aviapages...');

//     // First try with simple endpoint to check connection
//     try {
//       const testResponse = await fetch(`${AVIA_PAGE_BASE_URL}/api/v1/health`, {
//         headers: {
//           'Authorization': `Bearer ${API_TOKEN}`,
//         },
//       });
      
//       if (!testResponse.ok) {
//         console.log('❌ API connection failed');
//         throw new Error('API connection failed');
//       }
//     } catch (error) {
//       console.log('API test failed, using mock data');
//       throw error;
//     }

//     // Try actual flight search endpoints
//     const flightEndpoints = [
//       {
//         url: `${AVIA_PAGE_BASE_URL}/api/v1/charter/flights/search`,
//         method: 'POST'
//       },
//       {
//         url: `${AVIA_PAGE_BASE_URL}/api/v1/flights/search`,
//         method: 'POST'
//       },
//       {
//         url: `${AVIA_PAGE_BASE_URL}/api/v1/aircraft/search`,
//         method: 'POST'
//       }
//     ];

//     const requestBody = {
//       departure_airport: origin,
//       arrival_airport: destination,
//       departure_date: departureDate,
//       passengers: parseInt(passengers) || 1,
//       ...(returnDate && { return_date: returnDate, trip_type: 'round_trip' })
//     };

//     console.log('Request body:', JSON.stringify(requestBody));

//     for (const endpoint of flightEndpoints) {
//       try {
//         console.log(`🔧 Trying endpoint: ${endpoint.url}`);
        
//         const response = await fetch(endpoint.url, {
//           method: endpoint.method,
//           headers: {
//             'Authorization': `Bearer ${API_TOKEN}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//           },
//           body: JSON.stringify(requestBody)
//         });

//         console.log('📥 API Response Status:', response.status);

//         if (response.ok) {
//           const apiData = await response.json();
//           console.log('📊 API Response Data:', apiData);
          
//           if (apiData.data && apiData.data.length > 0) {
//             const flightsWithFees = apiData.data.map(flight => addServiceFeeToFlight(flight));
//             console.log(`✅ Found ${flightsWithFees.length} real flights`);
//             return { data: flightsWithFees };
//           } else if (apiData.flights && apiData.flights.length > 0) {
//             // Different response format
//             const flightsWithFees = apiData.flights.map(flight => addServiceFeeToFlight(flight));
//             console.log(`✅ Found ${flightsWithFees.length} real flights`);
//             return { data: flightsWithFees };
//           }
//         } else {
//           const errorText = await response.text();
//           console.log('❌ API Error Response:', errorText);
//         }
//       } catch (error) {
//         console.log(`❌ Endpoint error:`, error.message);
//         continue;
//       }
//     }

//     console.log('⚠️ No data from real API, will use mock');
//     return null;

//   } catch (error) {
//     console.error('❌ Real API call failed:', error);
//     return null;
//   }
// };

// // Real API for Charter Details
// const fetchRealCharterDetails = async (charterId) => {
//   try {
//     console.log(`🔍 Fetching real charter details for ID: ${charterId}`);
    
//     const endpoints = [
//       `${AVIA_PAGE_BASE_URL}/api/v1/charter/${charterId}`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/aircraft/${charterId}`,
//       `${AVIA_PAGE_BASE_URL}/api/v1/aircraft/details/${charterId}`,
//     ];

//     for (const endpoint of endpoints) {
//       try {
//         console.log(`Trying endpoint: ${endpoint}`);
        
//         const response = await fetch(endpoint, {
//           headers: {
//             'Authorization': `Bearer ${API_TOKEN}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         console.log(`Response status: ${response.status}`);

//         if (response.ok) {
//           const data = await response.json();
//           console.log('✅ Real charter details fetched:', data);
          
//           if (data.images && data.images.length > 0) {
//             console.log(`Found ${data.images.length} real images`);
//           }
          
//           return addServiceFeeToFlight(data);
//         }
//       } catch (error) {
//         console.log(`Endpoint error: ${error.message}`);
//         continue;
//       }
//     }

//     console.log('⚠️ No real charter details found');
//     return null;

//   } catch (error) {
//     console.error('❌ Error fetching real charter details:', error);
//     return null;
//   }
// };

// // Enhanced Mock Data with Real Images
// const generateMockFlights = (origin, destination, departureDate, passengers) => {
//   console.log('🔄 Generating ENHANCED mock flight data...');
  
//   const airlines = [
//     { code: 'PJ', name: 'Private Jet Charter', logo: 'https://img.freepik.com/free-vector/private-jet-logo_23-2148442611.jpg' },
//     { code: 'LX', name: 'Luxury Jets', logo: 'https://img.freepik.com/free-vector/premium-jet-logo_23-2148442613.jpg' }
//   ];

//   const aircraftTypes = [
//     { 
//       model: 'Gulfstream G650', 
//       manufacturer: 'Gulfstream', 
//       seats: 14, 
//       range: '12,000 km', 
//       speed: '956 km/h',
//       hourlyRate: 8000,
//       images: [
//         "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_1_1600x1200.jpg",
//         "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_2_1600x1200.jpg",
//         "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Aft_Cabin_3_1600x1200.jpg",
//         "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Aft_Cabin_2_1600x1200.jpg"
//       ],
//       features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Conference Table', 'Private Suite', 'Shower']
//     },
//     { 
//       model: 'Bombardier Challenger 350', 
//       manufacturer: 'Bombardier', 
//       seats: 10, 
//       range: '5,900 km', 
//       speed: '870 km/h',
//       hourlyRate: 6000,
//       images: [
//         "https://md.aviapages.com/media/2025/11/26/B737-800-OM-GEX-Front-Cabin-1024x479.jpeg",
//         "https://md.aviapages.com/media/2025/11/26/B737-800-OM-GEX-Rear-Cabin-1024x480.jpeg",
//         "https://md.aviapages.com/media/2025/11/26/B737-800-OM-HEX-Central-Cabin-1024x480.jpeg"
//       ],
//       features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Conference Table', 'Refreshments']
//     },
//     { 
//       model: 'Dassault Falcon 8X', 
//       manufacturer: 'Dassault', 
//       seats: 12, 
//       range: '11,900 km', 
//       speed: '900 km/h',
//       hourlyRate: 7500,
//       images: [
//         "https://md.aviapages.com/media/2025/02/04/image22.jpg",
//         "https://md.aviapages.com/media/2025/02/04/image21.jpg",
//         "https://md.aviapages.com/media/2025/02/04/image30.jpg"
//       ],
//       features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Conference Table', 'Private Suite']
//     }
//   ];

//   const mockFlights = [];

//   // Generate 3-5 realistic mock flights
//   const flightCount = 3 + Math.floor(Math.random() * 2);

//   for (let i = 0; i < flightCount; i++) {
//     const airline = airlines[Math.floor(Math.random() * airlines.length)];
//     const aircraft = aircraftTypes[i % aircraftTypes.length]; // Cycle through aircraft types
    
//     // Calculate realistic price
//     const routeFactor = getRouteFactor(origin, destination);
//     let basePrice = aircraft.hourlyRate * 2 * routeFactor * (1 + (passengers / 10));
//     basePrice = Math.round(basePrice / 1000) * 1000; // Round to nearest 1000
    
//     // Generate realistic times
//     const departureTime = new Date(departureDate);
//     departureTime.setHours(8 + i * 3); // 8 AM, 11 AM, 2 PM, etc.
//     departureTime.setMinutes(0);
    
//     const duration = getRouteDuration(origin, destination);
//     const arrivalTime = new Date(departureTime);
//     arrivalTime.setHours(arrivalTime.getHours() + duration.hours);
//     arrivalTime.setMinutes(arrivalTime.getMinutes() + duration.minutes);
    
//     const flight = {
//       id: `real-flight-${Date.now()}-${i}`,
//       type: 'charter-flight',
//       source: 'AVIAPAGES',
//       timestamp: new Date().toISOString(),
      
//       price: {
//         currency: 'USD',
//         total: basePrice,
//         base: Math.round(basePrice * 0.9)
//       },
      
//       itineraries: [
//         {
//           duration: `PT${duration.hours}H${duration.minutes}M`,
//           segments: [
//             {
//               departure: {
//                 iataCode: origin,
//                 at: departureTime.toISOString(),
//                 terminal: 'Private'
//               },
//               arrival: {
//                 iataCode: destination,
//                 at: arrivalTime.toISOString(),
//                 terminal: 'Private'
//               },
//               carrierCode: airline.code,
//               number: `${airline.code}${1000 + i}`,
//               aircraft: {
//                 code: aircraft.model
//               },
//               duration: `PT${duration.hours}H${duration.minutes}M`,
//               id: `segment-${i}`,
//               numberOfStops: 0
//             }
//           ]
//         }
//       ],
      
//       aircraftInfo: {
//         id: `aircraft-${Date.now()}-${i}`,
//         name: aircraft.model,
//         manufacturer: aircraft.manufacturer,
//         model: aircraft.model,
//         year: 2020 + Math.floor(Math.random() * 4),
//         seats: aircraft.seats,
//         speed: aircraft.speed,
//         range: aircraft.range,
//         images: aircraft.images,
//         features: aircraft.features,
//         airline: airline.name,
//         airlineLogo: airline.logo,
//         hourlyRate: aircraft.hourlyRate,
//         category: aircraft.seats > 10 ? 'Heavy Jet' : aircraft.seats > 8 ? 'Medium Jet' : 'Light Jet'
//       }
//     };
    
//     const flightWithFee = addServiceFeeToFlight(flight);
//     mockFlights.push(flightWithFee);
//   }

//   // Sort by price
//   mockFlights.sort((a, b) => a.pricing.total - b.pricing.total);

//   console.log(`✅ Generated ${mockFlights.length} enhanced mock flights`);
//   return { data: mockFlights };
// };

// // Helper functions
// const getRouteFactor = (origin, destination) => {
//   const routeFactors = {
//     'DXB-AUH': 1.0,
//     'DXB-DOH': 1.2,
//     'DXB-RUH': 1.1,
//     'JFK-LAX': 3.0,
//     'LHR-CDG': 1.5,
//     'LHR-DXB': 4.0,
//     'JFK-LHR': 4.5,
//     'default': 2.0
//   };
  
//   const route = `${origin}-${destination}`;
//   return routeFactors[route] || routeFactors.default;
// };

// const getRouteDuration = (origin, destination) => {
//   const durations = {
//     'DXB-AUH': { hours: 1, minutes: 0 },
//     'DXB-DOH': { hours: 1, minutes: 15 },
//     'DXB-RUH': { hours: 1, minutes: 30 },
//     'JFK-LAX': { hours: 6, minutes: 0 },
//     'LHR-CDG': { hours: 1, minutes: 15 },
//     'LHR-DXB': { hours: 6, minutes: 30 },
//     'JFK-LHR': { hours: 7, minutes: 0 },
//     'default': { hours: 2, minutes: 0 }
//   };
  
//   const route = `${origin}-${destination}`;
//   return durations[route] || durations.default;
// };

// // Enhanced Mock Charter Details
// const generateMockCharterDetails = (charterId) => {
//   console.log(`🔄 Generating enhanced mock charter for ID: ${charterId}`);
  
//   // Extract aircraft type from ID
//   let aircraftType = 'G650';
//   if (charterId.includes('Challenger')) aircraftType = 'Challenger 350';
//   if (charterId.includes('Falcon')) aircraftType = 'Falcon 8X';
  
//   const aircraftData = {
//     'G650': {
//       id: charterId,
//       name: 'Gulfstream G650',
//       manufacturer: 'Gulfstream',
//       model: 'G650',
//       year: 2022,
//       seats: 14,
//       speed: '956 km/h',
//       range: '12,000 km',
//       category: 'Heavy',
//       hourlyRate: 8000,
//       images: [
//         "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_1_1600x1200.jpg",
//         "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_2_1600x1200.jpg",
//         "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Aft_Cabin_3_1600x1200.jpg",
//         "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Aft_Cabin_2_1600x1200.jpg"
//       ],
//       features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Conference Table', 'Private Suite', 'Shower', 'Full Galley']
//     },
//     'Challenger 350': {
//       id: charterId,
//       name: 'Bombardier Challenger 350',
//       manufacturer: 'Bombardier',
//       model: 'Challenger 350',
//       year: 2021,
//       seats: 10,
//       speed: '870 km/h',
//       range: '5,900 km',
//       category: 'Medium',
//       hourlyRate: 6000,
//       images: [
//         "https://md.aviapages.com/media/2025/11/26/B737-800-OM-GEX-Front-Cabin-1024x479.jpeg",
//         "https://md.aviapages.com/media/2025/11/26/B737-800-OM-GEX-Rear-Cabin-1024x480.jpeg",
//         "https://md.aviapages.com/media/2025/11/26/B737-800-OM-HEX-Central-Cabin-1024x480.jpeg"
//       ],
//       features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Conference Table', 'Refreshments']
//     },
//     'Falcon 8X': {
//       id: charterId,
//       name: 'Dassault Falcon 8X',
//       manufacturer: 'Dassault',
//       model: 'Falcon 8X',
//       year: 2020,
//       seats: 12,
//       speed: '900 km/h',
//       range: '11,900 km',
//       category: 'Heavy',
//       hourlyRate: 7500,
//       images: [
//         "https://md.aviapages.com/media/2025/02/04/image22.jpg",
//         "https://md.aviapages.com/media/2025/02/04/image21.jpg",
//         "https://md.aviapages.com/media/2025/02/04/image30.jpg",
//         "https://md.aviapages.com/media/2025/02/04/image26.jpg"
//       ],
//       features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Conference Table', 'Private Suite', 'Refreshments']
//     }
//   };

//   const aircraft = aircraftData[aircraftType] || aircraftData['G650'];
  
//   const basePrice = aircraft.hourlyRate * 1;
//   const serviceFee = Math.round((basePrice * SERVICE_FEE_PERCENTAGE) / 100);
//   const totalPrice = basePrice + serviceFee;

//   return {
//     ...aircraft,
//     pricing: {
//       baseFare: basePrice,
//       serviceFee: serviceFee,
//       total: totalPrice,
//       currency: 'USD'
//     },
//     price: {
//       currency: 'USD',
//       total: totalPrice,
//       base: basePrice
//     },
//     specifications: {
//       maxPassengers: aircraft.seats,
//       cruiseSpeed: aircraft.speed,
//       maxRange: aircraft.range,
//       cabinHeight: '1.9m',
//       cabinWidth: '2.2m',
//       cabinLength: '13.5m',
//       baggageCapacity: '5.7 m³'
//     },
//     amenities: aircraft.features,
//     available: true,
//     instantConfirmation: true
//   };
// };

// // Airport search
// const searchAirportsFallback = async (query) => {
//   const popularAirports = [
//     { id: 'DXB', displayName: 'Dubai International Airport (DXB)', iataCode: 'DXB', city: 'Dubai', country: 'United Arab Emirates' },
//     { id: 'AUH', displayName: 'Abu Dhabi International Airport (AUH)', iataCode: 'AUH', city: 'Abu Dhabi', country: 'United Arab Emirates' },
//     { id: 'DOH', displayName: 'Hamad International Airport (DOH)', iataCode: 'DOH', city: 'Doha', country: 'Qatar' },
//     { id: 'RUH', displayName: 'King Khalid International Airport (RUH)', iataCode: 'RUH', city: 'Riyadh', country: 'Saudi Arabia' },
//     { id: 'JFK', displayName: 'John F Kennedy International Airport (JFK)', iataCode: 'JFK', city: 'New York', country: 'United States' },
//     { id: 'LAX', displayName: 'Los Angeles International Airport (LAX)', iataCode: 'LAX', city: 'Los Angeles', country: 'United States' },
//     { id: 'LHR', displayName: 'Heathrow Airport (LHR)', iataCode: 'LHR', city: 'London', country: 'United Kingdom' },
//     { id: 'CDG', displayName: 'Charles de Gaulle Airport (CDG)', iataCode: 'CDG', city: 'Paris', country: 'France' },
//   ];

//   if (!query || query.length < 2) {
//     return { data: [] };
//   }

//   const filtered = popularAirports.filter(airport => 
//     airport.city.toLowerCase().includes(query.toLowerCase()) ||
//     airport.iataCode.toLowerCase().includes(query.toLowerCase()) ||
//     airport.displayName.toLowerCase().includes(query.toLowerCase())
//   );

//   return { data: filtered };
// };

// // Main Service
// export const AviapagesFlightService = {
//   searchFlights: async (origin, destination, departureDate, returnDate, passengers) => {
//     try {
//       console.log(`🔍 Searching flights: ${origin} → ${destination} on ${departureDate}`);
      
//       // Always try real API first
//       const realFlights = await fetchRealAviapagesFlights(origin, destination, departureDate, returnDate, passengers);
      
//       if (realFlights && realFlights.data && realFlights.data.length > 0) {
//         console.log(`🎉 SUCCESS: Found ${realFlights.data.length} REAL flights`);
//         return realFlights;
//       }
      
//       console.log('⚠️ No real flights, using enhanced mock data');
//       const mockFlights = generateMockFlights(origin, destination, departureDate, passengers);
      
//       // Mark as mock data for debugging
//       mockFlights.data = mockFlights.data.map(flight => ({
//         ...flight,
//         _source: 'MOCK_DATA',
//         _timestamp: new Date().toISOString()
//       }));
      
//       return mockFlights;

//     } catch (error) {
//       console.error('❌ Flight search error:', error);
//       const mockFlights = generateMockFlights(origin, destination, departureDate, passengers);
      
//       mockFlights.data = mockFlights.data.map(flight => ({
//         ...flight,
//         _source: 'FALLBACK_MOCK',
//         _error: error.message
//       }));
      
//       return mockFlights;
//     }
//   },

//   getCharterDetails: async (charterId) => {
//     try {
//       console.log(`🔍 Getting charter details for: ${charterId}`);
      
//       // Always try real API first
//       const realDetails = await fetchRealCharterDetails(charterId);
      
//       if (realDetails) {
//         console.log('🎉 SUCCESS: Got REAL charter details');
        
//         // Ensure images array exists
//         if (!realDetails.images || realDetails.images.length === 0) {
//           realDetails.images = [
//             'https://md.aviapages.com/media/thmb/2025/02/25/q90/g1920/crcenter/FHFN.png.webp',
//             'https://md.aviapages.com/media/2025/02/25/DSC02446-scaled.jpg'
//           ];
//         }
        
//         return {
//           ...realDetails,
//           _source: 'REAL_API',
//           _timestamp: new Date().toISOString()
//         };
//       }
      
//       console.log('⚠️ No real details, using enhanced mock');
//       const mockDetails = generateMockCharterDetails(charterId);
      
//       return {
//         ...mockDetails,
//         _source: 'ENHANCED_MOCK',
//         _timestamp: new Date().toISOString()
//       };

//     } catch (error) {
//       console.error('❌ Charter details error:', error);
//       const mockDetails = generateMockCharterDetails(charterId);
      
//       return {
//         ...mockDetails,
//         _source: 'ERROR_FALLBACK',
//         _error: error.message,
//         _timestamp: new Date().toISOString()
//       };
//     }
//   },

//   searchAirports: async (query) => {
//     return await searchAirportsFallback(query);
//   },

//   testApiConnection: async () => {
//     return await verifyApiToken();
//   }
// };

// export default AviapagesFlightService;

const AVIA_PAGE_BASE_URL = 'https://api.aviapages.com';
const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';
const SERVICE_FEE_PERCENTAGE = 10;

// API Token Verification
const verifyApiToken = async () => {
  try {
    console.log('🔐 Verifying API token...');
    
    const endpoints = [
      `${AVIA_PAGE_BASE_URL}/api/v1/auth/verify`,
      `${AVIA_PAGE_BASE_URL}/api/v1/profile/me`,
      `${AVIA_PAGE_BASE_URL}/api/v1/health`,
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        console.log(`Response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ API Token is valid');
          return true;
        }
      } catch (error) {
        console.log(`❌ Endpoint failed: ${error.message}`);
        continue;
      }
    }

    console.log('⚠️ Using mock data mode');
    return false;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

// Service fee calculation
const addServiceFeeToFlight = (flight) => {
  const basePrice = flight.price?.total || 0;
  const serviceFee = Math.round((basePrice * SERVICE_FEE_PERCENTAGE) / 100);
  const totalWithFee = basePrice + serviceFee;

  return {
    ...flight,
    price: {
      ...flight.price,
      total: totalWithFee,
      base: Math.round(basePrice),
      serviceFee: serviceFee
    },
    pricing: {
      baseFare: basePrice,
      serviceFee: serviceFee,
      total: totalWithFee,
      currency: flight.price?.currency || 'USD'
    }
  };
};

// Helper function to adjust time
const adjustTime = (time, hours) => {
  const [h, m] = time.split(':').map(Number);
  let newHour = h + hours;
  
  // Handle overflow
  if (newHour < 0) newHour += 24;
  if (newHour >= 24) newHour -= 24;
  
  return `${newHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// Real API Call for Flights with Time Support
const fetchRealAviapagesFlights = async (origin, destination, departureDate, departureTime, returnDate, returnTime, passengers, flexibleTiming = false) => {
  try {
    console.log('🚀 Fetching REAL flights from Aviapages with time support...');
    console.log(`Departure: ${departureDate} at ${departureTime}`);
    console.log(`Flexible timing: ${flexibleTiming}`);

    // Test API connection first
    try {
      const testResponse = await fetch(`${AVIA_PAGE_BASE_URL}/api/v1/health`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
        },
      });
      
      if (!testResponse.ok) {
        console.log('❌ API connection failed');
        throw new Error('API connection failed');
      }
    } catch (error) {
      console.log('API test failed, using mock data');
      throw error;
    }

    // Prepare request body with time parameters
    const requestBody = {
      departure_airport: origin,
      arrival_airport: destination,
      departure_date: departureDate,
      departure_time: departureTime,
      passengers: parseInt(passengers) || 1,
      ...(returnDate && { 
        return_date: returnDate,
        return_time: returnTime,
        trip_type: 'round_trip' 
      }),
      ...(flexibleTiming && { flexible_scheduling: true })
    };

    console.log('Request body with time:', JSON.stringify(requestBody));

    // Try different endpoints
    const endpoints = [
      `${AVIA_PAGE_BASE_URL}/api/v1/charter/flights/search`,
      `${AVIA_PAGE_BASE_URL}/api/v1/flights/search`,
      `${AVIA_PAGE_BASE_URL}/api/v1/aircraft/search`
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`🔧 Trying endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        console.log('📥 API Response Status:', response.status);

        if (response.ok) {
          const apiData = await response.json();
          console.log('📊 API Response Data received');
          
          if (apiData.data && apiData.data.length > 0) {
            const flightsWithFees = apiData.data.map(flight => addServiceFeeToFlight(flight));
            console.log(`✅ Found ${flightsWithFees.length} real flights`);
            return { data: flightsWithFees };
          } else if (apiData.flights && apiData.flights.length > 0) {
            const flightsWithFees = apiData.flights.map(flight => addServiceFeeToFlight(flight));
            console.log(`✅ Found ${flightsWithFees.length} real flights`);
            return { data: flightsWithFees };
          }
        } else {
          const errorText = await response.text();
          console.log('❌ API Error Response:', errorText);
        }
      } catch (error) {
        console.log(`❌ Endpoint error:`, error.message);
        continue;
      }
    }

    console.log('⚠️ No data from real API, will use enhanced mock');
    return null;

  } catch (error) {
    console.error('❌ Real API call failed:', error);
    return null;
  }
};

// Enhanced Mock Data with Flexible Timing
const generateMockFlights = (origin, destination, departureDate, departureTime, passengers, flexibleTiming = false) => {
  console.log('🔄 Generating enhanced mock flight data with time support...');
  console.log(`Requested departure: ${departureTime}, Flexible: ${flexibleTiming}`);
  
  const airlines = [
    { 
      code: 'PJ', 
      name: 'Sky Elite Charter', 
      logo: 'https://img.freepik.com/free-vector/private-jet-logo_23-2148442611.jpg',
      premium: true 
    },
    { 
      code: 'LX', 
      name: 'Luxury Air Jets', 
      logo: 'https://img.freepik.com/free-vector/premium-jet-logo_23-2148442613.jpg',
      premium: true 
    },
    { 
      code: 'EX', 
      name: 'Executive Flights', 
      logo: 'https://img.freepik.com/free-vector/airplane-logo_23-2147503272.jpg',
      premium: false 
    }
  
  ];

  const aircraftTypes = [
    { 
      model: 'Gulfstream G650', 
      manufacturer: 'Gulfstream', 
      seats: 14, 
      range: '12,000 km', 
      speed: '956 km/h',
      hourlyRate: 8500,
      category: 'Heavy Jet',
     images: [
        "https://md.aviapages.com/media/2025/08/29/67c586329c3acd93449ee0c4_Union-Aviation-YL-ECT-interior-12.jpg",
        "https://md.aviapages.com/media/2025/08/29/67c5862fd83c81736b0a6606_Union-Aviation-YL-ECT-interior-3.jpg",
        "https://md.aviapages.com/media/2025/08/29/67c5862f53279ee039530988_Union-Aviation-YL-ECT-interior-2.jpg",
       "https://md.aviapages.com/media/2025/08/29/67c5862e5d33648df078d51e_Union-Aviation-YL-ECT-interior-1.jpg",
     "https://md.aviapages.com/media/2025/08/29/67c586334be9b297e0477bbb_Union-Aviation-YL-ECT-interior-13.jpg"
      ],
      features: ['WiFi', '4K Entertainment', 'Luxury Seating', 'Conference Table', 'Private Suite', 'Shower', 'Full Galley', 'Stand-up Cabin']
    },
    { 
      model: 'Bombardier Challenger 350', 
      manufacturer: 'Bombardier', 
      seats: 10, 
      range: '5,900 km', 
      speed: '870 km/h',
      hourlyRate: 6500,
      category: 'Medium Jet',
      images: [
       "https://md.aviapages.com/media/thmb/2022/02/01/q90/g1920/crcenter/image-005.jpg.webp",
       "https://md.aviapages.com/media/2022/02/01/image-006.jpg" ,
       "https://md.aviapages.com/media/2022/02/01/image-004.jpg" ,
       "https://md.aviapages.com/media/2022/02/01/image-003.jpg" ,
       "https://md.aviapages.com/media/2022/02/01/image-002.jpg"
      ],
 
      features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Conference Table', 'Refreshment Bar', 'Work Station']
    },
    { 
      model: 'Dassault Falcon 8X', 
      manufacturer: 'Dassault', 
      seats: 12, 
      range: '11,900 km', 
      speed: '900 km/h',
      hourlyRate: 7800,
      category: 'Heavy Jet',
        images: [
        "https://md.aviapages.com/media/2025/11/26/B737-800-OM-GEX-Front-Cabin-1024x479.jpeg",
        "https://md.aviapages.com/media/2025/11/26/B737-800-OM-GEX-Rear-Cabin-1024x480.jpeg",
        "https://md.aviapages.com/media/2025/11/26/B737-800-OM-HEX-Central-Cabin-1024x480.jpeg" ,
      "https://md.aviapages.com/media/2017/01/01/04/HAW_2_EWDif3.jpg"
      ],
      features: ['WiFi', 'Entertainment System', 'Luxury Seating', 'Conference Table', 'Private Suite', 'Refreshments', 'Sleeping Accommodation']
    },
    { 
      model: 'Embraer Praetor 600', 
      manufacturer: 'Embraer', 
      seats: 8, 
      range: '7,400 km', 
      speed: '850 km/h',
      hourlyRate: 5500,
      category: 'Light Jet',
     images: [
        "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_1_1600x1200.jpg",
        "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_2_1600x1200.jpg",
        "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Aft_Cabin_3_1600x1200.jpg",
        "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Aft_Cabin_2_1600x1200.jpg"
      ],
      features: ['WiFi', 'Entertainment', 'Comfortable Seating', 'Refreshments', 'Work Table']
    } ,
        
  ];

  const mockFlights = [];
  const [requestedHour, requestedMinute] = departureTime.split(':').map(Number);

  // Generate 3-5 flights with flexible timing variations
  const flightCount = flexibleTiming ? 5 : 3;

  for (let i = 0; i < flightCount; i++) {
    const airline = airlines[i % airlines.length];
    const aircraft = aircraftTypes[i % aircraftTypes.length];
    
    // Calculate adjusted departure time based on flexible timing
    let departureHour = requestedHour;
    let timeAdjustment = 0;
    
    if (flexibleTiming) {
      // Create variations: -2h, -1h, exact, +1h, +2h
      timeAdjustment = i - 2;
      departureHour = requestedHour + timeAdjustment;
      
      // Ensure time is within operational hours (5 AM to 11 PM)
      if (departureHour < 5) departureHour = 5;
      if (departureHour > 23) departureHour = 23;
    }
    
    // Calculate price with time premium/discount
    const routeFactor = getRouteFactor(origin, destination);
    let basePrice = aircraft.hourlyRate * 2 * routeFactor * (1 + (passengers / 12));
    
    // Apply time-based pricing
    if (flexibleTiming) {
      if (timeAdjustment === 0) {
        // Exact time - premium
        basePrice *= 1.1;
      } else if (Math.abs(timeAdjustment) === 1) {
        // ±1 hour - normal
        basePrice *= 1.0;
      } else {
        // ±2 hours - discount
        basePrice *= 0.9;
      }
    }
    
    basePrice = Math.round(basePrice / 500) * 500; // Round to nearest 500
    
    // Create departure time
    const departureDateTime = new Date(departureDate);
    departureDateTime.setHours(departureHour, requestedMinute, 0, 0);
    
    // Calculate flight duration and arrival
    const duration = getRouteDuration(origin, destination);
    const arrivalDateTime = new Date(departureDateTime);
    arrivalDateTime.setHours(arrivalDateTime.getHours() + duration.hours);
    arrivalDateTime.setMinutes(arrivalDateTime.getMinutes() + duration.minutes);
    
    // Determine if this is exact time match
    const isExactTime = timeAdjustment === 0;
    const timeStatus = flexibleTiming ? 
      (isExactTime ? 'Exact time' : `${timeAdjustment > 0 ? '+' : ''}${timeAdjustment}h`) : 
      'Scheduled';
    
    const flight = {
      id: `flight-${Date.now()}-${i}`,
      type: 'charter-flight',
      source: 'AVIAPAGES_ENHANCED',
      timestamp: new Date().toISOString(),
      
      price: {
        currency: 'USD',
        total: basePrice,
        base: Math.round(basePrice * 0.88)
      },
      
      itineraries: [
        {
          duration: `PT${duration.hours}H${duration.minutes}M`,
          segments: [
            {
              departure: {
                iataCode: origin,
                at: departureDateTime.toISOString(),
                terminal: 'Private Terminal',
                scheduledTime: `${departureHour.toString().padStart(2, '0')}:${requestedMinute.toString().padStart(2, '0')}`,
                flexibility: timeStatus
              },
              arrival: {
                iataCode: destination,
                at: arrivalDateTime.toISOString(),
                terminal: 'Private Terminal'
              },
              carrierCode: airline.code,
              number: `${airline.code}${2000 + i}`,
              aircraft: {
                code: aircraft.model,
                name: `${aircraft.manufacturer} ${aircraft.model}`
              },
              duration: `PT${duration.hours}H${duration.minutes}M`,
              id: `segment-${i}`,
              numberOfStops: 0,
              operatingCarrier: airline.name
            }
          ]
        }
      ],
      
      aircraftInfo: {
        id: `aircraft-${Date.now()}-${i}`,
        name: aircraft.model,
        manufacturer: aircraft.manufacturer,
        model: aircraft.model,
        year: 2020 + Math.floor(Math.random() * 4),
        seats: aircraft.seats,
        speed: aircraft.speed,
        range: aircraft.range,
        images: aircraft.images,
        features: aircraft.features,
        airline: airline.name,
        airlineLogo: airline.logo,
        hourlyRate: aircraft.hourlyRate,
        category: aircraft.category,
        flexibleTimingAvailable: true,
        timeMatch: timeStatus,
        availability: 'Available',
        instantConfirmation: Math.random() > 0.3
      },
      
      timeDetails: {
        requestedTime: departureTime,
        actualTime: `${departureHour.toString().padStart(2, '0')}:${requestedMinute.toString().padStart(2, '0')}`,
        adjustment: timeAdjustment,
        isExactMatch: isExactTime,
        flexibleOption: flexibleTiming
      }
    };
    
    const flightWithFee = addServiceFeeToFlight(flight);
    mockFlights.push(flightWithFee);
  }

  // Sort flights: exact time first, then by adjustment amount, then by price
  mockFlights.sort((a, b) => {
    if (a.timeDetails.isExactMatch && !b.timeDetails.isExactMatch) return -1;
    if (!a.timeDetails.isExactMatch && b.timeDetails.isExactMatch) return 1;
    
    const aAdjustment = Math.abs(a.timeDetails.adjustment);
    const bAdjustment = Math.abs(b.timeDetails.adjustment);
    if (aAdjustment !== bAdjustment) return aAdjustment - bAdjustment;
    
    return a.pricing.total - b.pricing.total;
  });

  console.log(`✅ Generated ${mockFlights.length} enhanced mock flights with time variations`);
  return { data: mockFlights };
};

// Helper function for route factor
const getRouteFactor = (origin, destination) => {
  const routeFactors = {
    'DXB-AUH': 1.0,
    'DXB-DOH': 1.2,
    'DXB-RUH': 1.1,
    'JFK-LAX': 3.0,
    'LHR-CDG': 1.5,
    'LHR-DXB': 4.0,
    'JFK-LHR': 4.5,
    'AUH-DXB': 1.0,
    'DOH-DXB': 1.2,
    'RUH-DXB': 1.1,
    'LAX-JFK': 3.0,
    'CDG-LHR': 1.5,
    'default': 2.0
  };
  
  const route = `${origin}-${destination}`;
  return routeFactors[route] || routeFactors.default;
};

// Helper function for route duration
const getRouteDuration = (origin, destination) => {
  const durations = {
    'DXB-AUH': { hours: 1, minutes: 0 },
    'DXB-DOH': { hours: 1, minutes: 15 },
    'DXB-RUH': { hours: 1, minutes: 30 },
    'JFK-LAX': { hours: 6, minutes: 0 },
    'LHR-CDG': { hours: 1, minutes: 15 },
    'LHR-DXB': { hours: 6, minutes: 30 },
    'JFK-LHR': { hours: 7, minutes: 0 },
    'AUH-DXB': { hours: 1, minutes: 0 },
    'DOH-DXB': { hours: 1, minutes: 15 },
    'RUH-DXB': { hours: 1, minutes: 30 },
    'LAX-JFK': { hours: 6, minutes: 0 },
    'CDG-LHR': { hours: 1, minutes: 15 },
    'default': { hours: 2, minutes: 0 }
  };
  
  const route = `${origin}-${destination}`;
  return durations[route] || durations.default;
};

// Enhanced Mock Charter Details with Time Slots
const generateMockCharterDetails = (charterId, preferredTime = null) => {
  console.log(`🔄 Generating enhanced mock charter for ID: ${charterId}`);
  
  // Determine aircraft type from ID
  let aircraftType = 'G650';
  if (charterId.includes('Challenger') || charterId.includes('challenger')) aircraftType = 'Challenger 350';
  if (charterId.includes('Falcon') || charterId.includes('falcon')) aircraftType = 'Falcon 8X';
  if (charterId.includes('Praetor') || charterId.includes('praetor')) aircraftType = 'Praetor 600';
  
  const aircraftData = {
    'G650': {
      id: charterId,
      name: 'Gulfstream G650',
      manufacturer: 'Gulfstream Aerospace',
      model: 'G650',
      year: 2022,
      seats: 14,
      speed: '956 km/h',
      range: '12,000 km',
      category: 'Heavy Jet',
      hourlyRate: 8500,
      images: [
        "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_1_1600x1200.jpg",
        "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_2_1600x1200.jpg",
        "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Aft_Cabin_3_1600x1200.jpg",
        "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Aft_Cabin_2_1600x1200.jpg"
      ],
      features: [
        'WiFi & Satellite Communications',
        '4K Entertainment System',
        'Luxury Leather Seating',
        'Conference/Dining Table',
        'Private Suite with Door',
        'Full Stand-up Cabin',
        'Shower Facilities',
        'Full Galley Kitchen',
        'Crew Rest Area',
        'Noise-Cancelling Cabin'
      ],
      description: 'The Gulfstream G650 is the ultimate in private aviation, offering unmatched comfort, range, and performance. Perfect for transcontinental flights with the highest level of luxury.'
    },
    'Challenger 350': {
      id: charterId,
      name: 'Bombardier Challenger 350',
      manufacturer: 'Bombardier',
      model: 'Challenger 350',
      year: 2021,
      seats: 10,
      speed: '870 km/h',
      range: '5,900 km',
      category: 'Medium Jet',
      hourlyRate: 6500,
      images: [
        "https://md.aviapages.com/media/2025/11/26/B737-800-OM-GEX-Front-Cabin-1024x479.jpeg",
        "https://md.aviapages.com/media/2025/11/26/B737-800-OM-GEX-Rear-Cabin-1024x480.jpeg",
        "https://md.aviapages.com/media/2025/11/26/B737-800-OM-HEX-Central-Cabin-1024x480.jpeg" ,
      "https://md.aviapages.com/media/2017/01/01/04/HAW_2_EWDif3.jpg"
      ],
      features: [
        'High-Speed WiFi',
        'Entertainment System',
        'Ergonomic Leather Seats',
        'Conference Table',
        'Refreshment Bar',
        'Work Stations',
        'Ample Storage',
        'Bright Cabin Windows'
      ],
      description: 'The Challenger 350 offers the perfect balance of performance and comfort for mid-range flights. Known for its reliability and spacious cabin.'
    },
    'Falcon 8X': {
      id: charterId,
      name: 'Dassault Falcon 8X',
      manufacturer: 'Dassault Aviation',
      model: 'Falcon 8X',
      year: 2020,
      seats: 12,
      speed: '900 km/h',
      range: '11,900 km',
      category: 'Heavy Jet',
      hourlyRate: 7800,
      images: [
        "https://md.aviapages.com/media/2025/08/29/67c586329c3acd93449ee0c4_Union-Aviation-YL-ECT-interior-12.jpg",
        "https://md.aviapages.com/media/2025/08/29/67c5862fd83c81736b0a6606_Union-Aviation-YL-ECT-interior-3.jpg",
        "https://md.aviapages.com/media/2025/08/29/67c5862f53279ee039530988_Union-Aviation-YL-ECT-interior-2.jpg",
       "https://md.aviapages.com/media/2025/08/29/67c5862e5d33648df078d51e_Union-Aviation-YL-ECT-interior-1.jpg",
     "https://md.aviapages.com/media/2025/08/29/67c586334be9b297e0477bbb_Union-Aviation-YL-ECT-interior-13.jpg"
      ],
      features: [
        'Advanced WiFi System',
        'HD Entertainment',
        'Luxury Seating with Massage',
        'Convertible Conference/Dining',
        'Private Sleeping Suite',
        'Full Refreshment Service',
        'Stand-up Cabin',
        'Quiet Cabin Technology'
      ],
      description: 'The Falcon 8X offers exceptional range and a quiet, comfortable cabin. Perfect for long-haul flights with multiple time zones.'
    },
    'Praetor 600': {
      id: charterId,
      name: 'Embraer Praetor 600',
      manufacturer: 'Embraer',
      model: 'Praetor 600',
      year: 2023,
      seats: 8,
      speed: '850 km/h',
      range: '7,400 km',
      category: 'Light Jet',
      hourlyRate: 5500,
      images: [
       "https://md.aviapages.com/media/thmb/2022/02/01/q90/g1920/crcenter/image-005.jpg.webp",
       "https://md.aviapages.com/media/2022/02/01/image-006.jpg" ,
       "https://md.aviapages.com/media/2022/02/01/image-004.jpg" ,
       "https://md.aviapages.com/media/2022/02/01/image-003.jpg" ,
       "https://md.aviapages.com/media/2022/02/01/image-002.jpg"
      ],
      features: [
        'WiFi Connectivity',
        'Entertainment System',
        'Comfortable Club Seating',
        'Work Table',
        'Refreshment Service',
        'Large Windows',
        'Efficient Performance'
      ],
      description: 'The Praetor 600 offers excellent performance and comfort for shorter to mid-range flights at a competitive price point.'
    }
  };

  const aircraft = aircraftData[aircraftType] || aircraftData['G650'];
  
  const basePrice = aircraft.hourlyRate * 2;
  const serviceFee = Math.round((basePrice * SERVICE_FEE_PERCENTAGE) / 100);
  const totalPrice = basePrice + serviceFee;

  // Generate available time slots
  const baseTime = preferredTime || '10:00';
  const [baseHour, baseMinute] = baseTime.split(':').map(Number);
  
  const availableSlots = [];
  
  // Generate slots from 5 AM to 11 PM
  for (let hour = 5; hour <= 23; hour++) {
    if (hour === baseHour || Math.abs(hour - baseHour) <= 2) {
      const time = `${hour.toString().padStart(2, '0')}:${baseMinute.toString().padStart(2, '0')}`;
      availableSlots.push({
        time: time,
        status: 'available',
        isPreferred: time === preferredTime,
        priceMultiplier: time === preferredTime ? 1.1 : 1.0
      });
    }
  }

  return {
    ...aircraft,
    pricing: {
      baseFare: basePrice,
      serviceFee: serviceFee,
      total: totalPrice,
      currency: 'USD',
      hourlyRate: aircraft.hourlyRate,
      minimumHours: 2
    },
    price: {
      currency: 'USD',
      total: totalPrice,
      base: basePrice,
      serviceFee: serviceFee
    },
    specifications: {
      maxPassengers: aircraft.seats,
      cruiseSpeed: aircraft.speed,
      maxRange: aircraft.range,
      cabinHeight: aircraft.category === 'Heavy Jet' ? '1.9m' : '1.8m',
      cabinWidth: aircraft.category === 'Heavy Jet' ? '2.2m' : '2.1m',
      cabinLength: aircraft.category === 'Heavy Jet' ? '15.3m' : '8.5m',
      baggageCapacity: aircraft.category === 'Heavy Jet' ? '5.7 m³' : '3.2 m³',
      lavatory: aircraft.category === 'Heavy Jet' ? 'Full with shower' : 'Standard',
      crew: aircraft.category === 'Heavy Jet' ? '2 pilots + 1 attendant' : '2 pilots'
    },
    amenities: aircraft.features,
    available: true,
    instantConfirmation: true,
    flexibleTiming: true,
    availableSlots: availableSlots,
    bookingNotes: [
      'Flexible departure times available',
      '24/7 customer support',
      'Catering options available',
      'Ground transportation can be arranged',
      'WiFi and entertainment included',
      'Professional crew included'
    ],
    safety: {
      rating: '5/5',
      lastMaintenance: '2024-01-15',
      crewExperience: '10,000+ hours average',
      insurance: 'Full comprehensive coverage'
    }
  };
};

// Airport search with timezone support
const searchAirportsFallback = async (query) => {
  const popularAirports = [
    { 
      id: 'DXB', 
      displayName: 'Dubai International Airport (DXB)', 
      iataCode: 'DXB', 
      city: 'Dubai', 
      country: 'United Arab Emirates',
      timezone: 'Asia/Dubai',
      hasPrivateTerminal: true
    },
    { 
      id: 'AUH', 
      displayName: 'Abu Dhabi International Airport (AUH)', 
      iataCode: 'AUH', 
      city: 'Abu Dhabi', 
      country: 'United Arab Emirates',
      timezone: 'Asia/Dubai',
      hasPrivateTerminal: true
    },
    { 
      id: 'DOH', 
      displayName: 'Hamad International Airport (DOH)', 
      iataCode: 'DOH', 
      city: 'Doha', 
      country: 'Qatar',
      timezone: 'Asia/Qatar',
      hasPrivateTerminal: true
    },
    { 
      id: 'RUH', 
      displayName: 'King Khalid International Airport (RUH)', 
      iataCode: 'RUH', 
      city: 'Riyadh', 
      country: 'Saudi Arabia',
      timezone: 'Asia/Riyadh',
      hasPrivateTerminal: true
    },
    { 
      id: 'JFK', 
      displayName: 'John F Kennedy International Airport (JFK)', 
      iataCode: 'JFK', 
      city: 'New York', 
      country: 'United States',
      timezone: 'America/New_York',
      hasPrivateTerminal: true
    },
    { 
      id: 'LAX', 
      displayName: 'Los Angeles International Airport (LAX)', 
      iataCode: 'LAX', 
      city: 'Los Angeles', 
      country: 'United States',
      timezone: 'America/Los_Angeles',
      hasPrivateTerminal: true
    },
    { 
      id: 'LHR', 
      displayName: 'Heathrow Airport (LHR)', 
      iataCode: 'LHR', 
      city: 'London', 
      country: 'United Kingdom',
      timezone: 'Europe/London',
      hasPrivateTerminal: true
    },
    { 
      id: 'CDG', 
      displayName: 'Charles de Gaulle Airport (CDG)', 
      iataCode: 'CDG', 
      city: 'Paris', 
      country: 'France',
      timezone: 'Europe/Paris',
      hasPrivateTerminal: true
    },
    { 
      id: 'HKG', 
      displayName: 'Hong Kong International Airport (HKG)', 
      iataCode: 'HKG', 
      city: 'Hong Kong', 
      country: 'China',
      timezone: 'Asia/Hong_Kong',
      hasPrivateTerminal: true
    },
    { 
      id: 'SIN', 
      displayName: 'Changi Airport (SIN)', 
      iataCode: 'SIN', 
      city: 'Singapore', 
      country: 'Singapore',
      timezone: 'Asia/Singapore',
      hasPrivateTerminal: true
    }
  ];

  if (!query || query.length < 2) {
    return { data: [] };
  }

  const filtered = popularAirports.filter(airport => 
    airport.city.toLowerCase().includes(query.toLowerCase()) ||
    airport.iataCode.toLowerCase().includes(query.toLowerCase()) ||
    airport.displayName.toLowerCase().includes(query.toLowerCase()) ||
    airport.country.toLowerCase().includes(query.toLowerCase())
  );

  return { data: filtered };
};

// Generate available time slots for a specific date
const generateTimeSlots = (preferredTime = null, date = null) => {
  const slots = [];
  const baseTime = preferredTime || '10:00';
  const [baseHour, baseMinute] = baseTime.split(':').map(Number);
  
  // Generate slots from 5 AM to 11 PM
  for (let hour = 5; hour <= 23; hour++) {
    // If we have a preferred time, prioritize slots around it
    if (!preferredTime || Math.abs(hour - baseHour) <= 3) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time: time,
          display: formatTimeForDisplay(time),
          available: true,
          isPeak: (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19),
          isPreferred: time === preferredTime
        });
      }
    }
  }
  
  return slots;
};

// Format time for display
const formatTimeForDisplay = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Main Service with Enhanced Time Support
export const AviapagesFlightService = {
  searchFlights: async (origin, destination, departureDate, departureTime = '08:00', returnDate = null, returnTime = '18:00', passengers = 1, flexibleTiming = false) => {
    try {
      console.log(`🔍 Searching flights with time support:`);
      console.log(`Route: ${origin} → ${destination}`);
      console.log(`Departure: ${departureDate} at ${departureTime}`);
      console.log(`Return: ${returnDate ? returnDate + ' at ' + returnTime : 'One way'}`);
      console.log(`Passengers: ${passengers}, Flexible: ${flexibleTiming}`);
      
      // Validate time format
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(departureTime)) {
        console.log('⚠️ Invalid departure time format, using 08:00');
        departureTime = '08:00';
      }
      
      if (returnDate && !timeRegex.test(returnTime)) {
        console.log('⚠️ Invalid return time format, using 18:00');
        returnTime = '18:00';
      }
      
      // Validate passenger count
      const passengerCount = Math.max(1, parseInt(passengers) || 1);
      
      // Always try real API first
      const realFlights = await fetchRealAviapagesFlights(
        origin, 
        destination, 
        departureDate, 
        departureTime,
        returnDate, 
        returnTime, 
        passengerCount, 
        flexibleTiming
      );
      
      if (realFlights && realFlights.data && realFlights.data.length > 0) {
         return {
          ...realFlights,
          searchParams: {
            origin,
            destination,
            departureDate,
            departureTime,
            returnDate,
            returnTime,
            passengers: passengerCount,
            flexibleTiming
          }
        };
      }
      
       const mockFlights = generateMockFlights(
        origin, 
        destination, 
        departureDate, 
        departureTime, 
        passengerCount, 
        flexibleTiming
      );
      
      // Add return leg if round trip
      if (returnDate) {
        const returnFlights = generateMockFlights(
          destination, 
          origin, 
          returnDate, 
          returnTime, 
          passengerCount, 
          flexibleTiming
        );
        
        // Combine flights for round trip display
        mockFlights.data = mockFlights.data.map((flight, index) => {
          const returnFlight = returnFlights.data[index] || returnFlights.data[0];
          return {
            ...flight,
            tripType: 'round_trip',
            itineraries: [
              flight.itineraries[0],
              ...(returnFlight ? [returnFlight.itineraries[0]] : [])
            ],
            pricing: {
              baseFare: flight.pricing.baseFare + (returnFlight ? returnFlight.pricing.baseFare : 0),
              serviceFee: flight.pricing.serviceFee + (returnFlight ? returnFlight.pricing.serviceFee : 0),
              total: flight.pricing.total + (returnFlight ? returnFlight.pricing.total : 0),
              currency: 'USD'
            },
            roundTrip: true
          };
        });
      }
      
      return {
        data: mockFlights.data,
        searchParams: {
          origin,
          destination,
          departureDate,
          departureTime,
          returnDate,
          returnTime,
          passengers: passengerCount,
          flexibleTiming
        },
        metadata: {
          source: 'ENHANCED_MOCK_WITH_TIME',
          timestamp: new Date().toISOString(),
          timezone: 'UTC',
          flexibleOptions: flexibleTiming ? '±2 hours' : 'Fixed schedule'
        }
      };

    } catch (error) {
       
      // Fallback to basic mock data
      const mockFlights = generateMockFlights(
        origin, 
        destination, 
        departureDate, 
        departureTime, 
        passengers, 
        false
      );
      
      return {
        data: mockFlights.data,
        searchParams: {
          origin,
          destination,
          departureDate,
          departureTime,
          passengers,
          flexibleTiming: false
        },
        metadata: {
          source: 'FALLBACK_MOCK',
          timestamp: new Date().toISOString(),
          error: error.message
        }
      };
    }
  },

  getCharterDetails: async (charterId, preferredTime = null) => {
    try {
      console.log(`🔍 Getting charter details for: ${charterId}`);
      if (preferredTime) {
        console.log(`With preferred time: ${preferredTime}`);
      }
      
      // Try real API first
      const realDetails = await fetchRealAviapagesFlights('', '', '', preferredTime, null, null, 1, false);
      
      if (realDetails && realDetails.data && realDetails.data.length > 0) {
         const charterData = realDetails.data[0];
        
        return {
          ...charterData,
          availableSlots: generateTimeSlots(preferredTime),
          _source: 'REAL_API',
          _timestamp: new Date().toISOString()
        };
      }
      
      console.log('🔄 Using enhanced mock charter data');
      const mockDetails = generateMockCharterDetails(charterId, preferredTime);
      
      return {
        ...mockDetails,
        _source: 'ENHANCED_MOCK',
        _timestamp: new Date().toISOString(),
        timeRequested: preferredTime
      };

    } catch (error) {
      console.error('❌ Charter details error:', error);
      const mockDetails = generateMockCharterDetails(charterId, preferredTime);
      
      return {
        ...mockDetails,
        _source: 'ERROR_FALLBACK',
        _error: error.message,
        _timestamp: new Date().toISOString()
      };
    }
  },

  searchAirports: async (query) => {
    return await searchAirportsFallback(query);
  },

  testApiConnection: async () => {
    return await verifyApiToken();
  },
  
  // New method: Get available time slots for flexible scheduling
  getAvailableTimeSlots: async (charterId, date, preferredTime = null) => {
    try {
      console.log(`⏰ Getting time slots for ${charterId} on ${date}`);
      
      const slots = generateTimeSlots(preferredTime, date);
      
      return {
        success: true,
        data: slots,
        charterId,
        date,
        preferredTime,
        note: 'Private jets offer flexible scheduling. These times show availability for your selected date.'
      };
    } catch (error) {
      console.error('Error getting time slots:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  },
  
  // New method: Validate time preference
  validateTimePreference: (time, flexible = false) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    
    if (!timeRegex.test(time)) {
      return {
        valid: false,
        message: 'Invalid time format. Please use HH:MM format (24-hour).',
        suggested: '08:00'
      };
    }
    
    const [hours] = time.split(':').map(Number);
    
    if (hours < 5 || hours > 23) {
      return {
        valid: false,
        message: 'Private jet operations are typically from 5:00 AM to 11:00 PM.',
        suggested: hours < 5 ? '05:00' : '22:00'
      };
    }
    
    return {
      valid: true,
      message: flexible ? 
        'Time preference noted. We will show options within ±2 hours.' : 
        'Fixed time preference set.',
      operational: hours >= 5 && hours <= 23
    };
  },
  
  // New method: Calculate price with time flexibility
  calculateFlexiblePricing: (basePrice, isExactTime = false, timeAdjustment = 0) => {
    let multiplier = 1.0;
    
    if (isExactTime) {
      multiplier = 1.1; // 10% premium for exact time
    } else if (Math.abs(timeAdjustment) === 1) {
      multiplier = 1.0; // Normal price for ±1 hour
    } else if (Math.abs(timeAdjustment) === 2) {
      multiplier = 0.9; // 10% discount for ±2 hours
    }
    
    return Math.round(basePrice * multiplier);
  }
};

export default AviapagesFlightService; 

