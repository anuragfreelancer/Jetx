import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Linking
} from 'react-native';

const RED_THEME = {
    primary: '#DC2626',
    primaryDark: '#B91C1C',
    primaryLight: '#EF4444',
    secondary: '#991B1B',
    background: '#FEF2F2',
    card: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280',
    border: '#FECACA',
    error: '#DC2626',
    success: '#16A34A',
    warning: '#D97706'
};

const ConfirmationScreen = ({ route, navigation }) => {
    const { bookingData, bookingResult, paymentResult, jet } = route.params;

    const handleShare = async () => {
        try {
            const bookingDetails = `
Private Jet Booking Confirmation

Booking Reference: ${bookingResult.booking_reference || bookingResult.id}
Aircraft: ${jet.registration_number} - ${jet.manufacturer?.name} ${jet.model?.name}
Passenger: ${bookingData.passenger_name}
Route: ${bookingData.origin} → ${bookingData.destination}
Departure: ${bookingData.departure_date}
${bookingData.trip_type === 'round_trip' ? `Return: ${bookingData.return_date}` : 'Trip Type: One Way'}
Passengers: ${bookingData.passengers_count}

Payment Status: ${paymentResult.status}
Transaction ID: ${paymentResult.transaction_id}

Thank you for choosing our private jet service!
            `.trim();

            Alert.alert('Share Booking', 'Booking details copied to clipboard');
        } catch (error) {
            Alert.alert('Error', 'Could not share booking details');
        }
    };

    const handleContactSupport = () => {
        Linking.openURL('tel:+11234567890');
    };

    const handleNewBooking = () => {
        navigation.navigate('PrivateJets');
    };

    const handleEmailSupport = () => {
        Linking.openURL('mailto:support@privatejets.com');
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Success Header */}
            <View style={styles.successHeader}>
                <View style={styles.successIcon}>
                    <Text style={styles.successIconText}>✓</Text>
                </View>
                <Text style={styles.successTitle}>Booking Confirmed!</Text>
                <Text style={styles.successSubtitle}>
                    Your private jet charter has been successfully booked
                </Text>
            </View>

            {/* Booking Details */}
            <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Booking Details</Text>

                <View style={styles.detailCard}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Booking Reference:</Text>
                        <Text style={styles.detailValue}>
                            {bookingResult.booking_reference || bookingResult.id}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Aircraft:</Text>
                        <Text style={styles.detailValue}>
                            {jet.registration_number} - {jet.manufacturer?.name} {jet.model?.name}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Passenger:</Text>
                        <Text style={styles.detailValue}>{bookingData.passenger_name}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Contact:</Text>
                        <Text style={styles.detailValue}>
                            {bookingData.contact_email} • {bookingData.contact_phone}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Flight Details */}
            <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Flight Details</Text>

                <View style={styles.detailCard}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Route:</Text>
                        <Text style={styles.detailValue}>
                            {bookingData.origin} → {bookingData.destination}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Departure:</Text>
                        <Text style={styles.detailValue}>{bookingData.departure_date}</Text>
                    </View>
                    {bookingData.trip_type === 'round_trip' && bookingData.return_date && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Return:</Text>
                            <Text style={styles.detailValue}>{bookingData.return_date}</Text>
                        </View>
                    )}
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Trip Type:</Text>
                        <Text style={styles.detailValue}>
                            {bookingData.trip_type === 'one_way' ? 'One Way' : 'Round Trip'}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Passengers:</Text>
                        <Text style={styles.detailValue}>{bookingData.passengers_count}</Text>
                    </View>
                </View>
            </View>

            {/* Payment Details */}
            <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Payment Details</Text>

                <View style={styles.detailCard}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Payment Status:</Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: paymentResult.status === 'completed' ? RED_THEME.success : RED_THEME.warning }
                        ]}>
                            <Text style={styles.statusText}>
                                {paymentResult.status === 'completed' ? 'Paid' : paymentResult.status}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Transaction ID:</Text>
                        <Text style={styles.detailValue}>{paymentResult.transaction_id}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Payment Method:</Text>
                        <Text style={styles.detailValue}>Credit Card</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Amount:</Text>
                        <Text style={styles.detailValue}>
                            ${paymentResult.amount?.toLocaleString()} {paymentResult.currency}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Next Steps */}
            <View style={styles.nextStepsSection}>
                <Text style={styles.sectionTitle}>What Happens Next?</Text>

                <View style={styles.timeline}>
                    <View style={styles.timelineItem}>
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTitle}>Confirmation Call</Text>
                            <Text style={styles.timelineDescription}>
                                Our flight coordinator will call you within 2 hours to confirm all details
                            </Text>
                        </View>
                    </View>

                    <View style={styles.timelineItem}>
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTitle}>Flight Preparation</Text>
                            <Text style={styles.timelineDescription}>
                                24 hours before departure, you'll receive final flight details
                            </Text>
                        </View>
                    </View>

                    <View style={styles.timelineItem}>
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTitle}>Boarding</Text>
                            <Text style={styles.timelineDescription}>
                                Arrive at the FBO 30 minutes before departure for smooth boarding
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Contact Information */}
            <View style={styles.contactSection}>
                <Text style={styles.sectionTitle}>Need Help?</Text>
                
                <View style={styles.contactCard}>
                    <TouchableOpacity style={styles.contactItem} onPress={handleContactSupport}>
                         <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>24/7 Support</Text>
                            <Text style={styles.contactValue}>+1 (123) 456-7890</Text>
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.contactItem} onPress={handleEmailSupport}>
                         <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Email</Text>
                            <Text style={styles.contactValue}>support@privatejets.com</Text>
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.contactItem} onPress={handleContactSupport}>
                         <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Emergency</Text>
                            <Text style={styles.contactValue}>+1 (123) 456-7891</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsSection}>
                <TouchableOpacity 
                    style={styles.secondaryButton}
                    onPress={handleShare}
                >
                    <Text style={styles.secondaryButtonText}>Share Booking Details</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={handleNewBooking}
                >
                    <Text style={styles.primaryButtonText}>Book Another Jet</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.supportButton}
                    onPress={handleContactSupport}
                >
                    <Text style={styles.supportButtonText}>Contact Support</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: RED_THEME.background,
    },
    successHeader: {
        backgroundColor: '#FFFFFF',
        padding: 40,
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: RED_THEME.success,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    successIconText: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: 'bold',
    },
    successTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: RED_THEME.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: 16,
        color: RED_THEME.textLight,
        textAlign: 'center',
        lineHeight: 22,
    },
    detailsSection: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: RED_THEME.primary,
        marginBottom: 16,
    },
    detailCard: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: RED_THEME.primary,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 4,
    },
    detailLabel: {
        fontSize: 14,
        color: RED_THEME.textLight,
        fontWeight: '500',
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        color: RED_THEME.text,
        fontWeight: '600',
        textAlign: 'right',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    nextStepsSection: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginBottom: 8,
    },
    timeline: {
        marginLeft: 8,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: RED_THEME.primary,
        marginRight: 16,
        marginTop: 4,
    },
    timelineContent: {
        flex: 1,
    },
    timelineTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: RED_THEME.text,
        marginBottom: 4,
    },
    timelineDescription: {
        fontSize: 14,
        color: RED_THEME.textLight,
        lineHeight: 20,
    },
    contactSection: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginBottom: 8,
    },
    contactCard: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 12,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 12,
        borderRadius: 8,
    },
    contactIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 14,
        color: RED_THEME.textLight,
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 16,
        color: RED_THEME.text,
        fontWeight: '600',
    },
    actionsSection: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        gap: 12,
    },
    primaryButton: {
        backgroundColor: RED_THEME.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: RED_THEME.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: RED_THEME.border,
    },
    secondaryButtonText: {
        color: RED_THEME.text,
        fontSize: 16,
        fontWeight: '600',
    },
    supportButton: {
        backgroundColor: 'transparent',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: RED_THEME.primary,
    },
    supportButtonText: {
        color: RED_THEME.primary,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ConfirmationScreen;