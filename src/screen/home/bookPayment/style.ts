
import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container1: { flex: 1, backgroundColor: "white", marginTop: 20, marginHorizontal: 15, marginBottom: 15 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  paymentDetails: { backgroundColor: "#fff", borderRadius: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#000000",marginTop:15 },
  rowBetween: { flexDirection: "row", marginBottom: 10 },
  boldText: { fontWeight: "600", color: "#101623", fontSize: 14 },
  selectedCard: { borderColor: "blue", borderWidth: 2 },
  addNewCard: { flexDirection: "row", alignItems: "center", marginTop: 15, marginBottom: 10 },
  input: { backgroundColor: "#fff", borderRadius: 10, marginBottom: 10, marginTop: 15 },
  submitButton: { backgroundColor: "#FF3B30", borderRadius: 10, alignItems: "center" },
  submitText: { color: "white", fontWeight: "bold" },
  container: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 15,
   
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
     borderRadius: 16,
    padding: 5,
    marginBottom: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#F5F5F5"
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    width: 30,
    height: 20,
    resizeMode: "contain",
    marginRight: 10,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    letterSpacing: 1,
  },
  radioButton: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },

  addNewCardText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#606060",
    marginLeft: 15
  },
  butt: {
    justifyContent: 'flex-start', marginBottom: 15,
    marginHorizontal: 15
  },
  cardName: {
    color: "#FF3B30",
    fontWeight: "600",
    marginLeft: 8
  },
  inputView: {
    height: 55,
    borderColor: "F8F8F8",
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
  },
  sub: {
    color: "#555555",
    fontSize: 14,
  },
  cardView: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical:2,
    marginHorizontal:2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    // Android Shadow
    elevation: 2,

    
    marginTop: 15
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 12,
    color: '#878787',
    marginLeft: 4,
    fontWeight: "500"
  },
  price: {
    fontWeight: '800',
    color: '#FF3B30',
    fontSize: 14,
  },

});
export default styles;
