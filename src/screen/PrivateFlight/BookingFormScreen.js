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
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { makeBooking } from '../../Aviapages/api';
 import CustomHeader from '../../compoent/CustomHeader' ;
 import imageIndex from '../../assets/imageIndex'
const RED_THEME = {
  primary: '#FF3B30',
  primaryDark: '#FF3B30',
  primaryLight: '#EF4444',
  secondary: '#FF3B30',
  background: '#FEF2F2',
  card: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#FECACA',
  error: '#FF3B30',
  success: '#16A34A',
  warning: '#D97706'
};

const BookingFormScreen = ({ route, navigation }) => {
  const { jet } = route.params;
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [bookingData, setBookingData] = useState({
    // Passenger Information
    passenger_name: '',
    contact_email: '',
    contact_phone: '',
    passengers_count: '1',
    
    // Flight Details
    trip_type: 'one_way',
    departure_date: '',
    return_date: '',
    origin: '',
    destination: '',
    
    // Additional Information
    special_requests: ''
  });

  const validateStep1 = () => {
    if (!bookingData.passenger_name.trim()) {
      Alert.alert('Error', 'Please enter passenger name');
      return false;
    }
    if (!bookingData.contact_email.trim()) {
      Alert.alert('Error', 'Please enter email address');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(bookingData.contact_email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!bookingData.contact_phone.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return false;
    }
    if (!bookingData.passengers_count || parseInt(bookingData.passengers_count) < 1) {
      Alert.alert('Error', 'Please enter number of passengers');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!bookingData.departure_date.trim()) {
      Alert.alert('Error', 'Please select departure date');
      return false;
    }
    if (!bookingData.origin.trim()) {
      Alert.alert('Error', 'Please enter origin airport');
      return false;
    }
    if (!bookingData.destination.trim()) {
      Alert.alert('Error', 'Please enter destination airport');
      return false;
    }
    if (bookingData.trip_type === 'round_trip' && !bookingData.return_date.trim()) {
      Alert.alert('Error', 'Please select return date for round trip');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const bookingPayload = {
        aircraft_id: jet.id,
        passenger_name: bookingData.passenger_name.trim(),
        contact_email: bookingData.contact_email.trim(),
        contact_phone: bookingData.contact_phone.trim(),
        departure_date: bookingData.departure_date,
        return_date: bookingData.trip_type === 'round_trip' ? bookingData.return_date : null,
        origin: bookingData.origin.trim().toUpperCase(),
        destination: bookingData.destination.trim().toUpperCase(),
        passengers_count: parseInt(bookingData.passengers_count),
        special_requests: bookingData.special_requests?.trim() || '',
        trip_type: bookingData.trip_type,
        booking_source: 'mobile_app'
      };

      const result = await makeBooking(bookingPayload);
      
      // Navigate to payment screen
      navigation.navigate('PaymentScreen', {
        bookingData: bookingPayload,
        bookingResult: result,
        jet: jet
      });
    } catch (error) {
      Alert.alert('Booking Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepsContainer}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep >= step && styles.stepCircleActive
          ]}>
            <Text style={[
              styles.stepText,
              currentStep >= step && styles.stepTextActive
            ]}>{step}</Text>
          </View>
          <Text style={[
            styles.stepLabel,
            currentStep >= step && styles.stepLabelActive  ,{
                marginLeft:2
            }
          ]}>
            {step === 1 ? 'Passenger' : step === 2 ? 'Flight' : 'Review'}
          </Text>
          {step < 3 && <View style={[
            styles.stepLine,
            currentStep > step && styles.stepLineActive
          ]} />}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Passenger Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={styles.textInput}
          value={bookingData.passenger_name}
          onChangeText={(text) => setBookingData(prev => ({...prev, passenger_name: text}))}
          placeholder="Enter your full name"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address *</Text>
        <TextInput
          style={styles.textInput}
          value={bookingData.contact_email}
          onChangeText={(text) => setBookingData(prev => ({...prev, contact_email: text}))}
          placeholder="your.email@example.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Phone Number *</Text>
        <TextInput
          style={styles.textInput}
          value={bookingData.contact_phone}
          onChangeText={(text) => setBookingData(prev => ({...prev, contact_phone: text}))}
          placeholder="+1 (555) 123-4567"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          autoComplete="tel"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Number of Passengers *</Text>
        <TextInput
          style={styles.textInput}
          value={bookingData.passengers_count}
          onChangeText={(text) => setBookingData(prev => ({...prev, passengers_count: text.replace(/[^0-9]/g, '')}))}
          placeholder="1"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={2}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Flight Details</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Trip Type</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity 
            style={[
              styles.radioButton,
              bookingData.trip_type === 'one_way' && styles.radioButtonSelected
            ]}
            onPress={() => setBookingData(prev => ({...prev, trip_type: 'one_way', return_date: ''}))}
          >
            <Text style={[
              styles.radioText,
              bookingData.trip_type === 'one_way' && styles.radioTextSelected
            ]}>One Way</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.radioButton,
              bookingData.trip_type === 'round_trip' && styles.radioButtonSelected
            ]}
            onPress={() => setBookingData(prev => ({...prev, trip_type: 'round_trip'}))}
          >
            <Text style={[
              styles.radioText,
              bookingData.trip_type === 'round_trip' && styles.radioTextSelected
            ]}>Round Trip</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Departure Date *</Text>
        <TextInput
          style={styles.textInput}
          value={bookingData.departure_date}
          onChangeText={(text) => setBookingData(prev => ({...prev, departure_date: text}))}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999"
        />
      </View>

      {bookingData.trip_type === 'round_trip' && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Return Date *</Text>
          <TextInput
            style={styles.textInput}
            value={bookingData.return_date}
            onChangeText={(text) => setBookingData(prev => ({...prev, return_date: text}))}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#999"
          />
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Origin Airport *</Text>
        <TextInput
          style={styles.textInput}
          value={bookingData.origin}
          onChangeText={(text) => setBookingData(prev => ({...prev, origin: text}))}
          placeholder="e.g., JFK, LAX, DXB"
          placeholderTextColor="#999"
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Destination Airport *</Text>
        <TextInput
          style={styles.textInput}
          value={bookingData.destination}
          onChangeText={(text) => setBookingData(prev => ({...prev, destination: text}))}
          placeholder="e.g., LAX, JFK, LHR"
          placeholderTextColor="#999"
          autoCapitalize="characters"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Review & Confirm</Text>
      
      <View style={styles.bookingSummary}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        
        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>Aircraft</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Registration:</Text>
            <Text style={styles.summaryValue}>{jet.registration_number}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Model:</Text>
            <Text style={styles.summaryValue}>{jet.manufacturer?.name} {jet.model?.name}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Max Passengers:</Text>
            <Text style={styles.summaryValue}>{jet.passengers_max}</Text>
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>Passenger</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Name:</Text>
            <Text style={styles.summaryValue}>{bookingData.passenger_name}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Email:</Text>
            <Text style={styles.summaryValue}>{bookingData.contact_email}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Phone:</Text>
            <Text style={styles.summaryValue}>{bookingData.contact_phone}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Passengers:</Text>
            <Text style={styles.summaryValue}>{bookingData.passengers_count}</Text>
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>Flight</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Trip Type:</Text>
            <Text style={styles.summaryValue}>
              {bookingData.trip_type === 'one_way' ? 'One Way' : 'Round Trip'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Route:</Text>
            <Text style={styles.summaryValue}>
              {bookingData.origin} → {bookingData.destination}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Departure:</Text>
            <Text style={styles.summaryValue}>{bookingData.departure_date}</Text>
          </View>
          {bookingData.trip_type === 'round_trip' && bookingData.return_date && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Return:</Text>
              <Text style={styles.summaryValue}>{bookingData.return_date}</Text>
            </View>
          )}
        </View>

        {bookingData.special_requests && (
          <View style={styles.summarySection}>
            <Text style={styles.summarySectionTitle}>Special Requests</Text>
            <Text style={styles.specialRequests}>{bookingData.special_requests}</Text>
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Special Requests (Optional)</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={bookingData.special_requests}
          onChangeText={(text) => setBookingData(prev => ({...prev, special_requests: text}))}
          placeholder="Any special requirements or requests..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <CustomHeader imageSource={imageIndex.backorange} label="Boking From" />

        {/* Selected Jet Info */}
        <View style={styles.jetInfo}>
          <Text style={styles.jetInfoTitle}>Selected Aircraft</Text>
          <Text style={styles.jetInfoText}>
            {jet.registration_number} - {jet.manufacturer?.name} {jet.model?.name}
          </Text>
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={prevStep}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          {currentStep < 3 ? (
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={nextStep}
              disabled={loading}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Proceed to Payment</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RED_THEME.background,
  },
  scrollView: {
    flex: 1,
    marginTop:40
  },
  jetInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: RED_THEME.border,
  },
  jetInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: RED_THEME.primary,
    marginBottom: 4,
  },
  jetInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: RED_THEME.text,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: RED_THEME.border,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  stepCircleActive: {
    backgroundColor: RED_THEME.primary,
    borderColor: RED_THEME.primary,
  },
  stepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  stepTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: RED_THEME.primary,
    fontWeight: '600',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: RED_THEME.primary,
  },
  stepContent: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: RED_THEME.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: RED_THEME.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: RED_THEME.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  radioButtonSelected: {
    backgroundColor: '#FEF2F2',
    borderColor: RED_THEME.primary,
  },
  radioText: {
    fontSize: 16,
    fontWeight: '600',
    color: RED_THEME.textLight,
  },
  radioTextSelected: {
    color: RED_THEME.primary,
  },
  bookingSummary: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: RED_THEME.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  summarySection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summarySectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: RED_THEME.primary,
    marginBottom: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: RED_THEME.textLight,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: RED_THEME.text,
    fontWeight: '600',
    textAlign: 'right',
  },
  specialRequests: {
    fontSize: 14,
    color: RED_THEME.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  navigationButtons: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#6B7280',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: RED_THEME.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: RED_THEME.success,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: RED_THEME.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingFormScreen;