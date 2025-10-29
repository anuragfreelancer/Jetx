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
      navigation.navigate(ScreenNameEnum.OnboardingScreen);
    } else {
       navigation.navigate(ScreenNameEnum.OnboardingScreen);
     }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkLogout();
      getAmadeusToken()
    }, 2000);  
    return () => clearTimeout(timer);  
  }, [isFocus, navigation]);   


const getAmadeusToken = async () => {
  try {
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'PkwRgnX14XGEMimEBzXbJW0ht6RCpRnY',
        client_secret: 'EkF5onsjYbAAUzJR',
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
