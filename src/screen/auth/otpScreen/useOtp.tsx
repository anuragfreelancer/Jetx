import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBlurOnFulfill, useClearByFocusCell } from
    'react-native-confirmation-code-field';
import { ForgotPassUserApi, OtpUserApi } from '../../../redux/Api/AuthApi';

const useOtp = () => {
    const route:any = useRoute();
    const { email } = route?.params || ""; // Provide a fallback if route.params is undefined
    const navigation = useNavigation();
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: 4 });
    const [isLoading, setisLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const handleChangeText = (text: string) => {
        setValue(text);

        if (text.length < 4) {
            setErrorMessage('Please enter a 4-digit code.');
        } else {
            setErrorMessage('');
        }
    };
  

    const handleVerifyOTP = async () => {
        if (value.length !== 4) {
            setErrorMessage('Please enter a valid 4-digit OTP.');
            return;
        }
        setErrorMessage('');
        setisLoading(true);
        try {
            const params = {
                email: email,
                otp: value,
                navigation: navigation,
            };
            const response = await OtpUserApi(params, setisLoading);
            if (response) {
                setValue("")
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    return {
        props, getCellOnLayoutHandler,
        isLoading, setisLoading,
        errorMessage, setErrorMessage,
        ref,
        handleChangeText,
        handleVerifyOTP,
        navigation,
        value, setValue,
        email,
   
        timer
    };
};

export default useOtp;
