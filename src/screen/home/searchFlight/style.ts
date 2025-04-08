
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
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
    marginLeft:4,
    fontWeight:"500"
  },
  price: {
    fontWeight: '800',
    color: '#FF3B30',
    fontSize: 14,
   },
});
export default styles;
