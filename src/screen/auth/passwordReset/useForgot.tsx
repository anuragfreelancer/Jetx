import { useState } from 'react';
 import { useNavigation } from '@react-navigation/native';
import { ForgotPassUserApi } from '../../../redux/Api/AuthApi';
 
 const useForgot = () => {
  const [errors, setErrors] = useState <any>({});
  // test11@gmail.com
   const navigation = useNavigation();
   const [isLoading, setisLoading] = useState(false)
  const [credentials, setCredentials] = useState({ email: '',mob:"" });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleChange = (field:string, value:string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    setErrors((prev:any) => ({ ...prev, [field]: '' }));
    if (field === 'email') {
      if (!value.trim()) {
        setErrors((prev:any) => ({ ...prev, email: 'Email is required.' }));
      } else if (!emailRegex.test(value)) {
        setErrors((prev:any) => ({ ...prev, email: 'Enter a valid email address.' }));
      }
    }
    // if (field === 'mob') {
    //   if (!value.trim()) {
    //     setErrors(prev => ({ ...prev, mob: 'Email is required.' }));
    //   } 
    // }
  };
  const handleForgot =async () => {
    const { email } = credentials;
    let validationErrors:any = {}; 
      //  if (!mob.trim()) {
      //   validationErrors.mob = 'Mobile No. is required.';
      // }
    if (!email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      validationErrors.email = 'Enter a valid email address.';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
     try {
      const params = { email:email,navigation:navigation };
       const response = await ForgotPassUserApi(params, setisLoading);
    } catch (error) {
     }
   };


  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleForgot,
    navigation,
  };
};

export default useForgot;
