import { getCharterAircraft, calculateCharterPrice, calculateFlightTime, searchCharterAircraft } from '../../Aviapages/api';

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

// Fetch ALL charter aircraft from REAL API
const fetchAllCharterAircraft = async (origin, destination, departureDate, departureTime, passengers) => {
  try {
    console.log('🛩️ Fetching ALL charter aircraft from REAL Aviapages API...');
    
    // Get ALL available charter aircraft (no pagination limit)
    const charterAircraftResponse = await getCharterAircraft({
      // Request more results to show all options
      page_size: 100,
      ordering: '-year_of_manufacture', // Newest first
    });
    
    console.log('📥 Charter Aircraft API Response:', charterAircraftResponse?.results?.length || charterAircraftResponse?.length || 0, 'aircraft found');
    
    const allAircraft = charterAircraftResponse?.results || charterAircraftResponse || [];
    
    if (allAircraft.length === 0) {
      console.log('⚠️ No aircraft from API, will use enhanced mock data');
      return null;
    }
    
    // Try to get flight time calculation for pricing
    let flightDuration = { hours: 2, minutes: 30 };
    try {
      const flightTimeResponse = await calculateFlightTime(origin, destination);
      if (flightTimeResponse?.flight_time) {
        const totalMinutes = flightTimeResponse.flight_time;
        flightDuration = {
          hours: Math.floor(totalMinutes / 60),
          minutes: totalMinutes % 60
        };
      }
    } catch (error) {
      console.log('⚠️ Could not calculate flight time, using estimate');
    }
    
    // Transform ALL aircraft to flight format
    const flights = allAircraft.map((aircraft, index) => {
      // Calculate price based on aircraft data
      const hourlyRate = aircraft.hourly_rate || aircraft.price_per_hour || 5000;
      const estimatedFlightHours = flightDuration.hours + (flightDuration.minutes / 60);
      let basePrice = Math.round(hourlyRate * estimatedFlightHours * (1 + (passengers / 15)));
      basePrice = Math.round(basePrice / 100) * 100; // Round to nearest 100
      
      // Create departure datetime
      const departureDateTime = new Date(departureDate);
      const [hours, minutes] = departureTime.split(':').map(Number);
      departureDateTime.setHours(hours, minutes, 0, 0);
      
      // Calculate arrival time
      const arrivalDateTime = new Date(departureDateTime);
      arrivalDateTime.setHours(arrivalDateTime.getHours() + flightDuration.hours);
      arrivalDateTime.setMinutes(arrivalDateTime.getMinutes() + flightDuration.minutes);
      
      // Get aircraft images
      const images = aircraft.photos?.map(p => p.url || p.image) || 
                     aircraft.images || 
                     getDefaultAircraftImages(aircraft.aircraft_class || aircraft.type);
      
      return {
        id: `charter-${aircraft.id || index}`,
        type: 'charter-flight',
        source: 'AVIAPAGES_REAL_API',
        timestamp: new Date().toISOString(),
        
        price: {
          currency: aircraft.currency || 'USD',
          total: basePrice,
          base: Math.round(basePrice * 0.88)
        },
        
        itineraries: [
          {
            duration: `PT${flightDuration.hours}H${flightDuration.minutes}M`,
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
                  terminal: 'Private Terminal'
                },
                carrierCode: aircraft.operator?.code || 'PJ',
                number: `PJ${1000 + index}`,
                aircraft: {
                  code: aircraft.aircraft_type?.name || aircraft.type || 'Private Jet',
                  name: `${aircraft.aircraft_type?.manufacturer || aircraft.manufacturer || ''} ${aircraft.aircraft_type?.name || aircraft.model || 'Charter Aircraft'}`
                },
                duration: `PT${flightDuration.hours}H${flightDuration.minutes}M`,
                id: `segment-${index}`,
                numberOfStops: 0,
                operatingCarrier: aircraft.operator?.name || aircraft.company_name || 'Private Charter'
              }
            ]
          }
        ],
        
        aircraftInfo: {
          id: aircraft.id,
          name: aircraft.aircraft_type?.name || aircraft.model || 'Private Jet',
          manufacturer: aircraft.aircraft_type?.manufacturer || aircraft.manufacturer || '',
          model: aircraft.aircraft_type?.name || aircraft.model || '',
          year: aircraft.year_of_manufacture || aircraft.year || 2020,
          seats: aircraft.pax || aircraft.max_passengers || aircraft.seats || 8,
          speed: aircraft.aircraft_type?.speed ? `${aircraft.aircraft_type.speed} km/h` : '850 km/h',
          range: aircraft.aircraft_type?.range ? `${aircraft.aircraft_type.range} km` : '5000 km',
          images: images,
          features: getAircraftFeatures(aircraft),
          airline: aircraft.operator?.name || aircraft.company_name || 'Private Charter',
          airlineLogo: aircraft.operator?.logo || aircraft.company_logo || '',
          hourlyRate: hourlyRate,
          category: aircraft.aircraft_class || aircraft.type || 'Private Jet',
          registration: aircraft.registration || aircraft.tail_number || '',
          homeBase: aircraft.home_base?.name || aircraft.base_airport || '',
          availability: 'Available',
          instantConfirmation: aircraft.instant_book || false,
          // Additional real data
          realAircraftId: aircraft.id,
          companyId: aircraft.company_id || aircraft.operator?.id,
        },
        
        timeDetails: {
          requestedTime: departureTime,
          actualTime: departureTime,
          adjustment: 0,
          isExactMatch: true,
          flexibleOption: true
        }
      };
    });
    
    // Add service fee to all flights
    const flightsWithFees = flights.map(flight => addServiceFeeToFlight(flight));
    
    // Sort by price (lowest first)
    flightsWithFees.sort((a, b) => a.pricing.total - b.pricing.total);
    
    console.log(`✅ Transformed ${flightsWithFees.length} REAL charter aircraft into flight options`);
    
    return { data: flightsWithFees };
    
  } catch (error) {
    console.error('❌ Error fetching charter aircraft:', error);
    return null;
  }
};

// Get aircraft features from API data
const getAircraftFeatures = (aircraft) => {
  const features = [];
  
  if (aircraft.wifi || aircraft.has_wifi) features.push('WiFi');
  if (aircraft.entertainment) features.push('Entertainment System');
  if (aircraft.galley || aircraft.has_galley) features.push('Full Galley');
  if (aircraft.lavatory || aircraft.has_lavatory) features.push('Lavatory');
  if (aircraft.flight_attendant) features.push('Flight Attendant');
  if (aircraft.pets_allowed) features.push('Pets Allowed');
  if (aircraft.smoking_allowed) features.push('Smoking Allowed');
  if (aircraft.cargo_capacity) features.push(`Cargo: ${aircraft.cargo_capacity}`);
  
  // Default features if none specified
  if (features.length === 0) {
    return ['Luxury Seating', 'Climate Control', 'Refreshments', 'Luggage Space'];
  }
  
  return features;
};

// Default aircraft images by category
const getDefaultAircraftImages = (category) => {
  const defaultImages = {
    'Heavy Jet': [
      "https://md.aviapages.com/media/2025/08/29/67c586329c3acd93449ee0c4_Union-Aviation-YL-ECT-interior-12.jpg",
      "https://md.aviapages.com/media/2025/08/29/67c5862fd83c81736b0a6606_Union-Aviation-YL-ECT-interior-3.jpg",
    ],
    'Medium Jet': [
      "https://md.aviapages.com/media/thmb/2022/02/01/q90/g1920/crcenter/image-005.jpg.webp",
      "https://md.aviapages.com/media/2022/02/01/image-006.jpg",
    ],
    'Light Jet': [
      "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_1_1600x1200.jpg",
      "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_2_1600x1200.jpg",
    ],
    'default': [
      "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_1_1600x1200.jpg",
      "https://md.aviapages.com/media/2022/02/01/image-005.jpg.webp",
    ]
  };
  
  return defaultImages[category] || defaultImages['default'];
};

// Enhanced Mock Data with Flexible Timing - used as fallback when API fails
const generateMockFlights = (origin, destination, departureDate, departureTime, passengers, flexibleTiming = false) => {
  console.log('🔄 Generating enhanced mock flight data as fallback...');
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
    },
    { 
      code: 'VP', 
      name: 'VIP Air Services', 
      logo: 'https://img.freepik.com/free-vector/private-jet-logo_23-2148442611.jpg',
      premium: true 
    },
    { 
      code: 'PR', 
      name: 'Premier Jets', 
      logo: 'https://img.freepik.com/free-vector/premium-jet-logo_23-2148442613.jpg',
      premium: false 
    },
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
    },
    { 
      model: 'Cessna Citation X', 
      manufacturer: 'Cessna', 
      seats: 8, 
      range: '5,700 km', 
      speed: '972 km/h',
      hourlyRate: 5800,
      category: 'Medium Jet',
      images: [
        "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_1_1600x1200.jpg",
        "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_2_1600x1200.jpg",
      ],
      features: ['WiFi', 'Entertainment', 'Luxury Seating', 'Refreshments']
    },
    { 
      model: 'Gulfstream G550', 
      manufacturer: 'Gulfstream', 
      seats: 16, 
      range: '11,000 km', 
      speed: '900 km/h',
      hourlyRate: 7500,
      category: 'Heavy Jet',
      images: [
        "https://md.aviapages.com/media/2025/08/29/67c586329c3acd93449ee0c4_Union-Aviation-YL-ECT-interior-12.jpg",
        "https://md.aviapages.com/media/2025/08/29/67c5862fd83c81736b0a6606_Union-Aviation-YL-ECT-interior-3.jpg",
      ],
      features: ['WiFi', '4K Entertainment', 'Luxury Seating', 'Conference Table', 'Full Galley', 'Sleeping Quarters']
    },
    { 
      model: 'Hawker 800XP', 
      manufacturer: 'Hawker', 
      seats: 8, 
      range: '4,800 km', 
      speed: '780 km/h',
      hourlyRate: 4500,
      category: 'Medium Jet',
      images: [
        "https://md.aviapages.com/media/thmb/2022/02/01/q90/g1920/crcenter/image-005.jpg.webp",
        "https://md.aviapages.com/media/2022/02/01/image-006.jpg",
      ],
      features: ['WiFi', 'Entertainment', 'Comfortable Seating', 'Refreshment Bar']
    },
    { 
      model: 'Learjet 75', 
      manufacturer: 'Learjet', 
      seats: 8, 
      range: '3,700 km', 
      speed: '860 km/h',
      hourlyRate: 4200,
      category: 'Light Jet',
      images: [
        "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_1_1600x1200.jpg",
        "https://md.aviapages.com/media/2024/07/24/Gulfstream_200_Fwd_Cabin_2_1600x1200.jpg",
      ],
      features: ['WiFi', 'Entertainment', 'Club Seating', 'Refreshments']
    },
  ];

  const mockFlights = [];
  const [requestedHour, requestedMinute] = departureTime.split(':').map(Number);

  // Generate MORE flights (8-15) so customer can compare prices properly
  const flightCount = Math.min(aircraftTypes.length, 15);

  for (let i = 0; i < flightCount; i++) {
    const airline = airlines[i % airlines.length];
    const aircraft = aircraftTypes[i % aircraftTypes.length];
    
    // Calculate adjusted departure time based on flexible timing
    let departureHour = requestedHour;
    let timeAdjustment = 0;
    
    if (flexibleTiming && i > 0) {
      // Create variations: exact, +30min, -30min, +1h, -1h, etc.
      const adjustments = [0, 0.5, -0.5, 1, -1, 1.5, -1.5, 2, -2];
      timeAdjustment = adjustments[i % adjustments.length];
      departureHour = requestedHour + Math.floor(timeAdjustment);
      
      // Ensure time is within operational hours (5 AM to 11 PM)
      if (departureHour < 5) departureHour = 5;
      if (departureHour > 23) departureHour = 23;
    }
    
    // Calculate price with some variation
    const routeFactor = getRouteFactor(origin, destination);
    let basePrice = aircraft.hourlyRate * 2 * routeFactor * (1 + (passengers / 12));
    
    // Add some price variation for comparison
    const priceVariation = 0.9 + (Math.random() * 0.2); // ±10% variation
    basePrice *= priceVariation;
    
    basePrice = Math.round(basePrice / 100) * 100; // Round to nearest 100
    
    // Create departure time
    const departureDateTime = new Date(departureDate);
    const adjustedMinutes = (timeAdjustment % 1) * 60;
    departureDateTime.setHours(departureHour, requestedMinute + adjustedMinutes, 0, 0);
    
    // Calculate flight duration and arrival
    const duration = getRouteDuration(origin, destination);
    const arrivalDateTime = new Date(departureDateTime);
    arrivalDateTime.setHours(arrivalDateTime.getHours() + duration.hours);
    arrivalDateTime.setMinutes(arrivalDateTime.getMinutes() + duration.minutes);
    
    const flight = {
      id: `flight-${Date.now()}-${i}`,
      type: 'charter-flight',
      source: 'AVIAPAGES_MOCK',
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
                scheduledTime: `${departureHour.toString().padStart(2, '0')}:${(requestedMinute + adjustedMinutes).toString().padStart(2, '0')}`,
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
        availability: 'Available',
        instantConfirmation: Math.random() > 0.3
      },
      
      timeDetails: {
        requestedTime: departureTime,
        actualTime: `${departureHour.toString().padStart(2, '0')}:${(requestedMinute + adjustedMinutes).toString().padStart(2, '0')}`,
        adjustment: timeAdjustment,
        isExactMatch: timeAdjustment === 0,
        flexibleOption: flexibleTiming
      }
    };
    
    const flightWithFee = addServiceFeeToFlight(flight);
    mockFlights.push(flightWithFee);
  }

  // Sort flights by price (lowest first) so customers can compare
  mockFlights.sort((a, b) => a.pricing.total - b.pricing.total);

  console.log(`✅ Generated ${mockFlights.length} mock flights for price comparison`);
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
      console.log(`🔍 Searching ALL available charter flights:`);
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
      
      // FIRST: Try to fetch ALL charter aircraft from REAL API
      console.log('🛩️ Fetching ALL charter aircraft from real API...');
      const allCharterFlights = await fetchAllCharterAircraft(
        origin, 
        destination, 
        departureDate, 
        departureTime,
        passengerCount
      );
      
      if (allCharterFlights && allCharterFlights.data && allCharterFlights.data.length > 0) {
        console.log(`✅ Found ${allCharterFlights.data.length} REAL charter aircraft for comparison`);
        
        let flightsData = allCharterFlights.data;
        
        // Add return leg info if round trip
        if (returnDate) {
          flightsData = flightsData.map((flight) => ({
            ...flight,
            tripType: 'round_trip',
            returnDate: returnDate,
            returnTime: returnTime,
            // Double the price for round trip
            pricing: {
              baseFare: flight.pricing.baseFare * 2,
              serviceFee: flight.pricing.serviceFee * 2,
              total: flight.pricing.total * 2,
              currency: 'USD'
            },
            price: {
              ...flight.price,
              total: flight.price.total * 2,
              base: flight.price.base * 2,
            },
            roundTrip: true
          }));
        }
        
        return {
          data: flightsData,
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
            source: 'AVIAPAGES_REAL_API',
            timestamp: new Date().toISOString(),
            totalResults: flightsData.length,
            message: `Found ${flightsData.length} charter aircraft available for your route`
          }
        };
      }
      
      // SECOND: Try old API method
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
      
      // THIRD: Use enhanced mock data with MORE flights for price comparison
      console.log('📋 Using enhanced mock data with multiple options for price comparison...');
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
        mockFlights.data = mockFlights.data.map((flight) => ({
          ...flight,
          tripType: 'round_trip',
          returnDate: returnDate,
          returnTime: returnTime,
          pricing: {
            baseFare: flight.pricing.baseFare * 2,
            serviceFee: flight.pricing.serviceFee * 2,
            total: flight.pricing.total * 2,
            currency: 'USD'
          },
          price: {
            ...flight.price,
            total: flight.price.total * 2,
            base: flight.price.base * 2,
          },
          roundTrip: true
        }));
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
          source: 'ENHANCED_MOCK',
          timestamp: new Date().toISOString(),
          totalResults: mockFlights.data.length,
          message: `Showing ${mockFlights.data.length} available charter options for price comparison`
        }
      };

    } catch (error) {
      console.error('❌ Search error:', error);
      
      // Fallback to mock data with multiple options
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
          totalResults: mockFlights.data.length,
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

