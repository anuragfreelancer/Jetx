/**
 * AviaPages API Service
 * Documentation: https://api.aviapages.com/docs/
 * 
 * IMPORTANT: Use "Token" for Authorization, NOT "Bearer"
 */

import axios from 'axios';

const AVIA_PAGE_BASE_URL = 'https://api.aviapages.com/v3';
const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';

// Create axios instance with proper Token authentication
const api = axios.create({
  baseURL: AVIA_PAGE_BASE_URL,
  headers: {
    'Authorization': `Token ${API_TOKEN}`, // Important: Use "Token" not "Bearer"
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Enhanced error handling
const handleApiError = (error, defaultMessage) => {
  console.error('API Error:', error.response?.data || error.message);
  const message = error.response?.data?.detail || 
                  error.response?.data?.message || 
                  error.message ||
                  defaultMessage;
  throw new Error(message);
};

// =====================
// CHARTER AIRCRAFT APIs
// =====================

/**
 * Get charter aircraft list with filters
 * @param {Object} params - Query parameters
 * @returns {Promise} Aircraft list
 */
export const getCharterAircraft = async (params = {}) => {
  try {
    const response = await api.get('/charter_aircraft/', {
      params: {
        ...params
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch aircraft list');
  }
};

/**
 * Get charter aircraft by ID
 * @param {number} aircraftId - Aircraft ID
 * @returns {Promise} Aircraft details
 */
export const getCharterAircraftById = async (aircraftId) => {
  try {
    const response = await api.get(`/charter_aircraft/${aircraftId}/`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch aircraft details');
  }
};

// =====================
// AIRPORT APIs
// =====================

/**
 * Search airports
 * @param {string} query - Search query (city, ICAO, IATA)
 * @param {object} options - Optional: { page_size } to get more results
 * @returns {Promise} Airport list
 */
export const searchAirports = async (query, options = {}) => {
  try {
    const params = { search: query };
    if (options.page_size != null) params.page_size = options.page_size;
    const response = await api.get('/airports/', { params });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to search airports');
  }
};

/**
 * Get airport by ID
 * @param {number} airportId - Airport ID
 * @returns {Promise} Airport details
 */
export const getAirportById = async (airportId) => {
  try {
    const response = await api.get(`/airports/${airportId}/`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch airport details');
  }
};

// =====================
// FLIGHT CALCULATOR APIs
// =====================

/**
 * Calculate flight time between airports
 * @param {Object} data - Flight data
 * @returns {Promise} Flight time calculation
 */
export const calculateFlightTime = async (departureIcao, arrivalIcao, aircraftProfileId = null) => {
  try {
    const requestBody = {
      departure_airport: { icao: departureIcao },
      arrival_airport: { icao: arrivalIcao },
    };
    
    if (aircraftProfileId) {
      requestBody.aircraft_profile_id = aircraftProfileId;
    }
    
    const response = await api.post('/flight_calculator/', requestBody);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to calculate flight time');
  }
};

// =====================
// PRICE CALCULATOR APIs
// =====================

/**
 * Calculate charter price
 * @param {Array} legs - Flight legs
 * @param {Array} aircraft - Aircraft preferences
 * @param {string} currencyCode - Currency code (default: USD)
 * @returns {Promise} Price calculation
 */
export const calculateCharterPrice = async (legs, aircraft, currencyCode = 'USD') => {
  try {
    const response = await api.post('/charter_prices/', {
      legs: legs,
      aircraft: aircraft,
      currency_code: currencyCode,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to calculate price');
  }
};

// =====================
// CHARTER SEARCH APIs
// =====================

/**
 * Search for charter aircraft for a route
 * @param {Array} legs - Flight legs
 * @returns {Promise} Available aircraft
 */
export const searchCharterAircraft = async (legs) => {
  try {
    const response = await api.post('/charter_search_aircraft/', {
      legs: legs
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to search charter aircraft');
  }
};

// =====================
// CHARTER QUOTE APIs
// =====================

/**
 * Create a charter quote request
 * @param {Object} quoteData - Quote request data
 * @returns {Promise} Quote response
 */
export const createCharterQuote = async (quoteData) => {
  try {
    const response = await api.post('/charter_quote_requests/', quoteData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to create quote request');
  }
};

/**
 * Get quote request by ID
 * @param {number} quoteId - Quote ID
 * @returns {Promise} Quote details
 */
export const getQuoteById = async (quoteId) => {
  try {
    const response = await api.get(`/charter_quote_requests/${quoteId}/`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch quote');
  }
};

/**
 * Get quote replies (offers)
 * @param {number} quoteId - Quote ID
 * @returns {Promise} Quote replies
 */
export const getQuoteReplies = async (quoteId) => {
  try {
    const response = await api.get('/charter_quote_replies/', {
      params: { quote_request_id: quoteId }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch quote replies');
  }
};

// =====================
// AVAILABILITY (EMPTY LEGS) APIs
// =====================

/**
 * Get available empty legs
 * @param {Object} params - Filter parameters
 * @returns {Promise} Availabilities list
 */
export const getAvailabilities = async (params = {}) => {
  try {
    const response = await api.get('/availabilities/', {
      params: params
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch availabilities');
  }
};

// =====================
// COMPANY APIs
// =====================

/**
 * Get charter companies
 * @param {Object} params - Filter parameters
 * @returns {Promise} Companies list
 */
export const getCharterCompanies = async (params = {}) => {
  try {
    const response = await api.get('/charter_companies/', {
      params: params
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch companies');
  }
};

/**
 * Get company by ID
 * @param {number} companyId - Company ID
 * @returns {Promise} Company details
 */
export const getCompanyById = async (companyId) => {
  try {
    const response = await api.get(`/charter_companies/${companyId}/`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch company');
  }
};

// =====================
// AIRCRAFT TYPE APIs
// =====================

/**
 * Get aircraft types
 * @param {Object} params - Filter parameters
 * @returns {Promise} Aircraft types list
 */
export const getAircraftTypes = async (params = {}) => {
  try {
    const response = await api.get('/aircraft_types/', {
      params: params
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch aircraft types');
  }
};

/**
 * Get aircraft classes
 * @returns {Promise} Aircraft classes list
 */
export const getAircraftClasses = async () => {
  try {
    const response = await api.get('/aircraft_classes/');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch aircraft classes');
  }
};

// =====================
// BOOKING APIs
// =====================

/**
 * Make a booking (create quote request)
 * @param {Object} bookingData - Booking data
 * @returns {Promise} Booking response
 */
export const makeBooking = async (bookingData) => {
  try {
    console.log('📝 Making booking with data:', bookingData);
    
    // Format legs for quote request
    const legs = [{
      departure_airport: { icao: bookingData.origin },
      arrival_airport: { icao: bookingData.destination },
      pax: parseInt(bookingData.passengers_count) || 1,
      departure_datetime: `${bookingData.departure_date}T${bookingData.departure_time || '10:00'}`,
    }];
    
    // Add return leg if round trip
    if (bookingData.return_date) {
      legs.push({
        departure_airport: { icao: bookingData.destination },
        arrival_airport: { icao: bookingData.origin },
        pax: parseInt(bookingData.passengers_count) || 1,
        departure_datetime: `${bookingData.return_date}T${bookingData.return_time || '18:00'}`,
      });
    }
    
    // Create quote request
    const quoteRequest = {
      legs: legs,
      aircraft: bookingData.aircraft_id ? [{ id: parseInt(bookingData.aircraft_id) }] : [{ ac_class: 'Midsize' }],
      comment: `
Booking Request from JetX App
----------------------------
Passenger: ${bookingData.passenger_name}
Email: ${bookingData.contact_email}
Phone: ${bookingData.contact_phone}
Special Requests: ${bookingData.special_requests || 'None'}
----------------------------
      `.trim(),
      post_to_trip_board: true,
      channels: ['Email'],
    };
    
    const response = await api.post('/charter_quote_requests/', quoteRequest);
    
    console.log('✅ Quote request created:', response.data);
    
    return {
      ...response.data,
      booking_reference: `JX-${response.data.quote_request_id}`,
      status: 'quote_requested',
      confirmation_time: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Booking error:', error);
    handleApiError(error, 'Booking failed. Please try again.');
  }
};

/**
 * Process payment (placeholder - integrate with payment gateway)
 * @param {Object} paymentData - Payment data
 * @returns {Promise} Payment response
 */
export const processPayment = async (paymentData) => {
  try {
    console.log('💳 Processing payment...', {
      amount: paymentData.amount,
      currency: paymentData.currency,
    });
    
    // Validate payment data
    if (!paymentData.amount || paymentData.amount <= 0) {
      throw new Error('Invalid payment amount');
    }
    
    // TODO: Integrate with actual payment gateway (Stripe, PayPal, etc.)
    // This is a placeholder implementation
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.05; // 95% success rate
        
        if (success) {
          resolve({
            success: true,
            payment_id: `pay_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            transaction_id: `txn_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            amount: paymentData.amount,
            currency: paymentData.currency || 'USD',
            status: 'completed',
            timestamp: new Date().toISOString(),
          });
        } else {
          reject(new Error('Payment declined. Please try again.'));
        }
      }, 2000);
    });
  } catch (error) {
    console.error('❌ Payment error:', error);
    throw error;
  }
};

// =====================
// UTILITY APIs
// =====================

/**
 * Test API connection
 * @returns {Promise<boolean>} Connection status
 */
export const testApiConnection = async () => {
  try {
    const response = await api.get('/airports/?search=DXB');
    return response.status === 200;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

export default {
  // Charter Aircraft
  getCharterAircraft,
  getCharterAircraftById,
  
  // Airports
  searchAirports,
  getAirportById,
  
  // Calculators
  calculateFlightTime,
  calculateCharterPrice,
  
  // Charter Search
  searchCharterAircraft,
  
  // Quotes
  createCharterQuote,
  getQuoteById,
  getQuoteReplies,
  
  // Availabilities
  getAvailabilities,
  
  // Companies
  getCharterCompanies,
  getCompanyById,
  
  // Aircraft Types
  getAircraftTypes,
  getAircraftClasses,
  
  // Booking
  makeBooking,
  processPayment,
  
  // Utility
  testApiConnection,
};
