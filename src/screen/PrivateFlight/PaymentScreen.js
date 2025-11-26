import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { processPayment } from '../../Aviapages/api';
 
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

const PaymentScreen = ({ route, navigation }) => {
  const { bookingData, bookingResult, jet } = route.params;
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const calculateEstimatedPrice = () => {
    // Simple estimation based on passengers and trip type
    const basePrice = 5000;
    const passengerMultiplier = parseInt(bookingData.passengers_count) * 100;
    const tripMultiplier = bookingData.trip_type === 'round_trip' ? 1.8 : 1;
    return (basePrice + passengerMultiplier) * tripMultiplier;
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card') {
      if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.cardholderName) {
        Alert.alert('Error', 'Please fill all card details');
        return;
      }
      if (cardData.cardNumber.replace(/\s/g, '').length !== 16) {
        Alert.alert('Error', 'Please enter a valid 16-digit card number');
        return;
      }
      if (cardData.cvv.length !== 3) {
        Alert.alert('Error', 'Please enter a valid 3-digit CVV');
        return;
      }
    }

    setLoading(true);
    try {
      const paymentData = {
        amount: calculateEstimatedPrice(),
        currency: 'USD',
        method: paymentMethod,
        booking_id: bookingResult.id,
        description: `Private Jet Charter - ${jet.registration_number}`
      };

      const paymentResult = await processPayment(paymentData);
      
      if (paymentResult.success) {
        navigation.navigate('ConfirmationScreen', {
          bookingData,
          bookingResult,
          paymentResult,
          jet
        });
      } else {
        Alert.alert('Payment Failed', 'Please try again with different payment method');
      }
    } catch (error) {
      Alert.alert('Payment Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '').replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Booking Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Booking Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Aircraft:</Text>
          <Text style={styles.summaryValue}>
            {jet.registration_number} - {jet.manufacturer?.name} {jet.model?.name}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Route:</Text>
          <Text style={styles.summaryValue}>
            {bookingData.origin} → {bookingData.destination}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Passengers:</Text>
          <Text style={styles.summaryValue}>{bookingData.passengers_count}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Trip Type:</Text>
          <Text style={styles.summaryValue}>
            {bookingData.trip_type === 'one_way' ? 'One Way' : 'Round Trip'}
          </Text>
        </View>
      </View>

      {/* Price Breakdown */}
      <View style={styles.priceSection}>
        <Text style={styles.sectionTitle}>Price Breakdown</Text>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Base Charter Fee</Text>
          <Text style={styles.priceValue}>$5,000</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Passenger Surcharge ({bookingData.passengers_count} passengers)</Text>
          <Text style={styles.priceValue}>${parseInt(bookingData.passengers_count) * 100}</Text>
        </View>
        {bookingData.trip_type === 'round_trip' && (
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Round Trip Multiplier</Text>
            <Text style={styles.priceValue}>+80%</Text>
          </View>
        )}
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Taxes & Fees</Text>
          <Text style={styles.priceValue}>$500</Text>
        </View>
        <View style={[styles.priceItem, styles.totalItem]}>
          <Text style={styles.totalLabel}>Estimated Total</Text>
          <Text style={styles.totalValue}>${calculateEstimatedPrice().toLocaleString()}</Text>
        </View>
        <Text style={styles.priceNote}>
          * Final price may vary based on actual flight duration and additional services
        </Text>
      </View>

      {/* Payment Method Selection */}
      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentMethods}>
          <TouchableOpacity 
            style={[
              styles.paymentMethod,
              paymentMethod === 'card' && styles.paymentMethodSelected
            ]}
            onPress={() => setPaymentMethod('card')}
          >
             <Text style={styles.paymentMethodText}>Credit/Debit Card</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.paymentMethod,
              paymentMethod === 'bank' && styles.paymentMethodSelected
            ]}
            onPress={() => setPaymentMethod('bank')}
          >
            {/* <Image source={require('../assets/bank-transfer.png')} style={styles.paymentIcon} /> */}
            <Text style={styles.paymentMethodText}>Bank Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Details Form */}
      {paymentMethod === 'card' && (
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Card Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.textInput}
              value={cardData.cardholderName}
              onChangeText={(text) => setCardData(prev => ({...prev, cardholderName: text}))}
              placeholder="John Doe"
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.textInput}
              value={cardData.cardNumber}
              onChangeText={(text) => setCardData(prev => ({...prev, cardNumber: formatCardNumber(text)}))}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.cardRow}>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.textInput}
                value={cardData.expiryDate}
                onChangeText={(text) => setCardData(prev => ({...prev, expiryDate: formatExpiryDate(text)}))}
                placeholder="MM/YY"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.textInput}
                value={cardData.cvv}
                onChangeText={(text) => setCardData(prev => ({...prev, cvv: text.replace(/\D/g, '').substring(0, 3)}))}
                placeholder="123"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.cardLogos}>
            {/* <Image source={require('../assets/visa.png')} style={styles.cardLogo} />
            <Image source={require('../assets/mastercard.png')} style={styles.cardLogo} />
            <Image source={require('../assets/amex.png')} style={styles.cardLogo} /> */}
          </View>
        </View>
      )}

      {/* Bank Transfer Info */}
      {paymentMethod === 'bank' && (
        <View style={styles.bankSection}>
          <Text style={styles.sectionTitle}>Bank Transfer Details</Text>
          <View style={styles.bankInfo}>
            <View style={styles.bankItem}>
              <Text style={styles.bankLabel}>Bank Name:</Text>
              <Text style={styles.bankValue}>Global Private Jet Bank</Text>
            </View>
            <View style={styles.bankItem}>
              <Text style={styles.bankLabel}>Account Number:</Text>
              <Text style={styles.bankValue}>1234 5678 9012 3456</Text>
            </View>
            <View style={styles.bankItem}>
              <Text style={styles.bankLabel}>Routing Number:</Text>
              <Text style={styles.bankValue}>021000021</Text>
            </View>
            <View style={styles.bankItem}>
              <Text style={styles.bankLabel}>SWIFT/BIC:</Text>
              <Text style={styles.bankValue}>GPJBUS33</Text>
            </View>
            <View style={styles.bankItem}>
              <Text style={styles.bankLabel}>Amount:</Text>
              <Text style={styles.bankValue}>${calculateEstimatedPrice().toLocaleString()} USD</Text>
            </View>
            <View style={styles.bankItem}>
              <Text style={styles.bankLabel}>Reference:</Text>
              <Text style={styles.bankValue}>JET-{jet.registration_number}-{bookingResult.id}</Text>
            </View>
          </View>
          <Text style={styles.bankNote}>
            Please include the reference number in your transfer. Booking will be confirmed once payment is received.
          </Text>
        </View>
      )}

      {/* Terms and Conditions */}
      <View style={styles.termsSection}>
        <Text style={styles.termsTitle}>Terms & Conditions</Text>
        <Text style={styles.termsText}>
          • 50% refund if cancelled 7 days before departure{'\n'}
          • No refund for cancellations within 48 hours{'\n'}
          • Flight times subject to weather and ATC clearance{'\n'}
          • Additional charges may apply for changes{'\n'}
          • Security screening required for all passengers
        </Text>
        <TouchableOpacity style={styles.termsCheckbox}>
          <View style={styles.checkbox}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <Text style={styles.termsAgree}>
            I agree to the terms and conditions and privacy policy
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payment Button */}
      <View style={styles.paymentButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.paymentButton,
            loading && styles.paymentButtonDisabled
          ]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.paymentButtonText}>
                Pay ${calculateEstimatedPrice().toLocaleString()}
              </Text>
              <Text style={styles.paymentButtonSubtext}>
                Secure Payment • Encrypted
              </Text>
            </>
          )}
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
  summarySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  priceSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  paymentSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  cardSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  bankSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  termsSection: {
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
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: RED_THEME.textLight,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: RED_THEME.text,
    fontWeight: '600',
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: RED_THEME.textLight,
  },
  priceValue: {
    fontSize: 14,
    color: RED_THEME.text,
    fontWeight: '500',
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: RED_THEME.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: RED_THEME.primary,
  },
  priceNote: {
    fontSize: 12,
    color: RED_THEME.textLight,
    fontStyle: 'italic',
    marginTop: 8,
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentMethod: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodSelected: {
    backgroundColor: '#FEF2F2',
    borderColor: RED_THEME.primary,
  },
  paymentIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
    color: RED_THEME.text,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: RED_THEME.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: RED_THEME.text,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  cardLogos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  cardLogo: {
    width: 40,
    height: 25,
    resizeMode: 'contain',
  },
  bankInfo: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  bankItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bankLabel: {
    fontSize: 14,
    color: RED_THEME.textLight,
    fontWeight: '500',
  },
  bankValue: {
    fontSize: 14,
    color: RED_THEME.text,
    fontWeight: '600',
  },
  bankNote: {
    fontSize: 12,
    color: RED_THEME.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: RED_THEME.text,
    marginBottom: 12,
  },
  termsText: {
    fontSize: 14,
    color: RED_THEME.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: RED_THEME.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: RED_THEME.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsAgree: {
    fontSize: 14,
    color: RED_THEME.text,
    flex: 1,
  },
  paymentButtonContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  paymentButton: {
    backgroundColor: RED_THEME.success,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: RED_THEME.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  paymentButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
  },
});

export default PaymentScreen;