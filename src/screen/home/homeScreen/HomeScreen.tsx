import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import imageIndex from '../../../assets/imageIndex';
import CustomButton from '../../../compoent/CustomButton';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../../routes/screenName.enum';
import styles from './style';
import LoadingModal from '../../../utils/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { GetProfile } from '../../../redux/Api/AuthApi';
import AirportSearchModal from '../../../compoent/AirportSearchModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import PassengerModal from '../../../compoent/PasengerSelectModal';
import { AviapagesFlightService } from '../AviapagesFlightService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isLogin = useSelector((state: any) => state.auth);
  const userGet = useSelector((state: any) => state.feature);
  const userId = isLogin?.userData?.id;
  const userData = userGet?.userGetData;

  useEffect(() => {
    handleGetProfile();
  }, []);

  const handleGetProfile = useCallback(async () => {
    if (userId) {
      await GetProfile(userId, dispatch);
    } else {
      console.log("User ID not available");
    }
  }, [userId, dispatch]);

  const [isPassengerModalVisible, setIsPassengerModalVisible] = useState(false);
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way'); // New state for trip type
  
  const handlePassengerChange = (newCount: any) => {
    setSearchParams(prev => ({
      ...prev,
      ...newCount,
    }));
  };

  const getPassengerSummary = () => {
    const { adults, children, infants } = searchParams;
    let summary = `${adults} Adult${adults !== 1 ? 's' : ''}`;

    if (children > 0) {
      summary += `, ${children} Child${children !== 1 ? 'ren' : ''}`;
    }

    if (infants > 0) {
      summary += `, ${infants} Infant${infants !== 1 ? 's' : ''}`;
    }

    return summary;
  };

  const getTotalPassengers = () => {
    return searchParams.adults + searchParams.children + searchParams.infants;
  };

  const departureDate = new Date().toISOString().split('T')[0];

  // State for search parameters
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: departureDate,
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [privateJets, setPrivateJets] = useState<any[]>([]);

  // State for date picker
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState('');

  // Airport selection handlers
  const handleSelectAirport = (airport: any) => {
    setSearchParams(prev => ({ ...prev, origin: airport.code }));
  };

  const handleSelectAirport2 = (airport: any) => {
    setSearchParams(prev => ({ ...prev, destination: airport.code }));
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Select date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format date for API (YYYY-MM-DD)
  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Validate dates
  const validateDates = (departureDate: string, returnDate: string) => {
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
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDeparturePicker(false);
    setShowReturnPicker(false);

    if (selectedDate) {
      const formattedDate = formatDateForAPI(selectedDate);

      if (selectedDateType === 'departure') {
        if (searchParams?.returnDate && !validateDates(formattedDate, searchParams?.returnDate)) {
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
  const showDatePicker = (type: string) => {
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
  const getCurrentDate = (type: string) => {
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

  // Fetch flight data using Aviapages API
  const fetchFlights = async () => {
    try {
      if (tripType === 'round-trip' && searchParams.returnDate && !validateDates(searchParams.departureDate, searchParams.returnDate)) {
        return;
      }

      setLoading(true);
      
      console.log('🛫 Starting flight search with params:', {
        origin: searchParams.origin,
        destination: searchParams.destination,
        departureDate: searchParams.departureDate,
        returnDate: tripType === 'round-trip' ? searchParams.returnDate : '',
        passengers: searchParams.adults + searchParams.children + searchParams.infants,
        tripType: tripType
      });

      // Use Aviapages service with proper parameters
      const data = await AviapagesFlightService.searchFlights(
        searchParams.origin,
        searchParams.destination,
        searchParams.departureDate,
        tripType === 'round-trip' ? searchParams.returnDate : '',
        searchParams.adults + searchParams.children + searchParams.infants
      );

 
      if (data && data.data && data.data.length > 0) {
        setFlights(data.data);
        setPrivateJets(data.data.slice(0, 3)); // First 3 as private jets
        Alert.alert('Success', `Found ${data.data.length} ${tripType} flights!`);
      } else {
        setFlights([]);
        setPrivateJets([]);
        Alert.alert('Info', `No ${tripType} flights found for your search criteria. Please try different airports or dates.`);
      }

    } catch (error) {
      console.error('❌ Error fetching flights from Aviapages:', error);
      Alert.alert('Error', 'Failed to fetch flight data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      Alert.alert('Error', 'Please fill in all required fields (From, To, and Departure Date)');
      return;
    }

    if (tripType === 'round-trip' && (!searchParams.returnDate || !validateDates(searchParams.departureDate, searchParams.returnDate))) {
      return;
    }

    fetchFlights();
  };

  // Swap origin and destination
  const swapLocations = () => {
    setSearchParams(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  // Handle trip type change
  const handleTripTypeChange = (type: 'one-way' | 'round-trip') => {
    setTripType(type);
    if (type === 'one-way') {
      setSearchParams(prev => ({ ...prev, returnDate: '' }));
    }
  };

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

  // Render private jet item
  const renderJetItem = ({ item }: any) => {
    const aircraftInfo = item.aircraftInfo || {};
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("PrivateJetBoking", { 
          flightData: item,
          tripType: tripType,
          searchParams: searchParams
        })}
      >
        <ImageBackground 
          source={{ uri: aircraftInfo.image }} 
          style={styles.cardImage} 
          imageStyle={styles.cardImageStyle}
        >
        </ImageBackground>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{aircraftInfo.name || 'Private Jet'}</Text>
          {aircraftInfo.manufacturer && (
            <Text style={styles.cardSubtitle}>{aircraftInfo.manufacturer} {aircraftInfo.model}</Text>
          )}
          
          <View style={styles.cardInfo}>
            <View style={styles.infoItem}>
              <Image source={imageIndex.seat} style={styles.infoIcon} />
              <Text style={styles.cardText}>{aircraftInfo.seats || 8} Seats</Text>
            </View>
            <View style={styles.infoItem}>
              <Image source={imageIndex.speed} style={styles.infoIcon} />
              <Text style={styles.cardText}>{aircraftInfo.speed || '800 km/h'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Image source={imageIndex.distance} style={styles.infoIcon} />
              <Text style={styles.cardText}>{aircraftInfo.range || '4000 km'}</Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.cardPrice}>${item.price?.total || '5000'}</Text>
            <Text style={styles.perFlight}>/ {tripType === 'one-way' ? 'one-way' : 'round-trip'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render flight offer item
  const renderFlightItem = ({ item, index }: any) => {
    const aircraftInfo = item.aircraftInfo || {};
    
    return (
      <TouchableOpacity
        style={[
          styles.flightCard,
          index === 0 && styles.featuredFlightCard
        ]}
        onPress={() => navigation.navigate(ScreenNameEnum.JetDetails, { 
          flight: item,
          tripType: tripType,
          searchParams: searchParams
        })}
      >
        {index === 0 && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>BEST DEAL</Text>
          </View>
        )}

        <View style={styles.flightHeader}>
          <View style={styles.airlineContainer}>
            <Text style={styles.airlineText}>
              {aircraftInfo.manufacturer || 'Private Jet'}
            </Text>
            <Text style={styles.flightClass}>{aircraftInfo.model || 'Business'}</Text>
          </View>
          <Text style={styles.priceText}>${item.price?.total || '5000'}</Text>
        </View>

        <View style={styles.flightRoute}>
          <View style={styles.routeSection}>
            <Text style={styles.timeText}>
              {item.itineraries?.[0]?.segments?.[0]?.departure?.at 
                ? new Date(item.itineraries[0].segments[0].departure.at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                : '08:00'
              }
            </Text>
            <Text style={styles.airportText}>{searchParams.origin}</Text>
          </View>

          <View style={styles.routeMiddle}>
            <Text style={styles.durationText}>
              {item.itineraries?.[0]?.duration?.replace('PT', '') || '2H 30M'}
            </Text>
            <View style={styles.flightLineContainer}>
              <View style={styles.flightDot} />
              <View style={styles.flightLine} />
              <View style={styles.flightDot} />
            </View>
          </View>

          <View style={styles.routeSection}>
            <Text style={styles.timeText}>
              {item.itineraries?.[0]?.segments?.[0]?.arrival?.at 
                ? new Date(item.itineraries[0].segments[0].arrival.at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                : '10:30'
              }
            </Text>
            <Text style={styles.airportText}>{searchParams.destination}</Text>
          </View>
        </View>

        <View style={styles.flightFooter}>
          <Text style={styles.stopsText}>
            {aircraftInfo.seats || 8} Seats • {aircraftInfo.model || 'Private Jet'}
          </Text>
          <Text style={styles.selectText}>View Details →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBarComponent backgroundColor='#FF3B30' barStyle="light-content" />
      
      <LoadingModal visible={loading}/>
      
      <View style={[styles.header]}>
        <SafeAreaView edges={['top']} />
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingText}>{userData?.user_name || 'User'}, Welcome! 👋</Text>
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
              {userData?.image ? (
                <Image
                  source={{ uri: userData?.image }}
                  style={styles.profileIcon}
                  resizeMode='contain'
                />
              ) : (
                <Image
                  source={imageIndex.Ellipse}
                  style={styles.profileIcon}
                  resizeMode='contain'
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.formContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            
            <View style={styles.searchCard}>
              <Text style={styles.searchTitle}>Search Flights</Text>

              {/* Trip Type Selector */}
              <View style={styles.tripTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.tripTypeButton,
                    tripType === 'one-way' && styles.tripTypeButtonActive
                  ]}
                  onPress={() => handleTripTypeChange('one-way')}
                >
                  <Text style={[
                    styles.tripTypeText,
                    tripType === 'one-way' && styles.tripTypeTextActive
                  ]}>
                    One Way
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tripTypeButton,
                    tripType === 'round-trip' && styles.tripTypeButtonActive
                  ]}
                  onPress={() => handleTripTypeChange('round-trip')}
                >
                  <Text style={[
                    styles.tripTypeText,
                    tripType === 'round-trip' && styles.tripTypeTextActive
                  ]}>
                    Round Trip
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Location Inputs */}
              <View style={styles.locationContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>From</Text>
                  <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.inputWithIcon}>
                    <Image source={imageIndex.location2} style={styles.inputIcon} />
                    <Text style={[styles.inputField, { maxWidth: '100%' }]} numberOfLines={1}>
                      {searchParams.origin
                        ? `${searchParams.origin}`
                        : 'Departure city'
                      }
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.swapButton} onPress={swapLocations}>
                  <Image source={imageIndex.swap} style={styles.swapIcon} />
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>To</Text>
                  <View style={styles.inputWithIcon}>
                    <Image source={imageIndex.location2} style={styles.inputIcon} />
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                      onPress={() => setIsModalVisible2(true)}
                    >
                      <Text>
                        {searchParams.destination
                          ? `${searchParams.destination}`
                          : 'To'
                        }
                      </Text>
                    </TouchableOpacity>
                  </View>
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

                {tripType === 'round-trip' && (
                  <View style={[styles.dateInput,]}>
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
                )}
              </View>

              {/* Date Pickers */}
              {showDeparturePicker && (
                <View style={{
                  borderWidth: 0.8,
                  borderColor: "red",
                  borderRadius: 20,
                  elevation: 6,
                  shadowOpacity: 0.45,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 10 },
                }}> 
                  <DateTimePicker
                    value={getCurrentDate('departure')}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    minimumDate={new Date()}
                  />
                </View>
              )}

              {showReturnPicker && (
                <View style={{
                  borderWidth: 0.8,
                  borderColor: "red",
                  borderRadius: 20,
                  elevation: 6,
                  shadowOpacity: 0.45,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 10 },
                }}> 
                  <DateTimePicker
                    value={getCurrentDate('return')}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    minimumDate={getMinReturnDate()}
                  /> 
                </View>
              )}

              <View style={styles.passengerContainer}>
                <Text style={styles.inputLabel}>Passengers</Text>
                <View style={styles.passengerSelector}>
                  <View style={styles.passengerItem}>
                    <View style={styles.passengerTextContainer}>
                      <Text style={styles.passengerText}>{getPassengerSummary()}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setIsPassengerModalVisible(true)}
                  >
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <PassengerModal
                visible={isPassengerModalVisible}
                onClose={() => setIsPassengerModalVisible(false)}
                passengerCount={searchParams}
                onPassengerChange={handlePassengerChange}
              />

              <CustomButton
                title={loading ? 'Searching...' : `Search ${tripType === 'one-way' ? 'One Way' : 'Round Trip'} Flights`}
                buttonStyle={[
                  styles.searchButton,
                  loading && styles.searchButtonDisabled
                ]}
                onPress={handleSearch}
                disabled={loading}
              />
            </View>

            {/* Available Flights */}
            {flights.length > 0 && !loading && (
              <View style={styles.flightsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    Available {tripType === 'one-way' ? 'One Way' : 'Round Trip'} Flights
                  </Text>
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
                      flights: flights,
                      tripType: tripType,
                      searchParams: searchParams
                    })}
                  >
                    <Text style={styles.viewMoreText}>View All Flights ({flights.length})</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Private Jets Section */}
            {/* <View style={styles.jetSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Private Jets</Text>
                <Text style={styles.resultsCount}>{privateJets.length} available</Text>
              </View>
              <FlatList
                data={privateJets}
                renderItem={renderJetItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.jetList}
                ListEmptyComponent={
                  !loading && (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateText}>No private jets available</Text>
                      <Text style={styles.emptyStateSubtext}>Search for flights to see available jets</Text>
                    </View>
                  )
                }
              />
            </View> */}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <AirportSearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectAirport={handleSelectAirport}
      />

      <AirportSearchModal
        visible={isModalVisible2}
        onClose={() => setIsModalVisible2(false)}
        onSelectAirport={handleSelectAirport2}
      />
    </View>
  );
};

export default HomeScreen;