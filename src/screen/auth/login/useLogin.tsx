import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SinupUserApi } from '../../../redux/Api/AuthApi';
import { RootStackParamList } from './LoginTypes';
 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const useLogin = () => {
  const [errors, setErrors] = useState<any>({});
  const navigation = useNavigation<RootStackParamList>();
  const [isLoading, setisLoading] = useState(false)
interface Credentials {
  email: string;
  password: string;
}

const [credentials, setCredentials] = useState<Credentials>({
  email: 'Aman@gmail.com',
  password: '123456',
});

const handleChange = (field: keyof Credentials, value: string) => {
  setCredentials((prev) => ({ ...prev, [field]: value }));
  setErrors((prev) => ({ ...prev, [field]: '' }));
};
  const validateFields = () => {
    const { email, password } = credentials;
    let validationErrors: any = {};
    if (!email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      validationErrors.email = 'Enter a valid email address.';
    }
  
    if (!password.trim()) {
      validationErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters.';
    }
     
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateFields()) return; // Stop execution if validation fails
    try {
      const params = {
        email: credentials?.email,
        password: credentials?.password,
         navigation: navigation,
       };
       const response = await SinupUserApi(params, setisLoading);
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };
  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleLogin,
    navigation, 
    
  };
};

export default useLogin;
