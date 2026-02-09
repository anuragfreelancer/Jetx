import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AviapagesFlightService from './AviapagesFlightService';

const { width, height } = Dimensions.get('window');
const SERVICE_FEE_PERCENTAGE = 10;

const CharterDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { charter, bagImage, tripType, searchParams } = route.params || {};

  const [charterDetails, setCharterDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState(1);

  const flatListRef = useRef(null);
  const autoplayRef = useRef(null);

  const loadCharterDetails = useCallback(async () => {
    try {
      setLoading(true);

      if (!charter) {
        Alert.alert('Error', 'No charter information available.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
        return;
      }

      // 1) Best case: aircraftInfo.id exists => fetch full aircraft details and merge
      if (charter?.aircraftInfo?.id) {
        const details = await AviapagesFlightService.getCharterDetails(charter.aircraftInfo.id);

        setCharterDetails({
          ...charter,
          aircraftInfo: {
            ...charter.aircraftInfo,
            ...details,
            images: details?.images || charter.aircraftInfo?.images || [],
          },
        });
        return;
      }

      // 2) Fallback: charter.id exists => try fetch details
      if (charter?.id) {
        const details = await AviapagesFlightService.getCharterDetails(charter.id);
        setCharterDetails(details || charter);
        return;
      }

      // 3) Basic charter only => enhance defaults
      setCharterDetails({
        ...charter,
        aircraftInfo: {
          ...charter.aircraftInfo,
          images: charter.aircraftInfo?.images || [],
          manufacturer: charter.aircraftInfo?.manufacturer || 'Private',
          model: charter.aircraftInfo?.model || 'Jet',
          seats: charter.aircraftInfo?.seats || 8,
          speed: charter.aircraftInfo?.speed || '800 km/h',
          range: charter.aircraftInfo?.range || '4,000 km',
          category: charter.aircraftInfo?.category || 'Luxury Jet',
          features:
            charter.aircraftInfo?.features || [
              'WiFi',
              'Entertainment',
              'Luxury Seating',
              'Refreshments',
            ],
        },
      });
    } catch (error) {
      // final fallback
      setCharterDetails({
        ...charter,
        aircraftInfo: {
          ...charter?.aircraftInfo,
          images: charter?.aircraftInfo?.images || [],
          manufacturer: charter?.aircraftInfo?.manufacturer || 'Gulfstream',
          model: charter?.aircraftInfo?.model || 'G650',
          seats: charter?.aircraftInfo?.seats || 12,
          speed: charter?.aircraftInfo?.speed || '956 km/h',
          range: charter?.aircraftInfo?.range || '12,000 km',
          category: charter?.aircraftInfo?.category || 'Heavy Jet',
          features:
            charter?.aircraftInfo?.features || [
              'WiFi',
              'Entertainment',
              'Luxury Seating',
              'Refreshments',
              'Conference Table',
              'Private Suite',
            ],
        },
      });
    } finally {
      setLoading(false);
    }
  }, [charter, navigation]);

  useEffect(() => {
    loadCharterDetails();
  }, [loadCharterDetails]);

  const aircraftInfo = charterDetails?.aircraftInfo || {};

  // Images priority: bagImage -> aircraftInfo.images -> []
  const images = useMemo(() => {
    const arr = Array.isArray(bagImage) && bagImage.length ? bagImage : aircraftInfo?.images || [];
    return arr.filter(Boolean);
  }, [bagImage, aircraftInfo?.images]);

  // Auto-slide (only when images > 1)
  useEffect(() => {
    if (!images?.length || images.length <= 1) return;

    if (autoplayRef.current) clearInterval(autoplayRef.current);

    autoplayRef.current = setInterval(() => {
      setSelectedImageIndex((prev) => {
        const next = (prev + 1) % images.length;
        flatListRef.current?.scrollToIndex?.({ index: next, animated: true });
        return next;
      });
    }, 4500);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [images]);

  const maxSeats = aircraftInfo?.seats || 8;

  const calculateFinalPrice = useCallback(() => {
    if (!charterDetails) {
      return { baseFare: 5000, serviceFee: 500, total: 5500, currency: 'USD' };
    }

    const basePrice =
      charterDetails?.pricing?.baseFare ||
      charterDetails?.price?.total ||
      (charterDetails?.aircraftInfo?.hourlyRate ? charterDetails.aircraftInfo.hourlyRate * 2 : 5000);

    const serviceFee = Math.round((basePrice * SERVICE_FEE_PERCENTAGE) / 100);
    const total = basePrice + serviceFee;

    return {
      baseFare: basePrice,
      serviceFee,
      total,
      currency: charterDetails?.price?.currency || 'USD',
    };
  }, [charterDetails]);

  const pricing = calculateFinalPrice();

  const handleImageScroll = useCallback((event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setSelectedImageIndex(index);
  }, []);

  const goToIndex = useCallback(
    (idx) => {
      if (!images?.length) return;
      const safeIndex = Math.max(0, Math.min(idx, images.length - 1));
      setSelectedImageIndex(safeIndex);
      flatListRef.current?.scrollToIndex?.({ index: safeIndex, animated: true });
    },
    [images]
  );

  const increaseSeats = useCallback(() => {
    if (selectedSeats < maxSeats) setSelectedSeats((p) => p + 1);
    else Alert.alert('Maximum Seats', `Maximum ${maxSeats} seats available for this aircraft.`);
  }, [selectedSeats, maxSeats]);

  const decreaseSeats = useCallback(() => {
    if (selectedSeats > 1) setSelectedSeats((p) => p - 1);
  }, [selectedSeats]);

  const handleBookNow = useCallback(() => {
    if (!charterDetails) {
      Alert.alert('Error', 'Charter details not available');
      return;
    }

    const bookingData = {
      charter: charterDetails,
      selectedSeats,
      pricing,
      tripType,
      searchParams,
      timestamp: new Date().toISOString(),
    };

    navigation.navigate('BookingFormScreen', { jet: bookingData });
  }, [charterDetails, selectedSeats, pricing, tripType, searchParams, navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingTitle}>Loading Charter Details</Text>
        <Text style={styles.loadingSub}>Preparing your luxury experience</Text>
      </View>
    );
  }

  if (!charterDetails) {
    return (
      <View style={styles.center}>
        <Icon name="error" size={56} color="#DC2626" />
        <Text style={styles.errorTitle}>Unable to load charter details</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={loadCharterDetails} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>Retry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Top overlay header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Icon name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.topTitle} numberOfLines={1}>
          {'Charter Details'}
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={[{ key: 'content' }]}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={() => (
          <View>
            {/* Image slider */}
            <View style={styles.sliderWrap}>
              {images?.length ? (
                <>
                  <FlatList
                    ref={flatListRef}
                    data={images}
                    keyExtractor={(_, idx) => `img-${idx}`}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleImageScroll}
                    scrollEventThrottle={16}
                    renderItem={({ item }) => (
                      <Image source={{ uri: item }} style={styles.heroImg} resizeMode="cover" />
                    )}
                  />

                  <View style={styles.counterPill}>
                    <Text style={styles.counterText}>
                      {selectedImageIndex + 1} / {images.length}
                    </Text>
                  </View>

                  {images.length > 1 && (
                    <>
                      <TouchableOpacity
                        style={[styles.navArrow, styles.navLeft]}
                        onPress={() => goToIndex(selectedImageIndex - 1 < 0 ? images.length - 1 : selectedImageIndex - 1)}
                        activeOpacity={0.8}
                      >
                        <Icon name="chevron-left" size={28} color="#FFF" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.navArrow, styles.navRight]}
                        onPress={() => goToIndex(selectedImageIndex + 1 > images.length - 1 ? 0 : selectedImageIndex + 1)}
                        activeOpacity={0.8}
                      >
                        <Icon name="chevron-right" size={28} color="#FFF" />
                      </TouchableOpacity>
                    </>
                  )}
                </>
              ) : (
                <View style={styles.noImage}>
                  <Icon name="image-not-supported" size={34} color="#94A3B8" />
                  <Text style={styles.noImageText}>No images available</Text>
                </View>
              )}
            </View>

            {/* Thumbnails */}
            {images.length > 1 && (
              <View style={styles.thumbBar}>
                <FlatList
                  data={images}
                  keyExtractor={(_, idx) => `thumb-${idx}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 14 }}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => goToIndex(index)}
                      activeOpacity={0.85}
                      style={[
                        styles.thumbWrap,
                        index === selectedImageIndex && styles.thumbWrapActive,
                      ]}
                    >
                      <Image source={{ uri: item }} style={styles.thumbImg} resizeMode="cover" />
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {/* Content */}
            <View style={styles.content}>
              {/* Seats */}
              <View style={styles.card}>
                <Text style={styles.h2}>Select Number of Passengers</Text>
                <Text style={styles.p}>You are booking the entire aircraft</Text>

                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={[styles.stepBtn, selectedSeats <= 1 && styles.stepBtnDisabled]}
                    onPress={decreaseSeats}
                    disabled={selectedSeats <= 1}
                    activeOpacity={0.85}
                  >
                    <Icon name="remove" size={22} color={selectedSeats <= 1 ? '#CBD5E1' : '#DC2626'} />
                  </TouchableOpacity>

                  <View style={styles.stepMid}>
                    <Text style={styles.stepNum}>{selectedSeats}</Text>
                    <Text style={styles.stepLabel}>Passengers</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.stepBtn, selectedSeats >= maxSeats && styles.stepBtnDisabled]}
                    onPress={increaseSeats}
                    disabled={selectedSeats >= maxSeats}
                    activeOpacity={0.85}
                  >
                    <Icon name="add" size={22} color={selectedSeats >= maxSeats ? '#CBD5E1' : '#DC2626'} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.successText}>Maximum {maxSeats} passengers • Entire Aircraft</Text>
              </View>

              {/* Pricing */}
              <View style={styles.card}>
                <View style={styles.priceHeader}>
                  <View>
                    <Text style={styles.priceTitle}>Flight Summary</Text>
                    <Text style={styles.priceSub}>All Inclusive</Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.priceTotal}>${pricing.total.toLocaleString()}</Text>
                    <Text style={styles.priceCurrency}>{pricing.currency}</Text>
                  </View>
                </View>

                <View style={styles.line} />

                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowLabel}>Whole Aircraft Charter</Text>
                    <Text style={styles.rowSub}>Complete aircraft booking</Text>
                  </View>
                  <Text style={styles.rowValue}>${pricing.baseFare.toLocaleString()}</Text>
                </View>

                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowLabel}>Service Fee ({SERVICE_FEE_PERCENTAGE}%)</Text>
                    <Text style={styles.rowSub}>Booking & handling fee</Text>
                  </View>
                  <Text style={styles.rowValue}>${pricing.serviceFee.toLocaleString()}</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.row}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${pricing.total.toLocaleString()}</Text>
                </View>

                <View style={styles.notePill}>
                  <Icon name="verified" size={16} color="#10B981" />
                  <Text style={styles.noteText}>All-inclusive price. No hidden fees.</Text>
                </View>
              </View>

              {/* Info */}
              <View style={styles.infoCard}>
                <Icon name="info" size={20} color="#DC2626" style={{ marginRight: 10, marginTop: 1 }} />
                <Text style={styles.infoText}>
                  You are booking the entire aircraft. All amenities, catering, and ground transportation included.
                  Price includes {SERVICE_FEE_PERCENTAGE}% service fee. For custom requests, contact our concierge after booking.
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Sticky bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBookNow} activeOpacity={0.9}>
          <Text style={styles.bookText}>Book</Text>
          <View style={styles.bookRight}>
            <Text style={styles.bookPrice}>${pricing.total.toLocaleString()}</Text>
            <Icon name="arrow-forward" size={20} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B1220' },

  center: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  loadingTitle: { marginTop: 14, fontSize: 16, fontWeight: '700', color: '#0F172A' },
  loadingSub: { marginTop: 6, fontSize: 13, color: '#64748B' },

  errorTitle: { marginTop: 12, fontSize: 16, fontWeight: '700', color: '#DC2626', textAlign: 'center' },

  primaryBtn: { marginTop: 16, backgroundColor: '#DC2626', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 12 },
  primaryBtnText: { color: '#FFF', fontWeight: '700' },

  secondaryBtn: { marginTop: 10, backgroundColor: '#E2E8F0', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 12 },
  secondaryBtnText: { color: '#0F172A', fontWeight: '700' },

  topBar: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    zIndex: 50,
    paddingTop: 12,
    paddingHorizontal: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    flex: 1,
    marginHorizontal: 12,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

  sliderWrap: {
    height: height * 0.44,
    backgroundColor: '#0B1220',
  },
  heroImg: {
    width,
    height: '100%',
  },
  counterPill: {
    position: 'absolute',
    top: 64,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  counterText: { color: '#FFF', fontSize: 12, fontWeight: '700' },

  navArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220,38,38,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLeft: { left: 14 },
  navRight: { right: 14 },

  noImage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  noImageText: { marginTop: 8, color: '#94A3B8', fontWeight: '700' },

  thumbBar: { backgroundColor: '#FFFFFF', paddingVertical: 10 },
  thumbWrap: {
    width: 78,
    height: 58,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbWrapActive: { borderColor: '#DC2626' },
  thumbImg: { width: '100%', height: '100%' },

  content: {
    backgroundColor: '#F8FAFC',
    paddingTop: 14,
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  h2: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  p: { marginTop: 6, fontSize: 13, color: '#64748B' },

  stepper: {
    marginTop: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  stepBtnDisabled: { backgroundColor: '#F1F5F9' },
  stepMid: { alignItems: 'center' },
  stepNum: { fontSize: 26,   color: '#DC2626' },
  stepLabel: { fontSize: 12,  color: '#64748B', marginTop: 2 },
  successText: { marginTop: 10, textAlign: 'center', color: '#10B981', fontWeight: '800' },

  priceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  priceTitle: { fontSize: 16,   color: '#0F172A' },
  priceSub: { marginTop: 4, fontSize: 12, color: '#64748B', fontWeight: '700' },
  priceTotal: { fontSize: 20,   color: '#DC2626' },
  priceCurrency: { marginTop: 2, fontSize: 12, color: '#64748B', fontWeight: '700' },

  row: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: 14,   color: '#0F172A' },
  rowSub: { marginTop: 2, fontSize: 12, color: '#94A3B8', fontWeight: '700' },
  rowValue: { fontSize: 14,   color: '#0F172A' },

  line: { height: 1, backgroundColor: '#E2E8F0', marginTop: 14 },

  totalLabel: { fontSize: 15, fontWeight: '900', color: '#0F172A' },
  totalValue: { fontSize: 18, fontWeight: '900', color: '#DC2626' },

  notePill: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  noteText: { marginLeft: 8, color: '#065F46', fontWeight: '800', fontSize: 13 },

  infoCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoText: { flex: 1, color: '#7F1D1D', fontSize: 13, lineHeight: 18, fontWeight: '700' },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(248,250,252,0.96)',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  bookBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#DC2626',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  bookText: { color: '#FFF', fontWeight: '900', fontSize: 18 },
  bookRight: { flexDirection: 'row', alignItems: 'center' },
  bookPrice: { color: '#FFF', fontWeight: '900', fontSize: 18, marginRight: 10 },
});

export default CharterDetailsScreen;
