import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import StatusBarComponent from '../../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../../compoent/CustomHeader';
import imageIndex from '../../../../assets/imageIndex';

const BookingHistoryScreen = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const bookings = [
    {
      id: '1',
      from: 'LAX',
      to: 'JFK',
      date: 'April 10, 2025',
      jet: 'Jet Gulfstream G700',
      price: '$90,000',
    },
    {
      id: '2',
      from: 'MIA',
      to: 'LON',
      date: 'May 6, 2026',
      jet: 'Jet Bombardier Global 7500',
      price: '$120,000',
    },
    {
      id: '3',
      from: 'NYC',
      to: 'DXB',
      date: 'Mar 15, 2024',
      jet: 'Jet Dassault Falcon 10X',
      price: '$85,000',
    },
    {
      id: '4',
      from: 'LAX',
      to: 'JFK',
      date: 'April 10, 2025',
      jet: 'Jet Gulfstream G700',
      price: '$90,000',
    },
    {
      id: '5',
      from: 'MIA',
      to: 'LON',
      date: 'April 10, 2025',
      jet: 'Jet Gulfstream G700',
      price: '$90,000',
    },
  ];

  const renderCard = ({ item }) => (
    <View style={styles.card}>
        <View style={{flexDirection:"row",justifyContent:"space-between", }}>
        <View style={{flexDirection:"column"}}>
      <Text style={styles.route}>{item.from} – {item.to}</Text>
      <Text style={styles.info}>{item.date}</Text>
      <Text style={styles.info}>{item.jet}</Text>
      <Text style={styles.info}>Paid {item.price}</Text>
      </View>
      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>View Details</Text>
      </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
       <StatusBarComponent/>
       <CustomHeader imageSource={imageIndex.backorange} label="Booking History" />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('Upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'Upcoming' && styles.activeTabText]}>
            Upcoming Flights
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Past' && styles.activeTab]}
          onPress={() => setActiveTab('Past')}
        >
          <Text style={[styles.tabText, activeTab === 'Past' && styles.activeTabText]}>
            Past Flights
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={bookings}
        style={{
            marginTop:15,
            marginHorizontal:18
        }}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
   },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
 
  
    },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    width:"45%",
   },
  activeTab: {
    borderBottomColor: '#FF3B30',
  
  },
  tabText: {
    fontSize: 14,
    color: '#352C48',
    textAlign:"center",
    fontWeight:"700"
  },
  activeTabText: {
     fontSize: 14,
    color: '#FF3B30',
    textAlign:"center",
    fontWeight:"700",
 
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    elevation: 2, // Android
    marginVertical: 2,
    marginHorizontal: 1,
    
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    
   },
  route: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color:"#000000"
  },
  info: {
    fontSize: 12,
    color: '#878787',
    marginBottom: 2,
    fontWeight:"500"
  },
  detailsButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF3B30',
    bottom:24
   },
  detailsButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default BookingHistoryScreen;
