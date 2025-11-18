// // services/aviapagesService.js
// import axios from 'axios';

// const API_BASE_URL = 'https://api.aviapages.com/v3';
// const API_TOKEN = 'FNKymUaYzNMjtbtzqOwYEM3ZPX7sTtHQ7tdj';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     Authorization: `Token ${API_TOKEN}`, // No extra space after 'Token'
//     'Content-Type': 'application/json',
//   },
// });
// // Token X2adREdW9FKIrjvLl8loHxVMtkqImKAyTF5K
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

// // Make a booking
// export const makeBooking = async (bookingData) => {

//   console.log("bookingData",bookingData)
//   try {
//     const response = await api.post('/charter_aircraft/booking/', bookingData);
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
//   makeBooking,
// };

import axios from 'axios';

const API_BASE_URL = 'https://api.aviapages.com/v3';
const API_TOKEN = '9jrai79QhJretvlnvxQZ3gsqKbpbwnHCpNLF';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Token ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Get charter aircraft list
export const getCharterAircraft = async () => {
  try {
    const response = await api.get('/charter_aircraft/');
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching charter aircraft:',
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get charter aircraft by ID
export const getCharterAircraftById = async (aircraftId) => {
  try {
    const response = await api.get(`/charter_aircraft/${aircraftId}/`);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching aircraft details:',
      error.response?.data || error.message
    );
    throw error;
  }
};

// Make a booking
export const makeBooking = async (bookingData) => {
  try {
    const response = await api.get('/charter_aircraft/booking/', bookingData);
    return response.data;
  } catch (error) {
    console.error(
      'Error making booking:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export default {
  getCharterAircraft,
  getCharterAircraftById,
  makeBooking,
};