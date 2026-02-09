// Complete Aviapages Booking Flow
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  getCharterAircraft,
  getCharterAircraftById,
  makeBooking,
  processPayment,
} from './api';

const CompleteBookingFlow = ({ navigation }) => {
  // Booking Steps
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Search Data
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: new Date(),
    returnDate: null,
    passengers: 1,
    tripType: 'one_way',
  });

  // Step 2: Selected Aircraft
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [aircraftList, setAircraftList] = useState([]);

  // Step 3: Passenger Information
  const [passengerData, setPassengerData] = useState({
    passenger_name: '',
    contact_email: '',
    contact_phone: '',
    country_code: '+1',
    special_requests: '',
  });

  // Step 4: Payment Information
  const [paymentData, setPaymentData] = useState({
    card_number: '',
    card_holder: '',
    expiry_date: '',
    cvv: '',
  });

  // Booking Result
  const [bookingResult, setBookingResult] = useState(null);

  // Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('departure');

  // ============================================
  // STEP 1: Search Aircraft
  // ============================================
  const handleSearchAircraft = async () => {
    if (!searchData.origin || !searchData.destination) {
      Alert.alert('Error', 'Please enter origin and destination');
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Searching aircraft...', searchData);

      const params = {
        passengers_min: searchData.passengers,
        is_for_charter: true,
      };

      const response = await getCharterAircraft(params);
      
      if (response?.results && response.results.length > 0) {
        setAircraftList(response.results);
        setCurrentStep(2);
        Alert.alert('Success', `Found ${response.results.length} available aircraft`);
      } else {
        Alert.alert('No Results', 'No aircraft found for your search criteria');
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', error.message || 'Failed to search aircraft');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // STEP 2: Select Aircraft
  // ============================================
  const handleSelectAircraft = async (aircraft) => {
    setLoading(true);
    try {
      console.log('✈️ Fetching aircraft details...', aircraft.id);
      
      const details = await getCharterAircraftById(aircraft.id);
      setSelectedAircraft(details);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error fetching aircraft details:', error);
      // Still proceed with basic info if details fetch fails
      setSelectedAircraft(aircraft);
      setCurrentStep(3);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // STEP 3: Enter Passenger Information
  // ============================================
  const validatePassengerData = () => {
    if (!passengerData.passenger_name.trim()) {
      Alert.alert('Error', 'Please enter passenger name');
      return false;
    }
    if (!passengerData.contact_email.trim()) {
      Alert.alert('Error', 'Please enter email address');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(passengerData.contact_email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!passengerData.contact_phone.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return false;
    }
    if (passengerData.contact_phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validatePassengerData()) {
      setCurrentStep(4);
    }
  };

  // ============================================
  // STEP 4: Process Payment & Create Booking
  // ============================================
  const validatePaymentData = () => {
    if (!paymentData.card_number.trim()) {
      Alert.alert('Error', 'Please enter card number');
      return false;
    }
    if (paymentData.card_number.replace(/\s/g, '').length < 16) {
      Alert.alert('Error', 'Please enter a valid card number');
      return false;
    }
    if (!paymentData.card_holder.trim()) {
      Alert.alert('Error', 'Please enter card holder name');
      return false;
    }
    if (!paymentData.expiry_date.trim()) {
      Alert.alert('Error', 'Please enter expiry date');
      return false;
    }
    if (!paymentData.cvv.trim() || paymentData.cvv.length < 3) {
      Alert.alert('Error', 'Please enter valid CVV');
      return false;
    }
    return true;
  };

  const handleCompleteBooking = async () => {
    if (!validatePaymentData()) {
      return;
    }

    setLoading(true);
    try {
      console.log('💳 Processing payment...');

      // Step 4a: Process Payment
      const paymentResponse = await processPayment({
        amount: calculateTotalPrice(),
        currency: 'USD',
        card_number: paymentData.card_number,
        card_holder: paymentData.card_holder,
        expiry_date: paymentData.expiry_date,
        cvv: paymentData.cvv,
      });

      console.log('✅ Payment successful:', paymentResponse);

      // Step 4b: Create Booking
      console.log('📝 Creating booking...');

      const bookingPayload = {
        aircraft_id: selectedAircraft.id,
        passenger_name: passengerData.passenger_name.trim(),
        contact_email: passengerData.contact_email.trim(),
        contact_phone: `${passengerData.country_code}${passengerData.contact_phone.trim()}`,
        departure_date: formatDate(searchData.departureDate),
        return_date: searchData.tripType === 'round_trip' ? formatDate(searchData.returnDate) : null,
        origin: searchData.origin.toUpperCase(),
        destination: searchData.destination.toUpperCase(),
        passengers_count: parseInt(searchData.passengers),
        special_requests: passengerData.special_requests.trim() || '',
        trip_type: searchData.tripType,
        
        // Payment Information
        payment_id: paymentResponse.payment_id,
        transaction_id: paymentResponse.transaction_id,
        amount_paid: calculateTotalPrice(),
        currency: 'USD',
        payment_status: 'completed',
        
        // Additional Info
        booking_source: 'mobile_app',
        booking_time: new Date().toISOString(),
      };

      console.log('📤 Booking payload:', bookingPayload);

      const bookingResponse = await makeBooking(bookingPayload);

      console.log('✅ Booking successful:', bookingResponse);

      // Save booking result
      setBookingResult({
        ...bookingResponse,
        payment: paymentResponse,
        aircraft: selectedAircraft,
      });

      // Move to confirmation step
      setCurrentStep(5);

      Alert.alert(
        '🎉 Booking Confirmed!',
        `Your booking has been confirmed.\n\nBooking Reference: ${bookingResponse.booking_reference || bookingResponse.id}\n\nA confirmation email has been sent to ${passengerData.contact_email}`,
        [{ text: 'View Details', onPress: () => {} }]
      );
    } catch (error) {
      console.error('❌ Booking error:', error);
      Alert.alert(
        'Booking Failed',
        error.message || 'Failed to complete booking. Please try again or contact support.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Helper Functions
  // ============================================
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateTotalPrice = () => {
    // Calculate based on aircraft, passengers, and trip type
    const basePrice = 5000; // Base price per trip
    const passengerMultiplier = searchData.passengers;
    const tripMultiplier = searchData.tripType === 'round_trip' ? 1.8 : 1;
    
    return Math.round(basePrice * passengerMultiplier * tripMultiplier);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (datePickerMode === 'departure') {
        setSearchData({ ...searchData, departureDate: selectedDate });
      } else {
        setSearchData({ ...searchData, returnDate: selectedDate });
      }
    }
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setSelectedAircraft(null);
    setAircraftList([]);
    setPassengerData({
      passenger_name: '',
      contact_email: '',
      contact_phone: '',
      country_code: '+1',
      special_requests: '',
    });
    setPaymentData({
      card_number: '',
      card_holder: '',
      expiry_date: '',
      cvv: '',
    });
    setBookingResult(null);
  };

  // ============================================
  // Render Functions
  // ============================================

  // Render Progress Steps
  const renderProgressSteps = () => {
    const steps = [
      { number: 1, title: 'Search' },
      { number: 2, title: 'Select' },
      { number: 3, title: 'Details' },
      { number: 4, title: 'Payment' },
      { number: 5, title: 'Confirm' },
    ];

    return (
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <View key={step.number} style={styles.stepWrapper}>
            <View
              style={[
                styles.stepCircle,
                currentStep >= step.number && styles.stepCircleActive,
                currentStep === step.number && styles.stepCircleCurrent,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  currentStep >= step.number && styles.stepNumberActive,
                ]}
              >
                {step.number}
              </Text>
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  currentStep > step.number && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  // STEP 1: Search Form
  const renderSearchStep = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepHeading}>Search for Aircraft</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Origin (Airport Code) *</Text>
        <TextInput
          style={styles.input}
          value={searchData.origin}
          onChangeText={(text) => setSearchData({ ...searchData, origin: text })}
          placeholder="e.g., JFK, LAX, DXB"
          autoCapitalize="characters"
          maxLength={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Destination (Airport Code) *</Text>
        <TextInput
          style={styles.input}
          value={searchData.destination}
          onChangeText={(text) =>
            setSearchData({ ...searchData, destination: text })
          }
          placeholder="e.g., LAX, LHR, SIN"
          autoCapitalize="characters"
          maxLength={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Trip Type *</Text>
        <View style={styles.tripTypeContainer}>
          <TouchableOpacity
            style={[
              styles.tripTypeButton,
              searchData.tripType === 'one_way' && styles.tripTypeButtonActive,
            ]}
            onPress={() => setSearchData({ ...searchData, tripType: 'one_way' })}
          >
            <Text
              style={[
                styles.tripTypeText,
                searchData.tripType === 'one_way' && styles.tripTypeTextActive,
              ]}
            >
              One Way
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tripTypeButton,
              searchData.tripType === 'round_trip' && styles.tripTypeButtonActive,
            ]}
            onPress={() =>
              setSearchData({ ...searchData, tripType: 'round_trip' })
            }
          >
            <Text
              style={[
                styles.tripTypeText,
                searchData.tripType === 'round_trip' && styles.tripTypeTextActive,
              ]}
            >
              Round Trip
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Departure Date *</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setDatePickerMode('departure');
            setShowDatePicker(true);
          }}
        >
          <Text style={styles.dateText}>{formatDate(searchData.departureDate)}</Text>
        </TouchableOpacity>
      </View>

      {searchData.tripType === 'round_trip' && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Return Date *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setDatePickerMode('return');
              setShowDatePicker(true);
            }}
          >
            <Text style={styles.dateText}>
              {searchData.returnDate
                ? formatDate(searchData.returnDate)
                : 'Select Date'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Number of Passengers *</Text>
        <View style={styles.passengerContainer}>
          <TouchableOpacity
            style={styles.passengerButton}
            onPress={() =>
              setSearchData({
                ...searchData,
                passengers: Math.max(1, searchData.passengers - 1),
              })
            }
          >
            <Text style={styles.passengerButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.passengerCount}>{searchData.passengers}</Text>
          <TouchableOpacity
            style={styles.passengerButton}
            onPress={() =>
              setSearchData({
                ...searchData,
                passengers: Math.min(20, searchData.passengers + 1),
              })
            }
          >
            <Text style={styles.passengerButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleSearchAircraft}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Search Aircraft</Text>
        )}
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={
            datePickerMode === 'departure'
              ? searchData.departureDate
              : searchData.returnDate || new Date()
          }
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </ScrollView>
  );

  // STEP 2: Aircraft Selection
  const renderAircraftSelectionStep = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepHeading}>Select Your Aircraft</Text>
      <Text style={styles.subHeading}>
        {aircraftList.length} aircraft available for your route
      </Text>

      {aircraftList.map((aircraft) => (
        <TouchableOpacity
          key={aircraft.id}
          style={styles.aircraftCard}
          onPress={() => handleSelectAircraft(aircraft)}
        >
          <View style={styles.aircraftHeader}>
            <Text style={styles.aircraftName}>
              {aircraft.registration_number}
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: aircraft.is_for_charter
                    ? '#16A34A'
                    : '#DC2626',
                },
              ]}
            >
              <Text style={styles.statusText}>
                {aircraft.is_for_charter ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          </View>

          <Text style={styles.aircraftModel}>
            {aircraft.aircraft_type?.name || 'Private Jet'}
          </Text>

          <View style={styles.aircraftSpecs}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Passengers</Text>
              <Text style={styles.specValue}>
                {aircraft.passengers_max || 'N/A'}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Year</Text>
              <Text style={styles.specValue}>
                {aircraft.year_of_production || 'N/A'}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Range</Text>
              <Text style={styles.specValue}>
                {aircraft.range_nm ? `${aircraft.range_nm} nm` : 'N/A'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Select Aircraft</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setCurrentStep(1)}
      >
        <Text style={styles.secondaryButtonText}>← Back to Search</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // STEP 3: Passenger Information
  const renderPassengerInfoStep = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepHeading}>Passenger Information</Text>

      {selectedAircraft && (
        <View style={styles.selectedAircraftInfo}>
          <Text style={styles.selectedLabel}>Selected Aircraft:</Text>
          <Text style={styles.selectedValue}>
            {selectedAircraft.registration_number}
          </Text>
          <Text style={styles.selectedSubvalue}>
            {selectedAircraft.aircraft_type?.name || 'Private Jet'}
          </Text>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={passengerData.passenger_name}
          onChangeText={(text) =>
            setPassengerData({ ...passengerData, passenger_name: text })
          }
          placeholder="Enter passenger full name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          value={passengerData.contact_email}
          onChangeText={(text) =>
            setPassengerData({ ...passengerData, contact_email: text })
          }
          placeholder="your.email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <View style={styles.phoneContainer}>
          <TextInput
            style={[styles.input, styles.countryCodeInput]}
            value={passengerData.country_code}
            onChangeText={(text) =>
              setPassengerData({ ...passengerData, country_code: text })
            }
            placeholder="+1"
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, styles.phoneInput]}
            value={passengerData.contact_phone}
            onChangeText={(text) =>
              setPassengerData({ ...passengerData, contact_phone: text })
            }
            placeholder="Phone number"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Special Requests (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={passengerData.special_requests}
          onChangeText={(text) =>
            setPassengerData({ ...passengerData, special_requests: text })
          }
          placeholder="Any special requirements or requests..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { flex: 1, marginRight: 8 }]}
          onPress={() => setCurrentStep(2)}
        >
          <Text style={styles.secondaryButtonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { flex: 1, marginLeft: 8 }]}
          onPress={handleContinueToPayment}
        >
          <Text style={styles.primaryButtonText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // STEP 4: Payment
  const renderPaymentStep = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepHeading}>Payment Information</Text>

      <View style={styles.priceSummary}>
        <Text style={styles.priceSummaryTitle}>Booking Summary</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Route:</Text>
          <Text style={styles.priceValue}>
            {searchData.origin} → {searchData.destination}
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Passengers:</Text>
          <Text style={styles.priceValue}>{searchData.passengers}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Trip Type:</Text>
          <Text style={styles.priceValue}>
            {searchData.tripType === 'one_way' ? 'One Way' : 'Round Trip'}
          </Text>
        </View>
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>${calculateTotalPrice()}</Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Card Number *</Text>
        <TextInput
          style={styles.input}
          value={paymentData.card_number}
          onChangeText={(text) =>
            setPaymentData({ ...paymentData, card_number: text })
          }
          placeholder="1234 5678 9012 3456"
          keyboardType="number-pad"
          maxLength={19}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Card Holder Name *</Text>
        <TextInput
          style={styles.input}
          value={paymentData.card_holder}
          onChangeText={(text) =>
            setPaymentData({ ...paymentData, card_holder: text })
          }
          placeholder="Name on card"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.rowInputs}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Expiry Date *</Text>
          <TextInput
            style={styles.input}
            value={paymentData.expiry_date}
            onChangeText={(text) =>
              setPaymentData({ ...paymentData, expiry_date: text })
            }
            placeholder="MM/YY"
            keyboardType="number-pad"
            maxLength={5}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>CVV *</Text>
          <TextInput
            style={styles.input}
            value={paymentData.cvv}
            onChangeText={(text) =>
              setPaymentData({ ...paymentData, cvv: text })
            }
            placeholder="123"
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>

      <Text style={styles.securityNote}>
        🔒 Your payment information is secure and encrypted
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { flex: 1, marginRight: 8 }]}
          onPress={() => setCurrentStep(3)}
        >
          <Text style={styles.secondaryButtonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { flex: 1, marginLeft: 8 },
            loading && styles.buttonDisabled,
          ]}
          onPress={handleCompleteBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Complete Booking</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // STEP 5: Confirmation
  const renderConfirmationStep = () => (
    <ScrollView style={styles.stepContainer}>
      <View style={styles.confirmationContainer}>
        <Text style={styles.confirmationIcon}>✅</Text>
        <Text style={styles.confirmationTitle}>Booking Confirmed!</Text>
        <Text style={styles.confirmationSubtitle}>
          Your private jet has been booked successfully
        </Text>

        {bookingResult && (
          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Booking Reference:</Text>
              <Text style={styles.detailValue}>
                {bookingResult.booking_reference || bookingResult.id}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID:</Text>
              <Text style={styles.detailValue}>
                {bookingResult.payment?.transaction_id}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Aircraft:</Text>
              <Text style={styles.detailValue}>
                {selectedAircraft?.registration_number}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Route:</Text>
              <Text style={styles.detailValue}>
                {searchData.origin} → {searchData.destination}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Departure:</Text>
              <Text style={styles.detailValue}>
                {formatDate(searchData.departureDate)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Passengers:</Text>
              <Text style={styles.detailValue}>{searchData.passengers}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount Paid:</Text>
              <Text style={styles.detailValue}>${calculateTotalPrice()}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[styles.detailValue, styles.statusConfirmed]}>
                Confirmed
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.confirmationNote}>
          📧 A confirmation email has been sent to{' '}
          {passengerData.contact_email}
        </Text>

        <Text style={styles.confirmationNote}>
          📱 You will receive an SMS confirmation at{' '}
          {passengerData.country_code}
          {passengerData.contact_phone}
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            resetBooking();
            // navigation.goBack(); // Uncomment to go back to previous screen
          }}
        >
          <Text style={styles.primaryButtonText}>Book Another Flight</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ============================================
  // Main Render
  // ============================================
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Private Jet Booking</Text>
        <Text style={styles.headerSubtitle}>Aviapages Charter Service</Text>
      </View>

      {renderProgressSteps()}

      {currentStep === 1 && renderSearchStep()}
      {currentStep === 2 && renderAircraftSelectionStep()}
      {currentStep === 3 && renderPassengerInfoStep()}
      {currentStep === 4 && renderPaymentStep()}
      {currentStep === 5 && renderConfirmationStep()}
    </SafeAreaView>
  );
};

// ============================================
// Styles
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#DC2626',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FECACA',
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stepWrapper: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: '#DC2626',
  },
  stepCircleCurrent: {
    backgroundColor: '#991B1B',
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepTitle: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: '#E5E7EB',
  },
  stepLineActive: {
    backgroundColor: '#DC2626',
  },
  stepContainer: {
    flex: 1,
    padding: 16,
  },
  stepHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  tripTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tripTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  tripTypeButtonActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  tripTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tripTypeTextActive: {
    color: '#fff',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#1F2937',
  },
  passengerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  passengerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  passengerCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  primaryButton: {
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  aircraftCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  aircraftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aircraftName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  aircraftModel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  aircraftSpecs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  specItem: {
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  selectButton: {
    backgroundColor: '#DC2626',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedAircraftInfo: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  selectedLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  selectedValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  selectedSubvalue: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCodeInput: {
    flex: 0.3,
  },
  phoneInput: {
    flex: 0.7,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  priceSummary: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priceSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  securityNote: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  confirmationContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  confirmationIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  bookingDetails: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusConfirmed: {
    color: '#16A34A',
  },
  confirmationNote: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default CompleteBookingFlow;
