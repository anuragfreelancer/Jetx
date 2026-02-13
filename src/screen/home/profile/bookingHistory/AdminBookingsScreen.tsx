import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { GetAllBookingsApi } from "../../../../redux/Api/AuthApi";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../../../compoent/CustomHeader";
import imageIndex from "../../../../assets/imageIndex";

const AdminBookingsScreen = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const [bookingList, setBookingList] = useState([]);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    const data = await GetAllBookingsApi(setLoading);
    setBookingList(Array.isArray(data) ? data : []);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.flightName}>✈️ {item.flight_name || "Charter"}</Text>
          <Text style={styles.amount}>₹ {item.total_amount}</Text>
        </View>
        <Text style={styles.route}>
          {item.source_airport_name} ➝ {item.destination_airport_name}
        </Text>
        <Text style={styles.text}>Passenger: {item.passenger_name || "—"}</Text>
        <Text style={styles.text}>Journey Date: {item.journey_date}</Text>
        <Text style={styles.text}>Passengers: {item.total_passengers}</Text>
        <Text style={styles.text}>Booked On: {item.created_at}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.badge, styles.pending]}>
            <Text style={styles.badgeText}>{item.booking_status || "Pending"}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader label="All Bookings (Admin)" imageSource={imageIndex.backorange} />
      {loading ? (
        <ActivityIndicator size="large" color="#eb2525ff" />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={bookingList}
          style={{ marginTop: 16 }}
          keyExtractor={(item) => String(item.id)}
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

export default AdminBookingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
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
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
