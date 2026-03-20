
/**
 * AirportSearchModal.tsx — FIXED
 *
 * handleSelect mein icao properly bheja ja raha hai.
 * HomeScreen handleSelectAirport mein:
 *   origin = airport.icao  (ICAO prefer karo, IATA fallback)
 *
 * Flight Calculator ko ICAO chahiye — VABB, VAID, VIDP
 * IATA nahi — BOM, IDR, DEL
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const BASE_URL = 'https://api.aviapages.com/v3';

const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Token zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn',
};

const AirportSearchModal = ({ visible, onClose, onSelectAirport }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [airports, setAirports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (searchQuery.length >= 1) {
      fetchAirports(searchQuery);
    } else {
      setAirports([]);
    }
  }, [searchQuery]);

  // Reset on close
  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
      setAirports([]);
    }
  }, [visible]);

  const fetchAirports = async (query: string, url: string | null = null) => {
    try {
      const fetchUrl = url || `${BASE_URL}/airports/?search=${query}`;
      if (!url) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(fetchUrl, { method: 'GET', headers });
      const data = await response.json();
      const results = data?.results || [];

      const formatted = results.map((airport: any) => ({
        id: airport.id || airport.icao,
        name: airport.name,
        city: airport.city?.name || '',
        country: airport.country?.name || '',
        iata: airport.iata || '',
        icao: airport.icao || '',
        // Display: show IATA if available, else ICAO
        displayName: `${airport.name} (${airport.iata || airport.icao})`,
        // Code to use for flight search: ICAO preferred
        searchCode: airport.icao || airport.iata || '',
      }));

      if (!url) setAirports(formatted);
      else setAirports(prev => [...prev, ...formatted]);

      setNextPage(data?.next || null);
    } catch (error) {
      console.log('Airport API Error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (nextPage && !loadingMore) {
      fetchAirports(searchQuery, nextPage);
    }
  };

  const handleSelect = (airport: any) => {
    // ── IMPORTANT: icao bhejo, HomeScreen flight calculator ke liye use karega
    onSelectAirport({
      name: airport.name,
      city: airport.city,
      country: airport.country,
      iata: airport.iata,
      icao: airport.icao,           // ← ICAO (VABB, VAID)
      searchCode: airport.searchCode, // ← same as icao
      displayName: airport.displayName,
    });

    setSearchQuery('');
    setAirports([]);
    onClose();
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
      <Text style={styles.airportName}>{item.displayName}</Text>
      <Text style={styles.city}>
        {item.city}, {item.country}
        {item.icao ? `  •  ICAO: ${item.icao}` : ''}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Search Airport</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Search airport code, city or country"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
          autoFocus
        />

        {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

        <FlatList
          data={airports}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator size="small" /> : null}
          ListEmptyComponent={
            !loading && searchQuery.length > 0 ? (
              <Text style={styles.emptyText}>No airports found</Text>
            ) : null
          }
        />
      </View>
    </Modal>
  );
};

export default AirportSearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
    borderTopWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  close: {
    fontSize: 20,
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 16,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  airportName: {
    fontSize: 16,
    fontWeight: '600',
  },
  city: {
    color: '#777',
    marginTop: 4,
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 15,
  },
});

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
// import StatusBarComponent from "./StatusBarCompoent";

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

//       // Fetch airports using both search by name/code and city
//       const response = await fetch(
//         `${BASE_URL}/airports/?search=${searchQuery}&search_city_name=${searchQuery}`,
//         { headers }
//       );

//       const data = await response.json();

//       // Format results
//       const formatted = data.results.map((a) => ({
//         id: a.icao,
//         name: a.name,
//         city: a.city?.name || "Unknown city", // fix for [object Object]
//         iata: a.iata,
//         icao: a.icao,
//         display: `${a.name} (${a.iata || a.icao}) - ${a.city?.name || "Unknown city"}`,
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
//       <StatusBarComponent/>
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.title}>Search Airport</Text>
//           <TouchableOpacity onPress={onClose}>
//             <Text style={[styles.closeText,{
//               color:"black"
//             }]}>Close</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Search Input */}
//         <TextInput
//           placeholder="Type airport name, or city..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           style={styles.input}
//         />

//         {/* Loading */}
//         {loading && <ActivityIndicator size="large" color="black" style={{ marginTop: 10 }} />}

//         {/* Airport List */}
//         <FlatList
//           data={airports}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.item}
//               onPress={() => {
//                 onSelectAirport(item);
//                 onClose();
//               }}
//             >
//               <Text style={styles.itemText}>{item.display}</Text>
//             </TouchableOpacity>
//           )}
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
//     borderColor: "gray",
//     height:56 ,
//     fontSize:14
//   },
//   item: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   itemText: { fontSize: 16 },
//   noResult: { textAlign: "center", marginTop: 20, color: "#888" },
// });

// import React, { useEffect, useState } from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
// } from 'react-native';
// import AviapagesFlightService from '../screen/home/AviapagesFlightService';
 
// type Props = {
//   visible: boolean;
//   onClose: () => void;
//   onSelectAirport: (airport: any) => void;
// };

// const AirportSearchModal: React.FC<Props> = ({
//   visible,
//   onClose,
//   onSelectAirport,
// }) => {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!visible) {
//       setQuery('');
//       setResults([]);
//       setLoading(false);
//     }
//   }, [visible]);

//   useEffect(() => {
//     const timeout = setTimeout(async () => {
//       if (!query || query.trim().length < 2) {
//         setResults([]);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await AviapagesFlightService.searchAirports(query);
//         setResults(response?.data || []);
//       } catch (error) {
//         console.error('Airport search error:', error);
//         setResults([]);
//       } finally {
//         setLoading(false);
//       }
//     }, 350);

//     return () => clearTimeout(timeout);
//   }, [query]);

//   const handleClose = () => {
//     setQuery('');
//     setResults([]);
//     setLoading(false);
//     onClose();
//   };

//   const handleSelect = (airport: any) => {
//     onSelectAirport(airport);
//     setQuery('');
//     setResults([]);
//     setLoading(false);
//     onClose();
//   };

//   const renderAirport = ({ item }: any) => (
//     <TouchableOpacity
//       onPress={() => handleSelect(item)}
//       style={{
//         paddingVertical: 14,
//         borderBottomWidth: 1,
//         borderBottomColor: '#F1F5F9',
//       }}
//     >
//       <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
//         {item?.displayName}
//       </Text>
//       <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 3 }}>
//         {item?.city}, {item?.country}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent
//       onRequestClose={handleClose}
//     >
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: 'rgba(0,0,0,0.35)',
//           justifyContent: 'flex-end',
//         }}
//       >
//         <View
//           style={{
//             backgroundColor: '#fff',
//             borderTopLeftRadius: 24,
//             borderTopRightRadius: 24,
//             padding: 16,
//             maxHeight: '82%',
//             height:"70%"
//           }}
//         >
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: 12,
//             }}
//           >
//             <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
//               Search Airport
//             </Text>

//             <TouchableOpacity onPress={handleClose}>
//               <Text style={{ fontSize: 15, color: '#111827' }}>Close</Text>
//             </TouchableOpacity>
//           </View>

//           <TextInput
//             value={query}
//             onChangeText={setQuery}
//             placeholder="Search city, airport, IATA"
//             placeholderTextColor="#94A3B8"
//             style={{
//               height: 48,
//               borderWidth: 1,
//               borderColor: '#E2E8F0',
//               borderRadius: 12,
//               paddingHorizontal: 14,
//               color: '#111827',
//               marginBottom: 12,
//             }}
//           />

//           {loading ? (
//             <View style={{ paddingVertical: 25 }}>
//               <ActivityIndicator size="small" color="#000" />
//             </View>
//           ) : (
//             <FlatList
//               data={results}
//               keyExtractor={(item, index) => item?.id?.toString?.() || String(index)}
//               renderItem={renderAirport}
//               keyboardShouldPersistTaps="handled"
//               showsVerticalScrollIndicator={false}
//               ListEmptyComponent={
//                 query.length >= 2 ? (
//                   <Text
//                     style={{
//                       textAlign: 'center',
//                       color: '#6B7280',
//                       marginTop: 24,
//                     }}
//                   >
//                     No airports found
//                   </Text>
//                 ) : null
//               }
//             />
//           )}
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default AirportSearchModal;