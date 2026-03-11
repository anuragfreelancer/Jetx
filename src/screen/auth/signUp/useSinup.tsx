import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SinupUserApi } from '../../../redux/Api/AuthApi';
 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10,15}$/;

interface Credentials {
  email: string;
  password: string;
  mobile: string;
  fullName?: string;
  city?: string;
  country?: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  mobile?: string;
  fullName?: string;
  selectedOption?: string;
}

const useSignup = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [countyModal, setCountyModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: '',
    mobile: '',
    fullName: '',
    city: '',
    country: '',
  });

  const handleChange = (field: keyof Credentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateFields = (): boolean => {
    const { email, password, mobile, fullName } = credentials;
    const validationErrors: ValidationErrors = {};

    // Full Name validation
    if (!fullName?.trim()) {
      validationErrors.fullName = 'Full name is required.';
    }

    // Email validation
    if (!email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      validationErrors.email = 'Enter a valid email address.';
    }

    // Mobile validation
    if (!mobile.trim()) {
      validationErrors.mobile = 'Mobile number is required.';
    }  
    // Password validation
    if (!password.trim()) {
      validationErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters.';
    }

    // Option selection validation
    // if (!selectedOption) {
    //   validationErrors.selectedOption = 'Please select an option.';
    // }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateFields()) return;

    try {
      const params = {
        ...credentials,
        mobile:   credentials.mobile,
        user_name: credentials.fullName,
        navigation: navigation,
        county : selectedCountryCode
      };
       
     const response = await SinupUserApi(params, setIsLoading);
     console.log("response",response)
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  const handleCountryCodeSelect = (item: any) => {
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
    selectedOption,
    setSelectedOption,
    dropOpen,
    setDropOpen,
    selectedCountryCode,
    setSelectedCountryCode,
    countyModal,
    setCountyModal,
    handleCountryCodeSelect,
  };
};

export default useSignup;