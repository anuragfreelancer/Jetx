import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../../compoent/CustomHeader';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomButton from '../../../compoent/CustomButton';
import imageIndex from '../../../assets/imageIndex';
import useAddProfilePicture from './useAddProfilePicture';
import ImagePickerModal from '../../../compoent/ImagePickerModal';

export default function AddProfilePicture() {
  const {
    imagePrfile,
    isLoading,
    navigation,
    takePhotoFromCamera,
    pickImageFromGallery,
    handleSubmit ,
    isModalVisible,
    setIsModalVisible
  
  } = useAddProfilePicture()


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
            }}>Add a profile picture</Text>
            <Text style={{
              fontWeight: '400',
              fontSize: 16,
              lineHeight: 24,
              marginTop: 7,
              color: '#9DB2BF',
            }}>
              Add a profile picture so your friends know it's {"\n"} you. Everyone will be able to see your picture.
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 25 }}>
          <Image
                                          source={imagePrfile ? { uri: imagePrfile?.path } : imageIndex.Ellipse}

             style={{ height: 170, width: 170,borderRadius:170 }}
           />
        </View>
      </ScrollView>
      <View style={{
        justifyContent: 'flex-start', marginBottom: 20
        ,
        marginHorizontal: 15
      }}>
        <CustomButton
          title={'Add picture'}
          // onPress={() =>  setIsModalVisible(true)}
          onPress={() => navigation.navigate(ScreenNameEnum.AddLocation)}
          buttonStyle={{ width: "100%", marginTop: 28 }}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate(ScreenNameEnum.AddLocation)}

      >
        <Text style={{
          textAlign: "center",
          color: "#000000",
          fontSize: 17,
          fontWeight: "600",
          marginBottom: 15
        }}>Skip</Text>
      </TouchableOpacity>
      <ImagePickerModal
        modalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        pickImageFromGallery={pickImageFromGallery}
        takePhotoFromCamera={takePhotoFromCamera}
      />
    </SafeAreaView>
  );
}



