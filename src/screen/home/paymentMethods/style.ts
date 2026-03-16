
import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 15,
      backgroundColor: 'white',
  },
  title: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 10,
  },
  subtitle: {
      fontSize: 16,
      color: '#9DB2BF',
      marginBottom: 20,
      marginTop: 13
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 10,
    borderRadius: 20,
  
    // Android shadow
    elevation: 1,
  
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,

  },
  icon: {
      marginRight: 15,
      height: 44,
      width: 44
  },
  paymentText: {
      flex: 1,
      fontSize: 16,
      fontWeight: 'bold',
  },
  addCardButton: {
      backgroundColor: '#0000001A',
      padding: 15,
      borderRadius: 15,
      alignItems: 'center',
      marginTop: 33,
  },
  addCardText: {
      fontSize: 17,
      fontWeight: '600',
      color: "#FF3B30"
  },
  continueButton: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
  },
  activeButton: {
      backgroundColor: '#000',
  },
  disabledButton: {
      backgroundColor: '#A0A0A0',
  },
  continueText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
  },
});
export default styles;
