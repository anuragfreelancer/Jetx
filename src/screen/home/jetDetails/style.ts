
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
  },
  headerImage: {
      width: 430,
      height: 427,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
  },
  detailsContainer: {
      padding: 16,
      backgroundColor: '#fff',
  },
  title: {
      fontSize: 22,
      fontWeight: '700',
      color: "white"
  },
  featuresRow: {
      flexDirection: 'row',
      marginTop: 10,
  },
  featureItem: {
      alignItems: 'center',
      flex: 1,
  },
  featureLabel: {
      fontSize: 14,
      marginTop: 4,
  },
  priceText: {
      fontSize: 20,
      color: '#FFFFFF',
      fontWeight: '700',
      marginTop: 12,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
       color: "black"
  },
  amenitiesList: {
      marginTop: 10,
  },
  amenityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 6,
  },
  amenityText: {
      marginLeft: 10,
      fontSize: 14,
      color: "#000000",
      fontWeight: "600"
  },
  amenityImage: {
      width: 110,
      height: 80,
      borderRadius: 20,
      marginRight: 10,
  },
  reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 18,
      alignItems: 'center',
  },
  addReview: {
      color: '#FF3B30',
      fontWeight: '600',
      marginLeft: 7,
      fontSize: 12,
      lineHeight:12
  },
  reviewItem: {
      flexDirection: 'row',
      marginTop: 14,
  },
  avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginRight: 12,
  },
  reviewName: {
      fontWeight: '700',
      fontSize: 16,
      color: "black"
  },
  reviewText: {
      fontSize: 14,
      color: '#616161',
      marginTop: 7,
      fontWeight: "400",
      lineHeight: 18,

  },
  starRow: {
      flexDirection: 'row',
      marginTop: 4,
  },
  bookNowButton: {
      backgroundColor: '#f44336',
      margin: 16,
      paddingVertical: 14,
      borderRadius: 30,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
  },
  bookNowText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
  },
  bagText:{
    color: '#fff', marginLeft: 5, fontSize: 12, fontWeight: "700" 
  },
  bagSum:{
    color: '#878787', marginLeft: 5, fontSize: 10, fontWeight: "500"
  },
  img:{ height: 34, width: 34 }
});

export default styles;
