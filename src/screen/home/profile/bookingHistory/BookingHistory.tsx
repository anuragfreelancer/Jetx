import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { GetBookingsByUserApi } from "../../../../redux/Api/AuthApi";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../../../compoent/CustomHeader";
import imageIndex from "../../../../assets/imageIndex";
import { useSelector } from "react-redux";

const getStatusStyle = (status?: string) => {
  const s = (status ?? "").toLowerCase();
  if (s.includes("confirm") || s.includes("completed")) return styles.badgeSuccess;
  if (s.includes("pending") || s.includes("processing")) return styles.badgePending;
  if (s.includes("cancel")) return styles.badgeCancel;
  return styles.badgeDefault;
};

type BookingItem = {
  id?: number | string;
  flight_name?: string;
  total_amount?: string | number;
  source_airport_name?: string;
  destination_airport_name?: string;
  journey_date?: string;
  total_passengers?: string | number;
  created_at?: string;
  booking_status?: string;
};

const MyBookingsScreen = ({
  featureState,
  route,
}: {
  featureState?: any;
  route?: any;
}) => {
  const params = route?.params;
  const userData = featureState?.userGetData;
  const userId = String(userData?.id ?? params?.user_id ?? "");
  const userGet = useSelector((state: any) => state.feature);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bookingList, setBookingList] = useState<BookingItem[]>([]);

  const fetchBookings = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    const data = await GetBookingsByUserApi(userGet.userGetData?.id, isRefresh ? setRefreshing : setLoading);
    setBookingList(Array.isArray(data) ? data : []);
  }, [userGet.userGetData?.id]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = useCallback(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  const renderItem = ({ item }: { item: BookingItem }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.flightIconWrap}>
            <Text style={styles.flightIcon}>✈</Text>
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.flightName} numberOfLines={1}>
              {item.flight_name || "Private Flight"}
            </Text>
            <Text style={styles.amount}>USD {item.total_amount ?? "—"}</Text>
          </View>
          <View style={[styles.badge, getStatusStyle(item.booking_status)]}>
            <Text style={styles.badgeText}>{item.booking_status || "—"}</Text>
          </View>
        </View>

        <View style={styles.routeBox}>
          <Text style={styles.routeFrom} numberOfLines={1}>
            {item.source_airport_name ?? "—"}
          </Text>
          <View style={styles.routeLine}>
            <View style={styles.routeDot} />
            <View style={styles.routeDash} />
            <View style={styles.routeDot} />
          </View>
          <Text style={styles.routeTo} numberOfLines={1}>
            {item.destination_airport_name ?? "—"}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Journey</Text>
          <Text style={styles.infoValue}>{item.journey_date ?? "—"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Passengers</Text>
          <Text style={styles.infoValue}>{item.total_passengers ?? "—"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Booked on</Text>
          <Text style={styles.infoValue}>{item.created_at ?? "—"}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <CustomHeader label="Bookings" imageSource={imageIndex.backorange} />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#E85D04" />
          <Text style={styles.loadingText}>Loading your bookings…</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={bookingList}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#E85D04"]}
              tintColor="#E85D04"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIconWrap}>
                <Text style={styles.emptyIcon}>✈</Text>
              </View>
              <Text style={styles.emptyTitle}>No bookings yet</Text>
              <Text style={styles.emptyText}>
                Your flight bookings will appear here
              </Text>
            </View>
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
    backgroundColor: "#F8FAFC",
  },
  list: {
    flex: 1,
    marginTop: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: "#64748B",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  flightIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  flightIcon: {
    fontSize: 20,
  },
  cardHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  flightName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#15803D",
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E293B",
    textTransform: "capitalize",
  },
  badgePending: {
    backgroundColor: "#FEF3C7",
  },
  badgeSuccess: {
    backgroundColor: "#D1FAE5",
  },
  badgeCancel: {
    backgroundColor: "#FEE2E2",
  },
  badgeDefault: {
    backgroundColor: "#E0E7FF",
  },
  routeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  routeFrom: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginRight: 8,
  },
  routeLine: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
  },
  routeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#94A3B8",
  },
  routeDash: {
    width: 20,
    height: 2,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 2,
  },
  routeTo: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginLeft: 8,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: "#64748B",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
});
