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
import { FlightService } from '../../../flightService';
import LoadingModal from '../../../utils/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { GetProfile } from '../../../redux/Api/AuthApi';
import AirportSearchModal from '../../../compoent/AirportSearchModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import PassengerModal from '../../../compoent/PasengerSelectModal';

const HomeScreen = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isLogin = useSelector((state: any) => state.auth);
  const userGet = useSelector((state: any) => state.feature);
  const userId = isLogin?.userData?.id;
  const userData = userGet?.userGetData
  useEffect(() => {
    handleGetProfile()
  }, [])
  const handleGetProfile = useCallback(async () => {
    if (userId) {
      await GetProfile(userId, dispatch);
    } else {
      console.log("User ID not available");
    }
  }, [userId, dispatch]);

  const [isPassengerModalVisible, setIsPassengerModalVisible] = useState(false);
  const handlePassengerChange = (newCount: PassengerCount) => {
    setSearchParams(prev => ({
      ...prev,
      ...newCount,
    }));
  };

  const getPassengerSummary = (): string => {
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

  const getTotalPassengers = (): number => {
    return searchParams.adults + searchParams.children + searchParams.infants;
  };
  const departureDat1e = new Date().toISOString().split('T')[0];


  // State for search parameters
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: departureDat1e,
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [selectedAirport, setSelectedAirport] = useState(null);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  const handleSelectAirport = (airport) => {
    setSearchParams(prev => ({ ...prev, origin: airport.code }))

  };

  // const [selectedAirport, setSelectedAirport] = useState(null);

  const handleSelectAirport2 = (airport) => {
    // setSelectedAirport(airport);
    setSearchParams(prev => ({ ...prev, destination: airport.code }))

  };
  // State for flight data
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [privateJets, setPrivateJets] = useState([]);

  // State for date picker
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState(''); // 'departure' or 'return'

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
  const onDateChange = (event: any, selectedDate: any) => {
    // Hide the picker
    setShowDeparturePicker(false);
    setShowReturnPicker(false);

    if (selectedDate) {
      const formattedDate = formatDateForAPI(selectedDate);

      if (selectedDateType === 'departure') {
        // If setting departure date and return date exists, validate
        if (searchParams?.returnDate && !validateDates(formattedDate, searchParams?.returnDate)) {
          return; // Don't update if validation fails
        }

        setSearchParams(prev => ({
          ...prev,
          departureDate: formattedDate
        }));
      } else if (selectedDateType === 'return') {
        // If setting return date and departure date exists, validate
        if (searchParams.departureDate && !validateDates(searchParams.departureDate, formattedDate)) {
          return; // Don't update if validation fails
        }

        setSearchParams(prev => ({
          ...prev,
          returnDate: formattedDate
        }));
      }
    }

    // Reset selected date type
    setSelectedDateType('');
  };

  // Show date picker with proper minimum date
  const showDatePicker = (type) => {
    setSelectedDateType(type);

    if (type === 'departure') {
      setShowDeparturePicker(true);
    } else if (type === 'return') {
      // For return date, minimum date should be departure date + 1 day
      setShowReturnPicker(true);
    }
  };

  // Get minimum date for return date picker
  const getMinReturnDate = () => {
    if (searchParams.departureDate) {
      const depDate = new Date(searchParams.departureDate);
      const minDate = new Date(depDate);
      minDate.setDate(depDate.getDate() + 1); // Next day after departure
      return minDate;
    }
    return new Date(); // If no departure date, use today
  };

  // Get current date for date picker
  const getCurrentDate = (type) => {
    if (type === 'departure' && searchParams.departureDate) {
      return new Date(searchParams.departureDate);
    }
    if (type === 'return' && searchParams.returnDate) {
      return new Date(searchParams.returnDate);
    }

    // For return date, if no date selected but departure exists, use next day
    if (type === 'return' && searchParams.departureDate) {
      const depDate = new Date(searchParams.departureDate);
      const nextDay = new Date(depDate);
      nextDay.setDate(depDate.getDate() + 1);
      return nextDay;
    }

    return new Date();
  };

  // Fetch flight data
  const fetchFlights = async () => {
    try {
      // Validate dates before searching
      if (searchParams.returnDate && !validateDates(searchParams.departureDate, searchParams.returnDate)) {
        return;
      }

      setLoading(true);
      const data = await FlightService.searchFlights(
        searchParams.origin,
        searchParams.destination,
        searchParams.departureDate,
        searchParams.returnDate,
        searchParams.adults,
        searchParams.children,
        searchParams.infants
      );

      setFlights(data.data || []);

      // For demo, create private jets data from flight data
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

  const handleSearch = () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate dates before searching
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
      destination: prev.origin
    }));
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

  // Render flight item for private jets section
  const renderJetItem = ({ item }) => {
    // console.log("isssssstem",item)
    return (
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
  }

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
            {item?.itineraries[0].duration?.replace('PT', '').toLowerCase()}
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
    <View style={styles.container}>
      <StatusBarComponent backgroundColor='#FF3B30' barStyle="light-content" />
      
 <LoadingModal visible={loading}/>
       <View style={[styles.header,]}>
        <SafeAreaView edges={['top']} />
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingText}>{userData?.user_name}, Welcome! 👋</Text>
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
              {userData?.image ? (<Image
                source={{
                  uri: userData?.image
                }}
                style={styles.profileIcon}
                resizeMode='contain'
              />) : (
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
                  <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.inputWithIcon}>
                    <Image source={imageIndex.location2} style={styles.inputIcon} />
                    <Text style={[styles.inputField, { maxWidth: '100%' }]} numberOfLines={1} >
                      {searchParams.origin
                        ? `${searchParams.origin}`
                        : 'Departure city'
                      }
                    </Text>
                    {/* </TouchableOpacity> */}
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
                        flex:1 ,
                        justifyContent:"center"
                       ,
                       alignItems:"center"
                      }}
                      onPress={() => setIsModalVisible2(true)}
                    >
                    <Text   >
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
            <View style={{

        borderWidth: 0.8,
  borderColor: "red",
  borderRadius: 20,
  // Android shadow
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
  // Android shadow
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
                    {/* <Image source={require('../../../assets/images/profile.png')} style={styles.passengerIcon} /> */}
                    <View style={styles.passengerTextContainer}>
                      <Text style={styles.passengerText}>{getPassengerSummary()}</Text>
                      {/* <Text style={styles.passengerSubText}>
                        {getTotalPassengers()} Total
                      </Text> */}
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

              {/* Passenger Selection Modal */}
              <PassengerModal
                visible={isPassengerModalVisible}
                onClose={() => setIsPassengerModalVisible(false)}
                passengerCount={searchParams}
                onPassengerChange={handlePassengerChange}
              />

              {/* Search Button */}
              <CustomButton
                title={'Search Flights'}
                buttonStyle={[
                  styles.searchButton,
                  loading && styles.searchButtonDisabled
                ]}
                onPress={handleSearch}
                disabled={loading}
              />

              {/* Loading Indicator */}
               
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
              {/* <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Private Jets</Text>
                  <Text style={styles.sectionSubtitle}>Luxury travel experience</Text>
                </View>
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View> */}

              {/* {privateJets.length > 0 ? (
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
              )} */}
            </View>
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




