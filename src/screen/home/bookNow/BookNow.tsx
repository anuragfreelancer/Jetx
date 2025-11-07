// import React from 'react';
// import { View, Text,   Image,   ImageBackground, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
// import imageIndex from '../../../assets/imageIndex';
// import StatusBarComponent from '../../../compoent/StatusBarCompoent';
// import CustomHeader from '../../../compoent/CustomHeader';
// import { useNavigation } from '@react-navigation/native';
// import ScreenNameEnum from '../../../routes/screenName.enum';
// import TextInputField from '../../../utils/TextInputField';
// import CustomButton from '../../../compoent/CustomButton';
// import styles from './style';
 


// const BookNow = () => {
//   const navigation = useNavigation<any>()
//   return (
//     <SafeAreaView style={{
//       flex: 1,
//       backgroundColor: "white"
//     }}>
//       <StatusBarComponent />
//       <CustomHeader imageSource={imageIndex.backorange} label={"Payment"} />
//       <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
//         <View style={styles.container}>
//           <TouchableOpacity style={styles.card}
//             // onPress={() => navigation.navigate(ScreenNameEnum.JetDetails)}
//           >
//             <ImageBackground source={imageIndex.fliteBag} style={styles.image} >
//             </ImageBackground>
//             <View style={styles.info}>
//               <Text style={styles.title}>Gulfstream G650</Text>
//               <View style={[styles.row, {
//                 marginTop: 8
//               }]}>
//                 <Image source={imageIndex.seat} style={{
//                   height: 16,
//                   width: 16
//                 }}
//                   resizeMode='contain'
//                 />
//                 <Text style={styles.text}>18</Text>
//                 <Image source={imageIndex.speed} style={{
//                   height: 16,
//                   width: 16,
//                   marginLeft: 5
//                 }}
//                   resizeMode='contain'
//                 />
//                 <Text style={styles.text}>610 mph</Text>
//               </View>
//               <View style={{
//                 flexDirection: 'row',
//                 marginTop: 4,
//                 justifyContent: "space-between"
//               }}>
//                 <View style={{
//                   flexDirection: "row",
//                 }}>

//                   <Image source={imageIndex.distance} style={{
//                     height: 16,
//                     width: 16
//                   }}
//                     resizeMode='contain' />
//                   <Text style={styles.text}>7,000 miles</Text>

//                 </View>
//                 <Text style={styles.price}>$15,000/hr</Text>
//               </View>
//             </View>
//           </TouchableOpacity>
//           <Text style={{color:"balck",fontSize:20,fontWeight:"700",marginTop:20}}>Passenger Information</Text>
//           <View style={{marginTop:15}}>
//           <TextInputField
//             placeholder={'Full Name '}
//             firstLogo={true}
//             img={imageIndex.Fideuser}
//           />
//           <TextInputField
//             placeholder={'Email '}
//             firstLogo={true}
//             img={imageIndex.emai}
//           />
//           <TextInputField
//             placeholder={'Phone'}
//             firstLogo={true}
//             showEye={false}
//             img={imageIndex.phone}
//             type="decimal-pad"
//           />
//         </View>
//         </View>
//       </ScrollView>
//       <CustomButton
//         title={'Next'}
//         onPress={() => navigation.navigate(ScreenNameEnum.BookPayment)}
//         buttonStyle={{ marginHorizontal: 17, marginTop: 20, marginBottom: 12 }}
//       />
//     </SafeAreaView>
//   );
// };



// export default BookNow;


import React from 'react';
import { Alert, View } from 'react-native';
import FlightBookingForm from '../../../compoent/FlightBookingForm';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BookingScreen = () => {
  const route = useRoute()
  const flight = route?.params?.flight
  const handleFormSubmit = async(formData) => {
    console.log('Form submitted:', formData);
    // Submit to your API
    // Example output matches your JSON structure

console.log('==============================================')

console.log(flight)




const myHeaders = new Headers();

 const tokenData = await AsyncStorage.getItem('AMADEUS_TOKEN');
      if (!tokenData) {
        throw new Error('No authentication token found');
      }

      const { access_token } = JSON.parse(tokenData);
myHeaders.append("Authorization", `Bearer ${access_token}`);
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "data": {
    "type": "flight-order",
    "flightOffers": [
  flight
      
    ],
    "travelers": [
    formData?.traveler
    ]
  }
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://test.api.amadeus.com/v1/booking/flight-orders", requestOptions)
  .then((response) => response.text())
  .then((result) =>{
    
    Alert.alert("Success", "Your booking created Successfully")
    console.log(result, 'success=========================')})
  .catch((error) => console.error(error));






    
  };

  // Optional: Pre-fill with initial data
  const initialData = {
    traveler: {
      id: "1",
      dateOfBirth: "1982-01-16",
      name: {
        firstName: "JORGE",
        lastName: "GONZALES"
      },
      gender: "MALE",
      contact: {
        emailAddress: "jorge.gonzales@example.com",
        phones: [
          {
            deviceType: "MOBILE",
            countryCallingCode: "34",
            number: "480080076"
          }
        ]
      },
      documents: [
        {
          documentType: "PASSPORT",
          birthPlace: "Madrid",
          issuanceLocation: "Madrid",
          issuanceDate: "2025-04-14",
          number: "00000000",
          expiryDate: "2030-04-14",
          issuanceCountry: "ES",
          validityCountry: "ES",
          nationality: "ES",
          holder: true
        }
      ]
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlightBookingForm 
        onSubmit={handleFormSubmit}
        initialData={initialData} // Optional
      />
    </View>
  );
};

export default BookingScreen;