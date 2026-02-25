import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BookingApi } from "../../redux/Api/AuthApi";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../compoent/CustomHeader";
import imageIndex from "../../assets/imageIndex";
import StatusBarComponent from "../../compoent/StatusBarCompoent";
import { useSelector } from "react-redux";

const FlightBookingScreen = ({ route, navigation }) => {
  const params = route?.params;
  
  // Get user data from Redux
  const userGet = useSelector((state) => state.feature);
  const isLogin = useSelector((state) => state.auth);
  const userData = userGet?.userGetData || isLogin?.userData;
  const userId = String(userData?.id ?? params?.user_id ?? 1);

  // ============================================
  // AUTO-FILL DATA FROM SELECTED FLIGHT/CHARTER
  // ============================================
  
  // Get charter/flight data from params
  const charter = params?.jet?.charter || params?.charter || params?.jet || {};
  const searchParams = params?.searchParams || params?.jet?.searchParams || {};
  const aircraftInfo = charter?.aircraftInfo || params?.jet?.aircraftInfo || {};
  
  // Extract flight details - AUTO FILLED (not editable by user)
  const flightName = aircraftInfo?.name || aircraftInfo?.model || 
                     charter?.itineraries?.[0]?.segments?.[0]?.aircraft?.name || 
                     'Private Charter';
  
  const sourceAirport = searchParams?.origin || 
                        charter?.itineraries?.[0]?.segments?.[0]?.departure?.iataCode || 
                        params?.origin || '';
  
  const destinationAirport = searchParams?.destination || 
                             charter?.itineraries?.[0]?.segments?.[0]?.arrival?.iataCode || 
                             params?.destination || '';
  
  // Price data (include jet.pricing from CharterDetailsScreen)
  const priceData = charter?.price || charter?.pricing || params?.jet?.pricing || params?.jet?.price || {};
  const currency = priceData?.currency || "USD";
  const total = priceData?.total || 0;
  const base = priceData?.base || priceData?.baseFare || 0;

  // Passengers: prefer selectedSeats from Charter Details, then search params sum, then aircraft seats
  const totalPassengers = (() => {
    const fromCharter = params?.jet?.selectedSeats;
    if (fromCharter != null && Number(fromCharter) > 0) {
      return String(fromCharter);
    }
    const adults = Number(searchParams?.adults ?? 0);
    const children = Number(searchParams?.children ?? 0);
    const infants = Number(searchParams?.infants ?? 0);
    const sum = adults + children + infants;
    if (sum > 0) return String(sum);
    return String(aircraftInfo?.seats ?? 1);
  })();
  
  // Journey date from search params
  const initialJourneyDate = searchParams?.departureDate 
    ? new Date(searchParams.departureDate) 
    : new Date();
  
  // Departure time
  const departureTime = searchParams?.departureTime || 
                        charter?.timeDetails?.requestedTime || 
                        '08:00';
  
  // Flight duration
  const duration = charter?.itineraries?.[0]?.duration?.replace('PT', '').replace('H', 'h ').replace('M', 'm') || 
                   '2h 30m';

  // ============================================
  // USER INPUT FIELDS (editable)
  // ============================================
  const [fullName, setFullName] = useState(userData?.user_name || userData?.name || '');
  const [lastName, setLastName] = useState(userData?.last_name || '');
  const [contactEmail, setContactEmail] = useState(userData?.email || '');
  const [contactPhone, setContactPhone] = useState(userData?.mobile || userData?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [journeyDate, setJourneyDate] = useState(initialJourneyDate);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDateChange = (_event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setJourneyDate(selectedDate);
  };

  const formattedDate = journeyDate
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join("-"); // dd-mm-yyyy

  const handleSubmit = async () => {
    // Validate user input fields only
    if (!fullName || !contactEmail || !contactPhone) {
      Alert.alert("Validation", "Please fill in your contact details (Name, Email, Phone)");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      Alert.alert("Validation", "Please enter a valid email address");
      return;
    }

    const payload = {
      user_id: userId,
      flight_name: flightName,
      source_airport_name: sourceAirport,
      destination_airport_name: destinationAirport,
      journey_date: formattedDate,
      departure_time: departureTime,
      total_passengers: totalPassengers,
      total_amount: String(total),
      // User contact info
      passenger_name: `${fullName} ${lastName}`.trim(),
      contact_email: contactEmail,
      contact_phone: contactPhone,
      special_requests: specialRequests,
      // Additional flight info
      aircraft_name: flightName,
      aircraft_id: aircraftInfo?.id || charter?.id,
      currency: currency,
      base_fare: String(base),
    };

    console.log("📝 Booking Payload =>", payload);

    const response = await BookingApi(payload, setLoading);
        console.log("📝 response Payload =>", response);

    if (response?.status == "1") {
      Alert.alert("Success", "Flight booked successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <CustomHeader label="Flight Booking" imageSource={imageIndex.backorange} />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* ============================================ */}
          {/* BOOKING SUMMARY - So the customer can confirm exactly what they're booking (flight, route, price) before entering passenger details and paying. */}
          {/* ============================================ */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            
            {/* Flight/Aircraft Name */}
            <View style={styles.row}>
              <Text style={styles.leftText}>Aircraft</Text>
              <Text style={styles.rightTextBold}>{flightName}</Text>
            </View>

            {/* Route */}
            <View style={styles.row}>
              <Text style={styles.leftText}>From</Text>
              <Text style={styles.rightText}>{sourceAirport}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.leftText}>To</Text>
              <Text style={styles.rightText}>{destinationAirport}</Text>
            </View>

            {/* Date & Time */}
            <View style={styles.row}>
              <Text style={styles.leftText}>Departure</Text>
              <Text style={styles.rightText}>{formattedDate} at {departureTime}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.leftText}>Duration</Text>
              <Text style={styles.rightText}>{duration}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.leftText}>Passengers</Text>
              <Text style={styles.rightText}>{totalPassengers}</Text>
            </View>

            <View style={styles.divider} />

            {/* Price */}
            <View style={styles.row}>
              <Text style={styles.leftText}>Base Fare</Text>
              <Text style={styles.rightText}>
                {currency} {base.toLocaleString()}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.totalText}>Total Amount</Text>
              <Text style={styles.totalAmount}>
                {currency} {total.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* ============================================ */}
          {/* PASSENGER DETAILS FORM - User fills this */}
          {/* ============================================ */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Passenger Details</Text>
            
            <Input 
              label="Full Name *" 
              value={fullName} 
              onChange={setFullName}
              placeholder="Enter your first name"
            />
            
            <Input 
              label="Last Name" 
              value={lastName} 
              onChange={setLastName}
              placeholder="Enter your last name"
            />
            
            <Input 
              label="Contact Email *" 
              value={contactEmail} 
              onChange={setContactEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Input 
              label="Contact Phone *" 
              value={contactPhone} 
              onChange={setContactPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />

            {/* Journey Date (can be changed if needed) */}
            <Text style={styles.label}>Journey Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.dateText}>{formattedDate}</Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={journeyDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}

            <Input 
              label="Special Requests" 
              value={specialRequests} 
              onChange={setSpecialRequests}
              placeholder="Any dietary or special requirements"
              multiline={true}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Confirm Booking</Text>
              )}
            </TouchableOpacity>
            
            <Text style={styles.noteText}>
              * Required fields. You will receive confirmation via email.
            </Text>
          </View>
          
          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Input = ({ 
  label, 
  value, 
  onChange, 
  keyboardType = "default", 
  placeholder = "",
  autoCapitalize = "sentences",
  multiline = false,
  editable = true
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      style={[
        styles.input, 
        multiline && styles.inputMultiline,
        !editable && styles.inputDisabled
      ]}
      keyboardType={keyboardType}
      placeholder={placeholder || label}
      placeholderTextColor="#999"
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      editable={editable}
    />
  </View>
);

export default FlightBookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },

  inputGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
    fontWeight: "500",
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: "#FAFAFA",
    fontSize: 15,
    color: "#333",
  },

  inputMultiline: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  inputDisabled: {
    backgroundColor: "#F0F0F0",
    color: "#666",
  },

  dateButton: {
    height: 48,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: "#FAFAFA",
  },

  dateText: {
    fontSize: 15,
    color: "#333",
  },

  button: {
    backgroundColor: "#FF3B30",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#FF3B30",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  noteText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 12,
  },

  /* Summary Styles */
  summaryCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FFE0E0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FF3B30",
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  leftText: {
    fontSize: 14,
    color: "#666",
  },

  rightText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    maxWidth: "60%",
    textAlign: "right",
  },

  rightTextBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    maxWidth: "60%",
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 12,
  },

  totalText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF3B30",
  },
});
