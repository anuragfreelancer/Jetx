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


// import React from 'react';
// import { Alert, View } from 'react-native';
// import FlightBookingForm from '../../../compoent/FlightBookingForm';
// import { useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// const BookingScreen = () => {
//   const route = useRoute()
//   const flight = route?.params?.flight
//   const handleFormSubmit = async(formData) => {
//     console.log('Form submitted:', formData);
//     // Submit to your API
//     // Example output matches your JSON structure

// console.log('==============================================')

// console.log(flight)




// const myHeaders = new Headers();

//  const tokenData = await AsyncStorage.getItem('AMADEUS_TOKEN');
//       if (!tokenData) {
//         throw new Error('No authentication token found');
//       }

//       const { access_token } = JSON.parse(tokenData);
// myHeaders.append("Authorization", `Bearer ${access_token}`);
// myHeaders.append("Content-Type", "application/json");

// const raw = JSON.stringify({
//   "data": {
//     "type": "flight-order",
//     "flightOffers": [
//   flight
      
//     ],
//     "travelers": [
//     formData?.traveler
//     ]
//   }
// });

// const requestOptions = {
//   method: "POST",
//   headers: myHeaders,
//   body: raw,
//   redirect: "follow"
// };

// fetch("https://test.api.amadeus.com/v1/booking/flight-orders", requestOptions)
//   .then((response) => response.text())
//   .then((result) =>{
    
//     Alert.alert("Success", "Your booking created Successfully")
//     console.log(result, 'success=========================')})
//   .catch((error) => console.error(error));






    
//   };

//   // Optional: Pre-fill with initial data
//   const initialData = {
//     traveler: {
//       id: "1",
//       dateOfBirth: "",
//       name: {
//         firstName: "",
//         lastName: ""
//       },
//       gender: "MALE",
//       contact: {
//         emailAddress: "",
//         phones: [
//           {
//             deviceType: "MOBILE",
//             countryCallingCode: "",
//             number: ""
//           }
//         ]
//       },
//       documents: [
//         {
//           documentType: "",
//           birthPlace: "Madrid",
//           issuanceLocation: "",
//           issuanceDate: " ",
//           number: "",
//           expiryDate: "",
//           issuanceCountry: "ES",
//           validityCountry: "ES",
//           nationality: "ES",
//           holder: true
//         }
//       ]
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <FlightBookingForm 
//         onSubmit={handleFormSubmit}
//         initialData={initialData} // Optional
//       />
//     </View>
//   );
// };

// export default BookingScreen;
import React from 'react';
import { Alert, View } from 'react-native';
import FlightBookingForm from '../../../compoent/FlightBookingForm';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingScreen = () => {
  const route = useRoute();
  const flight = route?.params?.flight;

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // If it's already in correct format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Try to parse and format the date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ''; // Return empty if invalid date
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Helper to validate and format phone country code
  const formatCountryCallingCode = (code) => {
    if (!code) return '';
    // Remove any non-digit characters and ensure it's just numbers
    return code.toString().replace(/\D/g, '');
  };

  const handleFormSubmit = async (formData) => {
    console.log('Form submitted:', formData);

    try {
      const tokenData = await AsyncStorage.getItem('AMADEUS_TOKEN');
      if (!tokenData) {
        throw new Error('No authentication token found');
      }

      const { access_token } = JSON.parse(tokenData);

      // Format the traveler data according to API requirements
      const formattedTraveler = {
        ...formData.traveler,
        dateOfBirth: formatDate(formData.traveler.dateOfBirth),
        contact: {
          ...formData.traveler.contact,
          phones: formData.traveler.contact.phones.map(phone => ({
            ...phone,
            countryCallingCode: formatCountryCallingCode(phone.countryCallingCode)
          }))
        },
        documents: formData.traveler.documents.map(document => ({
          ...document,
          issuanceDate: formatDate(document.issuanceDate),
          expiryDate: formatDate(document.expiryDate),
          issuanceLocation: document.issuanceLocation?.trim() || ''
        }))
      };

      // Remove empty strings and validate required fields
      const cleanTraveler = JSON.parse(JSON.stringify(formattedTraveler, (key, value) => {
        if (value === "" || value === null || value === undefined) {
          return undefined;
        }
        return value;
      }));

      const requestPayload = {
        "data": {
          "type": "flight-order",
          "flightOffers": [flight],
          "travelers": [cleanTraveler]
        }
      };

      console.log('Final API Payload:', JSON.stringify(requestPayload, null, 2));

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${access_token}`);
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(requestPayload),
        redirect: "follow"
      };

      const response = await fetch("https://test.api.amadeus.com/v1/booking/flight-orders", requestOptions);
      
      if (!response.ok) {
        const errorResult = await response.json();
        console.error('API Error:', errorResult);
        
        // Show specific error messages to user
        if (errorResult.errors && errorResult.errors.length > 0) {
          const errorMessages = errorResult.errors.map(err => err.detail).join('\n');
          Alert.alert("Booking Failed", errorMessages);
        } else {
          Alert.alert("Booking Failed", "Please check your information and try again.");
        }
        return;
      }

      const result = await response.json();
      console.log('Booking Success:', result);
      Alert.alert("Success", "Your booking was created successfully!");
      
    } catch (error) {
      console.error('Booking Error:', error);
      Alert.alert("Error", "Failed to create booking. Please try again.");
    }
  };

  // Updated initial data with proper examples
  const initialData = {
    traveler: {
      id: "1",
      dateOfBirth: "1990-01-01", // Example format
      name: {
        firstName: "",
        lastName: ""
      },
      gender: "MALE",
      contact: {
        emailAddress: "",
        phones: [
          {
            deviceType: "MOBILE",
            countryCallingCode: "1", // Example: US code
            number: ""
          }
        ]
      },
      documents: [
        {
          documentType: "PASSPORT",
          birthPlace: "Madrid",
          issuanceLocation: "Madrid", // Should be a string, not empty
          issuanceDate: "2020-01-01", // Example format
          number: "",
          expiryDate: "2030-01-01", // Example format
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
        initialData={initialData}
      />
    </View>
  );
};

export default BookingScreen;