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
import CustomHeader from '../../compoent/CustomHeader';
import imageIndex from '../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';

const RED_THEME = {
  primary: '#FF3B30',
  primaryDark: '#D32F2F',
  primaryLight: '#FFCDD2',
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
  const { jet } = route?.params || {};
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
      Alert.alert('Error', 'Please enter valid number of passengers (minimum 1)');
      return false;
    }
    if (jet && parseInt(bookingData.passengers_count) > jet.passengers_max) {
      Alert.alert('Error', `Maximum ${jet.passengers_max} passengers allowed for this aircraft`);
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!bookingData.departure_date.trim()) {
      Alert.alert('Error', 'Please select departure date');
      return false;
    }
    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(bookingData.departure_date)) {
      Alert.alert('Error', 'Please enter departure date in YYYY-MM-DD format');
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
    if (bookingData.trip_type === 'round_trip') {
      if (!bookingData.return_date.trim()) {
        Alert.alert('Error', 'Please select return date for round trip');
        return false;
      }
      if (!dateRegex.test(bookingData.return_date)) {
        Alert.alert('Error', 'Please enter return date in YYYY-MM-DD format');
        return false;
      }
      if (bookingData.return_date <= bookingData.departure_date) {
        Alert.alert('Error', 'Return date must be after departure date');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!jet || !jet.id) {
      Alert.alert('Error', 'Aircraft information is missing');
      return;
    }

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
      
      if (result.success) {
        // Navigate to payment screen
        navigation.navigate('PaymentScreen', {
          bookingData: bookingPayload,
          bookingResult: result,
          jet: jet
        });
      } else {
        Alert.alert('Booking Failed', result.message || 'Failed to create booking');
      }
    } catch (error) {
      Alert.alert('Booking Failed', error.message || 'An error occurred while booking');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepsContainer}>
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <View style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              currentStep >= step && styles.stepCircleActive
            ]}>
              <Text style={[
                styles.stepText,
                currentStep >= step && styles.stepTextActive
              ]}>
                {step}
              </Text>
            </View>
            <Text style={[
              styles.stepLabel,
              currentStep >= step && styles.stepLabelActive
            ]}>
              {step === 1 ? 'Passenger' : step === 2 ? 'Flight' : 'Review'}
            </Text>
          </View>
          {step < 3 && (
            <View style={[
              styles.stepLine,
              currentStep > step && styles.stepLineActive
            ]} />
          )}
        </React.Fragment>
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
          autoComplete="name"
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
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9]/g, '');
            if (numericValue === '' || parseInt(numericValue) > 0) {
              setBookingData(prev => ({...prev, passengers_count: numericValue}));
            }
          }}
          placeholder="1"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={2}
        />
        {jet && (
          <Text style={styles.hintText}>
            Maximum capacity: {jet.passengers_max} passengers
          </Text>
        )}
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
            activeOpacity={0.7}
          >
            <Text style={[
              styles.radioText,
              bookingData.trip_type === 'one_way' && styles.radioTextSelected
            ]}>
              One Way
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.radioButton,
              bookingData.trip_type === 'round_trip' && styles.radioButtonSelected
            ]}
            onPress={() => setBookingData(prev => ({...prev, trip_type: 'round_trip'}))}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.radioText,
              bookingData.trip_type === 'round_trip' && styles.radioTextSelected
            ]}>
              Round Trip
            </Text>
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
        <Text style={styles.hintText}>Format: YYYY-MM-DD</Text>
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
          <Text style={styles.hintText}>Format: YYYY-MM-DD</Text>
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
            <Text style={styles.summaryValue}>{jet?.registration_number || 'N/A'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Model:</Text>
            <Text style={styles.summaryValue}>
              {jet?.manufacturer?.name || ''} {jet?.model?.name || ''}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Max Passengers:</Text>
            <Text style={styles.summaryValue}>{jet?.passengers_max || 'N/A'}</Text>
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
    </View>
  );

  return (
    <SafeAreaView style={{
      flex:1
    }}> 
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CustomHeader imageSource={imageIndex.backorange} label="Booking Form" />
        
        {/* Selected Jet Info */}
        <View style={styles.jetInfo}>
          <Text style={styles.jetInfoTitle}>Selected Aircraft</Text>
          <Text style={styles.jetInfoText}>
            {jet?.registration_number || 'N/A'} - {jet?.manufacturer?.name || ''} {jet?.model?.name || ''}
          </Text>
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      {/* Navigation Buttons - Fixed at bottom */}
      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <TouchableOpacity 
            style={[styles.backButton, loading && styles.buttonDisabled]}
            onPress={prevStep}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < 3 ? (
          <TouchableOpacity 
            style={[styles.nextButton, loading && styles.buttonDisabled]}
            onPress={nextStep}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[
              styles.submitButton,
              loading && styles.buttonDisabled
            ]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Proceed to Payment</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RED_THEME.background,
    marginTop:20
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for fixed buttons
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
  stepItem: {
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
    minWidth: 60,
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
  hintText: {
    fontSize: 12,
    color: RED_THEME.textLight,
    marginTop: 4,
    fontStyle: 'italic',
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
    flexShrink: 1,
    marginLeft: 10,
  },
  navigationButtons: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: RED_THEME.border,
    gap: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingFormScreen;