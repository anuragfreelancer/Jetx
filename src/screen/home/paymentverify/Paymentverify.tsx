import React from 'react';
import { Text, Image, ScrollView, SafeAreaView, View, } from 'react-native';
import styles from './style';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
import CustomHeader from '../../../compoent/CustomHeader';
import CustomButton from '../../../compoent/CustomButton';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation } from '@react-navigation/native';

const PaymentVerify = () => {
    const navigation = useNavigation <any>()
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBarComponent />
            <CustomHeader imageSource={imageIndex.backorange} label='Booking Successful!' />
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Image source={imageIndex.verify} resizeMode='contain' style={styles.image} />
                <Text style={styles.title}>Booking Successful! 🎉</Text>
                <Text style={styles.description}>
                    Invoice & Itinerary Sent to Your Email
                </Text>
            </ScrollView>
            <View style={{
                justifyContent: 'flex-start',  
                marginHorizontal: 15,
            }}>
                <CustomButton
                    title={'View E-Receipt'}
                    onPress={() => navigation.navigate(ScreenNameEnum.HomeScreen)
                    }
                />
            </View>
            <Text style={{
                fontSize:17,
                color:"#FF3B30",
                marginTop:15,
                textAlign:"center",
                marginBottom:25,
                fontWeight:"600"
            }}>
            View My Bookings
                </Text>
        </SafeAreaView>
    );
};



export default PaymentVerify;