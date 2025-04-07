import {
    View,
    Text,
    Image,
    ScrollView,
    SafeAreaView,
  } from 'react-native';
  import React, { useState } from 'react';
  import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
   import ScreenNameEnum from '../../../routes/screenName.enum';
  import { useNavigation } from '@react-navigation/native';
  import CustomHeader from '../../../compoent/CustomHeader';
  import StatusBarComponent from '../../../compoent/StatusBarCompoent';
  import CustomButton from '../../../compoent/CustomButton';
   import imageIndex from '../../../assets/imageIndex';
  
  export default function AddLocation() {
    const navigation = useNavigation()
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBarComponent />
        <ScrollView showsVerticalScrollIndicator={false} >
          <View style={{ marginTop: 18 }}>
            <CustomHeader imageSource={imageIndex.backorange} />
          </View>
          <View
            style={{
              backgroundColor: '#FFF',
              padding: 15,
              marginTop: hp(2)
            }}>
            <View style={{ marginTop: 7 }}>
              <Text style={{
                fontWeight: '700',
                fontSize: 24,
                lineHeight: 36,
                color: 'rgba(0, 0, 0, 1)',
                textAlign:"center"
              }}>What is Your Location?</Text>
              <Text style={{
                   fontWeight: '400',
                   fontSize: 16,
                   lineHeight: 24,
                   marginTop:12,
                   color: '#9DB2BF',
                   textAlign:"center"
              }}>
                Weyourbocation to slow evalu restaurant & products
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center',marginTop:40 }}>
            <Image
              source={imageIndex.Locatio}
              style={{ height: 240, width: 240 }}
              resizeMode='contain'
            />
          </View>  
        </ScrollView>
        <View style={{
          justifyContent: 'flex-start', marginBottom: 20
          ,
          marginHorizontal: 15
        }}>
          <CustomButton
            title={'Allow Location Access'}
            onPress={() => navigation.navigate(ScreenNameEnum.ChangeLocation)}
            buttonStyle={{ width: "100%", marginTop: 28 }}
          />
        </View>
        <Text style={{
          textAlign:"center",
          color:"#FF3B30",
          fontSize:17,
          fontWeight:"600",
          marginBottom:15
        }}>Inter Location Manually</Text>
      </SafeAreaView>
    );
  }
  
  
  
  