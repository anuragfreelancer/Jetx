 
// import axios from 'axios';

// const API_BASE_URL = 'https://api.aviapages.com/v3';
// const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     Authorization: `Token ${API_TOKEN}`,
//     'Content-Type': 'application/json',
//   },
// });

// // Get charter aircraft list
// export const getCharterAircraft = async () => {
//   try {
//     const response = await api.get('/charter_aircraft/');
//     return response.data;
//   } catch (error) {
//     console.error(
//       'Error fetching charter aircraft:',
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// // Get charter aircraft by ID
// export const getCharterAircraftById = async (aircraftId) => {
//   try {
//     const response = await api.get(`/charter_aircraft/${aircraftId}/`);
//     return response.data;
//   } catch (error) {
//     console.error(
//       'Error fetching aircraft details:',
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// // Make a booking
// export const makeBooking = async (bookingData) => {
//   try {
//     const response = await api.get('/charter_aircraft/booking/', bookingData);
//     return response.data;
//   } catch (error) {
//     console.error(
//       'Error making booking:',
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// export default {
//   getCharterAircraft,
//   getCharterAircraftById,
//   makeBooking,
// };


// import axios from 'axios';

// const API_BASE_URL = 'https://api.aviapages.com/v3';
// const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     Authorization: `Token ${API_TOKEN}`,
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000,
// });

// // Enhanced error handling
// const handleApiError = (error, defaultMessage) => {
//   console.error('API Error:', error.response?.data || error.message);
//   throw new Error(error.response?.data?.message || defaultMessage);
// };

// // Get charter aircraft list with search and filters
// export const getCharterAircraft = async (params = {}) => {
//   try {
//     const response = await api.get('/charter_aircraft/', {
//       params: {
//         limit: 50,
//         offset: 0,
//         ...params
//       }
//     });
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'Failed to fetch aircraft list');
//   }
// };

// // Get charter aircraft by ID
// export const getCharterAircraftById = async (aircraftId) => {
//   try {
//     const response = await api.get(`/charter_aircraft/${aircraftId}/`);
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'Failed to fetch aircraft details');
//   }
// };

// // Make a booking - FIXED: Using POST method
// export const makeBooking = async (bookingData) => {
//   try {
//     const response = await api.post('/charter_aircraft/booking/', bookingData);
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'Booking failed. Please try again.');
//   }
// };

// // Search aircraft with filters
// export const searchAircraft = async (filters = {}) => {
//   try {
//     const response = await api.get('/charter_aircraft/', {
//       params: filters
//     });
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'Search failed');
//   }
// };

// export default {
//   getCharterAircraft,
//   getCharterAircraftById,
//   makeBooking,
//   searchAircraft,
// };

// import axios from 'axios';

// const AVIA_PAGE_BASE_URL = 'https://api.aviapages.com/v3';
// const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';

// const api = axios.create({
//   baseURL: AVIA_PAGE_BASE_URL,
//   headers: {
//     Authorization: `Token ${API_TOKEN}`,
//     'Content-Type': 'application/json',
//   },
//   timeout: 15000,
// });

// // Enhanced error handling
// const handleApiError = (error, defaultMessage) => {
//   console.error('API Error:', error.response?.data || error.message);
//   throw new Error(error.response?.data?.message || defaultMessage);
// };

// // Get charter aircraft list with search and filters
// export const getCharterAircraft = async (params = {}) => {
//   try {
//     const response = await api.get('/charter_aircraft/', {
//       params: {
//         limit: 50,
//         offset: 0,
//         ...params
//       }
//     });
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'Failed to fetch aircraft list');
//   }
// };

// // Get charter aircraft by ID
// export const getCharterAircraftById = async (aircraftId) => {
//   try {
//     const response = await api.get(`/charter_aircraft/${aircraftId}/`);
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'Failed to fetch aircraft details');
//   }
// };

// // Make a booking
// export const makeBooking = async (bookingData) => {
//   try {
//     const response = await api.post('/charter_aircraft/booking/', bookingData);
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'Booking failed. Please try again.');
//   }
// };

// // Search aircraft with advanced filters
// export const searchAircraft = async (filters = {}) => {
//   try {
//     const response = await api.get('/charter_aircraft/', {
//       params: {
//         limit: 50,
//         offset: 0,
//         ...filters
//       }
//     });
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'Search failed');
//   }
// };

// // Get aircraft types
// export const getAircraftTypes = async () => {
//   try {
//     const response = await api.get('/aircraft/types/');
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'Failed to fetch aircraft types');
//   }
// };

// // Get manufacturers
// export const getManufacturers = async () => {
//   try {
//     const response = await api.get('/aircraft/manufacturers/');
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'Failed to fetch manufacturers');
//   }
// };

// export default {
//   getCharterAircraft,
//   getCharterAircraftById,
//   makeBooking,
//   searchAircraft,
//   getAircraftTypes,
//   getManufacturers,
// };
import axios from 'axios';

const AVIA_PAGE_BASE_URL = 'https://api.aviapages.com/v3';
const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';

const api = axios.create({
  baseURL: AVIA_PAGE_BASE_URL,
  headers: {
    Authorization: `Token ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Enhanced error handling
const handleApiError = (error, defaultMessage) => {
  console.error('API Error:', error.response?.data || error.message);
  throw new Error(error.response?.data?.message || defaultMessage);
};

// Get charter aircraft list with search and filters
export const getCharterAircraft = async (params = {}) => {
  try {
    const response = await api.get('/charter_aircraft/', {
      params: {
        limit: 50,
        offset: 0,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch aircraft list');
  }
};

// Get charter aircraft by ID
export const getCharterAircraftById = async (aircraftId) => {
  try {
    const response = await api.get(`/charter_aircraft/${aircraftId}/`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch aircraft details');
  }
};

// Make a booking
export const makeBooking = async (bookingData) => {
  try {
    const response = await api.post('/charter_aircraft/booking/', bookingData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Booking failed. Please try again.');
  }
};

// Process payment
export const processPayment = async (paymentData) => {
  try {
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          payment_id: `pay_${Math.random().toString(36).substr(2, 9)}`,
          transaction_id: `txn_${Math.random().toString(36).substr(2, 9)}`,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: 'completed'
        });
      }, 2000);
    });
  } catch (error) {
    handleApiError(error, 'Payment processing failed');
  }
};

// Search aircraft with advanced filters
export const searchAircraft = async (filters = {}) => {
  try {
    const response = await api.get('/charter_aircraft/', {
      params: {
        limit: 50,
        offset: 0,
        ...filters
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Search failed');
  }
};

// Get aircraft types
export const getAircraftTypes = async () => {
  try {
    const response = await api.get('/aircraft/types/');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch aircraft types');
  }
};

// Get manufacturers
export const getManufacturers = async () => {
  try {
    const response = await api.get('/aircraft/manufacturers/');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch manufacturers');
  }
};

export default {
  getCharterAircraft,
  getCharterAircraftById,
  makeBooking,
  processPayment,
  searchAircraft,
  getAircraftTypes,
  getManufacturers,
};