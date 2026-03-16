
import { StyleSheet } from 'react-native';
import { wp } from '../../../utils/Constant';
  
const Styles = StyleSheet.create({
  mainView:{ flex: 1, backgroundColor: "white" },
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: '#FF3B30',
    bottom: 2,
  },
  btn: {
    alignSelf: 'center',
    backgroundColor: '#E8442E',
    height: 55,

    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    width: wp(90),
  },
  titlView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'flex-start', marginBottom: 20,
    marginHorizontal: 15,
  },
  redText: {
    color: 'red', fontSize: 12
  },
  pass: {
    color: '#000000',
    fontSize: 14,
    lineHeight: 18,
  }
});
export default Styles;
