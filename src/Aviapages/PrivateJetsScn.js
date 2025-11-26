import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  TextInput,
  Modal,
  ScrollView,
  RefreshControl,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import { 
  getCharterAircraft, 
  getCharterAircraftById, 
  makeBooking, 
  searchAircraft,
  getAircraftTypes,
  getManufacturers 
} from './api';

const { width } = Dimensions.get('window');

// Red Theme Colors
const RED_THEME = {
  primary: '#DC2626',
  primaryDark: '#B91C1C',
  primaryLight: '#EF4444',
  secondary: '#991B1B',
  background: '#FEF2F2',
  card: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#FECACA',
  error: '#DC2626',
  success: '#16A34A',
  warning: '#D97706'
};

const PrivateJetsScrsssseen = () => {
  const [jets, setJets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJet, setSelectedJet] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [aircraftTypes, setAircraftTypes] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  
  const [bookingData, setBookingData] = useState({
    passenger_name: '',
    contact_email: '',
    contact_phone: '',
    departure_date: '',
    return_date: '',
    origin: '',
    destination: '',
    passengers_count: '1',
    special_requests: '',
    trip_type: 'one_way'
  });

  const [bookingStep, setBookingStep] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [filters, setFilters] = useState({
    passengers_min: '',
    passengers_max: '',
    aircraft_type: '',
    manufacturer: '',
    year_min: '',
    year_max: '',
    is_for_charter: true
  });

  useEffect(() => {
    fetchJets();
    fetchAircraftTypes();
    fetchManufacturers();
  }, []);

  const fetchJets = async (params = {}) => {
    setLoading(true);
    try {
      const data = await getCharterAircraft(params);
      setJets(data?.results || []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAircraftTypes = async () => {
    try {
      const data = await getAircraftTypes();
      setAircraftTypes(data?.results || []);
    } catch (error) {
      console.error('Error fetching aircraft types:', error);
    }
  };

  const fetchManufacturers = async () => {
    try {
      const data = await getManufacturers();
      setManufacturers(data?.results || []);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJets();
    setRefreshing(false);
  };

  const fetchJetDetails = async (jetId) => {
    setDetailLoading(true);
    try {
      const jetDetails = await getCharterAircraftById(jetId);
      setSelectedJet(jetDetails);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchJets();
      return;
    }

    setLoading(true);
    try {
      const searchParams = {
        search: searchQuery,
        ...filters
      };
      const data = await searchAircraft(searchParams);
      setJets(data?.results || []);
    } catch (error) {
      Alert.alert('Search Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      const filterParams = {};
      
      if (filters.passengers_min) filterParams.passengers_min = filters.passengers_min;
      if (filters.passengers_max) filterParams.passengers_max = filters.passengers_max;
      if (filters.aircraft_type) filterParams.aircraft_type = filters.aircraft_type;
      if (filters.manufacturer) filterParams.manufacturer = filters.manufacturer;
      if (filters.year_min) filterParams.year_min = filters.year_min;
      if (filters.year_max) filterParams.year_max = filters.year_max;
      filterParams.is_for_charter = filters.is_for_charter;

      const data = await searchAircraft(filterParams);
      setJets(data?.results || []);
      setShowFilters(false);
    } catch (error) {
      Alert.alert('Filter Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      passengers_min: '',
      passengers_max: '',
      aircraft_type: '',
      manufacturer: '',
      year_min: '',
      year_max: '',
      is_for_charter: true
    });
    fetchJets();
    setShowFilters(false);
  };

  const validateBookingForm = () => {
    const requiredFields = [
      'passenger_name', 
      'contact_email', 
      'contact_phone',
      'departure_date', 
      'origin', 
      'destination',
      'passengers_count'
    ];

    const missingFields = requiredFields.filter(field => !bookingData[field].trim());
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill all required fields');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.contact_email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }

    // Phone validation (basic)
    if (bookingData.contact_phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return false;
    }

    // Date validation
    const today = new Date().toISOString().split('T')[0];
    if (bookingData.departure_date < today) {
      Alert.alert('Invalid Date', 'Departure date cannot be in the past');
      return false;
    }

    if (bookingData.trip_type === 'round_trip' && bookingData.return_date) {
      if (bookingData.return_date <= bookingData.departure_date) {
        Alert.alert('Invalid Date', 'Return date must be after departure date');
        return false;
      }
    }

    return true;
  };

  const handleBooking = async () => {
    if (!selectedJet) return;

    if (!validateBookingForm()) {
      return;
    }

    setBookingLoading(true);
    try {
      const bookingPayload = {
        aircraft_id: selectedJet.id,
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
        booking_source: 'mobile_app',
        booking_time: new Date().toISOString()
      };

      console.log('Sending booking payload:', bookingPayload);

      const result = await makeBooking(bookingPayload);
      
      Alert.alert(
        '🎉 Booking Request Successful!', 
        `Booking Reference: ${result.booking_reference || result.id}\n\nWe have received your booking request for:\n${selectedJet.registration_number} - ${selectedJet.manufacturer?.name} ${selectedJet.model?.name}\n\nOur team will contact you within 30 minutes to confirm your flight.`,
        [
          { 
            text: 'Great!', 
            onPress: () => {
              setShowBookingModal(false);
              resetBookingForm();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Booking Failed', 
        error.message || 'Unable to process booking. Please try again or contact support.'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const resetBookingForm = () => {
    setBookingData({
      passenger_name: '',
      contact_email: '',
      contact_phone: '',
      departure_date: '',
      return_date: '',
      origin: '',
      destination: '',
      passengers_count: '1',
      special_requests: '',
      trip_type: 'one_way'
    });
    setBookingStep(1);
  };

  const openBookingModal = (jet) => {
    setSelectedJet(jet);
    setShowBookingModal(true);
    setBookingStep(1);
  };

  const nextBookingStep = () => {
    if (bookingStep === 1) {
      // Validate step 1
      if (!bookingData.passenger_name.trim() || !bookingData.contact_email.trim() || !bookingData.contact_phone.trim()) {
        Alert.alert('Missing Information', 'Please fill all passenger details');
        return;
      }
    }
    setBookingStep(bookingStep + 1);
  };

  const prevBookingStep = () => {
    setBookingStep(bookingStep - 1);
  };

  const renderJetItem = ({ item }) => (
    <View style={styles.jetCard}>
      <View style={styles.cardHeader}>
        <View style={styles.jetBasicInfo}>
          <Text style={styles.jetRegistration}>{item.registration_number}</Text>
          <Text style={styles.jetModel}>
            {item.manufacturer?.name} {item.model?.name}
          </Text>
        </View>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: item.is_for_charter ? RED_THEME.success : RED_THEME.error }
        ]}>
          <Text style={styles.statusText}>
            {item.is_for_charter ? 'Available' : 'Not Available'}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.specsRow}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Passengers</Text>
            <Text style={styles.specValue}>{item.passengers_max || 'N/A'}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Year</Text>
            <Text style={styles.specValue}>{item.year_of_production || 'N/A'}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Range</Text>
            <Text style={styles.specValue}>
              {item.range_nm ? `${item.range_nm} nm` : 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.specsRow}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Baggage</Text>
            <Text style={styles.specValue}>
              {item.baggage_capacity_kg ? `${item.baggage_capacity_kg}kg` : 'N/A'}
            </Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Crew</Text>
            <Text style={styles.specValue}>{item.crew_members_count || 'N/A'}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Type</Text>
            <Text style={styles.specValue}>{item.aircraft_type?.name || 'N/A'}</Text>
          </View>
        </View>

        {item.comment && (
          <Text style={styles.jetComment} numberOfLines={2}>
            {item.comment}
          </Text>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.detailButton}
          onPress={() => fetchJetDetails(item.id)}
        >
          <Text style={styles.detailButtonText}>View Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.bookButton, 
            !item.is_for_charter && styles.bookButtonDisabled
          ]}
          onPress={() => openBookingModal(item)}
          disabled={!item.is_for_charter}
        >
          <Text style={styles.bookButtonText}>
            {item.is_for_charter ? 'Book Now' : 'Not Available'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDetailModal = () => {
    if (!selectedJet) return null;

    return (
      <Modal
        visible={!!selectedJet}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedJet(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Aircraft Details</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedJet(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {detailLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={RED_THEME.primary} />
                <Text style={styles.loadingText}>Loading details...</Text>
              </View>
            ) : (
              <>
                {/* Aircraft Header */}
                <View style={styles.detailHeader}>
                  <Text style={styles.detailRegistration}>
                    {selectedJet.registration_number}
                  </Text>
                  <Text style={styles.detailModel}>
                    {selectedJet.manufacturer?.name} {selectedJet.model?.name}
                  </Text>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: selectedJet.is_for_charter ? RED_THEME.success : RED_THEME.error }
                  ]}>
                    <Text style={styles.statusText}>
                      {selectedJet.is_for_charter ? 'Available for Charter' : 'Not Available'}
                    </Text>
                  </View>
                </View>

                {/* Specifications */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Specifications</Text>
                  <DetailRow label="Aircraft Type" value={selectedJet.aircraft_type?.name} />
                  <DetailRow label="Year" value={selectedJet.year_of_production} />
                  <DetailRow label="Range" value={selectedJet.range_nm ? `${selectedJet.range_nm} nm` : 'N/A'} />
                  <DetailRow label="Max Speed" value={selectedJet.max_speed_kts ? `${selectedJet.max_speed_kts} kts` : 'N/A'} />
                </View>

                {/* Capacity */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Capacity</Text>
                  <DetailRow label="Max Passengers" value={selectedJet.passengers_max} />
                  <DetailRow label="Crew Members" value={selectedJet.crew_members_count} />
                  <DetailRow label="Baggage Capacity" value={selectedJet.baggage_capacity_kg ? `${selectedJet.baggage_capacity_kg} kg` : 'N/A'} />
                </View>

                {/* Additional Information */}
                {selectedJet.comment && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Additional Information</Text>
                    <Text style={styles.commentText}>{selectedJet.comment}</Text>
                  </View>
                )}

                {/* Booking Button */}
                <TouchableOpacity 
                  style={[
                    styles.bookButton,
                    styles.bookButtonLarge,
                    !selectedJet.is_for_charter && styles.bookButtonDisabled
                  ]}
                  onPress={() => openBookingModal(selectedJet)}
                  disabled={!selectedJet.is_for_charter}
                >
                  <Text style={styles.bookButtonText}>
                    {selectedJet.is_for_charter ? 'Book This Aircraft' : 'Not Available for Booking'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value || 'N/A'}</Text>
    </View>
  );

  const renderBookingStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Step 1: Passenger Information</Text>
      
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

  const renderBookingStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Step 2: Flight Details</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Trip Type</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity 
            style={[
              styles.radioButton,
              bookingData.trip_type === 'one_way' && styles.radioButtonSelected
            ]}
            onPress={() => setBookingData(prev => ({...prev, trip_type: 'one_way'}))}
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
          <Text style={styles.inputLabel}>Return Date</Text>
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

  const renderBookingStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Step 3: Additional Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Special Requests</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={bookingData.special_requests}
          onChangeText={(text) => setBookingData(prev => ({...prev, special_requests: text}))}
          placeholder="Any special requirements, catering preferences, or additional requests..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.bookingSummary}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Aircraft:</Text>
          <Text style={styles.summaryValue}>
            {selectedJet?.registration_number} - {selectedJet?.manufacturer?.name} {selectedJet?.model?.name}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Passenger:</Text>
          <Text style={styles.summaryValue}>{bookingData.passenger_name}</Text>
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
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Passengers:</Text>
          <Text style={styles.summaryValue}>{bookingData.passengers_count}</Text>
        </View>
      </View>
    </View>
  );

  const renderBookingModal = () => (
    <Modal
      visible={showBookingModal}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={() => setShowBookingModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Book Private Jet</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => {
              setShowBookingModal(false);
              resetBookingForm();
            }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Booking Steps Indicator */}
        <View style={styles.stepsContainer}>
          {[1, 2, 3].map((step) => (
            <View key={step} style={styles.stepContainer}>
              <View style={[
                styles.stepCircle,
                bookingStep >= step && styles.stepCircleActive
              ]}>
                <Text style={[
                  styles.stepText,
                  bookingStep >= step && styles.stepTextActive
                ]}>{step}</Text>
              </View>
              {step < 3 && <View style={[
                styles.stepLine,
                bookingStep > step && styles.stepLineActive
              ]} />}
            </View>
          ))}
        </View>

        <ScrollView style={styles.bookingForm}>
          {selectedJet && (
            <View style={styles.selectedJetInfo}>
              <Text style={styles.selectedJetTitle}>Selected Aircraft</Text>
              <Text style={styles.selectedJetText}>
                {selectedJet.registration_number} - {selectedJet.manufacturer?.name} {selectedJet.model?.name}
              </Text>
              <Text style={styles.selectedJetSubtext}>
                Max Passengers: {selectedJet.passengers_max} • Range: {selectedJet.range_nm || 'N/A'} nm
              </Text>
            </View>
          )}

          {bookingStep === 1 && renderBookingStep1()}
          {bookingStep === 2 && renderBookingStep2()}
          {bookingStep === 3 && renderBookingStep3()}

          <View style={styles.bookingActions}>
            {bookingStep > 1 && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={prevBookingStep}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            
            {bookingStep < 3 ? (
              <TouchableOpacity 
                style={styles.nextButton}
                onPress={nextBookingStep}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[
                  styles.submitBookingButton,
                  bookingLoading && styles.submitBookingButtonDisabled
                ]}
                onPress={handleBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBookingText}>Confirm Booking</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.bookingNote}>
            After submitting, our team will contact you within 30 minutes to confirm your booking and discuss payment details.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderFiltersModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filter Aircraft</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filtersForm}>
          <Text style={styles.formSectionTitle}>Passenger Capacity</Text>
          
          <View style={styles.filterRow}>
            <View style={styles.filterInputContainer}>
              <Text style={styles.inputLabel}>Min Passengers</Text>
              <TextInput
                style={styles.filterInput}
                value={filters.passengers_min}
                onChangeText={(text) => setFilters(prev => ({...prev, passengers_min: text.replace(/[^0-9]/g, '')}))}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.filterInputContainer}>
              <Text style={styles.inputLabel}>Max Passengers</Text>
              <TextInput
                style={styles.filterInput}
                value={filters.passengers_max}
                onChangeText={(text) => setFilters(prev => ({...prev, passengers_max: text.replace(/[^0-9]/g, '')}))}
                placeholder="20"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.formSectionTitle}>Aircraft Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Aircraft Type</Text>
            <TextInput
              style={styles.textInput}
              value={filters.aircraft_type}
              onChangeText={(text) => setFilters(prev => ({...prev, aircraft_type: text}))}
              placeholder="e.g., Jet, Turboprop"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Manufacturer</Text>
            <TextInput
              style={styles.textInput}
              value={filters.manufacturer}
              onChangeText={(text) => setFilters(prev => ({...prev, manufacturer: text}))}
              placeholder="e.g., Cessna, Bombardier"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.filterRow}>
            <View style={styles.filterInputContainer}>
              <Text style={styles.inputLabel}>Year From</Text>
              <TextInput
                style={styles.filterInput}
                value={filters.year_min}
                onChangeText={(text) => setFilters(prev => ({...prev, year_min: text.replace(/[^0-9]/g, '')}))}
                placeholder="2000"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.filterInputContainer}>
              <Text style={styles.inputLabel}>Year To</Text>
              <TextInput
                style={styles.filterInput}
                value={filters.year_max}
                onChangeText={(text) => setFilters(prev => ({...prev, year_max: text.replace(/[^0-9]/g, '')}))}
                placeholder="2024"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Reset All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Private Jets</Text>
        <Text style={styles.headerSubtitle}>Premium Air Charter Services</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by registration, model, manufacturer..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholderTextColor="#999"
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Results Summary */}
      {!loading && jets.length > 0 && (
        <View style={styles.resultsSummary}>
          <Text style={styles.resultsText}>
            Showing {jets.length} aircraft{jets.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={RED_THEME.primary} />
          <Text style={styles.loadingText}>Loading Private Jets...</Text>
        </View>
      )}

      {/* Jets List */}
      {!loading && (
        <FlatList
          data={jets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderJetItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[RED_THEME.primary]}
              tintColor={RED_THEME.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No jets found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search criteria or filters
              </Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchJets}>
                <Text style={styles.retryButtonText}>Refresh List</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Modals */}
      {renderDetailModal()}
      {renderBookingModal()}
      {renderFiltersModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RED_THEME.background,
  },
  header: {
    backgroundColor: RED_THEME.primary,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FECACA',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: RED_THEME.border,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: RED_THEME.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: RED_THEME.text,
  },
  searchButton: {
    padding: 16,
    backgroundColor: RED_THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: RED_THEME.secondary,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  resultsSummary: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: RED_THEME.border,
  },
  resultsText: {
    fontSize: 14,
    color: RED_THEME.textLight,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: RED_THEME.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: RED_THEME.textLight,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  jetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: RED_THEME.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  jetBasicInfo: {
    flex: 1,
  },
  jetRegistration: {
    fontSize: 20,
    fontWeight: 'bold',
    color: RED_THEME.text,
    marginBottom: 4,
  },
  jetModel: {
    fontSize: 16,
    color: RED_THEME.textLight,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 20,
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  specItem: {
    alignItems: 'center',
    flex: 1,
  },
  specLabel: {
    fontSize: 12,
    color: RED_THEME.textLight,
    marginBottom: 4,
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: RED_THEME.text,
  },
  jetComment: {
    fontSize: 14,
    color: RED_THEME.textLight,
    fontStyle: 'italic',
    marginTop: 12,
    lineHeight: 20,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: RED_THEME.border,
  },
  detailButtonText: {
    color: RED_THEME.text,
    fontSize: 14,
    fontWeight: '600',
  },
  bookButton: {
    flex: 1,
    backgroundColor: RED_THEME.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: RED_THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bookButtonLarge: {
    marginTop: 20,
    paddingVertical: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    color: RED_THEME.textLight,
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: RED_THEME.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: RED_THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    borderBottomWidth: 1,
    borderBottomColor: RED_THEME.border,
    backgroundColor: '#F8FAFC',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: RED_THEME.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: RED_THEME.error,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  bookingForm: {
    flex: 1,
    padding: 20,
  },
  filtersForm: {
    flex: 1,
    padding: 20,
  },
  // Steps Indicator
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F8FAFC',
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
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: RED_THEME.primary,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: RED_THEME.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: RED_THEME.border,
  },
  detailRegistration: {
    fontSize: 28,
    fontWeight: 'bold',
    color: RED_THEME.text,
    marginBottom: 8,
  },
  detailModel: {
    fontSize: 18,
    color: RED_THEME.textLight,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  selectedJetInfo: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: RED_THEME.primary,
  },
  selectedJetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: RED_THEME.primary,
    marginBottom: 8,
  },
  selectedJetText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: RED_THEME.text,
    marginBottom: 4,
  },
  selectedJetSubtext: {
    fontSize: 14,
    color: RED_THEME.textLight,
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: RED_THEME.text,
    marginBottom: 16,
    marginTop: 8,
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
  // Radio Buttons
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
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  filterInputContainer: {
    flex: 1,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: RED_THEME.text,
  },
  // Booking Actions
  bookingActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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
  submitBookingButton: {
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
  submitBookingButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  submitBookingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookingNote: {
    fontSize: 14,
    color: RED_THEME.textLight,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  // Booking Summary
  bookingSummary: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: RED_THEME.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: RED_THEME.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
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
    flex: 1,
    marginLeft: 8,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#6B7280',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: RED_THEME.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Detail Section Styles
  detailSection: {
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RED_THEME.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: RED_THEME.primary,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 16,
    color: RED_THEME.textLight,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: RED_THEME.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  commentText: {
    fontSize: 16,
    color: RED_THEME.text,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});

export default PrivateJetsScrsssseen;