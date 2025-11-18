 
// import axios from "axios";

// const BASE_URL = "https://opensky-network.org/api";

// export const getLivePrivateJets = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/states/all`);
//     const allPlanes = response.data?.states || [];

//     const filteredJets = allPlanes.filter((item: any[]) => {
//       const callsign = item[1]?.trim() || "";
//       const velocity = item[9] || 0;
//       const country = item[2] || "";
      
//       // Heuristic private jet check
//       return (
//         velocity > 100 && velocity < 400 &&        // Jet speed range
//         country !== "China" && country !== "Russia" && // Avoid commercial clusters
//         /^[A-Z0-9]{3,7}$/.test(callsign)           // General aviation style
//       );
//     });

//     return filteredJets;
//   } catch (error: any) {
//     console.log("OpenSky Error:", error);
//     return [];
//   }
// };

// OpenSkyService.ts
// import axios from "axios";

// const BASE_URL = "https://opensky-network.org/api";

// // 1) Get live aircraft states
// export const getLiveStates = async () => {
//   const response = await axios.get(`${BASE_URL}/states/all`);
//   return response.data.states; // array of state vectors
// };

// // 2) Fetch flights of a given aircraft (using its icao24)
// export const getFlightsForAircraft = async (
//   icao24: string,
//   begin: number,
//   end: number
// ) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/flights/aircraft`, {
//       params: {
//         icao24: icao24.toLowerCase(),
//         begin: begin,
//         end: end,
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     console.log("OpenSky flights error:", error.response?.data || error.message);
//     return [];
//   }
// };
// CharterService.ts

// import axios from "axios";

// const AVIAPAGES_BASE = "https://api.aviapages.com"; // hypothetical base URL
// const API_KEY = "xuyz1iP6dWno66j6KRfItudlk6TxxQ6e9Z74";

// export const requestCharterQuote = async (
//   fromIcao: string,
//   toIcao: string,
//   passengers: number
// ) => {
//   try {
//     const response = await axios.post(
//       `${AVIAPAGES_BASE}/charter/request`,
//       {
//         departure: fromIcao,
//         arrival: toIcao,
//         pax: passengers,
//       },
//       {
//         headers: {
//           "Authorization": `Bearer ${API_KEY}`,
//           "Content-Type": "application/json",
//         }
//       }
//     );

//     return response.data; // Depends on API: might return price, aircraft options
//   } catch (err: any) {
//     console.log("Charter API error:", err.response?.data || err.message);
//     throw err;
//   }
// };
export const getCharterQuote = async (from: string, to: string) => {
  const airports: any = {
    OMDB: { name: "Dubai Intl", lat: 25.2532, lon: 55.3657 },
    EGLL: { name: "London Heathrow", lat: 51.47, lon: -0.4543 },
    VABB: { name: "Mumbai Intl", lat: 19.0896, lon: 72.8656 },
  };

  const fromData = airports[from];
  const toData = airports[to];

  if (!fromData || !toData) throw new Error("Invalid Route");

  // distance using haversine
  const R = 6371;
  const dLat = ((toData.lat - fromData.lat) * Math.PI) / 180;
  const dLon = ((toData.lon - fromData.lon) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(fromData.lat * Math.PI / 180) *
      Math.cos(toData.lat * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const jets = [
    {
      name: "Gulfstream G650",
      pricePerKm: 22,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/5/50/Gulfstream_G650%2C_N650GD.jpg",
    },
    {
      name: "Bombardier Global 7500",
      pricePerKm: 26,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/0/0b/Bombardier_Global_7500.jpg",
    },
  ];

  return jets.map((jet) => ({
    aircraft: jet.name,
    imageUrl: jet.image,
    distance: Math.round(distance),
    price: Math.round(jet.pricePerKm * distance),
    currency: "USD",
    from: fromData.name,
    to: toData.name,
  }));
};
