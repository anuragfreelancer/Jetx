import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TextInputField from '../../../utils/TextInputField';
import StatusBarCompoent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
 import ResponsiveSize from '../../../utils/ResponsiveSize';
import { wp } from '../../../utils/Constant';
import CustomButton from '../../../compoent/CustomButton';
import ScreenNameEnum from '../../../routes/screenName.enum';
import LoadingModal from '../../../utils/Loader';
import useLogin from './useLogin';
import { styles } from '../loginStyle';
 
export default function SignUp() {
  const {
    credentials,
    errors,
    isLoading,
     navigation, 
     handleChange
  } = useLogin()
  interface Option {
    team_name: string;
    id: string;
  }

 
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarCompoent />
      {isLoading ? <LoadingModal /> : null}

      <ScrollView showsVerticalScrollIndicator={false} >
        <View
          style={{
            backgroundColor: '#FFF',
            padding: 15,
            flex: 1,
            marginTop: hp(5)
          }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>

            <Image
              source={imageIndex.appLogo}
              style={{ height: 57, width: 176 }} resizeMode='contain'
            />
          </View>
          <View style={{ marginTop: 22, alignItems: "center" }}>
            <Text style={styles.txtHeading}>
              Welcome Back to <Text style={{ color: '#FF3B30' }}>Jetx</Text>
            </Text>

          </View>
          <View style={{ marginTop: ResponsiveSize.marginTop(25), paddingVertical: hp(2), }}>
           <TextInputField
  placeholder={'Email Address'}
  text={credentials.email}
  firstLogo={true}
  onChangeText={(value:any) => handleChange('email', value)}
 />
            {errors.email ? <Text style={{ color: 'red', fontSize: 12, marginTop: 10 }}>{errors.email}</Text> : null}

            <TextInputField
              lable={"Password"}
              placeholder="Password"
              firstLogo={true}
               text={credentials.password}
               showEye={true}
              img={imageIndex.lock}
                onChangeText={(value:any) => handleChange('password', value)}

            />


          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenNameEnum.PasswordReset)}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: "500",
              color: "black",
              textAlign: "center",
              marginTop: 15,
              textDecorationLine: 'underline', // Underline added,
              lineHeight:18,

            }}>Forgot your password?</Text>
          </TouchableOpacity>

          <CustomButton
            title={'Sign In'}
            onPress={() => navigation.navigate(ScreenNameEnum.HomeScreen)}

            buttonStyle={{ width: "100%", marginTop: 30 }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 40,
            alignSelf: 'center',
            justifyContent: 'flex-end', // Change this to flex-end 
          }}>
          <Text style={{ fontSize: 16, lineHeight: 22, color: '#909090',fontWeight:"500" }}>
            Don’t have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenNameEnum.SignUpScreen)}

          >
            <Text style={Styles.text}> Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ marginTop: 40, fontSize: 16, lineHeight: 22, color: 'black', textAlign: "center", fontWeight: "500" }}>
          OR
        </Text>
        <View style={{ alignItems: 'center', marginTop:20}}>

          <Image
            source={imageIndex.google}
            style={{ height: 80, width: 200 }} resizeMode='contain'
          />
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const Styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: 'black',
    bottom: 2
  },
  btn: {
    alignSelf: 'center',
    backgroundColor: '#E8442E',
    height: 55,

    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    width: wp(90),
  },
});


