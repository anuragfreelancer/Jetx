

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";

// const BASE_URL = "https://api.aviapages.com/v3";

// const headers = {
//   "Content-Type": "application/json",
//   Authorization: "Token zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn",
// };

// const AirportSearchModal = ({ visible, onClose, onSelectAirport }) => {

//   const [searchQuery, setSearchQuery] = useState("");
//   const [airports, setAirports] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [nextPage, setNextPage] = useState(null);
//   const [loadingMore, setLoadingMore] = useState(false);

//   useEffect(() => {
//     if (searchQuery.length >= 1) {
//       fetchAirports(searchQuery);
//     } else {
//       setAirports([]);
//     }
//   }, [searchQuery]);

//   const fetchAirports = async (query, url = null) => {

//     try {

//       url = url || `${BASE_URL}/airports/?search=${query}`;

//       if (url === `${BASE_URL}/airports/?search=${query}`) {
//         setLoading(true);
//       } else {
//         setLoadingMore(true);
//       }

//       const response = await fetch(url, {
//         method: "GET",
//         headers: headers,
//       });

//       const data = await response.json();

//       const results = data?.results || [];

//       const formatted = results.map((airport) => ({
//         id: airport.id || airport.icao,
//         name: airport.name,
//         city: airport.city?.name || "",
//         country: airport.country?.name || "",
//         iata: airport.iata,
//         icao: airport.icao,
//         displayName: `${airport.name} (${airport.iata || airport.icao})`,
//       }));

//       if (url === `${BASE_URL}/airports/?search=${query}`) {
//         setAirports(formatted);
//       } else {
//         setAirports((prev) => [...prev, ...formatted]);
//       }

//       setNextPage(data?.next);

//     } catch (error) {
//       console.log("Airport API Error:", error);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   const loadMore = () => {
//     if (nextPage && !loadingMore) {
//       fetchAirports(searchQuery, nextPage);
//     }
//   };

//   const handleSelect = (airport) => {

//     onSelectAirport({
//       name: airport.name,
//       city: airport.city,
//       country: airport.country,
//       iata: airport.iata,
//       icao: airport.icao,
//     });

//     setSearchQuery("");
//     setAirports([]);
//     onClose();
//   };

//   const renderItem = ({ item }) => (

//     <TouchableOpacity
//       style={styles.item}
//       onPress={() => handleSelect(item)}
//     >
//       <Text style={styles.airportName}>
//         {item.displayName}
//       </Text>

//       <Text style={styles.city}>
//         {item.city}, {item.country}
//       </Text>

//     </TouchableOpacity>

//   );

//   return (

//     <Modal visible={visible} animationType="slide">

//       <View style={styles.container}>

//         <View style={styles.header}>
//           <Text style={styles.title}>Search Airport</Text>

//           <TouchableOpacity onPress={onClose}>
//             <Text style={styles.close}>✕</Text>
//           </TouchableOpacity>
//         </View>

//         <TextInput
//           placeholder="Search airport code, city or country"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           style={styles.input}
//         />

//         {loading && <ActivityIndicator size="large" />}

//         <FlatList
//           data={airports}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderItem}
//           onEndReached={loadMore}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={
//             loadingMore ? <ActivityIndicator size="small" /> : null
//           }
//         />

//       </View>

//     </Modal>

//   );

// };

// export default AirportSearchModal;

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     marginTop: 50,
//     borderTopWidth: 1
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 16,
//     borderBottomWidth: 1,
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },

//   close: {
//     fontSize: 20,
//     color: "red",
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     margin: 16,
//     padding: 12,
//     borderRadius: 10,
//   },

//   item: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },

//   airportName: {
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   city: {
//     color: "#777",
//     marginTop: 4,
//   },

// });





// import React, { useState, useEffect } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     FlatList,
//     Modal,
//     StyleSheet,
//     ActivityIndicator
// } from "react-native";

// const BASE_URL = "https://api.aviapages.com/v3";

// const headers = {
//     "Content-Type": "application/json",
//     Authorization: "Token zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn"
// };

// export default function AirportSearchModal({
//     visible,
//     onClose,
//     onSelectAirport
// }) {

//     const [searchQuery, setSearchQuery] = useState("");
//     const [airports, setAirports] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {

//         if (searchQuery.length >= 1) {
//             fetchAirports();
//         } else {
//             setAirports([]);
//         }

//     }, [searchQuery]);

//     const fetchAirports = async () => {

//         try {

//             setLoading(true);

//             const response = await fetch(
//                 `${BASE_URL}/airports/?search=${searchQuery}`,
//                 { headers }
//             );

//             const data = await response.json();

//             const formatted = data.results.map(a => ({
//                 id: a.icao,
//                 name: a.name,
//                 iata: a.iata,
//                 icao: a.icao,
//                 display: `${a.name} (${a.iata || a.icao})`
//             }));

//             setAirports(formatted);

//         } catch (e) {
//             console.log(e);
//         }
//         finally {
//             setLoading(false);
//         }

//     };

//     return (

//         <Modal visible={visible} animationType="slide">

//             <View style={styles.container}>

//                 <View style={styles.header}>

//                     <Text style={styles.title}>
//                         Search Airport
//                     </Text>

//                     <TouchableOpacity onPress={onClose}>
//                         <Text>Close</Text>
//                     </TouchableOpacity>

//                 </View>

//                 <TextInput
//                     placeholder="Search airport"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                     style={styles.input}
//                 />

//                 {loading && <ActivityIndicator />}

//                 <FlatList
//                     data={airports}
//                     keyExtractor={(i) => i.id}
//                     renderItem={({ item }) =>  {
                         
//                         return(

//                         <TouchableOpacity
//                             style={styles.item}
//                             onPress={() => {
//                                 onSelectAirport(item);
//                                 onClose();
//                             }}
//                         >

//                             <Text>{item.display}</Text>

//                         </TouchableOpacity>
//                         )
//                     }}
//                 />

//             </View>

//         </Modal>

//     );

// }

// const styles = StyleSheet.create({

//     container: { flex: 1, marginTop: 50 },

//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         padding: 20
//     },

//     title: {
//         fontSize: 18,
//         fontWeight: "bold"
//     },

//     input: {
//         borderWidth: 1,
//         margin: 15,
//         padding: 10,
//         borderRadius: 10
//     },

//     item: {
//         padding: 15,
//         borderBottomWidth: 1
//     }

// });



// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";

// const BASE_URL = "https://api.aviapages.com/v3";

// const headers = {
//   "Content-Type": "application/json",
//   Authorization: "Token zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn",
// };

// export default function AirportSearchModal({ visible, onClose, onSelectAirport }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [airports, setAirports] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (searchQuery.length >= 1) {
//       fetchAirports();
//     } else {
//       setAirports([]);
//     }
//   }, [searchQuery]);

//   const fetchAirports = async () => {
//     try {
//       setLoading(true);

//       // Search by airport name, code, or city
//       const response = await fetch(
//         `${BASE_URL}/airports/?search=${searchQuery}&search_city_name=${searchQuery}`,
//         { headers }
//       );

//       const data = await response.json();

//       // Format the results
//       const formatted = data.results.map((a) => ({
//         id: a.icao,
//         name: a.name,
//         city: a.city,
//         iata: a.iata,
//         icao: a.icao,
//         display: `${a.name} (${a.iata || a.icao}) - ${a.city || "Unknown city"}`,
//       }));

//       setAirports(formatted);
//     } catch (e) {
//       console.log("Airport fetch error:", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal visible={visible} animationType="slide">
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.title}>Search Airport</Text>
//           <TouchableOpacity onPress={onClose}>
//             <Text style={styles.closeText}>Close</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Search Input */}
//         <TextInput
//           placeholder="Type airport name, code, or city..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           style={styles.input}
//         />

//         {/* Loading */}
//         {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />}

//         {/* Airport List */}
//         <FlatList
//           data={airports}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) =>  {
//             console.log("item",item)
//             return(
//                   <TouchableOpacity
//               style={styles.item}
//               onPress={() => {
//                 onSelectAirport(item);
//                 onClose();
//               }}
//             >
//               <Text style={styles.itemText}>{item.display}</Text>
//             </TouchableOpacity>
//             )
//           }}
//           ListEmptyComponent={
//             !loading && searchQuery.length > 0 ? (
//               <Text style={styles.noResult}>No airports found</Text>
//             ) : null
//           }
//         />
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, marginTop: 50, backgroundColor: "#fff" },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   title: { fontSize: 18, fontWeight: "bold" },
//   closeText: { fontSize: 16, color: "blue" },
//   input: {
//     borderWidth: 1,
//     margin: 15,
//     padding: 10,
//     borderRadius: 10,
//     borderColor: "#ccc",
//   },
//   item: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   itemText: { fontSize: 16 },
//   noResult: { textAlign: "center", marginTop: 20, color: "#888" },
// });


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import StatusBarComponent from "./StatusBarCompoent";

const BASE_URL = "https://api.aviapages.com/v3";

const headers = {
  "Content-Type": "application/json",
  Authorization: "Token zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn",
};

export default function AirportSearchModal({ visible, onClose, onSelectAirport }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length >= 1) {
      fetchAirports();
    } else {
      setAirports([]);
    }
  }, [searchQuery]);

  const fetchAirports = async () => {
    try {
      setLoading(true);

      // Fetch airports using both search by name/code and city
      const response = await fetch(
        `${BASE_URL}/airports/?search=${searchQuery}&search_city_name=${searchQuery}`,
        { headers }
      );

      const data = await response.json();

      // Format results
      const formatted = data.results.map((a) => ({
        id: a.icao,
        name: a.name,
        city: a.city?.name || "Unknown city", // fix for [object Object]
        iata: a.iata,
        icao: a.icao,
        display: `${a.name} (${a.iata || a.icao}) - ${a.city?.name || "Unknown city"}`,
      }));

      setAirports(formatted);
    } catch (e) {
      console.log("Airport fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <StatusBarComponent/>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Search Airport</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeText,{
              color:"black"
            }]}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <TextInput
          placeholder="Type airport name, or city..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
        />

        {/* Loading */}
        {loading && <ActivityIndicator size="large" color="black" style={{ marginTop: 10 }} />}

        {/* Airport List */}
        <FlatList
          data={airports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onSelectAirport(item);
                onClose();
              }}
            >
              <Text style={styles.itemText}>{item.display}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !loading && searchQuery.length > 0 ? (
              <Text style={styles.noResult}>No airports found</Text>
            ) : null
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 50, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  closeText: { fontSize: 16, color: "blue" },
  input: {
    borderWidth: 1, 
    margin: 15,
    padding: 10,
    borderRadius: 10,
    borderColor: "gray",
    height:56 ,
    fontSize:14
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: { fontSize: 16 },
  noResult: { textAlign: "center", marginTop: 20, color: "#888" },
});