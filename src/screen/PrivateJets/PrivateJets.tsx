//  import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
// import { getFlightsForAircraft, getLiveStates } from "../../OpenSkyService";
 
// const PrivateJetFlightHistoryScreen = () => {
//   const [jets, setJets] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedIcao, setSelectedIcao] = useState<string | null>(null);
//   const [flights, setFlights] = useState<any[]>([]);
//   const [flightsLoading, setFlightsLoading] = useState(false);

//   useEffect(() => {
//     loadJets();
//   }, []);

//   const loadJets = async () => {
//     setLoading(true);
//     const states = await getLiveStates();
//     // filter for potential private jets (you can customize this)
//     const privateJets = (states || []).filter((st: any[]) => {
//       const callsign = st[1] || "";
//       const velocity = st[9] || 0;
//       // Simple heuristic
//       return velocity > 120 && velocity < 400;
//     });
//     setJets(privateJets);
//     setLoading(false);
//   };

//   const loadFlights = async (icao24: string) => {
//     setFlightsLoading(true);
//     // Set a time window: last 2 days (for example)
//     const now = Math.floor(Date.now() / 1000);
//     const twoDaysAgo = now - 2 * 24 * 60 * 60;
//     const flights = await getFlightsForAircraft(icao24, twoDaysAgo, now);
//     setFlights(flights);
//     setFlightsLoading(false);
//   };

//   const onJetPress = (item: any[]) => {
//     const icao24 = item[0];
//     setSelectedIcao(icao24);
//     loadFlights(icao24);
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />
//         <Text>Loading Jets...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <FlatList
//         style={{ flex: 1 }}
//         data={jets}
//         keyExtractor={(item, i) => item[0] + "-" + i}
//         renderItem={({ item }) => (
//           <Text style={styles.jetItem} onPress={() => onJetPress(item)}>
//             {item[1] /* callsign */} — ICAO24: {item[0]}
//           </Text>
//         )}
//       />

//       {selectedIcao && (
//         <View style={styles.flightsContainer}>
//           <Text style={styles.heading}>Flights for {selectedIcao}:</Text>
//           {flightsLoading ? (
//             <ActivityIndicator />
//           ) : flights.length > 0 ? (
//             <FlatList
//               data={flights}
//               keyExtractor={(item: any, idx) => item.flight_id ?? idx.toString()}
//               renderItem={({ item }) => {
//                 return (
//                   <View style={styles.flightCard}>
//                     <Text>ICAO24: {item.icao24}</Text>
//                     <Text>First Seen: {new Date(item.firstSeen * 1000).toLocaleString()}</Text>
//                     <Text>Last Seen: {new Date(item.lastSeen * 1000).toLocaleString()}</Text>
//                     <Text>Departure Airport: {item.estDepartureAirport}</Text>
//                     <Text>Arrival Airport: {item.estArrivalAirport}</Text>
//                   </View>
//                 );
//               }}
//             />
//           ) : (
//             <Text>No flights found.</Text>
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   jetItem: { padding: 12, borderBottomWidth: 1, borderColor: "#ccc" },
//   flightsContainer: { flex: 2, padding: 12, backgroundColor: "#f9f9f9" },
//   heading: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
//   flightCard: { padding: 10, marginBottom: 10, backgroundColor: "#fff", borderRadius: 8 },
// });

// export default PrivateJetFlightHistoryScreen;


// CharterQuoteScreen.tsx

// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet, FlatList, Image } from "react-native";
// import { requestCharterQuote } from "../../OpenSkyService";
 
// const CharterQuoteScreen = () => {
//   const [from, setFrom] = useState("OMDB");
//   const [to, setTo] = useState("Dubai International Airport");
//   const [pax, setPax] = useState("1");
//   const [quotes, setQuotes] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const getQuote = async () => {
//     setLoading(true);
//     try {
//       const data = await requestCharterQuote(from, to, Number(pax));
//       console.log("data",data)
//       // Assume data.offers is an array of offers
//       setQuotes(data.offers || []);
//     } catch (e) {
//       console.log(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text>From (ICAO):</Text>
//       <TextInput value={from} onChangeText={setFrom} style={styles.input} />
//       <Text>To (ICAO):</Text>
//       <TextInput value={to} onChangeText={setTo} style={styles.input} />
//       <Text>Passengers:</Text>
//       <TextInput
//         value={pax}
//         onChangeText={setPax}
//         style={styles.input}
//         keyboardType="numeric"
//       />
//       <Button title="Get Quote" onPress={getQuote} />

//       {loading && <Text>Loading quotes...</Text>}

//       <FlatList
//         data={quotes}
//         keyExtractor={(item, idx) => idx.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Text>Aircraft: {item.aircraftType}</Text>
//             <Text>Price: {item.price} {item.currency}</Text>
//             {item.imageUrl && (
//               <Image
//                 source={{ uri: item.imageUrl }}
//                 style={{ width: 200, height: 120 }}
//               />
//             )}
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   input: {
//     borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 8
//   },
//   card: {
//     padding: 12, backgroundColor: "#f0f0f0", marginVertical: 8
//   },
// });

// export default CharterQuoteScreen;
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, Image } from "react-native";
import { getCharterQuote } from "../../OpenSkyService";
import { SafeAreaView } from "react-native-safe-area-context";

const PrivateJets = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const getQuote = async () => {
    setLoading(true);
    try {
      const data = await getCharterQuote("OMDB", "EGLL"); // static route Dubai → London
      setQuotes(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Get Private Jet Quote" onPress={getQuote} />

      {loading && <Text>Loading...</Text>}

      <FlatList
        data={quotes}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.img} />
            <Text>Aircraft: {item.aircraft}</Text>
            <Text>Route: {item.from} → {item.to}</Text>
            <Text>Distance: {item.distance} km</Text>
            <Text style={styles.price}>Price: ${item.price.toLocaleString()}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { backgroundColor: "#fff", padding: 14, marginVertical: 10, borderRadius: 10 },
  img: { width: "100%", height: 160, borderRadius: 10, marginBottom: 10 },
  price: { fontSize: 18, fontWeight: "700", color: "green" },
});

export default PrivateJets;
