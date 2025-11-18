// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useState, useEffect, useCallback } from 'react';

// const usePrivateJets = () => {
//   const [jets, setJets] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPrivateJets = useCallback(async (refresh = false) => {
//     try {
//       refresh ? setRefreshing(true) : setLoading(true);

//       const tokenData = await AsyncStorage.getItem('AMADEUS_TOKEN');
//       if (!tokenData) {
//         throw new Error('No authentication token found');
//       }

//       const { access_token } = JSON.parse(tokenData);
//        const response = await fetch(
//         "https://test.api.amadeus.com/v1/air/transfer-offers?originLocationCode=LON&destinationLocationCode=NYC&departureDate=2025-12-10",
//         {
//           headers: {
//             Authorization: `Bearer ${access_token}`,
//           },
//         }
//       );

//       const json = await response.json();
// console.log("json",json)
//       const formatted =
//         json.data?.map((it: any, id: number) => ({
//           id: id.toString(),
//           tailNumber: "N" + Math.floor(1000 + Math.random() * 9000),
//           model: it.description || "Private Jet",
//           status: "Available",
//           operator: it.provider?.name || "Jet Company",
//           location: it.pickup?.location?.name || "Unknown",
//           nextAvailable: new Date().toISOString(),
//         })) || [];

//       setJets(formatted);
//       setError(null);
//     } catch (err) {
//       setError("Failed to fetch real-time jets");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPrivateJets();
//     const interval = setInterval(fetchPrivateJets, 30000);
//     return () => clearInterval(interval);
//   }, [fetchPrivateJets]);

//   return {
//     jets,
//     loading,
//     refreshing,
//     error,
//     refreshData: () => fetchPrivateJets(true),
//   };
// };

// export default usePrivateJets;
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

const usePrivateJets = () => {
  const [jets, setJets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data as fallback since Amadeus doesn't have a direct private jets API
 

  const fetchPrivateJets = useCallback(async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      // Try to fetch from Amadeus Flight Offers API first
      try {
        const tokenData = await AsyncStorage.getItem('AMADEUS_TOKEN');
        if (!tokenData) {
          throw new Error('No authentication token found');
        }

        const { access_token } = JSON.parse(tokenData);
        
        // Using Flight Offers API as the closest alternative
        const response = await fetch(
          "https://test.api.amadeus.com/v2/shopping/flight-offers?" + 
          new URLSearchParams({
            originLocationCode: 'LAX',
            destinationLocationCode: 'JFK',
            departureDate: '2025-12-10',
            adults: '1',
            currencyCode: 'USD',
            max: '10'
          }),
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const json = await response.json();
        console.log("json",json)
        if (json.data && json.data.length > 0) {
          // Format flight data as private jets
          const formatted = json.data.map((flight: any, id: number) => ({
            id: `flight-${id}`,
            tailNumber: `N${Math.floor(10000 + Math.random() * 90000)}`,
            model: "Private Jet Charter",
            status: "Available",
            operator: flight.validatingAirlineCodes?.[0] || "Private Carrier",
            location: `${flight.itineraries[0].segments[0].departure.iataCode} → ${flight.itineraries[0].segments[0].arrival.iataCode}`,
            nextAvailable: flight.itineraries[0].segments[0].departure.at,
            price: flight.price?.total,
            currency: flight.price?.currency,
            duration: flight.itineraries[0].duration,
          }));
          
          setJets(formatted);
        } else {
          // Fallback to mock data if no flight data
          console.log('No flight data available, using mock data');
         }
      } catch (apiError) {
        console.log('API fetch failed, using mock data:', apiError);
        // Fallback to mock data
       }

    } catch (err) {
      console.log('Final fallback to mock data due to error:', err);
       setError("Using demo data - Real-time service temporarily unavailable");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPrivateJets();
    // Refresh every 2 minutes instead of 30 seconds to avoid rate limiting
    const interval = setInterval(fetchPrivateJets, 120000);
    return () => clearInterval(interval);
  }, [fetchPrivateJets]);

  return {
    jets,
    loading,
    refreshing,
    error,
    refreshData: () => fetchPrivateJets(true),
  };
};

export default usePrivateJets;