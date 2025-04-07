import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SinupUserApi } from '../../../redux/Api/AuthApi';
 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const useSignup = () => {
  const [errors, setErrors] = useState<any>({});
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(false)
  const [dropOpen, setDropOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [countyModal, setCountyModal] = useState(false);

  const [selectedOption, setSelectedOption] = useState();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    mobile: '',
  });
  const handleChange = (field: string, value: string) => {
    setCredentials((prev: any) => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: '' })); // Clear error on input change
  };
  const validateFields = () => {
    const { email, password, mobile } = credentials;
    let validationErrors: any = {};
    if (!email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      validationErrors.email = 'Enter a valid email address.';
    }
    if (!mobile!.trim()) {
      validationErrors.mobile = 'Mobile is required.';
    }
    if (!password.trim()) {
      validationErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters.';
    }
    if (!selectedOption) {
      validationErrors.selectedOption = 'Please select an option.';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateFields()) return; // Stop execution if validation fails
    try {
      const params = {
        email: credentials?.email,
        password: credentials?.password,
        mobile: credentials?.mobile,
        navigation: navigation,
        type:selectedOption?.team_name
      };
       const response = await SinupUserApi(params, setisLoading);
    } catch (error) {
      console.error("Signup Error:", error);
    } 
  };
  const handleCountryCodeSelect = (item) => {
    setSelectedCountryCode(`${item.code}`);
    setCountyModal(false);
  };
  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleSignup,
    navigation, 
    selectedOption, setSelectedOption ,
    dropOpen, setDropOpen ,
    selectedCountryCode, setSelectedCountryCode ,
    countyModal, setCountyModal ,
    handleCountryCodeSelect
  };
};

export default useSignup;
