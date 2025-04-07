import React, { useState } from 'react';
import { View, Text, TouchableOpacity,   Image, ScrollView, SafeAreaView } from 'react-native';
  import { useNavigation } from '@react-navigation/native';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
import CustomHeader from '../../../compoent/CustomHeader';
import CustomButton from '../../../compoent/CustomButton';
import styles from './style';
   
const PaymentMethods = () => {
    const [selectedPayment, setSelectedPayment] = useState(null);
const navigation = useNavigation()
    const paymentMethods = [
        { id: '1', label: 'PayPal', icon: imageIndex.paypal, img: imageIndex.cirlce },
         { id: '3', label: '•••• •••• •••• 8569', icon: imageIndex.master, img: imageIndex.cirlce },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} >
            <StatusBarComponent />
                 <CustomHeader imageSource={imageIndex.backorange} label={"Payment Methods"} />
             <ScrollView style={styles.container}>
                 <View style={{ marginTop: 30 }}>
                    {paymentMethods.map((method) => (
                        <TouchableOpacity key={method.id}
                            onPress={() => setSelectedPayment(method.id)}
                            style={styles.paymentOption}  >
                            <Image source={method.icon} style={styles.icon}
                                resizeMode='contain'
                            />
                            <Text style={styles.paymentText}>{method.label}</Text>
                            <Text style={{
                                color:"#0063FF",
                                fontSize:14,
                                fontWeight:"500",
                                right:10
                            }}>
                            Connected
                            </Text>

                        </TouchableOpacity>
                    ))}
                </View>
               
            </ScrollView>
            <View style={{
        justifyContent: 'flex-start',
        marginHorizontal: 15
      }}>
        <CustomButton
          title={'Add Card'}
          onPress={() => navigation.goBack()
          }
          buttonStyle ={{
            marginBottom:20
          }}
        />
      </View>
        </SafeAreaView>
    );
};


export default PaymentMethods;
