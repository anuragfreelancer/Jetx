import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
  ActivityIndicator,
  Animated,
  SafeAreaView
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AviapagesFlightService from './AviapagesFlightService';

const { width, height } = Dimensions.get('window');
const SERVICE_FEE_PERCENTAGE = 10;

const CharterDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { charter,bagImage, tripType, searchParams } = route.params || {};
  
  const [charterDetails, setCharterDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState(1);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  
  console.log('🚀 Charter Details Screen Received Data:', {
    charter: charter,
    charterId: charter?.aircraftInfo?.id || charter?.id,
    tripType: tripType,
    searchParams: searchParams
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [100, 70],
    extrapolate: 'clamp'
  });

  useEffect(() => {
    loadCharterDetails();
    
    // Auto slide images if available
    if (charterDetails?.aircraftInfo?.images?.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (selectedImageIndex + 1) % charterDetails.aircraftInfo.images.length;
        setSelectedImageIndex(nextIndex);
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [selectedImageIndex, charterDetails]);

  const loadCharterDetails = async () => {
    try {
      setLoading(true);
       
      // Check what data we have
      if (charter) {
        console.log('📊 Charter data available:', {
          id: charter.id,
          aircraftId: charter.aircraftInfo?.id,
          name: charter.aircraftInfo?.name,
          price: charter.price?.total
        });
      }
      
      // If we have aircraftInfo with id, fetch detailed information
      if (charter?.aircraftInfo?.id) {
      setLoading(false);

         const details = await AviapagesFlightService.getCharterDetails(charter.aircraftInfo.id);
         setCharterDetails({
          ...charter,
          aircraftInfo: {
            ...charter.aircraftInfo,
            ...details, // Merge fetched details
            images: details?.images || charter.aircraftInfo?.images  
          }
        });
      } 
      // If we have direct aircraft id
      else if (charter?.id) {
         const details = await AviapagesFlightService.getCharterDetails(charter.id);
         setCharterDetails(details);
      }
      // If we have basic charter data
      else if (charter) {
         const enhancedCharter = {
          ...charter,
          aircraftInfo: {
            ...charter.aircraftInfo,
            images: charter.aircraftInfo?.images  ,
            // Ensure all required fields exist
            manufacturer: charter.aircraftInfo?.manufacturer || 'Private',
            model: charter.aircraftInfo?.model || 'Jet',
            seats: charter.aircraftInfo?.seats || 8,
            speed: charter.aircraftInfo?.speed || '800 km/h',
            range: charter.aircraftInfo?.range || '4,000 km',
            category: charter.aircraftInfo?.category || 'Luxury Jet',
            features: charter.aircraftInfo?.features || ['WiFi', 'Entertainment', 'Luxury Seating', 'Refreshments']
          }
        };
        setCharterDetails(enhancedCharter);
      } else {
         Alert.alert(
          'Error',
          'No charter information available.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
       // Fallback to mock data
      const mockData = {
        ...charter,
        aircraftInfo: {
          ...charter?.aircraftInfo,
          images: charter.aircraftInfo?.images,
          manufacturer: charter?.aircraftInfo?.manufacturer || 'Gulfstream',
          model: charter?.aircraftInfo?.model || 'G650',
          seats: charter?.aircraftInfo?.seats || 12,
          speed: charter?.aircraftInfo?.speed || '956 km/h',
          range: charter?.aircraftInfo?.range || '12,000 km',
          category: charter?.aircraftInfo?.category || 'Heavy Jet',
          features: charter?.aircraftInfo?.features || ['WiFi', 'Entertainment', 'Luxury Seating', 'Refreshments', 'Conference Table', 'Private Suite']
        }
      };
      setCharterDetails(mockData);
    } finally {
      setLoading(false);
    }
  };

 

  const handleBookNow = () => {
    if (!charterDetails) {
      Alert.alert('Error', 'Charter details not available');
      return;
    }
    
    const bookingData = {
      charter: charterDetails,
      selectedSeats,
      pricing: calculateFinalPrice(),
      tripType: tripType,
      searchParams: searchParams,
      timestamp: new Date().toISOString()
    };
    
    // console.log('📤 Booking Data:', bookingData);
    navigation.navigate('BookingFormScreen', bookingData);
  };

  const calculateFinalPrice = () => {
    if (!charterDetails) {
      return {
        baseFare: 5000,
        serviceFee: 500,
        total: 5500,
        currency: 'USD'
      };
    }
    
    const basePrice = charterDetails?.pricing?.baseFare || 
                     charterDetails?.price?.total || 
                     (charterDetails?.aircraftInfo?.hourlyRate ? 
                      charterDetails.aircraftInfo.hourlyRate * 2 : 5000);
    
    const serviceFee = Math.round((basePrice * SERVICE_FEE_PERCENTAGE) / 100);
    const total = basePrice + serviceFee;
    
    return {
      baseFare: basePrice,
      serviceFee: serviceFee,
      total: total,
      currency: charterDetails?.price?.currency || 'USD'
    };
  };

  const handleImageScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setSelectedImageIndex(index);
  };

  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageSlideItem}>
      <Image
        source={{ uri: item }}
        style={styles.imageSlide}
        resizeMode="cover"
       />
     </View>
  );

  const renderThumbnailItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.thumbnailContainer,
        index === selectedImageIndex && styles.selectedThumbnail
      ]}
      onPress={() => {
        setSelectedImageIndex(index);
        flatListRef.current?.scrollToIndex({
          index: index,
          animated: true
        });
      }}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item }}
        style={styles.thumbnail}
        resizeMode="cover"
       />
      {index === selectedImageIndex && (
        <View style={styles.selectedThumbnailOverlay} />
      )}
    </TouchableOpacity>
  );

  const increaseSeats = () => {
    const maxSeats = charterDetails?.aircraftInfo?.seats || 8;
    if (selectedSeats < maxSeats) {
      setSelectedSeats(prev => prev + 1);
    } else {
      Alert.alert('Maximum Seats', `Maximum ${maxSeats} seats available for this aircraft.`);
    }
  };

  const decreaseSeats = () => {
    if (selectedSeats > 1) {
      setSelectedSeats(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Loading Charter Details</Text>
        <Text style={styles.loadingSubtext}>Preparing your luxury experience</Text>
      </View>
    );
  }

  if (!charterDetails) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={60} color="#DC2626" />
        <Text style={styles.errorText}>Unable to load charter details</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadCharterDetails}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pricing = calculateFinalPrice();
  const aircraftInfo = charterDetails?.aircraftInfo || {};
  const images = bagImage  ;
  // const images = aircraftInfo.images  ;
  const maxSeats = aircraftInfo.seats || 8;

  console.log('🎯 Displaying Aircraft Info:', {
    manufacturer: aircraftInfo.manufacturer,
    model: aircraftInfo.model,
    seats: aircraftInfo.seats,
    price: pricing.total,
    images: images.length
  });

  return (
    <View style={styles.safeArea}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Animated.Text 
          style={[styles.headerTitle, { opacity: scrollY.interpolate({
            inputRange: [0, 200],
            outputRange: [0, 1]
          })}]}
          numberOfLines={1}
        >
          {aircraftInfo.model || 'Charter Details'}
        </Animated.Text>
        
      </Animated.View>

      <Animated.ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Image Slider */}
        <View style={styles.imageSliderContainer}>
          <Animated.FlatList
            ref={flatListRef}
            data={images}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => `image-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
            style={styles.imageSlider}
            initialScrollIndex={0}
          />
          
          {/* Image Counter */}
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {selectedImageIndex + 1} / {images.length}
            </Text>
          </View>
          
 
          {images.length > 1 && (
            <>
              <TouchableOpacity 
                style={[styles.navArrow, styles.prevArrow]}
                onPress={() => {
                  const prevIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1;
                  setSelectedImageIndex(prevIndex);
                  flatListRef.current?.scrollToIndex({
                    index: prevIndex,
                    animated: true
                  });
                }}
              >
                <Icon name="chevron-left" size={28} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.navArrow, styles.nextArrow]}
                onPress={() => {
                  const nextIndex = selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0;
                  setSelectedImageIndex(nextIndex);
                  flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true
                  });
                }}
              >
                <Icon name="chevron-right" size={28} color="#FFF" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <View style={styles.thumbnailStrip}>
            <FlatList
              data={images}
              renderItem={renderThumbnailItem}
              keyExtractor={(item, index) => `thumb-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailList}
              contentContainerStyle={styles.thumbnailListContent}
            />
          </View>
        )}

        {/* Charter Details */}
        <View style={styles.contentContainer}>
 
          {/* Seats Selection */}
          <View style={styles.selectionContainer}>
            <Text style={styles.sectionTitle}>Select Number of Passengers</Text>
            <Text style={styles.seatsNote}>You are booking the entire aircraft</Text>
            <View style={styles.seatsSelector}>
              <TouchableOpacity 
                style={[styles.seatButton, selectedSeats <= 1 && styles.seatButtonDisabled]}
                onPress={decreaseSeats}
                disabled={selectedSeats <= 1}
              >
                <Icon name="remove" size={24} color={selectedSeats <= 1 ? "#CBD5E1" : "#DC2626"} />
              </TouchableOpacity>
              
              <View style={styles.seatsDisplay}>
                <Text style={styles.seatsCount}>{selectedSeats}</Text>
                <Text style={styles.seatsLabel}>Passengers</Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.seatButton, selectedSeats >= maxSeats && styles.seatButtonDisabled]}
                onPress={increaseSeats}
                disabled={selectedSeats >= maxSeats}
              >
                <Icon name="add" size={24} color={selectedSeats >= maxSeats ? "#CBD5E1" : "#DC2626"} />
              </TouchableOpacity>
            </View>
            <Text style={styles.availableSeats}>
              Maximum {maxSeats} passengers • Entire Aircraft
            </Text>
          </View>

           <View style={styles.priceCard}>
            <View style={styles.priceHeader}>
              <Text style={styles.priceTitle}>Flight Summary</Text>
              <View style={styles.priceTag}>
                <Text style={styles.totalPrice}>${pricing.total.toLocaleString()}</Text>
                <Text style={styles.priceDuration}>Total • All Inclusive</Text>
              </View>
            </View>
            
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.priceLabel}>Whole Aircraft Charter</Text>
                  <Text style={styles.priceSubLabel}>Complete aircraft booking</Text>
                </View>
                <Text style={styles.priceValue}>${pricing.baseFare.toLocaleString()}</Text>
              </View>
              
              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.priceLabel}>Service Fee ({SERVICE_FEE_PERCENTAGE}%)</Text>
                  <Text style={styles.priceSubLabel}>Booking & handling fee</Text>
                </View>
                <Text style={styles.priceValue}>${pricing.serviceFee.toLocaleString()}</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.priceRow}>
                <Text style={styles.totalLabel}>Total Amount  
                  <Text  
                  style={styles.totalValue}
                  > ${pricing.total.toLocaleString()}</Text>
                </Text>
              
              </View>
                
            </View>
            
            <View style={styles.paymentNote}>
              <Icon name="verified" size={16} color="#10B981" />
              <Text style={styles.noteText}>
                All-inclusive price. No hidden fees.
              </Text>
            </View>
          </View>

          {/* Book Button */}
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookNow}
           >
            <View style={styles.bookButtonContent}>
              <Text style={styles.bookButtonText}>Book This Charter</Text>
              <View style={styles.bookButtonRight}>
                <Text style={styles.bookButtonPrice}>${pricing.total.toLocaleString()}</Text>
                <Icon name="arrow-forward" size={20} color="#FFF" />
              </View>
            </View>
           
          </TouchableOpacity>

          {/* Additional Info */}
          <View style={styles.infoCard}>
            <Icon name="info" size={20} color="#DC2626" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              You are booking the entire aircraft. All amenities, catering, and ground transportation included.
              Price includes {SERVICE_FEE_PERCENTAGE}% service fee. For custom requests, contact our concierge after booking.
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

 

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  retryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 15,
    padding: 12,
  },
  backText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  // Image Slider
  imageSliderContainer: {
    height: height * 0.45,
    position: 'relative',
  },
  imageSlider: {
    flex: 1,
  },
  imageSlideItem: {
    width: width,
    height: '100%',
    position: 'relative',
  },
  imageSlide: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  imageCounter: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  imageCounterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  imageInfoOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  aircraftType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: 2,
    marginBottom: 4,
  },
  aircraftName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#FFF',
    marginLeft: 6,
    fontWeight: '500',
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 38, 38, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  prevArrow: {
    left: 15,
  },
  nextArrow: {
    right: 15,
  },
  // Thumbnail Strip
  thumbnailStrip: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  thumbnailList: {
    paddingHorizontal: 10,
  },
  thumbnailListContent: {
    paddingHorizontal: 5,
  },
  thumbnailContainer: {
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#DC2626',
  },
  selectedThumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  thumbnail: {
    width: 80,
    height: 60,
  },
  // Content Container
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  // Specifications
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  specCard: {
    alignItems: 'center',
    width: '23%',
    marginBottom: 10,
  },
  specIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  specLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  // Seats Selection
  selectionContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  seatsNote: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  seatsSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  seatButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  seatButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },
  seatsDisplay: {
    alignItems: 'center',
  },
  seatsCount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#DC2626',
  },
  seatsLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  availableSeats: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Features
  featuresContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 15,
  },
  featureText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Price Card
  priceCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  priceHeader: {
    backgroundColor: '#DC2626',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  priceTag: {
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  priceDuration: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  priceBreakdown: {
    padding: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  priceSubLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  totalContainer: {
    marginTop:20 ,
    marginLeft:22
   },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#DC2626',
  },
  entireAircraftNote: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  paymentNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  noteText: {
    fontSize: 14,
    color: '#DC2626',
    marginLeft: 8,
    fontWeight: '500',
  },
  // Book Button
  bookButton: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  bookButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
  },
  bookButtonRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookButtonPrice: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    marginRight: 12,
  },
  bookButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Info Card
  infoCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 20,
  },
});

export default CharterDetailsScreen;