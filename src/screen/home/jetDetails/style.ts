import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flex: 1,
    },
    headerBackground: {
        height: 240,
        paddingHorizontal: 16,
        paddingBottom: 20,
        justifyContent: 'space-between',
    },
    headerContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    backIcon: {
        height: 24,
        width: 24,
        marginTop: 10,
    },
    routeSummary: {
        alignItems: 'center',
        marginBottom: 10,
    },
    airportCodes: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    airportCodeLarge: {
        fontSize: 32,
        fontWeight: '700',
        color: 'white',
    },
    routeArrow: {
        fontSize: 24,
        color: 'white',
        marginHorizontal: 10,
    },
    flightRoute: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
    },
    flightDate: {
        fontSize: 18,
        color: 'white',
        marginTop: 2,
        fontWeight:"700"
    },
    priceContainer: {
        alignItems: 'center',
    },
    priceTotal: {
        fontSize: 28,
        fontWeight: '700',
        color: 'white',
    },
    priceDescription: {
         fontSize: 18,
        color: 'white',
        marginTop: 2,
        fontWeight:"700"
    },
    detailsContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    segmentContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    segmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    flightNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    duration: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    routeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    airportInfo: {
        alignItems: 'center',
        flex: 1,
    },
    time: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    airportCode: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 4,
    },
    terminal: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    flightPath: {
        alignItems: 'center',
        width: 80,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF6B35',
    },
    line: {
        width: 2,
        height: 30,
        backgroundColor: '#FF6B35',
        marginVertical: 4,
    },
    flightInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    aircraft: {
        fontSize: 12,
        color: '#666',
    },
    cabin: {
        fontSize: 12,
        color: '#666',
    },
    layoverContainer: {
        backgroundColor: '#FFF3E0',
        padding: 8,
        borderRadius: 6,
        marginTop: 12,
        alignItems: 'center',
    },
    layoverText: {
        fontSize: 12,
        color: '#E65100',
        fontWeight: '500',
    },
    totalDuration: {
        alignItems: 'center',
        marginTop: 8,
        padding: 12,
        backgroundColor: '#E3F2FD',
        borderRadius: 8,
    },
    totalDurationText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1976D2',
    },
    amenitiesList: {
        paddingVertical: 8,
    },
    amenityCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        width: 140,
        alignItems: 'center',
    },
    amenityIcon: {
        height: 32,
        width: 32,
        marginBottom: 8,
    },
    amenityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
        marginBottom: 4,
    },
    amenityDesc: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    fareBreakdown: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
    },
    fareRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    totalRow: {
        borderBottomWidth: 0,
        marginTop: 8,
    },
    fareLabel: {
        fontSize: 14,
        color: '#666',
    },
    fareValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FF6B35',
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '400',
    },
    bookButton: {
        marginHorizontal: 16,
        marginVertical: 12,
    },
});

export default styles;