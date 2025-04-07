import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  btn: {
    alignSelf: 'center',
    backgroundColor: '#352C48',
    height: 55,
    width: '100%',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderColor: '#7756FC',
   },
  line: {
    textDecorationLine: 'line-through',
  },
  txtHeading: {
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 36,
    color: '#000000',
    textAlign:"center"
  },
  textEr: { color: 'red', fontSize: 12 },

  txtsubHeading: {
    fontWeight: '400',
    fontSize: 13.8,
     color: '#9DB2BF',
     marginTop: 4,
     textAlign:"center"
  },
  tabBtn: {
    height: 60,
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 60,
    marginTop: 25,

    width: '100%',

    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,

    elevation: 1,
    backgroundColor: '#352C48',
  },

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  }
})