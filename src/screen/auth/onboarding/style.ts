
import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    slide: {
        width,

    },
    image: {
        width: "100%",
        height: 540,

    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#000000',
        textAlign: 'center',
        paddingHorizontal: 16,
        lineHeight: 21,
        marginTop: 10,
        fontWeight:"400"
    },
    pagination: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 80,
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 10,
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: '#FF3B30',
        width: 13,
        height: 7,
    },
    inactiveDot: {
        backgroundColor: '#FFB1AC',
        height: 7,
        width: 7,
    },
    subtitle: {
        fontSize: 16,
        color: "#909090",
        fontWeight: "400",
        lineHeight: 22
    },
    textView: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        marginBottom: 10
    },
    loginText: {
        fontSize: 16,
        fontWeight: "800"
        ,
        color: "#000000"
    }
});
export default styles;
