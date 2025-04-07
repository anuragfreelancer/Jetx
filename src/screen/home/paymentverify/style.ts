
import {  StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  safeArea: {
      flex: 1,
      backgroundColor: 'white',
  },
  container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
  },
  image: {
      height: 120,
      width: 120,
      marginBottom: 20,
  },
  title: {
      color: 'black',
      fontWeight: '700',
      fontSize: 20,
      textAlign: 'center',
  },
  description: {
      color: '#9DB2BF',
      fontWeight: '400',
      fontSize: 14,
      textAlign: 'center',
      marginTop: 12,
      lineHeight:25
   },
  button: {
      backgroundColor: '#ff6f00',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 8,
      marginTop: 20,
  },
  buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  },
});
export default styles;
