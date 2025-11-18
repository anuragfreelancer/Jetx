// import AsyncStorage from '@react-native-async-storage/async-storage';
// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     FlatList,
//     Modal,
//     StyleSheet,
//     ActivityIndicator,
//     Alert,
// } from 'react-native';
// import { FLIGHT_API_BASE_URL } from '../flightService';

// const AirportSearchModal = ({ visible, onClose, onSelectAirport }) => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [airports, setAirports] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [debouncedQuery, setDebouncedQuery] = useState('');

//     // 🔹 Debounce typing for better API performance
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedQuery(searchQuery);
//         }, 600);
//         return () => clearTimeout(timer);
//     }, [searchQuery]);

//     // 🔹 Search when query updates
//     useEffect(() => {
//         if (debouncedQuery.trim().length >= 2) {
//             searchAirports(debouncedQuery.trim());
//         } else {
//             setAirports([]);
//         }
//     }, [debouncedQuery]);

//     const searchAirports = async (query) => {
//         try {
//             const tokenData = await AsyncStorage.getItem('AMADEUS_TOKEN');
//             console.log("tokenData",tokenData)
//             if (!tokenData) {
//                 Alert.alert('Error', 'Amadeus access token not found. Please re-authenticate.');
//                 return;
//             }

//             const { access_token } = JSON.parse(tokenData);
//             setLoading(true);

//             // ✅ Use both AIRPORT and CITY subtype to get full results (Dubai, Abu Dhabi, Doha, etc.)
//             const url = `${FLIGHT_API_BASE_URL}/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(query)}&page[limit]=20&page[offset]=0&sort=analytics.travelers.score&view=FULL`;
// console.log("url",url)
//             const response = await fetch(url, {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${access_token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 console.error(await response.text());
//                 throw new Error('Failed to fetch airports');
//             }

//             const data = await response.json();

//             // ✅ Some airports may not have city/country info — handle gracefully
//             setAirports(data.data || []);
//         } catch (error) {
//             console.error('Error searching airports:', error);
//             Alert.alert('Error', 'Unable to fetch airport data. Please try again later.');
//             setAirports([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSelectAirport = (airport) => {
//         onSelectAirport({
//             name: airport.name || 'Unknown',
//             code: airport.iataCode || '',
//             city: airport.address?.cityName || '',
//             country: airport.address?.countryName || '',
//         });
//         setSearchQuery('');
//         setAirports([]);
//         onClose();
//     };

//     const renderAirportItem = ({ item }) => (
//         <TouchableOpacity
//             style={styles.airportItem}
//             onPress={() => handleSelectAirport(item)}
//         >
//             <View style={styles.airportInfo}>
//                 <Text style={styles.airportName}>
//                     {item.name || 'Unknown'} {item.iataCode ? `(${item.iataCode})` : ''}
//                 </Text>
//             </View>
//             <Text style={styles.airportCity}>
//                 {item.address?.cityName ? `${item.address.cityName}, ` : ''}
//                 {item.address?.countryName || ''}
//             </Text>
//         </TouchableOpacity>
//     );

//     return (
//         <Modal
//             visible={visible}
//             animationType="slide"
//             presentationStyle="pageSheet"
//             onRequestClose={onClose}
//         >
//             <View style={styles.container}>
//                 {/* Header */}
//                 <View style={styles.header}>
//                     <Text style={styles.title}>Search Airport</Text>
//                     <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//                         <Text style={styles.closeText}>✕</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {/* Search Input */}
//                 <View style={styles.searchContainer}>
//                     <TextInput
//                         style={styles.searchInput}
//                         placeholder="Search by airport or city..."
//                         value={searchQuery}
//                         onChangeText={setSearchQuery}
//                         autoFocus
//                         placeholderTextColor="#999"
//                     />
//                     {loading && <ActivityIndicator size="small" color="#007AFF" />}
//                 </View>

//                 {/* Results */}
//                 <FlatList
//                     data={airports}
//                     renderItem={renderAirportItem}
//                     keyExtractor={(item) => item.id}
//                     ListEmptyComponent={
//                         !loading && searchQuery.length >= 2 ? (
//                             <Text style={styles.noResults}>No airports found</Text>
//                         ) : (
//                             <Text style={styles.placeholder}>
//                                 Type at least 2 letters (e.g., DXB or Dubai)
//                             </Text>
//                         )
//                     }
//                     style={styles.resultsList}
//                 />
//             </View>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: '#e0e0e0',
//     },
//     title: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#000',
//     },
//     closeButton: {
//         padding: 6,
//     },
//     closeText: {
//         fontSize: 18,
//         color: '#FF3B30',
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderBottomWidth: 1,
//         borderBottomColor: '#e0e0e0',
//     },
//     searchInput: {
//         flex: 1,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 8,
//         padding: 10,
//         fontSize: 16,
//         color: '#000',
//     },
//     resultsList: {
//         flex: 1,
//     },
//     airportItem: {
//         padding: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: '#f0f0f0',
//     },
//     airportInfo: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 4,
//     },
//     airportName: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#222',
//     },
//     airportCity: {
//         fontSize: 14,
//         color: '#555',
//     },
//     noResults: {
//         textAlign: 'center',
//         marginTop: 20,
//         fontSize: 16,
//         color: '#777',
//     },
//     placeholder: {
//         textAlign: 'center',
//         marginTop: 20,
//         fontSize: 15,
//         color: '#aaa',
//     },
// });

// export default AirportSearchModal;

import AsyncStorage from '@react-native-async-storage/async-storage';
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
    Alert,
} from 'react-native';
import { FLIGHT_API_BASE_URL } from '../flightService';

const AirportSearchModal = ({ visible, onClose, onSelectAirport }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // 🔹 Popular airports worldwide as fallback
    const popularAirports = [
        // North America
        { id: 'JFK', displayName: 'John F Kennedy International Airport (JFK)', iataCode: 'JFK', city: 'New York', country: 'United States', subType: 'AIRPORT' },
        { id: 'LAX', displayName: 'Los Angeles International Airport (LAX)', iataCode: 'LAX', city: 'Los Angeles', country: 'United States', subType: 'AIRPORT' },
        { id: 'ORD', displayName: "Chicago O'Hare International Airport (ORD)", iataCode: 'ORD', city: 'Chicago', country: 'United States', subType: 'AIRPORT' },
        { id: 'YYZ', displayName: 'Toronto Pearson International Airport (YYZ)', iataCode: 'YYZ', city: 'Toronto', country: 'Canada', subType: 'AIRPORT' },
        
        // Middle East
        { id: 'DXB', displayName: 'Dubai International Airport (DXB)', iataCode: 'DXB', city: 'Dubai', country: 'United Arab Emirates', subType: 'AIRPORT' },
        { id: 'AUH', displayName: 'Abu Dhabi International Airport (AUH)', iataCode: 'AUH', city: 'Abu Dhabi', country: 'United Arab Emirates', subType: 'AIRPORT' },
        { id: 'DOH', displayName: 'Hamad International Airport (DOH)', iataCode: 'DOH', city: 'Doha', country: 'Qatar', subType: 'AIRPORT' },
        { id: 'RUH', displayName: 'King Khalid International Airport (RUH)', iataCode: 'RUH', city: 'Riyadh', country: 'Saudi Arabia', subType: 'AIRPORT' },
        
         { id: 'LHR', displayName: 'Heathrow Airport (LHR)', iataCode: 'LHR', city: 'London', country: 'United Kingdom', subType: 'AIRPORT' },
        { id: 'CDG', displayName: 'Charles de Gaulle Airport (CDG)', iataCode: 'CDG', city: 'Paris', country: 'France', subType: 'AIRPORT' },
        { id: 'FRA', displayName: 'Frankfurt Airport (FRA)', iataCode: 'FRA', city: 'Frankfurt', country: 'Germany', subType: 'AIRPORT' },
        { id: 'AMS', displayName: 'Amsterdam Schiphol Airport (AMS)', iataCode: 'AMS', city: 'Amsterdam', country: 'Netherlands', subType: 'AIRPORT' },
        
        // Asia
        { id: 'DEL', displayName: 'Indira Gandhi International Airport (DEL)', iataCode: 'DEL', city: 'Delhi', country: 'India', subType: 'AIRPORT' },
        { id: 'BOM', displayName: 'Chhatrapati Shivaji Maharaj International Airport (BOM)', iataCode: 'BOM', city: 'Mumbai', country: 'India', subType: 'AIRPORT' },
        { id: 'SIN', displayName: 'Changi Airport (SIN)', iataCode: 'SIN', city: 'Singapore', country: 'Singapore', subType: 'AIRPORT' },
        { id: 'BKK', displayName: 'Suvarnabhumi Airport (BKK)', iataCode: 'BKK', city: 'Bangkok', country: 'Thailand', subType: 'AIRPORT' },
    ];

    // 🔹 Debounce typing for better API performance
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 600);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 🔹 Search when query updates
    useEffect(() => {
        if (debouncedQuery.trim().length >= 2) {
            searchAirports(debouncedQuery.trim());
        } else {
            setAirports([]);
        }
    }, [debouncedQuery]);

    const searchAirports = async (query) => {
        try {
            const tokenData = await AsyncStorage.getItem('AMADEUS_TOKEN');
            console.log("tokenData", tokenData);
            
            if (!tokenData) {
                // If no token, use fallback data
                console.log("No token found, using fallback data");
                useFallbackData(query);
                return;
            }

            const { access_token } = JSON.parse(tokenData);
            setLoading(true);

            // ✅ Try multiple API approaches
            await tryMultipleSearchApproaches(query, access_token);

        } catch (error) {
            console.error('Error searching airports:', error);
            // On any error, use fallback data
            useFallbackData(query);
        } finally {
            setLoading(false);
        }
    };

    const tryMultipleSearchApproaches = async (query, token) => {
        const searchAttempts = [
            // Approach 1: Combined search
            `${FLIGHT_API_BASE_URL}/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(query)}&page[limit]=30&view=FULL`,
            
            // Approach 2: Airport only
            `${FLIGHT_API_BASE_URL}/v1/reference-data/locations?subType=AIRPORT&keyword=${encodeURIComponent(query)}&page[limit]=30&view=FULL`,
            
            // Approach 3: City only
            `${FLIGHT_API_BASE_URL}/v1/reference-data/locations?subType=CITY&keyword=${encodeURIComponent(query)}&page[limit]=20&view=FULL`,
        ];
         for (let url of searchAttempts) {
            try {
                console.log("Trying URL:", url);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("API Success:", data.data?.length, "results");
                    
                    if (data.data && data.data.length > 0) {
                        const enhancedAirports = enhanceAirportData(data.data);
                        setAirports(enhancedAirports);
                        return; // Success, exit the loop
                    }
                } else {
                    console.log("API Response not OK:", response.status);
                }
            } catch (error) {
                console.log("Search attempt failed:", error);
            }
        }

        // If all API attempts fail, use fallback
        console.log("All API attempts failed, using fallback data");
        useFallbackData(query);
    };

    const useFallbackData = (query) => {
        const filteredAirports = popularAirports.filter(airport => 
            airport.city.toLowerCase().includes(query.toLowerCase()) ||
            airport.iataCode.toLowerCase().includes(query.toLowerCase()) ||
            airport.displayName.toLowerCase().includes(query.toLowerCase()) ||
            airport.country.toLowerCase().includes(query.toLowerCase())
        );
        
        console.log("Fallback results:", filteredAirports.length);
        setAirports(filteredAirports);
    };

    // 🔹 Enhance airport data with better formatting
    const enhanceAirportData = (airports) => {
        return airports.map(airport => {
            let displayName = airport.name || 'Unknown Airport';
            
            // For airports, include IATA code in name
            if (airport.iataCode && airport.subType === 'AIRPORT') {
                displayName = `${airport.name} (${airport.iataCode})`;
            }
            
            // For cities, indicate it's a city search
            if (airport.subType === 'CITY') {
                displayName = `${airport.name} (City)`;
            }

            return {
                ...airport,
                displayName,
                city: airport.address?.cityName || airport.name || '',
                country: airport.address?.countryName || '',
            };
        }).filter(airport => 
            airport.iataCode || airport.name
        ).sort((a, b) => {
            // Sort by type (AIRPORT first, then CITY) and then by relevance
            if (a.subType === 'AIRPORT' && b.subType !== 'AIRPORT') return -1;
            if (a.subType !== 'AIRPORT' && b.subType === 'AIRPORT') return 1;
            return 0;
        });
    };

    const handleSelectAirport = (airport) => {
        onSelectAirport({
            name: airport.displayName || airport.name || 'Unknown',
            code: airport.iataCode || '',
            city: airport.city || airport.address?.cityName || '',
            country: airport.country || airport.address?.countryName || '',
        });
        setSearchQuery('');
        setAirports([]);
        onClose();
    };

    const renderAirportItem = ({ item }) => (
        <TouchableOpacity
            style={styles.airportItem}
            onPress={() => handleSelectAirport(item)}
        >
            <View style={styles.airportInfo}>
                <Text style={styles.airportName}>
                    {item.displayName || item.name || 'Unknown Airport'}
                </Text>
                {item.subType === 'CITY' && (
                    <Text style={styles.cityBadge}>City</Text>
                )}
                {!item.subType && (
                    <Text style={styles.fallbackBadge}>Fallback</Text>
                )}
            </View>
            <Text style={styles.airportCity}>
                {item.city ? `${item.city}, ` : ''}
                {item.country || ''}
            </Text>
        </TouchableOpacity>
    );

    // Check if we should show popular airports for common searches
    const shouldShowPopularAirports = (query) => {
        const commonSearches = [
            'nyc', 'new york', 'london', 'paris', 'dubai', 'doha', 
            'delhi', 'mumbai', 'tokyo', 'sydney', 'toronto', 'chicago',
            'los angeles', 'san francisco', 'dhabi', 'riyadh', 'jeddah'
        ];
        return commonSearches.some(term => 
            query.toLowerCase().includes(term.toLowerCase())
        );
    };

    // Determine which data to show
    const displayData = airports.length > 0 ? airports : 
        (shouldShowPopularAirports(searchQuery) && searchQuery.length >= 2 ? 
            popularAirports.filter(airport => 
                airport.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                airport.iataCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                airport.displayName.toLowerCase().includes(searchQuery.toLowerCase())
            ) : []);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Search Airport or City</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Input */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by airport code, city, or country..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                        placeholderTextColor="#999"
                        autoCapitalize="characters"
                    />
                    {loading && <ActivityIndicator size="small" color="#007AFF" style={styles.loader} />}
                </View>

                {/* Debug Info */}
                {__DEV__ && (
                    <View style={styles.debugContainer}>
                        <Text style={styles.debugText}>
                            Results: {displayData.length} | Query: "{searchQuery}"
                        </Text>
                    </View>
                )}

                {/* Results */}
                <FlatList
                    data={displayData}
                    renderItem={renderAirportItem}
                    keyExtractor={(item) => item.id || item.iataCode}
                    ListEmptyComponent={
                        loading ? (
                            <View style={styles.centerContainer}>
                                <ActivityIndicator size="large" color="#007AFF" />
                                <Text style={styles.loadingText}>Searching airports...</Text>
                            </View>
                        ) : searchQuery.length >= 2 ? (
                            <View style={styles.centerContainer}>
                                <Text style={styles.noResults}>No airports found</Text>
                                <Text style={styles.suggestion}>
                                    Try searching with airport codes (JFK, DXB, DEL) or major city names
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.centerContainer}>
                                <Text style={styles.placeholder}>
                                    Type at least 2 letters{'\n'}
                                    Examples: "JFK", "New York", "DXB", "Dubai"
                                </Text>
                                <View style={styles.popularSection}>
                                    <Text style={styles.popularTitle}>Popular Airports:</Text>
                                    <View style={styles.popularList}>
                                        {popularAirports.slice(0, 6).map(airport => (
                                            <TouchableOpacity 
                                                key={airport.id}
                                                style={styles.popularItem}
                                                onPress={() => handleSelectAirport(airport)}
                                            >
                                                <Text style={styles.popularText}>{airport.iataCode}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        )
                    }
                    style={styles.resultsList}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    closeButton: {
        padding: 6,
    },
    closeText: {
        fontSize: 18,
        color: '#FF3B30',
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        height:60,
        color: '#000',
        backgroundColor: '#f8f8f8',
    },
    loader: {
        marginLeft: 10,
    },
    debugContainer: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        alignItems: 'center',
    },
    debugText: {
        fontSize: 12,
        color: '#666',
    },
    resultsList: {
        flex: 1,
    },
    airportItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    airportInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    airportName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
        flex: 1,
    },
    cityBadge: {
        fontSize: 12,
        backgroundColor: '#28a745',
        color: 'white',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    fallbackBadge: {
        fontSize: 12,
        backgroundColor: '#ffc107',
        color: 'black',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    airportCity: {
        fontSize: 14,
        color: '#666',
    },
    centerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginTop: 20,
    },
    noResults: {
        fontSize: 16,
        color: '#777',
        fontWeight: '500',
        marginBottom: 8,
    },
    suggestion: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        lineHeight: 20,
    },
    placeholder: {
        fontSize: 15,
        color: '#aaa',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: '#007AFF',
    },
    popularSection: {
        alignItems: 'center',
        marginTop: 20,
    },
    popularTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    popularList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    popularItem: {
        backgroundColor: 'red',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        margin: 4,
    },
    popularText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 13,
    },
});

export default AirportSearchModal;