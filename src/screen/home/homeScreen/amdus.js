import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
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
import CustomCalendarModal from '../../../compoent/CustomCalendarModal';

type TripType = 'one-way' | 'round-trip';
type TimeType = 'departure' | 'return';

type SearchParams = {
  origin: string;
  destination: string;
  originDisplay: string;
  destinationDisplay: string;
  departureDate: string;
  departureTime: string;
  returnDate: string;
  returnTime: string;
  adults: number;
  children: number;
  infants: number;
};

/* ---------------- Time Picker Modal ---------------- */

const TimePickerModal = ({
  visible,
  onClose,
  onTimeSelect,
  initialTime = '08:00',
}: {
  visible: boolean;
  onClose: () => void;
  onTimeSelect: (time: string) => void;
  initialTime?: string;
}) => {
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    setSelectedTime(initialTime);
  }, [initialTime, visible]);

  useEffect(() => {
    const slots: string[] = [];
    for (let hour = 5; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    setTimeSlots(slots);
  }, []);

  const handleConfirm = () => {
    onTimeSelect(selectedTime);
    onClose();
  };

  const renderTimeSlot = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.timeSlot, selectedTime === item && styles.selectedTimeSlot]}
      onPress={() => setSelectedTime(item)}
    >
      <Text
        style={[
          styles.timeSlotText,
          selectedTime === item && styles.selectedTimeSlotText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.timePickerModal}>
          <View style={styles.timePickerHeader}>
            <Text style={styles.timePickerTitle}>Select Departure Time</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={timeSlots}
            renderItem={renderTimeSlot}
            keyExtractor={item => item}
            numColumns={4}
            contentContainerStyle={styles.timeSlotsContainer}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.timePickerButtons}>
            <TouchableOpacity
              style={[styles.timePickerButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.timePickerButton, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

/* ---------------- Main Screen ---------------- */

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const isLogin = useSelector((state: any) => state.auth);
  const userGet = useSelector((state: any) => state.feature);

  const userId = isLogin?.userData?.id;
  const userData = userGet?.userGetData;

  const today = new Date().toISOString().split('T')[0];

  const [isPassengerModalVisible, setIsPassengerModalVisible] = useState(false);
  const [tripType, setTripType] = useState<TripType>('one-way');
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [selectedTimeType, setSelectedTimeType] = useState<TimeType>('departure');

  const [datePickerConfig, setDatePickerConfig] = useState<{
    visible: boolean;
    type: 'departure' | 'return' | '';
  }>({
    visible: false,
    type: '',
  });

  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: '',
    destination: '',
    originDisplay: '',
    destinationDisplay: '',
    departureDate: today,
    departureTime: '08:00',
    returnDate: '',
    returnTime: '18:00',
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [privateJets, setPrivateJets] = useState<any[]>([]);

  useEffect(() => {
    handleGetProfile();
  }, []);

  const handleGetProfile = useCallback(async () => {
    if (userId) {
      await GetProfile(userId, dispatch);
    }
  }, [userId, dispatch]);

  const handlePassengerChange = (newCount: Partial<SearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...newCount,
    }));
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Select date';

    const str = String(dateString).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const [y, m, d] = str.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Select date';

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateForAPI = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const parseLocalDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    const str = String(dateString).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
    }

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const validateDates = (
    departureDate: string,
    returnDate: string,
    departureTime: string,
    returnTime: string
  ) => {
    if (tripType === 'round-trip' && departureDate && returnDate) {
      const depDate = parseLocalDate(departureDate);
      const retDate = parseLocalDate(returnDate);

      if (!depDate || !retDate) return true;

      if (depDate.getTime() === retDate.getTime()) {
        const [depHour, depMinute] = departureTime.split(':').map(Number);
        const [retHour, retMinute] = returnTime.split(':').map(Number);

        if (retHour < depHour || (retHour === depHour && retMinute <= depMinute)) {
          Alert.alert(
            'Invalid Time',
            'Return time must be after departure time on the same day'
          );
          return false;
        }
      } else if (retDate.getTime() <= depDate.getTime()) {
        Alert.alert('Invalid Date', 'Return date must be after departure date');
        return false;
      }
    }

    return true;
  };

  const showDatePicker = (type: 'departure' | 'return') => {
    setDatePickerConfig({ visible: true, type });
  };

  const onDateConfirm = (selectedDate: Date) => {
    const formattedDate = formatDateForAPI(selectedDate);

    if (datePickerConfig.type === 'departure') {
      if (
        tripType === 'round-trip' &&
        searchParams.returnDate &&
        !validateDates(
          formattedDate,
          searchParams.returnDate,
          searchParams.departureTime,
          searchParams.returnTime
        )
      ) {
        setDatePickerConfig({ visible: false, type: '' });
        return;
      }

      setSearchParams(prev => ({ ...prev, departureDate: formattedDate }));
    } else if (datePickerConfig.type === 'return') {
      if (
        searchParams.departureDate &&
        !validateDates(
          searchParams.departureDate,
          formattedDate,
          searchParams.departureTime,
          searchParams.returnTime
        )
      ) {
        setDatePickerConfig({ visible: false, type: '' });
        return;
      }

      setSearchParams(prev => ({ ...prev, returnDate: formattedDate }));
    }

    setDatePickerConfig({ visible: false, type: '' });
  };

  const onDateCancel = () => {
    setDatePickerConfig({ visible: false, type: '' });
  };

  const handleTimeSelect = (time: string) => {
    if (selectedTimeType === 'departure') {
      setSearchParams(prev => ({ ...prev, departureTime: time }));
    } else {
      setSearchParams(prev => ({ ...prev, returnTime: time }));
    }
  };

  const openTimePicker = (type: TimeType) => {
    setSelectedTimeType(type);
    setIsTimePickerVisible(true);
  };

  const getMinReturnDate = () => {
    const depDate = searchParams.departureDate
      ? parseLocalDate(searchParams.departureDate)
      : null;

    if (depDate) {
      const minDate = new Date(depDate);
      minDate.setDate(depDate.getDate() + 1);
      return minDate;
    }

    return new Date();
  };

  const getCurrentDate = (type: string) => {
    if (type === 'departure' && searchParams.departureDate) {
      return parseLocalDate(searchParams.departureDate) ?? new Date();
    }

    if (type === 'return' && searchParams.returnDate) {
      return parseLocalDate(searchParams.returnDate) ?? new Date();
    }

    if (type === 'return' && searchParams.departureDate) {
      const depDate = parseLocalDate(searchParams.departureDate);
      if (depDate) {
        const nextDay = new Date(depDate);
        nextDay.setDate(depDate.getDate() + 1);
        return nextDay;
      }
    }

    return new Date();
  };

 

// HomeScreen.tsx mein SIRF yeh 2 functions replace karo
// handleSelectAirport aur handleSelectAirport2

// ── Airport select — ICAO prefer karo (flight calculator ko chahiye) ──
const handleSelectAirport = (airport: any) => {
  // ICAO first (VABB, VAID), IATA fallback (BOM, IDR)
  const code = airport?.icao || airport?.searchCode || airport?.iata || '';
  const display =
    airport?.displayName ||
    airport?.name ||
    code;

  console.log('[Airport] Origin selected:', code, '(icao:', airport?.icao, ', iata:', airport?.iata, ')');

  setSearchParams(prev => ({
    ...prev,
    origin: code,
    originDisplay: display,
  }));
  setIsModalVisible(false);
};

const handleSelectAirport2 = (airport: any) => {
  // ICAO first (VABB, VAID), IATA fallback (BOM, IDR)
  const code = airport?.icao || airport?.searchCode || airport?.iata || '';
  const display =
    airport?.displayName ||
    airport?.name ||
    code;

  console.log('[Airport] Destination selected:', code, '(icao:', airport?.icao, ', iata:', airport?.iata, ')');

  setSearchParams(prev => ({
    ...prev,
    destination: code,
    destinationDisplay: display,
  }));
  setIsModalVisible2(false);
};
 // HomeScreen.tsx mein SIRF yeh fetchFlights function replace karo
// Baaki sab same rahega

const fetchFlights = async () => {
  try {
    if (
      tripType === 'round-trip' &&
      searchParams.returnDate &&
      !validateDates(
        searchParams.departureDate,
        searchParams.returnDate,
        searchParams.departureTime,
        searchParams.returnTime,
      )
    ) {
      return;
    }

    setLoading(true);
    setFlights([]);
    setPrivateJets([]);

    const totalPassengers =
      searchParams.adults + searchParams.children + searchParams.infants;

    // ── DEBUG: log what we are sending ──────────────────────
    console.log('[HomeScreen] Search params:', {
      origin: searchParams.origin,
      destination: searchParams.destination,
      departureDate: searchParams.departureDate,
      departureTime: searchParams.departureTime,
      returnDate: tripType === 'round-trip' ? searchParams.returnDate : null,
      returnTime: searchParams.returnTime,
      totalPassengers,
    });
    // ────────────────────────────────────────────────────────

    const data = await AviapagesFlightService.searchFlights(
      searchParams.origin,
      searchParams.destination,
      searchParams.departureDate,
      searchParams.departureTime,
      tripType === 'round-trip' ? searchParams.returnDate : null,
      searchParams.returnTime,
      totalPassengers,
      false,
    );

    console.log('[HomeScreen] Flights received:', data?.data?.length ?? 0);

    if (data?.data?.length > 0) {
      setFlights(data.data);
      setPrivateJets(data.data);
    } else {
      setFlights([]);
      setPrivateJets([]);
      Alert.alert(
        'No Flights Found',
        'Is route ke liye koi charter available nahi hai. Koi aur route try karein.',
      );
    }
  } catch (error: any) {
    // ── Print exact error ──────────────────────────────────
    console.error('[HomeScreen] fetchFlights ERROR:', error?.message ?? error);
    // ────────────────────────────────────────────────────────

    Alert.alert(
      'Error',
      // Show actual error message for easier debugging
      __DEV__
        ? `API Error: ${error?.message ?? 'Unknown error'}`
        : 'Flight data fetch nahi ho saka. Connection check karein aur dobara try karein.',
    );
  } finally {
    setLoading(false);
  }
};

  const handleSearch = () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      Alert.alert(
        'Error',
        'Please fill in all required fields (From, To, and Departure Date)'
      );
      return;
    }

    if (
      tripType === 'round-trip' &&
      (!searchParams.returnDate ||
        !validateDates(
          searchParams.departureDate,
          searchParams.returnDate,
          searchParams.departureTime,
          searchParams.returnTime
        ))
    ) {
      return;
    }

    fetchFlights();
  };

  const swapLocations = () => {
    setSearchParams(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
      originDisplay: prev.destinationDisplay,
      destinationDisplay: prev.originDisplay,
    }));
  };

  const handleTripTypeChange = (type: TripType) => {
    setTripType(type);

    if (type === 'one-way') {
      setSearchParams(prev => ({
        ...prev,
        returnDate: '',
      }));
    }
  };

  useEffect(() => {
    if (searchParams.departureDate && searchParams.returnDate) {
      const depDate = parseLocalDate(searchParams.departureDate);
      const retDate = parseLocalDate(searchParams.returnDate);

      if (depDate && retDate && retDate.getTime() <= depDate.getTime()) {
        setSearchParams(prev => ({
          ...prev,
          returnDate: '',
        }));
      }
    }
  }, [searchParams.departureDate]);

  const renderFlightItem = ({ item, index }: any) => {
    const aircraftInfo = item?.aircraftInfo || {};
    const serviceFee =
      item?.pricing?.serviceFee || Math.round((item?.price?.total || 0) * 0.1);
    const basePrice = item?.pricing?.baseFare || (item?.price?.total || 0) - serviceFee;
    const totalWithFee = basePrice + serviceFee;
    const isEstimated = !!item?._isEstimated;

    return (
      <TouchableOpacity
        style={[styles.flightCard, index === 0 && styles.featuredFlightCard]}
        onPress={() =>
          navigation.navigate('CharterDetailsScreen', {
            charter: item,
            tripType,
            searchParams,
            bagImage: item?.aircraftInfo?.images,
          })
        }
      >
        {index === 0 && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>BEST DEAL</Text>
          </View>
        )}

        <View style={styles.flightHeader}>
          <View style={styles.airlineContainer}>
            <Text style={styles.airlineText}>
              {aircraftInfo?.airline || 'Private Jet Charter'}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${Number(totalWithFee).toLocaleString()}</Text>
            {!!styles.priceSubText && (
              <Text style={styles.priceSubText}>
                {isEstimated ? 'Estimated price' : 'Real price'}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.flightRoute}>
          <View style={styles.routeSection}>
            <Text style={styles.timeText}>
              {item?.itineraries?.[0]?.segments?.[0]?.departure?.at
                ? new Date(item.itineraries[0].segments[0].departure.at).toLocaleTimeString(
                    [],
                    { hour: '2-digit', minute: '2-digit' }
                  )
                : searchParams.departureTime}
            </Text>
            <Text style={styles.airportText}>{searchParams.origin}</Text>
          </View>

          <View style={styles.routeMiddle}>
            <Text style={styles.durationText}>
              {String(item?.itineraries?.[0]?.duration || '2H 30M').replace('PT', '')}
            </Text>
            <View style={styles.flightLineContainer}>
              <View style={styles.flightDot} />
              <View style={styles.flightLine} />
              <View style={styles.flightDot} />
            </View>
          </View>

          <View style={styles.routeSection}>
            <Text style={styles.timeText}>
              {item?.itineraries?.[0]?.segments?.[0]?.arrival?.at
                ? new Date(item.itineraries[0].segments[0].arrival.at).toLocaleTimeString(
                    [],
                    { hour: '2-digit', minute: '2-digit' }
                  )
                : '10:30'}
            </Text>
            <Text style={styles.airportText}>{searchParams.destination}</Text>
          </View>
        </View>

        {item?.userPreferredDepartureTime && (
          <Text style={styles.preferredTimeBadge}>Your preferred time</Text>
        )}

        <View style={styles.flightFooter}>
          <View style={styles.aircraftInfo}>
            <Text style={styles.aircraftName}>
              {aircraftInfo?.manufacturer} {aircraftInfo?.model}
            </Text>
            <Text style={styles.seatsInfo}>
              • {aircraftInfo?.seats || 8} Seats • Includes{' '}
              {serviceFee > 0 ? '10% Service Fee' : 'All Fees'}
            </Text>
          </View>
        </View>

        <View style={styles.selectButton}>
          <Text style={styles.selectText}>View Details & Book →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBarComponent backgroundColor="#FF3B30" barStyle="light-content" />

      <LoadingModal visible={loading} />

      <TimePickerModal
        visible={isTimePickerVisible}
        onClose={() => setIsTimePickerVisible(false)}
        onTimeSelect={handleTimeSelect}
        initialTime={
          selectedTimeType === 'departure'
            ? searchParams.departureTime
            : searchParams.returnTime
        }
      />

      <CustomCalendarModal
        isVisible={datePickerConfig.visible}
        mode="date"
        date={getCurrentDate(datePickerConfig.type || 'departure')}
        minimumDate={datePickerConfig.type === 'return' ? getMinReturnDate() : new Date()}
        onConfirm={onDateConfirm}
        onCancel={onDateCancel}
        themeVariant="light"
      />

      <View style={styles.header}>
        <SafeAreaView edges={['top']} />
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingText}>
              {userData?.user_name || 'User'}, Welcome! 👋
            </Text>
            <Text style={styles.headerText}>
              Find Your Perfect{'\n'}Flight
            </Text>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate(ScreenNameEnum.ProfileScreen)}
            >
              {userData?.image ? (
                <Image
                  source={{ uri: userData?.image }}
                  style={styles.profileIcon}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={imageIndex.Ellipse}
                  style={styles.profileIcon}
                  resizeMode="contain"
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

              <View style={styles.tripTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.tripTypeButton,
                    tripType === 'one-way' && styles.tripTypeButtonActive,
                  ]}
                  onPress={() => handleTripTypeChange('one-way')}
                >
                  <Text
                    style={[
                      styles.tripTypeText,
                      tripType === 'one-way' && styles.tripTypeTextActive,
                    ]}
                  >
                    One Way
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tripTypeButton,
                    tripType === 'round-trip' && styles.tripTypeButtonActive,
                  ]}
                  onPress={() => handleTripTypeChange('round-trip')}
                >
                  <Text
                    style={[
                      styles.tripTypeText,
                      tripType === 'round-trip' && styles.tripTypeTextActive,
                    ]}
                  >
                    Round Trip
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.locationContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>From</Text>
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(true)}
                    style={styles.inputWithIcon}
                  >
                    <Image
                      source={imageIndex.location2}
                      style={[styles.inputIcon, { tintColor: 'black' }]}
                    />
                    <Text
                      style={[styles.inputField, { maxWidth: '100%' }]}
                      numberOfLines={1}
                    >
                      {searchParams.originDisplay || 'Departure city'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.swapButton} onPress={swapLocations}>
                  <Image
                    source={imageIndex.swap}
                    style={[styles.swapIcon, { tintColor: 'black' }]}
                  />
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>To</Text>
                  <TouchableOpacity
                    style={styles.inputWithIcon}
                    onPress={() => setIsModalVisible2(true)}
                  >
                    <Image
                      source={imageIndex.location2}
                      style={[styles.inputIcon, { tintColor: 'black' }]}
                    />
                    <Text
                      style={[styles.inputField, { maxWidth: '100%' }]}
                      numberOfLines={1}
                    >
                      {searchParams.destinationDisplay || 'Destination city'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeRow}>
                  <View style={styles.dateTimeInput}>
                    <Text style={styles.inputLabel}>Departure Date</Text>
                    <TouchableOpacity
                      style={styles.dateTimeButton}
                      onPress={() => showDatePicker('departure')}
                    >
                      <Image
                        source={imageIndex.calendar}
                        style={[styles.dateIcon, { tintColor: 'black' }]}
                      />
                      <Text style={[styles.dateTimeText, { color: 'black' }]}>
                        {formatDisplayDate(searchParams.departureDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dateTimeInput}>
                    <Text style={styles.inputLabel}>Departure Time</Text>
                    <TouchableOpacity
                      style={styles.dateTimeButton}
                      onPress={() => openTimePicker('departure')}
                    >
                      <Image
                        source={imageIndex.clockBlack}
                        style={[styles.dateIcon, { tintColor: 'black' }]}
                      />
                      <Text style={styles.dateTimeText}>
                        {searchParams.departureTime}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {tripType === 'round-trip' && (
                  <View style={styles.dateTimeRow}>
                    <View style={styles.dateTimeInput}>
                      <Text style={styles.inputLabel}>Return Date</Text>
                      <TouchableOpacity
                        style={styles.dateTimeButton}
                        onPress={() => showDatePicker('return')}
                      >
                        <Image
                          source={imageIndex.calendar}
                          style={[styles.dateIcon, { tintColor: 'black' }]}
                        />
                        <Text style={styles.dateTimeText}>
                          {formatDisplayDate(searchParams.returnDate)}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.dateTimeInput}>
                      <Text style={styles.inputLabel}>Return Time</Text>
                      <TouchableOpacity
                        style={styles.dateTimeButton}
                        onPress={() => openTimePicker('return')}
                      >
                        <Image
                          source={imageIndex.clockBlack}
                          style={[styles.dateIcon, { tintColor: 'black' }]}
                        />
                        <Text style={styles.dateTimeText}>
                          {searchParams.returnTime}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              <PassengerModal
                visible={isPassengerModalVisible}
                onClose={() => setIsPassengerModalVisible(false)}
                passengerCount={searchParams}
                onPassengerChange={handlePassengerChange}
              />

              <CustomButton
                title={
                  loading
                    ? 'Searching...'
                    : `Search ${tripType === 'one-way' ? 'One Way' : 'Round Trip'} Flights`
                }
                buttonStyle={[
                  styles.searchButton,
                  loading && styles.searchButtonDisabled,
                ]}
                onPress={handleSearch}
                disabled={loading}
              />
            </View>

            {flights.length > 0 && !loading && (
              <View style={styles.flightsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    Available {tripType === 'one-way' ? 'One Way' : 'Round Trip'} Flights
                  </Text>
                  <Text style={styles.flightTimeInfo}>
                    Departing at {searchParams.departureTime}
                  </Text>
                </View>

                <FlatList
                  data={flights}
                  keyExtractor={(item, index) => item?.id?.toString?.() || String(index)}
                  renderItem={renderFlightItem}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
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