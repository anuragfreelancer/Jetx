import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AirportSearchModal from "../../../compoent/AirportSearchModal";
import CustomDropdown from "../../../compoent/CustomDropdown";

const CALC_URL = "https://api.aviapages.com/v3/flight_calculator/";
const AIRCRAFT_URL = "https://api.aviapages.com/v3/aircraft/";
const headers = {
  "Content-Type": "application/json",
  Authorization: "Token zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn",
};

// ------------------------ Flight Row Component ------------------------
const FlightRow = ({ index, flight, setFlight, removeFlight, aircraftOptions }) => {
  const [showDepModal, setShowDepModal] = useState(false);
  const [showArrModal, setShowArrModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <View style={styles.flightRow}>
      <Text style={styles.flightTitle}>Flight {index + 1}</Text>

      {/* Departure Airport */}
      <Text style={styles.label}>Departure Airport *</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDepModal(true)}
      >
        <Text>
          {flight.departure ? `${flight.departure.name} (${flight.departure.iata})` : "Select departure"}
        </Text>
      </TouchableOpacity>

      {/* Arrival Airport */}
      <Text style={styles.label}>Arrival Airport *</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowArrModal(true)}
      >
        <Text>
          {flight.arrival ? `${flight.arrival.name} (${flight.arrival.iata})` : "Select arrival"}
        </Text>
      </TouchableOpacity>

      {/* Passengers */}
      <Text style={styles.label}>Passengers *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Number of passengers"
        value={flight.passengers}
        onChangeText={(t) => setFlight({ ...flight, passengers: t })}
      />

      {/* Date */}
      <Text style={styles.label}>Date *</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{flight.date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={flight.date}
          mode="date"
          display="default"
          onChange={(e, d) => {
            setShowDatePicker(false);
            if (d) setFlight({ ...flight, date: d });
          }}
        />
      )}

      {/* Time */}
      <Text style={styles.label}>Local Time *</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowTimePicker(true)}
      >
        <Text>{flight.time.toTimeString().split(" ")[0]}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={flight.time}
          mode="time"
          display="default"
          onChange={(e, t) => {
            setShowTimePicker(false);
            if (t) setFlight({ ...flight, time: t });
          }}
        />
      )}

      {/* Aircraft Dropdown */}
      <Text style={styles.label}>Aircraft *</Text>
      <CustomDropdown
        label="Aircraft"
        options={aircraftOptions.map(a => ({
          label: a.name + (a.status === "under_construction" ? " (Unavailable)" : ""),
          value: a.name,
          status: a.status,
        }))}
        selectedValue={flight.aircraft}
        onSelect={(item) => {
          if (item.status === "under_construction") {
            Alert.alert("Unavailable", "This aircraft is under construction. Please select another.");
            return;
          }
          setFlight({ ...flight, aircraft: item.value });
        }}
      />

      {/* Pricing Policy */}
      <Text style={styles.label}>Pricing Policy *</Text>
      <TextInput
        style={styles.input}
        placeholder="Pricing policy"
        value={flight.pricingPolicy}
        onChangeText={(t) => setFlight({ ...flight, pricingPolicy: t })}
      />

      {/* Avoid Countries */}
      <Text style={styles.label}>Avoid countries/FIRs (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Separate by comma"
        value={flight.avoidCountries.join(", ")}
        onChangeText={(t) =>
          setFlight({ ...flight, avoidCountries: t.split(",").map((c) => c.trim()) })
        }
      />

      {/* Remove Flight */}
      <TouchableOpacity
        onPress={removeFlight}
        style={styles.removeFlightBtn}
      >
        <Text style={{ color: "red" }}>Remove Flight</Text>
      </TouchableOpacity>

      {/* Airport Modals */}
      <AirportSearchModal
        visible={showDepModal}
        onClose={() => setShowDepModal(false)}
        onSelectAirport={(a) => setFlight({ ...flight, departure: a })}
      />
      <AirportSearchModal
        visible={showArrModal}
        onClose={() => setShowArrModal(false)}
        onSelectAirport={(a) => setFlight({ ...flight, arrival: a })}
      />
    </View>
  );
};

// ------------------------ Main Flight Calculator ------------------------
export default function FlightCalculator() {
  const [flights, setFlights] = useState([
    {
      departure: null,
      arrival: null,
      passengers: "",
      date: new Date(),
      time: new Date(),
      aircraft: "",
      pricingPolicy: "General",
      avoidCountries: ["Israel"],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [aircraftOptions, setAircraftOptions] = useState([]);

  // Fetch aircraft from API
  useEffect(() => {
    const fetchAircraft = async () => {
      try {
        const res = await fetch(AIRCRAFT_URL, { headers });
        const data = await res.json();
        console.log("Aircraft API:", data);
        // Filter out under construction aircraft
        const validAircraft = (data.results || []).filter(a => a.status !== "under_construction");
        setAircraftOptions(validAircraft);
      } catch (e) {
        console.log("Failed to fetch aircraft:", e);
        Alert.alert("Error", "Failed to load aircraft options");
      }
    };
    fetchAircraft();
  }, []);

  // Add Flight
  const addFlight = () => {
    setFlights([
      ...flights,
      {
        departure: null,
        arrival: null,
        passengers: "",
        date: new Date(),
        time: new Date(),
        aircraft: "",
        pricingPolicy: "",
        avoidCountries: ["Israel"],
      },
    ]);
  };

  // Remove Flight
  const removeFlight = (index) => {
    const updated = [...flights];
    updated.splice(index, 1);
    setFlights(updated);
  };

  // Calculate Flights
  const handleCalculate = async () => {
    // Validation
    for (let i = 0; i < flights.length; i++) {
      const f = flights[i];
      if (!f.departure || !f.arrival || !f.passengers || !f.date || !f.time || !f.aircraft || !f.pricingPolicy) {
        Alert.alert("Error", `Please fill all required fields for Flight ${i + 1}`);
        return;
      }
    }

    setLoading(true);
    try {
      for (let i = 0; i < flights.length; i++) {
        const f = flights[i];
        const body = {
          departure_airport: f.departure.iata,
          arrival_airport: f.arrival.iata,
          aircraft: f.aircraft,
          pax: f.passengers,
          flight_date: f.date.toISOString().split("T")[0],
          local_time: f.time.toTimeString().split(" ")[0],
          pricing_policy: f.pricingPolicy,
          avoid_countries: f.avoidCountries,
          airway_time_weather_impacted: true,
        };

        const res = await fetch(CALC_URL, { method: "POST", headers, body: JSON.stringify(body) });
        const data = await res.json();

        if (data.errors && data.errors.length > 0) {
          const msg = data.errors.map(e => e.message).join("\n");
          Alert.alert(`Flight ${i + 1} Error`, msg);
          console.log(`Flight ${i + 1} API error:`, data.errors);
          continue; // skip to next flight
        }

        console.log(`Flight ${i + 1} result:`, data);
      }
      Alert.alert("Done", "Calculation completed. Check console for details.");
    } catch (e) {
      console.log("Calculation failed:", e);
      Alert.alert("Error", "Calculation failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {flights.map((f, i) => (
        <FlightRow
          key={i}
          index={i}
          flight={f}
          setFlight={(flight) => {
            const updated = [...flights];
            updated[i] = flight;
            setFlights(updated);
          }}
          removeFlight={() => removeFlight(i)}
          aircraftOptions={aircraftOptions}
        />
      ))}

      <TouchableOpacity style={styles.addFlightBtn} onPress={addFlight}>
        <Text style={{ color: "blue" }}>+ Add Flight</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Calculate</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

// ------------------------ Styles ------------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  flightRow: { marginBottom: 25, padding: 15, borderWidth: 1, borderRadius: 10, borderColor: "#ccc", backgroundColor: "#fff" },
  flightTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 10 },
  label: { marginTop: 10, marginBottom: 5, fontWeight: "bold" },
  input: { padding: 12, borderWidth: 1, borderRadius: 8, borderColor: "#ccc", backgroundColor: "#fff" },
  removeFlightBtn: { marginTop: 10, alignItems: "flex-end" },
  addFlightBtn: { padding: 12, borderRadius: 8, borderColor: "#007bff", borderWidth: 1, alignItems: "center", marginBottom: 20 },
  calculateBtn: { backgroundColor: "#007bff", marginTop: 20, padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 30 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});