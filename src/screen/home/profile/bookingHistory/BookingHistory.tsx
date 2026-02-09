import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { GetBookingsByUserApi } from "../../../../redux/Api/AuthApi";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../../../compoent/CustomHeader";
import imageIndex from "../../../../assets/imageIndex";
import { useSelector } from "react-redux";
 
const MyBookingsScreen = ({ featureState, route }) => {
  const params = route?.params;
  const userData = featureState?.userGetData;
  const userId = String(userData?.id ?? params?.user_id  );
  const userGet = useSelector((state: any) => state.feature);
 
  const [loading, setLoading] = useState(false);
  const [bookingList, setBookingList] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, [])
 
  const fetchBookings = async () => {
    const data = await GetBookingsByUserApi(userGet.userGetData?.id, setLoading);

    console.log("Booking List =>", data);
    setBookingList(data);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        {/* Top Row */}
        <View style={styles.rowBetween}>
          <Text style={styles.flightName}>✈️ {item.flight_name}</Text>
          <Text style={styles.amount}>₹ {item.total_amount}</Text>
        </View>

        {/* Route */}
        <Text style={styles.route}>
          {item.source_airport_name} ➝ {item.destination_airport_name}
        </Text>

        {/* Info */}
        <Text style={styles.text}>Journey Date: {item.journey_date}</Text>
        <Text style={styles.text}>Passengers: {item.total_passengers}</Text>
        <Text style={styles.text}>Booked On: {item.created_at}</Text>

        {/* Status */}
        <View style={styles.statusRow}>
          <View style={[styles.badge, styles.pending]}>
            <Text style={styles.badgeText}>{item.booking_status}</Text>
          </View>
          <View style={[styles.badge, styles.payment]}>
            <Text style={styles.badgeText}>{item.payment_status}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
       <CustomHeader label="My Bookings" imageSource={imageIndex.backorange} />

      {loading ? (
        <ActivityIndicator size="large" color="#eb2525ff" />
      ) : (
        <FlatList 
        showsVerticalScrollIndicator={false}
          data={bookingList}
          style={{
            marginTop:16
          }}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No bookings found</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default MyBookingsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#1E3A8A",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    borderWidth:1 ,
    borderColor:"#E5E7EB"
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flightName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E40AF",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#16A34A",
  },
  route: {
    fontSize: 14,
    color: "#333",
    marginTop: 6,
  },
  text: {
    fontSize: 13,
    color: "#555",
    marginTop: 3,
  },
  statusRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
  },
  pending: {
    backgroundColor: "#FEF3C7",
  },
  payment: {
    backgroundColor: "#DBEAFE",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#999",
  },
});
