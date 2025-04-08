import {
  View,
  Text,
  Image,
   StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React  from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TextInputField from '../../../utils/TextInputField';
 import StatusBarCompoent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
 import ResponsiveSize from '../../../utils/ResponsiveSize';
import { wp } from '../../../utils/Constant';
import CustomButton from '../../../compoent/CustomButton';
 import CustomHeader from '../../../compoent/CustomHeader';
import useCreateNewPassword from './useCreateNewPassword';
import LoadingModal from '../../../utils/Loader';
import ScreenNameEnum from '../../../routes/screenName.enum';

export default function CreateNewPassword() {
  const { credentials,
    errors,
    isLoading,
    handleChange,
    handleResetPass,
    navigation, } = useCreateNewPassword();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarCompoent />
      <View style={{ marginTop: 18 }}>
        <CustomHeader imageSource={imageIndex.backorange} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} >
        {isLoading ? <LoadingModal /> : null}

        <View
          style={{
            backgroundColor: '#FFF',
            marginHorizontal: 15,
            flex: 1,
            marginTop: hp(2)
          }}>
       
          <View style={{ marginTop: 5 }}>
            <Text style={{
                  fontWeight: '700',
                  fontSize: 24,
                  lineHeight: 36,
                  color: 'rgba(0, 0, 0, 1)',
             }}>Create New Password</Text>
            <Text style={{
               fontWeight: '400',
               fontSize: 16,
                color: '#9DB2BF',
                marginTop: 4,
                lineHeight:20
             }}>
            Your new password must be different from{"\n"}previous used passwords.
            </Text>
          </View>
          <View style={{ marginTop: ResponsiveSize.marginTop(18), paddingVertical: hp(2), }}>
            <TextInputField
              lable={"Password"}
              text={credentials.password}
              placeholder={'Password'}
              onChangeText={(value:string) => handleChange('password', value)} // Handles email input dynamically

              firstLogo={true}
              showEye={true}
              img={imageIndex.lock}
            />
            {/* {errors.password ? <Text style={{ color: 'red', fontSize: 12,marginTop:8 }}>{errors.password}</Text> : null} */}
            <View style={{ marginTop: 12 }}>
              <TextInputField
                lable={"Confirm Password"}
                text={credentials.confirmPassword}
                onChangeText={(value:string) => handleChange('confirmPassword', value)} // Handles email input dynamically
                placeholder={'Confirm Password'}
                firstLogo={true}
                showEye={true}
                img={imageIndex.lock}
              />
            </View>
            {/* {errors.confirmPassword ? <Text style={{ color: 'red', fontSize: 12 ,marginTop:10}}>{errors.confirmPassword}</Text> : null} */}
          </View>
        </View>

      </ScrollView>
      <View style={{
        justifyContent: 'flex-start', marginBottom: 11,
        marginHorizontal: 15
      }}>
        <CustomButton
          title={'Save'}
          // onPress={handleResetPass
          // }
          onPress={()=>navigation.navigate(ScreenNameEnum.LoginScreen)}

          buttonStyle={{ width: "100%", marginTop: 28 }}
        />

      </View>

    </SafeAreaView>
  );
}

const Styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: 'rgba(255, 77, 76, 1)',
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


