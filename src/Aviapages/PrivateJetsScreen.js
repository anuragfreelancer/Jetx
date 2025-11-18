 

// import React, { useEffect, useState } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   ActivityIndicator, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Alert,
//   Image,
//   ScrollView
// } from 'react-native';
// import { getCharterAircraft, getCharterAircraftById, makeBooking } from './api';

// const PrivateJetsScreen = () => {
//   const [jets, setJets] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedJet, setSelectedJet] = useState(null);
//   const [detailLoading, setDetailLoading] = useState(false);

//   useEffect(() => {
//     fetchJets();
//   }, []);

//   const fetchJets = async () => {
//     setLoading(true);
//     try {
//       const data = await getCharterAircraft();
//       setJets(data?.results || []);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch aircraft.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchJetDetails = async (jetId) => {
//     setDetailLoading(true);
//     try {
//       const jetDetails = await getCharterAircraftById(jetId);
//       setSelectedJet(jetDetails);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch aircraft details.');
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   const handleBooking = async (jetId) => {
//     try {
//       const bookingData = {
//         aircraft_id: jetId,
//         passenger_name: 'John Doe',
//         contact_email: 'john@example.com',
//         departure_date: '2025-11-20',
//         origin: 'JFK',
//         destination: 'LAX',
//       };
//       console.log("bookingData", bookingData);

//       const result = await makeBooking(bookingData);
//       Alert.alert('Booking Success', `Booking ID: ${result.id}`);
//     } catch (error) {
//       Alert.alert('Booking Failed', error.response?.data?.message || error.message);
//     }
//   };

//   const renderDetailSection = () => {
//     if (!selectedJet) return null;

//     return (
//       <View style={styles.detailOverlay}>
//         <ScrollView style={styles.detailContainer}>
//           <TouchableOpacity 
//             style={styles.closeButton}
//             onPress={() => setSelectedJet(null)}
//           >
//             <Text style={styles.closeButtonText}>✕</Text>
//           </TouchableOpacity>

//           {detailLoading ? (
//             <ActivityIndicator size="large" color="#1E90FF" />
//           ) : (
//             <>
//               <Text style={styles.detailTitle}>Aircraft Details</Text>
              
//               {/* Basic Information */}
//               <View style={styles.detailSection}>
//                 <Text style={styles.sectionTitle}>Basic Information</Text>
//                 <DetailRow label="ID" value={selectedJet.id} />
//                 <DetailRow label="Registration" value={selectedJet.registration_number} />
//                 <DetailRow label="Slug" value={selectedJet.slug} />
//                 <DetailRow label="Year" value={selectedJet.year_of_production} />
//                 <DetailRow label="Charter Available" value={selectedJet.is_for_charter ? 'Yes' : 'No'} />
//               </View>

//               {/* Capacity Information */}
//               <View style={styles.detailSection}>
//                 <Text style={styles.sectionTitle}>Capacity</Text>
//                 <DetailRow label="Max Passengers" value={selectedJet.passengers_max} />
//                 <DetailRow label="Crew Members" value={selectedJet.crew_members_count} />
//                 <DetailRow label="Baggage Capacity" value={selectedJet.baggage_capacity_kg ? `${selectedJet.baggage_capacity_kg} kg` : 'N/A'} />
//               </View>

//               {/* Aircraft Specifications */}
//               <View style={styles.detailSection}>
//                 <Text style={styles.sectionTitle}>Specifications</Text>
//                 <DetailRow label="Aircraft Type" value={selectedJet.aircraft_type?.name} />
//                 <DetailRow label="Manufacturer" value={selectedJet.manufacturer?.name} />
//                 <DetailRow label="Model" value={selectedJet.model?.name} />
//               </View>

//               {/* Additional Information */}
//               {selectedJet.comment && (
//                 <View style={styles.detailSection}>
//                   <Text style={styles.sectionTitle}>Additional Info</Text>
//                   <Text style={styles.commentText}>{selectedJet.comment}</Text>
//                 </View>
//               )}

//               {/* Booking Button */}
//               <TouchableOpacity 
//                 style={styles.bookButton}
//                 onPress={() => handleBooking(selectedJet.id)}
//               >
//                 <Text style={styles.bookButtonText}>Book This Aircraft</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </ScrollView>
//       </View>
//     );
//   };

//   const DetailRow = ({ label, value }) => (
//     <View style={styles.detailRow}>
//       <Text style={styles.detailLabel}>{label}:</Text>
//       <Text style={styles.detailValue}>{value || 'N/A'}</Text>
//     </View>
//   );

//   const renderJetItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.jetCard}
//       onPress={() => fetchJetDetails(item.id)}
//     >
//       <View style={styles.cardHeader}>
//         <Text style={styles.jetName}>{item.registration_number || item.slug}</Text>
//         <View style={[
//           styles.statusBadge, 
//           { backgroundColor: item.is_for_charter ? '#4CAF50' : '#FF6B6B' }
//         ]}>
//           <Text style={styles.statusText}>
//             {item.is_for_charter ? 'Available' : 'Not Available'}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.cardContent}>
//         <View style={styles.infoRow}>
//           <Text style={styles.infoLabel}>ID:</Text>
//           <Text style={styles.infoValue}>{item.id}</Text>
//         </View>
        
//         <View style={styles.infoRow}>
//           <Text style={styles.infoLabel}>Year:</Text>
//           <Text style={styles.infoValue}>{item.year_of_production || 'N/A'}</Text>
//         </View>
        
//         <View style={styles.infoRow}>
//           <Text style={styles.infoLabel}>Passengers:</Text>
//           <Text style={styles.infoValue}>{item.passengers_max || 'N/A'}</Text>
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.infoLabel}>Type:</Text>
//           <Text style={styles.infoValue}>{item.aircraft_type?.name || 'N/A'}</Text>
//         </View>
//       </View>

//       {item.comment && (
//         <Text style={styles.jetComment} numberOfLines={2}>
//           {item.comment}
//         </Text>
//       )}

//       <View style={styles.cardActions}>
//         <TouchableOpacity 
//           style={styles.detailButton}
//           onPress={() => fetchJetDetails(item.id)}
//         >
//           <Text style={styles.detailButtonText}>View Details</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[
//             styles.bookButton, 
//             !item.is_for_charter && styles.bookButtonDisabled
//           ]}
//           onPress={() => handleBooking(item.id)}
//           disabled={!item.is_for_charter}
//         >
//           <Text style={styles.bookButtonText}>
//             {item.is_for_charter ? 'Book Now' : 'Not Available'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#1E90FF" />
//         <Text style={styles.loadingText}>Loading Private Jets...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Private Jets</Text>
//         <Text style={styles.headerSubtitle}>Available for Charter</Text>
//       </View>

//       <FlatList
//         data={jets}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderJetItem}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No jets available</Text>
//             <TouchableOpacity style={styles.retryButton} onPress={fetchJets}>
//               <Text style={styles.retryButtonText}>Try Again</Text>
//             </TouchableOpacity>
//           </View>
//         }
//       />

//       {renderDetailSection()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   header: {
//     backgroundColor: '#1E90FF',
//     padding: 20,
//     paddingTop: 60,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: '#E3F2FD',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F8F9FA',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
//   listContent: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   jetCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     marginBottom: 16,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 6,
//     borderLeftWidth: 4,
//     borderLeftColor: '#1E90FF',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   jetName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2C3E50',
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   cardContent: {
//     marginBottom: 12,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#7F8C8D',
//     fontWeight: '500',
//   },
//   infoValue: {
//     fontSize: 14,
//     color: '#2C3E50',
//     fontWeight: '600',
//   },
//   jetComment: {
//     fontSize: 13,
//     color: '#95A5A6',
//     fontStyle: 'italic',
//     marginBottom: 16,
//     lineHeight: 18,
//   },
//   cardActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 12,
//   },
//   detailButton: {
//     flex: 1,
//     backgroundColor: '#E3F2FD',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   detailButtonText: {
//     color: '#1E90FF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   bookButton: {
//     flex: 1,
//     backgroundColor: '#1E90FF',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   bookButtonDisabled: {
//     backgroundColor: '#BDC3C7',
//   },
//   bookButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     marginTop: 60,
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: '#95A5A6',
//     marginBottom: 16,
//   },
//   retryButton: {
//     backgroundColor: '#1E90FF',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 10,
//   },
//   retryButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   // Detail Modal Styles
//   detailOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     zIndex: 1000,
//   },
//   detailContainer: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     margin: 20,
//     marginTop: 60,
//     borderRadius: 20,
//     padding: 20,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 1001,
//     backgroundColor: '#FF6B6B',
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   detailTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2C3E50',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   detailSection: {
//     marginBottom: 20,
//     backgroundColor: '#F8F9FA',
//     padding: 16,
//     borderRadius: 12,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1E90FF',
//     marginBottom: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//     paddingVertical: 4,
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#7F8C8D',
//     fontWeight: '500',
//     flex: 1,
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#2C3E50',
//     fontWeight: '600',
//     flex: 1,
//     textAlign: 'right',
//   },
//   commentText: {
//     fontSize: 14,
//     color: '#546E7A',
//     lineHeight: 20,
//     fontStyle: 'italic',
//   },
// });

// export default PrivateJetsScreen;



import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  Modal
} from 'react-native';
import { getCharterAircraft, getCharterAircraftById, makeBooking } from './api';
import CostaData from './CostaData.json';

const PrivateJetsScreen = () => {
  const [jets, setJets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJet, setSelectedJet] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchJets();
  }, []);

  const fetchJets = async () => {
    setLoading(true);
    try {
    //   const data = await getCharterAircraft();
      setJets(CostaData?.results || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch aircraft.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (jetId) => {
    setDetailLoading(true);
    setModalVisible(true);
    try {
      const jetDetails = await getCharterAircraftById(jetId);
      setSelectedJet(jetDetails);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch aircraft details.');
      setModalVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleBookNow = async (jetId, jetName) => {
    setBookingLoading(true);
    try {
      const bookingData = {
        aircraft_id: jetId,
        passenger_name: 'John Doe',
        contact_email: 'john@example.com',
        departure_date: '2025-11-20',
        origin: 'JFK',
        destination: 'LAX',
        passengers_count: 4,
        trip_type: 'one_way'
      };

      const result = await makeBooking(bookingData);
      Alert.alert(
        'Booking Success', 
        `Booking confirmed for ${jetName}!\nBooking ID: ${result.id || 'N/A'}`,
        [{ text: 'OK', onPress: () => setBookingLoading(false) }]
      );
    } catch (error) {
      Alert.alert(
        'Booking Failed', 
        error.response?.data?.message || error.message || 'Please try again later.'
      );
      setBookingLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedJet(null);
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value || 'N/A'}</Text>
    </View>
  );

  const renderJetItem = ({ item }) => (
    <View style={styles.jetCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.jetName}>{item.registration_number || item.slug}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: item.is_for_charter ? '#4CAF50' : '#FF6B6B' }
        ]}>
          <Text style={styles.statusText}>
            {item.is_for_charter ? 'Available' : 'Not Available'}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Model:</Text>
          <Text style={styles.infoValue}>{item.model?.name || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Manufacturer:</Text>
          <Text style={styles.infoValue}>{item.manufacturer?.name || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Passengers:</Text>
          <Text style={styles.infoValue}>{item.passengers_max || 'N/A'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Year:</Text>
          <Text style={styles.infoValue}>{item.year_of_production || 'N/A'}</Text>
        </View>
      </View>

      {item.comment && (
        <Text style={styles.jetComment} numberOfLines={2}>
          {item.comment}
        </Text>
      )}

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.detailButton}
          onPress={() => handleViewDetails(item.id)}
        >
          <Text style={styles.detailButtonText}>View Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.bookButton, 
            !item.is_for_charter && styles.bookButtonDisabled
          ]}
          onPress={() => handleBookNow(item.id, item.registration_number || item.slug)}
          disabled={!item.is_for_charter || bookingLoading}
        >
          {bookingLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.bookButtonText}>
              {item.is_for_charter ? 'Book Now' : 'Not Available'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading Private Jets...</Text>
      </View>
    );
  }
  console.log("selectedJet",selectedJet?.images)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Private Jets</Text>
        <Text style={styles.headerSubtitle}>Available for Charter</Text>
      </View>

      <FlatList
        data={jets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderJetItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={fetchJets}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No jets available</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchJets}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Aircraft Details</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {detailLoading ? (
                <ActivityIndicator size="large" color="#1E90FF" />
              ) : selectedJet ? (
                <>
                  {/* Basic Information */}
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <DetailRow label="ID" value={selectedJet.id} />
                    <DetailRow label="Registration" value={selectedJet.registration_number} />
                    <DetailRow label="Slug" value={selectedJet.slug} />
                    <DetailRow label="Year" value={selectedJet.year_of_production} />
                    <DetailRow label="Charter Available" value={selectedJet.is_for_charter ? 'Yes' : 'No'} />
                  </View>

                  {/* Capacity Information */}
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Capacity</Text>
                    <DetailRow label="Max Passengers" value={selectedJet.passengers_max} />
                    <DetailRow label="Crew Members" value={selectedJet.crew_members_count} />
                    <DetailRow label="Baggage Capacity" value={selectedJet.baggage_capacity_kg ? `${selectedJet.baggage_capacity_kg} kg` : 'N/A'} />
                  </View>

                  {/* Aircraft Specifications */}
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Specifications</Text>
                    <DetailRow label="Aircraft Type" value={selectedJet.aircraft_type?.name} />
                    <DetailRow label="Manufacturer" value={selectedJet.manufacturer?.name} />
                    <DetailRow label="Model" value={selectedJet.model?.name} />
                  </View>

                  {/* Additional Information */}
                  {selectedJet.comment && (
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>Additional Info</Text>
                      <Text style={styles.commentText}>{selectedJet.comment}</Text>
                    </View>
                  )}

                  {/* Booking Button in Modal */}
                  <TouchableOpacity 
                    style={[
                      styles.bookButton,
                      styles.modalBookButton,
                      !selectedJet.is_for_charter && styles.bookButtonDisabled
                    ]}
                    onPress={() => {
                      closeModal();
                      handleBookNow(selectedJet.id, selectedJet.registration_number || selectedJet.slug);
                    }}
                    disabled={!selectedJet.is_for_charter || bookingLoading}
                  >
                    {bookingLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.bookButtonText}>
                        {selectedJet.is_for_charter ? 'Book This Aircraft' : 'Not Available for Booking'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.errorText}>Failed to load details</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#1E90FF',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E3F2FD',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#1E90FF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
  },
  jetComment: {
    fontSize: 13,
    color: '#95A5A6',
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#1E90FF',
    fontSize: 14,
    fontWeight: '600',
  },
  bookButton: {
    flex: 1,
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBookButton: {
    marginTop: 20,
    marginBottom: 10,
  },
  bookButtonDisabled: {
    backgroundColor: '#BDC3C7',
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
  emptyText: {
    fontSize: 18,
    color: '#95A5A6',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  closeButton: {
    backgroundColor: '#FF6B6B',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  commentText: {
    fontSize: 14,
    color: '#546E7A',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  errorText: {
    textAlign: 'center',
    color: '#FF6B6B',
    fontSize: 16,
    marginVertical: 20,
  },
});

export default PrivateJetsScreen;