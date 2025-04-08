import React from 'react';
import { View, Text,   Image,   ImageBackground, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../../routes/screenName.enum';
import TextInputField from '../../../utils/TextInputField';
import CustomButton from '../../../compoent/CustomButton';
import styles from './style';
 


const BookNow = () => {
  const navigation = useNavigation<any>()
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "white"
    }}>
      <StatusBarComponent />
      <CustomHeader imageSource={imageIndex.backorange} label={"Payment"} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.card}
            // onPress={() => navigation.navigate(ScreenNameEnum.JetDetails)}
          >
            <ImageBackground source={imageIndex.fliteBag} style={styles.image} >
            </ImageBackground>
            <View style={styles.info}>
              <Text style={styles.title}>Gulfstream G650</Text>
              <View style={[styles.row, {
                marginTop: 8
              }]}>
                <Image source={imageIndex.seat} style={{
                  height: 16,
                  width: 16
                }}
                  resizeMode='contain'
                />
                <Text style={styles.text}>18</Text>
                <Image source={imageIndex.speed} style={{
                  height: 16,
                  width: 16,
                  marginLeft: 5
                }}
                  resizeMode='contain'
                />
                <Text style={styles.text}>610 mph</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                marginTop: 4,
                justifyContent: "space-between"
              }}>
                <View style={{
                  flexDirection: "row",
                }}>

                  <Image source={imageIndex.distance} style={{
                    height: 16,
                    width: 16
                  }}
                    resizeMode='contain' />
                  <Text style={styles.text}>7,000 miles</Text>

                </View>
                <Text style={styles.price}>$15,000/hr</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={{color:"balck",fontSize:20,fontWeight:"700",marginTop:20}}>Passenger Information</Text>
          <View style={{marginTop:15}}>
          <TextInputField
            placeholder={'Full Name '}
            firstLogo={true}
            img={imageIndex.Fideuser}
          />
          <TextInputField
            placeholder={'Email '}
            firstLogo={true}
            img={imageIndex.emai}
          />
          <TextInputField
            placeholder={'Phone'}
            firstLogo={true}
            showEye={false}
            img={imageIndex.phone}
            type="decimal-pad"
          />
        </View>
        </View>
      </ScrollView>
      <CustomButton
        title={'Next'}
        onPress={() => navigation.navigate(ScreenNameEnum.BookPayment)}
        buttonStyle={{ marginHorizontal: 17, marginTop: 20, marginBottom: 12 }}
      />
    </SafeAreaView>
  );
};



export default BookNow;
