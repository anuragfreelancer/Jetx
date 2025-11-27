import { useEffect} from 'react';
 import { useIsFocused, useNavigation } from '@react-navigation/native';
 import { useSelector } from 'react-redux';
 import ScreenNameEnum from '../../../routes/screenName.enum';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
 const useSplash = () => {
  const navigation = useNavigation<any>();
  const isLogin = useSelector((state: any) => state.auth);
  const isFocus = useIsFocused();
  const checkLogout = () => {
    if (isLogin?.isLogin) {
      navigation.navigate(ScreenNameEnum.HomeScreen);
    } else {
       navigation.navigate(ScreenNameEnum.LoginScreen);
     }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkLogout();
      getAmadeusToken()
      verifyApiToken()
    }, 2000);  
    return () => clearTimeout(timer);  
  }, [isFocus, navigation]);   

const AVIA_PAGE_BASE_URL = 'https://api.aviapages.com';
const API_TOKEN = 'zgkRrapzpZv3xA811rWtckMIjY6WCkmCpcmn';

// API Token Verification Function
const verifyApiToken = async () => {
  try {
     
    const response = await fetch(`${AVIA_PAGE_BASE_URL}/api/v1/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `To ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
      console.log('✅ API Token is valid:', response);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Token is valid:', data);
      return true;
    } else {
      console.log('❌ API Token verification failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return false;
  }
};
const getAmadeusToken = async () => {
  try {
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        // client_id: 'PkwRgnX14XGEMimEBzXbJW0ht6RCpRnY',
        // client_secret: 'EkF5onsjYbAAUzJR',
        client_id: 'mmGclGTrso8FZZiO3pkGqpg8XyubxOQZ',
        client_secret: 'HKjrHoyyGVFLNvMX',
      }).toString(),
    });

    const result = await response.json();
    console.log('Amadeus Token Response:', result);

    if (response.ok) {
      // ✅ Save token to AsyncStorage
      await AsyncStorage.setItem('AMADEUS_TOKEN', JSON.stringify(result));
      return result;
    } else {
      console.warn('Failed to get token:', result);
    }
  } catch (error) {
    console.error('Error fetching Amadeus token:', error);
  }
};




  // const getAmadeusToken = async () => {
  //   try {
  //     const myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  //     const urlencoded = new URLSearchParams();
  //     urlencoded.append("grant_type", "client_credentials");
  //     urlencoded.append("client_id", "PkwRgnX14XGEMimEBzXbJW0ht6RCpRnY");
  //     urlencoded.append("client_secret", "EkF5onsjYbAAUzJR");

  //     const requestOptions = {
  //       method: "POST",
  //       headers: myHeaders,
  //       body: urlencoded,
  //       redirect: "follow",
  //     };

  //     const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", requestOptions);
  //     const result = await response.json();

  //     if (result.access_token) {
  //       console.log("✅ Token fetched successfully:", result.access_token);
  //        await AsyncStorage.setItem("AMADEUS_TOKEN", JSON.stringify(result));
  //       console.log("✅ Token stored successfully!");
  //     } else {
  //       console.error("❌ Failed to get token:", result);
  //     }

  //   } catch (error) {
  //     console.error("❌ Error fetching Amadeus token:", error);
  //   }
  // };


  return {
    
  };
};

export default useSplash;
