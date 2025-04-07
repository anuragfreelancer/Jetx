import { useEffect} from 'react';
 import { useIsFocused, useNavigation } from '@react-navigation/native';
 import { useSelector } from 'react-redux';
 import ScreenNameEnum from '../../../routes/screenName.enum';
 
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
    }, 2000);  
    return () => clearTimeout(timer);  
  }, [isFocus, navigation]);   

  return {
    
  };
};

export default useSplash;
