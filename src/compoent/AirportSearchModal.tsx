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

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Search airports when debounced query changes
    useEffect(() => {
        if (debouncedQuery.length >= 2) {
            searchAirports(debouncedQuery);
        } else {
            setAirports([]);
        }
    }, [debouncedQuery]);

    const searchAirports = async (query) => {
        const accessToken = await AsyncStorage.getItem('AMADEUS_TOKEN')
        const { access_token } = JSON.parse(accessToken);
        setLoading(true);
        try {
            // Using Amadeus Airport Search API
            //   `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${encodeURIComponent(
            //   query.trim()
            // )}&page[limit]=10&page[offset]=0&sort=analytics.travelers.score&view=FULL`;
            const url = `${FLIGHT_API_BASE_URL}/v1/reference-data/locations?subType=CITY&keyword=${query}&page[offset]=0&sort=analytics.travelers.score&view=FULL`
            const response = await fetch(url,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${access_token}`, // You'll need to handle authentication
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch airports');
            }

            const data = await response.json();
            setAirports(data.data || []);
        } catch (error) {
            console.error('Error searching airports:', error);
            Alert.alert('Error', 'Failed to search airports');
            setAirports([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAirport = (airport) => {
        onSelectAirport({
            name: airport.name,
            code: airport.iataCode,
            city: airport.address.cityName,
            country: airport.address.countryName,
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
                    {item.name} ({item.address.cityName})
                </Text>
                <Text style={styles.airportCode}>{item.iataCode}</Text>
            </View>
            <Text style={styles.airportCountry}>
                {item.address.countryName}
            </Text>
        </TouchableOpacity>
    );

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
                    <Text style={styles.title}>Search Airport</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Input */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for airport or city..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={true}
                    />
                    {loading && <ActivityIndicator size="small" color="#007AFF" />}
                </View>

                {/* Results */}
                <FlatList
                    data={airports}
                    renderItem={renderAirportItem}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                        searchQuery.length >= 2 && !loading ? (
                            <Text style={styles.noResults}>No airports found</Text>
                        ) : searchQuery.length < 2 ? (
                            <Text style={styles.placeholder}>
                                Type at least 2 characters to search
                            </Text>
                        ) : null
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
    },
    closeButton: {
        padding: 4,
    },
    closeText: {
        fontSize: 18,
        color: '#FF3B30',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        marginRight: 12,
        fontSize: 16,
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
        flex: 1,
    },
    airportCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF3B30',
        marginLeft: 8,
    },
    airportCountry: {
        fontSize: 14,
        color: '#666',
    },
    noResults: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
        fontSize: 16,
    },
    placeholder: {
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
        fontSize: 14,
    },
});

export default AirportSearchModal;