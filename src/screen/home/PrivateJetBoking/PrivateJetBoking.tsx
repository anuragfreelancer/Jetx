import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
import CustomHeader from '../../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivateJetCard = ({ jet }) => {
  const navigation = useNavigation();
  const [selectedSeats, setSelectedSeats] = useState(1);

  const handleBookNow = () => {
    console.log(`Booking ${selectedSeats} seats on ${jet.name}`);
    // Navigate to payment/confirmation page here
  };

  const incrementSeats = () => {
    if (selectedSeats < jet.seats) {
      setSelectedSeats(selectedSeats + 1);
    }
  };

  const decrementSeats = () => {
    if (selectedSeats > 1) {
      setSelectedSeats(selectedSeats - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Jet Image */}
        <View style={styles.imageContainer}>
          <View style={styles.headerContainer}>
            <CustomHeader imageSource={imageIndex.backorange} label={jet.name} />
          </View>
          <ImageBackground
            source={{ uri: `https://images.unsplash.com/photo-1587019158091-1a103c5dd17f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmxpZ2h0fGVufDB8fDB8fHww&fm=jpg&q=60&w=3000` }}
            style={styles.jetImage}
            resizeMode="cover"
          >
            <View style={styles.overlay}>
              <Text style={styles.jetName}>{jet.name}</Text>
              <Text style={styles.jetCategory}>Private Jet</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Jet Details */}
        <View style={styles.detailsContainer}>
          {/* Specifications */}
          <View style={styles.specsContainer}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.specsGrid}>
              <View style={styles.specItem}>
                <View style={styles.specIconContainer}>
                  <Text style={styles.specIcon}>👥</Text>
                </View>
                <Text style={styles.specValue}>{jet.seats}</Text>
                <Text style={styles.specLabel}>Seats</Text>
              </View>
              
              <View style={styles.specDivider} />
              
              <View style={styles.specItem}>
                <View style={styles.specIconContainer}>
                  <Text style={styles.specIcon}>⚡</Text>
                </View>
                <Text style={styles.specValue}>{jet.speed}</Text>
                <Text style={styles.specLabel}>Speed</Text>
              </View>
              
              <View style={styles.specDivider} />
              
              <View style={styles.specItem}>
                <View style={styles.specIconContainer}>
                  <Text style={styles.specIcon}>🛣️</Text>
                </View>
                <Text style={styles.specValue}>{jet.range}</Text>
                <Text style={styles.specLabel}>Range</Text>
              </View>
            </View>
          </View>

          {/* Seat Selection */}
          <View style={styles.seatSelection}>
            <Text style={styles.sectionTitle}>Select Seats</Text>
            <View style={styles.seatCounter}>
              <TouchableOpacity
                style={[
                  styles.counterButton,
                  selectedSeats === 1 && styles.disabledButton,
                ]}
                onPress={decrementSeats}
                disabled={selectedSeats === 1}>
                <Text style={styles.counterText}>-</Text>
              </TouchableOpacity>

              <View style={styles.seatCount}>
                <Text style={styles.seatNumber}>{selectedSeats}</Text>
                <Text style={styles.seatLabel}>Seats</Text>
                <Text style={styles.seatSubtitle}>Max: {jet.seats}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.counterButton,
                  selectedSeats === jet.seats && styles.disabledButton,
                ]}
                onPress={incrementSeats}
                disabled={selectedSeats === jet.seats}>
                <Text style={styles.counterText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Price and Booking */}
          <View style={styles.bookingSection}>
            <View style={styles.priceContainer}>
              <View>
                <Text style={styles.priceLabel}>Total Price</Text>
                <Text style={styles.priceNote}>Inclusive of all taxes</Text>
              </View>
              <Text style={styles.price}>{jet.price}</Text>
            </View>

            <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
              <Text style={styles.bookButtonText}>Book Now</Text>
              <Text style={styles.bookButtonSubtext}>Confirm your booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const PrivateJetBoking = () => {
  const route = useRoute();
  const { flightData } = route.params || {};
  return <PrivateJetCard jet={flightData} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    marginTop: 18,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    height: 280,
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  jetImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 24,
    paddingTop: 32,
  },
  jetName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  jetCategory: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  detailsContainer: {
    padding: 20,
    paddingTop: 24,
  },
  specsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  specsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  specItem: {
    alignItems: 'center',
    flex: 1,
  },
  specIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  specIcon: {
    fontSize: 20,
  },
  specValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  specLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  specDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  seatSelection: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  seatCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  counterButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#FECACA',
    shadowOpacity: 0.1,
  },
  counterText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
  },
  seatCount: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  seatNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  seatLabel: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 2,
  },
  seatSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  bookingSection: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  priceLabel: {
    fontSize: 18,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 4,
  },
  priceNote: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  bookButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  bookButtonSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default PrivateJetBoking;