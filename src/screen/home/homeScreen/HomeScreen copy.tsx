

// // import React, { useCallback, useEffect, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   Image,
// //   FlatList,
// //   TouchableOpacity,
// //   ScrollView,
// //   Alert,
// //   KeyboardAvoidingView,
// //   Platform,
// //   Modal,
// // } from 'react-native';
// // import DateTimePicker from '@react-native-community/datetimepicker';
// // import imageIndex from '../../../assets/imageIndex';
// // import CustomButton from '../../../compoent/CustomButton';
// // import StatusBarComponent from '../../../compoent/StatusBarCompoent';
// // import { useNavigation } from '@react-navigation/native';
// // import ScreenNameEnum from '../../../routes/screenName.enum';
// // import styles from './style';
// // import LoadingModal from '../../../utils/Loader';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { GetProfile } from '../../../redux/Api/AuthApi';
// // import AirportSearchModal from '../../../compoent/AirportSearchModal';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import PassengerModal from '../../../compoent/PasengerSelectModal';
// // import { AviapagesFlightService } from '../AviapagesFlightService';

// // // Time Picker Component
// // const TimePickerModal = ({
// //   visible,
// //   onClose,
// //   onTimeSelect,
// //   initialTime = '08:00'
// // }) => {
// //   const [selectedTime, setSelectedTime] = useState(initialTime);
// //   const [timeSlots, setTimeSlots] = useState([]);

// //   useEffect(() => {
// //     // Generate time slots every 30 minutes from 05:00 to 23:30
// //     const slots = [];
// //     for (let hour = 5; hour < 24; hour++) {
// //       for (let minute = 0; minute < 60; minute += 30) {
// //         const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
// //         slots.push(timeString);
// //       }
// //     }
// //     setTimeSlots(slots);
// //   }, []);

// //   const handleTimeSelect = (time) => {
// //     setSelectedTime(time);
// //   };

// //   const handleConfirm = () => {
// //     onTimeSelect(selectedTime);
// //     onClose();
// //   };

// //   const renderTimeSlot = ({ item }) => (
// //     <TouchableOpacity
// //       style={[
// //         styles.timeSlot,
// //         selectedTime === item && styles.selectedTimeSlot
// //       ]}
// //       onPress={() => handleTimeSelect(item)}
// //     >
// //       <Text style={[
// //         styles.timeSlotText,
// //         selectedTime === item && styles.selectedTimeSlotText
// //       ]}>
// //         {item}
// //       </Text>
// //     </TouchableOpacity>
// //   );

// //   return (
// //     <Modal
// //       visible={visible}
// //       animationType="slide"
// //       transparent={true}
// //       onRequestClose={onClose}
// //     >
// //       <View style={styles.modalOverlay}>
// //         <View style={styles.timePickerModal}>
// //           <View style={styles.timePickerHeader}>
// //             <Text style={styles.timePickerTitle}>Select Departure Time</Text>
// //             <TouchableOpacity onPress={onClose}>
// //               <Text style={styles.closeButton}>✕</Text>
// //             </TouchableOpacity>
// //           </View>

// //           <Text style={styles.selectedTimeDisplay}>
// //             Selected: <Text style={styles.selectedTimeText}>{selectedTime}</Text>
// //           </Text>

// //           <FlatList
// //             data={timeSlots}
// //             renderItem={renderTimeSlot}
// //             keyExtractor={(item) => item}
// //             numColumns={4}
// //             contentContainerStyle={styles.timeSlotsContainer}
// //             showsVerticalScrollIndicator={false}
// //           />

// //           <View style={styles.timePickerButtons}>
// //             <TouchableOpacity
// //               style={[styles.timePickerButton, styles.cancelButton]}
// //               onPress={onClose}
// //             >
// //               <Text style={styles.cancelButtonText}>Cancel</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity
// //               style={[styles.timePickerButton, styles.confirmButton]}
// //               onPress={handleConfirm}
// //             >
// //               <Text style={styles.confirmButtonText}>Confirm Time</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </View>
// //     </Modal>
// //   );
// // };

// // const HomeScreen = () => {
// //   const navigation = useNavigation();
// //   const dispatch = useDispatch();
// //   const isLogin = useSelector((state: any) => state.auth);
// //   const userGet = useSelector((state: any) => state.feature);
// //   const userId = isLogin?.userData?.id;
// //   const userData = userGet?.userGetData;

// //   useEffect(() => {
// //     handleGetProfile();
// //   }, []);

// //   const handleGetProfile = useCallback(async () => {
// //     if (userId) {
// //       await GetProfile(userId, dispatch);
// //     } else {
// //       console.log("User ID not available");
// //     }
// //   }, [userId, dispatch]);

// //   const [isPassengerModalVisible, setIsPassengerModalVisible] = useState(false);
// //   const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
// //   const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

// //   const handlePassengerChange = (newCount: any) => {
// //     setSearchParams(prev => ({
// //       ...prev,
// //       ...newCount,
// //     }));
// //   };

// //   const getPassengerSummary = () => {
// //     const { adults, children, infants } = searchParams;
// //     let summary = `${adults} Adult${adults !== 1 ? 's' : ''}`;

// //     if (children > 0) {
// //       summary += `, ${children} Child${children !== 1 ? 'ren' : ''}`;
// //     }

// //     if (infants > 0) {
// //       summary += `, ${infants} Infant${infants !== 1 ? 's' : ''}`;
// //     }

// //     return summary;
// //   };

// //   const departureDate = new Date().toISOString().split('T')[0];

// //   // State for search parameters
// //   const [searchParams, setSearchParams] = useState({
// //     origin: '',
// //     destination: '',
// //     originDisplay: '',   // From airport list API – e.g. "Dubai International (DXB)"
// //     destinationDisplay: '',
// //     departureDate: departureDate,
// //     departureTime: '08:00', // Default departure time
// //     returnDate: '',
// //     returnTime: '18:00', // Default return time for round trip
// //     adults: 1,
// //     children: 0,
// //     infants: 0,
// //   });

// //   const [isModalVisible, setIsModalVisible] = useState(false);
// //   const [isModalVisible2, setIsModalVisible2] = useState(false);
// //   const [flights, setFlights] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [privateJets, setPrivateJets] = useState<any[]>([]);
// //   const [selectedTimeType, setSelectedTimeType] = useState('departure'); // 'departure' or 'return'

// //   // State for date picker
// //   const [showDeparturePicker, setShowDeparturePicker] = useState(false);
// //   const [showReturnPicker, setShowReturnPicker] = useState(false);
// //   const [selectedDateType, setSelectedDateType] = useState('');

// //   // Airport selection handlers – use Aviapages airport list API (AirportSearchModal)
// //   const handleSelectAirport = (airport: any) => {
// //     setSearchParams(prev => ({
// //       ...prev,
// //       origin: airport.icao || airport.iata, // ICAO for API
// //       originDisplay: airport.name || `${airport.icao || airport.iata}`,
// //     }));
// //   };

// //   const handleSelectAirport2 = (airport: any) => {
// //     setSearchParams(prev => ({
// //       ...prev,
// //       destination: airport.icao || airport.iata,
// //       destinationDisplay: airport.name || `${airport.icao || airport.iata}`,
// //     }));
// //   };

// //   // Format date for display (timezone-safe: parse YYYY-MM-DD as local so all devices show same day)
// //   const formatDisplayDate = (dateString: string) => {
// //     if (!dateString) return 'Select date';
// //     const str = String(dateString).trim();
// //     if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
// //       const [y, m, d] = str.split('-').map(Number);
// //       const date = new Date(y, m - 1, d);
// //       return date.toLocaleDateString('en-US', {
// //         day: 'numeric',
// //         month: 'short',
// //         year: 'numeric'
// //       });
// //     }
// //     const date = new Date(dateString);
// //     if (isNaN(date.getTime())) return 'Select date';
// //     return date.toLocaleDateString('en-US', {
// //       day: 'numeric',
// //       month: 'short',
// //       year: 'numeric'
// //     });
// //   };

// //   // Format date for API (YYYY-MM-DD) – use local date so stored date matches user selection on all devices
// //   const formatDateForAPI = (date: Date) => {
// //     const y = date.getFullYear();
// //     const m = String(date.getMonth() + 1).padStart(2, '0');
// //     const d = String(date.getDate()).padStart(2, '0');
// //     return `${y}-${m}-${d}`;
// //   };

// //   // Parse YYYY-MM-DD as local date (avoids wrong day on some devices/timezones)
// //   const parseLocalDate = (dateString: string): Date | null => {
// //     if (!dateString) return null;
// //     const str = String(dateString).trim();
// //     if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
// //       const [y, m, d] = str.split('-').map(Number);
// //       return new Date(y, m - 1, d);
// //     }
// //     const d = new Date(dateString);
// //     return isNaN(d.getTime()) ? null : d;
// //   };

// //   // Format date and time for display (timezone-safe for date part)
// //   const formatDateTimeDisplay = (date: string, time: string) => {
// //     if (!date) return 'Select date & time';
// //     const str = String(date).trim();
// //     let dateObj: Date;
// //     if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
// //       const [y, m, d] = str.split('-').map(Number);
// //       dateObj = new Date(y, m - 1, d);
// //     } else {
// //       dateObj = new Date(date);
// //     }
// //     if (isNaN(dateObj.getTime())) return 'Select date & time';
// //     const formattedDate = dateObj.toLocaleDateString('en-US', {
// //       day: 'numeric',
// //       month: 'short'
// //     });
// //     return `${formattedDate}, ${time}`;
// //   };

// //   // Handle time selection
// //   const handleTimeSelect = (time: string) => {
// //     if (selectedTimeType === 'departure') {
// //       setSearchParams(prev => ({ ...prev, departureTime: time }));
// //     } else {
// //       setSearchParams(prev => ({ ...prev, returnTime: time }));
// //     }
// //   };

// //   // Open time picker
// //   const openTimePicker = (type: string) => {
// //     setSelectedTimeType(type);
// //     setIsTimePickerVisible(true);
// //   };

// //   // Validate dates and times
// //   const validateDates = (departureDate: string, returnDate: string, departureTime: string, returnTime: string) => {
// //     if (tripType === 'round-trip' && departureDate && returnDate) {
// //       const depDate = parseLocalDate(departureDate);
// //       const retDate = parseLocalDate(returnDate);
// //       if (!depDate || !retDate) return true;
// //       // If same date, check times
// //       if (depDate.getTime() === retDate.getTime()) {
// //         const [depHour, depMinute] = departureTime.split(':').map(Number);
// //         const [retHour, retMinute] = returnTime.split(':').map(Number);

// //         if (retHour < depHour || (retHour === depHour && retMinute <= depMinute)) {
// //           Alert.alert(
// //             'Invalid Time',
// //             'Return time must be after departure time on the same day',
// //             [{ text: 'OK' }]
// //           );
// //           return false;
// //         }
// //       } else if (retDate.getTime() <= depDate.getTime()) {
// //         Alert.alert(
// //           'Invalid Date',
// //           'Return date must be after departure date',
// //           [{ text: 'OK' }]
// //         );
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   // Handle date change
// //   const onDateChange = (event: any, selectedDate?: Date) => {
// //     setShowDeparturePicker(false);
// //     setShowReturnPicker(false);

// //     if (selectedDate) {
// //       const formattedDate = formatDateForAPI(selectedDate);

// //       if (selectedDateType === 'departure') {
// //         if (tripType === 'round-trip' && searchParams?.returnDate &&
// //           !validateDates(formattedDate, searchParams.returnDate, searchParams.departureTime, searchParams.returnTime)) {
// //           return;
// //         }

// //         setSearchParams(prev => ({
// //           ...prev,
// //           departureDate: formattedDate
// //         }));
// //       } else if (selectedDateType === 'return') {
// //         if (searchParams.departureDate &&
// //           !validateDates(searchParams.departureDate, formattedDate, searchParams.departureTime, searchParams.returnTime)) {
// //           return;
// //         }

// //         setSearchParams(prev => ({
// //           ...prev,
// //           returnDate: formattedDate
// //         }));
// //       }
// //     }

// //     setSelectedDateType('');
// //   };

// //   // Show date picker
// //   const showDatePicker = (type: string) => {
// //     setSelectedDateType(type);

// //     if (type === 'departure') {
// //       setShowDeparturePicker(true);
// //     } else if (type === 'return') {
// //       setShowReturnPicker(true);
// //     }
// //   };

// //   // Get minimum date for return date picker
// //   const getMinReturnDate = () => {
// //     const depDate = searchParams.departureDate ? parseLocalDate(searchParams.departureDate) : null;
// //     if (depDate) {
// //       const minDate = new Date(depDate);
// //       minDate.setDate(depDate.getDate() + 1);
// //       return minDate;
// //     }
// //     return new Date();
// //   };

// //   // Get current date for date picker
// //   const getCurrentDate = (type: string) => {
// //     if (type === 'departure' && searchParams.departureDate) {
// //       return parseLocalDate(searchParams.departureDate) ?? new Date();
// //     }
// //     if (type === 'return' && searchParams.returnDate) {
// //       return parseLocalDate(searchParams.returnDate) ?? new Date();
// //     }

// //     if (type === 'return' && searchParams.departureDate) {
// //       const depDate = parseLocalDate(searchParams.departureDate);
// //       if (depDate) {
// //         const nextDay = new Date(depDate);
// //         nextDay.setDate(depDate.getDate() + 1);
// //         return nextDay;
// //       }
// //     }

// //     return new Date();
// //   };

// //   // Fetch flight data using Aviapages API
// //   const fetchFlights = async () => {
// //     try {
// //       // Validate dates and times for round trip
// //       if (tripType === 'round-trip' && searchParams.returnDate &&
// //         !validateDates(searchParams.departureDate, searchParams.returnDate, searchParams.departureTime, searchParams.returnTime)) {
// //         return;
// //       }
// //       setLoading(true);

// //       console.log('🔍 Searching flights with params:', {
// //         origin: searchParams.origin,
// //         destination: searchParams.destination,
// //         departureDate: searchParams.departureDate,
// //         departureTime: searchParams.departureTime,
// //         returnDate: tripType === 'round-trip' ? searchParams.returnDate : null,
// //         returnTime: searchParams.returnTime,
// //         passengers: searchParams.adults + searchParams.children + searchParams.infants,
// //       });

// //       // Call API with correct parameters
// //       const data = await AviapagesFlightService.searchFlights(
// //         searchParams.origin,                                              // origin (ICAO code)
// //         searchParams.destination,                                         // destination (ICAO code)
// //         searchParams.departureDate,                                       // departureDate
// //         searchParams.departureTime,                                       // departureTime
// //         tripType === 'round-trip' ? searchParams.returnDate : null,       // returnDate
// //         searchParams.returnTime,                                          // returnTime
// //         searchParams.adults + searchParams.children + searchParams.infants, // passengers
// //         false                                                             // flexibleTiming
// //       );

// //       console.log('✅ API Response:', data?.metadata?.source, 'Total flights:', data?.data?.length);

// //       if (data && data.data && data.data.length > 0) {
// //         const flightsWithPreferredTime = data.data.map(flight => {
// //           const departureDate = new Date(flight.itineraries?.[0]?.segments?.[0]?.departure?.at || searchParams.departureDate);
// //           const [hours, minutes] = searchParams.departureTime.split(':').map(Number);
// //           departureDate.setHours(hours, minutes, 0, 0);

// //           // Calculate arrival time based on duration
// //           const duration = flight.itineraries?.[0]?.duration || 'PT2H30M';
// //           const durationMatch = duration.match(/PT(\d+)H(\d+)?M?/);
// //           const flightHours = durationMatch ? parseInt(durationMatch[1]) : 2;
// //           const flightMinutes = durationMatch && durationMatch[2] ? parseInt(durationMatch[2]) : 30;

// //           const arrivalDate = new Date(departureDate);
// //           arrivalDate.setHours(arrivalDate.getHours() + flightHours);
// //           arrivalDate.setMinutes(arrivalDate.getMinutes() + flightMinutes);

// //           return {
// //             ...flight,
// //             itineraries: [{
// //               ...flight.itineraries?.[0],
// //               segments: [{
// //                 ...flight.itineraries?.[0]?.segments?.[0],
// //                 departure: {
// //                   ...flight.itineraries?.[0]?.segments?.[0]?.departure,
// //                   at: departureDate.toISOString(),
// //                   userPreferredTime: searchParams.departureTime
// //                 },
// //                 arrival: {
// //                   ...flight.itineraries?.[0]?.segments?.[0]?.arrival,
// //                   at: arrivalDate.toISOString()
// //                 }
// //               }]
// //             }],
// //             userPreferredDepartureTime: searchParams.departureTime
// //           };
// //         });

// //         setFlights(flightsWithPreferredTime);
// //         setPrivateJets(flightsWithPreferredTime); // Show all charters so customer can compare prices
// //         Alert.alert('Success', `Found ${flightsWithPreferredTime.length} ${tripType} flights departing at ${searchParams.departureTime}!`);
// //       } else {
// //         setFlights([]);
// //         setPrivateJets([]);
// //         Alert.alert('Info', `No ${tripType} flights found for your search. Try different airports, dates, or times.`);
// //       }

// //     } catch (error) {
// //       console.error('❌ Error fetching flights from Aviapages:', error);
// //       Alert.alert('Error', 'Failed to fetch flight data. Please check your connection and try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSearch = () => {
// //     if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
// //       Alert.alert('Error', 'Please fill in all required fields (From, To, and Departure Date)');
// //       return;
// //     }

// //     if (tripType === 'round-trip' && (!searchParams.returnDate ||
// //       !validateDates(searchParams.departureDate, searchParams.returnDate, searchParams.departureTime, searchParams.returnTime))) {
// //       return;
// //     }

// //     fetchFlights();
// //   };

// //   // Swap origin and destination
// //   const swapLocations = () => {
// //     setSearchParams(prev => ({
// //       ...prev,
// //       origin: prev.destination,
// //       destination: prev.origin,
// //       originDisplay: prev.destinationDisplay,
// //       destinationDisplay: prev.originDisplay,
// //     }));
// //   };

// //   // Handle trip type change
// //   const handleTripTypeChange = (type: 'one-way' | 'round-trip') => {
// //     setTripType(type);
// //     if (type === 'one-way') {
// //       setSearchParams(prev => ({ ...prev, returnDate: '' }));
// //     }
// //   };

// //   useEffect(() => {
// //     if (searchParams.departureDate && searchParams.returnDate) {
// //       const depDate = parseLocalDate(searchParams.departureDate);
// //       const retDate = parseLocalDate(searchParams.returnDate);
// //       if (depDate && retDate && retDate.getTime() <= depDate.getTime()) {
// //         setSearchParams(prev => ({
// //           ...prev,
// //           returnDate: ''
// //         }));
// //       }
// //     }
// //   }, [searchParams.departureDate]);

// //   // Render flight offer item
// //   const renderFlightItem = ({ item, index }: any) => {
// //     const aircraftInfo = item.aircraftInfo || {};
// //     const serviceFee = item.pricing?.serviceFee || Math.round((item.price?.total * 0.1));
// //     const basePrice = item.pricing?.baseFare || (item.price?.total - serviceFee);
// //     const totalWithFee = basePrice + serviceFee;

// //     return (
// //       <TouchableOpacity
// //         style={[
// //           styles.flightCard,
// //           index === 0 && styles.featuredFlightCard
// //         ]}
// //         onPress={() => navigation.navigate("CharterDetailsScreen", {
// //           charter: item,
// //           tripType: tripType,
// //           searchParams: searchParams,
// //           bagImage: item?.aircraftInfo?.images
// //         })}
// //       >
// //         {index === 0 && (
// //           <View style={styles.featuredBadge}>
// //             <Text style={styles.featuredText}>BEST DEAL</Text>
// //           </View>
// //         )}

// //         <View style={styles.flightHeader}>
// //           <View style={styles.airlineContainer}>
// //             <Text style={styles.airlineText}>
// //               {aircraftInfo.airline || 'Private Jet Charter'}
// //             </Text>
// //           </View>
// //           <View style={styles.priceContainer}>
// //             <Text style={styles.priceText}>${totalWithFee.toLocaleString()}</Text>
// //           </View>
// //         </View>

// //         <View style={styles.flightRoute}>
// //           <View style={styles.routeSection}>
// //             <Text style={styles.timeText}>
// //               {item.itineraries?.[0]?.segments?.[0]?.departure?.at
// //                 ? new Date(item.itineraries[0].segments[0].departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
// //                 : searchParams.departureTime
// //               }
// //             </Text>
// //             <Text style={styles.airportText}>{searchParams.origin}</Text>

// //           </View>

// //           <View style={styles.routeMiddle}>
// //             <Text style={styles.durationText}>
// //               {item.itineraries?.[0]?.duration?.replace('PT', '') || '2H 30M'}
// //             </Text>
// //             <View style={styles.flightLineContainer}>
// //               <View style={styles.flightDot} />
// //               <View style={styles.flightLine} />
// //               <View style={styles.flightDot} />
// //             </View>
// //           </View>

// //           <View style={styles.routeSection}>
// //             <Text style={styles.timeText}>
// //               {item.itineraries?.[0]?.segments?.[0]?.arrival?.at
// //                 ? new Date(item.itineraries[0].segments[0].arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
// //                 : '10:30'
// //               }
// //             </Text>
// //             <Text style={styles.airportText}>{searchParams.destination}</Text>
// //           </View>
// //         </View>
// //         {item.userPreferredDepartureTime && (
// //           <Text style={styles.preferredTimeBadge}>
// //             Your preferred time
// //           </Text>
// //         )}

// //         <View style={styles.flightFooter}>
// //           <View style={styles.aircraftInfo}>
// //             <Text style={styles.aircraftName}>
// //               {aircraftInfo.manufacturer} {aircraftInfo.model}
// //             </Text>
// //             <Text style={styles.seatsInfo}>
// //               • {aircraftInfo.seats || 8} Seats • Includes {serviceFee > 0 ? '10% Service Fee' : 'All Fees'}
// //             </Text>
// //           </View>
// //         </View>

// //         <View style={styles.selectButton}>
// //           <Text style={styles.selectText}>View Details & Book →</Text>
// //         </View>
// //       </TouchableOpacity>
// //     );
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <StatusBarComponent backgroundColor='#FF3B30' barStyle="light-content" />

// //       <LoadingModal visible={loading} />

// //       {/* Time Picker Modal */}
// //       <TimePickerModal
// //         visible={isTimePickerVisible}
// //         onClose={() => setIsTimePickerVisible(false)}
// //         onTimeSelect={handleTimeSelect}
// //         initialTime={selectedTimeType === 'departure' ? searchParams.departureTime : searchParams.returnTime}
// //       />

// //       <View style={[styles.header]}>
// //         <SafeAreaView edges={['top']} />
// //         <View style={styles.headerContent}>
// //           <View>
// //             <Text style={styles.greetingText}>{userData?.user_name || 'User'}, Welcome! 👋</Text>
// //             <Text style={styles.headerText}>
// //               Find Your Perfect{"\n"}Flight
// //             </Text>
// //           </View>
// //           <View style={styles.headerIcons}>
// //             {/* <TouchableOpacity
// //               style={styles.iconButton}
// //               onPress={() => navigation.navigate(ScreenNameEnum.Notifications)}
// //             >
// //               <Image
// //                 source={imageIndex.notifications}
// //                 style={styles.notificationIcon}
// //                 resizeMode='contain'
// //               />
// //               <View style={styles.notificationBadge} />
// //             </TouchableOpacity> */}
// //             <TouchableOpacity
// //               style={styles.iconButton}
// //               onPress={() => navigation.navigate(ScreenNameEnum.ProfileScreen)}
// //             >
// //               {userData?.image ? (
// //                 <Image
// //                   source={{ uri: userData?.image }}
// //                   style={styles.profileIcon}
// //                   resizeMode='contain'
// //                 />
// //               ) : (
// //                 <Image
// //                   source={imageIndex.Ellipse}
// //                   style={styles.profileIcon}
// //                   resizeMode='contain'
// //                 />
// //               )}
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </View>

// //       <KeyboardAvoidingView
// //         style={styles.keyboardView}
// //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //       >
// //         <View style={styles.formContainer}>
// //           <ScrollView
// //             showsVerticalScrollIndicator={false}
// //             contentContainerStyle={styles.scrollContent}
// //           >

// //             <View style={styles.searchCard}>
// //               <Text style={styles.searchTitle}>Search Flights</Text>

// //               {/* Trip Type Selector */}
// //               <View style={styles.tripTypeContainer}>
// //                 <TouchableOpacity
// //                   style={[
// //                     styles.tripTypeButton,
// //                     tripType === 'one-way' && styles.tripTypeButtonActive
// //                   ]}
// //                   onPress={() => handleTripTypeChange('one-way')}
// //                 >
// //                   <Text style={[
// //                     styles.tripTypeText,
// //                     tripType === 'one-way' && styles.tripTypeTextActive
// //                   ]}>
// //                     One Way
// //                   </Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   style={[
// //                     styles.tripTypeButton,
// //                     tripType === 'round-trip' && styles.tripTypeButtonActive
// //                   ]}
// //                   onPress={() => handleTripTypeChange('round-trip')}
// //                 >
// //                   <Text style={[
// //                     styles.tripTypeText,
// //                     tripType === 'round-trip' && styles.tripTypeTextActive
// //                   ]}>
// //                     Round Trip
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>

// //               {/* Location Inputs */}
// //               <View style={styles.locationContainer}>
// //                 <View style={styles.inputContainer}>
// //                   <Text style={styles.inputLabel}>From</Text>
// //                   <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.inputWithIcon}>
// //                     <Image source={imageIndex.location2} style={styles.inputIcon} />
// //                     <Text style={[styles.inputField, { maxWidth: '100%' }]} numberOfLines={1}>
// //                       {searchParams.originDisplay || searchParams.origin
// //                         ? (searchParams.originDisplay || searchParams.origin)
// //                         : 'Departure city'
// //                       }
// //                     </Text>
// //                   </TouchableOpacity>
// //                 </View>

// //                 <TouchableOpacity style={styles.swapButton} onPress={swapLocations}>
// //                   <Image source={imageIndex.swap} style={styles.swapIcon} />
// //                 </TouchableOpacity>

// //                 <View style={styles.inputContainer}>
// //                   <Text style={styles.inputLabel}>To</Text>
// //                   <View style={styles.inputWithIcon}>
// //                     <Image source={imageIndex.location2} style={styles.inputIcon} />
// //                     <TouchableOpacity
// //                       style={{
// //                         flex: 1,
// //                         justifyContent: "center",
// //                         alignItems: "center"
// //                       }}
// //                       onPress={() => setIsModalVisible2(true)}
// //                     >
// //                       <Text>
// //                         {searchParams.destinationDisplay || searchParams.destination
// //                           ? (searchParams.destinationDisplay || searchParams.destination)
// //                           : 'To'
// //                         }
// //                       </Text>
// //                     </TouchableOpacity>
// //                   </View>
// //                 </View>
// //               </View>

// //               {/* Date and Time Inputs */}
// //               <View style={styles.dateTimeContainer}>
// //                 {/* Departure Date & Time */}
// //                 <View style={styles.dateTimeRow}>
// //                   <View style={styles.dateTimeInput}>
// //                     <Text style={styles.inputLabel}>Departure Date</Text>
// //                     <TouchableOpacity
// //                       style={styles.dateTimeButton}
// //                       onPress={() => showDatePicker('departure')}
// //                     >
// //                       <Image source={imageIndex.calendar} style={styles.dateIcon} />
// //                       <Text style={styles.dateTimeText}>
// //                         {formatDisplayDate(searchParams.departureDate)}
// //                       </Text>
// //                     </TouchableOpacity>
// //                   </View>

// //                   <View style={styles.dateTimeInput}>
// //                     <Text style={styles.inputLabel}>Departure Time</Text>
// //                     <TouchableOpacity
// //                       style={[styles.dateTimeButton, {

// //                       }]}
// //                       onPress={() => openTimePicker('departure')}
// //                     >
// //                       <Image source={imageIndex.time} style={styles.dateIcon} />
// //                       <Text style={styles.dateTimeText}>
// //                         {searchParams.departureTime}
// //                       </Text>
// //                     </TouchableOpacity>
// //                   </View>
// //                 </View>

// //                 {/* Return Date & Time (for round trip) */}
// //                 {tripType === 'round-trip' && (
// //                   <View style={styles.dateTimeRow}>
// //                     <View style={styles.dateTimeInput}>
// //                       <Text style={styles.inputLabel}>Return Date</Text>
// //                       <TouchableOpacity
// //                         style={styles.dateTimeButton}
// //                         onPress={() => showDatePicker('return')}
// //                       >
// //                         <Image source={imageIndex.calendar} style={styles.dateIcon} />
// //                         <Text style={styles.dateTimeText}>
// //                           {formatDisplayDate(searchParams.returnDate)}
// //                         </Text>
// //                       </TouchableOpacity>
// //                     </View>

// //                     <View style={styles.dateTimeInput}>
// //                       <Text style={styles.inputLabel}>Return Time</Text>
// //                       <TouchableOpacity
// //                         style={styles.dateTimeButton}
// //                         onPress={() => openTimePicker('return')}
// //                       >
// //                         <Image source={imageIndex.time} style={styles.timeIcon} />
// //                         <Text style={styles.dateTimeText}>
// //                           {searchParams.returnTime}
// //                         </Text>
// //                       </TouchableOpacity>
// //                     </View>
// //                   </View>
// //                 )}
// //               </View>

// //               {/* Date Pickers */}
// //               {showDeparturePicker && (
// //                 <View style={styles.datePickerContainer}>
// //                   <DateTimePicker
// //                     value={getCurrentDate('departure')}
// //                     mode="date"
// //                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
// //                     onChange={onDateChange}
// //                     minimumDate={new Date()}
// //                   />
// //                 </View>
// //               )}

// //               {showReturnPicker && (
// //                 <View style={styles.datePickerContainer}>
// //                   <DateTimePicker
// //                     value={getCurrentDate('return')}
// //                     mode="date"
// //                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
// //                     onChange={onDateChange}
// //                     minimumDate={getMinReturnDate()}
// //                   />
// //                 </View>
// //               )}

// //               {/* <View style={styles.passengerContainer}>
// //                 <Text style={styles.inputLabel}>Passengers</Text>
// //                 <View style={styles.passengerSelector}>
// //                   <View style={styles.passengerItem}>
// //                     <View style={styles.passengerTextContainer}>
// //                       <Text style={styles.passengerText}>{getPassengerSummary()}</Text>
// //                     </View>
// //                   </View>
// //                   <TouchableOpacity
// //                     style={styles.editButton}
// //                     onPress={() => setIsPassengerModalVisible(true)}
// //                   >
// //                     <Text style={styles.editText}>Edit</Text>
// //                   </TouchableOpacity>
// //                 </View>
// //               </View> */}

// //               <PassengerModal
// //                 visible={isPassengerModalVisible}
// //                 onClose={() => setIsPassengerModalVisible(false)}
// //                 passengerCount={searchParams}
// //                 onPassengerChange={handlePassengerChange}
// //               />

// //               <CustomButton
// //                 title={loading ? 'Searching...' : `Search ${tripType === 'one-way' ? 'One Way' : 'Round Trip'} Flights`}
// //                 buttonStyle={[
// //                   styles.searchButton,
// //                   loading && styles.searchButtonDisabled
// //                 ]}
// //                 onPress={handleSearch}
// //                 disabled={loading}
// //               />
// //             </View>

// //             {/* Available Flights */}
// //             {flights.length > 0 && !loading && (
// //               <View style={styles.flightsSection}>
// //                 <View style={styles.sectionHeader}>
// //                   <Text style={styles.sectionTitle}>
// //                     Available {tripType === 'one-way' ? 'One Way' : 'Round Trip'} Flights
// //                   </Text>
// //                   <Text style={styles.flightTimeInfo}>
// //                     Departing at {searchParams.departureTime}
// //                   </Text>
// //                 </View>
// //                 <FlatList
// //                   data={flights}
// //                   keyExtractor={(item) => item.id}
// //                   renderItem={renderFlightItem}
// //                   scrollEnabled={false}
// //                   showsVerticalScrollIndicator={false}
// //                 />
// //               </View>
// //             )}
// //           </ScrollView>
// //         </View>
// //       </KeyboardAvoidingView>

// //       <AirportSearchModal
// //         visible={isModalVisible}
// //         onClose={() => setIsModalVisible(false)}
// //         onSelectAirport={handleSelectAirport}
// //       />

// //       <AirportSearchModal
// //         visible={isModalVisible2}
// //         onClose={() => setIsModalVisible2(false)}
// //         onSelectAirport={handleSelectAirport2}
// //       />
// //     </View>
// //   );
// // };

// // export default HomeScreen;




// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   TextInput,
// //   StyleSheet,
// //   ScrollView,
// //   ActivityIndicator,
// //   Alert,
// // } from "react-native";
// //  import DateTimePicker from "@react-native-community/datetimepicker";
// // import AirportSearchModal from "../../../compoent/AirportSearchModal";

// // const CALC_URL = "https://api.aviapages.com/v3/flight_calculator/";

// // const headers = {
// //   "Content-Type": "application/json",
// //   Authorization: "Token zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn",
// // };

// // export default function FlightCalculator() {
// //   const [departure, setDeparture] = useState(null);
// //   const [arrival, setArrival] = useState(null);
// //   const [passengers, setPassengers] = useState("");
// //   const [date, setDate] = useState(new Date());
// //   const [showDatePicker, setShowDatePicker] = useState(false);
// //   const [time, setTime] = useState(new Date());
// //   const [showTimePicker, setShowTimePicker] = useState(false);
// //   const [aircraft, setAircraft] = useState("");
// //   const [pricingPolicy, setPricingPolicy] = useState("");
// //   const [avoidCountries, setAvoidCountries] = useState(["Israel"]);
// //   const [loading, setLoading] = useState(false);

// //   const [showDepModal, setShowDepModal] = useState(false);
// //   const [showArrModal, setShowArrModal] = useState(false);

// //   const handleCalculate = async () => {
// //     if (!departure || !arrival || !passengers || !date || !time || !aircraft || !pricingPolicy) {
// //       Alert.alert("Error", "Please fill all required fields!");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const body = {
// //         departure_airport: departure.iata,
// //         arrival_airport: arrival.iata,
// //         aircraft,
// //         pax: passengers,
// //         flight_date: date.toISOString().split("T")[0],
// //         local_time: time.toTimeString().split(" ")[0],
// //         pricing_policy,
// //         avoid_countries: avoidCountries,
// //         airway_time_weather_impacted: true,
// //       };

// //       const response = await fetch(CALC_URL, {
// //         method: "POST",
// //         headers,
// //         body: JSON.stringify(body),
// //       });

// //       const data = await response.json();
// //       console.log("Calculator API response:", data);
// //       Alert.alert("Success", "Check console for API response.");
// //     } catch (e) {
// //       console.log(e);
// //       Alert.alert("Error", "Failed to calculate.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <ScrollView style={styles.container}>
// //       {/* Departure Airport */}
// //       <Text style={styles.label}>Departure Airport *</Text>
// //       <TouchableOpacity
// //         style={styles.input}
// //         onPress={() => setShowDepModal(true)}
// //       >
// //         <Text>{departure ? `${departure.name} (${departure.iata})` : "Select departure"}</Text>
// //       </TouchableOpacity>

// //       {/* Arrival Airport */}
// //       <Text style={styles.label}>Arrival Airport *</Text>
// //       <TouchableOpacity
// //         style={styles.input}
// //         onPress={() => setShowArrModal(true)}
// //       >
// //         <Text>{arrival ? `${arrival.name} (${arrival.iata})` : "Select arrival"}</Text>
// //       </TouchableOpacity>

// //       {/* Passengers */}
// //       <Text style={styles.label}>Passengers *</Text>
// //       <TextInput
// //         style={styles.input}
// //         keyboardType="numeric"
// //         placeholder="Number of passengers"
// //         value={passengers}
// //         onChangeText={setPassengers}
// //       />

// //       {/* Date */}
// //       <Text style={styles.label}>Date *</Text>
// //       <TouchableOpacity
// //         style={styles.input}
// //         onPress={() => setShowDatePicker(true)}
// //       >
// //         <Text>{date.toDateString()}</Text>
// //       </TouchableOpacity>
// //       {showDatePicker && (
// //         <DateTimePicker
// //           value={date}
// //           mode="date"
// //           display="default"
// //           onChange={(e, d) => {
// //             setShowDatePicker(false);
// //             if (d) setDate(d);
// //           }}
// //         />
// //       )}

// //       {/* Local Time */}
// //       <Text style={styles.label}>Local Time *</Text>
// //       <TouchableOpacity
// //         style={styles.input}
// //         onPress={() => setShowTimePicker(true)}
// //       >
// //         <Text>{time.toTimeString().split(" ")[0]}</Text>
// //       </TouchableOpacity>
// //       {showTimePicker && (
// //         <DateTimePicker
// //           value={time}
// //           mode="time"
// //           display="default"
// //           onChange={(e, t) => {
// //             setShowTimePicker(false);
// //             if (t) setTime(t);
// //           }}
// //         />
// //       )}

// //       {/* Aircraft */}
// //       <Text style={styles.label}>Aircraft *</Text>
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Aircraft type"
// //         value={aircraft}
// //         onChangeText={setAircraft}
// //       />

// //       {/* Pricing Policy */}
// //       <Text style={styles.label}>Pricing Policy *</Text>
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Pricing policy"
// //         value={pricingPolicy}
// //         onChangeText={setPricingPolicy}
// //       />

// //       {/* Avoid Countries */}
// //       <Text style={styles.label}>Avoid countries/FIRs (optional)</Text>
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Separate by comma"
// //         value={avoidCountries.join(", ")}
// //         onChangeText={(t) => setAvoidCountries(t.split(",").map((c) => c.trim()))}
// //       />

// //       {/* Calculate Button */}
// //       <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate}>
// //         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Calculate</Text>}
// //       </TouchableOpacity>

// //       {/* Airport Modals */}
// //       <AirportSearchModal
// //         visible={showDepModal}
// //         onClose={() => setShowDepModal(false)}
// //         onSelectAirport={(a) => setDeparture(a)}
// //       />
// //       <AirportSearchModal
// //         visible={showArrModal}
// //         onClose={() => setShowArrModal(false)}
// //         onSelectAirport={(a) => setArrival(a)}
// //       />
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
// //   label: { marginTop: 15, marginBottom: 5, fontWeight: "bold" },
// //   input: {
// //     padding: 12,
// //     borderWidth: 1,
// //     borderRadius: 8,
// //     borderColor: "#ccc",
// //     backgroundColor: "#fff",
// //   },
// //   calculateBtn: {
// //     backgroundColor: "#007bff",
// //     marginTop: 30,
// //     padding: 15,
// //     borderRadius: 8,
// //     alignItems: "center",
// //   },
// //   btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
// // });

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   Image,
//   Alert,
// } from "react-native";
//  import DateTimePicker from "@react-native-community/datetimepicker";
// import AirportSearchModal from "../../../compoent/AirportSearchModal";

// const CALC_URL = "https://api.aviapages.com/v3/flight_calculator/";

// const headers = {
//   "Content-Type": "application/json",
//   Authorization: "Token zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn",
// };

// // Flight Row Component
// const FlightRow = ({ index, flight, setFlight, removeFlight }) => {
//   const [showDepModal, setShowDepModal] = useState(false);
//   const [showArrModal, setShowArrModal] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);

//   return (
//     <View style={styles.flightRow}>
//       <Text style={styles.flightTitle}>Flight {index + 1}</Text>

//       {/* Departure Airport */}
//       <Text style={styles.label}>Departure Airport *</Text>
//       <TouchableOpacity
//         style={styles.input}
//         onPress={() => setShowDepModal(true)}
//       >
//         <Text>
//           {flight.departure
//             ? `${flight.departure.name} (${flight.departure.iata})`
//             : "Select departure"}
//         </Text>
//       </TouchableOpacity>

//       {/* Arrival Airport */}
//       <Text style={styles.label}>Arrival Airport *</Text>
//       <TouchableOpacity
//         style={styles.input}
//         onPress={() => setShowArrModal(true)}
//       >
//         <Text>
//           {flight.arrival
//             ? `${flight.arrival.name} (${flight.arrival.iata})`
//             : "Select arrival"}
//         </Text>
//       </TouchableOpacity>

//       {/* Passengers */}
//       <Text style={styles.label}>Passengers *</Text>
//       <TextInput
//         style={styles.input}
//         keyboardType="numeric"
//         placeholder="Number of passengers"
//         value={flight.passengers}
//         onChangeText={(t) =>
//           setFlight({ ...flight, passengers: t })
//         }
//       />

//       {/* Date */}
//       <Text style={styles.label}>Date *</Text>
//       <TouchableOpacity
//         style={styles.input}
//         onPress={() => setShowDatePicker(true)}
//       >
//         <Text>{flight.date.toDateString()}</Text>
//       </TouchableOpacity>
//       {showDatePicker && (
//         <DateTimePicker
//           value={flight.date}
//           mode="date"
//           display="default"
//           onChange={(e, d) => {
//             setShowDatePicker(false);
//             if (d) setFlight({ ...flight, date: d });
//           }}
//         />
//       )}

//       {/* Local Time */}
//       <Text style={styles.label}>Local Time *</Text>
//       <TouchableOpacity
//         style={styles.input}
//         onPress={() => setShowTimePicker(true)}
//       >
//         <Text>{flight.time.toTimeString().split(" ")[0]}</Text>
//       </TouchableOpacity>
//       {showTimePicker && (
//         <DateTimePicker
//           value={flight.time}
//           mode="time"
//           display="default"
//           onChange={(e, t) => {
//             setShowTimePicker(false);
//             if (t) setFlight({ ...flight, time: t });
//           }}
//         />
//       )}

//       {/* Aircraft */}
//       <Text style={styles.label}>Aircraft *</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Aircraft type"
//         value={flight.aircraft}
//         onChangeText={(t) => setFlight({ ...flight, aircraft: t })}
//       />

//       {/* Pricing Policy */}
//       <Text style={styles.label}>Pricing Policy *</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Pricing policy"
//         value={flight.pricingPolicy}
//         onChangeText={(t) => setFlight({ ...flight, pricingPolicy: t })}
//       />

//       {/* Avoid Countries */}
//       <Text style={styles.label}>Avoid countries/FIRs (optional)</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Separate by comma"
//         value={flight.avoidCountries.join(", ")}
//         onChangeText={(t) =>
//           setFlight({
//             ...flight,
//             avoidCountries: t.split(",").map((c) => c.trim()),
//           })
//         }
//       />

//       <TouchableOpacity
//         onPress={removeFlight}
//         style={styles.removeFlightBtn}
//       >
//         <Text style={{ color: "red" }}>Remove Flight</Text>
//       </TouchableOpacity>

//       {/* Airport Modals */}
//       <AirportSearchModal
//         visible={showDepModal}
//         onClose={() => setShowDepModal(false)}
//         onSelectAirport={(a) => setFlight({ ...flight, departure: a })}
//       />
//       <AirportSearchModal
//         visible={showArrModal}
//         onClose={() => setShowArrModal(false)}
//         onSelectAirport={(a) => setFlight({ ...flight, arrival: a })}
//       />
//     </View>
//   );
// };

// export default function FlightCalculator() {
//   const [flights, setFlights] = useState([
//     {
//       departure: null,
//       arrival: null,
//       passengers: "",
//       date: new Date(),
//       time: new Date(),
//       aircraft: "",
//       pricingPolicy: "",
//       avoidCountries: ["Israel"],
//     },
//   ]);
//   const [loading, setLoading] = useState(false);

//   const addFlight = () => {
//     setFlights([
//       ...flights,
//       {
//         departure: null,
//         arrival: null,
//         passengers: "",
//         date: new Date(),
//         time: new Date(),
//         aircraft: "",
//         pricingPolicy: "",
//         avoidCountries: ["Israel"],
//       },
//     ]);
//   };

//   const removeFlight = (index) => {
//     const updated = [...flights];
//     updated.splice(index, 1);
//     setFlights(updated);
//   };

//   const handleCalculate = async () => {
//     for (let f of flights) {
//       if (
//         !f.departure ||
//         !f.arrival ||
//         !f.passengers ||
//         !f.date ||
//         !f.time ||
//         !f.aircraft ||
//         !f.pricingPolicy
//       ) {
//         Alert.alert("Error", "Please fill all required fields!");
//         return;
//       }
//     }

//     try {
//       setLoading(true);
//       for (let f of flights) {
//         const body = {
//           departure_airport: f.departure.iata,
//           arrival_airport: f.arrival.iata,
//           aircraft: f.aircraft,
//           pax: f.passengers,
//           flight_date: f.date.toISOString().split("T")[0],
//           local_time: f.time.toTimeString().split(" ")[0],
//           pricing_policy: f.pricingPolicy,
//           avoid_countries: f.avoidCountries,
//           airway_time_weather_impacted: true,
//         };
//         const response = await fetch(CALC_URL, {
//           method: "POST",
//           headers,
//           body: JSON.stringify(body),
//         });
//         const data = await response.json();
//         console.log("Flight calculation result:", data);
//       }
//       Alert.alert("Success", "Check console for calculation results.");
//     } catch (e) {
//       console.log(e);
//       Alert.alert("Error", "Failed to calculate.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {flights.map((f, i) => (
//         <FlightRow
//           key={i}
//           index={i}
//           flight={f}
//           setFlight={(flight) => {
//             const updated = [...flights];
//             updated[i] = flight;
//             setFlights(updated);
//           }}
//           removeFlight={() => removeFlight(i)}
//         />
//       ))}

//       <TouchableOpacity style={styles.addFlightBtn} onPress={addFlight}>
//         <Text style={{ color: "blue" }}>+ Add Flight</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Calculate</Text>}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
//   flightRow: {
//     marginBottom: 25,
//     padding: 15,
//     borderWidth: 1,
//     borderRadius: 10,
//     borderColor: "#ccc",
//     backgroundColor: "#fff",
//   },
//   flightTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 10 },
//   label: { marginTop: 10, marginBottom: 5, fontWeight: "bold" },
//   input: {
//     padding: 12,
//     borderWidth: 1,
//     borderRadius: 8,
//     borderColor: "#ccc",
//     backgroundColor: "#fff",
//   },
//   removeFlightBtn: { marginTop: 10, alignItems: "flex-end" },
//   addFlightBtn: {
//     padding: 12,
//     borderRadius: 8,
//     borderColor: "#007bff",
//     borderWidth: 1,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   calculateBtn: {
//     backgroundColor: "#007bff",
//     marginTop: 20,
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
// });


// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import AirportSearchModal from "../../../compoent/AirportSearchModal";
 
// const CALC_URL = "https://api.aviapages.com/v3/flight_calculator/";
// const AIRCRAFT_URL = "https://api.aviapages.com/v3/aircraft/";
// const headers = {
//   "Content-Type": "application/json",
//   Authorization: "Token zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn",
// };

// // Flight Row Component
// const FlightRow = ({ index, flight, setFlight, removeFlight, aircraftOptions }) => {
//   const [showDepModal, setShowDepModal] = useState(false);
//   const [showArrModal, setShowArrModal] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);

//   return (
//     <View style={styles.flightRow}>
//       <Text style={styles.flightTitle}>Flight {index + 1}</Text>

//       {/* Departure */}
//       <Text style={styles.label}>Departure Airport *</Text>
//       <TouchableOpacity
//         style={styles.input}
//         onPress={() => setShowDepModal(true)}
//       >
//         <Text>
//           {flight.departure ? `${flight.departure.name} (${flight.departure.iata})` : "Select departure"}
//         </Text>
//       </TouchableOpacity>

//       {/* Arrival */}
//       <Text style={styles.label}>Arrival Airport *</Text>
//       <TouchableOpacity
//         style={styles.input}
//         onPress={() => setShowArrModal(true)}
//       >
//         <Text>
//           {flight.arrival ? `${flight.arrival.name} (${flight.arrival.iata})` : "Select arrival"}
//         </Text>
//       </TouchableOpacity>

//       {/* Passengers */}
//       <Text style={styles.label}>Passengers *</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Number of passengers"
//         keyboardType="numeric"
//         value={flight.passengers}
//         onChangeText={(t) => setFlight({ ...flight, passengers: t })}
//       />

//       {/* Date */}
//       <Text style={styles.label}>Date *</Text>
//       <TouchableOpacity
//         style={styles.input}
//         onPress={() => setShowDatePicker(true)}
//       >
//         <Text>{flight.date.toDateString()}</Text>
//       </TouchableOpacity>
//       {showDatePicker && (
//         <DateTimePicker
//           value={flight.date}
//           mode="date"
//           display="default"
//           onChange={(e, d) => {
//             setShowDatePicker(false);
//             if (d) setFlight({ ...flight, date: d });
//           }}
//         />
//       )}

//       {/* Time */}
//       <Text style={styles.label}>Local Time *</Text>
//       <TouchableOpacity
//         style={styles.input}
//         onPress={() => setShowTimePicker(true)}
//       >
//         <Text>{flight.time.toTimeString().split(" ")[0]}</Text>
//       </TouchableOpacity>
//       {showTimePicker && (
//         <DateTimePicker
//           value={flight.time}
//           mode="time"
//           display="default"
//           onChange={(e, t) => {
//             setShowTimePicker(false);
//             if (t) setFlight({ ...flight, time: t });
//           }}
//         />
//       )}

//       {/* Aircraft */}
//       <Text style={styles.label}>Aircraft *</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Type aircraft or select from API"
//         value={flight.aircraft}
//         onChangeText={(t) => setFlight({ ...flight, aircraft: t })}
//       />
//       {aircraftOptions.length > 0 && (
//         <ScrollView horizontal style={{ marginVertical: 5 }}>
//           {aircraftOptions.map((a) => (
//             <TouchableOpacity
//               key={a.id}
//               style={styles.aircraftOption}
//               onPress={() => setFlight({ ...flight, aircraft: a.name })}
//             >
//               <Text>{a.name}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       )}

//       {/* Pricing */}
//       <Text style={styles.label}>Pricing Policy *</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Pricing policy"
//         value={flight.pricingPolicy}
//         onChangeText={(t) => setFlight({ ...flight, pricingPolicy: t })}
//       />

//       {/* Avoid Countries */}
//       <Text style={styles.label}>Avoid countries/FIRs (optional)</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Separate by comma"
//         value={flight.avoidCountries.join(", ")}
//         onChangeText={(t) =>
//           setFlight({ ...flight, avoidCountries: t.split(",").map((c) => c.trim()) })
//         }
//       />

//       <TouchableOpacity
//         onPress={removeFlight}
//         style={styles.removeFlightBtn}
//       >
//         <Text style={{ color: "red" }}>Remove Flight</Text>
//       </TouchableOpacity>

//       {/* Airport Modals */}
//       <AirportSearchModal
//         visible={showDepModal}
//         onClose={() => setShowDepModal(false)}
//         onSelectAirport={(a) => setFlight({ ...flight, departure: a })}
//       />
//       <AirportSearchModal
//         visible={showArrModal}
//         onClose={() => setShowArrModal(false)}
//         onSelectAirport={(a) => setFlight({ ...flight, arrival: a })}
//       />
//     </View>
//   );
// };

// export default function FlightCalculator() {
//   const [flights, setFlights] = useState([
//     {
//       departure: null,
//       arrival: null,
//       passengers: "",
//       date: new Date(),
//       time: new Date(),
//       aircraft: "",
//       pricingPolicy: "",
//       avoidCountries: ["Israel"],
//     },
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [aircraftOptions, setAircraftOptions] = useState([]);

//   // Fetch aircraft from API
//   useEffect(() => {
//     const fetchAircraft = async () => {
//       try {
//         const res = await fetch(AIRCRAFT_URL, { headers });
//         const data = await res.json();
//         setAircraftOptions(data.aircraft || []);
//       } catch (e) {
//         console.log("Failed to fetch aircraft:", e);
//       }
//     };
//     fetchAircraft();
//   }, []);

//   const addFlight = () => {
//     setFlights([
//       ...flights,
//       {
//         departure: null,
//         arrival: null,
//         passengers: "",
//         date: new Date(),
//         time: new Date(),
//         aircraft: "",
//         pricingPolicy: "",
//         avoidCountries: ["Israel"],
//       },
//     ]);
//   };

//   const removeFlight = (index) => {
//     const updated = [...flights];
//     updated.splice(index, 1);
//     setFlights(updated);
//   };

//   const handleCalculate = async () => {
//     for (let f of flights) {
//       if (!f.departure || !f.arrival || !f.passengers || !f.date || !f.time || !f.aircraft || !f.pricingPolicy) {
//         Alert.alert("Error", "Please fill all required fields!");
//         return;
//       }
//     }

//     setLoading(true);
//     try {
//       for (let f of flights) {
//         const body = {
//           departure_airport: f.departure.iata,
//           arrival_airport: f.arrival.iata,
//           aircraft: f.aircraft,
//           pax: f.passengers,
//           flight_date: f.date.toISOString().split("T")[0],
//           local_time: f.time.toTimeString().split(" ")[0],
//           pricing_policy: f.pricingPolicy,
//           avoid_countries: f.avoidCountries,
//           airway_time_weather_impacted: true,
//         };
//         const res = await fetch(CALC_URL, { method: "POST", headers, body: JSON.stringify(body) });
//         const data = await res.json();
//         console.log("Flight calculation result:", data);
//       }
//       Alert.alert("Success", "Check console for calculation results.");
//     } catch (e) {
//       console.log(e);
//       Alert.alert("Error", "Calculation failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {flights.map((f, i) => (
//         <FlightRow
//           key={i}
//           index={i}
//           flight={f}
//           setFlight={(flight) => {
//             const updated = [...flights];
//             updated[i] = flight;
//             setFlights(updated);
//           }}
//           removeFlight={() => removeFlight(i)}
//           aircraftOptions={aircraftOptions}
//         />
//       ))}

//       <TouchableOpacity style={styles.addFlightBtn} onPress={addFlight}>
//         <Text style={{ color: "blue" }}>+ Add Flight</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Calculate</Text>}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
//   flightRow: { marginBottom: 25, padding: 15, borderWidth: 1, borderRadius: 10, borderColor: "#ccc", backgroundColor: "#fff" },
//   flightTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 10 },
//   label: { marginTop: 10, marginBottom: 5, fontWeight: "bold" },
//   input: { padding: 12, borderWidth: 1, borderRadius: 8, borderColor: "#ccc", backgroundColor: "#fff" },
//   removeFlightBtn: { marginTop: 10, alignItems: "flex-end" },
//   addFlightBtn: { padding: 12, borderRadius: 8, borderColor: "#007bff", borderWidth: 1, alignItems: "center", marginBottom: 20 },
//   calculateBtn: { backgroundColor: "#007bff", marginTop: 20, padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 30 },
//   btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//   aircraftOption: { padding: 8, borderWidth: 1, borderColor: "#007bff", borderRadius: 5, marginRight: 5 },
// });

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import AirportSearchModal from "../../../compoent/AirportSearchModal";
 
// const CALC_URL = "https://api.aviapages.com/v3/flight_calculator/";
// const AIRCRAFT_URL = "https://api.aviapages.com/v3/aircraft/";
// const headers = {
//   "Content-Type": "application/json",
//   Authorization: "Token zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn",
// };

// // Flight Row Component
// const FlightRow = ({ index, flight, setFlight, removeFlight, aircraftOptions }) => {
//   const [showDepModal, setShowDepModal] = useState(false);
//   const [showArrModal, setShowArrModal] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);

//   return (
//     <View style={styles.flightRow}>
//       <Text style={styles.flightTitle}>Flight {index + 1}</Text>

//       {/* Departure Airport */}
//       <Text style={styles.label}>Departure Airport *</Text>
//       <TouchableOpacity
//         style={styles.input}
//         onPress={() => setShowDepModal(true)}
//       >
//         <Text>
//           {flight.departure ? `${flight.departure.name} (${flight.departure.iata})` : "Select departure"}
//         </Text>
//       </TouchableOpacity>

//       {/* Arrival Airport */}
//       <Text style={styles.label}>Arrival Airport *</Text>
//       <TouchableOpacity
//         style={styles.input}
//         onPress={() => setShowArrModal(true)}
//       >
//         <Text>
//           {flight.arrival ? `${flight.arrival.name} (${flight.arrival.iata})` : "Select arrival"}
//         </Text>
//       </TouchableOpacity>

//       {/* Passengers */}
//       <Text style={styles.label}>Passengers *</Text>
//       <TextInput
//         style={styles.input}
//         keyboardType="numeric"
//         placeholder="Number of passengers"
//         value={flight.passengers}
//         onChangeText={(t) => setFlight({ ...flight, passengers: t })}
//       />

//       {/* Date */}
//       <Text style={styles.label}>Date *</Text>
//       <TouchableOpacity
//         style={styles.input}
//         onPress={() => setShowDatePicker(true)}
//       >
//         <Text>{flight.date.toDateString()}</Text>
//       </TouchableOpacity>
//       {showDatePicker && (
//         <DateTimePicker
//           value={flight.date}
//           mode="date"
//           display="default"
//           onChange={(e, d) => {
//             setShowDatePicker(false);
//             if (d) setFlight({ ...flight, date: d });
//           }}
//         />
//       )}

//       {/* Local Time */}
//       <Text style={styles.label}>Local Time *</Text>
//       <TouchableOpacity
//         style={styles.input}
//         onPress={() => setShowTimePicker(true)}
//       >
//         <Text>{flight.time.toTimeString().split(" ")[0]}</Text>
//       </TouchableOpacity>
//       {showTimePicker && (
//         <DateTimePicker
//           value={flight.time}
//           mode="time"
//           display="default"
//           onChange={(e, t) => {
//             setShowTimePicker(false);
//             if (t) setFlight({ ...flight, time: t });
//           }}
//         />
//       )}

//       {/* Aircraft */}
//       <Text style={styles.label}>Aircraft *</Text>
//       <ScrollView horizontal style={{ marginVertical: 5 }}>
//         {aircraftOptions.map((a) => (
//           <TouchableOpacity
//             key={a.id}
//             style={[
//               styles.aircraftOption,
//               flight.aircraft === a.name && { backgroundColor: "#007bff" },
//             ]}
//             onPress={() => setFlight({ ...flight, aircraft: a.name })}
//           >
//             <Text style={{ color: flight.company_name === a.name ? "#fff" : "#000" }}>{a.company_name}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* Pricing Policy */}
//       <Text style={styles.label}>Pricing Policy *</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Pricing policy"
//         value={flight.pricingPolicy}
//         onChangeText={(t) => setFlight({ ...flight, pricingPolicy: t })}
//       />

//       {/* Avoid Countries */}
//       <Text style={styles.label}>Avoid countries/FIRs (optional)</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Separate by comma"
//         value={flight.avoidCountries.join(", ")}
//         onChangeText={(t) =>
//           setFlight({ ...flight, avoidCountries: t.split(",").map((c) => c.trim()) })
//         }
//       />

//       <TouchableOpacity
//         onPress={removeFlight}
//         style={styles.removeFlightBtn}
//       >
//         <Text style={{ color: "red" }}>Remove Flight</Text>
//       </TouchableOpacity>

//       {/* Airport Modals */}
//       <AirportSearchModal
//         visible={showDepModal}
//         onClose={() => setShowDepModal(false)}
//         onSelectAirport={(a) => setFlight({ ...flight, departure: a })}
//       />
//       <AirportSearchModal
//         visible={showArrModal}
//         onClose={() => setShowArrModal(false)}
//         onSelectAirport={(a) => setFlight({ ...flight, arrival: a })}
//       />
//     </View>
//   );
// };

// // Main Component
// export default function FlightCalculator() {
//   const [flights, setFlights] = useState([
//     {
//       departure: null,
//       arrival: null,
//       passengers: "",
//       date: new Date(),
//       time: new Date(),
//       aircraft: "",
//       pricingPolicy: "",
//       avoidCountries: ["Israel"],
//     },
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [aircraftOptions, setAircraftOptions] = useState([]);

//   // Fetch aircraft from API
//   useEffect(() => {
//     const fetchAircraft = async () => {
//       try {
//         const res = await fetch(AIRCRAFT_URL, { headers });
//         const data = await res.json();
//                 console.log("data.aircraft",data)

//         setAircraftOptions(data.results || []);
//       } catch (e) {
//         console.log("Failed to fetch aircraft:", e);
//         Alert.alert("Error", "Failed to load aircraft options");
//       }
//     };
//     fetchAircraft();
//   }, []);

//   const addFlight = () => {
//     setFlights([
//       ...flights,
//       {
//         departure: null,
//         arrival: null,
//         passengers: "",
//         date: new Date(),
//         time: new Date(),
//         aircraft: "",
//         pricingPolicy: "",
//         avoidCountries: ["Israel"],
//       },
//     ]);
//   };

//   const removeFlight = (index) => {
//     const updated = [...flights];
//     updated.splice(index, 1);
//     setFlights(updated);
//   };

//   const handleCalculate = async () => {
//     for (let f of flights) {
//       if (!f.departure || !f.arrival || !f.passengers || !f.date || !f.time || !f.aircraft || !f.pricingPolicy) {
//         Alert.alert("Error", "Please fill all required fields!");
//         return;
//       }
//       // Validate aircraft against API list
//       if (!aircraftOptions.some((a) => a.name === f.aircraft)) {
//         Alert.alert("Invalid Aircraft", `Please select a valid aircraft for Flight ${flights.indexOf(f)+1}`);
//         return;
//       }
//     }

//     setLoading(true);
//     try {
//       for (let f of flights) {
//         const body = {
//           departure_airport: f.departure.iata,
//           arrival_airport: f.arrival.iata,
//           aircraft: f.aircraft,
//           pax: f.passengers,
//           flight_date: f.date.toISOString().split("T")[0],
//           local_time: f.time.toTimeString().split(" ")[0],
//           pricing_policy: f.pricingPolicy,
//           avoid_countries: f.avoidCountries,
//           airway_time_weather_impacted: true,
//         };
//         const res = await fetch(CALC_URL, { method: "POST", headers, body: JSON.stringify(body) });
//         const data = await res.json();
//         console.log("Flight calculation result:", data);
//       }
//       Alert.alert("Success", "Check console for calculation results.");
//     } catch (e) {
//       console.log(e);
//       Alert.alert("Error", "Calculation failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {flights.map((f, i) => (
//         <FlightRow
//           key={i}
//           index={i}
//           flight={f}
//           setFlight={(flight) => {
//             const updated = [...flights];
//             updated[i] = flight;
//             setFlights(updated);
//           }}
//           removeFlight={() => removeFlight(i)}
//           aircraftOptions={aircraftOptions}
//         />
//       ))}

//       <TouchableOpacity style={styles.addFlightBtn} onPress={addFlight}>
//         <Text style={{ color: "blue" }}>+ Add Flight</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Calculate</Text>}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
//   flightRow: { marginBottom: 25, padding: 15, borderWidth: 1, borderRadius: 10, borderColor: "#ccc", backgroundColor: "#fff" },
//   flightTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 10 },
//   label: { marginTop: 10, marginBottom: 5, fontWeight: "bold" },
//   input: { padding: 12, borderWidth: 1, borderRadius: 8, borderColor: "#ccc", backgroundColor: "#fff" },
//   removeFlightBtn: { marginTop: 10, alignItems: "flex-end" },
//   addFlightBtn: { padding: 12, borderRadius: 8, borderColor: "#007bff", borderWidth: 1, alignItems: "center", marginBottom: 20 },
//   calculateBtn: { backgroundColor: "#007bff", marginTop: 20, padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 30 },
//   btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//   aircraftOption: { padding: 8, borderWidth: 1, borderColor: "#007bff", borderRadius: 5, marginRight: 5 },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
 import AirportSearchModal from "../../../compoent/AirportSearchModal";
import CustomDropdown from "../../../compoent/CustomDropdown";

  const CALC_URL = "https://api.aviapages.com/v3/flight_calculator/";
  const AIRCRAFT_URL = "https://api.aviapages.com/v3/aircraft/";
const headers = {
  "Content-Type": "application/json",
  Authorization: "Token zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn",
};

// ------------------------ Flight Row Component ------------------------
const FlightRow = ({ index, flight, setFlight, removeFlight, aircraftOptions }) => {
  const [showDepModal, setShowDepModal] = useState(false);
  const [showArrModal, setShowArrModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <View style={styles.flightRow}>
      <Text style={styles.flightTitle}>Flight {index + 1}</Text>

      {/* Departure Airport */}
      <Text style={styles.label}>Departure Airport *</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDepModal(true)}
      >
        <Text>
          {flight.departure ? `${flight.departure.name} (${flight.departure.iata})` : "Select departure"}
        </Text>
      </TouchableOpacity>

      {/* Arrival Airport */}
      <Text style={styles.label}>Arrival Airport *</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowArrModal(true)}
      >
        <Text>
          {flight.arrival ? `${flight.arrival.name} (${flight.arrival.iata})` : "Select arrival"}
        </Text>
      </TouchableOpacity>

      {/* Passengers */}
      <Text style={styles.label}>Passengers *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Number of passengers"
        value={flight.passengers}
        onChangeText={(t) => setFlight({ ...flight, passengers: t })}
      />

      {/* Date */}
      <Text style={styles.label}>Date *</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{flight.date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={flight.date}
          mode="date"
          display="default"
          onChange={(e, d) => {
            setShowDatePicker(false);
            if (d) setFlight({ ...flight, date: d });
          }}
        />
      )}

      {/* Time */}
      <Text style={styles.label}>Local Time *</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowTimePicker(true)}
      >
        <Text>{flight.time.toTimeString().split(" ")[0]}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={flight.time}
          mode="time"
          display="default"
          onChange={(e, t) => {
            setShowTimePicker(false);
            if (t) setFlight({ ...flight, time: t });
          }}
        />
      )}

      {/* Aircraft Dropdown */}
      <Text style={styles.label}>Aircraft *</Text>
          <CustomDropdown
        label="Aircraft"
        options={aircraftOptions}
        selectedValue={flight.aircraft}
        onSelect={(item) => setFlight({ ...flight, aircraft: item })}
      />
        {/* <Picker
          selectedValue={flight.aircraft}
          onValueChange={(itemValue) =>
            setFlight({ ...flight, aircraft: itemValue })
          }
        >
          <Picker.Item label="Select aircraft" value="" />
          {aircraftOptions.map((a) => (
            <Picker.Item key={a.id} label={a.company_name} value={a.name} />
          ))}
        </Picker> */}
 

      {/* Pricing Policy */}
      <Text style={styles.label}>Pricing Policy *</Text>
      <TextInput
        style={styles.input}
        placeholder="Pricing policy"
        value={flight.pricingPolicy}
        onChangeText={(t) => setFlight({ ...flight, pricingPolicy: t })}
      />

      {/* Avoid Countries */}
      <Text style={styles.label}>Avoid countries/FIRs (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Separate by comma"
        value={flight.avoidCountries.join(", ")}
        onChangeText={(t) =>
          setFlight({ ...flight, avoidCountries: t.split(",").map((c) => c.trim()) })
        }
      />

      {/* Remove Flight */}
      <TouchableOpacity
        onPress={removeFlight}
        style={styles.removeFlightBtn}
      >
        <Text style={{ color: "red" }}>Remove Flight</Text>
      </TouchableOpacity>

      {/* Airport Modals */}
      <AirportSearchModal
        visible={showDepModal}
        onClose={() => setShowDepModal(false)}
        onSelectAirport={(a) => setFlight({ ...flight, departure: a })}
      />
      <AirportSearchModal
        visible={showArrModal}
        onClose={() => setShowArrModal(false)}
        onSelectAirport={(a) => setFlight({ ...flight, arrival: a })}
      />
    </View>
  );
};

// ------------------------ Main Flight Calculator ------------------------
export default function FlightCalculator() {
  const [flights, setFlights] = useState([
    {
      departure: null,
      arrival: null,
      passengers: "",
      date: new Date(),
      time: new Date(),
      aircraft: "Airbs A220-300",
      pricingPolicy: "General",
      avoidCountries: ["Israel"],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [aircraftOptions, setAircraftOptions] = useState([]);

  // Fetch aircraft from API
  useEffect(() => {
    const fetchAircraft = async () => {
      try {
        const res = await fetch(AIRCRAFT_URL, { headers });
        const data = await res.json();
        console.log("Aircraft API:", data);
        setAircraftOptions(data.results || []);
      } catch (e) {
        console.log("Failed to fetch aircraft:", e);
        Alert.alert("Error", "Failed to load aircraft options");
      }
    };
    fetchAircraft();
  }, []);

  // Add Flight
  const addFlight = () => {
    setFlights([
      ...flights,
      {
        departure: null,
        arrival: null,
        passengers: "",
        date: new Date(),
        time: new Date(),
        aircraft: "",
        pricingPolicy: "",
        avoidCountries: ["Israel"],
      },
    ]);
  };

  // Remove Flight
  const removeFlight = (index) => {
    const updated = [...flights];
    updated.splice(index, 1);
    setFlights(updated);
  };

  // Calculate Flights
  const handleCalculate = async () => {
    // for (let f of flights) {
    //   if (!f.departure || !f.arrival || !f.passengers || !f.date || !f.time || !f.aircraft || !f.pricingPolicy) {
    //     Alert.alert("Error", "Please fill all required fields!");
    //     return;
    //   }
    //   if (!aircraftOptions.some((a) => a.name === f.aircraft)) {
    //     Alert.alert("Invalid Aircraft", `Please select a valid aircraft for Flight ${flights.indexOf(f)+1}`);
    //     return;
    //   }
    // }

    setLoading(true);
    try {
      for (let f of flights) {
        const body = {
          departure_airport: f.departure.iata,
          arrival_airport: f.arrival.iata,
          aircraft: f.aircraft,
          pax: f.passengers,
          flight_date: f.date.toISOString().split("T")[0],
          local_time: f.time.toTimeString().split(" ")[0],
          pricing_policy: f.pricingPolicy,
          avoid_countries: f.avoidCountries,
          airway_time_weather_impacted: true,
        };
        console.log("body",body)
        const res = await fetch(CALC_URL, { method: "POST", headers, body: JSON.stringify(body) });
        const data = await res.json();
        console.log(`Flight ${flights.indexOf(f)+1} result:`, data);
      }
      Alert.alert("Success", "Check console for calculation results.");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Calculation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {flights.map((f, i) => (
        <FlightRow
          key={i}
          index={i}
          flight={f}
          setFlight={(flight) => {
            const updated = [...flights];
            updated[i] = flight;
            setFlights(updated);
          }}
          removeFlight={() => removeFlight(i)}
          aircraftOptions={aircraftOptions}
        />
      ))}

      <TouchableOpacity style={styles.addFlightBtn} onPress={addFlight}>
        <Text style={{ color: "blue" }}>+ Add Flight</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Calculate</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

// ------------------------ Styles ------------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  flightRow: { marginBottom: 25, padding: 15, borderWidth: 1, borderRadius: 10, borderColor: "#ccc", backgroundColor: "#fff" },
  flightTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 10 },
  label: { marginTop: 10, marginBottom: 5, fontWeight: "bold" },
  input: { padding: 12, borderWidth: 1, borderRadius: 8, borderColor: "#ccc", backgroundColor: "#fff" },
  removeFlightBtn: { marginTop: 10, alignItems: "flex-end" },
  addFlightBtn: { padding: 12, borderRadius: 8, borderColor: "#007bff", borderWidth: 1, alignItems: "center", marginBottom: 20 },
  calculateBtn: { backgroundColor: "#007bff", marginTop: 20, padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 30 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  dropdown: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, backgroundColor: "#fff", marginVertical: 5 },
});