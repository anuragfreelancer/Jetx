import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { flightAPI } from '../Aviapages/api';

const SearchFlightsScreen = ({ navigation }) => {
  const [tripType, setTripType] = useState('JFK');
  const [from, setFrom] = useState('LAX');
  const [to, setTo] = useState('JFK');
  const [departDate, setDepartDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [passengers, setPassengers] = useState(1);
  const [showDepartPicker, setShowDepartPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchFlights = async () => {
    // Basic validation
    if (!from.trim() || !to.trim()) {
      Alert.alert('Error', 'Please enter both departure and destination');
      return;
    }

    setLoading(true);

    const searchData = {
      from: from.trim(),
      to: to.trim(),
      departDate: departDate.toISOString().split('T')[0],
      passengers,
      tripType,
      ...(tripType === 'round' && {
        returnDate: returnDate.toISOString().split('T')[0],
      }),
    };

    console.log('📤 Sending Search Data =', searchData);

    try {
      const response = await flightAPI.searchFlights(searchData);
      console.log('📥 Flight Search Response =', response);

      if (response?.data?.success) {
        // Navigate if success, pass flights etc.
        navigation.navigate('FlightResults', {
          flights: response.data.flights,
          searchData,
        });
      } else {
        const msg = response?.data?.message || 'No flights found';
        Alert.alert('Error', msg);
      }
    } catch (error) {
      console.error('🔴 Search error:', error);

      // Better error parsing
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log('Error status:', error.response.status);
        console.log('Error data:', error.response.data);
        if (error.response.status === 404) {
          Alert.alert('Error', 'Endpoint not found (404)');
        } else {
          Alert.alert('Error', `Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.log('Error request (no response):', error.request);
        Alert.alert('Error', 'No response from server. Check your network.');
      } else {
        // Something happened in setting up the request
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onDepartDateChange = (event, selectedDate) => {
    setShowDepartPicker(false);
    if (selectedDate) {
      setDepartDate(selectedDate);
      // Optionally, if return date is before depart date, adjust it
      if (tripType === 'round' && returnDate < selectedDate) {
        setReturnDate(selectedDate);
      }
    }
  };

  const onReturnDateChange = (event, selectedDate) => {
    setShowReturnPicker(false);
    if (selectedDate) {
      setReturnDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Flight</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.tripTypeContainer}>
          <TouchableOpacity
            style={[
              styles.tripTypeButton,
              tripType === 'oneway' && styles.tripTypeActive,
            ]}
            onPress={() => setTripType('oneway')}
          >
            <Text
              style={[
                styles.tripTypeText,
                tripType === 'oneway' && styles.tripTypeTextActive,
              ]}
            >
              One Way
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tripTypeButton,
              tripType === 'round' && styles.tripTypeActive,
            ]}
            onPress={() => setTripType('round')}
          >
            <Text
              style={[
                styles.tripTypeText,
                tripType === 'round' && styles.tripTypeTextActive,
              ]}
            >
              Round Trip
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>From</Text>
        <TextInput
          style={styles.input}
          placeholder="Departure city or airport"
          value={from}
          onChangeText={setFrom}
        />

        <Text style={styles.label}>To</Text>
        <TextInput
          style={styles.input}
          placeholder="Destination city or airport"
          value={to}
          onChangeText={setTo}
        />

        <View style={styles.dateContainer}>
          <View style={styles.dateInput}>
            <Text style={styles.label}>Departure Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDepartPicker(true)}
            >
              <Text>{departDate.toDateString()}</Text>
            </TouchableOpacity>
          </View>

          {tripType === 'round' && (
            <View style={styles.dateInput}>
              <Text style={styles.label}>Return Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowReturnPicker(true)}
              >
                <Text>{returnDate.toDateString()}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.label}>Passengers</Text>
        <View style={styles.passengerContainer}>
          <TouchableOpacity
            style={styles.passengerButton}
            onPress={() => setPassengers(Math.max(1, passengers - 1))}
          >
            <Text style={styles.passengerText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.passengerCount}>{passengers}</Text>
          <TouchableOpacity
            style={styles.passengerButton}
            onPress={() => setPassengers(passengers + 1)}
          >
            <Text style={styles.passengerText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.searchButton, loading && styles.buttonDisabled]}
          onPress={searchFlights}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>
            {loading ? 'Searching...' : 'Search Flights'}
          </Text>
        </TouchableOpacity>
      </View>

      {showDepartPicker && (
        <DateTimePicker
          value={departDate}
          mode="date"
          display="default"
          onChange={onDepartDateChange}
          minimumDate={new Date()}
        />
      )}

      {showReturnPicker && (
        <DateTimePicker
          value={returnDate}
          mode="date"
          display="default"
          onChange={onReturnDateChange}
          minimumDate={departDate}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#1e40af' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  card: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  tripTypeContainer: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#f1f5f9', padding: 4, borderRadius: 8 },
  tripTypeButton: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 6 },
  tripTypeActive: { backgroundColor: '#1e40af' },
  tripTypeText: { fontWeight: '600', color: '#64748b' },
  tripTypeTextActive: { color: 'white' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#374151' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  dateContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  dateInput: { flex: 1, marginRight: 10 },
  dateButton: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 15, marginBottom: 15 },
  passengerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  passengerButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1e40af', alignItems: 'center', justifyContent: 'center' },
  passengerText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  passengerCount: { fontSize: 18, fontWeight: '600', marginHorizontal: 20 },
  searchButton: { backgroundColor: '#1e40af', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#93c5fd' },
  searchButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});

export default SearchFlightsScreen;
