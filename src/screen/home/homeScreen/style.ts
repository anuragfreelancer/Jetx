
import { StyleSheet } from 'react-native';



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",

  },
  header: {
    backgroundColor: "#FF3B30",
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginBottom: 12
  },
  formContainer: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    flex: 1,
    bottom: 40
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 34
  },
  profileImage: {
    height: 55,
    width: 92,
  },

  searchSection: { marginBottom: 20, },
  input: {
    borderWidth: 2,
    borderColor: '#F6F3FF',
    borderRadius: 20,
    padding: 15,
    backgroundColor: 'white',
    height: 70,
    marginTop: 10


  },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dateInput: { flex: 1, marginRight: 8 },
  searchButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  searchButtonText: { color: '#fff', fontWeight: 'bold' },

  jetSection: {},
  jetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 30 },
  jetTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: '700',
  },
  viewAll: {
    color: '#FF3B30', fontSize: 12,

    fontWeight: '600',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    width: 333,
    marginBottom: 20,
    elevation: 1, // Android shadow
    marginTop: 5,
    
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    


  },
  cardImage: { width: 314, height: 105, marginTop: 8 },
  cardTitle: { fontWeight: '700', fontSize: 16, marginTop: 10, color: "black", marginBottom: 5 },
  cardInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  cardText: { fontSize: 12, color: '#666', fontWeight: "500", marginLeft: 3 },
  cardPrice: { color: '#FF3B30', fontWeight: '700', marginTop: 8, fontSize: 13, marginBottom: 5 },
  inuptSum: {
    color: "black",
    right: 2,
    fontWeight: "600",
    fontSize: 14,
    bottom: 3
  },
  date: {
    color: "black",
    right: 2,
    fontWeight: "600",
    fontSize: 14,
    bottom: 3
  },
  depTitle:{
                                      fontSize: 14,
                                      color: '#C9C9C9',
                                      fontWeight: '600',
  
                                  }

});
export default styles;
