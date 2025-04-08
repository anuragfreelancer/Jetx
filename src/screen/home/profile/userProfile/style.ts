
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 25,
      backgroundColor: '#fff',
      marginBottom:20
    },
     
    header: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 20,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 100,
     },
    name: {
      fontSize: 21,
      fontWeight: '600',
      color:"black",
      marginTop:10
    },
    editText: {
      color: '#9DB2BF',
      marginBottom: 15,
      fontSize:10,
      fontWeight:"500",
      marginTop:5
    },
    menuList: {
      width: '100%',
      paddingHorizontal: 20,
      marginTop: 11
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 15,
      marginBottom: 10,
      elevation: 2, // Android shadow
      shadowColor: '#000', // iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3.84,
      marginTop:10
    },
    icon: {
      marginRight: 15,
      height: 40,
      width: 40
    },
      menuText: {
      fontSize: 14,
      color: '#352C48',
      fontWeight: "500"
    },
  });

export default styles;
