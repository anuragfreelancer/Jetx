

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

const BASE_URL = "https://api.aviapages.com/v3";

const headers = {
  "Content-Type": "application/json",
  Authorization: "Token zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn",
};

const AirportSearchModal = ({ visible, onClose, onSelectAirport }) => {

  const [searchQuery, setSearchQuery] = useState("");
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (searchQuery.length >= 1) {
      fetchAirports(searchQuery);
    } else {
      setAirports([]);
    }
  }, [searchQuery]);

  const fetchAirports = async (query, url = null) => {

    try {

      url = url || `${BASE_URL}/airports/?search=${query}`;

      if (url === `${BASE_URL}/airports/?search=${query}`) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      const data = await response.json();

      const results = data?.results || [];

      const formatted = results.map((airport) => ({
        id: airport.id || airport.icao,
        name: airport.name,
        city: airport.city?.name || "",
        country: airport.country?.name || "",
        iata: airport.iata,
        icao: airport.icao,
        displayName: `${airport.name} (${airport.iata || airport.icao})`,
      }));

      if (url === `${BASE_URL}/airports/?search=${query}`) {
        setAirports(formatted);
      } else {
        setAirports((prev) => [...prev, ...formatted]);
      }

      setNextPage(data?.next);

    } catch (error) {
      console.log("Airport API Error:", error);
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

  const handleSelect = (airport) => {

    onSelectAirport({
      name: airport.name,
      city: airport.city,
      country: airport.country,
      iata: airport.iata,
      icao: airport.icao,
    });

    setSearchQuery("");
    setAirports([]);
    onClose();
  };

  const renderItem = ({ item }) => (

    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelect(item)}
    >
      <Text style={styles.airportName}>
        {item.displayName}
      </Text>

      <Text style={styles.city}>
        {item.city}, {item.country}
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
        />

        {loading && <ActivityIndicator size="large" />}

        <FlatList
          data={airports}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" /> : null
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
    backgroundColor: "#fff",
    marginTop: 50,
    borderTopWidth: 1
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  close: {
    fontSize: 20,
    color: "red",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    margin: 16,
    padding: 12,
    borderRadius: 10,
  },

  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  airportName: {
    fontSize: 16,
    fontWeight: "600",
  },

  city: {
    color: "#777",
    marginTop: 4,
  },

});