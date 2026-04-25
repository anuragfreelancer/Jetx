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
        displayName: `${airport.name} (${airport.iata || airport.icao})`,
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
    onSelectAirport({
      name: airport.name,
      city: airport.city,
      country: airport.country,
      iata: airport.iata,
      icao: airport.icao,
      searchCode: airport.searchCode,
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