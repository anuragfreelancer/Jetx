import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    FlatList,
    ImageBackground,
    
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomButton from '../../../compoent/CustomButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenNameEnum from '../../../routes/screenName.enum';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';

const FlightDetails = () => {
    const route = useRoute();
    const flight = route.params?.flight;
console.log(flight)
 
    const navigation = useNavigation<any>();

    if (!flight) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>No flight data available</Text>
            </SafeAreaView>
        );
    }

    const { itineraries, price, travelerPricings } = flight;
    const segments = itineraries[0]?.segments || [];
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];

    // Format duration for display
    const formatDuration = (duration) => {
        return duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Format time for display
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };

 
    const renderAmenityItem = ({ item }) => (
        <View style={styles.amenityCard}>
            <Image source={item.icon} style={styles.amenityIcon} />
            <Text style={styles.amenityTitle}>{item.title}</Text>
            <Text style={styles.amenityDesc}>{item.description}</Text>
        </View>
    );

    const renderSegment = (segment, index) => (
        <View key={segment.id} style={styles.segmentContainer}>
            <View style={styles.segmentHeader}>
                <Text style={styles.flightNumber}>
                    {segment.carrierCode} {segment.number}
                </Text>
                <Text style={styles.duration}>
                    {formatDuration(segment.duration)}
                </Text>
            </View>
            
            <View style={styles.routeContainer}>
                <View style={styles.airportInfo}>
                    <Text style={styles.time}>
                        {formatTime(segment.departure.at)}
                    </Text>
                    <Text style={styles.airportCode}>
                        {segment.departure.iataCode}
                    </Text>
                    <Text style={styles.terminal}>
                        Terminal {segment.departure.terminal}
                    </Text>
                </View>

                <View style={styles.flightPath}>
                    <View style={styles.dot} />
                    <View style={styles.line} />
                    <View style={styles.dot} />
                </View>

                <View style={styles.airportInfo}>
                    <Text style={styles.time}>
                        {formatTime(segment.arrival.at)}
                    </Text>
                    <Text style={styles.airportCode}>
                        {segment.arrival.iataCode}
                    </Text>
                    <Text style={styles.terminal}>
                        Terminal {segment.arrival.terminal}
                    </Text>
                </View>
            </View>

            <View style={styles.flightInfo}>
                <Text style={styles.aircraft}>
                    Aircraft: {segment.aircraft.code}
                </Text>
                <Text style={styles.cabin}>
                    Cabin: {segment.cabin}
                </Text>
            </View>

            {index < segments.length - 1 && (
                <View style={styles.layoverContainer}>
                    <Text style={styles.layoverText}>
                        Layover: {formatDuration('PT3H50M')} {/* Calculate actual layover */}
                    </Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBarComponent />
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Header with Flight Info */}
                <ImageBackground
                    source={{
                        uri:"https://images.unsplash.com/photo-1556388158-158ea5ccacbd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmxpZ2h0fGVufDB8fDB8fHww&fm=jpg&q=60&w=3000"
                    }}
                    // source={imageIndex.filtie}
                    style={styles.headerBackground}
                    resizeMode='cover'
                >
                    <SafeAreaView edges={['top']}/>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image 
                                source={imageIndex.backorange} 
                                style={styles.backIcon}
                                tintColor={"white"}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                        
                        <View style={styles.routeSummary}>
                            <View style={styles.airportCodes}>
                                <Text style={styles.airportCodeLarge}>
                                    {firstSegment?.departure.iataCode}
                                </Text>
                                <Text style={styles.routeArrow}>→</Text>
                                <Text style={styles.airportCodeLarge}>
                                    {lastSegment?.arrival.iataCode}
                                </Text>
                            </View>
                            <Text style={styles.flightRoute}>
                                {firstSegment?.departure.iataCode} to {lastSegment?.arrival.iataCode}
                            </Text>
                            <Text style={styles.flightDate}>
                                {formatDate(firstSegment?.departure.at)}
                            </Text>
                        </View>

                        <View style={styles.priceContainer}>
                            <Text style={styles.priceTotal}>${price.total}</Text>
                            <Text style={styles.priceDescription}>Total per passenger</Text>
                        </View>
                    </View>
                </ImageBackground>

                {/* Flight Segments */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.sectionTitle}>Flight Details</Text>
                    {segments.map(renderSegment)}
                    
                    <View style={styles.totalDuration}>
                        <Text style={styles.totalDurationText}>
                            Total Duration: {formatDuration(itineraries[0]?.duration)}
                        </Text>
                    </View>
                </View>

         
                {/* <View style={styles.detailsContainer}>
                    <Text style={styles.sectionTitle}>Included Amenities</Text>
                    <FlatList
                        horizontal
                        data={amenities}
                        renderItem={renderAmenityItem}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.amenitiesList}
                    />
                </View> */}

                {/* Fare Details */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.sectionTitle}>Fare Breakdown</Text>
                    <View style={styles.fareBreakdown}>
                        <View style={styles.fareRow}>
                            <Text style={styles.fareLabel}>Base Fare</Text>
                            <Text style={styles.fareValue}>${price.base}</Text>
                        </View>
                        <View style={styles.fareRow}>
                            <Text style={styles.fareLabel}>Taxes & Fees</Text>
                            <Text style={styles.fareValue}>${(parseFloat(price.total) - parseFloat(price.base)).toFixed(2)}</Text>
                        </View>
                        <View style={styles.fareRow}>
                            <Text style={styles.fareLabel}>Checked Bags</Text>
                            <Text style={styles.fareValue}>
                                {travelerPricings[0]?.fareDetailsBySegment[0]?.includedCheckedBags?.quantity || 0} included
                            </Text>
                        </View>
                        <View style={[styles.fareRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>${price.total}</Text>
                        </View>
                    </View>
                </View>

                {/* Additional Info */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.sectionTitle}>Additional Information</Text>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Airline:</Text>
                        <Text style={styles.infoValue}>Air India (AI)</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Fare Type:</Text>
                        <Text style={styles.infoValue}>ECO VALUE</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Ticket Type:</Text>
                        <Text style={styles.infoValue}>Refundable & Changeable</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Last Booking Date:</Text>
                        <Text style={styles.infoValue}>
                            {new Date(flight.lastTicketingDate).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <CustomButton
                title={'Book Now'}
                onPress={() => navigation.navigate(ScreenNameEnum.BookNow, { flight })}
                // onPress={() => navigation.navigate("FlightBookingFormScreen", { flight })}
                buttonStyle={styles.bookButton}
            />
        </View>
    );
};

export default FlightDetails;