import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  SafeAreaView, 
  Dimensions, 
  Image, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import imageIndex from '../../../assets/imageIndex';
import CustomButton from '../../../compoent/CustomButton';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../../routes/screenName.enum';
import styles from './style';
import { FlightService } from '../../../flightService';
import LoadingModal from '../../../utils/Loader';
import AddressModalInput from '../../../compoent/AutocompleteData';
 
const HomeScreen = () => {
  const { height, width } = Dimensions.get('window');
  const navigation = useNavigation();

  // State for search parameters
  const [searchParams, setSearchParams] = useState({
    // origin: '',
    originLocation: "IDR",
    destination: '',
    destinationLocation: "BHO",
    departureDate: '2025-10-29',
    returnDate: '',
    adults: 1
  });

  // State for address modals
  const [showOriginModal, setShowOriginModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);

  // State for flight data
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [privateJets, setPrivateJets] = useState([]);

  // State for date picker
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState('');

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Select date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Format date for API (YYYY-MM-DD)
  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Validate dates
  const validateDates = (departureDate, returnDate) => {
    if (departureDate && returnDate) {
      const depDate = new Date(departureDate);
      const retDate = new Date(returnDate);
      
      if (retDate <= depDate) {
        Alert.alert(
          'Invalid Date', 
          'Return date must be after departure date',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDeparturePicker(false);
    setShowReturnPicker(false);

    if (selectedDate) {
      const formattedDate = formatDateForAPI(selectedDate);
      
      if (selectedDateType === 'departure') {
        if (searchParams.returnDate && !validateDates(formattedDate, searchParams.returnDate)) {
          return;
        }
        
        setSearchParams(prev => ({
          ...prev,
          departureDate: formattedDate
        }));
      } else if (selectedDateType === 'return') {
        if (searchParams.departureDate && !validateDates(searchParams.departureDate, formattedDate)) {
          return;
        }
        
        setSearchParams(prev => ({
          ...prev,
          returnDate: formattedDate
        }));
      }
    }
    
    setSelectedDateType('');
  };

  // Show date picker
  const showDatePicker = (type) => {
    setSelectedDateType(type);
    
    if (type === 'departure') {
      setShowDeparturePicker(true);
    } else if (type === 'return') {
      setShowReturnPicker(true);
    }
  };

  // Get minimum date for return date picker
  const getMinReturnDate = () => {
    if (searchParams.departureDate) {
      const depDate = new Date(searchParams.departureDate);
      const minDate = new Date(depDate);
      minDate.setDate(depDate.getDate() + 1);
      return minDate;
    }
    return new Date();
  };

  // Get current date for date picker
  const getCurrentDate = (type) => {
    if (type === 'departure' && searchParams.departureDate) {
      return new Date(searchParams.departureDate);
    }
    if (type === 'return' && searchParams.returnDate) {
      return new Date(searchParams.returnDate);
    }
    
    if (type === 'return' && searchParams.departureDate) {
      const depDate = new Date(searchParams.departureDate);
      const nextDay = new Date(depDate);
      nextDay.setDate(depDate.getDate() + 1);
      return nextDay;
    }
    
    return new Date();
  };

  // Handle origin location selection
  const handleOriginSelect = (location) => {
    setSearchParams(prev => ({
      ...prev,
      originLocation: location
    }));
    console.log('Origin location selected:', location);
  };

  // Handle destination location selection
  const handleDestinationSelect = (location) => {
    setSearchParams(prev => ({
      ...prev,
      destinationLocation: location
    }));
    console.log('Destination location selected:', location);
  };

  // Handle address input change
  const handleAddressChange = (text, type) => {
    setSearchParams(prev => ({
      ...prev,
      [type]: text
    }));
  };

  // Open address modal for origin
  const openOriginModal = () => {
    setShowOriginModal(true);
  };

  // Open address modal for destination
  const openDestinationModal = () => {
    setShowDestinationModal(true);
  };

  // Extract airport code from address (basic implementation)
  const extractAirportCode = (address) => {
    const matches = address.match(/\b[A-Z]{3}\b/);
    return matches ? matches[0] : null;
  };

  // Fetch flight data
  const fetchFlights = async () => {
    try {
      if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      if (searchParams.returnDate && !validateDates(searchParams.departureDate, searchParams.returnDate)) {
        return;
      }

      setLoading(true);
      
      // Extract airport codes or use the address text
      const originCode = extractAirportCode(searchParams.origin);
      const destinationCode = extractAirportCode(searchParams.destination);

      console.log('Searching flights with:', {
        origin: originCode || searchParams.origin,
        destination: destinationCode || searchParams.destination,
        departure: searchParams.departureDate,
        return: searchParams.returnDate
      });

      const data = await FlightService.searchFlights(
        originCode || searchParams.origin,
        destinationCode || searchParams.destination,
        searchParams.departureDate,
        searchParams.returnDate,
        searchParams.adults
      );
      
      setFlights(data.data || []);
      
      // Create private jets data
      const jetsData = (data.data || []).slice(0, 3).map((flight, index) => ({
        id: `jet-${index}`,
        name: `Private Jet ${index + 1}`,
        seats: Math.floor(Math.random() * 10) + 4,
        speed: `${Math.floor(Math.random() * 500) + 500} km/h`,
        range: `${Math.floor(Math.random() * 5000) + 3000} km`,
        price: `$${Math.floor(Math.random() * 5000) + 2000}`,
        image: imageIndex.flite
      }));
      
      setPrivateJets(jetsData);
      
    } catch (error) {
      console.error('Error fetching flights:', error);
      Alert.alert('Error', 'Failed to fetch flight data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load flights on component mount
  useEffect(() => {
    fetchFlights();
  }, []);

  // Handle search
  const handleSearch = () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (searchParams.returnDate && !validateDates(searchParams.departureDate, searchParams.returnDate)) {
      return;
    }
    
    fetchFlights();
  };

  // Swap origin and destination
  const swapLocations = () => {
    setSearchParams(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
      originLocation: prev.destinationLocation,
      destinationLocation: prev.originLocation
    }));
  };

  // Clear return date when departure date changes to be after current return date
  useEffect(() => {
    if (searchParams.departureDate && searchParams.returnDate) {
      const depDate = new Date(searchParams.departureDate);
      const retDate = new Date(searchParams.returnDate);
      
      if (retDate <= depDate) {
        setSearchParams(prev => ({
          ...prev,
          returnDate: ''
        }));
      }
    }
  }, [searchParams.departureDate]);

  // Render flight item for private jets section
  const renderJetItem = ({ item }) => {
    return(
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate("PrivateJetBoking", { flightData: item })}
      >
        <ImageBackground source={{
          uri: "https://img.freepik.com/free-photo/airplane-aircraft-travel-trip_53876-30273.jpg"
        }} style={styles.cardImage} imageStyle={styles.cardImageStyle}>
        </ImageBackground>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={styles.cardInfo}>
            <View style={styles.infoItem}>
              <Image source={imageIndex.seat} style={styles.infoIcon} />
              <Text style={styles.cardText}>{item.seats} Seats</Text>
            </View>
            <View style={styles.infoItem}>
              <Image source={imageIndex.speed} style={styles.infoIcon} />
              <Text style={styles.cardText}>{item.speed}</Text>
            </View>
            <View style={styles.infoItem}>
              <Image source={imageIndex.distance} style={styles.infoIcon} />
              <Text style={styles.cardText}>{item.range}</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.cardPrice}>{item.price}</Text>
            <Text style={styles.perFlight}>/ flight</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  };

  // Render flight offer item
  const renderFlightItem = ({ item, index }) => (
    <TouchableOpacity 
      style={[
        styles.flightCard,
        index === 0 && styles.featuredFlightCard
      ]}
      onPress={() => navigation.navigate(ScreenNameEnum.JetDetails, { flight: item })}
    >
      {index === 0 && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>BEST DEAL</Text>
        </View>
      )}
      
      <View style={styles.flightHeader}>
        <View style={styles.airlineContainer}>
          <Text style={styles.airlineText}>
            {item.validatingAirlineCodes?.[0] || 'Airline'}
          </Text>
          <Text style={styles.flightClass}>Economy</Text>
        </View>
        <Text style={styles.priceText}>${item.price?.total || 'N/A'}</Text>
      </View>
      
      <View style={styles.flightRoute}>
        <View style={styles.routeSection}>
          <Text style={styles.timeText}>
            {new Date(item.itineraries[0].segments[0].departure.at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
          <Text style={styles.airportText}>{item.itineraries[0].segments[0].departure.iataCode}</Text>
        </View>
        
        <View style={styles.routeMiddle}>
          <Text style={styles.durationText}>
            {item.itineraries[0].duration.replace('PT', '').toLowerCase()}
          </Text>
          <View style={styles.flightLineContainer}>
            <View style={styles.flightDot} />
            <View style={styles.flightLine} />
            <View style={styles.flightDot} />
          </View>
        </View>
        
        <View style={styles.routeSection}>
          <Text style={styles.timeText}>
            {new Date(
              item.itineraries[0].segments[item.itineraries[0].segments.length - 1].arrival.at
            ).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
          <Text style={styles.airportText}>
            {item.itineraries[0].segments[item.itineraries[0].segments.length - 1].arrival.iataCode}
          </Text>
        </View>
      </View>
      
      <View style={styles.flightFooter}>
        <Text style={styles.stopsText}>
          {item.itineraries[0].segments.length - 1 === 0 ? 'Non-stop' : `${item.itineraries[0].segments.length - 1} stop(s)`}
        </Text>
        <Text style={styles.selectText}>Select →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent backgroundColor='#FF3B30' barStyle="light-content" />
      {loading ? <LoadingModal /> : null}

      {/* Header */}
      <View style={[styles.header, { height: height * 0.22 }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingText}>Hello, Welcome! 👋</Text>
            <Text style={styles.headerText}>
              Find Your Perfect{"\n"}Flight
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate(ScreenNameEnum.Notifications)}
            >
              <Image
                source={imageIndex.notifications}
                style={styles.notificationIcon}
                resizeMode='contain'
              />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate(ScreenNameEnum.ProfileScreen)}
            >
              <Image
                source={imageIndex.Ellipse}
                style={styles.profileIcon}
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Search Form */}
        <View style={styles.formContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Search Card */}
            <View style={styles.searchCard}>
              <Text style={styles.searchTitle}>Search Flights</Text>
              
              {/* Location Inputs */}
              <View style={styles.locationContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>From</Text>
                  <TouchableOpacity 
                    style={styles.inputWithIcon}
                    onPress={openOriginModal}
                  >
                    <Image source={imageIndex.location2} style={styles.inputIcon} />
                    <Text style={[
                      styles.inputField, 
                      !searchParams.origin && styles.placeholderText
                    ]}>
                      {searchParams.origin || 'Departure city'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.swapButton} onPress={swapLocations}>
                  <Image source={imageIndex.swap} style={styles.swapIcon} />
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>To</Text>
                  <TouchableOpacity 
                    style={styles.inputWithIcon}
                    onPress={openDestinationModal}
                  >
                    <Image source={imageIndex.location2} style={styles.inputIcon} />
                    <Text style={[
                      styles.inputField, 
                      !searchParams.destination && styles.placeholderText
                    ]}>
                      {searchParams.destination || 'Destination city'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date Inputs */}
              <View style={styles.dateContainer}>
                <View style={styles.dateInput}>
                  <Text style={styles.inputLabel}>Departure</Text>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => showDatePicker('departure')}
                  >
                    <Image source={imageIndex.calendar} style={styles.dateIcon} />
                    <Text style={styles.dateText}>
                      {formatDisplayDate(searchParams.departureDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.dateInput}>
                  <Text style={styles.inputLabel}>Return</Text>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => showDatePicker('return')}
                  >
                    <Image source={imageIndex.calendar} style={styles.dateIcon} />
                    <Text style={styles.dateText}>
                      {formatDisplayDate(searchParams.returnDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date Pickers */}
              {showDeparturePicker && (
                <DateTimePicker
                  value={getCurrentDate('departure')}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}
              
              {showReturnPicker && (
                <DateTimePicker
                  value={getCurrentDate('return')}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  minimumDate={getMinReturnDate()}
                />
              )}

              {/* Passengers */}
              <View style={styles.passengerContainer}>
                <Text style={styles.inputLabel}>Passengers</Text>
                <View style={styles.passengerSelector}>
                  <View style={styles.passengerItem}>
                    <Image source={imageIndex.person} style={styles.passengerIcon} />
                    <Text style={styles.passengerText}>{searchParams.adults} Adult</Text>
                  </View>
                  <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Search Button */}
              <CustomButton
                title={loading ? 'Searching Flights...' : 'Search Flights'}
                buttonStyle={[
                  styles.searchButton,
                  loading && styles.searchButtonDisabled
                ]}
                onPress={handleSearch}
                disabled={loading}
              />

              {/* Loading Indicator */}
              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FF3B30" />
                  <Text style={styles.loadingText}>Searching for the best flights...</Text>
                </View>
              )}
            </View>

            {/* Available Flights */}
            {flights.length > 0 && !loading && (
              <View style={styles.flightsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Available Flights</Text>
                  <Text style={styles.resultsCount}>{flights.length} results</Text>
                </View>
                <FlatList
                  data={flights.slice(0, 3)}
                  keyExtractor={(item) => item.id}
                  renderItem={renderFlightItem}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
                {flights.length > 3 && (
                  <TouchableOpacity style={styles.viewMoreButton} 
                    onPress={() => navigation.navigate("FlightOffersScreen", {
                      flights: flights
                    })}
                  >
                    <Text style={styles.viewMoreText}>View All Flights ({flights.length})</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Private Jets Section */}
            <View style={styles.jetSection}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Private Jets</Text>
                  <Text style={styles.sectionSubtitle}>Luxury travel experience</Text>
                </View>
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              {privateJets.length > 0 ? (
                <FlatList
                  horizontal
                  data={privateJets}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderJetItem}
                  contentContainerStyle={styles.jetList}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Image source={imageIndex.boking} style={styles.noDataIcon} />
                  <Text style={styles.noDataText}>No private jets available</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Address Modals */}
      <AddressModalInput
        modalVisible={showOriginModal}
        setModalVisible={setShowOriginModal}
        value={searchParams.origin}
        onChange={(text) => handleAddressChange(text, 'origin')}
        onSelect={handleOriginSelect}
      />

      <AddressModalInput
        modalVisible={showDestinationModal}
        setModalVisible={setShowDestinationModal}
        value={searchParams.destination}
        onChange={(text) => handleAddressChange(text, 'destination')}
        onSelect={handleDestinationSelect}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;