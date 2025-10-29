import AsyncStorage from '@react-native-async-storage/async-storage';

const FLIGHT_API_BASE_URL = 'https://test.api.amadeus.com/v2';

export const FlightService = {
  // Get flight offers
  getFlightOffers: async (searchParams) => {
    try {
      // Get token from AsyncStorage
      const tokenData = await AsyncStorage.getItem('AMADEUS_TOKEN');
      if (!tokenData) {
        throw new Error('No authentication token found');
      }

      const { access_token } = JSON.parse(tokenData);
      
      // Build query parameters
      const params = new URLSearchParams({
        originLocationCode: searchParams.origin,
        destinationLocationCode: searchParams.destination,
        departureDate: searchParams.departureDate,
        adults: searchParams.adults || 1,
        max: searchParams.max || 5
      });

      if (searchParams.returnDate) {
        params.append('returnDate', searchParams.returnDate);
      }

      const url = `${FLIGHT_API_BASE_URL}/shopping/flight-offers?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching flight offers:', error);
      throw error;
    }
  },

  // Search flights with parameters
  searchFlights: async (origin, destination, departureDate, returnDate, adults = 1) => {
    const searchParams = {
      origin,
      destination,
      departureDate,
      adults,
      max: 10
    };

    if (returnDate) {
      searchParams.returnDate = returnDate;
    }

    return await FlightService.getFlightOffers(searchParams);
  }
};