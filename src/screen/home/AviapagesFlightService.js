 
// const AVIA_PAGE_BASE_URL = 'https://api.aviapages.com';
// const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';

// export const AviapagesFlightService = {
//   // Search flights using Aviapages API - FIXED VERSION
//   searchFlights: async (origin, destination, departureDate, returnDate, passengers) => {
//     try {
//       console.log('🔍 Searching flights with Aviapages API...');
//       console.log('📋 Params:', { origin, destination, departureDate, returnDate, passengers });

//       // पहले mock data return करते हैं ताकि app काम करता रहे
//       const mockFlights = generateMockFlights(origin, destination, departureDate, passengers);
      
//       // साथ में actual API call भी try करते हैं
//       try {
//         const apiResult = await tryActualAviapagesAPI(origin, destination, departureDate, passengers);
//         if (apiResult.data && apiResult.data.length > 0) {
//           return apiResult;
//         }
//       } catch (apiError) {
//         console.log('⚠️ API call failed, using mock data:', apiError.message);
//       }

//       return mockFlights;

//     } catch (error) {
//       console.error('❌ Error in flight search:', error);
//       // Fallback to mock data
//       return generateMockFlights(origin, destination, departureDate, passengers);
//     }
//   },

//   // Search airports
//   searchAirports: async (query) => {
//     try {
//       return await searchAirportsFallback(query);
//     } catch (error) {
//       console.error('Error searching airports:', error);
//       return { data: [] };
//     }
//   }
// };

// // Actual API call - CORRECTED ENDPOINT
// const tryActualAviapagesAPI = async (origin, destination, departureDate, passengers) => {
//   try {
//     console.log('🌐 Trying actual Aviapages API...');
    
//     // CORRECTED API endpoints
//     const endpoints = [
//       // Try different possible endpoints
//       `${AVIA_PAGE_BASE_URL}/api/v1/aircraft/search`,
//       `${AVIA_PAGE_BASE_URL}/v1/aircraft/search`,
//       `${AVIA_PAGE_BASE_URL}/api/aircraft/search`,
//       `${AVIA_PAGE_BASE_URL}/aircraft/search`
//     ];

//     const searchParams = {
//       departure: origin,
//       arrival: destination,
//       date: departureDate,
//       passengers: passengers,
//       limit: 10
//     };

//     let lastError = null;

//     // Try all possible endpoints
//     for (const endpoint of endpoints) {
//       try {
//         const queryString = new URLSearchParams(searchParams).toString();
//         const url = `${endpoint}?${queryString}`;

//         console.log('🔧 Trying endpoint:', url);

//         const response = await fetch(url, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${API_TOKEN}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//           },
//           timeout: 10000
//         });

//         if (response.ok) {
//           const data = await response.json();
//           console.log('✅ API success with endpoint:', endpoint);
          
//           if (data && data.aircrafts && data.aircrafts.length > 0) {
//             return transformAviapagesResponse(data, origin, destination);
//           }
//         } else {
//           console.log(`❌ Endpoint ${endpoint} failed: ${response.status}`);
//         }
//       } catch (endpointError) {
//         lastError = endpointError;
//         console.log(`❌ Endpoint ${endpoint} error:`, endpointError.message);
//         continue; // Try next endpoint
//       }
//     }

//     throw lastError || new Error('All API endpoints failed');

//   } catch (error) {
//     console.error('❌ All API attempts failed:', error);
//     throw error;
//   }
// };

// // Generate realistic mock flights
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

// // Transform Aviapages API response to match Amadeus format
// const transformAviapagesResponse = (aviapagesData, origin, destination) => {
//   try {
//     console.log('🔄 Transforming API data to Amadeus format...');

//     if (!aviapagesData.aircrafts || aviapagesData.aircrafts.length === 0) {
//       return { data: [] };
//     }

//     const transformedFlights = aviapagesData.aircrafts.map((aircraft, index) => {
//       // Create flight data in Amadeus format
//       return {
//         id: aircraft.id || `flight-${index}-${Date.now()}`,
//         type: 'flight-offer',
//         source: 'AVIAPAGES',
        
//         price: {
//           currency: 'USD',
//           total: calculateFlightPrice(aircraft, origin, destination),
//           base: calculateFlightPrice(aircraft, origin, destination) * 0.7
//         },
        
//         itineraries: [
//           {
//             duration: calculateFlightDuration(origin, destination),
//             segments: [
//               {
//                 departure: {
//                   iataCode: origin,
//                   at: generateFlightTime(8, 20),
//                   terminal: '1'
//                 },
//                 arrival: {
//                   iataCode: destination,
//                   at: generateArrivalTime(generateFlightTime(8, 20), origin, destination),
//                   terminal: '1'
//                 },
//                 carrierCode: 'PJ',
//                 number: `PJ${Math.floor(100 + Math.random() * 900)}`,
//                 aircraft: {
//                   code: aircraft.model || 'PJT'
//                 },
//                 operating: {
//                   carrierCode: 'PJ'
//                 },
//                 duration: calculateFlightDuration(origin, destination),
//                 id: `segment-${index}`,
//                 numberOfStops: 0,
//                 blacklistedInEU: false
//               }
//             ]
//           }
//         ],
        
//         pricingOptions: {
//           fareType: ['PUBLISHED'],
//           includedCheckedBagsOnly: true
//         },
        
//         validatingAirlineCodes: ['PJ'],
//         travelerPricings: [
//           {
//             travelerId: '1',
//             fareOption: 'STANDARD',
//             travelerType: 'ADULT',
//             price: {
//               currency: 'USD',
//               total: calculateFlightPrice(aircraft, origin, destination),
//               base: calculateFlightPrice(aircraft, origin, destination) * 0.7
//             },
//             fareDetailsBySegment: [
//               {
//                 segmentId: `segment-${index}`,
//                 cabin: 'BUSINESS',
//                 fareBasis: 'PRO',
//                 class: 'J',
//                 includedCheckedBags: {
//                   quantity: 2
//                 }
//               }
//             ]
//           }
//         ],
        
//         aircraftInfo: {
//           name: aircraft.name || `${aircraft.manufacturer || 'Private'} ${aircraft.model || 'Jet'}`,
//           manufacturer: aircraft.manufacturer,
//           model: aircraft.model,
//           year: aircraft.year,
//           seats: aircraft.pax || aircraft.passengers || 8,
//           speed: aircraft.cruise_speed ? `${aircraft.cruise_speed} km/h` : '800 km/h',
//           range: aircraft.range ? `${aircraft.range} km` : '4000 km',
//           image: getAircraftImage(aircraft.model),
//           features: getAircraftFeatures(aircraft.pax || 8)
//         }
//       };
//     });

//     console.log(`✅ Transformed ${transformedFlights.length} flights to Amadeus format`);
//     return { data: transformedFlights };

//   } catch (error) {
//     console.error('Error transforming response:', error);
//     return { data: [] };
//   }
// };

// // Calculate flight price based on aircraft and route
// const calculateFlightPrice = (aircraft, origin, destination) => {
//   return calculateBasePrice(origin, destination, aircraft.pax || 8);
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
//     airport.city.toLowerCase().includes(query.toLowerCase()) ||
//     airport.iataCode.toLowerCase().includes(query.toLowerCase()) ||
//     airport.displayName.toLowerCase().includes(query.toLowerCase()) ||
//     airport.country.toLowerCase().includes(query.toLowerCase())
//   );

//   return { data: filteredAirports };
// };

// // For backward compatibility
// export const FlightService = AviapagesFlightService;




// AviapagesFlightService.js

const AVIA_PAGE_BASE_URL = 'https://api.aviapages.com';
const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';

// API Token Verification Function
const verifyApiToken = async () => {
  try {
    console.log('🔐 Verifying API token...');
    
    // Try different authentication endpoints
    const authEndpoints = [
      `${AVIA_PAGE_BASE_URL}/api/v1/auth/verify`,
      `${AVIA_PAGE_BASE_URL}/api/v1/auth/check`,
      `${AVIA_PAGE_BASE_URL}/api/v1/profile`,
      `${AVIA_PAGE_BASE_URL}/api/v1/health`
    ];

    for (const endpoint of authEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('✅ API Token is valid');
          return true;
        }
      } catch (error) {
        console.log(`❌ Endpoint ${endpoint} failed:`, error.message);
        continue;
      }
    }

    console.log('❌ All authentication endpoints failed');
    return false;
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return false;
  }
};

// Real API Call Function
const fetchRealAviapagesFlights = async (origin, destination, departureDate, returnDate, passengers) => {
  try {
    console.log('🚀 Fetching REAL flights from Aviapages...');

    // Aviapages API के according parameters
    const requestData = {
      departure_airport: origin,
      arrival_airport: destination,
      departure_date: departureDate,
      passengers: parseInt(passengers) || 1,
      trip_type: returnDate ? 'round_trip' : 'one_way',
      ...(returnDate && { return_date: returnDate })
    };

    console.log('📤 API Request:', requestData);

    // Try different flight search endpoints
    const flightEndpoints = [
      `${AVIA_PAGE_BASE_URL}/api/v1/charter/flights/search`,
      `${AVIA_PAGE_BASE_URL}/api/v1/flights/search`,
      `${AVIA_PAGE_BASE_URL}/api/v1/aircraft/search`,
      `${AVIA_PAGE_BASE_URL}/api/charter/flights`
    ];

    let lastError = null;

    for (const endpoint of flightEndpoints) {
      try {
        console.log(`🔧 Trying endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestData)
        });

        console.log('📥 API Response Status:', response);

        if (response.ok) {
          const apiData = await response.json();
            
          // Transform Aviapages format to our app format
          return transformRealAviapagesResponse(apiData, origin, destination, passengers);
        } else {
          const errorText = await response.text();
          console.log(`❌ Endpoint ${endpoint} failed: ${response.status} - ${errorText}`);
          lastError = new Error(`API Error: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.log(`❌ Endpoint ${endpoint} error:`, error.message);
        lastError = error;
        continue;
      }
    }

    throw lastError || new Error('All flight search endpoints failed');

  } catch (error) {
    console.error('❌ Real API call failed:', error);
    throw error;
  }
};

// Real API Response Transformer
const transformRealAviapagesResponse = (apiData, origin, destination, passengers) => {
  try {
 
    // Check different possible response formats
    const flights = apiData.flights || apiData.aircrafts || apiData.data || apiData.results || [];
    
    if (flights.length === 0) {
      console.log('No flights data in API response');
      return { data: [] };
    }

    console.log(`📊 Found ${flights.length} flights in API response`);

    const transformedFlights = flights.map((flight, index) => {
      // Calculate price based on real data
      const totalPrice = flight.price?.total || 
                        flight.quote_amount || 
                        flight.cost ||
                        flight.price ||
                        calculateDynamicPrice(flight, passengers);

      // Get aircraft information
      const aircraft = flight.aircraft || flight.aircraft_details || {};
      const operator = flight.operator || flight.operator_details || {};

      return {
        id: flight.id || `real-flight-${index}-${Date.now()}`,
        type: 'flight-offer',
        source: 'AVIAPAGES_REAL',
        lastTicketingDate: new Date().toISOString().split('T')[0],
        numberOfBookableSeats: flight.available_seats || passengers,
        
        price: {
          currency: flight.price?.currency || 'USD',
          total: totalPrice,
          base: Math.round(totalPrice * 0.7),
          taxes: Math.round(totalPrice * 0.3)
        },
        
        itineraries: [
          {
            duration: formatFlightDuration(flight.duration_minutes),
            segments: [
              {
                departure: {
                  iataCode: origin,
                  at: flight.departure_time || generateFlightTime(8, 20),
                  terminal: flight.departure_terminal || '1'
                },
                arrival: {
                  iataCode: destination,
                  at: flight.arrival_time || generateArrivalTime(flight.departure_time, origin, destination),
                  terminal: flight.arrival_terminal || '1'
                },
                carrierCode: operator.code || 'PJ',
                number: flight.flight_number || `PJ${Math.floor(100 + Math.random() * 900)}`,
                aircraft: {
                  code: aircraft.model || 'PJT'
                },
                operating: {
                  carrierCode: operator.code || 'PJ'
                },
                duration: formatFlightDuration(flight.duration_minutes),
                id: `real-segment-${index}`,
                numberOfStops: flight.stops || 0,
                blacklistedInEU: false
              }
            ]
          }
        ],
        
        pricingOptions: {
          fareType: ['PUBLISHED'],
          includedCheckedBagsOnly: true
        },
        
        validatingAirlineCodes: [operator.code || 'PJ'],
        travelerPricings: generateTravelerPricings(totalPrice, passengers),
        
        // Real aircraft information
        aircraftInfo: {
          name: aircraft.name || `${aircraft.manufacturer || 'Private'} ${aircraft.model || 'Jet'}`,
          manufacturer: aircraft.manufacturer,
          model: aircraft.model,
          year: aircraft.year,
          seats: aircraft.max_passengers || flight.available_seats || passengers,
          speed: aircraft.cruise_speed ? `${aircraft.cruise_speed} km/h` : '800 km/h',
          range: aircraft.range ? `${aircraft.range} km` : '4000 km',
          image: getAircraftImage(aircraft.model),
          features: getAircraftFeatures(aircraft.max_passengers || passengers),
          airline: operator.name || 'Private Jet',
          airlineLogo: operator.logo || getAirlineLogo(operator.code)
        },

        // Real availability and booking info
        realTimeData: {
          available: flight.available !== undefined ? flight.available : true,
          instantConfirm: flight.instant_confirmation || true,
          operator: operator,
          aircraft: aircraft,
          actualPrice: flight.price,
          bookingUrl: flight.booking_url,
          terms: flight.terms_conditions
        }
      };
    });

     return { data: transformedFlights };

  } catch (error) {
    console.error('Error transforming real API response:', error);
    return { data: [] };
  }
};

// Supporting Functions
const formatFlightDuration = (minutes) => {
  if (!minutes) return 'PT2H0M';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `PT${hours}H${mins}M`;
};

const calculateDynamicPrice = (flight, passengers) => {
  const basePrice = 3000;
  const passengerMultiplier = Math.max(1, passengers / 4);
  return Math.round(basePrice * passengerMultiplier * (0.8 + Math.random() * 0.4));
};

const generateTravelerPricings = (totalPrice, passengers) => {
  const travelerPricings = [];
  const pricePerPerson = Math.round(totalPrice / Math.max(1, passengers));
  
  for (let i = 1; i <= passengers; i++) {
    travelerPricings.push({
      travelerId: i.toString(),
      fareOption: 'STANDARD',
      travelerType: 'ADULT',
      price: {
        currency: 'USD',
        total: pricePerPerson,
        base: Math.round(pricePerPerson * 0.7)
      },
      fareDetailsBySegment: [
        {
          segmentId: `real-segment-${i}`,
          cabin: 'BUSINESS',
          fareBasis: 'PRO',
          class: 'J',
          includedCheckedBags: {
            quantity: 2
          }
        }
      ]
    });
  }
  
  return travelerPricings;
};

const searchRealAirports = async (query) => {
  try {
    const response = await fetch(`${AVIA_PAGE_BASE_URL}/api/v1/airports/search?query=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
console.log("response --- >>>>",response)
    if (response.ok) {
      const data = await response.json();
      return transformAirportResponse(data);
    }
    throw new Error('Airport search failed');
  } catch (error) {
    console.error('Real airport search error:', error);
    return searchAirportsFallback(query);
  }
};

const transformAirportResponse = (apiData) => {
  console.log("apiData --- >>>>",apiData)

  if (!apiData.airports) return { data: [] };
  
  const transformedAirports = apiData.airports.map(airport => ({
    id: airport.id,
    displayName: `${airport.name} (${airport.iata_code})`,
    iataCode: airport.iata_code,
    city: airport.city,
    country: airport.country,
    subType: 'AIRPORT'
  }));
  
  return { data: transformedAirports };
};

// Generate realistic mock flights (Fallback)
const generateMockFlights = (origin, destination, departureDate, passengers) => {
  console.log('🔄 Generating mock flight data...');
  
  const airlines = [
    { code: 'EK', name: 'Emirates', logo: 'https://img.freepik.com/free-vector/gradient-abstract-emirates-logo_23-2148442607.jpg' },
    { code: 'EY', name: 'Etihad Airways', logo: 'https://img.freepik.com/free-vector/etihad-airways-logo_23-2148442608.jpg' },
    { code: 'QR', name: 'Qatar Airways', logo: 'https://img.freepik.com/free-vector/qatar-airways-logo_23-2148442609.jpg' },
    { code: 'SV', name: 'Saudia', logo: 'https://img.freepik.com/free-vector/saudia-airlines-logo_23-2148442610.jpg' }
  ];

  const aircraftTypes = [
    { model: 'G650', manufacturer: 'Gulfstream', seats: 14, range: '12,000 km', speed: '956 km/h' },
    { model: 'Challenger 350', manufacturer: 'Bombardier', seats: 10, range: '5,900 km', speed: '870 km/h' },
    { model: 'Falcon 8X', manufacturer: 'Dassault', seats: 12, range: '11,900 km', speed: '900 km/h' },
    { model: 'Phenom 300', manufacturer: 'Embraer', seats: 8, range: '3,650 km', speed: '835 km/h' }
  ];

  const mockFlights = [];

  // Generate 5-8 mock flights
  const flightCount = 5 + Math.floor(Math.random() * 3);

  for (let i = 0; i < flightCount; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
    
    // Calculate base price based on route and aircraft
    let basePrice = calculateBasePrice(origin, destination, aircraft.seats);
    
    // Add some random variation
    const finalPrice = Math.round(basePrice * (0.9 + Math.random() * 0.3));
    
    // Generate flight times
    const departureTime = generateFlightTime(8, 20); // Between 8 AM and 8 PM
    const arrivalTime = generateArrivalTime(departureTime, origin, destination);
    
    const flight = {
      id: `flight-${i}-${Date.now()}`,
      type: 'flight-offer',
      source: 'AVIAPAGES',
      
      price: {
        currency: 'USD',
        total: finalPrice,
        base: Math.round(finalPrice * 0.7)
      },
      
      itineraries: [
        {
          duration: calculateFlightDuration(origin, destination),
          segments: [
            {
              departure: {
                iataCode: origin,
                at: departureTime,
                terminal: '1'
              },
              arrival: {
                iataCode: destination,
                at: arrivalTime,
                terminal: '1'
              },
              carrierCode: airline.code,
              number: `${airline.code}${Math.floor(1000 + Math.random() * 9000)}`,
              aircraft: {
                code: aircraft.model
              },
              operating: {
                carrierCode: airline.code
              },
              duration: calculateFlightDuration(origin, destination),
              id: `segment-${i}`,
              numberOfStops: 0,
              blacklistedInEU: false
            }
          ]
        }
      ],
      
      pricingOptions: {
        fareType: ['PUBLISHED'],
        includedCheckedBagsOnly: true
      },
      
      validatingAirlineCodes: [airline.code],
      travelerPricings: [
        {
          travelerId: '1',
          fareOption: 'STANDARD',
          travelerType: 'ADULT',
          price: {
            currency: 'USD',
            total: finalPrice,
            base: Math.round(finalPrice * 0.7)
          },
          fareDetailsBySegment: [
            {
              segmentId: `segment-${i}`,
              cabin: 'BUSINESS',
              fareBasis: 'PRO',
              class: 'J',
              includedCheckedBags: {
                quantity: 2
              }
            }
          ]
        }
      ],
      
      aircraftInfo: {
        name: `${aircraft.manufacturer} ${aircraft.model}`,
        manufacturer: aircraft.manufacturer,
        model: aircraft.model,
        year: 2015 + Math.floor(Math.random() * 8),
        seats: aircraft.seats,
        speed: aircraft.speed,
        range: aircraft.range,
        image: getAircraftImage(aircraft.model),
        features: getAircraftFeatures(aircraft.seats),
        airline: airline.name,
        airlineLogo: airline.logo
      }
    };
    
    mockFlights.push(flight);
  }

  // Sort by price
  mockFlights.sort((a, b) => a.price.total - b.price.total);

  console.log(`✅ Generated ${mockFlights.length} mock flights`);
  return { data: mockFlights };
};

// Calculate base price based on route and aircraft
const calculateBasePrice = (origin, destination, seats) => {
  let basePrice = 3000; // Default base price
  
  // Route-based pricing
  const routePrices = {
    'DXB-AUH': 2500,
    'DXB-DOH': 4000,
    'DXB-RUH': 3500,
    'JFK-LAX': 8000,
    'LHR-CDG': 4500,
    'default': 5000
  };
  
  const route = `${origin}-${destination}`;
  basePrice = routePrices[route] || routePrices.default;
  
  // Adjust for aircraft size
  if (seats <= 6) basePrice *= 0.8;
  else if (seats <= 10) basePrice *= 1.0;
  else basePrice *= 1.3;
  
  return basePrice;
};

// Generate departure time
const generateFlightTime = (startHour, endHour) => {
  const date = new Date();
  date.setHours(startHour + Math.floor(Math.random() * (endHour - startHour)));
  date.setMinutes(Math.floor(Math.random() * 12) * 5); // Multiple of 5 minutes
  return date.toISOString();
};

// Generate arrival time based on departure and route
const generateArrivalTime = (departureTime, origin, destination) => {
  const depTime = new Date(departureTime);
  const duration = getRouteDuration(origin, destination);
  
  depTime.setHours(depTime.getHours() + duration.hours);
  depTime.setMinutes(depTime.getMinutes() + duration.minutes);
  
  return depTime.toISOString();
};

// Get route duration in hours and minutes
const getRouteDuration = (origin, destination) => {
  const routeDurations = {
    'DXB-AUH': { hours: 1, minutes: 0 },
    'DXB-DOH': { hours: 1, minutes: 15 },
    'DXB-RUH': { hours: 1, minutes: 30 },
    'JFK-LAX': { hours: 6, minutes: 0 },
    'LHR-CDG': { hours: 1, minutes: 15 },
    'default': { hours: 2, minutes: 30 }
  };
  
  const route = `${origin}-${destination}`;
  return routeDurations[route] || routeDurations.default;
};

// Calculate flight duration for Amadeus format
const calculateFlightDuration = (origin, destination) => {
  const duration = getRouteDuration(origin, destination);
  return `PT${duration.hours}H${duration.minutes}M`;
};

// Get aircraft image
const getAircraftImage = (model) => {
  const images = {
    'G650': 'https://img.freepik.com/free-photo/luxury-private-jet-flying-sky_53876-133587.jpg',
    'Challenger 350': 'https://img.freepik.com/free-photo/private-jet-airport_53876-101155.jpg',
    'Falcon 8X': 'https://img.freepik.com/free-photo/airplane-aircraft-travel-trip_53876-30273.jpg',
    'Phenom 300': 'https://img.freepik.com/free-photo/business-jet-flying-cloudy-sky_53876-133588.jpg'
  };
  
  return images[model] || 'https://img.freepik.com/free-photo/luxury-private-jet-flying-sky_53876-133587.jpg';
};

// Get aircraft features
const getAircraftFeatures = (seats) => {
  const baseFeatures = ['WiFi', 'Entertainment System', 'Luxury Seating', 'Refreshments'];
  
  if (seats > 8) {
    baseFeatures.push('Conference Table', 'Private Suite');
  }
  
  if (seats > 12) {
    baseFeatures.push('Shower', 'Full Galley');
  }
  
  return baseFeatures;
};

// Get airline logo
const getAirlineLogo = (airlineCode) => {
  const logos = {
    'EK': 'https://img.freepik.com/free-vector/gradient-abstract-emirates-logo_23-2148442607.jpg',
    'EY': 'https://img.freepik.com/free-vector/etihad-airways-logo_23-2148442608.jpg',
    'QR': 'https://img.freepik.com/free-vector/qatar-airways-logo_23-2148442609.jpg',
    'SV': 'https://img.freepik.com/free-vector/saudia-airlines-logo_23-2148442610.jpg',
    'PJ': 'https://img.freepik.com/free-vector/private-jet-logo_23-2148442611.jpg'
  };
  
  return logos[airlineCode] || 'https://img.freepik.com/free-vector/private-jet-logo_23-2148442611.jpg';
};

// Airport search fallback
const searchAirportsFallback = async (query) => {
  const popularAirports = [
    // North America
    { id: 'JFK', displayName: 'John F Kennedy International Airport (JFK)', iataCode: 'JFK', city: 'New York', country: 'United States', subType: 'AIRPORT' },
    { id: 'LAX', displayName: 'Los Angeles International Airport (LAX)', iataCode: 'LAX', city: 'Los Angeles', country: 'United States', subType: 'AIRPORT' },
    { id: 'ORD', displayName: "Chicago O'Hare International Airport (ORD)", iataCode: 'ORD', city: 'Chicago', country: 'United States', subType: 'AIRPORT' },
    { id: 'YYZ', displayName: 'Toronto Pearson International Airport (YYZ)', iataCode: 'YYZ', city: 'Toronto', country: 'Canada', subType: 'AIRPORT' },
    
    // Middle East
    { id: 'DXB', displayName: 'Dubai International Airport (DXB)', iataCode: 'DXB', city: 'Dubai', country: 'United Arab Emirates', subType: 'AIRPORT' },
    { id: 'AUH', displayName: 'Abu Dhabi International Airport (AUH)', iataCode: 'AUH', city: 'Abu Dhabi', country: 'United Arab Emirates', subType: 'AIRPORT' },
    { id: 'DOH', displayName: 'Hamad International Airport (DOH)', iataCode: 'DOH', city: 'Doha', country: 'Qatar', subType: 'AIRPORT' },
    { id: 'RUH', displayName: 'King Khalid International Airport (RUH)', iataCode: 'RUH', city: 'Riyadh', country: 'Saudi Arabia', subType: 'AIRPORT' },
    
    // Europe
    { id: 'LHR', displayName: 'Heathrow Airport (LHR)', iataCode: 'LHR', city: 'London', country: 'United Kingdom', subType: 'AIRPORT' },
    { id: 'CDG', displayName: 'Charles de Gaulle Airport (CDG)', iataCode: 'CDG', city: 'Paris', country: 'France', subType: 'AIRPORT' },
    { id: 'FRA', displayName: 'Frankfurt Airport (FRA)', iataCode: 'FRA', city: 'Frankfurt', country: 'Germany', subType: 'AIRPORT' },
    { id: 'AMS', displayName: 'Amsterdam Schiphol Airport (AMS)', iataCode: 'AMS', city: 'Amsterdam', country: 'Netherlands', subType: 'AIRPORT' },
    
    // Asia
    { id: 'DEL', displayName: 'Indira Gandhi International Airport (DEL)', iataCode: 'DEL', city: 'Delhi', country: 'India', subType: 'AIRPORT' },
    { id: 'BOM', displayName: 'Chhatrapati Shivaji Maharaj International Airport (BOM)', iataCode: 'BOM', city: 'Mumbai', country: 'India', subType: 'AIRPORT' },
    { id: 'SIN', displayName: 'Changi Airport (SIN)', iataCode: 'SIN', city: 'Singapore', country: 'Singapore', subType: 'AIRPORT' },
    { id: 'BKK', displayName: 'Suvarnabhumi Airport (BKK)', iataCode: 'BKK', city: 'Bangkok', country: 'Thailand', subType: 'AIRPORT' },
  ];

  if (!query || query.length < 2) {
    return { data: [] };
  }

  const filteredAirports = popularAirports.filter(airport => 
    airport?.city?.toLowerCase().includes(query.toLowerCase()) ||
    airport.iataCode.toLowerCase().includes(query.toLowerCase()) ||
    airport.displayName.toLowerCase().includes(query.toLowerCase()) ||
    airport.country.toLowerCase().includes(query.toLowerCase())
  );

  return { data: filteredAirports };
};

// Main Service Export
export const AviapagesFlightService = {
  // Search flights using REAL Aviapages API
  searchFlights: async (origin, destination, departureDate, returnDate, passengers) => {
    try {
  
      // पहले API token verify करें
      const isTokenValid = await verifyApiToken();
      if (!isTokenValid) {
        console.log('⚠️ Using mock data due to invalid token');
        return generateMockFlights(origin, destination, departureDate, passengers);
      }

      // Real API call करें
      const realFlights = await fetchRealAviapagesFlights(origin, destination, departureDate, returnDate, passengers);
      
      if (realFlights.data && realFlights.data.length > 0) {
        console.log(`✅ Found ${realFlights.data.length} real flights`);
        return realFlights;
      } else {
        console.log('⚠️ No real flights found, using mock data');
        return generateMockFlights(origin, destination, departureDate, passengers);
      }

    } catch (error) {
      console.error('❌ Error in flight search:', error);
      return generateMockFlights(origin, destination, departureDate, passengers);
    }
  },

  // Search airports - REAL API
  searchAirports: async (query) => {
    try {
      // const isTokenValid = await verifyApiToken();
      // if (!isTokenValid) {
      //   return await searchAirportsFallback(query);
      // }
       searchAirportsFallback(query);

      return await searchRealAirports(query);
    } catch (error) {
       return await searchAirportsFallback(query);
    }
  },

  // Get aircraft details
  getAircraftDetails: async (aircraftId) => {
    try {
      const response = await fetch(`${AVIA_PAGE_BASE_URL}/api/v1/aircraft/${aircraftId}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch aircraft details');
    } catch (error) {
      console.error('Error fetching aircraft details:', error);
      return null;
    }
  },

  // Test API connection
  testApiConnection: async () => {
    return await verifyApiToken();
  }
};

// For backward compatibility
export const FlightService = AviapagesFlightService;

export default AviapagesFlightService;