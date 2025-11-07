import AsyncStorage from '@react-native-async-storage/async-storage';

export const FLIGHT_API_BASE_URL = 'https://test.api.amadeus.com/';

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
        currencyCode:'USD',
        destinationLocationCode: searchParams.destination,
        departureDate: searchParams.departureDate,
        adults: searchParams.adults || 1,
       ...(searchParams.children && { children: searchParams.children.toString() }),
    ...(searchParams.infants && { infants: searchParams.infants.toString() }),
        max: searchParams.max || 5
      });

      if (searchParams.returnDate) {
        params.append('returnDate', searchParams.returnDate);
      }

      const url = `${FLIGHT_API_BASE_URL}/v2/shopping/flight-offers?${params.toString()}`;

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
  searchFlights: async (origin, destination, departureDate, returnDate, adults = 1, children,
        infants) => {
    const searchParams = {
      origin,
      destination,
      departureDate,
      adults,
      children,
      infants,
      max: 10
    };

    if (returnDate) {
      searchParams.returnDate = returnDate;
    }

    return await FlightService.getFlightOffers(searchParams);
  }
};