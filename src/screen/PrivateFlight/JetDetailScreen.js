import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { getCharterAircraftById } from '../../Aviapages/api';
 
const { width } = Dimensions.get('window');

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

const JetDetailScreen = ({ route, navigation }) => {
  const { jet: initialJet } = route.params;
  const [jet, setJet] = useState(initialJet);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJetDetails();
  }, []);

  const fetchJetDetails = async () => {
    setLoading(true);
    try {
      const jetDetails = await getCharterAircraftById(jet.id);
      setJet(jetDetails);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToBooking = () => {
    navigation.navigate('BookingForm', { jet });
  };

  const DetailRow = ({ label, value, icon }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailLabelContainer}>
        {icon && <Image source={icon} style={styles.detailIcon} />}
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value || 'N/A'}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={RED_THEME.primary} />
        <Text style={styles.loadingText}>Loading aircraft details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
       
        <View style={styles.imageOverlay}>
          <Text style={styles.registration}>{jet.registration_number}</Text>
          <Text style={styles.model}>
            {jet.manufacturer?.name} {jet.model?.name}
          </Text>
        </View>
      </View>

      {/* Status Badge */}
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: jet.is_for_charter ? RED_THEME.success : RED_THEME.error }
        ]}>
          <Text style={styles.statusText}>
            {jet.is_for_charter ? 'Available for Charter' : 'Not Available'}
          </Text>
        </View>
      </View>

      {/* Quick Specs */}
      <View style={styles.quickSpecs}>
        <View style={styles.quickSpecItem}>
          {/* <Image source={require('../assets/passenger.png')} style={styles.quickSpecIcon} /> */}
          <Text style={styles.quickSpecValue}>{jet.passengers_max || 'N/A'}</Text>
          <Text style={styles.quickSpecLabel}>Passengers</Text>
        </View>
        <View style={styles.quickSpecItem}>
          {/* <Image source={require('../assets/range.png')} style={styles.quickSpecIcon} /> */}
          <Text style={styles.quickSpecValue}>{jet.range_nm || 'N/A'}</Text>
          <Text style={styles.quickSpecLabel}>Range (nm)</Text>
        </View>
        <View style={styles.quickSpecItem}>
          {/* <Image source={require('../assets/speed.png')} style={styles.quickSpecIcon} /> */}
          <Text style={styles.quickSpecValue}>{jet.max_speed_kts || 'N/A'}</Text>
          <Text style={styles.quickSpecLabel}>Speed (kts)</Text>
        </View>
        <View style={styles.quickSpecItem}>
          {/* <Image source={require('../assets/year.png')} style={styles.quickSpecIcon} /> */}
          <Text style={styles.quickSpecValue}>{jet.year_of_production || 'N/A'}</Text>
          <Text style={styles.quickSpecLabel}>Year</Text>
        </View>
      </View>

      {/* Specifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specifications</Text>
        <View style={styles.specsGrid}>
          <DetailRow 
            label="Aircraft Type" 
            value={jet.aircraft_type?.name}
            // icon={require('../assets/aircraft-type.png')}
          />
          <DetailRow 
            label="Manufacturer" 
            value={jet.manufacturer?.name}
            // icon={require('../assets/manufacturer.png')}
          />
          <DetailRow 
            label="Model" 
            value={jet.model?.name}
            // icon={require('../assets/model.png')}
          />
          <DetailRow 
            label="Year of Production" 
            value={jet.year_of_production}
            // icon={require('../assets/year.png')}
          />
        </View>
      </View>

      {/* Capacity Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Capacity</Text>
        <View style={styles.specsGrid}>
          <DetailRow 
            label="Max Passengers" 
            value={jet.passengers_max}
           />
          <DetailRow 
            label="Crew Members" 
            value={jet.crew_members_count}
           />
          <DetailRow 
            label="Baggage Capacity" 
            value={jet.baggage_capacity_kg ? `${jet.baggage_capacity_kg} kg` : null}
           />
        </View>
      </View>

      {/* Performance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.specsGrid}>
          <DetailRow 
            label="Range" 
            value={jet.range_nm ? `${jet.range_nm} nautical miles` : null}
           />
          <DetailRow 
            label="Max Speed" 
            value={jet.max_speed_kts ? `${jet.max_speed_kts} knots` : null}
           />
          <DetailRow 
            label="Cruise Speed" 
            value={jet.cruise_speed_kts ? `${jet.cruise_speed_kts} knots` : null}
           />
        </View>
      </View>

      {/* Dimensions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dimensions</Text>
        <View style={styles.specsGrid}>
          <DetailRow 
            label="Cabin Height" 
            value={jet.cabin_height_m ? `${jet.cabin_height_m} m` : null}
           />
          <DetailRow 
            label="Cabin Length" 
            value={jet.cabin_length_m ? `${jet.cabin_length_m} m` : null}
           />
          <DetailRow 
            label="Cabin Width" 
            value={jet.cabin_width_m ? `${jet.cabin_width_m} m` : null}
            />
        </View>
      </View>

      {/* Additional Information */}
      {jet.comment && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.commentContainer}>
            <Text style={styles.commentText}>{jet.comment}</Text>
          </View>
        </View>
      )}

      {/* Booking Button */}
      <View style={styles.bookingContainer}>
        <TouchableOpacity 
          style={[
            styles.bookButton,
            !jet.is_for_charter && styles.bookButtonDisabled
          ]}
          onPress={navigateToBooking}
          disabled={!jet.is_for_charter}
        >
          <Text style={styles.bookButtonText}>
            {jet.is_for_charter ? 'Book This Aircraft' : 'Not Available for Booking'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RED_THEME.background,
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
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  jetImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  registration: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  model: {
    fontSize: 18,
    color: '#FECACA',
    fontWeight: '500',
  },
  statusContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quickSpecs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  quickSpecItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickSpecIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  quickSpecValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: RED_THEME.text,
    marginBottom: 4,
  },
  quickSpecLabel: {
    fontSize: 12,
    color: RED_THEME.textLight,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: RED_THEME.primary,
    marginBottom: 16,
  },
  specsGrid: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    opacity: 0.7,
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
    textAlign: 'right',
  },
  commentContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: RED_THEME.primary,
  },
  commentText: {
    fontSize: 16,
    color: RED_THEME.text,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  bookingContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  bookButton: {
    backgroundColor: RED_THEME.primary,
    paddingVertical: 18,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JetDetailScreen;