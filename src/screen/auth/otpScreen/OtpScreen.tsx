import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { CodeField, Cursor, } from
  'react-native-confirmation-code-field';
import Loading from '../../../utils/Loader';
import imageIndex from '../../../assets/imageIndex';
import CustomButton from '../../../compoent/CustomButton';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import useOtp from './useOtp';
import ScreenNameEnum from '../../../routes/screenName.enum';

export default function OtpScreen() {
  const { props, getCellOnLayoutHandler,
    isLoading,
    errorMessage,
    ref,
    handleChangeText, navigation,
    value,
    ResendOtp,
    timer,
    handleVerifyOTP, email } = useOtp()

  return (
    <View style={{
      backgroundColor: '#FFF',
      flex: 1,
    }}>
      {isLoading ? <Loading /> : null}
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBarComponent />
        <View style={{ marginTop: 18 }}>
          <CustomHeader imageSource={imageIndex.backorange} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{
          marginHorizontal: 15
        }}>

          <View style={{ marginTop: 30 }}>
            <Text style={styles.txtHeading}>Check your mail</Text>
            <Text style={styles.txtsubHeading}>
              Please put the 4 digits sent to you
            </Text>
          </View>
          <View
            style={{ height: hp(10),  marginTop: 50, justifyContent: "flex-start" }} >
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={handleChangeText}
              cellCount={4}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <View style={{   backgroundColor: '#E9E9E9', borderRadius: 20, }}>
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />
            {/* {errorMessage ? (
              <Text style={{ color: 'red', marginTop: 18 }}>{errorMessage}</Text>
            ) : null} */}
          </View>
          <View style={{ marginTop:12, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              style={{
                height: 273,
                width: 412,
              }}
              resizeMode='contain'
              source={imageIndex.otpBag}
            />
          </View>

        </ScrollView>

        <View style={{
          justifyContent: 'flex-start', marginBottom: 20,
          marginHorizontal: 15
        }}>
          <CustomButton
            title={'Submit'}
            onPress={() => navigation.navigate(ScreenNameEnum.CreatePassword)}
          // onPress={handleVerifyOTP}

          />
        </View>


      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  btn: {
    alignSelf: 'center',
    backgroundColor: '#E8442E',
    height: 55,

    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(23),

    width: wp(90),
  },
  txtHeading: {
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 36,
    color: 'rgba(0, 0, 0, 1)'
  },
  textEr: { color: 'red', fontSize: 12 },

  txtsubHeading: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(157, 178, 191, 1)',
  },

  codeFieldRoot: { marginTop: 20, },
  cell: {
    width: 45,
    height: 45,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 1.5,
    borderColor: '#E9E9E9',
    textAlign: 'center',
    color: '#000',
    borderRadius: 10,
    backgroundColor: '#E9E9E9',

  },
  focusCell: {
    borderColor: 'rgba(237, 126, 98, 1)',

    backgroundColor: 'rgba(247, 248, 248, 1)',



  },
});



