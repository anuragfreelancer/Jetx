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
 import CustomCalendarModal from '../../../compoent/CustomCalendarModal';
import { fetchCompleteFlightData } from '../AviapagesFlightService';

// ─── Time Picker Component ────────────────────────────────────────
const TimePickerModal = ({
  visible,
  onClose,
  onTimeSelect,
  initialTime = '08:00',
}: any) => {
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    const slots: string[] = [];
    for (let hour = 5; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(
          `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        );
      }
    }
    setTimeSlots(slots);
  }, []);

  const renderTimeSlot = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.timeSlot, selectedTime === item && styles.selectedTimeSlot]}
      onPress={() => setSelectedTime(item)}
    >
      <Text style={[styles.timeSlotText, selectedTime === item && styles.selectedTimeSlotText]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
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
            keyExtractor={(item) => item}
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
              onPress={() => { onTimeSelect(selectedTime); onClose(); }}
            >
              <Text style={styles.confirmButtonText}>Confirm Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── HomeScreen ───────────────────────────────────────────────────
const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch   = useDispatch();
  const isLogin    = useSelector((state: any) => state.auth);
  const userGet    = useSelector((state: any) => state.feature);
  const userId     = isLogin?.userData?.id;
  const userData   = userGet?.userGetData;

  useEffect(() => { handleGetProfile(); }, []);

  const handleGetProfile = useCallback(async () => {
    if (userId) await GetProfile(userId, dispatch);
    else console.log('User ID not available');
  }, [userId, dispatch]);

  // ── State ──────────────────────────────────────────────────────
  const [isPassengerModalVisible, setIsPassengerModalVisible] = useState(false);
  const [tripType, setTripType]       = useState<'one-way' | 'round-trip'>('one-way');
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [selectedTimeType, setSelectedTimeType]       = useState('departure');
  const [isModalVisible,  setIsModalVisible]  = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [flights,     setFlights]     = useState<any[]>([]);
  const [privateJets, setPrivateJets] = useState<any[]>([]);
  const [loading,     setLoading]     = useState(false);

  const [datePickerConfig, setDatePickerConfig] = useState<{
    visible: boolean;
    type: 'departure' | 'return' | '';
  }>({ visible: false, type: '' });

  const [searchParams, setSearchParams] = useState({
    origin:             '',
    destination:        '',
    originDisplay:      '',
    destinationDisplay: '',
    departureDate:      new Date().toISOString().split('T')[0],
    departureTime:      '08:00',
    returnDate:         '',
    returnTime:         '18:00',
    adults:   1,
    children: 0,
    infants:  0,
  });

  // ── Helpers ────────────────────────────────────────────────────
  const parseLocalDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const str = String(dateString).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatDateForAPI = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Select date';
    const str = String(dateString).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('en-US', {
        day: 'numeric', month: 'short', year: 'numeric',
      });
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Select date';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // ── Validation ─────────────────────────────────────────────────
  const validateDates = (
    departureDate: string, returnDate: string,
    departureTime: string, returnTime: string
  ) => {
    if (tripType === 'round-trip' && departureDate && returnDate) {
      const depDate = parseLocalDate(departureDate);
      const retDate = parseLocalDate(returnDate);
      if (!depDate || !retDate) return true;

      if (depDate.getTime() === retDate.getTime()) {
        const [depH, depM] = departureTime.split(':').map(Number);
        const [retH, retM] = returnTime.split(':').map(Number);
        if (retH < depH || (retH === depH && retM <= depM)) {
          Alert.alert('Invalid Time', 'Return time must be after departure time on the same day', [{ text: 'OK' }]);
          return false;
        }
      } else if (retDate.getTime() <= depDate.getTime()) {
        Alert.alert('Invalid Date', 'Return date must be after departure date', [{ text: 'OK' }]);
        return false;
      }
    }
    return true;
  };

  // ── Date picker ────────────────────────────────────────────────
  const showDatePicker = (type: 'departure' | 'return') =>
    setDatePickerConfig({ visible: true, type });

  const onDateConfirm = (selectedDate: Date) => {
    const formattedDate = formatDateForAPI(selectedDate);
    if (datePickerConfig.type === 'departure') {
      if (
        tripType === 'round-trip' && searchParams.returnDate &&
        !validateDates(formattedDate, searchParams.returnDate, searchParams.departureTime, searchParams.returnTime)
      ) { setDatePickerConfig({ visible: false, type: '' }); return; }
      setSearchParams(prev => ({ ...prev, departureDate: formattedDate }));
    } else if (datePickerConfig.type === 'return') {
      if (
        searchParams.departureDate &&
        !validateDates(searchParams.departureDate, formattedDate, searchParams.departureTime, searchParams.returnTime)
      ) { setDatePickerConfig({ visible: false, type: '' }); return; }
      setSearchParams(prev => ({ ...prev, returnDate: formattedDate }));
    }
    setDatePickerConfig({ visible: false, type: '' });
  };

  const onDateCancel = () => setDatePickerConfig({ visible: false, type: '' });

  const getMinReturnDate = () => {
    const depDate = searchParams.departureDate ? parseLocalDate(searchParams.departureDate) : null;
    if (depDate) {
      const minDate = new Date(depDate);
      minDate.setDate(depDate.getDate() + 1);
      return minDate;
    }
    return new Date();
  };

  const getCurrentDate = (type: string) => {
    if (type === 'departure' && searchParams.departureDate)
      return parseLocalDate(searchParams.departureDate) ?? new Date();
    if (type === 'return' && searchParams.returnDate)
      return parseLocalDate(searchParams.returnDate) ?? new Date();
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

  // Auto-clear invalid return date
  useEffect(() => {
    if (searchParams.departureDate && searchParams.returnDate) {
      const dep = parseLocalDate(searchParams.departureDate);
      const ret = parseLocalDate(searchParams.returnDate);
      if (dep && ret && ret.getTime() <= dep.getTime())
        setSearchParams(prev => ({ ...prev, returnDate: '' }));
    }
  }, [searchParams.departureDate]);

  // ── Airport selection ──────────────────────────────────────────
  const handleSelectAirport = (airport: any) => {
    setSearchParams(prev => ({
      ...prev,
      origin:        airport.icao || airport.iata,
      originDisplay: airport.name || airport.icao || airport.iata,
    }));
  };

  const handleSelectAirport2 = (airport: any) => {
    setSearchParams(prev => ({
      ...prev,
      destination:        airport.icao || airport.iata,
      destinationDisplay: airport.name || airport.icao || airport.iata,
    }));
  };

  const swapLocations = () => {
    setSearchParams(prev => ({
      ...prev,
      origin:             prev.destination,
      destination:        prev.origin,
      originDisplay:      prev.destinationDisplay,
      destinationDisplay: prev.originDisplay,
    }));
  };

  const handleTripTypeChange = (type: 'one-way' | 'round-trip') => {
    setTripType(type);
    if (type === 'one-way') setSearchParams(prev => ({ ...prev, returnDate: '' }));
  };

  const handlePassengerChange = (newCount: any) =>
    setSearchParams(prev => ({ ...prev, ...newCount }));

  const openTimePicker = (type: string) => {
    setSelectedTimeType(type);
    setIsTimePickerVisible(true);
  };

  const handleTimeSelect = (time: string) => {
    if (selectedTimeType === 'departure')
      setSearchParams(prev => ({ ...prev, departureTime: time }));
    else
      setSearchParams(prev => ({ ...prev, returnTime: time }));
  };

  // ── Fetch flights using aviapagesService ───────────────────────
  const fetchFlights = async () => {
    try {
      if (
        tripType === 'round-trip' && searchParams.returnDate &&
        !validateDates(
          searchParams.departureDate, searchParams.returnDate,
          searchParams.departureTime, searchParams.returnTime
        )
      ) return;

      setLoading(true);

      // fetchCompleteFlightData from aviapagesService.js
      const result = await fetchCompleteFlightData(null, {
        departure:  searchParams.origin,
        arrival:    searchParams.destination,
        date:       searchParams.departureDate,
        passengers: searchParams.adults + searchParams.children + searchParams.infants,
      });

      console.log('✅ Aviapages result — total aircraft:', result?.enrichedList?.length);

      const list = result?.enrichedList || [];

      if (list.length > 0) {
        // Map aviapagesService data → flight card format
        const mapped = list.map((ac: any) => ({
          id:   String(ac.id),
          price: { total: ac.realPriceAmount || 0 },
          pricing: {
            baseFare:   ac.realPriceAmount ? Math.round(ac.realPriceAmount * 0.9) : 0,
            serviceFee: ac.realPriceAmount ? Math.round(ac.realPriceAmount * 0.1) : 0,
          },
          aircraftInfo: {
            airline:      ac.company      || 'Private Jet Charter',
            manufacturer: ac.aircraftName || '',
            model:        ac.aircraftClass || '',
            seats:        ac.passengersMax || 8,
            images:       ac.image ? [ac.image] : [],
          },
          itineraries: [{
            duration: ac.bestFlightTime ? `PT${Math.floor(ac.bestFlightTime / 60)}H${ac.bestFlightTime % 60}M` : 'PT2H30M',
            segments: [{
              departure: {
                at: `${searchParams.departureDate}T${searchParams.departureTime}:00`,
                userPreferredTime: searchParams.departureTime,
              },
              arrival: {
                at: (() => {
                  const dep = new Date(`${searchParams.departureDate}T${searchParams.departureTime}:00`);
                  dep.setMinutes(dep.getMinutes() + (ac.bestFlightTime || 150));
                  return dep.toISOString();
                })(),
              },
            }],
          }],
          userPreferredDepartureTime: searchParams.departureTime,
          // Pass through all original aviapages data for CharterDetailsScreen
          ...ac,
        }));

        setFlights(mapped);
        setPrivateJets(mapped);
      } else {
        setFlights([]);
        setPrivateJets([]);
        Alert.alert('No Results', 'No charter aircraft found for this route.');
      }
    } catch (error) {
      console.error('❌ Error fetching flights:', error);
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
    if (
      tripType === 'round-trip' && (
        !searchParams.returnDate ||
        !validateDates(
          searchParams.departureDate, searchParams.returnDate,
          searchParams.departureTime, searchParams.returnTime
        )
      )
    ) return;
    fetchFlights();
  };

  // ── Render flight card ─────────────────────────────────────────
  const renderFlightItem = ({ item, index }: any) => {
    const aircraftInfo = item.aircraftInfo || {};
    const serviceFee   = item.pricing?.serviceFee || Math.round((item.price?.total || 0) * 0.1);
    const basePrice    = item.pricing?.baseFare   || ((item.price?.total || 0) - serviceFee);
    const totalWithFee = basePrice + serviceFee;

    return (
      <TouchableOpacity
        style={[styles.flightCard, index === 0 && styles.featuredFlightCard]}
        onPress={() =>
          navigation.navigate('CharterDetailsScreen' as never, {
            charter:      item,
            tripType:     tripType,
            searchParams: searchParams,
            bagImage:     item?.aircraftInfo?.images,
          } as never)
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
              {aircraftInfo.airline || 'Private Jet Charter'}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              {item.realPriceMidFormatted || (totalWithFee > 0 ? `$${totalWithFee.toLocaleString()}` : 'Price on request')}
            </Text>
          </View>
        </View>

        <View style={styles.flightRoute}>
          <View style={styles.routeSection}>
            <Text style={styles.timeText}>
              {item.itineraries?.[0]?.segments?.[0]?.departure?.at
                ? new Date(item.itineraries[0].segments[0].departure.at)
                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : searchParams.departureTime}
            </Text>
            <Text style={styles.airportText}>{searchParams.origin}</Text>
          </View>

          <View style={styles.routeMiddle}>
            <Text style={styles.durationText}>
              {item.bestFlightTimeFormatted ||
                item.itineraries?.[0]?.duration?.replace('PT', '') ||
                '–'}
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
                ? new Date(item.itineraries[0].segments[0].arrival.at)
                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '–'}
            </Text>
            <Text style={styles.airportText}>{searchParams.destination}</Text>
          </View>
        </View>

        {item.userPreferredDepartureTime && (
          <Text style={styles.preferredTimeBadge}>Your preferred time</Text>
        )}

        <View style={styles.flightFooter}>
          <View style={styles.aircraftInfo}>
            <Text style={styles.aircraftName}>
              {aircraftInfo.manufacturer} {aircraftInfo.model}
            </Text>
            <Text style={styles.seatsInfo}>
              • {aircraftInfo.seats || 8} Seats
              {item.wifi ? ' • WiFi' : ''}
              {item.lavatory ? ' • Lavatory' : ''}
            </Text>
          </View>
        </View>

        {/* INR price if available */}
        {item.realPriceINR && (
          <Text style={[styles.seatsInfo, { paddingHorizontal: 12, paddingBottom: 4 }]}>
            ≈ {item.realPriceINR}
          </Text>
        )}

        <View style={styles.selectButton}>
          <Text style={styles.selectText}>View Details & Book →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBarComponent backgroundColor='#FF3B30' barStyle="light-content" />
      <LoadingModal visible={loading} />

      <TimePickerModal
        visible={isTimePickerVisible}
        onClose={() => setIsTimePickerVisible(false)}
        onTimeSelect={handleTimeSelect}
        initialTime={selectedTimeType === 'departure' ? searchParams.departureTime : searchParams.returnTime}
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

      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']} />
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingText}>{userData?.user_name || 'User'}, Welcome! 👋</Text>
            <Text style={styles.headerText}>Find Your Perfect{'\n'}Flight</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate(ScreenNameEnum.ProfileScreen as never)}
            >
              <Image
                source={userData?.image ? { uri: userData.image } : imageIndex.Ellipse}
                style={styles.profileIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.formContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

            <View style={styles.searchCard}>
              <Text style={styles.searchTitle}>Search Flights</Text>

              {/* Trip type toggle */}
              <View style={styles.tripTypeContainer}>
                {(['one-way', 'round-trip'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.tripTypeButton, tripType === type && styles.tripTypeButtonActive]}
                    onPress={() => handleTripTypeChange(type)}
                  >
                    <Text style={[styles.tripTypeText, tripType === type && styles.tripTypeTextActive]}>
                      {type === 'one-way' ? 'One Way' : 'Round Trip'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* From / To */}
              <View style={styles.locationContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>From</Text>
                  <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.inputWithIcon}>
                    <Image source={imageIndex.location2} style={[styles.inputIcon, { tintColor: 'black' }]} />
                    <Text style={[styles.inputField, { maxWidth: '100%' }]} numberOfLines={1}>
                      {searchParams.originDisplay || searchParams.origin || 'Departure city'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.swapButton} onPress={swapLocations}>
                  <Image source={imageIndex.swap} style={[styles.swapIcon, { tintColor: 'black' }]} />
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>To</Text>
                  <View style={styles.inputWithIcon}>
                    <Image source={imageIndex.location2} style={[styles.inputIcon, { tintColor: 'black' }]} />
                    <TouchableOpacity
                      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                      onPress={() => setIsModalVisible2(true)}
                    >
                      <Text>
                        {searchParams.destinationDisplay || searchParams.destination || 'To'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Dates & Times */}
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeRow}>
                  <View style={styles.dateTimeInput}>
                    <Text style={styles.inputLabel}>Departure Date</Text>
                    <TouchableOpacity style={styles.dateTimeButton} onPress={() => showDatePicker('departure')}>
                      <Image source={imageIndex.calendar} style={[styles.dateIcon, { tintColor: 'black' }]} />
                      <Text style={[styles.dateTimeText, { color: 'black' }]}>
                        {formatDisplayDate(searchParams.departureDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dateTimeInput}>
                    <Text style={styles.inputLabel}>Departure Time</Text>
                    <TouchableOpacity style={styles.dateTimeButton} onPress={() => openTimePicker('departure')}>
                      <Image source={imageIndex.clockBlack} style={[styles.dateIcon, { tintColor: 'black' }]} />
                      <Text style={styles.dateTimeText}>{searchParams.departureTime}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {tripType === 'round-trip' && (
                  <View style={styles.dateTimeRow}>
                    <View style={styles.dateTimeInput}>
                      <Text style={styles.inputLabel}>Return Date</Text>
                      <TouchableOpacity style={styles.dateTimeButton} onPress={() => showDatePicker('return')}>
                        <Image source={imageIndex.calendar} style={styles.dateIcon} />
                        <Text style={styles.dateTimeText}>{formatDisplayDate(searchParams.returnDate)}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.dateTimeInput}>
                      <Text style={styles.inputLabel}>Return Time</Text>
                      <TouchableOpacity style={styles.dateTimeButton} onPress={() => openTimePicker('return')}>
                        <Image source={imageIndex.clockBlack} style={styles.timeIcon} />
                        <Text style={styles.dateTimeText}>{searchParams.returnTime}</Text>
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
                title={loading ? 'Searching...' : `Search ${tripType === 'one-way' ? 'One Way' : 'Round Trip'} Flights`}
                buttonStyle={[styles.searchButton, loading && styles.searchButtonDisabled]}
                onPress={handleSearch}
                disabled={loading}
              />
            </View>

            {/* Flight results */}
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
                  keyExtractor={(item) => String(item.id)}
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