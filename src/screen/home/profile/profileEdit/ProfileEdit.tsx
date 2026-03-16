import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import TextInputField from '../../../../utils/TextInputField';
import imageIndex from '../../../../assets/imageIndex';
import CustomHeader from '../../../../compoent/CustomHeader';
import StatusBarComponent from '../../../../compoent/StatusBarCompoent';
import CustomButton from '../../../../compoent/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { GetProfile, UpdateProfile_Api } from '../../../../redux/Api/AuthApi';
import LoadingModal from '../../../../utils/Loader';

const ProfileEdit = () => {
  const navigation = useNavigation();
  const isLogin = useSelector((state: any) => state.auth);
  const userId = isLogin?.userData?.id;
  const userGet = useSelector((state: any) => state.feature);
  const userData = userGet?.userGetData;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    country: '',
    phone: ''
  });
  
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleGetProfile = useCallback(async () => {
    if (userId) {
      await GetProfile(userId, dispatch);
    } else {
      console.log("User ID not available");
    }
  }, [userId, dispatch]);

  // Load user data on component mount - FIXED VERSION
  useEffect(() => {
    // Priority: userGet data -> isLogin data -> empty strings
    const userName = userData?.user_name || isLogin?.userData?.name || '';
    const userEmail = isLogin?.userData?.email || '';
    const userCity = userData?.city || isLogin?.userData?.city || '';
    const userCountry = userData?.country || isLogin?.userData?.country || '';
    const userPhone = userData?.mobile || '';

    setFormData({
      name: userName,
      email: userEmail,
      city: userCity,
      country: userCountry,
      phone: userPhone
    });

    // Set profile image if available
    if (userData?.profile_image) {
      setSelectedImage(userData.profile_image);
    } else if (isLogin?.userData?.profile_image) {
      setSelectedImage(isLogin.userData.profile_image);
    }
  }, [isLogin, userData]);

  // Fetch profile data when component mounts
  useEffect(() => {
    if (userId) {
      handleGetProfile();
    }
  }, [userId, handleGetProfile]);

  // Image picker function
  const handleImagePicker = () => {
    Alert.alert(
      'Select Profile Picture',
      'Choose an option',
      [
        // {
        //   text: 'Take Photo',
        //   onPress: () => takePhoto(),
        // },
        {
          text: 'Choose from Gallery',
          onPress: () => chooseFromGallery(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
      compressImageQuality: 0.8,
    })
      .then(image => {
        setSelectedImage({
          uri: image.path,
          width: image.width,
          height: image.height,
          mime: image.mime,
        });
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.log('ImagePicker Error: ', error);
          Alert.alert('Error', 'Failed to take photo');
        }
      });
  };

  const chooseFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
      compressImageQuality: 0.8,
      mediaType: 'photo',
    })
      .then(image => {
        setSelectedImage({
          uri: image.path,
          width: image.width,
          height: image.height,
          mime: image.mime,
        });
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.log('ImagePicker Error: ', error);
          Alert.alert('Error', 'Failed to select image from gallery');
        }
      });
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleUpdateProfile = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    const params = {
      userId: userId,
      name: formData.name,
      email: formData.email,
      mobile: formData?.phone || '',
      images: selectedImage,
      navigation: navigation,
    };

    try {
      const response = await UpdateProfile_Api(params, setLoading);
      if (response && response?.status == '1') {
        handleGetProfile();
        // Success handled in API function
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBarComponent />
      <CustomHeader imageSource={imageIndex.backorange} label="Edit Profile" />
 <LoadingModal visible={loading}/>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center' }}>
          {/* Profile Image Section */}
          <TouchableOpacity onPress={handleImagePicker}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  selectedImage?.uri 
                    ? { uri: selectedImage.uri }
                    : userData?.image 
                    ? { uri: userData.image }
                    : isLogin?.userData?.image 
                    ? { uri: isLogin.userData.image }
                    : imageIndex.Ellipse
                     // Add a default avatar to your imageIndex
                }
                style={styles.avatar}
                defaultSource={imageIndex.Ellipse} // Fallback while loading
              />
              <View style={styles.editIconContainer}>
                <Image
                  source={imageIndex.edit}
                  style={styles.editIcon}
                />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Tap to change photo</Text>

          {/* Form Fields */}
          <View style={{ marginHorizontal: 15, marginTop: 30, width: '92%' }}>
            <TextInputField
              imgStyle={{ tintColor: "black" }}
              placeholderTextColor={"black"}
              placeholder={'Full Name'}
              text={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              firstLogo={true}
              img={imageIndex.Fideuser}
            />
            
           
            
            <TextInputField
              imgStyle={{ tintColor: "black" }}
              placeholderTextColor={"black"}
              placeholder={'Phone'}
              text={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              firstLogo={true}
              img={imageIndex.phone}
            />
            
            <TextInputField
              imgStyle={{ tintColor: "black" }}
              placeholderTextColor={"black"}
              placeholder={'Country'}
              text={formData.country}
              onChangeText={(text) => handleInputChange('country', text)}
              firstLogo={true}
              img={imageIndex.country}
            />

            <TextInputField
              imgStyle={{ tintColor: "black" }}
              placeholderTextColor={"black"}
              placeholder={'City'}
              text={formData.city}
              onChangeText={(text) => handleInputChange('city', text)}
              firstLogo={true}
              img={imageIndex.city} // Make sure you have city icon
            />
          </View>
        </View>
      </ScrollView>
       <View style={styles.buttonContainer}>
        <CustomButton
          title={'Update Profile'}
          onPress={handleUpdateProfile}
          disabled={loading}
         buttonStyle={[
                {
                  backgroundColor:"black"
                }
                ]}       />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'gray',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'gray',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    width: 16,
    height: 16,
    tintColor: 'white',
  },
  changePhotoText: {
    marginTop: 10,
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
});

export default ProfileEdit;