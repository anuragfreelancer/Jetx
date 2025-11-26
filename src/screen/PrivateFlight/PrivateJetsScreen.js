import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  TextInput,
  ScrollView,
  RefreshControl,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import { getCharterAircraft, searchAircraft } from '../../Aviapages/api';
import CustomHeader from '../../compoent/CustomHeader';
import imageIndex from '../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';
 
 
// Red Theme Colors
const RED_THEME = {
  primary: '#FF3B30',
  primaryDark: '#FF3B30',
  primaryLight: '#FF3B30',
  secondary: '#FF3B30',
  background: '#FEF2F2',
  card: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#FECACA',
  error: '#DC2626',
  success: '#16A34A',
  warning: '#D97706'
};

const PrivateJetsScreen = ({ navigation }) => {
  const [jets, setJets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    passengers_min: '',
    passengers_max: '',
    aircraft_type: '',
    manufacturer: '',
    year_min: '',
    year_max: '',
    is_for_charter: true
  });

  useEffect(() => {
    fetchJets();
  }, []);

  const fetchJets = async (params = {}) => {
    setLoading(true);
    try {
      const data = await getCharterAircraft(params);
      setJets(data?.results || []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJets();
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchJets();
      return;
    }

    setLoading(true);
    try {
      const searchParams = {
        search: searchQuery,
        ...filters
      };
      const data = await searchAircraft(searchParams);
      setJets(data?.results || []);
    } catch (error) {
      Alert.alert('Search Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      const filterParams = {};
      
      if (filters.passengers_min) filterParams.passengers_min = filters.passengers_min;
      if (filters.passengers_max) filterParams.passengers_max = filters.passengers_max;
      if (filters.aircraft_type) filterParams.aircraft_type = filters.aircraft_type;
      if (filters.manufacturer) filterParams.manufacturer = filters.manufacturer;
      if (filters.year_min) filterParams.year_min = filters.year_min;
      if (filters.year_max) filterParams.year_max = filters.year_max;
      filterParams.is_for_charter = filters.is_for_charter;

      const data = await searchAircraft(filterParams);
      setJets(data?.results || []);
      setShowFilters(false);
    } catch (error) {
      Alert.alert('Filter Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      passengers_min: '',
      passengers_max: '',
      aircraft_type: '',
      manufacturer: '',
      year_min: '',
      year_max: '',
      is_for_charter: true
    });
    fetchJets();
    setShowFilters(false);
  };

  const navigateToJetDetail = (jet) => {
    navigation.navigate('JetDetail', { jet });
  };

  const navigateToBooking = (jet) => {
    navigation.navigate('BookingFormScreen', { jet });
  };

  const renderJetItem = ({ item }) => (
    <View style={styles.jetCard}>
      <View style={styles.cardHeader}>
        <View style={styles.jetBasicInfo}>
          <Text style={styles.jetRegistration}>{item.registration_number}</Text>
          <Text style={styles.jetModel}>
            {item.manufacturer?.name} {item.model?.name}
          </Text>
        </View>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: item.is_for_charter ? RED_THEME.success : RED_THEME.error }
        ]}>
          <Text style={styles.statusText}>
            {item.is_for_charter ? 'Available' : 'Not Available'}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.specsRow}>
          <View style={styles.specItem}>
            {/* <Image source={require('../assets/passenger.png')} style={styles.specIcon} /> */}
            <Text style={styles.specLabel}>Passengers</Text>
            <Text style={styles.specValue}>{item.passengers_max || 'N/A'}</Text>
          </View>
          <View style={styles.specItem}>
            {/* <Image source={require('../assets/year.png')} style={styles.specIcon} /> */}
            <Text style={styles.specLabel}>Year</Text>
            <Text style={styles.specValue}>{item.year_of_production || 'N/A'}</Text>
          </View>
          <View style={styles.specItem}>
            {/* <Image source={require('../assets/range.png')} style={styles.specIcon} /> */}
            <Text style={styles.specLabel}>Range</Text>
            <Text style={styles.specValue}>
              {item.range_nm ? `${item.range_nm} nm` : 'N/A'}
            </Text>
          </View>
        </View>

        {item.comment && (
          <Text style={styles.jetComment} numberOfLines={2}>
            {item.comment}
          </Text>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.detailButton}
          // onPress={() => navigateToJetDetail(item)}
        >
          <Text style={styles.detailButtonText}>View Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.bookButton, 
            !item.is_for_charter && styles.bookButtonDisabled
          ]}
          // onPress={() => navigateToBooking(item)}
          disabled={!item.is_for_charter}
        >
          <Text style={styles.bookButtonText}>
            {item.is_for_charter ? 'Book Now' : 'Not Available'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFiltersModal = () => (
    <View style={styles.filtersContainer}>
      <ScrollView style={styles.filtersForm}>
        <Text style={styles.formSectionTitle}>Passenger Capacity</Text>
        
        <View style={styles.filterRow}>
          <View style={styles.filterInputContainer}>
            <Text style={styles.inputLabel}>Min Passengers</Text>
            <TextInput
              style={styles.filterInput}
              value={filters.passengers_min}
              onChangeText={(text) => setFilters(prev => ({...prev, passengers_min: text.replace(/[^0-9]/g, '')}))}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.filterInputContainer}>
            <Text style={styles.inputLabel}>Max Passengers</Text>
            <TextInput
              style={styles.filterInput}
              value={filters.passengers_max}
              onChangeText={(text) => setFilters(prev => ({...prev, passengers_max: text.replace(/[^0-9]/g, '')}))}
              placeholder="20"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.formSectionTitle}>Aircraft Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Aircraft Type</Text>
          <TextInput
            style={styles.textInput}
            value={filters.aircraft_type}
            onChangeText={(text) => setFilters(prev => ({...prev, aircraft_type: text}))}
            placeholder="e.g., Jet, Turboprop"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Manufacturer</Text>
          <TextInput
            style={styles.textInput}
            value={filters.manufacturer}
            onChangeText={(text) => setFilters(prev => ({...prev, manufacturer: text}))}
            placeholder="e.g., Cessna, Bombardier"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.filterRow}>
          <View style={styles.filterInputContainer}>
            <Text style={styles.inputLabel}>Year From</Text>
            <TextInput
              style={styles.filterInput}
              value={filters.year_min}
              onChangeText={(text) => setFilters(prev => ({...prev, year_min: text.replace(/[^0-9]/g, '')}))}
              placeholder="2000"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.filterInputContainer}>
            <Text style={styles.inputLabel}>Year To</Text>
            <TextInput
              style={styles.filterInput}
              value={filters.year_max}
              onChangeText={(text) => setFilters(prev => ({...prev, year_max: text.replace(/[^0-9]/g, '')}))}
              placeholder="2024"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.filterActions}>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetFilters}
          >
            <Text style={styles.resetButtonText}>Reset All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={applyFilters}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
          <CustomHeader imageSource={imageIndex.backorange} label="Private Jet" />
    

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by registration, model, manufacturer..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholderTextColor="#999"
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>
            {showFilters ? 'Hide Filters' : 'Filters'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && renderFiltersModal()}

      {/* Results Summary */}
      {!loading && jets.length > 0 && (
        <View style={styles.resultsSummary}>
          <Text style={styles.resultsText}>
            Found {jets.length} aircraft{jets.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={RED_THEME.primary} />
          <Text style={styles.loadingText}>Loading Private Jets...</Text>
        </View>
      )}

      {/* Jets List */}
      {!loading && (
        <FlatList
          data={jets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderJetItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[RED_THEME.primary]}
              tintColor={RED_THEME.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {/* <Image source={require('../assets/no-jets.png')} style={styles.emptyImage} /> */}
              <Text style={styles.emptyText}>No jets found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search criteria or filters
              </Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchJets}>
                <Text style={styles.retryButtonText}>Refresh List</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: RED_THEME.primary,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FECACA',
    fontWeight: '500',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: RED_THEME.border,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: RED_THEME.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: RED_THEME.text,
  },
  searchButton: {
    padding: 16,
    backgroundColor: RED_THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: RED_THEME.secondary,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: RED_THEME.border,
  },
  filtersForm: {
    maxHeight: 400,
  },
  resultsSummary: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: RED_THEME.border,
  },
  resultsText: {
    fontSize: 14,
    color: RED_THEME.textLight,
    fontWeight: '500',
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
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  jetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: RED_THEME.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  jetBasicInfo: {
    flex: 1,
  },
  jetRegistration: {
    fontSize: 20,
    fontWeight: 'bold',
    color: RED_THEME.text,
    marginBottom: 4,
  },
  jetModel: {
    fontSize: 16,
    color: RED_THEME.textLight,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 20,
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  specItem: {
    alignItems: 'center',
    flex: 1,
  },
  specIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  specLabel: {
    fontSize: 12,
    color: RED_THEME.textLight,
    marginBottom: 4,
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: RED_THEME.text,
  },
  jetComment: {
    fontSize: 14,
    color: RED_THEME.textLight,
    fontStyle: 'italic',
    marginTop: 12,
    lineHeight: 20,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: RED_THEME.border,
  },
  detailButtonText: {
    color: RED_THEME.text,
    fontSize: 14,
    fontWeight: '600',
  },
  bookButton: {
    flex: 1,
    backgroundColor: RED_THEME.primary,
    paddingVertical: 14,
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
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    padding: 20,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 20,
    color: RED_THEME.textLight,
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: RED_THEME.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: RED_THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Filter Styles
  formSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: RED_THEME.text,
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: RED_THEME.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: RED_THEME.text,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  filterInputContainer: {
    flex: 1,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: RED_THEME.text,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#6B7280',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: RED_THEME.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PrivateJetsScreen;