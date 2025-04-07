import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { GetProfile } from '../../../redux/Api/AuthApi';
const useBookPayment = () => {
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(false)
  // State for form inputs
  const [cardNumber, setCardNumber] = useState('');
  const [validThruMonth, setValidThruMonth] = useState('');
  const [validThruYear, setValidThruYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  // State for validation messages
  const [validationMessages, setValidationMessages] = useState({
    cardNumber: '',
    validThru: '',
    cvv: '',
    cardHolderName: '',
  });

  // Handle Submit Button Press
  const handleSubmit = () => {
    let valid = true;
    const newValidationMessages = {
      cardNumber: '',
      validThru: '',
      cvv: '',
      cardHolderName: '',
    };

    // Card Number Validation
    if (!cardNumber || cardNumber.length !== 16) {
      newValidationMessages.cardNumber = 'Card number should be 16 digits';
      valid = false;
    }

    // Valid Thru Validation
    if (!validThruMonth || !validThruYear) {
      newValidationMessages.validThru = 'Please select the expiry date';
      valid = false;
    }

    // CVV Validation
    if (!cvv || cvv.length !== 3) {
      newValidationMessages.cvv = 'CVV should be 3 digits';
      valid = false;
    }

    // Card Holder Name Validation
    if (!cardHolderName) {
      newValidationMessages.cardHolderName = 'Please enter the cardholder name';
      valid = false;
    }

    setValidationMessages(newValidationMessages);

    if (valid) {
      // Proceed to the next screen if validation passes
      // navigation.navigate(ScreenNameEnum.TabNavigator);
    }
  };

  return {
    isLoading,
    navigation,
    cardNumber, setCardNumber,
    validThruMonth, setValidThruMonth,
    cvv, setCvv ,
    cardHolderName, setCardHolderName ,
    validThruYear, setValidThruYear ,
    validationMessages, setValidationMessages,
    handleSubmit
   
  };
};

export default useBookPayment;
