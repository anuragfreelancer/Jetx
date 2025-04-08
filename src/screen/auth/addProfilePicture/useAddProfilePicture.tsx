import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import ImagePicker from "react-native-image-crop-picker";
 const useAddProfilePicture = () => {
  const [imagePrfile, setImagePrfile] = useState();
  const [isLoading, setisLoading] = useState()
  const dispatch = useDispatch();
  const navigation = useNavigation(); 
   const isLogin = useSelector((state) => state?.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
     
   const pickImageFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
    })
      .then((image:any) => {
        setImagePrfile(image)
        setIsModalVisible(false);
      })
      .catch((error) => console.log(error));
  };

  const takePhotoFromCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: false,
      });
      setImagePrfile(image)
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

   const handleSubmit = async () => {
     
    try {
        const params = {
         
            images: imagePrfile,
           
        };
        //  const response = await UpdateProfile_Api(params, setisLoading, navigation);
         
    } catch (error) {
        console.error("Error updating profile:", error);
    }
};

 
  return {
    imagePrfile,
    isLoading,
    navigation,
    takePhotoFromCamera,
    pickImageFromGallery,
    handleSubmit ,
    isModalVisible,
    setIsModalVisible
   };
};

export default useAddProfilePicture;
